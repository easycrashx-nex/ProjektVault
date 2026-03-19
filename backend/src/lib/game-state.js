const crypto = require("node:crypto");

const GAME_LIMITS = Object.freeze({
  maxGold: 10000000,
  maxCollectionCopies: 9999,
  maxPackCopies: 999,
  maxDecks: 24,
  maxDeckNameLength: 32,
  maxLastOpenedCards: 8,
  maxSnapshotBytes: 850000,
});

const PACK_IDS = Object.freeze(["starter", "market", "champion", "relic", "astral"]);
const SUPPORTED_LANGUAGES = Object.freeze(["de", "en", "fr"]);
const SHOP_TABS = Object.freeze(["boosters", "packs"]);
const ARENA_DIFFICULTIES = Object.freeze(["novice", "standard", "veteran", "nightmare"]);

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
  };
}

function createEmptySave() {
  const firstDeck = createDeck("Erstes Deck");
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
    shopTab: "boosters",
    selectedPack: "starter",
    arenaDifficulty: "standard",
    settings: createDefaultSettings(),
    friends: createDefaultFriendState(),
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
  return {
    friends: uniqueSanitizedUsernames(friends?.friends ?? baseFriends.friends, sanitizeUsername),
    incoming: uniqueSanitizedUsernames(friends?.incoming ?? baseFriends.incoming, sanitizeUsername),
    outgoing: uniqueSanitizedUsernames(friends?.outgoing ?? baseFriends.outgoing, sanitizeUsername),
    blocked: uniqueSanitizedUsernames(friends?.blocked ?? baseFriends.blocked, sanitizeUsername),
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

function sanitizeDecks(decks) {
  if (!Array.isArray(decks) || !decks.length) {
    return [createDeck("Erstes Deck")];
  }

  const seen = new Set();
  const normalized = decks
    .slice(0, GAME_LIMITS.maxDecks)
    .map((deck, index) => {
      const nextDeck = {
        id: sanitizeDeckId(deck?.id),
        name: sanitizeDeckName(deck?.name, index),
        cards: sanitizeStringArray(deck?.cards, { maxItems: 20, maxLength: 120 }),
      };

      while (seen.has(nextDeck.id)) {
        nextDeck.id = `deck-${crypto.randomUUID()}`;
      }

      seen.add(nextDeck.id);
      return nextDeck;
    });

  return normalized.length ? normalized : [createDeck("Erstes Deck")];
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

function sanitizeSave(save, sanitizeUsername) {
  const baseSave = createEmptySave();
  const sanitizedDecks = sanitizeDecks(save?.decks);
  const activeDeckId = sanitizeText(save?.activeDeckId, 120);
  const nextSave = {
    ...baseSave,
    gold: sanitizeFiniteInteger(save?.gold, baseSave.gold, 0, GAME_LIMITS.maxGold),
    collection: sanitizeCollection(save?.collection),
    packs: sanitizePackInventory(save?.packs, baseSave.packs),
    decks: sanitizedDecks,
    activeDeckId,
    shopTab: SHOP_TABS.includes(save?.shopTab) ? save.shopTab : baseSave.shopTab,
    selectedPack: PACK_IDS.includes(save?.selectedPack) ? save.selectedPack : baseSave.selectedPack,
    arenaDifficulty: ARENA_DIFFICULTIES.includes(save?.arenaDifficulty) ? save.arenaDifficulty : baseSave.arenaDifficulty,
    settings: sanitizeSettings(save?.settings, baseSave.settings),
    friends: sanitizeFriends(save?.friends, baseSave.friends, sanitizeUsername),
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
