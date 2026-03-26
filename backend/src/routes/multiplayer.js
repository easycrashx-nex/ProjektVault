const crypto = require("node:crypto");
const { sendJson, parseJsonBody } = require("../lib/http");
const { getBearerToken, sanitizeUsername, canonicalizeUsername } = require("../lib/security");
const { updateDatabase, getAccountBySessionToken, findAccountByUsername } = require("../lib/store");

function normalizeDeckSnapshot(cards) {
  if (!Array.isArray(cards)) {
    return [];
  }

  return cards
    .map((entry) => String(entry || "").trim().slice(0, 120))
    .filter(Boolean)
    .slice(0, 20);
}

function getMultiplayerState(database) {
  if (!database.multiplayer || typeof database.multiplayer !== "object") {
    database.multiplayer = { queue: [], challenges: [] };
  }
  if (!Array.isArray(database.multiplayer.queue)) {
    database.multiplayer.queue = [];
  }
  if (!Array.isArray(database.multiplayer.challenges)) {
    database.multiplayer.challenges = [];
  }
  return database.multiplayer;
}

function buildOverview(database, account) {
  const state = getMultiplayerState(database);
  const ownCanonical = canonicalizeUsername(account.username);
  return {
    queue: state.queue.filter((entry) => canonicalizeUsername(entry.username) !== ownCanonical),
    ownQueueEntry: state.queue.find((entry) => canonicalizeUsername(entry.username) === ownCanonical) || null,
    incomingChallenges: state.challenges.filter((entry) => canonicalizeUsername(entry.to) === ownCanonical),
    outgoingChallenges: state.challenges.filter((entry) => canonicalizeUsername(entry.from) === ownCanonical),
  };
}

function resolveSessionAccount(database, req, res) {
  const token = getBearerToken(req);
  if (!token) {
    sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
    return null;
  }
  const account = getAccountBySessionToken(database, token);
  if (!account) {
    sendJson(res, 401, { ok: false, error: "invalid_session", message: "Sitzung abgelaufen." });
    return null;
  }
  return account;
}

function createQueueEntry(account, payload) {
  return {
    id: `queue-${crypto.randomUUID()}`,
    username: account.username,
    deckName: String(payload.deckName || "").trim().slice(0, 48),
    deckCards: normalizeDeckSnapshot(payload.deckCards),
    rankPoints: Number.isFinite(Number(account.save?.progression?.rankPoints))
      ? Math.max(0, Math.trunc(Number(account.save.progression.rankPoints)))
      : 0,
    createdAt: new Date().toISOString(),
  };
}

function createChallengeEntry(account, targetUsername, payload) {
  return {
    id: `challenge-${crypto.randomUUID()}`,
    from: account.username,
    to: targetUsername,
    deckName: String(payload.deckName || "").trim().slice(0, 48),
    deckCards: normalizeDeckSnapshot(payload.deckCards),
    createdAt: new Date().toISOString(),
  };
}

function registerMultiplayerRoutes(router) {
  router.get("/api/multiplayer/overview", async (req, res) => {
    const database = await updateDatabase((current) => current);
    const account = resolveSessionAccount(database, req, res);
    if (!account) {
      return;
    }

    sendJson(res, 200, {
      ok: true,
      ...buildOverview(database, account),
    });
  });

  router.post("/api/multiplayer/queue/join", async (req, res) => {
    const body = await parseJsonBody(req);
    const result = await updateDatabase((database) => {
      const account = resolveSessionAccount(database, req, res);
      if (!account) {
        return database;
      }

      const state = getMultiplayerState(database);
      const ownCanonical = canonicalizeUsername(account.username);
      state.queue = state.queue.filter((entry) => canonicalizeUsername(entry.username) !== ownCanonical);
      state.queue.push(createQueueEntry(account, body || {}));
      return database;
    });

    const account = resolveSessionAccount(result, req, res);
    if (!account) {
      return;
    }

    sendJson(res, 200, { ok: true, ...buildOverview(result, account) });
  });

  router.post("/api/multiplayer/queue/leave", async (req, res) => {
    const result = await updateDatabase((database) => {
      const account = resolveSessionAccount(database, req, res);
      if (!account) {
        return database;
      }

      const state = getMultiplayerState(database);
      const ownCanonical = canonicalizeUsername(account.username);
      state.queue = state.queue.filter((entry) => canonicalizeUsername(entry.username) !== ownCanonical);
      state.challenges = state.challenges.filter(
        (entry) => canonicalizeUsername(entry.from) !== ownCanonical && canonicalizeUsername(entry.to) !== ownCanonical
      );
      return database;
    });

    const account = resolveSessionAccount(result, req, res);
    if (!account) {
      return;
    }

    sendJson(res, 200, { ok: true, ...buildOverview(result, account) });
  });

  router.post("/api/multiplayer/challenge/create", async (req, res) => {
    const body = await parseJsonBody(req);
    const result = await updateDatabase((database) => {
      const account = resolveSessionAccount(database, req, res);
      if (!account) {
        return database;
      }

      const targetUsername = sanitizeUsername(body?.username);
      if (!targetUsername) {
        sendJson(res, 400, { ok: false, error: "missing_target", message: "Kein Zielspieler angegeben." });
        return database;
      }
      if (canonicalizeUsername(targetUsername) === canonicalizeUsername(account.username)) {
        sendJson(res, 400, { ok: false, error: "invalid_target", message: "Du kannst dich nicht selbst herausfordern." });
        return database;
      }
      if (!findAccountByUsername(database, targetUsername)) {
        sendJson(res, 404, { ok: false, error: "not_found", message: "Spieler nicht gefunden." });
        return database;
      }

      const state = getMultiplayerState(database);
      const duplicate = state.challenges.find(
        (entry) =>
          canonicalizeUsername(entry.from) === canonicalizeUsername(account.username)
          && canonicalizeUsername(entry.to) === canonicalizeUsername(targetUsername)
      );
      if (!duplicate) {
        state.challenges.push(createChallengeEntry(account, targetUsername, body || {}));
      }
      return database;
    });

    const account = resolveSessionAccount(result, req, res);
    if (!account) {
      return;
    }

    sendJson(res, 200, { ok: true, ...buildOverview(result, account) });
  });

  router.post("/api/multiplayer/challenge/respond", async (req, res) => {
    const body = await parseJsonBody(req);
    let acceptedChallenge = null;
    const result = await updateDatabase((database) => {
      const account = resolveSessionAccount(database, req, res);
      if (!account) {
        return database;
      }

      const challengeId = String(body?.challengeId || "").trim();
      const action = String(body?.action || "").trim().toLowerCase();
      const state = getMultiplayerState(database);
      const challenge = state.challenges.find((entry) => entry.id === challengeId);
      if (!challenge) {
        sendJson(res, 404, { ok: false, error: "not_found", message: "Herausforderung nicht gefunden." });
        return database;
      }

      const ownCanonical = canonicalizeUsername(account.username);
      const isRecipient = canonicalizeUsername(challenge.to) === ownCanonical;
      const isSender = canonicalizeUsername(challenge.from) === ownCanonical;

      if (action === "accept") {
        if (!isRecipient) {
          sendJson(res, 403, { ok: false, error: "forbidden", message: "Diese Herausforderung gehört dir nicht." });
          return database;
        }
        acceptedChallenge = challenge;
      } else if (action === "decline") {
        if (!isRecipient) {
          sendJson(res, 403, { ok: false, error: "forbidden", message: "Diese Herausforderung gehört dir nicht." });
          return database;
        }
      } else if (action === "cancel") {
        if (!isSender) {
          sendJson(res, 403, { ok: false, error: "forbidden", message: "Nur der Absender kann zurückziehen." });
          return database;
        }
      } else {
        sendJson(res, 400, { ok: false, error: "invalid_action", message: "Ungültige Multiplayer-Aktion." });
        return database;
      }

      state.challenges = state.challenges.filter((entry) => entry.id !== challengeId);
      return database;
    });

    const account = resolveSessionAccount(result, req, res);
    if (!account) {
      return;
    }

    sendJson(res, 200, {
      ok: true,
      challenge: acceptedChallenge,
      ...buildOverview(result, account),
    });
  });
}

module.exports = { registerMultiplayerRoutes };
