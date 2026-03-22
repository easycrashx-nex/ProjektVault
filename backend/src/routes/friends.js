const crypto = require("node:crypto");
const { sendJson, parseJsonBody, getRequestUrl } = require("../lib/http");
const { getBearerToken, sanitizeUsername, canonicalizeUsername } = require("../lib/security");
const {
  updateDatabase,
  getAccountBySessionToken,
  findAccountByUsername,
  sanitizeAccountForClient,
} = require("../lib/store");
const { sanitizeSave, summarizeSave } = require("../lib/game-state");

function createEmptySocialState() {
  return {
    friends: [],
    incoming: [],
    outgoing: [],
    blocked: [],
    tradeOffersIncoming: [],
    tradeOffersOutgoing: [],
    duelChallengesIncoming: [],
    duelChallengesOutgoing: [],
  };
}

function cloneJson(value, fallback = null) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return fallback;
  }
}

function getSocialState(account) {
  return cloneJson(account?.save?.friends, createEmptySocialState()) || createEmptySocialState();
}

function setSocialState(account, nextSocialState) {
  account.save = sanitizeSave({
    ...account.save,
    friends: nextSocialState,
  }, sanitizeUsername);
}

function removeUsername(list, username) {
  const canonical = canonicalizeUsername(username);
  return list.filter((entry) => canonicalizeUsername(entry) !== canonical);
}

function addUniqueUsername(list, username) {
  const safeUsername = sanitizeUsername(username);
  if (!safeUsername) {
    return [...list];
  }
  const next = removeUsername(list, safeUsername);
  next.push(safeUsername);
  return next;
}

function removeOfferById(list, offerId) {
  return list.filter((entry) => entry.id !== offerId);
}

function createPublicProfile(account, database) {
  const stats = summarizeSave(account?.save);
  const activeDeck = (account?.save?.decks || []).find((deck) => deck.id === account?.save?.activeDeckId) || null;
  return {
    username: account.username,
    createdAt: account.createdAt,
    online: Object.values(database.sessions || {}).some((session) => canonicalizeUsername(session.username) === canonicalizeUsername(account.username)),
    titleId: account.save?.profileDisplay?.titleId || "vault-initiate",
    avatarId: account.save?.profileDisplay?.avatarId || "vault-core",
    frameId: account.save?.profileDisplay?.frameId || "bronze-sigil",
    stats: {
      gold: stats.gold,
      cards: stats.totalCards,
      uniqueCards: stats.uniqueCards,
      boosters: stats.totalBoosters,
    },
    activeDeckName: activeDeck?.name || "",
  };
}

function collectProfileMap(account, database) {
  const social = getSocialState(account);
  const usernames = new Set([
    ...social.friends,
    ...social.incoming,
    ...social.outgoing,
    ...social.blocked,
    ...social.tradeOffersIncoming.map((entry) => entry.from),
    ...social.tradeOffersOutgoing.map((entry) => entry.to),
    ...social.duelChallengesIncoming.map((entry) => entry.from),
    ...social.duelChallengesOutgoing.map((entry) => entry.to),
  ]);

  const profiles = {};
  usernames.forEach((username) => {
    const target = findAccountByUsername(database, username);
    if (target) {
      profiles[target.username] = createPublicProfile(target, database);
    }
  });
  return profiles;
}

function sendOverview(res, account, database, extra = {}) {
  sendJson(res, 200, {
    ok: true,
    account: sanitizeAccountForClient(account, { includeSave: true }),
    friends: getSocialState(account),
    profiles: collectProfileMap(account, database),
    ...extra,
  });
}

function resolveSessionAccount(database, token) {
  return getAccountBySessionToken(database, token);
}

function isFriendshipBlocked(sourceState, targetState, sourceUsername, targetUsername) {
  return sourceState.blocked.some((entry) => canonicalizeUsername(entry) === canonicalizeUsername(targetUsername))
    || targetState.blocked.some((entry) => canonicalizeUsername(entry) === canonicalizeUsername(sourceUsername));
}

function getRelationshipState(currentState, username) {
  const canonical = canonicalizeUsername(username);
  if (currentState.blocked.some((entry) => canonicalizeUsername(entry) === canonical)) {
    return "blocked";
  }
  if (currentState.friends.some((entry) => canonicalizeUsername(entry) === canonical)) {
    return "friend";
  }
  if (currentState.incoming.some((entry) => canonicalizeUsername(entry) === canonical)) {
    return "incoming";
  }
  if (currentState.outgoing.some((entry) => canonicalizeUsername(entry) === canonical)) {
    return "outgoing";
  }
  return "none";
}

function getReservedCardCounts(account) {
  const reserved = {};
  const collect = (cards) => {
    if (!Array.isArray(cards)) {
      return;
    }
    cards.forEach((cardId) => {
      const safeCardId = String(cardId || "").trim();
      if (!safeCardId) {
        return;
      }
      reserved[safeCardId] = (reserved[safeCardId] || 0) + 1;
    });
  };
  (account?.save?.decks || []).forEach((deck) => collect(deck?.cards));
  collect(account?.save?.hardcoreDeck?.cards);
  return reserved;
}

function getTradeableCopies(account, cardId) {
  const owned = Number(account?.save?.collection?.[cardId] || 0);
  const reserved = getReservedCardCounts(account)[cardId] || 0;
  return Math.max(0, owned - reserved);
}

function buildTradeableCopyMap(account) {
  const reserved = getReservedCardCounts(account);
  const result = {};
  Object.entries(account?.save?.collection || {}).forEach(([cardId, count]) => {
    result[cardId] = Math.max(0, Number(count || 0) - Number(reserved[cardId] || 0));
  });
  return result;
}

function ensureProgressionState(account) {
  if (!account.save) {
    account.save = {};
  }
  if (!account.save.progression || typeof account.save.progression !== "object") {
    account.save.progression = {
      rankPoints: 0,
      achievementsClaimed: [],
      quests: { dailyClaimed: [], weeklyClaimed: [] },
      pity: {},
      stats: {
        arenaWins: 0,
        arenaLosses: 0,
        friendWins: 0,
        friendLosses: 0,
        boostersOpened: 0,
        cardsOpened: 0,
        goldEarned: 0,
        tradesCompleted: 0,
        marketDeals: 0,
        hardcoreWins: 0,
        legendaryPlusPulled: 0,
      },
      tradeHistory: [],
      duelHistory: [],
    };
  }
  if (!account.save.progression.stats || typeof account.save.progression.stats !== "object") {
    account.save.progression.stats = {};
  }
  if (!Array.isArray(account.save.progression.tradeHistory)) {
    account.save.progression.tradeHistory = [];
  }
  return account.save.progression;
}

function appendTradeHistory(account, note, value = 0, status = "trade") {
  const progression = ensureProgressionState(account);
  progression.stats.tradesCompleted = Number(progression.stats.tradesCompleted || 0) + 1;
  progression.tradeHistory = [
    {
      id: `trade-log-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
      note: String(note || "").trim().slice(0, 160),
      value: Number(value || 0),
      status,
    },
    ...progression.tradeHistory,
  ].slice(0, 24);
}

function buildTradeInventory(account) {
  const tradeable = buildTradeableCopyMap(account);
  return Object.entries(account?.save?.collection || {})
    .map(([cardId]) => ({ cardId, count: Number(tradeable[cardId] || 0) }))
    .filter((entry) => entry.cardId && entry.count > 0)
    .sort((left, right) => right.count - left.count || left.cardId.localeCompare(right.cardId))
    .slice(0, 240);
}

function normalizeDeckSnapshot(deckCards) {
  if (!Array.isArray(deckCards)) {
    return [];
  }
  return deckCards
    .map((entry) => String(entry || "").trim().slice(0, 120))
    .filter(Boolean)
    .slice(0, 20);
}

function registerFriendsRoutes(router) {
  router.get("/api/friends/overview", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    let account = null;
    let snapshot = null;
    await updateDatabase((database) => {
      account = resolveSessionAccount(database, token);
      snapshot = database;
      return database;
    });

    if (!account) {
      sendJson(res, 401, { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." });
      return;
    }

    sendOverview(res, account, snapshot);
  });

  router.get("/api/friends/search", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const query = getRequestUrl(req).searchParams.get("query") || "";
    const normalizedQuery = canonicalizeUsername(query);

    let account = null;
    let results = [];
    await updateDatabase((database) => {
      account = resolveSessionAccount(database, token);
      if (!account || normalizedQuery.length < 2) {
        results = [];
        return database;
      }

      const social = getSocialState(account);
      results = Object.values(database.accounts || {})
        .filter((entry) => canonicalizeUsername(entry.username) !== canonicalizeUsername(account.username))
        .filter((entry) => !(Array.isArray(entry.roles) && entry.roles.includes("admin")))
        .filter((entry) => canonicalizeUsername(entry.username).includes(normalizedQuery))
        .slice(0, 14)
        .map((entry) => ({
          ...createPublicProfile(entry, database),
          relationship: getRelationshipState(social, entry.username),
        }));
      return database;
    });

    if (!account) {
      sendJson(res, 401, { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." });
      return;
    }

    sendJson(res, 200, { ok: true, results });
  });

  router.post("/api/friends/request", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const body = await parseJsonBody(req);
    const targetUsername = sanitizeUsername(body?.username);

    let account = null;
    let snapshot = null;
    let status = 200;
    let error = null;
    await updateDatabase((database) => {
      account = resolveSessionAccount(database, token);
      snapshot = database;
      if (!account) {
        status = 401;
        error = { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." };
        return database;
      }

      const target = findAccountByUsername(database, targetUsername);
      if (!target || target.username === account.username) {
        status = 404;
        error = { ok: false, error: "missing_target", message: "Dieses Spielkonto wurde nicht gefunden." };
        return database;
      }

      const social = getSocialState(account);
      const targetSocial = getSocialState(target);
      if (isFriendshipBlocked(social, targetSocial, account.username, target.username)) {
        status = 403;
        error = { ok: false, error: "blocked", message: "Zwischen diesen Konten sind aktuell keine Freundschaftsanfragen möglich." };
        return database;
      }

      const relationship = getRelationshipState(social, target.username);
      if (relationship === "friend") {
        status = 409;
        error = { ok: false, error: "already_friends", message: "Ihr seid bereits befreundet." };
        return database;
      }
      if (relationship === "incoming") {
        status = 409;
        error = { ok: false, error: "request_pending_incoming", message: "Von diesem Konto liegt bereits eine Anfrage vor." };
        return database;
      }
      if (relationship === "outgoing") {
        status = 409;
        error = { ok: false, error: "request_pending_outgoing", message: "Diese Anfrage wurde bereits gesendet." };
        return database;
      }

      social.outgoing = addUniqueUsername(social.outgoing, target.username);
      targetSocial.incoming = addUniqueUsername(targetSocial.incoming, account.username);
      setSocialState(account, social);
      setSocialState(target, targetSocial);
      return database;
    });

    if (error) {
      sendJson(res, status, error);
      return;
    }

    sendOverview(res, account, snapshot);
  });

  router.post("/api/friends/request/respond", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const body = await parseJsonBody(req);
    const targetUsername = sanitizeUsername(body?.username);
    const action = String(body?.action || "");

    let account = null;
    let snapshot = null;
    let status = 200;
    let error = null;
    await updateDatabase((database) => {
      account = resolveSessionAccount(database, token);
      snapshot = database;
      if (!account) {
        status = 401;
        error = { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." };
        return database;
      }

      const target = findAccountByUsername(database, targetUsername);
      if (!target) {
        status = 404;
        error = { ok: false, error: "missing_target", message: "Dieses Spielkonto wurde nicht gefunden." };
        return database;
      }

      const social = getSocialState(account);
      const targetSocial = getSocialState(target);
      const hasIncoming = social.incoming.some((entry) => canonicalizeUsername(entry) === canonicalizeUsername(target.username));
      const hasOutgoing = social.outgoing.some((entry) => canonicalizeUsername(entry) === canonicalizeUsername(target.username));

      if (action === "accept" && hasIncoming) {
        social.incoming = removeUsername(social.incoming, target.username);
        social.friends = addUniqueUsername(social.friends, target.username);
        targetSocial.outgoing = removeUsername(targetSocial.outgoing, account.username);
        targetSocial.friends = addUniqueUsername(targetSocial.friends, account.username);
      } else if (action === "decline" && hasIncoming) {
        social.incoming = removeUsername(social.incoming, target.username);
        targetSocial.outgoing = removeUsername(targetSocial.outgoing, account.username);
      } else if (action === "cancel" && hasOutgoing) {
        social.outgoing = removeUsername(social.outgoing, target.username);
        targetSocial.incoming = removeUsername(targetSocial.incoming, account.username);
      } else {
        status = 404;
        error = { ok: false, error: "missing_request", message: "Diese Freundschaftsanfrage wurde nicht gefunden." };
        return database;
      }

      setSocialState(account, social);
      setSocialState(target, targetSocial);
      return database;
    });

    if (error) {
      sendJson(res, status, error);
      return;
    }

    sendOverview(res, account, snapshot);
  });

  router.post("/api/friends/remove", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const body = await parseJsonBody(req);
    const targetUsername = sanitizeUsername(body?.username);

    let account = null;
    let snapshot = null;
    let error = null;
    let status = 200;
    await updateDatabase((database) => {
      account = resolveSessionAccount(database, token);
      snapshot = database;
      if (!account) {
        status = 401;
        error = { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." };
        return database;
      }

      const target = findAccountByUsername(database, targetUsername);
      if (!target) {
        status = 404;
        error = { ok: false, error: "missing_target", message: "Dieses Spielkonto wurde nicht gefunden." };
        return database;
      }

      const social = getSocialState(account);
      const targetSocial = getSocialState(target);
      social.friends = removeUsername(social.friends, target.username);
      social.incoming = removeUsername(social.incoming, target.username);
      social.outgoing = removeUsername(social.outgoing, target.username);
      targetSocial.friends = removeUsername(targetSocial.friends, account.username);
      targetSocial.incoming = removeUsername(targetSocial.incoming, account.username);
      targetSocial.outgoing = removeUsername(targetSocial.outgoing, account.username);
      setSocialState(account, social);
      setSocialState(target, targetSocial);
      return database;
    });

    if (error) {
      sendJson(res, status, error);
      return;
    }

    sendOverview(res, account, snapshot);
  });

  router.post("/api/friends/block", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const body = await parseJsonBody(req);
    const targetUsername = sanitizeUsername(body?.username);

    let account = null;
    let snapshot = null;
    let error = null;
    let status = 200;
    await updateDatabase((database) => {
      account = resolveSessionAccount(database, token);
      snapshot = database;
      if (!account) {
        status = 401;
        error = { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." };
        return database;
      }

      const target = findAccountByUsername(database, targetUsername);
      if (!target || target.username === account.username) {
        status = 404;
        error = { ok: false, error: "missing_target", message: "Dieses Spielkonto wurde nicht gefunden." };
        return database;
      }

      const social = getSocialState(account);
      const targetSocial = getSocialState(target);
      social.blocked = addUniqueUsername(social.blocked, target.username);
      social.friends = removeUsername(social.friends, target.username);
      social.incoming = removeUsername(social.incoming, target.username);
      social.outgoing = removeUsername(social.outgoing, target.username);
      social.tradeOffersIncoming = social.tradeOffersIncoming.filter((entry) => canonicalizeUsername(entry.from) !== canonicalizeUsername(target.username));
      social.tradeOffersOutgoing = social.tradeOffersOutgoing.filter((entry) => canonicalizeUsername(entry.to) !== canonicalizeUsername(target.username));
      social.duelChallengesIncoming = social.duelChallengesIncoming.filter((entry) => canonicalizeUsername(entry.from) !== canonicalizeUsername(target.username));
      social.duelChallengesOutgoing = social.duelChallengesOutgoing.filter((entry) => canonicalizeUsername(entry.to) !== canonicalizeUsername(target.username));

      targetSocial.friends = removeUsername(targetSocial.friends, account.username);
      targetSocial.incoming = removeUsername(targetSocial.incoming, account.username);
      targetSocial.outgoing = removeUsername(targetSocial.outgoing, account.username);
      targetSocial.tradeOffersIncoming = targetSocial.tradeOffersIncoming.filter((entry) => canonicalizeUsername(entry.from) !== canonicalizeUsername(account.username));
      targetSocial.tradeOffersOutgoing = targetSocial.tradeOffersOutgoing.filter((entry) => canonicalizeUsername(entry.to) !== canonicalizeUsername(account.username));
      targetSocial.duelChallengesIncoming = targetSocial.duelChallengesIncoming.filter((entry) => canonicalizeUsername(entry.from) !== canonicalizeUsername(account.username));
      targetSocial.duelChallengesOutgoing = targetSocial.duelChallengesOutgoing.filter((entry) => canonicalizeUsername(entry.to) !== canonicalizeUsername(account.username));

      setSocialState(account, social);
      setSocialState(target, targetSocial);
      return database;
    });

    if (error) {
      sendJson(res, status, error);
      return;
    }

    sendOverview(res, account, snapshot);
  });

  router.post("/api/friends/unblock", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const body = await parseJsonBody(req);
    const targetUsername = sanitizeUsername(body?.username);

    let account = null;
    let snapshot = null;
    await updateDatabase((database) => {
      account = resolveSessionAccount(database, token);
      snapshot = database;
      if (!account) {
        return database;
      }

      const social = getSocialState(account);
      social.blocked = removeUsername(social.blocked, targetUsername);
      setSocialState(account, social);
      return database;
    });

    if (!account) {
      sendJson(res, 401, { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." });
      return;
    }

    sendOverview(res, account, snapshot);
  });

  router.get("/api/friends/trade/options", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const targetUsername = sanitizeUsername(getRequestUrl(req).searchParams.get("username"));

    let account = null;
    let payload = null;
    await updateDatabase((database) => {
      account = resolveSessionAccount(database, token);
      if (!account) {
        return database;
      }

      const target = findAccountByUsername(database, targetUsername);
      const social = getSocialState(account);
      if (!target || !social.friends.some((entry) => canonicalizeUsername(entry) === canonicalizeUsername(target.username))) {
        return database;
      }

      payload = {
        target: createPublicProfile(target, database),
        yourCards: buildTradeInventory(account),
        theirCards: buildTradeInventory(target),
      };
      return database;
    });

    if (!account) {
      sendJson(res, 401, { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." });
      return;
    }

    if (!payload) {
      sendJson(res, 404, { ok: false, error: "missing_trade_target", message: "Für diesen Kontakt konnten keine Handelsdaten geladen werden." });
      return;
    }

    sendJson(res, 200, { ok: true, ...payload });
  });

  router.post("/api/friends/trade/create", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const body = await parseJsonBody(req);
    const targetUsername = sanitizeUsername(body?.username);
    const offeredCardId = String(body?.offeredCardId || "").trim().slice(0, 120);
    const requestedCardId = String(body?.requestedCardId || "").trim().slice(0, 120);
    const note = String(body?.note || "").trim().slice(0, 140);

    let account = null;
    let snapshot = null;
    let error = null;
    let status = 200;
    await updateDatabase((database) => {
      account = resolveSessionAccount(database, token);
      snapshot = database;
      if (!account) {
        status = 401;
        error = { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." };
        return database;
      }

      const target = findAccountByUsername(database, targetUsername);
      if (!target || target.username === account.username) {
        status = 404;
        error = { ok: false, error: "missing_target", message: "Dieses Spielkonto wurde nicht gefunden." };
        return database;
      }

      const social = getSocialState(account);
      const targetSocial = getSocialState(target);
      if (!social.friends.some((entry) => canonicalizeUsername(entry) === canonicalizeUsername(target.username))) {
        status = 403;
        error = { ok: false, error: "not_friend", message: "Handel ist nur mit bestätigten Freunden möglich." };
        return database;
      }
      if (!offeredCardId || !requestedCardId || offeredCardId === requestedCardId) {
        status = 400;
        error = { ok: false, error: "invalid_trade_cards", message: "Bitte wähle zwei unterschiedliche Karten für das Angebot." };
        return database;
      }
      if (getTradeableCopies(account, offeredCardId) < 1) {
        status = 400;
        error = { ok: false, error: "missing_offered_card", message: "Diese angebotene Karte besitzt du aktuell nicht mehr." };
        return database;
      }
      if (getTradeableCopies(target, requestedCardId) < 1) {
        status = 400;
        error = { ok: false, error: "missing_requested_card", message: "Die gewünschte Karte ist beim Zielkonto aktuell nicht verfügbar." };
        return database;
      }

      const offer = {
        id: `trade-${crypto.randomUUID()}`,
        from: account.username,
        to: target.username,
        offeredCardId,
        requestedCardId,
        createdAt: new Date().toISOString(),
        note,
      };
      social.tradeOffersOutgoing = [...social.tradeOffersOutgoing, offer];
      targetSocial.tradeOffersIncoming = [...targetSocial.tradeOffersIncoming, offer];
      setSocialState(account, social);
      setSocialState(target, targetSocial);
      return database;
    });

    if (error) {
      sendJson(res, status, error);
      return;
    }

    sendOverview(res, account, snapshot);
  });

  router.post("/api/friends/trade/respond", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const body = await parseJsonBody(req);
    const offerId = String(body?.offerId || "").trim();
    const action = String(body?.action || "").trim();

    let account = null;
    let snapshot = null;
    let error = null;
    let status = 200;
    await updateDatabase((database) => {
      account = resolveSessionAccount(database, token);
      snapshot = database;
      if (!account) {
        status = 401;
        error = { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." };
        return database;
      }

      const social = getSocialState(account);
      let offer = social.tradeOffersIncoming.find((entry) => entry.id === offerId) || null;
      let counterpart = null;
      let counterpartSocial = null;
      let incoming = true;

      if (!offer) {
        offer = social.tradeOffersOutgoing.find((entry) => entry.id === offerId) || null;
        incoming = false;
      }

      if (!offer) {
        status = 404;
        error = { ok: false, error: "missing_offer", message: "Dieses Handelsangebot wurde nicht gefunden." };
        return database;
      }

      counterpart = findAccountByUsername(database, incoming ? offer.from : offer.to);
      if (!counterpart) {
        social.tradeOffersIncoming = removeOfferById(social.tradeOffersIncoming, offerId);
        social.tradeOffersOutgoing = removeOfferById(social.tradeOffersOutgoing, offerId);
        setSocialState(account, social);
        status = 404;
        error = { ok: false, error: "missing_counterpart", message: "Das Gegenkonto zu diesem Angebot wurde nicht gefunden." };
        return database;
      }

      counterpartSocial = getSocialState(counterpart);

      if (action === "accept" && incoming) {
        if (getTradeableCopies(counterpart, offer.offeredCardId) < 1 || getTradeableCopies(account, offer.requestedCardId) < 1) {
          social.tradeOffersIncoming = removeOfferById(social.tradeOffersIncoming, offerId);
          counterpartSocial.tradeOffersOutgoing = removeOfferById(counterpartSocial.tradeOffersOutgoing, offerId);
          setSocialState(account, social);
          setSocialState(counterpart, counterpartSocial);
          status = 409;
          error = { ok: false, error: "trade_invalidated", message: "Mindestens eine der angebotenen Karten ist nicht mehr verfügbar." };
          return database;
        }

        counterpart.save.collection[offer.offeredCardId] -= 1;
        if (counterpart.save.collection[offer.offeredCardId] <= 0) {
          delete counterpart.save.collection[offer.offeredCardId];
        }
        account.save.collection[offer.requestedCardId] -= 1;
        if (account.save.collection[offer.requestedCardId] <= 0) {
          delete account.save.collection[offer.requestedCardId];
        }

        counterpart.save.collection[offer.requestedCardId] = (counterpart.save.collection[offer.requestedCardId] || 0) + 1;
        account.save.collection[offer.offeredCardId] = (account.save.collection[offer.offeredCardId] || 0) + 1;
        appendTradeHistory(
          account,
          `Tausch mit ${counterpart.username}: ${offer.requestedCardId} gegen ${offer.offeredCardId}`,
          0,
          "accepted",
        );
        appendTradeHistory(
          counterpart,
          `Tausch mit ${account.username}: ${offer.offeredCardId} gegen ${offer.requestedCardId}`,
          0,
          "accepted",
        );
      }

      if (!incoming && action !== "cancel") {
        status = 403;
        error = { ok: false, error: "trade_action_denied", message: "Ausgehende Angebote können nur zurückgezogen werden." };
        return database;
      }

      social.tradeOffersIncoming = removeOfferById(social.tradeOffersIncoming, offerId);
      social.tradeOffersOutgoing = removeOfferById(social.tradeOffersOutgoing, offerId);
      counterpartSocial.tradeOffersIncoming = removeOfferById(counterpartSocial.tradeOffersIncoming, offerId);
      counterpartSocial.tradeOffersOutgoing = removeOfferById(counterpartSocial.tradeOffersOutgoing, offerId);
      setSocialState(account, social);
      setSocialState(counterpart, counterpartSocial);
      return database;
    });

    if (error) {
      sendJson(res, status, error);
      return;
    }

    sendOverview(res, account, snapshot);
  });

  router.post("/api/friends/challenge/create", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const body = await parseJsonBody(req);
    const targetUsername = sanitizeUsername(body?.username);
    const deckName = String(body?.deckName || "").trim().slice(0, 48);
    const deckCards = normalizeDeckSnapshot(body?.deckCards);

    let account = null;
    let snapshot = null;
    let error = null;
    let status = 200;
    await updateDatabase((database) => {
      account = resolveSessionAccount(database, token);
      snapshot = database;
      if (!account) {
        status = 401;
        error = { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." };
        return database;
      }

      const target = findAccountByUsername(database, targetUsername);
      if (!target || target.username === account.username) {
        status = 404;
        error = { ok: false, error: "missing_target", message: "Dieses Spielkonto wurde nicht gefunden." };
        return database;
      }

      const social = getSocialState(account);
      const targetSocial = getSocialState(target);
      if (!social.friends.some((entry) => canonicalizeUsername(entry) === canonicalizeUsername(target.username))) {
        status = 403;
        error = { ok: false, error: "not_friend", message: "Freundschaftsduelle sind nur mit bestätigten Freunden möglich." };
        return database;
      }
      if (deckCards.length !== 20) {
        status = 400;
        error = { ok: false, error: "invalid_deck", message: "Für ein Freundesduell muss ein vollständiges 20-Karten-Deck gesendet werden." };
        return database;
      }

      const challenge = {
        id: `duel-${crypto.randomUUID()}`,
        from: account.username,
        to: target.username,
        deckName,
        deckCards,
        createdAt: new Date().toISOString(),
      };
      social.duelChallengesOutgoing = [...social.duelChallengesOutgoing, challenge];
      targetSocial.duelChallengesIncoming = [...targetSocial.duelChallengesIncoming, challenge];
      setSocialState(account, social);
      setSocialState(target, targetSocial);
      return database;
    });

    if (error) {
      sendJson(res, status, error);
      return;
    }

    sendOverview(res, account, snapshot);
  });

  router.post("/api/friends/challenge/respond", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const body = await parseJsonBody(req);
    const challengeId = String(body?.challengeId || "").trim();
    const action = String(body?.action || "").trim();

    let account = null;
    let snapshot = null;
    let acceptedChallenge = null;
    let error = null;
    let status = 200;
    await updateDatabase((database) => {
      account = resolveSessionAccount(database, token);
      snapshot = database;
      if (!account) {
        status = 401;
        error = { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." };
        return database;
      }

      const social = getSocialState(account);
      let challenge = social.duelChallengesIncoming.find((entry) => entry.id === challengeId) || null;
      let counterpart = null;
      let counterpartSocial = null;
      let incoming = true;

      if (!challenge) {
        challenge = social.duelChallengesOutgoing.find((entry) => entry.id === challengeId) || null;
        incoming = false;
      }

      if (!challenge) {
        status = 404;
        error = { ok: false, error: "missing_challenge", message: "Diese Herausforderung wurde nicht gefunden." };
        return database;
      }

      counterpart = findAccountByUsername(database, incoming ? challenge.from : challenge.to);
      if (!counterpart) {
        social.duelChallengesIncoming = removeOfferById(social.duelChallengesIncoming, challengeId);
        social.duelChallengesOutgoing = removeOfferById(social.duelChallengesOutgoing, challengeId);
        setSocialState(account, social);
        status = 404;
        error = { ok: false, error: "missing_counterpart", message: "Das Gegenkonto für diese Herausforderung wurde nicht gefunden." };
        return database;
      }

      counterpartSocial = getSocialState(counterpart);
      if (action === "accept" && incoming) {
        acceptedChallenge = challenge;
      } else if (!incoming && action !== "cancel") {
        status = 403;
        error = { ok: false, error: "challenge_action_denied", message: "Ausgehende Herausforderungen können nur zurückgezogen werden." };
        return database;
      }

      social.duelChallengesIncoming = removeOfferById(social.duelChallengesIncoming, challengeId);
      social.duelChallengesOutgoing = removeOfferById(social.duelChallengesOutgoing, challengeId);
      counterpartSocial.duelChallengesIncoming = removeOfferById(counterpartSocial.duelChallengesIncoming, challengeId);
      counterpartSocial.duelChallengesOutgoing = removeOfferById(counterpartSocial.duelChallengesOutgoing, challengeId);
      setSocialState(account, social);
      setSocialState(counterpart, counterpartSocial);
      return database;
    });

    if (error) {
      sendJson(res, status, error);
      return;
    }

    sendOverview(res, account, snapshot, {
      challenge: acceptedChallenge ? {
        id: acceptedChallenge.id,
        from: acceptedChallenge.from,
        deckName: acceptedChallenge.deckName,
        deckCards: acceptedChallenge.deckCards,
      } : null,
    });
  });
}

module.exports = { registerFriendsRoutes };
