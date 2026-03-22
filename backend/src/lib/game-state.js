const crypto = require("node:crypto");
const PROGRESSION_RULES = require("../../../shared/progression-defs.js");

const GAME_LIMITS = Object.freeze({
  maxGold: 10000000,
  maxCollectionCopies: 9999,
  maxPackCopies: 999,
  maxDecks: 24,
  maxDeckNameLength: 32,
  maxLastOpenedCards: 8,
  maxSnapshotBytes: 850000,
  maxSocialEntries: 120,
  maxOfferEntries: 64,
});

const PACK_IDS = Object.freeze(["starter", "market", "champion", "relic", "astral"]);
const SUPPORTED_LANGUAGES = Object.freeze(["de", "en", "fr"]);
const SHOP_TABS = Object.freeze(["boosters", "packs", "cosmetics"]);
const ARENA_DIFFICULTIES = Object.freeze(["novice", "standard", "veteran", "nightmare", "hardcore"]);
const DECK_RULES = Object.freeze({
  standard: Object.freeze({ size: 20 }),
  hardcore: Object.freeze({ size: 35 }),
});
const MAX_DECK_SIZE = Math.max(...Object.values(DECK_RULES).map((entry) => entry.size));
const DEFAULT_PROGRESS_STATE = Object.freeze({
  rankPoints: 0,
  achievementsClaimed: [],
  quests: Object.freeze(PROGRESSION_RULES.createDefaultQuestState()),
  pity: Object.freeze({
    starter: Object.freeze({ epicDry: 0, legendaryDry: 0 }),
    market: Object.freeze({ epicDry: 0, legendaryDry: 0 }),
    champion: Object.freeze({ epicDry: 0, legendaryDry: 0 }),
    relic: Object.freeze({ epicDry: 0, legendaryDry: 0 }),
    astral: Object.freeze({ epicDry: 0, legendaryDry: 0 }),
  }),
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
});

function clamp(min, max, value) {
  return Math.min(max, Math.max(min, value));
}

function sanitizeFiniteInteger(value, fallback, min, max) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return clamp(min, max, parsed);
}

function sanitizeFiniteNumber(value, fallback, min, max, digits = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Number(clamp(min, max, parsed).toFixed(digits));
}

function cloneJsonValue(value, fallback = null) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return fallback;
  }
}

function sanitizeText(value, maxLength = 120) {
  return String(value || "").trim().slice(0, maxLength);
}

function sanitizeId(value, maxLength = 120) {
  return String(value || "")
    .trim()
    .replace(/[^\w.-]/g, "-")
    .slice(0, maxLength);
}

function sanitizeStringArray(value, { maxItems = 120, maxLength = 120 } = {}) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => sanitizeId(entry, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function uniqueSanitizedUsernames(entries, sanitizeUsername) {
  const seen = new Set();
  return sanitizeStringArray(entries, { maxItems: 120, maxLength: 18 })
    .map((entry) => sanitizeUsername(entry))
    .filter((entry) => {
      if (!entry || seen.has(entry.toLowerCase())) {
        return false;
      }
      seen.add(entry.toLowerCase());
      return true;
    });
}

function createDeck(name = "Erstes Deck", cards = []) {
  return {
    id: `deck-${crypto.randomUUID()}`,
    name,
    cards: [...cards],
  };
}

function createDefaultSettings() {
  return {
    language: "de",
    clickEffects: true,
    packEffects: true,
    reducedMotion: false,
    confirmActions: true,
  };
}

function createDefaultFriendState() {
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

function createDefaultProfileDisplay() {
  return {
    avatarId: "vault-core",
    frameId: "bronze-sigil",
    titleId: "vault-initiate",
  };
}

function createDefaultCosmetics() {
  return {
    avatars: ["vault-core"],
    frames: ["bronze-sigil"],
    titles: ["vault-initiate"],
  };
}

function createDefaultProgression() {
  return cloneJsonValue(DEFAULT_PROGRESS_STATE, {
    rankPoints: 0,
    achievementsClaimed: [],
    quests: PROGRESSION_RULES.createDefaultQuestState(),
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
  });
}

function createEmptySave() {
  const firstDeck = createDeck("Erstes Deck");
  const hardcoreDeck = createDeck("Hardcore-Deck");
  return {
    gold: 260,
    collection: {},
    packs: {
      starter: 5,
      market: 0,
      champion: 0,
      relic: 0,
      astral: 0,
    },
    decks: [firstDeck],
    activeDeckId: firstDeck.id,
    hardcoreDeck,
    shopTab: "boosters",
    selectedPack: "starter",
    arenaDifficulty: "standard",
    settings: createDefaultSettings(),
    friends: createDefaultFriendState(),
    progression: createDefaultProgression(),
    profileDisplay: createDefaultProfileDisplay(),
    cosmetics: createDefaultCosmetics(),
    lastOpened: {
      packId: "starter",
      cards: [],
      openedAt: null,
    },
    activeMatch: null,
    filters: {
      search: "",
      sort: "rarity-asc",
      rarity: "all",
      type: "all",
      faction: "all",
      cost: "all",
      ownedOnly: true,
      duplicatesOnly: false,
    },
  };
}

function summarizeSave(save) {
  const collection = save?.collection || {};
  const packs = save?.packs || {};
  return {
    gold: Number(save?.gold || 0),
    totalCards: Object.values(collection).reduce((sum, value) => sum + Number(value || 0), 0),
    uniqueCards: Object.values(collection).filter((value) => Number(value || 0) > 0).length,
    totalBoosters: Object.values(packs).reduce((sum, value) => sum + Number(value || 0), 0),
  };
}

function sanitizeCollection(collection) {
  const normalized = {};
  if (!collection || typeof collection !== "object") {
    return normalized;
  }

  Object.entries(collection).forEach(([cardId, count]) => {
    const safeCardId = sanitizeId(cardId);
    if (!safeCardId) {
      return;
    }

    const safeCount = sanitizeFiniteInteger(count, 0, 0, GAME_LIMITS.maxCollectionCopies);
    if (safeCount > 0) {
      normalized[safeCardId] = safeCount;
    }
  });

  return normalized;
}

function sanitizePackInventory(packs, basePacks = {}) {
  const normalized = {};
  PACK_IDS.forEach((packId) => {
    normalized[packId] = sanitizeFiniteInteger(
      packs?.[packId],
      sanitizeFiniteInteger(basePacks?.[packId], 0, 0, GAME_LIMITS.maxPackCopies),
      0,
      GAME_LIMITS.maxPackCopies,
    );
  });
  return normalized;
}

function sanitizeSettings(settings, baseSettings) {
  return {
    language: SUPPORTED_LANGUAGES.includes(settings?.language) ? settings.language : baseSettings.language,
    clickEffects: typeof settings?.clickEffects === "boolean" ? settings.clickEffects : baseSettings.clickEffects,
    packEffects: typeof settings?.packEffects === "boolean" ? settings.packEffects : baseSettings.packEffects,
    reducedMotion: typeof settings?.reducedMotion === "boolean" ? settings.reducedMotion : baseSettings.reducedMotion,
    confirmActions: typeof settings?.confirmActions === "boolean" ? settings.confirmActions : baseSettings.confirmActions,
  };
}

function sanitizeFriends(friends, baseFriends, sanitizeUsername) {
  const sanitizeOfferEntry = (entry) => {
    if (!entry || typeof entry !== "object") {
      return null;
    }

    const from = sanitizeUsername(entry.from);
    const to = sanitizeUsername(entry.to);
    const offeredCardId = sanitizeId(entry.offeredCardId);
    const requestedCardId = sanitizeId(entry.requestedCardId);
    const id = sanitizeId(entry.id, 64);
    if (!id || !from || !to || !offeredCardId || !requestedCardId) {
      return null;
    }

    return {
      id,
      from,
      to,
      offeredCardId,
      requestedCardId,
      createdAt: typeof entry.createdAt === "string" ? entry.createdAt : new Date().toISOString(),
      note: sanitizeText(entry.note, 140),
    };
  };

  const sanitizeChallengeEntry = (entry) => {
    if (!entry || typeof entry !== "object") {
      return null;
    }

    const id = sanitizeId(entry.id, 64);
    const from = sanitizeUsername(entry.from);
    const to = sanitizeUsername(entry.to);
    const deckName = sanitizeText(entry.deckName, 48);
    const deckCards = sanitizeStringArray(entry.deckCards, { maxItems: 20, maxLength: 120 });
    if (!id || !from || !to || !deckCards.length) {
      return null;
    }

    return {
      id,
      from,
      to,
      deckName,
      deckCards,
      createdAt: typeof entry.createdAt === "string" ? entry.createdAt : new Date().toISOString(),
    };
  };

  const sanitizeOfferList = (entries, factory) => {
    if (!Array.isArray(entries)) {
      return [];
    }

    const seen = new Set();
    return entries
      .map(factory)
      .filter((entry) => {
        if (!entry || seen.has(entry.id)) {
          return false;
        }
        seen.add(entry.id);
        return true;
      })
      .slice(0, GAME_LIMITS.maxOfferEntries);
  };

  return {
    friends: uniqueSanitizedUsernames(friends?.friends ?? baseFriends.friends, sanitizeUsername),
    incoming: uniqueSanitizedUsernames(friends?.incoming ?? baseFriends.incoming, sanitizeUsername),
    outgoing: uniqueSanitizedUsernames(friends?.outgoing ?? baseFriends.outgoing, sanitizeUsername),
    blocked: uniqueSanitizedUsernames(friends?.blocked ?? baseFriends.blocked, sanitizeUsername),
    tradeOffersIncoming: sanitizeOfferList(friends?.tradeOffersIncoming ?? baseFriends.tradeOffersIncoming, sanitizeOfferEntry),
    tradeOffersOutgoing: sanitizeOfferList(friends?.tradeOffersOutgoing ?? baseFriends.tradeOffersOutgoing, sanitizeOfferEntry),
    duelChallengesIncoming: sanitizeOfferList(friends?.duelChallengesIncoming ?? baseFriends.duelChallengesIncoming, sanitizeChallengeEntry),
    duelChallengesOutgoing: sanitizeOfferList(friends?.duelChallengesOutgoing ?? baseFriends.duelChallengesOutgoing, sanitizeChallengeEntry),
  };
}

function sanitizeCosmetics(cosmetics, baseCosmetics) {
  return {
    avatars: [...new Set(sanitizeStringArray(cosmetics?.avatars ?? baseCosmetics.avatars, { maxItems: 120, maxLength: 64 }))],
    frames: [...new Set(sanitizeStringArray(cosmetics?.frames ?? baseCosmetics.frames, { maxItems: 120, maxLength: 64 }))],
    titles: [...new Set(sanitizeStringArray(cosmetics?.titles ?? baseCosmetics.titles, { maxItems: 120, maxLength: 64 }))],
  };
}

function sanitizeProfileDisplay(profileDisplay, baseProfileDisplay, cosmetics) {
  const avatarId = sanitizeId(profileDisplay?.avatarId, 64);
  const frameId = sanitizeId(profileDisplay?.frameId, 64);
  const titleId = sanitizeId(profileDisplay?.titleId, 64);
  return {
    avatarId: cosmetics.avatars.includes(avatarId) ? avatarId : baseProfileDisplay.avatarId,
    frameId: cosmetics.frames.includes(frameId) ? frameId : baseProfileDisplay.frameId,
    titleId: cosmetics.titles.includes(titleId) ? titleId : baseProfileDisplay.titleId,
  };
}

function sanitizeDeckName(name, index) {
  const trimmed = sanitizeText(name, GAME_LIMITS.maxDeckNameLength);
  return trimmed || `Deck ${index + 1}`;
}

function sanitizeDeckId(value) {
  const safeId = sanitizeId(value);
  return safeId && safeId.startsWith("deck-") ? safeId : `deck-${crypto.randomUUID()}`;
}

function sanitizeDeckEntries(decks, mode = "standard", options = {}) {
  const size = DECK_RULES[mode]?.size || DECK_RULES.standard.size;
  const maxDecks = options.maxDecks ?? GAME_LIMITS.maxDecks;
  if (!Array.isArray(decks) || !decks.length) {
    return [];
  }

  const seen = new Set();
  const normalized = decks
    .slice(0, maxDecks)
    .map((deck, index) => {
      const nextDeck = {
        id: sanitizeDeckId(deck?.id),
        name: sanitizeDeckName(deck?.name, index),
        cards: sanitizeStringArray(deck?.cards, { maxItems: size, maxLength: 120 }),
      };

      while (seen.has(nextDeck.id)) {
        nextDeck.id = `deck-${crypto.randomUUID()}`;
      }

      seen.add(nextDeck.id);
      return nextDeck;
    });

  return normalized;
}

function sanitizeDecks(decks) {
  const normalized = sanitizeDeckEntries(decks, "standard");
  return normalized.length ? normalized : [createDeck("Erstes Deck")];
}

function sanitizeHardcoreDeck(deck) {
  const normalized = sanitizeDeckEntries([deck], "hardcore", { maxDecks: 1 });
  return normalized[0] || createDeck("Hardcore-Deck");
}

function sanitizeFilters(filters, baseFilters) {
  return {
    search: sanitizeText(filters?.search, 80),
    sort: sanitizeText(filters?.sort, 32) || baseFilters.sort,
    rarity: sanitizeText(filters?.rarity, 32) || baseFilters.rarity,
    type: sanitizeText(filters?.type, 32) || baseFilters.type,
    faction: sanitizeText(filters?.faction, 48) || baseFilters.faction,
    cost: sanitizeText(filters?.cost, 16) || baseFilters.cost,
    ownedOnly: typeof filters?.ownedOnly === "boolean" ? filters.ownedOnly : baseFilters.ownedOnly,
    duplicatesOnly: typeof filters?.duplicatesOnly === "boolean" ? filters.duplicatesOnly : baseFilters.duplicatesOnly,
  };
}

function sanitizeLastOpened(lastOpened, baseLastOpened) {
  return {
    packId: PACK_IDS.includes(lastOpened?.packId) ? lastOpened.packId : baseLastOpened.packId,
    cards: sanitizeStringArray(lastOpened?.cards, { maxItems: GAME_LIMITS.maxLastOpenedCards, maxLength: 120 }),
    openedAt: typeof lastOpened?.openedAt === "string" ? lastOpened.openedAt : null,
  };
}

function sanitizeActiveMatch(match) {
  if (!match || typeof match !== "object") {
    return null;
  }

  const snapshot = cloneJsonValue(match, null);
  if (!snapshot) {
    return null;
  }

  const raw = JSON.stringify(snapshot);
  if (Buffer.byteLength(raw, "utf8") > GAME_LIMITS.maxSnapshotBytes) {
    return null;
  }

  return snapshot;
}

function sanitizeQuestSnapshot(snapshot) {
  const next = cloneJsonValue(PROGRESSION_RULES.createDefaultQuestSnapshot());
  const source = snapshot && typeof snapshot === "object" ? snapshot : {};
  next.rankPoints = sanitizeFiniteInteger(source.rankPoints, next.rankPoints, 0, GAME_LIMITS.maxGold * 10);
  PROGRESSION_RULES.SNAPSHOT_STAT_KEYS.forEach((key) => {
    next.stats[key] = sanitizeFiniteInteger(source.stats?.[key], next.stats[key] || 0, 0, 999999);
  });
  next.summary = {
    gold: sanitizeFiniteInteger(source.summary?.gold, next.summary.gold, 0, GAME_LIMITS.maxGold),
    totalCards: sanitizeFiniteInteger(source.summary?.totalCards, next.summary.totalCards, 0, GAME_LIMITS.maxCollectionCopies * 1000),
    uniqueCards: sanitizeFiniteInteger(source.summary?.uniqueCards, next.summary.uniqueCards, 0, GAME_LIMITS.maxCollectionCopies * 1000),
    totalBoosters: sanitizeFiniteInteger(source.summary?.totalBoosters, next.summary.totalBoosters, 0, GAME_LIMITS.maxPackCopies * 10),
  };
  return next;
}

function sanitizeQuestWindow(windowState) {
  const next = cloneJsonValue(PROGRESSION_RULES.createDefaultQuestWindow());
  const source = windowState && typeof windowState === "object" ? windowState : {};
  next.key = sanitizeText(source.key, 24);
  next.activeIds = [...new Set(sanitizeStringArray(source.activeIds, { maxItems: 8, maxLength: 64 }))];
  next.snapshot = sanitizeQuestSnapshot(source.snapshot);
  return next;
}

function sanitizeProgression(progression, baseProgression = createDefaultProgression()) {
  const next = cloneJsonValue(baseProgression, createDefaultProgression());
  const source = progression && typeof progression === "object" ? progression : {};
  next.rankPoints = sanitizeFiniteInteger(source.rankPoints, next.rankPoints, 0, GAME_LIMITS.maxGold * 10);
  next.achievementsClaimed = [...new Set(sanitizeStringArray(source.achievementsClaimed, { maxItems: 120, maxLength: 64 }))];
  next.quests = {
    dailyClaimed: [...new Set(sanitizeStringArray(source.quests?.dailyClaimed, { maxItems: 64, maxLength: 64 }))],
    weeklyClaimed: [...new Set(sanitizeStringArray(source.quests?.weeklyClaimed, { maxItems: 64, maxLength: 64 }))],
    dailyWindow: sanitizeQuestWindow(source.quests?.dailyWindow),
    weeklyWindow: sanitizeQuestWindow(source.quests?.weeklyWindow),
  };
  next.pity = {};
  PACK_IDS.forEach((packId) => {
    const pityState = source.pity?.[packId];
    next.pity[packId] = {
      epicDry: sanitizeFiniteInteger(pityState?.epicDry, 0, 0, 999),
      legendaryDry: sanitizeFiniteInteger(pityState?.legendaryDry, 0, 0, 999),
    };
  });
  next.stats = {
    arenaWins: sanitizeFiniteInteger(source.stats?.arenaWins, 0, 0, 999999),
    arenaLosses: sanitizeFiniteInteger(source.stats?.arenaLosses, 0, 0, 999999),
    friendWins: sanitizeFiniteInteger(source.stats?.friendWins, 0, 0, 999999),
    friendLosses: sanitizeFiniteInteger(source.stats?.friendLosses, 0, 0, 999999),
    boostersOpened: sanitizeFiniteInteger(source.stats?.boostersOpened, 0, 0, 999999),
    cardsOpened: sanitizeFiniteInteger(source.stats?.cardsOpened, 0, 0, 999999),
    goldEarned: sanitizeFiniteInteger(source.stats?.goldEarned, 0, 0, GAME_LIMITS.maxGold * 100),
    tradesCompleted: sanitizeFiniteInteger(source.stats?.tradesCompleted, 0, 0, 999999),
    marketDeals: sanitizeFiniteInteger(source.stats?.marketDeals, 0, 0, 999999),
    hardcoreWins: sanitizeFiniteInteger(source.stats?.hardcoreWins, 0, 0, 999999),
    legendaryPlusPulled: sanitizeFiniteInteger(source.stats?.legendaryPlusPulled, 0, 0, 999999),
  };
  const sanitizeHistory = (entries, fallbackStatus) => (Array.isArray(entries) ? entries : [])
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      const id = sanitizeId(entry.id, 64);
      if (!id) {
        return null;
      }
      return {
        id,
        createdAt: typeof entry.createdAt === "string" ? entry.createdAt : new Date().toISOString(),
        note: sanitizeText(entry.note, 160),
        value: sanitizeFiniteInteger(entry.value, 0, 0, GAME_LIMITS.maxGold * 10),
        status: sanitizeText(entry.status, 32) || fallbackStatus,
      };
    })
    .filter(Boolean)
    .slice(0, 24);
  next.tradeHistory = sanitizeHistory(source.tradeHistory, "trade");
  next.duelHistory = sanitizeHistory(source.duelHistory, "duel");
  return next;
}

function sanitizeSave(save, sanitizeUsername) {
  const baseSave = createEmptySave();
  const sanitizedDecks = sanitizeDecks(save?.decks);
  const hardcoreDeck = sanitizeHardcoreDeck(save?.hardcoreDeck);
  const activeDeckId = sanitizeText(save?.activeDeckId, 120);
  const cosmetics = sanitizeCosmetics(save?.cosmetics, baseSave.cosmetics);
  const nextSave = {
    ...baseSave,
    gold: sanitizeFiniteInteger(save?.gold, baseSave.gold, 0, GAME_LIMITS.maxGold),
    collection: sanitizeCollection(save?.collection),
    packs: sanitizePackInventory(save?.packs, baseSave.packs),
    decks: sanitizedDecks,
    hardcoreDeck,
    activeDeckId,
    shopTab: SHOP_TABS.includes(save?.shopTab) ? save.shopTab : baseSave.shopTab,
    selectedPack: PACK_IDS.includes(save?.selectedPack) ? save.selectedPack : baseSave.selectedPack,
    arenaDifficulty: ARENA_DIFFICULTIES.includes(save?.arenaDifficulty) ? save.arenaDifficulty : baseSave.arenaDifficulty,
    settings: sanitizeSettings(save?.settings, baseSave.settings),
    friends: sanitizeFriends(save?.friends, baseSave.friends, sanitizeUsername),
    progression: sanitizeProgression(save?.progression, baseSave.progression),
    profileDisplay: sanitizeProfileDisplay(save?.profileDisplay, baseSave.profileDisplay, cosmetics),
    cosmetics,
    lastOpened: sanitizeLastOpened(save?.lastOpened, baseSave.lastOpened),
    activeMatch: sanitizeActiveMatch(save?.activeMatch),
    filters: sanitizeFilters(save?.filters, baseSave.filters),
  };

  if (!nextSave.decks.some((deck) => deck.id === nextSave.activeDeckId)) {
    nextSave.activeDeckId = nextSave.decks[0].id;
  }

  return nextSave;
}

function createInitialMarketState() {
  return {
    feeVault: 0,
    updatedAt: null,
    lastHourKey: null,
    cards: {},
  };
}

function sanitizeMarketState(market) {
  const baseMarket = createInitialMarketState();
  if (!market || typeof market !== "object") {
    return baseMarket;
  }

  const nextCards = {};
  if (market.cards && typeof market.cards === "object") {
    Object.entries(market.cards).forEach(([cardId, entry]) => {
      const safeCardId = sanitizeId(cardId);
      if (!safeCardId || !entry || typeof entry !== "object") {
        return;
      }

      nextCards[safeCardId] = {
        price: sanitizeFiniteInteger(entry.price, 0, 0, 250000),
        buyPrice: sanitizeFiniteInteger(entry.buyPrice, 0, 0, 250000),
        demand: sanitizeFiniteNumber(entry.demand, 0, 0, 1000, 2),
        supply: sanitizeFiniteNumber(entry.supply, 0, 0, 1000, 2),
        momentum: sanitizeFiniteNumber(entry.momentum, 0, -10, 10, 3),
        lastDeltaPct: sanitizeFiniteNumber(entry.lastDeltaPct, 0, -100, 100, 1),
        tradePressure: sanitizeFiniteNumber(entry.tradePressure, 0, -999, 999, 2),
      };
    });
  }

  return {
    feeVault: sanitizeFiniteInteger(market.feeVault, 0, 0, 1000000000),
    updatedAt: typeof market.updatedAt === "string" ? market.updatedAt : null,
    lastHourKey: typeof market.lastHourKey === "string" ? market.lastHourKey : null,
    cards: nextCards,
  };
}

function sanitizeAccountForClient(account, { includeSave = false } = {}) {
  if (!account) {
    return null;
  }

  const save = account.save || createEmptySave();
  const stats = summarizeSave(save);
  return {
    username: account.username,
    createdAt: account.createdAt,
    roles: Array.isArray(account.roles) ? [...account.roles] : [],
    isAdmin: Array.isArray(account.roles) && account.roles.includes("admin"),
    profile: {
      gold: stats.gold,
      cards: stats.totalCards,
      boosters: stats.totalBoosters,
      uniqueCards: stats.uniqueCards,
      titleId: save.profileDisplay?.titleId || "vault-initiate",
      avatarId: save.profileDisplay?.avatarId || "vault-core",
      frameId: save.profileDisplay?.frameId || "bronze-sigil",
    },
    ...(includeSave ? { save: cloneJsonValue(save, createEmptySave()) } : {}),
  };
}

module.exports = {
  GAME_LIMITS,
  PACK_IDS,
  createEmptySave,
  createInitialMarketState,
  sanitizeSave,
  sanitizeMarketState,
  sanitizeAccountForClient,
  summarizeSave,
};
