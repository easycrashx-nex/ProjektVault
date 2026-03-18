const APP_CONFIG = {
  deckSize: 20,
  baseGold: 260,
  openingHandSize: 4,
  maxMana: 10,
};

const MARKETPLACE_FEE_RATE = 0.07;
const ADMIN_BOOTSTRAP = {
  username: "obsidian_admin",
  passwordHash: "2362696861",
};

const STORAGE_KEYS = {
  database: "arcane-vault-db-v2",
  session: "arcane-vault-session-v2",
};

const TYPE_LABELS = {
  unit: "Einheit",
  spell: "Zauber",
  trainer: "Trainer",
};

const RARITY_ORDER = ["common", "rare", "epic", "legendary", "ultra", "mythic"];

const RARITY_META = {
  common: { label: "Gewöhnlich", sellValue: 8 },
  rare: { label: "Selten", sellValue: 16 },
  epic: { label: "Episch", sellValue: 32 },
  legendary: { label: "Legendär", sellValue: 64 },
  ultra: { label: "Ultra Rare", sellValue: 110 },
  mythic: { label: "Mythisch", sellValue: 180 },
};

const FACTIONS = [
  { id: "glutorden", name: "Glutorden", prefix: "Glut" },
  { id: "nebelchor", name: "Nebelchor", prefix: "Nebel" },
  { id: "wurzelpakt", name: "Wurzelpakt", prefix: "Wurzel" },
  { id: "schattenzirkel", name: "Schattenzirkel", prefix: "Schatten" },
  { id: "sturmwacht", name: "Sturmwacht", prefix: "Sturm" },
  { id: "runenschmiede", name: "Runenschmiede", prefix: "Runen" },
  { id: "sternenhof", name: "Sternenhof", prefix: "Sternen" },
  { id: "knochenbund", name: "Knochenbund", prefix: "Knochen" },
];

const UNIT_TITLES = [
  "Vorhut",
  "Klingenrufer",
  "Wächter",
  "Späher",
  "Jäger",
  "Ritter",
  "Seher",
  "Pirscher",
  "Bestie",
  "Herold",
  "Champion",
  "Streiter",
  "Kommandant",
  "Titan",
  "Urgewalt",
];

const SPELL_TITLES = ["Impuls", "Flut", "Siegel", "Urteil", "Eklipse"];
const TRAINER_TITLES = ["Taktiker", "Lehrmeister", "Pfadfinder", "Waffenmeister", "Hohepriester"];

const UNIT_RARITIES = ["common", "common", "common", "common", "common", "rare", "rare", "rare", "rare", "epic", "epic", "epic", "legendary", "ultra", "mythic"];
const SPELL_RARITIES = ["common", "rare", "rare", "epic", "legendary"];
const TRAINER_RARITIES = ["common", "rare", "epic", "ultra", "rare"];

const PACK_DEFINITIONS = {
  starter: {
    id: "starter",
    label: "Starter-Booster",
    tier: "Kostenloser Einstieg",
    price: 65,
    description: "Der günstige Einstieg mit schwächeren Chancen auf hohe Seltenheiten.",
    guaranteed: "common",
    odds: { common: 82, rare: 13, epic: 3.8, legendary: 0.9, ultra: 0.25, mythic: 0.05 },
  },
  market: {
    id: "market",
    label: "Markt-Booster",
    tier: "Standard",
    price: 120,
    description: "Solider Allrounder mit besserem Schnitt als das Starter-Booster.",
    guaranteed: "rare",
    odds: { common: 65, rare: 22, epic: 8, legendary: 3.4, ultra: 1.3, mythic: 0.3 },
  },
  champion: {
    id: "champion",
    label: "Champion-Booster",
    tier: "Fortgeschritten",
    price: 210,
    description: "Deutlich bessere Chancen auf epische und legendäre Treffer.",
    guaranteed: "rare",
    odds: { common: 50, rare: 26, epic: 14, legendary: 6, ultra: 3, mythic: 1 },
  },
  relic: {
    id: "relic",
    label: "Relikt-Booster",
    tier: "Elite",
    price: 340,
    description: "Für gezielte Upgrades mit hoher Ultra-Rare-Chance gedacht.",
    guaranteed: "epic",
    odds: { common: 37, rare: 27, epic: 18, legendary: 10, ultra: 6, mythic: 2 },
  },
  astral: {
    id: "astral",
    label: "Astral-Booster",
    tier: "Luxus",
    price: 520,
    description: "Die teuerste Stufe mit der besten Mythisch-Wahrscheinlichkeit.",
    guaranteed: "legendary",
    odds: { common: 24, rare: 23, epic: 22, legendary: 15, ultra: 11, mythic: 5 },
  },
};

const FUTURE_SHOP_ITEMS = [
  { title: "Kartenhüllen", copy: "Kosmetische Hüllen mit Fraktionsoptik und besonderen Rahmen." },
  { title: "Turnier-Tickets", copy: "Später für Events, Ranglisten und Spezialbelohnungen gedacht." },
  { title: "Account-Dienste", copy: "Profilrahmen, Namensänderungen und saisonale Extras." },
];

const LEGACY_CARDS = [
  createLegacyCard("glutfuchs", "Glutfuchs", "glutorden", "unit", "common", 1, 2, 1, { kind: "damageHero", value: 1 }),
  createLegacyCard("messingwache", "Messingwache", "glutorden", "unit", "common", 2, 1, 4, { kind: "fortifyBoard", value: 1 }),
  createLegacyCard("ascheritter", "Ascheritter", "glutorden", "unit", "rare", 4, 5, 3, { kind: "damageHero", value: 2 }),
  createLegacyCard("sonnenofen-tyrann", "Sonnenofen-Tyrann", "glutorden", "unit", "ultra", 7, 8, 8, { kind: "buffBoard", attack: 2, health: 1 }),
  createLegacyCard("nebelschleicher", "Nebelschleicher", "nebelchor", "unit", "common", 2, 3, 2, { kind: "draw", value: 1 }),
  createLegacyCard("riffseher", "Riffseher", "nebelchor", "trainer", "common", 2, null, null, { kind: "healHero", value: 3 }),
  createLegacyCard("abgrund-orakel", "Abgrund-Orakel", "nebelchor", "unit", "epic", 5, 4, 6, { kind: "draw", value: 2 }),
  createLegacyCard("sturm-leviathan", "Sturm-Leviathan", "nebelchor", "unit", "mythic", 9, 10, 10, { kind: "strikeWeakest", value: 5 }),
  createLegacyCard("hainhüter", "Hainhüter", "wurzelpakt", "unit", "common", 1, 1, 3, { kind: "healHero", value: 2 }),
  createLegacyCard("dornenhetzer", "Dornenhetzer", "wurzelpakt", "unit", "rare", 3, 4, 3, { kind: "buffBoard", attack: 1, health: 0 }),
  createLegacyCard("hirschältester", "Hirschältester", "wurzelpakt", "unit", "epic", 6, 6, 7, { kind: "fortifyBoard", value: 2 }),
  createLegacyCard("wildblüten-avatar", "Wildblüten-Avatar", "wurzelpakt", "unit", "legendary", 7, 7, 9, { kind: "healHero", value: 5 }),
  createLegacyCard("nachtvagant", "Nachtvagant", "schattenzirkel", "unit", "common", 2, 2, 3, { kind: "strikeWeakest", value: 1 }),
  createLegacyCard("schleier-assassine", "Schleier-Assassine", "schattenzirkel", "unit", "rare", 4, 6, 2, { kind: "damageHero", value: 3 }),
  createLegacyCard("mondarchivar", "Mondarchivar", "schattenzirkel", "trainer", "epic", 4, null, null, { kind: "draw", value: 2 }),
  createLegacyCard("finsternis-kaiserin", "Finsternis-Kaiserin", "schattenzirkel", "unit", "legendary", 8, 8, 8, { kind: "strikeWeakest", value: 4 }),
];

const GENERATED_CARDS = buildGeneratedCards();
const CARD_POOL = [...LEGACY_CARDS, ...GENERATED_CARDS];
const CARD_MAP = new Map(CARD_POOL.map((card) => [card.id, card]));
const CARD_POOLS_BY_RARITY = groupCardsByRarity(CARD_POOL);

const elements = {
  authScreen: document.getElementById("authScreen"),
  gameShell: document.getElementById("gameShell"),
  authTabs: [...document.querySelectorAll(".auth-tab")],
  loginForm: document.getElementById("loginForm"),
  registerForm: document.getElementById("registerForm"),
  authMessage: document.getElementById("authMessage"),
  navButtons: [...document.querySelectorAll(".nav-button")],
  sections: {
    shop: document.getElementById("shopSection"),
    marketplace: document.getElementById("marketplaceSection"),
    booster: document.getElementById("boosterSection"),
    collection: document.getElementById("collectionSection"),
    decks: document.getElementById("decksSection"),
    admin: document.getElementById("adminSection"),
    arena: document.getElementById("arenaSection"),
  },
  playerName: document.getElementById("playerName"),
  resourceBar: document.getElementById("resourceBar"),
  resetLocalDataButton: document.getElementById("resetLocalDataButton"),
  logoutButton: document.getElementById("logoutButton"),
  shopPackGrid: document.getElementById("shopPackGrid"),
  futureShopGrid: document.getElementById("futureShopGrid"),
  marketOverview: document.getElementById("marketOverview"),
  marketMovers: document.getElementById("marketMovers"),
  marketGrid: document.getElementById("marketGrid"),
  marketSearchInput: document.getElementById("marketSearchInput"),
  marketRarityFilter: document.getElementById("marketRarityFilter"),
  marketSortSelect: document.getElementById("marketSortSelect"),
  ownedPackGrid: document.getElementById("ownedPackGrid"),
  selectedPackPreview: document.getElementById("selectedPackPreview"),
  openSelectedPackButton: document.getElementById("openSelectedPackButton"),
  openedCardsGrid: document.getElementById("openedCardsGrid"),
  collectionGrid: document.getElementById("collectionGrid"),
  searchInput: document.getElementById("searchInput"),
  sortFilter: document.getElementById("sortFilter"),
  rarityFilter: document.getElementById("rarityFilter"),
  typeFilter: document.getElementById("typeFilter"),
  factionFilter: document.getElementById("factionFilter"),
  costFilter: document.getElementById("costFilter"),
  ownedOnlyToggle: document.getElementById("ownedOnlyToggle"),
  duplicatesOnlyToggle: document.getElementById("duplicatesOnlyToggle"),
  deckNameInput: document.getElementById("deckNameInput"),
  renameDeckButton: document.getElementById("renameDeckButton"),
  newDeckButton: document.getElementById("newDeckButton"),
  duplicateDeckButton: document.getElementById("duplicateDeckButton"),
  deleteDeckButton: document.getElementById("deleteDeckButton"),
  activeDeckMeta: document.getElementById("activeDeckMeta"),
  activeDeckWarnings: document.getElementById("activeDeckWarnings"),
  activeDeckList: document.getElementById("activeDeckList"),
  savedDecksList: document.getElementById("savedDecksList"),
  deckCollectionGrid: document.getElementById("deckCollectionGrid"),
  adminAccountList: document.getElementById("adminAccountList"),
  adminSelectedSummary: document.getElementById("adminSelectedSummary"),
  adminGoldAmount: document.getElementById("adminGoldAmount"),
  grantGoldButton: document.getElementById("grantGoldButton"),
  adminPackSelect: document.getElementById("adminPackSelect"),
  adminPackAmount: document.getElementById("adminPackAmount"),
  grantPackButton: document.getElementById("grantPackButton"),
  adminCardSelect: document.getElementById("adminCardSelect"),
  adminCardAmount: document.getElementById("adminCardAmount"),
  grantCardButton: document.getElementById("grantCardButton"),
  arenaStatus: document.getElementById("arenaStatus"),
  battleHeader: document.getElementById("battleHeader"),
  enemyHeroPanel: document.getElementById("enemyHeroPanel"),
  playerHeroPanel: document.getElementById("playerHeroPanel"),
  enemyBoard: document.getElementById("enemyBoard"),
  playerBoard: document.getElementById("playerBoard"),
  battleLog: document.getElementById("battleLog"),
  playerHand: document.getElementById("playerHand"),
  endTurnButton: document.getElementById("endTurnButton"),
  startMatchButton: document.getElementById("startMatchButton"),
  resetMatchButton: document.getElementById("resetMatchButton"),
  cardModal: document.getElementById("cardModal"),
  cardModalContent: document.getElementById("cardModalContent"),
  closeCardModalButton: document.getElementById("closeCardModalButton"),
  toast: document.getElementById("toast"),
  cardTemplate: document.getElementById("cardTemplate"),
  packTemplate: document.getElementById("packTemplate"),
};

const uiState = {
  authMode: "login",
  section: "shop",
  modalCardId: null,
  adminSelectedUser: null,
  match: null,
  marketFilters: {
    search: "",
    rarity: "all",
    sort: "hot",
  },
  toastTimer: null,
};

let database = loadDatabase();
ensureAdminAccount();
let currentUsername = loadSession();
let currentAccount = currentUsername && database.accounts[currentUsername] ? normalizeAccount(database.accounts[currentUsername]) : null;

bootstrap();

function bootstrap() {
  bindStaticEvents();
  populateFilterControls();
  syncMarketState();
  window.setInterval(handleMarketTick, 60000);
  renderAll();
}

function bindStaticEvents() {
  elements.authTabs.forEach((button) => {
    button.addEventListener("click", () => switchAuthMode(button.dataset.authMode));
  });

  elements.loginForm.addEventListener("submit", handleLogin);
  elements.registerForm.addEventListener("submit", handleRegister);

  elements.navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      uiState.section = button.dataset.section;
      renderAll();
    });
  });

  elements.logoutButton.addEventListener("click", logout);
  elements.resetLocalDataButton.addEventListener("click", resetCurrentAccount);
  elements.openSelectedPackButton.addEventListener("click", () => openPack(getSave().selectedPack));

  elements.searchInput.addEventListener("input", (event) => {
    getSave().filters.search = event.target.value;
    persistCurrentAccount();
    renderCollection();
  });

  elements.marketSearchInput.addEventListener("input", (event) => {
    uiState.marketFilters.search = event.target.value;
    renderMarketplace();
  });

  elements.marketRarityFilter.addEventListener("change", (event) => {
    uiState.marketFilters.rarity = event.target.value;
    renderMarketplace();
  });

  elements.marketSortSelect.addEventListener("change", (event) => {
    uiState.marketFilters.sort = event.target.value;
    renderMarketplace();
  });

  elements.sortFilter.addEventListener("change", (event) => updateFilter("sort", event.target.value));
  elements.rarityFilter.addEventListener("change", (event) => updateFilter("rarity", event.target.value));
  elements.typeFilter.addEventListener("change", (event) => updateFilter("type", event.target.value));
  elements.factionFilter.addEventListener("change", (event) => updateFilter("faction", event.target.value));
  elements.costFilter.addEventListener("change", (event) => updateFilter("cost", event.target.value));
  elements.ownedOnlyToggle.addEventListener("change", (event) => updateFilter("ownedOnly", event.target.checked));
  elements.duplicatesOnlyToggle.addEventListener("change", (event) => updateFilter("duplicatesOnly", event.target.checked));

  elements.renameDeckButton.addEventListener("click", renameActiveDeck);
  elements.newDeckButton.addEventListener("click", createNewDeck);
  elements.duplicateDeckButton.addEventListener("click", duplicateActiveDeck);
  elements.deleteDeckButton.addEventListener("click", deleteActiveDeck);

  elements.startMatchButton.addEventListener("click", startMatch);
  elements.endTurnButton.addEventListener("click", endPlayerTurn);
  elements.resetMatchButton.addEventListener("click", clearMatch);

  elements.grantGoldButton.addEventListener("click", grantGoldToSelectedAccount);
  elements.grantPackButton.addEventListener("click", grantPacksToSelectedAccount);
  elements.grantCardButton.addEventListener("click", grantCardsToSelectedAccount);

  elements.closeCardModalButton.addEventListener("click", closeCardModal);
  elements.cardModal.addEventListener("click", (event) => {
    if (event.target === elements.cardModal) {
      closeCardModal();
    }
  });
}

function populateFilterControls() {
  fillSelect(elements.sortFilter, [
    { value: "rarity-asc", label: "Seltenheit aufsteigend" },
    { value: "rarity-desc", label: "Seltenheit absteigend" },
    { value: "cost-asc", label: "Mana aufsteigend" },
    { value: "cost-desc", label: "Mana absteigend" },
    { value: "owned-desc", label: "Meiste Kopien zuerst" },
    { value: "name-asc", label: "Name A bis Z" },
    { value: "name-desc", label: "Name Z bis A" },
    { value: "market-desc", label: "Höchster Marktwert" },
  ]);
  fillSelect(elements.rarityFilter, [{ value: "all", label: "Alle Seltenheiten" }, ...RARITY_ORDER.map((rarity) => ({ value: rarity, label: RARITY_META[rarity].label }))]);
  fillSelect(elements.typeFilter, [{ value: "all", label: "Alle Typen" }, ...Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label }))]);
  fillSelect(elements.factionFilter, [{ value: "all", label: "Alle Fraktionen" }, ...FACTIONS.map((faction) => ({ value: faction.id, label: faction.name }))]);
  fillSelect(elements.costFilter, [
    { value: "all", label: "Alle Kosten" },
    { value: "0-2", label: "0 bis 2 Mana" },
    { value: "3-5", label: "3 bis 5 Mana" },
    { value: "6-9", label: "6 bis 9 Mana" },
  ]);
  fillSelect(elements.marketRarityFilter, [{ value: "all", label: "Alle Seltenheiten" }, ...RARITY_ORDER.map((rarity) => ({ value: rarity, label: RARITY_META[rarity].label }))]);
  fillSelect(elements.adminPackSelect, Object.values(PACK_DEFINITIONS).map((pack) => ({ value: pack.id, label: pack.label })));
  fillSelect(elements.adminCardSelect, [...CARD_POOL]
    .sort((left, right) => left.name.localeCompare(right.name, "de"))
    .map((card) => ({
      value: card.id,
      label: `${card.name} · ${RarityLabel(card.rarity)} · ${TYPE_LABELS[card.type]}`,
    })));
}

function fillSelect(select, options) {
  select.innerHTML = "";
  options.forEach((option) => {
    const element = document.createElement("option");
    element.value = option.value;
    element.textContent = option.label;
    select.append(element);
  });
}

function switchAuthMode(mode) {
  uiState.authMode = mode;
  elements.authTabs.forEach((button) => button.classList.toggle("active", button.dataset.authMode === mode));
  elements.loginForm.classList.toggle("hidden", mode !== "login");
  elements.registerForm.classList.toggle("hidden", mode !== "register");
  elements.authMessage.textContent = mode === "login"
    ? "Melde dich mit deinem lokalen Testkonto an."
    : "Neue Konten starten mit 0 Karten, 5 kostenlosen Starter-Boostern und etwas Startgold.";
}

function handleRegister(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const username = sanitizeUsername(form.get("username"));
  const password = String(form.get("password") || "");

  if (!username) {
    setAuthMessage("Bitte verwende einen gültigen Spielernamen mit 3 bis 18 Zeichen.");
    return;
  }

  if (password.length < 4) {
    setAuthMessage("Das Passwort muss mindestens 4 Zeichen lang sein.");
    return;
  }

  if (username === ADMIN_BOOTSTRAP.username) {
    setAuthMessage("Dieser Spielername ist reserviert.");
    return;
  }

  if (database.accounts[username]) {
    setAuthMessage("Dieser Spielername existiert bereits.");
    return;
  }

  const account = {
    username,
    passwordHash: simpleHash(password),
    isAdmin: false,
    createdAt: new Date().toISOString(),
    save: createEmptySave(),
  };

  database.accounts[username] = normalizeAccount(account);
  saveDatabase();
  loginAs(username);
  event.currentTarget.reset();
  showToast(`Konto ${username} wurde erstellt.`);
}

function handleLogin(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const username = sanitizeUsername(form.get("username"));
  const password = String(form.get("password") || "");
  const account = username ? database.accounts[username] : null;

  if (!account || account.passwordHash !== simpleHash(password)) {
    setAuthMessage("Spielername oder Passwort sind nicht korrekt.");
    return;
  }

  loginAs(username);
  event.currentTarget.reset();
  showToast(`Willkommen zurück, ${username}.`);
}

function sanitizeUsername(value) {
  const username = String(value || "").trim();
  return /^[A-Za-zÄÖÜäöüß0-9_-]{3,18}$/u.test(username) ? username : "";
}

function simpleHash(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `${hash >>> 0}`;
}

function setAuthMessage(message) {
  elements.authMessage.textContent = message;
}

function loginAs(username) {
  currentUsername = username;
  currentAccount = normalizeAccount(database.accounts[username]);
  database.accounts[username] = currentAccount;
  uiState.adminSelectedUser = null;
  localStorage.setItem(STORAGE_KEYS.session, username);
  switchAuthMode("login");
  renderAll();
}

function logout() {
  currentUsername = null;
  currentAccount = null;
  localStorage.removeItem(STORAGE_KEYS.session);
  uiState.match = null;
  uiState.modalCardId = null;
  uiState.adminSelectedUser = null;
  renderAll();
}

function resetCurrentAccount() {
  if (!currentAccount) {
    return;
  }

  const confirmed = window.confirm("Möchtest du wirklich nur dieses Konto zurücksetzen? Karten, Gold, Booster und Decks gehen dabei verloren.");

  if (!confirmed) {
    return;
  }

  currentAccount.save = createEmptySave();
  persistCurrentAccount();
  uiState.match = null;
  uiState.modalCardId = null;
  renderAll();
  showToast("Das Konto wurde lokal zurückgesetzt.");
}

function updateFilter(key, value) {
  getSave().filters[key] = value;
  persistCurrentAccount();
  renderCollection();
}

function createEmptySave() {
  const firstDeck = createDeck("Erstes Deck");
  return {
    gold: APP_CONFIG.baseGold,
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
    selectedPack: "starter",
    lastOpened: {
      packId: "starter",
      cards: [],
      openedAt: null,
    },
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

function createDeck(name, cards = []) {
  return {
    id: `deck-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    name,
    cards: [...cards],
  };
}

function normalizeAccount(account) {
  const baseSave = createEmptySave();
  const save = account.save || baseSave;
  const isAdmin = account.username === ADMIN_BOOTSTRAP.username;
  const normalized = {
    ...account,
    passwordHash: isAdmin ? ADMIN_BOOTSTRAP.passwordHash : account.passwordHash,
    isAdmin,
    save: {
      ...baseSave,
      ...save,
      collection: { ...baseSave.collection, ...save.collection },
      packs: { ...baseSave.packs, ...save.packs },
      filters: { ...baseSave.filters, ...save.filters },
      lastOpened: { ...baseSave.lastOpened, ...save.lastOpened },
      decks: Array.isArray(save.decks) && save.decks.length
        ? save.decks.map((deck) => ({ ...deck, cards: Array.isArray(deck.cards) ? [...deck.cards] : [] }))
        : baseSave.decks,
    },
  };

  if (!normalized.save.decks.some((deck) => deck.id === normalized.save.activeDeckId)) {
    normalized.save.activeDeckId = normalized.save.decks[0].id;
  }

  if (!PACK_DEFINITIONS[normalized.save.selectedPack]) {
    normalized.save.selectedPack = "starter";
  }

  return normalized;
}

function ensureAdminAccount() {
  const existing = database.accounts[ADMIN_BOOTSTRAP.username];
  const normalized = normalizeAccount({
    ...existing,
    username: ADMIN_BOOTSTRAP.username,
    passwordHash: ADMIN_BOOTSTRAP.passwordHash,
    isAdmin: true,
    createdAt: existing?.createdAt || new Date().toISOString(),
    save: existing?.save || createEmptySave(),
  });
  const before = existing ? JSON.stringify(existing) : "";
  const after = JSON.stringify(normalized);
  database.accounts[ADMIN_BOOTSTRAP.username] = normalized;

  if (before !== after) {
    saveDatabase();
  }
}

function isCurrentUserAdmin() {
  return Boolean(currentAccount?.isAdmin);
}

function getSave() {
  return currentAccount?.save;
}

function loadDatabase() {
  const raw = localStorage.getItem(STORAGE_KEYS.database);

  if (!raw) {
    return { version: 2, accounts: {}, market: createInitialMarketState() };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      version: 2,
      accounts: parsed.accounts || {},
      market: normalizeMarketState(parsed.market),
    };
  } catch {
    return { version: 2, accounts: {}, market: createInitialMarketState() };
  }
}

function loadSession() {
  return localStorage.getItem(STORAGE_KEYS.session);
}

function saveDatabase() {
  localStorage.setItem(STORAGE_KEYS.database, JSON.stringify(database));
}

function persistCurrentAccount() {
  if (!currentAccount) {
    return;
  }

  database.accounts[currentAccount.username] = normalizeAccount(currentAccount);
  currentAccount = database.accounts[currentAccount.username];
  saveDatabase();
}

function handleMarketTick() {
  const changed = syncMarketState();

  if (changed && currentAccount) {
    renderAll();
  }
}

function syncMarketState() {
  const market = database.market || createInitialMarketState();
  const currentHourKey = getCurrentHourKey();
  let updated = false;

  if (!market.lastHourKey) {
    market.lastHourKey = currentHourKey;
    database.market = market;
    saveDatabase();
    return true;
  }

  const elapsedHours = getElapsedHourCount(market.lastHourKey, currentHourKey);

  if (elapsedHours <= 0) {
    database.market = market;
    return false;
  }

  const steps = Math.min(elapsedHours, 48);

  for (let step = 0; step < steps; step += 1) {
    updateMarketForHour(market);
    updated = true;
  }

  market.lastHourKey = currentHourKey;
  database.market = market;
  saveDatabase();
  return updated;
}

function createInitialMarketState() {
  const cards = {};

  CARD_POOL.forEach((card) => {
    const anchor = getMarketAnchor(card);
    const openingNoise = 0.92 + Math.random() * 0.16;
    const basePrice = Math.max(4, Math.round(anchor * openingNoise));
    cards[card.id] = {
      price: basePrice,
      buyPrice: Math.max(basePrice + 2, Math.round(basePrice * 1.1)),
      demand: 48 + Math.floor(Math.random() * 10),
      supply: 48 + Math.floor(Math.random() * 10),
      momentum: 0,
      lastDeltaPct: 0,
      tradePressure: 0,
    };
  });

  return {
    lastHourKey: getCurrentHourKey(),
    feeVault: 0,
    cards,
  };
}

function normalizeMarketState(market) {
  const base = createInitialMarketState();

  if (!market || typeof market !== "object") {
    return base;
  }

  const normalized = {
    lastHourKey: typeof market.lastHourKey === "string" ? market.lastHourKey : base.lastHourKey,
    feeVault: Number.isFinite(market.feeVault) ? market.feeVault : base.feeVault,
    cards: { ...base.cards },
  };

  Object.entries(base.cards).forEach(([cardId, entry]) => {
    if (market.cards && market.cards[cardId]) {
      normalized.cards[cardId] = {
        ...entry,
        ...market.cards[cardId],
      };
    }
  });

  return normalized;
}

function updateMarketForHour(market) {
  CARD_POOL.forEach((card) => {
    const state = market.cards[card.id];
    const anchor = getMarketAnchor(card);
    const rarityDemandBias = { common: -1.4, rare: -0.4, epic: 0.8, legendary: 1.4, ultra: 2.2, mythic: 3 }[card.rarity];
    const raritySupplyBias = { common: 2.4, rare: 1.2, epic: 0.4, legendary: -0.6, ultra: -1.4, mythic: -2.2 }[card.rarity];
    const tradePressure = state.tradePressure || 0;
    const randomSwing = randomBetween(-0.055, 0.055);
    const specialEvent = Math.random() < 0.035 ? randomBetween(-0.14, 0.18) : 0;

    state.demand = clamp(8, 96, state.demand * 0.82 + 9 + rarityDemandBias + Math.max(0, tradePressure) * 3.2 + randomBetween(-7, 7));
    state.supply = clamp(8, 96, state.supply * 0.82 + 9 + raritySupplyBias + Math.max(0, -tradePressure) * 3.1 + randomBetween(-7, 7));

    const pressure = (state.demand - state.supply) / 105;
    state.momentum = clamp(-0.75, 0.95, state.momentum * 0.46 + pressure + randomSwing + specialEvent);

    const targetPrice = anchor * (1 + state.momentum);
    const nextPrice = clamp(Math.round(anchor * 0.45), Math.round(anchor * 2.85), Math.round(state.price * 0.42 + targetPrice * 0.58));
    state.lastDeltaPct = Number((((nextPrice - state.price) / Math.max(1, state.price)) * 100).toFixed(1));
    state.price = Math.max(4, nextPrice);
    state.buyPrice = Math.max(state.price + 2, Math.round(state.price * 1.11));
    state.tradePressure = Number((tradePressure * 0.24).toFixed(2));
  });
}

function getCurrentHourKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}`;
}

function getElapsedHourCount(fromHourKey, toHourKey) {
  const from = new Date(`${fromHourKey}:00:00`);
  const to = new Date(`${toHourKey}:00:00`);
  return Math.max(0, Math.floor((to.getTime() - from.getTime()) / 3600000));
}

function getMarketAnchor(card) {
  const rarityFactor = { common: 1, rare: 1.3, epic: 1.8, legendary: 2.35, ultra: 3.05, mythic: 4.1 }[card.rarity];
  const typeFactor = { unit: 1.05, spell: 1.12, trainer: 1.16 }[card.type];
  return Math.round((RARITY_META[card.rarity].sellValue * 1.6 + (card.cost || 0) * 6 + 10) * rarityFactor * typeFactor / 2.25);
}

function getMarketEntry(cardId) {
  return database.market.cards[cardId];
}

function getMarketSellPrice(cardId) {
  return getMarketEntry(cardId).price;
}

function getMarketBuyPrice(cardId) {
  return getMarketEntry(cardId).buyPrice;
}

function getMarketSaleQuote(cardId, amount = 1) {
  const quantity = Math.max(1, amount);
  const gross = getMarketSellPrice(cardId) * quantity;
  const fee = Math.max(1, Math.round(gross * MARKETPLACE_FEE_RATE));
  return {
    gross,
    fee,
    net: Math.max(0, gross - fee),
  };
}

function recordMarketTrade(cardId, direction, amount) {
  const entry = getMarketEntry(cardId);
  const movement = Math.min(5, amount * 0.7);
  entry.tradePressure += direction === "buy" ? movement : -movement;
}

function summarizeSave(save) {
  return {
    totalCards: Object.values(save.collection).reduce((sum, value) => sum + value, 0),
    uniqueCards: Object.values(save.collection).filter((value) => value > 0).length,
    totalBoosters: Object.values(save.packs).reduce((sum, value) => sum + value, 0),
  };
}

function getNextMarketUpdateLabel() {
  const now = new Date();
  const next = new Date(now);
  next.setMinutes(0, 0, 0);
  next.setHours(next.getHours() + 1);
  const diffMs = next.getTime() - now.getTime();
  const totalMinutes = Math.max(1, Math.floor(diffMs / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function clamp(minimum, maximum, value) {
  return Math.min(maximum, Math.max(minimum, value));
}

function randomBetween(minimum, maximum) {
  return minimum + Math.random() * (maximum - minimum);
}

function renderAll() {
  syncMarketState();
  const signedIn = Boolean(currentAccount);
  elements.authScreen.classList.toggle("hidden", signedIn);
  elements.gameShell.classList.toggle("hidden", !signedIn);

  if (!signedIn) {
    return;
  }

  if (!isCurrentUserAdmin() && uiState.section === "admin") {
    uiState.section = "shop";
  }

  elements.playerName.textContent = currentAccount.username;
  elements.searchInput.value = getSave().filters.search;
  elements.sortFilter.value = getSave().filters.sort;
  elements.marketSearchInput.value = uiState.marketFilters.search;
  elements.marketRarityFilter.value = uiState.marketFilters.rarity;
  elements.marketSortSelect.value = uiState.marketFilters.sort;
  elements.rarityFilter.value = getSave().filters.rarity;
  elements.typeFilter.value = getSave().filters.type;
  elements.factionFilter.value = getSave().filters.faction;
  elements.costFilter.value = getSave().filters.cost;
  elements.ownedOnlyToggle.checked = Boolean(getSave().filters.ownedOnly);
  elements.duplicatesOnlyToggle.checked = Boolean(getSave().filters.duplicatesOnly);

  renderNavigation();
  renderResources();
  renderShop();
  renderMarketplace();
  renderBoosterLab();
  renderCollection();
  renderDeckManager();
  renderAdminPanel();
  renderArena();
  renderCardModal();
}

function renderNavigation() {
  const adminVisible = isCurrentUserAdmin();

  elements.navButtons.forEach((button) => {
    const adminOnly = button.dataset.adminOnly === "true";
    button.classList.toggle("hidden", adminOnly && !adminVisible);
    button.classList.toggle("active", button.dataset.section === uiState.section);
  });

  Object.entries(elements.sections).forEach(([key, section]) => {
    const adminOnly = section.dataset.adminOnly === "true";
    section.classList.toggle("hidden", adminOnly && !adminVisible);
    section.classList.toggle("active", key === uiState.section && (!adminOnly || adminVisible));
  });
}

function renderResources() {
  const save = getSave();
  const { totalCards, uniqueCards, totalBoosters } = summarizeSave(save);
  const activeDeck = getActiveDeck();

  elements.resourceBar.innerHTML = "";

  const chips = [
    { label: "Gold", value: save.gold },
    { label: "Karten", value: totalCards },
    { label: "Einzigartig", value: uniqueCards },
    { label: "Booster", value: totalBoosters },
    { label: "Aktives Deck", value: activeDeck ? activeDeck.cards.length : 0 },
  ];

  chips.forEach((chipData) => {
    const chip = document.createElement("div");
    chip.className = "resource-chip";
    chip.innerHTML = `<span>${chipData.label}</span><strong>${chipData.value}</strong>`;
    elements.resourceBar.append(chip);
  });
}

function renderAdminPanel() {
  if (!isCurrentUserAdmin()) {
    elements.adminAccountList.innerHTML = "";
    elements.adminSelectedSummary.innerHTML = "";
    return;
  }

  const accounts = Object.values(database.accounts)
    .map((account) => normalizeAccount(account))
    .sort((left, right) => Number(right.isAdmin) - Number(left.isAdmin) || left.username.localeCompare(right.username, "de"));

  if (!accounts.some((account) => account.username === uiState.adminSelectedUser)) {
    uiState.adminSelectedUser = accounts.find((account) => !account.isAdmin)?.username || accounts[0]?.username || null;
  }

  const selectedAccount = uiState.adminSelectedUser ? normalizeAccount(database.accounts[uiState.adminSelectedUser]) : null;
  elements.adminAccountList.innerHTML = "";

  accounts.forEach((account) => {
    const stats = summarizeSave(account.save);
    const item = document.createElement("button");
    item.type = "button";
    item.className = `admin-account-card ${account.username === uiState.adminSelectedUser ? "active" : ""}`;
    item.innerHTML = `
      <div class="admin-card-head">
        <strong>${account.username}</strong>
        <div class="admin-badges">
          ${account.isAdmin ? '<span class="admin-badge">Admin</span>' : ""}
          ${account.username === currentAccount.username ? '<span class="admin-badge subtle">Aktive Sitzung</span>' : ""}
        </div>
      </div>
      <div class="admin-card-meta">
        <span>${account.save.gold} Gold</span>
        <span>${stats.totalCards} Karten</span>
        <span>${stats.totalBoosters} Booster</span>
      </div>
    `;
    item.addEventListener("click", () => {
      uiState.adminSelectedUser = account.username;
      renderAdminPanel();
    });
    elements.adminAccountList.append(item);
  });

  if (!selectedAccount) {
    elements.adminSelectedSummary.innerHTML = '<p class="mini-note">Es steht kein Konto für die Verwaltung bereit.</p>';
    [elements.adminGoldAmount, elements.grantGoldButton, elements.adminPackSelect, elements.adminPackAmount, elements.grantPackButton, elements.adminCardSelect, elements.adminCardAmount, elements.grantCardButton]
      .forEach((element) => {
        element.disabled = true;
      });
    return;
  }

  const stats = summarizeSave(selectedAccount.save);
  const packLines = Object.values(PACK_DEFINITIONS)
    .map((pack) => `<div class="price-line"><span>${pack.label}</span><strong>${selectedAccount.save.packs[pack.id]}</strong></div>`)
    .join("");

  elements.adminSelectedSummary.innerHTML = `
    <div class="admin-summary-head">
      <div>
        <p class="eyebrow">Ausgewähltes Konto</p>
        <h3>${selectedAccount.username}</h3>
      </div>
      <div class="admin-badges">
        ${selectedAccount.isAdmin ? '<span class="admin-badge">Admin</span>' : '<span class="admin-badge subtle">Spielkonto</span>'}
      </div>
    </div>
    <div class="admin-stat-grid">
      <article class="admin-stat-card">
        <span>Gold</span>
        <strong>${selectedAccount.save.gold}</strong>
      </article>
      <article class="admin-stat-card">
        <span>Karten gesamt</span>
        <strong>${stats.totalCards}</strong>
      </article>
      <article class="admin-stat-card">
        <span>Einzigartige Karten</span>
        <strong>${stats.uniqueCards}</strong>
      </article>
      <article class="admin-stat-card">
        <span>Gespeicherte Decks</span>
        <strong>${selectedAccount.save.decks.length}</strong>
      </article>
    </div>
    <div class="detail-block admin-summary-block">
      <h4>Boosterbestand</h4>
      <div class="price-stack">${packLines}</div>
    </div>
  `;

  [elements.adminGoldAmount, elements.grantGoldButton, elements.adminPackSelect, elements.adminPackAmount, elements.grantPackButton, elements.adminCardSelect, elements.adminCardAmount, elements.grantCardButton]
    .forEach((element) => {
      element.disabled = false;
    });
}

function renderShop() {
  elements.shopPackGrid.innerHTML = "";
  elements.futureShopGrid.innerHTML = "";

  Object.values(PACK_DEFINITIONS).forEach((pack) => {
    elements.shopPackGrid.append(createPackCard(pack.id, "shop"));
  });

  FUTURE_SHOP_ITEMS.forEach((item) => {
    const card = document.createElement("article");
    card.className = "future-card";
    card.innerHTML = `<h4>${item.title}</h4><p>${item.copy}</p>`;
    elements.futureShopGrid.append(card);
  });
}

function renderMarketplace() {
  const marketCards = CARD_POOL.map((card) => ({
    card,
    entry: getMarketEntry(card.id),
  }));

  const hottest = [...marketCards].sort((left, right) => right.entry.lastDeltaPct - left.entry.lastDeltaPct);
  const coldest = [...marketCards].sort((left, right) => left.entry.lastDeltaPct - right.entry.lastDeltaPct);
  const mostValuable = [...marketCards].sort((left, right) => right.entry.price - left.entry.price);
  const filters = uiState.marketFilters;

  elements.marketOverview.innerHTML = "";
  elements.marketMovers.innerHTML = "";
  elements.marketGrid.innerHTML = "";

  [
    {
      title: "Nächste Marktstunde",
      value: getNextMarketUpdateLabel(),
      text: "Bis zur nächsten automatischen Preisrunde.",
    },
    {
      title: "Heißeste Karte",
      value: hottest[0].card.name,
      text: `${formatDelta(hottest[0].entry.lastDeltaPct)} in der letzten Stunde`,
    },
    {
      title: "Stabiler Marktwert",
      value: `${mostValuable[0].entry.price} Gold`,
      text: `${mostValuable[0].card.name} führt aktuell den Markt an.`,
    },
    {
      title: "Marktstimmung",
      value: getMarketMoodLabel(),
      text: "Basiert auf durchschnittlicher Nachfrage gegen Angebot.",
    },
    {
      title: "Gebührenpool",
      value: `${database.market.feeVault} Gold`,
      text: "7 % Marktplatzgebühr werden als serverseitiger Anteil reserviert.",
    },
  ].forEach((info) => {
    const card = document.createElement("article");
    card.className = "market-card";
    card.innerHTML = `<p class="eyebrow">${info.title}</p><strong>${info.value}</strong><span>${info.text}</span>`;
    elements.marketOverview.append(card);
  });

  createMoverCard("Größter Gewinner", hottest[0], "positive");
  createMoverCard("Stärkster Rückgang", coldest[0], "negative");

  const visibleCards = marketCards
    .filter(({ card }) => filters.rarity === "all" || card.rarity === filters.rarity)
    .filter(({ card }) => card.name.toLowerCase().includes(filters.search.toLowerCase().trim()))
    .sort((left, right) => sortMarketCards(left, right, filters.sort));

  visibleCards.forEach(({ card, entry }) => {
    const saleQuote = getMarketSaleQuote(card.id);
    elements.marketGrid.append(renderCard(card, {
      context: "marketplace",
      buttons: [
        {
          label: `Kaufen ${entry.buyPrice}G`,
          disabled: getSave().gold < entry.buyPrice,
          handler: () => buyCardOnMarket(card.id),
        },
        {
          label: `Verkaufen netto ${saleQuote.net}G`,
          disabled: getOwnedCopies(card.id) < 1,
          handler: () => sellCardOnMarket(card.id, 1),
        },
      ],
      footer: `Markt brutto ${saleQuote.gross} Gold · Gebühr ${saleQuote.fee} Gold · Auszahlung ${saleQuote.net} Gold · Ankauf ${entry.buyPrice} Gold · ${formatDelta(entry.lastDeltaPct)}`,
    }));
  });

  if (!visibleCards.length) {
    elements.marketGrid.innerHTML = `
      <div class="info-panel">
        <h3 class="subheading">Keine Marktangebote im Filter</h3>
        <p class="mini-note">Passe Suche oder Seltenheit an, um mehr Karten anzuzeigen.</p>
      </div>
    `;
  }
}

function createMoverCard(title, payload, tone) {
  const card = document.createElement("article");
  card.className = `mover-card ${tone}`;
  card.innerHTML = `
    <p class="eyebrow">${title}</p>
    <strong>${payload.card.name}</strong>
    <span>${RarityLabel(payload.card.rarity)} · ${TYPE_LABELS[payload.card.type]}</span>
    <span>Marktwert ${payload.entry.price} Gold · ${formatDelta(payload.entry.lastDeltaPct)}</span>
  `;
  elements.marketMovers.append(card);
}

function sortMarketCards(left, right, mode) {
  switch (mode) {
    case "cold":
      return left.entry.lastDeltaPct - right.entry.lastDeltaPct || left.card.name.localeCompare(right.card.name, "de");
    case "value-desc":
      return right.entry.price - left.entry.price || left.card.name.localeCompare(right.card.name, "de");
    case "value-asc":
      return left.entry.price - right.entry.price || left.card.name.localeCompare(right.card.name, "de");
    case "name":
      return left.card.name.localeCompare(right.card.name, "de");
    case "hot":
    default:
      return right.entry.lastDeltaPct - left.entry.lastDeltaPct || right.entry.price - left.entry.price;
  }
}

function sortCollectionCards(left, right, mode) {
  switch (mode) {
    case "rarity-desc":
      return RARITY_ORDER.indexOf(right.rarity) - RARITY_ORDER.indexOf(left.rarity)
        || right.cost - left.cost
        || left.name.localeCompare(right.name, "de");
    case "cost-asc":
      return left.cost - right.cost
        || sortCardsForDisplay(left, right);
    case "cost-desc":
      return right.cost - left.cost
        || sortCardsForDisplay(left, right);
    case "owned-desc":
      return getOwnedCopies(right.id) - getOwnedCopies(left.id)
        || sortCardsForDisplay(left, right);
    case "name-asc":
      return left.name.localeCompare(right.name, "de");
    case "name-desc":
      return right.name.localeCompare(left.name, "de");
    case "market-desc":
      return getMarketSellPrice(right.id) - getMarketSellPrice(left.id)
        || sortCardsForDisplay(left, right);
    case "rarity-asc":
    default:
      return sortCardsForDisplay(left, right);
  }
}

function matchesCostFilter(card, filter) {
  switch (filter) {
    case "0-2":
      return card.cost >= 0 && card.cost <= 2;
    case "3-5":
      return card.cost >= 3 && card.cost <= 5;
    case "6-9":
      return card.cost >= 6 && card.cost <= 9;
    case "all":
    default:
      return true;
  }
}

function getMarketMoodLabel() {
  const entries = Object.values(database.market.cards);
  const averageDemand = entries.reduce((sum, entry) => sum + entry.demand, 0) / entries.length;
  const averageSupply = entries.reduce((sum, entry) => sum + entry.supply, 0) / entries.length;
  const balance = averageDemand - averageSupply;

  if (balance > 4) {
    return "Käufermarkt";
  }

  if (balance < -4) {
    return "Verkäuferdruck";
  }

  return "Ausgeglichen";
}

function formatDelta(delta) {
  return `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`;
}

function renderBoosterLab() {
  const save = getSave();
  elements.ownedPackGrid.innerHTML = "";
  elements.openedCardsGrid.innerHTML = "";

  Object.values(PACK_DEFINITIONS).forEach((pack) => {
    elements.ownedPackGrid.append(createPackCard(pack.id, "owned"));
  });

  const selectedPack = PACK_DEFINITIONS[save.selectedPack];
  elements.selectedPackPreview.innerHTML = `
    <p class="eyebrow">${selectedPack.tier}</p>
    <h3>${selectedPack.label}</h3>
    <p class="pack-copy">${selectedPack.description}</p>
    <p class="pack-price">Im Besitz: ${save.packs[selectedPack.id]} Booster</p>
  `;

  elements.openSelectedPackButton.disabled = save.packs[selectedPack.id] <= 0;

  if (!save.lastOpened.cards.length) {
    elements.openedCardsGrid.innerHTML = `
      <div class="info-panel">
        <h3 class="subheading">Noch kein Booster geöffnet</h3>
        <p class="mini-note">Wähle links ein Booster aus und öffne es. Die letzten gezogenen Karten werden hier angezeigt.</p>
      </div>
    `;
    return;
  }

  save.lastOpened.cards.map(getCard).forEach((card) => {
    elements.openedCardsGrid.append(renderCard(card, { context: "opened" }));
  });
}

function renderCollection() {
  const save = getSave();
  const filters = save.filters;
  elements.collectionGrid.innerHTML = "";

  const visibleCards = CARD_POOL
    .filter((card) => !filters.ownedOnly || getOwnedCopies(card.id) > 0)
    .filter((card) => !filters.duplicatesOnly || getOwnedCopies(card.id) > 1)
    .filter((card) => filters.rarity === "all" || card.rarity === filters.rarity)
    .filter((card) => filters.type === "all" || card.type === filters.type)
    .filter((card) => filters.faction === "all" || card.faction === filters.faction)
    .filter((card) => matchesCostFilter(card, filters.cost))
    .filter((card) => card.name.toLowerCase().includes(filters.search.toLowerCase().trim()))
    .sort((left, right) => sortCollectionCards(left, right, filters.sort));

  if (!visibleCards.length) {
    elements.collectionGrid.innerHTML = `
      <div class="info-panel">
        <h3 class="subheading">Keine Karten gefunden</h3>
        <p class="mini-note">Passe deine Filter an oder öffne mehr Booster.</p>
      </div>
    `;
    return;
  }

  visibleCards.forEach((card) => {
    elements.collectionGrid.append(renderCard(card, { context: "collection" }));
  });
}

function renderDeckManager() {
  const activeDeck = getActiveDeck();
  const validation = validateDeck(activeDeck);
  elements.activeDeckMeta.innerHTML = "";
  elements.activeDeckWarnings.innerHTML = "";
  elements.activeDeckList.innerHTML = "";
  elements.savedDecksList.innerHTML = "";
  elements.deckCollectionGrid.innerHTML = "";

  elements.deckNameInput.value = activeDeck?.name || "";

  [
    `Karten ${activeDeck.cards.length}/${APP_CONFIG.deckSize}`,
    `Einheiten ${countByType(activeDeck.cards, "unit")}`,
    `Zauber ${countByType(activeDeck.cards, "spell")}`,
    `Trainer ${countByType(activeDeck.cards, "trainer")}`,
  ].forEach((text) => {
    const chip = document.createElement("div");
    chip.className = "meta-chip";
    chip.textContent = text;
    elements.activeDeckMeta.append(chip);
  });

  if (validation.valid) {
    const ok = document.createElement("div");
    ok.className = "warning-item ok";
    ok.textContent = "Deck ist spielbar.";
    elements.activeDeckWarnings.append(ok);
  } else {
    validation.messages.forEach((message) => {
      const warning = document.createElement("div");
      warning.className = "warning-item";
      warning.textContent = message;
      elements.activeDeckWarnings.append(warning);
    });
  }

  if (!activeDeck.cards.length) {
    elements.activeDeckList.innerHTML = `
      <div class="info-panel">
        <h3 class="subheading">Leeres Deck</h3>
        <p class="mini-note">Füge Karten aus deiner Sammlung hinzu, damit das Deck spielbar wird.</p>
      </div>
    `;
  } else {
    [...new Set(activeDeck.cards)]
      .map((cardId) => ({ card: getCard(cardId), count: countCopiesInArray(activeDeck.cards, cardId) }))
      .sort((left, right) => sortCardsForDisplay(left.card, right.card))
      .forEach(({ card, count }) => {
        const entry = document.createElement("div");
        entry.className = "deck-entry";
        entry.innerHTML = `
          <div class="saved-deck-head">
            <strong>${card.name} ×${count}</strong>
            <span class="status-pill ${getOwnedCopies(card.id) >= count ? "ok" : "warn"}">${RarityLabel(card.rarity)}</span>
          </div>
          <p>${TYPE_LABELS[card.type]} · ${getFaction(card.faction).name}</p>
        `;
        const actions = document.createElement("div");
        actions.className = "card-actions";
        actions.append(
          createActionButton("Details", () => openCardModal(card.id)),
          createActionButton("Entfernen", () => removeCardFromActiveDeck(card.id)),
        );
        entry.append(actions);
        elements.activeDeckList.append(entry);
      });
  }

  getSave().decks.forEach((deck) => {
    const deckValidation = validateDeck(deck);
    const card = document.createElement("div");
    card.className = `saved-deck-card ${deck.id === getSave().activeDeckId ? "active" : ""}`;
    card.innerHTML = `
      <div class="saved-deck-head">
        <strong>${deck.name}</strong>
        <span class="status-pill ${deckValidation.valid ? "ok" : "warn"}">${deckValidation.valid ? "Spielbar" : "Blockiert"}</span>
      </div>
      <p>${deck.cards.length}/${APP_CONFIG.deckSize} Karten</p>
    `;
    const actions = document.createElement("div");
    actions.className = "card-actions";
    actions.append(
      createActionButton("Aktivieren", () => activateDeck(deck.id)),
      createActionButton("Duplizieren", () => duplicateDeck(deck.id)),
    );
    card.append(actions);
    elements.savedDecksList.append(card);
  });

  CARD_POOL
    .filter((card) => getOwnedCopies(card.id) > 0)
    .sort(sortCardsForDisplay)
    .forEach((card) => {
      const usedCopies = countCopiesInArray(activeDeck.cards, card.id);
      const ownedCopies = getOwnedCopies(card.id);
      elements.deckCollectionGrid.append(renderCard(card, {
        context: "deckBuilder",
        buttons: [
          {
            label: usedCopies < ownedCopies && activeDeck.cards.length < APP_CONFIG.deckSize ? "Hinzufügen" : "Nicht verfügbar",
            disabled: usedCopies >= ownedCopies || activeDeck.cards.length >= APP_CONFIG.deckSize,
            handler: () => addCardToActiveDeck(card.id),
          },
        ],
        footer: `Im Deck ${usedCopies}/${ownedCopies}`,
      }));
    });
}

function renderArena() {
  const activeDeck = getActiveDeck();
  const validation = validateDeck(activeDeck);
  elements.battleHeader.innerHTML = "";
  elements.enemyHeroPanel.innerHTML = "";
  elements.playerHeroPanel.innerHTML = "";
  elements.enemyBoard.innerHTML = "";
  elements.playerBoard.innerHTML = "";
  elements.battleLog.innerHTML = "";
  elements.playerHand.innerHTML = "";
  elements.endTurnButton.disabled = true;

  if (!uiState.match) {
    elements.arenaStatus.innerHTML = validation.valid
      ? `<span class="status-pill ok">Bereit</span> <span>Das aktive Deck ist spielbar. Du kannst ein Match starten.</span>`
      : `<span class="status-pill warn">Nicht bereit</span> <span>${validation.messages.join(" ")}</span>`;
    elements.startMatchButton.disabled = !validation.valid;
    elements.resetMatchButton.disabled = true;
    elements.battleHeader.innerHTML = `<span class="status-pill turn">Kein aktives Match</span><span>Die Arena nutzt ein vereinfachtes rundenbasiertes System mit Hand, Mana, Einheiten, Zaubern und Trainern.</span>`;
    elements.enemyHeroPanel.innerHTML = `<p class="eyebrow">Gegner</p><div class="hero-line"><strong>24</strong><span>Wartet</span></div>`;
    elements.playerHeroPanel.innerHTML = `<p class="eyebrow">Du</p><div class="hero-line"><strong>24</strong><span>Wartet</span></div>`;
    elements.battleLog.innerHTML = `<div class="log-entry">Starte ein neues Match, sobald dein aktives Deck gültig ist.</div>`;
    elements.playerHand.innerHTML = `<div class="info-panel"><h3 class="subheading">Keine Handkarten</h3><p class="mini-note">Ein Match erstellt automatisch deine Starthand.</p></div>`;
    return;
  }

  const match = uiState.match;
  const matchFinished = match.status === "won" || match.status === "lost";
  elements.startMatchButton.disabled = !validation.valid;
  elements.resetMatchButton.disabled = false;

  elements.arenaStatus.innerHTML = matchFinished
    ? `<span class="status-pill ${match.status === "won" ? "ok" : "warn"}">${match.status === "won" ? "Sieg" : "Niederlage"}</span> <span>${match.statusMessage}</span>`
    : `<span class="status-pill turn">${match.phase === "player" ? "Dein Zug" : "Gegnerischer Zug"}</span> <span>${match.statusMessage}</span>`;

  elements.battleHeader.innerHTML = `
    <span class="meta-chip">Runde ${match.turn}</span>
    <span class="meta-chip">Mana ${match.player.mana}/${match.player.maxMana}</span>
    <span class="meta-chip">Dein Deck ${match.player.deck.length}</span>
    <span class="meta-chip">Gegnerisches Deck ${match.enemy.deck.length}</span>
  `;

  renderHeroPanel(elements.enemyHeroPanel, "Gegner", match.enemy, match.phase === "enemy");
  renderHeroPanel(elements.playerHeroPanel, "Du", match.player, match.phase === "player");

  match.enemy.board.forEach((unit) => {
    elements.enemyBoard.append(renderCard(getCard(unit.cardId), {
      context: "board",
      stateOverride: unit,
      footer: unit.canAttack ? "Angriffsbereit" : "Bereit nächste Runde",
    }));
  });

  match.player.board.forEach((unit) => {
    const canAttack = match.phase === "player" && unit.canAttack && !matchFinished;
    elements.playerBoard.append(renderCard(getCard(unit.cardId), {
      context: "board",
      stateOverride: unit,
      buttons: [
        {
          label: canAttack ? "Angreifen" : "Warten",
          disabled: !canAttack,
          handler: () => attackWithUnit(unit.uid),
        },
      ],
      footer: unit.canAttack ? "Greift die schwächste gegnerische Einheit an." : "Noch nicht bereit",
    }));
  });

  match.log.slice().reverse().forEach((entry) => {
    const row = document.createElement("div");
    row.className = "log-entry";
    row.innerHTML = `<strong>${entry.turn}</strong> ${entry.text}`;
    elements.battleLog.append(row);
  });

  match.player.hand.forEach((cardId, index) => {
    const card = getCard(cardId);
    const playable = canPlayCard(card, index);
    elements.playerHand.append(renderCard(card, {
      context: "hand",
      buttons: [
        {
          label: playable ? "Spielen" : "Zu teuer",
          disabled: !playable,
          handler: () => playCard(index),
        },
      ],
      footer: match.phase === "player" ? "Klickbar für Details, Spielen nutzt Mana." : "Während des Gegnerzugs gesperrt",
    }));
  });

  elements.endTurnButton.disabled = match.phase !== "player" || matchFinished;
}

function renderHeroPanel(container, label, sideState, active) {
  container.innerHTML = `
    <p class="eyebrow">${label}</p>
    <div class="hero-line">
      <strong>${sideState.hero}</strong>
      <span class="status-pill ${active ? "turn" : "ok"}">${active ? "Aktiv" : "Wartet"}</span>
    </div>
    <div class="meta-chip-row">
      <span class="meta-chip">Mana ${sideState.mana}/${sideState.maxMana}</span>
      <span class="meta-chip">Hand ${sideState.hand.length}</span>
      <span class="meta-chip">Feld ${sideState.board.length}/4</span>
    </div>
  `;
}

function renderCardModal() {
  if (!uiState.modalCardId) {
    elements.cardModal.classList.add("hidden");
    elements.cardModalContent.innerHTML = "";
    return;
  }

  const card = getCard(uiState.modalCardId);
  const activeDeck = getActiveDeck();
  const inActiveDeck = activeDeck ? countCopiesInArray(activeDeck.cards, card.id) : 0;
  const owned = getOwnedCopies(card.id);
  const marketEntry = getMarketEntry(card.id);
  const marketSaleQuote = getMarketSaleQuote(card.id);

  elements.cardModal.classList.remove("hidden");
  elements.cardModalContent.innerHTML = "";

  const preview = renderCard(card, { context: "modal" });
  const details = document.createElement("div");
  details.className = "modal-details";
  details.innerHTML = `
    <div class="detail-block">
      <p class="eyebrow">Karteninfo</p>
      <h3>${card.name}</h3>
      <div class="deck-meta">
        <span class="meta-chip">${RarityLabel(card.rarity)}</span>
        <span class="meta-chip">${TYPE_LABELS[card.type]}</span>
        <span class="meta-chip">${getFaction(card.faction).name}</span>
      </div>
      <p class="mini-note">${card.description}</p>
    </div>
    <div class="detail-block">
      <h4>Besitz und Decks</h4>
      <p>Im Besitz: <strong>${owned}</strong></p>
      <p>Im aktiven Deck: <strong>${inActiveDeck}</strong></p>
      <div class="price-stack">
        <div class="price-line">
          <span>Händler-Verkaufswert</span>
          <strong>${RARITY_META[card.rarity].sellValue} Gold</strong>
        </div>
        <div class="price-line">
          <span>Marktplatz-Bruttowert</span>
          <strong>${marketSaleQuote.gross} Gold</strong>
        </div>
        <div class="price-line accent">
          <span>Marktplatzgebühr (7 %)</span>
          <strong>${marketSaleQuote.fee} Gold</strong>
        </div>
        <div class="price-line success">
          <span>Auszahlung am Marktplatz</span>
          <strong>${marketSaleQuote.net} Gold</strong>
        </div>
        <div class="price-line">
          <span>Marktplatz-Kaufpreis</span>
          <strong>${marketEntry.buyPrice} Gold</strong>
        </div>
        <div class="price-line">
          <span>Stündliche Bewegung</span>
          <strong>${formatDelta(marketEntry.lastDeltaPct)}</strong>
        </div>
      </div>
    </div>
    <div class="detail-block">
      <h4>Aktionen</h4>
    </div>
    <div class="detail-block">
      <h4>Hinweis</h4>
      <p>Wenn du eine Karte verkaufst, werden gespeicherte Decks nicht automatisch geändert. Betroffene Decks werden nur als blockiert markiert.</p>
    </div>
  `;

  const actionBlock = details.querySelectorAll(".detail-block")[2];
  const actionRow = document.createElement("div");
  actionRow.className = "card-actions";
  actionRow.append(
    createActionButton("1 verkaufen", () => sellCard(card.id, 1), owned < 1),
    createActionButton("Duplikate verkaufen", () => sellCard(card.id, Math.max(0, owned - 1)), owned <= 1),
    createActionButton(`1 am Markt verkaufen (${marketSaleQuote.net}G netto)`, () => sellCardOnMarket(card.id, 1), owned < 1),
    createActionButton("1 am Markt kaufen", () => buyCardOnMarket(card.id), getSave().gold < marketEntry.buyPrice),
    createActionButton("Alles verkaufen", () => sellCard(card.id, owned), owned < 1),
    createActionButton("Zum aktiven Deck", () => addCardToActiveDeck(card.id), !canAddCardToActiveDeck(card.id)),
  );
  actionBlock.append(actionRow);

  elements.cardModalContent.append(preview, details);
}

function parsePositiveInteger(value) {
  const amount = Number.parseInt(String(value), 10);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function updateStoredAccount(username, updater) {
  const existing = database.accounts[username];

  if (!existing) {
    return null;
  }

  const workingCopy = normalizeAccount(existing);
  updater(workingCopy);
  const normalized = normalizeAccount(workingCopy);
  database.accounts[username] = normalized;

  if (currentAccount && currentAccount.username === username) {
    currentAccount = normalized;
  }

  saveDatabase();
  return normalized;
}

function getSelectedAdminAccount() {
  if (!isCurrentUserAdmin() || !uiState.adminSelectedUser) {
    return null;
  }

  const account = database.accounts[uiState.adminSelectedUser];
  return account ? normalizeAccount(account) : null;
}

function grantGoldToSelectedAccount() {
  const selectedAccount = getSelectedAdminAccount();
  const amount = parsePositiveInteger(elements.adminGoldAmount.value);

  if (!selectedAccount) {
    showToast("Bitte zuerst ein Konto im Admin-Bereich auswählen.");
    return;
  }

  if (!amount) {
    showToast("Bitte eine gültige Goldmenge eingeben.");
    return;
  }

  updateStoredAccount(selectedAccount.username, (account) => {
    account.save.gold += amount;
  });
  renderAll();
  showToast(`${amount} Gold wurden ${selectedAccount.username} gutgeschrieben.`);
}

function grantPacksToSelectedAccount() {
  const selectedAccount = getSelectedAdminAccount();
  const amount = parsePositiveInteger(elements.adminPackAmount.value);
  const packId = elements.adminPackSelect.value;

  if (!selectedAccount) {
    showToast("Bitte zuerst ein Konto im Admin-Bereich auswählen.");
    return;
  }

  if (!PACK_DEFINITIONS[packId]) {
    showToast("Diese Booster-Art ist nicht verfügbar.");
    return;
  }

  if (!amount) {
    showToast("Bitte eine gültige Booster-Anzahl eingeben.");
    return;
  }

  updateStoredAccount(selectedAccount.username, (account) => {
    account.save.packs[packId] = (account.save.packs[packId] || 0) + amount;
  });
  renderAll();
  showToast(`${amount}× ${PACK_DEFINITIONS[packId].label} wurden ${selectedAccount.username} gegeben.`);
}

function grantCardsToSelectedAccount() {
  const selectedAccount = getSelectedAdminAccount();
  const amount = parsePositiveInteger(elements.adminCardAmount.value);
  const cardId = elements.adminCardSelect.value;
  const card = getCard(cardId);

  if (!selectedAccount) {
    showToast("Bitte zuerst ein Konto im Admin-Bereich auswählen.");
    return;
  }

  if (!card) {
    showToast("Diese Karte existiert nicht.");
    return;
  }

  if (!amount) {
    showToast("Bitte eine gültige Kartenanzahl eingeben.");
    return;
  }

  updateStoredAccount(selectedAccount.username, (account) => {
    account.save.collection[cardId] = (account.save.collection[cardId] || 0) + amount;
  });
  renderAll();
  showToast(`${amount}× ${card.name} wurden ${selectedAccount.username} hinzugefügt.`);
}

function createPackCard(packId, context) {
  const pack = PACK_DEFINITIONS[packId];
  const element = elements.packTemplate.content.firstElementChild.cloneNode(true);
  const save = getSave();

  element.querySelector(".pack-kicker").textContent = pack.tier;
  element.querySelector(".pack-name").textContent = pack.label;
  element.querySelector(".pack-price").textContent = context === "shop"
    ? `${pack.price} Gold`
    : `Im Besitz: ${save.packs[packId]}`;
  element.querySelector(".pack-copy").textContent = pack.description;

  const odds = element.querySelector(".pack-odds");
  odds.innerHTML = "";
  ["rare", "epic", "legendary", "ultra", "mythic"].forEach((rarity) => {
    const row = document.createElement("div");
    row.className = "odds-row";
    row.innerHTML = `<span>${RarityLabel(rarity)}</span><strong>${pack.odds[rarity]}%</strong>`;
    odds.append(row);
  });

  const actions = element.querySelector(".pack-actions");

  if (context === "shop") {
    actions.append(createActionButton("Kaufen", () => buyPack(packId), getSave().gold < pack.price));
  } else {
    actions.append(
      createActionButton("Auswählen", () => selectPack(packId)),
      createActionButton("Öffnen", () => openPack(packId), getSave().packs[packId] < 1),
    );
  }

  return element;
}

function renderCard(card, options = {}) {
  const {
    context = "collection",
    buttons = [],
    footer = "",
    stateOverride = null,
  } = options;

  const element = elements.cardTemplate.content.firstElementChild.cloneNode(true);
  const stats = stateOverride || card;

  element.classList.add(`card-${card.rarity}`, "clickable-card");
  element.addEventListener("click", () => openCardModal(card.id));
  element.querySelector(".card-type-badge").textContent = TYPE_LABELS[card.type];
  element.querySelector(".card-owned").textContent = `${getOwnedCopies(card.id)}×`;
  element.querySelector(".card-name").textContent = card.name;
  element.querySelector(".card-faction").textContent = getFaction(card.faction).name;
  element.querySelector(".card-rarity").textContent = RarityLabel(card.rarity);
  element.querySelector(".card-rarity").classList.add(`rarity-${card.rarity}`);
  element.querySelector(".card-description").textContent = footer || card.description;
  element.querySelector(".card-cost").textContent = `Kosten ${card.cost}`;
  element.querySelector(".card-attack").textContent = `ATK ${stats.attack ?? "-"}`;
  element.querySelector(".card-health").textContent = `HP ${stats.health ?? "-"}`;

  const actions = element.querySelector(".card-actions");
  buttons.forEach((button) => {
    actions.append(createActionButton(button.label, button.handler, button.disabled));
  });

  if (!buttons.length && (context === "collection" || context === "opened")) {
    actions.append(createActionButton("Details", () => openCardModal(card.id)));
  }

  return element;
}

function createActionButton(label, handler, disabled = false) {
  const button = document.createElement("button");
  button.className = "action-button";
  button.textContent = label;
  button.disabled = disabled;
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    handler();
  });
  return button;
}

function buyPack(packId) {
  const save = getSave();
  const pack = PACK_DEFINITIONS[packId];

  if (save.gold < pack.price) {
    showToast("Dafür reicht dein Gold nicht.");
    return;
  }

  save.gold -= pack.price;
  save.packs[packId] += 1;
  persistCurrentAccount();
  renderAll();
  showToast(`${pack.label} gekauft.`);
}

function selectPack(packId) {
  getSave().selectedPack = packId;
  persistCurrentAccount();
  renderBoosterLab();
}

function openPack(packId) {
  const save = getSave();

  if (save.packs[packId] < 1) {
    showToast("Dieses Booster ist gerade nicht im Besitz.");
    return;
  }

  const cards = generatePack(packId);
  save.packs[packId] -= 1;

  cards.forEach((card) => {
    save.collection[card.id] = (save.collection[card.id] || 0) + 1;
  });

  save.lastOpened = {
    packId,
    cards: cards.map((card) => card.id),
    openedAt: new Date().toISOString(),
  };

  persistCurrentAccount();
  renderAll();
  showToast(`${PACK_DEFINITIONS[packId].label} geöffnet.`);
}

function generatePack(packId) {
  const pack = PACK_DEFINITIONS[packId];
  const cards = [];

  for (let slot = 0; slot < 5; slot += 1) {
    const minimum = slot === 4 ? pack.guaranteed : "common";
    const rarity = rollRarity(pack.odds, minimum);
    cards.push(drawCardByRarity(rarity));
  }

  return cards;
}

function rollRarity(weights, minimumRarity) {
  const minIndex = RARITY_ORDER.indexOf(minimumRarity);
  const eligibleRarities = RARITY_ORDER.slice(minIndex);
  const total = eligibleRarities.reduce((sum, rarity) => sum + weights[rarity], 0);
  let roll = Math.random() * total;

  for (const rarity of eligibleRarities) {
    roll -= weights[rarity];
    if (roll <= 0) {
      return rarity;
    }
  }

  return eligibleRarities[0];
}

function drawCardByRarity(rarity) {
  const pool = CARD_POOLS_BY_RARITY[rarity];
  return pool[Math.floor(Math.random() * pool.length)];
}

function getOwnedCopies(cardId) {
  return getSave().collection[cardId] || 0;
}

function getActiveDeck() {
  return getSave().decks.find((deck) => deck.id === getSave().activeDeckId);
}

function validateDeck(deck) {
  const messages = [];

  if (!deck) {
    return { valid: false, messages: ["Es ist kein aktives Deck vorhanden."] };
  }

  if (deck.cards.length !== APP_CONFIG.deckSize) {
    messages.push(`Das Deck hat ${deck.cards.length}/${APP_CONFIG.deckSize} Karten.`);
  }

  const required = countCards(deck.cards);
  Object.entries(required).forEach(([cardId, count]) => {
    const owned = getOwnedCopies(cardId);
    if (owned < count) {
      const missing = count - owned;
      messages.push(`${missing}× ${getCard(cardId).name} fehlen im Besitz.`);
    }
  });

  return {
    valid: messages.length === 0,
    messages,
  };
}

function renameActiveDeck() {
  const activeDeck = getActiveDeck();
  const nextName = elements.deckNameInput.value.trim();

  if (!nextName) {
    showToast("Bitte einen Decknamen eingeben.");
    return;
  }

  activeDeck.name = nextName;
  persistCurrentAccount();
  renderDeckManager();
  showToast("Deckname gespeichert.");
}

function createNewDeck() {
  const nextIndex = getSave().decks.length + 1;
  const deck = createDeck(`Deck ${nextIndex}`);
  getSave().decks.push(deck);
  getSave().activeDeckId = deck.id;
  persistCurrentAccount();
  renderAll();
  showToast("Neues Deck erstellt.");
}

function duplicateActiveDeck() {
  duplicateDeck(getSave().activeDeckId);
}

function duplicateDeck(deckId) {
  const deck = getSave().decks.find((entry) => entry.id === deckId);
  const clone = createDeck(`${deck.name} Kopie`, deck.cards);
  getSave().decks.push(clone);
  getSave().activeDeckId = clone.id;
  persistCurrentAccount();
  renderAll();
  showToast("Deck dupliziert.");
}

function deleteActiveDeck() {
  if (getSave().decks.length === 1) {
    showToast("Mindestens ein Deck muss erhalten bleiben.");
    return;
  }

  const activeDeck = getActiveDeck();
  const confirmed = window.confirm(`Soll ${activeDeck.name} wirklich gelöscht werden?`);

  if (!confirmed) {
    return;
  }

  getSave().decks = getSave().decks.filter((deck) => deck.id !== activeDeck.id);
  getSave().activeDeckId = getSave().decks[0].id;
  persistCurrentAccount();
  renderAll();
  showToast("Deck gelöscht.");
}

function activateDeck(deckId) {
  getSave().activeDeckId = deckId;
  persistCurrentAccount();
  renderAll();
}

function canAddCardToActiveDeck(cardId) {
  const activeDeck = getActiveDeck();
  return activeDeck.cards.length < APP_CONFIG.deckSize && countCopiesInArray(activeDeck.cards, cardId) < getOwnedCopies(cardId);
}

function addCardToActiveDeck(cardId) {
  if (!canAddCardToActiveDeck(cardId)) {
    showToast("Diese Karte kann gerade nicht weiter hinzugefügt werden.");
    return;
  }

  getActiveDeck().cards.push(cardId);
  persistCurrentAccount();
  renderAll();
}

function removeCardFromActiveDeck(cardId) {
  const deck = getActiveDeck();
  const index = deck.cards.findIndex((entry) => entry === cardId);

  if (index === -1) {
    return;
  }

  deck.cards.splice(index, 1);
  persistCurrentAccount();
  renderAll();
}

function sellCard(cardId, amount) {
  const owned = getOwnedCopies(cardId);
  const sellAmount = Math.min(amount, owned);

  if (sellAmount < 1) {
    showToast("Davon besitzt du aktuell keine verkaufbare Karte.");
    return;
  }

  getSave().collection[cardId] = owned - sellAmount;
  getSave().gold += RARITY_META[getCard(cardId).rarity].sellValue * sellAmount;
  persistCurrentAccount();
  renderAll();
  showToast(`${sellAmount}× ${getCard(cardId).name} verkauft.`);
}

function sellCardOnMarket(cardId, amount) {
  const owned = getOwnedCopies(cardId);
  const sellAmount = Math.min(amount, owned);

  if (sellAmount < 1) {
    showToast("Für den Marktplatz fehlt dir diese Karte.");
    return;
  }

  const quote = getMarketSaleQuote(cardId, sellAmount);
  getSave().collection[cardId] = owned - sellAmount;
  getSave().gold += quote.net;
  database.market.feeVault += quote.fee;
  recordMarketTrade(cardId, "sell", sellAmount);
  persistCurrentAccount();
  renderAll();
  showToast(`${sellAmount}× ${getCard(cardId).name} am Marktplatz verkauft. Netto: ${quote.net} Gold, Gebühr: ${quote.fee} Gold.`);
}

function buyCardOnMarket(cardId, amount = 1) {
  const buyAmount = Math.max(1, amount);
  const totalPrice = getMarketBuyPrice(cardId) * buyAmount;

  if (getSave().gold < totalPrice) {
    showToast("Für diesen Marktkauf reicht dein Gold nicht.");
    return;
  }

  getSave().gold -= totalPrice;
  getSave().collection[cardId] = (getSave().collection[cardId] || 0) + buyAmount;
  recordMarketTrade(cardId, "buy", buyAmount);
  persistCurrentAccount();
  renderAll();
  showToast(`${buyAmount}× ${getCard(cardId).name} am Marktplatz gekauft.`);
}

function openCardModal(cardId) {
  uiState.modalCardId = cardId;
  renderCardModal();
}

function closeCardModal() {
  uiState.modalCardId = null;
  renderCardModal();
}

function startMatch() {
  const deck = getActiveDeck();
  const validation = validateDeck(deck);

  if (!validation.valid) {
    uiState.section = "decks";
    renderAll();
    showToast("Das aktive Deck ist noch nicht spielbar.");
    return;
  }

  uiState.match = createMatch(deck.cards);
  startTurn("player");
  renderArena();
  showToast("Neues Match gestartet.");
}

function clearMatch() {
  uiState.match = null;
  renderArena();
}

function createMatch(playerDeckCards) {
  const match = {
    turn: 0,
    phase: "player",
    status: "active",
    statusMessage: "Baue Druck auf und verwalte dein Mana sorgfältig.",
    log: [],
    uidCounter: 0,
    player: createSideState(playerDeckCards),
    enemy: createSideState(generateEnemyDeck()),
  };

  drawOpeningHands(match);
  return match;
}

function createSideState(deckCards) {
  const shuffledDeck = shuffle([...deckCards]);
  return {
    hero: 24,
    maxMana: 0,
    mana: 0,
    deck: shuffledDeck,
    hand: [],
    board: [],
  };
}

function startTurn(side) {
  const match = uiState.match;
  const actor = match[side];

  if (side === "player") {
    match.turn += 1;
  }

  match.phase = side;
  actor.maxMana = Math.min(APP_CONFIG.maxMana, actor.maxMana + 1);
  actor.mana = actor.maxMana;
  actor.board.forEach((unit) => {
    unit.canAttack = true;
  });

  drawCards(side, 1);

  if (match.status !== "active") {
    return;
  }

  addLog(side === "player" ? "Dein Zug beginnt." : "Der Gegner beginnt seinen Zug.");
  match.statusMessage = side === "player"
    ? "Du kannst Karten spielen und mit bereiten Einheiten angreifen."
    : "Der Gegner plant seinen Gegenzug.";

  if (side === "enemy") {
    runEnemyTurn();
  }
}

function drawCards(side, amount) {
  const match = uiState.match;
  const actor = match[side];

  for (let index = 0; index < amount; index += 1) {
    if (!actor.deck.length) {
      actor.hero -= 2;
      addLog(`${side === "player" ? "Du" : "Der Gegner"} erleidet 2 Ermüdungsschaden.`);
      if (actor.hero <= 0) {
        finishMatch(side === "player" ? "lost" : "won", "Ein Held ist an Ermüdung gefallen.");
        return;
      }
      continue;
    }

    actor.hand.push(actor.deck.shift());
  }
}

function drawOpeningHands(match) {
  for (let index = 0; index < APP_CONFIG.openingHandSize; index += 1) {
    if (match.player.deck.length) {
      match.player.hand.push(match.player.deck.shift());
    }

    if (match.enemy.deck.length) {
      match.enemy.hand.push(match.enemy.deck.shift());
    }
  }
}

function canPlayCard(card, handIndex) {
  const match = uiState.match;

  if (!match || match.phase !== "player" || match.status !== "active") {
    return false;
  }

  if (handIndex < 0 || handIndex >= match.player.hand.length) {
    return false;
  }

  if (card.cost > match.player.mana) {
    return false;
  }

  if (card.type === "unit" && match.player.board.length >= 4) {
    return false;
  }

  return true;
}

function playCard(handIndex) {
  const match = uiState.match;
  const cardId = match.player.hand[handIndex];
  const card = getCard(cardId);

  if (!canPlayCard(card, handIndex)) {
    showToast("Diese Karte kann jetzt nicht gespielt werden.");
    return;
  }

  match.player.hand.splice(handIndex, 1);
  match.player.mana -= card.cost;
  resolveCardPlay(card, "player");
  afterActionCheck();
  renderArena();
}

function resolveCardPlay(card, owner) {
  const match = uiState.match;
  const actor = match[owner];

  if (card.type === "unit") {
    const unit = {
      uid: nextUnitId(),
      cardId: card.id,
      attack: card.attack,
      health: card.health,
      maxHealth: card.health,
      canAttack: false,
    };
    actor.board.push(unit);
    addLog(`${owner === "player" ? "Du spielst" : "Der Gegner spielt"} ${card.name}.`);
    applyEffect(card.effect, owner, card.name);
    return;
  }

  addLog(`${owner === "player" ? "Du wirkst" : "Der Gegner wirkt"} ${card.name}.`);
  applyEffect(card.effect, owner, card.name);
}

function applyEffect(effect, owner, sourceName) {
  if (!effect || effect.kind === "none") {
    return;
  }

  const match = uiState.match;
  const actor = match[owner];
  const enemy = match[owner === "player" ? "enemy" : "player"];

  switch (effect.kind) {
    case "damageHero":
      enemy.hero -= effect.value;
      addLog(`${sourceName} verursacht ${effect.value} direkten Schaden.`);
      break;
    case "healHero":
      actor.hero += effect.value;
      addLog(`${sourceName} heilt ${effect.value} Lebenspunkte.`);
      break;
    case "draw":
      addLog(`${sourceName} zieht ${effect.value} Karte${effect.value > 1 ? "n" : ""}.`);
      drawCards(owner, effect.value);
      break;
    case "gainMana":
      actor.mana = Math.min(actor.maxMana + effect.value, actor.mana + effect.value);
      addLog(`${sourceName} gibt ${effect.value} zusätzliches Mana.`);
      break;
    case "buffBoard":
      actor.board.forEach((unit) => {
        unit.attack += effect.attack;
        unit.health += effect.health;
        unit.maxHealth += effect.health;
      });
      addLog(`${sourceName} stärkt das Feld um +${effect.attack}/+${effect.health}.`);
      break;
    case "fortifyBoard":
      actor.board.forEach((unit) => {
        unit.health += effect.value;
        unit.maxHealth += effect.value;
      });
      actor.hero += effect.value;
      addLog(`${sourceName} stärkt Held und Feld um ${effect.value}.`);
      break;
    case "strikeWeakest":
      strikeWeakestEnemy(owner, effect.value, sourceName);
      break;
    default:
      break;
  }

  cleanupBoards();
}

function strikeWeakestEnemy(owner, value, sourceName) {
  const enemy = uiState.match[owner === "player" ? "enemy" : "player"];

  if (!enemy.board.length) {
    enemy.hero -= value;
    addLog(`${sourceName} trifft den Helden direkt für ${value}.`);
    return;
  }

  const target = [...enemy.board].sort((left, right) => left.health - right.health || left.attack - right.attack)[0];
  target.health -= value;
  addLog(`${sourceName} trifft ${getCard(target.cardId).name} für ${value}.`);
}

function attackWithUnit(unitId) {
  const match = uiState.match;

  if (!match || match.phase !== "player" || match.status !== "active") {
    return;
  }

  const attacker = match.player.board.find((unit) => unit.uid === unitId);

  if (!attacker || !attacker.canAttack) {
    return;
  }

  resolveCombat(attacker, "player");
  afterActionCheck();
  renderArena();
}

function resolveCombat(attacker, owner) {
  const match = uiState.match;
  const enemy = match[owner === "player" ? "enemy" : "player"];
  const actor = match[owner];
  const target = [...enemy.board].sort((left, right) => left.health - right.health || left.attack - right.attack)[0];
  attacker.canAttack = false;

  if (!target) {
    enemy.hero -= attacker.attack;
    addLog(`${getCard(attacker.cardId).name} trifft den Helden für ${attacker.attack}.`);
    return;
  }

  target.health -= attacker.attack;
  attacker.health -= target.attack;
  addLog(`${getCard(attacker.cardId).name} greift ${getCard(target.cardId).name} an.`);
  cleanupBoards();

  if (!actor.board.includes(attacker)) {
    addLog(`${getCard(attacker.cardId).name} fällt im Gegenangriff.`);
  }

  if (!enemy.board.includes(target)) {
    addLog(`${getCard(target.cardId).name} wird zerstört.`);
  }
}

function runEnemyTurn() {
  const match = uiState.match;
  const enemy = match.enemy;
  let plays = 0;

  while (plays < 3) {
    const playableIndex = chooseEnemyCardIndex();

    if (playableIndex === -1) {
      break;
    }

    const cardId = enemy.hand.splice(playableIndex, 1)[0];
    const card = getCard(cardId);
    enemy.mana -= card.cost;
    resolveCardPlay(card, "enemy");
    plays += 1;

    if (match.status !== "active") {
      renderArena();
      return;
    }
  }

  enemy.board
    .filter((unit) => unit.canAttack)
    .forEach((unit) => {
      if (match.status === "active") {
        resolveCombat(unit, "enemy");
        afterActionCheck();
      }
    });

  if (match.status === "active") {
    startTurn("player");
  }

  renderArena();
}

function chooseEnemyCardIndex() {
  const enemy = uiState.match.enemy;
  const candidates = enemy.hand
    .map((cardId, index) => ({ card: getCard(cardId), index }))
    .filter(({ card }) => card.cost <= enemy.mana && (card.type !== "unit" || enemy.board.length < 4))
    .sort((left, right) => right.card.cost - left.card.cost || RARITY_ORDER.indexOf(right.card.rarity) - RARITY_ORDER.indexOf(left.card.rarity));

  return candidates.length ? candidates[0].index : -1;
}

function endPlayerTurn() {
  const match = uiState.match;

  if (!match || match.phase !== "player" || match.status !== "active") {
    return;
  }

  startTurn("enemy");
  renderArena();
}

function cleanupBoards() {
  const match = uiState.match;
  match.player.board = match.player.board.filter((unit) => unit.health > 0);
  match.enemy.board = match.enemy.board.filter((unit) => unit.health > 0);
}

function afterActionCheck() {
  const match = uiState.match;

  if (match.enemy.hero <= 0 && match.player.hero <= 0) {
    finishMatch("won", "Beide Helden fallen gleichzeitig. Der aktive Spieler gewinnt knapp.");
    return;
  }

  if (match.enemy.hero <= 0) {
    finishMatch("won", "Der gegnerische Held wurde besiegt.");
    return;
  }

  if (match.player.hero <= 0) {
    finishMatch("lost", "Dein Held wurde besiegt.");
  }
}

function finishMatch(status, message) {
  const save = getSave();
  const match = uiState.match;
  match.status = status;
  match.statusMessage = message;
  addLog(message);

  if (status === "won") {
    save.gold += 90;
    addLog("Belohnung: 90 Gold.");
  } else {
    save.gold += 35;
    addLog("Trostpreis: 35 Gold.");
  }

  persistCurrentAccount();
}

function addLog(text) {
  if (!uiState.match) {
    return;
  }

  uiState.match.log.push({
    turn: `Runde ${uiState.match.turn}`,
    text,
  });
}

function nextUnitId() {
  uiState.match.uidCounter += 1;
  return uiState.match.uidCounter;
}

function generateEnemyDeck() {
  const weightedPool = CARD_POOL.filter((card) => {
    if (card.rarity === "mythic") {
      return Math.random() < 0.25;
    }

    return true;
  });

  const deck = [];
  const units = weightedPool.filter((card) => card.type === "unit");
  const supports = weightedPool.filter((card) => card.type !== "unit");

  while (deck.length < APP_CONFIG.deckSize) {
    const pool = Math.random() < 0.68 ? units : supports;
    deck.push(pool[Math.floor(Math.random() * pool.length)].id);
  }

  return deck;
}

function countByType(cardIds, type) {
  return cardIds.filter((cardId) => getCard(cardId).type === type).length;
}

function countCards(cardIds) {
  return cardIds.reduce((map, cardId) => {
    map[cardId] = (map[cardId] || 0) + 1;
    return map;
  }, {});
}

function countCopiesInArray(cardIds, targetId) {
  return cardIds.filter((cardId) => cardId === targetId).length;
}

function getCard(cardId) {
  return CARD_MAP.get(cardId);
}

function getFaction(factionId) {
  return FACTIONS.find((faction) => faction.id === factionId);
}

function RarityLabel(rarity) {
  return RARITY_META[rarity].label;
}

function sortCardsForDisplay(left, right) {
  return RARITY_ORDER.indexOf(left.rarity) - RARITY_ORDER.indexOf(right.rarity)
    || left.cost - right.cost
    || left.name.localeCompare(right.name, "de");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");

  if (uiState.toastTimer) {
    window.clearTimeout(uiState.toastTimer);
  }

  uiState.toastTimer = window.setTimeout(() => {
    elements.toast.classList.add("hidden");
  }, 2600);
}

function shuffle(array) {
  const copy = [...array];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

function groupCardsByRarity(cards) {
  return cards.reduce((map, card) => {
    map[card.rarity] = map[card.rarity] || [];
    map[card.rarity].push(card);
    return map;
  }, {});
}

function createLegacyCard(id, name, faction, type, rarity, cost, attack, health, effect) {
  return {
    id,
    name,
    faction,
    type,
    rarity,
    cost,
    attack,
    health,
    effect,
    description: buildDescription(type, effect),
  };
}

function buildGeneratedCards() {
  const cards = [];

  FACTIONS.forEach((faction, factionIndex) => {
    UNIT_TITLES.forEach((title, index) => {
      const rarity = UNIT_RARITIES[index];
      const effect = createUnitEffect(rarity, index);
      const cost = createCostForRarity(rarity, index, "unit");
      const stats = createUnitStats(cost, rarity, index, factionIndex);
      cards.push({
        id: `${faction.id}-einheit-${index + 1}`,
        name: `${faction.prefix}-${title}`,
        faction: faction.id,
        type: "unit",
        rarity,
        cost,
        attack: stats.attack,
        health: stats.health,
        effect,
        description: buildDescription("unit", effect),
      });
    });

    SPELL_TITLES.forEach((title, index) => {
      const rarity = SPELL_RARITIES[index];
      const effect = createSpellEffect(rarity, index);
      cards.push({
        id: `${faction.id}-zauber-${index + 1}`,
        name: `${faction.prefix}-${title}`,
        faction: faction.id,
        type: "spell",
        rarity,
        cost: createCostForRarity(rarity, index, "spell"),
        attack: null,
        health: null,
        effect,
        description: buildDescription("spell", effect),
      });
    });

    TRAINER_TITLES.forEach((title, index) => {
      const rarity = TRAINER_RARITIES[index];
      const effect = createTrainerEffect(rarity, index);
      cards.push({
        id: `${faction.id}-trainer-${index + 1}`,
        name: `${title} des ${faction.name}`,
        faction: faction.id,
        type: "trainer",
        rarity,
        cost: createCostForRarity(rarity, index, "trainer"),
        attack: null,
        health: null,
        effect,
        description: buildDescription("trainer", effect),
      });
    });
  });

  return cards;
}

function createCostForRarity(rarity, index, type) {
  const base = {
    common: 1,
    rare: 2,
    epic: 4,
    legendary: 6,
    ultra: 7,
    mythic: 8,
  }[rarity];

  if (type === "spell" || type === "trainer") {
    return Math.min(8, base + (index % 2));
  }

  return Math.min(9, base + (index % 3 === 0 ? 0 : 1));
}

function createUnitStats(cost, rarity, index, factionIndex) {
  const attackBonus = {
    common: 0,
    rare: 1,
    epic: 1,
    legendary: 2,
    ultra: 2,
    mythic: 3,
  }[rarity];
  const healthBonus = {
    common: 1,
    rare: 1,
    epic: 2,
    legendary: 2,
    ultra: 3,
    mythic: 4,
  }[rarity];

  return {
    attack: Math.max(1, cost + attackBonus + ((index + factionIndex) % 2)),
    health: Math.max(1, cost + healthBonus + ((index + factionIndex) % 3)),
  };
}

function createUnitEffect(rarity, index) {
  const tables = {
    common: [
      { kind: "none" },
      { kind: "damageHero", value: 1 },
      { kind: "healHero", value: 2 },
      { kind: "strikeWeakest", value: 1 },
    ],
    rare: [
      { kind: "damageHero", value: 2 },
      { kind: "draw", value: 1 },
      { kind: "buffBoard", attack: 1, health: 0 },
      { kind: "fortifyBoard", value: 1 },
    ],
    epic: [
      { kind: "draw", value: 2 },
      { kind: "strikeWeakest", value: 3 },
      { kind: "buffBoard", attack: 1, health: 1 },
      { kind: "healHero", value: 4 },
    ],
    legendary: [
      { kind: "damageHero", value: 4 },
      { kind: "buffBoard", attack: 2, health: 1 },
      { kind: "fortifyBoard", value: 2 },
      { kind: "strikeWeakest", value: 4 },
    ],
    ultra: [
      { kind: "damageHero", value: 5 },
      { kind: "draw", value: 2 },
      { kind: "buffBoard", attack: 2, health: 2 },
      { kind: "strikeWeakest", value: 5 },
    ],
    mythic: [
      { kind: "damageHero", value: 6 },
      { kind: "draw", value: 3 },
      { kind: "buffBoard", attack: 3, health: 2 },
      { kind: "fortifyBoard", value: 3 },
    ],
  };

  return tables[rarity][index % tables[rarity].length];
}

function createSpellEffect(rarity, index) {
  const tables = {
    common: [{ kind: "damageHero", value: 2 }, { kind: "healHero", value: 3 }],
    rare: [{ kind: "draw", value: 1 }, { kind: "strikeWeakest", value: 3 }, { kind: "gainMana", value: 1 }],
    epic: [{ kind: "buffBoard", attack: 1, health: 1 }, { kind: "draw", value: 2 }],
    legendary: [{ kind: "damageHero", value: 5 }, { kind: "fortifyBoard", value: 2 }],
  };

  return tables[rarity][index % tables[rarity].length];
}

function createTrainerEffect(rarity, index) {
  const tables = {
    common: [{ kind: "gainMana", value: 1 }, { kind: "healHero", value: 2 }],
    rare: [{ kind: "draw", value: 1 }, { kind: "buffBoard", attack: 1, health: 0 }, { kind: "gainMana", value: 1 }],
    epic: [{ kind: "fortifyBoard", value: 2 }, { kind: "draw", value: 2 }],
    ultra: [{ kind: "buffBoard", attack: 2, health: 1 }, { kind: "strikeWeakest", value: 4 }],
  };

  return tables[rarity][index % tables[rarity].length];
}

function buildDescription(type, effect) {
  const opener = type === "unit" ? "Beim Ausspielen" : "Effekt";

  switch (effect.kind) {
    case "none":
      return "Eine solide Karte ohne Zusatzeffekt.";
    case "damageHero":
      return `${opener}: Verursacht ${effect.value} direkten Schaden am gegnerischen Helden.`;
    case "healHero":
      return `${opener}: Heilt deinen Helden um ${effect.value}.`;
    case "draw":
      return `${opener}: Ziehe ${effect.value} Karte${effect.value > 1 ? "n" : ""}.`;
    case "gainMana":
      return `${opener}: Erhalte sofort ${effect.value} zusätzliches Mana.`;
    case "buffBoard":
      return `${opener}: Deine Einheiten erhalten +${effect.attack}/+${effect.health}.`;
    case "fortifyBoard":
      return `${opener}: Dein Held und alle eigenen Einheiten erhalten +${effect.value} Haltbarkeit.`;
    case "strikeWeakest":
      return `${opener}: Trifft die schwächste gegnerische Einheit oder den Helden für ${effect.value}.`;
    default:
      return "Eine Karte mit ungewöhnlichem Effekt.";
  }
}
