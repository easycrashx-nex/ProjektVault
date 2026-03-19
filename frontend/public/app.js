const APP_CONFIG = {
  deckSize: 20,
  baseGold: 260,
  openingHandSize: 4,
  maxMana: 10,
  boardSize: 5,
  heroHealth: 36,
  fatigueBaseDamage: 1,
};

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

const SERVER_RUNTIME = {
  checked: false,
  available: false,
  restoring: false,
};

const SERVER_SYNC = {
  save: Promise.resolve(),
  market: Promise.resolve(),
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

const DEFAULT_FRIEND_STATE = Object.freeze({
  friends: [],
  incoming: [],
  outgoing: [],
  blocked: [],
});

const ARENA_DIFFICULTIES = Object.freeze({
  novice: Object.freeze({
    id: "novice",
    rewardWin: 55,
    rewardLoss: 20,
    forfeitPenalty: 25,
    enemyHeroBonus: -5,
    enemyBarrier: 0,
    enemyOpeningHandDelta: -1,
    enemyStartingManaBonus: 0,
    unitBias: 0.64,
    selectionBias: -0.28,
    rarityRolls: Object.freeze({ legendary: 0.42, ultra: 0.18, mythic: 0.1, transcendent: 0.02 }),
  }),
  standard: Object.freeze({
    id: "standard",
    rewardWin: 90,
    rewardLoss: 35,
    forfeitPenalty: 60,
    enemyHeroBonus: 0,
    enemyBarrier: 0,
    enemyOpeningHandDelta: 0,
    enemyStartingManaBonus: 0,
    unitBias: 0.68,
    selectionBias: 0,
    rarityRolls: Object.freeze({ legendary: 0.68, ultra: 0.42, mythic: 0.25, transcendent: 0.08 }),
  }),
  veteran: Object.freeze({
    id: "veteran",
    rewardWin: 145,
    rewardLoss: 50,
    forfeitPenalty: 100,
    enemyHeroBonus: 6,
    enemyBarrier: 2,
    enemyOpeningHandDelta: 1,
    enemyStartingManaBonus: 1,
    unitBias: 0.71,
    selectionBias: 0.34,
    rarityRolls: Object.freeze({ legendary: 0.82, ultra: 0.56, mythic: 0.36, transcendent: 0.12 }),
  }),
  nightmare: Object.freeze({
    id: "nightmare",
    rewardWin: 230,
    rewardLoss: 70,
    forfeitPenalty: 150,
    enemyHeroBonus: 12,
    enemyBarrier: 4,
    enemyOpeningHandDelta: 1,
    enemyStartingManaBonus: 2,
    unitBias: 0.76,
    selectionBias: 0.6,
    rarityRolls: Object.freeze({ legendary: 0.94, ultra: 0.74, mythic: 0.52, transcendent: 0.2 }),
  }),
});

const SETTINGS_INPUT_MAP = Object.freeze({
  settingsClickEffects: "clickEffects",
  settingsPackEffects: "packEffects",
  settingsReducedMotion: "reducedMotion",
  settingsConfirmActions: "confirmActions",
});

const SUPPORTED_LANGUAGES = Object.freeze(["de", "en", "fr"]);
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
      tier: "Kostenloser Einstieg",
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
      eyebrow: "Arcane Vault Online",
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
      shop: "Shop",
      marketplace: "Marktplatz",
      booster: "Booster öffnen",
      collection: "Sammlung",
      decks: "Decks",
      profile: "Profil",
      friends: "Freunde",
      settings: "Einstellungen",
      admin: "Admin",
      arena: "Arena",
    },
    scene: {
      shop: { eyebrow: "Kuratorenmarkt", title: "Neue Macht wartet hinter jedem Siegel", text: "Shop, Booster und kommende Inhalte liegen wie Auslagen in einer leuchtenden Gewölbehalle vor dir." },
      marketplace: { eyebrow: "Freier Handel", title: "Werte steigen, fallen und kippen jede Stunde", text: "Der Marktplatz soll sich wie eine lebendige Börse anfühlen statt wie eine bloße Verkaufsliste." },
      booster: { eyebrow: "Siegelkammer", title: "Booster sollen wie kleine Rituale wirken", text: "Wähle dein Pack, entzünde die Kammer und lass die Karten mit gestaffeltem Reveal ins Gewölbe fallen." },
      collection: { eyebrow: "Archivgalerie", title: "Deine Sammlung steht im Zentrum", text: "Seltene Karten, Filter, Marktwerte und Deckstatus werden wie eine kuratierte Ausstellung präsentiert." },
      decks: { eyebrow: "Strategiekammer", title: "Deckbau soll sich wie Taktik anfühlen", text: "Gespeicherte Listen, Warnungen und verfügbare Karten sind als modulare Kommandoflächen angeordnet." },
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
      boosterTitle: "Booster auswählen und öffnen",
      collectionTitle: "Alle Karten und Verkaufsoptionen",
      collectionNote: "Karten sind anklickbar. Im Detailfenster kannst du sie prüfen und verkaufen.",
      decksTitle: "Mehrere Decks speichern und prüfen",
      decksNote: "Wenn eine Karte verkauft wurde, bleibt das Deck gespeichert, wird aber als nicht spielbar markiert.",
      profileTitle: "Kontodaten, Sicherheit und Reset",
      profileNote: "Verwalte deinen Namen, dein Passwort und deinen Kontostand zentral über dein Spielkonto.",
      friendsTitle: "Freundesnetz und Handelshub",
      friendsNote: "Behalte deinen Freundescode, Kontakte und den späteren Handelsbereich an einer Stelle im Blick.",
      settingsTitle: "Spielgefühl, Effekte und Bestätigungen anpassen",
      settingsNote: "Die Einstellungen werden pro Konto gespeichert und sind als sauberes eigenes Modul angelegt.",
      adminTitle: "Konten verwalten und Spielstände direkt anpassen",
      adminNote: "Nur für das Administratorkonto sichtbar. Änderungen greifen direkt in die serverseitigen Spielstände.",
      arenaTitle: "Rundenbasiertes Testduell",
    },
    shop: {
      futureItems: [
        { title: "Fraktionsboxen", copy: "Kuratierten Kartenmix, passende Booster und garantierte Fraktionskerne im Paket sichern." },
        { title: "Elite-Bündel", copy: "Hochpreisige Pakete mit starken Karten, Extra-Boostern und direktem Deckfortschritt." },
        { title: "Saisonregale", copy: "Wechselnde Angebote, Themenpakete und spätere Event-Käufe laufen über denselben Shopbereich." },
      ],
    },
    market: {
      search: "Suche",
      searchPlaceholder: "Karte am Marktplatz suchen",
      rarity: "Seltenheit",
      sort: "Sortierung",
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
      spellsMeta: "Zauber {count}",
      trainersMeta: "Trainer {count}",
      playable: "Deck ist spielbar.",
      emptyDeckTitle: "Leeres Deck",
      emptyDeckText: "Füge Karten aus deiner Sammlung hinzu, damit das Deck spielbar wird.",
      add: "Hinzufügen",
      unavailable: "Nicht verfügbar",
      inDeck: "Im Deck {used}/{owned}",
    },
    profile: {
      activeProfile: "Aktives Profil",
      friendCode: "Freundescode {code} · Erstellt am {date}",
      locked: "Fixiert",
      editable: "Bearbeitbar",
      lockedNote: "Das Administratorkonto bleibt absichtlich an die reservierten Bootstrap-Daten gebunden.",
      editableNote: "Namens- und Passwortänderungen prüfen das aktuelle Passwort und aktualisieren die laufende Sitzung direkt mit.",
      renameTitle: "Spielernamen ändern",
      renameNote: "Der neue Name muss 3 bis 18 Zeichen lang sein und darf nicht bereits vergeben sein.",
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
      },
    },
    card: {
      cardInfo: "Karteninfo",
      synergy: "Synergie",
      synergyReady: "Das aktive Deck erfüllt diese Bedingung bereits.",
      synergyMissing: "Das aktive Deck erfüllt diese Bedingung aktuell noch nicht.",
      timing: "Timing",
      ownership: "Besitz und Decks",
      owned: "Im Besitz",
      inActiveDeck: "Im aktiven Deck",
      vendorSell: "Händler-Verkaufswert",
      marketGross: "Marktplatz-Bruttowert",
      marketFee: "Marktplatzgebühr (7 %)",
      marketPayout: "Auszahlung am Marktplatz",
      marketBuy: "Marktplatz-Kaufpreis",
      hourlyMove: "Stündliche Bewegung",
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

function interpolateText(template, values = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
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

function getArenaDifficultyRank(value) {
  return ["novice", "standard", "veteran", "nightmare"].indexOf(getArenaDifficultyId(value));
}

function getRecommendedArenaDifficultyId(profile) {
  const powerScore = Number(profile?.powerScore || 0);
  const eliteCount = Number(profile?.eliteCount || 0);
  const transcendentCount = Number(profile?.rarities?.transcendent || 0);
  const mythicCount = Number(profile?.rarities?.mythic || 0);
  const ultraCount = Number(profile?.rarities?.ultra || 0);

  if (powerScore >= 280 || transcendentCount >= 2 || mythicCount >= 4 || eliteCount >= 10) {
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

function getPackLabel(packId) {
  return PACK_TRANSLATIONS[getCurrentLanguage()]?.[packId]?.label || PACK_TRANSLATIONS.de[packId]?.label || PACK_DEFINITIONS[packId]?.label || packId;
}

function getPackTier(packId) {
  return PACK_TRANSLATIONS[getCurrentLanguage()]?.[packId]?.tier || PACK_TRANSLATIONS.de[packId]?.tier || PACK_DEFINITIONS[packId]?.tier || "";
}

function getPackDescription(packId) {
  return PACK_TRANSLATIONS[getCurrentLanguage()]?.[packId]?.description || PACK_TRANSLATIONS.de[packId]?.description || PACK_DEFINITIONS[packId]?.description || "";
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
  SERVER_SYNC.save = SERVER_SYNC.save
    .catch(() => undefined)
    .then(async () => {
      const response = await apiRequest("/api/game/state", {
        method: "PATCH",
        token: sessionToken,
        body: { save: snapshot },
      });
      mergeServerAccountIntoLocalState(response?.account, sessionToken, { render: false });
      return true;
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
  SERVER_SYNC.market = SERVER_SYNC.market
    .catch(() => undefined)
    .then(async () => {
      const response = await apiRequest("/api/market/state", {
        method: "PATCH",
        token: sessionToken,
        body: { market: marketSnapshot },
      });
      applyServerMarketSnapshot(response?.market);
      return true;
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

function getToggleStateLabel(enabled) {
  return getUiText(enabled ? "common.on" : "common.off");
}

function getMotionStateLabel(reduced) {
  return getUiText(reduced ? "common.reduced" : "common.normal");
}

Object.assign(UI_TEXT.en, {
  auth: {
    eyebrow: "Arcane Vault Online",
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
    shop: "Shop",
    marketplace: "Marketplace",
    booster: "Open Boosters",
    collection: "Collection",
    decks: "Decks",
    profile: "Profile",
    friends: "Friends",
    settings: "Settings",
    admin: "Admin",
    arena: "Arena",
  },
  scene: {
    shop: { eyebrow: "Curated Market", title: "New power waits behind every seal", text: "Shop items, boosters and future content are displayed like wares inside a glowing vault hall." },
    marketplace: { eyebrow: "Open Trade", title: "Values rise, fall and swing every hour", text: "The marketplace should feel like a living exchange instead of a plain sell list." },
    booster: { eyebrow: "Seal Chamber", title: "Boosters should feel like small rituals", text: "Choose your pack, ignite the chamber and let the cards fall into the vault with a staged reveal." },
    collection: { eyebrow: "Archive Gallery", title: "Your collection takes center stage", text: "Rare cards, filters, market values and deck status are presented like a curated exhibition." },
    decks: { eyebrow: "Strategy Chamber", title: "Deckbuilding should feel tactical", text: "Saved lists, warnings and available cards are arranged as modular command surfaces." },
    profile: { eyebrow: "Account Profile", title: "Your account remains its own module", text: "Player name, password and security data stay deliberately separate from collection and match logic." },
    friends: { eyebrow: "Social Preparation", title: "Friends and trading get their own space", text: "Friend lists, invites and future card trading are already prepared as a dedicated module." },
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
    boosterTitle: "Choose and open boosters",
    collectionTitle: "All cards and sell options",
    collectionNote: "Cards are clickable. In the detail view you can inspect and sell them.",
    decksTitle: "Save and validate multiple decks",
    decksNote: "If a card was sold, the deck remains saved but is marked as unplayable.",
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
    search: "Search",
    searchPlaceholder: "Search a marketplace card",
    rarity: "Rarity",
    sort: "Sorting",
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
    spellsMeta: "Spells {count}",
    trainersMeta: "Trainers {count}",
    playable: "Deck is playable.",
    emptyDeckTitle: "Empty deck",
    emptyDeckText: "Add cards from your collection to make the deck playable.",
    add: "Add",
    unavailable: "Unavailable",
    inDeck: "In deck {used}/{owned}",
  },
  profile: {
    activeProfile: "Active profile",
    friendCode: "Friend code {code} · Created on {date}",
    locked: "Locked",
    editable: "Editable",
    lockedNote: "The administrator account intentionally stays bound to the reserved bootstrap data.",
    editableNote: "Name and password changes verify the current password and update the running session immediately.",
    renameTitle: "Change player name",
    renameNote: "The new name must be 3 to 18 characters long and must not already be taken.",
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
    inActiveDeck: "In active deck",
    vendorSell: "Vendor sell value",
    marketGross: "Marketplace gross value",
    marketFee: "Marketplace fee (7%)",
    marketPayout: "Marketplace payout",
    marketBuy: "Marketplace buy price",
    hourlyMove: "Hourly movement",
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
    eyebrow: "Préparation en ligne Arcane Vault",
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
    shop: "Boutique",
    marketplace: "Marché",
    booster: "Ouvrir des boosters",
    collection: "Collection",
    decks: "Decks",
    profile: "Profil",
    friends: "Amis",
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
    boosterTitle: "Choisir et ouvrir des boosters",
    collectionTitle: "Toutes les cartes et options de vente",
    collectionNote: "Les cartes sont cliquables. Dans la vue détail tu peux les vérifier et les vendre.",
    decksTitle: "Sauvegarder et vérifier plusieurs decks",
    decksNote: "Si une carte est vendue, le deck reste sauvegardé mais est marqué comme non jouable.",
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
    search: "Recherche",
    searchPlaceholder: "Chercher une carte au marché",
    rarity: "Rareté",
    sort: "Tri",
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
    spellsMeta: "Sorts {count}",
    trainersMeta: "Entraîneurs {count}",
    playable: "Le deck est jouable.",
    emptyDeckTitle: "Deck vide",
    emptyDeckText: "Ajoute des cartes depuis ta collection pour rendre le deck jouable.",
    add: "Ajouter",
    unavailable: "Indisponible",
    inDeck: "Dans le deck {used}/{owned}",
  },
  profile: {
    activeProfile: "Profil actif",
    friendCode: "Code ami {code} · Créé le {date}",
    locked: "Verrouillé",
    editable: "Modifiable",
    lockedNote: "Le compte administrateur reste volontairement lié aux données bootstrap réservées.",
    editableNote: "Les changements de nom et de mot de passe vérifient le mot de passe actuel et mettent à jour la session immédiatement.",
    renameTitle: "Changer le nom du joueur",
    renameNote: "Le nouveau nom doit comporter entre 3 et 18 caractères et ne doit pas déjà être pris.",
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
    },
  },
  card: {
    cardInfo: "Infos de la carte",
    synergy: "Synergie",
    synergyReady: "Le deck actif remplit déjà cette condition.",
    synergyMissing: "Le deck actif ne remplit pas encore cette condition.",
    timing: "Timing",
    ownership: "Possession et decks",
    owned: "Possédées",
    inActiveDeck: "Dans le deck actif",
    vendorSell: "Valeur de vente marchand",
    marketGross: "Valeur brute du marché",
    marketFee: "Frais du marché (7 %)",
    marketPayout: "Paiement du marché",
    marketBuy: "Prix d'achat du marché",
    hourlyMove: "Variation horaire",
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
  tabs: { boosters: "Booster", packs: "Packs" },
  teasers: {
    boosters: "Klassische Einzelkäufe mit fünf Zufallskarten pro Booster.",
    packs: "Feste Karten plus zusätzliche Booster in einem Kauf.",
  },
  tabHeadingBoosters: "Booster-Angebote",
  tabHeadingPacks: "Packs mit festen Karten und Bonus-Boostern",
  tabNoteBoosters: "Booster bleiben der flexible Weg für einzelne Käufe und zufällige Pulls über alle Seltenheiten hinweg.",
  tabNotePacks: "Packs liefern garantierte Fraktionskarten direkt in deine Sammlung und legen zusätzliche Booster in dein Inventar.",
  summaryTitleBoosters: "Booster-Markt",
  summaryTitlePacks: "Pack-Serien",
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
  tabs: { boosters: "Boosters", packs: "Packs" },
  teasers: {
    boosters: "Classic single purchases with five random cards per booster.",
    packs: "Fixed cards plus extra boosters in one purchase.",
  },
  tabHeadingBoosters: "Booster Offers",
  tabHeadingPacks: "Packs with fixed cards and bonus boosters",
  tabNoteBoosters: "Boosters stay the flexible route for single purchases and random pulls across every rarity.",
  tabNotePacks: "Packs place guaranteed faction cards directly into your collection and add extra boosters to your inventory.",
  summaryTitleBoosters: "Booster Market",
  summaryTitlePacks: "Pack Series",
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
  tabs: { boosters: "Boosters", packs: "Packs" },
  teasers: {
    boosters: "Achats classiques avec cinq cartes aléatoires par booster.",
    packs: "Cartes fixes plus boosters supplémentaires dans un seul achat.",
  },
  tabHeadingBoosters: "Offres de boosters",
  tabHeadingPacks: "Packs avec cartes fixes et boosters bonus",
  tabNoteBoosters: "Les boosters restent la voie flexible pour les achats unitaires et les tirages aléatoires sur toutes les raretés.",
  tabNotePacks: "Les packs placent directement des cartes de faction garanties dans ta collection et ajoutent des boosters à ton inventaire.",
  summaryTitleBoosters: "Marché des boosters",
  summaryTitlePacks: "Séries de packs",
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
    authInvalidUsername: "Bitte verwende einen gültigen Spielernamen mit 3 bis 18 Zeichen.",
    authPasswordMin: "Das Passwort muss mindestens 4 Zeichen lang sein.",
    authReservedUsername: "Dieser Spielername ist reserviert.",
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
    authInvalidUsername: "Please use a valid player name with 3 to 18 characters.",
    authPasswordMin: "The password must be at least 4 characters long.",
    authReservedUsername: "This player name is reserved.",
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
    authInvalidUsername: "Utilise un nom de joueur valide de 3 à 18 caractères.",
    authPasswordMin: "Le mot de passe doit contenir au moins 4 caractères.",
    authReservedUsername: "Ce nom de joueur est réservé.",
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

const CARD_TYPE_GLYPHS = {
  unit: "UN",
  spell: "ZA",
  trainer: "TR",
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

const PACK_DEFINITIONS = {
  starter: {
    id: "starter",
    label: "Starter-Booster",
    tier: "Kostenloser Einstieg",
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

const FUTURE_SHOP_ITEMS = [
  { title: "Kartenhüllen", copy: "Kosmetische Hüllen mit Fraktionsoptik und besonderen Rahmen." },
  { title: "Turnier-Tickets", copy: "Später für Events, Ranglisten und Spezialbelohnungen gedacht." },
  { title: "Account-Dienste", copy: "Profilrahmen, Namensänderungen und saisonale Extras." },
];

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
    const card = [...LEGACY_CARDS, ...TRANSCENDENT_CARDS].find((entry) => entry.id === update.id);
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

  [...LEGACY_CARDS, ...TRANSCENDENT_CARDS].forEach((card) => {
    card.description = buildDescriptionLocal(card.type, card.effect, card.keywords || [], card.synergy || null, card.timing || null, card.deathEffect || null, card.isToken);
  });

  GENERATED_CARDS.length = 0;
  buildGeneratedCards().forEach((card) => GENERATED_CARDS.push(card));
  CARD_POOL.length = 0;
  CARD_POOL.push(...LEGACY_CARDS, ...TRANSCENDENT_CARDS, ...GENERATED_CARDS);
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
    const card = [...LEGACY_CARDS, ...TRANSCENDENT_CARDS].find((entry) => entry.id === update.id);
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

  [...LEGACY_CARDS, ...TRANSCENDENT_CARDS].forEach((card) => {
    card.description = buildDescriptionLocal(card.type, card.effect, card.keywords || [], card.synergy || null, card.timing || null, card.deathEffect || null, card.isToken);
  });

  GENERATED_CARDS.length = 0;
  buildGeneratedCards().forEach((card) => GENERATED_CARDS.push(card));
  CARD_POOL.length = 0;
  CARD_POOL.push(...LEGACY_CARDS, ...TRANSCENDENT_CARDS, ...GENERATED_CARDS);
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
];
const TOKEN_CARD_MAP = new Map(TOKEN_CARDS.map((card) => [card.id, card]));
const TOKEN_IDS_BY_FACTION = TOKEN_CARDS.reduce((map, card) => {
  map[card.faction] = card.id;
  return map;
}, {});

const GENERATED_CARDS = buildGeneratedCards();
const CARD_POOL = [...LEGACY_CARDS, ...TRANSCENDENT_CARDS, ...GENERATED_CARDS];
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
    shop: document.getElementById("shopSection"),
    marketplace: document.getElementById("marketplaceSection"),
    booster: document.getElementById("boosterSection"),
    collection: document.getElementById("collectionSection"),
    decks: document.getElementById("decksSection"),
    profile: document.getElementById("profileSection"),
    friends: document.getElementById("friendsSection"),
    settings: document.getElementById("settingsSection"),
    admin: document.getElementById("adminSection"),
    arena: document.getElementById("arenaSection"),
  },
  playerName: document.getElementById("playerName"),
  resourceBar: document.getElementById("resourceBar"),
  resetLocalDataButton: document.getElementById("resetLocalDataButton"),
  logoutButton: document.getElementById("logoutButton"),
  shopTabRow: document.getElementById("shopTabRow"),
  shopCatalogHeading: document.getElementById("shopCatalogHeading"),
  shopCatalogNote: document.getElementById("shopCatalogNote"),
  shopPackGrid: document.getElementById("shopPackGrid"),
  shopBundleGrid: document.getElementById("shopBundleGrid"),
  shopSummaryPanel: document.getElementById("shopSummaryPanel"),
  shopFutureHeading: document.getElementById("shopFutureHeading"),
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
  renameDeckButton: document.getElementById("renameDeckButton"),
  newDeckButton: document.getElementById("newDeckButton"),
  duplicateDeckButton: document.getElementById("duplicateDeckButton"),
  deleteDeckButton: document.getElementById("deleteDeckButton"),
  activeDeckMeta: document.getElementById("activeDeckMeta"),
  activeDeckWarnings: document.getElementById("activeDeckWarnings"),
  activeDeckList: document.getElementById("activeDeckList"),
  savedDecksList: document.getElementById("savedDecksList"),
  deckCollectionGrid: document.getElementById("deckCollectionGrid"),
  profileSummary: document.getElementById("profileSummary"),
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
  settingsSummary: document.getElementById("settingsSummary"),
  settingsLanguageSelect: document.getElementById("settingsLanguageSelect"),
  settingsClickEffects: document.getElementById("settingsClickEffects"),
  settingsPackEffects: document.getElementById("settingsPackEffects"),
  settingsReducedMotion: document.getElementById("settingsReducedMotion"),
  settingsConfirmActions: document.getElementById("settingsConfirmActions"),
  resetSettingsButton: document.getElementById("resetSettingsButton"),
  adminAccountList: document.getElementById("adminAccountList"),
  adminSelectedSummary: document.getElementById("adminSelectedSummary"),
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
  section: "shop",
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

  ["shop", "marketplace", "booster", "collection", "decks", "profile", "friends", "settings", "admin", "arena"].forEach((section) => {
    document.querySelectorAll(`.nav-button[data-section="${section}"]`).forEach((button) => {
      const label = getUiText(`nav.${section}`);
      if (button.classList.contains("topbar-icon-button")) {
        button.setAttribute("title", label);
        button.setAttribute("aria-label", label);
        const iconText = button.querySelector(".topbar-icon-text");
        if (iconText) {
          iconText.textContent = label;
        }
      } else {
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
  setStaticText("#marketplaceSection .market-toolbar label:nth-of-type(1) span", getUiText("market.search"));
  setStaticText("#marketplaceSection .market-toolbar label:nth-of-type(2) span", getUiText("market.rarity"));
  setStaticText("#marketplaceSection .market-toolbar label:nth-of-type(3) span", getUiText("market.sort"));
  setStaticAttribute("#marketSearchInput", "placeholder", getUiText("market.searchPlaceholder"));

  setStaticText("#boosterSection .section-head .eyebrow", getUiText("nav.booster"));
  setStaticText("#boosterSection .section-head h2", getUiText("sections.boosterTitle"));
  setStaticText("#openSelectedPackButton", getUiText("booster.openSelected"));
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
  setStaticText("#decksSection .deck-toolbar label span", getUiText("decks.activeName"));
  setStaticAttribute("#deckNameInput", "placeholder", getUiText("decks.deckNamePlaceholder"));
  setStaticText("#renameDeckButton", getUiText("decks.saveDeckName"));
  setStaticText("#newDeckButton", getUiText("decks.newDeck"));
  setStaticText("#duplicateDeckButton", getUiText("decks.duplicateDeck"));
  setStaticText("#deleteDeckButton", getUiText("decks.deleteDeck"));
  setStaticText("#decksSection .deck-column:first-child .info-panel:first-child .subheading", getUiText("decks.activeDeckTitle"));
  setStaticText("#decksSection .deck-column:first-child .info-panel:last-child .subheading", getUiText("decks.savedDecksTitle"));
  setStaticText("#decksSection .deck-column:last-child .subheading", getUiText("decks.addCardsTitle"));
  setStaticText("#decksSection .deck-column:last-child .mini-note", getUiText("decks.addCardsNote"));

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
  setStaticText('#adminSection details:nth-of-type(1) > summary', getUiText("admin.economics"));
  setStaticText('#adminSection details:nth-of-type(2) > summary', getUiText("admin.packInventory"));
  setStaticText('#adminSection details:nth-of-type(3) > summary', getUiText("admin.cardCollection"));
  setStaticText('#adminSection details:nth-of-type(4) > summary', getUiText("admin.accountActions"));
  setStaticText("#adminSection details:nth-of-type(1) label span", getUiText("admin.goldAmount"));
  setStaticText("#adminSection details:nth-of-type(2) label:nth-of-type(1) span", getUiText("admin.packType"));
  setStaticText("#adminSection details:nth-of-type(2) label:nth-of-type(2) span", getUiText("admin.packAmount"));
  setStaticText("#adminSection details:nth-of-type(3) label:nth-of-type(1) span", getUiText("admin.card"));
  setStaticText("#adminSection details:nth-of-type(3) label:nth-of-type(2) span", getUiText("admin.cardAmount"));
  setStaticText("#grantGoldButton", getUiText("admin.grantGold"));
  setStaticText("#removeGoldButton", getUiText("admin.removeGold"));
  setStaticText("#grantPackButton", getUiText("admin.grantPack"));
  setStaticText("#removePackButton", getUiText("admin.removePack"));
  setStaticText("#grantCardButton", getUiText("admin.grantCard"));
  setStaticText("#removeCardButton", getUiText("admin.removeCard"));
  setStaticText("#adminSection details:nth-of-type(4) .danger-note", getUiText("admin.dangerNote"));
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

    Object.keys(SETTINGS_INPUT_MAP).forEach((elementKey) => {
      elements[elementKey].addEventListener("change", handleSettingsToggle);
    });
    elements.arenaDifficultySelect.addEventListener("change", handleArenaDifficultyChange);
    elements.settingsLanguageSelect.addEventListener("change", handleLanguageChange);
    elements.resetSettingsButton.addEventListener("click", resetCurrentSettings);

    elements.startMatchButton.addEventListener("click", startMatch);
    elements.endTurnButton.addEventListener("click", endPlayerTurn);
    elements.resetMatchButton.addEventListener("click", clearMatch);

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
  };

  validateDeck = function validateDeck(deck) {
    const messages = [];
    if (!deck) {
      return { valid: false, messages: [getUiText("messages.deckMissing")] };
    }
    if (deck.cards.length !== APP_CONFIG.deckSize) {
      messages.push(getUiText("messages.deckSize", { count: deck.cards.length, size: APP_CONFIG.deckSize }));
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
    const activeDeck = getActiveDeck();
    const deckCopies = countCopiesInArray(activeDeck.cards, cardId);
    return activeDeck.cards.length < APP_CONFIG.deckSize
      && deckCopies < getOwnedCopies(cardId)
      && deckCopies < getDeckCopyLimit(cardId);
  };

  renderHeroPanel = function renderHeroPanel(container, label, sideState, active) {
    const deckCount = Array.isArray(sideState.deck) ? sideState.deck.length : APP_CONFIG.deckSize;
    const healthPct = clamp(0, 100, Math.round((sideState.hero / APP_CONFIG.heroHealth) * 100));
    const manaCap = Math.max(1, sideState.maxMana || APP_CONFIG.maxMana);
    const manaPct = clamp(0, 100, Math.round((sideState.mana / manaCap) * 100));
    const barrierChip = sideState.heroBarrier > 0 ? `<span class="meta-chip">${getUiText("arena.shield", { value: sideState.heroBarrier })}</span>` : "";
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

  createSideState = function createSideState(deckCards) {
    const shuffledDeck = shuffle([...deckCards]);
    return {
      hero: APP_CONFIG.heroHealth,
      heroBarrier: 0,
      maxMana: 0,
      mana: 0,
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

  resolveCombat = function resolveCombat(attacker, owner) {
    const match = uiState.match;
    const enemySide = owner === "player" ? "enemy" : "player";
    const enemy = match[enemySide];
    const actor = match[owner];
    const target = selectWeakestUnit(getAttackableEnemyUnits(owner));
    attacker.canAttack = false;

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

  runEnemyTurn = function runEnemyTurn() {
    const match = uiState.match;
    const enemy = match.enemy;
    let plays = 0;

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
      processTurnEnd("enemy");
    }
    if (match.status === "active") {
      startTurn("player");
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
  const localizedScene = getUiText(`scene.${sceneKey}`) || getUiText("scene.shop");
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
    if (count > copyLimit) {
      messages.push(`${getCard(cardId).name} überschreitet das Decklimit von ${copyLimit}.`);
    }
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

  Object.keys(SETTINGS_INPUT_MAP).forEach((elementKey) => {
    elements[elementKey].addEventListener("change", handleSettingsToggle);
  });
  elements.arenaDifficultySelect.addEventListener("change", handleArenaDifficultyChange);
  elements.settingsLanguageSelect.addEventListener("change", handleLanguageChange);
  elements.resetSettingsButton.addEventListener("click", resetCurrentSettings);

  elements.startMatchButton.addEventListener("click", startMatch);
  elements.endTurnButton.addEventListener("click", endPlayerTurn);
  elements.resetMatchButton.addEventListener("click", clearMatch);

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
  const username = sanitizeUsername(form.get("username"));
  const password = String(form.get("password") || "");

  if (!username) {
    setAuthMessage(getUiText("messages.authInvalidUsername"));
    return;
  }

  if (password.length < 4) {
    setAuthMessage(getUiText("messages.authPasswordMin"));
    return;
  }

  if (username === ADMIN_BOOTSTRAP.username) {
    setAuthMessage(getUiText("messages.authReservedUsername"));
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
  const nextUsername = sanitizeUsername(form.get("username"));
  const currentPassword = String(form.get("currentPassword") || "");
  const storedAccount = database.accounts[currentAccount.username];

  if (!nextUsername) {
    showToast(getUiText("messages.authInvalidUsername"));
    return;
  }

  if (nextUsername === ADMIN_BOOTSTRAP.username) {
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

function sanitizeUsername(value) {
  const username = String(value || "").trim();
  return /^[A-Za-zÄÖÜäöüß0-9_-]{3,18}$/u.test(username) ? username : "";
}

function canonicalizeUsername(value) {
  const username = sanitizeUsername(value);
  return username ? username.normalize("NFKC").toLocaleLowerCase("de") : "";
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

function handleArenaDifficultyChange(event) {
  if (!currentAccount || isMatchSessionLocked()) {
    return;
  }

  getSave().arenaDifficulty = getArenaDifficultyId(event.currentTarget.value);
  persistCurrentAccount();
  renderArena();
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

function sanitizeFriendState(friends, baseFriends) {
  return {
    friends: sanitizeFriendEntries(friends?.friends ?? baseFriends.friends),
    incoming: sanitizeFriendEntries(friends?.incoming ?? baseFriends.incoming),
    outgoing: sanitizeFriendEntries(friends?.outgoing ?? baseFriends.outgoing),
    blocked: sanitizeFriendEntries(friends?.blocked ?? baseFriends.blocked),
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

function sanitizeDecks(decks) {
  if (!Array.isArray(decks) || !decks.length) {
    return [createDeck("Erstes Deck")];
  }

  const seenIds = new Set();
  const normalized = decks
    .slice(0, SECURITY_LIMITS.maxDecks)
    .map((deck, index) => {
      const safeDeck = {
        id: sanitizeDeckId(deck?.id),
        name: sanitizeDeckName(deck?.name, index),
        cards: Array.isArray(deck?.cards)
          ? deck.cards.filter((cardId) => CARD_MAP.has(cardId)).slice(0, APP_CONFIG.deckSize)
          : [],
      };

      while (seenIds.has(safeDeck.id)) {
        safeDeck.id = `deck-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      }

      seenIds.add(safeDeck.id);
      return safeDeck;
    })
    .filter((deck) => deck.cards.length <= APP_CONFIG.deckSize);

  return normalized.length ? normalized : [createDeck("Erstes Deck")];
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
  const tags = sanitizeMatchCountRecord(profile?.tags, null, APP_CONFIG.deckSize);

  return {
    factions,
    types,
    rarities,
    keywords,
    tags,
    highCostCount: sanitizeFiniteInteger(profile?.highCostCount, 0, 0, APP_CONFIG.deckSize),
    keywordCount: sanitizeFiniteInteger(profile?.keywordCount, 0, 0, APP_CONFIG.deckSize * 4),
    synergyCardCount: sanitizeFiniteInteger(profile?.synergyCardCount, 0, 0, APP_CONFIG.deckSize),
    deathEffectCount: sanitizeFiniteInteger(profile?.deathEffectCount, 0, 0, APP_CONFIG.deckSize),
    eliteCount: sanitizeFiniteInteger(profile?.eliteCount, 0, 0, APP_CONFIG.deckSize),
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
    ? side.deck.filter((cardId) => CARD_MAP.has(cardId)).slice(0, APP_CONFIG.deckSize)
    : [];
  const hand = Array.isArray(side.hand)
    ? side.hand.filter((cardId) => CARD_MAP.has(cardId)).slice(0, APP_CONFIG.deckSize)
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
      filters: sanitizeCollectionFilters(save.filters, baseSave.filters),
      lastOpened: sanitizeLastOpened(save.lastOpened, baseSave.lastOpened),
      activeMatch: sanitizeSavedMatchState(save.activeMatch),
      decks,
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
    const rarityDemandBias = { common: -1.4, rare: -0.4, epic: 0.8, legendary: 1.4, ultra: 2.2, mythic: 3, transcendent: 4.2 }[card.rarity];
    const raritySupplyBias = { common: 2.4, rare: 1.2, epic: 0.4, legendary: -0.6, ultra: -1.4, mythic: -2.2, transcendent: -3.4 }[card.rarity];
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
  const rarityFactor = { common: 1, rare: 1.3, epic: 1.8, legendary: 2.35, ultra: 3.05, mythic: 4.1, transcendent: 5.6 }[card.rarity];
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
    return;
  }

  if (!isCurrentUserAdmin() && uiState.section === "admin") {
    uiState.section = "shop";
  }

  uiState.previewLanguage = getUserSettings().language;
  populateFilterControls();
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
  elements.settingsLanguageSelect.value = getUserSettings().language;
  elements.ownedOnlyToggle.checked = Boolean(getSave().filters.ownedOnly);
  elements.duplicatesOnlyToggle.checked = Boolean(getSave().filters.duplicatesOnly);

  applySceneTheme(uiState.section, true);
  renderNavigation();
  renderResources();
  renderShop();
  renderMarketplace();
  renderBoosterLab();
  renderCollection();
  renderDeckManager();
  renderProfile();
  renderFriends();
  renderSettings();
  renderAdminPanel();
  renderArena();
  renderCardModal();
}

function isMatchSessionLocked() {
  return Boolean(uiState.match);
}

function isSectionNavigationLocked(section) {
  return isMatchSessionLocked() && section !== "arena";
}

function requestSectionChange(section) {
  if (isSectionNavigationLocked(section)) {
    showToast(getUiText("messages.matchNavigationLocked"));
    return;
  }

  uiState.section = section;
  renderAll();
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
  const activeDeck = getActiveDeck();

  elements.resourceBar.innerHTML = "";

  const chips = [
    { label: getCurrentLanguage() === "fr" ? "Or" : getCurrentLanguage() === "en" ? "Gold" : "Gold", value: save.gold, tone: "gold" },
    { label: getCurrentLanguage() === "fr" ? "Cartes" : getCurrentLanguage() === "en" ? "Cards" : "Karten", value: totalCards, tone: "ember" },
    { label: getCurrentLanguage() === "fr" ? "Uniques" : getCurrentLanguage() === "en" ? "Unique" : "Einzigartig", value: uniqueCards, tone: "aqua" },
    { label: getCurrentLanguage() === "fr" ? "Boosters" : getCurrentLanguage() === "en" ? "Boosters" : "Booster", value: totalBoosters, tone: "violet" },
    { label: getCurrentLanguage() === "fr" ? "Deck actif" : getCurrentLanguage() === "en" ? "Active Deck" : "Aktives Deck", value: activeDeck ? activeDeck.cards.length : 0, tone: "steel" },
  ];

  chips.forEach((chipData) => {
    const chip = document.createElement("div");
    chip.className = `resource-chip tone-${chipData.tone}`;
    chip.innerHTML = `<span>${chipData.label}</span><strong>${chipData.value}</strong>`;
    elements.resourceBar.append(chip);
  });
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

function renderProfile() {
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
        value: `${getRarityLabel(PACK_DEFINITIONS.starter.guaranteed)} → ${getRarityLabel(PACK_DEFINITIONS.astral.guaranteed)}`,
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

  localizedVisibleCards.forEach(({ card, entry }) => {
    const saleQuote = getMarketSaleQuote(card.id);
    elements.marketGrid.append(renderCard(card, {
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
      footer: getUiText("market.footer", {
        gross: saleQuote.gross,
        fee: saleQuote.fee,
        net: saleQuote.net,
        buy: entry.buyPrice,
        delta: formatDelta(entry.lastDeltaPct),
      }),
    }));
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
  elements.ownedPackGrid.innerHTML = "";
  elements.openedCardsGrid.innerHTML = "";
  elements.openingStage.classList.remove("is-opening");
  elements.openingBurst.classList.add("hidden");

  Object.values(PACK_DEFINITIONS).forEach((pack) => {
    elements.ownedPackGrid.append(createPackCard(pack.id, "owned"));
  });

  const selectedPack = PACK_DEFINITIONS[save.selectedPack];
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

  elements.openSelectedPackButton.disabled = save.packs[selectedPack.id] <= 0;

  if (!save.lastOpened.cards.length) {
    elements.openedCardsGrid.innerHTML = `
      <div class="info-panel">
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
    getUiText("decks.cardsMeta", { count: activeDeck.cards.length, size: APP_CONFIG.deckSize }),
    getUiText("decks.unitsMeta", { count: countByType(activeDeck.cards, "unit") }),
    getUiText("decks.spellsMeta", { count: countByType(activeDeck.cards, "spell") }),
    getUiText("decks.trainersMeta", { count: countByType(activeDeck.cards, "trainer") }),
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
      <div class="info-panel">
        <h3 class="subheading">${getUiText("decks.emptyDeckTitle")}</h3>
        <p class="mini-note">${getUiText("decks.emptyDeckText")}</p>
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

  getSave().decks.forEach((deck) => {
    const deckValidation = validateDeck(deck);
    const card = document.createElement("div");
    card.className = `saved-deck-card ${deck.id === getSave().activeDeckId ? "active" : ""}`;
    card.innerHTML = `
      <div class="saved-deck-head">
        <strong>${deck.name}</strong>
        <span class="status-pill ${deckValidation.valid ? "ok" : "warn"}">${deckValidation.valid ? getCurrentLanguage() === "fr" ? "Jouable" : getCurrentLanguage() === "en" ? "Playable" : "Spielbar" : getCurrentLanguage() === "fr" ? "Bloqué" : getCurrentLanguage() === "en" ? "Blocked" : "Blockiert"}</span>
      </div>
      <p>${deck.cards.length}/${APP_CONFIG.deckSize} ${getCurrentLanguage() === "fr" ? "cartes" : getCurrentLanguage() === "en" ? "cards" : "Karten"}</p>
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
            label: usedCopies < ownedCopies && activeDeck.cards.length < APP_CONFIG.deckSize ? getUiText("decks.add") : getUiText("decks.unavailable"),
            disabled: usedCopies >= ownedCopies || activeDeck.cards.length >= APP_CONFIG.deckSize,
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
      container.append(renderCard(getCard(unit.cardId), {
        context: "board",
        stateOverride: unit,
        footer: buildUnitStateFooter(unit, unit.canAttack ? getUiText("arena.attackReady") : getUiText("arena.readyNextTurn")),
      }));
      continue;
    }

    const canAttack = phase === "player" && unit.canAttack && !matchFinished;
    container.append(renderCard(getCard(unit.cardId), {
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
    }));
  }
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
    ? (matchFinished ? match.statusMessage : getUiText("arena.focusMode"))
    : getUiText("arena.noMatch");
  const difficultyNote = difficulty.antiFarmActive
    ? `${getUiText("arena.recommended", { difficulty: getArenaDifficultyLabel(difficulty.recommendedDifficultyId) })}. ${getUiText("arena.antiFarmNote", { win: difficulty.rewardWin, loss: difficulty.rewardLoss })}`
    : `${getArenaDifficultyDescription(difficultyId)} ${getUiText("arena.difficultyHint")}`;
  const statusNote = hasMatch
    ? (matchFinished ? latestLog : getUiText("arena.focusNote"))
    : (validation.valid ? `${difficultyNote} ${getUiText("arena.readyStart")}` : `${difficultyNote} ${validation.messages.join(" ")}`);
  const previewSideState = {
    hero: APP_CONFIG.heroHealth,
    heroBarrier: 0,
    mana: 0,
    maxMana: APP_CONFIG.maxMana,
    hand: [],
    board: [],
    deck: new Array(APP_CONFIG.deckSize).fill(null),
  };

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
  elements.startMatchButton.disabled = !validation.valid || hasMatch;
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
      <span>${difficulty.antiFarmActive ? getUiText("arena.antiFarmNote", { win: difficulty.rewardWin, loss: difficulty.rewardLoss }) : getArenaDifficultyDescription(difficultyId)}</span>
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
    renderHeroPanel(elements.enemyHeroPanel, getUiText("arena.opponent"), previewSideState, false);
    renderHeroPanel(elements.playerHeroPanel, getUiText("arena.you"), previewSideState, false);
    renderBoardState(elements.enemyBoard, [], "enemy", false, "enemy");
    renderBoardState(elements.playerBoard, [], "player", false, "player");
    elements.battleLog.innerHTML = `<div class="log-entry latest">${getUiText("arena.startMatchHint")}</div>`;
    elements.playerHand.innerHTML = `<div class="info-panel"><h3 class="subheading">${getUiText("arena.noHandTitle")}</h3><p class="mini-note">${getUiText("arena.noHandText")}</p></div>`;
    return;
  }

  renderHeroPanel(elements.enemyHeroPanel, getUiText("arena.opponent"), match.enemy, match.phase === "enemy");
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
      <span class="meta-chip">Feld ${sideState.board.length}/${APP_CONFIG.boardSize}</span>
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
  const activeDeckProfile = activeDeck ? analyzeDeck(activeDeck.cards) : null;
  const synergyReady = card.synergy && activeDeckProfile ? matchesSynergyCondition(activeDeckProfile, card.synergy.condition) : false;
  const managementLocked = isMatchSessionLocked();

  elements.cardModal.classList.remove("hidden");
  elements.cardModalContent.innerHTML = "";

  const preview = renderCard(card, { context: "modal" });
  const details = document.createElement("div");
  details.className = "modal-details";
  details.innerHTML = `
    <div class="detail-block">
      <p class="eyebrow">${getUiText("card.cardInfo")}</p>
      <h3>${card.name}</h3>
      <div class="deck-meta">
        <span class="meta-chip">${RarityLabel(card.rarity)}</span>
        <span class="meta-chip">${getTypeLabel(card.type)}</span>
        <span class="meta-chip">${getFaction(card.faction).name}</span>
      </div>
      ${card.keywords?.length ? `<div class="card-keywords">${buildKeywordMarkup(card.keywords)}</div>` : ""}
      ${card.keywords?.length ? `<p class="mini-note">${buildKeywordDetailText(card.keywords)}</p>` : ""}
      ${card.synergy ? `<p class="mini-note"><strong>${getUiText("card.synergy")}:</strong> ${describeSynergyCondition(card.synergy.condition)}. ${synergyReady ? getUiText("card.synergyReady") : getUiText("card.synergyMissing")}</p>` : ""}
      ${card.timing ? `<p class="mini-note"><strong>${getUiText("card.timing")}:</strong> ${describeTiming(card.timing)}.</p>` : ""}
      <p class="mini-note">${getLocalizedCardDescription(card)}</p>
    </div>
    <div class="detail-block">
      <h4>${getUiText("card.ownership")}</h4>
      <p>${getUiText("card.owned")}: <strong>${owned}</strong></p>
      <p>${getUiText("card.inActiveDeck")}: <strong>${inActiveDeck}</strong></p>
      <div class="price-stack">
        <div class="price-line">
          <span>${getUiText("card.vendorSell")}</span>
          <strong>${RARITY_META[card.rarity].sellValue} ${getCurrentLanguage() === "fr" ? "Or" : "Gold"}</strong>
        </div>
        <div class="price-line">
          <span>${getUiText("card.marketGross")}</span>
          <strong>${marketSaleQuote.gross} ${getCurrentLanguage() === "fr" ? "Or" : "Gold"}</strong>
        </div>
        <div class="price-line accent">
          <span>${getUiText("card.marketFee")}</span>
          <strong>${marketSaleQuote.fee} ${getCurrentLanguage() === "fr" ? "Or" : "Gold"}</strong>
        </div>
        <div class="price-line success">
          <span>${getUiText("card.marketPayout")}</span>
          <strong>${marketSaleQuote.net} ${getCurrentLanguage() === "fr" ? "Or" : "Gold"}</strong>
        </div>
        <div class="price-line">
          <span>${getUiText("card.marketBuy")}</span>
          <strong>${marketEntry.buyPrice} ${getCurrentLanguage() === "fr" ? "Or" : "Gold"}</strong>
        </div>
        <div class="price-line">
          <span>${getUiText("card.hourlyMove")}</span>
          <strong>${formatDelta(marketEntry.lastDeltaPct)}</strong>
        </div>
      </div>
    </div>
    <div class="detail-block">
      <h4>${getUiText("card.actions")}</h4>
      ${managementLocked ? `<p class="mini-note arena-lock-note">${getUiText("card.matchLockNote")}</p>` : ""}
    </div>
    <div class="detail-block">
      <h4>${getUiText("card.note")}</h4>
      <p>${getUiText("card.deckNote")}</p>
    </div>
  `;

  const localizedActionBlock = details.querySelectorAll(".detail-block")[2];
  const localizedActionRow = document.createElement("div");
  localizedActionRow.className = "card-actions";
  localizedActionRow.append(
    createActionButton(getUiText("card.sellOne"), () => sellCard(card.id, 1), managementLocked || owned < 1),
    createActionButton(getUiText("card.sellDupes"), () => sellCard(card.id, Math.max(0, owned - 1)), managementLocked || owned <= 1),
    createActionButton(getUiText("card.marketSellOne", { price: marketSaleQuote.net }), () => sellCardOnMarket(card.id, 1), managementLocked || owned < 1),
    createActionButton(getUiText("card.marketBuyOne"), () => buyCardOnMarket(card.id), managementLocked || getSave().gold < marketEntry.buyPrice),
    createActionButton(getUiText("card.sellAll"), () => sellCard(card.id, owned), managementLocked || owned < 1),
    createActionButton(getUiText("card.toDeck"), () => addCardToActiveDeck(card.id), managementLocked || !canAddCardToActiveDeck(card.id)),
  );
  localizedActionBlock.append(localizedActionRow);

  elements.cardModalContent.append(preview, details);
  return;

  details.innerHTML = `
    <div class="detail-block">
      <p class="eyebrow">Karteninfo</p>
      <h3>${card.name}</h3>
      <div class="deck-meta">
        <span class="meta-chip">${RarityLabel(card.rarity)}</span>
        <span class="meta-chip">${TYPE_LABELS[card.type]}</span>
        <span class="meta-chip">${getFaction(card.faction).name}</span>
      </div>
      ${card.keywords?.length ? `<div class="card-keywords">${buildKeywordMarkup(card.keywords)}</div>` : ""}
      ${card.keywords?.length ? `<p class="mini-note">${buildKeywordDetailText(card.keywords)}</p>` : ""}
      ${card.synergy ? `<p class="mini-note"><strong>Synergie:</strong> ${describeSynergyCondition(card.synergy.condition)}. ${synergyReady ? "Das aktive Deck erfüllt diese Bedingung bereits." : "Das aktive Deck erfüllt diese Bedingung aktuell noch nicht."}</p>` : ""}
      ${card.timing ? `<p class="mini-note"><strong>Timing:</strong> ${describeTiming(card.timing)}.</p>` : ""}
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
  const odds = ["rare", "epic", "legendary", "ultra", "mythic", "transcendent"]
    .map((rarity) => `<div class="odds-row"><span>${RarityLabel(rarity)}</span><strong>${pack.odds[rarity]}%</strong></div>`)
    .join("");

  element.classList.add(`pack-${pack.id}`, context === "shop" ? "pack-card-shop" : "pack-card-owned");
  element.dataset.packId = pack.id;
  element.querySelector(".pack-kicker").textContent = getPackTier(pack.id);
  element.querySelector(".pack-price").textContent = context === "shop"
    ? formatCurrency(pack.price)
    : getUiText("booster.ownedCount", { count: packEntryPrice });
  element.querySelector(".pack-crest-core").textContent = getPackLabel(pack.id).slice(0, 2).toUpperCase();
  element.querySelector(".pack-copy").textContent = getPackDescription(pack.id);
  element.querySelector(".pack-name").textContent = getPackLabel(pack.id);
  element.querySelector(".pack-odds").innerHTML = odds;

  const actions = element.querySelector(".pack-actions");

  if (context === "shop") {
    actions.append(createActionButton(getUiText("common.buy"), () => buyPack(packId), getSave().gold < pack.price));
  } else {
    actions.append(
      createActionButton(getUiText("common.select"), () => selectPack(packId)),
      createActionButton(getUiText("common.open"), () => openPack(packId), getSave().packs[packId] < 1),
    );
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
  element.querySelector(".pack-crest-core").textContent = faction.prefix.slice(0, 2).toUpperCase();
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
  const description = footer || getLocalizedCardDescription(card);

  element.classList.add(`card-${card.rarity}`, `faction-${card.faction}`, "clickable-card");
  element.dataset.context = context;
  element.addEventListener("click", () => openCardModal(card.id));
  element.querySelector(".card-type-badge").textContent = getTypeLabel(card.type);
  element.querySelector(".card-owned").textContent = card.isToken ? (getCurrentLanguage() === "fr" ? "Jeton" : "Token") : `${getOwnedCopies(card.id)}×`;
  element.querySelector(".card-name").textContent = card.name;
  element.querySelector(".card-faction").textContent = faction.name;
  element.querySelector(".card-faction-pill").textContent = faction.name;
  element.querySelector(".card-glyph").textContent = CARD_TYPE_GLYPHS[card.type] || getTypeLabel(card.type).slice(0, 2).toUpperCase();
  element.querySelector(".card-rarity").textContent = RarityLabel(card.rarity);
  element.querySelector(".card-rarity").classList.add(`rarity-${card.rarity}`);
  const keywordRow = element.querySelector(".card-keywords");
  keywordRow.classList.toggle("hidden", !keywords.length);
  keywordRow.innerHTML = keywords.length ? buildKeywordMarkup(keywords) : "";
  element.querySelector(".card-description").textContent = description;
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
  return keywords.map((keyword) => `<span class="keyword-chip">${getKeywordLabel(keyword)}</span>`).join("");
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

    if (["legendary", "ultra", "mythic", "transcendent"].includes(card.rarity)) {
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
  save.packs[packId] += 1;
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
  playPackOpeningSequence(cards, packId);
  showToast(getUiText("booster.packOpened", { pack: getPackLabel(packId) }));
}

function generatePack(packId) {
  const pack = PACK_DEFINITIONS[packId];

  if (!pack) {
    return [];
  }

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
  const pool = CARD_POOLS_BY_RARITY[rarity] || CARD_POOLS_BY_RARITY.common || CARD_POOL;
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
  const activeDeck = getActiveDeck();
  const deckCopies = countCopiesInArray(activeDeck.cards, cardId);
  return activeDeck.cards.length < APP_CONFIG.deckSize
    && deckCopies < getOwnedCopies(cardId)
    && deckCopies < getDeckCopyLimit(cardId);
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

  const deck = getActiveDeck();
  const difficultyId = getArenaDifficultyId(getSave().arenaDifficulty);
  const validation = validateDeck(deck);

  if (!validation.valid) {
    uiState.section = "decks";
    renderAll();
    showToast(getUiText("messages.matchNotPlayable"));
    return;
  }

  uiState.match = createMatch(deck.cards, difficultyId);
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
  const playerDeckProfile = analyzeDeck(playerDeckCards);
  const difficulty = createArenaMatchConfig(playerDeckProfile, difficultyId);
  const match = {
    difficultyId: difficulty.id,
    recommendedDifficultyId: difficulty.recommendedDifficultyId,
    antiFarmGap: difficulty.antiFarmGap,
    antiFarmActive: difficulty.antiFarmActive,
    rewardWin: difficulty.rewardWin,
    rewardLoss: difficulty.rewardLoss,
    turn: 0,
    phase: "player",
    status: "active",
    statusMessage: getUiText("messages.matchStartStatus"),
    log: [],
    uidCounter: 0,
    player: createSideState(playerDeckCards),
    enemy: createSideState(generateEnemyDeck(difficulty.id)),
  };

  match.enemy.hero = Math.max(1, match.enemy.hero + difficulty.enemyHeroBonus);
  match.enemy.heroBarrier = Math.max(0, difficulty.enemyBarrier);
  match.enemy.maxMana = clamp(0, APP_CONFIG.maxMana, difficulty.enemyStartingManaBonus);
  match.enemy.mana = match.enemy.maxMana;
  match.player.deckProfile = playerDeckProfile;

  drawOpeningHands(match, difficulty);
  return match;
}

function createSideState(deckCards, options = {}) {
  const shuffledDeck = shuffle([...deckCards]);
  return {
    hero: APP_CONFIG.heroHealth + sanitizeFiniteInteger(options.heroBonus, 0, -20, 80),
    heroBarrier: sanitizeFiniteInteger(options.heroBarrier, 0, 0, 20),
    maxMana: sanitizeFiniteInteger(options.startingMaxMana, 0, 0, APP_CONFIG.maxMana),
    mana: sanitizeFiniteInteger(options.startingMana, 0, 0, APP_CONFIG.maxMana),
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

  if (side === "player") {
    match.turn += 1;
  }

  match.phase = side;
  actor.maxMana = Math.min(APP_CONFIG.maxMana, actor.maxMana + 1);
  actor.mana = actor.maxMana;
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
  const save = getSave();
  const match = uiState.match;
  const difficulty = getArenaDifficulty(match?.difficultyId);
  const rewardWin = sanitizeFiniteInteger(match?.rewardWin, difficulty.rewardWin, 0, SECURITY_LIMITS.maxGold);
  const rewardLoss = sanitizeFiniteInteger(match?.rewardLoss, difficulty.rewardLoss, 0, SECURITY_LIMITS.maxGold);
  match.status = status;
  match.statusMessage = message;
  addLog(message);

  if (status === "won") {
    save.gold += rewardWin;
    addLog(getUiText("messages.matchRewardWin", { difficulty: getArenaDifficultyLabel(difficulty.id), gold: rewardWin }));
  } else {
    save.gold += rewardLoss;
    addLog(getUiText("messages.matchRewardLoss", { difficulty: getArenaDifficultyLabel(difficulty.id), gold: rewardLoss }));
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

function generateEnemyDeck(difficultyId = "standard") {
  const difficulty = getArenaDifficulty(difficultyId);
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
  const fallbackPool = weightedPool.length ? weightedPool : CARD_POOL;
  let attempts = 0;

  while (deck.length < APP_CONFIG.deckSize && attempts < 500) {
    attempts += 1;
    const preferredPool = Math.random() < difficulty.unitBias && units.length ? units : (supports.length ? supports : fallbackPool);
    const eligiblePool = preferredPool.filter((card) => (counts[card.id] || 0) < getDeckCopyLimit(card.id));
    const pool = eligiblePool.length
      ? eligiblePool
      : fallbackPool.filter((card) => (counts[card.id] || 0) < getDeckCopyLimit(card.id));

    if (!pool.length) {
      break;
    }

    const card = pickEnemyDeckCard(pool, difficulty);
    if (!card) {
      break;
    }
    deck.push(card.id);
    counts[card.id] = (counts[card.id] || 0) + 1;
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

function getDeckCopyLimit(cardId) {
  const rarity = getCard(cardId)?.rarity;
  return ["legendary", "ultra", "mythic", "transcendent"].includes(rarity) ? 1 : 2;
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

  FACTIONS.forEach((faction, factionIndex) => {
    appendGeneratedUnitSet(cards, faction, factionIndex, UNIT_TITLES, UNIT_RARITIES, "einheit", 0);
    appendGeneratedSpellSet(cards, faction, SPELL_TITLES, SPELL_RARITIES, "zauber", 0);
    appendGeneratedTrainerSet(cards, faction, TRAINER_TITLES, TRAINER_RARITIES, "trainer", 0);

    appendGeneratedUnitSet(cards, faction, factionIndex, EXPANDED_UNIT_TITLES, EXPANDED_UNIT_RARITIES, "einheit-erweitert", UNIT_TITLES.length + 2);
    appendGeneratedSpellSet(cards, faction, EXPANDED_SPELL_TITLES, EXPANDED_SPELL_RARITIES, "zauber-erweitert", SPELL_TITLES.length + 3);
    appendGeneratedTrainerSet(cards, faction, EXPANDED_TRAINER_TITLES, EXPANDED_TRAINER_RARITIES, "trainer-erweitert", TRAINER_TITLES.length + 4);
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
