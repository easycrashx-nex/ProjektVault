const APP_CONFIG = {
  deckSize: 20,
  baseGold: 260,
  openingHandSize: 4,
  startingMana: 1,
  maxMana: 10,
  boardSize: 5,
  heroHealth: 36,
  fatigueBaseDamage: 1,
};

const DECK_MODES = Object.freeze({
  standard: "standard",
  hardcore: "hardcore",
});

const DECK_RULES = Object.freeze({
  standard: Object.freeze({
    id: DECK_MODES.standard,
    size: APP_CONFIG.deckSize,
    maxSpells: 6,
    maxTrainers: 4,
  }),
  hardcore: Object.freeze({
    id: DECK_MODES.hardcore,
    size: 35,
    maxSpells: 10,
    maxTrainers: 6,
  }),
});

const MAX_DECK_SIZE = Math.max(...Object.values(DECK_RULES).map((entry) => entry.size));
const DECK_CODE_PREFIX = "PV1";
const DECK_CODE_VERSION = 1;

const MARKETPLACE_FEE_RATE = 0.07;
const ADMIN_BOOTSTRAP = {
  username: "obsidian_admin",
  passwordHash: {
    version: 2,
    algo: "pbkdf2-sha256",
    iterations: 120000,
    salt: "oQNKpLv5WAKQE0/5eP26xw==",
    hash: "lZ+MEOdCn7ZcP/Lkoz9+puYVTPdKfahXIX/NG+sY0DQ=",
  },
};

const STORAGE_KEYS = {
  database: "arcane-vault-db-v2",
  session: "arcane-vault-session-v2",
};

const SESSION_MODES = Object.freeze({
  local: "local",
  server: "server",
});

const SUPPORTED_LANGUAGES = Object.freeze(["de", "en", "fr"]);
const PROGRESSION_RULES = globalThis.ProjektVaultProgressionDefs || {
  DAILY_QUEST_LIMIT: 5,
  WEEKLY_QUEST_LIMIT: 5,
  DAILY_QUEST_DEFS: Object.freeze([]),
  WEEKLY_QUEST_DEFS: Object.freeze([]),
  ACHIEVEMENT_DEFS: Object.freeze([]),
  SNAPSHOT_STAT_KEYS: Object.freeze([
    "arenaWins",
    "arenaLosses",
    "friendWins",
    "friendLosses",
    "boostersOpened",
    "cardsOpened",
    "goldEarned",
    "tradesCompleted",
    "marketDeals",
    "hardcoreWins",
    "legendaryPlusPulled",
  ]),
  createDefaultQuestSnapshot: () => ({
    rankPoints: 0,
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
    summary: { gold: 0, totalCards: 0, uniqueCards: 0, totalBoosters: 0 },
  }),
  createDefaultQuestWindow: () => ({ key: "", activeIds: [], snapshot: null }),
  createDefaultQuestState: () => ({
    dailyClaimed: [],
    weeklyClaimed: [],
    dailyWindow: { key: "", activeIds: [], snapshot: null },
    weeklyWindow: { key: "", activeIds: [], snapshot: null },
  }),
  createProgressSnapshot: (progression, save) => ({
    rankPoints: Number(progression?.rankPoints || 0),
    stats: { ...(progression?.stats || {}) },
    summary: summarizeSave(save),
  }),
  getCurrentDateKey: () => new Date().toISOString().slice(0, 10),
  getCurrentWeekKey: () => {
    const monday = new Date();
    const day = monday.getUTCDay() || 7;
    monday.setUTCDate(monday.getUTCDate() - (day - 1));
    return monday.toISOString().slice(0, 10);
  },
  buildQuestClaimKey: (quest, periodKey) => `${periodKey}:${quest.id}`,
  getQuestProgress: () => 0,
  getAchievementProgress: () => 0,
  isAchievementComplete: () => false,
  getCurrentQuestDefinitions: () => [],
};

const SERVER_RUNTIME = {
  checked: false,
  available: false,
  restoring: false,
};

const SERVER_SYNC = {
  save: Promise.resolve(),
  market: Promise.resolve(),
  savePending: 0,
  marketPending: 0,
};

const LIVE_SYNC_CONFIG = Object.freeze({
  intervalMs: 7000,
  focusDebounceMs: 320,
});

const SERVER_LIVE_SYNC = {
  intervalId: null,
  refreshTimer: null,
  inFlight: false,
};

let currentUsername = null;
let currentAccount = null;
let uiState = { previewLanguage: "de" };

const PASSWORD_KDF = {
  version: 2,
  algo: "pbkdf2-sha256",
  iterations: 120000,
  saltBytes: 16,
  hashBits: 256,
};

const SECURITY_LIMITS = {
  maxGold: 10000000,
  maxCollectionCopies: 9999,
  maxPackCopies: 999,
  maxDecks: 24,
  maxDeckNameLength: 32,
  maxLastOpenedCards: 8,
  maxFeeVault: 1000000000,
  maxMarketPrice: 250000,
  maxTradePressure: 18,
  maxTransactionAmount: 99,
};

const SECTION_SCENE_META = {
  menu: {
    eyebrow: "Hauptmenü",
    title: "Der schnellste Weg zurück in die Arena",
    text: "Von hier aus springst du direkt in Kämpfe, Karten, Shop und Markt, ohne dass das Spiel wie ein Verwaltungsmenü wirkt.",
    theme: "arena",
  },
  shop: {
    eyebrow: "Kuratorenmarkt",
    title: "Neue Macht wartet hinter jedem Siegel",
    text: "Shop, Booster und kommende Inhalte liegen wie Auslagen in einer leuchtenden Gewölbehalle vor dir.",
    theme: "shop",
  },
  marketplace: {
    eyebrow: "Freier Handel",
    title: "Werte steigen, fallen und kippen jede Stunde",
    text: "Der Marktplatz soll sich wie eine lebendige Börse anfühlen statt wie eine bloße Verkaufsliste.",
    theme: "marketplace",
  },
  booster: {
    eyebrow: "Siegelkammer",
    title: "Booster sollen wie kleine Rituale wirken",
    text: "Wähle dein Pack, entzünde die Kammer und lass die Karten mit gestaffeltem Reveal ins Gewölbe fallen.",
    theme: "booster",
  },
  collection: {
    eyebrow: "Archivgalerie",
    title: "Deine Sammlung steht im Zentrum",
    text: "Seltene Karten, Filter, Marktwerte und Deckstatus werden wie eine kuratierte Ausstellung präsentiert.",
    theme: "collection",
  },
  decks: {
    eyebrow: "Strategiekammer",
    title: "Deckbau soll sich wie Taktik anfühlen",
    text: "Gespeicherte Listen, Warnungen und verfügbare Karten sind als modulare Kommandoflächen angeordnet.",
    theme: "decks",
  },
  progress: {
    eyebrow: "Fortschrittsarchiv",
    title: "Quests, Liga und Sammlung greifen ineinander",
    text: "Tagesziele, Langzeitfortschritt, Pity-System und Sammelalbum sitzen als eigene Schicht zwischen Arena und Shop.",
    theme: "wiki",
  },
  wiki: {
    eyebrow: "Wissensarchiv",
    title: "Alle Systeme, Regeln und Symbole an einem Ort",
    text: "Die Wiki erklärt Karten, Markt, Arena, Konto und Serverbetrieb in einer durchsuchbaren Wissenszentrale.",
    theme: "wiki",
  },
  profile: {
    eyebrow: "Kontoprofil",
    title: "Dein Konto bleibt ein eigener Baustein",
    text: "Spielername, Passwort und Sicherheitsdaten liegen bewusst getrennt von Sammlung und Matchlogik.",
    theme: "profile",
  },
  friends: {
    eyebrow: "Kontaktzentrum",
    title: "Freunde, Kontakte und Handel an einem Ort",
    text: "Behalte Freundescode, Kontaktlisten und den Handelszugang in einem eigenen sozialen Bereich im Blick.",
    theme: "friends",
  },
  multiplayer: {
    eyebrow: "Mehrspieler",
    title: "Echte Spielerduelle mit Queue und offenen Herausforderungen",
    text: "Tritt gegen andere Spieler an, stelle dich in die Queue oder nimm offene Challenges direkt an.",
    theme: "friends",
  },
  settings: {
    eyebrow: "Steuerzentrale",
    title: "Effekte, Komfort und Sprache feinjustieren",
    text: "Passe Oberfläche, Klickgefühl, Booster-Inszenierung und Bestätigungen direkt für dein Konto an.",
    theme: "settings",
  },
  admin: {
    eyebrow: "Kontrollraum",
    title: "Verwaltung mit klarer Trennung zum Spiel",
    text: "Admin-Werkzeuge bleiben bewusst nüchtern, aber formal Teil derselben visuellen Welt.",
    theme: "admin",
  },
  arena: {
    eyebrow: "Duellarena",
    title: "Jedes Match bekommt seine eigene Bühne",
    text: "Board, Helden und Hand sitzen in einer inszenierten Kampfarena mit mehr Tiefe und klarerem Fokus.",
    theme: "arena",
  },
};

const DEFAULT_PLAYER_SETTINGS = Object.freeze({
  language: "de",
  clickEffects: true,
  packEffects: true,
  reducedMotion: false,
  confirmActions: true,
});

const DEFAULT_PROFILE_DISPLAY = Object.freeze({
  avatarId: "vault-core",
  frameId: "bronze-sigil",
  titleId: "vault-initiate",
});

const DEFAULT_COSMETICS = Object.freeze({
  avatars: Object.freeze(["vault-core"]),
  frames: Object.freeze(["bronze-sigil"]),
  titles: Object.freeze(["vault-initiate"]),
});

const DEFAULT_FRIEND_STATE = Object.freeze({
  friends: [],
  incoming: [],
  outgoing: [],
  blocked: [],
  tradeOffersIncoming: [],
  tradeOffersOutgoing: [],
  duelChallengesIncoming: [],
  duelChallengesOutgoing: [],
});

const DEFAULT_PROGRESS_STATE = Object.freeze({
  rankPoints: 0,
  achievementsClaimed: Object.freeze([]),
  quests: Object.freeze(PROGRESSION_RULES.createDefaultQuestState()),
  pity: Object.freeze({}),
  stats: Object.freeze({
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
  }),
  tradeHistory: Object.freeze([]),
  duelHistory: Object.freeze([]),
});

const RANK_TIERS = Object.freeze([
  { id: "bronze", label: Object.freeze({ de: "Bronze", en: "Bronze", fr: "Bronze" }), min: 0 },
  { id: "silber", label: Object.freeze({ de: "Silber", en: "Silver", fr: "Argent" }), min: 140 },
  { id: "gold", label: Object.freeze({ de: "Gold", en: "Gold", fr: "Or" }), min: 320 },
  { id: "platin", label: Object.freeze({ de: "Platin", en: "Platinum", fr: "Platine" }), min: 560 },
  { id: "diamant", label: Object.freeze({ de: "Diamant", en: "Diamond", fr: "Diamant" }), min: 860 },
  { id: "mythisch", label: Object.freeze({ de: "Mythisch", en: "Mythic", fr: "Mythique" }), min: 1220 },
]);

const LEGACY_DAILY_QUEST_DEFS = Object.freeze([
  {
    id: "daily-arena-wins",
    title: localText("Zwei Arenasiege", "Two arena wins", "Deux victoires d'arène"),
    description: localText("Gewinne 2 Arenakämpfe.", "Win 2 arena matches.", "Remporte 2 combats d'arène."),
    rewardGold: 80,
    getProgress: (progression) => progression.stats.arenaWins,
    target: 2,
  },
  {
    id: "daily-open-pack",
    title: localText("Booster öffnen", "Open boosters", "Ouvrir des boosters"),
    description: localText("Öffne 2 Booster.", "Open 2 boosters.", "Ouvre 2 boosters."),
    rewardGold: 70,
    getProgress: (progression) => progression.stats.boostersOpened,
    target: 2,
  },
  {
    id: "daily-market",
    title: localText("Markthandel", "Market trading", "Marché"),
    description: localText("Schließe 2 Marktdeals ab.", "Complete 2 market deals.", "Effectue 2 transactions au marché."),
    rewardGold: 65,
    getProgress: (progression) => progression.stats.marketDeals,
    target: 2,
  },
]);

const LEGACY_WEEKLY_QUEST_DEFS = Object.freeze([
  {
    id: "weekly-rank",
    title: localText("Ligafokus", "League focus", "Focus ligue"),
    description: localText("Sammle 90 Rangpunkte.", "Earn 90 rank points.", "Gagne 90 points de rang."),
    rewardGold: 220,
    rewardPackId: "market",
    getProgress: (progression) => progression.rankPoints,
    target: 90,
  },
  {
    id: "weekly-collection",
    title: localText("Albumdruck", "Album push", "Album"),
    description: localText("Ziehe 15 neue Karten.", "Pull 15 cards.", "Obtiens 15 cartes."),
    rewardGold: 180,
    rewardPackId: "champion",
    getProgress: (progression) => progression.stats.cardsOpened,
    target: 15,
  },
  {
    id: "weekly-social",
    title: localText("Sozialer Handel", "Social trader", "Échange social"),
    description: localText("Schließe 2 Trades oder Freundesduelle ab.", "Complete 2 trades or friend duels.", "Achève 2 échanges ou duels amicaux."),
    rewardGold: 190,
    rewardPackId: "market",
    getProgress: (progression) => progression.stats.tradesCompleted + progression.stats.friendWins + progression.stats.friendLosses,
    target: 2,
  },
]);

const LEGACY_ACHIEVEMENT_DEFS = Object.freeze([
  {
    id: "ach-first-win",
    title: localText("Erster Triumph", "First triumph", "Premier triomphe"),
    description: localText("Gewinne deinen ersten Arenakampf.", "Win your first arena match.", "Gagne ton premier combat d'arène."),
    rewardGold: 120,
    isComplete: (progression) => progression.stats.arenaWins >= 1,
  },
  {
    id: "ach-market-hand",
    title: localText("Markthändler", "Market trader", "Marchand"),
    description: localText("Schließe 10 Marktdeals ab.", "Complete 10 market deals.", "Effectue 10 transactions au marché."),
    rewardGold: 180,
    isComplete: (progression) => progression.stats.marketDeals >= 10,
  },
  {
    id: "ach-collection-50",
    title: localText("Archiv erweitert", "Expanded archive", "Archive étendue"),
    description: localText("Besitze 50 einzigartige Karten.", "Own 50 unique cards.", "Possède 50 cartes uniques."),
    rewardGold: 220,
    isComplete: (_, save) => summarizeSave(save).uniqueCards >= 50,
  },
  {
    id: "ach-legend",
    title: localText("Glanzzug", "Shining pull", "Tir brillant"),
    description: localText("Ziehe 5 Karten ab Legendär.", "Pull 5 legendary-or-better cards.", "Obtiens 5 cartes légendaires ou plus."),
    rewardGold: 260,
    rewardPackId: "champion",
    isComplete: (progression) => progression.stats.legendaryPlusPulled >= 5,
  },
  {
    id: "ach-hardcore",
    title: localText("Hardcore-Siegel", "Hardcore seal", "Sceau hardcore"),
    description: localText("Gewinne 1 Hardcore-Kampf.", "Win 1 hardcore match.", "Gagne 1 combat hardcore."),
    rewardGold: 320,
    rewardPackId: "relic",
    isComplete: (progression) => progression.stats.hardcoreWins >= 1,
  },
]);

const DAILY_QUEST_DEFS = PROGRESSION_RULES.DAILY_QUEST_DEFS;
const WEEKLY_QUEST_DEFS = PROGRESSION_RULES.WEEKLY_QUEST_DEFS;
const ACHIEVEMENT_DEFS = PROGRESSION_RULES.ACHIEVEMENT_DEFS;

const FACTION_DECK_BONUSES = Object.freeze({
  glutorden: {
    tone: "ember",
    minCards: 8,
    heroBonus: 2,
    enemyHeroPenalty: 2,
    title: localText("Glutorden-Druck", "Ember pressure", "Pression de braise"),
    short: localText("+2 Leben, Gegner -2", "+2 life, enemy -2", "+2 vie, ennemi -2"),
    description: localText("Dominanter Glutorden gibt deinem Helden +2 Leben und drückt den Gegner direkt um 2 Leben.", "A dominant Ember Order deck gives your hero +2 life and pressures the enemy hero for 2.", "Un deck Glutorden dominant donne +2 vie à ton héros et met 2 dégâts de pression au héros adverse."),
  },
  nebelchor: {
    tone: "mist",
    minCards: 8,
    heroBarrier: 2,
    openingHandDelta: 1,
    title: localText("Nebelchor-Vorsprung", "Mist lead", "Avance du brouillard"),
    short: localText("+2 Schild, +1 Karte", "+2 shield, +1 card", "+2 bouclier, +1 carte"),
    description: localText("Dominanter Nebelchor startet mit Schild und einer zusätzlichen Karte.", "A dominant Mist Choir start grants shield and one extra opening card.", "Un Nebelchor dominant démarre avec du bouclier et une carte supplémentaire."),
  },
  wurzelpakt: {
    tone: "grove",
    minCards: 8,
    heroBonus: 4,
    title: localText("Wurzelpakt-Ausdauer", "Root endurance", "Endurance des racines"),
    short: localText("+4 Leben", "+4 life", "+4 vie"),
    description: localText("Dominanter Wurzelpakt erhöht deine Startausdauer deutlich.", "A dominant Root Pact list noticeably increases your starting durability.", "Un Wurzelpakt dominant augmente nettement ton endurance de départ."),
  },
  schattenzirkel: {
    tone: "shadow",
    minCards: 8,
    heroBarrier: 1,
    enemyHeroPenalty: 1,
    title: localText("Schattenzirkel-Druck", "Shadow pressure", "Pression de l'ombre"),
    short: localText("+1 Schild, Gegner -1", "+1 shield, enemy -1", "+1 bouclier, ennemi -1"),
    description: localText("Schattenzirkel eröffnet defensiv und schwächt den Gegner direkt leicht an.", "Shadow Circle opens defensively and chips the enemy hero immediately.", "Le Cercle d'ombre ouvre défensivement et entame légèrement le héros adverse."),
  },
  sturmwacht: {
    tone: "storm",
    minCards: 8,
    startingManaBonus: 1,
    title: localText("Sturmwacht-Tempo", "Storm tempo", "Tempo de la tempête"),
    short: localText("+1 Startmana", "+1 starting mana", "+1 mana de départ"),
    description: localText("Eine klare Sturmwacht-Liste startet mit einem Mana Vorsprung.", "A focused Stormwatch list starts with an extra mana crystal.", "Une liste Tempête focalisée commence avec un cristal de mana supplémentaire."),
  },
  runenschmiede: {
    tone: "rune",
    minCards: 8,
    heroBarrier: 3,
    title: localText("Runenschmiede-Schutz", "Rune protection", "Protection runique"),
    short: localText("+3 Schild", "+3 shield", "+3 bouclier"),
    description: localText("Runenschmiede gibt deinem Helden einen kräftigen Startschutz.", "Runesmith grants your hero a sturdy opening shield.", "La Forge runique donne à ton héros un solide bouclier de départ."),
  },
  sternenhof: {
    tone: "star",
    minCards: 8,
    heroBonus: 2,
    openingHandDelta: 1,
    title: localText("Sternenhof-Balance", "Star balance", "Équilibre astral"),
    short: localText("+2 Leben, +1 Karte", "+2 life, +1 card", "+2 vie, +1 carte"),
    description: localText("Sternenhof verbindet Sicherheit mit einem zusätzlichen Startzugriff.", "Star Court blends safety with one extra opening draw.", "La Cour des étoiles combine sécurité et une carte de départ supplémentaire."),
  },
  knochenbund: {
    tone: "bone",
    minCards: 8,
    heroBonus: 2,
    heroBarrier: 1,
    title: localText("Knochenbund-Zähigkeit", "Bone resilience", "Résilience osseuse"),
    short: localText("+2 Leben, +1 Schild", "+2 life, +1 shield", "+2 vie, +1 bouclier"),
    description: localText("Knochenbund legt einen widerstandsfähigen Start hin.", "Bonebound opens with a sturdier starting shell.", "Le Clan d'os commence avec une base plus résistante."),
  },
});

const ARENA_DIFFICULTIES = Object.freeze({
  novice: Object.freeze({
    id: "novice",
    startingMana: 10,
    rewardWin: 55,
    rewardLoss: 20,
    rankWin: 12,
    rankLoss: 5,
    forfeitPenalty: 25,
    enemyHeroBonus: -8,
    enemyBarrier: 0,
    enemyOpeningHandDelta: -1,
    enemyStartingManaBonus: 0,
    unitBias: 0.6,
    selectionBias: -0.4,
    rarityRolls: Object.freeze({ legendary: 0.34, ultra: 0.12, mythic: 0.05, transcendent: 0.01, singular: 0 }),
  }),
  standard: Object.freeze({
    id: "standard",
    startingMana: 5,
    rewardWin: 90,
    rewardLoss: 35,
    rankWin: 18,
    rankLoss: 5,
    forfeitPenalty: 60,
    enemyHeroBonus: -2,
    enemyBarrier: 0,
    enemyOpeningHandDelta: -1,
    enemyStartingManaBonus: 0,
    unitBias: 0.63,
    selectionBias: -0.14,
    rarityRolls: Object.freeze({ legendary: 0.56, ultra: 0.28, mythic: 0.14, transcendent: 0.03, singular: 0.005 }),
  }),
  veteran: Object.freeze({
    id: "veteran",
    startingMana: 3,
    rewardWin: 145,
    rewardLoss: 50,
    rankWin: 24,
    rankLoss: 8,
    forfeitPenalty: 100,
    enemyHeroBonus: 2,
    enemyBarrier: 1,
    enemyOpeningHandDelta: 0,
    enemyStartingManaBonus: 0,
    unitBias: 0.67,
    selectionBias: 0.16,
    rarityRolls: Object.freeze({ legendary: 0.72, ultra: 0.42, mythic: 0.24, transcendent: 0.06, singular: 0.012 }),
  }),
  nightmare: Object.freeze({
    id: "nightmare",
    startingMana: 1,
    rewardWin: 230,
    rewardLoss: 70,
    rankWin: 34,
    rankLoss: 12,
    forfeitPenalty: 150,
    enemyHeroBonus: 7,
    enemyBarrier: 2,
    enemyOpeningHandDelta: 0,
    enemyStartingManaBonus: 1,
    unitBias: 0.71,
    selectionBias: 0.36,
    rarityRolls: Object.freeze({ legendary: 0.84, ultra: 0.56, mythic: 0.34, transcendent: 0.1, singular: 0.025 }),
  }),
  hardcore: Object.freeze({
    id: "hardcore",
    startingMana: 1,
    rewardWin: 340,
    rewardLoss: 0,
    rankWin: 60,
    rankLoss: 16,
    forfeitPenalty: 0,
    enemyHeroBonus: 10,
    enemyBarrier: 3,
    enemyOpeningHandDelta: 1,
    enemyStartingManaBonus: 1,
    unitBias: 0.74,
    selectionBias: 0.48,
    rarityRolls: Object.freeze({ legendary: 0.9, ultra: 0.66, mythic: 0.44, transcendent: 0.14, singular: 0.05 }),
  }),
});

const SETTINGS_INPUT_MAP = Object.freeze({
  settingsClickEffects: "clickEffects",
  settingsPackEffects: "packEffects",
  settingsReducedMotion: "reducedMotion",
  settingsConfirmActions: "confirmActions",
});

const LANGUAGE_LOCALES = Object.freeze({
  de: "de-CH",
  en: "en-US",
  fr: "fr-FR",
});

const LANGUAGE_LABELS = Object.freeze({
  de: "Deutsch",
  en: "English",
  fr: "Français",
});

const TYPE_TRANSLATIONS = Object.freeze({
  de: { unit: "Einheit", spell: "Zauber", trainer: "Trainer" },
  en: { unit: "Unit", spell: "Spell", trainer: "Trainer" },
  fr: { unit: "Unité", spell: "Sort", trainer: "Entraîneur" },
});

const RARITY_TRANSLATIONS = Object.freeze({
  de: {
    common: "Gewöhnlich",
    rare: "Selten",
    epic: "Episch",
    legendary: "Legendär",
    ultra: "Ultra Rare",
    mythic: "Mythisch",
    transcendent: "Transzendent",
  },
  en: {
    common: "Common",
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary",
    ultra: "Ultra Rare",
    mythic: "Mythic",
    transcendent: "Transcendent",
  },
  fr: {
    common: "Commun",
    rare: "Rare",
    epic: "Épique",
    legendary: "Légendaire",
    ultra: "Ultra Rare",
    mythic: "Mythique",
    transcendent: "Transcendant",
  },
});

const KEYWORD_TRANSLATIONS = Object.freeze({
  de: {
    charge: { label: "Sturmangriff", text: "Kann direkt in der Runde des Ausspielens angreifen." },
    guard: { label: "Wacht", text: "Muss zuerst angegriffen werden, solange Wacht-Einheiten im Feld stehen." },
    regen: { label: "Regeneration", text: "Heilt sich zu Beginn des eigenen Zuges um 1." },
    lifesteal: { label: "Lebensraub", text: "Heilt den eigenen Helden um den verursachten Kampfschaden." },
  },
  en: {
    charge: { label: "Charge", text: "Can attack immediately on the turn it is played." },
    guard: { label: "Guard", text: "Must be attacked first while guard units are on the board." },
    regen: { label: "Regeneration", text: "Heals 1 at the start of its controller's turn." },
    lifesteal: { label: "Lifesteal", text: "Heals your hero for the combat damage dealt." },
  },
  fr: {
    charge: { label: "Charge", text: "Peut attaquer immédiatement le tour où la carte est jouée." },
    guard: { label: "Garde", text: "Doit être attaquée en premier tant qu'une unité avec garde est sur le plateau." },
    regen: { label: "Régénération", text: "Rend 1 PV au début du tour de son contrôleur." },
    lifesteal: { label: "Vol de vie", text: "Soigne ton héros du montant des dégâts de combat infligés." },
  },
});

const STATUS_TRANSLATIONS = Object.freeze({
  de: {
    burn: { label: "Brand", text: "Erleidet zu Beginn des eigenen Zuges Schaden." },
    freeze: { label: "Frost", text: "Kann vorübergehend nicht angreifen." },
    poison: { label: "Gift", text: "Erleidet am Ende des eigenen Zuges Schaden." },
    barrier: { label: "Barriere", text: "Der nächste erlittene Schaden wird verhindert." },
  },
  en: {
    burn: { label: "Burn", text: "Takes damage at the start of its controller's turn." },
    freeze: { label: "Freeze", text: "Cannot attack for a short time." },
    poison: { label: "Poison", text: "Takes damage at the end of its controller's turn." },
    barrier: { label: "Barrier", text: "The next incoming damage is prevented." },
  },
  fr: {
    burn: { label: "Brûlure", text: "Subit des dégâts au début du tour de son contrôleur." },
    freeze: { label: "Gel", text: "Ne peut pas attaquer pendant un court moment." },
    poison: { label: "Poison", text: "Subit des dégâts à la fin du tour de son contrôleur." },
    barrier: { label: "Barrière", text: "Le prochain dégât subi est annulé." },
  },
});

const PACK_TRANSLATIONS = Object.freeze({
  de: {
    starter: {
      label: "Starter-Booster",
      tier: "Einsteiger",
      description: "Der günstige Einstieg mit schwächeren Chancen auf hohe Seltenheiten.",
    },
    market: {
      label: "Markt-Booster",
      tier: "Standard",
      description: "Solider Allrounder mit besserem Schnitt als das Starter-Booster.",
    },
    champion: {
      label: "Champion-Booster",
      tier: "Fortgeschritten",
      description: "Deutlich bessere Chancen auf epische und legendäre Treffer.",
    },
    relic: {
      label: "Relikt-Booster",
      tier: "Elite",
      description: "Für gezielte Upgrades mit hoher Ultra-Rare-Chance gedacht.",
    },
    astral: {
      label: "Astral-Booster",
      tier: "Luxus",
      description: "Die teuerste Stufe mit der besten Mythisch- und Transzendent-Wahrscheinlichkeit.",
    },
  },
  en: {
    starter: {
      label: "Starter Booster",
      tier: "Free Entry",
      description: "The low-cost entry pack with weaker odds for high rarities.",
    },
    market: {
      label: "Market Booster",
      tier: "Standard",
      description: "A solid all-rounder with better average pulls than the starter booster.",
    },
    champion: {
      label: "Champion Booster",
      tier: "Advanced",
      description: "Noticeably better odds for epic and legendary hits.",
    },
    relic: {
      label: "Relic Booster",
      tier: "Elite",
      description: "Built for targeted upgrades with a strong Ultra Rare chance.",
    },
    astral: {
      label: "Astral Booster",
      tier: "Luxury",
      description: "The most expensive tier with the best Mythic and Transcendent odds.",
    },
  },
  fr: {
    starter: {
      label: "Booster Départ",
      tier: "Entrée gratuite",
      description: "Le pack d'entrée avec des chances plus faibles d'obtenir les raretés élevées.",
    },
    market: {
      label: "Booster Marché",
      tier: "Standard",
      description: "Un booster polyvalent avec de meilleures moyennes que le booster de départ.",
    },
    champion: {
      label: "Booster Champion",
      tier: "Avancé",
      description: "De bien meilleures chances d'obtenir des cartes épiques et légendaires.",
    },
    relic: {
      label: "Booster Relique",
      tier: "Élite",
      description: "Pensé pour les améliorations ciblées avec une forte chance d'Ultra Rare.",
    },
    astral: {
      label: "Booster Astral",
      tier: "Luxe",
      description: "Le palier le plus cher avec les meilleures chances de cartes mythiques et transcendantes.",
    },
  },
});

const UI_TEXT = Object.freeze({
  de: {
    auth: {
      eyebrow: "Projekt Vault Online",
      title: "Dein Kartenkonto wartet schon.",
      body: "Erstelle dein Konto, starte mit fünf kostenlosen Starter-Boostern und baue dir direkt deine erste Sammlung auf.",
      points: [
        "Mehr als 700 Karten inklusive Trainerkarten",
        "Mehrere Booster-Stufen mit unterschiedlichen Chancen",
        "Gespeicherte Decks mit Verfügbarkeitsprüfung",
      ],
      loginTab: "Anmelden",
      registerTab: "Konto erstellen",
      username: "Spielername",
      password: "Passwort",
      loginButton: "Anmelden",
      registerButton: "Konto anlegen",
      loginHint: "Melde dich mit deinem Spielkonto an.",
      registerHint: "Neue Konten starten mit 0 Karten, 5 kostenlosen Starter-Boostern und etwas Startgold.",
      storageNote: "Dein Konto wird über den aktiven Spielserver verwaltet.",
    },
    brand: {
      eyebrow: "Strategie-Sammelkartenspiel",
      description: "Öffne Booster, sammle Karten, baue mehrere Decks und teste sie in rundenbasierten Duellen.",
      saveModeLabel: "Aktiver Speicher-Modus",
      saveModeValue: "Server-Speicher aktiv",
    },
    nav: {
      menu: "Hauptmenü",
      shop: "Shop",
      marketplace: "Marktplatz",
      booster: "Booster öffnen",
      collection: "Sammlung",
      decks: "Decks",
      wiki: "Wiki",
      profile: "Profil",
      friends: "Freunde",
      multiplayer: "Multiplayer",
      settings: "Einstellungen",
      admin: "Admin",
      arena: "Arena",
    },
    scene: {
      menu: { eyebrow: "Hauptmenü", title: "Der schnellste Weg zurück in die Arena", text: "Von hier aus springst du direkt in Kämpfe, Karten, Shop und Markt, ohne dass das Spiel wie ein Verwaltungsmenü wirkt." },
      shop: { eyebrow: "Kuratorenmarkt", title: "Neue Macht wartet hinter jedem Siegel", text: "Shop, Booster und kommende Inhalte liegen wie Auslagen in einer leuchtenden Gewölbehalle vor dir." },
      marketplace: { eyebrow: "Freier Handel", title: "Werte steigen, fallen und kippen jede Stunde", text: "Der Marktplatz soll sich wie eine lebendige Börse anfühlen statt wie eine bloße Verkaufsliste." },
      booster: { eyebrow: "Siegelkammer", title: "Booster sollen wie kleine Rituale wirken", text: "Wähle dein Pack, entzünde die Kammer und lass die Karten mit gestaffeltem Reveal ins Gewölbe fallen." },
      collection: { eyebrow: "Archivgalerie", title: "Deine Sammlung steht im Zentrum", text: "Seltene Karten, Filter, Marktwerte und Deckstatus werden wie eine kuratierte Ausstellung präsentiert." },
      decks: { eyebrow: "Strategiekammer", title: "Deckbau soll sich wie Taktik anfühlen", text: "Gespeicherte Listen, Warnungen und verfügbare Karten sind als modulare Kommandoflächen angeordnet." },
      wiki: { eyebrow: "Wissensarchiv", title: "Alle Systeme, Regeln und Symbole an einem Ort", text: "Die Wiki erklärt Karten, Markt, Arena, Konto und Serverbetrieb in einer durchsuchbaren Wissenszentrale." },
      profile: { eyebrow: "Kontoprofil", title: "Dein Konto bleibt ein eigener Baustein", text: "Spielername, Passwort und Sicherheitsdaten liegen bewusst getrennt von Sammlung und Matchlogik." },
      friends: { eyebrow: "Kontaktzentrum", title: "Freunde, Kontakte und Handel an einem Ort", text: "Behalte Freundescode, Kontaktlisten und den Handelszugang in einem eigenen sozialen Bereich im Blick." },
      settings: { eyebrow: "Steuerzentrale", title: "Effekte, Komfort und Sprache feinjustieren", text: "Passe Oberfläche, Klickgefühl, Booster-Inszenierung und Bestätigungen direkt für dein Konto an." },
      admin: { eyebrow: "Kontrollraum", title: "Verwaltung mit klarer Trennung zum Spiel", text: "Admin-Werkzeuge bleiben bewusst nüchtern, aber formal Teil derselben visuellen Welt." },
      arena: { eyebrow: "Duellarena", title: "Jedes Match bekommt seine eigene Bühne", text: "Board, Helden und Hand sitzen in einer inszenierten Kampfarena mit mehr Tiefe und klarerem Fokus." },
    },
    filters: {
      allRarities: "Alle Seltenheiten",
      allTypes: "Alle Typen",
      allFactions: "Alle Fraktionen",
      allCosts: "Alle Kosten",
      costLow: "0 bis 2 Mana",
      costMid: "3 bis 5 Mana",
      costHigh: "6 bis 9 Mana",
      sortRarityAsc: "Seltenheit aufsteigend",
      sortRarityDesc: "Seltenheit absteigend",
      sortCostAsc: "Mana aufsteigend",
      sortCostDesc: "Mana absteigend",
      sortOwnedDesc: "Meiste Kopien zuerst",
      sortNameAsc: "Name A bis Z",
      sortNameDesc: "Name Z bis A",
      sortMarketDesc: "Höchster Marktwert",
      marketHot: "Stärkster Anstieg",
      marketCold: "Stärkster Fall",
      marketValueDesc: "Höchster Marktwert",
      marketValueAsc: "Niedrigster Marktwert",
      marketName: "Name",
    },
    sections: {
      shopTitle: "Booster, Packs und Shop-Angebote",
      shopNote: "Stelle dir Booster, Themen-Packs und starke Kartenzugänge direkt aus dem Shop zusammen.",
      shopOffers: "Booster-Angebote",
      futureTitle: "Sonderangebote",
      marketTitle: "Stündliche Preisbewegungen durch Angebot und Nachfrage",
      marketNote: "Die Marktpreise aktualisieren sich jede echte Stunde. Der Marktplatzwert kann über oder unter dem normalen Händlerwert liegen.",
      marketMovers: "Top-Bewegungen",
      marketMoversNote: "Die stärksten Gewinner und Verlierer der letzten Marktrunde.",
      boosterTitle: "Booster öffnen",
      collectionTitle: "Alle Karten und Verkaufsoptionen",
      collectionNote: "Karten sind anklickbar. Im Detailfenster kannst du sie prüfen und verkaufen.",
      decksTitle: "Mehrere Decks speichern und prüfen",
      decksNote: "Wenn eine Karte verkauft wurde, bleibt das Deck gespeichert, wird aber als nicht spielbar markiert.",
      wikiTitle: "Alles zu Systemen, Karten und Regeln",
      wikiNote: "Finde Regeln, Symbole, Booster, Deckbau, Markt und Matchsystem gebÃ¼ndelt in einer durchsuchbaren Wissenszentrale.",
      profileTitle: "Kontodaten, Sicherheit und Reset",
      profileNote: "Verwalte deinen Namen, dein Passwort und deinen Kontostand zentral über dein Spielkonto.",
      friendsTitle: "Freundesnetz und Handelshub",
      multiplayerTitle: "Spielerduelle und Matchmaking",
      multiplayerNote: "Tritt gegen echte Spieler an, gehe in die Queue oder nimm offene Herausforderungen direkt an.",
      friendsNote: "Behalte deinen Freundescode, Kontakte und den späteren Handelsbereich an einer Stelle im Blick.",
      settingsTitle: "Spielgefühl, Effekte und Bestätigungen anpassen",
      settingsNote: "Die Einstellungen werden pro Konto gespeichert und sind als sauberes eigenes Modul angelegt.",
      adminTitle: "Konten verwalten und Spielstände direkt anpassen",
      adminNote: "Nur für das Administratorkonto sichtbar. Änderungen greifen direkt in die serverseitigen Spielstände.",
      arenaTitle: "Rundenbasiertes KIduell",
    },
    shop: {
      futureItems: [
        { title: "Fraktionsboxen", copy: "Kuratierten Kartenmix, passende Booster und garantierte Fraktionskerne im Paket sichern." },
        { title: "Elite-Bündel", copy: "Hochpreisige Pakete mit starken Karten, Extra-Boostern und direktem Deckfortschritt." },
        { title: "Saisonregale", copy: "Wechselnde Angebote, Themenpakete und spätere Event-Käufe laufen über denselben Shopbereich." },
      ],
    },
    market: {
      browseEyebrow: "Handelsfilter",
      browseTitle: "Angebote durchsuchen",
      search: "Suche",
      searchPlaceholder: "Karte am Marktplatz suchen",
      rarity: "Seltenheit",
      sort: "Sortierung",
      resetFilters: "Filter zurücksetzen",
      resultsMeta: "{count} Angebote · {sort}",
      nextHour: "Nächste Marktstunde",
      nextHourText: "Bis zur nächsten automatischen Preisrunde.",
      hottest: "Heißeste Karte",
      hottestText: "{delta} in der letzten Stunde",
      stable: "Stabiler Marktwert",
      stableText: "{name} führt aktuell den Markt an.",
      mood: "Marktstimmung",
      moodText: "Basiert auf durchschnittlicher Nachfrage gegen Angebot.",
      feeVault: "Gebührenpool",
      feeVaultText: "7 % Marktplatzgebühr werden als serverseitiger Anteil reserviert.",
      topGainer: "Größter Gewinner",
      topLoser: "Stärkster Rückgang",
      marketValue: "Marktwert {price} Gold · {delta}",
      noOffersTitle: "Keine Marktangebote im Filter",
      noOffersText: "Passe Suche oder Seltenheit an, um mehr Karten anzuzeigen.",
      buyButton: "Kaufen {price}G",
      sellNetButton: "Verkaufen netto {price}G",
      ownedShort: "Besitz",
      buyShort: "Ankauf",
      grossShort: "Brutto",
      netShort: "Netto",
      feeShort: "Gebühr",
      deltaShort: "Trend",
      footer: "Markt brutto {gross} Gold · Gebühr {fee} Gold · Auszahlung {net} Gold · Ankauf {buy} Gold · {delta}",
      buyerMarket: "Käufermarkt",
      sellerPressure: "Verkäuferdruck",
      balanced: "Ausgeglichen",
    },
    booster: {
      openSelected: "Ausgewähltes Booster öffnen",
      ownedTitle: "Deine Booster",
      ownedCount: "Im Besitz: {count}",
      guarantee: "Garantie: {rarity}",
      price: "Preis: {price} Gold",
      draws: "Ziehungen: 5 Karten",
      noneOpenedTitle: "Noch kein Booster geöffnet",
      noneOpenedText: "Wähle links ein Booster aus und öffne es. Die letzten gezogenen Karten werden hier angezeigt.",
      packBought: "{pack} gekauft.",
      packOpened: "{pack} geöffnet.",
    },
    collection: {
      search: "Suche",
      searchPlaceholder: "Kartennamen suchen",
      sort: "Sortierung",
      rarity: "Seltenheit",
      type: "Typ",
      faction: "Fraktion",
      mana: "Mana",
      ownedOnly: "Nur besessene Karten",
      duplicatesOnly: "Nur Duplikate",
      noCardsTitle: "Keine Karten gefunden",
      noCardsText: "Passe deine Filter an oder öffne mehr Booster.",
    },
    decks: {
      mode: "Deckmodus",
      activeName: "Aktiver Deckname",
      deckNamePlaceholder: "Deckname",
      saveDeckName: "Deckname speichern",
      newDeck: "Neues Deck",
      duplicateDeck: "Deck duplizieren",
      deleteDeck: "Aktives Deck löschen",
      activeDeckTitle: "Aktives Deck",
      savedDecksTitle: "Gespeicherte Decks",
      addCardsTitle: "Karten zum Hinzufügen",
      addCardsNote: "Ein Deck braucht genau 20 Karten, um in der Arena spielbar zu sein.",
      cardsMeta: "Karten {count}/{size}",
      unitsMeta: "Einheiten {count}",
      spellsMeta: "Zauber {count}/{limit}",
      trainersMeta: "Trainer {count}/{limit}",
      standardDeck: "Standard-Deck",
      hardcoreDeck: "Hardcore-Deck",
      playable: "Deck ist spielbar.",
      emptyDeckTitle: "Leeres Deck",
      emptyDeckText: "Füge Karten aus deiner Sammlung hinzu, damit das Deck spielbar wird.",
      add: "Hinzufügen",
      unavailable: "Nicht verfügbar",
      inDeck: "Im Deck {used}/{owned}",
      codeEyebrow: "Deck-Code",
      codeTitle: "Deck teilen und importieren",
      codeNote: "Kopiere dein aktuelles Deck oder füge einen Code ein, um eine Liste direkt zu laden.",
      codeLabel: "Deck-Code",
      codePlaceholder: "Deck-Code einfügen",
      copyCode: "Code kopieren",
      importCode: "Code importieren",
      clearCode: "Code löschen",
    },
    profile: {
      activeProfile: "Aktives Profil",
      friendCode: "Freundescode {code} · Erstellt am {date}",
      locked: "Fixiert",
      editable: "Bearbeitbar",
      lockedNote: "Das Administratorkonto bleibt absichtlich an die reservierten Bootstrap-Daten gebunden.",
      editableNote: "Namens- und Passwortänderungen prüfen das aktuelle Passwort und aktualisieren die laufende Sitzung direkt mit.",
      renameTitle: "Spielernamen ändern",
      renameNote: "Der neue Name muss 3 bis 12 Zeichen lang sein, darf kein Admin-Name sein und nicht bereits vergeben sein.",
      newUsername: "Neuer Spielername",
      currentPassword: "Aktuelles Passwort",
      saveUsername: "Spielernamen speichern",
      passwordTitle: "Passwort ändern",
      passwordNote: "Das aktuelle Passwort wird geprüft, bevor dein neues Passwort übernommen wird.",
      newPassword: "Neues Passwort",
      confirmPassword: "Neues Passwort wiederholen",
      updatePassword: "Passwort aktualisieren",
      serverTitle: "Kontostatus",
      bullet1: "Dein Konto verwaltet Sammlung, Decks, Booster und Einstellungen aus einem zentralen Spielstand.",
      bullet2: "Änderungen am Profil greifen direkt in die laufende Sitzung und bleiben serverseitig erhalten.",
      bullet3: "Auch Reset und Verwaltung bleiben klar vom eigentlichen Match-System getrennt.",
      dangerNote: "Konto zurücksetzen entfernt nur in diesem Konto Gold, Karten, Booster und Decks. Der Login selbst bleibt erhalten.",
      resetAccount: "Konto zurücksetzen",
      totalCards: "Karten gesamt",
      totalBoosters: "Booster gesamt",
    },
    friends: {
      network: "Freundesnetz",
      codeTitle: "Freundescode {code}",
      codeNote: "Dein Freundescode identifiziert dieses Konto im sozialen Bereich und bleibt an dein Profil gebunden.",
      friends: "Freunde",
      openRequests: "Anfragen offen",
      blocked: "Blockiert",
      modulesReady: "Module bereit",
      moduleActive: "Aktiv",
      moduleEmpty: "Leer",
      listEyebrow: "Freundesliste",
      listTitle: "Deine Kontakte",
      listEmpty: "Noch keine bestätigten Kontakte gespeichert.",
      listNote: "Bestätigte Kontakte erscheinen hier gesammelt mit ihrem sozialen Status.",
      requestsEyebrow: "Anfragen",
      requestsTitle: "Eingehend und ausgehend",
      requestsEmpty: "Aktuell gibt es keine offenen Freundschaftsanfragen.",
      requestsNote: "Eingehende und ausgehende Kontakte bleiben hier gebündelt im Blick.",
      tradeEyebrow: "Handel",
      tradeTitle: "Handelshub",
      feature1Title: "Direkte Kontakte",
      feature1Text: "Freundescode, Bestätigungen und Kontaktlisten greifen auf denselben Kontostand zurück.",
      feature2Title: "Sicherer Tausch",
      feature2Text: "Kartenhandel und Angebote sind für den serverseitigen Freigabepfad bereits sauber getrennt angelegt.",
      feature3Title: "Klare Kontrolle",
      feature3Text: "Soziale Daten, Sammlung und Markt bleiben strukturell getrennt, damit spätere Features sauber andocken können.",
    },
    settings: {
      activeSettings: "Aktive Einstellungen",
      activeCount: "{count} von {total} Komfortoptionen aktiv",
      syncNote: "Die Optionen werden pro Konto gespeichert und wirken direkt auf die aktuelle Spielsitzung.",
      calmMode: "Ruhiger Modus",
      fullStage: "Volle Bühne",
      language: "Sprache",
      displayTitle: "Anzeige und Komfort",
      clickTitle: "Klickeffekte aktivieren",
      clickNote: "Ripples und kleine Reaktionen auf Buttons und Karten.",
      packTitle: "Booster-Inszenierung aktivieren",
      packNote: "Öffnungs-Burst, Reveal-Effekte und stärkere Pack-Präsentation.",
      motionTitle: "Reduzierte Bewegung",
      motionNote: "Fährt zusätzliche Animationen und visuelle Bewegungen deutlich zurück.",
      confirmTitle: "Bestätigungen anzeigen",
      confirmNote: "Fragt vor Lösch- und Reset-Aktionen nach, bevor Daten geändert werden.",
      resetButton: "Einstellungen zurücksetzen",
      sessionTitle: "Sitzung",
      sessionNote: "Melde dich sauber von deinem aktuellen Konto ab.",
      logout: "Abmelden",
      clickEffects: "Klickeffekte",
      packEffects: "Booster-Inszenierung",
      movement: "Bewegung",
      confirmations: "Bestätigungen",
      saved: "Die Einstellung wurde gespeichert.",
      reset: "Die Einstellungen wurden zurückgesetzt.",
      languageChanged: "Die Sprache wurde gespeichert.",
    },
    admin: {
      createAccount: "Neues Konto anlegen",
      createUsername: "Spielername",
      createPassword: "Passwort",
      createButton: "Konto erstellen",
      allAccounts: "Alle Konten",
      selectedAccount: "Ausgewähltes Konto",
      economics: "Wirtschaft",
      packInventory: "Boosterbestand",
      cardCollection: "Kartensammlung",
      accountActions: "Kontoaktionen",
      goldAmount: "Goldmenge",
      packType: "Booster-Art",
      packAmount: "Booster-Anzahl",
      card: "Karte",
      cardAmount: "Karten-Anzahl",
      grantGold: "Gold gutschreiben",
      removeGold: "Gold abziehen",
      grantPack: "Booster geben",
      removePack: "Booster abziehen",
      grantCard: "Karten geben",
      removeCard: "Karten abziehen",
      dangerNote: "Spielkonten können vollständig gelöscht werden. Das Administratorkonto bleibt geschützt.",
      deleteAccount: "Ausgewähltes Konto löschen",
    },
    arena: {
      resetMatch: "Match verlassen",
      startMatch: "Neues Match starten",
      difficulty: "Schwierigkeit",
      difficultyHint: "Wähle eine Stufe. Schwerere Gegner geben mehr Gold.",
      recommended: "Empfohlen {difficulty}",
      antiFarmTitle: "Belohnung reduziert",
      antiFarmNote: "Dieses Deck ist für diese Stufe zu stark. Effektive Rewards: Sieg {win} Gold, Niederlage {loss} Gold.",
      rewardWin: "Sieg {gold} Gold",
      rewardLoss: "Niederlage {gold} Gold",
      forfeitPenalty: "Aufgabe -{gold} Gold",
      handTitle: "Deine Hand",
      endTurn: "Zug beenden",
      focusMode: "Match-Fokus aktiv",
      focusNote: "Navigation und Kartenverwaltung bleiben gesperrt, bis du das Match verlässt.",
      yourTurn: "Dein Zug",
      enemyTurn: "Gegnerischer Zug",
      victory: "Sieg",
      defeat: "Niederlage",
      notReady: "Nicht bereit",
      noMatch: "Kein aktives Match",
      noMatchText: "Die Arena nutzt jetzt Status-Effekte, Synergien, Timingfenster und längere Duelle.",
      opponent: "Gegner",
      you: "Du",
      readyStart: "Das aktive Deck ist spielbar. Du kannst ein Match starten.",
      startMatchHint: "Starte ein neues Match, sobald dein aktives Deck gültig ist.",
      noHandTitle: "Keine Handkarten",
      noHandText: "Ein Match erstellt automatisch deine Starthand.",
      round: "Runde {turn}",
      mana: "Mana {current}/{max}",
      yourDeck: "Dein Deck {count}",
      enemyDeck: "Gegnerisches Deck {count}",
      boardControl: "Board-Kontrolle",
      handFlow: "Kartenfluss",
      heroRace: "Heldenrennen",
      latestLog: "Letzte Lage",
      life: "Leben",
      hand: "Hand {count}",
      field: "Feld {count}/{size}",
      shield: "Schild {value}",
      attackReady: "Angriffsbereit",
      readyNextTurn: "Bereit nächste Runde",
      attack: "Angreifen",
      wait: "Warten",
      attackHint: "Greift die schwächste gegnerische Einheit an.",
      notReadyHint: "Noch nicht bereit",
      play: "Spielen",
      tooExpensive: "Zu teuer",
      detailsHint: "Klickbar für Details, Spielen nutzt Mana.",
      enemyTurnLocked: "Während des Gegnerzugs gesperrt",
      emptySlot: "Freies Feld",
      difficulties: {
        novice: { label: "Anfänger", description: "Verzeihender Gegner mit schwächerem Druck und kleineren Belohnungen." },
        standard: { label: "Standard", description: "Ausgewogene Arena-Stufe mit den normalen Goldwerten." },
        veteran: { label: "Veteran", description: "Härterer Gegner mit mehr Tempo, mehr Ausdauer und besseren Rewards." },
        nightmare: { label: "Albtraum", description: "Sehr starker Gegner mit hoher Belohnung, wenn du ihn bezwingst." },
        hardcore: { label: "Hardcore", description: "Eigenes 35-Karten-Spezialdeck. Niederlage oder Aufgabe zerstört diese Liste." },
      },
    },
    card: {
      cardInfo: "Karteninfo",
      synergy: "Synergie",
      synergyReady: "Das aktive Deck erfüllt diese Bedingung bereits.",
      synergyMissing: "Das aktive Deck erfüllt diese Bedingung aktuell noch nicht.",
      timing: "Timing",
      ownership: "Besitz und Decks",
      owned: "Besitz",
      inActiveDeck: "Aktives Deck",
      vendorSell: "Händlerwert",
      marketGross: "Brutto",
      marketFee: "Gebühr",
      marketPayout: "Netto",
      marketBuy: "Ankauf",
      hourlyMove: "Trend",
      actions: "Aktionen",
      note: "Hinweis",
      deckNote: "Wenn du eine Karte verkaufst, werden gespeicherte Decks nicht automatisch geändert. Betroffene Decks werden nur als blockiert markiert.",
      matchLockNote: "Während eines laufenden Matches sind Kartenhandel, Marktkäufe und Deckänderungen gesperrt.",
      sellOne: "1 verkaufen",
      sellDupes: "Duplikate verkaufen",
      marketSellOne: "1 am Markt verkaufen ({price}G netto)",
      marketBuyOne: "1 am Markt kaufen",
      sellAll: "Alles verkaufen",
      toDeck: "Zum aktiven Deck",
      cost: "Kosten {value}",
      attack: "ATK {value}",
      health: "HP {value}",
      keywordPrefix: "Schlüsselwörter: {value}.",
      synergyPrefix: "Synergie: Aktiv mit {value}.",
      timingPrefix: "Timing: {value}.",
      deathPrefix: "Todeseffekt: {value}",
      solid: "Eine solide Karte ohne Zusatzeffekt.",
      tokenUnit: "Beschworene Token-Einheit.",
      onPlay: "Beim Ausspielen",
      effect: "Effekt",
      also: "Außerdem",
      unknownEffect: "Löst einen ungewöhnlichen Effekt aus.",
    },
  },
  en: {},
  fr: {},
});

const WIKI_UI_TEXT = Object.freeze({
  de: {
    summaryEyebrow: "Orientierung",
    summaryTitle: "Schnellzugriff",
    summaryNote: "Nutze Themenfilter, Suche und einklappbare Kapitel, um Systeme, Regeln und Symbole schnell wiederzufinden.",
    quickLinks: "Direkt zu",
    searchTitle: "Schnell finden",
    searchLabel: "Suche",
    searchPlaceholder: "Thema, Effekt oder Regel suchen",
    contentEyebrow: "Spielwissen",
    contentTitle: "Kapitel und Systeme",
    clearFilters: "Filter löschen",
    noResultsTitle: "Keine passenden Kapitel",
    noResultsText: "Passe Suche oder Themenfilter an, um andere Inhalte anzuzeigen.",
    resultsAll: "{count} von {total} Kapiteln · alle Themen",
    resultsTopic: "{count} von {total} Kapiteln · Thema: {topic}",
    stats: {
      chapters: "Kapitel",
      factions: "Fraktionen",
      boosters: "Booster",
      packs: "Packs",
    },
    topics: {
      all: "Alles",
      start: "Start",
      economy: "Shop & Gold",
      cards: "Karten & Symbole",
      decks: "Sammlung & Decks",
      arena: "Arena & Markt",
      account: "Konto & Server",
    },
  },
  en: {
    summaryEyebrow: "Orientation",
    summaryTitle: "Quick Access",
    summaryNote: "Use topic filters, search and collapsible chapters to find rules, systems and symbols quickly.",
    quickLinks: "Jump to",
    searchTitle: "Find fast",
    searchLabel: "Search",
    searchPlaceholder: "Search a topic, rule or effect",
    contentEyebrow: "Game Knowledge",
    contentTitle: "Chapters and Systems",
    clearFilters: "Clear filters",
    noResultsTitle: "No matching chapters",
    noResultsText: "Adjust search or topic filters to reveal other wiki entries.",
    resultsAll: "{count} of {total} chapters · all topics",
    resultsTopic: "{count} of {total} chapters · topic: {topic}",
    stats: {
      chapters: "Chapters",
      factions: "Factions",
      boosters: "Boosters",
      packs: "Packs",
    },
    topics: {
      all: "All",
      start: "Start",
      economy: "Shop & Gold",
      cards: "Cards & Symbols",
      decks: "Collection & Decks",
      arena: "Arena & Market",
      account: "Account & Server",
    },
  },
  fr: {
    summaryEyebrow: "Orientation",
    summaryTitle: "Accès rapide",
    summaryNote: "Utilise les filtres, la recherche et les chapitres repliables pour retrouver rapidement les règles et systèmes.",
    quickLinks: "Accès direct",
    searchTitle: "Trouver vite",
    searchLabel: "Recherche",
    searchPlaceholder: "Chercher un thème, une règle ou un effet",
    contentEyebrow: "Savoir du jeu",
    contentTitle: "Chapitres et systèmes",
    clearFilters: "Effacer les filtres",
    noResultsTitle: "Aucun chapitre correspondant",
    noResultsText: "Ajuste la recherche ou le filtre de thème pour afficher d'autres contenus.",
    resultsAll: "{count} sur {total} chapitres · tous les thèmes",
    resultsTopic: "{count} sur {total} chapitres · thème : {topic}",
    stats: {
      chapters: "Chapitres",
      factions: "Factions",
      boosters: "Boosters",
      packs: "Packs",
    },
    topics: {
      all: "Tout",
      start: "Départ",
      economy: "Boutique & Or",
      cards: "Cartes & symboles",
      decks: "Collection & decks",
      arena: "Arène & marché",
      account: "Compte & serveur",
    },
  },
});

function interpolateText(template, values = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getCurrentLanguage() {
  const language = currentAccount?.save?.settings?.language || uiState?.previewLanguage || "de";
  return SUPPORTED_LANGUAGES.includes(language) ? language : "de";
}

function getCurrentLocale() {
  return LANGUAGE_LOCALES[getCurrentLanguage()] || LANGUAGE_LOCALES.de;
}

function getUiText(path, values = {}) {
  const current = path.split(".").reduce((value, segment) => value?.[segment], UI_TEXT[getCurrentLanguage()]);
  const fallback = path.split(".").reduce((value, segment) => value?.[segment], UI_TEXT.de);
  const resolved = current ?? fallback ?? path;
  return typeof resolved === "string" ? interpolateText(resolved, values) : resolved;
}

function getWikiUiText(path, values = {}) {
  const current = path.split(".").reduce((value, segment) => value?.[segment], WIKI_UI_TEXT[getCurrentLanguage()]);
  const fallback = path.split(".").reduce((value, segment) => value?.[segment], WIKI_UI_TEXT.de);
  const resolved = current ?? fallback ?? path;
  return typeof resolved === "string" ? interpolateText(resolved, values) : resolved;
}

function normalizeWikiSearchText(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function buildWikiSearchBlob(section) {
  return [
    section.title,
    section.summary,
    ...(section.tags || []),
    ...(section.bullets || []),
    ...((section.callouts || []).flatMap((entry) => [entry.label, entry.text])),
  ].join(" ");
}

function jumpToWikiSection(sectionId) {
  const target = document.getElementById(`wiki-entry-${sectionId}`);
  if (!target) {
    return;
  }
  target.open = true;
  target.scrollIntoView({
    behavior: getUserSettings().reducedMotion ? "auto" : "smooth",
    block: "start",
  });
}

function handleWikiTopicClick(event) {
  const button = event.target.closest("[data-wiki-topic]");
  if (!button) {
    return;
  }

  uiState.wikiTopic = button.dataset.wikiTopic || "all";
  renderWiki();
}

function handleWikiSummaryClick(event) {
  const resetButton = event.target.closest("[data-wiki-reset]");
  if (resetButton) {
    uiState.wikiSearch = "";
    uiState.wikiTopic = "all";
    renderWiki();
    return;
  }

  const jumpButton = event.target.closest("[data-wiki-jump]");
  if (!jumpButton) {
    return;
  }

  const targetSection = buildWikiSections().find((entry) => entry.id === jumpButton.dataset.wikiJump);
  if (!targetSection) {
    return;
  }

  uiState.wikiSearch = "";
  uiState.wikiTopic = targetSection.topic;
  renderWiki();
  window.requestAnimationFrame(() => jumpToWikiSection(targetSection.id));
}

function getArenaDifficultyId(value) {
  return Object.prototype.hasOwnProperty.call(ARENA_DIFFICULTIES, value) ? value : "standard";
}

function getArenaDifficulty(value) {
  return ARENA_DIFFICULTIES[getArenaDifficultyId(value)];
}

function getArenaDifficultyLabel(value) {
  const difficultyId = getArenaDifficultyId(value);
  return getUiText(`arena.difficulties.${difficultyId}.label`);
}

function getArenaDifficultyDescription(value) {
  const difficultyId = getArenaDifficultyId(value);
  return getUiText(`arena.difficulties.${difficultyId}.description`);
}

function getDeckModeId(value) {
  return Object.prototype.hasOwnProperty.call(DECK_RULES, value) ? value : DECK_MODES.standard;
}

function getDeckRules(value = DECK_MODES.standard) {
  return DECK_RULES[getDeckModeId(value)];
}

function getDeckModeForDifficulty(value) {
  return getArenaDifficultyId(value) === "hardcore" ? DECK_MODES.hardcore : DECK_MODES.standard;
}

function getSelectedDeckMode() {
  return getDeckModeId(uiState.deckMode || DECK_MODES.standard);
}

function getArenaDifficultyRank(value) {
  return ["novice", "standard", "veteran", "nightmare", "hardcore"].indexOf(getArenaDifficultyId(value));
}

function getRecommendedArenaDifficultyId(profile) {
  const powerScore = Number(profile?.powerScore || 0);
  const eliteCount = Number(profile?.eliteCount || 0);
  const singularCount = Number(profile?.rarities?.singular || 0);
  const transcendentCount = Number(profile?.rarities?.transcendent || 0);
  const mythicCount = Number(profile?.rarities?.mythic || 0);
  const ultraCount = Number(profile?.rarities?.ultra || 0);

  if (powerScore >= 430 || singularCount >= 2 || transcendentCount >= 4 || mythicCount >= 7 || eliteCount >= 14) {
    return "hardcore";
  }

  if (powerScore >= 320 || singularCount >= 1 || transcendentCount >= 2 || mythicCount >= 4 || eliteCount >= 10) {
    return "nightmare";
  }

  if (powerScore >= 170 || mythicCount >= 2 || ultraCount >= 3 || eliteCount >= 6) {
    return "veteran";
  }

  if (powerScore >= 90 || (profile?.rarities?.epic || 0) >= 6 || eliteCount >= 2) {
    return "standard";
  }

  return "novice";
}

function createArenaMatchConfig(deckProfile, selectedDifficultyId) {
  const selectedDifficulty = getArenaDifficulty(selectedDifficultyId);
  const recommendedDifficultyId = getRecommendedArenaDifficultyId(deckProfile);
  const antiFarmGap = Math.max(0, getArenaDifficultyRank(recommendedDifficultyId) - getArenaDifficultyRank(selectedDifficulty.id));
  const rewardMultipliers = [1, 0.55, 0.24, 0.08];
  const rewardMultiplier = rewardMultipliers[Math.min(antiFarmGap, rewardMultipliers.length - 1)];

  return {
    ...selectedDifficulty,
    recommendedDifficultyId,
    antiFarmGap,
    antiFarmActive: antiFarmGap > 0,
    rewardWin: Math.max(6, Math.round(selectedDifficulty.rewardWin * rewardMultiplier)),
    rewardLoss: Math.max(2, Math.round(selectedDifficulty.rewardLoss * rewardMultiplier)),
    rankWin: Math.max(2, Math.round(selectedDifficulty.rankWin * rewardMultiplier)),
    rankLoss: Math.max(0, selectedDifficulty.rankLoss),
    powerScore: Number(deckProfile?.powerScore || 0),
  };
}

function getTypeLabel(type) {
  return TYPE_TRANSLATIONS[getCurrentLanguage()]?.[type] || TYPE_TRANSLATIONS.de[type] || TYPE_LABELS[type];
}

function getRarityLabel(rarity) {
  return RARITY_TRANSLATIONS[getCurrentLanguage()]?.[rarity] || RARITY_TRANSLATIONS.de[rarity] || RARITY_META[rarity]?.label || rarity;
}

function getKeywordLabel(keyword) {
  return KEYWORD_TRANSLATIONS[getCurrentLanguage()]?.[keyword]?.label || KEYWORD_TRANSLATIONS.de[keyword]?.label || KEYWORD_META[keyword]?.label || keyword;
}

function getKeywordText(keyword) {
  return KEYWORD_TRANSLATIONS[getCurrentLanguage()]?.[keyword]?.text || KEYWORD_TRANSLATIONS.de[keyword]?.text || KEYWORD_META[keyword]?.text || keyword;
}

function getStatusLabel(kind) {
  return STATUS_TRANSLATIONS[getCurrentLanguage()]?.[kind]?.label || STATUS_TRANSLATIONS.de[kind]?.label || STATUS_META[kind]?.label || kind;
}

function getStatusText(kind) {
  return STATUS_TRANSLATIONS[getCurrentLanguage()]?.[kind]?.text || STATUS_TRANSLATIONS.de[kind]?.text || STATUS_META[kind]?.text || kind;
}

function getTypeVisual(type) {
  return TYPE_VISUALS[type] || TYPE_VISUALS.unit;
}

function getFactionVisual(factionId) {
  return FACTION_VISUALS[factionId] || { symbol: "✦", tone: "neutral" };
}

function getKeywordVisual(keyword) {
  return KEYWORD_VISUALS[keyword] || { symbol: "◆", tone: "neutral" };
}

function getEffectVisual(kind) {
  return EFFECT_VISUALS[kind] || EFFECT_VISUALS.neutral;
}

function getDeathEffectTitle() {
  return getUiText("card.deathEffectTitle");
}

function getLocalizedEffectBadgeLabel(kind) {
  switch (kind) {
    case "damageHero":
      return getCurrentLanguage() === "fr" ? "Dégâts directs" : getCurrentLanguage() === "en" ? "Direct damage" : "Direktschaden";
    case "healHero":
      return getCurrentLanguage() === "fr" ? "Soin du héros" : getCurrentLanguage() === "en" ? "Hero heal" : "Heldenheilung";
    case "draw":
      return getCurrentLanguage() === "fr" ? "Pioche" : getCurrentLanguage() === "en" ? "Draw" : "Kartenziehen";
    case "gainMana":
      return getCurrentLanguage() === "fr" ? "Mana" : getCurrentLanguage() === "en" ? "Mana" : "Mana";
    case "gainMaxMana":
      return getCurrentLanguage() === "fr" ? "Mana max." : getCurrentLanguage() === "en" ? "Max mana" : "Max. Mana";
    case "buffBoard":
      return getCurrentLanguage() === "fr" ? "Buff du plateau" : getCurrentLanguage() === "en" ? "Board buff" : "Feldbuff";
    case "fortifyBoard":
      return getCurrentLanguage() === "fr" ? "Festigung" : getCurrentLanguage() === "en" ? "Fortify" : "Festigung";
    case "healBoard":
      return getCurrentLanguage() === "fr" ? "Soin de zone" : getCurrentLanguage() === "en" ? "Board heal" : "Feldheilung";
    case "strikeWeakest":
      return getCurrentLanguage() === "fr" ? "Präziser Schlag" : getCurrentLanguage() === "en" ? "Precision hit" : "Präzisionsschlag";
    case "damageAllEnemies":
      return getCurrentLanguage() === "fr" ? "Flächenschaden" : getCurrentLanguage() === "en" ? "Area damage" : "Flächenschaden";
    case "burnWeakest":
      return getCurrentLanguage() === "fr" ? "Feuer" : getCurrentLanguage() === "en" ? "Fire" : "Feuer";
    case "freezeWeakest":
      return getCurrentLanguage() === "fr" ? "Frost" : getCurrentLanguage() === "en" ? "Frost" : "Frost";
    case "poisonWeakest":
      return getCurrentLanguage() === "fr" ? "Gift" : getCurrentLanguage() === "en" ? "Poison" : "Gift";
    case "barrierStrongest":
    case "barrierHero":
      return getCurrentLanguage() === "fr" ? "Barrière" : getCurrentLanguage() === "en" ? "Barrier" : "Barriere";
    case "summonTokens":
      return getCurrentLanguage() === "fr" ? "Beschwörung" : getCurrentLanguage() === "en" ? "Summon" : "Beschwörung";
    case "weakenEnemies":
      return getCurrentLanguage() === "fr" ? "Schwächung" : getCurrentLanguage() === "en" ? "Weaken" : "Schwächung";
    case "drainHero":
      return getCurrentLanguage() === "fr" ? "Lebensentzug" : getCurrentLanguage() === "en" ? "Drain" : "Lebensentzug";
    case "readyStrongest":
      return getCurrentLanguage() === "fr" ? "Tempo" : getCurrentLanguage() === "en" ? "Tempo" : "Tempo";
    case "empowerUnit":
      return getCurrentLanguage() === "fr" ? "Verstärkung" : getCurrentLanguage() === "en" ? "Empower" : "Verstärkung";
    default:
      return getUiText("card.effect");
  }
}

function getLocalizedCompactEffect(effect) {
  switch (effect?.kind) {
    case "damageHero":
      return getCurrentLanguage() === "fr" ? `${effect.value} dégâts au héros` : getCurrentLanguage() === "en" ? `${effect.value} damage to hero` : `${effect.value} Schaden am Helden`;
    case "healHero":
      return getCurrentLanguage() === "fr" ? `Soigne ${effect.value}` : getCurrentLanguage() === "en" ? `Heal ${effect.value}` : `Heilt ${effect.value}`;
    case "draw":
      return getCurrentLanguage() === "fr" ? `Pioche ${effect.value}` : getCurrentLanguage() === "en" ? `Draw ${effect.value}` : `Zieht ${effect.value}`;
    case "gainMana":
      return getCurrentLanguage() === "fr" ? `+${effect.value} mana immédiat` : getCurrentLanguage() === "en" ? `+${effect.value} mana now` : `+${effect.value} Mana sofort`;
    case "gainMaxMana":
      return getCurrentLanguage() === "fr" ? `+${effect.value} mana max.` : getCurrentLanguage() === "en" ? `+${effect.value} max mana` : `+${effect.value} Max. Mana`;
    case "buffBoard":
      return getCurrentLanguage() === "fr" ? `Plateau +${effect.attack}/+${effect.health}` : getCurrentLanguage() === "en" ? `Board +${effect.attack}/+${effect.health}` : `Feld +${effect.attack}/+${effect.health}`;
    case "fortifyBoard":
      return getCurrentLanguage() === "fr" ? `Héros et plateau +${effect.value}` : getCurrentLanguage() === "en" ? `Hero and board +${effect.value}` : `Held und Feld +${effect.value}`;
    case "healBoard":
      return getCurrentLanguage() === "fr" ? `Soin de zone ${effect.value}` : getCurrentLanguage() === "en" ? `Board heal ${effect.value}` : `Feldheilung ${effect.value}`;
    case "strikeWeakest":
      return getCurrentLanguage() === "fr" ? `Cible la plus faible ${effect.value}` : getCurrentLanguage() === "en" ? `Weakest target ${effect.value}` : `Schwächstes Ziel ${effect.value}`;
    case "damageAllEnemies":
      return getCurrentLanguage() === "fr" ? `Tous les ennemis ${effect.value}` : getCurrentLanguage() === "en" ? `All enemies ${effect.value}` : `Alle Gegner ${effect.value}`;
    case "burnWeakest":
      return getCurrentLanguage() === "fr" ? `Brûlure ${effect.value}/${effect.turns}` : getCurrentLanguage() === "en" ? `Burn ${effect.value}/${effect.turns}` : `Brand ${effect.value}/${effect.turns}`;
    case "freezeWeakest":
      return getCurrentLanguage() === "fr" ? `Gel ${effect.turns} tour` : getCurrentLanguage() === "en" ? `Freeze ${effect.turns} turn` : `Frost ${effect.turns} Runde`;
    case "poisonWeakest":
      return getCurrentLanguage() === "fr" ? `Poison ${effect.value}/${effect.turns}` : getCurrentLanguage() === "en" ? `Poison ${effect.value}/${effect.turns}` : `Gift ${effect.value}/${effect.turns}`;
    case "barrierStrongest":
      return getCurrentLanguage() === "fr" ? `Barrière à l'unité forte` : getCurrentLanguage() === "en" ? `Barrier on strongest unit` : `Barriere für stärkste Einheit`;
    case "barrierHero":
      return getCurrentLanguage() === "fr" ? `Bouclier héros ${effect.value}` : getCurrentLanguage() === "en" ? `Hero barrier ${effect.value}` : `Heldenschild ${effect.value}`;
    case "summonTokens":
      return getCurrentLanguage() === "fr" ? `Invoque ${effect.amount}` : getCurrentLanguage() === "en" ? `Summon ${effect.amount}` : `Beschwört ${effect.amount}`;
    case "weakenEnemies":
      return getCurrentLanguage() === "fr" ? `Adversaires -${effect.value} attaque` : getCurrentLanguage() === "en" ? `Enemies -${effect.value} attack` : `Gegner -${effect.value} Angriff`;
    case "drainHero":
      return getCurrentLanguage() === "fr" ? `Drain ${effect.damage}/${effect.heal}` : getCurrentLanguage() === "en" ? `Drain ${effect.damage}/${effect.heal}` : `Entzug ${effect.damage}/${effect.heal}`;
    case "readyStrongest":
      return getCurrentLanguage() === "fr" ? "Stärkste Einheit sofort bereit" : getCurrentLanguage() === "en" ? "Strongest unit ready now" : "Stärkste Einheit sofort bereit";
    case "empowerUnit":
      return getCurrentLanguage() === "fr" ? `Dernière unité +${effect.attack}/+${effect.health}` : getCurrentLanguage() === "en" ? `Last unit +${effect.attack}/+${effect.health}` : `Letzte Einheit +${effect.attack}/+${effect.health}`;
    default:
      return getUiText("card.unknownEffect");
  }
}

function stripEffectLead(text) {
  return String(text)
    .replace(`${getUiText("card.onPlay")}: `, "")
    .replace(`${getUiText("card.effect")}: `, "");
}

function buildCardPrimaryEntries(card) {
  const effects = normalizeEffectList(card.effect);

  if (!effects.length) {
    return [{
      key: `solid:${card.id}`,
      icon: getEffectVisual("neutral").symbol,
      tone: "neutral",
      label: getUiText("card.noCoreEffects"),
      short: card.isToken ? getUiText("card.tokenUnit") : getUiText("card.solid"),
      copy: card.isToken ? getUiText("card.tokenUnit") : getUiText("card.solid"),
    }];
  }

  return effects.map((effect, index) => {
    const visual = getEffectVisual(effect.kind);
    return {
      key: `effect:${effect.kind}:${index}`,
      icon: visual.symbol,
      tone: visual.tone,
      label: getLocalizedEffectBadgeLabel(effect.kind),
      short: getLocalizedCompactEffect(effect),
      copy: describeLocalizedEffect(card.type, effect, index),
    };
  });
}

function buildCardSupportEntries(card, synergyReady = false) {
  const entries = [];

  (card.keywords || []).forEach((keyword) => {
    const visual = getKeywordVisual(keyword);
    entries.push({
      key: `keyword:${keyword}`,
      icon: visual.symbol,
      tone: visual.tone,
      label: getKeywordLabel(keyword),
      short: getKeywordText(keyword),
      copy: getKeywordText(keyword),
    });
  });

  if (card.synergy) {
    entries.push({
      key: `synergy:${card.id}`,
      icon: getEffectVisual("synergy").symbol,
      tone: getEffectVisual("synergy").tone,
      label: getUiText("card.synergy"),
      short: describeSynergyCondition(card.synergy.condition),
      copy: `${describeSynergyCondition(card.synergy.condition)}. ${synergyReady ? getUiText("card.synergyReady") : getUiText("card.synergyMissing")}`,
    });
  }

  if (card.timing) {
    entries.push({
      key: `timing:${card.id}`,
      icon: getEffectVisual("timing").symbol,
      tone: getEffectVisual("timing").tone,
      label: getUiText("card.timing"),
      short: describeTiming(card.timing),
      copy: describeTiming(card.timing),
    });
  }

  if (card.deathEffect) {
    entries.push({
      key: `death:${card.id}`,
      icon: getEffectVisual("death").symbol,
      tone: getEffectVisual("death").tone,
      label: getDeathEffectTitle(),
      short: stripEffectLead(describeLocalizedEffect(card.type, card.deathEffect, 0)),
      copy: stripEffectLead(describeLocalizedEffect(card.type, card.deathEffect, 0)),
    });
  }

  return entries;
}

function buildEffectChipMarkup(entries, options = {}) {
  const {
    limit = entries.length,
    className = "effect-chip",
  } = options;

  return entries.slice(0, limit).map((entry) => `
    <span class="${className} tone-${entry.tone}" title="${escapeHtml(entry.copy || entry.short || entry.label)}">
      <span class="${className}-icon">${escapeHtml(entry.icon)}</span>
      <span class="${className}-label">${escapeHtml(entry.label)}</span>
    </span>
  `).join("");
}

function buildCardSummaryMarkup(card, limit = 3) {
  const primaryEntries = buildCardPrimaryEntries(card).filter((entry) => entry.key !== `solid:${card.id}`);
  const supportEntries = buildCardSupportEntries(card, false);
  const summaryEntries = [
    ...primaryEntries,
    ...supportEntries.filter((entry) => !entry.key.startsWith("keyword:")),
  ];

  if (!summaryEntries.length) {
    const fallbackText = card.isToken ? getUiText("card.tokenUnit") : getUiText("card.solid");
    return `
      <li class="card-summary-item tone-neutral">
        <span class="card-summary-icon tone-neutral">•</span>
        <span class="card-summary-copy">
          <strong>${escapeHtml(getUiText("card.noCoreEffects"))}</strong>
          <small>${escapeHtml(fallbackText)}</small>
        </span>
      </li>
    `;
  }

  return summaryEntries.slice(0, limit).map((entry) => `
    <li class="card-summary-item tone-${entry.tone}">
      <span class="card-summary-icon tone-${entry.tone}">${escapeHtml(entry.icon)}</span>
      <span class="card-summary-copy">
        <strong>${escapeHtml(entry.label)}</strong>
        <small>${escapeHtml(entry.short)}</small>
      </span>
    </li>
  `).join("");
}

function buildCardDetailList(entries, emptyText) {
  if (!entries.length) {
    return `<p class="mini-note">${escapeHtml(emptyText)}</p>`;
  }

  return `
    <div class="detail-list">
      ${entries.map((entry) => `
        <div class="detail-list-item tone-${entry.tone}">
          <span class="detail-icon tone-${entry.tone}">${escapeHtml(entry.icon)}</span>
          <div class="detail-copy">
            <strong>${escapeHtml(entry.label)}</strong>
            <span>${escapeHtml(entry.copy || entry.short || entry.label)}</span>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function getPackLabel(packId) {
  return PACK_TRANSLATIONS[getCurrentLanguage()]?.[packId]?.label || PACK_TRANSLATIONS.de[packId]?.label || PACK_DEFINITIONS[packId]?.label || packId;
}

function getPackTier(packId) {
  return PACK_TRANSLATIONS[getCurrentLanguage()]?.[packId]?.tier || PACK_TRANSLATIONS.de[packId]?.tier || PACK_DEFINITIONS[packId]?.tier || "";
}

function getPackDescription(packId) {
  return PACK_TRANSLATIONS[getCurrentLanguage()]?.[packId]?.description || PACK_TRANSLATIONS.de[packId]?.description || PACK_DEFINITIONS[packId]?.description || "";
}

function getCosmeticGroupLabel(type) {
  if (getCurrentLanguage() === "fr") {
    return type === "avatars" ? "Portraits" : type === "frames" ? "Cadres" : "Titres";
  }

  if (getCurrentLanguage() === "en") {
    return type === "avatars" ? "Avatars" : type === "frames" ? "Frames" : "Titles";
  }

  return type === "avatars" ? "Profilbilder" : type === "frames" ? "Profilrahmen" : "Titel";
}

function getCosmeticCollectionTitle() {
  if (getCurrentLanguage() === "fr") {
    return "Identité de profil";
  }

  if (getCurrentLanguage() === "en") {
    return "Profile identity";
  }

  return "Profil-Identität";
}

function getCosmeticItem(type, itemId) {
  return COSMETIC_DEFINITIONS[type]?.find((entry) => entry.id === itemId) || null;
}

function getCosmeticLabel(type, itemId) {
  const item = getCosmeticItem(type, itemId);
  return item?.label?.[getCurrentLanguage()] || item?.label?.de || itemId;
}

function getCosmeticDescription(type, itemId) {
  const item = getCosmeticItem(type, itemId);
  return item?.description?.[getCurrentLanguage()] || item?.description?.de || "";
}

function pickLocalizedText(value) {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  return value[getCurrentLanguage()] || value.de || Object.values(value)[0] || "";
}

function localText(de, en, fr) {
  return pickLocalizedText({ de, en, fr });
}

function getCosmeticInventory() {
  return getSave()?.cosmetics || cloneJsonValue(DEFAULT_COSMETICS);
}

function getProfileDisplay() {
  const save = getSave();
  const cosmetics = getCosmeticInventory();
  const fallback = cloneJsonValue(DEFAULT_PROFILE_DISPLAY);
  const display = save?.profileDisplay || fallback;
  return {
    avatarId: cosmetics.avatars.includes(display.avatarId) ? display.avatarId : fallback.avatarId,
    frameId: cosmetics.frames.includes(display.frameId) ? display.frameId : fallback.frameId,
    titleId: cosmetics.titles.includes(display.titleId) ? display.titleId : fallback.titleId,
  };
}

function getCosmeticPreviewSymbol(type, itemId) {
  const item = getCosmeticItem(type, itemId);
  return item?.symbol || "◈";
}

function getCosmeticTone(type, itemId) {
  const item = getCosmeticItem(type, itemId);
  return item?.tone || "steel";
}

function getProfileDisplaySnapshot(profile) {
  if (!profile || typeof profile !== "object") {
    return getProfileDisplay();
  }

  return {
    avatarId: profile.avatarId || DEFAULT_PROFILE_DISPLAY.avatarId,
    frameId: profile.frameId || DEFAULT_PROFILE_DISPLAY.frameId,
    titleId: profile.titleId || DEFAULT_PROFILE_DISPLAY.titleId,
  };
}

function buildIdentityPreviewMarkup({ username, display, note = "", compact = false }) {
  const activeDisplay = getProfileDisplaySnapshot(display);
  const avatarTone = getCosmeticTone("avatars", activeDisplay.avatarId);
  const frameTone = getCosmeticTone("frames", activeDisplay.frameId);
  const titleTone = getCosmeticTone("titles", activeDisplay.titleId);
  const avatarSymbol = getCosmeticPreviewSymbol("avatars", activeDisplay.avatarId);
  const frameSymbol = getCosmeticPreviewSymbol("frames", activeDisplay.frameId);
  const titleLabel = getCosmeticLabel("titles", activeDisplay.titleId);
  const avatarLabel = getCosmeticLabel("avatars", activeDisplay.avatarId);
  const frameLabel = getCosmeticLabel("frames", activeDisplay.frameId);
  const supportText = note || getCosmeticDescription("titles", activeDisplay.titleId) || getCosmeticDescription("avatars", activeDisplay.avatarId) || getCosmeticDescription("frames", activeDisplay.frameId);

  return `
    <div class="identity-preview${compact ? " compact" : ""}">
      <div class="identity-preview-stage tone-${frameTone}">
        <div class="identity-frame-badge tone-${titleTone}">${escapeHtml(frameSymbol)}</div>
        <div class="identity-avatar tone-${avatarTone}">${escapeHtml(avatarSymbol)}</div>
      </div>
      <div class="identity-preview-copy">
        <p class="eyebrow">${escapeHtml(titleLabel)}</p>
        <h3>${escapeHtml(username)}</h3>
        <div class="identity-pill-row">
          <span class="meta-chip">${escapeHtml(avatarLabel)}</span>
          <span class="meta-chip">${escapeHtml(frameLabel)}</span>
        </div>
        <p class="mini-note">${escapeHtml(supportText)}</p>
      </div>
    </div>
  `;
}

function buildDataAttributeMarkup(attributes = {}) {
  return Object.entries(attributes)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => ` data-${key}="${escapeHtml(String(value))}"`)
    .join("");
}

function buildPanelActionButtonMarkup(label, attributes = {}, tone = "secondary") {
  return `
    <button class="${tone === "primary" ? "primary-button" : "secondary-button"} social-action-button" type="button"${buildDataAttributeMarkup(attributes)}>
      ${escapeHtml(label)}
    </button>
  `;
}

function buildCosmeticSelectOptions(type, selectedId) {
  const owned = getCosmeticInventory()[type] || [];
  return owned
    .map((itemId) => {
      const item = getCosmeticItem(type, itemId);
      if (!item) {
        return "";
      }
      return `<option value="${escapeHtml(itemId)}"${itemId === selectedId ? " selected" : ""}>${escapeHtml(getCosmeticLabel(type, itemId))}</option>`;
    })
    .join("");
}

function buildOwnedCosmeticCardMarkup(type, itemId, selectedId) {
  const item = getCosmeticItem(type, itemId);
  if (!item) {
    return "";
  }

  const active = itemId === selectedId;
  return `
    <article class="cosmetic-owned-card tone-${escapeHtml(item.tone || "steel")}${active ? " active" : ""}">
      <div class="cosmetic-owned-head">
        <span class="cosmetic-owned-symbol">${escapeHtml(item.symbol || "◈")}</span>
        <span class="status-pill ${active ? "ok" : "turn"}">${active ? localText("Aktiv", "Active", "Actif") : localText("Besitzt", "Owned", "Possédé")}</span>
      </div>
      <strong>${escapeHtml(getCosmeticLabel(type, itemId))}</strong>
      <p class="mini-note">${escapeHtml(getCosmeticDescription(type, itemId))}</p>
      ${active
        ? ""
        : buildPanelActionButtonMarkup(localText("Anlegen", "Equip", "Équiper"), {
          "profile-equip-type": type,
          "profile-equip-id": itemId,
        })}
    </article>
  `;
}

function buildSocialProfileCardMarkup(profile, {
  relationship = "",
  actionsMarkup = "",
  note = "",
} = {}) {
  if (!profile) {
    return "";
  }

  const stats = profile.stats || {};
  const supportText = note || profile.activeDeckName || localText("Noch kein aktives Deck gespeichert.", "No active deck saved yet.", "Aucun deck actif enregistré.");
  return `
    <article class="social-profile-card">
      <div class="social-profile-head">
        ${buildIdentityPreviewMarkup({
          username: profile.username,
          display: profile,
          note: supportText,
          compact: true,
        })}
        ${relationship ? `<span class="status-pill turn">${escapeHtml(getRelationshipPillLabel(relationship))}</span>` : ""}
      </div>
      <div class="social-mini-stats">
        <span class="meta-chip">${localText("Gold", "Gold", "Or")}: ${escapeHtml(String(stats.gold || 0))}</span>
        <span class="meta-chip">${localText("Karten", "Cards", "Cartes")}: ${escapeHtml(String(stats.cards || 0))}</span>
        <span class="meta-chip">${localText("Booster", "Boosters", "Boosters")}: ${escapeHtml(String(stats.boosters || 0))}</span>
      </div>
      ${actionsMarkup ? `<div class="social-action-row">${actionsMarkup}</div>` : ""}
    </article>
  `;
}

function getFallbackSocialProfile(username) {
  const safeUsername = sanitizeUsername(username) || localText("Unbekannt", "Unknown", "Inconnu");
  return {
    username: safeUsername,
    createdAt: "",
    online: false,
    titleId: DEFAULT_PROFILE_DISPLAY.titleId,
    avatarId: DEFAULT_PROFILE_DISPLAY.avatarId,
    frameId: DEFAULT_PROFILE_DISPLAY.frameId,
    stats: {
      gold: 0,
      cards: 0,
      uniqueCards: 0,
      boosters: 0,
    },
    activeDeckName: "",
  };
}

function createCosmeticShopCard(type, itemId) {
  const item = getCosmeticItem(type, itemId);
  if (!item) {
    return document.createElement("div");
  }

  const element = document.createElement("article");
  const display = getProfileDisplay();
  const inventory = getCosmeticInventory();
  const owned = (inventory[type] || []).includes(itemId);
  const active = (type === "avatars" && display.avatarId === itemId)
    || (type === "frames" && display.frameId === itemId)
    || (type === "titles" && display.titleId === itemId);
  const blocked = isMatchSessionLocked();
  const insufficientGold = (getSave()?.gold || 0) < item.price;

  element.className = `cosmetic-card tone-${item.tone || "steel"}${active ? " active" : ""}`;
  element.innerHTML = `
    <div class="cosmetic-card-stage tone-${escapeHtml(item.tone || "steel")}">
      <span class="cosmetic-card-symbol">${escapeHtml(item.symbol || "◈")}</span>
      <span class="status-pill ${active ? "ok" : owned ? "turn" : "warn"}">${escapeHtml(getCosmeticGroupLabel(type))}</span>
    </div>
    <div class="cosmetic-card-copy">
      <p class="eyebrow">${escapeHtml(item.tier || localText("Profil", "Profile", "Profil"))}</p>
      <h3>${escapeHtml(getCosmeticLabel(type, itemId))}</h3>
      <p class="mini-note">${escapeHtml(getCosmeticDescription(type, itemId))}</p>
      <div class="identity-pill-row">
        <span class="meta-chip">${escapeHtml(getCosmeticCollectionTitle())}</span>
        <span class="meta-chip">${escapeHtml(formatCurrency(item.price))}</span>
      </div>
    </div>
  `;

  const actions = document.createElement("div");
  actions.className = "cosmetic-card-actions";

  if (active) {
    actions.append(createActionButton(localText("Aktiv", "Active", "Actif"), () => {}, true));
  } else if (owned) {
    actions.append(createActionButton(localText("Anlegen", "Equip", "Équiper"), () => {
      const field = type === "avatars" ? "avatarId" : type === "frames" ? "frameId" : "titleId";
      applyProfileDisplayChange({ [field]: itemId });
    }, blocked));
  } else {
    actions.append(createActionButton(localText("Kaufen", "Buy", "Acheter"), () => handleCosmeticPurchase(type, itemId), blocked || insufficientGold));
  }

  const helper = document.createElement("p");
  helper.className = "mini-note";
  helper.textContent = active
    ? localText("Derzeit auf deinem Profil aktiv.", "Currently active on your profile.", "Actuellement actif sur ton profil.")
    : owned
      ? localText("Bereits freigeschaltet und sofort nutzbar.", "Already unlocked and ready to equip.", "Déjà débloqué et prêt à être équipé.")
      : blocked
        ? getUiText("messages.matchCollectionLocked")
        : insufficientGold
          ? localText("Dir fehlt noch Gold für diesen Kauf.", "You still need more gold for this purchase.", "Il te manque encore de l'or pour cet achat.")
          : localText("Wird direkt in Profil, Freunde und Topbar sichtbar.", "Shows up instantly in profile, friends and the top bar.", "Apparaît directement dans le profil, les amis et la barre supérieure.");

  element.append(actions, helper);
  return element;
}

async function applyProfileDisplayChange(partialDisplay, { quiet = false } = {}) {
  if (!currentAccount) {
    return false;
  }

  const nextDisplay = sanitizeProfileDisplayState({
    ...getProfileDisplay(),
    ...(partialDisplay || {}),
  }, DEFAULT_PROFILE_DISPLAY, getCosmeticInventory());

  try {
    if (isServerSessionActive()) {
      await saveProfileDisplayOnServer(nextDisplay);
    } else {
      getSave().profileDisplay = nextDisplay;
      persistCurrentAccount();
    }
    renderAll();
    if (!quiet) {
      showToast(localText("Profil-Design gespeichert.", "Profile style saved.", "Style de profil enregistré."));
    }
    return true;
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || localText("Profil-Design konnte nicht gespeichert werden.", "Profile style could not be saved.", "Le style du profil n'a pas pu être enregistré."));
    return false;
  }
}

function bindProfileLoadoutPanelEvents() {
  const form = elements.profileLoadoutPanel.querySelector("#profileDisplayFormDynamic");
  if (form) {
    form.addEventListener("submit", handleProfileDisplaySubmit);
  }

  elements.profileLoadoutPanel.querySelectorAll("[data-shop-section]").forEach((button) => {
    button.addEventListener("click", () => {
      if (isMatchSessionLocked()) {
        showToast(getUiText("messages.matchCollectionLocked"));
        return;
      }
      getSave().shopTab = String(button.dataset.shopSection || "cosmetics");
      persistCurrentAccount();
      uiState.section = "shop";
      renderAll();
    });
  });

  elements.profileCosmeticsPanel.querySelectorAll("[data-profile-equip-type]").forEach((button) => {
    button.addEventListener("click", async () => {
      await applyProfileDisplayChange({
        [String(button.dataset.profileEquipType) === "avatars"
          ? "avatarId"
          : String(button.dataset.profileEquipType) === "frames"
            ? "frameId"
            : "titleId"]: String(button.dataset.profileEquipId || ""),
      });
    });
  });
}

function bindFriendsPanelEvents() {
  return legacyBindFriendsPanelEvents();
}

function getShopBundleTierLabel(tierId) {
  return getUiText(`shop.bundleTiers.${tierId}`);
}

function getShopBundleLabel(bundle) {
  return `${getFaction(bundle.factionId).name} ${getShopBundleTierLabel(bundle.tierId)}`;
}

function getShopBundleDescription(bundle) {
  const factionName = getFaction(bundle.factionId).name;
  const guaranteedCount = bundle.guaranteedCards.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const boosterCount = bundle.includedBoosters.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

  if (getCurrentLanguage() === "fr") {
    return `${guaranteedCount} cartes fixes du ${factionName} et ${boosterCount} boosters pour renforcer cette faction de manière ciblée.`;
  }

  if (getCurrentLanguage() === "en") {
    return `${guaranteedCount} fixed ${factionName} cards and ${boosterCount} boosters to strengthen this faction in a targeted way.`;
  }

  return `${guaranteedCount} feste Karten aus ${factionName} und ${boosterCount} Booster für gezielten Ausbau dieser Fraktion.`;
}

function getCurrencyLabel() {
  return getUiText("common.currency");
}

function formatCurrency(amount) {
  return `${amount} ${getCurrencyLabel()}`;
}

function getSessionSnapshot() {
  const raw = localStorage.getItem(STORAGE_KEYS.session);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function storeSessionSnapshot(snapshot) {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(snapshot));
}

function clearSessionSnapshot() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

function isServerRuntimeCandidate() {
  return typeof window !== "undefined" && /^https?:$/i.test(window.location.protocol || "");
}

async function detectServerApiAvailability(force = false) {
  if (!isServerRuntimeCandidate()) {
    SERVER_RUNTIME.checked = true;
    SERVER_RUNTIME.available = false;
    return false;
  }

  if (SERVER_RUNTIME.checked && !force) {
    return SERVER_RUNTIME.available;
  }

  try {
    const response = await fetch("/api/health", {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });
    SERVER_RUNTIME.available = response.ok;
  } catch {
    SERVER_RUNTIME.available = false;
  }

  SERVER_RUNTIME.checked = true;
  return SERVER_RUNTIME.available;
}

async function apiRequest(path, { method = "GET", body = null, token = null } = {}) {
  const headers = {
    Accept: "application/json",
  };

  if (body !== null) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    method,
    headers,
    cache: "no-store",
    body: body !== null ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = new Error(payload?.message || `Request failed with ${response.status}.`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

function isServerSessionActive() {
  const snapshot = getSessionSnapshot();
  return Boolean(snapshot?.mode === SESSION_MODES.server && isValidSessionToken(snapshot?.token) && currentAccount?.username);
}

function applyServerMarketSnapshot(serverMarket) {
  if (!serverMarket || typeof serverMarket !== "object") {
    return;
  }

  database.market = normalizeMarketState(serverMarket);
}

async function loadServerGameState(token, { render = true } = {}) {
  const sessionToken = token || getSessionSnapshot()?.token;
  if (!isValidSessionToken(sessionToken)) {
    return false;
  }

  const response = await apiRequest("/api/game/state", { token: sessionToken });
  if (!mergeServerAccountIntoLocalState(response?.account, sessionToken, { render: false })) {
    return false;
  }

  applyServerMarketSnapshot(response?.market);
  uiState.adminCacheDirty = true;
  if (render) {
    renderAll();
  }
  return true;
}

function queueServerSaveSync() {
  if (!isServerSessionActive()) {
    return Promise.resolve(false);
  }

  const sessionToken = getSessionSnapshot()?.token;
  const snapshot = cloneJsonValue(currentAccount?.save, createEmptySave());
  SERVER_SYNC.savePending += 1;
  SERVER_SYNC.save = SERVER_SYNC.save
    .catch(() => undefined)
    .then(async () => {
      try {
        const response = await apiRequest("/api/game/state", {
          method: "PATCH",
          token: sessionToken,
          body: { save: snapshot },
        });
        mergeServerAccountIntoLocalState(response?.account, sessionToken, { render: false });
        return true;
      } finally {
        SERVER_SYNC.savePending = Math.max(0, SERVER_SYNC.savePending - 1);
      }
    })
    .catch((error) => {
      console.error(error);
      showToast("Server-Synchronisierung fehlgeschlagen.");
      return false;
    });

  return SERVER_SYNC.save;
}

function queueServerMarketSync() {
  if (!isServerSessionActive()) {
    return Promise.resolve(false);
  }

  const sessionToken = getSessionSnapshot()?.token;
  const marketSnapshot = cloneJsonValue(database.market, createInitialMarketState());
  SERVER_SYNC.marketPending += 1;
  SERVER_SYNC.market = SERVER_SYNC.market
    .catch(() => undefined)
    .then(async () => {
      try {
        const response = await apiRequest("/api/market/state", {
          method: "PATCH",
          token: sessionToken,
          body: { market: marketSnapshot },
        });
        applyServerMarketSnapshot(response?.market);
        return true;
      } finally {
        SERVER_SYNC.marketPending = Math.max(0, SERVER_SYNC.marketPending - 1);
      }
    })
    .catch((error) => {
      console.error(error);
      showToast("Markt-Synchronisierung fehlgeschlagen.");
      return false;
    });

  return SERVER_SYNC.market;
}

function applyServerAccountsSnapshot(accounts) {
  if (!Array.isArray(accounts)) {
    return;
  }

  const nextAccounts = {};
  accounts.forEach((serverAccount) => {
    const username = sanitizeUsername(serverAccount?.username);
    if (!username) {
      return;
    }

    const existing = findStoredUsername(username) ? normalizeAccount(database.accounts[findStoredUsername(username)]) : normalizeAccount({
      username,
      passwordHash: "",
      isAdmin: Boolean(serverAccount?.isAdmin),
      createdAt: serverAccount?.createdAt || new Date().toISOString(),
      sessionToken: currentAccount?.username === username ? getSessionSnapshot()?.token : null,
      save: serverAccount?.save || createEmptySave(),
    });

    nextAccounts[username] = normalizeAccount({
      ...existing,
      username,
      passwordHash: existing.passwordHash || "",
      isAdmin: Boolean(serverAccount?.isAdmin) || existing.isAdmin,
      createdAt: serverAccount?.createdAt || existing.createdAt,
      sessionToken: currentAccount?.username === username ? getSessionSnapshot()?.token : existing.sessionToken,
      save: serverAccount?.save || existing.save || createEmptySave(),
    });
  });

  database.accounts = nextAccounts;
  if (currentAccount?.username && nextAccounts[currentAccount.username]) {
    currentAccount = nextAccounts[currentAccount.username];
  }
}

async function refreshServerAdminMirror({ render = true } = {}) {
  if (!isServerSessionActive() || !isCurrentUserAdmin()) {
    return false;
  }

  const sessionToken = getSessionSnapshot()?.token;
  const response = await apiRequest("/api/admin/accounts", { token: sessionToken });
  applyServerAccountsSnapshot(response?.accounts);
  if (render) {
    renderAdminPanel();
  }
  return true;
}

async function runServerAdminAction(action, payload = {}) {
  if (!isServerSessionActive() || !isCurrentUserAdmin()) {
    return null;
  }

  const sessionToken = getSessionSnapshot()?.token;
  const response = await apiRequest("/api/admin/action", {
    method: "POST",
    token: sessionToken,
    body: {
      action,
      ...payload,
    },
  });

  await refreshServerAdminMirror({ render: false });
  return response;
}

function applyServerFriendsOverview(payload, { render = true } = {}) {
  if (!currentAccount || !payload) {
    return false;
  }

  const sessionToken = getSessionSnapshot()?.token;
  if (payload.account && sessionToken) {
    mergeServerAccountIntoLocalState(payload.account, sessionToken, { render: false });
  }
  currentAccount.save.friends = sanitizeFriendState(payload.friends, createDefaultFriendState());
  database.accounts[currentAccount.username] = normalizeAccount(currentAccount);
  currentAccount = database.accounts[currentAccount.username];
  uiState.socialProfiles = payload.profiles && typeof payload.profiles === "object" ? cloneJsonValue(payload.profiles, {}) : {};
  if (uiState.friendTradeTarget && !currentAccount.save.friends.friends.some((entry) => canonicalizeUsername(entry) === canonicalizeUsername(uiState.friendTradeTarget))) {
    uiState.friendTradeTarget = "";
    uiState.friendTradeOptions = null;
  }
  if (uiState.friendChallengeTarget && !currentAccount.save.friends.friends.some((entry) => canonicalizeUsername(entry) === canonicalizeUsername(uiState.friendChallengeTarget))) {
    uiState.friendChallengeTarget = "";
  }
  uiState.friendsHydrated = true;
  saveDatabase();
  if (render) {
    renderFriends();
  }
  return true;
}

async function refreshServerFriendsOverview({ render = true } = {}) {
  if (!isServerSessionActive()) {
    return null;
  }

  const sessionToken = getSessionSnapshot()?.token;
  const response = await apiRequest("/api/friends/overview", { token: sessionToken });
  applyServerFriendsOverview(response, { render });
  return response;
}

async function hydrateFriendsSection({ force = false, render = true } = {}) {
  if (!isServerSessionActive()) {
    uiState.friendsHydrated = true;
    return null;
  }

  if (uiState.friendsLoading) {
    return null;
  }

  if (uiState.friendsHydrated && !force) {
    return null;
  }

  uiState.friendsLoading = true;
  if (render) {
    renderFriends();
  }

  try {
    return await refreshServerFriendsOverview({ render });
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || "Freundesdaten konnten nicht geladen werden.");
    return null;
  } finally {
    uiState.friendsLoading = false;
    if (render) {
      renderFriends();
    }
  }
}

async function runServerFriendsAction(path, body = {}, { render = true } = {}) {
  if (!isServerSessionActive()) {
    return null;
  }

  const sessionToken = getSessionSnapshot()?.token;
  const response = await apiRequest(path, {
    method: "POST",
    token: sessionToken,
    body,
  });
  applyServerFriendsOverview(response, { render });
  return response;
}

async function loadServerTradeOptions(username) {
  if (!isServerSessionActive()) {
    return null;
  }

  const sessionToken = getSessionSnapshot()?.token;
  return apiRequest(`/api/friends/trade/options?username=${encodeURIComponent(username)}`, {
    token: sessionToken,
  });
}

async function searchServerFriends(query) {
  if (!isServerSessionActive()) {
    return [];
  }

  const sessionToken = getSessionSnapshot()?.token;
  const response = await apiRequest(`/api/friends/search?query=${encodeURIComponent(query)}`, {
    token: sessionToken,
  });
  return Array.isArray(response?.results) ? response.results : [];
}

async function purchaseCosmeticOnServer(cosmeticType, itemId) {
  if (!isServerSessionActive()) {
    return null;
  }

  const sessionToken = getSessionSnapshot()?.token;
  const response = await apiRequest("/api/shop/cosmetics/purchase", {
    method: "POST",
    token: sessionToken,
    body: {
      cosmeticType,
      itemId,
    },
  });
  mergeServerAccountIntoLocalState(response?.account, sessionToken, { render: false });
  return response;
}

async function claimProgressRewardOnServer(payload = {}) {
  if (!isServerSessionActive()) {
    return null;
  }

  const sessionToken = getSessionSnapshot()?.token;
  const response = await apiRequest("/api/game/claim-reward", {
    method: "POST",
    token: sessionToken,
    body: payload,
  });
  mergeServerAccountIntoLocalState(response?.account, sessionToken, { render: false });
  return response;
}

async function saveProfileDisplayOnServer(display) {
  if (!isServerSessionActive()) {
    return null;
  }

  const sessionToken = getSessionSnapshot()?.token;
  const response = await apiRequest("/api/profile/display", {
    method: "PATCH",
    token: sessionToken,
    body: { display },
  });
  mergeServerAccountIntoLocalState(response?.account, sessionToken, { render: false });
  return response;
}

function mergeServerAccountIntoLocalState(serverAccount, token, { render = true } = {}) {
  const username = sanitizeUsername(serverAccount?.username);

  if (!username || !isValidSessionToken(token)) {
    return false;
  }

  const storedUsername = findStoredUsername(username);
  const existingAccount = storedUsername ? normalizeAccount(database.accounts[storedUsername]) : normalizeAccount({
    username,
    passwordHash: "",
    isAdmin: false,
    createdAt: serverAccount?.createdAt || new Date().toISOString(),
    sessionToken: token,
    save: createEmptySave(),
  });

  const normalized = normalizeAccount({
    ...existingAccount,
    username,
    createdAt: serverAccount?.createdAt || existingAccount.createdAt,
    sessionToken: token,
    isAdmin: Boolean(serverAccount?.isAdmin) || existingAccount.isAdmin || username === ADMIN_BOOTSTRAP.username,
    passwordHash: existingAccount.passwordHash || "",
    save: serverAccount?.save || existingAccount.save || createEmptySave(),
  });

  if (storedUsername && storedUsername !== username) {
    delete database.accounts[storedUsername];
  }

  database.accounts[username] = normalized;
  saveDatabase();

  currentUsername = username;
  currentAccount = database.accounts[username];
  uiState.previewLanguage = currentAccount.save?.settings?.language || "de";
  uiState.adminSelectedUser = null;
  uiState.adminCacheDirty = true;
  restoreRuntimeMatchFromAccount(true);

  storeSessionSnapshot({
    version: 1,
    mode: SESSION_MODES.server,
    username,
    token,
    issuedAt: new Date().toISOString(),
  });

  if (render) {
    switchAuthMode("login");
    renderAll();
  }

  return true;
}

function buildLiveSyncSignature(value) {
  try {
    return JSON.stringify(value ?? null);
  } catch {
    return "";
  }
}

function getLocalGameSyncSignature() {
  return buildLiveSyncSignature({
    username: sanitizeUsername(currentAccount?.username),
    isAdmin: Boolean(currentAccount?.isAdmin),
    save: currentAccount?.save || createEmptySave(),
    market: database.market || createInitialMarketState(),
  });
}

function getPayloadGameSyncSignature(payload) {
  return buildLiveSyncSignature({
    username: sanitizeUsername(payload?.account?.username),
    isAdmin: Boolean(payload?.account?.isAdmin),
    save: payload?.account?.save || createEmptySave(),
    market: payload?.market || createInitialMarketState(),
  });
}

function getLocalFriendsSyncSignature() {
  return buildLiveSyncSignature({
    friends: currentAccount?.save?.friends || createDefaultFriendState(),
    profiles: uiState.socialProfiles || {},
  });
}

function getPayloadFriendsSyncSignature(payload) {
  return buildLiveSyncSignature({
    friends: payload?.friends || createDefaultFriendState(),
    profiles: payload?.profiles || {},
  });
}

function getLocalMultiplayerSyncSignature() {
  return buildLiveSyncSignature({
    queue: uiState.multiplayerQueue || [],
    ownQueueEntry: uiState.multiplayerOwnQueueEntry || null,
    incomingChallenges: uiState.multiplayerIncomingChallenges || [],
    outgoingChallenges: uiState.multiplayerOutgoingChallenges || [],
  });
}

function getPayloadMultiplayerSyncSignature(payload) {
  return buildLiveSyncSignature({
    queue: payload?.queue || [],
    ownQueueEntry: payload?.ownQueueEntry || null,
    incomingChallenges: payload?.incomingChallenges || [],
    outgoingChallenges: payload?.outgoingChallenges || [],
  });
}

function getAdminSyncComparableAccount(account) {
  return {
    username: sanitizeUsername(account?.username),
    isAdmin: Boolean(account?.isAdmin),
    createdAt: account?.createdAt || null,
    save: account?.save || createEmptySave(),
  };
}

function getLocalAdminSyncSignature() {
  const accounts = Object.values(database.accounts || {})
    .map((account) => normalizeAccount(account))
    .sort((left, right) => left.username.localeCompare(right.username, getCurrentLocale()))
    .map(getAdminSyncComparableAccount);
  return buildLiveSyncSignature(accounts);
}

function getPayloadAdminSyncSignature(accounts) {
  return buildLiveSyncSignature(
    (Array.isArray(accounts) ? accounts : [])
      .map(getAdminSyncComparableAccount)
      .sort((left, right) => left.username.localeCompare(right.username, getCurrentLocale())),
  );
}

function hasPendingServerSync() {
  return SERVER_SYNC.savePending > 0 || SERVER_SYNC.marketPending > 0;
}

function scheduleServerLiveRefresh({ force = false, delay = LIVE_SYNC_CONFIG.focusDebounceMs } = {}) {
  if (!isServerSessionActive()) {
    return;
  }

  if (SERVER_LIVE_SYNC.refreshTimer) {
    window.clearTimeout(SERVER_LIVE_SYNC.refreshTimer);
  }

  SERVER_LIVE_SYNC.refreshTimer = window.setTimeout(() => {
    SERVER_LIVE_SYNC.refreshTimer = null;
    void refreshServerLiveState({ force });
  }, Math.max(0, delay));
}

function handleServerLiveTick() {
  void refreshServerLiveState();
}

async function refreshServerLiveState({ force = false } = {}) {
  if (!isServerSessionActive() || SERVER_RUNTIME.restoring || SERVER_LIVE_SYNC.inFlight) {
    return false;
  }

  if (!force && document.hidden) {
    return false;
  }

  if (hasPendingServerSync() || isMatchActive()) {
    return false;
  }

  const sessionToken = getSessionSnapshot()?.token;
  if (!isValidSessionToken(sessionToken)) {
    return false;
  }

  SERVER_LIVE_SYNC.inFlight = true;

  try {
    let changed = false;
    const gameResponse = await apiRequest("/api/game/state", { token: sessionToken });

    if (getPayloadGameSyncSignature(gameResponse) !== getLocalGameSyncSignature()) {
      if (mergeServerAccountIntoLocalState(gameResponse?.account, sessionToken, { render: false })) {
        applyServerMarketSnapshot(gameResponse?.market);
        uiState.adminCacheDirty = true;
        changed = true;
      }
    }

    if (uiState.section === "friends" && !uiState.friendsLoading) {
      const friendsResponse = await apiRequest("/api/friends/overview", { token: sessionToken });
      if (getPayloadFriendsSyncSignature(friendsResponse) !== getLocalFriendsSyncSignature()) {
        applyServerFriendsOverview(friendsResponse, { render: false });
        changed = true;
      }
    }

    if (uiState.section === "multiplayer" && !uiState.multiplayerLoading) {
      const multiplayerResponse = await apiRequest("/api/multiplayer/overview", { token: sessionToken });
      if (getPayloadMultiplayerSyncSignature(multiplayerResponse) !== getLocalMultiplayerSyncSignature()) {
        applyServerMultiplayerOverview(multiplayerResponse, { render: false });
        changed = true;
      }
    }

    if (uiState.section === "admin" && isCurrentUserAdmin()) {
      const adminResponse = await apiRequest("/api/admin/accounts", { token: sessionToken });
      if (getPayloadAdminSyncSignature(adminResponse?.accounts) !== getLocalAdminSyncSignature()) {
        applyServerAccountsSnapshot(adminResponse?.accounts);
        changed = true;
      }
    }

    if (changed) {
      renderAll();
    }

    return changed;
  } catch (error) {
    if (error?.status === 401) {
      currentUsername = null;
      currentAccount = null;
      uiState.match = null;
      uiState.modalCardId = null;
      uiState.adminSelectedUser = null;
      clearSessionSnapshot();
      renderAll();
      return false;
    }

    console.error(error);
    return false;
  } finally {
    SERVER_LIVE_SYNC.inFlight = false;
  }
}

async function initializeServerSession() {
  if (SERVER_RUNTIME.restoring) {
    return false;
  }

  if (!(await detectServerApiAvailability())) {
    return false;
  }

  const snapshot = getSessionSnapshot();
  if (!snapshot || snapshot.mode !== SESSION_MODES.server || !isValidSessionToken(snapshot.token)) {
    return false;
  }

  SERVER_RUNTIME.restoring = true;
  try {
    return await loadServerGameState(snapshot.token);
  } catch {
    clearSessionSnapshot();
    currentUsername = null;
    currentAccount = null;
    uiState.match = null;
    uiState.modalCardId = null;
    renderAll();
    return false;
  } finally {
    SERVER_RUNTIME.restoring = false;
  }
}

function getSocialProfile(username) {
  const safeUsername = sanitizeUsername(username);
  return safeUsername ? uiState.socialProfiles[safeUsername] || null : null;
}

function getFriendTradeTarget(state = getFriendState()) {
  if (uiState.friendTradeTarget && state.friends.some((entry) => canonicalizeUsername(entry) === canonicalizeUsername(uiState.friendTradeTarget))) {
    return uiState.friendTradeTarget;
  }
  return state.friends[0] || "";
}

function getFriendChallengeTarget(state = getFriendState()) {
  if (uiState.friendChallengeTarget && state.friends.some((entry) => canonicalizeUsername(entry) === canonicalizeUsername(uiState.friendChallengeTarget))) {
    return uiState.friendChallengeTarget;
  }
  return state.friends[0] || "";
}

function getRelationshipPillLabel(relationship) {
  if (getCurrentLanguage() === "fr") {
    return relationship === "friend"
      ? "Ami"
      : relationship === "incoming"
        ? "Entrante"
        : relationship === "outgoing"
          ? "Sortante"
          : relationship === "blocked"
            ? "Bloqué"
            : "Trouvé";
  }

  if (getCurrentLanguage() === "en") {
    return relationship === "friend"
      ? "Friend"
      : relationship === "incoming"
        ? "Incoming"
        : relationship === "outgoing"
          ? "Outgoing"
          : relationship === "blocked"
            ? "Blocked"
            : "Found";
  }

  return relationship === "friend"
    ? "Freund"
    : relationship === "incoming"
      ? "Eingehend"
      : relationship === "outgoing"
        ? "Ausgehend"
        : relationship === "blocked"
          ? "Blockiert"
          : "Gefunden";
}

function getTradeCardLabel(cardId) {
  return getCard(cardId)?.name || cardId;
}

async function refreshFriendSearchResults({ render = true } = {}) {
  if (!isServerSessionActive()) {
    uiState.friendSearchResults = [];
    if (render) {
      renderFriends();
    }
    return [];
  }

  const query = uiState.friendSearchQuery.trim();
  if (query.length < 2) {
    uiState.friendSearchResults = [];
    if (render) {
      renderFriends();
    }
    return [];
  }

  uiState.friendSearchBusy = true;
  if (render) {
    renderFriends();
  }

  try {
    const results = await searchServerFriends(query);
    uiState.friendSearchResults = results;
    return results;
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || (getCurrentLanguage() === "fr" ? "La recherche d'amis a échoué." : getCurrentLanguage() === "en" ? "Friend search failed." : "Freundessuche fehlgeschlagen."));
    return [];
  } finally {
    uiState.friendSearchBusy = false;
    if (render) {
      renderFriends();
    }
  }
}

async function handleFriendSearchSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const input = form.querySelector('input[name="friendSearch"]');
  uiState.friendSearchQuery = String(input?.value || "").trim().slice(0, 18);
  await refreshFriendSearchResults();
}

async function sendFriendRequest(username) {
  const safeUsername = sanitizeUsername(username);
  if (!safeUsername || !isServerSessionActive()) {
    return;
  }

  try {
    await runServerFriendsAction("/api/friends/request", { username: safeUsername }, { render: false });
    await refreshFriendSearchResults({ render: false });
    renderFriends();
    showToast(getCurrentLanguage() === "fr" ? "Demande d'amitié envoyée." : getCurrentLanguage() === "en" ? "Friend request sent." : "Freundschaftsanfrage gesendet.");
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || "Freundschaftsanfrage fehlgeschlagen.");
  }
}

async function handleFriendRequestAction(username, action) {
  const safeUsername = sanitizeUsername(username);
  if (!safeUsername || !isServerSessionActive()) {
    return;
  }

  try {
    await runServerFriendsAction("/api/friends/request/respond", { username: safeUsername, action }, { render: false });
    await refreshFriendSearchResults({ render: false });
    renderFriends();
    showToast(action === "accept"
      ? (getCurrentLanguage() === "fr" ? "Freundschaft bestätigt." : getCurrentLanguage() === "en" ? "Friendship confirmed." : "Freundschaft bestätigt.")
      : action === "cancel"
        ? (getCurrentLanguage() === "fr" ? "Anfrage zurückgezogen." : getCurrentLanguage() === "en" ? "Request cancelled." : "Anfrage zurückgezogen.")
        : (getCurrentLanguage() === "fr" ? "Anfrage abgelehnt." : getCurrentLanguage() === "en" ? "Request declined." : "Anfrage abgelehnt."));
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || "Freundesaktion fehlgeschlagen.");
  }
}

async function removeFriend(username) {
  const safeUsername = sanitizeUsername(username);
  if (!safeUsername || !isServerSessionActive()) {
    return;
  }
  const message = getCurrentLanguage() === "fr"
    ? `${safeUsername} des amis ?`
    : getCurrentLanguage() === "en"
      ? `Remove ${safeUsername} from your friends?`
      : `${safeUsername} aus der Freundesliste entfernen?`;
  if (!requestActionConfirmation(message)) {
    return;
  }

  try {
    await runServerFriendsAction("/api/friends/remove", { username: safeUsername }, { render: false });
    uiState.friendTradeOptions = null;
    await refreshFriendSearchResults({ render: false });
    renderFriends();
    showToast(getCurrentLanguage() === "fr" ? "Freund entfernt." : getCurrentLanguage() === "en" ? "Friend removed." : "Freund entfernt.");
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || "Freund konnte nicht entfernt werden.");
  }
}

async function blockFriend(username) {
  const safeUsername = sanitizeUsername(username);
  if (!safeUsername || !isServerSessionActive()) {
    return;
  }
  const message = getCurrentLanguage() === "fr"
    ? `${safeUsername} blockieren?`
    : getCurrentLanguage() === "en"
      ? `Block ${safeUsername}?`
      : `${safeUsername} blockieren?`;
  if (!requestActionConfirmation(message)) {
    return;
  }

  try {
    await runServerFriendsAction("/api/friends/block", { username: safeUsername }, { render: false });
    uiState.friendTradeOptions = null;
    await refreshFriendSearchResults({ render: false });
    renderFriends();
    showToast(getCurrentLanguage() === "fr" ? "Konto blockiert." : getCurrentLanguage() === "en" ? "Account blocked." : "Konto blockiert.");
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || "Blockieren fehlgeschlagen.");
  }
}

async function unblockFriend(username) {
  const safeUsername = sanitizeUsername(username);
  if (!safeUsername || !isServerSessionActive()) {
    return;
  }

  try {
    await runServerFriendsAction("/api/friends/unblock", { username: safeUsername }, { render: false });
    await refreshFriendSearchResults({ render: false });
    renderFriends();
    showToast(getCurrentLanguage() === "fr" ? "Blockierung aufgehoben." : getCurrentLanguage() === "en" ? "Block removed." : "Blockierung aufgehoben.");
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || "Entsperren fehlgeschlagen.");
  }
}

async function setFriendTradeTarget(username, { render = true } = {}) {
  const safeUsername = sanitizeUsername(username);
  uiState.friendTradeTarget = safeUsername;
  uiState.friendTradeOptions = null;

  if (!safeUsername || !isServerSessionActive()) {
    if (render) {
      renderFriends();
    }
    return null;
  }

  uiState.friendTradeBusy = true;
  if (render) {
    renderFriends();
  }

  try {
    const response = await loadServerTradeOptions(safeUsername);
    uiState.friendTradeOptions = response;
    return response;
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || (getCurrentLanguage() === "fr" ? "Les cartes d'échange n'ont pas pu être chargées." : getCurrentLanguage() === "en" ? "Trade cards could not be loaded." : "Handelskarten konnten nicht geladen werden."));
    return null;
  } finally {
    uiState.friendTradeBusy = false;
    if (render) {
      renderFriends();
    }
  }
}

async function handleFriendTradeSubmit(event) {
  event.preventDefault();
  if (!isServerSessionActive()) {
    return;
  }

  const form = event.currentTarget;
  const username = sanitizeUsername(form.querySelector('[name="tradeFriend"]')?.value);
  const offeredCardId = String(form.querySelector('[name="offeredCardId"]')?.value || "").trim();
  const requestedCardId = String(form.querySelector('[name="requestedCardId"]')?.value || "").trim();
  const note = String(form.querySelector('[name="tradeNote"]')?.value || "").trim().slice(0, 140);

  if (!username || !offeredCardId || !requestedCardId) {
    showToast(getCurrentLanguage() === "fr" ? "Sélectionne les deux cartes pour l'échange." : getCurrentLanguage() === "en" ? "Select both cards for the trade." : "Wähle beide Karten für den Handel aus.");
    return;
  }

  uiState.friendTradeBusy = true;
  renderFriends();
  try {
    await runServerFriendsAction("/api/friends/trade/create", {
      username,
      offeredCardId,
      requestedCardId,
      note,
    }, { render: false });
    await setFriendTradeTarget(username, { render: false });
    await refreshFriendSearchResults({ render: false });
    renderFriends();
    showToast(getCurrentLanguage() === "fr" ? "Handelsangebot gesendet." : getCurrentLanguage() === "en" ? "Trade offer sent." : "Handelsangebot gesendet.");
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || "Handelsangebot fehlgeschlagen.");
  } finally {
    uiState.friendTradeBusy = false;
    renderFriends();
  }
}

async function handleTradeOfferAction(offerId, action) {
  if (!offerId || !isServerSessionActive()) {
    return;
  }

  uiState.friendTradeBusy = true;
  renderFriends();
  try {
    await runServerFriendsAction("/api/friends/trade/respond", { offerId, action }, { render: false });
    if (uiState.friendTradeTarget) {
      await setFriendTradeTarget(uiState.friendTradeTarget, { render: false });
    }
    await refreshFriendSearchResults({ render: false });
    renderFriends();
    showToast(action === "accept"
      ? (getCurrentLanguage() === "fr" ? "Tausch abgeschlossen." : getCurrentLanguage() === "en" ? "Trade completed." : "Tausch abgeschlossen.")
      : action === "cancel"
        ? (getCurrentLanguage() === "fr" ? "Angebot zurückgezogen." : getCurrentLanguage() === "en" ? "Offer cancelled." : "Angebot zurückgezogen.")
        : (getCurrentLanguage() === "fr" ? "Angebot abgelehnt." : getCurrentLanguage() === "en" ? "Offer declined." : "Angebot abgelehnt."));
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || "Handelsaktion fehlgeschlagen.");
  } finally {
    uiState.friendTradeBusy = false;
    renderFriends();
  }
}

async function handleFriendChallengeSubmit(event) {
  event.preventDefault();
  if (!isServerSessionActive()) {
    return;
  }

  const activeDeck = getActiveDeck();
  const validation = validateDeck(activeDeck);
  if (!validation.valid) {
    showToast(validation.messages[0] || getUiText("messages.matchNotPlayable"));
    return;
  }

  const form = event.currentTarget;
  const username = sanitizeUsername(form.querySelector('[name="challengeFriend"]')?.value);
  if (!username) {
    showToast(getCurrentLanguage() === "fr" ? "Choisis un ami pour le duel." : getCurrentLanguage() === "en" ? "Choose a friend for the duel." : "Wähle einen Freund für das Duell.");
    return;
  }

  uiState.friendChallengeBusy = true;
  renderFriends();
  try {
    await runServerFriendsAction("/api/friends/challenge/create", {
      username,
      deckName: activeDeck.name,
      deckCards: activeDeck.cards,
    }, { render: false });
    await refreshFriendSearchResults({ render: false });
    renderFriends();
    showToast(getCurrentLanguage() === "fr" ? "Freundesduell gesendet." : getCurrentLanguage() === "en" ? "Friend duel sent." : "Freundesduell gesendet.");
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || "Freundesduell konnte nicht gesendet werden.");
  } finally {
    uiState.friendChallengeBusy = false;
    renderFriends();
  }
}

function startFriendMatchFromChallenge(challenge) {
  const activeDeck = getActiveDeck();
  const validation = validateDeck(activeDeck);
  if (!validation.valid) {
    showToast(validation.messages[0] || getUiText("messages.matchNotPlayable"));
    return false;
  }

  const enemyDeckCards = Array.isArray(challenge?.deckCards) ? challenge.deckCards.filter((cardId) => CARD_MAP.has(cardId)).slice(0, APP_CONFIG.deckSize) : [];
  if (enemyDeckCards.length !== APP_CONFIG.deckSize) {
    showToast(getCurrentLanguage() === "fr" ? "Le deck du duel n'est plus complet." : getCurrentLanguage() === "en" ? "The duel deck is no longer complete." : "Das Duell-Deck ist nicht mehr vollständig.");
    return false;
  }

  uiState.match = createMatch(activeDeck.cards, getArenaDifficultyId(getSave().arenaDifficulty), {
    mode: "friend",
    opponentLabel: sanitizeUsername(challenge.from) || (getCurrentLanguage() === "fr" ? "Ami" : getCurrentLanguage() === "en" ? "Friend" : "Freund"),
    opponentDeckName: String(challenge.deckName || "").trim().slice(0, 48),
    enemyDeckCards,
    rewardWin: 0,
    rewardLoss: 0,
    forfeitPenalty: 0,
  });
  uiState.section = "arena";
  startTurn("player");
  renderAll();
  showToast(getCurrentLanguage() === "fr" ? "Freundesduell gestartet." : getCurrentLanguage() === "en" ? "Friend duel started." : "Freundesduell gestartet.");
  return true;
}

async function handleFriendChallengeAction(challengeId, action) {
  if (!challengeId || !isServerSessionActive()) {
    return;
  }

  uiState.friendChallengeBusy = true;
  renderFriends();
  try {
    const response = await runServerFriendsAction("/api/friends/challenge/respond", { challengeId, action }, { render: false });
    await refreshFriendSearchResults({ render: false });
    if (action === "accept" && response?.challenge) {
      startFriendMatchFromChallenge(response.challenge);
      return;
    }
    renderFriends();
    showToast(action === "cancel"
      ? (getCurrentLanguage() === "fr" ? "Herausforderung zurückgezogen." : getCurrentLanguage() === "en" ? "Challenge cancelled." : "Herausforderung zurückgezogen.")
      : (getCurrentLanguage() === "fr" ? "Herausforderung aktualisiert." : getCurrentLanguage() === "en" ? "Challenge updated." : "Herausforderung aktualisiert."));
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || "Freundesduell-Aktion fehlgeschlagen.");
  } finally {
    uiState.friendChallengeBusy = false;
    renderFriends();
  }
}

async function handleCosmeticPurchase(cosmeticType, itemId) {
  if (!currentAccount) {
    return;
  }

  if (isMatchSessionLocked()) {
    showToast(getUiText("messages.matchCollectionLocked"));
    return;
  }

  const item = getCosmeticItem(cosmeticType, itemId);
  if (!item) {
    showToast(getCurrentLanguage() === "fr" ? "Cet objet de profil n'existe pas." : getCurrentLanguage() === "en" ? "This profile item does not exist." : "Dieses Profilobjekt existiert nicht.");
    return;
  }

  const inventory = getCosmeticInventory();
  if ((inventory[cosmeticType] || []).includes(itemId)) {
    showToast(getCurrentLanguage() === "fr" ? "Bereits freigeschaltet." : getCurrentLanguage() === "en" ? "Already unlocked." : "Bereits freigeschaltet.");
    return;
  }

  if ((getSave().gold || 0) < item.price) {
    showToast(getCurrentLanguage() === "fr" ? "Nicht genug Gold." : getCurrentLanguage() === "en" ? "Not enough gold." : "Nicht genug Gold.");
    return;
  }

  try {
    if (isServerSessionActive()) {
      await purchaseCosmeticOnServer(cosmeticType, itemId);
    } else {
      getSave().gold -= item.price;
      getSave().cosmetics[cosmeticType] = [...new Set([...(getSave().cosmetics[cosmeticType] || []), itemId])];
      persistCurrentAccount();
    }
    renderAll();
    showToast(getCurrentLanguage() === "fr" ? "Profilobjekt gekauft." : getCurrentLanguage() === "en" ? "Profile item purchased." : "Profilobjekt gekauft.");
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || "Profilobjekt konnte nicht gekauft werden.");
  }
}

async function handleProfileDisplaySubmit(event) {
  event.preventDefault();
  if (!currentAccount) {
    return;
  }

  const form = event.currentTarget;
  const display = {
    avatarId: String(form.querySelector('[name="avatarId"]')?.value || ""),
    frameId: String(form.querySelector('[name="frameId"]')?.value || ""),
    titleId: String(form.querySelector('[name="titleId"]')?.value || ""),
  };

  try {
    if (isServerSessionActive()) {
      await saveProfileDisplayOnServer(display);
    } else {
      getSave().profileDisplay = sanitizeProfileDisplayState(display, DEFAULT_PROFILE_DISPLAY, getCosmeticInventory());
      persistCurrentAccount();
    }
    renderProfile();
    renderTopBar();
    showToast(getCurrentLanguage() === "fr" ? "Profil aktualisé." : getCurrentLanguage() === "en" ? "Profile updated." : "Profil aktualisiert.");
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || "Profil konnte nicht aktualisiert werden.");
  }
}

function getToggleStateLabel(enabled) {
  return getUiText(enabled ? "common.on" : "common.off");
}

function getMotionStateLabel(reduced) {
  return getUiText(reduced ? "common.reduced" : "common.normal");
}

Object.assign(UI_TEXT.en, {
  auth: {
    eyebrow: "Projekt Vault Online",
    title: "Your card account is ready.",
    body: "Create your account, start with five free starter boosters, and begin building your collection right away.",
    points: [
      "More than 700 cards including trainer cards",
      "Multiple booster tiers with different odds",
      "Saved decks with availability checks",
    ],
    loginTab: "Log in",
    registerTab: "Create account",
    username: "Player name",
    password: "Password",
    loginButton: "Log in",
    registerButton: "Create account",
    loginHint: "Log in with your game account.",
    registerHint: "New accounts start with 0 cards, 5 free starter boosters and some starting gold.",
    storageNote: "Your account is handled through the active game server.",
  },
  brand: {
    eyebrow: "Strategy Trading Card Game",
    description: "Open boosters, collect cards, build multiple decks and test them in turn-based duels.",
    saveModeLabel: "Active save mode",
    saveModeValue: "Server storage active",
  },
  nav: {
    menu: "Main Menu",
    shop: "Shop",
    marketplace: "Marketplace",
    booster: "Open Boosters",
    collection: "Collection",
    decks: "Decks",
    wiki: "Wiki",
    profile: "Profile",
    friends: "Friends",
    settings: "Settings",
    admin: "Admin",
    arena: "Arena",
  },
  scene: {
    menu: { eyebrow: "Menu principal", title: "Le chemin le plus rapide vers l'arène", text: "Passe directement aux combats, aux cartes, à la boutique et au marché depuis un hub clair au lieu d'un tableau de gestion." },
    menu: { eyebrow: "Main Menu", title: "The fastest route back into the arena", text: "Jump straight into battles, cards, shop and market from one clear hub instead of an admin-style dashboard." },
    shop: { eyebrow: "Curated Market", title: "New power waits behind every seal", text: "Shop items, boosters and future content are displayed like wares inside a glowing vault hall." },
    marketplace: { eyebrow: "Open Trade", title: "Values rise, fall and swing every hour", text: "The marketplace should feel like a living exchange instead of a plain sell list." },
    booster: { eyebrow: "Seal Chamber", title: "Boosters should feel like small rituals", text: "Choose your pack, ignite the chamber and let the cards fall into the vault with a staged reveal." },
    collection: { eyebrow: "Archive Gallery", title: "Your collection takes center stage", text: "Rare cards, filters, market values and deck status are presented like a curated exhibition." },
    decks: { eyebrow: "Strategy Chamber", title: "Deckbuilding should feel tactical", text: "Saved lists, warnings and available cards are arranged as modular command surfaces." },
    wiki: { eyebrow: "Knowledge Archive", title: "Rules, systems and symbols in one place", text: "The wiki explains cards, market flow, arena rules, account systems and server operation in one searchable hub." },
    profile: { eyebrow: "Account Profile", title: "Your account remains its own module", text: "Player name, password and security data stay deliberately separate from collection and match logic." },
    friends: { eyebrow: "Social Preparation", title: "Friends and trading get their own space", text: "Friend lists, invites and future card trading are already prepared as a dedicated module." },
    multiplayer: { eyebrow: "Multiplayer", title: "Real player duels with queue and open challenges", text: "Join the queue, challenge other players and accept open matches directly from the game." },
    settings: { eyebrow: "Control Center", title: "Fine-tune effects, comfort and language", text: "Adjust interface behavior, click feedback, booster presentation and confirmations directly for your account." },
    admin: { eyebrow: "Control Room", title: "Management clearly separated from play", text: "Admin tools stay intentionally sober while still belonging to the same visual world." },
    arena: { eyebrow: "Duel Arena", title: "Every match gets its own stage", text: "Board, heroes and hand sit inside a staged battle arena with more depth and clearer focus." },
  },
  filters: {
    allRarities: "All rarities",
    allTypes: "All types",
    allFactions: "All factions",
    allCosts: "All costs",
    costLow: "0 to 2 mana",
    costMid: "3 to 5 mana",
    costHigh: "6 to 9 mana",
    sortRarityAsc: "Rarity ascending",
    sortRarityDesc: "Rarity descending",
    sortCostAsc: "Mana ascending",
    sortCostDesc: "Mana descending",
    sortOwnedDesc: "Most copies first",
    sortNameAsc: "Name A to Z",
    sortNameDesc: "Name Z to A",
    sortMarketDesc: "Highest market value",
    marketHot: "Strongest rise",
    marketCold: "Strongest drop",
    marketValueDesc: "Highest market value",
    marketValueAsc: "Lowest market value",
    marketName: "Name",
  },
  sections: {
    shopTitle: "Buy boosters and prepare content",
    shopNote: "Build your collection through boosters, curated packs and premium shop offers.",
    shopOffers: "Booster offers",
    futureTitle: "Coming soon in the shop",
    marketTitle: "Hourly price movement through supply and demand",
    marketNote: "Market prices update every real hour. Marketplace value can sit above or below normal vendor value.",
    marketMovers: "Top movers",
    marketMoversNote: "The strongest winners and losers from the latest market round.",
      boosterTitle: "Open boosters",
    collectionTitle: "All cards and sell options",
    collectionNote: "Cards are clickable. In the detail view you can inspect and sell them.",
    decksTitle: "Save and validate multiple decks",
    decksNote: "If a card was sold, the deck remains saved but is marked as unplayable.",
    wikiTitle: "Everything about systems, cards and rules",
    wikiNote: "Find rules, symbols, boosters, deckbuilding, market behavior and match systems in one searchable knowledge center.",
    profileTitle: "Manage account data and security",
    profileNote: "Manage your player name, password and account access from one central profile.",
    friendsTitle: "Prepare social features for trading and friendships",
    friendsNote: "Keep your friend code, contacts and social hub in one place.",
    settingsTitle: "Adjust game feel, effects and confirmations",
    settingsNote: "Settings are stored per account and already exist as a clean standalone module.",
    adminTitle: "Manage accounts and edit saves directly",
    adminNote: "Only visible for the administrator account. Changes apply immediately to local saves.",
    arenaTitle: "Turn-based test duel",
  },
  shop: {
    futureItems: [
      { title: "Card sleeves", copy: "Cosmetic sleeves with faction visuals and special frames." },
      { title: "Tournament tickets", copy: "Planned later for events, leaderboards and special rewards." },
      { title: "Account services", copy: "Profile frames, name changes and seasonal extras." },
    ],
  },
  market: {
    browseEyebrow: "Trade filters",
    browseTitle: "Browse listings",
    search: "Search",
    searchPlaceholder: "Search a marketplace card",
    rarity: "Rarity",
    sort: "Sorting",
    resetFilters: "Reset filters",
    resultsMeta: "{count} listings · {sort}",
    nextHour: "Next market hour",
    nextHourText: "Until the next automatic price round.",
    hottest: "Hottest card",
    hottestText: "{delta} in the last hour",
    stable: "Stable market value",
    stableText: "{name} is currently leading the market.",
    mood: "Market mood",
    moodText: "Based on average demand versus supply.",
    feeVault: "Fee pool",
    feeVaultText: "7% marketplace fee is reserved as the server-side share.",
    topGainer: "Top gainer",
    topLoser: "Biggest loser",
    marketValue: "Market value {price} Gold · {delta}",
    noOffersTitle: "No market offers in this filter",
    noOffersText: "Adjust search or rarity to show more cards.",
    buyButton: "Buy {price}G",
    sellNetButton: "Sell net {price}G",
    ownedShort: "Owned",
    buyShort: "Buy",
    grossShort: "Gross",
    netShort: "Net",
    feeShort: "Fee",
    deltaShort: "Trend",
    footer: "Market gross {gross} Gold · Fee {fee} Gold · Payout {net} Gold · Buy price {buy} Gold · {delta}",
    buyerMarket: "Buyer market",
    sellerPressure: "Seller pressure",
    balanced: "Balanced",
  },
  booster: {
    openSelected: "Open selected booster",
    ownedTitle: "Your boosters",
    ownedCount: "Owned: {count}",
    guarantee: "Guaranteed: {rarity}",
    price: "Price: {price} Gold",
    draws: "Draws: 5 cards",
    noneOpenedTitle: "No booster opened yet",
    noneOpenedText: "Choose a booster on the left and open it. Your latest cards will appear here.",
    packBought: "{pack} purchased.",
    packOpened: "{pack} opened.",
  },
  collection: {
    search: "Search",
    searchPlaceholder: "Search card names",
    sort: "Sorting",
    rarity: "Rarity",
    type: "Type",
    faction: "Faction",
    mana: "Mana",
    ownedOnly: "Owned cards only",
    duplicatesOnly: "Duplicates only",
    noCardsTitle: "No cards found",
    noCardsText: "Adjust your filters or open more boosters.",
  },
  decks: {
      mode: "Deck mode",
      activeName: "Active deck name",
    deckNamePlaceholder: "Deck name",
    saveDeckName: "Save deck name",
    newDeck: "New deck",
    duplicateDeck: "Duplicate deck",
    deleteDeck: "Delete active deck",
    activeDeckTitle: "Active deck",
    savedDecksTitle: "Saved decks",
    addCardsTitle: "Cards to add",
    addCardsNote: "A deck needs exactly 20 cards to be playable in the arena.",
    cardsMeta: "Cards {count}/{size}",
    unitsMeta: "Units {count}",
      spellsMeta: "Spells {count}/{limit}",
      trainersMeta: "Trainers {count}/{limit}",
      standardDeck: "Standard deck",
      hardcoreDeck: "Hardcore deck",
    playable: "Deck is playable.",
    emptyDeckTitle: "Empty deck",
    emptyDeckText: "Add cards from your collection to make the deck playable.",
    add: "Add",
    unavailable: "Unavailable",
    inDeck: "In deck {used}/{owned}",
    codeEyebrow: "Deck code",
    codeTitle: "Share and import decks",
    codeNote: "Copy your current deck or paste a code to load a list instantly.",
    codeLabel: "Deck code",
    codePlaceholder: "Paste deck code",
    copyCode: "Copy code",
    importCode: "Import code",
    clearCode: "Clear code",
  },
  profile: {
    activeProfile: "Active profile",
    friendCode: "Friend code {code} · Created on {date}",
    locked: "Locked",
    editable: "Editable",
    lockedNote: "The administrator account intentionally stays bound to the reserved bootstrap data.",
    editableNote: "Name and password changes verify the current password and update the running session immediately.",
    renameTitle: "Change player name",
    renameNote: "The new name must be 3 to 12 characters long, must not look like an admin name and must not already be taken.",
    newUsername: "New player name",
    currentPassword: "Current password",
    saveUsername: "Save player name",
    passwordTitle: "Change password",
    passwordNote: "For local tests the password is updated immediately. In later server operation this validation belongs in the backend.",
    newPassword: "New password",
    confirmPassword: "Repeat new password",
    updatePassword: "Update password",
    serverTitle: "Server preparation",
    bullet1: "Profile fields and settings already live separately from the match system.",
    bullet2: "Friends, trading and real sessions can later be connected to API endpoints without rebuilding the interface.",
    bullet3: "The local account remains a test state. For real online play, names, passwords and permissions must be validated on the server.",
    dangerNote: "Reset account only removes gold, cards, boosters and decks inside this account. The login itself stays intact.",
    resetAccount: "Reset account",
    totalCards: "Total cards",
    totalBoosters: "Total boosters",
  },
  friends: {
    network: "Friend network",
    codeTitle: "Friend code {code}",
    codeNote: "This local code is only a placeholder. Real friendships and trading will later require server IDs and API validation.",
    friends: "Friends",
    openRequests: "Open requests",
    blocked: "Blocked",
    modulesReady: "Modules ready",
    moduleActive: "Active",
    moduleEmpty: "Empty",
    listEyebrow: "Friend list",
    listTitle: "Your contacts",
    listEmpty: "No friends saved yet. Direct contacts can appear here later.",
    listNote: "Confirmed friendships with online status and quick trading will live here later.",
    requestsEyebrow: "Requests",
    requestsTitle: "Incoming and outgoing",
    requestsEmpty: "There are currently no open friend requests.",
    requestsNote: "This section is reserved for later server-backed requests and notifications.",
    tradeEyebrow: "Trading",
    tradeTitle: "Secure trading comes later",
    feature1Title: "Planned trade flow",
    feature1Text: "Direct trade offers, mutual confirmation and later server validation.",
    feature2Title: "Preparation already exists",
    feature2Text: "Separate tab, placeholder data and isolated UI structure for future expansion.",
    feature3Title: "Important later",
    feature3Text: "Friends and trading must not stay purely client-side in online play, otherwise exploits become trivial.",
  },
  settings: {
    activeSettings: "Active settings",
    activeCount: "{count} of {total} comfort options enabled",
    syncNote: "These options are stored per account and can later sync directly with a server profile.",
    calmMode: "Calm mode",
    fullStage: "Full stage",
    language: "Language",
    displayTitle: "Display and comfort",
    clickTitle: "Enable click effects",
    clickNote: "Ripples and small reactions on buttons and cards.",
    packTitle: "Enable booster presentation",
    packNote: "Opening burst, reveal effects and stronger pack staging.",
    motionTitle: "Reduced motion",
    motionNote: "Strongly reduces additional animations and visual movement.",
    confirmTitle: "Show confirmations",
    confirmNote: "Ask before delete and reset actions change data.",
    resetButton: "Reset settings",
    sessionTitle: "Session",
    sessionNote: "Log out of this local account. Later this action can be replaced by real server logout.",
    logout: "Log out",
    clickEffects: "Click effects",
    packEffects: "Booster presentation",
    movement: "Motion",
    confirmations: "Confirmations",
    saved: "Setting saved.",
    reset: "Settings reset.",
    languageChanged: "Language saved.",
  },
  admin: {
    createAccount: "Create account",
    createUsername: "Player name",
    createPassword: "Password",
    createButton: "Create account",
    allAccounts: "All accounts",
    selectedAccount: "Selected account",
    economics: "Economy",
    packInventory: "Booster inventory",
    cardCollection: "Card collection",
    accountActions: "Account actions",
    goldAmount: "Gold amount",
    packType: "Booster type",
    packAmount: "Booster amount",
    card: "Card",
    cardAmount: "Card amount",
    grantGold: "Grant gold",
    removeGold: "Remove gold",
    grantPack: "Grant boosters",
    removePack: "Remove boosters",
    grantCard: "Grant cards",
    removeCard: "Remove cards",
    dangerNote: "Player accounts can be deleted completely. The administrator account remains protected.",
    deleteAccount: "Delete selected account",
  },
  arena: {
    resetMatch: "Leave match",
    startMatch: "Start new match",
    difficulty: "Difficulty",
    difficultyHint: "Choose a tier. Harder opponents pay more gold.",
    recommended: "Recommended {difficulty}",
    antiFarmTitle: "Reduced rewards",
    antiFarmNote: "This deck is too strong for this tier. Effective rewards: win {win} Gold, loss {loss} Gold.",
    rewardWin: "Win {gold} Gold",
    rewardLoss: "Loss {gold} Gold",
    forfeitPenalty: "Forfeit -{gold} Gold",
    handTitle: "Your hand",
    endTurn: "End turn",
    focusMode: "Match focus active",
    focusNote: "Navigation and card management stay locked until you leave the match.",
    yourTurn: "Your turn",
    enemyTurn: "Enemy turn",
    victory: "Victory",
    defeat: "Defeat",
    notReady: "Not ready",
    noMatch: "No active match",
    noMatchText: "The arena now uses status effects, synergies, timing windows and longer duels.",
    opponent: "Opponent",
    you: "You",
    readyStart: "The active deck is playable. You can start a match.",
    startMatchHint: "Start a new match once your active deck is valid.",
    noHandTitle: "No cards in hand",
    noHandText: "A match automatically creates your opening hand.",
    round: "Round {turn}",
    mana: "Mana {current}/{max}",
    yourDeck: "Your deck {count}",
    enemyDeck: "Enemy deck {count}",
    boardControl: "Board control",
    handFlow: "Hand flow",
    heroRace: "Hero race",
    latestLog: "Latest state",
    life: "Life",
    hand: "Hand {count}",
    field: "Board {count}/{size}",
    shield: "Shield {value}",
    attackReady: "Ready to attack",
    readyNextTurn: "Ready next turn",
    attack: "Attack",
    wait: "Wait",
    attackHint: "Attacks the weakest enemy unit.",
    notReadyHint: "Not ready yet",
    play: "Play",
    tooExpensive: "Too expensive",
    detailsHint: "Clickable for details, playing uses mana.",
    enemyTurnLocked: "Locked during the enemy turn",
    emptySlot: "Open slot",
    difficulties: {
      novice: { label: "Novice", description: "Forgiving opponent with weaker pressure and smaller rewards." },
      standard: { label: "Standard", description: "Balanced arena tier with the normal gold values." },
      veteran: { label: "Veteran", description: "Tougher opponent with more tempo, more staying power and better rewards." },
      nightmare: { label: "Nightmare", description: "Very strong opponent with high rewards if you beat it." },
      hardcore: { label: "Hardcore", description: "Dedicated 35-card special deck. Losing or forfeiting destroys that list." },
    },
  },
  card: {
    cardInfo: "Card info",
    synergy: "Synergy",
    synergyReady: "The active deck already fulfills this condition.",
    synergyMissing: "The active deck does not currently fulfill this condition.",
    timing: "Timing",
    ownership: "Ownership and decks",
    owned: "Owned",
    inActiveDeck: "In deck",
    vendorSell: "Vendor value",
    marketGross: "Gross",
    marketFee: "Fee",
    marketPayout: "Net",
    marketBuy: "Buy",
    hourlyMove: "Trend",
    actions: "Actions",
    note: "Note",
    deckNote: "Selling a card does not automatically modify saved decks. Affected decks are only marked as blocked.",
    matchLockNote: "Card trading, market buys and deck editing are locked while a match is running.",
    sellOne: "Sell 1",
    sellDupes: "Sell duplicates",
    marketSellOne: "Sell 1 on market ({price}G net)",
    marketBuyOne: "Buy 1 on market",
    sellAll: "Sell all",
    toDeck: "To active deck",
    cost: "Cost {value}",
    attack: "ATK {value}",
    health: "HP {value}",
    keywordPrefix: "Keywords: {value}.",
    synergyPrefix: "Synergy: Active with {value}.",
    timingPrefix: "Timing: {value}.",
    deathPrefix: "Death effect: {value}",
    solid: "A solid card without an extra effect.",
    tokenUnit: "Summoned token unit.",
    onPlay: "On play",
    effect: "Effect",
    also: "Also",
    unknownEffect: "Triggers an unusual effect.",
  },
});

Object.assign(UI_TEXT.fr, {
  auth: {
    eyebrow: "Préparation en ligne Projekt Vault",
    title: "Ton compte de cartes t'attend déjà.",
    body: "Crée ton compte, commence avec cinq boosters de départ gratuits et lance directement ta première collection.",
    points: [
      "Plus de 700 cartes, y compris des cartes d'entraîneur",
      "Plusieurs paliers de boosters avec des chances différentes",
      "Des decks sauvegardés avec vérification de disponibilité",
    ],
    loginTab: "Connexion",
    registerTab: "Créer un compte",
    username: "Nom du joueur",
    password: "Mot de passe",
    loginButton: "Connexion",
    registerButton: "Créer le compte",
    loginHint: "Connecte-toi avec ton compte de test local.",
    registerHint: "Les nouveaux comptes commencent avec 0 carte, 5 boosters de départ gratuits et un peu d'or initial.",
    storageNote: "Ton compte est géré par le serveur de jeu actif.",
  },
  brand: {
    eyebrow: "Jeu de cartes stratégique",
    description: "Ouvre des boosters, collectionne des cartes, construis plusieurs decks et teste-les dans des duels au tour par tour.",
    saveModeLabel: "Mode de sauvegarde actif",
    saveModeValue: "Stockage serveur actif",
  },
  nav: {
    menu: "Menu principal",
    shop: "Boutique",
    marketplace: "Marché",
    booster: "Ouvrir des boosters",
    collection: "Collection",
    decks: "Decks",
    wiki: "Wiki",
    profile: "Profil",
    friends: "Amis",
    multiplayer: "Multijoueur",
    settings: "Paramètres",
    admin: "Admin",
    arena: "Arène",
  },
  scene: {
    shop: { eyebrow: "Marché du conservateur", title: "Une nouvelle puissance attend derrière chaque sceau", text: "La boutique, les boosters et les futurs contenus sont exposés comme dans une salle de coffre lumineuse." },
    marketplace: { eyebrow: "Commerce libre", title: "Les valeurs montent, chutent et basculent chaque heure", text: "Le marché doit ressembler à une bourse vivante plutôt qu'à une simple liste de vente." },
    booster: { eyebrow: "Chambre des sceaux", title: "Les boosters doivent ressembler à de petits rituels", text: "Choisis ton pack, active la chambre et laisse les cartes tomber dans le coffre avec une révélation progressive." },
    collection: { eyebrow: "Galerie des archives", title: "Ta collection occupe le centre", text: "Cartes rares, filtres, valeurs du marché et état des decks sont présentés comme une exposition soignée." },
    decks: { eyebrow: "Chambre stratégique", title: "La construction de deck doit sembler tactique", text: "Listes sauvegardées, alertes et cartes disponibles sont organisées comme des surfaces de commande modulaires." },
    wiki: { eyebrow: "Archive de savoir", title: "Règles, systèmes et symboles au même endroit", text: "La wiki explique les cartes, le marché, l'arène, le compte et le fonctionnement serveur dans un centre de savoir consultable." },
    profile: { eyebrow: "Profil du compte", title: "Ton compte reste un module à part", text: "Nom du joueur, mot de passe et données de sécurité restent volontairement séparés de la collection et des matchs." },
    friends: { eyebrow: "Préparation sociale", title: "Les amis et l'échange ont leur propre espace", text: "Listes d'amis, invitations et futur échange de cartes sont déjà préparés comme module dédié." },
    settings: { eyebrow: "Centre de contrôle", title: "Ajuster les effets, le confort et les confirmations", text: "Les paramètres locaux du compte influencent directement l'interface et pourront plus tard être synchronisés côté serveur." },
    admin: { eyebrow: "Salle de contrôle", title: "Gestion clairement séparée du jeu", text: "Les outils admin restent sobres tout en faisant partie du même univers visuel." },
    arena: { eyebrow: "Arène de duel", title: "Chaque match a sa propre scène", text: "Plateau, héros et main prennent place dans une arène plus profonde et plus lisible." },
  },
  filters: {
    allRarities: "Toutes les raretés",
    allTypes: "Tous les types",
    allFactions: "Toutes les factions",
    allCosts: "Tous les coûts",
    costLow: "0 à 2 mana",
    costMid: "3 à 5 mana",
    costHigh: "6 à 9 mana",
    sortRarityAsc: "Rareté croissante",
    sortRarityDesc: "Rareté décroissante",
    sortCostAsc: "Mana croissant",
    sortCostDesc: "Mana décroissant",
    sortOwnedDesc: "Plus d'exemplaires d'abord",
    sortNameAsc: "Nom A à Z",
    sortNameDesc: "Nom Z à A",
    sortMarketDesc: "Valeur du marché la plus haute",
    marketHot: "Plus forte hausse",
    marketCold: "Plus forte baisse",
    marketValueDesc: "Valeur du marché la plus haute",
    marketValueAsc: "Valeur du marché la plus basse",
    marketName: "Nom",
  },
  sections: {
    shopTitle: "Acheter des boosters et préparer le contenu",
    shopNote: "Tout le contenu achetable se trouve déjà dans la boutique. D'autres modules pourront être ajoutés plus tard.",
    shopOffers: "Offres de boosters",
    futureTitle: "Bientôt dans la boutique",
    marketTitle: "Mouvements de prix horaires selon l'offre et la demande",
    marketNote: "Les prix du marché se mettent à jour chaque heure réelle. La valeur du marché peut être au-dessus ou au-dessous de la valeur du marchand.",
    marketMovers: "Principaux mouvements",
    marketMoversNote: "Les plus grands gagnants et perdants du dernier cycle.",
      boosterTitle: "Ouvrir des boosters",
    collectionTitle: "Toutes les cartes et options de vente",
    collectionNote: "Les cartes sont cliquables. Dans la vue détail tu peux les vérifier et les vendre.",
    decksTitle: "Sauvegarder et vérifier plusieurs decks",
    decksNote: "Si une carte est vendue, le deck reste sauvegardé mais est marqué comme non jouable.",
    wikiTitle: "Tout sur les systèmes, les cartes et les règles",
    wikiNote: "Retrouve les règles, symboles, boosters, deckbuilding, marché et systèmes de match dans une base de connaissance consultable.",
    profileTitle: "Gérer les données du compte et la sécurité",
    profileNote: "Le nom du joueur et le mot de passe sont modifiés localement, mais la structure est prête pour un compte serveur plus tard.",
    friendsTitle: "Préparer les fonctions sociales pour l'échange et les amitiés",
    friendsNote: "Cette zone existe déjà pour que les listes d'amis, demandes et échanges soient ajoutés plus tard de manière modulaire.",
    settingsTitle: "Ajuster le ressenti, les effets et les confirmations",
    settingsNote: "Les paramètres sont sauvegardés par compte et existent déjà comme module propre.",
    adminTitle: "Gérer les comptes et modifier les sauvegardes directement",
    adminNote: "Visible uniquement pour le compte administrateur. Les changements s'appliquent immédiatement aux sauvegardes locales.",
    arenaTitle: "Duel de test au tour par tour",
  },
  shop: {
    futureItems: [
      { title: "Protège-cartes", copy: "Protège-cartes cosmétiques avec style de faction et cadres spéciaux." },
      { title: "Tickets de tournoi", copy: "Prévus plus tard pour les événements, classements et récompenses spéciales." },
      { title: "Services de compte", copy: "Cadres de profil, changements de nom et bonus saisonniers." },
    ],
  },
  market: {
    browseEyebrow: "Filtres du marché",
    browseTitle: "Parcourir les offres",
    search: "Recherche",
    searchPlaceholder: "Chercher une carte au marché",
    rarity: "Rareté",
    sort: "Tri",
    resetFilters: "Réinitialiser les filtres",
    resultsMeta: "{count} offres · {sort}",
    nextHour: "Prochaine heure du marché",
    nextHourText: "Jusqu'au prochain cycle automatique des prix.",
    hottest: "Carte la plus chaude",
    hottestText: "{delta} sur la dernière heure",
    stable: "Valeur stable du marché",
    stableText: "{name} mène actuellement le marché.",
    mood: "Tendance du marché",
    moodText: "Basée sur la demande moyenne face à l'offre.",
    feeVault: "Réserve des frais",
    feeVaultText: "7 % de frais du marché sont réservés comme part serveur.",
    topGainer: "Plus forte hausse",
    topLoser: "Plus forte baisse",
    marketValue: "Valeur du marché {price} Or · {delta}",
    noOffersTitle: "Aucune offre dans ce filtre",
    noOffersText: "Ajuste la recherche ou la rareté pour afficher plus de cartes.",
    buyButton: "Acheter {price}G",
    sellNetButton: "Vendre net {price}G",
    ownedShort: "Possédé",
    buyShort: "Achat",
    grossShort: "Brut",
    netShort: "Net",
    feeShort: "Frais",
    deltaShort: "Tendance",
    footer: "Marché brut {gross} Or · Frais {fee} Or · Paiement {net} Or · Achat {buy} Or · {delta}",
    buyerMarket: "Marché acheteur",
    sellerPressure: "Pression vendeuse",
    balanced: "Équilibré",
  },
  booster: {
    openSelected: "Ouvrir le booster sélectionné",
    ownedTitle: "Tes boosters",
    ownedCount: "Possédés : {count}",
    guarantee: "Garantie : {rarity}",
    price: "Prix : {price} Or",
    draws: "Tirages : 5 cartes",
    noneOpenedTitle: "Aucun booster ouvert",
    noneOpenedText: "Choisis un booster à gauche et ouvre-le. Tes dernières cartes apparaîtront ici.",
    packBought: "{pack} acheté.",
    packOpened: "{pack} ouvert.",
  },
  collection: {
    search: "Recherche",
    searchPlaceholder: "Chercher un nom de carte",
    sort: "Tri",
    rarity: "Rareté",
    type: "Type",
    faction: "Faction",
    mana: "Mana",
    ownedOnly: "Cartes possédées seulement",
    duplicatesOnly: "Doublons seulement",
    noCardsTitle: "Aucune carte trouvée",
    noCardsText: "Ajuste tes filtres ou ouvre plus de boosters.",
  },
  decks: {
    mode: "Mode du deck",
    activeName: "Nom du deck actif",
    deckNamePlaceholder: "Nom du deck",
    saveDeckName: "Sauvegarder le nom",
    newDeck: "Nouveau deck",
    duplicateDeck: "Dupliquer le deck",
    deleteDeck: "Supprimer le deck actif",
    activeDeckTitle: "Deck actif",
    savedDecksTitle: "Decks sauvegardés",
    addCardsTitle: "Cartes à ajouter",
    addCardsNote: "Un deck a besoin de 20 cartes exactement pour être jouable dans l'arène.",
    cardsMeta: "Cartes {count}/{size}",
    unitsMeta: "Unités {count}",
      spellsMeta: "Sorts {count}/{limit}",
      trainersMeta: "Entraîneurs {count}/{limit}",
      standardDeck: "Deck standard",
      hardcoreDeck: "Deck hardcore",
    playable: "Le deck est jouable.",
    emptyDeckTitle: "Deck vide",
    emptyDeckText: "Ajoute des cartes depuis ta collection pour rendre le deck jouable.",
    add: "Ajouter",
    unavailable: "Indisponible",
    inDeck: "Dans le deck {used}/{owned}",
    codeEyebrow: "Code de deck",
    codeTitle: "Partager et importer",
    codeNote: "Copie ton deck actuel ou colle un code pour charger une liste immédiatement.",
    codeLabel: "Code de deck",
    codePlaceholder: "Coller un code de deck",
    copyCode: "Copier le code",
    importCode: "Importer le code",
    clearCode: "Effacer le code",
  },
  profile: {
    activeProfile: "Profil actif",
    friendCode: "Code ami {code} · Créé le {date}",
    locked: "Verrouillé",
    editable: "Modifiable",
    lockedNote: "Le compte administrateur reste volontairement lié aux données bootstrap réservées.",
    editableNote: "Les changements de nom et de mot de passe vérifient le mot de passe actuel et mettent à jour la session immédiatement.",
    renameTitle: "Changer le nom du joueur",
    renameNote: "Le nouveau nom doit contenir entre 3 et 12 caractères, ne doit pas ressembler à un nom admin et ne doit pas déjà être pris.",
    newUsername: "Nouveau nom du joueur",
    currentPassword: "Mot de passe actuel",
    saveUsername: "Sauvegarder le nom",
    passwordTitle: "Changer le mot de passe",
    passwordNote: "Pour les tests locaux, le mot de passe est mis à jour immédiatement. Plus tard cette vérification devra être faite côté serveur.",
    newPassword: "Nouveau mot de passe",
    confirmPassword: "Répéter le nouveau mot de passe",
    updatePassword: "Mettre à jour le mot de passe",
    serverTitle: "Préparation serveur",
    bullet1: "Les champs de profil et les paramètres sont déjà séparés du système de match.",
    bullet2: "Les amis, l'échange et les vraies sessions pourront plus tard être reliés à des API sans reconstruire l'interface.",
    bullet3: "Le compte local reste un état de test. Pour un vrai mode en ligne, nom, mot de passe et droits doivent être validés côté serveur.",
    dangerNote: "Réinitialiser le compte supprime seulement l'or, les cartes, les boosters et les decks dans ce compte. La connexion reste intacte.",
    resetAccount: "Réinitialiser le compte",
    totalCards: "Cartes totales",
    totalBoosters: "Boosters totaux",
  },
  friends: {
    network: "Réseau d'amis",
    codeTitle: "Code ami {code}",
    codeNote: "Ce code local n'est qu'un espace réservé. Les vraies amitiés et échanges demanderont plus tard des IDs serveur et une validation API.",
    friends: "Amis",
    openRequests: "Demandes ouvertes",
    blocked: "Bloqués",
    modulesReady: "Modules prêts",
    moduleActive: "Actif",
    moduleEmpty: "Vide",
    listEyebrow: "Liste d'amis",
    listTitle: "Tes contacts",
    listEmpty: "Aucun ami enregistré pour le moment. Des contacts directs pourront apparaître ici plus tard.",
    listNote: "Les amitiés confirmées avec statut en ligne et échange rapide apparaîtront ici plus tard.",
    requestsEyebrow: "Demandes",
    requestsTitle: "Entrantes et sortantes",
    requestsEmpty: "Il n'y a actuellement aucune demande d'ami ouverte.",
    requestsNote: "Cette zone est réservée aux futures demandes et notifications côté serveur.",
    tradeEyebrow: "Échange",
    tradeTitle: "L'échange sécurisé viendra plus tard",
    feature1Title: "Logique d'échange prévue",
    feature1Text: "Offres directes, confirmation des deux côtés et validation serveur plus tard.",
    feature2Title: "Préparation déjà présente",
    feature2Text: "Onglet dédié, données temporaires et structure d'interface séparée pour les futures extensions.",
    feature3Title: "Important pour plus tard",
    feature3Text: "Les amis et l'échange ne doivent pas rester entièrement côté client en ligne, sinon les exploits deviennent triviaux.",
  },
  settings: {
    activeSettings: "Paramètres actifs",
    activeCount: "{count} sur {total} options de confort actives",
    syncNote: "Ces options sont sauvegardées par compte et pourront plus tard être synchronisées avec un profil serveur.",
    calmMode: "Mode calme",
    fullStage: "Scène complète",
    language: "Langue",
    displayTitle: "Affichage et confort",
    clickTitle: "Activer les effets de clic",
    clickNote: "Ondulations et petites réactions sur les boutons et les cartes.",
    packTitle: "Activer la mise en scène des boosters",
    packNote: "Explosion d'ouverture, effets de révélation et meilleure présentation des packs.",
    motionTitle: "Mouvement réduit",
    motionNote: "Réduit fortement les animations supplémentaires et les mouvements visuels.",
    confirmTitle: "Afficher les confirmations",
    confirmNote: "Demande une confirmation avant les actions de suppression et de réinitialisation.",
    resetButton: "Réinitialiser les paramètres",
    sessionTitle: "Session",
    sessionNote: "Déconnecte-toi de ce compte local. Plus tard cette action pourra être remplacée par une vraie déconnexion serveur.",
    logout: "Déconnexion",
    clickEffects: "Effets de clic",
    packEffects: "Mise en scène des boosters",
    movement: "Mouvement",
    confirmations: "Confirmations",
    saved: "Paramètre sauvegardé.",
    reset: "Paramètres réinitialisés.",
    languageChanged: "Langue sauvegardée.",
  },
  admin: {
    createAccount: "Créer un compte",
    createUsername: "Nom du joueur",
    createPassword: "Mot de passe",
    createButton: "Créer le compte",
    allAccounts: "Tous les comptes",
    selectedAccount: "Compte sélectionné",
    economics: "Économie",
    packInventory: "Stock de boosters",
    cardCollection: "Collection de cartes",
    accountActions: "Actions du compte",
    goldAmount: "Quantité d'or",
    packType: "Type de booster",
    packAmount: "Nombre de boosters",
    card: "Carte",
    cardAmount: "Nombre de cartes",
    grantGold: "Ajouter de l'or",
    removeGold: "Retirer de l'or",
    grantPack: "Donner des boosters",
    removePack: "Retirer des boosters",
    grantCard: "Donner des cartes",
    removeCard: "Retirer des cartes",
    dangerNote: "Les comptes joueurs peuvent être supprimés complètement. Le compte administrateur reste protégé.",
    deleteAccount: "Supprimer le compte sélectionné",
  },
  arena: {
    resetMatch: "Quitter le match",
    startMatch: "Nouveau match",
    difficulty: "Difficulté",
    difficultyHint: "Choisis un niveau. Les adversaires plus durs donnent plus d'or.",
    recommended: "Recommandé {difficulty}",
    antiFarmTitle: "Récompense réduite",
    antiFarmNote: "Ce deck est trop fort pour ce niveau. Récompenses effectives : victoire {win} or, défaite {loss} or.",
    rewardWin: "Victoire {gold} Or",
    rewardLoss: "Défaite {gold} Or",
    forfeitPenalty: "Abandon -{gold} Or",
    handTitle: "Ta main",
    endTurn: "Fin du tour",
    focusMode: "Focus du match actif",
    focusNote: "La navigation et la gestion des cartes restent bloquées jusqu'à ce que tu quittes le match.",
    yourTurn: "Ton tour",
    enemyTurn: "Tour adverse",
    victory: "Victoire",
    defeat: "Défaite",
    notReady: "Pas prêt",
    noMatch: "Aucun match actif",
    noMatchText: "L'arène utilise désormais des effets de statut, des synergies, des fenêtres de timing et des duels plus longs.",
    opponent: "Adversaire",
    you: "Toi",
    readyStart: "Le deck actif est jouable. Tu peux lancer un match.",
    startMatchHint: "Lance un nouveau match dès que ton deck actif est valide.",
    noHandTitle: "Aucune carte en main",
    noHandText: "Un match crée automatiquement ta main de départ.",
    round: "Tour {turn}",
    mana: "Mana {current}/{max}",
    yourDeck: "Ton deck {count}",
    enemyDeck: "Deck adverse {count}",
    boardControl: "Contrôle du plateau",
    handFlow: "Flux de main",
    heroRace: "Course des héros",
    latestLog: "Dernier état",
    life: "Vie",
    hand: "Main {count}",
    field: "Plateau {count}/{size}",
    shield: "Bouclier {value}",
    attackReady: "Prêt à attaquer",
    readyNextTurn: "Prêt au prochain tour",
    attack: "Attaquer",
    wait: "Attendre",
    attackHint: "Attaque l'unité ennemie la plus faible.",
    notReadyHint: "Pas encore prêt",
    play: "Jouer",
    tooExpensive: "Trop cher",
    detailsHint: "Cliquable pour les détails, jouer consomme du mana.",
    enemyTurnLocked: "Bloqué pendant le tour adverse",
    emptySlot: "Emplacement libre",
    difficulties: {
      novice: { label: "Novice", description: "Adversaire indulgent avec moins de pression et des récompenses plus faibles." },
      standard: { label: "Standard", description: "Niveau d'arène équilibré avec les valeurs d'or normales." },
      veteran: { label: "Vétéran", description: "Adversaire plus dur avec plus de tempo, plus d'endurance et de meilleures récompenses." },
      nightmare: { label: "Cauchemar", description: "Adversaire très fort avec une grosse récompense si tu le bats." },
      hardcore: { label: "Hardcore", description: "Deck spécial dédié de 35 cartes. Une défaite ou un abandon détruit cette liste." },
    },
  },
  card: {
    cardInfo: "Infos de la carte",
    synergy: "Synergie",
    synergyReady: "Le deck actif remplit déjà cette condition.",
    synergyMissing: "Le deck actif ne remplit pas encore cette condition.",
    timing: "Timing",
    ownership: "Possession et decks",
    owned: "Stock",
    inActiveDeck: "Deck actif",
    vendorSell: "Valeur marchand",
    marketGross: "Brut",
    marketFee: "Frais",
    marketPayout: "Net",
    marketBuy: "Achat",
    hourlyMove: "Tendance",
    actions: "Actions",
    note: "Note",
    deckNote: "Vendre une carte ne modifie pas automatiquement les decks sauvegardés. Les decks concernés sont seulement marqués comme bloqués.",
    matchLockNote: "Le commerce, les achats au marché et l'édition du deck sont bloqués pendant un match en cours.",
    sellOne: "Vendre 1",
    sellDupes: "Vendre les doublons",
    marketSellOne: "Vendre 1 au marché ({price}G net)",
    marketBuyOne: "Acheter 1 au marché",
    sellAll: "Tout vendre",
    toDeck: "Ajouter au deck actif",
    cost: "Coût {value}",
    attack: "ATQ {value}",
    health: "PV {value}",
    keywordPrefix: "Mots-clés : {value}.",
    synergyPrefix: "Synergie : active avec {value}.",
    timingPrefix: "Timing : {value}.",
    deathPrefix: "Effet de mort : {value}",
    solid: "Une carte solide sans effet supplémentaire.",
    tokenUnit: "Unité jeton invoquée.",
    onPlay: "À l'arrivée",
    effect: "Effet",
    also: "En plus",
    unknownEffect: "Déclenche un effet inhabituel.",
  },
});

Object.assign(UI_TEXT.de.shop, {
  tabs: { boosters: "Booster", packs: "Packs", cosmetics: "Profil-Shop" },
  teasers: {
    boosters: "Klassische Einzelkäufe mit fünf Zufallskarten pro Booster.",
    packs: "Feste Karten plus zusätzliche Booster in einem Kauf.",
    cosmetics: "Profilbilder, Rahmen und Titel für dein Konto.",
  },
  tabHeadingBoosters: "Booster-Angebote",
  tabHeadingPacks: "Packs mit festen Karten und Bonus-Boostern",
  tabHeadingCosmetics: "Profilbilder, Rahmen und Titel",
  tabNoteBoosters: "Booster bleiben der flexible Weg für einzelne Käufe und zufällige Pulls über alle Seltenheiten hinweg.",
  tabNotePacks: "Packs liefern garantierte Fraktionskarten direkt in deine Sammlung und legen zusätzliche Booster in dein Inventar.",
  tabNoteCosmetics: "Im Profil-Shop schaltest du neue Identitätselemente für Kontoansicht, Freundesliste und spätere soziale Bereiche frei.",
  summaryTitleBoosters: "Booster-Markt",
  summaryTitlePacks: "Pack-Serien",
  summaryTitleCosmetics: "Profil-Kosmetik",
  summaryOffers: "Angebote",
  summaryGuaranteed: "Garantien",
  summaryBoosters: "Booster-Inhalt",
  summaryPricing: "Preisrahmen",
  summaryModuleNote: "Booster und Packs greifen auf denselben Katalog zu und lassen sich sauber im laufenden Shop verwalten.",
  bundleGuaranteed: "Garantierte Karten",
  bundleBoosters: "Enthaltene Booster",
  bundleBuy: "Pack kaufen",
  bundleCardsCount: "{count} feste Karten",
  bundleBoostersCount: "{count} Booster dabei",
  bundleDelivery: "Feste Karten gehen sofort in deine Sammlung. Booster landen direkt im Öffnen-Tab.",
  bundleUnavailable: "Dieses Pack existiert nicht.",
  bundleNoGold: "Dafür reicht dein Gold nicht.",
  bundleBought: "{bundle} wurde gekauft.",
  bundleTiers: {
    scout: "Rekrutenpaket",
    battle: "Vorhutpaket",
    command: "Kommandopaket",
    vault: "Gewölbepaket",
    apex: "Zenitpaket",
  },
});

Object.assign(UI_TEXT.en.shop, {
  tabs: { boosters: "Boosters", packs: "Packs", cosmetics: "Profile Shop" },
  teasers: {
    boosters: "Classic single purchases with five random cards per booster.",
    packs: "Fixed cards plus extra boosters in one purchase.",
    cosmetics: "Avatars, frames and titles for your account identity.",
  },
  tabHeadingBoosters: "Booster Offers",
  tabHeadingPacks: "Packs with fixed cards and bonus boosters",
  tabHeadingCosmetics: "Avatars, frames and titles",
  tabNoteBoosters: "Boosters stay the flexible route for single purchases and random pulls across every rarity.",
  tabNotePacks: "Packs place guaranteed faction cards directly into your collection and add extra boosters to your inventory.",
  tabNoteCosmetics: "The profile shop unlocks identity items for your account card, friend list and future social surfaces.",
  summaryTitleBoosters: "Booster Market",
  summaryTitlePacks: "Pack Series",
  summaryTitleCosmetics: "Profile Cosmetics",
  summaryOffers: "Offers",
  summaryGuaranteed: "Guarantees",
  summaryBoosters: "Booster Content",
  summaryPricing: "Price Range",
  summaryModuleNote: "The shop now runs on catalog data. New boosters or packs can be added later without rebuilding the interface.",
  bundleGuaranteed: "Guaranteed Cards",
  bundleBoosters: "Included Boosters",
  bundleBuy: "Buy Pack",
  bundleCardsCount: "{count} fixed cards",
  bundleBoostersCount: "{count} boosters inside",
  bundleDelivery: "Fixed cards go straight into your collection. Boosters are added to the opening tab.",
  bundleUnavailable: "This pack does not exist.",
  bundleNoGold: "You do not have enough gold for this.",
  bundleBought: "{bundle} has been purchased.",
  bundleTiers: {
    scout: "Recruit Pack",
    battle: "Vanguard Pack",
    command: "Command Pack",
    vault: "Vault Pack",
    apex: "Zenith Pack",
  },
});

Object.assign(UI_TEXT.fr.shop, {
  tabs: { boosters: "Boosters", packs: "Packs", cosmetics: "Boutique profil" },
  teasers: {
    boosters: "Achats classiques avec cinq cartes aléatoires par booster.",
    packs: "Cartes fixes plus boosters supplémentaires dans un seul achat.",
    cosmetics: "Portraits, cadres et titres pour l'identité du compte.",
  },
  tabHeadingBoosters: "Offres de boosters",
  tabHeadingPacks: "Packs avec cartes fixes et boosters bonus",
  tabHeadingCosmetics: "Portraits, cadres et titres",
  tabNoteBoosters: "Les boosters restent la voie flexible pour les achats unitaires et les tirages aléatoires sur toutes les raretés.",
  tabNotePacks: "Les packs placent directement des cartes de faction garanties dans ta collection et ajoutent des boosters à ton inventaire.",
  tabNoteCosmetics: "La boutique profil débloque des éléments d'identité pour la carte de compte, la liste d'amis et les futurs espaces sociaux.",
  summaryTitleBoosters: "Marché des boosters",
  summaryTitlePacks: "Séries de packs",
  summaryTitleCosmetics: "Cosmétiques de profil",
  summaryOffers: "Offres",
  summaryGuaranteed: "Garanties",
  summaryBoosters: "Contenu booster",
  summaryPricing: "Fourchette de prix",
  summaryModuleNote: "La boutique fonctionne maintenant avec des données de catalogue. De nouveaux boosters ou packs pourront être ajoutés plus tard sans reconstruire l'interface.",
  bundleGuaranteed: "Cartes garanties",
  bundleBoosters: "Boosters inclus",
  bundleBuy: "Acheter le pack",
  bundleCardsCount: "{count} cartes fixes",
  bundleBoostersCount: "{count} boosters inclus",
  bundleDelivery: "Les cartes fixes vont directement dans ta collection. Les boosters sont ajoutés à l'onglet d'ouverture.",
  bundleUnavailable: "Ce pack n'existe pas.",
  bundleNoGold: "Tu n'as pas assez d'or pour cela.",
  bundleBought: "{bundle} a été acheté.",
  bundleTiers: {
    scout: "Pack Recrue",
    battle: "Pack Avant-garde",
    command: "Pack Commandement",
    vault: "Pack Coffre",
    apex: "Pack Zénith",
  },
});

Object.assign(UI_TEXT.de, {
  common: {
    currency: "Gold",
    on: "An",
    off: "Aus",
    reduced: "Reduziert",
    normal: "Normal",
    active: "Aktiv",
    waiting: "Wartet",
    ready: "Bereit",
    admin: "Admin",
    playerAccount: "Spielkonto",
    activeSession: "Aktive Sitzung",
    buy: "Kaufen",
    select: "Auswählen",
    open: "Öffnen",
  },
  adminPanel: {
    noAccount: "Es steht kein Konto für die Verwaltung bereit.",
    title: "Ausgewähltes Konto",
    gold: "Gold",
    totalCards: "Karten gesamt",
    uniqueCards: "Einzigartige Karten",
    savedDecks: "Gespeicherte Decks",
    packInventory: "Boosterbestand",
    protection: "Schutzstatus",
    protected: "Dieses Konto ist geschützt und kann nicht gelöscht werden.",
    deletable: "Dieses Spielkonto kann bei Bedarf vollständig gelöscht werden.",
  },
  messages: {
    accountNotFound: "Dieses Konto konnte nicht gefunden werden.",
    authInvalidUsername: "Bitte verwende einen gültigen Spielernamen mit 3 bis 12 Zeichen.",
    authPasswordMin: "Das Passwort muss mindestens 4 Zeichen lang sein.",
    authReservedUsername: "Namen mit Admin oder adminähnlichen Varianten sind reserviert.",
    authUsernameTaken: "Dieser Spielername ist bereits vergeben.",
    authAccountCreated: "Konto {username} wurde erstellt.",
    authAccountCreateFailed: "Das Konto konnte nicht sicher erstellt werden. Bitte versuche es erneut.",
    authInvalidCredentials: "Spielername oder Passwort sind nicht korrekt.",
    authWelcomeBack: "Willkommen zurück, {username}.",
    authLoginFailed: "Die Anmeldung konnte nicht sicher geprüft werden. Bitte versuche es erneut.",
    adminNameLocked: "Das Administratorkonto bleibt auf den reservierten Namen fixiert.",
    profileCurrentPasswordRequired: "Bitte bestätige die Änderung mit deinem aktuellen Passwort.",
    profileCurrentPasswordMissing: "Bitte gib dein aktuelles Passwort ein.",
    profilePasswordMin: "Das neue Passwort muss mindestens 4 Zeichen lang sein.",
    profilePasswordMismatch: "Die beiden neuen Passwörter stimmen nicht überein.",
    profilePasswordSame: "Bitte wähle ein neues Passwort statt desselben Werts.",
    profileCurrentPasswordWrong: "Das aktuelle Passwort ist nicht korrekt.",
    profileRenameSuccess: "Dein Spielername wurde auf {username} geändert.",
    profileRenameFailed: "Der Spielername konnte nicht sicher geändert werden.",
    profilePasswordSuccess: "Dein Passwort wurde aktualisiert.",
    profilePasswordFailed: "Das Passwort konnte nicht sicher aktualisiert werden.",
    settingsReset: "Die Einstellungen wurden zurückgesetzt.",
    accountResetConfirm: "Möchtest du wirklich nur dieses Konto zurücksetzen? Karten, Gold, Booster und Decks gehen dabei verloren.",
    accountResetDone: "Das Konto wurde zurückgesetzt.",
    deckMissing: "Es ist kein aktives Deck vorhanden.",
    deckSize: "Das Deck hat {count}/{size} Karten.",
    deckUnavailableCard: "Das Deck enthält eine nicht mehr verfügbare Karte.",
    deckMissingOwned: "{missing}× {name} fehlen im Besitz.",
    deckLimitExceeded: "{name} überschreitet das Decklimit von {limit}.",
    deckSpellLimit: "Zu viele Zauber im Deck: {count}/{limit}.",
    deckTrainerLimit: "Zu viele Trainer im Deck: {count}/{limit}.",
    deckCodeMissing: "Bitte zuerst einen Deck-Code einfügen.",
    deckCodeInvalid: "Der Deck-Code ist ungültig oder beschädigt.",
    deckCodeCopied: "Deck-Code kopiert.",
    deckCodeCopiedFallback: "Deck-Code wurde ins Feld geschrieben.",
    deckCodeImported: "{mode} importiert: {name}.",
    deckCodeHardcoreConfirm: "Das bestehende Hardcore-Deck wird durch diesen Code ersetzt. Wirklich importieren?",
    matchNotPlayable: "Das aktive Deck ist noch nicht spielbar.",
    matchAlreadyRunning: "Beende zuerst das laufende Match, bevor du ein neues startest.",
    matchStarted: "Neues Match gestartet.",
    matchDifficultySaved: "Die Arena-Schwierigkeit wurde gespeichert.",
    matchRewardWin: "Belohnung auf {difficulty}: {gold} Gold.",
    matchRewardLoss: "Trostpreis auf {difficulty}: {gold} Gold.",
    matchForfeitConfirm: "Wenn du das Match jetzt verlässt, zahlst du auf {difficulty} bis zu {gold} Gold Strafe. Wenn dir weniger Gold bleibt, wird nur dein Restgold abgezogen. Wirklich aufgeben?",
    matchForfeitPaid: "Match vorzeitig verlassen. Strafe: {gold} Gold.",
    matchNavigationLocked: "Solange ein Match läuft, bleiben alle Bereiche außerhalb der Arena gesperrt.",
    matchCollectionLocked: "Während eines laufenden Matches sind Kartenhandel und Deckänderungen gesperrt.",
    cardNotPlayable: "Diese Karte kann gerade nicht gespielt werden.",
    matchStartStatus: "Baue Druck auf und verwalte dein Mana sorgfältig.",
    matchTurnStartPlayer: "Dein Zug beginnt.",
    matchTurnStartEnemy: "Der Gegner beginnt seinen Zug.",
    matchPlayerStatus: "Du kannst Karten spielen und mit bereiten Einheiten angreifen.",
    matchEnemyStatus: "Der Gegner plant seinen Gegenzug.",
    fatiguePlayer: "Du erleidest {value} Ermüdungsschaden.",
    fatigueEnemy: "Der Gegner erleidet {value} Ermüdungsschaden.",
    fatigueFinish: "Ein Held ist an Ermüdung gefallen.",
    regenerated: "{name} regeneriert 1 Lebenspunkt.",
    adminSelectAccount: "Bitte zuerst ein Konto im Admin-Bereich auswählen.",
    adminCreateUsernameInvalid: "Bitte einen gültigen Spielernamen mit 3 bis 12 Zeichen eingeben.",
    adminCreatePasswordInvalid: "Bitte ein Passwort mit mindestens 4 Zeichen eingeben.",
    adminCreated: "Das Konto {username} wurde erstellt.",
    adminGoldAmountInvalid: "Bitte eine gültige Goldmenge eingeben.",
    adminNoRemovableGold: "{username} besitzt aktuell kein abziehbares Gold.",
    adminGoldGranted: "{amount} Gold wurden {username} gutgeschrieben.",
    adminGoldRemoved: "{amount} Gold wurden {username} abgezogen.",
    adminPackUnavailable: "Diese Booster-Art ist nicht verfügbar.",
    adminPackAmountInvalid: "Bitte eine gültige Booster-Anzahl eingeben.",
    adminPackNone: "{username} besitzt davon aktuell keine Booster.",
    adminPackGranted: "{amount}× {pack} wurden {username} gegeben.",
    adminPackRemoved: "{amount}× {pack} wurden {username} abgezogen.",
    adminCardMissing: "Diese Karte existiert nicht.",
    adminCardAmountInvalid: "Bitte eine gültige Kartenanzahl eingeben.",
    adminCardNone: "{username} besitzt diese Karte aktuell nicht.",
    adminCardGranted: "{amount}× {card} wurden {username} hinzugefügt.",
    adminCardRemoved: "{amount}× {card} wurden {username} abgezogen.",
    adminProtected: "Das Administratorkonto ist geschützt und kann nicht gelöscht werden.",
    adminDeleteConfirm: "Soll das Konto {username} wirklich vollständig gelöscht werden? Dieser Schritt entfernt Gold, Booster, Karten und Decks dauerhaft.",
    adminDeleted: "Das Konto {username} wurde gelöscht.",
  },
});

Object.assign(UI_TEXT.en, {
  common: {
    currency: "Gold",
    on: "On",
    off: "Off",
    reduced: "Reduced",
    normal: "Normal",
    active: "Active",
    waiting: "Waiting",
    ready: "Ready",
    admin: "Admin",
    playerAccount: "Player Account",
    activeSession: "Active Session",
    buy: "Buy",
    select: "Select",
    open: "Open",
  },
  adminPanel: {
    noAccount: "No account is currently available for management.",
    title: "Selected Account",
    gold: "Gold",
    totalCards: "Total Cards",
    uniqueCards: "Unique Cards",
    savedDecks: "Saved Decks",
    packInventory: "Booster Inventory",
    protection: "Protection Status",
    protected: "This account is protected and cannot be deleted.",
    deletable: "This player account can be deleted completely if needed.",
  },
  messages: {
    accountNotFound: "This account could not be found.",
    authInvalidUsername: "Please use a valid player name with 3 to 12 characters.",
    authPasswordMin: "The password must be at least 4 characters long.",
    authReservedUsername: "Names containing admin or admin-like variants are reserved.",
    authUsernameTaken: "This player name is already taken.",
    authAccountCreated: "Account {username} has been created.",
    authAccountCreateFailed: "The account could not be created securely on this device. Please try again.",
    authInvalidCredentials: "Player name or password is incorrect.",
    authWelcomeBack: "Welcome back, {username}.",
    authLoginFailed: "Login could not be verified securely on this device. Please try again.",
    adminNameLocked: "The administrator account stays locked to the reserved local name.",
    profileCurrentPasswordRequired: "Please confirm the change with your current password.",
    profileCurrentPasswordMissing: "Please enter your current password.",
    profilePasswordMin: "The new password must be at least 4 characters long.",
    profilePasswordMismatch: "The two new passwords do not match.",
    profilePasswordSame: "Please choose a new password instead of the same one.",
    profileCurrentPasswordWrong: "The current password is incorrect.",
    profileRenameSuccess: "Your player name has been changed to {username}.",
    profileRenameFailed: "The player name could not be changed securely on this device.",
    profilePasswordSuccess: "Your password has been updated.",
    profilePasswordFailed: "The password could not be updated securely on this device.",
    settingsReset: "Settings have been reset.",
    accountResetConfirm: "Do you really want to reset only this account? Cards, gold, boosters and decks will be lost.",
    accountResetDone: "The account has been reset locally.",
    deckMissing: "There is no active deck.",
    deckSize: "The deck has {count}/{size} cards.",
    deckUnavailableCard: "The deck contains a card that is no longer available.",
    deckMissingOwned: "{missing}× {name} are missing from your collection.",
    deckLimitExceeded: "{name} exceeds the deck limit of {limit}.",
    deckSpellLimit: "Too many spells in deck: {count}/{limit}.",
    deckTrainerLimit: "Too many trainers in deck: {count}/{limit}.",
    deckCodeMissing: "Please paste a deck code first.",
    deckCodeInvalid: "The deck code is invalid or damaged.",
    deckCodeCopied: "Deck code copied.",
    deckCodeCopiedFallback: "Deck code was written into the field.",
    deckCodeImported: "{mode} imported: {name}.",
    deckCodeHardcoreConfirm: "The current hardcore deck will be replaced by this code. Import anyway?",
    matchNotPlayable: "The active deck is not playable yet.",
    matchAlreadyRunning: "Finish the current match before you start a new one.",
    matchStarted: "New match started.",
    matchDifficultySaved: "Arena difficulty saved.",
    matchRewardWin: "Reward on {difficulty}: {gold} Gold.",
    matchRewardLoss: "Consolation on {difficulty}: {gold} Gold.",
    matchForfeitConfirm: "If you leave the match now, you pay up to {gold} Gold on {difficulty}. If you have less, only your remaining gold is removed. Really forfeit?",
    matchForfeitPaid: "Match forfeited early. Penalty: {gold} Gold.",
    matchNavigationLocked: "While a match is running, every area outside the arena stays locked.",
    matchCollectionLocked: "Card trading and deck editing are locked while a match is running.",
    cardNotPlayable: "This card cannot be played right now.",
    matchStartStatus: "Build pressure and manage your mana carefully.",
    matchTurnStartPlayer: "Your turn begins.",
    matchTurnStartEnemy: "The opponent begins their turn.",
    matchPlayerStatus: "You can play cards and attack with ready units.",
    matchEnemyStatus: "The opponent is planning their response.",
    fatiguePlayer: "You take {value} fatigue damage.",
    fatigueEnemy: "The opponent takes {value} fatigue damage.",
    fatigueFinish: "A hero has fallen to fatigue.",
    regenerated: "{name} regenerates 1 health.",
    adminSelectAccount: "Please select an account in the admin area first.",
    adminCreateUsernameInvalid: "Please enter a valid player name with 3 to 12 characters.",
    adminCreatePasswordInvalid: "Please enter a password with at least 4 characters.",
    adminCreated: "The account {username} has been created.",
    adminGoldAmountInvalid: "Please enter a valid gold amount.",
    adminNoRemovableGold: "{username} currently has no removable gold.",
    adminGoldGranted: "{amount} gold have been granted to {username}.",
    adminGoldRemoved: "{amount} gold have been removed from {username}.",
    adminPackUnavailable: "This booster type is not available.",
    adminPackAmountInvalid: "Please enter a valid booster amount.",
    adminPackNone: "{username} currently has none of those boosters.",
    adminPackGranted: "{amount}× {pack} have been given to {username}.",
    adminPackRemoved: "{amount}× {pack} have been removed from {username}.",
    adminCardMissing: "This card does not exist.",
    adminCardAmountInvalid: "Please enter a valid card amount.",
    adminCardNone: "{username} does not currently own this card.",
    adminCardGranted: "{amount}× {card} have been added to {username}.",
    adminCardRemoved: "{amount}× {card} have been removed from {username}.",
    adminProtected: "The administrator account is protected and cannot be deleted.",
    adminDeleteConfirm: "Do you really want to delete the account {username} completely? This permanently removes gold, boosters, cards and decks.",
    adminDeleted: "The account {username} has been deleted.",
  },
});

Object.assign(UI_TEXT.fr, {
  common: {
    currency: "Or",
    on: "Oui",
    off: "Non",
    reduced: "Réduit",
    normal: "Normal",
    active: "Actif",
    waiting: "En attente",
    ready: "Prêt",
    admin: "Admin",
    playerAccount: "Compte joueur",
    activeSession: "Session active",
    buy: "Acheter",
    select: "Choisir",
    open: "Ouvrir",
  },
  adminPanel: {
    noAccount: "Aucun compte n'est prêt pour l'administration.",
    title: "Compte sélectionné",
    gold: "Or",
    totalCards: "Cartes totales",
    uniqueCards: "Cartes uniques",
    savedDecks: "Decks sauvegardés",
    packInventory: "Stock de boosters",
    protection: "Statut de protection",
    protected: "Ce compte est protégé et ne peut pas être supprimé.",
    deletable: "Ce compte joueur peut être supprimé entièrement si nécessaire.",
  },
  messages: {
    accountNotFound: "Ce compte est introuvable.",
    authInvalidUsername: "Utilise un nom de joueur valide de 3 à 12 caractères.",
    authPasswordMin: "Le mot de passe doit contenir au moins 4 caractères.",
    authReservedUsername: "Les noms contenant admin ou une variante proche sont réservés.",
    authUsernameTaken: "Ce nom de joueur est déjà pris.",
    authAccountCreated: "Le compte {username} a été créé.",
    authAccountCreateFailed: "Le compte n'a pas pu être créé localement de manière sécurisée. Réessaie.",
    authInvalidCredentials: "Le nom de joueur ou le mot de passe est incorrect.",
    authWelcomeBack: "Bon retour, {username}.",
    authLoginFailed: "La connexion n'a pas pu être vérifiée localement de manière sécurisée. Réessaie.",
    adminNameLocked: "Le compte administrateur reste verrouillé sur le nom local réservé.",
    profileCurrentPasswordRequired: "Confirme le changement avec ton mot de passe actuel.",
    profileCurrentPasswordMissing: "Veuillez saisir votre mot de passe actuel.",
    profilePasswordMin: "Le nouveau mot de passe doit contenir au moins 4 caractères.",
    profilePasswordMismatch: "Les deux nouveaux mots de passe ne correspondent pas.",
    profilePasswordSame: "Choisis un nouveau mot de passe au lieu du même.",
    profileCurrentPasswordWrong: "Le mot de passe actuel est incorrect.",
    profileRenameSuccess: "Ton nom de joueur a été changé en {username}.",
    profileRenameFailed: "Le nom de joueur n'a pas pu être modifié localement de manière sécurisée.",
    profilePasswordSuccess: "Ton mot de passe a été mis à jour.",
    profilePasswordFailed: "Le mot de passe n'a pas pu être mis à jour localement de manière sécurisée.",
    settingsReset: "Les paramètres ont été réinitialisés.",
    accountResetConfirm: "Veux-tu vraiment réinitialiser seulement ce compte ? Les cartes, l'or, les boosters et les decks seront perdus.",
    accountResetDone: "Le compte a été réinitialisé localement.",
    deckMissing: "Aucun deck actif n'est disponible.",
    deckSize: "Le deck contient {count}/{size} cartes.",
    deckUnavailableCard: "Le deck contient une carte qui n'est plus disponible.",
    deckMissingOwned: "Il manque {missing}× {name} dans ta collection.",
    deckLimitExceeded: "{name} dépasse la limite de deck de {limit}.",
    deckSpellLimit: "Trop de sorts dans le deck : {count}/{limit}.",
    deckTrainerLimit: "Trop d'entraîneurs dans le deck : {count}/{limit}.",
    deckCodeMissing: "Colle d'abord un code de deck.",
    deckCodeInvalid: "Le code de deck est invalide ou corrompu.",
    deckCodeCopied: "Code de deck copié.",
    deckCodeCopiedFallback: "Le code de deck a été placé dans le champ.",
    deckCodeImported: "{mode} importé : {name}.",
    deckCodeHardcoreConfirm: "Le deck hardcore actuel sera remplacé par ce code. Continuer ?",
    matchNotPlayable: "Le deck actif n'est pas encore jouable.",
    matchAlreadyRunning: "Termine d'abord le match en cours avant d'en lancer un autre.",
    matchStarted: "Nouveau match lancé.",
    matchDifficultySaved: "La difficulté de l'arène a été sauvegardée.",
    matchRewardWin: "Récompense en {difficulty} : {gold} or.",
    matchRewardLoss: "Lot de consolation en {difficulty} : {gold} or.",
    matchForfeitConfirm: "Si tu quittes le match maintenant, tu paies jusqu'à {gold} or de pénalité en {difficulty}. Si tu as moins, seul ton or restant est retiré. Vraiment abandonner ?",
    matchForfeitPaid: "Match quitté avant la fin. Pénalité : {gold} or.",
    matchNavigationLocked: "Pendant un match, toutes les zones hors de l'arène restent bloquées.",
    matchCollectionLocked: "Le commerce des cartes et l'édition du deck sont bloqués pendant un match en cours.",
    cardNotPlayable: "Cette carte ne peut pas être jouée pour l'instant.",
    matchStartStatus: "Mets la pression et gère ton mana avec soin.",
    matchTurnStartPlayer: "Ton tour commence.",
    matchTurnStartEnemy: "L'adversaire commence son tour.",
    matchPlayerStatus: "Tu peux jouer des cartes et attaquer avec les unités prêtes.",
    matchEnemyStatus: "L'adversaire prépare sa réponse.",
    fatiguePlayer: "Tu subis {value} dégâts de fatigue.",
    fatigueEnemy: "L'adversaire subit {value} dégâts de fatigue.",
    fatigueFinish: "Un héros est tombé à cause de la fatigue.",
    regenerated: "{name} régénère 1 point de vie.",
    adminSelectAccount: "Sélectionne d'abord un compte dans la zone admin.",
    adminCreateUsernameInvalid: "Saisis un nom de joueur valide de 3 à 12 caractères.",
    adminCreatePasswordInvalid: "Saisis un mot de passe d'au moins 4 caractères.",
    adminCreated: "Le compte {username} a été créé.",
    adminGoldAmountInvalid: "Saisis une quantité d'or valide.",
    adminNoRemovableGold: "{username} n'a actuellement aucun or à retirer.",
    adminGoldGranted: "{amount} or ont été ajoutés à {username}.",
    adminGoldRemoved: "{amount} or ont été retirés à {username}.",
    adminPackUnavailable: "Ce type de booster n'est pas disponible.",
    adminPackAmountInvalid: "Saisis une quantité de boosters valide.",
    adminPackNone: "{username} ne possède actuellement aucun de ces boosters.",
    adminPackGranted: "{amount}× {pack} ont été donnés à {username}.",
    adminPackRemoved: "{amount}× {pack} ont été retirés à {username}.",
    adminCardMissing: "Cette carte n'existe pas.",
    adminCardAmountInvalid: "Saisis une quantité de cartes valide.",
    adminCardNone: "{username} ne possède actuellement pas cette carte.",
    adminCardGranted: "{amount}× {card} ont été ajoutés à {username}.",
    adminCardRemoved: "{amount}× {card} ont été retirés à {username}.",
    adminProtected: "Le compte administrateur est protégé et ne peut pas être supprimé.",
    adminDeleteConfirm: "Veux-tu vraiment supprimer complètement le compte {username} ? Cette action retire définitivement l'or, les boosters, les cartes et les decks.",
    adminDeleted: "Le compte {username} a été supprimé.",
  },
});

Object.assign(UI_TEXT.de.card, {
  quickOverview: "Schnellüberblick",
  coreEffects: "Haupteffekte",
  combatProfile: "Synergie, Timing und Zustände",
  ownershipMarket: "Besitz und Markt",
  effectBadges: "Effekt-Symbole",
  effectIconsHelp: "Symbole zeigen sofort, welche Mechaniken diese Karte mitbringt.",
  keywordsTitle: "Schlüsselwörter",
  factionLabel: "Fraktion",
  typeLabel: "Typ",
  statsTitle: "Kampfwerte",
  noCoreEffects: "Keine Zusatzeffekte",
  deathEffectTitle: "Todeseffekt",
});

Object.assign(UI_TEXT.en.card, {
  quickOverview: "Quick overview",
  coreEffects: "Core effects",
  combatProfile: "Synergy, timing and states",
  ownershipMarket: "Ownership and market",
  effectBadges: "Effect symbols",
  effectIconsHelp: "Symbols show at a glance which mechanics this card brings.",
  keywordsTitle: "Keywords",
  factionLabel: "Faction",
  typeLabel: "Type",
  statsTitle: "Combat values",
  noCoreEffects: "No extra effects",
  deathEffectTitle: "Death effect",
});

Object.assign(UI_TEXT.fr.card, {
  quickOverview: "Vue rapide",
  coreEffects: "Effets principaux",
  combatProfile: "Synergie, timing et états",
  ownershipMarket: "Possession et marché",
  effectBadges: "Symboles d'effet",
  effectIconsHelp: "Les symboles montrent immédiatement les mécaniques de cette carte.",
  keywordsTitle: "Mots-clés",
  factionLabel: "Faction",
  typeLabel: "Type",
  statsTitle: "Valeurs de combat",
  noCoreEffects: "Aucun effet supplémentaire",
  deathEffectTitle: "Effet de mort",
});

const TYPE_VISUALS = {
  unit: { symbol: "⚔", tone: "unit" },
  spell: { symbol: "✦", tone: "spell" },
  trainer: { symbol: "⟡", tone: "trainer" },
};

const TYPE_LABELS = {
  unit: "Einheit",
  spell: "Zauber",
  trainer: "Trainer",
};

const KEYWORD_META = {
  charge: { label: "Sturmangriff", text: "Kann direkt in der Runde des Ausspielens angreifen." },
  guard: { label: "Wacht", text: "Muss zuerst angegriffen werden, solange Wacht-Einheiten im Feld stehen." },
  regen: { label: "Regeneration", text: "Heilt sich zu Beginn des eigenen Zuges um 1." },
  lifesteal: { label: "Lebensraub", text: "Heilt den eigenen Helden um den verursachten Kampfschaden." },
};

const STATUS_META = {
  burn: { label: "Brand", text: "Erleidet zu Beginn des eigenen Zuges Schaden." },
  freeze: { label: "Frost", text: "Kann vorübergehend nicht angreifen." },
  poison: { label: "Gift", text: "Erleidet am Ende des eigenen Zuges Schaden." },
  barrier: { label: "Barriere", text: "Der nächste erlittene Schaden wird verhindert." },
};

const KEYWORD_VISUALS = {
  charge: { symbol: "↯", tone: "tempo" },
  guard: { symbol: "⛨", tone: "barrier" },
  regen: { symbol: "✚", tone: "heal" },
  lifesteal: { symbol: "✢", tone: "drain" },
};

const EFFECT_VISUALS = {
  damageHero: { symbol: "⚔", tone: "damage" },
  healHero: { symbol: "✚", tone: "heal" },
  draw: { symbol: "✦", tone: "draw" },
  gainMana: { symbol: "⚡", tone: "mana" },
  gainMaxMana: { symbol: "⬆", tone: "mana" },
  buffBoard: { symbol: "✶", tone: "buff" },
  fortifyBoard: { symbol: "⛨", tone: "fortify" },
  healBoard: { symbol: "✚", tone: "heal" },
  strikeWeakest: { symbol: "⌖", tone: "damage" },
  damageAllEnemies: { symbol: "✹", tone: "damage" },
  burnWeakest: { symbol: "✹", tone: "burn" },
  freezeWeakest: { symbol: "❄", tone: "freeze" },
  poisonWeakest: { symbol: "☠", tone: "poison" },
  barrierStrongest: { symbol: "⛨", tone: "barrier" },
  barrierHero: { symbol: "⛨", tone: "barrier" },
  summonTokens: { symbol: "✦", tone: "summon" },
  weakenEnemies: { symbol: "⬇", tone: "weaken" },
  drainHero: { symbol: "✢", tone: "drain" },
  readyStrongest: { symbol: "↯", tone: "tempo" },
  empowerUnit: { symbol: "✶", tone: "buff" },
  death: { symbol: "✝", tone: "death" },
  synergy: { symbol: "⟡", tone: "synergy" },
  timing: { symbol: "⏳", tone: "timing" },
  neutral: { symbol: "•", tone: "neutral" },
};

const FACTION_PARTNERS = {
  glutorden: "sturmwacht",
  nebelchor: "sternenhof",
  wurzelpakt: "knochenbund",
  schattenzirkel: "runenschmiede",
  sturmwacht: "glutorden",
  runenschmiede: "schattenzirkel",
  sternenhof: "nebelchor",
  knochenbund: "wurzelpakt",
};

const FACTION_CARD_PROFILES = {
  glutorden: {
    unitEffects: ["damageHero", "empowerUnit", "damageAllEnemies", "drainHero", "readyStrongest", "burnWeakest", "summonTokens"],
    spellEffects: ["damageHero", "damageAllEnemies", "drainHero", "weakenEnemies", "gainMana", "burnWeakest", "summonTokens"],
    trainerEffects: ["readyStrongest", "buffBoard", "gainMaxMana", "damageHero", "summonTokens"],
    keywords: ["charge", "lifesteal"],
  },
  nebelchor: {
    unitEffects: ["draw", "healBoard", "strikeWeakest", "weakenEnemies", "drainHero", "freezeWeakest", "barrierHero"],
    spellEffects: ["draw", "healBoard", "weakenEnemies", "strikeWeakest", "gainMaxMana", "freezeWeakest", "barrierHero"],
    trainerEffects: ["draw", "healHero", "gainMana", "readyStrongest", "barrierHero"],
    keywords: ["regen", "lifesteal"],
  },
  wurzelpakt: {
    unitEffects: ["healHero", "fortifyBoard", "healBoard", "buffBoard", "empowerUnit", "barrierStrongest", "barrierHero", "summonTokens"],
    spellEffects: ["healBoard", "fortifyBoard", "buffBoard", "gainMaxMana", "healHero", "barrierStrongest", "barrierHero", "summonTokens"],
    trainerEffects: ["healHero", "fortifyBoard", "readyStrongest", "draw", "barrierStrongest", "barrierHero"],
    keywords: ["guard", "regen"],
  },
  schattenzirkel: {
    unitEffects: ["strikeWeakest", "drainHero", "weakenEnemies", "damageHero", "draw", "freezeWeakest", "poisonWeakest"],
    spellEffects: ["strikeWeakest", "drainHero", "weakenEnemies", "damageHero", "draw", "burnWeakest", "poisonWeakest"],
    trainerEffects: ["draw", "weakenEnemies", "readyStrongest", "damageHero", "poisonWeakest"],
    keywords: ["lifesteal", "charge"],
  },
  sturmwacht: {
    unitEffects: ["readyStrongest", "damageHero", "empowerUnit", "gainMana", "strikeWeakest", "freezeWeakest", "summonTokens"],
    spellEffects: ["gainMana", "damageAllEnemies", "damageHero", "readyStrongest", "weakenEnemies", "freezeWeakest", "summonTokens"],
    trainerEffects: ["gainMaxMana", "readyStrongest", "buffBoard", "draw", "summonTokens"],
    keywords: ["charge", "guard"],
  },
  runenschmiede: {
    unitEffects: ["buffBoard", "empowerUnit", "gainMaxMana", "damageHero", "fortifyBoard", "barrierStrongest", "barrierHero", "summonTokens"],
    spellEffects: ["gainMaxMana", "buffBoard", "damageAllEnemies", "draw", "healBoard", "barrierStrongest", "barrierHero", "summonTokens"],
    trainerEffects: ["buffBoard", "gainMaxMana", "draw", "fortifyBoard", "barrierStrongest", "barrierHero"],
    keywords: ["guard", "charge"],
  },
  sternenhof: {
    unitEffects: ["draw", "healHero", "gainMaxMana", "healBoard", "buffBoard", "barrierStrongest", "barrierHero"],
    spellEffects: ["draw", "healBoard", "gainMaxMana", "damageHero", "fortifyBoard", "freezeWeakest", "barrierHero"],
    trainerEffects: ["draw", "healHero", "gainMaxMana", "readyStrongest", "barrierStrongest", "barrierHero"],
    keywords: ["regen", "guard"],
  },
  knochenbund: {
    unitEffects: ["drainHero", "strikeWeakest", "weakenEnemies", "damageAllEnemies", "fortifyBoard", "burnWeakest", "poisonWeakest", "summonTokens"],
    spellEffects: ["drainHero", "damageAllEnemies", "weakenEnemies", "draw", "strikeWeakest", "burnWeakest", "poisonWeakest"],
    trainerEffects: ["drainHero", "fortifyBoard", "gainMana", "draw", "summonTokens"],
    keywords: ["lifesteal", "guard"],
  },
};

const RARITY_ORDER = ["common", "rare", "epic", "legendary", "ultra", "mythic", "transcendent"];

const RARITY_META = {
  common: { label: "Gewöhnlich", sellValue: 8 },
  rare: { label: "Selten", sellValue: 16 },
  epic: { label: "Episch", sellValue: 32 },
  legendary: { label: "Legendär", sellValue: 64 },
  ultra: { label: "Ultra Rare", sellValue: 110 },
  mythic: { label: "Mythisch", sellValue: 180 },
  transcendent: { label: "Transzendent", sellValue: 320 },
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

const FACTION_VISUALS = {
  glutorden: { symbol: "✹", tone: "ember" },
  nebelchor: { symbol: "☁", tone: "mist" },
  wurzelpakt: { symbol: "❦", tone: "grove" },
  schattenzirkel: { symbol: "◐", tone: "shadow" },
  sturmwacht: { symbol: "⚡", tone: "storm" },
  runenschmiede: { symbol: "⛭", tone: "rune" },
  sternenhof: { symbol: "✧", tone: "star" },
  knochenbund: { symbol: "☠", tone: "bone" },
};

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

const EXPANDED_UNIT_TITLES = [
  "Schildbrecher",
  "Flammenbanner",
  "Runenspeer",
  "Dämmerklinge",
  "Eisgardist",
  "Mondjäger",
  "Sonnenrufer",
  "Grabwächter",
  "Stahlbote",
  "Himmelswandler",
  "Splitterwolf",
  "Sturmpaladin",
  "Nebelhetzer",
  "Wurzelkrieger",
  "Aschenseher",
  "Schattenlanze",
  "Kristallherold",
  "Dornenpriester",
  "Glutkoloss",
  "Ätherfalke",
  "Runenpirscher",
  "Blitzhüter",
  "Sternenrichter",
  "Knochenkavalier",
  "Frostbestie",
  "Bannschmied",
  "Seelengreifer",
  "Hainriese",
  "Dämmerfürst",
  "Orkanbestie",
  "Fluchwächter",
  "Leuchtkommandant",
  "Rissschreiter",
  "Wolkenbrecher",
  "Glimmertitan",
  "Tempelstreiter",
  "Abgrundhüter",
  "Sonnenkoloss",
  "Nachtrichter",
  "Weltenhorn",
];

const EXPANDED_SPELL_TITLES = [
  "Nova",
  "Ritual",
  "Salve",
  "Komet",
  "Schock",
  "Portal",
  "Segen",
  "Bann",
  "Sturmwall",
  "Blutfunke",
  "Spiegelschlag",
  "Zeitsprung",
];

const EXPANDED_TRAINER_TITLES = [
  "Stratege",
  "Arkanist",
  "Bannerträger",
  "Schlachtrufer",
  "Chronist",
  "Hütermeister",
  "Runenmentor",
  "Sternenweber",
  "Seelenlenker",
  "Tiergefährte",
  "Orakelmeister",
  "Wegbereiter",
];

const ASCENDANT_UNIT_TITLES = [
  "Dornregent",
  "Aschenklinge",
  "Mondbanner",
  "RisshÃ¼ter",
  "Stahlorakel",
  "SumpflÃ¤ufer",
  "Lichtvogt",
  "KnochensÃ¤nger",
  "Glutweber",
  "Nebelrichter",
  "WellenhÃ¼ter",
  "Hallenwacht",
  "Splitterhirt",
  "Sternenspeer",
  "Frostpriester",
  "DÃ¼nenbestie",
  "Runenvikar",
  "Schleierwolf",
  "Hainpatriarch",
  "Seelenankerer",
  "Glanzkavalier",
  "Himmelskrieger",
  "Echoschmied",
  "Abgrundrufer",
  "Flammenmarschall",
  "Schattenseneschall",
  "Wurzelarchon",
  "Sturmgreif",
  "Sternenkanzler",
  "Knochenprimarch",
  "Wolkenorakel",
  "Ascheinkarnation",
  "Riftpaladin",
  "Dornenkoloss",
  "Runentitan",
  "NebelfÃ¼rst",
  "Glutarchivist",
  "Mondrichter",
  "WeltenhÃ¼ter",
  "Zwielichtavatar",
];

const ASCENDANT_SPELL_TITLES = [
  "Kreislauf",
  "Funkenwall",
  "Fluchsalve",
  "Spiralsturm",
  "Dornenruf",
  "Zeitfessel",
  "Scherbenregen",
  "Spiegelpfad",
  "Sonnenbruch",
  "Leerenwelle",
  "Sternenschwur",
  "Weltenritual",
];

const ASCENDANT_TRAINER_TITLES = [
  "Archivar",
  "Belagerungsmeister",
  "Kartenkurator",
  "SchwurhÃ¼ter",
  "Spurenseher",
  "Feldarchitekt",
  "Arenapriester",
  "Siegelrichter",
  "Ritualkommandant",
  "Zeitmentor",
  "Nexuslotse",
  "GewÃ¶lbewÃ¤chter",
];

const UNIT_RARITIES = ["common", "common", "common", "common", "common", "rare", "rare", "rare", "rare", "epic", "epic", "epic", "legendary", "ultra", "mythic"];
const SPELL_RARITIES = ["common", "rare", "rare", "epic", "legendary"];
const TRAINER_RARITIES = ["common", "rare", "epic", "ultra", "rare"];
const EXPANDED_UNIT_RARITIES = [
  "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common",
  "rare", "rare", "rare", "rare", "rare", "rare", "rare", "rare", "rare", "rare",
  "epic", "epic", "epic", "epic", "epic", "epic", "epic", "epic",
  "legendary", "legendary", "legendary", "legendary", "legendary",
  "ultra", "ultra", "ultra",
  "mythic", "mythic",
];
const EXPANDED_SPELL_RARITIES = ["common", "common", "rare", "rare", "rare", "epic", "epic", "legendary", "legendary", "ultra", "ultra", "mythic"];
const EXPANDED_TRAINER_RARITIES = ["common", "common", "rare", "rare", "rare", "epic", "epic", "legendary", "legendary", "ultra", "ultra", "mythic"];
const ASCENDANT_UNIT_RARITIES = [
  "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common",
  "rare", "rare", "rare", "rare", "rare", "rare", "rare", "rare", "rare", "rare",
  "epic", "epic", "epic", "epic", "epic", "epic", "epic", "epic",
  "legendary", "legendary", "legendary", "legendary", "legendary",
  "ultra", "ultra", "ultra",
  "mythic", "mythic",
  "transcendent",
];
const ASCENDANT_SPELL_RARITIES = ["common", "common", "rare", "rare", "rare", "epic", "epic", "epic", "legendary", "legendary", "ultra", "mythic"];
const ASCENDANT_TRAINER_RARITIES = ["common", "common", "rare", "rare", "rare", "epic", "epic", "epic", "legendary", "legendary", "ultra", "mythic"];

const PACK_DEFINITIONS = {
  starter: {
    id: "starter",
    label: "Starter-Booster",
    tier: "Einsteiger",
    price: 65,
    description: "Der günstige Einstieg mit schwächeren Chancen auf hohe Seltenheiten.",
    guaranteed: "common",
    odds: { common: 86.55, rare: 10.8, epic: 2.1, legendary: 0.4, ultra: 0.12, mythic: 0.03, transcendent: 0 },
  },
  market: {
    id: "market",
    label: "Markt-Booster",
    tier: "Standard",
    price: 120,
    description: "Solider Allrounder mit besserem Schnitt als das Starter-Booster.",
    guaranteed: "rare",
    odds: { common: 73.65, rare: 18, epic: 5.2, legendary: 2.1, ultra: 0.95, mythic: 0.09, transcendent: 0.01 },
  },
  champion: {
    id: "champion",
    label: "Champion-Booster",
    tier: "Fortgeschritten",
    price: 210,
    description: "Deutlich bessere Chancen auf epische und legendäre Treffer.",
    guaranteed: "rare",
    odds: { common: 56.7, rare: 25.25, epic: 10.8, legendary: 4.4, ultra: 2.2, mythic: 0.6, transcendent: 0.05 },
  },
  relic: {
    id: "relic",
    label: "Relikt-Booster",
    tier: "Elite",
    price: 340,
    description: "Für gezielte Upgrades mit hoher Ultra-Rare-Chance gedacht.",
    guaranteed: "epic",
    odds: { common: 43.1, rare: 27.75, epic: 15.5, legendary: 8.2, ultra: 4.4, mythic: 0.95, transcendent: 0.1 },
  },
  astral: {
    id: "astral",
    label: "Astral-Booster",
    tier: "Luxus",
    price: 520,
    description: "Die teuerste Stufe mit der besten Mythisch- und Transzendent-Wahrscheinlichkeit.",
    guaranteed: "legendary",
    odds: { common: 30.92, rare: 24, epic: 20, legendary: 12.5, ultra: 8, mythic: 4.4, transcendent: 0.18 },
  },
};

function buildGeneratedTitleSeries(leftParts, rightParts, count) {
  const titles = [];
  for (const left of leftParts) {
    for (const right of rightParts) {
      titles.push(`${left}${right}`);
      if (titles.length >= count) {
        return titles;
      }
    }
  }
  return titles.slice(0, count);
}

const ETERNAL_UNIT_TITLES = [
  "Aegishüter",
  "Kronenwacht",
  "Siegelpirscher",
  "Rissgardist",
  "Echobrecher",
  "Schwurklinge",
  "Sphärenvogt",
  "Nexushüter",
  "Dämmerlanze",
  "Sonnenrichter",
  "Kristallgardist",
  "Leerenreiter",
  "Jagdläufer",
  "Eidarchon",
  "Himmelsspalter",
  "Glanzweber",
  "Runenstürmer",
  "Schleierkavalier",
  "Morgenwacht",
  "Kernrufer",
  "Horizontjäger",
  "Prismatitan",
  "Echoseneschall",
  "Weltenvogt",
  "Dornkommandant",
  "Schwurhirte",
  "Sternbrecher",
  "Nexusschmied",
  "Risspirscher",
  "Aegispaladin",
  "Wellenrichter",
  "Hallenwächter",
  "Kometreiter",
  "Fährtenrichter",
  "Siegelkoloss",
  "Scherbenhüter",
  "Leitsternjäger",
  "Zwielichtvogt",
  "Kernpaladin",
  "Morgenarchon",
];

const ETERNAL_SPELL_TITLES = [
  "Prismaschlag",
  "Rissbann",
  "Kometfessel",
  "Schwurfunke",
  "Nexusklinge",
  "Spiegelflut",
  "Kernimpuls",
  "Dämmerbruch",
  "Sternensalve",
  "Weltenknall",
  "Leerenfuge",
  "Echosiegel",
];

const ETERNAL_TRAINER_TITLES = [
  "Konzilsmeister",
  "Siegelmentor",
  "Feldkonsul",
  "Nexuslotse",
  "Sphärenleser",
  "Eidbewahrer",
  "Kammerherr",
  "Kartenweber",
  "Bannerkurat",
  "Schwurseneschall",
  "Wegorakel",
  "Taktikvogt",
];

const ETERNAL_UNIT_RARITIES = [
  "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common", "common",
  "rare", "rare", "rare", "rare", "rare", "rare", "rare", "rare", "rare", "rare",
  "epic", "epic", "epic", "epic", "epic", "epic", "epic", "epic",
  "legendary", "legendary", "legendary", "legendary", "legendary",
  "ultra", "ultra", "ultra",
  "mythic",
  "singular",
];

const ETERNAL_SPELL_RARITIES = ["common", "common", "rare", "rare", "rare", "epic", "epic", "epic", "legendary", "legendary", "ultra", "mythic"];
const ETERNAL_TRAINER_RARITIES = ["common", "common", "rare", "rare", "rare", "epic", "epic", "epic", "legendary", "legendary", "ultra", "mythic"];

const EXTRA_FACTION_DECK_BONUSES = Object.freeze({
  sonnenchor: {
    tone: "gold",
    minCards: 8,
    heroBonus: 3,
    heroBarrier: 1,
    title: localText("Sonnenchor-Aufbruch", "Solar opening", "Ouverture solaire"),
    short: localText("+3 Leben, +1 Schild", "+3 life, +1 shield", "+3 vie, +1 bouclier"),
    description: localText("Ein dominanter Sonnenchor-Deckkern sorgt für einen stabilen und hellen Start.", "A dominant Sun Chorus shell grants a bright and stable opening.", "Une base dominante du Chœur solaire offre un départ lumineux et stable."),
  },
  leerenpakt: {
    tone: "void",
    minCards: 8,
    enemyHeroPenalty: 2,
    heroBarrier: 1,
    title: localText("Leerenpakt-Druck", "Void pressure", "Pression du vide"),
    short: localText("+1 Schild, Gegner -2", "+1 shield, enemy -2", "+1 bouclier, ennemi -2"),
    description: localText("Leerenpakt startet mit stiller Härte und nimmt dem Gegner direkt Raum.", "Void Pact opens with quiet pressure and immediately taxes the enemy.", "Le Pacte du Vide commence avec une pression discrète et retire immédiatement de l'espace à l'adversaire."),
  },
  kristallrat: {
    tone: "aqua",
    minCards: 8,
    heroBarrier: 2,
    openingHandDelta: 1,
    title: localText("Kristallrat-Fokus", "Crystal focus", "Focalisation cristalline"),
    short: localText("+2 Schild, +1 Karte", "+2 shield, +1 card", "+2 bouclier, +1 carte"),
    description: localText("Kristallrat beginnt strukturiert mit Schutz und einer zusätzlichen Option.", "Crystal Council begins with protection and an extra option.", "Le Conseil cristallin commence avec protection et une option supplémentaire."),
  },
  dämmerbund: {
    tone: "violet",
    minCards: 8,
    heroBonus: 2,
    enemyHeroPenalty: 1,
    title: localText("Dämmerbund-Zugriff", "Twilight reach", "Portée du crépuscule"),
    short: localText("+2 Leben, Gegner -1", "+2 life, enemy -1", "+2 vie, ennemi -1"),
    description: localText("Dämmerbund eröffnet zwischen Druck und Kontrolle mit einem kleinen Lebensvorsprung.", "Twilight Covenant opens between pressure and control with a small life edge.", "Le Conclave du crépuscule ouvre entre pression et contrôle avec un léger avantage de vie."),
  },
  wildjagd: {
    tone: "verdant",
    minCards: 8,
    heroBonus: 2,
    startingManaBonus: 1,
    title: localText("Wildjagd-Tempo", "Wild Hunt tempo", "Tempo de la chasse sauvage"),
    short: localText("+2 Leben, +1 Startmana", "+2 life, +1 starting mana", "+2 vie, +1 mana de départ"),
    description: localText("Die Wildjagd springt schneller an und hält dabei genug Druck aus.", "The Wild Hunt gets moving faster while keeping enough durability.", "La Chasse sauvage démarre plus vite tout en gardant assez de résistance."),
  },
});

RARITY_ORDER.push("singular");
Object.assign(RARITY_META, {
  singular: { label: "Singulär", sellValue: 560 },
});
Object.assign(RARITY_TRANSLATIONS.de, { singular: "Singulär" });
Object.assign(RARITY_TRANSLATIONS.en, { singular: "Singular" });
Object.assign(RARITY_TRANSLATIONS.fr, { singular: "Singulier" });

Object.assign(EFFECT_VISUALS, {
  strikeStrongest: { symbol: "✶", tone: "damage" },
  healWeakestAlly: { symbol: "✚", tone: "heal" },
  cleanseAllies: { symbol: "◌", tone: "aqua" },
  barrierAllies: { symbol: "⛨", tone: "barrier" },
  sapMana: { symbol: "⇣", tone: "mana" },
  millEnemy: { symbol: "☄", tone: "void" },
  drainStrongest: { symbol: "✢", tone: "drain" },
  burnAllEnemies: { symbol: "✹", tone: "burn" },
  freezeStrongest: { symbol: "❄", tone: "freeze" },
  poisonAllEnemies: { symbol: "☠", tone: "poison" },
});

FACTIONS.push(
  { id: "sonnenchor", name: "Sonnenchor", prefix: "Sonnen" },
  { id: "leerenpakt", name: "Leerenpakt", prefix: "Leeren" },
  { id: "kristallrat", name: "Kristallrat", prefix: "Kristall" },
  { id: "dämmerbund", name: "Dämmerbund", prefix: "Dämmer" },
  { id: "wildjagd", name: "Wildjagd", prefix: "Wild" },
);

Object.assign(FACTION_VISUALS, {
  sonnenchor: { symbol: "☼", tone: "gold" },
  leerenpakt: { symbol: "✦", tone: "void" },
  kristallrat: { symbol: "❖", tone: "aqua" },
  dämmerbund: { symbol: "☾", tone: "violet" },
  wildjagd: { symbol: "♞", tone: "verdant" },
});

Object.assign(FACTION_PARTNERS, {
  sonnenchor: "dämmerbund",
  leerenpakt: "kristallrat",
  kristallrat: "leerenpakt",
  dämmerbund: "sonnenchor",
  wildjagd: "wurzelpakt",
});

Object.assign(FACTION_CARD_PROFILES, {
  sonnenchor: {
    unitEffects: ["healHero", "healWeakestAlly", "barrierHero", "barrierAllies", "draw", "gainMana", "cleanseAllies", "summonTokens"],
    spellEffects: ["healBoard", "healWeakestAlly", "barrierAllies", "draw", "gainMaxMana", "cleanseAllies", "summonTokens"],
    trainerEffects: ["healHero", "barrierHero", "barrierAllies", "draw", "cleanseAllies", "gainMana"],
    keywords: ["guard", "regen"],
  },
  leerenpakt: {
    unitEffects: ["drainHero", "drainStrongest", "strikeStrongest", "sapMana", "millEnemy", "poisonAllEnemies", "weakenEnemies", "freezeStrongest"],
    spellEffects: ["drainStrongest", "sapMana", "millEnemy", "poisonAllEnemies", "freezeStrongest", "weakenEnemies", "damageHero"],
    trainerEffects: ["draw", "sapMana", "millEnemy", "drainHero", "weakenEnemies", "poisonWeakest"],
    keywords: ["lifesteal", "charge"],
  },
  kristallrat: {
    unitEffects: ["buffBoard", "empowerUnit", "barrierStrongest", "barrierAllies", "draw", "cleanseAllies", "strikeStrongest"],
    spellEffects: ["barrierAllies", "draw", "cleanseAllies", "strikeStrongest", "gainMaxMana", "healWeakestAlly", "buffBoard"],
    trainerEffects: ["barrierStrongest", "barrierAllies", "draw", "cleanseAllies", "gainMana", "empowerUnit"],
    keywords: ["guard", "charge"],
  },
  dämmerbund: {
    unitEffects: ["damageHero", "strikeWeakest", "strikeStrongest", "freezeWeakest", "freezeStrongest", "sapMana", "burnAllEnemies", "weakenEnemies"],
    spellEffects: ["damageHero", "strikeStrongest", "freezeStrongest", "burnAllEnemies", "weakenEnemies", "draw", "sapMana"],
    trainerEffects: ["draw", "freezeWeakest", "sapMana", "weakenEnemies", "damageHero", "burnWeakest"],
    keywords: ["charge", "lifesteal"],
  },
  wildjagd: {
    unitEffects: ["readyStrongest", "summonTokens", "healWeakestAlly", "empowerUnit", "strikeStrongest", "poisonAllEnemies", "draw"],
    spellEffects: ["readyStrongest", "summonTokens", "strikeStrongest", "healWeakestAlly", "poisonAllEnemies", "gainMana", "buffBoard"],
    trainerEffects: ["readyStrongest", "summonTokens", "healHero", "healWeakestAlly", "draw", "empowerUnit"],
    keywords: ["charge", "regen"],
  },
});

PACK_DEFINITIONS.starter.odds = { ...PACK_DEFINITIONS.starter.odds, singular: 0 };
PACK_DEFINITIONS.market.odds = { ...PACK_DEFINITIONS.market.odds, singular: 0 };
PACK_DEFINITIONS.champion.odds = { ...PACK_DEFINITIONS.champion.odds, singular: 0 };
PACK_DEFINITIONS.relic.odds = { common: 43.08, rare: 27.75, epic: 15.5, legendary: 8.2, ultra: 4.4, mythic: 0.95, transcendent: 0.1, singular: 0.02 };
PACK_DEFINITIONS.astral.odds = { common: 30.84, rare: 24, epic: 20, legendary: 12.5, ultra: 8, mythic: 4.4, transcendent: 0.18, singular: 0.08 };

Object.assign(PACK_DEFINITIONS, {
  sovereign: {
    id: "sovereign",
    label: "Souverän-Booster",
    tier: "Souverän",
    price: 760,
    description: "Veredelte Stufe mit starkem Fokus auf legendäre und bessere Züge.",
    guaranteed: "legendary",
    odds: { common: 26.3, rare: 23, epic: 21, legendary: 16, ultra: 9, mythic: 4.4, transcendent: 0.25, singular: 0.05 },
  },
  eclipse: {
    id: "eclipse",
    label: "Eklipsen-Booster",
    tier: "Eklipse",
    price: 930,
    description: "Druckvoller Hochstufen-Booster mit echter Chance auf transzendente Treffer.",
    guaranteed: "ultra",
    odds: { common: 17.5, rare: 18, epic: 22, legendary: 18, ultra: 14, mythic: 8, transcendent: 2.3, singular: 0.2 },
  },
  nexus: {
    id: "nexus",
    label: "Nexus-Booster",
    tier: "Nexus",
    price: 1180,
    description: "Starker Mittelfokus zwischen Ultra, Mythic und seltenen Spitzenkarten.",
    guaranteed: "ultra",
    odds: { common: 12, rare: 14, epic: 19, legendary: 20, ultra: 17, mythic: 11, transcendent: 6.4, singular: 0.6 },
  },
  cataclysm: {
    id: "cataclysm",
    label: "Kataklysmus-Booster",
    tier: "Kataklysmus",
    price: 1460,
    description: "Späte Luxus-Stufe mit hoher Dichte an Spitzenseltenheiten.",
    guaranteed: "mythic",
    odds: { common: 7.5, rare: 11, epic: 17, legendary: 21, ultra: 18, mythic: 15, transcendent: 9.6, singular: 0.9 },
  },
  singularity: {
    id: "singularity",
    label: "Singularitäts-Booster",
    tier: "Singularität",
    price: 1820,
    description: "Die seltenste Kammer im Shop. Hier lebt die kleinste Chance auf singuläre Karten.",
    guaranteed: "transcendent",
    odds: { common: 4.4, rare: 8, epic: 14, legendary: 18, ultra: 20, mythic: 16, transcendent: 17, singular: 2.6 },
  },
});

Object.assign(PACK_TRANSLATIONS.de, {
  sovereign: {
    label: "Souverän-Booster",
    tier: "Souverän",
    description: "Veredelte Stufe mit starkem Fokus auf legendäre und bessere Züge.",
  },
  eclipse: {
    label: "Eklipsen-Booster",
    tier: "Eklipse",
    description: "Druckvoller Hochstufen-Booster mit echter Chance auf transzendente Treffer.",
  },
  nexus: {
    label: "Nexus-Booster",
    tier: "Nexus",
    description: "Starker Mittelfokus zwischen Ultra, Mythic und seltenen Spitzenkarten.",
  },
  cataclysm: {
    label: "Kataklysmus-Booster",
    tier: "Kataklysmus",
    description: "Späte Luxus-Stufe mit hoher Dichte an Spitzenseltenheiten.",
  },
  singularity: {
    label: "Singularitäts-Booster",
    tier: "Singularität",
    description: "Die seltenste Kammer im Shop. Hier lebt die kleinste Chance auf singuläre Karten.",
  },
});

Object.assign(PACK_TRANSLATIONS.en, {
  sovereign: {
    label: "Sovereign Booster",
    tier: "Sovereign",
    description: "A refined tier with a strong focus on legendary and better pulls.",
  },
  eclipse: {
    label: "Eclipse Booster",
    tier: "Eclipse",
    description: "A forceful late-game booster with a real shot at transcendent pulls.",
  },
  nexus: {
    label: "Nexus Booster",
    tier: "Nexus",
    description: "A sharp mid-luxury mix between ultra, mythic and rare top-end cards.",
  },
  cataclysm: {
    label: "Cataclysm Booster",
    tier: "Cataclysm",
    description: "Late luxury tier with a dense spread of top rarities.",
  },
  singularity: {
    label: "Singularity Booster",
    tier: "Singularity",
    description: "The rarest chamber in the shop. This is where the faint chance for singular cards lives.",
  },
});

Object.assign(PACK_TRANSLATIONS.fr, {
  sovereign: {
    label: "Booster souverain",
    tier: "Souverain",
    description: "Un palier raffiné axé sur les tirages légendaires et supérieurs.",
  },
  eclipse: {
    label: "Booster éclipse",
    tier: "Éclipse",
    description: "Un booster de fin de jeu avec une vraie chance d'obtenir du transcendant.",
  },
  nexus: {
    label: "Booster nexus",
    tier: "Nexus",
    description: "Un mélange haut de gamme entre ultra, mythique et cartes d'élite.",
  },
  cataclysm: {
    label: "Booster cataclysme",
    tier: "Cataclysme",
    description: "Un palier luxueux de fin de jeu rempli de hautes raretés.",
  },
  singularity: {
    label: "Booster singularité",
    tier: "Singularité",
    description: "La chambre la plus rare de la boutique et la plus faible chance d'obtenir une carte singulière.",
  },
});

const FUTURE_SHOP_ITEMS = [
  { title: "Kartenhüllen", copy: "Kosmetische Hüllen mit Fraktionsoptik und besonderen Rahmen." },
  { title: "Turnier-Tickets", copy: "Später für Events, Ranglisten und Spezialbelohnungen gedacht." },
  { title: "Account-Dienste", copy: "Profilrahmen, Namensänderungen und saisonale Extras." },
];

const COSMETIC_DEFINITIONS = Object.freeze({
  avatars: Object.freeze([
    { id: "vault-core", symbol: "◈", tone: "gold", price: 0, label: { de: "Kernsigille", en: "Core Sigil", fr: "Sigille centrale" }, description: { de: "Der ruhige Startpunkt für jedes Profil.", en: "The calm starting point for every profile.", fr: "Le point de départ calme de chaque profil." } },
    { id: "ember-mask", symbol: "✦", tone: "ember", price: 180, label: { de: "Glutmaske", en: "Ember Mask", fr: "Masque de braise" }, description: { de: "Warmer Glanz mit offensivem Einschlag.", en: "Warm glow with an aggressive edge.", fr: "Une lueur chaude à l'allure offensive." } },
    { id: "mist-orb", symbol: "◌", tone: "aqua", price: 180, label: { de: "Nebelorb", en: "Mist Orb", fr: "Orbe de brume" }, description: { de: "Sanfter Fokus für kontrollierte Decks.", en: "Soft focus for controlled decks.", fr: "Un accent doux pour les decks de contrôle." } },
    { id: "thorn-mark", symbol: "✿", tone: "verdant", price: 180, label: { de: "Dornenmarke", en: "Thorn Mark", fr: "Marque d'épine" }, description: { de: "Naturverbunden und ruhig, aber zäh.", en: "Nature-bound, calm and resilient.", fr: "Ancrée dans la nature, calme et tenace." } },
    { id: "storm-eye", symbol: "⚡", tone: "sky", price: 260, label: { de: "Sturmauge", en: "Storm Eye", fr: "Œil de tempête" }, description: { de: "Direkt, schnell und voller Spannung.", en: "Direct, fast and full of tension.", fr: "Direct, rapide et chargé d'énergie." } },
    { id: "rune-disc", symbol: "⌘", tone: "steel", price: 260, label: { de: "Runenscheibe", en: "Rune Disc", fr: "Disque runique" }, description: { de: "Klare Linien für strategische Spieler.", en: "Clean lines for strategic players.", fr: "Des lignes nettes pour les joueurs stratégiques." } },
    { id: "astral-iris", symbol: "✺", tone: "violet", price: 420, label: { de: "Astraliris", en: "Astral Iris", fr: "Iris astral" }, description: { de: "Leuchtender Fokus für seltene Sammlungen.", en: "Radiant focus for rare collections.", fr: "Un éclat lumineux pour les collections rares." } },
    { id: "mythic-crown", symbol: "✹", tone: "rainbow", price: 620, label: { de: "Mythenkrone", en: "Mythic Crown", fr: "Couronne mythique" }, description: { de: "Ein prunkvoller Blickfang für Spitzenprofile.", en: "A lavish centerpiece for top-tier profiles.", fr: "Une pièce maîtresse fastueuse pour les grands profils." } },
  ]),
  frames: Object.freeze([
    { id: "bronze-sigil", symbol: "▣", tone: "gold", price: 0, label: { de: "Bronzerahmen", en: "Bronze Frame", fr: "Cadre bronze" }, description: { de: "Sauberer Standardrahmen für den Start.", en: "Clean standard frame for the beginning.", fr: "Cadre standard propre pour débuter." } },
    { id: "silver-sigil", symbol: "⬒", tone: "steel", price: 170, label: { de: "Silberrahmen", en: "Silver Frame", fr: "Cadre argent" }, description: { de: "Kühler Metall-Look mit mehr Kontrast.", en: "Cool metallic look with stronger contrast.", fr: "Un style métallique froid avec plus de contraste." } },
    { id: "verdant-ring", symbol: "⬡", tone: "verdant", price: 210, label: { de: "Wurzelring", en: "Verdant Ring", fr: "Anneau verdoyant" }, description: { de: "Sanfte Naturfarben rund um dein Profil.", en: "Soft natural tones around your profile.", fr: "Des teintes naturelles douces autour de ton profil." } },
    { id: "ember-edge", symbol: "◧", tone: "ember", price: 250, label: { de: "Glutkante", en: "Ember Edge", fr: "Bord braise" }, description: { de: "Glühende Kante für aggressive Auftritte.", en: "Burning edge for aggressive presences.", fr: "Une bordure ardente pour une présence agressive." } },
    { id: "storm-crest", symbol: "◨", tone: "sky", price: 250, label: { de: "Sturmkranz", en: "Storm Crest", fr: "Couronne d'orage" }, description: { de: "Luftiger Rahmen mit heller Energie.", en: "Airy frame with bright energy.", fr: "Cadre aérien traversé d'énergie claire." } },
    { id: "void-trace", symbol: "◇", tone: "void", price: 360, label: { de: "Schattenzug", en: "Void Trace", fr: "Trace du vide" }, description: { de: "Dunkler Kontrast mit stiller Präsenz.", en: "Dark contrast with quiet presence.", fr: "Contraste sombre avec une présence discrète." } },
    { id: "aurora-prism", symbol: "⬢", tone: "aqua", price: 520, label: { de: "Auroraprisma", en: "Aurora Prism", fr: "Prisme d'aurore" }, description: { de: "Schillernde Linien für Sammlerprofile.", en: "Shifting lines for collector profiles.", fr: "Des lignes irisées pour les profils de collection." } },
    { id: "transcendent-halo", symbol: "✧", tone: "rainbow", price: 760, label: { de: "Transzendenz-Halo", en: "Transcendent Halo", fr: "Halo transcendant" }, description: { de: "Der höchste Rahmen mit prismatischer Aura.", en: "The highest frame with a prismatic aura.", fr: "Le cadre ultime avec une aura prismatique." } },
  ]),
  titles: Object.freeze([
    { id: "vault-initiate", tone: "gold", price: 0, label: { de: "Tresor-Novize", en: "Vault Initiate", fr: "Novice du coffre" }, description: { de: "Der erste Titel für neue Konten.", en: "The first title for new accounts.", fr: "Le premier titre des nouveaux comptes." } },
    { id: "market-runner", tone: "steel", price: 90, label: { de: "Marktläufer", en: "Market Runner", fr: "Coureur du marché" }, description: { de: "Für Spieler, die jede Runde Preise scannen.", en: "For players who scan prices every round.", fr: "Pour les joueurs qui scrutent les prix à chaque rotation." } },
    { id: "pack-hunter", tone: "gold", price: 120, label: { de: "Siegeljäger", en: "Seal Hunter", fr: "Chasseur de sceaux" }, description: { de: "Booster zuerst, Fragen später.", en: "Boosters first, questions later.", fr: "Les boosters d'abord, les questions ensuite." } },
    { id: "arena-scout", tone: "sky", price: 160, label: { de: "Arenakundschafter", en: "Arena Scout", fr: "Éclaireur de l'arène" }, description: { de: "Für erste Freundesduelle und Testkämpfe.", en: "For first friend duels and test fights.", fr: "Pour les premiers duels amicaux et matchs de test." } },
    { id: "ember-tactician", tone: "ember", price: 180, label: { de: "Gluttaktiker", en: "Ember Tactician", fr: "Tacticien des braises" }, description: { de: "Hart am Brett, ruhig im Plan.", en: "Hard on the board, calm in the plan.", fr: "Dur sur le plateau, calme dans le plan." } },
    { id: "mist-duelist", tone: "aqua", price: 180, label: { de: "Nebelduellant", en: "Mist Duelist", fr: "Duelliste des brumes" }, description: { de: "Für kontrollierte Züge und saubere Antworten.", en: "For measured turns and clean answers.", fr: "Pour les tours mesurés et les réponses propres." } },
    { id: "thorn-warden", tone: "verdant", price: 240, label: { de: "Dornenwächter", en: "Thorn Warden", fr: "Gardien des épines" }, description: { de: "Bleibt stehen, wenn andere schon kippen.", en: "Still stands when others already fall.", fr: "Reste debout quand les autres chutent déjà." } },
    { id: "rune-architect", tone: "steel", price: 240, label: { de: "Runenarchitekt", en: "Rune Architect", fr: "Architecte runique" }, description: { de: "Decks werden gebaut, nicht nur gespielt.", en: "Decks are built, not just played.", fr: "Les decks se construisent, pas seulement se jouent." } },
    { id: "market-oracle", tone: "gold", price: 300, label: { de: "Marktorakel", en: "Market Oracle", fr: "Oracle du marché" }, description: { de: "Sieht Preiswellen vor allen anderen.", en: "Sees price waves before everyone else.", fr: "Voit les vagues du marché avant tout le monde." } },
    { id: "vault-master", tone: "violet", price: 420, label: { de: "Projekt-Vault-Meister", en: "Projekt Vault Master", fr: "Maître de Projekt Vault" }, description: { de: "Ein Titel für große Sammlungen und klare Übersicht.", en: "A title for large collections and sharp oversight.", fr: "Un titre pour les grandes collections et la vision nette." } },
    { id: "myth-bearer", tone: "rainbow", price: 560, label: { de: "Mythenträger", en: "Myth Bearer", fr: "Porte-mythe" }, description: { de: "Trägt seltene Züge mit Stil.", en: "Carries rare plays with style.", fr: "Porte les coups rares avec style." } },
    { id: "transcendent-scion", tone: "rainbow", price: 780, label: { de: "Transzendenten-Erbe", en: "Transcendent Scion", fr: "Héritier transcendant" }, description: { de: "Die höchste Shop-Auszeichnung für dein Profil.", en: "The highest shop honor for your profile.", fr: "La plus haute distinction de boutique pour ton profil." } },
  ]),
});

const SHOP_TAB_DEFINITIONS = Object.freeze({
  boosters: Object.freeze({
    id: "boosters",
    headingKey: "shop.tabHeadingBoosters",
    noteKey: "shop.tabNoteBoosters",
    summaryTitleKey: "shop.summaryTitleBoosters",
  }),
  packs: Object.freeze({
    id: "packs",
    headingKey: "shop.tabHeadingPacks",
    noteKey: "shop.tabNotePacks",
    summaryTitleKey: "shop.summaryTitlePacks",
  }),
  cosmetics: Object.freeze({
    id: "cosmetics",
    headingKey: "shop.tabHeadingCosmetics",
    noteKey: "shop.tabNoteCosmetics",
    summaryTitleKey: "shop.summaryTitleCosmetics",
  }),
});

const SHOP_BUNDLE_TIER_DEFINITIONS = Object.freeze([
  Object.freeze({
    id: "scout",
    price: 220,
    boosters: [{ packId: "starter", amount: 2 }],
    guaranteedRules: [
      { rarities: ["common"], count: 1, type: "unit", sort: "cost-asc" },
      { rarities: ["common"], count: 1, sort: "cost-asc" },
      { rarities: ["rare"], count: 1, sort: "cost-asc" },
    ],
  }),
  Object.freeze({
    id: "battle",
    price: 430,
    boosters: [{ packId: "starter", amount: 1 }, { packId: "market", amount: 1 }],
    guaranteedRules: [
      { rarities: ["rare"], count: 1, type: "unit", sort: "cost-asc" },
      { rarities: ["rare"], count: 1 },
      { rarities: ["epic"], count: 1 },
      { rarities: ["rare", "epic"], count: 1, types: ["spell", "trainer"] },
    ],
  }),
  Object.freeze({
    id: "command",
    price: 760,
    boosters: [{ packId: "market", amount: 1 }, { packId: "champion", amount: 1 }],
    guaranteedRules: [
      { rarities: ["epic"], count: 1, type: "unit" },
      { rarities: ["epic"], count: 1 },
      { rarities: ["legendary"], count: 1 },
      { rarities: ["rare", "epic", "legendary"], count: 1, types: ["spell", "trainer"] },
    ],
  }),
  Object.freeze({
    id: "vault",
    price: 1180,
    boosters: [{ packId: "champion", amount: 1 }, { packId: "relic", amount: 1 }],
    guaranteedRules: [
      { rarities: ["legendary"], count: 1 },
      { rarities: ["ultra"], count: 1 },
      { rarities: ["epic", "legendary"], count: 1, type: "unit" },
      { rarities: ["epic", "legendary", "ultra"], count: 1, types: ["spell", "trainer"] },
      { rarities: ["rare", "epic"], count: 1, sort: "cost-desc" },
    ],
  }),
  Object.freeze({
    id: "apex",
    price: 1680,
    boosters: [{ packId: "relic", amount: 1 }, { packId: "astral", amount: 1 }],
    guaranteedRules: [
      { rarities: ["transcendent", "mythic"], count: 1 },
      { rarities: ["ultra"], count: 1 },
      { rarities: ["legendary"], count: 1 },
      { rarities: ["epic"], count: 1 },
      { rarities: ["legendary", "ultra", "mythic", "transcendent"], count: 1, types: ["spell", "trainer"] },
    ],
  }),
]);

const LEGACY_CARDS = [
  createLegacyCard("glutfuchs", "Glutfuchs", "glutorden", "unit", "common", 1, 2, 1, { kind: "damageHero", value: 1 }),
  createLegacyCard("messingwache", "Messingwache", "glutorden", "unit", "common", 2, 1, 4, { kind: "fortifyBoard", value: 1 }),
  createLegacyCard("ascheritter", "Ascheritter", "glutorden", "unit", "rare", 4, 5, 3, { kind: "damageHero", value: 2 }),
  createLegacyCard("sonnenofen-tyrann", "Sonnenofen-Tyrann", "glutorden", "unit", "ultra", 7, 8, 8, [{ kind: "buffBoard", attack: 2, health: 1 }, { kind: "readyStrongest", attackBonus: 1 }], ["charge"]),
  createLegacyCard("nebelschleicher", "Nebelschleicher", "nebelchor", "unit", "common", 2, 3, 2, { kind: "draw", value: 1 }),
  createLegacyCard("riffseher", "Riffseher", "nebelchor", "trainer", "common", 2, null, null, { kind: "healHero", value: 3 }),
  createLegacyCard("abgrund-orakel", "Abgrund-Orakel", "nebelchor", "unit", "epic", 5, 4, 6, { kind: "draw", value: 2 }),
  createLegacyCard("sturm-leviathan", "Sturm-Leviathan", "nebelchor", "unit", "mythic", 9, 10, 10, [{ kind: "strikeWeakest", value: 5 }, { kind: "damageAllEnemies", value: 2 }], ["regen"]),
  createLegacyCard("hainhüter", "Hainhüter", "wurzelpakt", "unit", "common", 1, 1, 3, { kind: "healHero", value: 2 }),
  createLegacyCard("dornenhetzer", "Dornenhetzer", "wurzelpakt", "unit", "rare", 3, 4, 3, { kind: "buffBoard", attack: 1, health: 0 }),
  createLegacyCard("hirschältester", "Hirschältester", "wurzelpakt", "unit", "epic", 6, 6, 7, { kind: "fortifyBoard", value: 2 }),
  createLegacyCard("wildblüten-avatar", "Wildblüten-Avatar", "wurzelpakt", "unit", "legendary", 7, 7, 9, [{ kind: "healHero", value: 5 }, { kind: "healBoard", value: 3 }], ["guard", "regen"]),
  createLegacyCard("nachtvagant", "Nachtvagant", "schattenzirkel", "unit", "common", 2, 2, 3, { kind: "strikeWeakest", value: 1 }),
  createLegacyCard("schleier-assassine", "Schleier-Assassine", "schattenzirkel", "unit", "rare", 4, 6, 2, { kind: "damageHero", value: 3 }),
  createLegacyCard("mondarchivar", "Mondarchivar", "schattenzirkel", "trainer", "epic", 4, null, null, [{ kind: "draw", value: 2 }, { kind: "weakenEnemies", value: 1 }]),
  createLegacyCard("finsternis-kaiserin", "Finsternis-Kaiserin", "schattenzirkel", "unit", "legendary", 8, 8, 8, [{ kind: "strikeWeakest", value: 4 }, { kind: "drainHero", damage: 3, heal: 3 }], ["lifesteal"]),
];

const TRANSCENDENT_CARDS = [
  createLegacyCard("himmelsbrand-apotheose", "Himmelsbrand-Apotheose", "glutorden", "unit", "transcendent", 10, 13, 12, [{ kind: "damageHero", value: 8 }, { kind: "damageAllEnemies", value: 3 }], ["charge", "lifesteal"]),
  createLegacyCard("ozeanherz-paradoxon", "Ozeanherz-Paradoxon", "nebelchor", "spell", "transcendent", 9, null, null, [{ kind: "draw", value: 4 }, { kind: "healBoard", value: 5 }]),
  createLegacyCard("weltenwurzel-inkarnation", "Weltenwurzel-Inkarnation", "wurzelpakt", "unit", "transcendent", 10, 11, 15, [{ kind: "fortifyBoard", value: 4 }, { kind: "healBoard", value: 5 }], ["guard", "regen"]),
  createLegacyCard("nullschleier-souverän", "Nullschleier-Souverän", "schattenzirkel", "trainer", "transcendent", 9, null, null, [{ kind: "strikeWeakest", value: 7 }, { kind: "weakenEnemies", value: 2 }]),
  createLegacyCard("donnerkrone-primarch", "Donnerkrone-Primarch", "sturmwacht", "unit", "transcendent", 10, 14, 11, [{ kind: "readyStrongest", attackBonus: 2 }, { kind: "buffBoard", attack: 4, health: 2 }], ["charge", "guard"]),
  createLegacyCard("erstformel-kathedrale", "Erstformel-Kathedrale", "runenschmiede", "spell", "transcendent", 9, null, null, [{ kind: "gainMaxMana", value: 2 }, { kind: "draw", value: 3 }]),
  createLegacyCard("astralrichterin-elysion", "Astralrichterin Elysion", "sternenhof", "trainer", "transcendent", 9, null, null, [{ kind: "healBoard", value: 6 }, { kind: "draw", value: 2 }]),
  createLegacyCard("grabstern-archon", "Grabstern-Archon", "knochenbund", "unit", "transcendent", 10, 12, 13, [{ kind: "strikeWeakest", value: 8 }, { kind: "drainHero", damage: 5, heal: 5 }], ["lifesteal", "guard"]),
];

const SINGULAR_CARDS = [
  createLegacyCard("glutthron-absolut", "Glutthron-Absolut", "glutorden", "unit", "singular", 10, 13, 12, [{ kind: "damageAllEnemies", value: 4 }, { kind: "damageHero", value: 5 }], ["charge"]),
  createLegacyCard("ozeanauge-singular", "Ozeanauge-Singular", "nebelchor", "spell", "singular", 10, null, null, [{ kind: "draw", value: 4 }, { kind: "healBoard", value: 6 }, { kind: "freezeWeakest", turns: 2 }]),
  createLegacyCard("urhain-ewigkern", "Urhain-Ewigkern", "wurzelpakt", "unit", "singular", 10, 11, 16, [{ kind: "fortifyBoard", value: 4 }, { kind: "healBoard", value: 5 }], ["guard", "regen"]),
  createLegacyCard("nullgesetz-omega", "Nullgesetz-Omega", "schattenzirkel", "trainer", "singular", 10, null, null, [{ kind: "strikeWeakest", value: 8 }, { kind: "weakenEnemies", value: 2 }, { kind: "draw", value: 1 }]),
  createLegacyCard("sturmkrone-apex", "Sturmkrone-Apex", "sturmwacht", "unit", "singular", 10, 14, 11, [{ kind: "readyStrongest", attackBonus: 3 }, { kind: "buffBoard", attack: 3, health: 2 }], ["charge", "guard"]),
  createLegacyCard("runenherz-singularität", "Runenherz-Singularität", "runenschmiede", "spell", "singular", 10, null, null, [{ kind: "gainMaxMana", value: 2 }, { kind: "draw", value: 3 }, { kind: "damageAllEnemies", value: 2 }]),
  createLegacyCard("sternensiegel-prisma", "Sternensiegel-Prisma", "sternenhof", "trainer", "singular", 10, null, null, [{ kind: "healBoard", value: 7 }, { kind: "draw", value: 2 }, { kind: "barrierStrongest" }]),
  createLegacyCard("knochenhimmel-archiv", "Knochenhimmel-Archiv", "knochenbund", "unit", "singular", 10, 12, 14, [{ kind: "strikeWeakest", value: 8 }, { kind: "drainHero", damage: 5, heal: 5 }], ["lifesteal", "guard"]),
  createLegacyCard("solariax-chorherrscher", "Solariax-Chorherrscher", "sonnenchor", "unit", "singular", 10, 12, 14, [{ kind: "healHero", value: 6 }, { kind: "fortifyBoard", value: 3 }], ["guard", "regen"]),
  createLegacyCard("leerenriss-edikt", "Leerenriss-Edikt", "leerenpakt", "spell", "singular", 10, null, null, [{ kind: "damageHero", value: 6 }, { kind: "freezeWeakest", turns: 2 }, { kind: "weakenEnemies", value: 2 }]),
  createLegacyCard("prismakanzler-ultimativ", "Prismakanzler-Ultimativ", "kristallrat", "trainer", "singular", 10, null, null, [{ kind: "draw", value: 3 }, { kind: "barrierStrongest" }, { kind: "gainMaxMana", value: 1 }]),
  createLegacyCard("dämmerpakt-origin", "Dämmerpakt-Origin", "dämmerbund", "unit", "singular", 10, 11, 13, [{ kind: "strikeWeakest", value: 6 }, { kind: "drainHero", damage: 4, heal: 4 }], ["lifesteal", "charge"]),
  createLegacyCard("wildjagd-endzeichen", "Wildjagd-Endzeichen", "wildjagd", "unit", "singular", 10, 13, 10, [{ kind: "readyStrongest", attackBonus: 2 }, { kind: "damageHero", value: 4 }], ["charge"]),
];

function createTokenCard(id, name, faction, attack, health, keywords = []) {
  return {
    id,
    name,
    faction,
    type: "unit",
    rarity: "common",
    cost: 0,
    attack,
    health,
    effect: null,
    keywords,
    synergy: null,
    timing: null,
    deathEffect: null,
    isToken: true,
    description: "Beschworene Token-Einheit.",
  };
}

/*

  const poisonWeakestEnemy = (owner, value, turns, sourceName) => {
    const target = selectWeakestUnit(getAttackableEnemyUnits(owner));
    if (!target) {
      addLog(`${sourceName} findet kein Ziel für Gift.`);
      return;
    }
    addStatusToUnit(target, { kind: "poison", value, turns }, sourceName);
  };

  const summonFactionTokens = (owner, tokenId, amount, sourceName) => {
    const actor = uiState.match[owner];
    const token = getCard(tokenId);
    const summonCount = Math.min(amount, Math.max(0, APP_CONFIG.boardSize - actor.board.length));

    if (!token || summonCount <= 0) {
      addLog(`${sourceName} hat keinen freien Platz für Beschwörungen.`);
      return;
    }

    for (let index = 0; index < summonCount; index += 1) {
      actor.board.push(createBattleUnit(token));
    }
    addLog(`${sourceName} beschwört ${summonCount}× ${token.name}.`);
  };

  damageAllEnemies = function damageAllEnemies(owner, value, sourceName) {
    const enemySide = owner === "player" ? "enemy" : "player";
    const enemy = uiState.match[enemySide];
    if (!enemy.board.length) {
      dealDamageToHero(enemySide, value, `${sourceName} trifft mangels Feldzielen den Helden`);
      return;
    }
    enemy.board.forEach((unit) => {
      dealDamageToUnit(unit, value, `${sourceName} trifft ${getCard(unit.cardId).name}`, enemySide);
    });
  };

  burnWeakestEnemy = function burnWeakestEnemy(owner, value, turns, sourceName) {
    const enemySide = owner === "player" ? "enemy" : "player";
    const target = selectWeakestUnit(getAttackableEnemyUnits(owner));
    if (!target) {
      dealDamageToHero(enemySide, value, `${sourceName} verbrennt mangels Ziel den Helden`);
      return;
    }
    addStatusToUnit(target, { kind: "burn", value, turns }, sourceName);
  };

  applySingleEffect = function applySingleEffect(effect, owner, sourceName) {
    const match = uiState.match;
    const actor = match[owner];
    const enemySide = owner === "player" ? "enemy" : "player";

    switch (effect.kind) {
      case "damageHero":
        dealDamageToHero(enemySide, effect.value, `${sourceName} verursacht direkten Schaden`);
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
      case "gainMaxMana":
        actor.maxMana = Math.min(APP_CONFIG.maxMana, actor.maxMana + effect.value);
        actor.mana = Math.min(actor.maxMana, actor.mana + effect.value);
        addLog(`${sourceName} erweitert dein Mana dauerhaft um ${effect.value}.`);
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
      case "healBoard":
        actor.board.forEach((unit) => {
          unit.health = Math.min(unit.maxHealth, unit.health + effect.value);
        });
        actor.hero += effect.value;
        addLog(`${sourceName} erneuert dein Feld und heilt ${effect.value}.`);
        break;
      case "strikeWeakest":
        strikeWeakestEnemy(owner, effect.value, sourceName);
        break;
      case "damageAllEnemies":
        damageAllEnemies(owner, effect.value, sourceName);
        break;
      case "burnWeakest":
        burnWeakestEnemy(owner, effect.value, effect.turns, sourceName);
        break;
      case "freezeWeakest":
        freezeWeakestEnemy(owner, effect.turns, sourceName);
        break;
      case "poisonWeakest":
        poisonWeakestEnemy(owner, effect.value, effect.turns, sourceName);
        break;
      case "barrierStrongest":
        barrierStrongestAlly(owner, sourceName);
        break;
      case "barrierHero":
        addHeroBarrier(owner, effect.value, sourceName);
        break;
      case "summonTokens":
        summonFactionTokens(owner, effect.tokenId, effect.amount, sourceName);
        break;
      case "weakenEnemies":
        weakenEnemyBoard(owner, effect.value, sourceName);
        break;
      case "drainHero": {
        const dealt = dealDamageToHero(enemySide, effect.damage, `${sourceName} entzieht dem Helden Leben`);
        const heal = Math.min(effect.heal, dealt || 0);
        if (heal > 0) {
          actor.hero += heal;
          addLog(`${sourceName} heilt ${heal} Lebenspunkte.`);
        }
        break;
      }
      case "readyStrongest":
        readyStrongestAlly(owner, effect.attackBonus || 0, sourceName);
        break;
      case "empowerUnit":
        empowerNewestAlly(owner, effect.attack, effect.health, sourceName);
        break;
      default:
        break;
    }
  };

  getSecondaryEffectPool = function getSecondaryEffectPool(type) {
    const pools = {
      unit: ["empowerUnit", "readyStrongest", "draw", "healHero", "buffBoard", "fortifyBoard", "burnWeakest", "barrierStrongest", "poisonWeakest", "summonTokens", "barrierHero"],
      spell: ["draw", "gainMana", "weakenEnemies", "damageHero", "healBoard", "gainMaxMana", "freezeWeakest", "burnWeakest", "poisonWeakest", "summonTokens", "barrierHero"],
      trainer: ["buffBoard", "healBoard", "gainMaxMana", "draw", "readyStrongest", "healHero", "barrierStrongest", "barrierHero", "summonTokens"],
    };
    return pools[type];
  };

  createEffectPayload = function createEffectPayload(kind, rarity, type, seed, factionId = null) {
    const rank = RARITY_ORDER.indexOf(rarity);
    switch (kind) {
      case "damageHero":
        return { kind, value: 1 + Math.floor((rank + Number(type !== "unit")) / 2) + Number(rank >= 5) };
      case "healHero":
        return { kind, value: 2 + Math.floor(rank / 2) + Number(type === "trainer") };
      case "draw":
        return { kind, value: Math.min(4, 1 + Number(rank >= 2) + Number(rank >= 5)) };
      case "gainMana":
        return { kind, value: Math.min(2, 1 + Number(rank >= 5)) };
      case "gainMaxMana":
        return { kind, value: Math.min(2, 1 + Number(rank >= 5)) };
      case "buffBoard":
        return { kind, attack: 1 + Number(rank >= 4), health: Number(rank >= 3) + Number(rank >= 6) };
      case "fortifyBoard":
        return { kind, value: 1 + Math.floor(rank / 3) + Number(rank >= 6) };
      case "strikeWeakest":
        return { kind, value: 1 + Math.floor(rank / 2) + Number(type === "spell") + Number(rank >= 6) };
      case "damageAllEnemies":
        return { kind, value: 1 + Math.floor(rank / 3) + Number(type === "spell" && rank >= 5) };
      case "burnWeakest":
        return { kind, value: 1 + Math.floor(rank / 3), turns: 2 + Number(rank >= 5) };
      case "freezeWeakest":
        return { kind, turns: 1 + Number(rank >= 5) };
      case "poisonWeakest":
        return { kind, value: 1 + Number(rank >= 5), turns: 2 + Number(rank >= 4) };
      case "barrierStrongest":
        return { kind };
      case "barrierHero":
        return { kind, value: 3 + Math.floor(rank / 2) + Number(type === "trainer") };
      case "summonTokens":
        return { kind, tokenId: TOKEN_IDS_BY_FACTION[factionId], amount: 1 + Number(rank >= 5) };
      case "healBoard":
        return { kind, value: 2 + Math.floor(rank / 2) };
      case "weakenEnemies":
        return { kind, value: 1 + Number(rank >= 4) };
      case "drainHero": {
        const damage = 1 + Math.floor((rank + Number(type !== "unit")) / 2) + Number(rank >= 6);
        return { kind, damage, heal: Math.max(1, Math.ceil(damage / 2)) };
      }
      case "readyStrongest":
        return { kind, attackBonus: Number(rank >= 4) + Number(rank >= 6) };
      case "empowerUnit":
        return { kind, attack: 1 + Number(rank >= 2) + Number(rank >= 5), health: 1 + Number(rank >= 4) };
      default:
        return { kind: "none" };
    }
  };

  const EXTENDED_EFFECT_TRANSLATIONS = {
    strikeStrongest: { de: "Stärkeschlag", en: "Power strike", fr: "Frappe majeure" },
    healWeakestAlly: { de: "Rettung", en: "Rescue", fr: "Secours" },
    cleanseAllies: { de: "Reinigung", en: "Cleanse", fr: "Purification" },
    barrierAllies: { de: "Feldbarriere", en: "Field barrier", fr: "Barrière de ligne" },
    sapMana: { de: "Manaentzug", en: "Mana drain", fr: "Drain de mana" },
    millEnemy: { de: "Deckbruch", en: "Deck break", fr: "Brèche du deck" },
    drainStrongest: { de: "Seelenraub", en: "Soul drain", fr: "Drain d'âme" },
    burnAllEnemies: { de: "Feuersturm", en: "Firestorm", fr: "Tempête de feu" },
    freezeStrongest: { de: "Eisgriff", en: "Ice grasp", fr: "Étreinte glacée" },
    poisonAllEnemies: { de: "Seuchenhauch", en: "Peste de champ", fr: "Souffle pestiféré" },
  };

  const getExtendedEffectText = (kind) => {
    const labels = EXTENDED_EFFECT_TRANSLATIONS[kind];
    if (!labels) {
      return null;
    }
    return getCurrentLanguage() === "fr" ? labels.fr : getCurrentLanguage() === "en" ? labels.en : labels.de;
  };

  const formatLocalizedTurns = (turns) => {
    if (getCurrentLanguage() === "fr") {
      return turns > 1 ? `${turns} tours` : `${turns} tour`;
    }
    if (getCurrentLanguage() === "en") {
      return turns > 1 ? `${turns} turns` : `${turns} turn`;
    }
    return turns > 1 ? `${turns} Runden` : `${turns} Runde`;
  };

  const baseGetSecondaryEffectPool = getSecondaryEffectPool;
  getSecondaryEffectPool = function getSecondaryEffectPool(type) {
    const basePool = baseGetSecondaryEffectPool(type) || [];
    const extension = {
      unit: ["strikeStrongest", "healWeakestAlly", "cleanseAllies", "barrierAllies", "drainStrongest", "burnAllEnemies", "freezeStrongest", "poisonAllEnemies"],
      spell: ["strikeStrongest", "sapMana", "millEnemy", "drainStrongest", "burnAllEnemies", "freezeStrongest", "poisonAllEnemies", "barrierAllies", "cleanseAllies"],
      trainer: ["healWeakestAlly", "cleanseAllies", "barrierAllies", "sapMana", "millEnemy", "strikeStrongest", "drainStrongest"],
    };
    return uniqueValues([...basePool, ...(extension[type] || [])]);
  };

  const baseCreateEffectPayload = createEffectPayload;
  createEffectPayload = function createEffectPayload(kind, rarity, type, seed, factionId = null) {
    const rank = Math.max(0, RARITY_ORDER.indexOf(rarity));
    switch (kind) {
      case "strikeStrongest":
        return { kind, value: 1 + Math.floor(rank / 2) + Number(type === "spell") + Number(rank >= 6) };
      case "healWeakestAlly":
        return { kind, value: 2 + Math.floor(rank / 2) + Number(type === "trainer") + Number(rank >= 7) };
      case "cleanseAllies":
        return { kind, heal: Number(rank >= 4) + Number(rank >= 7) };
      case "barrierAllies":
        return { kind, heroShield: Number(rank >= 5) };
      case "sapMana":
        return { kind, value: Math.min(2, 1 + Number(rank >= 6)) };
      case "millEnemy":
        return { kind, amount: Math.min(3, 1 + Number(rank >= 3) + Number(rank >= 6)) };
      case "drainStrongest": {
        const damage = 2 + Math.floor(rank / 2) + Number(type !== "unit") + Number(rank >= 7);
        return { kind, damage, heal: Math.max(1, Math.ceil(damage / 2)) };
      }
      case "burnAllEnemies":
        return { kind, value: 1 + Number(rank >= 4), turns: 1 + Number(rank >= 6) };
      case "freezeStrongest":
        return { kind, turns: 1 + Number(rank >= 6) };
      case "poisonAllEnemies":
        return { kind, value: 1 + Number(rank >= 6), turns: 2 + Number(rank >= 4) };
      default:
        return baseCreateEffectPayload(kind, rarity, type, seed, factionId);
    }
  };

  const baseApplySingleEffect = applySingleEffect;
  applySingleEffect = function applySingleEffect(effect, owner, sourceName) {
    const match = uiState.match;
    const actor = match?.[owner];
    const enemySide = owner === "player" ? "enemy" : "player";
    const enemy = match?.[enemySide];
    if (!effect || !actor || !enemy) {
      return baseApplySingleEffect(effect, owner, sourceName);
    }

    switch (effect.kind) {
      case "strikeStrongest": {
        const target = selectStrongestUnit(getAttackableEnemyUnits(owner));
        if (!target) {
          enemy.hero -= effect.value;
          addLog(`${sourceName} trifft mangels Feldzielen den Helden für ${effect.value}.`);
          return;
        }
        dealDamageToUnit(target, effect.value, `${sourceName} trifft ${getCard(target.cardId).name}`, enemySide);
        return;
      }
      case "healWeakestAlly": {
        const damaged = actor.board.filter((unit) => unit.health < unit.maxHealth);
        const target = selectWeakestUnit(damaged.length ? damaged : actor.board);
        if (!target) {
          actor.hero += effect.value;
          addLog(`${sourceName} heilt den Helden um ${effect.value}.`);
          return;
        }
        target.health = Math.min(target.maxHealth, target.health + effect.value);
        addLog(`${sourceName} heilt ${getCard(target.cardId).name} um ${effect.value}.`);
        return;
      }
      case "cleanseAllies": {
        const removable = new Set(["burn", "freeze", "poison"]);
        let cleaned = 0;
        actor.board.forEach((unit) => {
          const before = unit.statuses?.length || 0;
          unit.statuses = (unit.statuses || []).filter((status) => !removable.has(status.kind));
          if ((unit.statuses?.length || 0) !== before) {
            cleaned += 1;
          }
          if (effect.heal) {
            unit.health = Math.min(unit.maxHealth, unit.health + effect.heal);
          }
        });
        if (!actor.board.length) {
          actor.hero += Math.max(1, effect.heal || 0);
          addLog(`${sourceName} stabilisiert mangels Feld den Helden.`);
          return;
        }
        addLog(cleaned
          ? `${sourceName} reinigt ${cleaned} eigene Einheit${cleaned > 1 ? "en" : ""}.`
          : `${sourceName} stärkt dein Feld ohne negative Zustände zu entfernen.`);
        return;
      }
      case "barrierAllies": {
        if (!actor.board.length) {
          actor.heroBarrier += Math.max(1, effect.heroShield || 1);
          addLog(`${sourceName} schützt mangels Feld den Helden mit Schild.`);
          return;
        }
        actor.board.forEach((unit) => addStatusToUnit(unit, { kind: "barrier" }, sourceName));
        if (effect.heroShield) {
          actor.heroBarrier += effect.heroShield;
        }
        addLog(`${sourceName} errichtet eine Barriere für dein Feld.`);
        return;
      }
      case "sapMana": {
        const reduced = Math.min(enemy.mana, effect.value);
        enemy.mana = Math.max(0, enemy.mana - effect.value);
        addLog(`${sourceName} entzieht dem Gegner ${reduced} Mana.`);
        return;
      }
      case "millEnemy": {
        const amount = Math.max(0, Math.min(effect.amount || 0, enemy.deck.length));
        if (!amount) {
          addLog(`${sourceName} findet kein gegnerisches Deck mehr zum Zerreiben.`);
          return;
        }
        enemy.deck.splice(0, amount);
        addLog(`${sourceName} wirft ${amount} Karte${amount > 1 ? "n" : ""} aus dem gegnerischen Deck ab.`);
        return;
      }
      case "drainStrongest": {
        const target = selectStrongestUnit(getAttackableEnemyUnits(owner));
        if (!target) {
          enemy.hero -= effect.damage;
          actor.hero += effect.heal;
          addLog(`${sourceName} entzieht dem Helden ${effect.damage} Leben und heilt ${effect.heal}.`);
          return;
        }
        dealDamageToUnit(target, effect.damage, `${sourceName} trifft ${getCard(target.cardId).name}`, enemySide);
        actor.hero += effect.heal;
        addLog(`${sourceName} heilt den eigenen Helden um ${effect.heal}.`);
        return;
      }
      case "burnAllEnemies": {
        if (!enemy.board.length) {
          enemy.hero -= effect.value;
          addLog(`${sourceName} verbrennt mangels Feldzielen den Helden für ${effect.value}.`);
          return;
        }
        enemy.board.forEach((unit) => addStatusToUnit(unit, { kind: "burn", value: effect.value, turns: effect.turns }, sourceName));
        return;
      }
      case "freezeStrongest": {
        const target = selectStrongestUnit(getAttackableEnemyUnits(owner));
        if (!target) {
          addLog(`${sourceName} findet kein Ziel für Eisgriff.`);
          return;
        }
        addStatusToUnit(target, { kind: "freeze", turns: effect.turns }, sourceName);
        return;
      }
      case "poisonAllEnemies": {
        if (!enemy.board.length) {
          addLog(`${sourceName} findet kein gegnerisches Feld für Gift.`);
          return;
        }
        enemy.board.forEach((unit) => addStatusToUnit(unit, { kind: "poison", value: effect.value, turns: effect.turns }, sourceName));
        return;
      }
      default:
        return baseApplySingleEffect(effect, owner, sourceName);
    }
  };

  const baseCreateCostForRarity = createCostForRarity;
  createCostForRarity = function createCostForRarity(rarity, index, type) {
    if (rarity !== "singular") {
      return baseCreateCostForRarity(rarity, index, type);
    }
    return Math.min(APP_CONFIG.maxMana, baseCreateCostForRarity("transcendent", index, type) + 1);
  };

  const baseCreateUnitStats = createUnitStats;
  createUnitStats = function createUnitStats(cost, rarity, index, factionIndex, keywords = [], title = "") {
    if (rarity !== "singular") {
      return baseCreateUnitStats(cost, rarity, index, factionIndex, keywords, title);
    }
    const transcendentStats = baseCreateUnitStats(cost, "transcendent", index, factionIndex, keywords, title);
    return {
      attack: transcendentStats.attack + 1,
      health: transcendentStats.health + 1,
    };
  };

  const baseBuildGeneratedCards = buildGeneratedCards;
  buildGeneratedCards = function buildGeneratedCards() {
    const cards = baseBuildGeneratedCards();
    const extraCards = [];
    const expandedUnitOffset = UNIT_TITLES.length + 2;
    const expandedSpellOffset = SPELL_TITLES.length + 3;
    const expandedTrainerOffset = TRAINER_TITLES.length + 4;
    const ascendantUnitOffset = expandedUnitOffset + EXPANDED_UNIT_TITLES.length + 5;
    const ascendantSpellOffset = expandedSpellOffset + EXPANDED_SPELL_TITLES.length + 7;
    const ascendantTrainerOffset = expandedTrainerOffset + EXPANDED_TRAINER_TITLES.length + 9;
    const eternalUnitOffset = ascendantUnitOffset + ASCENDANT_UNIT_TITLES.length + 11;
    const eternalSpellOffset = ascendantSpellOffset + ASCENDANT_SPELL_TITLES.length + 13;
    const eternalTrainerOffset = ascendantTrainerOffset + ASCENDANT_TRAINER_TITLES.length + 15;

    FACTIONS.forEach((faction, factionIndex) => {
      appendGeneratedUnitSet(extraCards, faction, factionIndex, ETERNAL_UNIT_TITLES, ETERNAL_UNIT_RARITIES, "einheit-ewig", eternalUnitOffset);
      appendGeneratedSpellSet(extraCards, faction, ETERNAL_SPELL_TITLES, ETERNAL_SPELL_RARITIES, "zauber-ewig", eternalSpellOffset);
      appendGeneratedTrainerSet(extraCards, faction, ETERNAL_TRAINER_TITLES, ETERNAL_TRAINER_RARITIES, "trainer-ewig", eternalTrainerOffset);
    });

    return [...cards, ...extraCards];
  };

  const baseGetLocalizedEffectBadgeLabel = getLocalizedEffectBadgeLabel;
  getLocalizedEffectBadgeLabel = function getLocalizedEffectBadgeLabel(kind) {
    return getExtendedEffectText(kind) || baseGetLocalizedEffectBadgeLabel(kind);
  };

  const baseGetLocalizedCompactEffect = getLocalizedCompactEffect;
  getLocalizedCompactEffect = function getLocalizedCompactEffect(effect) {
    switch (effect?.kind) {
      case "strikeStrongest":
        return getCurrentLanguage() === "fr" ? `Plus forte cible ${effect.value}` : getCurrentLanguage() === "en" ? `Strongest target ${effect.value}` : `Stärkstes Ziel ${effect.value}`;
      case "healWeakestAlly":
        return getCurrentLanguage() === "fr" ? `Allié faible +${effect.value}` : getCurrentLanguage() === "en" ? `Weak ally +${effect.value}` : `Schwacher Verb. +${effect.value}`;
      case "cleanseAllies":
        return getCurrentLanguage() === "fr" ? "Nettoie le champ" : getCurrentLanguage() === "en" ? "Cleanse field" : "Feld reinigen";
      case "barrierAllies":
        return getCurrentLanguage() === "fr" ? "Barrière pour le champ" : getCurrentLanguage() === "en" ? "Barrier for board" : "Barriere fürs Feld";
      case "sapMana":
        return getCurrentLanguage() === "fr" ? `Mana adverse -${effect.value}` : getCurrentLanguage() === "en" ? `Enemy mana -${effect.value}` : `Gegner -${effect.value} Mana`;
      case "millEnemy":
        return getCurrentLanguage() === "fr" ? `Défausse ${effect.amount}` : getCurrentLanguage() === "en" ? `Mill ${effect.amount}` : `Deck -${effect.amount}`;
      case "drainStrongest":
        return getCurrentLanguage() === "fr" ? `Drain ${effect.damage}/${effect.heal}` : getCurrentLanguage() === "en" ? `Drain ${effect.damage}/${effect.heal}` : `Entzug ${effect.damage}/${effect.heal}`;
      case "burnAllEnemies":
        return getCurrentLanguage() === "fr" ? `Tous brûlent ${effect.value}/${effect.turns}` : getCurrentLanguage() === "en" ? `All burn ${effect.value}/${effect.turns}` : `Alle Brand ${effect.value}/${effect.turns}`;
      case "freezeStrongest":
        return getCurrentLanguage() === "fr" ? `Gel ${effect.turns} tour` : getCurrentLanguage() === "en" ? `Freeze ${effect.turns} turn` : `Frost ${effect.turns} Runde`;
      case "poisonAllEnemies":
        return getCurrentLanguage() === "fr" ? `Tous poison ${effect.value}/${effect.turns}` : getCurrentLanguage() === "en" ? `All poison ${effect.value}/${effect.turns}` : `Alle Gift ${effect.value}/${effect.turns}`;
      default:
        return baseGetLocalizedCompactEffect(effect);
    }
  };

  const baseDescribeLocalizedEffect = describeLocalizedEffect;
  describeLocalizedEffect = function describeLocalizedEffect(type, effect, index = 0) {
    const opener = index === 0 ? (type === "unit" ? getUiText("card.onPlay") : getUiText("card.effect")) : getUiText("card.also");
    switch (effect?.kind) {
      case "strikeStrongest":
        return getCurrentLanguage() === "fr"
          ? `${opener} : frappe la plus forte unité ennemie ou le héros pour ${effect.value}.`
          : getCurrentLanguage() === "en"
            ? `${opener}: Hit the strongest enemy unit or the hero for ${effect.value}.`
            : `${opener}: Trifft die stärkste gegnerische Einheit oder den Helden für ${effect.value}.`;
      case "healWeakestAlly":
        return getCurrentLanguage() === "fr"
          ? `${opener} : soigne ton allié le plus affaibli de ${effect.value} ou le héros s'il n'y a pas d'unité.`
          : getCurrentLanguage() === "en"
            ? `${opener}: Heal your weakest ally for ${effect.value}, or the hero if no ally is in play.`
            : `${opener}: Heilt deinen schwächsten Verbündeten um ${effect.value} oder den Helden, falls kein Feld liegt.`;
      case "cleanseAllies":
        return getCurrentLanguage() === "fr"
          ? `${opener} : retire brûlure, gel et poison de tes alliés${effect.heal ? ` et leur rend ${effect.heal} vie` : ""}.`
          : getCurrentLanguage() === "en"
            ? `${opener}: Remove burn, freeze and poison from your allies${effect.heal ? ` and restore ${effect.heal} health` : ""}.`
            : `${opener}: Entfernt Brand, Frost und Gift von deinen Verbündeten${effect.heal ? ` und heilt sie um ${effect.heal}` : ""}.`;
      case "barrierAllies":
        return getCurrentLanguage() === "fr"
          ? `${opener} : donne une barrière à toutes tes unités${effect.heroShield ? ` et ${effect.heroShield} bouclier à ton héros` : ""}.`
          : getCurrentLanguage() === "en"
            ? `${opener}: Give all allied units a barrier${effect.heroShield ? ` and ${effect.heroShield} shield to your hero` : ""}.`
            : `${opener}: Gibt allen eigenen Einheiten eine Barriere${effect.heroShield ? ` und deinem Helden ${effect.heroShield} Schild` : ""}.`;
      case "sapMana":
        return getCurrentLanguage() === "fr"
          ? `${opener} : retire ${effect.value} mana au joueur adverse.`
          : getCurrentLanguage() === "en"
            ? `${opener}: Drain ${effect.value} mana from the opponent.`
            : `${opener}: Entzieht dem Gegner ${effect.value} Mana.`;
      case "millEnemy":
        return getCurrentLanguage() === "fr"
          ? `${opener} : défausse ${effect.amount} carte${effect.amount > 1 ? "s" : ""} du dessus du deck adverse.`
          : getCurrentLanguage() === "en"
            ? `${opener}: Mill ${effect.amount} card${effect.amount > 1 ? "s" : ""} from the top of the enemy deck.`
            : `${opener}: Wirft ${effect.amount} Karte${effect.amount > 1 ? "n" : ""} vom gegnerischen Deck ab.`;
      case "drainStrongest":
        return getCurrentLanguage() === "fr"
          ? `${opener} : inflige ${effect.damage} à l'unité ennemie la plus forte et te soigne de ${effect.heal}.`
          : getCurrentLanguage() === "en"
            ? `${opener}: Deal ${effect.damage} to the strongest enemy unit and heal for ${effect.heal}.`
            : `${opener}: Fügt der stärksten gegnerischen Einheit ${effect.damage} zu und heilt dich um ${effect.heal}.`;
      case "burnAllEnemies":
        return getCurrentLanguage() === "fr"
          ? `${opener} : applique brûlure à toutes les unités ennemies pendant ${formatLocalizedTurns(effect.turns)} (${effect.value} dégâts par tour).`
          : getCurrentLanguage() === "en"
            ? `${opener}: Burn all enemy units for ${formatLocalizedTurns(effect.turns)} (${effect.value} damage per turn).`
            : `${opener}: Belegt alle gegnerischen Einheiten für ${formatLocalizedTurns(effect.turns)} mit Brand (${effect.value} Schaden pro Zug).`;
      case "freezeStrongest":
        return getCurrentLanguage() === "fr"
          ? `${opener} : gèle la plus forte unité ennemie pendant ${formatLocalizedTurns(effect.turns)}.`
          : getCurrentLanguage() === "en"
            ? `${opener}: Freeze the strongest enemy unit for ${formatLocalizedTurns(effect.turns)}.`
            : `${opener}: Friert die stärkste gegnerische Einheit für ${formatLocalizedTurns(effect.turns)} ein.`;
      case "poisonAllEnemies":
        return getCurrentLanguage() === "fr"
          ? `${opener} : empoisonne toutes les unités ennemies pendant ${formatLocalizedTurns(effect.turns)} (${effect.value} dégâts en fin de tour).`
          : getCurrentLanguage() === "en"
            ? `${opener}: Poison all enemy units for ${formatLocalizedTurns(effect.turns)} (${effect.value} end-step damage).`
            : `${opener}: Vergiftet alle gegnerischen Einheiten für ${formatLocalizedTurns(effect.turns)} (${effect.value} Schaden am Zugende).`;
      default:
        return baseDescribeLocalizedEffect(type, effect, index);
    }
  };

  const basePlayPackOpeningSequence = playPackOpeningSequence;
  playPackOpeningSequence = function playPackOpeningSequence(cards, packId) {
    basePlayPackOpeningSequence(cards, packId);
    if (!elements.openingStage || !cards?.length || !getUserSettings().packEffects || getUserSettings().reducedMotion) {
      return;
    }
    const highestRarity = getHighestRarity(cards);
    if (highestRarity !== "singular") {
      return;
    }
    createFxPulse({
      theme: "booster-rare",
      x: window.innerWidth ? window.innerWidth * 0.66 : 820,
      y: 280,
      size: 340,
    });
  };

  getTitleBias = function getTitleBias(title) {
    const normalized = normalizeTitle(title);
    const effects = [];
    const keywords = [];
    const deathEffects = [];

    if (/(wächter|hüter|schild|wache|kathedrale)/u.test(normalized)) {
      effects.push("fortifyBoard", "healBoard", "barrierStrongest", "barrierHero");
      keywords.push("guard");
      deathEffects.push("barrierHero", "fortifyBoard");
    }
    if (/(seher|orakel|chronist|archivar|lehrmeister|arkanist|richterin)/u.test(normalized)) {
      effects.push("draw", "gainMaxMana", "barrierHero");
      deathEffects.push("draw");
    }
    if (/(jäger|pirscher|assassine|bestie|falke|wolf|lanze|schleicher|schreiter)/u.test(normalized)) {
      effects.push("strikeWeakest", "damageHero");
      keywords.push("charge");
      deathEffects.push("poisonWeakest");
    }
    if (/(eis|frost|nebel|mond|ozean)/u.test(normalized)) {
      effects.push("freezeWeakest", "barrierHero");
    }
    if (/(glut|flammen|asch|brand|donner)/u.test(normalized)) {
      effects.push("burnWeakest");
      deathEffects.push("burnWeakest");
    }
    if (/(gift|seuche|natter|viper|fäule|grab|knochen)/u.test(normalized)) {
      effects.push("poisonWeakest");
      deathEffects.push("poisonWeakest");
    }
    if (/(herold|banner|kommandant|stratege|waffenmeister|schlachtrufer|pfadfinder|portal|schwarm|rudel)/u.test(normalized)) {
      effects.push("buffBoard", "readyStrongest", "summonTokens");
      deathEffects.push("summonTokens");
    }
    if (/(titan|koloss|archon|primarch|avatar|inkarnation|kaiserin|souverän|weltenhorn)/u.test(normalized)) {
      effects.push("damageAllEnemies", "empowerUnit");
      keywords.push("guard");
      deathEffects.push("fortifyBoard");
    }
    if (/(ritual|portal|siegel|urteil|nova|komet|zeitsprung|bann|eklipse)/u.test(normalized)) {
      effects.push("gainMaxMana", "damageAllEnemies", "weakenEnemies", "summonTokens");
    }
    if (/(priester|hohepriester|elysion)/u.test(normalized)) {
      effects.push("healBoard", "healHero", "barrierHero");
      keywords.push("regen");
      deathEffects.push("healHero");
    }

    return {
      effects: uniqueValues(effects),
      keywords: uniqueValues(keywords),
      deathEffects: uniqueValues(deathEffects),
    };
  };

  const createDeathEffect = (type, rarity, index, factionId, title) => {
    if (type !== "unit") {
      return null;
    }
    const rank = RARITY_ORDER.indexOf(rarity);
    const seed = createStableSeed("death", rarity, factionId, title, index);
    if ((rank <= 1 && seed % 5 !== 0) || (rank === 2 && seed % 3 !== 0)) {
      return null;
    }
    const bias = getTitleBias(title);
    const pool = uniqueValues([
      ...bias.deathEffects,
      "healHero",
      "fortifyBoard",
      "barrierHero",
      "summonTokens",
      "poisonWeakest",
      "burnWeakest",
      "weakenEnemies",
    ]);
    return createDeathEffectPayload(chooseSeededValue(pool, seed), rarity, factionId);
  };

  createCardSynergy = function createCardSynergy(type, rarity, index, factionId, title, keywords) {
    const rarityRank = RARITY_ORDER.indexOf(rarity);
    const seed = createStableSeed("synergy", type, rarity, factionId, title, index);
    if (rarityRank === 0 && seed % 4 !== 0) {
      return null;
    }
    const tagPool = getSynergyTagPool(title);
    const keywordPool = keywords.length ? keywords : FACTION_CARD_PROFILES[factionId].keywords;
    const conditionChoices = uniqueValues(["diverseFactions", "partnerFaction", "typeCount", "raritySpread", "highCostCount", "tagCount", keywordPool.length ? "keywordCount" : null]);
    const conditionKind = chooseSeededValue(conditionChoices, seed);
    const condition = buildSynergyCondition(conditionKind, type, factionId, title, keywordPool, tagPool, rarityRank, seed);
    const effectPool = uniqueValues([...getSecondaryEffectPool(type), ...FACTION_CARD_PROFILES[factionId][`${type}Effects`]]);
    const bonusKind = chooseSeededValue(effectPool.filter((kind) => !["damageHero", "gainMana"].includes(kind) || rarityRank >= 4), seed + 11);
    return { condition, bonusEffect: createEffectPayload(bonusKind, rarity, type, seed + 11, factionId) };
  };

  createGeneratedEffectSet = function createGeneratedEffectSet(type, rarity, index, factionId, title) {
    const profile = FACTION_CARD_PROFILES[factionId];
    const bias = getTitleBias(title);
    const rarityRank = RARITY_ORDER.indexOf(rarity);
    const seed = createStableSeed(type, rarity, factionId, title, index);
    const basePool = uniqueValues([...bias.effects, ...(profile[`${type}Effects`] || [])]);
    const primaryKind = chooseSeededValue(basePool, seed);
    const effects = [createEffectPayload(primaryKind, rarity, type, seed, factionId)];

    if (shouldAddSecondaryEffect(rarityRank, type, seed)) {
      const supportPool = uniqueValues([...getSecondaryEffectPool(type), ...bias.effects, ...(profile[`${type}Effects`] || [])]).filter((kind) => kind !== primaryKind);
      effects.push(createEffectPayload(chooseSeededValue(supportPool, seed + 17), rarity, type, seed + 17, factionId));
    }
    if (rarityRank >= 5 && seed % 5 === 0) {
      const tertiaryPool = getSecondaryEffectPool(type).filter((kind) => !effects.some((entry) => entry.kind === kind));
      if (tertiaryPool.length) {
        effects.push(createEffectPayload(chooseSeededValue(tertiaryPool, seed + 31), rarity, type, seed + 31, factionId));
      }
    }
    return effects.length === 1 ? effects[0] : effects;
  };

  createLegacyCard = function createLegacyCard(id, name, faction, type, rarity, cost, attack, health, effect, keywords = [], synergy = null, timing = null, deathEffect = null) {
    return { id, name, faction, type, rarity, cost, attack, health, effect, keywords, synergy, timing, deathEffect, description: buildDescriptionLocal(type, effect, keywords, synergy, timing, deathEffect) };
  };

  appendGeneratedUnitSet = function appendGeneratedUnitSet(cards, faction, factionIndex, titles, rarities, idSegment, offset) {
    titles.forEach((title, index) => {
      const effectIndex = index + offset;
      const rarity = rarities[index];
      const keywords = createUnitKeywords(rarity, effectIndex, faction.id, title);
      const effect = createUnitEffect(rarity, effectIndex, faction.id, title);
      const synergy = createCardSynergy("unit", rarity, effectIndex, faction.id, title, keywords);
      const timing = createCardTiming("unit", rarity, effectIndex, title, keywords);
      const deathEffect = createDeathEffect("unit", rarity, effectIndex, faction.id, title);
      const cost = createCostForRarity(rarity, effectIndex, "unit");
      const stats = createUnitStats(cost, rarity, effectIndex, factionIndex, keywords, title);
      cards.push({ id: `${faction.id}-${idSegment}-${index + 1}`, name: `${faction.prefix}-${title}`, faction: faction.id, type: "unit", rarity, cost, attack: stats.attack, health: stats.health, effect, keywords, synergy, timing, deathEffect, description: buildDescriptionLocal("unit", effect, keywords, synergy, timing, deathEffect) });
    });
  };

  appendGeneratedSpellSet = function appendGeneratedSpellSet(cards, faction, titles, rarities, idSegment, offset) {
    titles.forEach((title, index) => {
      const effectIndex = index + offset;
      const rarity = rarities[index];
      const effect = createSpellEffect(rarity, effectIndex, faction.id, title);
      const synergy = createCardSynergy("spell", rarity, effectIndex, faction.id, title, []);
      const timing = createCardTiming("spell", rarity, effectIndex, title, []);
      cards.push({ id: `${faction.id}-${idSegment}-${index + 1}`, name: `${faction.prefix}-${title}`, faction: faction.id, type: "spell", rarity, cost: createCostForRarity(rarity, effectIndex, "spell"), attack: null, health: null, effect, keywords: [], synergy, timing, deathEffect: null, description: buildDescriptionLocal("spell", effect, [], synergy, timing) });
    });
  };

  appendGeneratedTrainerSet = function appendGeneratedTrainerSet(cards, faction, titles, rarities, idSegment, offset) {
    titles.forEach((title, index) => {
      const effectIndex = index + offset;
      const rarity = rarities[index];
      const effect = createTrainerEffect(rarity, effectIndex, faction.id, title);
      const synergy = createCardSynergy("trainer", rarity, effectIndex, faction.id, title, []);
      const timing = createCardTiming("trainer", rarity, effectIndex, title, []);
      cards.push({ id: `${faction.id}-${idSegment}-${index + 1}`, name: `${title} des ${faction.name}`, faction: faction.id, type: "trainer", rarity, cost: createCostForRarity(rarity, effectIndex, "trainer"), attack: null, health: null, effect, keywords: [], synergy, timing, deathEffect: null, description: buildDescriptionLocal("trainer", effect, [], synergy, timing) });
    });
  };

  buildDescription = function buildDescription(type, effect, keywords = [], synergy = null, timing = null, deathEffect = null, isToken = false) {
    return buildDescriptionLocal(type, effect, keywords, synergy, timing, deathEffect, isToken);
  };

  describeEffect = function describeEffect(type, effect, index) {
    const opener = index === 0 ? (type === "unit" ? "Beim Ausspielen" : "Effekt") : "Außerdem";
    return `${opener}: ${describeEffectText(effect)}`;
  };

  TOKEN_CARDS.forEach((card) => {
    card.description = buildDescriptionLocal("unit", null, card.keywords || [], null, null, null, true);
  });

  [
    { id: "finsternis-kaiserin", deathEffect: { kind: "poisonWeakest", value: 2, turns: 3 } },
    { id: "erstformel-kathedrale", effect: [{ kind: "gainMaxMana", value: 2 }, { kind: "draw", value: 3 }, { kind: "barrierHero", value: 6 }] },
    { id: "astralrichterin-elysion", effect: [{ kind: "healBoard", value: 6 }, { kind: "draw", value: 2 }, { kind: "barrierHero", value: 5 }] },
    { id: "grabstern-archon", deathEffect: { kind: "summonTokens", tokenId: TOKEN_IDS_BY_FACTION.knochenbund, amount: 2 } },
    { id: "weltenwurzel-inkarnation", deathEffect: { kind: "summonTokens", tokenId: TOKEN_IDS_BY_FACTION.wurzelpakt, amount: 2 } },
  ].forEach((update) => {
    const card = [...LEGACY_CARDS, ...TRANSCENDENT_CARDS, ...SINGULAR_CARDS].find((entry) => entry.id === update.id);
    if (!card) {
      return;
    }
    if (update.effect) {
      card.effect = update.effect;
    }
    if (update.deathEffect) {
      card.deathEffect = update.deathEffect;
    }
  });

  [...LEGACY_CARDS, ...TRANSCENDENT_CARDS, ...SINGULAR_CARDS].forEach((card) => {
    card.description = buildDescriptionLocal(card.type, card.effect, card.keywords || [], card.synergy || null, card.timing || null, card.deathEffect || null, card.isToken);
  });

  GENERATED_CARDS.length = 0;
  buildGeneratedCards().forEach((card) => GENERATED_CARDS.push(card));
  CARD_POOL.length = 0;
  CARD_POOL.push(...LEGACY_CARDS, ...TRANSCENDENT_CARDS, ...SINGULAR_CARDS, ...GENERATED_CARDS);
  CARD_MAP.clear();
  CARD_POOL.forEach((card) => CARD_MAP.set(card.id, card));
  Object.keys(CARD_POOLS_BY_RARITY).forEach((key) => delete CARD_POOLS_BY_RARITY[key]);
  Object.assign(CARD_POOLS_BY_RARITY, groupCardsByRarity(CARD_POOL));
  renderAll();
}

*/
function applyLateArcaneOverrides() {
  const describeEffectText = (effect) => {
    switch (effect?.kind) {
      case "damageHero":
        return `Verursacht ${effect.value} direkten Schaden am gegnerischen Helden.`;
      case "healHero":
        return `Heilt deinen Helden um ${effect.value}.`;
      case "draw":
        return `Ziehe ${effect.value} Karte${effect.value > 1 ? "n" : ""}.`;
      case "gainMana":
        return `Erhalte sofort ${effect.value} zusätzliches Mana.`;
      case "gainMaxMana":
        return `Erhöhe dein maximales Mana dauerhaft um ${effect.value}.`;
      case "buffBoard":
        return `Deine Einheiten erhalten +${effect.attack}/+${effect.health}.`;
      case "fortifyBoard":
        return `Dein Held und alle eigenen Einheiten erhalten +${effect.value} Haltbarkeit.`;
      case "healBoard":
        return `Heilt deinen Helden und alle eigenen Einheiten um ${effect.value}.`;
      case "strikeWeakest":
        return `Trifft die schwächste gegnerische Einheit oder den Helden für ${effect.value}.`;
      case "damageAllEnemies":
        return `Verursacht ${effect.value} Schaden an allen gegnerischen Einheiten.`;
      case "burnWeakest":
        return `Belegt die schwächste gegnerische Einheit ${effect.turns} Runden lang mit Brand (${effect.value} Schaden pro Zug).`;
      case "freezeWeakest":
        return `Friert die schwächste gegnerische Einheit für ${effect.turns} Runde${effect.turns > 1 ? "n" : ""} ein.`;
      case "poisonWeakest":
        return `Vergiftet die schwächste gegnerische Einheit für ${effect.turns} Runde${effect.turns > 1 ? "n" : ""} (${effect.value} Schaden am Zugende).`;
      case "barrierStrongest":
        return "Gibt deiner stärksten Einheit eine Barriere gegen den nächsten Schaden.";
      case "barrierHero":
        return `Gibt deinem Helden ${effect.value} Schild.`;
      case "summonTokens": {
        const token = TOKEN_CARD_MAP.get(effect.tokenId);
        return `Beschwört ${effect.amount}× ${token ? token.name : "Token"}.`;
      }
      case "weakenEnemies":
        return `Verringert den Angriff aller gegnerischen Einheiten um ${effect.value}.`;
      case "drainHero":
        return `Entzieht dem gegnerischen Helden ${effect.damage} Leben und heilt dich um ${effect.heal}.`;
      case "readyStrongest":
        return `Macht deine stärkste Einheit sofort angreifbar${effect.attackBonus ? ` und gibt ihr +${effect.attackBonus} Angriff` : ""}.`;
      case "empowerUnit":
        return `Verstärkt deine zuletzt ausgespielte Einheit um +${effect.attack}/+${effect.health}.`;
      default:
        return "Löst einen ungewöhnlichen Effekt aus.";
    }
  };

  const buildDescriptionLocal = (type, effect, keywords = [], synergy = null, timing = null, deathEffect = null, isToken = false) => {
    const effects = normalizeEffectList(effect);
    const parts = effects.length
      ? effects.map((entry, index) => {
        const opener = index === 0 ? (type === "unit" ? "Beim Ausspielen" : "Effekt") : "Außerdem";
        return `${opener}: ${describeEffectText(entry)}`;
      })
      : [isToken ? "Beschworene Token-Einheit." : "Eine solide Karte ohne Zusatzeffekt."];

    if (keywords.length) {
      parts.push(`Schlüsselwörter: ${keywords.map((keyword) => KEYWORD_META[keyword].label).join(", ")}.`);
    }
    if (synergy) {
      parts.push(`Synergie: Aktiv mit ${describeSynergyCondition(synergy.condition)}.`);
    }
    if (timing) {
      parts.push(`Timing: ${describeTiming(timing)}.`);
    }
    if (deathEffect) {
      parts.push(`Todeseffekt: ${describeEffectText(deathEffect)}`);
    }
    return parts.join(" ");
  };

  const createDeathEffectPayload = (kind, rarity, factionId) => {
    const rank = RARITY_ORDER.indexOf(rarity);
    switch (kind) {
      case "healHero":
        return { kind, value: 2 + Math.floor(rank / 3) };
      case "fortifyBoard":
        return { kind, value: 1 + Number(rank >= 5) };
      case "barrierHero":
        return { kind, value: 2 + Number(rank >= 4) };
      case "summonTokens":
        return { kind, tokenId: TOKEN_IDS_BY_FACTION[factionId], amount: 1 + Number(rank >= 6) };
      case "poisonWeakest":
        return { kind, value: 1, turns: 2 + Number(rank >= 5) };
      case "burnWeakest":
        return { kind, value: 1, turns: 1 + Number(rank >= 6) };
      case "weakenEnemies":
        return { kind, value: 1 };
      default:
        return { kind: "draw", value: 1 + Number(rank >= 6) };
    }
  };

  const poisonWeakestEnemy = (owner, value, turns, sourceName) => {
    const target = selectWeakestUnit(getAttackableEnemyUnits(owner));
    if (!target) {
      addLog(`${sourceName} findet kein Ziel für Gift.`);
      return;
    }
    addStatusToUnit(target, { kind: "poison", value, turns }, sourceName);
  };

  const summonFactionTokens = (owner, tokenId, amount, sourceName) => {
    const actor = uiState.match[owner];
    const token = getCard(tokenId);
    const summonCount = Math.min(amount, Math.max(0, APP_CONFIG.boardSize - actor.board.length));
    if (!token || summonCount <= 0) {
      addLog(`${sourceName} hat keinen freien Platz für Beschwörungen.`);
      return;
    }
    for (let index = 0; index < summonCount; index += 1) {
      actor.board.push({
        uid: nextUnitId(),
        cardId: token.id,
        attack: token.attack,
        health: token.health,
        maxHealth: token.health,
        canAttack: token.keywords?.includes("charge") || false,
        keywords: [...(token.keywords || [])],
        statuses: [],
      });
    }
    addLog(`${sourceName} beschwört ${summonCount}× ${token.name}.`);
  };

  damageAllEnemies = function damageAllEnemies(owner, value, sourceName) {
    const enemySide = owner === "player" ? "enemy" : "player";
    const enemy = uiState.match[enemySide];
    if (!enemy.board.length) {
      enemy.hero -= value;
      addLog(`${sourceName} trifft mangels Feldzielen den Helden für ${value}.`);
      return;
    }
    enemy.board.forEach((unit) => {
      dealDamageToUnit(unit, value, `${sourceName} trifft ${getCard(unit.cardId).name}`, enemySide);
    });
  };

  burnWeakestEnemy = function burnWeakestEnemy(owner, value, turns, sourceName) {
    const target = selectWeakestUnit(getAttackableEnemyUnits(owner));
    if (!target) {
      addLog(`${sourceName} findet kein Ziel für Brand.`);
      return;
    }
    addStatusToUnit(target, { kind: "burn", value, turns }, sourceName);
  };

  applySingleEffect = function applySingleEffect(effect, owner, sourceName) {
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
      case "gainMaxMana":
        actor.maxMana = Math.min(APP_CONFIG.maxMana, actor.maxMana + effect.value);
        actor.mana = Math.min(actor.maxMana, actor.mana + effect.value);
        addLog(`${sourceName} erweitert dein Mana dauerhaft um ${effect.value}.`);
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
      case "healBoard":
        actor.board.forEach((unit) => {
          unit.health = Math.min(unit.maxHealth, unit.health + effect.value);
        });
        actor.hero += effect.value;
        addLog(`${sourceName} erneuert dein Feld und heilt ${effect.value}.`);
        break;
      case "strikeWeakest":
        strikeWeakestEnemy(owner, effect.value, sourceName);
        break;
      case "damageAllEnemies":
        damageAllEnemies(owner, effect.value, sourceName);
        break;
      case "burnWeakest":
        burnWeakestEnemy(owner, effect.value, effect.turns, sourceName);
        break;
      case "freezeWeakest":
        freezeWeakestEnemy(owner, effect.turns, sourceName);
        break;
      case "poisonWeakest":
        poisonWeakestEnemy(owner, effect.value, effect.turns, sourceName);
        break;
      case "barrierStrongest":
        barrierStrongestAlly(owner, sourceName);
        break;
      case "barrierHero":
        uiState.match[owner].heroBarrier += effect.value;
        addLog(`${sourceName} stärkt den Helden mit ${effect.value} Schild.`);
        break;
      case "summonTokens":
        summonFactionTokens(owner, effect.tokenId, effect.amount, sourceName);
        break;
      case "weakenEnemies":
        weakenEnemyBoard(owner, effect.value, sourceName);
        break;
      case "drainHero":
        enemy.hero -= effect.damage;
        actor.hero += effect.heal;
        addLog(`${sourceName} entzieht ${effect.damage} Leben und heilt ${effect.heal}.`);
        break;
      case "readyStrongest":
        readyStrongestAlly(owner, effect.attackBonus || 0, sourceName);
        break;
      case "empowerUnit":
        empowerNewestAlly(owner, effect.attack, effect.health, sourceName);
        break;
      default:
        break;
    }
  };

  getSecondaryEffectPool = function getSecondaryEffectPool(type) {
    const pools = {
      unit: ["empowerUnit", "readyStrongest", "draw", "healHero", "buffBoard", "fortifyBoard", "burnWeakest", "barrierStrongest", "poisonWeakest", "summonTokens", "barrierHero"],
      spell: ["draw", "gainMana", "weakenEnemies", "damageHero", "healBoard", "gainMaxMana", "freezeWeakest", "burnWeakest", "poisonWeakest", "summonTokens", "barrierHero"],
      trainer: ["buffBoard", "healBoard", "gainMaxMana", "draw", "readyStrongest", "healHero", "barrierStrongest", "barrierHero", "summonTokens"],
    };
    return pools[type];
  };

  createEffectPayload = function createEffectPayload(kind, rarity, type, seed, factionId = null) {
    const rank = RARITY_ORDER.indexOf(rarity);
    switch (kind) {
      case "damageHero":
        return { kind, value: 1 + Math.floor((rank + Number(type !== "unit")) / 2) + Number(rank >= 5) };
      case "healHero":
        return { kind, value: 2 + Math.floor(rank / 2) + Number(type === "trainer") };
      case "draw":
        return { kind, value: Math.min(4, 1 + Number(rank >= 2) + Number(rank >= 5)) };
      case "gainMana":
        return { kind, value: Math.min(2, 1 + Number(rank >= 5)) };
      case "gainMaxMana":
        return { kind, value: Math.min(2, 1 + Number(rank >= 5)) };
      case "buffBoard":
        return { kind, attack: 1 + Number(rank >= 4), health: Number(rank >= 3) + Number(rank >= 6) };
      case "fortifyBoard":
        return { kind, value: 1 + Math.floor(rank / 3) + Number(rank >= 6) };
      case "strikeWeakest":
        return { kind, value: 1 + Math.floor(rank / 2) + Number(type === "spell") + Number(rank >= 6) };
      case "damageAllEnemies":
        return { kind, value: 1 + Math.floor(rank / 3) + Number(type === "spell" && rank >= 5) };
      case "burnWeakest":
        return { kind, value: 1 + Math.floor(rank / 3), turns: 2 + Number(rank >= 5) };
      case "freezeWeakest":
        return { kind, turns: 1 + Number(rank >= 5) };
      case "poisonWeakest":
        return { kind, value: 1 + Number(rank >= 5), turns: 2 + Number(rank >= 4) };
      case "barrierStrongest":
        return { kind };
      case "barrierHero":
        return { kind, value: 3 + Math.floor(rank / 2) + Number(type === "trainer") };
      case "summonTokens":
        return { kind, tokenId: TOKEN_IDS_BY_FACTION[factionId], amount: 1 + Number(rank >= 5) };
      case "healBoard":
        return { kind, value: 2 + Math.floor(rank / 2) };
      case "weakenEnemies":
        return { kind, value: 1 + Number(rank >= 4) };
      case "drainHero": {
        const damage = 1 + Math.floor((rank + Number(type !== "unit")) / 2) + Number(rank >= 6);
        return { kind, damage, heal: Math.max(1, Math.ceil(damage / 2)) };
      }
      case "readyStrongest":
        return { kind, attackBonus: Number(rank >= 4) + Number(rank >= 6) };
      case "empowerUnit":
        return { kind, attack: 1 + Number(rank >= 2) + Number(rank >= 5), health: 1 + Number(rank >= 4) };
      default:
        return { kind: "none" };
    }
  };

  getTitleBias = function getTitleBias(title) {
    const normalized = normalizeTitle(title);
    const effects = [];
    const keywords = [];
    const deathEffects = [];
    if (/(wächter|hüter|schild|wache|kathedrale)/u.test(normalized)) {
      effects.push("fortifyBoard", "healBoard", "barrierStrongest", "barrierHero");
      keywords.push("guard");
      deathEffects.push("barrierHero", "fortifyBoard");
    }
    if (/(seher|orakel|chronist|archivar|lehrmeister|arkanist|richterin)/u.test(normalized)) {
      effects.push("draw", "gainMaxMana", "barrierHero");
      deathEffects.push("draw");
    }
    if (/(jäger|pirscher|assassine|bestie|falke|wolf|lanze|schleicher|schreiter)/u.test(normalized)) {
      effects.push("strikeWeakest", "damageHero");
      keywords.push("charge");
      deathEffects.push("poisonWeakest");
    }
    if (/(eis|frost|nebel|mond|ozean)/u.test(normalized)) {
      effects.push("freezeWeakest", "barrierHero");
    }
    if (/(glut|flammen|asch|brand|donner)/u.test(normalized)) {
      effects.push("burnWeakest");
      deathEffects.push("burnWeakest");
    }
    if (/(gift|seuche|natter|viper|fäule|grab|knochen)/u.test(normalized)) {
      effects.push("poisonWeakest");
      deathEffects.push("poisonWeakest");
    }
    if (/(herold|banner|kommandant|stratege|waffenmeister|schlachtrufer|pfadfinder|portal|schwarm|rudel)/u.test(normalized)) {
      effects.push("buffBoard", "readyStrongest", "summonTokens");
      deathEffects.push("summonTokens");
    }
    if (/(titan|koloss|archon|primarch|avatar|inkarnation|kaiserin|souverän|weltenhorn)/u.test(normalized)) {
      effects.push("damageAllEnemies", "empowerUnit");
      keywords.push("guard");
      deathEffects.push("fortifyBoard");
    }
    if (/(ritual|portal|siegel|urteil|nova|komet|zeitsprung|bann|eklipse)/u.test(normalized)) {
      effects.push("gainMaxMana", "damageAllEnemies", "weakenEnemies", "summonTokens");
    }
    if (/(priester|hohepriester|elysion)/u.test(normalized)) {
      effects.push("healBoard", "healHero", "barrierHero");
      keywords.push("regen");
      deathEffects.push("healHero");
    }
    return {
      effects: uniqueValues(effects),
      keywords: uniqueValues(keywords),
      deathEffects: uniqueValues(deathEffects),
    };
  };

  const createDeathEffect = (type, rarity, index, factionId, title) => {
    if (type !== "unit") {
      return null;
    }
    const rank = RARITY_ORDER.indexOf(rarity);
    const seed = createStableSeed("death", rarity, factionId, title, index);
    if ((rank <= 1 && seed % 5 !== 0) || (rank === 2 && seed % 3 !== 0)) {
      return null;
    }
    const bias = getTitleBias(title);
    const pool = uniqueValues([
      ...bias.deathEffects,
      "healHero",
      "fortifyBoard",
      "barrierHero",
      "summonTokens",
      "poisonWeakest",
      "burnWeakest",
      "weakenEnemies",
    ]);
    return createDeathEffectPayload(chooseSeededValue(pool, seed), rarity, factionId);
  };

  createCardSynergy = function createCardSynergy(type, rarity, index, factionId, title, keywords) {
    const rarityRank = RARITY_ORDER.indexOf(rarity);
    const seed = createStableSeed("synergy", type, rarity, factionId, title, index);
    if (rarityRank === 0 && seed % 4 !== 0) {
      return null;
    }
    const tagPool = getSynergyTagPool(title);
    const keywordPool = keywords.length ? keywords : FACTION_CARD_PROFILES[factionId].keywords;
    const conditionChoices = uniqueValues(["diverseFactions", "partnerFaction", "typeCount", "raritySpread", "highCostCount", "tagCount", keywordPool.length ? "keywordCount" : null]);
    const conditionKind = chooseSeededValue(conditionChoices, seed);
    const condition = buildSynergyCondition(conditionKind, type, factionId, title, keywordPool, tagPool, rarityRank, seed);
    const effectPool = uniqueValues([...getSecondaryEffectPool(type), ...FACTION_CARD_PROFILES[factionId][`${type}Effects`]]);
    const bonusKind = chooseSeededValue(effectPool.filter((kind) => !["damageHero", "gainMana"].includes(kind) || rarityRank >= 4), seed + 11);
    return { condition, bonusEffect: createEffectPayload(bonusKind, rarity, type, seed + 11, factionId) };
  };

  createGeneratedEffectSet = function createGeneratedEffectSet(type, rarity, index, factionId, title) {
    const profile = FACTION_CARD_PROFILES[factionId];
    const bias = getTitleBias(title);
    const rarityRank = RARITY_ORDER.indexOf(rarity);
    const seed = createStableSeed(type, rarity, factionId, title, index);
    const basePool = uniqueValues([...bias.effects, ...(profile[`${type}Effects`] || [])]);
    const primaryKind = chooseSeededValue(basePool, seed);
    const effects = [createEffectPayload(primaryKind, rarity, type, seed, factionId)];
    if (shouldAddSecondaryEffect(rarityRank, type, seed)) {
      const supportPool = uniqueValues([...getSecondaryEffectPool(type), ...bias.effects, ...(profile[`${type}Effects`] || [])]).filter((kind) => kind !== primaryKind);
      effects.push(createEffectPayload(chooseSeededValue(supportPool, seed + 17), rarity, type, seed + 17, factionId));
    }
    if (rarityRank >= 5 && seed % 5 === 0) {
      const tertiaryPool = getSecondaryEffectPool(type).filter((kind) => !effects.some((entry) => entry.kind === kind));
      if (tertiaryPool.length) {
        effects.push(createEffectPayload(chooseSeededValue(tertiaryPool, seed + 31), rarity, type, seed + 31, factionId));
      }
    }
    return effects.length === 1 ? effects[0] : effects;
  };

  createLegacyCard = function createLegacyCard(id, name, faction, type, rarity, cost, attack, health, effect, keywords = [], synergy = null, timing = null, deathEffect = null) {
    return { id, name, faction, type, rarity, cost, attack, health, effect, keywords, synergy, timing, deathEffect, description: buildDescriptionLocal(type, effect, keywords, synergy, timing, deathEffect) };
  };

  appendGeneratedUnitSet = function appendGeneratedUnitSet(cards, faction, factionIndex, titles, rarities, idSegment, offset) {
    titles.forEach((title, index) => {
      const effectIndex = index + offset;
      const rarity = rarities[index];
      const keywords = createUnitKeywords(rarity, effectIndex, faction.id, title);
      const effect = createUnitEffect(rarity, effectIndex, faction.id, title);
      const synergy = createCardSynergy("unit", rarity, effectIndex, faction.id, title, keywords);
      const timing = createCardTiming("unit", rarity, effectIndex, title, keywords);
      const deathEffect = createDeathEffect("unit", rarity, effectIndex, faction.id, title);
      const cost = createCostForRarity(rarity, effectIndex, "unit");
      const stats = createUnitStats(cost, rarity, effectIndex, factionIndex, keywords, title);
      cards.push({ id: `${faction.id}-${idSegment}-${index + 1}`, name: `${faction.prefix}-${title}`, faction: faction.id, type: "unit", rarity, cost, attack: stats.attack, health: stats.health, effect, keywords, synergy, timing, deathEffect, description: buildDescriptionLocal("unit", effect, keywords, synergy, timing, deathEffect) });
    });
  };

  appendGeneratedSpellSet = function appendGeneratedSpellSet(cards, faction, titles, rarities, idSegment, offset) {
    titles.forEach((title, index) => {
      const effectIndex = index + offset;
      const rarity = rarities[index];
      const effect = createSpellEffect(rarity, effectIndex, faction.id, title);
      const synergy = createCardSynergy("spell", rarity, effectIndex, faction.id, title, []);
      const timing = createCardTiming("spell", rarity, effectIndex, title, []);
      cards.push({ id: `${faction.id}-${idSegment}-${index + 1}`, name: `${faction.prefix}-${title}`, faction: faction.id, type: "spell", rarity, cost: createCostForRarity(rarity, effectIndex, "spell"), attack: null, health: null, effect, keywords: [], synergy, timing, deathEffect: null, description: buildDescriptionLocal("spell", effect, [], synergy, timing) });
    });
  };

  appendGeneratedTrainerSet = function appendGeneratedTrainerSet(cards, faction, titles, rarities, idSegment, offset) {
    titles.forEach((title, index) => {
      const effectIndex = index + offset;
      const rarity = rarities[index];
      const effect = createTrainerEffect(rarity, effectIndex, faction.id, title);
      const synergy = createCardSynergy("trainer", rarity, effectIndex, faction.id, title, []);
      const timing = createCardTiming("trainer", rarity, effectIndex, title, []);
      cards.push({ id: `${faction.id}-${idSegment}-${index + 1}`, name: `${title} des ${faction.name}`, faction: faction.id, type: "trainer", rarity, cost: createCostForRarity(rarity, effectIndex, "trainer"), attack: null, health: null, effect, keywords: [], synergy, timing, deathEffect: null, description: buildDescriptionLocal("trainer", effect, [], synergy, timing) });
    });
  };

  buildDescription = function buildDescription(type, effect, keywords = [], synergy = null, timing = null, deathEffect = null, isToken = false) {
    return buildDescriptionLocal(type, effect, keywords, synergy, timing, deathEffect, isToken);
  };

  describeEffect = function describeEffect(type, effect, index) {
    const opener = index === 0 ? (type === "unit" ? "Beim Ausspielen" : "Effekt") : "Außerdem";
    return `${opener}: ${describeEffectText(effect)}`;
  };

  TOKEN_CARDS.forEach((card) => {
    card.description = buildDescriptionLocal("unit", null, card.keywords || [], null, null, null, true);
  });

  [
    { id: "finsternis-kaiserin", deathEffect: { kind: "poisonWeakest", value: 2, turns: 3 } },
    { id: "erstformel-kathedrale", effect: [{ kind: "gainMaxMana", value: 2 }, { kind: "draw", value: 3 }, { kind: "barrierHero", value: 6 }] },
    { id: "astralrichterin-elysion", effect: [{ kind: "healBoard", value: 6 }, { kind: "draw", value: 2 }, { kind: "barrierHero", value: 5 }] },
    { id: "grabstern-archon", deathEffect: { kind: "summonTokens", tokenId: TOKEN_IDS_BY_FACTION.knochenbund, amount: 2 } },
    { id: "weltenwurzel-inkarnation", deathEffect: { kind: "summonTokens", tokenId: TOKEN_IDS_BY_FACTION.wurzelpakt, amount: 2 } },
  ].forEach((update) => {
    const card = [...LEGACY_CARDS, ...TRANSCENDENT_CARDS, ...SINGULAR_CARDS].find((entry) => entry.id === update.id);
    if (!card) {
      return;
    }
    if (update.effect) {
      card.effect = update.effect;
    }
    if (update.deathEffect) {
      card.deathEffect = update.deathEffect;
    }
  });

  [...LEGACY_CARDS, ...TRANSCENDENT_CARDS, ...SINGULAR_CARDS].forEach((card) => {
    card.description = buildDescriptionLocal(card.type, card.effect, card.keywords || [], card.synergy || null, card.timing || null, card.deathEffect || null, card.isToken);
  });

  GENERATED_CARDS.length = 0;
  buildGeneratedCards().forEach((card) => GENERATED_CARDS.push(card));
  CARD_POOL.length = 0;
  CARD_POOL.push(...LEGACY_CARDS, ...TRANSCENDENT_CARDS, ...SINGULAR_CARDS, ...GENERATED_CARDS);
  CARD_MAP.clear();
  CARD_POOL.forEach((card) => CARD_MAP.set(card.id, card));
  Object.keys(CARD_POOLS_BY_RARITY).forEach((key) => delete CARD_POOLS_BY_RARITY[key]);
  Object.assign(CARD_POOLS_BY_RARITY, groupCardsByRarity(CARD_POOL));
}

const TOKEN_CARDS = [
  createTokenCard("token-glut-funken", "Funkenruf", "glutorden", 1, 1, ["charge"]),
  createTokenCard("token-nebel-spiegel", "Spiegelnebel", "nebelchor", 1, 2, ["regen"]),
  createTokenCard("token-wurzel-keim", "Dornenkeim", "wurzelpakt", 1, 2, ["guard"]),
  createTokenCard("token-schatten-scherbe", "Schattenscherbe", "schattenzirkel", 2, 1, ["charge"]),
  createTokenCard("token-sturm-rekrut", "Sturmrekrut", "sturmwacht", 1, 1, ["charge"]),
  createTokenCard("token-runen-konstrukt", "Runenkonstrukt", "runenschmiede", 1, 2, ["guard"]),
  createTokenCard("token-sternen-funken", "Sternenfunken", "sternenhof", 1, 2, ["regen"]),
  createTokenCard("token-knochen-diener", "Knochendiener", "knochenbund", 2, 1, ["lifesteal"]),
  createTokenCard("token-sonnen-funke", "Lichtfunke", "sonnenchor", 1, 2, ["regen"]),
  createTokenCard("token-leeren-splitter", "Leerenplitter", "leerenpakt", 2, 1, ["charge"]),
  createTokenCard("token-kristall-prisma", "Prismascherbe", "kristallrat", 1, 2, ["guard"]),
  createTokenCard("token-daemmer-schemen", "Dämmerschemen", "dämmerbund", 1, 1, ["lifesteal"]),
  createTokenCard("token-wild-spur", "Jagdspur", "wildjagd", 1, 1, ["charge"]),
];
const TOKEN_CARD_MAP = new Map(TOKEN_CARDS.map((card) => [card.id, card]));
const TOKEN_IDS_BY_FACTION = TOKEN_CARDS.reduce((map, card) => {
  map[card.faction] = card.id;
  return map;
}, {});

const GENERATED_CARDS = buildGeneratedCards();
const CARD_POOL = [...LEGACY_CARDS, ...TRANSCENDENT_CARDS, ...SINGULAR_CARDS, ...GENERATED_CARDS];
const CARD_MAP = new Map(CARD_POOL.map((card) => [card.id, card]));
const CARD_POOLS_BY_RARITY = groupCardsByRarity(CARD_POOL);

function getShopTabId(value) {
  return Object.prototype.hasOwnProperty.call(SHOP_TAB_DEFINITIONS, value) ? value : "boosters";
}

function getShopBundleTierDefinition(tierId) {
  return SHOP_BUNDLE_TIER_DEFINITIONS.find((entry) => entry.id === tierId) || SHOP_BUNDLE_TIER_DEFINITIONS[0];
}

function getBundleCardSortValue(card, sortMode = "rarity-desc") {
  const rarityRank = RARITY_ORDER.indexOf(card.rarity);
  if (sortMode === "cost-asc") {
    return rarityRank * 100 + (99 - card.cost);
  }
  if (sortMode === "cost-desc") {
    return rarityRank * 100 + card.cost;
  }
  return rarityRank * 100 + card.cost;
}

function pickShopBundleCards(factionId, rules) {
  const pickedIds = [];
  const exclude = new Set();
  const fallbackRarities = [...RARITY_ORDER].reverse();
  const fallbackTypes = ["unit", "spell", "trainer"];

  const appendMatches = (options, limit = Number.POSITIVE_INFINITY) => {
    const matches = CARD_POOL
      .filter((card) => !card.isToken)
      .filter((card) => !exclude.has(card.id))
      .filter((card) => !options.factionId || card.faction === options.factionId)
      .filter((card) => !options.rarities?.length || options.rarities.includes(card.rarity))
      .filter((card) => !options.types?.length || options.types.includes(card.type))
      .sort((left, right) => {
        const leftScore = getBundleCardSortValue(left, options.sort);
        const rightScore = getBundleCardSortValue(right, options.sort);
        return rightScore - leftScore || left.name.localeCompare(right.name, "de-CH");
      });

    let added = 0;
    matches.forEach((card) => {
      if (added >= limit) {
        return;
      }
      if (exclude.has(card.id)) {
        return;
      }
      pickedIds.push(card.id);
      exclude.add(card.id);
      added += 1;
    });
  };

  rules.forEach((rule) => {
    const before = pickedIds.length;
    const desiredCount = Math.max(1, Number(rule.count || 1));
    const requestedTypes = rule.types?.length ? [...rule.types] : rule.type ? [rule.type] : null;
    const attempts = [
      { factionId, rarities: rule.rarities, types: requestedTypes, sort: rule.sort },
      { factionId, rarities: rule.rarities, types: fallbackTypes, sort: rule.sort },
      { factionId, rarities: fallbackRarities, types: requestedTypes, sort: rule.sort },
      { factionId, rarities: fallbackRarities, types: fallbackTypes, sort: rule.sort },
      { factionId: null, rarities: fallbackRarities, types: requestedTypes, sort: rule.sort },
      { factionId: null, rarities: fallbackRarities, types: fallbackTypes, sort: rule.sort },
    ];

    for (const attempt of attempts) {
      const remaining = desiredCount - (pickedIds.length - before);
      appendMatches(attempt, remaining);
      if (pickedIds.length - before >= desiredCount) {
        break;
      }
    }
  });

  return pickedIds;
}

function buildShopBundleDefinitions() {
  return FACTIONS.reduce((bundles, faction) => {
    SHOP_BUNDLE_TIER_DEFINITIONS.forEach((tier) => {
      const guaranteedCardIds = pickShopBundleCards(faction.id, tier.guaranteedRules);
      const id = `${faction.id}-${tier.id}-pack`;
      bundles[id] = Object.freeze({
        id,
        factionId: faction.id,
        tierId: tier.id,
        price: tier.price,
        guaranteedCards: guaranteedCardIds.map((cardId) => ({ cardId, amount: 1 })),
        includedBoosters: tier.boosters.map((entry) => ({ ...entry })),
      });
    });
    return bundles;
  }, {});
}

const SHOP_BUNDLE_DEFINITIONS = buildShopBundleDefinitions();

const elements = {
  authScreen: document.getElementById("authScreen"),
  gameShell: document.getElementById("gameShell"),
  sceneBanner: document.getElementById("sceneBanner"),
  sceneBannerEyebrow: document.getElementById("sceneBannerEyebrow"),
  sceneBannerTitle: document.getElementById("sceneBannerTitle"),
  sceneBannerText: document.getElementById("sceneBannerText"),
  authTabs: [...document.querySelectorAll(".auth-tab")],
  loginForm: document.getElementById("loginForm"),
  registerForm: document.getElementById("registerForm"),
  authMessage: document.getElementById("authMessage"),
  navButtons: [...document.querySelectorAll(".nav-button")],
  sections: {
    menu: document.getElementById("menuSection"),
    shop: document.getElementById("shopSection"),
    marketplace: document.getElementById("marketplaceSection"),
    booster: document.getElementById("boosterSection"),
    collection: document.getElementById("collectionSection"),
    decks: document.getElementById("decksSection"),
    progress: document.getElementById("progressSection"),
    wiki: document.getElementById("wikiSection"),
    profile: document.getElementById("profileSection"),
    friends: document.getElementById("friendsSection"),
    multiplayer: document.getElementById("multiplayerSection"),
    settings: document.getElementById("settingsSection"),
    admin: document.getElementById("adminSection"),
    arena: document.getElementById("arenaSection"),
  },
  topbar: document.querySelector(".topbar"),
  playerName: document.getElementById("playerName"),
  resourceBar: document.getElementById("resourceBar"),
  floatingResourceBar: document.getElementById("floatingResourceBar"),
  menuSummaryGrid: document.getElementById("menuSummaryGrid"),
  resetLocalDataButton: document.getElementById("resetLocalDataButton"),
  logoutButton: document.getElementById("logoutButton"),
  shopTabRow: document.getElementById("shopTabRow"),
  shopCatalogHeading: document.getElementById("shopCatalogHeading"),
  shopCatalogNote: document.getElementById("shopCatalogNote"),
  shopPackGrid: document.getElementById("shopPackGrid"),
  shopBundleGrid: document.getElementById("shopBundleGrid"),
  shopCosmeticGrid: document.getElementById("shopCosmeticGrid"),
  shopSummaryPanel: document.getElementById("shopSummaryPanel"),
  shopFutureHeading: document.getElementById("shopFutureHeading"),
  futureShopGrid: document.getElementById("futureShopGrid"),
  marketOverview: document.getElementById("marketOverview"),
  marketMovers: document.getElementById("marketMovers"),
  marketGrid: document.getElementById("marketGrid"),
  marketBrowseEyebrow: document.getElementById("marketBrowseEyebrow"),
  marketBrowseHeading: document.getElementById("marketBrowseHeading"),
  marketResultsMeta: document.getElementById("marketResultsMeta"),
  marketSearchInput: document.getElementById("marketSearchInput"),
  marketRarityFilter: document.getElementById("marketRarityFilter"),
  marketSortSelect: document.getElementById("marketSortSelect"),
  marketResetFiltersButton: document.getElementById("marketResetFiltersButton"),
  ownedPackGrid: document.getElementById("ownedPackGrid"),
  selectedPackPreview: document.getElementById("selectedPackPreview"),
  openingStage: document.getElementById("openingStage"),
  openingBurst: document.getElementById("openingBurst"),
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
  deckModeSelect: document.getElementById("deckModeSelect"),
  deckCodeInput: document.getElementById("deckCodeInput"),
  renameDeckButton: document.getElementById("renameDeckButton"),
  newDeckButton: document.getElementById("newDeckButton"),
  duplicateDeckButton: document.getElementById("duplicateDeckButton"),
  deleteDeckButton: document.getElementById("deleteDeckButton"),
  copyDeckCodeButton: document.getElementById("copyDeckCodeButton"),
  importDeckCodeButton: document.getElementById("importDeckCodeButton"),
  clearDeckCodeButton: document.getElementById("clearDeckCodeButton"),
  activeDeckMeta: document.getElementById("activeDeckMeta"),
  activeDeckWarnings: document.getElementById("activeDeckWarnings"),
  activeDeckList: document.getElementById("activeDeckList"),
  savedDecksList: document.getElementById("savedDecksList"),
  savedDecksPanel: document.getElementById("savedDecksPanel"),
  deckCollectionGrid: document.getElementById("deckCollectionGrid"),
  progressSummary: document.getElementById("progressSummary"),
  progressQuestPanel: document.getElementById("progressQuestPanel"),
  progressAchievementPanel: document.getElementById("progressAchievementPanel"),
  progressRankPanel: document.getElementById("progressRankPanel"),
  progressAlbumPanel: document.getElementById("progressAlbumPanel"),
  progressPityPanel: document.getElementById("progressPityPanel"),
  progressTradePanel: document.getElementById("progressTradePanel"),
  wikiSummary: document.getElementById("wikiSummary"),
  wikiFindHeading: document.getElementById("wikiFindHeading"),
  wikiSearchLabel: document.getElementById("wikiSearchLabel"),
  wikiSearchInput: document.getElementById("wikiSearchInput"),
  wikiTopicRow: document.getElementById("wikiTopicRow"),
  wikiResultsMeta: document.getElementById("wikiResultsMeta"),
  wikiContentEyebrow: document.getElementById("wikiContentEyebrow"),
  wikiContentHeading: document.getElementById("wikiContentHeading"),
  wikiContent: document.getElementById("wikiContent"),
  profileSummary: document.getElementById("profileSummary"),
  profileLoadoutPanel: document.getElementById("profileLoadoutPanel"),
  profileCosmeticsPanel: document.getElementById("profileCosmeticsPanel"),
  profileRenameForm: document.getElementById("profileRenameForm"),
  profileNameInput: document.getElementById("profileNameInput"),
  profileRenamePasswordInput: document.getElementById("profileRenamePasswordInput"),
  profilePasswordForm: document.getElementById("profilePasswordForm"),
  profileCurrentPasswordInput: document.getElementById("profileCurrentPasswordInput"),
  profileNewPasswordInput: document.getElementById("profileNewPasswordInput"),
  profileConfirmPasswordInput: document.getElementById("profileConfirmPasswordInput"),
  friendsSummary: document.getElementById("friendsSummary"),
  friendsListPanel: document.getElementById("friendsListPanel"),
  friendsPendingPanel: document.getElementById("friendsPendingPanel"),
  friendsTradePanel: document.getElementById("friendsTradePanel"),
  friendsDuelPanel: document.getElementById("friendsDuelPanel"),
  multiplayerSummary: document.getElementById("multiplayerSummary"),
  multiplayerQueuePanel: document.getElementById("multiplayerQueuePanel"),
  multiplayerChallengesPanel: document.getElementById("multiplayerChallengesPanel"),
  settingsSummary: document.getElementById("settingsSummary"),
  settingsLanguageSelect: document.getElementById("settingsLanguageSelect"),
  settingsClickEffects: document.getElementById("settingsClickEffects"),
  settingsPackEffects: document.getElementById("settingsPackEffects"),
  settingsReducedMotion: document.getElementById("settingsReducedMotion"),
  settingsConfirmActions: document.getElementById("settingsConfirmActions"),
  resetSettingsButton: document.getElementById("resetSettingsButton"),
  adminAccountList: document.getElementById("adminAccountList"),
  adminSelectedSummary: document.getElementById("adminSelectedSummary"),
  adminCreateUsernameInput: document.getElementById("adminCreateUsernameInput"),
  adminCreatePasswordInput: document.getElementById("adminCreatePasswordInput"),
  createAccountButton: document.getElementById("createAccountButton"),
  adminGoldAmount: document.getElementById("adminGoldAmount"),
  grantGoldButton: document.getElementById("grantGoldButton"),
  removeGoldButton: document.getElementById("removeGoldButton"),
  adminPackSelect: document.getElementById("adminPackSelect"),
  adminPackAmount: document.getElementById("adminPackAmount"),
  grantPackButton: document.getElementById("grantPackButton"),
  removePackButton: document.getElementById("removePackButton"),
  adminCardSelect: document.getElementById("adminCardSelect"),
  adminCardAmount: document.getElementById("adminCardAmount"),
  grantCardButton: document.getElementById("grantCardButton"),
  removeCardButton: document.getElementById("removeCardButton"),
  deleteAccountButton: document.getElementById("deleteAccountButton"),
  arenaStatus: document.getElementById("arenaStatus"),
  battleHeader: document.getElementById("battleHeader"),
  enemyHeroPanel: document.getElementById("enemyHeroPanel"),
  playerHeroPanel: document.getElementById("playerHeroPanel"),
  enemyBoard: document.getElementById("enemyBoard"),
  playerBoard: document.getElementById("playerBoard"),
  battleLog: document.getElementById("battleLog"),
  playerHand: document.getElementById("playerHand"),
  arenaDifficultySelect: document.getElementById("arenaDifficultySelect"),
  endTurnButton: document.getElementById("endTurnButton"),
  startMatchButton: document.getElementById("startMatchButton"),
  resetMatchButton: document.getElementById("resetMatchButton"),
  cardModal: document.getElementById("cardModal"),
  cardModalContent: document.getElementById("cardModalContent"),
  closeCardModalButton: document.getElementById("closeCardModalButton"),
  toast: document.getElementById("toast"),
  fxLayer: document.getElementById("fxLayer"),
  cardTemplate: document.getElementById("cardTemplate"),
  packTemplate: document.getElementById("packTemplate"),
};

uiState = {
  authMode: "login",
  section: "menu",
  modalCardId: null,
  adminSelectedUser: null,
  adminCacheDirty: true,
  visualFxReady: false,
  lastSceneTheme: null,
  openingFxTimer: null,
  match: null,
  marketFilters: {
    search: "",
    rarity: "all",
    sort: "hot",
  },
  socialProfiles: {},
  friendSearchResults: [],
  friendSearchBusy: false,
  friendSearchQuery: "",
  friendsHydrated: false,
  friendsLoading: false,
  friendTradeTarget: "",
  friendTradeOptions: null,
  friendTradeBusy: false,
  friendChallengeTarget: "",
  friendChallengeBusy: false,
  multiplayerHydrated: false,
  multiplayerLoading: false,
  multiplayerQueue: [],
  multiplayerOwnQueueEntry: null,
  multiplayerIncomingChallenges: [],
  multiplayerOutgoingChallenges: [],
  multiplayerQueueBusy: false,
  multiplayerChallengeBusy: false,
  wikiSearch: "",
  wikiTopic: "all",
  deckMode: DECK_MODES.standard,
  deckCodeDraft: "",
  previewLanguage: "de",
  toastTimer: null,
};

let database = loadDatabase();
ensureAdminAccount();
currentUsername = loadSession();
currentAccount = currentUsername && getStoredAccount(currentUsername) ? normalizeAccount(getStoredAccount(currentUsername)) : null;
if (currentAccount?.save?.settings?.language) {
  uiState.previewLanguage = currentAccount.save.settings.language;
}
if (currentAccount?.save?.activeMatch) {
  uiState.match = cloneJsonValue(currentAccount.save.activeMatch);
  uiState.section = "arena";
}
window.setTimeout(applyLateArcaneOverrides, 0);

function setStaticText(selector, text) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = text;
  }
}

function setStaticAttribute(selector, attribute, text) {
  const element = document.querySelector(selector);
  if (element) {
    element.setAttribute(attribute, text);
  }
}

function applyStaticTranslations() {
  document.documentElement.lang = getCurrentLanguage();

  setStaticText(".auth-copy .eyebrow", getUiText("auth.eyebrow"));
  setStaticText(".auth-copy h1", getUiText("auth.title"));
  setStaticText(".auth-copy p:nth-of-type(2)", getUiText("auth.body"));
  const authPoints = getUiText("auth.points") || [];
  document.querySelectorAll(".auth-points li").forEach((item, index) => {
    item.textContent = authPoints[index] || "";
  });
  setStaticText('.auth-tab[data-auth-mode="login"]', getUiText("auth.loginTab"));
  setStaticText('.auth-tab[data-auth-mode="register"]', getUiText("auth.registerTab"));
  setStaticText("#loginForm label:nth-of-type(1) span", getUiText("auth.username"));
  setStaticText("#loginForm label:nth-of-type(2) span", getUiText("auth.password"));
  setStaticText("#loginForm button", getUiText("auth.loginButton"));
  setStaticText("#registerForm label:nth-of-type(1) span", getUiText("auth.username"));
  setStaticText("#registerForm label:nth-of-type(2) span", getUiText("auth.password"));
  setStaticText("#registerForm button", getUiText("auth.registerButton"));

  setStaticText(".brand-card .eyebrow", getUiText("brand.eyebrow"));
  setStaticText(".brand-card .brand-text", getUiText("brand.description"));
  setStaticText(".sidebar-foot .sidebar-label", getUiText("brand.saveModeLabel"));
  setStaticText(".sidebar-foot strong", getUiText("brand.saveModeValue"));
  setStaticText(".player-panel .eyebrow", getUiText("common.activeDeck") === "Aktives Deck" ? "Spielerkonto" : getCurrentLanguage() === "fr" ? "Compte joueur" : "Player Account");
  setStaticAttribute(".home-trigger", "title", getUiText("nav.menu"));
  setStaticAttribute(".home-trigger", "aria-label", getUiText("nav.menu"));

  ["shop", "marketplace", "booster", "collection", "decks", "wiki", "profile", "friends", "settings", "admin", "arena"].forEach((section) => {
    document.querySelectorAll(`.nav-button[data-section="${section}"]`).forEach((button) => {
      const label = getUiText(`nav.${section}`);
      if (button.classList.contains("topbar-icon-button")) {
        button.setAttribute("title", label);
        button.setAttribute("aria-label", label);
        const iconText = button.querySelector(".topbar-icon-text");
        if (iconText) {
          iconText.textContent = label;
        }
      } else if (!button.classList.contains("menu-link-card") && !button.classList.contains("menu-arena-card")) {
        button.textContent = label;
      }
    });
  });

  setStaticText("#shopSection .section-head .eyebrow", getUiText("nav.shop"));
  setStaticText("#shopSection .section-head h2", getUiText("sections.shopTitle"));
  setStaticText("#shopSection .section-note", getUiText("sections.shopNote"));
  setStaticText("#shopFutureHeading", getUiText("sections.futureTitle"));

  setStaticText("#marketplaceSection .section-head .eyebrow", getUiText("nav.marketplace"));
  setStaticText("#marketplaceSection .section-head h2", getUiText("sections.marketTitle"));
  setStaticText("#marketplaceSection .section-note", getUiText("sections.marketNote"));
  setStaticText("#marketplaceSection .market-headline .subheading", getUiText("sections.marketMovers"));
  setStaticText("#marketplaceSection .market-headline .mini-note", getUiText("sections.marketMoversNote"));
  setStaticText("#marketBrowseEyebrow", getUiText("market.browseEyebrow"));
  setStaticText("#marketBrowseHeading", getUiText("market.browseTitle"));
  setStaticText("#marketplaceSection .market-toolbar label:nth-of-type(1) span", getUiText("market.search"));
  setStaticText("#marketplaceSection .market-toolbar label:nth-of-type(2) span", getUiText("market.rarity"));
  setStaticText("#marketplaceSection .market-toolbar label:nth-of-type(3) span", getUiText("market.sort"));
  setStaticAttribute("#marketSearchInput", "placeholder", getUiText("market.searchPlaceholder"));
  setStaticText("#marketResetFiltersButton", getUiText("market.resetFilters"));

  setStaticText("#boosterSection .section-head .eyebrow", getUiText("nav.booster"));
  setStaticText("#boosterSection .section-head h2", getUiText("sections.boosterTitle"));
  setStaticText("#boosterSection .inventory-panel .subheading", getUiText("booster.ownedTitle"));

  setStaticText("#collectionSection .section-head .eyebrow", getUiText("nav.collection"));
  setStaticText("#collectionSection .section-head h2", getUiText("sections.collectionTitle"));
  setStaticText("#collectionSection .section-note", getUiText("sections.collectionNote"));
  setStaticText("#collectionSection .filter-toolbar label:nth-of-type(1) span", getUiText("collection.search"));
  setStaticText("#collectionSection .filter-toolbar label:nth-of-type(2) span", getUiText("collection.sort"));
  setStaticText("#collectionSection .filter-toolbar label:nth-of-type(3) span", getUiText("collection.rarity"));
  setStaticText("#collectionSection .filter-toolbar label:nth-of-type(4) span", getUiText("collection.type"));
  setStaticText("#collectionSection .filter-toolbar label:nth-of-type(5) span", getUiText("collection.faction"));
  setStaticText("#collectionSection .filter-toolbar label:nth-of-type(6) span", getUiText("collection.mana"));
  setStaticAttribute("#searchInput", "placeholder", getUiText("collection.searchPlaceholder"));
  setStaticText("#collectionSection .checkbox-line:nth-of-type(1) span", getUiText("collection.ownedOnly"));
  setStaticText("#collectionSection .checkbox-line:nth-of-type(2) span", getUiText("collection.duplicatesOnly"));

  setStaticText("#decksSection .section-head .eyebrow", getUiText("nav.decks"));
  setStaticText("#decksSection .section-head h2", getUiText("sections.decksTitle"));
  setStaticText("#decksSection .section-note", getUiText("sections.decksNote"));
  setStaticText("#deckModeLabel", getUiText("decks.mode"));
  setStaticText("#deckNameLabel", getUiText("decks.activeName"));
  setStaticAttribute("#deckNameInput", "placeholder", getUiText("decks.deckNamePlaceholder"));
  setStaticText("#renameDeckButton", getUiText("decks.saveDeckName"));
  setStaticText("#newDeckButton", getUiText("decks.newDeck"));
  setStaticText("#duplicateDeckButton", getUiText("decks.duplicateDeck"));
  setStaticText("#deleteDeckButton", getUiText("decks.deleteDeck"));
  setStaticText("#activeDeckHeading", getUiText("decks.activeDeckTitle"));
  setStaticText("#savedDecksHeading", getUiText("decks.savedDecksTitle"));
  setStaticText("#deckAddCardsHeading", getUiText("decks.addCardsTitle"));
  setStaticText("#deckAddCardsNote", getUiText("decks.addCardsNote"));
  setStaticText("#deckCodeEyebrow", getUiText("decks.codeEyebrow"));
  setStaticText("#deckCodeHeading", getUiText("decks.codeTitle"));
  setStaticText("#deckCodeNote", getUiText("decks.codeNote"));
  setStaticText("#deckCodeLabel", getUiText("decks.codeLabel"));
  setStaticAttribute("#deckCodeInput", "placeholder", getUiText("decks.codePlaceholder"));
  setStaticText("#copyDeckCodeButton", getUiText("decks.copyCode"));
  setStaticText("#importDeckCodeButton", getUiText("decks.importCode"));
  setStaticText("#clearDeckCodeButton", getUiText("decks.clearCode"));

  setStaticText("#wikiSection .section-head .eyebrow", getUiText("nav.wiki"));
  setStaticText("#wikiSection .section-head h2", getUiText("sections.wikiTitle"));
  setStaticText("#wikiSection .section-note", getUiText("sections.wikiNote"));

  setStaticText("#profileSection .section-head .eyebrow", getUiText("nav.profile"));
  setStaticText("#profileSection .section-head h2", getUiText("sections.profileTitle"));
  setStaticText("#profileSection .section-note", getUiText("sections.profileNote"));
  setStaticText("#profileSection .profile-column:first-child .info-panel:nth-child(2) .subheading", getUiText("profile.renameTitle"));
  setStaticText("#profileSection .profile-column:first-child .info-panel:nth-child(2) .mini-note", getUiText("profile.renameNote"));
  setStaticText("#profileRenameForm label:nth-of-type(1) span", getUiText("profile.newUsername"));
  setStaticText("#profileRenameForm label:nth-of-type(2) span", getUiText("profile.currentPassword"));
  setStaticText("#profileRenameForm button", getUiText("profile.saveUsername"));
  setStaticText("#profileSection .profile-column:last-child .info-panel:first-child .subheading", getUiText("profile.passwordTitle"));
  setStaticText("#profileSection .profile-column:last-child .info-panel:first-child .mini-note", getUiText("profile.passwordNote"));
  setStaticText("#profilePasswordForm label:nth-of-type(1) span", getUiText("profile.currentPassword"));
  setStaticText("#profilePasswordForm label:nth-of-type(2) span", getUiText("profile.newPassword"));
  setStaticText("#profilePasswordForm label:nth-of-type(3) span", getUiText("profile.confirmPassword"));
  setStaticText("#profilePasswordForm button", getUiText("profile.updatePassword"));
  setStaticText("#profileSection .profile-security-panel .subheading", getUiText("profile.serverTitle"));
  setStaticText("#profileSection .profile-security-panel .profile-bullet-list p:nth-child(1)", getUiText("profile.bullet1"));
  setStaticText("#profileSection .profile-security-panel .profile-bullet-list p:nth-child(2)", getUiText("profile.bullet2"));
  setStaticText("#profileSection .profile-security-panel .profile-bullet-list p:nth-child(3)", getUiText("profile.bullet3"));
  setStaticText("#profileSection .profile-danger-note", getUiText("profile.dangerNote"));
  setStaticText("#resetLocalDataButton", getUiText("profile.resetAccount"));

  setStaticText("#friendsSection .section-head .eyebrow", getUiText("nav.friends"));
  setStaticText("#friendsSection .section-head h2", getUiText("sections.friendsTitle"));
  setStaticText("#friendsSection .section-note", getUiText("sections.friendsNote"));

  setStaticText("#settingsSection .section-head .eyebrow", getUiText("nav.settings"));
  setStaticText("#settingsSection .section-head h2", getUiText("sections.settingsTitle"));
  setStaticText("#settingsSection .section-note", getUiText("sections.settingsNote"));
  setStaticText("#settingsSection .profile-column .info-panel:first-child .subheading", getUiText("settings.displayTitle"));
  setStaticText("#settingsSection .settings-language-field span", getUiText("settings.language"));
  setStaticText("#settingsSection .settings-option:nth-of-type(1) strong", getUiText("settings.clickTitle"));
  setStaticText("#settingsSection .settings-option:nth-of-type(1) span", getUiText("settings.clickNote"));
  setStaticText("#settingsSection .settings-option:nth-of-type(2) strong", getUiText("settings.packTitle"));
  setStaticText("#settingsSection .settings-option:nth-of-type(2) span", getUiText("settings.packNote"));
  setStaticText("#settingsSection .settings-option:nth-of-type(3) strong", getUiText("settings.motionTitle"));
  setStaticText("#settingsSection .settings-option:nth-of-type(3) span", getUiText("settings.motionNote"));
  setStaticText("#settingsSection .settings-option:nth-of-type(4) strong", getUiText("settings.confirmTitle"));
  setStaticText("#settingsSection .settings-option:nth-of-type(4) span", getUiText("settings.confirmNote"));
  setStaticText("#resetSettingsButton", getUiText("settings.resetButton"));
  setStaticText("#settingsSection .settings-session-panel .subheading", getUiText("settings.sessionTitle"));
  setStaticText("#settingsSection .settings-session-panel .mini-note", getUiText("settings.sessionNote"));
  setStaticText("#logoutButton", getUiText("settings.logout"));

  setStaticText("#adminSection .section-head .eyebrow", getUiText("nav.admin"));
  setStaticText("#adminSection .section-head h2", getUiText("sections.adminTitle"));
  setStaticText("#adminSection .section-note", getUiText("sections.adminNote"));
  setStaticText("#adminSection .admin-layout > .info-panel:first-child .subheading", getUiText("admin.allAccounts"));
  setStaticText("#adminSection .admin-layout > .info-panel:last-child .subheading", getUiText("admin.selectedAccount"));
  setStaticText("#adminCreateAccountSummary", getUiText("admin.createAccount"));
  setStaticText("#adminCreateUsernameLabel", getUiText("admin.createUsername"));
  setStaticText("#adminCreatePasswordLabel", getUiText("admin.createPassword"));
  setStaticText('#adminSection details:nth-of-type(2) > summary', getUiText("admin.economics"));
  setStaticText('#adminSection details:nth-of-type(3) > summary', getUiText("admin.packInventory"));
  setStaticText('#adminSection details:nth-of-type(4) > summary', getUiText("admin.cardCollection"));
  setStaticText('#adminSection details:nth-of-type(5) > summary', getUiText("admin.accountActions"));
  setStaticText("#adminSection details:nth-of-type(2) label span", getUiText("admin.goldAmount"));
  setStaticText("#adminSection details:nth-of-type(3) label:nth-of-type(1) span", getUiText("admin.packType"));
  setStaticText("#adminSection details:nth-of-type(3) label:nth-of-type(2) span", getUiText("admin.packAmount"));
  setStaticText("#adminSection details:nth-of-type(4) label:nth-of-type(1) span", getUiText("admin.card"));
  setStaticText("#adminSection details:nth-of-type(4) label:nth-of-type(2) span", getUiText("admin.cardAmount"));
  setStaticText("#createAccountButton", getUiText("admin.createButton"));
  setStaticText("#grantGoldButton", getUiText("admin.grantGold"));
  setStaticText("#removeGoldButton", getUiText("admin.removeGold"));
  setStaticText("#grantPackButton", getUiText("admin.grantPack"));
  setStaticText("#removePackButton", getUiText("admin.removePack"));
  setStaticText("#grantCardButton", getUiText("admin.grantCard"));
  setStaticText("#removeCardButton", getUiText("admin.removeCard"));
  setStaticText("#adminSection details:nth-of-type(5) .danger-note", getUiText("admin.dangerNote"));
  setStaticText("#deleteAccountButton", getUiText("admin.deleteAccount"));

  setStaticText("#arenaSection .section-head .eyebrow", getUiText("nav.arena"));
  setStaticText("#arenaSection .section-head h2", getUiText("sections.arenaTitle"));
  setStaticText(".arena-difficulty-field span", getUiText("arena.difficulty"));
  setStaticText("#resetMatchButton", getUiText("arena.resetMatch"));
  setStaticText("#startMatchButton", getUiText("arena.startMatch"));
  setStaticText("#arenaSection .hand-head .subheading", getUiText("arena.handTitle"));
  setStaticText("#endTurnButton", getUiText("arena.endTurn"));

  setStaticAttribute("#closeCardModalButton", "aria-label", getCurrentLanguage() === "fr" ? "Fermer la fenêtre de détail" : getCurrentLanguage() === "en" ? "Close detail view" : "Detailfenster schließen");
}

overrideArcaneVaultSystems();
bootstrap();

function overrideArcaneVaultSystems() {
  const describeEffectText = (effect) => {
    switch (effect?.kind) {
      case "damageHero":
        return `Verursacht ${effect.value} direkten Schaden am gegnerischen Helden.`;
      case "healHero":
        return `Heilt deinen Helden um ${effect.value}.`;
      case "draw":
        return `Ziehe ${effect.value} Karte${effect.value > 1 ? "n" : ""}.`;
      case "gainMana":
        return `Erhalte sofort ${effect.value} zusätzliches Mana.`;
      case "gainMaxMana":
        return `Erhöhe dein maximales Mana dauerhaft um ${effect.value}.`;
      case "buffBoard":
        return `Deine Einheiten erhalten +${effect.attack}/+${effect.health}.`;
      case "fortifyBoard":
        return `Dein Held und alle eigenen Einheiten erhalten +${effect.value} Haltbarkeit.`;
      case "healBoard":
        return `Heilt deinen Helden und alle eigenen Einheiten um ${effect.value}.`;
      case "strikeWeakest":
        return `Trifft die schwächste gegnerische Einheit oder den Helden für ${effect.value}.`;
      case "damageAllEnemies":
        return `Verursacht ${effect.value} Schaden an allen gegnerischen Einheiten.`;
      case "burnWeakest":
        return `Belegt die schwächste gegnerische Einheit ${effect.turns} Runden lang mit Brand (${effect.value} Schaden pro Zug).`;
      case "freezeWeakest":
        return `Friert die schwächste gegnerische Einheit für ${effect.turns} Runde${effect.turns > 1 ? "n" : ""} ein.`;
      case "poisonWeakest":
        return `Vergiftet die schwächste gegnerische Einheit für ${effect.turns} Runde${effect.turns > 1 ? "n" : ""} (${effect.value} Schaden am Zugende).`;
      case "barrierStrongest":
        return "Gibt deiner stärksten Einheit eine Barriere gegen den nächsten Schaden.";
      case "barrierHero":
        return `Gibt deinem Helden ${effect.value} Schild.`;
      case "summonTokens": {
        const token = TOKEN_CARD_MAP.get(effect.tokenId);
        return `Beschwört ${effect.amount}× ${token ? token.name : "Token"}.`;
      }
      case "weakenEnemies":
        return `Verringert den Angriff aller gegnerischen Einheiten um ${effect.value}.`;
      case "drainHero":
        return `Entzieht dem gegnerischen Helden ${effect.damage} Leben und heilt dich um ${effect.heal}.`;
      case "readyStrongest":
        return `Macht deine stärkste Einheit sofort angreifbar${effect.attackBonus ? ` und gibt ihr +${effect.attackBonus} Angriff` : ""}.`;
      case "empowerUnit":
        return `Verstärkt deine zuletzt ausgespielte Einheit um +${effect.attack}/+${effect.health}.`;
      default:
        return "Löst einen ungewöhnlichen Effekt aus.";
    }
  };

  const buildDescriptionLocal = (type, effect, keywords = [], synergy = null, timing = null, deathEffect = null, isToken = false) => {
    const effects = normalizeEffectList(effect);
    const parts = effects.length
      ? effects.map((entry, index) => {
        const opener = index === 0 ? (type === "unit" ? "Beim Ausspielen" : "Effekt") : "Außerdem";
        return `${opener}: ${describeEffectText(entry)}`;
      })
      : [isToken ? "Beschworene Token-Einheit." : "Eine solide Karte ohne Zusatzeffekt."];

    if (keywords.length) {
      parts.push(`Schlüsselwörter: ${keywords.map((keyword) => KEYWORD_META[keyword].label).join(", ")}.`);
    }
    if (synergy) {
      parts.push(`Synergie: Aktiv mit ${describeSynergyCondition(synergy.condition)}.`);
    }
    if (timing) {
      parts.push(`Timing: ${describeTiming(timing)}.`);
    }
    if (deathEffect) {
      parts.push(`Todeseffekt: ${describeEffectText(deathEffect)}`);
    }

    return parts.join(" ");
  };

  const createDeathEffectPayload = (kind, rarity, factionId) => {
    const rank = RARITY_ORDER.indexOf(rarity);
    switch (kind) {
      case "healHero":
        return { kind, value: 2 + Math.floor(rank / 3) };
      case "fortifyBoard":
        return { kind, value: 1 + Number(rank >= 5) };
      case "barrierHero":
        return { kind, value: 2 + Number(rank >= 4) };
      case "summonTokens":
        return { kind, tokenId: TOKEN_IDS_BY_FACTION[factionId], amount: 1 + Number(rank >= 6) };
      case "poisonWeakest":
        return { kind, value: 1, turns: 2 + Number(rank >= 5) };
      case "burnWeakest":
        return { kind, value: 1, turns: 1 + Number(rank >= 6) };
      case "weakenEnemies":
        return { kind, value: 1 };
      default:
        return { kind: "draw", value: 1 + Number(rank >= 6) };
    }
  };

  getCard = function getCard(cardId) {
    return CARD_MAP.get(cardId) || TOKEN_CARD_MAP.get(cardId);
  };

  bindStaticEvents = function bindStaticEvents() {
    elements.authTabs.forEach((button) => {
      button.addEventListener("click", () => switchAuthMode(button.dataset.authMode));
    });

    elements.loginForm.addEventListener("submit", handleLogin);
    elements.registerForm.addEventListener("submit", handleRegister);
    elements.profileRenameForm.addEventListener("submit", handleProfileRename);
    elements.profilePasswordForm.addEventListener("submit", handleProfilePasswordChange);

    elements.navButtons.forEach((button) => {
      button.addEventListener("click", () => {
        requestSectionChange(button.dataset.section);
      });
    });

    elements.logoutButton.addEventListener("click", logout);
    elements.resetLocalDataButton.addEventListener("click", resetCurrentAccount);

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

    elements.marketResetFiltersButton.addEventListener("click", resetMarketFilters);

    elements.wikiSearchInput.addEventListener("input", (event) => {
      uiState.wikiSearch = event.target.value;
      renderWiki();
    });
    elements.wikiTopicRow.addEventListener("click", handleWikiTopicClick);
    elements.wikiSummary.addEventListener("click", handleWikiSummaryClick);

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
    elements.deckModeSelect.addEventListener("change", handleDeckModeChange);
    elements.deckCodeInput.addEventListener("input", (event) => {
      uiState.deckCodeDraft = event.target.value;
      syncDeckCodeControls();
    });
    elements.copyDeckCodeButton.addEventListener("click", copyActiveDeckCode);
    elements.importDeckCodeButton.addEventListener("click", importDeckCode);
    elements.clearDeckCodeButton.addEventListener("click", clearDeckCodeInput);

    Object.keys(SETTINGS_INPUT_MAP).forEach((elementKey) => {
      elements[elementKey].addEventListener("change", handleSettingsToggle);
    });
    elements.arenaDifficultySelect.addEventListener("change", handleArenaDifficultyChange);
    elements.settingsLanguageSelect.addEventListener("change", handleLanguageChange);
    elements.resetSettingsButton.addEventListener("click", resetCurrentSettings);

    elements.startMatchButton.addEventListener("click", startMatch);
    elements.endTurnButton.addEventListener("click", endPlayerTurn);
    elements.resetMatchButton.addEventListener("click", clearMatch);

    elements.createAccountButton.addEventListener("click", createAdminAccount);
    elements.grantGoldButton.addEventListener("click", grantGoldToSelectedAccount);
    elements.removeGoldButton.addEventListener("click", removeGoldFromSelectedAccount);
    elements.grantPackButton.addEventListener("click", grantPacksToSelectedAccount);
    elements.removePackButton.addEventListener("click", removePacksFromSelectedAccount);
    elements.grantCardButton.addEventListener("click", grantCardsToSelectedAccount);
    elements.removeCardButton.addEventListener("click", removeCardsFromSelectedAccount);
    elements.deleteAccountButton.addEventListener("click", deleteSelectedAccount);

    elements.closeCardModalButton.addEventListener("click", closeCardModal);
    elements.cardModal.addEventListener("click", (event) => {
      if (event.target === elements.cardModal) {
        closeCardModal();
      }
    });

    window.addEventListener("scroll", updateFloatingResourceBarVisibility, { passive: true });
    window.addEventListener("resize", updateFloatingResourceBarVisibility);
    window.addEventListener("focus", () => {
      scheduleServerLiveRefresh({ force: true });
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        scheduleServerLiveRefresh({ force: true, delay: 120 });
      }
    });
  };

  validateDeck = function validateDeck(deck, mode = DECK_MODES.standard) {
    const deckMode = getDeckModeId(mode);
    const rules = getDeckRules(deckMode);
    const messages = [];
    if (!deck) {
      return { valid: false, messages: [getUiText("messages.deckMissing")] };
    }
    if (deck.cards.length !== rules.size) {
      messages.push(getUiText("messages.deckSize", { count: deck.cards.length, size: rules.size }));
    }

    const spellCount = getDeckTypeCount(deck, "spell");
    const trainerCount = getDeckTypeCount(deck, "trainer");
    if (spellCount > rules.maxSpells) {
      messages.push(getUiText("messages.deckSpellLimit", { count: spellCount, limit: rules.maxSpells }));
    }
    if (trainerCount > rules.maxTrainers) {
      messages.push(getUiText("messages.deckTrainerLimit", { count: trainerCount, limit: rules.maxTrainers }));
    }

    const required = countCards(deck.cards);
    Object.entries(required).forEach(([cardId, count]) => {
      const card = getCard(cardId);
      if (!card) {
        messages.push(getUiText("messages.deckUnavailableCard"));
        return;
      }
      const owned = getOwnedCopies(cardId);
      const limit = getDeckCopyLimit(cardId);
      if (owned < count) {
        messages.push(getUiText("messages.deckMissingOwned", { missing: count - owned, name: card.name }));
      }
      if (count > limit) {
        messages.push(getUiText("messages.deckLimitExceeded", { name: card.name, limit }));
      }
    });

    return { valid: messages.length === 0, messages };
  };

  canAddCardToActiveDeck = function canAddCardToActiveDeck(cardId) {
    const deckMode = getSelectedDeckMode();
    const activeDeck = getDeckByMode(deckMode);
    const rules = getDeckRules(deckMode);
    const card = getCard(cardId);
    const deckCopies = countCopiesInArray(activeDeck.cards, cardId);
    const nextSpellCount = card?.type === "spell" ? getDeckTypeCount(activeDeck, "spell") + 1 : getDeckTypeCount(activeDeck, "spell");
    const nextTrainerCount = card?.type === "trainer" ? getDeckTypeCount(activeDeck, "trainer") + 1 : getDeckTypeCount(activeDeck, "trainer");
    return activeDeck.cards.length < rules.size
      && deckCopies < getOwnedCopies(cardId)
      && deckCopies < getDeckCopyLimit(cardId)
      && nextSpellCount <= rules.maxSpells
      && nextTrainerCount <= rules.maxTrainers;
  };

  renderHeroPanel = function renderHeroPanel(container, label, sideState, active, side = "enemy") {
    const deckCount = Array.isArray(sideState.deck) ? sideState.deck.length : APP_CONFIG.deckSize;
    const healthPct = clamp(0, 100, Math.round((sideState.hero / APP_CONFIG.heroHealth) * 100));
    const manaCap = Math.max(1, sideState.maxMana || APP_CONFIG.maxMana);
    const manaPct = clamp(0, 100, Math.round((sideState.mana / manaCap) * 100));
    const barrierChip = sideState.heroBarrier > 0 ? `<span class="meta-chip">${getUiText("arena.shield", { value: sideState.heroBarrier })}</span>` : "";
    container.dataset.side = side;
    container.dataset.targetType = "hero";
    container.innerHTML = `
      <p class="eyebrow">${label}</p>
      <div class="hero-line">
        <div class="hero-primary">
          <strong>${sideState.hero}</strong>
          <span>${getUiText("arena.life")}</span>
        </div>
        <span class="status-pill ${active ? "turn" : "ok"}">${active ? (getCurrentLanguage() === "fr" ? "Actif" : getCurrentLanguage() === "en" ? "Active" : "Aktiv") : (getCurrentLanguage() === "fr" ? "En attente" : getCurrentLanguage() === "en" ? "Waiting" : "Wartet")}</span>
      </div>
      <div class="hero-meter-stack">
        <div class="hero-meter-row">
          <span>${getUiText("arena.life")}</span>
          <strong>${sideState.hero}/${APP_CONFIG.heroHealth}</strong>
        </div>
        <div class="hero-meter life">
          <span style="width:${healthPct}%"></span>
        </div>
        <div class="hero-meter-row">
          <span>${getCurrentLanguage() === "fr" ? "Mana" : getCurrentLanguage() === "en" ? "Mana" : "Mana"}</span>
          <strong>${sideState.mana}/${manaCap}</strong>
        </div>
        <div class="hero-meter mana">
          <span style="width:${manaPct}%"></span>
        </div>
      </div>
      <div class="meta-chip-row">
        <span class="meta-chip">${getUiText("arena.mana", { current: sideState.mana, max: sideState.maxMana })}</span>
        <span class="meta-chip">${getUiText("arena.hand", { count: sideState.hand.length })}</span>
        <span class="meta-chip">${getUiText("arena.field", { count: sideState.board.length, size: APP_CONFIG.boardSize })}</span>
        <span class="meta-chip">${getCurrentLanguage() === "fr" ? `Deck ${deckCount}` : getCurrentLanguage() === "en" ? `Deck ${deckCount}` : `Deck ${deckCount}`}</span>
        ${barrierChip}
      </div>
    `;
  };

  buildStatusSummary = function buildStatusSummary(statuses) {
    if (!statuses.length) {
      return "";
    }
    return statuses.map((status) => {
      const label = getStatusLabel(status.kind);
      if (status.kind === "barrier") {
        return label;
      }
      return status.turns ? `${label} ${status.turns}` : label;
    }).join(" · ");
    return statuses.map((status) => {
      const meta = STATUS_META[status.kind];
      if (!meta) {
        return status.kind;
      }
      if (status.kind === "barrier") {
        return meta.label;
      }
      return status.turns ? `${meta.label} ${status.turns}` : meta.label;
    }).join(" · ");
  };

  const dealDamageToHero = (side, damage, message = "") => {
    if (!uiState.match || damage <= 0) {
      return 0;
    }

    const target = uiState.match[side];
    let remaining = damage;

    if (target.heroBarrier > 0) {
      const absorbed = Math.min(target.heroBarrier, remaining);
      target.heroBarrier -= absorbed;
      remaining -= absorbed;
      addLog(`${side === "player" ? "Deine" : "Die gegnerische"} Heldenbarriere absorbiert ${absorbed} Schaden.`);
    }

    if (remaining <= 0) {
      return 0;
    }

    target.hero -= remaining;
    if (message) {
      addLog(`${message} für ${remaining}.`);
    }
    if (target.hero <= 0 && uiState.match.status === "active") {
      finishMatch(side === "player" ? "lost" : "won", side === "player" ? "Dein Held wurde besiegt." : "Der gegnerische Held wurde besiegt.");
    }
    return remaining;
  };

  const addHeroBarrier = (side, value, sourceName) => {
    uiState.match[side].heroBarrier += value;
    addLog(`${sourceName} stärkt ${side === "player" ? "deinen" : "den gegnerischen"} Helden mit ${value} Schild.`);
  };

  const createBattleUnit = (card) => ({
    uid: nextUnitId(),
    cardId: card.id,
    attack: card.attack,
    health: card.health,
    maxHealth: card.health,
    canAttack: card.keywords?.includes("charge") || false,
    keywords: [...(card.keywords || [])],
    statuses: [],
  });

  const processTurnEndStatuses = (unit, side) => {
    if (!Array.isArray(unit.statuses) || !unit.statuses.length) {
      return;
    }

    const nextStatuses = [];
    unit.statuses.forEach((status) => {
      switch (status.kind) {
        case "poison":
          dealDamageToUnit(unit, status.value, `${getCard(unit.cardId).name} leidet unter Gift`, side);
          if (status.turns > 1) {
            nextStatuses.push({ ...status, turns: status.turns - 1 });
          }
          break;
        case "burn":
        case "freeze":
        case "barrier":
          nextStatuses.push(status);
          break;
        default:
          break;
      }
    });
    unit.statuses = nextStatuses;
  };

  const processTurnEnd = (side) => {
    const actor = uiState.match[side];
    actor.board.forEach((unit) => processTurnEndStatuses(unit, side));
    cleanupBoards();
  };

  createSideState = function createSideState(deckCards, options = {}) {
    const shuffledDeck = shuffle([...deckCards]);
    return {
      hero: APP_CONFIG.heroHealth,
      heroBarrier: 0,
      maxMana: sanitizeFiniteInteger(options.startingMaxMana, APP_CONFIG.startingMana, 0, APP_CONFIG.maxMana),
      mana: sanitizeFiniteInteger(options.startingMana, APP_CONFIG.startingMana, 0, APP_CONFIG.maxMana),
      turnsStarted: sanitizeFiniteInteger(options.turnsStarted, 0, 0, 99),
      deck: shuffledDeck,
      hand: [],
      board: [],
      cooldowns: {},
      fatigueDamage: APP_CONFIG.fatigueBaseDamage,
      deckProfile: analyzeDeck(shuffledDeck),
    };
  };

  drawCards = function drawCards(side, amount) {
    const match = uiState.match;
    const actor = match[side];

    for (let index = 0; index < amount; index += 1) {
      if (!actor.deck.length) {
        const subject = side === "player" ? "Du" : "Der Gegner";
        dealDamageToHero(side, actor.fatigueDamage, `${subject} erleidet Ermüdungsschaden`);
        actor.fatigueDamage += 1;
        if (match.status !== "active") {
          return;
        }
        continue;
      }
      actor.hand.push(actor.deck.shift());
    }
  };

  endPlayerTurn = function endPlayerTurn() {
    const match = uiState.match;
    if (!match || match.phase !== "player" || match.status !== "active") {
      return;
    }
    processTurnEnd("player");
    if (match.status === "active") {
      startTurn("enemy");
    }
    renderArena();
  };

  strikeWeakestEnemy = function strikeWeakestEnemy(owner, value, sourceName) {
    const enemySide = owner === "player" ? "enemy" : "player";
    const target = selectWeakestUnit(getAttackableEnemyUnits(owner));
    if (!target) {
      dealDamageToHero(enemySide, value, `${sourceName} trifft den Helden direkt`);
      return;
    }
    dealDamageToUnit(target, value, `${sourceName} trifft ${getCard(target.cardId).name}`, enemySide);
  };

  resolveCombat = async function resolveCombat(attacker, owner) {
    const match = uiState.match;
    const enemySide = owner === "player" ? "enemy" : "player";
    const enemy = match[enemySide];
    const actor = match[owner];
    const target = selectWeakestUnit(getAttackableEnemyUnits(owner));
    attacker.canAttack = false;

    await playCombatAnimation(attacker, owner, target);

    if (!target) {
      dealDamageToHero(enemySide, attacker.attack, `${getCard(attacker.cardId).name} trifft den Helden`);
      applyLifesteal(attacker, owner, attacker.attack);
      return;
    }

    addLog(`${getCard(attacker.cardId).name} greift ${getCard(target.cardId).name} an.`);
    const damageToTarget = dealDamageToUnit(target, attacker.attack, "", enemySide);
    const damageToAttacker = dealDamageToUnit(attacker, target.attack, "", owner);
    applyLifesteal(attacker, owner, damageToTarget);
    applyLifesteal(target, enemySide, damageToAttacker);
    cleanupBoards();

    if (!actor.board.includes(attacker)) {
      addLog(`${getCard(attacker.cardId).name} fällt im Gegenangriff.`);
    }
    if (!enemy.board.includes(target)) {
      addLog(`${getCard(target.cardId).name} wird zerstört.`);
    }
  };

  runEnemyTurn = async function runEnemyTurn() {
    const match = uiState.match;
    if (!match || match.status !== "active" || match.enemyBusy) {
      return;
    }

    match.enemyBusy = true;
    const enemy = match.enemy;
    const motion = getArenaMotionPreset();
    let plays = 0;

    renderArena();
    await waitForArenaMotion(motion.enemyThinkMs);

    while (plays < 2) {
      const playableIndex = chooseEnemyCardIndex();
      if (playableIndex === -1) {
        break;
      }

      const cardId = enemy.hand.splice(playableIndex, 1)[0];
      const card = getCard(cardId);
      enemy.mana -= card.cost;
      resolveCardPlay(card, "enemy");
      plays += 1;
      afterActionCheck();
      renderArena();
      await waitForArenaMotion(motion.enemyStepMs);

      if (match.status !== "active") {
        match.enemyBusy = false;
        renderArena();
        return;
      }
    }

    const attackers = enemy.board.filter((unit) => unit.canAttack);
    for (const unit of attackers) {
      if (match.status !== "active") {
        break;
      }
      if (!enemy.board.some((entry) => entry.uid === unit.uid) || !unit.canAttack) {
        continue;
      }
      await resolveCombat(unit, "enemy");
      afterActionCheck();
      renderArena();
      await waitForArenaMotion(motion.enemyStepMs);
    }

    if (match.status === "active") {
      processTurnEnd("enemy");
    }
    if (match.status === "active") {
      match.enemyBusy = false;
      startTurn("player");
    } else {
      match.enemyBusy = false;
    }

    renderArena();
  };

  cleanupBoards = function cleanupBoards() {
    const match = uiState.match;
    if (!match) {
      return;
    }

    let pending = true;
    while (pending && match.status === "active") {
      pending = false;
      ["player", "enemy"].forEach((side) => {
        const fallen = match[side].board.filter((unit) => unit.health <= 0);
        if (!fallen.length) {
          match[side].board = match[side].board.filter((unit) => unit.health > 0);
          return;
        }

        pending = true;
        match[side].board = match[side].board.filter((unit) => unit.health > 0);
        fallen.forEach((unit) => {
          const card = getCard(unit.cardId);
          if (card?.deathEffect) {
            addLog(`${card.name} löst beim Zerfall einen Todeseffekt aus.`);
            applyEffect(card.deathEffect, side, `${card.name} [Tod]`);
          }
        });
      });
    }
  };

  processTurnStartStatuses = function processTurnStartStatuses(unit, side) {
    if (!Array.isArray(unit.statuses) || !unit.statuses.length) {
      return;
    }

    const nextStatuses = [];
    unit.statuses.forEach((status) => {
      switch (status.kind) {
        case "burn":
          dealDamageToUnit(unit, status.value, `${getCard(unit.cardId).name} leidet unter Brand`, side);
          if (status.turns > 1) {
            nextStatuses.push({ ...status, turns: status.turns - 1 });
          }
          break;
        case "freeze":
          unit.canAttack = false;
          addLog(`${getCard(unit.cardId).name} ist eingefroren und kann nicht angreifen.`);
          if (status.turns > 1) {
            nextStatuses.push({ ...status, turns: status.turns - 1 });
          }
          break;
        case "poison":
        case "barrier":
          nextStatuses.push(status);
          break;
        default:
          break;
      }
    });
    unit.statuses = nextStatuses;
  };
}

function bootstrap() {
  bindStaticEvents();
  populateFilterControls();
  initializeVisualEffects();
  syncMarketState();
  window.setInterval(handleMarketTick, 60000);
  if (!SERVER_LIVE_SYNC.intervalId) {
    SERVER_LIVE_SYNC.intervalId = window.setInterval(handleServerLiveTick, LIVE_SYNC_CONFIG.intervalMs);
  }
  renderAll();
  void initializeServerSession();
}

function initializeVisualEffects() {
  if (uiState.visualFxReady) {
    return;
  }

  document.addEventListener?.("pointerdown", handleSurfacePress, true);
  uiState.visualFxReady = true;
}

function handleSurfacePress(event) {
  if (!getUserSettings().clickEffects || getUserSettings().reducedMotion) {
    return;
  }

  const surface = event.target.closest("button, .clickable-card, .pack-card, .saved-deck-card, .admin-account-card, .resource-chip");

  if (!surface || surface.disabled) {
    return;
  }

  spawnSurfaceRipple(surface, event.clientX, event.clientY);
}

function spawnSurfaceRipple(surface, clientX, clientY) {
  const rect = surface.getBoundingClientRect?.();

  if (!rect) {
    return;
  }

  const ripple = document.createElement("span");
  ripple.className = "surface-ripple";
  ripple.style.left = `${clientX - rect.left}px`;
  ripple.style.top = `${clientY - rect.top}px`;
  surface.append(ripple);
  window.setTimeout(() => ripple.remove(), 720);
}

function applySceneTheme(sceneKey, animate = false) {
  const scene = SECTION_SCENE_META[sceneKey] || SECTION_SCENE_META.shop;
  const localizedScene = getUiText(`scene.${sceneKey}`) || scene;
  const settings = getUserSettings();
  if (!elements.sceneBanner || !elements.sceneBannerEyebrow || !elements.sceneBannerTitle || !elements.sceneBannerText) {
    return;
  }

  if (document.body?.dataset) {
    document.body.dataset.scene = scene.theme;
  }
  elements.gameShell.dataset.scene = scene.theme;
  elements.sceneBanner.dataset.scene = scene.theme;
  elements.sceneBannerEyebrow.textContent = localizedScene.eyebrow || scene.eyebrow;
  elements.sceneBannerTitle.textContent = localizedScene.title || scene.title;
  elements.sceneBannerText.textContent = localizedScene.text || scene.text;

  if (settings.reducedMotion) {
    animate = false;
  }

  if (!animate || uiState.lastSceneTheme === scene.theme) {
    uiState.lastSceneTheme = scene.theme;
    return;
  }

  elements.sceneBanner.classList.remove("scene-banner-enter");
  void elements.sceneBanner.offsetWidth;
  elements.sceneBanner.classList.add("scene-banner-enter");
  uiState.lastSceneTheme = scene.theme;

  if (!settings.reducedMotion) {
    createFxPulse({
      theme: scene.theme,
      x: window.innerWidth ? window.innerWidth * 0.72 : 860,
      y: 160,
      size: 180,
    });
  }
}

function createFxPulse({ theme = "shop", x = 0, y = 0, size = 160 }) {
  if (!elements.fxLayer || getUserSettings().reducedMotion) {
    return;
  }

  const pulse = document.createElement("span");
  pulse.className = `fx-pulse fx-pulse-${theme}`;
  pulse.style.left = `${x}px`;
  pulse.style.top = `${y}px`;
  pulse.style.width = `${size}px`;
  pulse.style.height = `${size}px`;
  elements.fxLayer.append(pulse);
  window.setTimeout(() => pulse.remove(), 1200);
}

function getHighestRarity(cards) {
  return [...cards].sort((left, right) => RARITY_ORDER.indexOf(right.rarity) - RARITY_ORDER.indexOf(left.rarity))[0]?.rarity || "common";
}

function playPackOpeningSequence(cards, packId) {
  if (!elements.openingStage || !elements.openedCardsGrid || !elements.openingBurst) {
    return;
  }

  const settings = getUserSettings();
  const highestRarity = getHighestRarity(cards);
  const cardElements = [...elements.openedCardsGrid.querySelectorAll(".game-card")];
  elements.openingStage.dataset.pack = packId;
  elements.openingStage.dataset.highlight = highestRarity;
  elements.openingStage.classList.remove("is-opening");
  elements.openingBurst.classList.add("hidden");
  elements.openingBurst.innerHTML = cards
    .map((card) => `<span class="opening-shard rarity-${card.rarity}"></span>`)
    .join("");

  cardElements.forEach((cardElement, index) => {
    cardElement.classList.remove("reveal-card");
    cardElement.style.setProperty("--reveal-delay", settings.reducedMotion ? "0ms" : `${index * 110}ms`);
    cardElement.dataset.revealRarity = cards[index]?.rarity || "common";
    if (!settings.reducedMotion && settings.packEffects) {
      void cardElement.offsetWidth;
      cardElement.classList.add("reveal-card");
    }
  });

  if (uiState.openingFxTimer) {
    window.clearTimeout(uiState.openingFxTimer);
    uiState.openingFxTimer = null;
  }

  if (settings.reducedMotion || !settings.packEffects) {
    return;
  }

  window.requestAnimationFrame?.(() => {
    elements.openingStage.classList.add("is-opening");
  });

  uiState.openingFxTimer = window.setTimeout(() => {
    elements.openingBurst.classList.remove("hidden");
  }, 180);

  createFxPulse({
    theme: highestRarity === "transcendent" || highestRarity === "mythic" ? "booster-rare" : "booster",
    x: window.innerWidth ? window.innerWidth * 0.66 : 820,
    y: 280,
    size: highestRarity === "transcendent" ? 300 : 220,
  });
}

function bindStaticEvents() {
  elements.authTabs.forEach((button) => {
    button.addEventListener("click", () => switchAuthMode(button.dataset.authMode));
  });

  elements.loginForm.addEventListener("submit", handleLogin);
  elements.registerForm.addEventListener("submit", handleRegister);
  elements.profileRenameForm.addEventListener("submit", handleProfileRename);
  elements.profilePasswordForm.addEventListener("submit", handleProfilePasswordChange);

  elements.navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      requestSectionChange(button.dataset.section);
    });
  });

  elements.logoutButton.addEventListener("click", logout);
  elements.resetLocalDataButton.addEventListener("click", resetCurrentAccount);

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

  elements.marketResetFiltersButton.addEventListener("click", resetMarketFilters);

  elements.wikiSearchInput.addEventListener("input", (event) => {
    uiState.wikiSearch = event.target.value;
    renderWiki();
  });
  elements.wikiTopicRow.addEventListener("click", handleWikiTopicClick);
  elements.wikiSummary.addEventListener("click", handleWikiSummaryClick);

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
  elements.deckModeSelect.addEventListener("change", handleDeckModeChange);
  elements.deckCodeInput.addEventListener("input", (event) => {
    uiState.deckCodeDraft = event.target.value;
    syncDeckCodeControls();
  });
  elements.copyDeckCodeButton.addEventListener("click", copyActiveDeckCode);
  elements.importDeckCodeButton.addEventListener("click", importDeckCode);
  elements.clearDeckCodeButton.addEventListener("click", clearDeckCodeInput);

  Object.keys(SETTINGS_INPUT_MAP).forEach((elementKey) => {
    elements[elementKey].addEventListener("change", handleSettingsToggle);
  });
  elements.arenaDifficultySelect.addEventListener("change", handleArenaDifficultyChange);
  elements.settingsLanguageSelect.addEventListener("change", handleLanguageChange);
  elements.resetSettingsButton.addEventListener("click", resetCurrentSettings);

  elements.startMatchButton.addEventListener("click", startMatch);
  elements.endTurnButton.addEventListener("click", endPlayerTurn);
  elements.resetMatchButton.addEventListener("click", clearMatch);

  elements.createAccountButton.addEventListener("click", createAdminAccount);
  elements.grantGoldButton.addEventListener("click", grantGoldToSelectedAccount);
  elements.removeGoldButton.addEventListener("click", removeGoldFromSelectedAccount);
  elements.grantPackButton.addEventListener("click", grantPacksToSelectedAccount);
  elements.removePackButton.addEventListener("click", removePacksFromSelectedAccount);
  elements.grantCardButton.addEventListener("click", grantCardsToSelectedAccount);
  elements.removeCardButton.addEventListener("click", removeCardsFromSelectedAccount);
  elements.deleteAccountButton.addEventListener("click", deleteSelectedAccount);

  elements.closeCardModalButton.addEventListener("click", closeCardModal);
  elements.cardModal.addEventListener("click", (event) => {
    if (event.target === elements.cardModal) {
      closeCardModal();
    }
  });
}

function populateFilterControls() {
  fillSelect(elements.sortFilter, [
    { value: "rarity-asc", label: getUiText("filters.sortRarityAsc") },
    { value: "rarity-desc", label: getUiText("filters.sortRarityDesc") },
    { value: "cost-asc", label: getUiText("filters.sortCostAsc") },
    { value: "cost-desc", label: getUiText("filters.sortCostDesc") },
    { value: "owned-desc", label: getUiText("filters.sortOwnedDesc") },
    { value: "name-asc", label: getUiText("filters.sortNameAsc") },
    { value: "name-desc", label: getUiText("filters.sortNameDesc") },
    { value: "market-desc", label: getUiText("filters.sortMarketDesc") },
  ]);
  fillSelect(elements.rarityFilter, [{ value: "all", label: getUiText("filters.allRarities") }, ...RARITY_ORDER.map((rarity) => ({ value: rarity, label: getRarityLabel(rarity) }))]);
  fillSelect(elements.typeFilter, [{ value: "all", label: getUiText("filters.allTypes") }, ...Object.keys(TYPE_LABELS).map((value) => ({ value, label: getTypeLabel(value) }))]);
  fillSelect(elements.factionFilter, [{ value: "all", label: getUiText("filters.allFactions") }, ...FACTIONS.map((faction) => ({ value: faction.id, label: faction.name }))]);
  fillSelect(elements.costFilter, [
    { value: "all", label: getUiText("filters.allCosts") },
    { value: "0-2", label: getUiText("filters.costLow") },
    { value: "3-5", label: getUiText("filters.costMid") },
    { value: "6-9", label: getUiText("filters.costHigh") },
  ]);
  fillSelect(elements.marketSortSelect, [
    { value: "hot", label: getUiText("filters.marketHot") },
    { value: "cold", label: getUiText("filters.marketCold") },
    { value: "value-desc", label: getUiText("filters.marketValueDesc") },
    { value: "value-asc", label: getUiText("filters.marketValueAsc") },
    { value: "name", label: getUiText("filters.marketName") },
  ]);
  fillSelect(elements.marketRarityFilter, [{ value: "all", label: getUiText("filters.allRarities") }, ...RARITY_ORDER.map((rarity) => ({ value: rarity, label: getRarityLabel(rarity) }))]);
  fillSelect(elements.settingsLanguageSelect, SUPPORTED_LANGUAGES.map((language) => ({ value: language, label: LANGUAGE_LABELS[language] })));
  fillSelect(elements.adminPackSelect, Object.values(PACK_DEFINITIONS).map((pack) => ({ value: pack.id, label: getPackLabel(pack.id) })));
  fillSelect(elements.adminCardSelect, [...CARD_POOL]
    .sort((left, right) => left.name.localeCompare(right.name, getCurrentLocale()))
    .map((card) => ({
      value: card.id,
      label: `${card.name} · ${getRarityLabel(card.rarity)} · ${getTypeLabel(card.type)}`,
    })));
  return;
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
    ? getUiText("auth.loginHint")
    : getUiText("auth.registerHint");
}

async function handleRegister(event) {
  event.preventDefault();
  const formElement = event.currentTarget;
  const form = new FormData(formElement);
  const { username, error: usernameError } = getPlayerNameValidationState(form.get("username"));
  const password = String(form.get("password") || "");

  if (usernameError === "invalid") {
    setAuthMessage(getUiText("messages.authInvalidUsername"));
    return;
  }

  if (usernameError === "reserved") {
    setAuthMessage(getUiText("messages.authReservedUsername"));
    return;
  }

  if (password.length < 4) {
    setAuthMessage(getUiText("messages.authPasswordMin"));
    return;
  }

  if (await detectServerApiAvailability()) {
    try {
      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        body: { username, password },
      });

      if (!mergeServerAccountIntoLocalState(response?.account, response?.sessionToken)) {
        setAuthMessage(getUiText("messages.authAccountCreateFailed"));
        return;
      }

      formElement.reset();
      await loadServerGameState(response?.sessionToken);
      showToast(getUiText("messages.authAccountCreated", { username }));
    } catch (error) {
      setAuthMessage(error?.payload?.message || getUiText("messages.authAccountCreateFailed"));
    }
    return;
  }

  if (findStoredUsername(username)) {
    setAuthMessage(getUiText("messages.authUsernameTaken"));
    return;
  }

  try {
    const account = {
      username,
      passwordHash: await createPasswordRecord(password),
      isAdmin: false,
      createdAt: new Date().toISOString(),
      save: createEmptySave(),
      sessionToken: null,
    };

    database.accounts[username] = normalizeAccount(account);
    saveDatabase();
    loginAs(username);
    formElement.reset();
    showToast(getUiText("messages.authAccountCreated", { username }));
  } catch {
    setAuthMessage(getUiText("messages.authAccountCreateFailed"));
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const formElement = event.currentTarget;
  const form = new FormData(formElement);
  const username = sanitizeUsername(form.get("username"));
  const password = String(form.get("password") || "");

  if (await detectServerApiAvailability()) {
    try {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: { username, password },
      });

      if (!mergeServerAccountIntoLocalState(response?.account, response?.sessionToken)) {
        setAuthMessage(getUiText("messages.authLoginFailed"));
        return;
      }

      formElement.reset();
      await loadServerGameState(response?.sessionToken);
      showToast(getUiText("messages.authWelcomeBack", { username: sanitizeUsername(response?.account?.username) || username }));
    } catch (error) {
      setAuthMessage(error?.payload?.message || getUiText("messages.authInvalidCredentials"));
    }
    return;
  }

  const storedUsername = username ? findStoredUsername(username) : null;
  const account = storedUsername ? database.accounts[storedUsername] : null;

  try {
    if (!account || !(await verifyPassword(password, account.passwordHash))) {
      setAuthMessage(getUiText("messages.authInvalidCredentials"));
      return;
    }

    if (shouldUpgradePasswordHash(account.passwordHash)) {
      account.passwordHash = await createPasswordRecord(password);
      database.accounts[storedUsername] = normalizeAccount(account);
      saveDatabase();
    }

    loginAs(storedUsername);
    formElement.reset();
    showToast(getUiText("messages.authWelcomeBack", { username: storedUsername }));
  } catch {
    setAuthMessage(getUiText("messages.authLoginFailed"));
  }
}

async function handleProfileRename(event) {
  event.preventDefault();
  const formElement = event.currentTarget;

  if (!currentAccount) {
    return;
  }

  if (isCurrentUserAdmin()) {
    showToast(getUiText("messages.adminNameLocked"));
    return;
  }

  const form = new FormData(formElement);
  const { username: nextUsername, error: usernameError } = getPlayerNameValidationState(form.get("username"), {
    allowBootstrapAdmin: isCurrentUserAdmin(),
  });
  const currentPassword = String(form.get("currentPassword") || "");
  const storedAccount = database.accounts[currentAccount.username];

  if (usernameError === "invalid") {
    showToast(getUiText("messages.authInvalidUsername"));
    return;
  }

  if (usernameError === "reserved") {
    showToast(getUiText("messages.authReservedUsername"));
    return;
  }

  if (nextUsername === currentAccount.username) {
    showToast(getUiText("messages.authUsernameTaken"));
    return;
  }

  if (!currentPassword) {
    showToast(getUiText("messages.profileCurrentPasswordRequired"));
    return;
  }

  const conflictingUsername = findStoredUsername(nextUsername);
  if (conflictingUsername && canonicalizeUsername(conflictingUsername) !== canonicalizeUsername(currentAccount.username)) {
    showToast(getUiText("messages.authUsernameTaken"));
    return;
  }

  if (await detectServerApiAvailability()) {
    const session = getSessionSnapshot();
    if (!session?.token) {
      showToast(getUiText("messages.authLoginFailed"));
      return;
    }

    try {
      await apiRequest("/api/profile/me", {
        method: "PATCH",
        token: session.token,
        body: { username: nextUsername },
      });

      const existing = normalizeAccount(database.accounts[currentAccount.username] || currentAccount);
      delete database.accounts[currentAccount.username];
      const renamed = normalizeAccount({
        ...existing,
        username: nextUsername,
        sessionToken: session.token,
      });
      database.accounts[nextUsername] = renamed;
      saveDatabase();
      currentUsername = nextUsername;
      currentAccount = database.accounts[nextUsername];
      restoreRuntimeMatchFromAccount(true);
      storeSessionSnapshot({
        ...session,
        mode: SESSION_MODES.server,
        username: nextUsername,
      });
      formElement.reset();
      renderAll();
      showToast(getUiText("messages.profileRenameSuccess", { username: nextUsername }));
    } catch (error) {
      showToast(error?.payload?.message || getUiText("messages.profileRenameFailed"));
    }
    return;
  }

  try {
    if (!storedAccount || !(await verifyPassword(currentPassword, storedAccount.passwordHash))) {
      showToast(getUiText("messages.profileCurrentPasswordWrong"));
      return;
    }

    const renamedAccount = normalizeAccount({
      ...storedAccount,
      username: nextUsername,
      sessionToken: null,
    });
    delete database.accounts[currentAccount.username];
    database.accounts[nextUsername] = renamedAccount;
    saveDatabase();
    loginAs(nextUsername);
    formElement.reset();
    showToast(getUiText("messages.profileRenameSuccess", { username: nextUsername }));
  } catch {
    showToast(getUiText("messages.profileRenameFailed"));
  }
}

async function handleProfilePasswordChange(event) {
  event.preventDefault();
  const formElement = event.currentTarget;

  if (!currentAccount) {
    return;
  }

  if (isCurrentUserAdmin()) {
    showToast(getUiText("messages.adminNameLocked"));
    return;
  }

  const form = new FormData(formElement);
  const currentPassword = String(form.get("currentPassword") || "");
  const newPassword = String(form.get("newPassword") || "");
  const confirmPassword = String(form.get("confirmPassword") || "");
  const storedAccount = database.accounts[currentAccount.username];

  if (!currentPassword) {
    showToast(getUiText("messages.profileCurrentPasswordMissing"));
    return;
  }

  if (newPassword.length < 4) {
    showToast(getUiText("messages.profilePasswordMin"));
    return;
  }

  if (newPassword !== confirmPassword) {
    showToast(getUiText("messages.profilePasswordMismatch"));
    return;
  }

  if (newPassword === currentPassword) {
    showToast(getUiText("messages.profilePasswordSame"));
    return;
  }

  if (await detectServerApiAvailability()) {
    const session = getSessionSnapshot();
    if (!session?.token) {
      showToast(getUiText("messages.authLoginFailed"));
      return;
    }

    try {
      await apiRequest("/api/profile/password", {
        method: "PATCH",
        token: session.token,
        body: {
          currentPassword,
          newPassword,
        },
      });
      formElement.reset();
      showToast(getUiText("messages.profilePasswordSuccess"));
    } catch (error) {
      showToast(error?.payload?.message || getUiText("messages.profilePasswordFailed"));
    }
    return;
  }

  try {
    if (!storedAccount || !(await verifyPassword(currentPassword, storedAccount.passwordHash))) {
      showToast(getUiText("messages.profileCurrentPasswordWrong"));
      return;
    }

    currentAccount.passwordHash = await createPasswordRecord(newPassword);
    persistCurrentAccount();
    formElement.reset();
    showToast(getUiText("messages.profilePasswordSuccess"));
  } catch {
    showToast(getUiText("messages.profilePasswordFailed"));
  }
}

const PLAYER_NAME_MIN_LENGTH = 3;
const PLAYER_NAME_MAX_LENGTH = 12;

function sanitizeUsername(value) {
  const username = String(value || "").trim();
  return /^[A-Za-zÄÖÜäöüß0-9_-]{3,18}$/u.test(username) ? username : "";
}

function canonicalizeUsername(value) {
  const username = sanitizeUsername(value);
  return username ? username.normalize("NFKC").toLocaleLowerCase("de") : "";
}

function normalizeReservedUsernameCheck(value) {
  return String(value || "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[@4]/g, "a")
    .replace(/[1!|l]/g, "i")
    .replace(/[^a-z0-9]/g, "");
}

function isReservedPlayerName(value, { allowBootstrapAdmin = false } = {}) {
  const username = sanitizeUsername(value);
  if (!username) {
    return false;
  }

  if (allowBootstrapAdmin && canonicalizeUsername(username) === canonicalizeUsername(ADMIN_BOOTSTRAP.username)) {
    return false;
  }

  return normalizeReservedUsernameCheck(username).includes("admin");
}

function getPlayerNameValidationState(value, options = {}) {
  const username = sanitizeUsername(value);
  if (!username || username.length < PLAYER_NAME_MIN_LENGTH || username.length > PLAYER_NAME_MAX_LENGTH) {
    return { username, error: "invalid" };
  }

  if (isReservedPlayerName(username, options)) {
    return { username, error: "reserved" };
  }

  return { username, error: null };
}

function findStoredUsername(username) {
  const canonicalUsername = canonicalizeUsername(username);

  if (!canonicalUsername) {
    return null;
  }

  return Object.keys(database.accounts).find((key) => canonicalizeUsername(key) === canonicalUsername) || null;
}

function getStoredAccount(username) {
  const storedUsername = findStoredUsername(username);
  return storedUsername ? database.accounts[storedUsername] : null;
}

function simpleHash(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `${hash >>> 0}`;
}

function cloneJsonValue(value) {
  return value && typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value;
}

function sanitizeFiniteInteger(value, fallback = 0, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) {
  const parsed = Number.parseInt(String(value), 10);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return clamp(minimum, maximum, parsed);
}

function sanitizeFiniteNumber(value, fallback = 0, minimum = -Number.MAX_SAFE_INTEGER, maximum = Number.MAX_SAFE_INTEGER, digits = 2) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Number(clamp(minimum, maximum, parsed).toFixed(digits));
}

function bytesToBase64(bytes) {
  let binary = "";
  bytes.forEach((value) => {
    binary += String.fromCharCode(value);
  });
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function safeStringEqual(left, right) {
  const a = String(left || "");
  const b = String(right || "");
  const maxLength = Math.max(a.length, b.length);
  let mismatch = a.length ^ b.length;

  for (let index = 0; index < maxLength; index += 1) {
    const leftCode = a.charCodeAt(index) || 0;
    const rightCode = b.charCodeAt(index) || 0;
    mismatch |= leftCode ^ rightCode;
  }

  return mismatch === 0;
}

function isPasswordRecord(value) {
  return Boolean(
    value
    && typeof value === "object"
    && value.version === PASSWORD_KDF.version
    && value.algo === PASSWORD_KDF.algo
    && Number.isFinite(value.iterations)
    && typeof value.salt === "string"
    && typeof value.hash === "string"
  );
}

async function createPasswordRecord(password, baseRecord = null) {
  const subtle = globalThis.crypto?.subtle;

  if (!subtle) {
    return simpleHash(password);
  }

  const salt = baseRecord?.salt || bytesToBase64(globalThis.crypto.getRandomValues(new Uint8Array(PASSWORD_KDF.saltBytes)));
  const iterations = sanitizeFiniteInteger(baseRecord?.iterations, PASSWORD_KDF.iterations, 50000, 300000);
  const encoder = new TextEncoder();
  const key = await subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: base64ToBytes(salt),
      iterations,
    },
    key,
    PASSWORD_KDF.hashBits,
  );

  return {
    version: PASSWORD_KDF.version,
    algo: PASSWORD_KDF.algo,
    iterations,
    salt,
    hash: bytesToBase64(new Uint8Array(bits)),
  };
}

async function verifyPassword(password, storedValue) {
  if (isPasswordRecord(storedValue)) {
    const candidate = await createPasswordRecord(password, storedValue);
    return safeStringEqual(candidate.hash, storedValue.hash);
  }

  return safeStringEqual(simpleHash(password), storedValue);
}

function shouldUpgradePasswordHash(storedValue) {
  return !isPasswordRecord(storedValue);
}

function createSessionToken() {
  if (globalThis.crypto?.getRandomValues) {
    const buffer = new Uint8Array(24);
    globalThis.crypto.getRandomValues(buffer);
    return bytesToBase64(buffer).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  return `fallback-${Date.now()}-${Math.random().toString(36).slice(2, 18)}`;
}

function isValidSessionToken(value) {
  return typeof value === "string" && /^[A-Za-z0-9_-]{24,128}$/.test(value);
}

function setAuthMessage(message) {
  elements.authMessage.textContent = message;
}

function loginAs(username) {
  const storedUsername = findStoredUsername(username);

  if (!storedUsername || !database.accounts[storedUsername]) {
    setAuthMessage(getUiText("messages.accountNotFound"));
    return;
  }

  const normalized = normalizeAccount(database.accounts[storedUsername]);
  normalized.sessionToken = createSessionToken();
  currentUsername = storedUsername;
  currentAccount = normalized;
  uiState.previewLanguage = normalized.save?.settings?.language || "de";
  restoreRuntimeMatchFromAccount(true);
  database.accounts[storedUsername] = normalized;
  uiState.adminSelectedUser = null;
  storeSessionSnapshot({
    version: 1,
    mode: SESSION_MODES.local,
    username: storedUsername,
    token: normalized.sessionToken,
    issuedAt: new Date().toISOString(),
  });
  saveDatabase();
  currentAccount = database.accounts[storedUsername];
  restoreRuntimeMatchFromAccount(true);
  switchAuthMode("login");
  renderAll();
}

async function logout() {
  const activeLanguage = currentAccount?.save?.settings?.language || uiState.previewLanguage || "de";
  const session = getSessionSnapshot();

  if (session?.mode === SESSION_MODES.server && session?.token && await detectServerApiAvailability()) {
    try {
      await apiRequest("/api/auth/logout", {
        method: "POST",
        token: session.token,
      });
    } catch {
      // Ignore logout transport failures and clear the local session anyway.
    }
  }

  if (currentAccount?.username && database.accounts[currentAccount.username]) {
    database.accounts[currentAccount.username] = normalizeAccount({
      ...database.accounts[currentAccount.username],
      sessionToken: null,
    });
    saveDatabase();
  }

  currentUsername = null;
  currentAccount = null;
  uiState.previewLanguage = activeLanguage;
  clearSessionSnapshot();
  if (SERVER_LIVE_SYNC.refreshTimer) {
    window.clearTimeout(SERVER_LIVE_SYNC.refreshTimer);
    SERVER_LIVE_SYNC.refreshTimer = null;
  }
  SERVER_LIVE_SYNC.inFlight = false;
  uiState.match = null;
  uiState.modalCardId = null;
  uiState.adminSelectedUser = null;
  renderAll();
}

function resetCurrentAccount() {
  if (!currentAccount) {
    return;
  }

  if (!requestActionConfirmation(getUiText("messages.accountResetConfirm"))) {
    return;
  }

  currentAccount.save = createEmptySave();
  persistCurrentAccount();
  uiState.match = null;
  uiState.modalCardId = null;
  renderAll();
  showToast(getUiText("messages.accountResetDone"));
}

function updateFilter(key, value) {
  getSave().filters[key] = value;
  persistCurrentAccount();
  renderCollection();
}

function handleSettingsToggle(event) {
  const key = SETTINGS_INPUT_MAP[event.currentTarget.id];

  if (!key) {
    return;
  }

  updateAccountSetting(key, event.currentTarget.checked);
  renderSettings();
  showToast(getUiText("settings.saved"));
}

function handleLanguageChange(event) {
  if (!currentAccount) {
    return;
  }

  const language = SUPPORTED_LANGUAGES.includes(event.currentTarget.value) ? event.currentTarget.value : "de";
  updateAccountSetting("language", language);
  uiState.previewLanguage = language;
  renderAll();
  showToast(getUiText("settings.languageChanged"));
}

function handleDeckModeChange(event) {
  uiState.deckMode = getDeckModeId(event.currentTarget.value);
  renderDeckManager();
}

function handleArenaDifficultyChange(event) {
  if (!currentAccount || isMatchSessionLocked()) {
    return;
  }

  getSave().arenaDifficulty = getArenaDifficultyId(event.currentTarget.value);
  uiState.deckMode = getDeckModeForDifficulty(getSave().arenaDifficulty);
  persistCurrentAccount();
  renderArena();
  renderDeckManager();
  showToast(getUiText("messages.matchDifficultySaved"));
}

function resetCurrentSettings() {
  if (!currentAccount) {
    return;
  }

  getSave().settings = createDefaultSettings();
  uiState.previewLanguage = getSave().settings.language;
  persistCurrentAccount();
  applyUserSettingsToDocument();
  renderAll();
  showToast(getUiText("messages.settingsReset"));
}

function createEmptySave() {
  const firstDeck = createDeck("Erstes Deck");
  const hardcoreDeck = createDeck("Hardcore-Deck");
  const packInventory = Object.fromEntries(Object.keys(PACK_DEFINITIONS).map((packId) => [packId, 0]));
  packInventory.starter = 5;
  return {
    gold: APP_CONFIG.baseGold,
    collection: {},
    packs: packInventory,
    decks: [firstDeck],
    activeDeckId: firstDeck.id,
    hardcoreDeck,
    shopTab: "boosters",
    selectedPack: "starter",
    arenaDifficulty: "standard",
    settings: createDefaultSettings(),
    friends: createDefaultFriendState(),
    progression: createDefaultProgression(),
    profileDisplay: cloneJsonValue(DEFAULT_PROFILE_DISPLAY),
    cosmetics: cloneJsonValue(DEFAULT_COSMETICS),
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

function createDeck(name, cards = []) {
  return {
    id: `deck-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    name,
    cards: [...cards],
  };
}

function createDefaultSettings() {
  return cloneJsonValue(DEFAULT_PLAYER_SETTINGS);
}

function createDefaultFriendState() {
  return cloneJsonValue(DEFAULT_FRIEND_STATE);
}

function createDefaultProgression() {
  return cloneJsonValue(DEFAULT_PROGRESS_STATE);
}

function createDefaultCosmetics() {
  return cloneJsonValue(DEFAULT_COSMETICS);
}

function createDefaultPityState() {
  return { epicDry: 0, legendaryDry: 0 };
}

function getCurrentDateKey() {
  return PROGRESSION_RULES.getCurrentDateKey();
}

function getCurrentWeekKey() {
  return PROGRESSION_RULES.getCurrentWeekKey();
}

function sanitizeQuestSnapshotState(snapshot) {
  const next = cloneJsonValue(PROGRESSION_RULES.createDefaultQuestSnapshot());
  const source = snapshot && typeof snapshot === "object" ? snapshot : {};
  next.rankPoints = sanitizeFiniteInteger(source.rankPoints, next.rankPoints, 0, SECURITY_LIMITS.maxGold * 10);
  PROGRESSION_RULES.SNAPSHOT_STAT_KEYS.forEach((key) => {
    next.stats[key] = sanitizeFiniteInteger(source.stats?.[key], next.stats[key] || 0, 0, 999999);
  });
  next.summary = {
    gold: sanitizeFiniteInteger(source.summary?.gold, next.summary.gold, 0, SECURITY_LIMITS.maxGold),
    totalCards: sanitizeFiniteInteger(source.summary?.totalCards, next.summary.totalCards, 0, SECURITY_LIMITS.maxCollectionCopies * 1000),
    uniqueCards: sanitizeFiniteInteger(source.summary?.uniqueCards, next.summary.uniqueCards, 0, CARD_POOL.length),
    totalBoosters: sanitizeFiniteInteger(source.summary?.totalBoosters, next.summary.totalBoosters, 0, SECURITY_LIMITS.maxPackCopies * 10),
  };
  return next;
}

function sanitizeQuestWindowState(windowState) {
  const next = cloneJsonValue(PROGRESSION_RULES.createDefaultQuestWindow());
  const source = windowState && typeof windowState === "object" ? windowState : {};
  next.key = String(source.key || "").trim().slice(0, 24);
  next.activeIds = [...new Set((Array.isArray(source.activeIds) ? source.activeIds : [])
    .map((entry) => String(entry || "").trim().slice(0, 64))
    .filter(Boolean))].slice(0, 8);
  next.snapshot = sanitizeQuestSnapshotState(source.snapshot);
  return next;
}

function sanitizeProgressionState(progression, baseProgression = createDefaultProgression()) {
  const next = cloneJsonValue(baseProgression);
  const source = progression && typeof progression === "object" ? progression : {};
  next.rankPoints = sanitizeFiniteInteger(source.rankPoints, next.rankPoints, 0, SECURITY_LIMITS.maxGold * 10);
  next.achievementsClaimed = [...new Set((Array.isArray(source.achievementsClaimed) ? source.achievementsClaimed : [])
    .map((entry) => String(entry || "").trim().slice(0, 64))
    .filter(Boolean))].slice(0, 120);
  next.quests = {
    dailyClaimed: [...new Set((Array.isArray(source.quests?.dailyClaimed) ? source.quests.dailyClaimed : [])
      .map((entry) => String(entry || "").trim().slice(0, 64))
      .filter(Boolean))].slice(0, 64),
    weeklyClaimed: [...new Set((Array.isArray(source.quests?.weeklyClaimed) ? source.quests.weeklyClaimed : [])
      .map((entry) => String(entry || "").trim().slice(0, 64))
      .filter(Boolean))].slice(0, 64),
    dailyWindow: sanitizeQuestWindowState(source.quests?.dailyWindow),
    weeklyWindow: sanitizeQuestWindowState(source.quests?.weeklyWindow),
  };
  next.pity = {};
  if (source.pity && typeof source.pity === "object") {
    Object.keys(PACK_DEFINITIONS).forEach((packId) => {
      const packState = source.pity[packId];
      next.pity[packId] = {
        epicDry: sanitizeFiniteInteger(packState?.epicDry, 0, 0, 999),
        legendaryDry: sanitizeFiniteInteger(packState?.legendaryDry, 0, 0, 999),
      };
    });
  }
  next.stats = {
    arenaWins: sanitizeFiniteInteger(source.stats?.arenaWins, 0, 0, 999999),
    arenaLosses: sanitizeFiniteInteger(source.stats?.arenaLosses, 0, 0, 999999),
    friendWins: sanitizeFiniteInteger(source.stats?.friendWins, 0, 0, 999999),
    friendLosses: sanitizeFiniteInteger(source.stats?.friendLosses, 0, 0, 999999),
    boostersOpened: sanitizeFiniteInteger(source.stats?.boostersOpened, 0, 0, 999999),
    cardsOpened: sanitizeFiniteInteger(source.stats?.cardsOpened, 0, 0, 999999),
    goldEarned: sanitizeFiniteInteger(source.stats?.goldEarned, 0, 0, SECURITY_LIMITS.maxGold * 100),
    tradesCompleted: sanitizeFiniteInteger(source.stats?.tradesCompleted, 0, 0, 999999),
    marketDeals: sanitizeFiniteInteger(source.stats?.marketDeals, 0, 0, 999999),
    hardcoreWins: sanitizeFiniteInteger(source.stats?.hardcoreWins, 0, 0, 999999),
    legendaryPlusPulled: sanitizeFiniteInteger(source.stats?.legendaryPlusPulled, 0, 0, 999999),
  };
  const sanitizeHistory = (entries, kind) => (Array.isArray(entries) ? entries : [])
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      return {
        id: String(entry.id || "").trim().slice(0, 64),
        createdAt: typeof entry.createdAt === "string" ? entry.createdAt : new Date().toISOString(),
        note: String(entry.note || "").trim().slice(0, 160),
        value: sanitizeFiniteInteger(entry.value, 0, 0, SECURITY_LIMITS.maxGold * 10),
        status: String(entry.status || kind).trim().slice(0, 32),
      };
    })
    .filter((entry) => entry && entry.id)
    .slice(0, 24);
  next.tradeHistory = sanitizeHistory(source.tradeHistory, "trade");
  next.duelHistory = sanitizeHistory(source.duelHistory, "duel");
  return next;
}

function getProgression() {
  const save = getSave();
  if (!save.progression) {
    save.progression = createDefaultProgression();
  }
  save.progression = sanitizeProgressionState(save.progression);
  return save.progression;
}

function pushLimitedHistory(list, entry, limit = 12) {
  return [entry, ...(Array.isArray(list) ? list : [])].slice(0, limit);
}

function trackProgressStat(key, amount = 1) {
  const progression = getProgression();
  if (!(key in progression.stats)) {
    return;
  }
  progression.stats[key] = Math.max(0, sanitizeFiniteInteger(progression.stats[key] + amount, 0, 0, SECURITY_LIMITS.maxGold * 100));
}

function addRankPoints(amount) {
  const progression = getProgression();
  progression.rankPoints = Math.max(0, progression.rankPoints + amount);
}

function addTradeHistoryEntry(note, value = 0, status = "trade") {
  const progression = getProgression();
  progression.tradeHistory = pushLimitedHistory(progression.tradeHistory, {
    id: `trade-log-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    createdAt: new Date().toISOString(),
    note,
    value,
    status,
  });
}

function addDuelHistoryEntry(note, value = 0, status = "duel") {
  const progression = getProgression();
  progression.duelHistory = pushLimitedHistory(progression.duelHistory, {
    id: `duel-log-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    createdAt: new Date().toISOString(),
    note,
    value,
    status,
  });
}

function formatProgressDate(value) {
  if (!value) {
    return localText("gerade eben", "just now", "à l'instant");
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return localText("gerade eben", "just now", "à l'instant");
  }
  return date.toLocaleDateString(getCurrentLocale(), {
    day: "2-digit",
    month: "2-digit",
  });
}

function getRankTierLabel(tier) {
  if (!tier) {
    return "";
  }
  return pickLocalizedText(tier.label);
}

function getRankStages() {
  return RANK_TIERS.flatMap((tier, tierIndex) => {
    const previousTier = RANK_TIERS[tierIndex - 1] || null;
    const nextTier = RANK_TIERS[tierIndex + 1] || null;
    const tierSpan = nextTier
      ? Math.max(3, nextTier.min - tier.min)
      : Math.max(180, tier.min - (previousTier?.min ?? 0));
    const stageSpan = Math.max(1, Math.ceil(tierSpan / 3));

    return [3, 2, 1].map((division, divisionIndex) => {
      const min = tier.min + (divisionIndex * stageSpan);
      const maxExclusive = division === 1
        ? (nextTier ? nextTier.min : Number.POSITIVE_INFINITY)
        : Math.min(nextTier ? nextTier.min : Number.POSITIVE_INFINITY, tier.min + ((divisionIndex + 1) * stageSpan));

      return {
        id: `${tier.id}-${division}`,
        tierId: tier.id,
        tier,
        division,
        min,
        maxExclusive,
        label: `${getRankTierLabel(tier)} ${division}`,
      };
    });
  });
}

function getRankState(points = 0) {
  const safePoints = Math.max(0, Number(points || 0));
  const stages = getRankStages();
  let stage = stages[0];
  let stageIndex = 0;

  stages.forEach((entry, index) => {
    if (safePoints >= entry.min) {
      stage = entry;
      stageIndex = index;
    }
  });

  const nextStage = stages[stageIndex + 1] || null;
  const rangeStart = stage.min;
  const rangeEnd = nextStage ? nextStage.min : (Number.isFinite(stage.maxExclusive) ? stage.maxExclusive : stage.min + 120);
  const progress = nextStage ? clamp(0, 1, (safePoints - rangeStart) / Math.max(1, rangeEnd - rangeStart)) : 1;

  return {
    ...stage,
    points: safePoints,
    nextStage,
    progress,
    pointsIntoTier: safePoints - rangeStart,
    pointsToNext: nextStage ? Math.max(0, nextStage.min - safePoints) : 0,
    stages,
  };
}

function buildQuestClaimKey(quest, periodKey) {
  return PROGRESSION_RULES.buildQuestClaimKey(quest, periodKey);
}

function getQuestWindowKeys(period) {
  if (period === "weekly") {
    return {
      windowKey: "weeklyWindow",
      claimedKey: "weeklyClaimed",
      periodKey: getCurrentWeekKey(),
    };
  }

  return {
    windowKey: "dailyWindow",
    claimedKey: "dailyClaimed",
    periodKey: getCurrentDateKey(),
  };
}

function ensureQuestWindowState(progression = getProgression(), save = getSave(), period = "daily") {
  if (!progression.quests || typeof progression.quests !== "object") {
    progression.quests = cloneJsonValue(PROGRESSION_RULES.createDefaultQuestState());
  }

  const { windowKey, claimedKey, periodKey } = getQuestWindowKeys(period);
  const questPool = period === "weekly" ? WEEKLY_QUEST_DEFS : DAILY_QUEST_DEFS;
  const windowState = sanitizeQuestWindowState(progression.quests[windowKey]);
  const expectedIds = PROGRESSION_RULES.getCurrentQuestDefinitions(period, periodKey).map((entry) => entry.id);
  let changed = false;

  if (windowState.key !== periodKey) {
    windowState.key = periodKey;
    windowState.activeIds = [...expectedIds];
    windowState.snapshot = PROGRESSION_RULES.createProgressSnapshot(progression, save);
    progression.quests[claimedKey] = [];
    changed = true;
  } else {
    if (!windowState.activeIds.length) {
      windowState.activeIds = [...expectedIds];
      changed = true;
    }
    if (!windowState.snapshot || typeof windowState.snapshot !== "object") {
      windowState.snapshot = PROGRESSION_RULES.createProgressSnapshot(progression, save);
      changed = true;
    }
  }

  progression.quests[windowKey] = sanitizeQuestWindowState(windowState);
  progression.quests[claimedKey] = [...new Set((Array.isArray(progression.quests[claimedKey]) ? progression.quests[claimedKey] : [])
    .map((entry) => String(entry || "").trim())
    .filter(Boolean))];
  return changed;
}

function ensureQuestRotationState(progression = getProgression(), save = getSave()) {
  const dailyChanged = ensureQuestWindowState(progression, save, "daily");
  const weeklyChanged = ensureQuestWindowState(progression, save, "weekly");
  return dailyChanged || weeklyChanged;
}

function getActiveQuestDefinitions(period, progression = getProgression(), save = getSave()) {
  ensureQuestWindowState(progression, save, period);
  const { windowKey } = getQuestWindowKeys(period);
  const windowState = progression.quests?.[windowKey] || sanitizeQuestWindowState();
  const questPool = period === "weekly" ? WEEKLY_QUEST_DEFS : DAILY_QUEST_DEFS;

  return windowState.activeIds
    .map((questId) => questPool.find((entry) => entry.id === questId))
    .filter(Boolean)
    .map((quest) => ({
      ...quest,
      period,
      periodKey: windowState.key,
    }));
}

function getCurrentDailyQuests() {
  return getActiveQuestDefinitions("daily");
}

function getCurrentWeeklyQuests() {
  return getActiveQuestDefinitions("weekly");
}

function getQuestProgress(progression, quest) {
  const save = getSave();
  ensureQuestWindowState(progression, save, quest.period || "daily");
  const { windowKey } = getQuestWindowKeys(quest.period || "daily");
  const baselineSnapshot = progression.quests?.[windowKey]?.snapshot || PROGRESSION_RULES.createDefaultQuestSnapshot();
  const currentSnapshot = PROGRESSION_RULES.createProgressSnapshot(progression, save);
  return Math.min(
    Number(quest.target || 0),
    Math.max(0, Number(PROGRESSION_RULES.getQuestProgress(quest, currentSnapshot, baselineSnapshot) || 0)),
  );
}

function isQuestClaimed(progression, quest) {
  const claimedList = quest.period === "weekly" ? progression.quests.weeklyClaimed : progression.quests.dailyClaimed;
  return claimedList.includes(buildQuestClaimKey(quest, quest.periodKey));
}

function isQuestClaimable(progression, quest) {
  return !isQuestClaimed(progression, quest) && getQuestProgress(progression, quest) >= quest.target;
}

function grantRewardPackage({ rewardGold = 0, rewardPackId = "", source = "" } = {}) {
  const save = getSave();
  if (rewardGold > 0) {
    save.gold += rewardGold;
    trackProgressStat("goldEarned", rewardGold);
  }
  if (rewardPackId && PACK_DEFINITIONS[rewardPackId]) {
    save.packs[rewardPackId] = (save.packs[rewardPackId] || 0) + 1;
  }
  if (source) {
    showToast(source);
  }
}

async function claimQuest(period, questId) {
  if (isServerSessionActive()) {
    try {
      const response = await claimProgressRewardOnServer({ kind: "quest", period, questId });
      if (response?.message) {
        showToast(response.message);
      }
      renderAll();
      return;
    } catch (error) {
      console.error(error);
      showToast(error?.payload?.message || "Quest-Belohnung konnte nicht abgeholt werden.");
      return;
    }
  }

  const progression = getProgression();
  const questPool = period === "weekly" ? getCurrentWeeklyQuests() : getCurrentDailyQuests();
  const quest = questPool.find((entry) => entry.id === questId);
  if (!quest || !isQuestClaimable(progression, quest)) {
    return;
  }

  const key = buildQuestClaimKey(quest, quest.periodKey);
  if (period === "weekly") {
    progression.quests.weeklyClaimed = [...progression.quests.weeklyClaimed, key];
  } else {
    progression.quests.dailyClaimed = [...progression.quests.dailyClaimed, key];
  }

  grantRewardPackage({
    rewardGold: quest.rewardGold,
    rewardPackId: quest.rewardPackId,
    source: localText(
      `${pickLocalizedText(quest.title)} abgeschlossen.`,
      `${pickLocalizedText(quest.title)} completed.`,
      `${pickLocalizedText(quest.title)} terminée.`,
    ),
  });
  persistCurrentAccount();
  renderAll();
}

function getAchievementStatus(definition) {
  const progression = getProgression();
  const currentSnapshot = PROGRESSION_RULES.createProgressSnapshot(progression, getSave());
  const completed = Boolean(PROGRESSION_RULES.isAchievementComplete(definition, currentSnapshot));
  const claimed = progression.achievementsClaimed.includes(definition.id);
  const progress = Math.min(Number(definition.target || 0), Math.max(0, Number(PROGRESSION_RULES.getAchievementProgress(definition, currentSnapshot) || 0)));
  return { completed, claimed, claimable: completed && !claimed, progress };
}

async function claimAchievement(achievementId) {
  if (isServerSessionActive()) {
    try {
      const response = await claimProgressRewardOnServer({ kind: "achievement", achievementId });
      if (response?.message) {
        showToast(response.message);
      }
      renderAll();
      return;
    } catch (error) {
      console.error(error);
      showToast(error?.payload?.message || "Errungenschaft konnte nicht eingelöst werden.");
      return;
    }
  }

  const definition = ACHIEVEMENT_DEFS.find((entry) => entry.id === achievementId);
  if (!definition) {
    return;
  }
  const progression = getProgression();
  const status = getAchievementStatus(definition);
  if (!status.claimable) {
    return;
  }
  progression.achievementsClaimed = [...progression.achievementsClaimed, definition.id];
  grantRewardPackage({
    rewardGold: definition.rewardGold,
    rewardPackId: definition.rewardPackId,
    source: localText(
      `${pickLocalizedText(definition.title)} eingelöst.`,
      `${pickLocalizedText(definition.title)} claimed.`,
      `${pickLocalizedText(definition.title)} récupérée.`,
    ),
  });
  persistCurrentAccount();
  renderAll();
}

function getFactionDeckBonus(profile, mode = DECK_MODES.standard) {
  if (!profile || !profile.factions) {
    return null;
  }
  const dominant = Object.entries(profile.factions)
    .sort((left, right) => right[1] - left[1])[0];
  if (!dominant) {
    return null;
  }
  const [factionId, count] = dominant;
  const definition = FACTION_DECK_BONUSES[factionId] || EXTRA_FACTION_DECK_BONUSES[factionId];
  const rules = getDeckRules(mode);
  if (!definition) {
    return null;
  }
  const threshold = Math.max(definition.minCards, Math.ceil(rules.size * 0.4));
  if (count < threshold) {
    return null;
  }
  return {
    ...definition,
    factionId,
    count,
    threshold,
  };
}

function getAlbumProgress() {
  const save = getSave();
  const collection = save.collection || {};
  const rarityStats = RARITY_ORDER.map((rarity) => {
    const total = CARD_POOL.filter((card) => card.rarity === rarity).length;
    const owned = CARD_POOL.filter((card) => card.rarity === rarity && (collection[card.id] || 0) > 0).length;
    return { rarity, total, owned };
  }).filter((entry) => entry.total > 0);

  const factionStats = FACTIONS.map((faction) => {
    const total = CARD_POOL.filter((card) => card.faction === faction.id).length;
    const owned = CARD_POOL.filter((card) => card.faction === faction.id && (collection[card.id] || 0) > 0).length;
    return { faction, total, owned };
  });

  return {
    rarityStats,
    factionStats,
    ownedUnique: summarizeSave(save).uniqueCards,
    totalUnique: CARD_POOL.length,
  };
}

function renderProgress() {
  if (!currentAccount) {
    return;
  }

  const progression = getProgression();
  const save = getSave();
  const rank = getRankState(progression.rankPoints);
  const dailyQuests = getCurrentDailyQuests();
  const weeklyQuests = getCurrentWeeklyQuests();
  const album = getAlbumProgress();
  const achievementCards = ACHIEVEMENT_DEFS.map((definition) => ({ definition, status: getAchievementStatus(definition) }));
  const claimableQuests = [...dailyQuests, ...weeklyQuests].filter((quest) => isQuestClaimable(progression, quest)).length;
  const factionBonus = getFactionDeckBonus(analyzeDeck(getDeckByMode(DECK_MODES.standard)?.cards || []), DECK_MODES.standard);

  elements.progressSummary.innerHTML = `
    <p class="eyebrow">${localText("Status", "Status", "Statut")}</p>
    <h3>${localText("Dein Fortschrittsüberblick", "Your progression snapshot", "Ton aperçu de progression")}</h3>
    <div class="progress-summary-grid">
      <article class="progress-stat-card">
        <span>${localText("Rang", "Rank", "Rang")}</span>
        <strong>${rank.label}</strong>
        <small>${progression.rankPoints} RP</small>
      </article>
      <article class="progress-stat-card">
        <span>${localText("Quest bereit", "Quests ready", "Quêtes prêtes")}</span>
        <strong>${claimableQuests}</strong>
        <small>${localText("einlösbar", "claimable", "réclamables")}</small>
      </article>
      <article class="progress-stat-card">
        <span>${localText("Arenasiege", "Arena wins", "Victoires d'arène")}</span>
        <strong>${progression.stats.arenaWins}</strong>
        <small>${localText("gesamt", "total", "total")}</small>
      </article>
      <article class="progress-stat-card">
        <span>${localText("Hardcore-Siege", "Hardcore wins", "Victoires hardcore")}</span>
        <strong>${progression.stats.hardcoreWins}</strong>
        <small>${localText("extrem", "extreme", "extrême")}</small>
      </article>
    </div>
    ${factionBonus ? `<div class="warning-item ok">${escapeHtml(localText(
      `Aktiver Fraktionsbonus: ${getFaction(factionBonus.factionId).name} – ${factionBonus.short}.`,
      `Active faction bonus: ${getFaction(factionBonus.factionId).name} – ${factionBonus.short}.`,
      `Bonus de faction actif : ${getFaction(factionBonus.factionId).name} – ${factionBonus.short}.`,
    ))}</div>` : ""}
  `;

  const buildQuestMarkup = (quest) => {
    const progress = getQuestProgress(progression, quest);
    const claimed = isQuestClaimed(progression, quest);
    const claimable = isQuestClaimable(progression, quest);
    const title = pickLocalizedText(quest.title);
    const description = pickLocalizedText(quest.description);
    return `
      <article class="quest-card ${claimable ? "claimable" : ""}">
        <div class="quest-head">
          <div>
            <p class="eyebrow">${escapeHtml(quest.period === "weekly" ? localText("Wöchentlich", "Weekly", "Hebdomadaire") : localText("Täglich", "Daily", "Quotidien"))}</p>
            <h4>${escapeHtml(title)}</h4>
          </div>
          <span class="status-pill ${claimed ? "ok" : claimable ? "turn" : "subtle"}">${claimed ? localText("Eingelöst", "Claimed", "Réclamée") : `${progress}/${quest.target}`}</span>
        </div>
        <p class="mini-note">${escapeHtml(description)}</p>
        <div class="progress-meter"><span style="width:${Math.round((progress / quest.target) * 100)}%"></span></div>
        <div class="quest-reward-row">
          <span>${quest.rewardGold} ${localText("Gold", "Gold", "Or")}${quest.rewardPackId ? ` · ${getPackLabel(quest.rewardPackId)}` : ""}</span>
          <button class="secondary-button" type="button" data-quest-claim="${quest.period}:${quest.id}" ${claimable ? "" : "disabled"}>${localText("Belohnung holen", "Claim", "Réclamer")}</button>
        </div>
      </article>
    `;
  };

  elements.progressQuestPanel.innerHTML = `
    <p class="eyebrow">${localText("Quests", "Quests", "Quêtes")}</p>
    <h3>${localText("Täglich und wöchentlich", "Daily and weekly", "Quotidien et hebdomadaire")}</h3>
    <div class="quest-list">
      ${dailyQuests.map(buildQuestMarkup).join("")}
      ${weeklyQuests.map(buildQuestMarkup).join("")}
    </div>
  `;

  elements.progressAchievementPanel.innerHTML = `
    <p class="eyebrow">${localText("Errungenschaften", "Achievements", "Succès")}</p>
    <h3>${localText("Langfristige Meilensteine", "Long-term milestones", "Paliers long terme")}</h3>
    <div class="achievement-grid">
      ${achievementCards.map(({ definition, status }) => `
        <article class="achievement-card ${status.claimable ? "claimable" : status.claimed ? "done" : ""}">
          <div class="quest-head">
            <h4>${escapeHtml(pickLocalizedText(definition.title))}</h4>
            <span class="status-pill ${status.claimed ? "ok" : status.claimable ? "turn" : "subtle"}">${status.claimed ? localText("Fertig", "Done", "Terminé") : status.claimable ? localText("Bereit", "Ready", "Prêt") : localText("Läuft", "In progress", "En cours")}</span>
          </div>
          <p class="mini-note">${escapeHtml(pickLocalizedText(definition.description))}</p>
          <div class="progress-meter"><span style="width:${Math.round((status.progress / Math.max(1, definition.target || 1)) * 100)}%"></span></div>
          <div class="quest-reward-row">
            <span>${definition.rewardGold} ${localText("Gold", "Gold", "Or")}${definition.rewardPackId ? ` · ${getPackLabel(definition.rewardPackId)}` : ""}</span>
            <button class="secondary-button" type="button" data-achievement-claim="${escapeHtml(definition.id)}" ${status.claimable ? "" : "disabled"}>${localText("Einlösen", "Claim", "Réclamer")}</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;

  elements.progressRankPanel.innerHTML = `
    <p class="eyebrow">${localText("Liga", "League", "Ligue")}</p>
    <h3>${localText("Rang und Ligadruck", "Rank and ladder", "Rang et ladder")}</h3>
    <div class="rank-card">
      <div class="rank-head">
        <strong>${rank.label}</strong>
        <span>${progression.rankPoints} RP</span>
      </div>
      <div class="progress-meter rank-meter"><span style="width:${Math.round(rank.progress * 100)}%"></span></div>
      <p class="mini-note">${rank.nextStage
        ? localText(`${rank.pointsToNext} RP bis ${rank.nextStage.label}.`, `${rank.pointsToNext} RP to ${rank.nextStage.label}.`, `${rank.pointsToNext} RP jusqu'à ${rank.nextStage.label}.`)
        : localText("Höchste sichtbare Liga erreicht.", "Highest visible league reached.", "Ligue visible maximale atteinte.")}</p>
      <div class="rank-track">
        ${rank.stages.map((stage) => `<span class="rank-node ${stage.id === rank.id ? "active" : progression.rankPoints >= stage.min ? "done" : ""}">${escapeHtml(stage.label)}</span>`).join("")}
      </div>
    </div>
  `;

  elements.progressAlbumPanel.innerHTML = `
    <p class="eyebrow">${localText("Album", "Album", "Album")}</p>
    <h3>${localText("Sammlung nach Fraktion und Seltenheit", "Collection by faction and rarity", "Collection par faction et rareté")}</h3>
    <div class="album-progress-hero">
      <strong>${album.ownedUnique}/${album.totalUnique}</strong>
      <span>${localText("einzigartige Karten gefunden", "unique cards collected", "cartes uniques trouvées")}</span>
    </div>
    <div class="album-grid">
      ${album.rarityStats.map((entry) => `
        <article class="album-card">
          <span>${escapeHtml(RarityLabel(entry.rarity))}</span>
          <strong>${entry.owned}/${entry.total}</strong>
          <div class="progress-meter"><span style="width:${Math.round((entry.owned / entry.total) * 100)}%"></span></div>
        </article>
      `).join("")}
      ${album.factionStats.map((entry) => `
        <article class="album-card">
          <span>${escapeHtml(entry.faction.name)}</span>
          <strong>${entry.owned}/${entry.total}</strong>
          <div class="progress-meter"><span style="width:${Math.round((entry.owned / entry.total) * 100)}%"></span></div>
        </article>
      `).join("")}
    </div>
  `;

  const pityRows = Object.keys(PACK_DEFINITIONS).map((packId) => {
    const state = progression.pity[packId] || createDefaultPityState();
    return `
      <article class="pity-card">
        <div class="quest-head">
          <h4>${escapeHtml(getPackLabel(packId))}</h4>
          <span class="status-pill subtle">${escapeHtml(PACK_DEFINITIONS[packId].guaranteed ? RarityLabel(PACK_DEFINITIONS[packId].guaranteed) : "")}</span>
        </div>
        <p class="mini-note">${localText(`Epic-Pity: ${state.epicDry}/7 · Legendary-Pity: ${state.legendaryDry}/14`, `Epic pity: ${state.epicDry}/7 · Legendary pity: ${state.legendaryDry}/14`, `Pity épique : ${state.epicDry}/7 · Pity légendaire : ${state.legendaryDry}/14`)}</p>
      </article>
    `;
  }).join("");

  elements.progressPityPanel.innerHTML = `
    <p class="eyebrow">${localText("Booster-Pity", "Booster pity", "Pity boosters")}</p>
    <h3>${localText("Schlechte Serien werden weich abgefedert", "Bad streaks are softly corrected", "Les mauvaises séries sont adoucies")}</h3>
    <p class="mini-note">${localText("Nach mehreren trockenen Öffnungen steigen die Chancen auf Episch und Legendär im jeweiligen Booster spürbar an.", "After several dry openings, the odds for epic and legendary cards inside that booster rise noticeably.", "Après plusieurs ouvertures sans gros tirage, les chances d'épique et de légendaire montent sensiblement dans ce booster.")}</p>
    <div class="pity-grid">${pityRows}</div>
  `;

  elements.progressTradePanel.innerHTML = `
    <p class="eyebrow">${localText("Sozial und Handel", "Social and trading", "Social et échanges")}</p>
    <h3>${localText("Duelle, Trades und Sicherheit", "Duels, trades and safety", "Duels, échanges et sécurité")}</h3>
    <div class="progress-summary-grid">
      <article class="progress-stat-card">
        <span>${localText("Trades", "Trades", "Échanges")}</span>
        <strong>${progression.stats.tradesCompleted}</strong>
        <small>${localText("abgeschlossen", "completed", "terminés")}</small>
      </article>
      <article class="progress-stat-card">
        <span>${localText("Freundesduelle", "Friend duels", "Duels amicaux")}</span>
        <strong>${progression.stats.friendWins + progression.stats.friendLosses}</strong>
        <small>${progression.stats.friendWins}W / ${progression.stats.friendLosses}L</small>
      </article>
    </div>
    <div class="history-grid">
      <div class="history-column">
        <h4>${localText("Letzte Trades", "Recent trades", "Derniers échanges")}</h4>
        ${(progression.tradeHistory || []).length
          ? progression.tradeHistory.map((entry) => `<div class="history-entry"><strong>${escapeHtml(entry.note)}</strong><span>${formatProgressDate(entry.createdAt)}</span></div>`).join("")
          : `<p class="mini-note">${localText("Noch keine abgeschlossenen Trades.", "No completed trades yet.", "Aucun échange terminé pour l'instant.")}</p>`}
      </div>
      <div class="history-column">
        <h4>${localText("Letzte Duelle", "Recent duels", "Derniers duels")}</h4>
        ${(progression.duelHistory || []).length
          ? progression.duelHistory.map((entry) => `<div class="history-entry"><strong>${escapeHtml(entry.note)}</strong><span>${formatProgressDate(entry.createdAt)}</span></div>`).join("")
          : `<p class="mini-note">${localText("Noch keine geloggten Freundesduelle.", "No logged friend duels yet.", "Pas encore de duel amical enregistré.")}</p>`}
      </div>
    </div>
    <div class="warning-item ok">${localText(
      "Trades zeigen nur freie Kopien an. Karten, die in Decks gebunden sind, werden nicht als tauschbar angeboten.",
      "Trades only expose free copies. Cards locked inside decks are not offered for exchange.",
      "Les échanges n'affichent que les copies libres. Les cartes liées à des decks ne sont pas proposées.",
    )}</div>
  `;

  elements.progressQuestPanel.querySelectorAll("[data-quest-claim]").forEach((button) => {
    button.addEventListener("click", async () => {
      button.disabled = true;
      const [period, questId] = String(button.dataset.questClaim || "").split(":");
      await claimQuest(period, questId);
    });
  });
  elements.progressAchievementPanel.querySelectorAll("[data-achievement-claim]").forEach((button) => {
    button.addEventListener("click", async () => {
      button.disabled = true;
      await claimAchievement(button.dataset.achievementClaim);
    });
  });
}

function sanitizeCollection(collection) {
  const normalized = {};

  if (!collection || typeof collection !== "object") {
    return normalized;
  }

  Object.entries(collection).forEach(([cardId, count]) => {
    if (!CARD_MAP.has(cardId)) {
      return;
    }

    const safeCount = sanitizeFiniteInteger(count, 0, 0, SECURITY_LIMITS.maxCollectionCopies);
    if (safeCount > 0) {
      normalized[cardId] = safeCount;
    }
  });

  return normalized;
}

function sanitizeFriendEntries(entries) {
  if (!Array.isArray(entries)) {
    return [];
  }

  const seen = new Set();
  return entries
    .map((entry) => sanitizeUsername(entry))
    .filter((entry) => {
      if (!entry) {
        return false;
      }

      const canonical = canonicalizeUsername(entry);
      if (seen.has(canonical)) {
        return false;
      }

      seen.add(canonical);
      return true;
    })
    .slice(0, 120);
}

function sanitizeSocialOfferEntries(entries, kind) {
  if (!Array.isArray(entries)) {
    return [];
  }

  const seen = new Set();
  return entries
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const id = String(entry.id || "").trim().slice(0, 64);
      const from = sanitizeUsername(entry.from);
      const to = sanitizeUsername(entry.to);
      if (!id || !from || !to) {
        return null;
      }

      if (kind === "trade") {
        const offeredCardId = CARD_MAP.has(entry.offeredCardId) ? entry.offeredCardId : "";
        const requestedCardId = CARD_MAP.has(entry.requestedCardId) ? entry.requestedCardId : "";
        if (!offeredCardId || !requestedCardId) {
          return null;
        }

        return {
          id,
          from,
          to,
          offeredCardId,
          requestedCardId,
          createdAt: typeof entry.createdAt === "string" ? entry.createdAt : new Date().toISOString(),
          note: String(entry.note || "").trim().slice(0, 140),
        };
      }

      const deckCards = Array.isArray(entry.deckCards)
        ? entry.deckCards.filter((cardId) => CARD_MAP.has(cardId)).slice(0, APP_CONFIG.deckSize)
        : [];
      if (!deckCards.length) {
        return null;
      }

      return {
        id,
        from,
        to,
        deckName: String(entry.deckName || "").trim().slice(0, 48),
        deckCards,
        createdAt: typeof entry.createdAt === "string" ? entry.createdAt : new Date().toISOString(),
      };
    })
    .filter((entry) => {
      if (!entry || seen.has(entry.id)) {
        return false;
      }
      seen.add(entry.id);
      return true;
    })
    .slice(0, 64);
}

function sanitizeFriendState(friends, baseFriends) {
  return {
    friends: sanitizeFriendEntries(friends?.friends ?? baseFriends.friends),
    incoming: sanitizeFriendEntries(friends?.incoming ?? baseFriends.incoming),
    outgoing: sanitizeFriendEntries(friends?.outgoing ?? baseFriends.outgoing),
    blocked: sanitizeFriendEntries(friends?.blocked ?? baseFriends.blocked),
    tradeOffersIncoming: sanitizeSocialOfferEntries(friends?.tradeOffersIncoming ?? baseFriends.tradeOffersIncoming, "trade"),
    tradeOffersOutgoing: sanitizeSocialOfferEntries(friends?.tradeOffersOutgoing ?? baseFriends.tradeOffersOutgoing, "trade"),
    duelChallengesIncoming: sanitizeSocialOfferEntries(friends?.duelChallengesIncoming ?? baseFriends.duelChallengesIncoming, "duel"),
    duelChallengesOutgoing: sanitizeSocialOfferEntries(friends?.duelChallengesOutgoing ?? baseFriends.duelChallengesOutgoing, "duel"),
  };
}

function sanitizeCosmeticInventory(cosmetics, baseCosmetics) {
  const sanitizeOwned = (entries, fallbackEntries) => [...new Set(
    (Array.isArray(entries) ? entries : fallbackEntries)
      .map((entry) => String(entry || "").trim().slice(0, 64))
      .filter(Boolean),
  )];

  return {
    avatars: sanitizeOwned(cosmetics?.avatars, baseCosmetics.avatars).filter((id) => Boolean(getCosmeticItem("avatars", id))),
    frames: sanitizeOwned(cosmetics?.frames, baseCosmetics.frames).filter((id) => Boolean(getCosmeticItem("frames", id))),
    titles: sanitizeOwned(cosmetics?.titles, baseCosmetics.titles).filter((id) => Boolean(getCosmeticItem("titles", id))),
  };
}

function sanitizeProfileDisplayState(profileDisplay, baseDisplay, cosmetics) {
  const avatarId = String(profileDisplay?.avatarId || "").trim().slice(0, 64);
  const frameId = String(profileDisplay?.frameId || "").trim().slice(0, 64);
  const titleId = String(profileDisplay?.titleId || "").trim().slice(0, 64);
  return {
    avatarId: cosmetics.avatars.includes(avatarId) ? avatarId : baseDisplay.avatarId,
    frameId: cosmetics.frames.includes(frameId) ? frameId : baseDisplay.frameId,
    titleId: cosmetics.titles.includes(titleId) ? titleId : baseDisplay.titleId,
  };
}

function sanitizePlayerSettings(settings, baseSettings) {
  return {
    language: SUPPORTED_LANGUAGES.includes(settings?.language) ? settings.language : baseSettings.language,
    clickEffects: typeof settings?.clickEffects === "boolean" ? settings.clickEffects : baseSettings.clickEffects,
    packEffects: typeof settings?.packEffects === "boolean" ? settings.packEffects : baseSettings.packEffects,
    reducedMotion: typeof settings?.reducedMotion === "boolean" ? settings.reducedMotion : baseSettings.reducedMotion,
    confirmActions: typeof settings?.confirmActions === "boolean" ? settings.confirmActions : baseSettings.confirmActions,
  };
}

function sanitizePackInventory(packs, basePacks = {}) {
  const normalized = { ...basePacks };

  Object.keys(PACK_DEFINITIONS).forEach((packId) => {
    normalized[packId] = sanitizeFiniteInteger(
      packs?.[packId],
      sanitizeFiniteInteger(basePacks?.[packId], 0, 0, SECURITY_LIMITS.maxPackCopies),
      0,
      SECURITY_LIMITS.maxPackCopies,
    );
  });

  return normalized;
}

function sanitizeShopTab(shopTab, baseShopTab = "boosters") {
  return getShopTabId(shopTab || baseShopTab);
}

function sanitizeDeckName(name, index) {
  const trimmed = String(name || "").trim().slice(0, SECURITY_LIMITS.maxDeckNameLength);
  return trimmed || `Deck ${index + 1}`;
}

function sanitizeDeckId(value) {
  return typeof value === "string" && /^deck-[A-Za-z0-9-]{6,80}$/.test(value)
    ? value
    : `deck-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function sanitizeDeckEntries(decks, mode = DECK_MODES.standard, options = {}) {
  const rules = getDeckRules(mode);
  const maxDecks = options.maxDecks ?? SECURITY_LIMITS.maxDecks;

  if (!Array.isArray(decks) || !decks.length) {
    return [];
  }

  const seenIds = new Set();
  const normalized = decks
    .slice(0, maxDecks)
    .map((deck, index) => {
      const safeDeck = {
        id: sanitizeDeckId(deck?.id),
        name: sanitizeDeckName(deck?.name, index),
        cards: Array.isArray(deck?.cards)
          ? deck.cards.filter((cardId) => CARD_MAP.has(cardId)).slice(0, rules.size)
          : [],
      };

      while (seenIds.has(safeDeck.id)) {
        safeDeck.id = `deck-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      }

      seenIds.add(safeDeck.id);
      return safeDeck;
    })
    .filter((deck) => deck.cards.length <= rules.size);

  return normalized;
}

function sanitizeDecks(decks) {
  const normalized = sanitizeDeckEntries(decks, DECK_MODES.standard);
  return normalized.length ? normalized : [createDeck("Erstes Deck")];
}

function sanitizeHardcoreDeck(deck) {
  const normalized = sanitizeDeckEntries([deck], DECK_MODES.hardcore, { maxDecks: 1 });
  return normalized[0] || createDeck("Hardcore-Deck");
}

function sanitizeCollectionFilters(filters, baseFilters) {
  const allowedSorts = new Set(["rarity-asc", "rarity-desc", "cost-asc", "cost-desc", "owned-desc", "name-asc", "name-desc", "market-desc"]);
  const allowedCosts = new Set(["all", "0-2", "3-5", "6-9"]);
  return {
    search: String(filters?.search || "").slice(0, 80),
    sort: allowedSorts.has(filters?.sort) ? filters.sort : baseFilters.sort,
    rarity: filters?.rarity === "all" || RARITY_ORDER.includes(filters?.rarity) ? filters?.rarity || baseFilters.rarity : baseFilters.rarity,
    type: filters?.type === "all" || Object.keys(TYPE_LABELS).includes(filters?.type) ? filters?.type || baseFilters.type : baseFilters.type,
    faction: filters?.faction === "all" || FACTIONS.some((faction) => faction.id === filters?.faction) ? filters?.faction || baseFilters.faction : baseFilters.faction,
    cost: allowedCosts.has(filters?.cost) ? filters.cost : baseFilters.cost,
    ownedOnly: typeof filters?.ownedOnly === "boolean" ? filters.ownedOnly : baseFilters.ownedOnly,
    duplicatesOnly: typeof filters?.duplicatesOnly === "boolean" ? filters.duplicatesOnly : baseFilters.duplicatesOnly,
  };
}

function sanitizeLastOpened(lastOpened, baseLastOpened) {
  return {
    packId: PACK_DEFINITIONS[lastOpened?.packId] ? lastOpened.packId : baseLastOpened.packId,
    cards: Array.isArray(lastOpened?.cards)
      ? lastOpened.cards.filter((cardId) => CARD_MAP.has(cardId)).slice(0, SECURITY_LIMITS.maxLastOpenedCards)
      : [...baseLastOpened.cards],
    openedAt: typeof lastOpened?.openedAt === "string" ? lastOpened.openedAt : null,
  };
}

function sanitizeMatchCountRecord(record, allowedKeys = null, maxValue = APP_CONFIG.deckSize) {
  if (!record || typeof record !== "object") {
    return {};
  }

  const normalized = {};
  Object.entries(record).forEach(([key, value]) => {
    const safeKey = String(key || "").trim().slice(0, 48);
    if (!safeKey) {
      return;
    }
    if (allowedKeys && !allowedKeys.has(safeKey)) {
      return;
    }
    const safeValue = sanitizeFiniteInteger(value, 0, 0, maxValue);
    if (safeValue > 0) {
      normalized[safeKey] = safeValue;
    }
  });

  return normalized;
}

function sanitizeMatchStatuses(statuses) {
  const allowedKinds = new Set(Object.keys(STATUS_META || {}));

  if (!Array.isArray(statuses)) {
    return [];
  }

  return statuses
    .slice(0, 8)
    .map((status) => {
      const kind = String(status?.kind || "");
      if (!allowedKinds.has(kind)) {
        return null;
      }

      return {
        kind,
        value: sanitizeFiniteInteger(status?.value, 0, 0, 20),
        turns: sanitizeFiniteInteger(status?.turns, 0, 0, 12),
      };
    })
    .filter(Boolean);
}

function sanitizeMatchUnit(unit, fallbackUid = 1) {
  const cardId = String(unit?.cardId || "");
  const card = getCard(cardId);

  if (!card) {
    return null;
  }

  const allowedKeywords = new Set(Object.keys(KEYWORD_META || {}));
  const keywords = Array.isArray(unit?.keywords)
    ? uniqueValues(unit.keywords.filter((keyword) => allowedKeywords.has(keyword))).slice(0, 6)
    : [...(card.keywords || [])];
  const maxHealth = sanitizeFiniteInteger(unit?.maxHealth, card.health || 1, 1, 200);
  const health = sanitizeFiniteInteger(unit?.health, maxHealth, 0, maxHealth);

  if (health <= 0) {
    return null;
  }

  return {
    uid: sanitizeFiniteInteger(unit?.uid, fallbackUid, 1, 99999),
    cardId,
    attack: sanitizeFiniteInteger(unit?.attack, card.attack || 0, -50, 200),
    health,
    maxHealth,
    canAttack: typeof unit?.canAttack === "boolean" ? unit.canAttack : Boolean(card.keywords?.includes("charge")),
    keywords,
    statuses: sanitizeMatchStatuses(unit?.statuses),
  };
}

function sanitizeMatchDeckProfile(profile) {
  const factions = sanitizeMatchCountRecord(profile?.factions, new Set(FACTIONS.map((faction) => faction.id)));
  const types = sanitizeMatchCountRecord(profile?.types, new Set(Object.keys(TYPE_LABELS)));
  const rarities = sanitizeMatchCountRecord(profile?.rarities, new Set(RARITY_ORDER));
  const keywords = sanitizeMatchCountRecord(profile?.keywords, new Set(Object.keys(KEYWORD_META || {})));
  const tags = sanitizeMatchCountRecord(profile?.tags, null, MAX_DECK_SIZE);

  return {
    factions,
    types,
    rarities,
    keywords,
    tags,
    highCostCount: sanitizeFiniteInteger(profile?.highCostCount, 0, 0, MAX_DECK_SIZE),
    keywordCount: sanitizeFiniteInteger(profile?.keywordCount, 0, 0, MAX_DECK_SIZE * 4),
    synergyCardCount: sanitizeFiniteInteger(profile?.synergyCardCount, 0, 0, MAX_DECK_SIZE),
    deathEffectCount: sanitizeFiniteInteger(profile?.deathEffectCount, 0, 0, MAX_DECK_SIZE),
    eliteCount: sanitizeFiniteInteger(profile?.eliteCount, 0, 0, MAX_DECK_SIZE),
    powerScore: sanitizeFiniteNumber(profile?.powerScore, 0, 0, 999, 1),
    recommendedDifficultyId: getArenaDifficultyId(profile?.recommendedDifficultyId),
    diverseFactionCount: Object.keys(factions).length,
    raritySpread: Object.keys(rarities).length,
  };
}

function sanitizeMatchSide(side) {
  if (!side || typeof side !== "object") {
    return null;
  }

  const deck = Array.isArray(side.deck)
    ? side.deck.filter((cardId) => CARD_MAP.has(cardId)).slice(0, MAX_DECK_SIZE)
    : [];
  const hand = Array.isArray(side.hand)
    ? side.hand.filter((cardId) => CARD_MAP.has(cardId)).slice(0, MAX_DECK_SIZE)
    : [];
  const board = Array.isArray(side.board)
    ? side.board
      .slice(0, APP_CONFIG.boardSize)
      .map((unit, index) => sanitizeMatchUnit(unit, index + 1))
      .filter(Boolean)
    : [];
  const cooldowns = {};

  if (side.cooldowns && typeof side.cooldowns === "object") {
    Object.entries(side.cooldowns).forEach(([cardId, turns]) => {
      if (!CARD_MAP.has(cardId)) {
        return;
      }
      const safeTurns = sanitizeFiniteInteger(turns, 0, 0, 12);
      if (safeTurns > 0) {
        cooldowns[cardId] = safeTurns;
      }
    });
  }

  return {
    hero: sanitizeFiniteInteger(side.hero, APP_CONFIG.heroHealth, 0, 999),
    heroBarrier: sanitizeFiniteInteger(side.heroBarrier, 0, 0, 200),
    maxMana: sanitizeFiniteInteger(side.maxMana, 0, 0, 20),
    mana: sanitizeFiniteInteger(side.mana, 0, 0, 20),
    deck,
    hand,
    board,
    cooldowns,
    fatigueDamage: sanitizeFiniteInteger(side.fatigueDamage, APP_CONFIG.fatigueBaseDamage, APP_CONFIG.fatigueBaseDamage, 99),
    deckProfile: sanitizeMatchDeckProfile(side.deckProfile),
  };
}

function sanitizeSavedMatchState(match) {
  if (!match || typeof match !== "object") {
    return null;
  }

  const player = sanitizeMatchSide(match.player);
  const enemy = sanitizeMatchSide(match.enemy);

  if (!player || !enemy) {
    return null;
  }

  const statuses = new Set(["active", "won", "lost"]);
  const phases = new Set(["player", "enemy"]);
  const log = Array.isArray(match.log)
    ? match.log
      .slice(-120)
      .map((entry) => ({
        turn: String(entry?.turn || "").slice(0, 40) || `Runde ${sanitizeFiniteInteger(match.turn, 0, 0, 999)}`,
        text: String(entry?.text || "").slice(0, 240),
      }))
      .filter((entry) => entry.text)
    : [];
  const highestUid = Math.max(
    0,
    ...player.board.map((unit) => unit.uid || 0),
    ...enemy.board.map((unit) => unit.uid || 0),
  );
  let status = statuses.has(match.status) ? match.status : "active";

  if (status === "active" && (player.hero <= 0 || enemy.hero <= 0)) {
    status = player.hero <= 0 ? "lost" : "won";
  }

  return {
    difficultyId: getArenaDifficultyId(match.difficultyId),
    recommendedDifficultyId: getArenaDifficultyId(match.recommendedDifficultyId),
    antiFarmGap: sanitizeFiniteInteger(match.antiFarmGap, 0, 0, 3),
    antiFarmActive: Boolean(match.antiFarmActive),
    rewardWin: sanitizeFiniteInteger(match.rewardWin, getArenaDifficulty(match.difficultyId).rewardWin, 0, SECURITY_LIMITS.maxGold),
    rewardLoss: sanitizeFiniteInteger(match.rewardLoss, getArenaDifficulty(match.difficultyId).rewardLoss, 0, SECURITY_LIMITS.maxGold),
    rankWin: sanitizeFiniteInteger(match.rankWin, getArenaDifficulty(match.difficultyId).rankWin, 0, SECURITY_LIMITS.maxGold),
    rankLoss: sanitizeFiniteInteger(match.rankLoss, getArenaDifficulty(match.difficultyId).rankLoss, 0, SECURITY_LIMITS.maxGold),
    forfeitPenalty: sanitizeFiniteInteger(match.forfeitPenalty, getArenaDifficulty(match.difficultyId).forfeitPenalty, 0, SECURITY_LIMITS.maxGold),
    mode: match.mode === "friend" ? "friend" : "arena",
    deckMode: getDeckModeId(match.deckMode || getDeckModeForDifficulty(match.difficultyId)),
    opponentLabel: String(match.opponentLabel || "").slice(0, 32),
    opponentDeckName: String(match.opponentDeckName || "").slice(0, 48),
    stakedDeck: Array.isArray(match.stakedDeck) ? match.stakedDeck.filter((cardId) => CARD_MAP.has(cardId)).slice(0, MAX_DECK_SIZE) : [],
    turn: sanitizeFiniteInteger(match.turn, 0, 0, 999),
    phase: phases.has(match.phase) ? match.phase : "player",
    status,
    statusMessage: String(match.statusMessage || "").slice(0, 240),
    log,
    uidCounter: sanitizeFiniteInteger(match.uidCounter, highestUid, highestUid, 99999),
    player,
    enemy,
  };
}

function normalizePasswordHash(username, passwordHash) {
  if (username === ADMIN_BOOTSTRAP.username) {
    return cloneJsonValue(ADMIN_BOOTSTRAP.passwordHash);
  }

  if (isPasswordRecord(passwordHash)) {
    return {
      version: PASSWORD_KDF.version,
      algo: PASSWORD_KDF.algo,
      iterations: sanitizeFiniteInteger(passwordHash.iterations, PASSWORD_KDF.iterations, 50000, 300000),
      salt: passwordHash.salt,
      hash: passwordHash.hash,
    };
  }

  return typeof passwordHash === "string" ? passwordHash : "";
}

function normalizeAccount(account) {
  const username = sanitizeUsername(account?.username);

  if (!username) {
    return {
      username: "",
      passwordHash: "",
      isAdmin: false,
      createdAt: new Date().toISOString(),
      sessionToken: null,
      save: createEmptySave(),
    };
  }

  const baseSave = createEmptySave();
  const save = account?.save || baseSave;
  const decks = sanitizeDecks(save.decks);
  const hardcoreDeck = sanitizeHardcoreDeck(save.hardcoreDeck);
  const cosmetics = sanitizeCosmeticInventory(save.cosmetics, baseSave.cosmetics);
  const isAdmin = username === ADMIN_BOOTSTRAP.username && account?.isAdmin === true;
  const normalized = {
    ...account,
    username,
    passwordHash: normalizePasswordHash(username, account?.passwordHash),
    isAdmin,
    createdAt: typeof account?.createdAt === "string" ? account.createdAt : new Date().toISOString(),
    sessionToken: isValidSessionToken(account?.sessionToken) ? account.sessionToken : null,
    save: {
      ...baseSave,
      gold: sanitizeFiniteInteger(save.gold, baseSave.gold, 0, SECURITY_LIMITS.maxGold),
      collection: sanitizeCollection(save.collection),
      packs: sanitizePackInventory(save.packs, baseSave.packs),
      settings: sanitizePlayerSettings(save.settings, baseSave.settings),
      friends: sanitizeFriendState(save.friends, baseSave.friends),
      progression: sanitizeProgressionState(save.progression, baseSave.progression),
      cosmetics,
      profileDisplay: sanitizeProfileDisplayState(save.profileDisplay, baseSave.profileDisplay, cosmetics),
      filters: sanitizeCollectionFilters(save.filters, baseSave.filters),
      lastOpened: sanitizeLastOpened(save.lastOpened, baseSave.lastOpened),
      activeMatch: sanitizeSavedMatchState(save.activeMatch),
      decks,
      hardcoreDeck,
      activeDeckId: typeof save.activeDeckId === "string" ? save.activeDeckId : baseSave.activeDeckId,
      shopTab: sanitizeShopTab(save.shopTab, baseSave.shopTab),
      selectedPack: PACK_DEFINITIONS[save.selectedPack] ? save.selectedPack : baseSave.selectedPack,
      arenaDifficulty: getArenaDifficultyId(save.arenaDifficulty),
    },
  };

  if (!normalized.save.decks.some((deck) => deck.id === normalized.save.activeDeckId)) {
    normalized.save.activeDeckId = normalized.save.decks[0].id;
  }

  return normalized;
}

function ensureAdminAccount() {
  if (isServerRuntimeCandidate()) {
    return;
  }

  const existing = database.accounts[ADMIN_BOOTSTRAP.username];
  const normalized = normalizeAccount({
    ...existing,
    username: ADMIN_BOOTSTRAP.username,
    passwordHash: cloneJsonValue(ADMIN_BOOTSTRAP.passwordHash),
    isAdmin: true,
    createdAt: existing?.createdAt || new Date().toISOString(),
    save: existing?.save || createEmptySave(),
    sessionToken: existing?.sessionToken || null,
  });
  const before = existing ? JSON.stringify(existing) : "";
  const after = JSON.stringify(normalized);
  database.accounts[ADMIN_BOOTSTRAP.username] = normalized;

  if (before !== after) {
    saveDatabase();
  }
}

function isCurrentUserAdmin() {
  return Boolean(currentAccount?.isAdmin && currentAccount?.username === ADMIN_BOOTSTRAP.username);
}

function getSave() {
  return currentAccount?.save;
}

function getUserSettings() {
  return getSave()?.settings || createDefaultSettings();
}

function getFriendState() {
  return getSave()?.friends || createDefaultFriendState();
}

function applyUserSettingsToDocument() {
  const settings = getUserSettings();

  if (document.body?.dataset) {
    document.body.dataset.motion = settings.reducedMotion ? "reduced" : "full";
    document.body.dataset.clickFx = settings.clickEffects ? "on" : "off";
    document.body.dataset.packFx = settings.packEffects ? "on" : "off";
  }

  if (elements.gameShell?.dataset) {
    elements.gameShell.dataset.motion = settings.reducedMotion ? "reduced" : "full";
  }
}

function requestActionConfirmation(message, { force = false } = {}) {
  if (!force && !getUserSettings().confirmActions) {
    return true;
  }

  return window.confirm(message);
}

function formatAccountDate(value) {
  const parsed = new Date(value);

  if (!Number.isFinite(parsed.getTime())) {
    return "Unbekannt";
  }

  return new Intl.DateTimeFormat(getCurrentLocale(), {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function getFriendCode(account = currentAccount) {
  if (!account?.username) {
    return "AV-0000-0000";
  }

  const source = `${account.username}|${account.createdAt || "0"}|arcane-vault-social`;
  const value = simpleHash(source).padStart(10, "0").slice(0, 10);
  return `AV-${value.slice(0, 4)}-${value.slice(4, 10)}`;
}

function updateAccountSetting(key, value) {
  if (!currentAccount || !(key in getUserSettings())) {
    return;
  }

  getSave().settings[key] = value;
  if (key === "language") {
    uiState.previewLanguage = value;
  }
  persistCurrentAccount();
  applyUserSettingsToDocument();
}

function loadDatabase() {
  if (isServerRuntimeCandidate()) {
    return { version: 2, accounts: {}, market: createInitialMarketState() };
  }

  const raw = localStorage.getItem(STORAGE_KEYS.database);

  if (!raw) {
    return { version: 2, accounts: {}, market: createInitialMarketState() };
  }

  try {
    const parsed = JSON.parse(raw);
    const accounts = {};

    if (parsed.accounts && typeof parsed.accounts === "object") {
      Object.entries(parsed.accounts).forEach(([key, account]) => {
        const username = sanitizeUsername(key) || sanitizeUsername(account?.username);
        if (!username) {
          return;
        }

        const canonicalUsername = canonicalizeUsername(username);
        const existingKey = Object.keys(accounts).find((entry) => canonicalizeUsername(entry) === canonicalUsername);
        if (existingKey && username !== ADMIN_BOOTSTRAP.username) {
          return;
        }

        const normalized = normalizeAccount({
          ...account,
          username,
        });

        if (normalized.username) {
          if (existingKey && existingKey !== username) {
            delete accounts[existingKey];
          }
          accounts[username] = normalized;
        }
      });
    }

    return {
      version: 2,
      accounts,
      market: normalizeMarketState(parsed.market),
    };
  } catch {
    return { version: 2, accounts: {}, market: createInitialMarketState() };
  }
}

function loadSession() {
  const parsed = getSessionSnapshot();

  if (!parsed) {
    return null;
  }

  try {
    const username = sanitizeUsername(parsed?.username);
    const token = parsed?.token;
    const mode = parsed?.mode === SESSION_MODES.server ? SESSION_MODES.server : SESSION_MODES.local;

    if (!username || !isValidSessionToken(token)) {
      clearSessionSnapshot();
      return null;
    }

    if (mode === SESSION_MODES.server) {
      return username;
    }

    const storedUsername = findStoredUsername(username);
    const account = storedUsername ? normalizeAccount(database.accounts[storedUsername]) : null;
    if (!account || !safeStringEqual(account.sessionToken, token)) {
      clearSessionSnapshot();
      return null;
    }

    return storedUsername;
  } catch {
    clearSessionSnapshot();
    return null;
  }
}

function saveDatabase() {
  const normalizedAccounts = {};

  Object.entries(database.accounts || {}).forEach(([key, account]) => {
    const username = sanitizeUsername(key) || sanitizeUsername(account?.username);
    if (!username) {
      return;
    }

    const canonicalUsername = canonicalizeUsername(username);
    const existingKey = Object.keys(normalizedAccounts).find((entry) => canonicalizeUsername(entry) === canonicalUsername);
    if (existingKey && username !== ADMIN_BOOTSTRAP.username) {
      return;
    }

    const normalized = normalizeAccount({
      ...account,
      username,
    });

    if (normalized.username) {
      if (existingKey && existingKey !== username) {
        delete normalizedAccounts[existingKey];
      }
      normalizedAccounts[username] = normalized;
    }
  });

  database = {
    version: 2,
    accounts: normalizedAccounts,
    market: normalizeMarketState(database.market),
  };

  if (!isServerRuntimeCandidate()) {
    localStorage.setItem(STORAGE_KEYS.database, JSON.stringify(database));
  }
}

function syncCurrentMatchStateIntoAccount() {
  if (!currentAccount?.save) {
    return false;
  }

  const snapshot = sanitizeSavedMatchState(cloneJsonValue(uiState.match));
  const before = JSON.stringify(currentAccount.save.activeMatch ?? null);
  const after = JSON.stringify(snapshot);
  currentAccount.save.activeMatch = snapshot;
  return before !== after;
}

function restoreRuntimeMatchFromAccount(forceArena = false) {
  uiState.match = currentAccount?.save?.activeMatch ? cloneJsonValue(currentAccount.save.activeMatch) : null;

  if (forceArena && uiState.match) {
    uiState.section = "arena";
  }
}

function persistCurrentMatchIfNeeded(forceArena = false) {
  if (!currentAccount) {
    return;
  }

  if (!syncCurrentMatchStateIntoAccount()) {
    return;
  }

  database.accounts[currentAccount.username] = normalizeAccount(currentAccount);
  saveDatabase();
  currentAccount = database.accounts[currentAccount.username];
  restoreRuntimeMatchFromAccount(forceArena);
  if (isServerSessionActive()) {
    queueServerSaveSync();
  }
}

function persistCurrentAccount() {
  if (!currentAccount) {
    return;
  }

  syncCurrentMatchStateIntoAccount();
  database.accounts[currentAccount.username] = normalizeAccount(currentAccount);
  saveDatabase();
  currentAccount = database.accounts[currentAccount.username];
  restoreRuntimeMatchFromAccount();
  if (isServerSessionActive()) {
    queueServerSaveSync();
  }
}

function handleMarketTick() {
  const changed = syncMarketState();

  if (changed && currentAccount) {
    if (isServerSessionActive()) {
      queueServerMarketSync();
    }
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

function sanitizeMarketEntry(card, entry) {
  const anchor = getMarketAnchor(card);
  const basePrice = Math.max(4, Math.round(anchor));
  const price = sanitizeFiniteInteger(entry?.price, basePrice, 4, SECURITY_LIMITS.maxMarketPrice);
  const buyFloor = Math.max(price + 2, Math.round(price * 1.08));

  return {
    price,
    buyPrice: sanitizeFiniteInteger(entry?.buyPrice, buyFloor, buyFloor, SECURITY_LIMITS.maxMarketPrice),
    demand: sanitizeFiniteNumber(entry?.demand, 48, 8, 96, 2),
    supply: sanitizeFiniteNumber(entry?.supply, 48, 8, 96, 2),
    momentum: sanitizeFiniteNumber(entry?.momentum, 0, -0.9, 1.2, 3),
    lastDeltaPct: sanitizeFiniteNumber(entry?.lastDeltaPct, 0, -80, 80, 1),
    tradePressure: sanitizeFiniteNumber(entry?.tradePressure, 0, -SECURITY_LIMITS.maxTradePressure, SECURITY_LIMITS.maxTradePressure, 2),
  };
}

function normalizeMarketState(market) {
  const base = createInitialMarketState();

  if (!market || typeof market !== "object") {
    return base;
  }

  const normalized = {
    lastHourKey: typeof market.lastHourKey === "string" ? market.lastHourKey : base.lastHourKey,
    feeVault: sanitizeFiniteInteger(market.feeVault, base.feeVault, 0, SECURITY_LIMITS.maxFeeVault),
    cards: { ...base.cards },
  };

  Object.entries(base.cards).forEach(([cardId, entry]) => {
    if (market.cards && market.cards[cardId]) {
      const card = CARD_MAP.get(cardId);
      normalized.cards[cardId] = card ? sanitizeMarketEntry(card, market.cards[cardId]) : entry;
    }
  });

  return normalized;
}

function updateMarketForHour(market) {
  CARD_POOL.forEach((card) => {
    const state = market.cards[card.id];
    const anchor = getMarketAnchor(card);
    const rarityDemandBias = { common: -1.4, rare: -0.4, epic: 0.8, legendary: 1.4, ultra: 2.2, mythic: 3, transcendent: 4.2, singular: 5.6 }[card.rarity];
    const raritySupplyBias = { common: 2.4, rare: 1.2, epic: 0.4, legendary: -0.6, ultra: -1.4, mythic: -2.2, transcendent: -3.4, singular: -4.8 }[card.rarity];
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
  const rarityFactor = { common: 1, rare: 1.3, epic: 1.8, legendary: 2.35, ultra: 3.05, mythic: 4.1, transcendent: 5.6, singular: 7.4 }[card.rarity];
  const typeFactor = { unit: 1.05, spell: 1.12, trainer: 1.16 }[card.type];
  return Math.round((RARITY_META[card.rarity].sellValue * 1.6 + (card.cost || 0) * 6 + 10) * rarityFactor * typeFactor / 2.25);
}

function getMarketEntry(cardId) {
  const card = CARD_MAP.get(cardId);

  if (!card) {
    return null;
  }

  const nextEntry = sanitizeMarketEntry(card, database.market.cards[cardId]);
  database.market.cards[cardId] = nextEntry;
  return nextEntry;
}

function getMarketSellPrice(cardId) {
  return getMarketEntry(cardId)?.price || 0;
}

function getMarketBuyPrice(cardId) {
  return getMarketEntry(cardId)?.buyPrice || 0;
}

function getMarketSaleQuote(cardId, amount = 1) {
  const quantity = sanitizeFiniteInteger(amount, 1, 1, SECURITY_LIMITS.maxTransactionAmount);
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

  if (!entry || !["buy", "sell"].includes(direction)) {
    return;
  }

  const tradeAmount = sanitizeFiniteInteger(amount, 0, 0, SECURITY_LIMITS.maxTransactionAmount);
  if (!tradeAmount) {
    return;
  }

  const movement = Math.min(5, tradeAmount * 0.7);
  entry.tradePressure = sanitizeFiniteNumber(
    entry.tradePressure + (direction === "buy" ? movement : -movement),
    0,
    -SECURITY_LIMITS.maxTradePressure,
    SECURITY_LIMITS.maxTradePressure,
    2,
  );
}

function summarizeSave(save) {
  return {
    totalCards: Object.values(save.collection).reduce((sum, value) => sum + value, 0),
    uniqueCards: Object.values(save.collection).filter((value) => value > 0).length,
    totalBoosters: Object.values(save.packs).reduce((sum, value) => sum + value, 0),
  };
}

function applyPlayerNameScale(name) {
  if (!elements.playerName) {
    return;
  }

  const length = String(name || "").length;
  const size = length >= 12 ? "xs" : length >= 10 ? "sm" : length >= 8 ? "md" : "lg";
  elements.playerName.dataset.size = size;
  if (elements.playerName.parentElement) {
    elements.playerName.parentElement.dataset.nameSize = size;
  }
}

function renderMainMenu() {
  if (!elements.menuSummaryGrid) {
    return;
  }

  const save = getSave();
  const summary = summarizeSave(save);
  const arenaDifficultyId = getArenaDifficultyId(save.arenaDifficulty);
  const arenaDifficulty = getArenaDifficulty(arenaDifficultyId);
  const arenaDeckMode = getDeckModeForDifficulty(arenaDifficultyId);
  const arenaDeck = getDeckByMode(arenaDeckMode);
  const deckRules = getDeckRules(arenaDeckMode);
  const validation = validateDeck(arenaDeck, arenaDeckMode);
  const progression = getProgression();
  const rank = getRankState(progression.rankPoints);
  const dailyQuests = getCurrentDailyQuests();
  const claimableDaily = dailyQuests.filter((quest) => isQuestClaimable(progression, quest)).length;
  if (isServerSessionActive() && !uiState.multiplayerHydrated && !uiState.multiplayerLoading) {
    queueMicrotask(async () => {
      await hydrateMultiplayerSection({ render: false });
      renderMainMenu();
      if (uiState.section === "multiplayer") {
        renderMultiplayer();
      }
    });
  }
  const menuTexts = {
    eyebrow: localText("Hauptmenü", "Main Menu", "Menu principal"),
    title: localText("Alles Wichtige startet in der Arena", "Everything important starts in the arena", "L'essentiel commence dans l'arène"),
    note: localText(
      "Kämpfe bringen Gold. Gold bringt Booster. Booster bringen neue Karten.",
      "Battles bring gold. Gold brings boosters. Boosters bring new cards.",
      "Les combats donnent de l'or. L'or donne des boosters. Les boosters donnent de nouvelles cartes."
    ),
  };

  const summaryCards = [
    { label: localText("Gold", "Gold", "Or"), value: save.gold },
    { label: localText("Karten", "Cards", "Cartes"), value: summary.totalCards },
    { label: localText("Einzigartig", "Unique", "Uniques"), value: summary.uniqueCards },
    { label: localText("Booster", "Boosters", "Boosters"), value: summary.totalBoosters },
  ];

  document.getElementById("menuEyebrow").textContent = menuTexts.eyebrow;
  document.getElementById("menuTitle").textContent = menuTexts.title;
  document.getElementById("menuNote").textContent = menuTexts.note;

  elements.menuSummaryGrid.innerHTML = summaryCards
    .map(
      (entry) => `
        <article class="menu-summary-card">
          <span>${entry.label}</span>
          <strong>${entry.value}</strong>
        </article>
      `
    )
    .join("");

  document.getElementById("menuArenaKicker").textContent = localText("Hauptmodus", "Main mode", "Mode principal");
  document.getElementById("menuArenaTitle").textContent = getUiText("nav.arena");
  document.getElementById("menuArenaText").textContent = localText(
    "Spiele Matches, gewinne Gold und halte deinen Fortschritt am Laufen.",
    "Play matches, earn gold and keep your progress moving.",
    "Joue des matchs, gagne de l'or et fais progresser ta collection."
  );
  document.getElementById("menuArenaMeta").innerHTML = [
    getArenaDifficultyLabel(arenaDifficultyId),
    getDeckModeTitle(arenaDeckMode),
    validation.valid ? getUiText("decks.playable") : getUiText("arena.notReady"),
  ]
    .map((entry) => `<span class="meta-chip">${entry}</span>`)
    .join("");
  document.getElementById("menuArenaStats").innerHTML = [
    {
      label: localText("Sieg", "Win", "Victoire"),
      value: localText(`${arenaDifficulty.rewardWin} Gold`, `${arenaDifficulty.rewardWin} Gold`, `${arenaDifficulty.rewardWin} or`),
    },
    {
      label: localText("Deck", "Deck", "Deck"),
      value: `${arenaDeck.cards.length}/${deckRules.size}`,
    },
    {
      label: localText("Status", "Status", "Statut"),
      value: validation.valid ? getUiText("decks.playable") : getUiText("arena.notReady"),
    },
  ]
    .map(
      (entry) => `
        <article class="menu-arena-stat">
          <span>${entry.label}</span>
          <strong>${entry.value}</strong>
        </article>
      `
    )
    .join("");
  const multiplayerDeck = getActiveDeck();
  const multiplayerValidation = validateDeck(multiplayerDeck, DECK_MODES.standard);
  const multiplayerQueueCount = uiState.multiplayerQueue.length;
  const multiplayerIncomingCount = uiState.multiplayerIncomingChallenges.length;
  document.getElementById("menuMultiplayerKicker").textContent = localText("Mehrspieler", "Multiplayer", "Multijoueur");
  document.getElementById("menuMultiplayerTitle").textContent = localText("Multiplayer", "Multiplayer", "Multijoueur");
  document.getElementById("menuMultiplayerText").textContent = localText(
    "Tritt gegen echte Spieler an, stelle dich in die Queue oder nimm offene Herausforderungen direkt an.",
    "Face real players, join the queue or accept open challenges right away.",
    "Affronte de vrais joueurs, entre dans la file ou accepte des défis ouverts immédiatement."
  );
  document.getElementById("menuMultiplayerMeta").innerHTML = [
    localText(`${multiplayerQueueCount} in Queue`, `${multiplayerQueueCount} in queue`, `${multiplayerQueueCount} en file`),
    multiplayerIncomingCount > 0
      ? localText(`${multiplayerIncomingCount} offen`, `${multiplayerIncomingCount} open`, `${multiplayerIncomingCount} en attente`)
      : localText("Keine offene Challenge", "No open challenge", "Aucun défi ouvert"),
    multiplayerValidation.valid
      ? localText("Standard-Deck bereit", "Standard deck ready", "Deck standard prêt")
      : localText("Standard-Deck fehlt", "Standard deck missing", "Deck standard manquant"),
  ]
    .map((entry) => `<span class="meta-chip">${entry}</span>`)
    .join("");
  const menuCards = [
    {
      ids: ["menuBoosterKicker", "menuBoosterTitle", "menuBoosterText", "menuBoosterMeta"],
      kicker: localText("Booster", "Boosters", "Boosters"),
      title: getUiText("nav.booster"),
      text: localText("Öffne Booster und erweitere deine Sammlung sofort.", "Open boosters and expand your collection right away.", "Ouvre des boosters et agrandis ta collection tout de suite."),
      meta: localText(`${summary.totalBoosters} im Besitz`, `${summary.totalBoosters} owned`, `${summary.totalBoosters} en stock`),
    },
    {
      ids: ["menuCollectionKicker", "menuCollectionTitle", "menuCollectionText", "menuCollectionMeta"],
      kicker: localText("Sammlung", "Collection", "Collection"),
      title: getUiText("nav.collection"),
      text: localText("Suche Karten, lies Effekte und vergleiche Werte.", "Search cards, read effects and compare values.", "Cherche des cartes, lis les effets et compare les valeurs."),
      meta: localText(`${summary.uniqueCards} einzigartige Karten`, `${summary.uniqueCards} unique cards`, `${summary.uniqueCards} cartes uniques`),
    },
    {
      ids: ["menuDecksKicker", "menuDecksTitle", "menuDecksText", "menuDecksMeta"],
      kicker: localText("Deckbau", "Deckbuilding", "Construction"),
      title: getUiText("nav.decks"),
      text: localText("Baue Standard- und Hardcore-Decks gezielt auf.", "Build standard and hardcore decks with intent.", "Construis tes decks standard et hardcore avec précision."),
      meta: validation.valid
        ? localText(`${getDeckModeTitle(arenaDeckMode)} bereit`, `${getDeckModeTitle(arenaDeckMode)} ready`, `${getDeckModeTitle(arenaDeckMode)} prêt`)
        : localText("Arena-Deck noch nicht spielbereit", "Arena deck not ready yet", "Le deck d'arène n'est pas encore prêt"),
    },
    {
      ids: ["menuProgressKicker", "menuProgressTitle", "menuProgressText", "menuProgressMeta"],
      kicker: localText("Fortschritt", "Progress", "Progression"),
      title: localText("Quests und Liga", "Quests and league", "Quêtes et ligue"),
      text: localText("Verfolge Tagesziele, Rang, Album und Booster-Pity zentral.", "Track daily goals, rank, album and booster pity in one place.", "Suis tes objectifs, ton rang, l'album et la pity des boosters au même endroit."),
      meta: claimableDaily > 0
        ? localText(`${claimableDaily} Daily-Quest bereit`, `${claimableDaily} daily quest ready`, `${claimableDaily} quête prête`)
        : localText(`Rang ${rank.label}`, `Rank ${rank.label}`, `Rang ${rank.label}`),
    },
    {
      ids: ["menuShopKicker", "menuShopTitle", "menuShopText", "menuShopMeta"],
      kicker: localText("Shop", "Shop", "Boutique"),
      title: getUiText("nav.shop"),
      text: localText("Kaufe Booster, Packs und Freischaltungen.", "Buy boosters, packs and unlocks.", "Achète des boosters, des packs et des déblocages."),
      meta: localText(`${save.gold} Gold verfügbar`, `${save.gold} gold available`, `${save.gold} or disponible`),
    },
    {
      ids: ["menuMarketKicker", "menuMarketTitle", "menuMarketText", "menuMarketMeta"],
      kicker: localText("Markt", "Market", "Marché"),
      title: getUiText("nav.marketplace"),
      text: localText("Beobachte Trends und handle Karten clever.", "Track trends and trade cards smartly.", "Observe les tendances et échange les cartes intelligemment."),
      meta: localText(`Nächste Runde in ${getNextMarketUpdateLabel()}`, `Next round in ${getNextMarketUpdateLabel()}`, `Prochaine ronde dans ${getNextMarketUpdateLabel()}`),
    },
    {
      ids: ["menuWikiKicker", "menuWikiTitle", "menuWikiText", "menuWikiMeta"],
      kicker: localText("Wiki", "Wiki", "Wiki"),
      title: getUiText("nav.wiki"),
      text: localText("Finde Symbole, Systeme und Begriffe schnell.", "Find symbols, systems and terms quickly.", "Retrouve rapidement les symboles, systèmes et termes."),
      meta: localText("Regeln, Effekte und Fortschritt", "Rules, effects and progression", "Règles, effets et progression"),
    },
    {
      ids: ["menuFriendsKicker", "menuFriendsTitle", "menuFriendsText", "menuFriendsMeta"],
      kicker: localText("Freunde", "Friends", "Amis"),
      title: localText("Handel und Duelle", "Trading and duels", "Échanges et duels"),
      text: localText("Suche Spieler, handle fair und fordere Freunde direkt heraus.", "Find players, trade fairly and challenge friends directly.", "Trouve des joueurs, échange équitablement et défie tes amis."),
      meta: localText(`${getFriendState().friends.length} Freunde`, `${getFriendState().friends.length} friends`, `${getFriendState().friends.length} amis`),
    },
  ];

  if (isCurrentUserAdmin()) {
    menuCards.push({
      ids: ["menuAdminKicker", "menuAdminTitle", "menuAdminText", "menuAdminMeta"],
      kicker: localText("Admin", "Admin", "Admin"),
      title: getUiText("nav.admin"),
      text: localText("Greife auf Konten und Serverwerkzeuge zu.", "Access accounts and server tools.", "Accède aux comptes et aux outils serveur."),
      meta: localText("Nur für Verwaltung", "Admin only", "Réservé à l'administration"),
    });
  }

  menuCards.forEach((entry) => {
    const [kickerId, titleId, textId, metaId] = entry.ids;
    const kicker = document.getElementById(kickerId);
    const title = document.getElementById(titleId);
    const text = document.getElementById(textId);
    const meta = document.getElementById(metaId);
    if (kicker) kicker.textContent = entry.kicker;
    if (title) title.textContent = entry.title;
    if (text) text.textContent = entry.text;
    if (meta) meta.textContent = entry.meta;
  });
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
  applyUserSettingsToDocument();
  applyStaticTranslations();

  if (!signedIn) {
    switchAuthMode(uiState.authMode);
    updateFloatingResourceBarVisibility();
    return;
  }

  if (!isCurrentUserAdmin() && uiState.section === "admin") {
    uiState.section = "menu";
  }

  uiState.previewLanguage = getUserSettings().language;
  const questStateChanged = ensureQuestRotationState(getProgression(), getSave());
  if (questStateChanged) {
    persistCurrentAccount();
  }
  populateFilterControls();
  elements.playerName.textContent = currentAccount.username;
  applyPlayerNameScale(currentAccount.username);
  elements.searchInput.value = getSave().filters.search;
  elements.sortFilter.value = getSave().filters.sort;
  elements.marketSearchInput.value = uiState.marketFilters.search;
  elements.marketRarityFilter.value = uiState.marketFilters.rarity;
  elements.marketSortSelect.value = uiState.marketFilters.sort;
  elements.wikiSearchInput.value = uiState.wikiSearch;
  elements.rarityFilter.value = getSave().filters.rarity;
  elements.typeFilter.value = getSave().filters.type;
  elements.factionFilter.value = getSave().filters.faction;
  elements.costFilter.value = getSave().filters.cost;
  elements.settingsLanguageSelect.value = getUserSettings().language;
  elements.ownedOnlyToggle.checked = Boolean(getSave().filters.ownedOnly);
  elements.duplicatesOnlyToggle.checked = Boolean(getSave().filters.duplicatesOnly);

  applySceneTheme(uiState.section, true);
  renderNavigation();
  renderResources();
  renderMainMenu();
  renderShop();
  renderMarketplace();
  renderBoosterLab();
  renderCollection();
  renderDeckManager();
  renderProgress();
  renderWiki();
  renderProfile();
  renderFriends();
  renderMultiplayer();
  renderSettings();
  renderAdminPanel();
  renderArena();
  renderCardModal();
  updateFloatingResourceBarVisibility();
}

function isMatchActive(match = uiState.match) {
  return Boolean(match && match.status === "active");
}

function isMatchSessionLocked() {
  return isMatchActive();
}

function isSectionNavigationLocked(section) {
  return isMatchSessionLocked() && section !== "arena";
}

function requestSectionChange(section) {
  if (isSectionNavigationLocked(section)) {
    showToast(getUiText("messages.matchNavigationLocked"));
    return;
  }

  if (section !== "arena" && uiState.match && !isMatchActive()) {
    uiState.modalCardId = null;
    uiState.match = null;
    persistCurrentMatchIfNeeded(false);
  }

  uiState.section = section;
  renderAll();
  if (section === "friends") {
    hydrateFriendsSection({ render: true });
  } else if (section === "multiplayer") {
    hydrateMultiplayerSection({ render: true });
  }
}

function renderNavigation() {
  const adminVisible = isCurrentUserAdmin();

  elements.navButtons.forEach((button) => {
    const adminOnly = button.dataset.adminOnly === "true";
    const locked = isSectionNavigationLocked(button.dataset.section);
    button.classList.toggle("hidden", adminOnly && !adminVisible);
    button.classList.toggle("active", button.dataset.section === uiState.section);
    button.classList.toggle("locked", locked);
    button.disabled = locked;
    button.setAttribute("aria-disabled", locked ? "true" : "false");
    if (locked) {
      button.setAttribute("title", getUiText("messages.matchNavigationLocked"));
    }
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
  const rank = getRankState(getProgression().rankPoints);

  elements.resourceBar.innerHTML = "";
  if (elements.floatingResourceBar) {
    elements.floatingResourceBar.innerHTML = "";
  }

  const chips = [
    { label: getCurrentLanguage() === "fr" ? "Or" : getCurrentLanguage() === "en" ? "Gold" : "Gold", value: save.gold, tone: "gold" },
    { label: getCurrentLanguage() === "fr" ? "Cartes" : getCurrentLanguage() === "en" ? "Cards" : "Karten", value: totalCards, tone: "ember" },
    { label: getCurrentLanguage() === "fr" ? "Uniques" : getCurrentLanguage() === "en" ? "Unique" : "Einzigartig", value: uniqueCards, tone: "aqua" },
    { label: getCurrentLanguage() === "fr" ? "Boosters" : getCurrentLanguage() === "en" ? "Boosters" : "Booster", value: totalBoosters, tone: "violet" },
    {
      label: getCurrentLanguage() === "fr" ? "Rang" : getCurrentLanguage() === "en" ? "Rank" : "Rang",
      value: rank.label,
      meta: `${rank.points} RP`,
      tone: "steel",
      className: "rank-chip",
    },
  ];

  chips.forEach((chipData) => {
    const chip = document.createElement("div");
    chip.className = `resource-chip tone-${chipData.tone}${chipData.className ? ` ${chipData.className}` : ""}`;
    chip.innerHTML = `<span>${chipData.label}</span><strong>${chipData.value}</strong>${chipData.meta ? `<small>${chipData.meta}</small>` : ""}`;
    elements.resourceBar.append(chip);
    if (elements.floatingResourceBar) {
      elements.floatingResourceBar.append(chip.cloneNode(true));
    }
  });

  updateFloatingResourceBarVisibility();
}

function shouldShowFloatingResourceBar() {
  if (!elements.floatingResourceBar || !elements.topbar || elements.gameShell.classList.contains("hidden")) {
    return false;
  }

  if (uiState.section === "arena") {
    return false;
  }

  const topbarRect = elements.topbar.getBoundingClientRect();
  return topbarRect.bottom <= 14;
}

function updateFloatingResourceBarVisibility() {
  if (!elements.floatingResourceBar) {
    return;
  }

  const shouldShow = shouldShowFloatingResourceBar();
  elements.floatingResourceBar.classList.toggle("is-visible", shouldShow);
  elements.floatingResourceBar.setAttribute("aria-hidden", shouldShow ? "false" : "true");
}

function renderAdminPanel() {
  if (!isCurrentUserAdmin()) {
    elements.adminAccountList.innerHTML = "";
    elements.adminSelectedSummary.innerHTML = "";
    setAdminControlsDisabled(true);
    return;
  }

  if (isServerSessionActive() && uiState.adminCacheDirty) {
    uiState.adminCacheDirty = false;
    void refreshServerAdminMirror({ render: true });
  }

  const accounts = Object.values(database.accounts)
    .map((account) => normalizeAccount(account))
    .sort((left, right) => Number(right.isAdmin) - Number(left.isAdmin) || left.username.localeCompare(right.username, getCurrentLocale()));

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
          ${account.isAdmin ? `<span class="admin-badge">${getUiText("common.admin")}</span>` : ""}
          ${account.username === currentAccount.username ? `<span class="admin-badge subtle">${getUiText("common.activeSession")}</span>` : ""}
        </div>
      </div>
      <div class="admin-card-meta">
        <span>${formatCurrency(account.save.gold)}</span>
        <span>${stats.totalCards} ${getUiText("adminPanel.totalCards")}</span>
        <span>${stats.totalBoosters} ${getUiText("admin.packInventory")}</span>
      </div>
    `;
    item.addEventListener("click", () => {
      uiState.adminSelectedUser = account.username;
      renderAdminPanel();
    });
    elements.adminAccountList.append(item);
  });

  if (!selectedAccount) {
    elements.adminSelectedSummary.innerHTML = `<p class="mini-note">${getUiText("adminPanel.noAccount")}</p>`;
    setAdminControlsDisabled(true);
    return;
  }

  const stats = summarizeSave(selectedAccount.save);
  const accountProtected = isAccountDeletionProtected(selectedAccount);
  const packLines = Object.values(PACK_DEFINITIONS)
    .map((pack) => `<div class="price-line"><span>${getPackLabel(pack.id)}</span><strong>${selectedAccount.save.packs[pack.id]}</strong></div>`)
    .join("");

  elements.adminSelectedSummary.innerHTML = `
    <div class="admin-summary-head">
      <div>
        <p class="eyebrow">${getUiText("adminPanel.title")}</p>
        <h3>${selectedAccount.username}</h3>
      </div>
      <div class="admin-badges">
        ${selectedAccount.isAdmin ? `<span class="admin-badge">${getUiText("common.admin")}</span>` : `<span class="admin-badge subtle">${getUiText("common.playerAccount")}</span>`}
      </div>
    </div>
    <div class="admin-stat-grid">
      <article class="admin-stat-card">
        <span>${getUiText("adminPanel.gold")}</span>
        <strong>${selectedAccount.save.gold}</strong>
      </article>
      <article class="admin-stat-card">
        <span>${getUiText("adminPanel.totalCards")}</span>
        <strong>${stats.totalCards}</strong>
      </article>
      <article class="admin-stat-card">
        <span>${getUiText("adminPanel.uniqueCards")}</span>
        <strong>${stats.uniqueCards}</strong>
      </article>
      <article class="admin-stat-card">
        <span>${getUiText("adminPanel.savedDecks")}</span>
        <strong>${selectedAccount.save.decks.length}</strong>
      </article>
    </div>
    <div class="detail-block admin-summary-block">
      <h4>${getUiText("adminPanel.packInventory")}</h4>
      <div class="price-stack">${packLines}</div>
    </div>
    <div class="detail-block admin-summary-block">
      <h4>${getUiText("adminPanel.protection")}</h4>
      <p class="mini-note">${accountProtected ? getUiText("adminPanel.protected") : getUiText("adminPanel.deletable")}</p>
    </div>
  `;

  setAdminControlsDisabled(false);
  elements.deleteAccountButton.disabled = accountProtected;
}

function setAdminControlsDisabled(disabled) {
  [
    elements.adminGoldAmount,
    elements.grantGoldButton,
    elements.removeGoldButton,
    elements.adminPackSelect,
    elements.adminPackAmount,
    elements.grantPackButton,
    elements.removePackButton,
    elements.adminCardSelect,
    elements.adminCardAmount,
    elements.grantCardButton,
    elements.removeCardButton,
    elements.deleteAccountButton,
  ].forEach((element) => {
    if (element) {
      element.disabled = disabled;
    }
  });
}

function isAccountDeletionProtected(account) {
  return Boolean(account?.isAdmin || account?.username === ADMIN_BOOTSTRAP.username);
}

function legacyMinimalRenderProfile() {
  if (!currentAccount) {
    elements.profileSummary.innerHTML = "";
    return;
  }

  const save = getSave();
  const stats = summarizeSave(save);
  const activeDeck = getActiveDeck();
  const profileLocked = isCurrentUserAdmin();

  elements.profileSummary.innerHTML = `
    <div class="profile-summary-head">
      <div>
        <p class="eyebrow">${getUiText("profile.activeProfile")}</p>
        <h3>${currentAccount.username}</h3>
        <p class="mini-note">${getUiText("profile.friendCode", { code: getFriendCode(currentAccount), date: formatAccountDate(currentAccount.createdAt) })}</p>
      </div>
      <span class="status-pill ${profileLocked ? "warn" : "ok"}">${profileLocked ? getUiText("profile.locked") : getUiText("profile.editable")}</span>
    </div>
    <div class="profile-stat-grid">
      <article class="profile-stat-card">
        <span>${getCurrentLanguage() === "fr" ? "Or" : getCurrentLanguage() === "en" ? "Gold" : "Gold"}</span>
        <strong>${save.gold}</strong>
      </article>
      <article class="profile-stat-card">
        <span>${getUiText("profile.totalCards")}</span>
        <strong>${stats.totalCards}</strong>
      </article>
      <article class="profile-stat-card">
        <span>${getUiText("profile.totalBoosters")}</span>
        <strong>${stats.totalBoosters}</strong>
      </article>
      <article class="profile-stat-card">
        <span>${getCurrentLanguage() === "fr" ? "Deck actif" : getCurrentLanguage() === "en" ? "Active Deck" : "Aktives Deck"}</span>
        <strong>${activeDeck ? activeDeck.name : getCurrentLanguage() === "fr" ? "Aucun" : getCurrentLanguage() === "en" ? "None" : "Keins"}</strong>
      </article>
    </div>
    <p class="mini-note">${profileLocked ? getUiText("profile.lockedNote") : getUiText("profile.editableNote")}</p>
  `;

  /* elements.profileSummary.innerHTML = `
    <div class="profile-summary-head">
      <div>
        <p class="eyebrow">Aktives Profil</p>
        <h3>${currentAccount.username}</h3>
        <p class="mini-note">Freundescode ${getFriendCode(currentAccount)} · Erstellt am ${formatAccountDate(currentAccount.createdAt)}</p>
      </div>
      <span class="status-pill ${profileLocked ? "warn" : "ok"}">${profileLocked ? "Fixiert" : "Bearbeitbar"}</span>
    </div>
    <div class="profile-stat-grid">
      <article class="profile-stat-card">
        <span>Gold</span>
        <strong>${save.gold}</strong>
      </article>
      <article class="profile-stat-card">
        <span>Karten gesamt</span>
        <strong>${stats.totalCards}</strong>
      </article>
      <article class="profile-stat-card">
        <span>Booster gesamt</span>
        <strong>${stats.totalBoosters}</strong>
      </article>
      <article class="profile-stat-card">
        <span>Aktives Deck</span>
        <strong>${activeDeck ? activeDeck.name : "Keins"}</strong>
      </article>
    </div>
    <p class="mini-note">${profileLocked ? "Das Administratorkonto bleibt absichtlich an die reservierten Bootstrap-Daten gebunden." : "Namens- und Passwortänderungen prüfen das aktuelle Passwort und aktualisieren die laufende Sitzung direkt mit."}</p>
  `; */

  elements.profileNameInput.value = currentAccount.username;
  [
    elements.profileNameInput,
    elements.profileRenamePasswordInput,
    elements.profileCurrentPasswordInput,
    elements.profileNewPasswordInput,
    elements.profileConfirmPasswordInput,
  ].forEach((field) => {
    field.disabled = profileLocked;
  });
  [...elements.profileRenameForm.querySelectorAll("button"), ...elements.profilePasswordForm.querySelectorAll("button")].forEach((button) => {
    button.disabled = profileLocked;
  });
}

function renderProfile() {
  return legacyRenderProfile();
}

function renderFriendBucket(element, { eyebrow, title, list, emptyText, note }) {
  const rows = list.length
    ? list.map((entry) => `<div class="friend-row"><strong>${entry}</strong><span>${getCurrentLanguage() === "fr" ? "Contact du réseau" : getCurrentLanguage() === "en" ? "Network contact" : "Netzwerkkontakt"}</span></div>`).join("")
    : `<p class="mini-note">${emptyText}</p>`;

  element.innerHTML = `
    <p class="eyebrow">${eyebrow}</p>
    <h3 class="subheading">${title}</h3>
    <div class="friend-list">${rows}</div>
    <p class="mini-note">${note}</p>
  `;
}

function renderFriends() {
  return legacyRenderFriends();
  if (!currentAccount) {
    elements.friendsSummary.innerHTML = "";
    elements.friendsListPanel.innerHTML = "";
    elements.friendsPendingPanel.innerHTML = "";
    elements.friendsTradePanel.innerHTML = "";
    return;
  }

  const social = getFriendState();
  const totalTracked = social.friends.length + social.incoming.length + social.outgoing.length;

  elements.friendsSummary.innerHTML = `
    <div class="friends-summary-head">
      <div>
        <p class="eyebrow">${getUiText("friends.network")}</p>
        <h3>${getUiText("friends.codeTitle", { code: getFriendCode(currentAccount) })}</h3>
        <p class="mini-note">${getUiText("friends.codeNote")}</p>
      </div>
      <span class="status-pill turn">${getCurrentLanguage() === "fr" ? "Préparé" : getCurrentLanguage() === "en" ? "Prepared" : "Vorbereitet"}</span>
    </div>
    <div class="friends-stat-grid">
      <article class="profile-stat-card">
        <span>${getUiText("friends.friends")}</span>
        <strong>${social.friends.length}</strong>
      </article>
      <article class="profile-stat-card">
        <span>${getUiText("friends.openRequests")}</span>
        <strong>${social.incoming.length + social.outgoing.length}</strong>
      </article>
      <article class="profile-stat-card">
        <span>${getUiText("friends.blocked")}</span>
        <strong>${social.blocked.length}</strong>
      </article>
      <article class="profile-stat-card">
        <span>${getUiText("friends.modulesReady")}</span>
        <strong>${totalTracked > 0 ? getUiText("friends.moduleActive") : getUiText("friends.moduleEmpty")}</strong>
      </article>
    </div>
  `;

  renderFriendBucket(elements.friendsListPanel, {
    eyebrow: getUiText("friends.listEyebrow"),
    title: getUiText("friends.listTitle"),
    list: social.friends,
    emptyText: getUiText("friends.listEmpty"),
    note: getUiText("friends.listNote"),
  });

  renderFriendBucket(elements.friendsPendingPanel, {
    eyebrow: getUiText("friends.requestsEyebrow"),
    title: getUiText("friends.requestsTitle"),
    list: [...social.incoming.map((entry) => `${entry} · ${getCurrentLanguage() === "fr" ? "entrant" : getCurrentLanguage() === "en" ? "incoming" : "eingehend"}`), ...social.outgoing.map((entry) => `${entry} · ${getCurrentLanguage() === "fr" ? "sortant" : getCurrentLanguage() === "en" ? "outgoing" : "ausgehend"}`)],
    emptyText: getUiText("friends.requestsEmpty"),
    note: getUiText("friends.requestsNote"),
  });

  elements.friendsTradePanel.innerHTML = `
    <p class="eyebrow">${getUiText("friends.tradeEyebrow")}</p>
    <h3 class="subheading">${getUiText("friends.tradeTitle")}</h3>
    <div class="friend-feature-stack">
      <div class="friend-feature-card">
        <strong>${getUiText("friends.feature1Title")}</strong>
        <span>${getUiText("friends.feature1Text")}</span>
      </div>
      <div class="friend-feature-card">
        <strong>${getUiText("friends.feature2Title")}</strong>
        <span>${getUiText("friends.feature2Text")}</span>
      </div>
      <div class="friend-feature-card">
        <strong>${getUiText("friends.feature3Title")}</strong>
        <span>${getUiText("friends.feature3Text")}</span>
      </div>
    </div>
  `;
  return;

  elements.friendsSummary.innerHTML = `
    <div class="friends-summary-head">
      <div>
        <p class="eyebrow">Freundesnetz</p>
        <h3>Freundescode ${getFriendCode(currentAccount)}</h3>
        <p class="mini-note">Dieser lokale Code ist nur ein Platzhalter. Für echte Freundschaften und Handel braucht es später Server-IDs und API-Prüfungen.</p>
      </div>
      <span class="status-pill turn">Vorbereitet</span>
    </div>
    <div class="friends-stat-grid">
      <article class="profile-stat-card">
        <span>Freunde</span>
        <strong>${social.friends.length}</strong>
      </article>
      <article class="profile-stat-card">
        <span>Anfragen offen</span>
        <strong>${social.incoming.length + social.outgoing.length}</strong>
      </article>
      <article class="profile-stat-card">
        <span>Blockiert</span>
        <strong>${social.blocked.length}</strong>
      </article>
      <article class="profile-stat-card">
        <span>Module bereit</span>
        <strong>${totalTracked > 0 ? "Aktiv" : "Leer"}</strong>
      </article>
    </div>
  `;

  renderFriendBucket(elements.friendsListPanel, {
    eyebrow: "Freundesliste",
    title: "Deine Kontakte",
    list: social.friends,
    emptyText: "Noch keine Freunde gespeichert. Später können hier direkte Kontakte erscheinen.",
    note: "Hier landen später bestätigte Freundschaften inklusive Online-Status und Schnellhandel.",
  });

  renderFriendBucket(elements.friendsPendingPanel, {
    eyebrow: "Anfragen",
    title: "Eingehend und ausgehend",
    list: [...social.incoming.map((entry) => `${entry} · eingehend`), ...social.outgoing.map((entry) => `${entry} · ausgehend`)],
    emptyText: "Aktuell gibt es keine offenen Freundschaftsanfragen.",
    note: "Dieser Bereich ist für spätere Server-Anfragen und Benachrichtigungen reserviert.",
  });

  elements.friendsTradePanel.innerHTML = `
    <p class="eyebrow">Handel</p>
    <h3 class="subheading">Sicherer Tausch folgt später</h3>
    <div class="friend-feature-stack">
      <div class="friend-feature-card">
        <strong>Geplante Handelslogik</strong>
        <span>Direkte Tauschangebote, beidseitige Bestätigung und spätere Servervalidierung.</span>
      </div>
      <div class="friend-feature-card">
        <strong>Vorbereitung schon vorhanden</strong>
        <span>Eigener Tab, Platzhalterdaten und getrennte UI-Struktur für spätere Erweiterungen.</span>
      </div>
      <div class="friend-feature-card">
        <strong>Wichtig für später</strong>
        <span>Freunde und Handel dürfen im Online-Betrieb nicht rein clientseitig laufen, sonst wären Exploits trivial.</span>
      </div>
    </div>
  `;
}

function bindMultiplayerPanelEvents() {
  const bindAll = (root) => {
    if (!root) {
      return;
    }
    root.querySelector("[data-multiplayer-join]")?.addEventListener("click", handleMultiplayerQueueJoin);
    root.querySelector("[data-multiplayer-leave]")?.addEventListener("click", handleMultiplayerQueueLeave);
    [...root.querySelectorAll("[data-multiplayer-challenge]")].forEach((button) => {
      button.addEventListener("click", () => handleMultiplayerChallengeCreate(button.dataset.multiplayerChallenge));
    });
    [...root.querySelectorAll("[data-multiplayer-action]")].forEach((button) => {
      button.addEventListener("click", () => handleMultiplayerChallengeAction(button.dataset.challengeId, button.dataset.multiplayerAction));
    });
  };

  bindAll(elements.multiplayerQueuePanel);
  bindAll(elements.multiplayerChallengesPanel);
}

function renderMultiplayer() {
  if (!elements.multiplayerSummary || !elements.multiplayerQueuePanel || !elements.multiplayerChallengesPanel) {
    return;
  }

  if (!currentAccount) {
    elements.multiplayerSummary.innerHTML = "";
    elements.multiplayerQueuePanel.innerHTML = "";
    elements.multiplayerChallengesPanel.innerHTML = "";
    return;
  }

  const activeDeck = getActiveDeck();
  const validation = validateDeck(activeDeck, DECK_MODES.standard);
  const queueCount = uiState.multiplayerQueue.length;
  const incoming = uiState.multiplayerIncomingChallenges;
  const outgoing = uiState.multiplayerOutgoingChallenges;
  const ownEntry = uiState.multiplayerOwnQueueEntry;
  const loading = uiState.multiplayerLoading;
  const networkReady = isServerSessionActive();
  const busy = uiState.multiplayerQueueBusy || uiState.multiplayerChallengeBusy;
  const playerRank = getRankState(getProgression().rankPoints);

  if (!networkReady) {
    elements.multiplayerSummary.innerHTML = `
      <div class="friends-summary-head">
        <div>
          <p class="eyebrow">${localText("Multiplayer", "Multiplayer", "Multijoueur")}</p>
          <h3>${localText("Server-Sitzung erforderlich", "Server session required", "Session serveur requise")}</h3>
          <p class="mini-note">${localText(
            "Queue, offene Herausforderungen und Spielerduelle laufen nur im Servermodus.",
            "Queue, open challenges and player duels are only available in server mode.",
            "La file, les défis ouverts et les duels entre joueurs ne sont disponibles qu'en mode serveur."
          )}</p>
        </div>
      </div>
    `;
    elements.multiplayerQueuePanel.innerHTML = `
      <article class="empty-state-card">
        <h4 class="subheading">${localText("Multiplayer ist offline", "Multiplayer is offline", "Le multijoueur est hors ligne")}</h4>
        <p class="mini-note">${localText(
          "Melde dich über den Server an, damit andere Spieler deine Queue und deine Herausforderungen sehen können.",
          "Sign in through the server so other players can see your queue entry and challenges.",
          "Connecte-toi via le serveur pour que les autres joueurs puissent voir ta file et tes défis."
        )}</p>
      </article>
    `;
    elements.multiplayerChallengesPanel.innerHTML = "";
    return;
  }

  const queueMarkup = loading
    ? `<article class="empty-state-card"><h4 class="subheading">${localText("Queue wird geladen", "Loading queue", "Chargement de la file")}</h4><p class="mini-note">${localText("Spieler und offene Herausforderungen werden gerade synchronisiert.", "Players and open challenges are being synchronized.", "Les joueurs et les défis ouverts sont en cours de synchronisation.")}</p></article>`
    : queueCount
      ? `<div class="social-card-grid">${uiState.multiplayerQueue.map((entry) => {
        const entryRank = getRankState(entry.rankPoints || 0);
        return `
          <article class="social-profile-card">
            <div class="social-profile-head">
              <div>
                <p class="eyebrow">${localText("Spieler", "Player", "Joueur")}</p>
                <h4>${escapeHtml(entry.username)}</h4>
              </div>
              <span class="status-pill turn">${escapeHtml(entryRank.label)}</span>
            </div>
            <p class="mini-note">${escapeHtml(localText(
              `Deck: ${entry.deckName || "Standard-Deck"} · ${entry.deckCards.length}/20 Karten`,
              `Deck: ${entry.deckName || "Standard deck"} · ${entry.deckCards.length}/20 cards`,
              `Deck : ${entry.deckName || "Deck standard"} · ${entry.deckCards.length}/20 cartes`
            ))}</p>
            <div class="social-action-row">
              <button class="primary-button social-action-button" type="button" data-multiplayer-challenge="${escapeHtml(entry.username)}"${busy || !validation.valid ? " disabled" : ""}>${localText("Herausfordern", "Challenge", "Défier")}</button>
            </div>
          </article>
        `;
      }).join("")}</div>`
      : `<article class="empty-state-card"><h4 class="subheading">${localText("Noch keine Gegner in Queue", "No opponents in queue yet", "Aucun adversaire dans la file")}</h4><p class="mini-note">${localText("Sobald andere Spieler in der Queue stehen, kannst du sie direkt herausfordern.", "As soon as other players join the queue, you can challenge them directly.", "Dès que d'autres joueurs rejoignent la file, tu peux les défier directement.")}</p></article>`;

  const incomingMarkup = incoming.length
    ? incoming.map((challenge) => `
      <article class="social-offer-card">
        <div class="friends-summary-head">
          <div>
            <p class="eyebrow">${localText("Eingehend", "Incoming", "Entrant")}</p>
            <h4>${escapeHtml(challenge.from)}</h4>
          </div>
          <span class="status-pill turn">${escapeHtml(challenge.deckName || localText("Deck", "Deck", "Deck"))}</span>
        </div>
        <p class="mini-note">${escapeHtml(localText(
          `Deck: ${challenge.deckCards?.length || 0}/20 Karten`,
          `Deck: ${challenge.deckCards?.length || 0}/20 cards`,
          `Deck : ${challenge.deckCards?.length || 0}/20 cartes`
        ))}</p>
        <div class="social-action-row">
          <button class="primary-button social-action-button" type="button" data-multiplayer-action="accept" data-challenge-id="${escapeHtml(challenge.id)}"${busy || !validation.valid || isMatchSessionLocked() ? " disabled" : ""}>${localText("Annehmen", "Accept", "Accepter")}</button>
          <button class="secondary-button social-action-button" type="button" data-multiplayer-action="decline" data-challenge-id="${escapeHtml(challenge.id)}"${busy ? " disabled" : ""}>${localText("Ablehnen", "Decline", "Refuser")}</button>
        </div>
      </article>
    `).join("")
    : `<article class="empty-state-card"><h4 class="subheading">${localText("Keine eingehenden Duelle", "No incoming duels", "Aucun duel entrant")}</h4><p class="mini-note">${localText("Echte Spielerherausforderungen erscheinen hier, sobald dich jemand direkt fordert.", "Direct player challenges appear here once someone targets you.", "Les défis directs des joueurs apparaissent ici dès que quelqu'un te cible.")}</p></article>`;

  const outgoingMarkup = outgoing.length
    ? outgoing.map((challenge) => `
      <article class="social-offer-card">
        <div class="friends-summary-head">
          <div>
            <p class="eyebrow">${localText("Ausgehend", "Outgoing", "Sortant")}</p>
            <h4>${escapeHtml(challenge.to)}</h4>
          </div>
          <span class="status-pill turn">${escapeHtml(challenge.deckName || localText("Deck", "Deck", "Deck"))}</span>
        </div>
        <p class="mini-note">${escapeHtml(localText(
          `Wartet auf Antwort · ${challenge.deckCards?.length || 0}/20 Karten`,
          `Waiting for response · ${challenge.deckCards?.length || 0}/20 cards`,
          `En attente de réponse · ${challenge.deckCards?.length || 0}/20 cartes`
        ))}</p>
        <div class="social-action-row">
          <button class="secondary-button social-action-button" type="button" data-multiplayer-action="cancel" data-challenge-id="${escapeHtml(challenge.id)}"${busy ? " disabled" : ""}>${localText("Zurückziehen", "Cancel", "Annuler")}</button>
        </div>
      </article>
    `).join("")
    : "";

  elements.multiplayerSummary.innerHTML = `
    <div class="friends-summary-head">
      <div>
        <p class="eyebrow">${localText("Multiplayer", "Multiplayer", "Multijoueur")}</p>
        <h3>${localText("Queue, offene Herausforderungen und direkte Spielerduelle", "Queue, open challenges and direct player duels", "File, défis ouverts et duels directs")}</h3>
        <p class="mini-note">${validation.valid
          ? localText("Dein Standard-Deck ist bereit für echte Spielerduelle.", "Your standard deck is ready for real player duels.", "Ton deck standard est prêt pour de vrais duels.")
          : localText("Für Multiplayer brauchst du ein gültiges Standard-Deck mit 20 Karten.", "You need a valid 20-card standard deck for multiplayer.", "Tu as besoin d'un deck standard valide de 20 cartes pour le multijoueur.")}</p>
      </div>
      <span class="status-pill ${validation.valid ? "ok" : "warn"}">${validation.valid ? localText("Bereit", "Ready", "Prêt") : localText("Deck fehlt", "Deck missing", "Deck manquant")}</span>
    </div>
    <div class="friends-stat-grid">
      <article class="profile-stat-card"><span>${localText("Dein Rang", "Your rank", "Ton rang")}</span><strong>${escapeHtml(playerRank.label)}</strong></article>
      <article class="profile-stat-card"><span>${localText("Queue", "Queue", "File")}</span><strong>${queueCount}</strong></article>
      <article class="profile-stat-card"><span>${localText("Eingehend", "Incoming", "Entrant")}</span><strong>${incoming.length}</strong></article>
      <article class="profile-stat-card"><span>${localText("Ausgehend", "Outgoing", "Sortant")}</span><strong>${outgoing.length}</strong></article>
    </div>
  `;

  elements.multiplayerQueuePanel.innerHTML = `
    <div class="friends-panel-head">
      <div>
        <p class="eyebrow">${localText("Matchmaking", "Matchmaking", "Matchmaking")}</p>
        <h3 class="subheading">${localText("Offene Queue", "Open queue", "File ouverte")}</h3>
      </div>
      ${ownEntry
        ? `<span class="status-pill ok">${localText("Du bist gelistet", "You are queued", "Tu es en file")}</span>`
        : `<span class="status-pill turn">${localText("Nicht in Queue", "Not queued", "Hors file")}</span>`}
    </div>
    ${ownEntry
      ? `
        <article class="social-offer-card">
          <div class="friends-summary-head">
            <div>
              <p class="eyebrow">${localText("Dein Eintrag", "Your entry", "Ton entrée")}</p>
              <h4>${escapeHtml(ownEntry.deckName || localText("Standard-Deck", "Standard deck", "Deck standard"))}</h4>
            </div>
            <span class="status-pill turn">${ownEntry.deckCards.length}/20</span>
          </div>
          <p class="mini-note">${escapeHtml(localText(
            "Andere Spieler können dich direkt herausfordern, solange dein Eintrag aktiv ist.",
            "Other players can challenge you directly while this entry is active.",
            "Les autres joueurs peuvent te défier directement tant que cette entrée est active."
          ))}</p>
          <div class="social-action-row">
            <button class="secondary-button social-action-button" type="button" data-multiplayer-leave${busy ? " disabled" : ""}>${localText("Queue verlassen", "Leave queue", "Quitter la file")}</button>
          </div>
        </article>
      `
      : `
        <article class="social-offer-card">
          <div class="friends-summary-head">
            <div>
              <p class="eyebrow">${localText("Noch nicht eingereiht", "Not queued yet", "Pas encore en file")}</p>
              <h4>${escapeHtml(localText("Stelle dein aktives Standard-Deck in die Queue", "Put your active standard deck into the queue", "Place ton deck standard actif dans la file"))}</h4>
            </div>
          </div>
          <p class="mini-note">${escapeHtml(localText(
            "Sobald du in der Queue bist, sehen andere Spieler dein Deck und können dich direkt herausfordern.",
            "Once you are in queue, other players see your deck and can challenge you directly.",
            "Une fois dans la file, les autres joueurs voient ton deck et peuvent te défier directement."
          ))}</p>
          <div class="social-action-row">
            <button class="primary-button social-action-button" type="button" data-multiplayer-join${busy || !validation.valid || isMatchSessionLocked() ? " disabled" : ""}>${localText("In Queue gehen", "Join queue", "Entrer dans la file")}</button>
          </div>
        </article>
      `}
    ${queueMarkup}
  `;

  elements.multiplayerChallengesPanel.innerHTML = `
    <div class="friends-panel-head">
      <div>
        <p class="eyebrow">${localText("Herausforderungen", "Challenges", "Défis")}</p>
        <h3 class="subheading">${localText("Direkte Spielerduelle", "Direct player duels", "Duels directs entre joueurs")}</h3>
      </div>
      <span class="status-pill turn">${incoming.length + outgoing.length}</span>
    </div>
    <div class="social-stack">
      <section class="social-stack">
        <div class="friends-summary-head">
          <div>
            <p class="eyebrow">${localText("Eingehend", "Incoming", "Entrant")}</p>
            <h4>${localText("Auf dich gerichtet", "Sent to you", "Envoyés vers toi")}</h4>
          </div>
        </div>
        <div class="offer-list">${incomingMarkup}</div>
      </section>
      <section class="social-stack">
        <div class="friends-summary-head">
          <div>
            <p class="eyebrow">${localText("Ausgehend", "Outgoing", "Sortant")}</p>
            <h4>${localText("Von dir gesendet", "Sent by you", "Envoyés par toi")}</h4>
          </div>
        </div>
        <div class="offer-list">${outgoingMarkup || `<article class="empty-state-card"><h4 class="subheading">${localText("Keine ausgehenden Duelle", "No outgoing duels", "Aucun duel sortant")}</h4><p class="mini-note">${localText("Offene Herausforderungen, die du gesendet hast, werden hier gelistet.", "Challenges you send stay listed here until they are answered.", "Les défis que tu envoies restent listés ici jusqu'à leur réponse.")}</p></article>`}</div>
      </section>
    </div>
  `;

  bindMultiplayerPanelEvents();
}

function renderSettings() {
  if (!currentAccount) {
    elements.settingsSummary.innerHTML = "";
    return;
  }

  const localizedSettings = getUserSettings();
  const booleanSettings = ["clickEffects", "packEffects", "reducedMotion", "confirmActions"];
  const enabledCount = booleanSettings.filter((key) => Boolean(localizedSettings[key])).length;

  elements.settingsLanguageSelect.value = localizedSettings.language;
  elements.settingsClickEffects.checked = localizedSettings.clickEffects;
  elements.settingsPackEffects.checked = localizedSettings.packEffects;
  elements.settingsReducedMotion.checked = localizedSettings.reducedMotion;
  elements.settingsConfirmActions.checked = localizedSettings.confirmActions;

  elements.settingsSummary.innerHTML = `
    <div class="settings-summary-head">
      <div>
        <p class="eyebrow">${getUiText("settings.activeSettings")}</p>
        <h3>${getUiText("settings.activeCount", { count: enabledCount, total: booleanSettings.length })}</h3>
        <p class="mini-note">${getUiText("settings.syncNote")}</p>
      </div>
      <span class="status-pill ${localizedSettings.reducedMotion ? "warn" : "ok"}">${localizedSettings.reducedMotion ? getUiText("settings.calmMode") : getUiText("settings.fullStage")}</span>
    </div>
    <div class="settings-summary-grid">
      <article class="profile-stat-card">
        <span>${getUiText("settings.clickEffects")}</span>
        <strong>${getToggleStateLabel(localizedSettings.clickEffects)}</strong>
      </article>
      <article class="profile-stat-card">
        <span>${getUiText("settings.packEffects")}</span>
        <strong>${getToggleStateLabel(localizedSettings.packEffects)}</strong>
      </article>
      <article class="profile-stat-card">
        <span>${getUiText("settings.movement")}</span>
        <strong>${getMotionStateLabel(localizedSettings.reducedMotion)}</strong>
      </article>
      <article class="profile-stat-card">
        <span>${getUiText("settings.confirmations")}</span>
        <strong>${localizedSettings.confirmActions ? getUiText("common.active") : getUiText("common.off")}</strong>
      </article>
    </div>
  `;
}

function renderShop() {
  return legacyRenderShop();
  if (!currentAccount) {
    return;
  }

  const activeTabId = getShopTabId(getSave().shopTab);
  const activeTab = SHOP_TAB_DEFINITIONS[activeTabId];
  const boosterPrices = Object.values(PACK_DEFINITIONS).map((pack) => pack.price);
  const bundleDefinitions = Object.values(SHOP_BUNDLE_DEFINITIONS);
  const bundlePrices = bundleDefinitions.map((bundle) => bundle.price);
  const guaranteedCounts = bundleDefinitions.map((bundle) => bundle.guaranteedCards.reduce((sum, entry) => sum + Number(entry.amount || 0), 0));
  const includedBoosterCounts = bundleDefinitions.map((bundle) => bundle.includedBoosters.reduce((sum, entry) => sum + Number(entry.amount || 0), 0));

  elements.shopTabRow.innerHTML = "";
  elements.shopPackGrid.innerHTML = "";
  elements.shopBundleGrid.innerHTML = "";
  elements.futureShopGrid.innerHTML = "";

  Object.values(SHOP_TAB_DEFINITIONS).forEach((tab) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `shop-tab-button${tab.id === activeTabId ? " active" : ""}`;
    button.innerHTML = `
      <strong>${getUiText(`shop.tabs.${tab.id}`)}</strong>
      <span>${getUiText(`shop.teasers.${tab.id}`)}</span>
    `;
    button.addEventListener("click", () => {
      if (getSave().shopTab === tab.id) {
        return;
      }
      getSave().shopTab = tab.id;
      persistCurrentAccount();
      renderShop();
    });
    elements.shopTabRow.append(button);
  });

  elements.shopCatalogHeading.textContent = getUiText(activeTab.headingKey);
  elements.shopCatalogNote.textContent = getUiText(activeTab.noteKey);
  elements.shopPackGrid.classList.toggle("hidden", activeTabId !== "boosters");
  elements.shopBundleGrid.classList.toggle("hidden", activeTabId !== "packs");

  if (activeTabId === "boosters") {
    Object.values(PACK_DEFINITIONS).forEach((pack) => {
      elements.shopPackGrid.append(createPackCard(pack.id, "shop"));
    });
  } else {
    bundleDefinitions.forEach((bundle) => {
      elements.shopBundleGrid.append(createShopBundleCard(bundle.id));
    });
  }

  const summaryCards = activeTabId === "boosters"
    ? [
      {
        title: getUiText("shop.summaryOffers"),
        value: `${Object.keys(PACK_DEFINITIONS).length}`,
        text: getCurrentLanguage() === "fr" ? "Paliers de boosters" : getCurrentLanguage() === "en" ? "Booster tiers" : "Booster-Stufen",
      },
      {
        title: getUiText("shop.summaryGuaranteed"),
        value: `${getRarityLabel(PACK_DEFINITIONS.starter.guaranteed)} → ${getRarityLabel((PACK_DEFINITIONS.singularity || PACK_DEFINITIONS.astral).guaranteed)}`,
        text: getCurrentLanguage() === "fr" ? "Garantie croissante selon le palier" : getCurrentLanguage() === "en" ? "Rarity floor rises with each tier" : "Garantierte Mindestseltenheit steigt pro Stufe",
      },
      {
        title: getUiText("shop.summaryBoosters"),
        value: "5",
        text: getCurrentLanguage() === "fr" ? "cartes par booster" : getCurrentLanguage() === "en" ? "cards per booster" : "Karten pro Booster",
      },
      {
        title: getUiText("shop.summaryPricing"),
        value: `${Math.min(...boosterPrices)}–${Math.max(...boosterPrices)}`,
        text: getCurrencyLabel(),
      },
    ]
    : [
      {
        title: getUiText("shop.summaryOffers"),
        value: `${bundleDefinitions.length}`,
        text: getCurrentLanguage() === "fr" ? "packs thématiques prêts" : getCurrentLanguage() === "en" ? "ready-made themed packs" : "fertige Themen-Packs",
      },
      {
        title: getUiText("shop.summaryGuaranteed"),
        value: `${Math.min(...guaranteedCounts)}–${Math.max(...guaranteedCounts)}`,
        text: getCurrentLanguage() === "fr" ? "cartes fixes garanties" : getCurrentLanguage() === "en" ? "fixed guaranteed cards" : "feste garantierte Karten",
      },
      {
        title: getUiText("shop.summaryBoosters"),
        value: `${Math.min(...includedBoosterCounts)}–${Math.max(...includedBoosterCounts)}`,
        text: getCurrentLanguage() === "fr" ? "boosters inclus" : getCurrentLanguage() === "en" ? "boosters included" : "Booster enthalten",
      },
      {
        title: getUiText("shop.summaryPricing"),
        value: `${Math.min(...bundlePrices)}–${Math.max(...bundlePrices)}`,
        text: getCurrencyLabel(),
      },
    ];

  elements.shopSummaryPanel.innerHTML = `
    <p class="eyebrow">${getUiText(activeTab.summaryTitleKey)}</p>
    <h3>${activeTabId === "boosters" ? getUiText("shop.tabHeadingBoosters") : getUiText("shop.tabHeadingPacks")}</h3>
    <p class="mini-note">${getUiText("shop.summaryModuleNote")}</p>
    <div class="shop-summary-grid">
      ${summaryCards.map((card) => `
        <article class="shop-summary-card">
          <p class="eyebrow">${card.title}</p>
          <strong>${card.value}</strong>
          <span>${card.text}</span>
        </article>
      `).join("")}
    </div>
  `;

  const futureItems = getUiText("shop.futureItems") || FUTURE_SHOP_ITEMS;
  futureItems.forEach((item) => {
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
  elements.marketResultsMeta.innerHTML = "";

  [
    {
      title: getUiText("market.nextHour"),
      value: getNextMarketUpdateLabel(),
      text: getUiText("market.nextHourText"),
    },
    {
      title: getUiText("market.hottest"),
      value: hottest[0].card.name,
      text: getUiText("market.hottestText", { delta: formatDelta(hottest[0].entry.lastDeltaPct) }),
    },
    {
      title: getUiText("market.stable"),
      value: `${mostValuable[0].entry.price} ${getCurrentLanguage() === "fr" ? "Or" : "Gold"}`,
      text: getUiText("market.stableText", { name: mostValuable[0].card.name }),
    },
    {
      title: getUiText("market.mood"),
      value: getMarketMoodLabel(),
      text: getUiText("market.moodText"),
    },
    {
      title: getUiText("market.feeVault"),
      value: `${database.market.feeVault} ${getCurrentLanguage() === "fr" ? "Or" : "Gold"}`,
      text: getUiText("market.feeVaultText"),
    },
  ].forEach((info) => {
    const card = document.createElement("article");
    card.className = "market-card";
    card.innerHTML = `<p class="eyebrow">${info.title}</p><strong>${info.value}</strong><span>${info.text}</span>`;
    elements.marketOverview.append(card);
  });

  createMoverCard(getUiText("market.topGainer"), hottest[0], "positive");
  createMoverCard(getUiText("market.topLoser"), coldest[0], "negative");

  const localizedVisibleCards = marketCards
    .filter(({ card }) => filters.rarity === "all" || card.rarity === filters.rarity)
    .filter(({ card }) => card.name.toLowerCase().includes(filters.search.toLowerCase().trim()))
    .sort((left, right) => sortMarketCards(left, right, filters.sort));

  renderMarketResultsMeta(localizedVisibleCards.length, filters);

  localizedVisibleCards.forEach(({ card, entry }) => {
    elements.marketGrid.append(renderMarketListingCard(card, entry));
  });

  if (!localizedVisibleCards.length) {
    elements.marketGrid.innerHTML = `
      <div class="info-panel">
        <h3 class="subheading">${getUiText("market.noOffersTitle")}</h3>
        <p class="mini-note">${getUiText("market.noOffersText")}</p>
      </div>
    `;
  }
  return;

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
    <span>${RarityLabel(payload.card.rarity)} · ${getTypeLabel(payload.card.type)}</span>
    <span>${getUiText("market.marketValue", { price: payload.entry.price, delta: formatDelta(payload.entry.lastDeltaPct) })}</span>
  `;
  elements.marketMovers.append(card);
  return;

  card.className = `mover-card ${tone}`;
  card.innerHTML = `
    <p class="eyebrow">${title}</p>
    <strong>${payload.card.name}</strong>
    <span>${RarityLabel(payload.card.rarity)} · ${TYPE_LABELS[payload.card.type]}</span>
    <span>Marktwert ${payload.entry.price} Gold · ${formatDelta(payload.entry.lastDeltaPct)}</span>
  `;
  elements.marketMovers.append(card);
}

function renderMarketResultsMeta(count, filters) {
  elements.marketResultsMeta.innerHTML = "";

  const chips = [
    getUiText("market.resultsMeta", { count, sort: getMarketSortLabel(filters.sort) }),
  ];

  if (filters.rarity !== "all") {
    chips.push(getRarityLabel(filters.rarity));
  }

  if (filters.search.trim()) {
    chips.push(filters.search.trim().slice(0, 24));
  }

  chips.forEach((label) => {
    const chip = document.createElement("span");
    chip.className = "meta-chip";
    chip.textContent = label;
    elements.marketResultsMeta.append(chip);
  });
}

function renderMarketListingCard(card, entry) {
  const saleQuote = getMarketSaleQuote(card.id);
  const element = renderCard(card, {
    context: "marketplace",
    buttons: [
      {
        label: getUiText("market.buyButton", { price: entry.buyPrice }),
        disabled: getSave().gold < entry.buyPrice,
        handler: () => buyCardOnMarket(card.id),
      },
      {
        label: getUiText("market.sellNetButton", { price: saleQuote.net }),
        disabled: getOwnedCopies(card.id) < 1,
        handler: () => sellCardOnMarket(card.id, 1),
      },
    ],
  });

  element.classList.add("market-listing-card");
  element.querySelector(".card-owned").textContent = `${getUiText("market.ownedShort")} ${getOwnedCopies(card.id)}×`;

  const priceBoard = document.createElement("div");
  priceBoard.className = "market-price-board";
  priceBoard.innerHTML = `
    <div class="market-price-row">
      <div class="market-price-pill">
        <span>${getUiText("market.buyShort")}</span>
        <strong>${formatCurrency(entry.buyPrice)}</strong>
      </div>
      <div class="market-price-pill success">
        <span>${getUiText("market.netShort")}</span>
        <strong>${formatCurrency(saleQuote.net)}</strong>
      </div>
    </div>
    <div class="market-price-inline">
      <span>${getUiText("market.grossShort")} ${saleQuote.gross}G</span>
      <span>${getUiText("market.feeShort")} ${saleQuote.fee}G</span>
      <span>${getUiText("market.deltaShort")} ${formatDelta(entry.lastDeltaPct)}</span>
    </div>
  `;

  element.querySelector(".card-bottom").prepend(priceBoard);
  return element;
}

function getMarketSortLabel(mode) {
  switch (mode) {
    case "cold":
      return getCurrentLanguage() === "fr" ? "plus forte baisse" : getCurrentLanguage() === "en" ? "biggest drop" : "stärkster Rückgang";
    case "value-desc":
      return getCurrentLanguage() === "fr" ? "valeur la plus haute" : getCurrentLanguage() === "en" ? "highest value" : "höchster Wert";
    case "value-asc":
      return getCurrentLanguage() === "fr" ? "valeur la plus basse" : getCurrentLanguage() === "en" ? "lowest value" : "niedrigster Wert";
    case "name":
      return getCurrentLanguage() === "fr" ? "nom" : getCurrentLanguage() === "en" ? "name" : "Name";
    case "hot":
    default:
      return getCurrentLanguage() === "fr" ? "plus forte hausse" : getCurrentLanguage() === "en" ? "top rise" : "stärkster Anstieg";
  }
}

function resetMarketFilters() {
  uiState.marketFilters.search = "";
  uiState.marketFilters.rarity = "all";
  uiState.marketFilters.sort = "hot";
  elements.marketSearchInput.value = "";
  elements.marketRarityFilter.value = "all";
  elements.marketSortSelect.value = "hot";
  renderMarketplace();
}

function sortMarketCards(left, right, mode) {
  switch (mode) {
    case "cold":
      return left.entry.lastDeltaPct - right.entry.lastDeltaPct || left.card.name.localeCompare(right.card.name, getCurrentLocale());
    case "value-desc":
      return right.entry.price - left.entry.price || left.card.name.localeCompare(right.card.name, getCurrentLocale());
    case "value-asc":
      return left.entry.price - right.entry.price || left.card.name.localeCompare(right.card.name, getCurrentLocale());
    case "name":
      return left.card.name.localeCompare(right.card.name, getCurrentLocale());
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
        || left.name.localeCompare(right.name, getCurrentLocale());
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
      return left.name.localeCompare(right.name, getCurrentLocale());
    case "name-desc":
      return right.name.localeCompare(left.name, getCurrentLocale());
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
    return getUiText("market.buyerMarket");
  }

  if (balance < -4) {
    return getUiText("market.sellerPressure");
  }

  return getUiText("market.balanced");

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
  const availableOwnedPacks = Object.values(PACK_DEFINITIONS).filter((pack) => (save.packs[pack.id] || 0) > 0);
  const previewPackId = PACK_DEFINITIONS[save.selectedPack] && ((save.packs[save.selectedPack] || 0) > 0 || !availableOwnedPacks.length)
    ? save.selectedPack
    : availableOwnedPacks[0]?.id || save.lastOpened.packId || Object.values(PACK_DEFINITIONS)[0].id;
  const selectedPack = PACK_DEFINITIONS[previewPackId];

  if (save.selectedPack !== previewPackId) {
    save.selectedPack = previewPackId;
    persistCurrentAccount();
  }
  elements.ownedPackGrid.innerHTML = "";
  elements.openedCardsGrid.innerHTML = "";
  elements.openingStage.classList.remove("is-opening");
  elements.openingBurst.classList.add("hidden");

  Object.values(PACK_DEFINITIONS).forEach((pack) => {
    elements.ownedPackGrid.append(createPackCard(pack.id, "owned"));
  });

  elements.openingStage.dataset.pack = selectedPack.id;
  elements.selectedPackPreview.innerHTML = `
    <p class="eyebrow">${getPackTier(selectedPack.id)}</p>
    <div class="opening-preview-head">
      <h3>${getPackLabel(selectedPack.id)}</h3>
      <span class="status-pill turn">${getUiText("booster.ownedCount", { count: save.packs[selectedPack.id] })}</span>
    </div>
    <p class="pack-copy">${getPackDescription(selectedPack.id)}</p>
    <div class="opening-preview-meta">
      <span class="meta-chip">${getUiText("booster.guarantee", { rarity: RarityLabel(selectedPack.guaranteed) })}</span>
      <span class="meta-chip">${getUiText("booster.price", { price: selectedPack.price })}</span>
      <span class="meta-chip">${getUiText("booster.draws")}</span>
    </div>
  `;
  if (!save.lastOpened.cards.length) {
    elements.openedCardsGrid.innerHTML = `
      <div class="info-panel empty-state-card booster-empty-state">
        <h3 class="subheading">${getUiText("booster.noneOpenedTitle")}</h3>
        <p class="mini-note">${getUiText("booster.noneOpenedText")}</p>
      </div>
    `;
    elements.openingStage.dataset.highlight = selectedPack.guaranteed;
    return;
  }

  const localizedOpenedCards = save.lastOpened.cards.map(getCard).filter(Boolean);
  elements.openingStage.dataset.highlight = getHighestRarity(localizedOpenedCards);

  localizedOpenedCards.forEach((card) => {
    elements.openedCardsGrid.append(renderCard(card, { context: "opened" }));
  });
  return;
  elements.openingStage.dataset.pack = selectedPack.id;
  elements.selectedPackPreview.innerHTML = `
    <p class="eyebrow">${selectedPack.tier}</p>
    <div class="opening-preview-head">
      <h3>${selectedPack.label}</h3>
      <span class="status-pill turn">Im Besitz: ${save.packs[selectedPack.id]}</span>
    </div>
    <p class="pack-copy">${selectedPack.description}</p>
    <div class="opening-preview-meta">
      <span class="meta-chip">Garantie: ${RarityLabel(selectedPack.guaranteed)}</span>
      <span class="meta-chip">Preis: ${selectedPack.price} Gold</span>
      <span class="meta-chip">Ziehungen: 5 Karten</span>
    </div>
  `;

  elements.openSelectedPackButton.disabled = save.packs[selectedPack.id] <= 0;

  if (!save.lastOpened.cards.length) {
    elements.openedCardsGrid.innerHTML = `
      <div class="info-panel">
        <h3 class="subheading">Noch kein Booster geöffnet</h3>
        <p class="mini-note">Wähle links ein Booster aus und öffne es. Die letzten gezogenen Karten werden hier angezeigt.</p>
      </div>
    `;
    elements.openingStage.dataset.highlight = selectedPack.guaranteed;
    return;
  }

  const openedCards = save.lastOpened.cards.map(getCard).filter(Boolean);
  elements.openingStage.dataset.highlight = getHighestRarity(openedCards);

  openedCards.forEach((card) => {
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
        <h3 class="subheading">${getUiText("collection.noCardsTitle")}</h3>
        <p class="mini-note">${getUiText("collection.noCardsText")}</p>
      </div>
    `;
    return;
  }

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

function legacyRenderDeckManager() {
  const deckMode = getSelectedDeckMode();
  const deckRules = getDeckRules(deckMode);
  const activeDeck = getDeckByMode(deckMode);
  const validation = validateDeck(activeDeck, deckMode);
  const deckProfile = analyzeDeck(activeDeck?.cards || []);
  const factionBonus = getFactionDeckBonus(deckProfile, deckMode);
  const isHardcoreMode = deckMode === DECK_MODES.hardcore;
  const spellCount = getDeckTypeCount(activeDeck, "spell");
  const trainerCount = getDeckTypeCount(activeDeck, "trainer");
  elements.activeDeckMeta.innerHTML = "";
  elements.activeDeckWarnings.innerHTML = "";
  elements.activeDeckList.innerHTML = "";
  elements.savedDecksList.innerHTML = "";
  elements.deckCollectionGrid.innerHTML = "";
  fillSelect(elements.deckModeSelect, [
    { value: DECK_MODES.standard, label: getUiText("decks.standardDeck") },
    { value: DECK_MODES.hardcore, label: getUiText("decks.hardcoreDeck") },
  ]);
  elements.deckModeSelect.value = deckMode;

  elements.deckNameInput.value = activeDeck?.name || "";
  elements.newDeckButton.disabled = isHardcoreMode;
  elements.duplicateDeckButton.disabled = isHardcoreMode;
  elements.deleteDeckButton.disabled = isHardcoreMode;
  elements.savedDecksPanel.classList.toggle("hidden", isHardcoreMode);
  document.getElementById("activeDeckHeading").textContent = isHardcoreMode
    ? localText("Hardcore-Spezialdeck", "Hardcore special deck", "Deck spÃ©cial hardcore")
    : getUiText("decks.activeDeckTitle");
  document.getElementById("deckAddCardsHeading").textContent = isHardcoreMode
    ? localText("Karten fÃ¼r das Hardcore-Deck", "Cards for the hardcore deck", "Cartes pour le deck hardcore")
    : getUiText("decks.addCardsTitle");
  document.getElementById("deckAddCardsNote").textContent = isHardcoreMode
    ? localText(
      `Dieses Spezialdeck braucht genau ${deckRules.size} Karten. Maximal ${deckRules.maxSpells} Zauber und ${deckRules.maxTrainers} Trainer sind erlaubt. Bei Niederlage oder Aufgabe verlierst du alle Karten daraus.`,
      `This special deck needs exactly ${deckRules.size} cards. At most ${deckRules.maxSpells} spells and ${deckRules.maxTrainers} trainers are allowed. If you lose or forfeit, you lose every card from it.`,
      `Ce deck spÃ©cial a besoin de ${deckRules.size} cartes exactement. Au maximum ${deckRules.maxSpells} sorts et ${deckRules.maxTrainers} entraÃ®neurs sont autorisÃ©s. En cas de dÃ©faite ou d'abandon, tu perds toutes ses cartes.`,
    )
    : localText(
      `Ein Deck braucht genau ${deckRules.size} Karten. Maximal ${deckRules.maxSpells} Zauber und ${deckRules.maxTrainers} Trainer sind erlaubt.`,
      `A deck needs exactly ${deckRules.size} cards. At most ${deckRules.maxSpells} spells and ${deckRules.maxTrainers} trainers are allowed.`,
      `Un deck a besoin de ${deckRules.size} cartes exactement. Au maximum ${deckRules.maxSpells} sorts et ${deckRules.maxTrainers} entraÃ®neurs sont autorisÃ©s.`,
    );

  [
    getUiText("decks.cardsMeta", { count: activeDeck.cards.length, size: deckRules.size }),
    getUiText("decks.unitsMeta", { count: countByType(activeDeck.cards, "unit") }),
    getUiText("decks.spellsMeta", { count: spellCount, limit: deckRules.maxSpells }),
    getUiText("decks.trainersMeta", { count: trainerCount, limit: deckRules.maxTrainers }),
  ].forEach((text) => {
    const chip = document.createElement("div");
    chip.className = "meta-chip";
    chip.textContent = text;
    elements.activeDeckMeta.append(chip);
  });

  if (validation.valid) {
    const ok = document.createElement("div");
    ok.className = "warning-item ok";
    ok.textContent = getUiText("decks.playable");
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
      <div class="info-panel empty-state-card deck-empty-state">
        <h3 class="subheading">${isHardcoreMode ? localText("Hardcore-Deck leer", "Hardcore deck empty", "Deck hardcore vide") : getUiText("decks.emptyDeckTitle")}</h3>
        <p class="mini-note">${isHardcoreMode
          ? localText(
            "Lege hier dein 35-Karten-Hardcore-Deck fest. Eine Niederlage oder Aufgabe zerstÃ¶rt die komplette Liste.",
            "Build your 35-card hardcore deck here. A loss or forfeit destroys the whole list.",
            "Construis ici ton deck hardcore de 35 cartes. Une dÃ©faite ou un abandon dÃ©truit toute la liste.",
          )
          : getUiText("decks.emptyDeckText")}</p>
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
          <p>${getTypeLabel(card.type)} · ${getFaction(card.faction).name}</p>
        `;
        const actions = document.createElement("div");
        actions.className = "card-actions";
        actions.append(
          createActionButton(getCurrentLanguage() === "fr" ? "Détails" : getCurrentLanguage() === "en" ? "Details" : "Details", () => openCardModal(card.id)),
          createActionButton(getCurrentLanguage() === "fr" ? "Retirer" : getCurrentLanguage() === "en" ? "Remove" : "Entfernen", () => removeCardFromActiveDeck(card.id)),
        );
        entry.append(actions);
        elements.activeDeckList.append(entry);
      });
  }

  if (!isHardcoreMode) {
    getSave().decks.forEach((deck) => {
      const deckValidation = validateDeck(deck, DECK_MODES.standard);
    const card = document.createElement("div");
    card.className = `saved-deck-card ${deck.id === getSave().activeDeckId ? "active" : ""}`;
    card.innerHTML = `
      <div class="saved-deck-head">
        <strong>${deck.name}</strong>
        <span class="status-pill ${deckValidation.valid ? "ok" : "warn"}">${deckValidation.valid ? getCurrentLanguage() === "fr" ? "Jouable" : getCurrentLanguage() === "en" ? "Playable" : "Spielbar" : getCurrentLanguage() === "fr" ? "Bloqué" : getCurrentLanguage() === "en" ? "Blocked" : "Blockiert"}</span>
      </div>
      <p>${deck.cards.length}/${DECK_RULES.standard.size} ${getCurrentLanguage() === "fr" ? "cartes" : getCurrentLanguage() === "en" ? "cards" : "Karten"}</p>
    `;
    const actions = document.createElement("div");
    actions.className = "card-actions";
    actions.append(
      createActionButton(getCurrentLanguage() === "fr" ? "Activer" : getCurrentLanguage() === "en" ? "Activate" : "Aktivieren", () => activateDeck(deck.id)),
      createActionButton(getCurrentLanguage() === "fr" ? "Dupliquer" : getCurrentLanguage() === "en" ? "Duplicate" : "Duplizieren", () => duplicateDeck(deck.id)),
    );
    card.append(actions);
      elements.savedDecksList.append(card);
    });
  } else {
    elements.savedDecksList.innerHTML = `
      <div class="info-panel empty-state-card deck-empty-state">
        <h3 class="subheading">${localText("Nur ein Spezialdeck", "Only one special deck", "Un seul deck spécial")}</h3>
        <p class="mini-note">${localText("Im Hardcore-Modus gibt es genau ein eigenes 35-Karten-Deck.", "Hardcore uses one dedicated 35-card deck.", "Le mode hardcore utilise un seul deck dédié de 35 cartes.")}</p>
      </div>
    `;
  }

  CARD_POOL
    .filter((card) => getOwnedCopies(card.id) > 0)
    .sort(sortCardsForDisplay)
    .forEach((card) => {
      const usedCopies = countCopiesInArray(activeDeck.cards, card.id);
      const ownedCopies = getOwnedCopies(card.id);
      const canAdd = canAddCardToActiveDeck(card.id);
      elements.deckCollectionGrid.append(renderCard(card, {
        context: "deckBuilder",
        buttons: [
          {
            label: canAdd ? getUiText("decks.add") : getUiText("decks.unavailable"),
            disabled: !canAdd,
            handler: () => addCardToActiveDeck(card.id),
          },
        ],
        footer: getUiText("decks.inDeck", { used: usedCopies, owned: ownedCopies }),
      }));
    });
  return;

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

function renderDeckManager() {
  const deckMode = getSelectedDeckMode();
  const deckRules = getDeckRules(deckMode);
  const activeDeck = getDeckByMode(deckMode);
  const deckProfile = analyzeDeck(activeDeck.cards);
  const factionBonus = getFactionDeckBonus(deckProfile, deckMode);
  const validation = validateDeck(activeDeck, deckMode);
  const isHardcoreMode = deckMode === DECK_MODES.hardcore;
  const spellCount = getDeckTypeCount(activeDeck, "spell");
  const trainerCount = getDeckTypeCount(activeDeck, "trainer");

  elements.activeDeckMeta.innerHTML = "";
  elements.activeDeckWarnings.innerHTML = "";
  elements.activeDeckList.innerHTML = "";
  elements.savedDecksList.innerHTML = "";
  elements.deckCollectionGrid.innerHTML = "";

  fillSelect(elements.deckModeSelect, [
    { value: DECK_MODES.standard, label: getUiText("decks.standardDeck") },
    { value: DECK_MODES.hardcore, label: getUiText("decks.hardcoreDeck") },
  ]);
  elements.deckModeSelect.value = deckMode;

  elements.deckNameInput.value = activeDeck?.name || "";
  elements.newDeckButton.disabled = isHardcoreMode;
  elements.duplicateDeckButton.disabled = isHardcoreMode;
  elements.deleteDeckButton.disabled = isHardcoreMode;
  elements.savedDecksPanel.classList.toggle("hidden", isHardcoreMode);
  elements.deckCodeInput.value = uiState.deckCodeDraft || "";
  syncDeckCodeControls();

  document.getElementById("activeDeckHeading").textContent = isHardcoreMode
    ? localText("Hardcore-Spezialdeck", "Hardcore special deck", "Deck spécial hardcore")
    : getUiText("decks.activeDeckTitle");
  document.getElementById("deckAddCardsHeading").textContent = isHardcoreMode
    ? localText("Karten für das Hardcore-Deck", "Cards for the hardcore deck", "Cartes pour le deck hardcore")
    : getUiText("decks.addCardsTitle");
  document.getElementById("deckAddCardsNote").textContent = isHardcoreMode
    ? localText(
      `Dieses Spezialdeck braucht genau ${deckRules.size} Karten. Maximal ${deckRules.maxSpells} Zauber und ${deckRules.maxTrainers} Trainer sind erlaubt. Bei Niederlage oder Aufgabe verlierst du alle Karten daraus.`,
      `This special deck needs exactly ${deckRules.size} cards. At most ${deckRules.maxSpells} spells and ${deckRules.maxTrainers} trainers are allowed. If you lose or forfeit, you lose every card from it.`,
      `Ce deck spécial a besoin de ${deckRules.size} cartes exactement. Au maximum ${deckRules.maxSpells} sorts et ${deckRules.maxTrainers} entraîneurs sont autorisés. En cas de défaite ou d'abandon, tu perds toutes ses cartes.`,
    )
    : localText(
      `Ein Deck braucht genau ${deckRules.size} Karten. Maximal ${deckRules.maxSpells} Zauber und ${deckRules.maxTrainers} Trainer sind erlaubt.`,
      `A deck needs exactly ${deckRules.size} cards. At most ${deckRules.maxSpells} spells and ${deckRules.maxTrainers} trainers are allowed.`,
      `Un deck a besoin de ${deckRules.size} cartes exactement. Au maximum ${deckRules.maxSpells} sorts et ${deckRules.maxTrainers} entraîneurs sont autorisés.`,
    );

  [
    getUiText("decks.cardsMeta", { count: activeDeck.cards.length, size: deckRules.size }),
    getUiText("decks.unitsMeta", { count: countByType(activeDeck.cards, "unit") }),
    getUiText("decks.spellsMeta", { count: spellCount, limit: deckRules.maxSpells }),
    getUiText("decks.trainersMeta", { count: trainerCount, limit: deckRules.maxTrainers }),
  ].forEach((text) => {
    const chip = document.createElement("div");
    chip.className = "meta-chip";
    chip.textContent = text;
    elements.activeDeckMeta.append(chip);
  });

  if (factionBonus) {
    const chip = document.createElement("div");
    chip.className = `meta-chip tone-${factionBonus.tone}`;
    chip.textContent = `${getFaction(factionBonus.factionId).name} · ${factionBonus.short}`;
    elements.activeDeckMeta.append(chip);
  }

  if (validation.valid) {
    const ok = document.createElement("div");
    ok.className = "warning-item ok";
    ok.textContent = getUiText("decks.playable");
    elements.activeDeckWarnings.append(ok);
  } else {
    validation.messages.forEach((message) => {
      const warning = document.createElement("div");
      warning.className = "warning-item";
      warning.textContent = message;
      elements.activeDeckWarnings.append(warning);
    });
  }

  if (factionBonus) {
    const factionNotice = document.createElement("div");
    factionNotice.className = "warning-item ok";
    factionNotice.textContent = localText(
      `Fraktionsbonus aktiv: ${factionBonus.description}`,
      `Faction bonus active: ${factionBonus.description}`,
      `Bonus de faction actif : ${factionBonus.description}`,
    );
    elements.activeDeckWarnings.append(factionNotice);
  }

  if (!activeDeck.cards.length) {
    elements.activeDeckList.innerHTML = `
      <div class="info-panel empty-state-card deck-empty-state">
        <h3 class="subheading">${isHardcoreMode ? localText("Hardcore-Deck leer", "Hardcore deck empty", "Deck hardcore vide") : getUiText("decks.emptyDeckTitle")}</h3>
        <p class="mini-note">${isHardcoreMode
          ? localText(
            "Lege hier dein 35-Karten-Hardcore-Deck fest. Eine Niederlage oder Aufgabe zerstört die komplette Liste.",
            "Build your 35-card hardcore deck here. A loss or forfeit destroys the whole list.",
            "Construis ici ton deck hardcore de 35 cartes. Une défaite ou un abandon détruit toute la liste.",
          )
          : getUiText("decks.emptyDeckText")}</p>
      </div>
    `;
  } else {
    [...new Set(activeDeck.cards)]
      .map((cardId) => ({ card: getCard(cardId), count: countCopiesInArray(activeDeck.cards, cardId) }))
      .filter(({ card }) => Boolean(card))
      .sort((left, right) => sortCardsForDisplay(left.card, right.card))
      .forEach(({ card, count }) => {
        const entry = document.createElement("div");
        entry.className = "deck-entry";
        entry.innerHTML = `
          <div class="saved-deck-head">
            <strong>${card.name} ×${count}</strong>
            <span class="status-pill ${getOwnedCopies(card.id) >= count ? "ok" : "warn"}">${RarityLabel(card.rarity)}</span>
          </div>
          <p>${getTypeLabel(card.type)} · ${getFaction(card.faction).name}</p>
        `;
        const actions = document.createElement("div");
        actions.className = "card-actions";
        actions.append(
          createActionButton(getCurrentLanguage() === "fr" ? "Détails" : getCurrentLanguage() === "en" ? "Details" : "Details", () => openCardModal(card.id)),
          createActionButton(getCurrentLanguage() === "fr" ? "Retirer" : getCurrentLanguage() === "en" ? "Remove" : "Entfernen", () => removeCardFromActiveDeck(card.id)),
        );
        entry.append(actions);
        elements.activeDeckList.append(entry);
      });
  }

  if (!isHardcoreMode) {
    getSave().decks.forEach((deck) => {
      const deckValidation = validateDeck(deck, DECK_MODES.standard);
      const card = document.createElement("div");
      card.className = `saved-deck-card ${deck.id === getSave().activeDeckId ? "active" : ""}`;
      card.innerHTML = `
        <div class="saved-deck-head">
          <strong>${deck.name}</strong>
          <span class="status-pill ${deckValidation.valid ? "ok" : "warn"}">${deckValidation.valid ? getCurrentLanguage() === "fr" ? "Jouable" : getCurrentLanguage() === "en" ? "Playable" : "Spielbar" : getCurrentLanguage() === "fr" ? "Bloqué" : getCurrentLanguage() === "en" ? "Blocked" : "Blockiert"}</span>
        </div>
        <p>${deck.cards.length}/${DECK_RULES.standard.size} ${getCurrentLanguage() === "fr" ? "cartes" : getCurrentLanguage() === "en" ? "cards" : "Karten"}</p>
      `;
      const actions = document.createElement("div");
      actions.className = "card-actions";
      actions.append(
        createActionButton(getCurrentLanguage() === "fr" ? "Activer" : getCurrentLanguage() === "en" ? "Activate" : "Aktivieren", () => activateDeck(deck.id)),
        createActionButton(getCurrentLanguage() === "fr" ? "Dupliquer" : getCurrentLanguage() === "en" ? "Duplicate" : "Duplizieren", () => duplicateDeck(deck.id)),
      );
      card.append(actions);
      elements.savedDecksList.append(card);
    });
  } else {
    elements.savedDecksList.innerHTML = `
      <div class="info-panel empty-state-card deck-empty-state">
        <h3 class="subheading">${localText("Nur ein Spezialdeck", "Only one special deck", "Un seul deck spécial")}</h3>
        <p class="mini-note">${localText("Im Hardcore-Modus gibt es genau ein eigenes 35-Karten-Deck.", "Hardcore uses one dedicated 35-card deck.", "Le mode hardcore utilise un seul deck dédié de 35 cartes.")}</p>
      </div>
    `;
  }

  CARD_POOL
    .filter((card) => getOwnedCopies(card.id) > 0)
    .sort(sortCardsForDisplay)
    .forEach((card) => {
      const usedCopies = countCopiesInArray(activeDeck.cards, card.id);
      const ownedCopies = getOwnedCopies(card.id);
      const canAdd = canAddCardToActiveDeck(card.id);
      elements.deckCollectionGrid.append(renderCard(card, {
        context: "deckBuilder",
        buttons: [
          {
            label: canAdd ? getUiText("decks.add") : getUiText("decks.unavailable"),
            disabled: !canAdd,
            handler: () => addCardToActiveDeck(card.id),
          },
        ],
        footer: getUiText("decks.inDeck", { used: usedCopies, owned: ownedCopies }),
      }));
    });
}

function getWikiTopicTone(topic) {
  return {
    start: "gold",
    economy: "aqua",
    cards: "violet",
    decks: "emerald",
    arena: "danger",
    account: "steel",
  }[topic] || "neutral";
}

function createWikiSection(id, topic, title, summary, bullets, callouts = [], tags = []) {
  return { id, topic, title, summary, bullets, callouts, tags };
}

function createWikiCallout(label, text, tone = "neutral") {
  return { label, text, tone };
}

function buildGermanWikiSections() {
  const feePct = Math.round(MARKETPLACE_FEE_RATE * 100);
  const boosterCount = Object.keys(PACK_DEFINITIONS).length;
  const bundleCount = Object.keys(SHOP_BUNDLE_DEFINITIONS).length;
  const factionNames = FACTIONS.map((faction) => faction.name).join(", ");
  const rarityLine = RARITY_ORDER.map((rarity) => getRarityLabel(rarity)).join(" → ");

  return [
    createWikiSection(
      "start-account",
      "start",
      "Erste Schritte und Kontostart",
      "So beginnt ein neues Konto und das ist der schnellste Weg in dein erstes spielbares Deck.",
      [
        `Neue Konten starten mit ${APP_CONFIG.baseGold} Gold, 0 Karten und 5 kostenlosen Starter-Boostern.`,
        "Spielernamen müssen eindeutig sein, dürfen maximal 12 Zeichen lang sein und keine Admin-Varianten enthalten.",
        "Nach Login oder Registrierung wird dein Fortschritt serverseitig gespeichert und nach einem Reload wieder geladen.",
        `Der beste Start ist: Booster öffnen, Sammlung prüfen, ein ${APP_CONFIG.deckSize}-Karten-Deck bauen und dann in die Arena gehen.`,
      ],
      [
        createWikiCallout("Startkonto", `${APP_CONFIG.baseGold} Gold · 0 Karten · 5 Starter-Booster`, "gold"),
        createWikiCallout("Direkter Ablauf", "Booster öffnen → Sammlung prüfen → Deck speichern → Arena starten", "aqua"),
      ],
      ["start", "login", "registrierung", "starter", "kostenlos", "konto", "deck"]
    ),
    createWikiSection(
      "game-loop",
      "start",
      "Die eigentliche Spielschleife",
      "Projekt Vault dreht sich um einen klaren Kreislauf aus Ausbau, Deckbau, Match und Markt.",
      [
        "Im Shop kaufst du Booster oder größere Packs mit garantierten Karten.",
        "In der Sammlung prüfst du Seltenheit, Symbole, Effekte, Marktpreise und Besitzstand jeder Karte.",
        `Im Deckbau stellst du aus genau ${APP_CONFIG.deckSize} Karten ein spielbares Deck zusammen.`,
        "In der Arena testest du dein Deck, bekommst Belohnungen und entscheidest danach, ob du Karten behältst, verkaufst oder am Markt handelst.",
      ],
      [
        createWikiCallout("Core-Loop", "Shop und Booster liefern Karten, Decks machen sie spielbar, Arena und Marktplatz geben ihnen Wert.", "violet"),
        createWikiCallout("Praktischer Tipp", "Öffne die 5 Starter-Booster zuerst komplett, bevor du Gold ausgibst.", "emerald"),
      ],
      ["spielschleife", "fortschritt", "sammlung", "deckbau", "arena", "marktplatz"]
    ),
    createWikiSection(
      "shop-economy",
      "economy",
      "Gold, Shop, Booster und Packs",
      "Gold ist die Hauptwährung für Käufe, Ausbau und viele Wirtschaftsentscheidungen.",
      [
        "Gold bekommst du vor allem über Arena-Belohnungen und später über Verkäufe.",
        `Der Shop hat ${boosterCount} Booster-Stufen mit unterschiedlichen Preisen, Garantien und Ziehchancen.`,
        `Zusätzlich gibt es ${bundleCount} Packs mit festen Karten plus Bonus-Boostern.`,
        "Packs sind teurer als einzelne Booster, geben dir aber gezielt Fraktionsfortschritt und sofortige Kartensicherheit.",
      ],
      [
        createWikiCallout("Booster", `${boosterCount} Stufen vom Starter-Booster bis zum Astral-Booster`, "gold"),
        createWikiCallout("Packs", `${bundleCount} kuratierte Angebote mit garantierten Karten`, "aqua"),
        createWikiCallout("Wirtschaft", "Gold geht nie unter 0, auch nicht bei Strafen oder Abzügen.", "steel"),
      ],
      ["gold", "shop", "booster", "packs", "starter", "astral", "preise", "angebote"]
    ),
    createWikiSection(
      "card-basics",
      "cards",
      "Kartentypen, Werte und Leselogik",
      "Jede Karte zeigt dir oben Seltenheit und Fraktion, in der Mitte den Namen und darunter die wichtigsten Funktionen.",
      [
        "Einheiten bleiben auf dem Feld und haben Kosten, Angriff und Leben.",
        "Zauber lösen ihren Effekt direkt beim Ausspielen aus und haben in der Regel keine Kampfwerte.",
        "Trainer sind Support-Karten mit sofortigem oder strategischem Effekt, aber ohne dauerhafte Feldpräsenz.",
        "Die normale Kartenansicht ist bewusst kurz gehalten. Das Detailfenster zeigt dieselben Inhalte ausführlich und geordnet.",
      ],
      [
        createWikiCallout("Einheit", "Bleibt auf dem Feld und kann über mehrere Züge angreifen oder verteidigen.", "emerald"),
        createWikiCallout("Zauber", "Soforteffekt ohne dauerhafte Präsenz auf dem Feld.", "violet"),
        createWikiCallout("Trainer", "Unterstützt deinen Plan mit Utility, Kartenfluss oder Tempo.", "aqua"),
      ],
      ["karten", "einheit", "zauber", "trainer", "kosten", "angriff", "leben", "details"]
    ),
    createWikiSection(
      "rarities-factions",
      "cards",
      "Seltenheiten und Fraktionen",
      "Seltenheiten steuern Wert, Decklimit und Pack-Wahrscheinlichkeit. Fraktionen geben Karten ihren Stil und ihre Effekt-Tendenz.",
      [
        `Die Seltenheiten laufen so: ${rarityLine}.`,
        "Legendär, Ultra Rare, Mythisch und Transzendent dürfen nur 1× pro Deck gespielt werden. Niedrigere Seltenheiten dürfen 2× hinein.",
        `Es gibt ${FACTIONS.length} Fraktionen: ${factionNames}.`,
        "Fraktionen prägen Optik, Symbole, typische Effekte und viele Synergiebedingungen.",
      ],
      [
        createWikiCallout("Seltenheitslinie", rarityLine, "gold"),
        createWikiCallout("Decklimit", "Hohe Seltenheiten 1× pro Deck, niedrigere Seltenheiten 2× pro Deck", "danger"),
        createWikiCallout("Fraktionen", factionNames, "aqua"),
      ],
      ["seltenheit", "fraktion", "ultra rare", "mythisch", "transzendent", "decklimit"]
    ),
    createWikiSection(
      "symbols-and-effects",
      "cards",
      "Symbole, Schlüsselwörter, Status und Effekte",
      "Die Symbole sollen dir sofort zeigen, was eine Karte tut, ohne dass du zuerst den kompletten Text lesen musst.",
      [
        "Jede Fraktion hat ein eigenes Symbol und eine eigene Farbwelt im Kartenkopf.",
        "Schlüsselwörter sind feste Kampfeigenschaften wie Sturmangriff, Wacht, Regeneration und Lebensraub.",
        "Status-Effekte sind temporär oder situativ und umfassen Brand, Frost, Gift und Barriere.",
        "Effekt-Symbole decken unter anderem Mana, Kartenziehen, Beschwörung, Schwächung, Flächenschaden, Timing und Synergie ab.",
      ],
      [
        createWikiCallout("Schlüsselwörter", "Sturmangriff · Wacht · Regeneration · Lebensraub", "violet"),
        createWikiCallout("Status", "Brand · Frost · Gift · Barriere", "danger"),
        createWikiCallout("Effekte", "Mana · Kartenziehen · Beschwörung · Schwächung · Tempo · Synergie", "gold"),
      ],
      ["symbole", "effekte", "status", "brand", "frost", "gift", "barriere", "sturmangriff", "wacht"]
    ),
    createWikiSection(
      "collection-filters",
      "decks",
      "Sammlung, Filter und Kartenübersicht",
      "Die Sammlung ist dein Archiv für Besitz, Duplikate, Preise und schnelle Kartensuche.",
      [
        "Du kannst nach Name, Seltenheit, Typ, Fraktion, Manabereich, Besitzstatus und Duplikaten filtern.",
        "Die Standardsortierung zeigt zuerst häufige Karten und dann immer seltenere Karten.",
        "Zusätzliche Sortierungen helfen dir nach Marktwert, Name, Mana oder Kopienzahl schnell das Richtige zu finden.",
        "Ein Klick auf eine Karte öffnet das Detailfenster mit Besitz, Marktwert, Deckstatus und Aktionen.",
      ],
      [
        createWikiCallout("Sammelhilfe", "Besessene Karten und Duplikate lassen sich direkt isolieren.", "emerald"),
        createWikiCallout("Schnellzugriff", "Die Detailansicht bündelt Regeln, Markt, Besitz und Aktionen an einem Ort.", "aqua"),
      ],
      ["sammlung", "filter", "sortierung", "duplikate", "marktwert", "kartenfenster"]
    ),
    createWikiSection(
      "deckbuilding",
      "decks",
      "Deckbau und gespeicherte Listen",
      "Decks werden gespeichert, geprüft und bei fehlenden Karten automatisch als blockiert markiert statt gelöscht.",
      [
        `Ein spielbares Deck braucht genau ${APP_CONFIG.deckSize} Karten.`,
        "Die Deckansicht zeigt Kartenzahl, Einheiten, Zauber und Trainer sowie Warnungen, falls etwas fehlt.",
        "Verkaufst du eine Karte später, bleibt das Deck gespeichert, kann aber blockiert werden, wenn Kopien fehlen.",
        "Das aktive Deck entscheidet direkt darüber, ob du Arena-Matches starten kannst und wie stark die Anti-Farm-Regeln greifen.",
      ],
      [
        createWikiCallout("Pflichtgröße", `${APP_CONFIG.deckSize} Karten pro spielbarem Deck`, "gold"),
        createWikiCallout("Sicher gespeichert", "Decks werden nicht zerstört, nur als blockiert markiert, wenn Karten fehlen.", "steel"),
      ],
      ["deck", "deckbau", "gespeichert", "blockiert", "aktive deck", "spielbar"]
    ),
    createWikiSection(
      "arena-rules",
      "arena",
      "Arena, Matchfluss und Schwierigkeitsstufen",
      "Die Arena ist absichtlich etwas langsamer gebaut, damit Status, Synergien und Board-Entscheidungen Gewicht bekommen.",
      [
        `Helden starten mit ${APP_CONFIG.heroHealth} Leben, deine Starthand hat ${APP_CONFIG.openingHandSize} Karten und das Feld hat ${APP_CONFIG.boardSize} Slots pro Seite.`,
        `Mana steigt pro Runde bis maximal ${APP_CONFIG.maxMana}. Dadurch öffnen sich starke Karten erst schrittweise.`,
        "Matches kennen Timing, Zustände, Keywords, Todeseffekte und Beschwörungen. Dadurch wirken Karten nicht nur über rohe Werte.",
        "Es gibt die Stufen Anfänger, Standard, Veteran und Albtraum mit unterschiedlichen Gegnerprofilen, Belohnungen und Aufgabe-Strafen.",
      ],
      [
        createWikiCallout("Grundwerte", `${APP_CONFIG.heroHealth} Leben · ${APP_CONFIG.openingHandSize} Starthand · ${APP_CONFIG.boardSize} Feldplätze`, "danger"),
        createWikiCallout("Schwierigkeiten", "Anfänger · Standard · Veteran · Albtraum", "gold"),
        createWikiCallout("Match-Schutz", "Während eines laufenden Matches sind Navigation, Verkäufe und Deckänderungen gesperrt.", "steel"),
      ],
      ["arena", "match", "mana", "runden", "schwierigkeit", "anfänger", "albtraum", "aufgeben"]
    ),
    createWikiSection(
      "marketplace",
      "arena",
      "Marktplatz, Preise und Handelslogik",
      "Der Marktplatz simuliert eine eigene Wirtschaft und ist bewusst nicht identisch mit dem normalen Händlerverkauf.",
      [
        "Jede Karte hat Händlerwert, Markt-Bruttowert, Markt-Nettoerlös und einen eigenen Markt-Kaufpreis.",
        `Auf Marktverkäufe fällt eine Gebühr von ${feePct} % an. Dieser Anteil landet im Gebührenpool.`,
        "Angebot und Nachfrage werden stündlich simuliert. Dadurch können Karten steigen oder fallen.",
        "Marktpreise sind also bewusst dynamisch und können über oder unter dem normalen Verkaufspreis liegen.",
      ],
      [
        createWikiCallout("Gebühr", `${feePct} % Gebühren pro Marktverkauf`, "danger"),
        createWikiCallout("Runde", "Die Marktwirtschaft aktualisiert sich jede echte Stunde.", "aqua"),
        createWikiCallout("Wichtige Werte", "Brutto · Gebühr · Netto · Kaufpreis · Stunden-Trend", "gold"),
      ],
      ["marktplatz", "markt", "gebühr", "brutto", "netto", "ankauf", "trend", "preisrunde"]
    ),
    createWikiSection(
      "account-server",
      "account",
      "Profil, Freunde, Einstellungen, Admin und Serverbetrieb",
      "Konto und Infrastruktur sind getrennt von der Kampflogik, damit dein Fortschritt sauber, sicher und erweiterbar bleibt.",
      [
        "Im Profil änderst du Namen und Passwort, setzt bei Bedarf dein Konto zurück und siehst deinen Freundescode.",
        "Der Freunde-Tab ist bereits vorbereitet, damit später Freundschaften und Handel andocken können, ohne die restliche UI umzubauen.",
        "In den Einstellungen steuerst du Sprache, Klickeffekte, Booster-Inszenierung, reduzierte Bewegung und Bestätigungsdialoge.",
        "Serverbetrieb läuft über Backend und Coolify. Wichtige Grundlagen sind `/api/health`, persistenter Speicher und Deploys über GitHub.",
      ],
      [
        createWikiCallout("Profil", "Name, Passwort, Reset und Freundescode in einem Modul", "emerald"),
        createWikiCallout("Einstellungen", "Deutsch, English und Français sowie Komfortoptionen pro Konto", "aqua"),
        createWikiCallout("Server", "Healthcheck: /api/health · Port 3000 · persistente Daten im Backend", "steel"),
      ],
      ["profil", "freunde", "einstellungen", "admin", "server", "coolify", "healthcheck", "deploy"]
    ),
  ];
}

function buildEnglishWikiSections() {
  const feePct = Math.round(MARKETPLACE_FEE_RATE * 100);
  const boosterCount = Object.keys(PACK_DEFINITIONS).length;
  const bundleCount = Object.keys(SHOP_BUNDLE_DEFINITIONS).length;
  const factionNames = FACTIONS.map((faction) => faction.name).join(", ");
  const rarityLine = RARITY_ORDER.map((rarity) => getRarityLabel(rarity)).join(" → ");

  return [
    createWikiSection(
      "start-account",
      "start",
      "Account start and first steps",
      "This is how a fresh account starts and how to reach your first playable deck quickly.",
      [
        `New accounts begin with ${APP_CONFIG.baseGold} Gold, 0 cards and 5 free starter boosters.`,
        "Player names must be unique, stay at 12 characters or less and may not contain admin-like variants.",
        "After login, your progress is stored on the server and restored after a reload.",
        `Best opening route: open boosters, review the collection, build a ${APP_CONFIG.deckSize}-card deck and enter the arena.`,
      ],
      [
        createWikiCallout("Starter account", `${APP_CONFIG.baseGold} Gold · 0 cards · 5 starter boosters`, "gold"),
        createWikiCallout("Fast route", "Open boosters → review collection → save a deck → start arena", "aqua"),
      ],
      ["start", "account", "register", "login", "starter", "boosters", "deck"]
    ),
    createWikiSection(
      "game-loop",
      "start",
      "The main game loop",
      "Projekt Vault is built around a clear cycle of acquisition, deckbuilding, matches and market decisions.",
      [
        "Buy boosters or curated packs in the shop.",
        "Review rarity, symbols, effects and market values in the collection.",
        `Build a valid deck of exactly ${APP_CONFIG.deckSize} cards.`,
        "Play arena matches, earn rewards and decide what to keep, sell or trade on the market.",
      ],
      [
        createWikiCallout("Loop", "Shop and boosters feed the collection, decks make it playable, arena and market give it value.", "violet"),
        createWikiCallout("Tip", "Open all 5 starter boosters before spending more gold.", "emerald"),
      ],
      ["loop", "progression", "collection", "decks", "arena", "market"]
    ),
    createWikiSection(
      "shop-economy",
      "economy",
      "Gold, shop, boosters and packs",
      "Gold is the central currency for purchases, upgrades and economy decisions.",
      [
        "Gold mainly comes from arena rewards and later from selling cards.",
        `The shop contains ${boosterCount} booster tiers with different prices, guarantees and odds.`,
        `On top of that, ${bundleCount} packs provide guaranteed cards plus extra boosters.`,
        "Packs cost more than boosters, but give targeted faction progress and fixed value immediately.",
      ],
      [
        createWikiCallout("Boosters", `${boosterCount} tiers from Starter to Astral`, "gold"),
        createWikiCallout("Packs", `${bundleCount} curated offers with guaranteed cards`, "aqua"),
        createWikiCallout("Economy rule", "Gold never drops below 0, even with penalties.", "steel"),
      ],
      ["gold", "shop", "boosters", "packs", "prices", "offers"]
    ),
    createWikiSection(
      "card-basics",
      "cards",
      "Card types, values and reading order",
      "Cards are designed to be scannable at a glance and expandable in the detail view.",
      [
        "Units stay on the board and use cost, attack and health.",
        "Spells resolve immediately and usually have no combat stats.",
        "Trainers are support cards with utility, tempo or setup effects.",
        "The main card view stays short while the detail modal expands the same card into structured sections.",
      ],
      [
        createWikiCallout("Unit", "Stays on board and fights over multiple turns.", "emerald"),
        createWikiCallout("Spell", "Resolves instantly with no permanent board body.", "violet"),
        createWikiCallout("Trainer", "Supports your plan with tempo, draw or utility.", "aqua"),
      ],
      ["cards", "units", "spells", "trainers", "cost", "attack", "health"]
    ),
    createWikiSection(
      "rarities-factions",
      "cards",
      "Rarities and factions",
      "Rarity defines value and deck limits, while factions define style, symbols and effect tendencies.",
      [
        `Current rarity line: ${rarityLine}.`,
        "Legendary, Ultra Rare, Mythic and Transcendent are limited to 1 copy per deck. Lower rarities can be played twice.",
        `There are ${FACTIONS.length} factions: ${factionNames}.`,
        "Factions shape visuals, common mechanics and many synergy conditions.",
      ],
      [
        createWikiCallout("Rarity line", rarityLine, "gold"),
        createWikiCallout("Deck limit", "High rarities 1×, lower rarities 2×", "danger"),
        createWikiCallout("Factions", factionNames, "aqua"),
      ],
      ["rarity", "faction", "ultra rare", "mythic", "transcendent", "deck limit"]
    ),
    createWikiSection(
      "symbols-and-effects",
      "cards",
      "Symbols, keywords, status effects and effect icons",
      "Symbols are there to reduce reading time and make card roles obvious faster.",
      [
        "Each faction has its own symbol and color language.",
        "Keywords are fixed combat properties such as Charge, Guard, Regeneration and Lifesteal.",
        "Status effects cover Burn, Freeze, Poison and Barrier.",
        "Effect icons highlight mechanics like mana gain, draw, summons, weakening, timing and synergy.",
      ],
      [
        createWikiCallout("Keywords", "Charge · Guard · Regeneration · Lifesteal", "violet"),
        createWikiCallout("States", "Burn · Freeze · Poison · Barrier", "danger"),
        createWikiCallout("Icons", "Mana · Draw · Summon · Weaken · Tempo · Synergy", "gold"),
      ],
      ["symbols", "keywords", "status", "burn", "freeze", "poison", "barrier"]
    ),
    createWikiSection(
      "collection-filters",
      "decks",
      "Collection, filters and card browsing",
      "The collection acts as your archive for ownership, duplicates, prices and quick inspection.",
      [
        "You can filter by name, rarity, type, faction, mana range, ownership and duplicates.",
        "Default sorting starts with the most common cards and moves upward into rarer cards.",
        "Extra sorts help you surface market value, mana cost, card name or copy counts quickly.",
        "Clicking a card opens its detail view with market values, deck status and actions.",
      ],
      [
        createWikiCallout("Quick filters", "Owned-only and duplicates-only help when trimming or selling cards.", "emerald"),
        createWikiCallout("Detail access", "The modal combines rules, ownership, prices and actions in one place.", "aqua"),
      ],
      ["collection", "filters", "sort", "duplicates", "prices", "details"]
    ),
    createWikiSection(
      "deckbuilding",
      "decks",
      "Deckbuilding and saved lists",
      "Decks are saved permanently and validated instead of being silently rewritten.",
      [
        `A playable deck must contain exactly ${APP_CONFIG.deckSize} cards.`,
        "The deck manager shows card count, unit count, spell count, trainer count and validation warnings.",
        "If you sell a card later, the deck is preserved but may become blocked until the missing copy is replaced.",
        "Your active deck directly affects match readiness and anti-farm calculations.",
      ],
      [
        createWikiCallout("Required size", `${APP_CONFIG.deckSize} cards per playable deck`, "gold"),
        createWikiCallout("Safe saving", "Saved decks are blocked when invalid, not deleted.", "steel"),
      ],
      ["deck", "deckbuilding", "saved", "blocked", "active deck"]
    ),
    createWikiSection(
      "arena-rules",
      "arena",
      "Arena flow and difficulty levels",
      "The arena is deliberately slower and more tactical so that statuses, synergy and board control matter.",
      [
        `Heroes start at ${APP_CONFIG.heroHealth} health, opening hands use ${APP_CONFIG.openingHandSize} cards and each side has ${APP_CONFIG.boardSize} board slots.`,
        `Mana grows each round up to ${APP_CONFIG.maxMana}. Stronger cards open up over time instead of deciding the match immediately.`,
        "Matches include timing, statuses, keywords, death effects and token summons.",
        "Difficulties are Novice, Standard, Veteran and Nightmare, each with different rewards and surrender penalties.",
      ],
      [
        createWikiCallout("Core values", `${APP_CONFIG.heroHealth} health · ${APP_CONFIG.openingHandSize} opening cards · ${APP_CONFIG.boardSize} slots`, "danger"),
        createWikiCallout("Difficulty set", "Novice · Standard · Veteran · Nightmare", "gold"),
        createWikiCallout("Locking", "While a match runs, navigation, selling and deck edits are locked.", "steel"),
      ],
      ["arena", "match", "mana", "difficulty", "nightmare", "forfeit"]
    ),
    createWikiSection(
      "marketplace",
      "arena",
      "Marketplace, prices and hourly simulation",
      "The marketplace is a separate economy layer and intentionally not the same as simple vendor selling.",
      [
        "Each card has vendor value, market gross value, market payout and a separate buy price.",
        `Marketplace sales pay a ${feePct}% fee into the fee vault.`,
        "Supply and demand are simulated once per real hour, so prices can rise or fall over time.",
        "Because of that, market value may sit above or below the normal sell value at any given time.",
      ],
      [
        createWikiCallout("Fee", `${feePct}% fee on marketplace sales`, "danger"),
        createWikiCallout("Update rhythm", "The market rotates once per real hour.", "aqua"),
        createWikiCallout("Important values", "Gross · Fee · Net · Buy price · Hourly trend", "gold"),
      ],
      ["market", "marketplace", "fee", "gross", "net", "buy price", "trend"]
    ),
    createWikiSection(
      "account-server",
      "account",
      "Profile, friends, settings, admin and server operation",
      "Account handling and infrastructure are separated from match logic so progress remains clean, secure and expandable.",
      [
        "Profile lets you change your name and password, reset your account data and check your friend code.",
        "The friends area is already prepared so trading and relationships can be added later without a UI rebuild.",
        "Settings store language, click effects, pack effects, reduced motion and confirmations per account.",
        "Server operation currently runs through the backend and Coolify. Core checks rely on `/api/health`, persistent storage and GitHub-based deploys.",
      ],
      [
        createWikiCallout("Profile", "Name, password, reset and friend code in one module", "emerald"),
        createWikiCallout("Settings", "Deutsch, English and Français plus comfort options per account", "aqua"),
        createWikiCallout("Server", "Healthcheck: /api/health · Port 3000 · persistent backend data", "steel"),
      ],
      ["profile", "friends", "settings", "admin", "server", "coolify", "healthcheck", "deploy"]
    ),
  ];
}

function buildFrenchWikiSections() {
  const feePct = Math.round(MARKETPLACE_FEE_RATE * 100);
  const boosterCount = Object.keys(PACK_DEFINITIONS).length;
  const bundleCount = Object.keys(SHOP_BUNDLE_DEFINITIONS).length;
  const factionNames = FACTIONS.map((faction) => faction.name).join(", ");
  const rarityLine = RARITY_ORDER.map((rarity) => getRarityLabel(rarity)).join(" → ");

  return [
    createWikiSection(
      "start-account",
      "start",
      "Démarrage du compte et premiers pas",
      "Voici comment commence un nouveau compte et comment obtenir rapidement un premier deck jouable.",
      [
        `Les nouveaux comptes commencent avec ${APP_CONFIG.baseGold} or, 0 carte et 5 boosters de départ gratuits.`,
        "Les noms doivent être uniques, rester à 12 caractères maximum et ne pas contenir de variantes d'admin.",
        "Après connexion, la progression est stockée sur le serveur et restaurée après un rechargement.",
        `Chemin conseillé : ouvrir les boosters, consulter la collection, construire un deck de ${APP_CONFIG.deckSize} cartes puis entrer dans l'arène.`,
      ],
      [
        createWikiCallout("Compte de départ", `${APP_CONFIG.baseGold} or · 0 carte · 5 boosters de départ`, "gold"),
        createWikiCallout("Chemin rapide", "Ouvrir les boosters → vérifier la collection → sauvegarder un deck → lancer l'arène", "aqua"),
      ],
      ["départ", "compte", "inscription", "connexion", "booster", "deck"]
    ),
    createWikiSection(
      "game-loop",
      "start",
      "Boucle principale du jeu",
      "Projekt Vault repose sur une boucle claire : obtenir des cartes, construire un deck, jouer puis gérer la valeur.",
      [
        "Achète des boosters ou des packs thématiques dans la boutique.",
        "Consulte rareté, symboles, effets et prix de marché dans la collection.",
        `Construis un deck valide de exactement ${APP_CONFIG.deckSize} cartes.`,
        "Joue en arène, gagne des récompenses puis décide quoi garder, vendre ou échanger sur le marché.",
      ],
      [
        createWikiCallout("Boucle", "Boutique et boosters alimentent la collection, les decks la rendent jouable, l'arène et le marché lui donnent de la valeur.", "violet"),
        createWikiCallout("Conseil", "Ouvre d'abord les 5 boosters de départ avant de dépenser plus d'or.", "emerald"),
      ],
      ["boucle", "progression", "collection", "deck", "arène", "marché"]
    ),
    createWikiSection(
      "shop-economy",
      "economy",
      "Or, boutique, boosters et packs",
      "L'or est la ressource centrale pour acheter, progresser et trader.",
      [
        "L'or provient surtout des récompenses d'arène puis de la vente des cartes.",
        `La boutique contient ${boosterCount} niveaux de boosters avec prix, garanties et chances différentes.`,
        `En plus, ${bundleCount} packs proposent des cartes garanties et des boosters bonus.`,
        "Les packs coûtent plus cher, mais donnent une progression de faction plus ciblée et plus stable.",
      ],
      [
        createWikiCallout("Boosters", `${boosterCount} paliers du Starter à l'Astral`, "gold"),
        createWikiCallout("Packs", `${bundleCount} offres avec cartes garanties`, "aqua"),
        createWikiCallout("Règle d'économie", "L'or ne descend jamais sous 0.", "steel"),
      ],
      ["or", "boutique", "boosters", "packs", "prix", "offres"]
    ),
    createWikiSection(
      "card-basics",
      "cards",
      "Types de cartes, valeurs et lecture rapide",
      "Les cartes sont organisées pour être comprises vite, puis détaillées dans la fenêtre complète.",
      [
        "Les unités restent sur le plateau avec coût, attaque et vie.",
        "Les sorts appliquent leur effet immédiatement et n'ont généralement pas de stats de combat.",
        "Les entraîneurs sont des cartes de soutien avec utilité, tempo ou préparation.",
        "La vue normale est courte. La vue détaillée reprend les mêmes informations sous une forme plus structurée.",
      ],
      [
        createWikiCallout("Unité", "Reste sur le plateau et influence plusieurs tours.", "emerald"),
        createWikiCallout("Sort", "Résout son effet immédiatement.", "violet"),
        createWikiCallout("Entraîneur", "Renforce ton plan avec utilité, pioche ou tempo.", "aqua"),
      ],
      ["cartes", "unité", "sort", "entraîneur", "coût", "attaque", "vie"]
    ),
    createWikiSection(
      "rarities-factions",
      "cards",
      "Raretés et factions",
      "La rareté fixe la valeur et les limites de deck, les factions fixent l'identité et les tendances d'effets.",
      [
        `La ligne de rareté actuelle est : ${rarityLine}.`,
        "Légendaire, Ultra Rare, Mythique et Transcendant sont limités à 1 exemplaire par deck. Les raretés inférieures peuvent être jouées deux fois.",
        `Il existe ${FACTIONS.length} factions : ${factionNames}.`,
        "Les factions définissent l'apparence, les symboles et de nombreuses synergies.",
      ],
      [
        createWikiCallout("Ligne de rareté", rarityLine, "gold"),
        createWikiCallout("Limite de deck", "Raretés hautes 1×, raretés basses 2×", "danger"),
        createWikiCallout("Factions", factionNames, "aqua"),
      ],
      ["rareté", "faction", "mythique", "transcendant", "limite de deck"]
    ),
    createWikiSection(
      "symbols-and-effects",
      "cards",
      "Symboles, mots-clés, états et effets",
      "Les symboles servent à comprendre une carte plus vite sans tout lire immédiatement.",
      [
        "Chaque faction possède son symbole et sa couleur dominante.",
        "Les mots-clés sont des propriétés fixes comme Charge, Garde, Régénération et Vol de vie.",
        "Les états couvrent Brûlure, Gel, Poison et Barrière.",
        "Les icônes d'effet montrent mana, pioche, invocation, affaiblissement, timing, tempo et synergie.",
      ],
      [
        createWikiCallout("Mots-clés", "Charge · Garde · Régénération · Vol de vie", "violet"),
        createWikiCallout("États", "Brûlure · Gel · Poison · Barrière", "danger"),
        createWikiCallout("Icônes", "Mana · Pioche · Invocation · Affaiblissement · Tempo · Synergie", "gold"),
      ],
      ["symboles", "mots-clés", "états", "brûlure", "gel", "poison", "barrière"]
    ),
    createWikiSection(
      "collection-filters",
      "decks",
      "Collection, filtres et lecture des cartes",
      "La collection sert d'archive pour la possession, les doublons, les prix et l'inspection rapide.",
      [
        "Tu peux filtrer par nom, rareté, type, faction, coût, possession et doublons.",
        "Le tri par défaut commence par les cartes communes puis remonte vers les raretés plus hautes.",
        "Des tris supplémentaires existent pour la valeur de marché, le nom, le mana ou le nombre de copies.",
        "Un clic sur une carte ouvre sa fenêtre détaillée avec prix, état du deck et actions.",
      ],
      [
        createWikiCallout("Filtres rapides", "Possédées seulement et doublons seulement aident pour le ménage et la vente.", "emerald"),
        createWikiCallout("Accès direct", "La fenêtre détaillée rassemble règles, possession, marché et actions.", "aqua"),
      ],
      ["collection", "filtres", "tri", "doublons", "prix", "détails"]
    ),
    createWikiSection(
      "deckbuilding",
      "decks",
      "Construction de deck et listes sauvegardées",
      "Les decks sont enregistrés durablement et validés au lieu d'être réécrits en silence.",
      [
        `Un deck jouable doit contenir exactement ${APP_CONFIG.deckSize} cartes.`,
        "Le gestionnaire de deck affiche nombre de cartes, unités, sorts, entraîneurs et avertissements.",
        "Si tu vends une carte ensuite, le deck reste sauvegardé mais peut devenir bloqué jusqu'à remplacement.",
        "Le deck actif influence directement l'accès à l'arène et la réduction anti-farm.",
      ],
      [
        createWikiCallout("Taille obligatoire", `${APP_CONFIG.deckSize} cartes par deck jouable`, "gold"),
        createWikiCallout("Sauvegarde sûre", "Les decks invalides sont bloqués, pas supprimés.", "steel"),
      ],
      ["deck", "construction", "sauvegarde", "bloqué", "deck actif"]
    ),
    createWikiSection(
      "arena-rules",
      "arena",
      "Arène, déroulement des matchs et difficultés",
      "L'arène est volontairement plus tactique et plus lente afin que les états, synergies et décisions de plateau comptent.",
      [
        `Les héros commencent à ${APP_CONFIG.heroHealth} PV, la main de départ contient ${APP_CONFIG.openingHandSize} cartes et chaque côté a ${APP_CONFIG.boardSize} emplacements.`,
        `Le mana monte jusqu'à ${APP_CONFIG.maxMana}, ce qui retarde les cartes les plus fortes.`,
        "Les matchs gèrent timing, états, mots-clés, effets de mort et invocations.",
        "Les difficultés sont Novice, Standard, Vétéran et Cauchemar avec récompenses et pénalités différentes.",
      ],
      [
        createWikiCallout("Valeurs de base", `${APP_CONFIG.heroHealth} PV · ${APP_CONFIG.openingHandSize} cartes · ${APP_CONFIG.boardSize} slots`, "danger"),
        createWikiCallout("Difficultés", "Novice · Standard · Vétéran · Cauchemar", "gold"),
        createWikiCallout("Verrouillage", "Pendant un match, navigation, vente et édition de deck sont bloquées.", "steel"),
      ],
      ["arène", "match", "mana", "difficulté", "cauchemar", "abandon"]
    ),
    createWikiSection(
      "marketplace",
      "arena",
      "Marché, prix et simulation horaire",
      "Le marché est une couche économique séparée et n'est pas identique à la vente simple au marchand.",
      [
        "Chaque carte possède une valeur marchand, une valeur brute au marché, un net et un prix d'achat séparé.",
        `Chaque vente au marché paie ${feePct}% de frais vers la réserve de frais.`,
        "L'offre et la demande sont simulées toutes les heures réelles, donc les prix montent et descendent.",
        "Le prix du marché peut ainsi être supérieur ou inférieur à la valeur de vente normale.",
      ],
      [
        createWikiCallout("Frais", `${feePct}% de frais sur les ventes du marché`, "danger"),
        createWikiCallout("Rythme", "Le marché se met à jour toutes les heures réelles.", "aqua"),
        createWikiCallout("Valeurs clés", "Brut · Frais · Net · Achat · Tendance horaire", "gold"),
      ],
      ["marché", "frais", "brut", "net", "achat", "tendance"]
    ),
    createWikiSection(
      "account-server",
      "account",
      "Profil, amis, réglages, admin et serveur",
      "La gestion du compte et l'infrastructure sont séparées de la logique de match pour garder une base propre et extensible.",
      [
        "Le profil permet de changer le nom, le mot de passe, réinitialiser le compte et consulter le code ami.",
        "L'onglet amis est déjà préparé pour ajouter plus tard relations et échanges sans refaire l'interface.",
        "Les réglages mémorisent la langue, les effets de clic, les effets de booster, les mouvements réduits et les confirmations.",
        "Le fonctionnement serveur passe actuellement par le backend et Coolify. Le point de contrôle principal est `/api/health`.",
      ],
      [
        createWikiCallout("Profil", "Nom, mot de passe, reset et code ami dans un seul module", "emerald"),
        createWikiCallout("Réglages", "Deutsch, English et Français plus les options de confort", "aqua"),
        createWikiCallout("Serveur", "Healthcheck : /api/health · Port 3000 · données persistantes backend", "steel"),
      ],
      ["profil", "amis", "réglages", "admin", "serveur", "coolify", "healthcheck", "deploy"]
    ),
  ];
}

function buildWikiSections() {
  switch (getCurrentLanguage()) {
    case "en":
      return buildEnglishWikiSections();
    case "fr":
      return buildFrenchWikiSections();
    default:
      return buildGermanWikiSections();
  }
}

function getFilteredWikiSections(sections) {
  const normalizedQuery = normalizeWikiSearchText(uiState.wikiSearch);

  return sections.filter((section) => {
    if (uiState.wikiTopic !== "all" && section.topic !== uiState.wikiTopic) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return normalizeWikiSearchText(buildWikiSearchBlob(section)).includes(normalizedQuery);
  });
}

function renderWiki() {
  const sections = buildWikiSections();
  const visibleSections = getFilteredWikiSections(sections);
  const filtered = Boolean(uiState.wikiSearch.trim()) || uiState.wikiTopic !== "all";
  const stats = [
    { label: getWikiUiText("stats.chapters"), value: sections.length, tone: "gold" },
    { label: getWikiUiText("stats.factions"), value: FACTIONS.length, tone: "aqua" },
    { label: getWikiUiText("stats.boosters"), value: Object.keys(PACK_DEFINITIONS).length, tone: "violet" },
    { label: getWikiUiText("stats.packs"), value: Object.keys(SHOP_BUNDLE_DEFINITIONS).length, tone: "emerald" },
  ];
  const quickLinks = ["start-account", "shop-economy", "card-basics", "deckbuilding", "arena-rules", "marketplace"]
    .map((id) => sections.find((section) => section.id === id))
    .filter(Boolean);

  elements.wikiFindHeading.textContent = getWikiUiText("searchTitle");
  elements.wikiSearchLabel.textContent = getWikiUiText("searchLabel");
  elements.wikiSearchInput.placeholder = getWikiUiText("searchPlaceholder");
  elements.wikiContentEyebrow.textContent = getWikiUiText("contentEyebrow");
  elements.wikiContentHeading.textContent = getWikiUiText("contentTitle");

  elements.wikiSummary.innerHTML = `
    <div class="wiki-summary-copy">
      <p class="eyebrow">${getWikiUiText("summaryEyebrow")}</p>
      <h3 class="subheading">${getWikiUiText("summaryTitle")}</h3>
      <p class="mini-note">${getWikiUiText("summaryNote")}</p>
    </div>
    <div class="wiki-summary-grid">
      ${stats.map((entry) => `
        <div class="wiki-stat-card tone-${entry.tone}">
          <span>${escapeHtml(entry.label)}</span>
          <strong>${escapeHtml(entry.value)}</strong>
        </div>
      `).join("")}
    </div>
    <div class="wiki-links-block">
      <div class="wiki-links-head">
        <h4>${getWikiUiText("quickLinks")}</h4>
        ${filtered ? `<button class="secondary-button wiki-clear-button" type="button" data-wiki-reset="true">${getWikiUiText("clearFilters")}</button>` : ""}
      </div>
      <div class="wiki-link-grid">
        ${quickLinks.map((section) => `
          <button class="wiki-link-button tone-${getWikiTopicTone(section.topic)}" type="button" data-wiki-jump="${section.id}">
            <span class="wiki-link-title">${escapeHtml(section.title)}</span>
            <span class="wiki-link-copy">${escapeHtml(section.summary)}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `;

  elements.wikiTopicRow.innerHTML = Object.entries(getWikiUiText("topics")).map(([topicId, label]) => `
    <button class="wiki-topic-button ${uiState.wikiTopic === topicId ? "active" : ""}" type="button" data-wiki-topic="${topicId}">
      ${escapeHtml(label)}
    </button>
  `).join("");

  elements.wikiResultsMeta.textContent = uiState.wikiTopic === "all"
    ? getWikiUiText("resultsAll", { count: visibleSections.length, total: sections.length })
    : getWikiUiText("resultsTopic", {
      count: visibleSections.length,
      total: sections.length,
      topic: getWikiUiText(`topics.${uiState.wikiTopic}`),
    });

  if (!visibleSections.length) {
    elements.wikiContent.innerHTML = `
      <div class="wiki-empty-state">
        <h4>${getWikiUiText("noResultsTitle")}</h4>
        <p>${getWikiUiText("noResultsText")}</p>
      </div>
    `;
    return;
  }

  const expandAll = Boolean(uiState.wikiSearch.trim()) || uiState.wikiTopic !== "all";
  elements.wikiContent.innerHTML = visibleSections.map((section, index) => `
    <details class="wiki-entry tone-${getWikiTopicTone(section.topic)}" id="wiki-entry-${section.id}" ${expandAll || index === 0 ? "open" : ""}>
      <summary>
        <span class="wiki-entry-marker tone-${getWikiTopicTone(section.topic)}">${String(index + 1).padStart(2, "0")}</span>
        <div class="wiki-entry-head">
          <span class="meta-chip wiki-entry-topic">${escapeHtml(getWikiUiText(`topics.${section.topic}`))}</span>
          <strong>${escapeHtml(section.title)}</strong>
          <p>${escapeHtml(section.summary)}</p>
        </div>
      </summary>
      <div class="wiki-entry-body">
        <div class="wiki-callout-grid">
          ${section.callouts.map((entry) => `
            <div class="wiki-callout-card tone-${entry.tone || getWikiTopicTone(section.topic)}">
              <span>${escapeHtml(entry.label)}</span>
              <p>${escapeHtml(entry.text)}</p>
            </div>
          `).join("")}
        </div>
        <ul class="wiki-bullet-list">
          ${section.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}
        </ul>
      </div>
    </details>
  `).join("");
}

function formatArenaDelta(playerValue, enemyValue) {
  const delta = playerValue - enemyValue;
  return delta > 0 ? `+${delta}` : `${delta}`;
}

function createBoardSlotPlaceholder(side) {
  const slot = document.createElement("div");
  slot.className = `board-slot-placeholder ${side}`;
  slot.innerHTML = `
    <span>${getUiText("arena.emptySlot")}</span>
    <small>${side === "enemy" ? getUiText("arena.opponent") : getUiText("arena.you")}</small>
  `;
  return slot;
}

function renderBoardState(container, units, side, matchFinished, phase) {
  container.innerHTML = "";

  for (let slotIndex = 0; slotIndex < APP_CONFIG.boardSize; slotIndex += 1) {
    const unit = units[slotIndex];

    if (!unit) {
      container.append(createBoardSlotPlaceholder(side));
      continue;
    }

    if (side === "enemy") {
      const cardElement = renderCard(getCard(unit.cardId), {
        context: "board",
        stateOverride: unit,
        footer: buildUnitStateFooter(unit, unit.canAttack ? getUiText("arena.attackReady") : getUiText("arena.readyNextTurn")),
      });
      cardElement.dataset.unitUid = String(unit.uid);
      cardElement.dataset.side = side;
      container.append(cardElement);
      continue;
    }

    const canAttack = phase === "player" && unit.canAttack && !matchFinished;
    const cardElement = renderCard(getCard(unit.cardId), {
      context: "board",
      stateOverride: unit,
      buttons: [
        {
          label: canAttack ? getUiText("arena.attack") : getUiText("arena.wait"),
          disabled: !canAttack,
          handler: () => attackWithUnit(unit.uid),
        },
      ],
      footer: buildUnitStateFooter(unit, unit.canAttack ? getUiText("arena.attackHint") : getUiText("arena.notReadyHint")),
    });
    cardElement.dataset.unitUid = String(unit.uid);
    cardElement.dataset.side = side;
    container.append(cardElement);
  }
}

function applyServerMultiplayerOverview(payload, { render = true } = {}) {
  if (!payload) {
    return false;
  }

  uiState.multiplayerQueue = Array.isArray(payload.queue) ? cloneJsonValue(payload.queue, []) : [];
  uiState.multiplayerOwnQueueEntry = payload.ownQueueEntry && typeof payload.ownQueueEntry === "object"
    ? cloneJsonValue(payload.ownQueueEntry, null)
    : null;
  uiState.multiplayerIncomingChallenges = Array.isArray(payload.incomingChallenges)
    ? cloneJsonValue(payload.incomingChallenges, [])
    : [];
  uiState.multiplayerOutgoingChallenges = Array.isArray(payload.outgoingChallenges)
    ? cloneJsonValue(payload.outgoingChallenges, [])
    : [];
  uiState.multiplayerHydrated = true;
  if (render) {
    renderMultiplayer();
  }
  return true;
}

async function refreshServerMultiplayerOverview({ render = true } = {}) {
  if (!isServerSessionActive()) {
    return false;
  }

  const response = await apiRequest("/api/multiplayer/overview", {
    token: getSessionSnapshot()?.token,
  });
  return applyServerMultiplayerOverview(response, { render });
}

async function hydrateMultiplayerSection({ force = false, render = true } = {}) {
  if (!isServerSessionActive()) {
    uiState.multiplayerHydrated = true;
    uiState.multiplayerQueue = [];
    uiState.multiplayerOwnQueueEntry = null;
    uiState.multiplayerIncomingChallenges = [];
    uiState.multiplayerOutgoingChallenges = [];
    if (render) {
      renderMultiplayer();
    }
    return false;
  }

  if (uiState.multiplayerHydrated && !force) {
    if (render) {
      renderMultiplayer();
    }
    return true;
  }

  uiState.multiplayerLoading = true;
  if (render) {
    renderMultiplayer();
  }

  try {
    await refreshServerMultiplayerOverview({ render: false });
    return true;
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || localText("Multiplayer-Daten konnten nicht geladen werden.", "Could not load multiplayer data.", "Impossible de charger les données multijoueur."));
    return false;
  } finally {
    uiState.multiplayerLoading = false;
    if (render) {
      renderMultiplayer();
    }
  }
}

async function runServerMultiplayerAction(path, body = {}, { render = true } = {}) {
  if (!isServerSessionActive()) {
    return null;
  }

  const response = await apiRequest(path, {
    method: "POST",
    token: getSessionSnapshot()?.token,
    body,
  });
  applyServerMultiplayerOverview(response, { render: false });
  if (render) {
    renderMultiplayer();
  }
  return response;
}

function startMultiplayerMatchFromChallenge(challenge) {
  const activeDeck = getActiveDeck();
  const validation = validateDeck(activeDeck, DECK_MODES.standard);
  if (!validation.valid) {
    showToast(validation.messages[0] || getUiText("messages.matchNotPlayable"));
    return false;
  }

  const enemyDeckCards = Array.isArray(challenge?.deckCards)
    ? challenge.deckCards.filter((cardId) => CARD_MAP.has(cardId)).slice(0, APP_CONFIG.deckSize)
    : [];
  if (enemyDeckCards.length !== APP_CONFIG.deckSize) {
    showToast(localText("Das Multiplayer-Deck ist nicht mehr vollständig.", "The multiplayer deck is no longer complete.", "Le deck multijoueur n'est plus complet."));
    return false;
  }

  uiState.match = createMatch(activeDeck.cards, getArenaDifficultyId(getSave().arenaDifficulty), {
    mode: "friend",
    opponentLabel: sanitizeUsername(challenge.from) || localText("Spieler", "Player", "Joueur"),
    opponentDeckName: String(challenge.deckName || "").trim().slice(0, 48),
    enemyDeckCards,
    rewardWin: 0,
    rewardLoss: 0,
    forfeitPenalty: 0,
  });
  uiState.section = "arena";
  startTurn("player");
  renderAll();
  showToast(localText("Multiplayer-Duell gestartet.", "Multiplayer duel started.", "Duel multijoueur lancé."));
  return true;
}

async function handleMultiplayerQueueJoin() {
  const activeDeck = getActiveDeck();
  const validation = validateDeck(activeDeck, DECK_MODES.standard);
  if (!validation.valid) {
    showToast(validation.messages[0] || getUiText("messages.matchNotPlayable"));
    return;
  }

  uiState.multiplayerQueueBusy = true;
  renderMultiplayer();
  try {
    await runServerMultiplayerAction("/api/multiplayer/queue/join", {
      deckName: activeDeck.name,
      deckCards: activeDeck.cards,
    }, { render: false });
    renderMultiplayer();
    showToast(localText("Du bist jetzt in der Multiplayer-Queue.", "You joined the multiplayer queue.", "Tu es maintenant dans la file multijoueur."));
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || localText("Queue-Beitritt fehlgeschlagen.", "Could not join queue.", "Impossible de rejoindre la file."));
  } finally {
    uiState.multiplayerQueueBusy = false;
    renderMultiplayer();
  }
}

async function handleMultiplayerQueueLeave() {
  uiState.multiplayerQueueBusy = true;
  renderMultiplayer();
  try {
    await runServerMultiplayerAction("/api/multiplayer/queue/leave", {}, { render: false });
    renderMultiplayer();
    showToast(localText("Du hast die Queue verlassen.", "You left the queue.", "Tu as quitté la file."));
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || localText("Queue konnte nicht verlassen werden.", "Could not leave queue.", "Impossible de quitter la file."));
  } finally {
    uiState.multiplayerQueueBusy = false;
    renderMultiplayer();
  }
}

async function handleMultiplayerChallengeCreate(username) {
  const targetUsername = sanitizeUsername(username);
  if (!targetUsername) {
    return;
  }

  const activeDeck = getActiveDeck();
  const validation = validateDeck(activeDeck, DECK_MODES.standard);
  if (!validation.valid) {
    showToast(validation.messages[0] || getUiText("messages.matchNotPlayable"));
    return;
  }

  uiState.multiplayerChallengeBusy = true;
  renderMultiplayer();
  try {
    await runServerMultiplayerAction("/api/multiplayer/challenge/create", {
      username: targetUsername,
      deckName: activeDeck.name,
      deckCards: activeDeck.cards,
    }, { render: false });
    renderMultiplayer();
    showToast(localText("Multiplayer-Herausforderung gesendet.", "Multiplayer challenge sent.", "Défi multijoueur envoyé."));
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || localText("Herausforderung fehlgeschlagen.", "Challenge failed.", "Le défi a échoué."));
  } finally {
    uiState.multiplayerChallengeBusy = false;
    renderMultiplayer();
  }
}

async function handleMultiplayerChallengeAction(challengeId, action) {
  if (!challengeId) {
    return;
  }

  uiState.multiplayerChallengeBusy = true;
  renderMultiplayer();
  try {
    const response = await runServerMultiplayerAction("/api/multiplayer/challenge/respond", {
      challengeId,
      action,
    }, { render: false });
    if (action === "accept" && response?.challenge) {
      startMultiplayerMatchFromChallenge(response.challenge);
      return;
    }
    renderMultiplayer();
    showToast(localText("Multiplayer-Herausforderung aktualisiert.", "Multiplayer challenge updated.", "Défi multijoueur mis à jour."));
  } catch (error) {
    console.error(error);
    showToast(error?.payload?.message || localText("Herausforderung konnte nicht verarbeitet werden.", "Could not process challenge.", "Impossible de traiter le défi."));
  } finally {
    uiState.multiplayerChallengeBusy = false;
    renderMultiplayer();
  }
}

function getBattleStageElement() {
  return document.querySelector(".battle-stage");
}

function getArenaMotionPreset() {
  if (getUserSettings().reducedMotion) {
    return {
      lungeMs: 90,
      trailMs: 120,
      impactMs: 120,
      enemyStepMs: 140,
      enemyThinkMs: 80,
    };
  }

  return {
    lungeMs: 240,
    trailMs: 320,
    impactMs: 220,
    enemyStepMs: 460,
    enemyThinkMs: 180,
  };
}

function waitForArenaMotion(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function getBoardUnitElement(side, unitUid) {
  const container = side === "player" ? elements.playerBoard : elements.enemyBoard;
  return container?.querySelector(`[data-unit-uid="${unitUid}"]`) || null;
}

function getHeroTargetElement(side) {
  return side === "player" ? elements.playerHeroPanel : elements.enemyHeroPanel;
}

function getElementCenter(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function spawnBattleTrail(sourceElement, targetElement, tone = "player") {
  const stage = getBattleStageElement();
  if (!stage || !sourceElement || !targetElement) {
    return null;
  }

  const stageRect = stage.getBoundingClientRect();
  const sourceCenter = getElementCenter(sourceElement);
  const targetCenter = getElementCenter(targetElement);
  const deltaX = targetCenter.x - sourceCenter.x;
  const deltaY = targetCenter.y - sourceCenter.y;
  const distance = Math.max(12, Math.hypot(deltaX, deltaY));
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  const trail = document.createElement("div");
  trail.className = `battle-trail tone-${tone}`;
  trail.style.left = `${sourceCenter.x - stageRect.left}px`;
  trail.style.top = `${sourceCenter.y - stageRect.top}px`;
  trail.style.width = `${distance}px`;
  trail.style.transform = `translateY(-50%) rotate(${angle}deg)`;
  stage.append(trail);
  return trail;
}

function spawnBattleImpact(targetElement, tone = "player") {
  const stage = getBattleStageElement();
  if (!stage || !targetElement) {
    return null;
  }

  const stageRect = stage.getBoundingClientRect();
  const targetCenter = getElementCenter(targetElement);
  const impact = document.createElement("div");
  impact.className = `battle-impact tone-${tone}`;
  impact.style.left = `${targetCenter.x - stageRect.left}px`;
  impact.style.top = `${targetCenter.y - stageRect.top}px`;
  stage.append(impact);
  return impact;
}

async function playCombatAnimation(attacker, owner, target) {
  const attackerElement = getBoardUnitElement(owner, attacker.uid);
  const targetSide = owner === "player" ? "enemy" : "player";
  const targetElement = target?.uid ? getBoardUnitElement(targetSide, target.uid) : getHeroTargetElement(targetSide);

  if (!attackerElement || !targetElement) {
    return;
  }

  const motion = getArenaMotionPreset();
  const tone = owner === "player" ? "player" : "enemy";
  const lungeClass = owner === "player" ? "is-attack-lunge-player" : "is-attack-lunge-enemy";
  const trail = spawnBattleTrail(attackerElement, targetElement, tone);
  attackerElement.classList.add(lungeClass);
  targetElement.classList.add("is-battle-targeted");

  await waitForArenaMotion(motion.lungeMs);

  const impact = spawnBattleImpact(targetElement, tone);
  targetElement.classList.add("is-battle-hit");
  await waitForArenaMotion(motion.impactMs);

  attackerElement.classList.remove(lungeClass);
  targetElement.classList.remove("is-battle-hit", "is-battle-targeted");
  trail?.remove();
  impact?.remove();
}

function renderArena() {
  const activeDeck = getActiveDeck();
  const validation = validateDeck(activeDeck);
  const hasMatch = Boolean(uiState.match);
  const match = uiState.match;
  const matchFinished = Boolean(match && (match.status === "won" || match.status === "lost"));
  const difficultyId = hasMatch ? getArenaDifficultyId(match.difficultyId) : getArenaDifficultyId(getSave().arenaDifficulty);
  const previewDeckProfile = activeDeck ? analyzeDeck(activeDeck.cards) : null;
  const difficulty = hasMatch
    ? {
      ...getArenaDifficulty(difficultyId),
      rewardWin: sanitizeFiniteInteger(match.rewardWin, getArenaDifficulty(difficultyId).rewardWin, 0, SECURITY_LIMITS.maxGold),
      rewardLoss: sanitizeFiniteInteger(match.rewardLoss, getArenaDifficulty(difficultyId).rewardLoss, 0, SECURITY_LIMITS.maxGold),
      rankWin: sanitizeFiniteInteger(match.rankWin, getArenaDifficulty(difficultyId).rankWin, 0, SECURITY_LIMITS.maxGold),
      rankLoss: sanitizeFiniteInteger(match.rankLoss, getArenaDifficulty(difficultyId).rankLoss, 0, SECURITY_LIMITS.maxGold),
      recommendedDifficultyId: getArenaDifficultyId(match.recommendedDifficultyId || match.difficultyId),
      antiFarmActive: Boolean(match.antiFarmActive),
      antiFarmGap: sanitizeFiniteInteger(match.antiFarmGap, 0, 0, 3),
      powerScore: sanitizeFiniteNumber(match.player?.deckProfile?.powerScore, 0, 0, 999, 1),
    }
    : (previewDeckProfile ? createArenaMatchConfig(previewDeckProfile, difficultyId) : {
      ...getArenaDifficulty(difficultyId),
      recommendedDifficultyId: difficultyId,
      antiFarmActive: false,
      antiFarmGap: 0,
      rankWin: getArenaDifficulty(difficultyId).rankWin,
      rankLoss: getArenaDifficulty(difficultyId).rankLoss,
      powerScore: 0,
    });
  const boardDelta = hasMatch ? formatArenaDelta(match.player.board.length, match.enemy.board.length) : "0";
  const handDelta = hasMatch ? formatArenaDelta(match.player.hand.length, match.enemy.hand.length) : "0";
  const lifeDelta = hasMatch ? formatArenaDelta(match.player.hero, match.enemy.hero) : "0";
  const latestLog = hasMatch ? (match.log[match.log.length - 1]?.text || match.statusMessage) : getUiText("arena.startMatchHint");
  const statusTone = !hasMatch
    ? (validation.valid ? "ok" : "warn")
    : matchFinished
      ? (match.status === "won" ? "ok" : "warn")
      : "turn";
  const statusLabel = !hasMatch
    ? (validation.valid ? getUiText("common.ready") : getUiText("arena.notReady"))
    : matchFinished
      ? (match.status === "won" ? getUiText("arena.victory") : getUiText("arena.defeat"))
      : (match.phase === "player" ? getUiText("arena.yourTurn") : getUiText("arena.enemyTurn"));
  const statusTitle = hasMatch
    ? (matchFinished ? match.statusMessage : getUiText("arena.focusMode"))
    : getUiText("arena.noMatch");
  const difficultyNote = difficulty.antiFarmActive
    ? `${getUiText("arena.recommended", { difficulty: getArenaDifficultyLabel(difficulty.recommendedDifficultyId) })}. ${getUiText("arena.antiFarmNote", { win: difficulty.rewardWin, loss: difficulty.rewardLoss })}`
    : `${getArenaDifficultyDescription(difficultyId)} ${getUiText("arena.difficultyHint")}`;
  const rankRewardNote = localText(
    `${difficulty.rankWin} RP pro Sieg`,
    `${difficulty.rankWin} RP per win`,
    `${difficulty.rankWin} RP par victoire`,
  );
  const previewStartingMana = difficultyId === "novice" || difficultyId === "standard" || difficultyId === "veteran" || difficultyId === "nightmare" || difficultyId === "hardcore"
    ? sanitizeFiniteInteger(getArenaDifficulty(difficultyId).startingMana, APP_CONFIG.startingMana, 0, APP_CONFIG.maxMana)
    : APP_CONFIG.startingMana;
  const statusNote = hasMatch
    ? (matchFinished ? latestLog : getUiText("arena.focusNote"))
    : (validation.valid ? `${difficultyNote} ${getUiText("arena.readyStart")}` : `${difficultyNote} ${validation.messages.join(" ")}`);
  const previewSideState = {
    hero: APP_CONFIG.heroHealth,
    heroBarrier: 0,
    mana: previewStartingMana,
    maxMana: previewStartingMana,
    hand: [],
    board: [],
    deck: new Array(APP_CONFIG.deckSize).fill(null),
  };

  persistCurrentMatchIfNeeded(hasMatch);
  fillSelect(elements.arenaDifficultySelect, Object.values(ARENA_DIFFICULTIES).map((entry) => ({
    value: entry.id,
    label: `${getArenaDifficultyLabel(entry.id)} · ${entry.rankWin} RP`,
  })));
  elements.arenaDifficultySelect.value = difficultyId;
  elements.arenaDifficultySelect.disabled = hasMatch;

  elements.arenaStatus.dataset.matchState = hasMatch ? (matchFinished ? "finished" : "live") : "idle";
  elements.battleHeader.innerHTML = "";
  elements.enemyHeroPanel.innerHTML = "";
  elements.playerHeroPanel.innerHTML = "";
  elements.enemyBoard.innerHTML = "";
  elements.playerBoard.innerHTML = "";
  elements.battleLog.innerHTML = "";
  elements.playerHand.innerHTML = "";
  elements.endTurnButton.disabled = true;
  elements.startMatchButton.disabled = !validation.valid || isMatchSessionLocked();
  elements.resetMatchButton.disabled = !hasMatch;

  elements.arenaStatus.innerHTML = `
    <div class="arena-status-shell">
      <div class="arena-status-copy">
        <span class="status-pill ${statusTone}">${statusLabel}</span>
        <h3 class="arena-status-title">${statusTitle}</h3>
        <p class="mini-note">${statusNote}</p>
      </div>
      <div class="arena-side-meta">
        <span class="meta-chip">${hasMatch ? getUiText("arena.round", { turn: match.turn }) : getUiText("arena.noMatch")}</span>
        <span class="meta-chip">${hasMatch ? getUiText("arena.mana", { current: match.player.mana, max: match.player.maxMana }) : getUiText("arena.noHandTitle")}</span>
        <span class="meta-chip">${getArenaDifficultyLabel(difficultyId)}</span>
        <span class="meta-chip">${getUiText("arena.rewardWin", { gold: difficulty.rewardWin })}</span>
        <span class="meta-chip">${rankRewardNote}</span>
        <span class="meta-chip">${getUiText("arena.rewardLoss", { gold: difficulty.rewardLoss })}</span>
        <span class="meta-chip">${getUiText("arena.forfeitPenalty", { gold: difficulty.forfeitPenalty })}</span>
        ${difficulty.antiFarmActive ? `<span class="meta-chip">${getUiText("arena.recommended", { difficulty: getArenaDifficultyLabel(difficulty.recommendedDifficultyId) })}</span>` : ""}
      </div>
    </div>
  `;

  elements.battleHeader.innerHTML = `
    <article class="arena-insight-card">
      <p class="eyebrow">${getUiText("arena.difficulty")}</p>
      <strong>${getArenaDifficultyLabel(difficultyId)}</strong>
      <span>${difficulty.antiFarmActive ? `${getUiText("arena.antiFarmNote", { win: difficulty.rewardWin, loss: difficulty.rewardLoss })} · ${rankRewardNote}` : `${getArenaDifficultyDescription(difficultyId)} · ${rankRewardNote}`}</span>
    </article>
    <article class="arena-insight-card">
      <p class="eyebrow">${getUiText("arena.boardControl")}</p>
      <strong>${boardDelta}</strong>
      <span>${getUiText("arena.you")} ${hasMatch ? match.player.board.length : 0} · ${getUiText("arena.opponent")} ${hasMatch ? match.enemy.board.length : 0}</span>
    </article>
    <article class="arena-insight-card">
      <p class="eyebrow">${getUiText("arena.handFlow")}</p>
      <strong>${handDelta}</strong>
      <span>${getUiText("arena.you")} ${hasMatch ? match.player.hand.length : 0} · ${getUiText("arena.opponent")} ${hasMatch ? match.enemy.hand.length : 0}</span>
    </article>
    <article class="arena-insight-card">
      <p class="eyebrow">${getUiText("arena.heroRace")}</p>
      <strong>${lifeDelta}</strong>
      <span>${getUiText("arena.you")} ${hasMatch ? match.player.hero : APP_CONFIG.heroHealth} · ${getUiText("arena.opponent")} ${hasMatch ? match.enemy.hero : APP_CONFIG.heroHealth}</span>
    </article>
    <article class="arena-insight-card">
      <p class="eyebrow">${getUiText("arena.latestLog")}</p>
      <strong>${hasMatch ? getUiText("arena.round", { turn: match.turn }) : getUiText("common.waiting")}</strong>
      <span>${latestLog}</span>
    </article>
  `;

  if (!hasMatch) {
    renderHeroPanel(elements.enemyHeroPanel, getUiText("arena.opponent"), previewSideState, false, "enemy");
    renderHeroPanel(elements.playerHeroPanel, getUiText("arena.you"), previewSideState, false, "player");
    renderBoardState(elements.enemyBoard, [], "enemy", false, "enemy");
    renderBoardState(elements.playerBoard, [], "player", false, "player");
    elements.battleLog.innerHTML = `<div class="log-entry latest">${getUiText("arena.startMatchHint")}</div>`;
    elements.playerHand.innerHTML = `<div class="info-panel"><h3 class="subheading">${getUiText("arena.noHandTitle")}</h3><p class="mini-note">${getUiText("arena.noHandText")}</p></div>`;
    return;
  }

  renderHeroPanel(elements.enemyHeroPanel, getUiText("arena.opponent"), match.enemy, match.phase === "enemy", "enemy");
  renderHeroPanel(elements.playerHeroPanel, getUiText("arena.you"), match.player, match.phase === "player", "player");
  renderBoardState(elements.enemyBoard, match.enemy.board, "enemy", matchFinished, match.phase);
  renderBoardState(elements.playerBoard, match.player.board, "player", matchFinished, match.phase);

  match.log.slice().reverse().forEach((entry, index) => {
    const row = document.createElement("div");
    row.className = `log-entry${index === 0 ? " latest" : ""}`;
    row.innerHTML = `<strong>${entry.turn}</strong> ${entry.text}`;
    elements.battleLog.append(row);
  });

  if (!match.player.hand.length) {
    elements.playerHand.innerHTML = `<div class="info-panel"><h3 class="subheading">${getUiText("arena.noHandTitle")}</h3><p class="mini-note">${getUiText("arena.detailsHint")}</p></div>`;
  } else {
    match.player.hand.forEach((cardId, index) => {
      const card = getCard(cardId);
      const playable = canPlayCard(card, index);
      const restriction = getCardPlayRestriction(card, "player");
      const synergyHint = getSynergyStatusText(card, "player");
      elements.playerHand.append(renderCard(card, {
        context: "hand",
        buttons: [
          {
            label: playable ? getUiText("arena.play") : (restriction || getUiText("arena.tooExpensive")),
            disabled: !playable,
            handler: () => playCard(index),
          },
        ],
        footer: match.phase === "player"
          ? (restriction || synergyHint || getUiText("arena.detailsHint"))
          : getUiText("arena.enemyTurnLocked"),
      }));
    });
  }

  elements.endTurnButton.disabled = match.phase !== "player" || matchFinished;
}

function renderHeroPanel(container, label, sideState, active, side = "enemy") {
  container.dataset.side = side;
  container.dataset.targetType = "hero";
  container.innerHTML = `
    <p class="eyebrow">${label}</p>
    <div class="hero-line">
      <strong>${sideState.hero}</strong>
      <span class="status-pill ${active ? "turn" : "ok"}">${active ? "Aktiv" : "Wartet"}</span>
    </div>
    <div class="meta-chip-row">
      <span class="meta-chip">Mana ${sideState.mana}/${sideState.maxMana}</span>
      <span class="meta-chip">Hand ${sideState.hand.length}</span>
      <span class="meta-chip">Feld ${sideState.board.length}/${APP_CONFIG.boardSize}</span>
    </div>
  `;
}

function renderCardModal() {
  if (!uiState.modalCardId) {
    elements.cardModal.classList.add("hidden");
    document.body.classList.remove("modal-open");
    elements.cardModalContent.innerHTML = "";
    return;
  }

  const card = getCard(uiState.modalCardId);
  const activeDeck = getActiveDeck();
  const inActiveDeck = activeDeck ? countCopiesInArray(activeDeck.cards, card.id) : 0;
  const owned = getOwnedCopies(card.id);
  const marketEntry = getMarketEntry(card.id);
  const marketSaleQuote = getMarketSaleQuote(card.id);
  const activeDeckProfile = activeDeck ? analyzeDeck(activeDeck.cards) : null;
  const synergyReady = card.synergy && activeDeckProfile ? matchesSynergyCondition(activeDeckProfile, card.synergy.condition) : false;
  const managementLocked = isMatchSessionLocked();
  const faction = getFaction(card.faction);
  const factionVisual = getFactionVisual(card.faction);
  const typeVisual = getTypeVisual(card.type);
  const primaryEntries = buildCardPrimaryEntries(card);
  const supportEntries = buildCardSupportEntries(card, synergyReady);
  const overviewEntries = [
    {
      key: `faction:${card.faction}`,
      icon: factionVisual.symbol,
      tone: factionVisual.tone,
      label: faction.name,
      short: faction.name,
      copy: faction.name,
    },
    ...primaryEntries.filter((entry) => entry.key !== `solid:${card.id}`),
    ...supportEntries,
  ];

  elements.cardModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
  elements.cardModalContent.innerHTML = "";

  const preview = renderCard(card, { context: "modal" });
  const details = document.createElement("div");
  details.className = "modal-details";
  details.innerHTML = `
    <div class="detail-block span-all detail-block-hero">
      <p class="eyebrow">${getUiText("card.quickOverview")}</p>
      <h3>${card.name}</h3>
      <div class="deck-meta">
        <span class="meta-chip">${RarityLabel(card.rarity)}</span>
        <span class="meta-chip">${getTypeLabel(card.type)}</span>
        <span class="meta-chip">${faction.name}</span>
      </div>
      <div class="detail-overview-grid">
        <div class="detail-overview-card">
          <span class="detail-label">${getUiText("card.factionLabel")}</span>
          <div class="detail-overview-value">
            <span class="card-faction-icon tone-${factionVisual.tone}">${factionVisual.symbol}</span>
            <strong>${faction.name}</strong>
          </div>
        </div>
        <div class="detail-overview-card">
          <span class="detail-label">${getUiText("card.typeLabel")}</span>
          <div class="detail-overview-value">
            <span class="card-type-inline tone-${typeVisual.tone}">${typeVisual.symbol} ${getTypeLabel(card.type)}</span>
          </div>
        </div>
        <div class="detail-overview-card">
          <span class="detail-label">${getUiText("card.statsTitle")}</span>
          <div class="detail-stat-grid">
            <div class="detail-stat">
              <span>${getCurrentLanguage() === "fr" ? "Coût" : getCurrentLanguage() === "en" ? "Cost" : "Kosten"}</span>
              <strong>${card.cost}</strong>
            </div>
            <div class="detail-stat">
              <span>${getCurrentLanguage() === "fr" ? "Attaque" : getCurrentLanguage() === "en" ? "Attack" : "Angriff"}</span>
              <strong>${card.attack ?? "-"}</strong>
            </div>
            <div class="detail-stat">
              <span>${getCurrentLanguage() === "fr" ? "Vie" : getCurrentLanguage() === "en" ? "Health" : "Leben"}</span>
              <strong>${card.health ?? "-"}</strong>
            </div>
          </div>
        </div>
        <div class="detail-overview-card overview-wide">
          <span class="detail-label">${getUiText("card.effectBadges")}</span>
          <div class="card-effect-icons detail-effect-icons ${overviewEntries.length ? "" : "hidden"}">${buildEffectChipMarkup(overviewEntries, { limit: 8 })}</div>
          <p class="mini-note">${getUiText("card.effectIconsHelp")}</p>
        </div>
      </div>
    </div>
    <div class="detail-block">
      <h4>${getUiText("card.coreEffects")}</h4>
      ${buildCardDetailList(primaryEntries.filter((entry) => entry.key !== `solid:${card.id}`), getUiText("card.noCoreEffects"))}
    </div>
    <div class="detail-block">
      <h4>${getUiText("card.combatProfile")}</h4>
      ${buildCardDetailList(supportEntries, getUiText("card.noCoreEffects"))}
    </div>
    <div class="detail-block">
      <h4>${getUiText("card.ownershipMarket")}</h4>
      <div class="detail-stat-grid detail-stat-grid-wide">
        <div class="detail-stat">
          <span>${getUiText("card.owned")}</span>
          <strong>${owned}</strong>
        </div>
        <div class="detail-stat">
          <span>${getUiText("card.inActiveDeck")}</span>
          <strong>${inActiveDeck}</strong>
        </div>
        <div class="detail-stat">
          <span>${getUiText("card.vendorSell")}</span>
          <strong>${formatCurrency(RARITY_META[card.rarity].sellValue)}</strong>
        </div>
        <div class="detail-stat">
          <span>${getUiText("card.marketGross")}</span>
          <strong>${formatCurrency(marketSaleQuote.gross)}</strong>
        </div>
        <div class="detail-stat highlight">
          <span>${getUiText("card.marketPayout")}</span>
          <strong>${formatCurrency(marketSaleQuote.net)}</strong>
        </div>
        <div class="detail-stat">
          <span>${getUiText("card.marketBuy")}</span>
          <strong>${formatCurrency(marketEntry.buyPrice)}</strong>
        </div>
        <div class="detail-stat">
          <span>${getUiText("card.marketFee")}</span>
          <strong>${formatCurrency(marketSaleQuote.fee)}</strong>
        </div>
        <div class="detail-stat">
          <span>${getUiText("card.hourlyMove")}</span>
          <strong>${formatDelta(marketEntry.lastDeltaPct)}</strong>
        </div>
      </div>
    </div>
    <div class="detail-block">
      <h4>${getUiText("card.actions")}</h4>
      ${managementLocked ? `<p class="mini-note arena-lock-note">${getUiText("card.matchLockNote")}</p>` : ""}
      <div class="detail-action-shell" data-card-actions></div>
    </div>
    <div class="detail-block span-all">
      <h4>${getUiText("card.note")}</h4>
      <p>${getUiText("card.deckNote")}</p>
    </div>
  `;

  const localizedActionRow = details.querySelector("[data-card-actions]");
  localizedActionRow.className = "card-actions detail-action-shell";
  localizedActionRow.append(
    createActionButton(getUiText("card.sellOne"), () => sellCard(card.id, 1), managementLocked || owned < 1),
    createActionButton(getUiText("card.sellDupes"), () => sellCard(card.id, Math.max(0, owned - 1)), managementLocked || owned <= 1),
    createActionButton(getUiText("card.marketSellOne", { price: marketSaleQuote.net }), () => sellCardOnMarket(card.id, 1), managementLocked || owned < 1),
    createActionButton(getUiText("card.marketBuyOne"), () => buyCardOnMarket(card.id), managementLocked || getSave().gold < marketEntry.buyPrice),
    createActionButton(getUiText("card.sellAll"), () => sellCard(card.id, owned), managementLocked || owned < 1),
    createActionButton(getUiText("card.toDeck"), () => addCardToActiveDeck(card.id), managementLocked || !canAddCardToActiveDeck(card.id)),
  );

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
    restoreRuntimeMatchFromAccount(true);
  }

  saveDatabase();
  return database.accounts[username];
}

function getSelectedAdminAccount() {
  if (!isCurrentUserAdmin() || !uiState.adminSelectedUser) {
    return null;
  }

  const account = database.accounts[uiState.adminSelectedUser];
  return account ? normalizeAccount(account) : null;
}

async function createAdminAccount() {
  if (!isCurrentUserAdmin()) {
    return;
  }

  const { username, error: usernameError } = getPlayerNameValidationState(elements.adminCreateUsernameInput.value);
  const password = String(elements.adminCreatePasswordInput.value || "");

  if (usernameError) {
    showToast(getUiText(usernameError === "reserved" ? "messages.authReservedUsername" : "messages.adminCreateUsernameInvalid"));
    return;
  }

  if (password.length < 4) {
    showToast(getUiText("messages.adminCreatePasswordInvalid"));
    return;
  }

  if (isServerSessionActive()) {
    try {
      const response = await runServerAdminAction("createAccount", { username, password });
      uiState.adminSelectedUser = sanitizeUsername(response?.account?.username) || username;
      elements.adminCreateUsernameInput.value = "";
      elements.adminCreatePasswordInput.value = "";
      renderAll();
      showToast(getUiText("messages.adminCreated", { username: uiState.adminSelectedUser }));
    } catch (error) {
      showToast(error?.payload?.message || "Admin-Aktion fehlgeschlagen.");
    }
    return;
  }

  if (findStoredUsername(username)) {
    showToast(getUiText("messages.authUsernameTaken"));
    return;
  }

  try {
    database.accounts[username] = normalizeAccount({
      username,
      passwordHash: await createPasswordRecord(password),
      isAdmin: false,
      createdAt: new Date().toISOString(),
      save: createEmptySave(),
      sessionToken: null,
    });
    uiState.adminSelectedUser = username;
    elements.adminCreateUsernameInput.value = "";
    elements.adminCreatePasswordInput.value = "";
    saveDatabase();
    renderAll();
    showToast(getUiText("messages.adminCreated", { username }));
  } catch {
    showToast(getUiText("messages.authAccountCreateFailed"));
  }
}

async function grantGoldToSelectedAccount() {
  const selectedAccount = getSelectedAdminAccount();
  const amount = parsePositiveInteger(elements.adminGoldAmount.value);

  if (!selectedAccount) {
    showToast(getUiText("messages.adminSelectAccount"));
    return;
  }

  if (!amount) {
    showToast(getUiText("messages.adminGoldAmountInvalid"));
    return;
  }

  if (isServerSessionActive()) {
    try {
      await runServerAdminAction("grantGold", { username: selectedAccount.username, amount });
      renderAll();
      showToast(getUiText("messages.adminGoldGranted", { amount, username: selectedAccount.username }));
    } catch (error) {
      showToast(error?.payload?.message || "Admin-Aktion fehlgeschlagen.");
    }
    return;
  }

  updateStoredAccount(selectedAccount.username, (account) => {
    account.save.gold += amount;
  });
  renderAll();
  showToast(getUiText("messages.adminGoldGranted", { amount, username: selectedAccount.username }));
}

async function removeGoldFromSelectedAccount() {
  const selectedAccount = getSelectedAdminAccount();
  const amount = parsePositiveInteger(elements.adminGoldAmount.value);

  if (!selectedAccount) {
    showToast(getUiText("messages.adminSelectAccount"));
    return;
  }

  if (!amount) {
    showToast(getUiText("messages.adminGoldAmountInvalid"));
    return;
  }

  const removable = Math.min(amount, selectedAccount.save.gold);
  if (removable < 1) {
    showToast(getUiText("messages.adminNoRemovableGold", { username: selectedAccount.username }));
    return;
  }

  if (isServerSessionActive()) {
    try {
      await runServerAdminAction("removeGold", { username: selectedAccount.username, amount: removable });
      renderAll();
      showToast(getUiText("messages.adminGoldRemoved", { amount: removable, username: selectedAccount.username }));
    } catch (error) {
      showToast(error?.payload?.message || "Admin-Aktion fehlgeschlagen.");
    }
    return;
  }

  updateStoredAccount(selectedAccount.username, (account) => {
    account.save.gold = Math.max(0, account.save.gold - removable);
  });
  renderAll();
  showToast(getUiText("messages.adminGoldRemoved", { amount: removable, username: selectedAccount.username }));
}

async function grantPacksToSelectedAccount() {
  const selectedAccount = getSelectedAdminAccount();
  const amount = parsePositiveInteger(elements.adminPackAmount.value);
  const packId = elements.adminPackSelect.value;

  if (!selectedAccount) {
    showToast(getUiText("messages.adminSelectAccount"));
    return;
  }

  if (!PACK_DEFINITIONS[packId]) {
    showToast(getUiText("messages.adminPackUnavailable"));
    return;
  }

  if (!amount) {
    showToast(getUiText("messages.adminPackAmountInvalid"));
    return;
  }

  if (isServerSessionActive()) {
    try {
      await runServerAdminAction("grantPack", { username: selectedAccount.username, amount, packId });
      renderAll();
      showToast(getUiText("messages.adminPackGranted", { amount, pack: getPackLabel(packId), username: selectedAccount.username }));
    } catch (error) {
      showToast(error?.payload?.message || "Admin-Aktion fehlgeschlagen.");
    }
    return;
  }

  updateStoredAccount(selectedAccount.username, (account) => {
    account.save.packs[packId] = (account.save.packs[packId] || 0) + amount;
  });
  renderAll();
  showToast(getUiText("messages.adminPackGranted", { amount, pack: getPackLabel(packId), username: selectedAccount.username }));
}

async function removePacksFromSelectedAccount() {
  const selectedAccount = getSelectedAdminAccount();
  const amount = parsePositiveInteger(elements.adminPackAmount.value);
  const packId = elements.adminPackSelect.value;

  if (!selectedAccount) {
    showToast(getUiText("messages.adminSelectAccount"));
    return;
  }

  if (!PACK_DEFINITIONS[packId]) {
    showToast(getUiText("messages.adminPackUnavailable"));
    return;
  }

  if (!amount) {
    showToast(getUiText("messages.adminPackAmountInvalid"));
    return;
  }

  const owned = selectedAccount.save.packs[packId] || 0;
  const removable = Math.min(amount, owned);
  if (removable < 1) {
    showToast(getUiText("messages.adminPackNone", { username: selectedAccount.username }));
    return;
  }

  if (isServerSessionActive()) {
    try {
      await runServerAdminAction("removePack", { username: selectedAccount.username, amount: removable, packId });
      renderAll();
      showToast(getUiText("messages.adminPackRemoved", { amount: removable, pack: getPackLabel(packId), username: selectedAccount.username }));
    } catch (error) {
      showToast(error?.payload?.message || "Admin-Aktion fehlgeschlagen.");
    }
    return;
  }

  updateStoredAccount(selectedAccount.username, (account) => {
    account.save.packs[packId] = Math.max(0, (account.save.packs[packId] || 0) - removable);
  });
  renderAll();
  showToast(getUiText("messages.adminPackRemoved", { amount: removable, pack: getPackLabel(packId), username: selectedAccount.username }));
}

async function grantCardsToSelectedAccount() {
  const selectedAccount = getSelectedAdminAccount();
  const amount = parsePositiveInteger(elements.adminCardAmount.value);
  const cardId = elements.adminCardSelect.value;
  const card = getCard(cardId);

  if (!selectedAccount) {
    showToast(getUiText("messages.adminSelectAccount"));
    return;
  }

  if (!card) {
    showToast(getUiText("messages.adminCardMissing"));
    return;
  }

  if (!amount) {
    showToast(getUiText("messages.adminCardAmountInvalid"));
    return;
  }

  if (isServerSessionActive()) {
    try {
      await runServerAdminAction("grantCard", { username: selectedAccount.username, amount, cardId });
      renderAll();
      showToast(getUiText("messages.adminCardGranted", { amount, card: card.name, username: selectedAccount.username }));
    } catch (error) {
      showToast(error?.payload?.message || "Admin-Aktion fehlgeschlagen.");
    }
    return;
  }

  updateStoredAccount(selectedAccount.username, (account) => {
    account.save.collection[cardId] = (account.save.collection[cardId] || 0) + amount;
  });
  renderAll();
  showToast(getUiText("messages.adminCardGranted", { amount, card: card.name, username: selectedAccount.username }));
}

async function removeCardsFromSelectedAccount() {
  const selectedAccount = getSelectedAdminAccount();
  const amount = parsePositiveInteger(elements.adminCardAmount.value);
  const cardId = elements.adminCardSelect.value;
  const card = getCard(cardId);

  if (!selectedAccount) {
    showToast(getUiText("messages.adminSelectAccount"));
    return;
  }

  if (!card) {
    showToast(getUiText("messages.adminCardMissing"));
    return;
  }

  if (!amount) {
    showToast(getUiText("messages.adminCardAmountInvalid"));
    return;
  }

  const owned = selectedAccount.save.collection[cardId] || 0;
  const removable = Math.min(amount, owned);
  if (removable < 1) {
    showToast(getUiText("messages.adminCardNone", { username: selectedAccount.username }));
    return;
  }

  if (isServerSessionActive()) {
    try {
      await runServerAdminAction("removeCard", { username: selectedAccount.username, amount: removable, cardId });
      renderAll();
      showToast(getUiText("messages.adminCardRemoved", { amount: removable, card: card.name, username: selectedAccount.username }));
    } catch (error) {
      showToast(error?.payload?.message || "Admin-Aktion fehlgeschlagen.");
    }
    return;
  }

  updateStoredAccount(selectedAccount.username, (account) => {
    account.save.collection[cardId] = Math.max(0, (account.save.collection[cardId] || 0) - removable);
    if (account.save.collection[cardId] === 0) {
      delete account.save.collection[cardId];
    }
  });
  renderAll();
  showToast(getUiText("messages.adminCardRemoved", { amount: removable, card: card.name, username: selectedAccount.username }));
}

async function deleteSelectedAccount() {
  const selectedAccount = getSelectedAdminAccount();

  if (!selectedAccount) {
    showToast(getUiText("messages.adminSelectAccount"));
    return;
  }

  if (isAccountDeletionProtected(selectedAccount)) {
    showToast(getUiText("messages.adminProtected"));
    return;
  }

  if (!requestActionConfirmation(getUiText("messages.adminDeleteConfirm", { username: selectedAccount.username }), { force: true })) {
    return;
  }

  if (isServerSessionActive()) {
    try {
      await runServerAdminAction("deleteAccount", { username: selectedAccount.username });
      uiState.adminSelectedUser = null;
      uiState.adminCacheDirty = true;
      await refreshServerAdminMirror({ render: false });
      renderAll();
      showToast(getUiText("messages.adminDeleted", { username: selectedAccount.username }));
    } catch (error) {
      showToast(error?.payload?.message || "Admin-Aktion fehlgeschlagen.");
    }
    return;
  }

  delete database.accounts[selectedAccount.username];
  uiState.adminSelectedUser = Object.values(database.accounts)
    .map((account) => normalizeAccount(account))
    .find((account) => !account.isAdmin)?.username || ADMIN_BOOTSTRAP.username;
  saveDatabase();
  renderAll();
  showToast(getUiText("messages.adminDeleted", { username: selectedAccount.username }));
}

function createPackCard(packId, context) {
  const pack = PACK_DEFINITIONS[packId];
  const element = elements.packTemplate.content.firstElementChild.cloneNode(true);
  const save = getSave();
  const packEntryPrice = context === "shop" ? pack.price : save.packs[packId];
  const odds = ["rare", "epic", "legendary", "ultra", "mythic", "transcendent", "singular"]
    .map((rarity) => `<div class="odds-row"><span>${RarityLabel(rarity)}</span><strong>${pack.odds[rarity]}%</strong></div>`)
    .join("");

  element.classList.add(`pack-${pack.id}`, context === "shop" ? "pack-card-shop" : "pack-card-owned");
  element.dataset.packId = pack.id;
  if (context === "owned") {
    element.classList.add("clickable-card");
    element.classList.toggle("is-selected", save.selectedPack === packId);
    element.tabIndex = 0;
    element.setAttribute("role", "button");
    element.setAttribute("aria-label", `${getPackLabel(pack.id)} ${getUiText("common.select")}`);
    const previewPack = () => selectPack(packId);
    element.addEventListener("click", (event) => {
      if (event.target.closest("button")) {
        return;
      }
      previewPack();
    });
    element.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      previewPack();
    });
  }
  element.querySelector(".pack-kicker").textContent = getPackTier(pack.id);
  element.querySelector(".pack-price").textContent = context === "shop"
    ? formatCurrency(pack.price)
    : getUiText("booster.ownedCount", { count: packEntryPrice });
  element.querySelector(".pack-copy").textContent = getPackDescription(pack.id);
  element.querySelector(".pack-name").textContent = getPackLabel(pack.id);
  element.querySelector(".pack-odds").innerHTML = odds;

  const actions = element.querySelector(".pack-actions");

  if (context === "shop") {
    actions.append(createActionButton(getUiText("common.buy"), () => buyPack(packId), getSave().gold < pack.price));
  } else {
    actions.append(createActionButton(getUiText("common.open"), () => openPack(packId), getSave().packs[packId] < 1));
  }

  return element;
}

function createShopBundleCard(bundleId) {
  const bundle = SHOP_BUNDLE_DEFINITIONS[bundleId];
  const element = elements.packTemplate.content.firstElementChild.cloneNode(true);
  const guaranteedMarkup = bundle.guaranteedCards
    .map(({ cardId, amount }) => {
      const card = getCard(cardId);
      if (!card) {
        return "";
      }
      return `
        <li>
          <div>
            <strong>${card.name}</strong>
            <small>${getRarityLabel(card.rarity)} · ${getTypeLabel(card.type)}</small>
          </div>
          <span>${amount}×</span>
        </li>
      `;
    })
    .filter(Boolean)
    .join("");
  const boosterMarkup = bundle.includedBoosters
    .map(({ packId, amount }) => `
      <li>
        <div>
          <strong>${getPackLabel(packId)}</strong>
          <small>${getPackTier(packId)}</small>
        </div>
        <span>${amount}×</span>
      </li>
    `)
    .join("");
  const guaranteedCount = bundle.guaranteedCards.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const boosterCount = bundle.includedBoosters.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const faction = getFaction(bundle.factionId);

  element.classList.add("pack-bundle-card", `bundle-tier-${bundle.tierId}`);
  element.dataset.bundleId = bundle.id;
  element.querySelector(".pack-kicker").textContent = faction.name;
  element.querySelector(".pack-price").textContent = formatCurrency(bundle.price);
  element.querySelector(".pack-copy").textContent = getShopBundleDescription(bundle);
  element.querySelector(".pack-name").textContent = getShopBundleLabel(bundle);
  element.querySelector(".pack-odds").innerHTML = `
    <div class="bundle-summary-row">
      <div class="bundle-summary-pill">
        <span>${getUiText("shop.summaryGuaranteed")}</span>
        <strong>${getUiText("shop.bundleCardsCount", { count: guaranteedCount })}</strong>
      </div>
      <div class="bundle-summary-pill">
        <span>${getUiText("shop.summaryBoosters")}</span>
        <strong>${getUiText("shop.bundleBoostersCount", { count: boosterCount })}</strong>
      </div>
    </div>
    <div class="bundle-group">
      <div class="bundle-group-head">
        <p class="eyebrow">${getUiText("shop.bundleGuaranteed")}</p>
        <span class="bundle-group-count">${guaranteedCount}</span>
      </div>
      <ul class="bundle-list">${guaranteedMarkup}</ul>
    </div>
    <div class="bundle-group">
      <div class="bundle-group-head">
        <p class="eyebrow">${getUiText("shop.bundleBoosters")}</p>
        <span class="bundle-group-count">${boosterCount}</span>
      </div>
      <ul class="bundle-list">${boosterMarkup}</ul>
    </div>
  `;

  const actions = element.querySelector(".pack-actions");
  actions.append(createActionButton(getUiText("shop.bundleBuy"), () => buyShopBundle(bundleId), getSave().gold < bundle.price));

  const delivery = document.createElement("p");
  delivery.className = "mini-note";
  delivery.textContent = getUiText("shop.bundleDelivery");
  actions.after(delivery);

  return element;
}

function describeLocalizedEffect(type, effect, index = 0) {
  const opener = index === 0 ? (type === "unit" ? getUiText("card.onPlay") : getUiText("card.effect")) : getUiText("card.also");
  const turnWord = (turns) => {
    if (getCurrentLanguage() === "fr") {
      return turns > 1 ? `${turns} tours` : `${turns} tour`;
    }
    if (getCurrentLanguage() === "en") {
      return turns > 1 ? `${turns} turns` : `${turns} turn`;
    }
    return turns > 1 ? `${turns} Runden` : `${turns} Runde`;
  };

  switch (effect?.kind) {
    case "damageHero":
      return getCurrentLanguage() === "fr"
        ? `${opener} : inflige ${effect.value} dégâts directs au héros adverse.`
        : getCurrentLanguage() === "en"
          ? `${opener}: Deal ${effect.value} direct damage to the enemy hero.`
          : `${opener}: Verursacht ${effect.value} direkten Schaden am gegnerischen Helden.`;
    case "healHero":
      return getCurrentLanguage() === "fr"
        ? `${opener} : soigne ton héros de ${effect.value}.`
        : getCurrentLanguage() === "en"
          ? `${opener}: Heal your hero for ${effect.value}.`
          : `${opener}: Heilt deinen Helden um ${effect.value}.`;
    case "draw":
      return getCurrentLanguage() === "fr"
        ? `${opener} : pioche ${effect.value} carte${effect.value > 1 ? "s" : ""}.`
        : getCurrentLanguage() === "en"
          ? `${opener}: Draw ${effect.value} card${effect.value > 1 ? "s" : ""}.`
          : `${opener}: Ziehe ${effect.value} Karte${effect.value > 1 ? "n" : ""}.`;
    case "gainMana":
      return getCurrentLanguage() === "fr"
        ? `${opener} : gagne immédiatement ${effect.value} mana supplémentaire.`
        : getCurrentLanguage() === "en"
          ? `${opener}: Gain ${effect.value} extra mana immediately.`
          : `${opener}: Erhalte sofort ${effect.value} zusätzliches Mana.`;
    case "gainMaxMana":
      return getCurrentLanguage() === "fr"
        ? `${opener} : augmente durablement ton mana maximum de ${effect.value}.`
        : getCurrentLanguage() === "en"
          ? `${opener}: Permanently increase your maximum mana by ${effect.value}.`
          : `${opener}: Erhöhe dein maximales Mana dauerhaft um ${effect.value}.`;
    case "buffBoard":
      return getCurrentLanguage() === "fr"
        ? `${opener} : tes unités gagnent +${effect.attack}/+${effect.health}.`
        : getCurrentLanguage() === "en"
          ? `${opener}: Your units gain +${effect.attack}/+${effect.health}.`
          : `${opener}: Deine Einheiten erhalten +${effect.attack}/+${effect.health}.`;
    case "fortifyBoard":
      return getCurrentLanguage() === "fr"
        ? `${opener} : ton héros et toutes tes unités gagnent +${effect.value} en endurance.`
        : getCurrentLanguage() === "en"
          ? `${opener}: Your hero and all allied units gain +${effect.value} durability.`
          : `${opener}: Dein Held und alle eigenen Einheiten erhalten +${effect.value} Haltbarkeit.`;
    case "healBoard":
      return getCurrentLanguage() === "fr"
        ? `${opener} : soigne ton héros et toutes tes unités de ${effect.value}.`
        : getCurrentLanguage() === "en"
          ? `${opener}: Heal your hero and all allied units for ${effect.value}.`
          : `${opener}: Heilt deinen Helden und alle eigenen Einheiten um ${effect.value}.`;
    case "strikeWeakest":
      return getCurrentLanguage() === "fr"
        ? `${opener} : frappe l'unité adverse la plus faible ou le héros pour ${effect.value}.`
        : getCurrentLanguage() === "en"
          ? `${opener}: Hit the weakest enemy unit or the hero for ${effect.value}.`
          : `${opener}: Trifft die schwächste gegnerische Einheit oder den Helden für ${effect.value}.`;
    case "damageAllEnemies":
      return getCurrentLanguage() === "fr"
        ? `${opener} : inflige ${effect.value} dégâts à toutes les unités adverses.`
        : getCurrentLanguage() === "en"
          ? `${opener}: Deal ${effect.value} damage to all enemy units.`
          : `${opener}: Verursacht ${effect.value} Schaden an allen gegnerischen Einheiten.`;
    case "burnWeakest":
      return getCurrentLanguage() === "fr"
        ? `${opener} : applique Brûlure à l'unité adverse la plus faible pendant ${turnWord(effect.turns)} (${effect.value} dégâts par tour).`
        : getCurrentLanguage() === "en"
          ? `${opener}: Burn the weakest enemy unit for ${turnWord(effect.turns)} (${effect.value} damage per turn).`
          : `${opener}: Belegt die schwächste gegnerische Einheit ${turnWord(effect.turns)} lang mit Brand (${effect.value} Schaden pro Zug).`;
    case "freezeWeakest":
      return getCurrentLanguage() === "fr"
        ? `${opener} : gèle l'unité adverse la plus faible pendant ${turnWord(effect.turns)}.`
        : getCurrentLanguage() === "en"
          ? `${opener}: Freeze the weakest enemy unit for ${turnWord(effect.turns)}.`
          : `${opener}: Friert die schwächste gegnerische Einheit für ${turnWord(effect.turns)} ein.`;
    case "poisonWeakest":
      return getCurrentLanguage() === "fr"
        ? `${opener} : empoisonne l'unité adverse la plus faible pendant ${turnWord(effect.turns)} (${effect.value} dégâts en fin de tour).`
        : getCurrentLanguage() === "en"
          ? `${opener}: Poison the weakest enemy unit for ${turnWord(effect.turns)} (${effect.value} end-step damage).`
          : `${opener}: Vergiftet die schwächste gegnerische Einheit für ${turnWord(effect.turns)} (${effect.value} Schaden am Zugende).`;
    case "barrierStrongest":
      return getCurrentLanguage() === "fr"
        ? `${opener} : donne une barrière à ton unité la plus forte contre le prochain dégât.`
        : getCurrentLanguage() === "en"
          ? `${opener}: Give your strongest unit a barrier against the next damage.`
          : `${opener}: Gibt deiner stärksten Einheit eine Barriere gegen den nächsten Schaden.`;
    case "barrierHero":
      return getCurrentLanguage() === "fr"
        ? `${opener} : donne ${effect.value} bouclier à ton héros.`
        : getCurrentLanguage() === "en"
          ? `${opener}: Give your hero ${effect.value} shield.`
          : `${opener}: Gibt deinem Helden ${effect.value} Schild.`;
    case "summonTokens": {
      const token = TOKEN_CARD_MAP.get(effect.tokenId);
      return getCurrentLanguage() === "fr"
        ? `${opener} : invoque ${effect.amount}× ${token ? token.name : "Jeton"}.`
        : getCurrentLanguage() === "en"
          ? `${opener}: Summon ${effect.amount}× ${token ? token.name : "Token"}.`
          : `${opener}: Beschwört ${effect.amount}× ${token ? token.name : "Token"}.`;
    }
    case "weakenEnemies":
      return getCurrentLanguage() === "fr"
        ? `${opener} : réduit l'attaque de toutes les unités adverses de ${effect.value}.`
        : getCurrentLanguage() === "en"
          ? `${opener}: Reduce the attack of all enemy units by ${effect.value}.`
          : `${opener}: Verringert den Angriff aller gegnerischen Einheiten um ${effect.value}.`;
    case "drainHero":
      return getCurrentLanguage() === "fr"
        ? `${opener} : draine ${effect.damage} points de vie du héros adverse et te soigne de ${effect.heal}.`
        : getCurrentLanguage() === "en"
          ? `${opener}: Drain ${effect.damage} life from the enemy hero and heal ${effect.heal}.`
          : `${opener}: Entzieht dem gegnerischen Helden ${effect.damage} Leben und heilt dich um ${effect.heal}.`;
    case "readyStrongest":
      return getCurrentLanguage() === "fr"
        ? `${opener} : rend ton unité la plus forte immédiatement prête à attaquer${effect.attackBonus ? ` et lui donne +${effect.attackBonus} attaque` : ""}.`
        : getCurrentLanguage() === "en"
          ? `${opener}: Make your strongest unit immediately ready to attack${effect.attackBonus ? ` and give it +${effect.attackBonus} attack` : ""}.`
          : `${opener}: Macht deine stärkste Einheit sofort angreifbar${effect.attackBonus ? ` und gibt ihr +${effect.attackBonus} Angriff` : ""}.`;
    case "empowerUnit":
      return getCurrentLanguage() === "fr"
        ? `${opener} : renforce ta dernière unité jouée de +${effect.attack}/+${effect.health}.`
        : getCurrentLanguage() === "en"
          ? `${opener}: Empower your last played unit by +${effect.attack}/+${effect.health}.`
          : `${opener}: Verstärkt deine zuletzt ausgespielte Einheit um +${effect.attack}/+${effect.health}.`;
    default:
      return getUiText("card.unknownEffect");
  }
}

function getLocalizedCardDescription(card) {
  const effects = normalizeEffectList(card.effect);
  const parts = effects.length
    ? effects.map((effect, index) => describeLocalizedEffect(card.type, effect, index))
    : [card.isToken ? getUiText("card.tokenUnit") : getUiText("card.solid")];

  if (card.keywords?.length) {
    parts.push(getUiText("card.keywordPrefix", { value: card.keywords.map((keyword) => getKeywordLabel(keyword)).join(", ") }));
  }
  if (card.synergy) {
    parts.push(getUiText("card.synergyPrefix", { value: describeSynergyCondition(card.synergy.condition) }));
  }
  if (card.timing) {
    parts.push(getUiText("card.timingPrefix", { value: describeTiming(card.timing) }));
  }
  if (card.deathEffect) {
    parts.push(getUiText("card.deathPrefix", { value: describeLocalizedEffect(card.type, card.deathEffect, 0).replace(`${getUiText("card.onPlay")}: `, "").replace(`${getUiText("card.effect")}: `, "") }));
  }
  return parts.join(" ");
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
  const keywords = [...(stats.keywords || card.keywords || [])];
  const faction = getFaction(card.faction);
  const factionVisual = getFactionVisual(card.faction);
  const typeVisual = getTypeVisual(card.type);

  element.classList.add(`card-${card.rarity}`, `faction-${card.faction}`, "clickable-card");
  element.dataset.context = context;
  element.addEventListener("click", () => openCardModal(card.id));
  element.querySelector(".card-type-badge").textContent = `${typeVisual.symbol} ${getTypeLabel(card.type)}`;
  element.querySelector(".card-owned").textContent = card.isToken ? (getCurrentLanguage() === "fr" ? "Jeton" : "Token") : `${getOwnedCopies(card.id)}×`;
  element.querySelector(".card-name").textContent = card.name;
  element.querySelector(".card-faction").textContent = faction.name;
  element.querySelector(".card-faction-icon").textContent = factionVisual.symbol;
  element.querySelector(".card-faction-icon").className = `card-faction-icon tone-${factionVisual.tone}`;
  element.querySelector(".card-faction-pill").textContent = faction.name;
  element.querySelector(".card-type-inline").textContent = `${typeVisual.symbol} ${getTypeLabel(card.type)}`;
  element.querySelector(".card-type-inline").className = `card-type-inline tone-${typeVisual.tone}`;
  element.querySelector(".card-rarity").textContent = RarityLabel(card.rarity);
  element.querySelector(".card-rarity").classList.add(`rarity-${card.rarity}`);
  const keywordRow = element.querySelector(".card-keywords");
  keywordRow.classList.toggle("hidden", !keywords.length);
  keywordRow.innerHTML = keywords.length ? buildKeywordMarkup(keywords) : "";
  element.querySelector(".card-summary-list").innerHTML = buildCardSummaryMarkup(card, context === "modal" ? 4 : 3);
  const footerNote = element.querySelector(".card-footer-note");
  footerNote.classList.toggle("hidden", !footer);
  footerNote.textContent = footer;
  element.querySelector(".card-cost").textContent = getUiText("card.cost", { value: card.cost });
  element.querySelector(".card-attack").textContent = getUiText("card.attack", { value: stats.attack ?? "-" });
  element.querySelector(".card-health").textContent = getUiText("card.health", { value: stats.health ?? "-" });

  const actions = element.querySelector(".card-actions");
  buttons.forEach((button) => {
    actions.append(createActionButton(button.label, button.handler, button.disabled));
  });

  if (!buttons.length && (context === "collection" || context === "opened")) {
    actions.append(createActionButton(getCurrentLanguage() === "fr" ? "Détails" : getCurrentLanguage() === "en" ? "Details" : "Details", () => openCardModal(card.id)));
  }

  return element;
}

function buildKeywordMarkup(keywords) {
  return keywords.map((keyword) => {
    const visual = getKeywordVisual(keyword);
    return `
      <span class="keyword-chip tone-${visual.tone}" title="${escapeHtml(getKeywordText(keyword))}">
        <span class="chip-icon">${escapeHtml(visual.symbol)}</span>
        <span class="chip-label">${escapeHtml(getKeywordLabel(keyword))}</span>
      </span>
    `;
  }).join("");
}

function buildKeywordDetailText(keywords) {
  return keywords.map((keyword) => `${getKeywordLabel(keyword)}: ${getKeywordText(keyword)}`).join(" ");
}

function analyzeDeck(cardIds) {
  const cards = cardIds.map((cardId) => getCard(cardId)).filter(Boolean);
  const profile = {
    factions: {},
    types: {},
    rarities: {},
    keywords: {},
    tags: {},
    highCostCount: 0,
    keywordCount: 0,
    synergyCardCount: 0,
    deathEffectCount: 0,
    eliteCount: 0,
    powerScore: 0,
  };

  const rarityWeights = {
    common: 1.1,
    rare: 2.1,
    epic: 4.1,
    legendary: 7.2,
    ultra: 10.5,
    mythic: 14.2,
    transcendent: 19,
    singular: 26.5,
  };

  cards.forEach((card) => {
    profile.factions[card.faction] = (profile.factions[card.faction] || 0) + 1;
    profile.types[card.type] = (profile.types[card.type] || 0) + 1;
    profile.rarities[card.rarity] = (profile.rarities[card.rarity] || 0) + 1;
    if (card.cost >= 6) {
      profile.highCostCount += 1;
    }

    (card.keywords || []).forEach((keyword) => {
      profile.keywords[keyword] = (profile.keywords[keyword] || 0) + 1;
    });
    profile.keywordCount += (card.keywords || []).length;

    if (card.synergy) {
      profile.synergyCardCount += 1;
    }

    if (card.deathEffect) {
      profile.deathEffectCount += 1;
    }

    if (["legendary", "ultra", "mythic", "transcendent", "singular"].includes(card.rarity)) {
      profile.eliteCount += 1;
    }

    getCardTags(card).forEach((tag) => {
      profile.tags[tag] = (profile.tags[tag] || 0) + 1;
    });

    profile.powerScore += (rarityWeights[card.rarity] || 1)
      + (card.cost || 0) * 0.72
      + (Number(card.attack) || 0) * 0.28
      + (Number(card.health) || 0) * 0.18
      + normalizeEffectList(card.effect).length * 0.72
      + (card.keywords?.length || 0) * 0.62
      + (card.synergy ? 0.95 : 0)
      + (card.deathEffect ? 0.8 : 0);
  });

  profile.diverseFactionCount = Object.keys(profile.factions).length;
  profile.raritySpread = Object.keys(profile.rarities).length;
  profile.powerScore = Number((profile.powerScore + profile.raritySpread * 1.9 + profile.highCostCount * 0.8).toFixed(1));
  profile.recommendedDifficultyId = getRecommendedArenaDifficultyId(profile);
  return profile;
}

function getCardTags(card) {
  const tags = [...getSynergyTagPool(card.name)];

  if (card.type === "trainer") {
    tags.push("trainer");
  }

  if (card.type === "spell") {
    tags.push("zauber");
  }

  return uniqueValues(tags);
}

function getCardPlayRestriction(card, owner) {
  const match = uiState.match;

  if (!match || !card) {
    return "";
  }

  if (card.timing?.unlockTurn && match.turn < card.timing.unlockTurn) {
    return getCurrentLanguage() === "fr"
      ? `À partir du tour ${card.timing.unlockTurn}`
      : getCurrentLanguage() === "en"
        ? `From round ${card.timing.unlockTurn}`
        : `Erst ab Runde ${card.timing.unlockTurn}`;
  }

  const cooldown = match[owner]?.cooldowns?.[card.id] || 0;
  if (cooldown > 0) {
    return getCurrentLanguage() === "fr"
      ? `Recharge ${cooldown}`
      : getCurrentLanguage() === "en"
        ? `Cooldown ${cooldown}`
        : `Abklingzeit ${cooldown}`;
  }

  return "";
}

function getActiveCardSynergy(card, owner) {
  if (!card?.synergy || !uiState.match) {
    return null;
  }

  return matchesSynergyCondition(uiState.match[owner].deckProfile, card.synergy.condition) ? card.synergy : null;
}

function getSynergyStatusText(card, owner) {
  if (!card?.synergy || !uiState.match) {
    return "";
  }

  return matchesSynergyCondition(uiState.match[owner].deckProfile, card.synergy.condition)
    ? `${getCurrentLanguage() === "fr" ? "Synergie active" : getCurrentLanguage() === "en" ? "Synergy active" : "Synergie aktiv"}: ${describeSynergyCondition(card.synergy.condition)}`
    : `${getCurrentLanguage() === "fr" ? "Synergie" : getCurrentLanguage() === "en" ? "Synergy" : "Synergie"}: ${describeSynergyCondition(card.synergy.condition)}`;
}

function matchesSynergyCondition(profile, condition) {
  switch (condition.kind) {
    case "partnerFaction":
      return (profile.factions[condition.faction] || 0) >= condition.min;
    case "typeCount":
      return (profile.types[condition.cardType] || 0) >= condition.min;
    case "raritySpread":
      return profile.raritySpread >= condition.min;
    case "highCostCount":
      return profile.highCostCount >= condition.min;
    case "keywordCount":
      return (profile.keywords[condition.keyword] || 0) >= condition.min;
    case "tagCount":
      return (profile.tags[condition.tag] || 0) >= condition.min;
    case "diverseFactions":
    default:
      return profile.diverseFactionCount >= condition.min;
  }
}

function describeSynergyCondition(condition) {
  if (getCurrentLanguage() === "en") {
    switch (condition.kind) {
      case "partnerFaction":
        return `at least ${condition.min} cards from ${getFaction(condition.faction).name} in the deck`;
      case "typeCount":
        return `at least ${condition.min} ${condition.cardType === "unit" ? "units" : condition.cardType === "spell" ? "spells" : "trainers"} in the deck`;
      case "raritySpread":
        return `at least ${condition.min} different rarities in the deck`;
      case "highCostCount":
        return `at least ${condition.min} expensive cards with cost 6+ in the deck`;
      case "keywordCount":
        return `at least ${condition.min} cards with ${getKeywordLabel(condition.keyword)}`;
      case "tagCount":
        return `at least ${condition.min} ${condition.tag} cards in the deck`;
      case "diverseFactions":
      default:
        return `at least ${condition.min} factions in the deck`;
    }
  }

  if (getCurrentLanguage() === "fr") {
    switch (condition.kind) {
      case "partnerFaction":
        return `au moins ${condition.min} cartes de ${getFaction(condition.faction).name} dans le deck`;
      case "typeCount":
        return `au moins ${condition.min} ${condition.cardType === "unit" ? "unités" : condition.cardType === "spell" ? "sorts" : "entraîneurs"} dans le deck`;
      case "raritySpread":
        return `au moins ${condition.min} raretés différentes dans le deck`;
      case "highCostCount":
        return `au moins ${condition.min} cartes chères de coût 6+ dans le deck`;
      case "keywordCount":
        return `au moins ${condition.min} cartes avec ${getKeywordLabel(condition.keyword)}`;
      case "tagCount":
        return `au moins ${condition.min} cartes de type ${condition.tag} dans le deck`;
      case "diverseFactions":
      default:
        return `au moins ${condition.min} factions dans le deck`;
    }
  }

  const typePlural = {
    unit: "Einheiten",
    spell: "Zauber",
    trainer: "Trainer",
  };
  const tagLabels = {
    gelehrte: "Gelehrten",
    hüter: "Hüter",
    jäger: "Jäger",
    führer: "Führungs",
    rituale: "Ritual",
    trainer: "Trainer",
    zauber: "Zauber",
  };

  switch (condition.kind) {
    case "partnerFaction":
      return `mindestens ${condition.min} Karten aus ${getFaction(condition.faction).name} im Deck`;
    case "typeCount":
      return `mindestens ${condition.min} ${typePlural[condition.cardType]} im Deck`;
    case "raritySpread":
      return `mindestens ${condition.min} verschiedene Seltenheiten im Deck`;
    case "highCostCount":
      return `mindestens ${condition.min} teure Karten mit Kosten 6+ im Deck`;
    case "keywordCount":
      return `mindestens ${condition.min} Karten mit ${KEYWORD_META[condition.keyword].label}`;
    case "tagCount":
      return `mindestens ${condition.min} ${tagLabels[condition.tag] || condition.tag}-Karten im Deck`;
    case "diverseFactions":
    default:
      return `mindestens ${condition.min} Fraktionen im Deck`;
  }
}

function describeTiming(timing) {
  if (!timing) {
    return "";
  }

  const parts = [];
  if (timing.unlockTurn) {
    parts.push(getCurrentLanguage() === "fr" ? `à partir du tour ${timing.unlockTurn}` : getCurrentLanguage() === "en" ? `from round ${timing.unlockTurn}` : `erst ab Runde ${timing.unlockTurn}`);
  }
  if (timing.cooldown) {
    parts.push(getCurrentLanguage() === "fr"
      ? `${timing.cooldown} tour${timing.cooldown > 1 ? "s" : ""} de recharge`
      : getCurrentLanguage() === "en"
        ? `${timing.cooldown} turn${timing.cooldown > 1 ? "s" : ""} cooldown`
        : `${timing.cooldown} Runde${timing.cooldown > 1 ? "n" : ""} Abklingzeit`);
  }
  return parts.join(", ");
}

function buildUnitStateFooter(unit, baseText) {
  const statusText = buildStatusSummary(unit.statuses || []);
  return statusText ? `${baseText} · ${statusText}` : baseText;
}

function buildStatusSummary(statuses) {
  if (!statuses.length) {
    return "";
  }

  return statuses.map((status) => {
    if (status.kind === "barrier") {
      return STATUS_META.barrier.label;
    }

    if (status.turns) {
      return `${STATUS_META[status.kind].label} ${status.turns}`;
    }

    return STATUS_META[status.kind].label;
  }).join(" · ");
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

  if (isMatchSessionLocked()) {
    showToast(getUiText("messages.matchCollectionLocked"));
    return;
  }

  if (!pack) {
    showToast("Dieses Booster existiert nicht.");
    return;
  }

  if (save.gold < pack.price) {
    showToast("Dafür reicht dein Gold nicht.");
    return;
  }

  save.gold -= pack.price;
  save.packs[packId] = (save.packs[packId] || 0) + 1;
  persistCurrentAccount();
  renderAll();
  showToast(getUiText("booster.packBought", { pack: getPackLabel(packId) }));
}

function buyShopBundle(bundleId) {
  const save = getSave();
  const bundle = SHOP_BUNDLE_DEFINITIONS[bundleId];

  if (isMatchSessionLocked()) {
    showToast(getUiText("messages.matchCollectionLocked"));
    return;
  }

  if (!bundle) {
    showToast(getUiText("shop.bundleUnavailable"));
    return;
  }

  if (save.gold < bundle.price) {
    showToast(getUiText("shop.bundleNoGold"));
    return;
  }

  save.gold -= bundle.price;
  bundle.guaranteedCards.forEach(({ cardId, amount }) => {
    if (!CARD_MAP.has(cardId)) {
      return;
    }
    save.collection[cardId] = (save.collection[cardId] || 0) + Math.max(1, Number(amount || 1));
  });
  bundle.includedBoosters.forEach(({ packId, amount }) => {
    if (!PACK_DEFINITIONS[packId]) {
      return;
    }
    save.packs[packId] = (save.packs[packId] || 0) + Math.max(1, Number(amount || 1));
  });

  persistCurrentAccount();
  renderAll();
  showToast(getUiText("shop.bundleBought", { bundle: getShopBundleLabel(bundle) }));
}

function selectPack(packId) {
  getSave().selectedPack = packId;
  persistCurrentAccount();
  renderBoosterLab();
}

function openPack(packId) {
  const save = getSave();
  const pack = PACK_DEFINITIONS[packId];
  const progression = getProgression();

  if (!pack) {
    showToast("Dieses Booster ist ungültig.");
    return;
  }

  if (save.packs[packId] < 1) {
    showToast("Dieses Booster ist gerade nicht im Besitz.");
    return;
  }

  const cards = generatePack(packId).filter(Boolean);

  if (cards.length !== 5) {
    showToast("Dieses Booster konnte nicht sicher generiert werden.");
    return;
  }

  save.packs[packId] -= 1;
  save.selectedPack = packId;

  cards.forEach((card) => {
    save.collection[card.id] = (save.collection[card.id] || 0) + 1;
  });

  const pityState = progression.pity[packId] || createDefaultPityState();
  const hitEpic = cards.some((card) => RARITY_ORDER.indexOf(card.rarity) >= RARITY_ORDER.indexOf("epic"));
  const hitLegendary = cards.some((card) => RARITY_ORDER.indexOf(card.rarity) >= RARITY_ORDER.indexOf("legendary"));
  progression.pity[packId] = {
    epicDry: hitEpic ? 0 : pityState.epicDry + 1,
    legendaryDry: hitLegendary ? 0 : pityState.legendaryDry + 1,
  };
  trackProgressStat("boostersOpened", 1);
  trackProgressStat("cardsOpened", cards.length);
  trackProgressStat("legendaryPlusPulled", cards.filter((card) => RARITY_ORDER.indexOf(card.rarity) >= RARITY_ORDER.indexOf("legendary")).length);

  save.lastOpened = {
    packId,
    cards: cards.map((card) => card.id),
    openedAt: new Date().toISOString(),
  };

  persistCurrentAccount();
  renderAll();
  playPackOpeningSequence(cards, packId);
  showToast(getUiText("booster.packOpened", { pack: getPackLabel(packId) }));
}

function generatePack(packId) {
  const pack = PACK_DEFINITIONS[packId];
  const pityState = getProgression().pity[packId] || createDefaultPityState();

  if (!pack) {
    return [];
  }

  const cards = [];

  for (let slot = 0; slot < 5; slot += 1) {
    const minimum = slot === 4 ? pack.guaranteed : "common";
    const rarity = rollRarity(pack.odds, minimum, pityState);
    cards.push(drawCardByRarity(rarity));
  }

  return cards;
}

function rollRarity(weights, minimumRarity, pityState = createDefaultPityState()) {
  const minIndex = RARITY_ORDER.indexOf(minimumRarity);
  const eligibleRarities = RARITY_ORDER.slice(minIndex);
  const adjustedWeights = {};
  const epicBonus = Math.min(14, Math.max(0, pityState.epicDry) * 0.85);
  const legendaryBonus = Math.min(8, Math.max(0, pityState.legendaryDry - 4) * 0.55);
  eligibleRarities.forEach((rarity) => {
    let weight = weights[rarity];
    if (["epic", "legendary", "ultra", "mythic", "transcendent", "singular"].includes(rarity)) {
      weight += epicBonus;
    }
    if (["legendary", "ultra", "mythic", "transcendent", "singular"].includes(rarity)) {
      weight += legendaryBonus;
    }
    adjustedWeights[rarity] = weight;
  });
  const total = eligibleRarities.reduce((sum, rarity) => sum + adjustedWeights[rarity], 0);
  let roll = Math.random() * total;

  for (const rarity of eligibleRarities) {
    roll -= adjustedWeights[rarity];
    if (roll <= 0) {
      return rarity;
    }
  }

  return eligibleRarities[0];
}

function drawCardByRarity(rarity) {
  const pool = CARD_POOLS_BY_RARITY[rarity] || CARD_POOLS_BY_RARITY.common || CARD_POOL;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getOwnedCopies(cardId) {
  return getSave().collection[cardId] || 0;
}

function getActiveDeck() {
  return getSave().decks.find((deck) => deck.id === getSave().activeDeckId);
}

function getHardcoreDeck() {
  return getSave().hardcoreDeck || createDeck("Hardcore-Deck");
}

function getDeckByMode(mode = DECK_MODES.standard) {
  return getDeckModeId(mode) === DECK_MODES.hardcore ? getHardcoreDeck() : getActiveDeck();
}

function getDeckModeTitle(mode = DECK_MODES.standard) {
  return getDeckModeId(mode) === DECK_MODES.hardcore ? getUiText("decks.hardcoreDeck") : getUiText("decks.standardDeck");
}

function encodeBase64Url(value) {
  return String(value || "").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value) {
  const normalized = String(value || "").replace(/-/g, "+").replace(/_/g, "/");
  return normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
}

function sanitizeDeckCodeName(value, mode = DECK_MODES.standard) {
  const fallback = getDeckModeId(mode) === DECK_MODES.hardcore
    ? getUiText("decks.hardcoreDeck")
    : localText("Importiertes Deck", "Imported deck", "Deck importé");
  const trimmed = String(value || "").replace(/\s+/g, " ").trim().slice(0, 24);
  return trimmed || fallback;
}

function buildDeckCodePayload(deck, mode = DECK_MODES.standard) {
  const deckMode = getDeckModeId(mode);
  const rules = getDeckRules(deckMode);
  return {
    version: DECK_CODE_VERSION,
    mode: deckMode,
    name: sanitizeDeckCodeName(deck?.name, deckMode),
    cards: Array.isArray(deck?.cards)
      ? deck.cards.filter((cardId) => typeof cardId === "string").slice(0, rules.size)
      : [],
  };
}

function encodeDeckCode(deck, mode = DECK_MODES.standard) {
  const payload = buildDeckCodePayload(deck, mode);
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  return `${DECK_CODE_PREFIX}-${encodeBase64Url(bytesToBase64(bytes))}`;
}

function decodeDeckCode(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) {
    return { error: "empty" };
  }

  const match = value.match(new RegExp(`^${DECK_CODE_PREFIX}-([A-Za-z0-9_-]+)$`));
  if (!match) {
    return { error: "invalid" };
  }

  try {
    const bytes = base64ToBytes(decodeBase64Url(match[1]));
    const payload = JSON.parse(new TextDecoder().decode(bytes));
    const mode = getDeckModeId(payload?.mode);
    const rules = getDeckRules(mode);
    if (sanitizeFiniteInteger(payload?.version, 0, 0, 99) !== DECK_CODE_VERSION) {
      return { error: "invalid" };
    }

    return {
      payload: {
        version: DECK_CODE_VERSION,
        mode,
        name: sanitizeDeckCodeName(payload?.name, mode),
        cards: Array.isArray(payload?.cards)
          ? payload.cards.filter((cardId) => typeof cardId === "string" && Boolean(getCard(cardId))).slice(0, rules.size)
          : [],
      },
    };
  } catch {
    return { error: "invalid" };
  }
}

function syncDeckCodeControls() {
  const hasCode = Boolean(String(uiState.deckCodeDraft || "").trim());
  if (elements.importDeckCodeButton) {
    elements.importDeckCodeButton.disabled = !hasCode;
  }
  if (elements.clearDeckCodeButton) {
    elements.clearDeckCodeButton.disabled = !hasCode;
  }
}

async function copyActiveDeckCode() {
  const deckMode = getSelectedDeckMode();
  const activeDeck = getDeckByMode(deckMode);

  if (!activeDeck) {
    showToast(getUiText("messages.deckMissing"));
    return;
  }

  const code = encodeDeckCode(activeDeck, deckMode);
  uiState.deckCodeDraft = code;
  if (elements.deckCodeInput) {
    elements.deckCodeInput.value = code;
  }
  syncDeckCodeControls();

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(code);
      showToast(getUiText("messages.deckCodeCopied"));
      return;
    }
  } catch {
    // Fallback below keeps the code visible and selectable.
  }

  elements.deckCodeInput?.focus();
  elements.deckCodeInput?.select?.();
  showToast(getUiText("messages.deckCodeCopiedFallback"));
}

function clearDeckCodeInput() {
  uiState.deckCodeDraft = "";
  if (elements.deckCodeInput) {
    elements.deckCodeInput.value = "";
    elements.deckCodeInput.focus();
  }
  syncDeckCodeControls();
}

function importDeckCode() {
  if (isMatchSessionLocked()) {
    showToast(getUiText("messages.matchCollectionLocked"));
    return;
  }

  const { payload, error } = decodeDeckCode(uiState.deckCodeDraft || elements.deckCodeInput?.value);
  if (error === "empty") {
    showToast(getUiText("messages.deckCodeMissing"));
    return;
  }
  if (error || !payload) {
    showToast(getUiText("messages.deckCodeInvalid"));
    return;
  }

  if (payload.mode === DECK_MODES.hardcore && getHardcoreDeck().cards.length && !requestActionConfirmation(getUiText("messages.deckCodeHardcoreConfirm"))) {
    return;
  }

  const importedDeck = createDeck(payload.name, payload.cards);

  if (payload.mode === DECK_MODES.hardcore) {
    getSave().hardcoreDeck = importedDeck;
  } else {
    getSave().decks.push(importedDeck);
    getSave().activeDeckId = importedDeck.id;
  }

  uiState.deckMode = payload.mode;
  uiState.deckCodeDraft = "";
  persistCurrentAccount();
  renderAll();
  showToast(getUiText("messages.deckCodeImported", {
    mode: getDeckModeTitle(payload.mode),
    name: importedDeck.name,
  }));
}

function applyHardcoreDeckLoss(cardIds) {
  const removedCounts = countCards(Array.isArray(cardIds) ? cardIds : []);
  let lostCards = 0;

  Object.entries(removedCounts).forEach(([cardId, count]) => {
    const owned = getOwnedCopies(cardId);
    const remaining = Math.max(0, owned - count);
    lostCards += Math.min(owned, count);
    if (remaining > 0) {
      getSave().collection[cardId] = remaining;
    } else {
      delete getSave().collection[cardId];
    }
  });

  if (getSave().hardcoreDeck) {
    getSave().hardcoreDeck.cards = [];
  }

  return lostCards;
}

function getDeckTypeCount(deck, type) {
  if (!deck || !Array.isArray(deck.cards)) {
    return 0;
  }
  return deck.cards.filter((cardId) => getCard(cardId)?.type === type).length;
}

function getDeckModeWarningMessages(mode = DECK_MODES.standard) {
  const rules = getDeckRules(mode);
  return {
    size: getUiText("messages.deckSize", { count: "{count}", size: rules.size }),
    spell: getUiText("messages.deckSpellLimit", { count: "{count}", limit: rules.maxSpells }),
    trainer: getUiText("messages.deckTrainerLimit", { count: "{count}", limit: rules.maxTrainers }),
  };
}

function validateDeck(deck, mode = DECK_MODES.standard) {
  const deckMode = getDeckModeId(mode);
  const rules = getDeckRules(deckMode);
  const messages = [];

  if (!deck) {
    return { valid: false, messages: ["Es ist kein aktives Deck vorhanden."] };
  }

  if (deck.cards.length !== rules.size) {
    messages.push(getUiText("messages.deckSize", { count: deck.cards.length, size: rules.size }));
  }

  const spellCount = getDeckTypeCount(deck, "spell");
  const trainerCount = getDeckTypeCount(deck, "trainer");
  if (spellCount > rules.maxSpells) {
    messages.push(getUiText("messages.deckSpellLimit", { count: spellCount, limit: rules.maxSpells }));
  }
  if (trainerCount > rules.maxTrainers) {
    messages.push(getUiText("messages.deckTrainerLimit", { count: trainerCount, limit: rules.maxTrainers }));
  }

  const required = countCards(deck.cards);
  Object.entries(required).forEach(([cardId, count]) => {
    const card = getCard(cardId);
    if (!card) {
      messages.push("Das Deck enthält eine nicht mehr verfügbare Karte.");
      return;
    }
    const owned = getOwnedCopies(cardId);
    const copyLimit = getDeckCopyLimit(cardId);
    if (owned < count) {
      const missing = count - owned;
      messages.push(`${missing}× ${card.name} fehlen im Besitz.`);
    }
    if (count > copyLimit) {
      messages.push(`${card.name} überschreitet das Decklimit von ${copyLimit}.`);
    }
  });

  return {
    valid: messages.length === 0,
    messages,
  };
}

function renameActiveDeck() {
  const activeDeck = getDeckByMode(getSelectedDeckMode());
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
  if (getSelectedDeckMode() === DECK_MODES.hardcore) {
    showToast(localText("Der Hardcore-Modus nutzt genau ein eigenes Spezialdeck.", "Hardcore uses one dedicated special deck.", "Le mode hardcore utilise un seul deck spÃ©cial dÃ©diÃ©."));
    return;
  }
  const nextIndex = getSave().decks.length + 1;
  const deck = createDeck(`Deck ${nextIndex}`);
  getSave().decks.push(deck);
  getSave().activeDeckId = deck.id;
  persistCurrentAccount();
  renderAll();
  showToast("Neues Deck erstellt.");
}

function duplicateActiveDeck() {
  if (getSelectedDeckMode() === DECK_MODES.hardcore) {
    showToast(localText("Das Hardcore-Spezialdeck kann nicht dupliziert werden.", "The hardcore deck cannot be duplicated.", "Le deck hardcore ne peut pas Ãªtre dupliquÃ©."));
    return;
  }
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
  if (getSelectedDeckMode() === DECK_MODES.hardcore) {
    showToast(localText("Das Hardcore-Spezialdeck kann nicht gelÃ¶scht werden.", "The hardcore deck cannot be deleted.", "Le deck hardcore ne peut pas Ãªtre supprimÃ©."));
    return;
  }
  if (getSave().decks.length === 1) {
    showToast("Mindestens ein Deck muss erhalten bleiben.");
    return;
  }

  const activeDeck = getActiveDeck();
  if (!requestActionConfirmation(`Soll ${activeDeck.name} wirklich gelöscht werden?`)) {
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
  const deckMode = getSelectedDeckMode();
  const activeDeck = getDeckByMode(deckMode);
  const rules = getDeckRules(deckMode);
  const card = getCard(cardId);
  const deckCopies = countCopiesInArray(activeDeck.cards, cardId);
  const nextSpellCount = card?.type === "spell" ? getDeckTypeCount(activeDeck, "spell") + 1 : getDeckTypeCount(activeDeck, "spell");
  const nextTrainerCount = card?.type === "trainer" ? getDeckTypeCount(activeDeck, "trainer") + 1 : getDeckTypeCount(activeDeck, "trainer");
  return activeDeck.cards.length < rules.size
    && deckCopies < getOwnedCopies(cardId)
    && deckCopies < getDeckCopyLimit(cardId)
    && nextSpellCount <= rules.maxSpells
    && nextTrainerCount <= rules.maxTrainers;
}

function addCardToActiveDeck(cardId) {
  if (isMatchSessionLocked()) {
    showToast(getUiText("messages.matchCollectionLocked"));
    return;
  }

  if (!canAddCardToActiveDeck(cardId)) {
    showToast("Diese Karte kann gerade nicht weiter hinzugefügt werden.");
    return;
  }

  getDeckByMode(getSelectedDeckMode()).cards.push(cardId);
  persistCurrentAccount();
  renderAll();
}

function removeCardFromActiveDeck(cardId) {
  const deck = getDeckByMode(getSelectedDeckMode());
  const index = deck.cards.findIndex((entry) => entry === cardId);

  if (index === -1) {
    return;
  }

  deck.cards.splice(index, 1);
  persistCurrentAccount();
  renderAll();
}

function sellCard(cardId, amount) {
  if (isMatchSessionLocked()) {
    showToast(getUiText("messages.matchCollectionLocked"));
    return;
  }

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
  if (isMatchSessionLocked()) {
    showToast(getUiText("messages.matchCollectionLocked"));
    return;
  }

  const card = getCard(cardId);
  if (!card) {
    showToast("Diese Karte ist für den Marktplatz nicht verfügbar.");
    return;
  }

  const owned = getOwnedCopies(cardId);
  const sellAmount = Math.min(sanitizeFiniteInteger(amount, 0, 0, SECURITY_LIMITS.maxTransactionAmount), owned);

  if (sellAmount < 1) {
    showToast("Für den Marktplatz fehlt dir diese Karte.");
    return;
  }

  const quote = getMarketSaleQuote(cardId, sellAmount);
  if (quote.net < 0 || quote.gross <= 0) {
    showToast("Der Marktplatzpreis dieser Karte ist aktuell ungültig.");
    return;
  }

  getSave().collection[cardId] = owned - sellAmount;
  getSave().gold += quote.net;
  database.market.feeVault += quote.fee;
  recordMarketTrade(cardId, "sell", sellAmount);
  trackProgressStat("marketDeals", sellAmount);
  persistCurrentAccount();
  if (isServerSessionActive()) {
    queueServerMarketSync();
  }
  renderAll();
  showToast(`${sellAmount}× ${card.name} am Marktplatz verkauft. Netto: ${quote.net} Gold, Gebühr: ${quote.fee} Gold.`);
}

function buyCardOnMarket(cardId, amount = 1) {
  if (isMatchSessionLocked()) {
    showToast(getUiText("messages.matchCollectionLocked"));
    return;
  }

  const card = getCard(cardId);
  const buyAmount = sanitizeFiniteInteger(amount, 1, 1, SECURITY_LIMITS.maxTransactionAmount);
  const unitPrice = getMarketBuyPrice(cardId);
  const totalPrice = unitPrice * buyAmount;

  if (!card || !Number.isFinite(unitPrice) || unitPrice < 1 || !Number.isFinite(totalPrice) || totalPrice <= 0) {
    showToast("Diese Marktplatzkarte hat gerade keinen gültigen Preis.");
    return;
  }

  if (getSave().gold < totalPrice) {
    showToast("Für diesen Marktkauf reicht dein Gold nicht.");
    return;
  }

  getSave().gold -= totalPrice;
  getSave().collection[cardId] = (getSave().collection[cardId] || 0) + buyAmount;
  recordMarketTrade(cardId, "buy", buyAmount);
  trackProgressStat("marketDeals", buyAmount);
  persistCurrentAccount();
  if (isServerSessionActive()) {
    queueServerMarketSync();
  }
  renderAll();
  showToast(`${buyAmount}× ${card.name} am Marktplatz gekauft.`);
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
  if (isMatchSessionLocked()) {
    showToast(getUiText("messages.matchAlreadyRunning"));
    return;
  }

  if (uiState.match && !isMatchActive()) {
    uiState.match = null;
    persistCurrentMatchIfNeeded(false);
  }

  const difficultyId = getArenaDifficultyId(getSave().arenaDifficulty);
  const deckMode = getDeckModeForDifficulty(difficultyId);
  const deck = getDeckByMode(deckMode);
  const validation = validateDeck(deck, deckMode);

  if (!validation.valid) {
    uiState.section = "decks";
    uiState.deckMode = deckMode;
    renderAll();
    showToast(getUiText("messages.matchNotPlayable"));
    return;
  }

  uiState.match = createMatch(deck.cards, difficultyId, {
    deckMode,
    sourceDeckName: deck.name,
  });
  uiState.section = "arena";
  startTurn("player");
  renderAll();
  showToast(getUiText("messages.matchStarted"));
}

function clearMatch() {
  const match = uiState.match;
  if (match?.status === "active") {
    const difficulty = getArenaDifficulty(match.difficultyId);
    const plannedPenalty = sanitizeFiniteInteger(difficulty.forfeitPenalty, 0, 0, SECURITY_LIMITS.maxGold);
    if (!requestActionConfirmation(getUiText("messages.matchForfeitConfirm", {
      difficulty: getArenaDifficultyLabel(difficulty.id),
      gold: plannedPenalty,
    }))) {
      return;
    }

    const deductedGold = Math.min(getSave().gold, plannedPenalty);
    getSave().gold = Math.max(0, getSave().gold - deductedGold);
    uiState.modalCardId = null;
    uiState.match = null;
    persistCurrentAccount();
    renderAll();
    showToast(getUiText("messages.matchForfeitPaid", { gold: deductedGold }));
    return;
  }

  uiState.modalCardId = null;
  uiState.match = null;
  renderAll();
}

function createMatch(playerDeckCards, difficultyId = getArenaDifficultyId(getSave().arenaDifficulty)) {
  return legacyCreateMatch(playerDeckCards, difficultyId, arguments[2] || {});
}

function createSideState(deckCards, options = {}) {
  const shuffledDeck = shuffle([...deckCards]);
  return {
    hero: APP_CONFIG.heroHealth + sanitizeFiniteInteger(options.heroBonus, 0, -20, 80),
    heroBarrier: sanitizeFiniteInteger(options.heroBarrier, 0, 0, 20),
    maxMana: sanitizeFiniteInteger(options.startingMaxMana, APP_CONFIG.startingMana, 0, APP_CONFIG.maxMana),
    mana: sanitizeFiniteInteger(options.startingMana, APP_CONFIG.startingMana, 0, APP_CONFIG.maxMana),
    turnsStarted: sanitizeFiniteInteger(options.turnsStarted, 0, 0, 99),
    deck: shuffledDeck,
    hand: [],
    board: [],
    cooldowns: {},
    fatigueDamage: APP_CONFIG.fatigueBaseDamage,
    deckProfile: analyzeDeck(shuffledDeck),
  };
}

function startTurn(side) {
  const match = uiState.match;
  const actor = match[side];
  const isFirstTurnForSide = sanitizeFiniteInteger(actor.turnsStarted, 0, 0, 99) === 0;

  if (side === "player") {
    match.turn += 1;
  }

  match.phase = side;
  if (!isFirstTurnForSide) {
    actor.maxMana = Math.min(APP_CONFIG.maxMana, actor.maxMana + 1);
  }
  actor.mana = actor.maxMana;
  actor.turnsStarted = sanitizeFiniteInteger(actor.turnsStarted, 0, 0, 99) + 1;
  updateCooldowns(actor);
  actor.board.forEach((unit) => {
    unit.canAttack = true;
    processTurnStartStatuses(unit, side);
    if (unit.health > 0 && unit.keywords?.includes("regen") && unit.health < unit.maxHealth) {
      unit.health = Math.min(unit.maxHealth, unit.health + 1);
      addLog(getUiText("messages.regenerated", { name: getCard(unit.cardId).name }));
    }
  });
  cleanupBoards();

  drawCards(side, 1);

  if (match.status !== "active") {
    return;
  }

  addLog(getUiText(side === "player" ? "messages.matchTurnStartPlayer" : "messages.matchTurnStartEnemy"));
  match.statusMessage = side === "player"
    ? getUiText("messages.matchPlayerStatus")
    : getUiText("messages.matchEnemyStatus");

  if (side === "enemy") {
    runEnemyTurn();
  }
}

function drawCards(side, amount) {
  const match = uiState.match;
  const actor = match[side];

  for (let index = 0; index < amount; index += 1) {
    if (!actor.deck.length) {
      actor.hero -= actor.fatigueDamage;
      addLog(getUiText(side === "player" ? "messages.fatiguePlayer" : "messages.fatigueEnemy", { value: actor.fatigueDamage }));
      actor.fatigueDamage += 1;
      if (actor.hero <= 0) {
        finishMatch(side === "player" ? "lost" : "won", getUiText("messages.fatigueFinish"));
        return;
      }
      continue;
    }

    actor.hand.push(actor.deck.shift());
  }
}

function drawOpeningHands(match, difficulty = getArenaDifficulty(match?.difficultyId)) {
  const enemyDrawCount = clamp(1, APP_CONFIG.openingHandSize + 2, APP_CONFIG.openingHandSize + sanitizeFiniteInteger(difficulty?.enemyOpeningHandDelta, 0, -2, 2));

  for (let index = 0; index < APP_CONFIG.openingHandSize; index += 1) {
    if (match.player.deck.length) {
      match.player.hand.push(match.player.deck.shift());
    }
  }

  for (let index = 0; index < enemyDrawCount; index += 1) {
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

  if (card.type === "unit" && match.player.board.length >= APP_CONFIG.boardSize) {
    return false;
  }

  if (getCardPlayRestriction(card, "player")) {
    return false;
  }

  return true;
}

function playCard(handIndex) {
  const match = uiState.match;
  const cardId = match.player.hand[handIndex];
  const card = getCard(cardId);

  if (!canPlayCard(card, handIndex)) {
    showToast(getUiText("messages.cardNotPlayable"));
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
  const synergy = getActiveCardSynergy(card, owner);

  if (card.timing?.cooldown) {
    actor.cooldowns[card.id] = Math.max(actor.cooldowns[card.id] || 0, card.timing.cooldown);
  }

  if (card.type === "unit") {
    const unit = {
      uid: nextUnitId(),
      cardId: card.id,
      attack: card.attack,
      health: card.health,
      maxHealth: card.health,
      canAttack: card.keywords?.includes("charge") || false,
      keywords: [...(card.keywords || [])],
      statuses: [],
    };
    actor.board.push(unit);
    addLog(`${owner === "player" ? "Du spielst" : "Der Gegner spielt"} ${card.name}.`);
    applyEffect(card.effect, owner, card.name);
    if (synergy) {
      addLog(`${card.name} aktiviert Synergie: ${describeSynergyCondition(synergy.condition)}.`);
      applyEffect(synergy.bonusEffect, owner, `${card.name} [Synergie]`);
    }
    return;
  }

  addLog(`${owner === "player" ? "Du wirkst" : "Der Gegner wirkt"} ${card.name}.`);
  applyEffect(card.effect, owner, card.name);
  if (synergy) {
    addLog(`${card.name} aktiviert Synergie: ${describeSynergyCondition(synergy.condition)}.`);
    applyEffect(synergy.bonusEffect, owner, `${card.name} [Synergie]`);
  }
}

function applyEffect(effect, owner, sourceName) {
  const effects = normalizeEffectList(effect);

  if (!effects.length) {
    return;
  }

  for (const entry of effects) {
    if (!uiState.match || uiState.match.status !== "active") {
      break;
    }

    applySingleEffect(entry, owner, sourceName);
    cleanupBoards();
  }
}

function strikeWeakestEnemy(owner, value, sourceName) {
  const enemy = uiState.match[owner === "player" ? "enemy" : "player"];
  const target = selectWeakestUnit(getAttackableEnemyUnits(owner));

  if (!target) {
    enemy.hero -= value;
    addLog(`${sourceName} trifft den Helden direkt für ${value}.`);
    return;
  }

  dealDamageToUnit(target, value, `${sourceName} trifft ${getCard(target.cardId).name}`, owner === "player" ? "enemy" : "player");
}

async function attackWithUnit(unitId) {
  const match = uiState.match;

  if (!match || match.phase !== "player" || match.status !== "active") {
    return;
  }

  const attacker = match.player.board.find((unit) => unit.uid === unitId);

  if (!attacker || !attacker.canAttack) {
    return;
  }

  await resolveCombat(attacker, "player");
  afterActionCheck();
  renderArena();
}

function resolveCombat(attacker, owner) {
  const match = uiState.match;
  const enemy = match[owner === "player" ? "enemy" : "player"];
  const actor = match[owner];
  const target = selectWeakestUnit(getAttackableEnemyUnits(owner));
  attacker.canAttack = false;

  if (!target) {
    enemy.hero -= attacker.attack;
    addLog(`${getCard(attacker.cardId).name} trifft den Helden für ${attacker.attack}.`);
    applyLifesteal(attacker, owner, attacker.attack);
    return;
  }

  addLog(`${getCard(attacker.cardId).name} greift ${getCard(target.cardId).name} an.`);
  const damageToTarget = dealDamageToUnit(target, attacker.attack, "", owner === "player" ? "enemy" : "player");
  const damageToAttacker = dealDamageToUnit(attacker, target.attack, "", owner);
  applyLifesteal(attacker, owner, damageToTarget);
  applyLifesteal(target, owner === "player" ? "enemy" : "player", damageToAttacker);
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
    .map((cardId, index) => ({
      card: getCard(cardId),
      index,
      synergyActive: Boolean(getActiveCardSynergy(getCard(cardId), "enemy")),
    }))
    .filter(({ card }) => card.cost <= enemy.mana && (card.type !== "unit" || enemy.board.length < APP_CONFIG.boardSize))
    .filter(({ card }) => !getCardPlayRestriction(card, "enemy"))
    .sort((left, right) => Number(right.synergyActive) - Number(left.synergyActive) || right.card.cost - left.card.cost || RARITY_ORDER.indexOf(right.card.rarity) - RARITY_ORDER.indexOf(left.card.rarity));

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

function updateCooldowns(actor) {
  Object.keys(actor.cooldowns).forEach((cardId) => {
    actor.cooldowns[cardId] -= 1;

    if (actor.cooldowns[cardId] <= 0) {
      delete actor.cooldowns[cardId];
    }
  });
}

function processTurnStartStatuses(unit, side) {
  if (!Array.isArray(unit.statuses) || !unit.statuses.length) {
    return;
  }

  const nextStatuses = [];
  unit.statuses.forEach((status) => {
    switch (status.kind) {
      case "burn":
        dealDamageToUnit(unit, status.value, `${getCard(unit.cardId).name} leidet unter Brand`, side);
        if (status.turns > 1) {
          nextStatuses.push({ ...status, turns: status.turns - 1 });
        }
        break;
      case "freeze":
        unit.canAttack = false;
        addLog(`${getCard(unit.cardId).name} ist eingefroren und kann nicht angreifen.`);
        if (status.turns > 1) {
          nextStatuses.push({ ...status, turns: status.turns - 1 });
        }
        break;
      case "barrier":
        nextStatuses.push(status);
        break;
      default:
        break;
    }
  });
  unit.statuses = nextStatuses;
}

function dealDamageToUnit(unit, damage, message = "", side = null) {
  if (!unit || damage <= 0) {
    return 0;
  }

  const barrierIndex = unit.statuses?.findIndex((status) => status.kind === "barrier") ?? -1;

  if (barrierIndex >= 0) {
    unit.statuses.splice(barrierIndex, 1);
    if (message) {
      addLog(`${message}, aber eine Barriere verhindert den Schaden.`);
    } else {
      addLog(`${getCard(unit.cardId).name} blockt den Schaden mit einer Barriere.`);
    }
    return 0;
  }

  const actualDamage = Math.min(unit.health, damage);
  unit.health -= damage;

  if (message) {
    addLog(`${message} für ${actualDamage}.`);
  }

  if (side && unit.health <= 0) {
    addLog(`${getCard(unit.cardId).name} bricht zusammen.`);
  }

  return actualDamage;
}

function addStatusToUnit(unit, status, sourceName) {
  unit.statuses = unit.statuses || [];

  if (status.kind === "barrier") {
    const hasBarrier = unit.statuses.some((entry) => entry.kind === "barrier");
    if (!hasBarrier) {
      unit.statuses.push({ kind: "barrier" });
      addLog(`${sourceName} verleiht ${getCard(unit.cardId).name} eine Barriere.`);
    }
    return;
  }

  const existing = unit.statuses.find((entry) => entry.kind === status.kind);
  if (existing) {
    existing.turns = Math.max(existing.turns || 0, status.turns || 0);
    existing.value = Math.max(existing.value || 0, status.value || 0);
  } else {
    unit.statuses.push({ ...status });
  }
  addLog(`${sourceName} belegt ${getCard(unit.cardId).name} mit ${STATUS_META[status.kind].label}.`);
}

function normalizeEffectList(effect) {
  if (!effect) {
    return [];
  }

  if (Array.isArray(effect)) {
    return effect.filter((entry) => entry && entry.kind && entry.kind !== "none");
  }

  if (effect.kind === "combo" && Array.isArray(effect.effects)) {
    return effect.effects.filter((entry) => entry && entry.kind && entry.kind !== "none");
  }

  return effect.kind === "none" ? [] : [effect];
}

function applySingleEffect(effect, owner, sourceName) {
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
    case "gainMaxMana":
      actor.maxMana = Math.min(APP_CONFIG.maxMana, actor.maxMana + effect.value);
      actor.mana = Math.min(actor.maxMana, actor.mana + effect.value);
      addLog(`${sourceName} erweitert dein Mana dauerhaft um ${effect.value}.`);
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
    case "healBoard":
      actor.board.forEach((unit) => {
        unit.health = Math.min(unit.maxHealth, unit.health + effect.value);
      });
      actor.hero += effect.value;
      addLog(`${sourceName} erneuert dein Feld und heilt ${effect.value}.`);
      break;
    case "strikeWeakest":
      strikeWeakestEnemy(owner, effect.value, sourceName);
      break;
    case "damageAllEnemies":
      damageAllEnemies(owner, effect.value, sourceName);
      break;
    case "burnWeakest":
      burnWeakestEnemy(owner, effect.value, effect.turns, sourceName);
      break;
    case "freezeWeakest":
      freezeWeakestEnemy(owner, effect.turns, sourceName);
      break;
    case "barrierStrongest":
      barrierStrongestAlly(owner, sourceName);
      break;
    case "weakenEnemies":
      weakenEnemyBoard(owner, effect.value, sourceName);
      break;
    case "drainHero":
      enemy.hero -= effect.damage;
      actor.hero += effect.heal;
      addLog(`${sourceName} entzieht ${effect.damage} Leben und heilt ${effect.heal}.`);
      break;
    case "readyStrongest":
      readyStrongestAlly(owner, effect.attackBonus || 0, sourceName);
      break;
    case "empowerUnit":
      empowerNewestAlly(owner, effect.attack, effect.health, sourceName);
      break;
    default:
      break;
  }
}

function selectWeakestUnit(units) {
  if (!units.length) {
    return null;
  }

  return [...units].sort((left, right) => left.health - right.health || left.attack - right.attack)[0];
}

function selectStrongestUnit(units) {
  if (!units.length) {
    return null;
  }

  return [...units].sort((left, right) => right.attack - left.attack || right.health - left.health)[0];
}

function getAttackableEnemyUnits(owner) {
  const enemy = uiState.match[owner === "player" ? "enemy" : "player"];
  const guards = enemy.board.filter((unit) => unit.keywords?.includes("guard"));
  return guards.length ? guards : enemy.board;
}

function damageAllEnemies(owner, value, sourceName) {
  const enemy = uiState.match[owner === "player" ? "enemy" : "player"];

  if (!enemy.board.length) {
    enemy.hero -= value;
    addLog(`${sourceName} trifft mangels Feldzielen den Helden für ${value}.`);
    return;
  }

  enemy.board.forEach((unit) => {
    dealDamageToUnit(unit, value, `${sourceName} trifft ${getCard(unit.cardId).name}`, owner === "player" ? "enemy" : "player");
  });
}

function burnWeakestEnemy(owner, value, turns, sourceName) {
  const enemy = uiState.match[owner === "player" ? "enemy" : "player"];
  const target = selectWeakestUnit(getAttackableEnemyUnits(owner));

  if (!target) {
    enemy.hero -= value;
    addLog(`${sourceName} verbrennt mangels Ziel den Helden für ${value}.`);
    return;
  }

  addStatusToUnit(target, { kind: "burn", value, turns }, sourceName);
}

function freezeWeakestEnemy(owner, turns, sourceName) {
  const target = selectWeakestUnit(getAttackableEnemyUnits(owner));

  if (!target) {
    addLog(`${sourceName} findet kein Ziel für Frost.`);
    return;
  }

  addStatusToUnit(target, { kind: "freeze", turns }, sourceName);
}

function barrierStrongestAlly(owner, sourceName) {
  const actor = uiState.match[owner];
  const target = selectStrongestUnit(actor.board);

  if (!target) {
    addLog(`${sourceName} findet keine Einheit für eine Barriere.`);
    return;
  }

  addStatusToUnit(target, { kind: "barrier" }, sourceName);
}

function weakenEnemyBoard(owner, value, sourceName) {
  const enemy = uiState.match[owner === "player" ? "enemy" : "player"];

  if (!enemy.board.length) {
    addLog(`${sourceName} findet kein gegnerisches Feld für die Schwächung.`);
    return;
  }

  enemy.board.forEach((unit) => {
    unit.attack = Math.max(0, unit.attack - value);
  });
  addLog(`${sourceName} schwächt alle gegnerischen Einheiten um ${value} Angriff.`);
}

function readyStrongestAlly(owner, attackBonus, sourceName) {
  const actor = uiState.match[owner];
  const target = selectStrongestUnit(actor.board);

  if (!target) {
    addLog(`${sourceName} findet keine verbündete Einheit zum Bereitmachen.`);
    return;
  }

  target.canAttack = true;
  if (attackBonus > 0) {
    target.attack += attackBonus;
  }
  addLog(`${sourceName} macht ${getCard(target.cardId).name} sofort einsatzbereit${attackBonus > 0 ? ` und gibt +${attackBonus} Angriff` : ""}.`);
}

function empowerNewestAlly(owner, attack, health, sourceName) {
  const actor = uiState.match[owner];
  const target = actor.board[actor.board.length - 1];

  if (!target) {
    addLog(`${sourceName} hat keine verbündete Einheit für den Verstärkungseffekt.`);
    return;
  }

  target.attack += attack;
  target.health += health;
  target.maxHealth += health;
  addLog(`${sourceName} verstärkt ${getCard(target.cardId).name} um +${attack}/+${health}.`);
}

function applyLifesteal(unit, owner, amount) {
  if (!unit?.keywords?.includes("lifesteal") || amount <= 0) {
    return;
  }

  uiState.match[owner].hero += amount;
  addLog(`${getCard(unit.cardId).name} heilt den Helden um ${amount}.`);
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
  return legacyFinishMatch(status, message);
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

function scoreEnemyDeckCard(card) {
  return RARITY_ORDER.indexOf(card.rarity) * 16 + card.cost * 2 + (card.type === "unit" ? 4 : 0);
}

function pickEnemyDeckCard(pool, difficulty) {
  const bias = Number(difficulty.selectionBias || 0);

  if (!pool.length) {
    return null;
  }

  if (bias > 0 && Math.random() < bias) {
    const sorted = [...pool].sort((left, right) => scoreEnemyDeckCard(right) - scoreEnemyDeckCard(left));
    const slice = sorted.slice(0, Math.max(1, Math.ceil(sorted.length * 0.38)));
    return slice[Math.floor(Math.random() * slice.length)] || sorted[0];
  }

  if (bias < 0 && Math.random() < Math.abs(bias)) {
    const sorted = [...pool].sort((left, right) => scoreEnemyDeckCard(left) - scoreEnemyDeckCard(right));
    const slice = sorted.slice(0, Math.max(1, Math.ceil(sorted.length * 0.42)));
    return slice[Math.floor(Math.random() * slice.length)] || sorted[0];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

function generateEnemyDeck(difficultyId = "standard", deckSize = APP_CONFIG.deckSize) {
  const difficulty = getArenaDifficulty(difficultyId);
  const deckRules = deckSize >= DECK_RULES.hardcore.size ? DECK_RULES.hardcore : DECK_RULES.standard;
  const weightedPool = CARD_POOL.filter((card) => {
    if (difficulty.rarityRolls[card.rarity] !== undefined) {
      return Math.random() < difficulty.rarityRolls[card.rarity];
    }
    return true;
  });

  const deck = [];
  const units = weightedPool.filter((card) => card.type === "unit");
  const supports = weightedPool.filter((card) => card.type !== "unit");
  const counts = {};
  const typeCounts = {
    spell: 0,
    trainer: 0,
  };
  const fallbackPool = weightedPool.length ? weightedPool : CARD_POOL;
  let attempts = 0;

  while (deck.length < deckSize && attempts < 500) {
    attempts += 1;
    const preferredPool = Math.random() < difficulty.unitBias && units.length ? units : (supports.length ? supports : fallbackPool);
    const eligiblePool = preferredPool.filter((card) => {
      if ((counts[card.id] || 0) >= getDeckCopyLimit(card.id)) {
        return false;
      }
      if (card.type === "spell" && typeCounts.spell >= deckRules.maxSpells) {
        return false;
      }
      if (card.type === "trainer" && typeCounts.trainer >= deckRules.maxTrainers) {
        return false;
      }
      return true;
    });
    const pool = eligiblePool.length
      ? eligiblePool
      : fallbackPool.filter((card) => {
        if ((counts[card.id] || 0) >= getDeckCopyLimit(card.id)) {
          return false;
        }
        if (card.type === "spell" && typeCounts.spell >= deckRules.maxSpells) {
          return false;
        }
        if (card.type === "trainer" && typeCounts.trainer >= deckRules.maxTrainers) {
          return false;
        }
        return true;
      });

    if (!pool.length) {
      break;
    }

    const card = pickEnemyDeckCard(pool, difficulty);
    if (!card) {
      break;
    }
    deck.push(card.id);
    counts[card.id] = (counts[card.id] || 0) + 1;
    if (card.type === "spell") {
      typeCounts.spell += 1;
    } else if (card.type === "trainer") {
      typeCounts.trainer += 1;
    }
  }

  return deck;
}

function countByType(cardIds, type) {
  return cardIds.filter((cardId) => getCard(cardId)?.type === type).length;
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

function getDeckCopyLimit(cardId) {
  const rarity = getCard(cardId)?.rarity;
  return ["legendary", "ultra", "mythic", "transcendent", "singular"].includes(rarity) ? 1 : 2;
}

function getCard(cardId) {
  return CARD_MAP.get(cardId) || TOKEN_CARD_MAP.get(cardId);
}

function getFaction(factionId) {
  return FACTIONS.find((faction) => faction.id === factionId);
}

function RarityLabel(rarity) {
  return getRarityLabel(rarity);
}

function sortCardsForDisplay(left, right) {
  return RARITY_ORDER.indexOf(left.rarity) - RARITY_ORDER.indexOf(right.rarity)
    || left.cost - right.cost
    || left.name.localeCompare(right.name, "de");
}

function showToast(message) {
  elements.toast.innerHTML = `<strong>Gewölbe aktualisiert</strong><span>${message}</span>`;
  elements.toast.classList.remove("toast-enter");
  elements.toast.classList.remove("hidden");
  if (!getUserSettings().reducedMotion) {
    void elements.toast.offsetWidth;
    elements.toast.classList.add("toast-enter");
  }

  if (uiState.toastTimer) {
    window.clearTimeout(uiState.toastTimer);
  }

  uiState.toastTimer = window.setTimeout(() => {
    elements.toast.classList.add("hidden");
  }, getUserSettings().reducedMotion ? 1800 : 2600);
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

function createLegacyCard(id, name, faction, type, rarity, cost, attack, health, effect, keywords = [], synergy = null, timing = null) {
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
    keywords,
    synergy,
    timing,
    description: buildDescription(type, effect, keywords, synergy, timing),
  };
}

function buildGeneratedCards() {
  const cards = [];
  const expandedUnitOffset = UNIT_TITLES.length + 2;
  const expandedSpellOffset = SPELL_TITLES.length + 3;
  const expandedTrainerOffset = TRAINER_TITLES.length + 4;
  const ascendantUnitOffset = expandedUnitOffset + EXPANDED_UNIT_TITLES.length + 5;
  const ascendantSpellOffset = expandedSpellOffset + EXPANDED_SPELL_TITLES.length + 7;
  const ascendantTrainerOffset = expandedTrainerOffset + EXPANDED_TRAINER_TITLES.length + 9;

  FACTIONS.forEach((faction, factionIndex) => {
    appendGeneratedUnitSet(cards, faction, factionIndex, UNIT_TITLES, UNIT_RARITIES, "einheit", 0);
    appendGeneratedSpellSet(cards, faction, SPELL_TITLES, SPELL_RARITIES, "zauber", 0);
    appendGeneratedTrainerSet(cards, faction, TRAINER_TITLES, TRAINER_RARITIES, "trainer", 0);

    appendGeneratedUnitSet(cards, faction, factionIndex, EXPANDED_UNIT_TITLES, EXPANDED_UNIT_RARITIES, "einheit-erweitert", expandedUnitOffset);
    appendGeneratedSpellSet(cards, faction, EXPANDED_SPELL_TITLES, EXPANDED_SPELL_RARITIES, "zauber-erweitert", expandedSpellOffset);
    appendGeneratedTrainerSet(cards, faction, EXPANDED_TRAINER_TITLES, EXPANDED_TRAINER_RARITIES, "trainer-erweitert", expandedTrainerOffset);

    appendGeneratedUnitSet(cards, faction, factionIndex, ASCENDANT_UNIT_TITLES, ASCENDANT_UNIT_RARITIES, "einheit-aufstieg", ascendantUnitOffset);
    appendGeneratedSpellSet(cards, faction, ASCENDANT_SPELL_TITLES, ASCENDANT_SPELL_RARITIES, "zauber-aufstieg", ascendantSpellOffset);
    appendGeneratedTrainerSet(cards, faction, ASCENDANT_TRAINER_TITLES, ASCENDANT_TRAINER_RARITIES, "trainer-aufstieg", ascendantTrainerOffset);
  });

  return cards;
}

function appendGeneratedUnitSet(cards, faction, factionIndex, titles, rarities, idSegment, offset) {
  titles.forEach((title, index) => {
    const effectIndex = index + offset;
    const rarity = rarities[index];
    const keywords = createUnitKeywords(rarity, effectIndex, faction.id, title);
    const effect = createUnitEffect(rarity, effectIndex, faction.id, title);
    const synergy = createCardSynergy("unit", rarity, effectIndex, faction.id, title, keywords);
    const timing = createCardTiming("unit", rarity, effectIndex, title, keywords);
    const cost = createCostForRarity(rarity, effectIndex, "unit");
    const stats = createUnitStats(cost, rarity, effectIndex, factionIndex, keywords, title);
    cards.push({
      id: `${faction.id}-${idSegment}-${index + 1}`,
      name: `${faction.prefix}-${title}`,
      faction: faction.id,
      type: "unit",
      rarity,
      cost,
      attack: stats.attack,
      health: stats.health,
      effect,
      keywords,
      synergy,
      timing,
      description: buildDescription("unit", effect, keywords, synergy, timing),
    });
  });
}

function appendGeneratedSpellSet(cards, faction, titles, rarities, idSegment, offset) {
  titles.forEach((title, index) => {
    const effectIndex = index + offset;
    const rarity = rarities[index];
    const effect = createSpellEffect(rarity, effectIndex, faction.id, title);
    const synergy = createCardSynergy("spell", rarity, effectIndex, faction.id, title, []);
    const timing = createCardTiming("spell", rarity, effectIndex, title, []);
    cards.push({
      id: `${faction.id}-${idSegment}-${index + 1}`,
      name: `${faction.prefix}-${title}`,
      faction: faction.id,
      type: "spell",
      rarity,
      cost: createCostForRarity(rarity, effectIndex, "spell"),
      attack: null,
      health: null,
      effect,
      keywords: [],
      synergy,
      timing,
      description: buildDescription("spell", effect, [], synergy, timing),
    });
  });
}

function appendGeneratedTrainerSet(cards, faction, titles, rarities, idSegment, offset) {
  titles.forEach((title, index) => {
    const effectIndex = index + offset;
    const rarity = rarities[index];
    const effect = createTrainerEffect(rarity, effectIndex, faction.id, title);
    const synergy = createCardSynergy("trainer", rarity, effectIndex, faction.id, title, []);
    const timing = createCardTiming("trainer", rarity, effectIndex, title, []);
    cards.push({
      id: `${faction.id}-${idSegment}-${index + 1}`,
      name: `${title} des ${faction.name}`,
      faction: faction.id,
      type: "trainer",
      rarity,
      cost: createCostForRarity(rarity, effectIndex, "trainer"),
      attack: null,
      health: null,
      effect,
      keywords: [],
      synergy,
      timing,
      description: buildDescription("trainer", effect, [], synergy, timing),
    });
  });
}

function createCostForRarity(rarity, index, type) {
  const base = {
    common: 1,
    rare: 2,
    epic: 4,
    legendary: 6,
    ultra: 7,
    mythic: 8,
    transcendent: 9,
  }[rarity];

  if (type === "spell" || type === "trainer") {
    return Math.min(8, base + (index % 2));
  }

  return Math.min(10, base + (index % 3 === 0 ? 0 : 1));
}

function createUnitStats(cost, rarity, index, factionIndex, keywords = [], title = "") {
  const attackBonus = {
    common: 0,
    rare: 1,
    epic: 1,
    legendary: 2,
    ultra: 2,
    mythic: 3,
    transcendent: 4,
  }[rarity];
  const healthBonus = {
    common: 1,
    rare: 1,
    epic: 2,
    legendary: 2,
    ultra: 3,
    mythic: 4,
    transcendent: 5,
  }[rarity];
  const normalizedTitle = normalizeTitle(title);
  const titleAttackBias = /(jäger|pirscher|assassine|klinge|lanze|falke|wolf|bestie|schreiter)/u.test(normalizedTitle) ? 1 : 0;
  const titleHealthBias = /(wächter|hüter|koloss|titan|archon|primarch|avatar|inkarnation|kathedrale)/u.test(normalizedTitle) ? 1 : 0;

  return {
    attack: Math.max(1, cost + attackBonus + ((index + factionIndex) % 2) + titleAttackBias + (keywords.includes("charge") ? 1 : 0) - (keywords.includes("guard") ? 1 : 0)),
    health: Math.max(1, cost + healthBonus + ((index + factionIndex) % 3) + titleHealthBias + (keywords.includes("guard") ? 2 : 0) + (keywords.includes("regen") ? 1 : 0) + (keywords.includes("lifesteal") ? 1 : 0) - (keywords.includes("charge") ? 1 : 0)),
  };
}

function createUnitEffect(rarity, index, factionId, title) {
  return createGeneratedEffectSet("unit", rarity, index, factionId, title);
}

function createSpellEffect(rarity, index, factionId, title) {
  return createGeneratedEffectSet("spell", rarity, index, factionId, title);
}

function createTrainerEffect(rarity, index, factionId, title) {
  return createGeneratedEffectSet("trainer", rarity, index, factionId, title);
}

function createGeneratedEffectSet(type, rarity, index, factionId, title) {
  const profile = FACTION_CARD_PROFILES[factionId];
  const bias = getTitleBias(title);
  const rarityRank = RARITY_ORDER.indexOf(rarity);
  const seed = createStableSeed(type, rarity, factionId, title, index);
  const basePool = uniqueValues([...bias.effects, ...(profile[`${type}Effects`] || [])]);
  const primaryKind = chooseSeededValue(basePool, seed);
  const effects = [createEffectPayload(primaryKind, rarity, type, seed)];

  if (shouldAddSecondaryEffect(rarityRank, type, seed)) {
    const supportPool = uniqueValues([
      ...getSecondaryEffectPool(type),
      ...bias.effects,
      ...(profile[`${type}Effects`] || []),
    ]).filter((kind) => kind !== primaryKind);
    effects.push(createEffectPayload(chooseSeededValue(supportPool, seed + 17), rarity, type, seed + 17));
  }

  if (rarityRank >= 5 && seed % 5 === 0) {
    const tertiaryPool = getSecondaryEffectPool(type).filter((kind) => !effects.some((entry) => entry.kind === kind));
    if (tertiaryPool.length) {
      effects.push(createEffectPayload(chooseSeededValue(tertiaryPool, seed + 31), rarity, type, seed + 31));
    }
  }

  return effects.length === 1 ? effects[0] : effects;
}

function createEffectPayload(kind, rarity, type, seed) {
  const rarityRank = RARITY_ORDER.indexOf(rarity);

  switch (kind) {
    case "damageHero":
      return { kind, value: 1 + rarityRank + (type !== "unit" ? 1 : 0) + (seed % 2) };
    case "healHero":
      return { kind, value: 2 + rarityRank + (type === "trainer" ? 1 : 0) };
    case "draw":
      return { kind, value: Math.min(4, 1 + Number(rarityRank >= 2) + Number(rarityRank >= 5)) };
    case "gainMana":
      return { kind, value: Math.min(3, 1 + Number(rarityRank >= 4)) };
    case "gainMaxMana":
      return { kind, value: Math.min(2, 1 + Number(rarityRank >= 5)) };
    case "buffBoard":
      return { kind, attack: 1 + Number(rarityRank >= 4), health: Number(rarityRank >= 2) + Number(rarityRank >= 6) };
    case "fortifyBoard":
      return { kind, value: 1 + Math.floor(rarityRank / 2) };
    case "strikeWeakest":
      return { kind, value: 1 + rarityRank + (type === "spell" ? 1 : 0) };
    case "damageAllEnemies":
      return { kind, value: 1 + Math.floor(rarityRank / 2) + Number(type === "spell" && rarityRank >= 4) };
    case "burnWeakest":
      return { kind, value: 1 + Math.floor(rarityRank / 2), turns: 2 + Number(rarityRank >= 4) };
    case "freezeWeakest":
      return { kind, turns: 1 + Number(rarityRank >= 5) };
    case "barrierStrongest":
      return { kind };
    case "healBoard":
      return { kind, value: 2 + Math.floor(rarityRank / 2) };
    case "weakenEnemies":
      return { kind, value: 1 + Number(rarityRank >= 3) + Number(rarityRank >= 6) };
    case "drainHero": {
      const damage = 1 + rarityRank + (type !== "unit" ? 1 : 0);
      return { kind, damage, heal: Math.max(1, Math.floor(damage / 2) + Number(rarityRank >= 4)) };
    }
    case "readyStrongest":
      return { kind, attackBonus: Number(rarityRank >= 3) + Number(rarityRank >= 6) };
    case "empowerUnit":
      return { kind, attack: 1 + Number(rarityRank >= 2) + Number(rarityRank >= 5), health: 1 + Number(rarityRank >= 4) };
    default:
      return { kind: "none" };
  }
}

function shouldAddSecondaryEffect(rarityRank, type, seed) {
  if (rarityRank <= 0) {
    return type === "trainer" && seed % 3 === 0;
  }

  if (rarityRank === 1) {
    return seed % 4 === 0;
  }

  if (rarityRank === 2) {
    return seed % 2 === 0;
  }

  return true;
}

function getSecondaryEffectPool(type) {
  const pools = {
    unit: ["empowerUnit", "readyStrongest", "draw", "healHero", "buffBoard", "fortifyBoard", "burnWeakest", "barrierStrongest"],
    spell: ["draw", "gainMana", "weakenEnemies", "damageHero", "healBoard", "gainMaxMana", "freezeWeakest", "burnWeakest"],
    trainer: ["buffBoard", "healBoard", "gainMaxMana", "draw", "readyStrongest", "healHero", "barrierStrongest"],
  };

  return pools[type];
}

function createUnitKeywords(rarity, index, factionId, title) {
  const profile = FACTION_CARD_PROFILES[factionId];
  const bias = getTitleBias(title);
  const pool = uniqueValues([...bias.keywords, ...profile.keywords]);
  const rank = RARITY_ORDER.indexOf(rarity);
  const seed = createStableSeed("keyword", rarity, factionId, title, index);
  const keywords = [];

  if (!pool.length) {
    return keywords;
  }

  if (rank >= 1 || seed % 5 === 0) {
    keywords.push(chooseSeededValue(pool, seed));
  }

  if (rank >= 4 && (seed % 3 === 0 || bias.keywords.length > 1)) {
    const second = chooseSeededValue(pool.filter((keyword) => keyword !== keywords[0]), seed + 9);
    if (second) {
      keywords.push(second);
    }
  }

  return uniqueValues(keywords).slice(0, 2);
}

function createCardSynergy(type, rarity, index, factionId, title, keywords) {
  const rarityRank = RARITY_ORDER.indexOf(rarity);
  const seed = createStableSeed("synergy", type, rarity, factionId, title, index);

  if (rarityRank === 0 && seed % 4 !== 0) {
    return null;
  }

  const tagPool = getSynergyTagPool(title);
  const keywordPool = keywords.length ? keywords : FACTION_CARD_PROFILES[factionId].keywords;
  const conditionChoices = uniqueValues([
    "diverseFactions",
    "partnerFaction",
    "typeCount",
    "raritySpread",
    "highCostCount",
    "tagCount",
    keywordPool.length ? "keywordCount" : null,
  ]);
  const conditionKind = chooseSeededValue(conditionChoices, seed);

  const condition = buildSynergyCondition(conditionKind, type, factionId, title, keywordPool, tagPool, rarityRank, seed);
  const effectPool = uniqueValues([
    ...getSecondaryEffectPool(type),
    ...FACTION_CARD_PROFILES[factionId][`${type}Effects`],
  ]);
  const bonusKind = chooseSeededValue(effectPool.filter((kind) => !["damageHero", "gainMana"].includes(kind) || rarityRank >= 3), seed + 11);

  return {
    condition,
    bonusEffect: createEffectPayload(bonusKind, rarity, type, seed + 11),
  };
}

function buildSynergyCondition(kind, type, factionId, title, keywordPool, tagPool, rarityRank, seed) {
  switch (kind) {
    case "partnerFaction":
      return { kind, faction: FACTION_PARTNERS[factionId], min: 3 + Number(rarityRank >= 4) };
    case "typeCount":
      return { kind, cardType: chooseSeededValue(["unit", "spell", "trainer"], seed + 5), min: type === "unit" ? 4 + Number(rarityRank >= 4) : 3 + Number(rarityRank >= 4) };
    case "raritySpread":
      return { kind, min: 4 + Number(rarityRank >= 5) };
    case "highCostCount":
      return { kind, min: 5 + Number(rarityRank >= 5) };
    case "keywordCount":
      return { kind, keyword: chooseSeededValue(keywordPool, seed + 7), min: 3 + Number(rarityRank >= 5) };
    case "tagCount":
      return { kind, tag: chooseSeededValue(tagPool.length ? tagPool : ["gelehrte"], seed + 9), min: 2 + Number(rarityRank >= 4) };
    case "diverseFactions":
    default:
      return { kind: "diverseFactions", min: 3 + Number(rarityRank >= 5) };
  }
}

function createCardTiming(type, rarity, index, title, keywords) {
  const rarityRank = RARITY_ORDER.indexOf(rarity);
  const seed = createStableSeed("timing", type, rarity, title, index);
  const normalized = normalizeTitle(title);
  const timing = {};

  if (/(titan|koloss|archon|primarch|apotheose|inkarnation|paradoxon|kathedrale|kaiserin|souverän|weltenhorn)/u.test(normalized)) {
    timing.unlockTurn = Math.min(7, 3 + Math.max(1, rarityRank - 2));
  } else if (rarityRank >= 4 && seed % 4 === 0) {
    timing.unlockTurn = Math.min(6, 2 + Math.max(1, rarityRank - 3));
  }

  if ((type !== "unit" && rarityRank >= 2 && seed % 3 === 0) || (keywords.includes("charge") && rarityRank >= 4)) {
    timing.cooldown = 1 + Number(rarityRank >= 4) + Number(rarityRank >= 6);
  }

  return Object.keys(timing).length ? timing : null;
}

function getSynergyTagPool(title) {
  const normalized = normalizeTitle(title);
  const tags = [];

  if (/(seher|orakel|chronist|archivar|arkanist|richter)/u.test(normalized)) {
    tags.push("gelehrte");
  }

  if (/(wächter|hüter|schild|wache|koloss|archon)/u.test(normalized)) {
    tags.push("hüter");
  }

  if (/(jäger|bestie|falke|wolf|pirscher|schleicher)/u.test(normalized)) {
    tags.push("jäger");
  }

  if (/(banner|herold|kommandant|stratege|waffenmeister|schlachtrufer)/u.test(normalized)) {
    tags.push("führer");
  }

  if (/(ritual|portal|siegel|urteil|nova|komet|zeitsprung|bann)/u.test(normalized)) {
    tags.push("rituale");
  }

  return uniqueValues(tags);
}

function getTitleBias(title) {
  const normalized = normalizeTitle(title);
  const effects = [];
  const keywords = [];

  if (/(wächter|hüter|schild|wache|kathedrale)/u.test(normalized)) {
    effects.push("fortifyBoard", "healBoard", "barrierStrongest");
    keywords.push("guard");
  }

  if (/(seher|orakel|chronist|archivar|lehrmeister|arkanist|richterin)/u.test(normalized)) {
    effects.push("draw", "gainMaxMana");
  }

  if (/(jäger|pirscher|assassine|bestie|falke|wolf|lanze|schleicher|schreiter)/u.test(normalized)) {
    effects.push("strikeWeakest", "damageHero");
    keywords.push("charge");
  }

  if (/(eis|frost|nebel|mond|ozean)/u.test(normalized)) {
    effects.push("freezeWeakest");
  }

  if (/(glut|flammen|asch|brand|donner)/u.test(normalized)) {
    effects.push("burnWeakest");
  }

  if (/(herold|banner|kommandant|stratege|waffenmeister|schlachtrufer|pfadfinder)/u.test(normalized)) {
    effects.push("buffBoard", "readyStrongest");
  }

  if (/(titan|koloss|archon|primarch|avatar|inkarnation|kaiserin|souverän|weltenhorn)/u.test(normalized)) {
    effects.push("damageAllEnemies", "empowerUnit");
    keywords.push("guard");
  }

  if (/(ritual|portal|siegel|urteil|nova|komet|zeitsprung|bann|eklipse)/u.test(normalized)) {
    effects.push("gainMaxMana", "damageAllEnemies", "weakenEnemies");
  }

  if (/(priester|hohepriester|elysion)/u.test(normalized)) {
    effects.push("healBoard", "healHero");
    keywords.push("regen");
  }

  return {
    effects: uniqueValues(effects),
    keywords: uniqueValues(keywords),
  };
}

function normalizeTitle(title) {
  return String(title || "").toLowerCase();
}

function createStableSeed(...parts) {
  return parts.join("|").split("").reduce((value, character) => value + character.charCodeAt(0) * 17, 97);
}

function chooseSeededValue(values, seed) {
  if (!values.length) {
    return null;
  }

  return values[Math.abs(seed) % values.length];
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function buildDescription(type, effect, keywords = [], synergy = null, timing = null) {
  const effects = normalizeEffectList(effect);
  const parts = effects.length
    ? effects.map((entry, index) => describeEffect(type, entry, index))
    : ["Eine solide Karte ohne Zusatzeffekt."];

  if (keywords.length) {
    parts.push(`Schlüsselwörter: ${keywords.map((keyword) => KEYWORD_META[keyword].label).join(", ")}.`);
  }

  if (synergy) {
    parts.push(`Synergie: Aktiv mit ${describeSynergyCondition(synergy.condition)}.`);
  }

  if (timing) {
    parts.push(`Timing: ${describeTiming(timing)}.`);
  }

  return parts.join(" ");
}

function handleProfileDisplaySubmit(event) {
  event.preventDefault();
  if (!currentAccount) {
    return;
  }

  const form = event.currentTarget;
  const display = {
    avatarId: String(form.querySelector('[name="avatarId"]')?.value || ""),
    frameId: String(form.querySelector('[name="frameId"]')?.value || ""),
    titleId: String(form.querySelector('[name="titleId"]')?.value || ""),
  };

  applyProfileDisplayChange(display);
}

function legacyBindFriendsPanelEvents() {
  const containers = [
    elements.friendsSummary,
    elements.friendsListPanel,
    elements.friendsPendingPanel,
    elements.friendsTradePanel,
    elements.friendsDuelPanel,
  ].filter(Boolean);
  const findAll = (selector) => containers.flatMap((container) => [...container.querySelectorAll(selector)]);

  const searchForm = elements.friendsSummary.querySelector("#friendSearchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", handleFriendSearchSubmit);
  }

  findAll("[data-friend-request]").forEach((button) => {
    button.addEventListener("click", () => sendFriendRequest(button.dataset.friendRequest));
  });
  findAll("[data-request-action]").forEach((button) => {
    button.addEventListener("click", () => handleFriendRequestAction(button.dataset.username, button.dataset.requestAction));
  });
  findAll("[data-remove-friend]").forEach((button) => {
    button.addEventListener("click", () => removeFriend(button.dataset.removeFriend));
  });
  findAll("[data-block-user]").forEach((button) => {
    button.addEventListener("click", () => blockFriend(button.dataset.blockUser));
  });
  findAll("[data-unblock-user]").forEach((button) => {
    button.addEventListener("click", () => unblockFriend(button.dataset.unblockUser));
  });
  findAll("[data-trade-target]").forEach((button) => {
    button.addEventListener("click", () => {
      uiState.section = "friends";
      uiState.friendTradeTarget = sanitizeUsername(button.dataset.tradeTarget);
      renderFriends();
      setFriendTradeTarget(button.dataset.tradeTarget);
    });
  });
  findAll("[data-duel-target]").forEach((button) => {
    button.addEventListener("click", () => {
      uiState.section = "friends";
      uiState.friendChallengeTarget = sanitizeUsername(button.dataset.duelTarget);
      renderFriends();
    });
  });

  const tradeForm = elements.friendsTradePanel.querySelector("#friendTradeForm");
  if (tradeForm) {
    tradeForm.addEventListener("submit", handleFriendTradeSubmit);
    const tradeSelect = tradeForm.querySelector('[name="tradeFriend"]');
    if (tradeSelect) {
      tradeSelect.addEventListener("change", () => {
        uiState.friendTradeTarget = sanitizeUsername(tradeSelect.value);
        setFriendTradeTarget(tradeSelect.value);
      });
    }
  }

  findAll("[data-trade-offer-action]").forEach((button) => {
    button.addEventListener("click", () => handleTradeOfferAction(button.dataset.tradeOfferId, button.dataset.tradeOfferAction));
  });

  const challengeForm = elements.friendsDuelPanel.querySelector("#friendChallengeForm");
  if (challengeForm) {
    challengeForm.addEventListener("submit", handleFriendChallengeSubmit);
    const challengeSelect = challengeForm.querySelector('[name="challengeFriend"]');
    if (challengeSelect) {
      challengeSelect.addEventListener("change", () => {
        uiState.friendChallengeTarget = sanitizeUsername(challengeSelect.value);
      });
    }
  }

  findAll("[data-challenge-action]").forEach((button) => {
    button.addEventListener("click", () => handleFriendChallengeAction(button.dataset.challengeId, button.dataset.challengeAction));
  });
}

function legacyRenderProfile() {
  if (!currentAccount) {
    elements.profileSummary.innerHTML = "";
    elements.profileLoadoutPanel.innerHTML = "";
    elements.profileCosmeticsPanel.innerHTML = "";
    return;
  }

  const save = getSave();
  const stats = summarizeSave(save);
  const activeDeck = getActiveDeck();
  const profileLocked = isCurrentUserAdmin();
  const display = getProfileDisplay();
  const inventory = getCosmeticInventory();
  const social = getFriendState();
  const totalOwnedCosmetics = ["avatars", "frames", "titles"].reduce((sum, type) => sum + (inventory[type] || []).length, 0);

  elements.profileSummary.innerHTML = `
    <div class="profile-summary-head">
      <div>
        <p class="eyebrow">${localText("Aktives Profil", "Active profile", "Profil actif")}</p>
        <h3>${escapeHtml(currentAccount.username)}</h3>
        <p class="mini-note">${escapeHtml(localText(
          `Freundescode ${getFriendCode(currentAccount)} · Erstellt am ${formatAccountDate(currentAccount.createdAt)}`,
          `Friend code ${getFriendCode(currentAccount)} · Created on ${formatAccountDate(currentAccount.createdAt)}`,
          `Code ami ${getFriendCode(currentAccount)} · Créé le ${formatAccountDate(currentAccount.createdAt)}`,
        ))}</p>
      </div>
      <span class="status-pill ${profileLocked ? "warn" : "ok"}">${profileLocked ? localText("Fixiert", "Locked", "Verrouillé") : localText("Bearbeitbar", "Editable", "Modifiable")}</span>
    </div>
    ${buildIdentityPreviewMarkup({
      username: currentAccount.username,
      display,
      note: activeDeck
        ? localText(`Aktives Deck: ${activeDeck.name}`, `Active deck: ${activeDeck.name}`, `Deck actif : ${activeDeck.name}`)
        : localText("Noch kein aktives Deck ausgerüstet.", "No active deck equipped yet.", "Aucun deck actif équipé pour le moment."),
    })}
    <div class="profile-stat-grid">
      <article class="profile-stat-card">
        <span>${localText("Gold", "Gold", "Or")}</span>
        <strong>${save.gold}</strong>
      </article>
      <article class="profile-stat-card">
        <span>${localText("Karten gesamt", "Cards owned", "Cartes possédées")}</span>
        <strong>${stats.totalCards}</strong>
      </article>
      <article class="profile-stat-card">
        <span>${localText("Freunde", "Friends", "Amis")}</span>
        <strong>${social.friends.length}</strong>
      </article>
      <article class="profile-stat-card">
        <span>${localText("Kosmetik", "Cosmetics", "Cosmétiques")}</span>
        <strong>${totalOwnedCosmetics}</strong>
      </article>
    </div>
  `;

  elements.profileLoadoutPanel.innerHTML = `
    <p class="eyebrow">${localText("Profil-Loadout", "Profile loadout", "Loadout du profil")}</p>
    <h3>${getCosmeticCollectionTitle()}</h3>
    <div class="profile-loadout-grid">
      ${buildIdentityPreviewMarkup({
        username: currentAccount.username,
        display,
        note: localText("Dieses Set wird in Topbar, Freundesliste und späteren Social-Bereichen angezeigt.", "This loadout appears in the top bar, friend list and future social areas.", "Ce loadout apparaît dans la barre supérieure, la liste d'amis et les futurs espaces sociaux."),
      })}
      <form class="profile-form profile-loadout-form" id="profileDisplayFormDynamic">
        <label>
          <span>${getCosmeticGroupLabel("avatars")}</span>
          <select name="avatarId">${buildCosmeticSelectOptions("avatars", display.avatarId)}</select>
        </label>
        <label>
          <span>${getCosmeticGroupLabel("frames")}</span>
          <select name="frameId">${buildCosmeticSelectOptions("frames", display.frameId)}</select>
        </label>
        <label>
          <span>${getCosmeticGroupLabel("titles")}</span>
          <select name="titleId">${buildCosmeticSelectOptions("titles", display.titleId)}</select>
        </label>
        <div class="form-actions profile-cta-row">
          <button class="primary-button" type="submit">${localText("Profil speichern", "Save profile", "Enregistrer le profil")}</button>
          <button class="secondary-button" type="button" data-shop-section="cosmetics">${localText("Zum Profil-Shop", "Open profile shop", "Ouvrir la boutique profil")}</button>
        </div>
      </form>
    </div>
    <p class="mini-note">${profileLocked
      ? localText("Das Bootstrap-Adminprofil bleibt absichtlich an die reservierte Identität gebunden.", "The bootstrap admin profile intentionally stays bound to the reserved identity.", "Le profil admin bootstrap reste volontairement lié à l'identité réservée.")
      : localText("Änderungen greifen direkt in dein Profil ein und werden serverseitig gespeichert.", "Changes apply to your identity immediately and are saved on the server.", "Les changements s'appliquent immédiatement à ton identité et sont enregistrés côté serveur.")}</p>
  `;

  elements.profileCosmeticsPanel.innerHTML = `
    <p class="eyebrow">${localText("Freigeschaltet", "Unlocked", "Débloqué")}</p>
    <h3>${localText("Deine Profilsammlung", "Your profile collection", "Ta collection de profil")}</h3>
    <div class="cosmetic-group-list">
      ${["avatars", "frames", "titles"].map((type) => `
        <section class="cosmetic-group-block">
          <div class="cosmetic-group-head">
            <div>
              <p class="eyebrow">${escapeHtml(getCosmeticGroupLabel(type))}</p>
              <h4>${escapeHtml(localText("Freigeschaltet", "Owned", "Possédé"))}</h4>
            </div>
            <span class="status-pill turn">${(inventory[type] || []).length}</span>
          </div>
          <div class="cosmetic-owned-grid">
            ${(inventory[type] || []).map((itemId) => buildOwnedCosmeticCardMarkup(type, itemId, type === "avatars" ? display.avatarId : type === "frames" ? display.frameId : display.titleId)).join("")
              || `<article class="empty-state-card"><h4 class="subheading">${localText("Noch leer", "Still empty", "Encore vide")}</h4><p class="mini-note">${localText("Im Profil-Shop kannst du weitere Elemente kaufen.", "You can buy more items in the profile shop.", "Tu peux acheter plus d'éléments dans la boutique profil.")}</p></article>`}
          </div>
        </section>
      `).join("")}
    </div>
  `;

  bindProfileLoadoutPanelEvents();

  if (profileLocked) {
    elements.profileLoadoutPanel.querySelectorAll("select, button").forEach((element) => {
      element.disabled = true;
    });
  }

  elements.profileNameInput.value = currentAccount.username;
  [
    elements.profileNameInput,
    elements.profileRenamePasswordInput,
    elements.profileCurrentPasswordInput,
    elements.profileNewPasswordInput,
    elements.profileConfirmPasswordInput,
  ].forEach((field) => {
    field.disabled = profileLocked;
  });
  [...elements.profileRenameForm.querySelectorAll("button"), ...elements.profilePasswordForm.querySelectorAll("button")].forEach((button) => {
    button.disabled = profileLocked;
  });
}

function legacyRenderFriends() {
  if (!currentAccount) {
    elements.friendsSummary.innerHTML = "";
    elements.friendsListPanel.innerHTML = "";
    elements.friendsPendingPanel.innerHTML = "";
    elements.friendsTradePanel.innerHTML = "";
    elements.friendsDuelPanel.innerHTML = "";
    return;
  }

  const social = getFriendState();
  const networkReady = isServerSessionActive();
  const matchLocked = isMatchSessionLocked();
  const profileFor = (username) => getSocialProfile(username) || getFallbackSocialProfile(username);
  const tradeTarget = getFriendTradeTarget(social);
  const challengeTarget = getFriendChallengeTarget(social);
  const tradeOptions = uiState.friendTradeOptions && canonicalizeUsername(uiState.friendTradeOptions?.target?.username) === canonicalizeUsername(tradeTarget)
    ? uiState.friendTradeOptions
    : null;
  const activeDeck = getActiveDeck();
  const duelValidation = validateDeck(activeDeck);
  const incomingOffers = social.tradeOffersIncoming || [];
  const outgoingOffers = social.tradeOffersOutgoing || [];
  const incomingChallenges = social.duelChallengesIncoming || [];
  const outgoingChallenges = social.duelChallengesOutgoing || [];

  if (networkReady && !uiState.friendsHydrated && !uiState.friendsLoading) {
    queueMicrotask(() => hydrateFriendsSection({ render: true }));
  }

  if (networkReady && tradeTarget && !uiState.friendTradeBusy && !tradeOptions) {
    queueMicrotask(() => setFriendTradeTarget(tradeTarget));
  }

  const buildSearchActions = (profile, relationship) => {
    if (relationship === "friend") {
      return `
        <button class="secondary-button social-action-button" type="button" data-trade-target="${escapeHtml(profile.username)}">${localText("Handeln", "Trade", "Échanger")}</button>
        <button class="primary-button social-action-button" type="button" data-duel-target="${escapeHtml(profile.username)}">${localText("Duell", "Duel", "Duel")}</button>
      `;
    }
    if (relationship === "incoming") {
      return `
        <button class="primary-button social-action-button" type="button" data-request-action="accept" data-username="${escapeHtml(profile.username)}">${localText("Annehmen", "Accept", "Accepter")}</button>
        <button class="secondary-button social-action-button" type="button" data-request-action="decline" data-username="${escapeHtml(profile.username)}">${localText("Ablehnen", "Decline", "Refuser")}</button>
      `;
    }
    if (relationship === "outgoing") {
      return `<button class="secondary-button social-action-button" type="button" data-request-action="cancel" data-username="${escapeHtml(profile.username)}">${localText("Zurückziehen", "Cancel", "Annuler")}</button>`;
    }
    if (relationship === "blocked") {
      return `<button class="secondary-button social-action-button" type="button" data-unblock-user="${escapeHtml(profile.username)}">${localText("Entsperren", "Unblock", "Débloquer")}</button>`;
    }
    return `<button class="primary-button social-action-button" type="button" data-friend-request="${escapeHtml(profile.username)}">${localText("Freund hinzufügen", "Add friend", "Ajouter")}</button>`;
  };

  const searchMarkup = !networkReady
    ? `<article class="empty-state-card"><h4 class="subheading">${localText("Server nötig", "Server required", "Serveur requis")}</h4><p class="mini-note">${localText("Suche, Handel und Duelle laufen nur im Servermodus.", "Search, trading and duels are server-only features.", "La recherche, les échanges et les duels fonctionnent uniquement en mode serveur.")}</p></article>`
    : uiState.friendSearchBusy
      ? `<article class="empty-state-card"><h4 class="subheading">${localText("Suche läuft", "Searching", "Recherche en cours")}</h4><p class="mini-note">${localText("Konten werden gerade durchsucht.", "Searching player accounts right now.", "Les comptes sont en cours de recherche.")}</p></article>`
      : uiState.friendSearchResults.length
        ? `<div class="social-card-grid">${uiState.friendSearchResults.map((result) => buildSocialProfileCardMarkup(result, {
          relationship: result.relationship,
          actionsMarkup: buildSearchActions(result, result.relationship),
          note: result.activeDeckName || localText("Noch kein aktives Deck gespeichert.", "No active deck saved yet.", "Aucun deck actif enregistré."),
        })).join("")}</div>`
        : `<article class="empty-state-card"><h4 class="subheading">${uiState.friendSearchQuery.trim().length >= 2 ? localText("Keine Treffer", "No matches", "Aucun résultat") : localText("Suche starten", "Start searching", "Lancer une recherche")}</h4><p class="mini-note">${uiState.friendSearchQuery.trim().length >= 2 ? localText("Zu dieser Suche wurde kein passendes Konto gefunden.", "No matching account was found for this search.", "Aucun compte correspondant n'a été trouvé pour cette recherche.") : localText("Suche nach Spielernamen oder Freundescode, um Kontakte direkt zu finden.", "Search by player name or friend code to find contacts quickly.", "Recherche par nom du joueur ou code ami pour trouver rapidement des contacts.")}</p></article>`;

  const friendCardsMarkup = social.friends.length
    ? `<div class="social-card-grid">${social.friends.map((username) => buildSocialProfileCardMarkup(profileFor(username), {
      relationship: "friend",
      actionsMarkup: `
        <button class="secondary-button social-action-button" type="button" data-trade-target="${escapeHtml(username)}">${localText("Handel", "Trade", "Échange")}</button>
        <button class="secondary-button social-action-button" type="button" data-duel-target="${escapeHtml(username)}">${localText("Duell", "Duel", "Duel")}</button>
        <button class="secondary-button social-action-button" type="button" data-remove-friend="${escapeHtml(username)}">${localText("Entfernen", "Remove", "Retirer")}</button>
        <button class="secondary-button social-action-button" type="button" data-block-user="${escapeHtml(username)}">${localText("Blockieren", "Block", "Bloquer")}</button>
      `,
      note: profileFor(username).activeDeckName || localText("Bereit für Handel und Freundesduelle.", "Ready for trading and friend duels.", "Prêt pour les échanges et les duels amicaux."),
    })).join("")}</div>`
    : `<article class="empty-state-card"><h4 class="subheading">${localText("Noch keine Freunde", "No friends yet", "Pas encore d'amis")}</h4><p class="mini-note">${localText("Suche oben nach Spielern und schicke deine erste Anfrage direkt aus dem Netzwerk-Panel.", "Use the search above to find players and send your first request directly from the network panel.", "Utilise la recherche ci-dessus pour trouver des joueurs et envoyer ta première demande depuis le panneau réseau.")}</p></article>`;

  const pendingSections = [
    {
      title: localText("Eingehende Anfragen", "Incoming requests", "Demandes reçues"),
      entries: social.incoming,
      renderActions: (username) => `
        <button class="primary-button social-action-button" type="button" data-request-action="accept" data-username="${escapeHtml(username)}">${localText("Annehmen", "Accept", "Accepter")}</button>
        <button class="secondary-button social-action-button" type="button" data-request-action="decline" data-username="${escapeHtml(username)}">${localText("Ablehnen", "Decline", "Refuser")}</button>
      `,
      note: localText("Diese Konten warten auf deine Antwort.", "These accounts are waiting for your response.", "Ces comptes attendent ta réponse."),
    },
    {
      title: localText("Ausgehende Anfragen", "Outgoing requests", "Demandes envoyées"),
      entries: social.outgoing,
      renderActions: (username) => `<button class="secondary-button social-action-button" type="button" data-request-action="cancel" data-username="${escapeHtml(username)}">${localText("Zurückziehen", "Cancel", "Annuler")}</button>`,
      note: localText("Gesendet und noch nicht beantwortet.", "Sent and still unanswered.", "Envoyées et encore sans réponse."),
    },
    {
      title: localText("Blockierte Konten", "Blocked accounts", "Comptes bloqués"),
      entries: social.blocked,
      renderActions: (username) => `<button class="secondary-button social-action-button" type="button" data-unblock-user="${escapeHtml(username)}">${localText("Entsperren", "Unblock", "Débloquer")}</button>`,
      note: localText("Blockierte Konten können weder anfragen noch handeln.", "Blocked accounts can neither request nor trade.", "Les comptes bloqués ne peuvent ni envoyer de demande ni échanger."),
    },
  ];

  const pendingMarkup = pendingSections.map((section) => `
    <section class="social-stack">
      <div class="friends-summary-head">
        <div>
          <p class="eyebrow">${escapeHtml(section.title)}</p>
          <h4>${escapeHtml(section.title)}</h4>
        </div>
        <span class="status-pill turn">${section.entries.length}</span>
      </div>
      ${section.entries.length
        ? `<div class="social-card-grid">${section.entries.map((username) => buildSocialProfileCardMarkup(profileFor(username), {
          actionsMarkup: section.renderActions(username),
          note: section.note,
        })).join("")}</div>`
        : `<article class="empty-state-card"><h4 class="subheading">${localText("Aktuell leer", "Currently empty", "Actuellement vide")}</h4><p class="mini-note">${escapeHtml(section.note)}</p></article>`}
    </section>
  `).join("");

  const offerMarkup = (offer, incoming) => `
    <article class="social-offer-card">
      <div class="friends-summary-head">
        <div>
          <p class="eyebrow">${incoming ? localText("Eingehend", "Incoming", "Entrant") : localText("Ausgehend", "Outgoing", "Sortant")}</p>
          <h4>${escapeHtml((incoming ? offer.from : offer.to) || "")}</h4>
        </div>
        <span class="status-pill turn">${escapeHtml(new Date(offer.createdAt).toLocaleDateString())}</span>
      </div>
      <p class="mini-note">${escapeHtml(localText("Bietet", "Offers", "Propose"))} <strong>${escapeHtml(getTradeCardLabel(offer.offeredCardId))}</strong> · ${escapeHtml(localText("möchte", "wants", "veut"))} <strong>${escapeHtml(getTradeCardLabel(offer.requestedCardId))}</strong></p>
      ${offer.note ? `<p class="mini-note">${escapeHtml(offer.note)}</p>` : ""}
      <div class="social-action-row">
        ${incoming
          ? `
            <button class="primary-button social-action-button" type="button" data-trade-offer-action="accept" data-trade-offer-id="${escapeHtml(offer.id)}">${localText("Annehmen", "Accept", "Accepter")}</button>
            <button class="secondary-button social-action-button" type="button" data-trade-offer-action="decline" data-trade-offer-id="${escapeHtml(offer.id)}">${localText("Ablehnen", "Decline", "Refuser")}</button>
          `
          : `<button class="secondary-button social-action-button" type="button" data-trade-offer-action="cancel" data-trade-offer-id="${escapeHtml(offer.id)}">${localText("Zurückziehen", "Cancel", "Annuler")}</button>`}
      </div>
    </article>
  `;

  const tradeMarkup = !networkReady
    ? `<article class="empty-state-card"><h4 class="subheading">${localText("Server notwendig", "Server required", "Serveur requis")}</h4><p class="mini-note">${localText("Handel läuft vollständig über den Server und steht lokal nicht zur Verfügung.", "Trading runs fully through the server and is unavailable offline.", "Les échanges passent entièrement par le serveur et ne sont pas disponibles hors ligne.")}</p></article>`
    : !social.friends.length
      ? `<article class="empty-state-card"><h4 class="subheading">${localText("Noch keine Handelspartner", "No trade partners yet", "Pas encore de partenaires d'échange")}</h4><p class="mini-note">${localText("Sobald du Freunde hast, kannst du hier Karten gegeneinander tauschen.", "Once you have friends, you can exchange cards here.", "Dès que tu as des amis, tu peux échanger des cartes ici.")}</p></article>`
      : `
        <div class="trade-grid">
          <div class="trade-builder">
            <p class="eyebrow">${localText("Neues Angebot", "New offer", "Nouvelle offre")}</p>
            <h3>${localText("Handel vorbereiten", "Prepare trade", "Préparer un échange")}</h3>
            ${tradeOptions?.target ? buildSocialProfileCardMarkup(tradeOptions.target, {
              relationship: "friend",
              note: tradeOptions.target.activeDeckName || localText("Ausgewählter Handelspartner.", "Selected trading partner.", "Partenaire d'échange sélectionné."),
            }) : `<p class="mini-note">${uiState.friendTradeBusy ? localText("Lade Karten für den Handel …", "Loading trade cards …", "Chargement des cartes d'échange …") : localText("Wähle einen Freund aus, um seine tauschbaren Karten zu laden.", "Choose a friend to load their tradable cards.", "Choisis un ami pour charger ses cartes échangeables.")}</p>`}
            <form class="profile-form" id="friendTradeForm">
              <label>
                <span>${localText("Freund", "Friend", "Ami")}</span>
                <select name="tradeFriend">${social.friends.map((username) => `<option value="${escapeHtml(username)}"${canonicalizeUsername(username) === canonicalizeUsername(tradeTarget) ? " selected" : ""}>${escapeHtml(username)}</option>`).join("")}</select>
              </label>
              <label>
                <span>${localText("Deine Karte", "Your card", "Ta carte")}</span>
                <select name="offeredCardId">
                  <option value="">${localText("Karte wählen", "Choose card", "Choisir une carte")}</option>
                  ${(tradeOptions?.yourCards || []).map((entry) => `<option value="${escapeHtml(entry.cardId)}">${escapeHtml(getTradeCardLabel(entry.cardId))} (${entry.count}×)</option>`).join("")}
                </select>
              </label>
              <label>
                <span>${localText("Gewünschte Karte", "Requested card", "Carte demandée")}</span>
                <select name="requestedCardId">
                  <option value="">${localText("Karte wählen", "Choose card", "Choisir une carte")}</option>
                  ${(tradeOptions?.theirCards || []).map((entry) => `<option value="${escapeHtml(entry.cardId)}">${escapeHtml(getTradeCardLabel(entry.cardId))} (${entry.count}×)</option>`).join("")}
                </select>
              </label>
              <label>
                <span>${localText("Notiz", "Note", "Note")}</span>
                <input type="text" name="tradeNote" maxlength="140" placeholder="${escapeHtml(localText("Kurze Nachricht zum Angebot", "Short note for the offer", "Petit message pour l'offre"))}">
              </label>
              <div class="form-actions">
                <button class="primary-button" type="submit"${matchLocked || uiState.friendTradeBusy ? " disabled" : ""}>${localText("Angebot senden", "Send offer", "Envoyer l'offre")}</button>
              </div>
            </form>
            ${matchLocked ? `<p class="mini-note arena-lock-note">${getUiText("messages.matchCollectionLocked")}</p>` : ""}
          </div>
          <div class="social-stack">
            <p class="eyebrow">${localText("Offene Angebote", "Open offers", "Offres ouvertes")}</p>
            <div class="offer-list">
              ${incomingOffers.map((offer) => offerMarkup(offer, true)).join("")}
              ${outgoingOffers.map((offer) => offerMarkup(offer, false)).join("")}
              ${!incomingOffers.length && !outgoingOffers.length ? `<article class="empty-state-card"><h4 class="subheading">${localText("Noch keine Angebote", "No offers yet", "Pas encore d'offres")}</h4><p class="mini-note">${localText("Hier erscheinen eingehende und ausgehende Tauschangebote.", "Incoming and outgoing trade offers appear here.", "Les offres d'échange entrantes et sortantes apparaissent ici.")}</p></article>` : ""}
            </div>
          </div>
        </div>
      `;

  const challengeMarkup = (challenge, incoming) => `
    <article class="social-offer-card">
      <div class="friends-summary-head">
        <div>
          <p class="eyebrow">${incoming ? localText("Eingehend", "Incoming", "Entrant") : localText("Ausgehend", "Outgoing", "Sortant")}</p>
          <h4>${escapeHtml((incoming ? challenge.from : challenge.to) || "")}</h4>
        </div>
        <span class="status-pill turn">${escapeHtml(challenge.deckName || localText("Deck", "Deck", "Deck"))}</span>
      </div>
      <p class="mini-note">${escapeHtml(localText("Deck", "Deck", "Deck"))}: ${escapeHtml(challenge.deckName || localText("Unbenannt", "Unnamed", "Sans nom"))} · ${escapeHtml(localText("Karten", "Cards", "Cartes"))}: ${(challenge.deckCards || []).length}</p>
      <div class="social-action-row">
        ${incoming
          ? `
            <button class="primary-button social-action-button" type="button" data-challenge-action="accept" data-challenge-id="${escapeHtml(challenge.id)}"${matchLocked ? " disabled" : ""}>${localText("Duell starten", "Start duel", "Lancer le duel")}</button>
            <button class="secondary-button social-action-button" type="button" data-challenge-action="decline" data-challenge-id="${escapeHtml(challenge.id)}">${localText("Ablehnen", "Decline", "Refuser")}</button>
          `
          : `<button class="secondary-button social-action-button" type="button" data-challenge-action="cancel" data-challenge-id="${escapeHtml(challenge.id)}">${localText("Zurückziehen", "Cancel", "Annuler")}</button>`}
      </div>
    </article>
  `;

  const duelMarkup = !networkReady
    ? `<article class="empty-state-card"><h4 class="subheading">${localText("Server notwendig", "Server required", "Serveur requis")}</h4><p class="mini-note">${localText("Freundesduelle brauchen Serverdaten für Deck und Gegnerstatus.", "Friend duels need server data for decks and opponent state.", "Les duels amicaux ont besoin des données serveur pour le deck et l'état adverse.")}</p></article>`
    : !social.friends.length
      ? `<article class="empty-state-card"><h4 class="subheading">${localText("Noch kein Duel-Partner", "No duel partner yet", "Pas encore de partenaire de duel")}</h4><p class="mini-note">${localText("Bestätigte Freunde können direkt mit deinem aktiven Deck herausgefordert werden.", "Confirmed friends can be challenged directly with your active deck.", "Les amis confirmés peuvent être défiés directement avec ton deck actif.")}</p></article>`
      : `
        <div class="trade-grid">
          <div class="duel-builder">
            <p class="eyebrow">${localText("Freundesduell", "Friend duel", "Duel amical")}</p>
            <h3>${localText("Herausforderung senden", "Send challenge", "Envoyer un défi")}</h3>
            <p class="mini-note">${duelValidation.valid
              ? localText(`Aktives Deck: ${activeDeck.name}`, `Active deck: ${activeDeck.name}`, `Deck actif : ${activeDeck.name}`)
              : duelValidation.messages[0] || getUiText("messages.matchNotPlayable")}</p>
            <form class="profile-form" id="friendChallengeForm">
              <label>
                <span>${localText("Freund", "Friend", "Ami")}</span>
                <select name="challengeFriend">${social.friends.map((username) => `<option value="${escapeHtml(username)}"${canonicalizeUsername(username) === canonicalizeUsername(challengeTarget) ? " selected" : ""}>${escapeHtml(username)}</option>`).join("")}</select>
              </label>
              <div class="form-actions">
                <button class="primary-button" type="submit"${!duelValidation.valid || matchLocked || uiState.friendChallengeBusy ? " disabled" : ""}>${localText("Herausfordern", "Challenge", "Défier")}</button>
              </div>
            </form>
            ${matchLocked ? `<p class="mini-note arena-lock-note">${localText("Während eines laufenden Matches kannst du kein neues Freundesduell starten.", "You cannot start a new friend duel during an active match.", "Tu ne peux pas lancer un nouveau duel amical pendant un match en cours.")}</p>` : ""}
          </div>
          <div class="social-stack">
            <p class="eyebrow">${localText("Offene Duelle", "Open duels", "Duels ouverts")}</p>
            <div class="offer-list">
              ${incomingChallenges.map((challenge) => challengeMarkup(challenge, true)).join("")}
              ${outgoingChallenges.map((challenge) => challengeMarkup(challenge, false)).join("")}
              ${!incomingChallenges.length && !outgoingChallenges.length ? `<article class="empty-state-card"><h4 class="subheading">${localText("Noch keine Herausforderungen", "No challenges yet", "Pas encore de défis")}</h4><p class="mini-note">${localText("Eingehende und ausgehende Freundesduelle erscheinen hier.", "Incoming and outgoing friend duels appear here.", "Les duels amicaux entrants et sortants apparaissent ici.")}</p></article>` : ""}
            </div>
          </div>
        </div>
      `;

  elements.friendsSummary.innerHTML = `
    <div class="friends-summary-head">
      <div>
        <p class="eyebrow">${localText("Netzwerk", "Network", "Réseau")}</p>
        <h3>${escapeHtml(localText(`Freundescode ${getFriendCode(currentAccount)}`, `Friend code ${getFriendCode(currentAccount)}`, `Code ami ${getFriendCode(currentAccount)}`))}</h3>
        <p class="mini-note">${networkReady
          ? localText("Suche Konten, baue Kontakte auf und starte sichere Server-Duelle direkt aus diesem Bereich.", "Search accounts, build contacts and launch secure server duels from this hub.", "Recherche des comptes, crée des contacts et lance des duels serveur sécurisés depuis ce hub.")
          : localText("Der Bereich ist sichtbar, aber Suche, Handel und Duelle werden erst im Servermodus aktiv.", "The area is visible, but search, trading and duels activate only in server mode.", "La zone est visible, mais la recherche, les échanges et les duels ne s'activent qu'en mode serveur.")}</p>
      </div>
      <span class="status-pill ${networkReady ? "ok" : "warn"}">${networkReady ? localText("Live", "Live", "Live") : localText("Lokal", "Local", "Local")}</span>
    </div>
    <div class="friends-stat-grid">
      <article class="profile-stat-card"><span>${localText("Freunde", "Friends", "Amis")}</span><strong>${social.friends.length}</strong></article>
      <article class="profile-stat-card"><span>${localText("Anfragen", "Requests", "Demandes")}</span><strong>${social.incoming.length + social.outgoing.length}</strong></article>
      <article class="profile-stat-card"><span>${localText("Handelsangebote", "Trade offers", "Offres d'échange")}</span><strong>${incomingOffers.length + outgoingOffers.length}</strong></article>
      <article class="profile-stat-card"><span>${localText("Freundesduelle", "Friend duels", "Duels amicaux")}</span><strong>${incomingChallenges.length + outgoingChallenges.length}</strong></article>
    </div>
    <form class="friend-search-form" id="friendSearchForm">
      <label class="wide-field">
        <span>${localText("Spieler suchen", "Search players", "Rechercher des joueurs")}</span>
        <input type="search" name="friendSearch" value="${escapeHtml(uiState.friendSearchQuery || "")}" placeholder="${escapeHtml(localText("Spielername oder Freundescode", "Player name or friend code", "Nom du joueur ou code ami"))}"${networkReady ? "" : " disabled"}>
      </label>
      <button class="primary-button" type="submit"${networkReady ? "" : " disabled"}>${localText("Suchen", "Search", "Rechercher")}</button>
    </form>
    ${searchMarkup}
  `;

  elements.friendsListPanel.innerHTML = `
    <p class="eyebrow">${localText("Freundesliste", "Friend list", "Liste d'amis")}</p>
    <h3>${localText("Bestätigte Kontakte", "Confirmed contacts", "Contacts confirmés")}</h3>
    ${friendCardsMarkup}
  `;

  elements.friendsPendingPanel.innerHTML = `
    <p class="eyebrow">${localText("Anfragen und Moderation", "Requests and moderation", "Demandes et modération")}</p>
    <h3>${localText("Offene Signale im Netzwerk", "Open network signals", "Signaux ouverts du réseau")}</h3>
    <div class="social-stack">${pendingMarkup}</div>
  `;

  elements.friendsTradePanel.innerHTML = `
    <p class="eyebrow">${localText("Handel", "Trading", "Échange")}</p>
    <h3>${localText("Karten sicher tauschen", "Trade cards safely", "Échanger des cartes en sécurité")}</h3>
    ${tradeMarkup}
  `;

  elements.friendsDuelPanel.innerHTML = `
    <p class="eyebrow">${localText("Duelle", "Duels", "Duels")}</p>
    <h3>${localText("Gegen Freunde antreten", "Play against friends", "Affronter des amis")}</h3>
    ${duelMarkup}
  `;

  bindFriendsPanelEvents();
}

function legacyRenderShop() {
  if (!currentAccount) {
    return;
  }

  const activeTabId = getShopTabId(getSave().shopTab);
  const activeTab = SHOP_TAB_DEFINITIONS[activeTabId];
  const boosterDefinitions = Object.values(PACK_DEFINITIONS);
  const bundleDefinitions = Object.values(SHOP_BUNDLE_DEFINITIONS);
  const cosmeticEntries = ["avatars", "frames", "titles"].flatMap((type) => (COSMETIC_DEFINITIONS[type] || []).map((item) => ({ type, item })));
  const boosterPrices = boosterDefinitions.map((pack) => pack.price);
  const bundlePrices = bundleDefinitions.map((bundle) => bundle.price);
  const guaranteedCounts = bundleDefinitions.map((bundle) => bundle.guaranteedCards.reduce((sum, entry) => sum + Number(entry.amount || 0), 0));
  const includedBoosterCounts = bundleDefinitions.map((bundle) => bundle.includedBoosters.reduce((sum, entry) => sum + Number(entry.amount || 0), 0));
  const cosmeticPrices = cosmeticEntries.map((entry) => entry.item.price);
  const ownedCosmetics = cosmeticEntries.filter(({ type, item }) => (getCosmeticInventory()[type] || []).includes(item.id)).length;

  elements.shopTabRow.innerHTML = "";
  elements.shopPackGrid.innerHTML = "";
  elements.shopBundleGrid.innerHTML = "";
  elements.shopCosmeticGrid.innerHTML = "";
  elements.futureShopGrid.innerHTML = "";

  Object.values(SHOP_TAB_DEFINITIONS).forEach((tab) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `shop-tab-button${tab.id === activeTabId ? " active" : ""}`;
    button.innerHTML = `
      <strong>${getUiText(`shop.tabs.${tab.id}`)}</strong>
      <span>${getUiText(`shop.teasers.${tab.id}`)}</span>
    `;
    button.addEventListener("click", () => {
      if (getSave().shopTab === tab.id) {
        return;
      }
      getSave().shopTab = tab.id;
      persistCurrentAccount();
      renderShop();
    });
    elements.shopTabRow.append(button);
  });

  elements.shopCatalogHeading.textContent = getUiText(activeTab.headingKey);
  elements.shopCatalogNote.textContent = getUiText(activeTab.noteKey);
  elements.shopPackGrid.classList.toggle("hidden", activeTabId !== "boosters");
  elements.shopBundleGrid.classList.toggle("hidden", activeTabId !== "packs");
  elements.shopCosmeticGrid.classList.toggle("hidden", activeTabId !== "cosmetics");

  if (activeTabId === "boosters") {
    boosterDefinitions.forEach((pack) => {
      elements.shopPackGrid.append(createPackCard(pack.id, "shop"));
    });
  } else if (activeTabId === "packs") {
    bundleDefinitions.forEach((bundle) => {
      elements.shopBundleGrid.append(createShopBundleCard(bundle.id));
    });
  } else {
    cosmeticEntries.forEach(({ type, item }) => {
      elements.shopCosmeticGrid.append(createCosmeticShopCard(type, item.id));
    });
  }

  const summaryCards = activeTabId === "boosters"
    ? [
      {
        title: getUiText("shop.summaryOffers"),
        value: `${boosterDefinitions.length}`,
        text: localText("Booster-Stufen", "Booster tiers", "Paliers de boosters"),
      },
      {
        title: getUiText("shop.summaryGuaranteed"),
        value: `${getRarityLabel(PACK_DEFINITIONS.starter.guaranteed)} → ${getRarityLabel((PACK_DEFINITIONS.singularity || PACK_DEFINITIONS.astral).guaranteed)}`,
        text: localText("Garantierte Mindestseltenheit steigt pro Stufe", "Rarity floor rises with each tier", "Le palier minimum monte avec chaque niveau"),
      },
      {
        title: getUiText("shop.summaryBoosters"),
        value: "5",
        text: localText("Karten pro Booster", "Cards per booster", "Cartes par booster"),
      },
      {
        title: getUiText("shop.summaryPricing"),
        value: `${Math.min(...boosterPrices)}–${Math.max(...boosterPrices)}`,
        text: getCurrencyLabel(),
      },
    ]
    : activeTabId === "packs"
      ? [
        {
          title: getUiText("shop.summaryOffers"),
          value: `${bundleDefinitions.length}`,
          text: localText("fertige Themen-Packs", "ready-made themed packs", "packs thématiques prêts"),
        },
        {
          title: getUiText("shop.summaryGuaranteed"),
          value: `${Math.min(...guaranteedCounts)}–${Math.max(...guaranteedCounts)}`,
          text: localText("feste garantierte Karten", "fixed guaranteed cards", "cartes garanties fixes"),
        },
        {
          title: getUiText("shop.summaryBoosters"),
          value: `${Math.min(...includedBoosterCounts)}–${Math.max(...includedBoosterCounts)}`,
          text: localText("Booster enthalten", "boosters included", "boosters inclus"),
        },
        {
          title: getUiText("shop.summaryPricing"),
          value: `${Math.min(...bundlePrices)}–${Math.max(...bundlePrices)}`,
          text: getCurrencyLabel(),
        },
      ]
      : [
        {
          title: getUiText("shop.summaryOffers"),
          value: `${cosmeticEntries.length}`,
          text: localText("Profilelemente", "profile items", "éléments de profil"),
        },
        {
          title: localText("Freigeschaltet", "Unlocked", "Débloqué"),
          value: `${ownedCosmetics}`,
          text: localText("bereits in deinem Besitz", "already in your inventory", "déjà dans ton inventaire"),
        },
        {
          title: localText("Kategorien", "Categories", "Catégories"),
          value: "3",
          text: `${getCosmeticGroupLabel("avatars")} · ${getCosmeticGroupLabel("frames")} · ${getCosmeticGroupLabel("titles")}`,
        },
        {
          title: getUiText("shop.summaryPricing"),
          value: `${Math.min(...cosmeticPrices)}–${Math.max(...cosmeticPrices)}`,
          text: getCurrencyLabel(),
        },
      ];

  const summaryTitle = activeTabId === "boosters"
    ? getUiText("shop.tabHeadingBoosters")
    : activeTabId === "packs"
      ? getUiText("shop.tabHeadingPacks")
      : getUiText("shop.tabHeadingCosmetics");

  elements.shopSummaryPanel.innerHTML = `
    <p class="eyebrow">${getUiText(activeTab.summaryTitleKey)}</p>
    <h3>${summaryTitle}</h3>
    <p class="mini-note">${activeTabId === "cosmetics"
      ? localText("Profilobjekte greifen direkt in Topbar, Profil und Freundesliste ein.", "Profile items feed directly into the top bar, profile and friend list.", "Les objets de profil alimentent directement la barre supérieure, le profil et la liste d'amis.")
      : getUiText("shop.summaryModuleNote")}</p>
    <div class="shop-summary-grid">
      ${summaryCards.map((card) => `
        <article class="shop-summary-card">
          <p class="eyebrow">${card.title}</p>
          <strong>${card.value}</strong>
          <span>${card.text}</span>
        </article>
      `).join("")}
    </div>
  `;

  elements.shopFutureHeading.textContent = activeTabId === "cosmetics"
    ? localText("Kollektionen im Fokus", "Featured collections", "Collections en vedette")
    : localText("Shop-Kompass", "Shop guide", "Guide de la boutique");

  const spotlightCards = activeTabId === "boosters"
    ? [
      { title: localText("Einstieg", "Entry", "Entrée"), copy: localText("Starter- und Markt-Booster decken die frühe Sammlung am effizientesten ab.", "Starter and Market boosters cover early collection growth most efficiently.", "Les boosters starter et marché couvrent le début de collection le plus efficacement.") },
      { title: localText("Jagd nach Seltenheit", "Rare chase", "Chasse aux raretés"), copy: localText("Relikt- und Astral-Booster bündeln die beste Chance auf die höchsten Seltenheiten.", "Relic and Astral boosters carry the strongest odds for top rarities.", "Les boosters relique et astral offrent les meilleures chances sur les raretés élevées.") },
      { title: localText("Öffnen-Tab", "Open tab", "Ouvrir"), copy: localText("Gekaufte Booster landen sofort im Öffnen-Bereich und können dort nacheinander geöffnet werden.", "Purchased boosters go straight into the opening area and can be opened there one by one.", "Les boosters achetés arrivent directement dans la zone d'ouverture et peuvent être ouverts un par un.") },
    ]
    : activeTabId === "packs"
      ? [
        { title: localText("Garantien", "Guarantees", "Garanties"), copy: localText("Packs kombinieren feste Karten mit Bonus-Boostern und sparen dir langes Suchen nach Kernkarten.", "Packs combine fixed cards with bonus boosters and save you from hunting for core cards too long.", "Les packs combinent cartes fixes et boosters bonus pour t'éviter de trop chasser les cartes clés.") },
        { title: localText("Fraktionsfokus", "Faction focus", "Focus faction"), copy: localText("Jedes Pack baut gezielt eine Fraktion aus und ergänzt sie mit passenden Zufallspulls.", "Each pack focuses on one faction and backs it up with matching random pulls.", "Chaque pack renforce une faction précise et la complète avec des tirages adaptés.") },
        { title: localText("Direkte Lieferung", "Direct delivery", "Livraison directe"), copy: localText("Garantierte Karten gehen sofort in deine Sammlung, Booster direkt in dein Inventar.", "Guaranteed cards go straight into your collection, boosters directly into your inventory.", "Les cartes garanties vont directement dans ta collection, les boosters dans ton inventaire.") },
      ]
      : [
        { title: getCosmeticGroupLabel("avatars"), copy: localText("Profilbilder sind dein schnellster Wiedererkennungspunkt in Topbar und Freundenetz.", "Avatars are your fastest recognition layer in the top bar and friend network.", "Les avatars sont ton repère visuel le plus rapide dans la barre supérieure et le réseau d'amis.") },
        { title: getCosmeticGroupLabel("frames"), copy: localText("Rahmen definieren die Stimmung deines Profils und geben der Vorschau ihren Look.", "Frames define your profile mood and shape the preview look.", "Les cadres définissent l'ambiance de ton profil et le style de l'aperçu.") },
        { title: getCosmeticGroupLabel("titles"), copy: localText("Titel liefern auf einen Blick einen Rollenton für Sammlung, Handel und Duelle.", "Titles give your collection, trading and duel profile an instant role tone.", "Les titres donnent immédiatement une tonalité à ton profil de collection, d'échange et de duel.") },
      ];

  spotlightCards.forEach((item) => {
    const card = document.createElement("article");
    card.className = "future-card";
    card.innerHTML = `<h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.copy)}</p>`;
    elements.futureShopGrid.append(card);
  });
}

function legacySanitizeSavedMatchState(match) {
  if (!match || typeof match !== "object") {
    return null;
  }

  const player = sanitizeMatchSide(match.player);
  const enemy = sanitizeMatchSide(match.enemy);
  if (!player || !enemy) {
    return null;
  }

  const statuses = new Set(["active", "won", "lost"]);
  const phases = new Set(["player", "enemy"]);
  const mode = match.mode === "friend" ? "friend" : "arena";
  const difficultyId = getArenaDifficultyId(match.difficultyId);
  const difficulty = getArenaDifficulty(difficultyId);
  const log = Array.isArray(match.log)
    ? match.log
      .slice(-120)
      .map((entry) => ({
        turn: String(entry?.turn || "").slice(0, 40) || `Runde ${sanitizeFiniteInteger(match.turn, 0, 0, 999)}`,
        text: String(entry?.text || "").slice(0, 240),
      }))
      .filter((entry) => entry.text)
    : [];
  const highestUid = Math.max(
    0,
    ...player.board.map((unit) => unit.uid || 0),
    ...enemy.board.map((unit) => unit.uid || 0),
  );
  let status = statuses.has(match.status) ? match.status : "active";

  if (status === "active" && (player.hero <= 0 || enemy.hero <= 0)) {
    status = player.hero <= 0 ? "lost" : "won";
  }

  return {
    difficultyId,
    recommendedDifficultyId: mode === "friend" ? difficultyId : getArenaDifficultyId(match.recommendedDifficultyId || match.difficultyId),
    antiFarmGap: mode === "friend" ? 0 : sanitizeFiniteInteger(match.antiFarmGap, 0, 0, 3),
    antiFarmActive: mode === "friend" ? false : Boolean(match.antiFarmActive),
    rewardWin: sanitizeFiniteInteger(match.rewardWin, mode === "friend" ? 0 : difficulty.rewardWin, 0, SECURITY_LIMITS.maxGold),
    rewardLoss: sanitizeFiniteInteger(match.rewardLoss, mode === "friend" ? 0 : difficulty.rewardLoss, 0, SECURITY_LIMITS.maxGold),
    forfeitPenalty: sanitizeFiniteInteger(match.forfeitPenalty, mode === "friend" ? 0 : difficulty.forfeitPenalty, 0, SECURITY_LIMITS.maxGold),
    mode,
    opponentLabel: String(match.opponentLabel || "").slice(0, 32),
    opponentDeckName: String(match.opponentDeckName || "").slice(0, 48),
    turn: sanitizeFiniteInteger(match.turn, 0, 0, 999),
    phase: phases.has(match.phase) ? match.phase : "player",
    status,
    statusMessage: String(match.statusMessage || "").slice(0, 240),
    log,
    uidCounter: sanitizeFiniteInteger(match.uidCounter, highestUid, highestUid, 99999),
    player,
    enemy,
  };
}

function legacyClearMatch() {
  const match = uiState.match;
  if (match?.status === "active") {
    if (match.mode === "friend") {
      if (!requestActionConfirmation(localText("Freundesduell wirklich verlassen?", "Leave the friend duel?", "Quitter ce duel amical ?"))) {
        return;
      }
      uiState.modalCardId = null;
      uiState.match = null;
      persistCurrentAccount();
      renderAll();
      showToast(localText("Freundesduell beendet.", "Friend duel closed.", "Duel amical fermé."));
      return;
    }

    if (getDeckModeId(match.deckMode) === DECK_MODES.hardcore) {
      if (!requestActionConfirmation(localText(
        "Wenn du das Hardcore-Match jetzt verlässt, zählt das als Niederlage und du verlierst alle Karten aus deinem Hardcore-Deck. Wirklich aufgeben?",
        "Leaving the hardcore match counts as a defeat and destroys every card from your hardcore deck. Really forfeit?",
        "Quitter ce match hardcore compte comme une défaite et détruit toutes les cartes de ton deck hardcore. Vraiment abandonner ?",
      ))) {
        return;
      }

      finishMatch(
        "lost",
        localText(
          "Hardcore aufgegeben. Das Spezialdeck ist verloren.",
          "Hardcore forfeited. The special deck is lost.",
          "Hardcore abandonné. Le deck spécial est perdu.",
        ),
      );
      renderAll();
      return;
    }

    const difficulty = getArenaDifficulty(match.difficultyId);
    const plannedPenalty = sanitizeFiniteInteger(match.forfeitPenalty, difficulty.forfeitPenalty, 0, SECURITY_LIMITS.maxGold);
    if (!requestActionConfirmation(getUiText("messages.matchForfeitConfirm", {
      difficulty: getArenaDifficultyLabel(difficulty.id),
      gold: plannedPenalty,
    }))) {
      return;
    }

    const deductedGold = Math.min(getSave().gold, plannedPenalty);
    getSave().gold = Math.max(0, getSave().gold - deductedGold);
    trackProgressStat("arenaLosses", 1);
    addRankPoints(-8);
    uiState.modalCardId = null;
    uiState.match = null;
    persistCurrentAccount();
    renderAll();
    showToast(getUiText("messages.matchForfeitPaid", { gold: deductedGold }));
    return;
  }

  uiState.modalCardId = null;
  uiState.match = null;
  persistCurrentAccount();
  renderAll();
}

function legacyCreateMatch(playerDeckCards, difficultyId = getArenaDifficultyId(getSave().arenaDifficulty), options = {}) {
  const friendMode = options.mode === "friend";
  const deckMode = getDeckModeId(options.deckMode || getDeckModeForDifficulty(difficultyId));
  const deckRules = getDeckRules(deckMode);
  const playerDeckProfile = analyzeDeck(playerDeckCards);
  const factionBonus = getFactionDeckBonus(playerDeckProfile, deckMode);
  const difficulty = friendMode
    ? {
      ...getArenaDifficulty(getArenaDifficultyId(difficultyId)),
      id: getArenaDifficultyId(difficultyId),
      recommendedDifficultyId: getArenaDifficultyId(difficultyId),
      antiFarmGap: 0,
      antiFarmActive: false,
      rewardWin: sanitizeFiniteInteger(options.rewardWin, 0, 0, SECURITY_LIMITS.maxGold),
      rewardLoss: sanitizeFiniteInteger(options.rewardLoss, 0, 0, SECURITY_LIMITS.maxGold),
      rankWin: 0,
      rankLoss: 0,
      forfeitPenalty: sanitizeFiniteInteger(options.forfeitPenalty, 0, 0, SECURITY_LIMITS.maxGold),
      enemyHeroBonus: 0,
      enemyBarrier: 0,
      enemyStartingManaBonus: 0,
      enemyOpeningHandDelta: 0,
    }
    : createArenaMatchConfig(playerDeckProfile, difficultyId);
  const enemyDeckCards = friendMode && Array.isArray(options.enemyDeckCards)
    ? options.enemyDeckCards.filter((cardId) => CARD_MAP.has(cardId)).slice(0, deckRules.size)
    : generateEnemyDeck(difficulty.id, deckRules.size);
  const playerStartingMana = friendMode
    ? 1
    : sanitizeFiniteInteger(difficulty.startingMana, APP_CONFIG.startingMana, 0, APP_CONFIG.maxMana);
  const enemyStartingMana = friendMode
    ? 1
    : clamp(
      0,
      APP_CONFIG.maxMana,
      sanitizeFiniteInteger(difficulty.startingMana, APP_CONFIG.startingMana, 0, APP_CONFIG.maxMana)
        + sanitizeFiniteInteger(difficulty.enemyStartingManaBonus, 0, -2, 3),
    );
  const match = {
    difficultyId: difficulty.id,
    recommendedDifficultyId: difficulty.recommendedDifficultyId,
    antiFarmGap: difficulty.antiFarmGap,
    antiFarmActive: difficulty.antiFarmActive,
    rewardWin: difficulty.rewardWin,
    rewardLoss: difficulty.rewardLoss,
    rankWin: sanitizeFiniteInteger(difficulty.rankWin, 0, 0, SECURITY_LIMITS.maxGold),
    rankLoss: sanitizeFiniteInteger(difficulty.rankLoss, 0, 0, SECURITY_LIMITS.maxGold),
    forfeitPenalty: difficulty.forfeitPenalty,
    mode: friendMode ? "friend" : "arena",
    deckMode,
    opponentLabel: friendMode ? String(options.opponentLabel || localText("Freund", "Friend", "Ami")).slice(0, 32) : "",
    opponentDeckName: friendMode ? String(options.opponentDeckName || "").slice(0, 48) : "",
    sourceDeckName: String(options.sourceDeckName || "").slice(0, 48),
    stakedDeck: [...playerDeckCards],
    factionBonus,
    turn: 0,
    phase: "player",
    status: "active",
    statusMessage: friendMode ? localText("Freundesduell gestartet.", "Friend duel started.", "Duel amical lancé.") : getUiText("messages.matchStartStatus"),
    log: [],
    uidCounter: 0,
    player: createSideState(playerDeckCards, {
      startingMaxMana: playerStartingMana,
      startingMana: playerStartingMana,
    }),
    enemy: createSideState(enemyDeckCards, {
      startingMaxMana: enemyStartingMana,
      startingMana: enemyStartingMana,
    }),
  };

  if (!friendMode) {
    match.enemy.hero = Math.max(1, match.enemy.hero + difficulty.enemyHeroBonus);
    match.enemy.heroBarrier = Math.max(0, difficulty.enemyBarrier);
  }

  if (factionBonus) {
    match.player.hero = Math.max(1, match.player.hero + (factionBonus.heroBonus || 0));
    match.player.heroBarrier = Math.max(0, match.player.heroBarrier + (factionBonus.heroBarrier || 0));
    match.player.maxMana = clamp(0, APP_CONFIG.maxMana, match.player.maxMana + (factionBonus.startingManaBonus || 0));
    match.player.mana = Math.max(match.player.mana, match.player.maxMana);
    match.enemy.hero = Math.max(1, match.enemy.hero - (factionBonus.enemyHeroPenalty || 0));
  }

  match.player.deckProfile = playerDeckProfile;
  match.player.deckBonus = factionBonus;
  drawOpeningHands(match, difficulty);
  if (factionBonus?.openingHandDelta) {
    for (let drawIndex = 0; drawIndex < factionBonus.openingHandDelta; drawIndex += 1) {
      drawCard(match.player);
    }
  }
  return match;
}

function legacyFinishMatch(status, message) {
  const save = getSave();
  const match = uiState.match;
  if (!match) {
    return;
  }

  const difficulty = getArenaDifficulty(match.difficultyId);
  const rewardWin = sanitizeFiniteInteger(match.rewardWin, difficulty.rewardWin, 0, SECURITY_LIMITS.maxGold);
  const rewardLoss = sanitizeFiniteInteger(match.rewardLoss, difficulty.rewardLoss, 0, SECURITY_LIMITS.maxGold);
  const rankWin = sanitizeFiniteInteger(match.rankWin, difficulty.rankWin, 0, SECURITY_LIMITS.maxGold);
  const rankLoss = sanitizeFiniteInteger(match.rankLoss, difficulty.rankLoss, 0, SECURITY_LIMITS.maxGold);
  const friendMode = match.mode === "friend";

  match.status = status;
  match.statusMessage = message;
  addLog(message);

  if (!friendMode) {
    if (status === "won") {
      save.gold += rewardWin;
      trackProgressStat("arenaWins", 1);
      trackProgressStat("goldEarned", rewardWin);
      addRankPoints(rankWin);
      if (getDeckModeId(match.deckMode) === DECK_MODES.hardcore) {
        trackProgressStat("hardcoreWins", 1);
      }
      addLog(getUiText("messages.matchRewardWin", { difficulty: getArenaDifficultyLabel(difficulty.id), gold: rewardWin }));
    } else {
      save.gold += rewardLoss;
      trackProgressStat("arenaLosses", 1);
      trackProgressStat("goldEarned", rewardLoss);
      addRankPoints(-rankLoss);
      addLog(getUiText("messages.matchRewardLoss", { difficulty: getArenaDifficultyLabel(difficulty.id), gold: rewardLoss }));
      if (getDeckModeId(match.deckMode) === DECK_MODES.hardcore) {
        const lostCards = applyHardcoreDeckLoss(match.stakedDeck);
        addLog(localText(
          `Hardcore-Strafe: ${lostCards} Karten aus dem Spezialdeck wurden zerstört.`,
          `Hardcore penalty: ${lostCards} cards from the special deck were destroyed.`,
          `Pénalité hardcore : ${lostCards} cartes du deck spécial ont été détruites.`,
        ));
      }
    }
  } else {
    if (status === "won") {
      trackProgressStat("friendWins", 1);
      addRankPoints(10);
    } else {
      trackProgressStat("friendLosses", 1);
    }
    addDuelHistoryEntry(
      status === "won"
        ? localText(`Sieg gegen ${match.opponentLabel || "Freund"}`, `Win against ${match.opponentLabel || "friend"}`, `Victoire contre ${match.opponentLabel || "ami"}`)
        : localText(`Niederlage gegen ${match.opponentLabel || "Freund"}`, `Loss against ${match.opponentLabel || "friend"}`, `Défaite contre ${match.opponentLabel || "ami"}`),
      0,
      status,
    );
    addLog(status === "won"
      ? localText("Du gewinnst das Freundesduell.", "You win the friend duel.", "Tu gagnes le duel amical.")
      : localText("Das Freundesduell geht verloren.", "The friend duel is lost.", "Le duel amical est perdu."));
  }

  persistCurrentAccount();
}

function legacyRenderArena() {
  const difficultyId = getArenaDifficultyId((uiState.match?.difficultyId) || getSave().arenaDifficulty);
  const deckMode = getDeckModeForDifficulty(difficultyId);
  const activeDeck = getDeckByMode(deckMode);
  const validation = validateDeck(activeDeck, deckMode);
  const hasMatch = Boolean(uiState.match);
  const match = uiState.match;
  const isFriendMatch = Boolean(hasMatch && match.mode === "friend");
  const matchFinished = Boolean(match && (match.status === "won" || match.status === "lost"));
  const previewDeckProfile = activeDeck ? analyzeDeck(activeDeck.cards) : null;
  const previewFactionBonus = previewDeckProfile ? getFactionDeckBonus(previewDeckProfile, deckMode) : null;
  const deckRules = getDeckRules(hasMatch ? getDeckModeId(match.deckMode || deckMode) : deckMode);
  const difficulty = hasMatch
    ? {
      ...getArenaDifficulty(difficultyId),
      rewardWin: sanitizeFiniteInteger(match.rewardWin, getArenaDifficulty(difficultyId).rewardWin, 0, SECURITY_LIMITS.maxGold),
      rewardLoss: sanitizeFiniteInteger(match.rewardLoss, getArenaDifficulty(difficultyId).rewardLoss, 0, SECURITY_LIMITS.maxGold),
      forfeitPenalty: sanitizeFiniteInteger(match.forfeitPenalty, getArenaDifficulty(difficultyId).forfeitPenalty, 0, SECURITY_LIMITS.maxGold),
      recommendedDifficultyId: getArenaDifficultyId(match.recommendedDifficultyId || match.difficultyId),
      antiFarmActive: Boolean(match.antiFarmActive),
      antiFarmGap: sanitizeFiniteInteger(match.antiFarmGap, 0, 0, 3),
      powerScore: sanitizeFiniteNumber(match.player?.deckProfile?.powerScore, 0, 0, 999, 1),
    }
    : (previewDeckProfile ? createArenaMatchConfig(previewDeckProfile, difficultyId) : {
      ...getArenaDifficulty(difficultyId),
      recommendedDifficultyId: difficultyId,
      antiFarmActive: false,
      antiFarmGap: 0,
      powerScore: 0,
    });
  const boardDelta = hasMatch ? formatArenaDelta(match.player.board.length, match.enemy.board.length) : "0";
  const handDelta = hasMatch ? formatArenaDelta(match.player.hand.length, match.enemy.hand.length) : "0";
  const lifeDelta = hasMatch ? formatArenaDelta(match.player.hero, match.enemy.hero) : "0";
  const latestLog = hasMatch ? (match.log[match.log.length - 1]?.text || match.statusMessage) : getUiText("arena.startMatchHint");
  const statusTone = !hasMatch
    ? (validation.valid ? "ok" : "warn")
    : matchFinished
      ? (match.status === "won" ? "ok" : "warn")
      : "turn";
  const statusLabel = !hasMatch
    ? (validation.valid ? getUiText("common.ready") : getUiText("arena.notReady"))
    : matchFinished
      ? (match.status === "won" ? getUiText("arena.victory") : getUiText("arena.defeat"))
      : (match.phase === "player" ? getUiText("arena.yourTurn") : getUiText("arena.enemyTurn"));
  const statusTitle = hasMatch
    ? (matchFinished ? match.statusMessage : isFriendMatch ? localText("Freundesduell live", "Friend duel live", "Duel amical en cours") : getUiText("arena.focusMode"))
    : getUiText("arena.noMatch");
  const difficultyNote = isFriendMatch
    ? localText("Dieses Match läuft ohne Arena-Belohnung und ohne Aufgabegebühr.", "This match runs without arena rewards or forfeit fee.", "Ce match se joue sans récompense d'arène ni pénalité d'abandon.")
    : difficultyId === "hardcore"
      ? localText(
        `Hardcore verlangt ein eigenes ${deckRules.size}-Karten-Spezialdeck. Bei Niederlage oder Aufgabe verlierst du alle Karten daraus.`,
        `Hardcore requires its own ${deckRules.size}-card special deck. If you lose or forfeit, you lose every card in it.`,
        `Le mode hardcore exige son propre deck spécial de ${deckRules.size} cartes. En cas de défaite ou d'abandon, tu perds toutes les cartes qu'il contient.`,
      )
    : difficulty.antiFarmActive
      ? `${getUiText("arena.recommended", { difficulty: getArenaDifficultyLabel(difficulty.recommendedDifficultyId) })}. ${getUiText("arena.antiFarmNote", { win: difficulty.rewardWin, loss: difficulty.rewardLoss })}`
      : `${getArenaDifficultyDescription(difficultyId)} ${getUiText("arena.difficultyHint")}`;
  const activeFactionBonus = hasMatch ? match.player?.deckBonus : previewFactionBonus;
  const factionNote = activeFactionBonus ? activeFactionBonus.description : "";
  const statusNote = hasMatch
    ? (matchFinished ? latestLog : isFriendMatch ? localText("Das Duell nutzt das gespeicherte Deck deines Freundes als Gegnerseite.", "The duel uses your friend's stored deck as the opponent side.", "Le duel utilise le deck enregistré de ton ami comme côté adverse.") : getUiText("arena.focusNote"))
    : (validation.valid ? `${difficultyNote} ${factionNote} ${getUiText("arena.readyStart")}` : `${difficultyNote} ${factionNote} ${validation.messages.join(" ")}`);
  const previewSideState = {
    hero: APP_CONFIG.heroHealth,
    heroBarrier: 0,
    mana: 0,
    maxMana: APP_CONFIG.maxMana,
    hand: [],
    board: [],
    deck: new Array(deckRules.size).fill(null),
  };
  const opponentLabel = isFriendMatch
    ? (match.opponentLabel || localText("Freund", "Friend", "Ami"))
    : getUiText("arena.opponent");

  persistCurrentMatchIfNeeded(hasMatch);
  fillSelect(elements.arenaDifficultySelect, Object.values(ARENA_DIFFICULTIES).map((entry) => ({
    value: entry.id,
    label: getArenaDifficultyLabel(entry.id),
  })));
  elements.arenaDifficultySelect.value = difficultyId;
  elements.arenaDifficultySelect.disabled = hasMatch;

  elements.arenaStatus.dataset.matchState = hasMatch ? (matchFinished ? "finished" : "live") : "idle";
  elements.battleHeader.innerHTML = "";
  elements.enemyHeroPanel.innerHTML = "";
  elements.playerHeroPanel.innerHTML = "";
  elements.enemyBoard.innerHTML = "";
  elements.playerBoard.innerHTML = "";
  elements.battleLog.innerHTML = "";
  elements.playerHand.innerHTML = "";
  elements.endTurnButton.disabled = true;
  elements.startMatchButton.disabled = !validation.valid || isMatchSessionLocked();
  elements.resetMatchButton.disabled = !hasMatch;

  const statusChips = [
    `<span class="meta-chip">${hasMatch ? getUiText("arena.round", { turn: match.turn }) : getUiText("arena.noMatch")}</span>`,
    `<span class="meta-chip">${hasMatch ? getUiText("arena.mana", { current: match.player.mana, max: match.player.maxMana }) : getUiText("arena.noHandTitle")}</span>`,
    `<span class="meta-chip">${isFriendMatch ? localText("Freundesduell", "Friend duel", "Duel amical") : getArenaDifficultyLabel(difficultyId)}</span>`,
    `<span class="meta-chip">${getDeckModeTitle(hasMatch ? getDeckModeId(match.deckMode || deckMode) : deckMode)}</span>`,
  ];
  if (isFriendMatch && match?.opponentDeckName) {
    statusChips.push(`<span class="meta-chip">${escapeHtml(match.opponentDeckName)}</span>`);
  }
  if (!isFriendMatch) {
    statusChips.push(
      `<span class="meta-chip">${getUiText("arena.rewardWin", { gold: difficulty.rewardWin })}</span>`,
      `<span class="meta-chip">${getUiText("arena.rewardLoss", { gold: difficulty.rewardLoss })}</span>`,
      `<span class="meta-chip">${getUiText("arena.forfeitPenalty", { gold: difficulty.forfeitPenalty })}</span>`,
    );
    if (difficulty.antiFarmActive) {
      statusChips.push(`<span class="meta-chip">${getUiText("arena.recommended", { difficulty: getArenaDifficultyLabel(difficulty.recommendedDifficultyId) })}</span>`);
    }
  }

  elements.arenaStatus.innerHTML = `
    <div class="arena-status-shell">
      <div class="arena-status-copy">
        <span class="status-pill ${statusTone}">${statusLabel}</span>
        <h3 class="arena-status-title">${statusTitle}</h3>
        <p class="mini-note">${statusNote}</p>
      </div>
      <div class="arena-side-meta">
        ${statusChips.join("")}
      </div>
    </div>
  `;

  elements.battleHeader.innerHTML = `
    <article class="arena-insight-card">
      <p class="eyebrow">${isFriendMatch ? localText("Modus", "Mode", "Mode") : getUiText("arena.difficulty")}</p>
      <strong>${isFriendMatch ? localText("Freundesduell", "Friend duel", "Duel amical") : getArenaDifficultyLabel(difficultyId)}</strong>
      <span>${difficultyNote}</span>
    </article>
    <article class="arena-insight-card">
      <p class="eyebrow">${getUiText("arena.boardControl")}</p>
      <strong>${boardDelta}</strong>
      <span>${getUiText("arena.you")} ${hasMatch ? match.player.board.length : 0} · ${opponentLabel} ${hasMatch ? match.enemy.board.length : 0}</span>
    </article>
    <article class="arena-insight-card">
      <p class="eyebrow">${getUiText("arena.handFlow")}</p>
      <strong>${handDelta}</strong>
      <span>${getUiText("arena.you")} ${hasMatch ? match.player.hand.length : 0} · ${opponentLabel} ${hasMatch ? match.enemy.hand.length : 0}</span>
    </article>
    <article class="arena-insight-card">
      <p class="eyebrow">${getUiText("arena.heroRace")}</p>
      <strong>${lifeDelta}</strong>
      <span>${getUiText("arena.you")} ${hasMatch ? match.player.hero : APP_CONFIG.heroHealth} · ${opponentLabel} ${hasMatch ? match.enemy.hero : APP_CONFIG.heroHealth}</span>
    </article>
    <article class="arena-insight-card">
      <p class="eyebrow">${getUiText("arena.latestLog")}</p>
      <strong>${hasMatch ? getUiText("arena.round", { turn: match.turn }) : getUiText("common.waiting")}</strong>
      <span>${latestLog}</span>
    </article>
    <article class="arena-insight-card">
      <p class="eyebrow">${localText("Deckbonus", "Deck bonus", "Bonus deck")}</p>
      <strong>${escapeHtml(activeFactionBonus?.title || localText("Neutral", "Neutral", "Neutre"))}</strong>
      <span>${escapeHtml(activeFactionBonus?.description || localText("Kein aktiver Fraktionsbonus im aktuellen Deck.", "No active faction bonus in the current deck.", "Aucun bonus de faction actif dans le deck actuel."))}</span>
    </article>
  `;

  if (!hasMatch) {
    renderHeroPanel(elements.enemyHeroPanel, getUiText("arena.opponent"), previewSideState, false);
    renderHeroPanel(elements.playerHeroPanel, getUiText("arena.you"), previewSideState, false);
    renderBoardState(elements.enemyBoard, [], "enemy", false, "enemy");
    renderBoardState(elements.playerBoard, [], "player", false, "player");
    elements.battleLog.innerHTML = `<div class="log-entry latest">${getUiText("arena.startMatchHint")}</div>`;
    elements.playerHand.innerHTML = `<div class="info-panel"><h3 class="subheading">${getUiText("arena.noHandTitle")}</h3><p class="mini-note">${getUiText("arena.noHandText")}</p></div>`;
    return;
  }

  renderHeroPanel(elements.enemyHeroPanel, opponentLabel, match.enemy, match.phase === "enemy");
  renderHeroPanel(elements.playerHeroPanel, getUiText("arena.you"), match.player, match.phase === "player");
  renderBoardState(elements.enemyBoard, match.enemy.board, "enemy", matchFinished, match.phase);
  renderBoardState(elements.playerBoard, match.player.board, "player", matchFinished, match.phase);

  match.log.slice().reverse().forEach((entry, index) => {
    const row = document.createElement("div");
    row.className = `log-entry${index === 0 ? " latest" : ""}`;
    row.innerHTML = `<strong>${entry.turn}</strong> ${entry.text}`;
    elements.battleLog.append(row);
  });

  if (!match.player.hand.length) {
    elements.playerHand.innerHTML = `<div class="info-panel"><h3 class="subheading">${getUiText("arena.noHandTitle")}</h3><p class="mini-note">${getUiText("arena.detailsHint")}</p></div>`;
  } else {
    match.player.hand.forEach((cardId, index) => {
      const card = getCard(cardId);
      const playable = canPlayCard(card, index);
      const restriction = getCardPlayRestriction(card, "player");
      const synergyHint = getSynergyStatusText(card, "player");
      elements.playerHand.append(renderCard(card, {
        context: "hand",
        buttons: [
          {
            label: playable ? getUiText("arena.play") : (restriction || getUiText("arena.tooExpensive")),
            disabled: !playable,
            handler: () => playCard(index),
          },
        ],
        footer: match.phase === "player"
          ? (restriction || synergyHint || getUiText("arena.detailsHint"))
          : getUiText("arena.enemyTurnLocked"),
      }));
    });
  }

  elements.endTurnButton.disabled = match.phase !== "player" || matchFinished;
}

function describeEffect(type, effect, index) {
  const opener = index === 0 ? (type === "unit" ? "Beim Ausspielen" : "Effekt") : "Außerdem";

  switch (effect.kind) {
    case "damageHero":
      return `${opener}: Verursacht ${effect.value} direkten Schaden am gegnerischen Helden.`;
    case "healHero":
      return `${opener}: Heilt deinen Helden um ${effect.value}.`;
    case "draw":
      return `${opener}: Ziehe ${effect.value} Karte${effect.value > 1 ? "n" : ""}.`;
    case "gainMana":
      return `${opener}: Erhalte sofort ${effect.value} zusätzliches Mana.`;
    case "gainMaxMana":
      return `${opener}: Erhöhe dein maximales Mana dauerhaft um ${effect.value}.`;
    case "buffBoard":
      return `${opener}: Deine Einheiten erhalten +${effect.attack}/+${effect.health}.`;
    case "fortifyBoard":
      return `${opener}: Dein Held und alle eigenen Einheiten erhalten +${effect.value} Haltbarkeit.`;
    case "healBoard":
      return `${opener}: Heilt deinen Helden und alle eigenen Einheiten um ${effect.value}.`;
    case "strikeWeakest":
      return `${opener}: Trifft die schwächste gegnerische Einheit oder den Helden für ${effect.value}.`;
    case "damageAllEnemies":
      return `${opener}: Verursacht ${effect.value} Schaden an allen gegnerischen Einheiten.`;
    case "burnWeakest":
      return `${opener}: Belegt die schwächste gegnerische Einheit ${effect.turns} Runden lang mit Brand (${effect.value} Schaden pro Zug).`;
    case "freezeWeakest":
      return `${opener}: Friert die schwächste gegnerische Einheit für ${effect.turns} Runde${effect.turns > 1 ? "n" : ""} ein.`;
    case "barrierStrongest":
      return `${opener}: Gibt deiner stärksten Einheit eine Barriere gegen den nächsten Schaden.`;
    case "weakenEnemies":
      return `${opener}: Verringert den Angriff aller gegnerischen Einheiten um ${effect.value}.`;
    case "drainHero":
      return `${opener}: Entzieht dem gegnerischen Helden ${effect.damage} Leben und heilt dich um ${effect.heal}.`;
    case "readyStrongest":
      return `${opener}: Macht deine stärkste Einheit sofort angreifbar${effect.attackBonus ? ` und gibt ihr +${effect.attackBonus} Angriff` : ""}.`;
    case "empowerUnit":
      return `${opener}: Verstärkt deine zuletzt ausgespielte Einheit um +${effect.attack}/+${effect.health}.`;
    default:
      return `${opener}: Löst einen ungewöhnlichen Effekt aus.`;
  }
}


