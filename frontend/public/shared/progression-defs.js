(function initProjektVaultProgression(root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }

  root.ProjektVaultProgressionDefs = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function createProjektVaultProgressionDefs() {
  const DAILY_QUEST_LIMIT = 5;
  const WEEKLY_QUEST_LIMIT = 5;
  const DAILY_BUCKET_ORDER = Object.freeze(["combat", "opening", "economy", "collection", "social"]);
  const WEEKLY_BUCKET_ORDER = Object.freeze(["combat", "opening", "economy", "collection", "social"]);
  const ROMAN_NUMERALS = Object.freeze(["I", "II", "III", "IV", "V"]);
  const SNAPSHOT_STAT_KEYS = Object.freeze([
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
  ]);

  function text(de, en, fr) {
    return Object.freeze({ de, en, fr });
  }

  function sanitizeInteger(value) {
    const parsed = Number.parseInt(String(value ?? ""), 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function clamp(min, max, value) {
    return Math.min(max, Math.max(min, value));
  }

  function createDefaultQuestSnapshot() {
    const stats = {};
    SNAPSHOT_STAT_KEYS.forEach((key) => {
      stats[key] = 0;
    });

    return {
      rankPoints: 0,
      stats,
      summary: {
        gold: 0,
        totalCards: 0,
        uniqueCards: 0,
        totalBoosters: 0,
      },
    };
  }

  function createDefaultQuestWindow() {
    return {
      key: "",
      activeIds: [],
      snapshot: createDefaultQuestSnapshot(),
    };
  }

  function createDefaultQuestState() {
    return {
      dailyClaimed: [],
      weeklyClaimed: [],
      dailyWindow: createDefaultQuestWindow(),
      weeklyWindow: createDefaultQuestWindow(),
    };
  }

  function summarizeSaveForProgression(save) {
    const collection = save && typeof save === "object" && save.collection && typeof save.collection === "object" ? save.collection : {};
    const packs = save && typeof save === "object" && save.packs && typeof save.packs === "object" ? save.packs : {};
    return {
      gold: sanitizeInteger(save && save.gold),
      totalCards: Object.values(collection).reduce((sum, count) => sum + sanitizeInteger(count), 0),
      uniqueCards: Object.values(collection).filter((count) => sanitizeInteger(count) > 0).length,
      totalBoosters: Object.values(packs).reduce((sum, count) => sum + sanitizeInteger(count), 0),
    };
  }

  function createProgressSnapshot(progression, save) {
    const stats = {};
    SNAPSHOT_STAT_KEYS.forEach((key) => {
      stats[key] = sanitizeInteger(progression && progression.stats ? progression.stats[key] : 0);
    });

    return {
      rankPoints: sanitizeInteger(progression && progression.rankPoints),
      stats,
      summary: summarizeSaveForProgression(save),
    };
  }

  const METRIC_META = Object.freeze({
    arenaWins: {
      description: (target) => text(
        `Gewinne ${target} Arenakämpfe.`,
        `Win ${target} arena matches.`,
        `Gagne ${target} combats d'arène.`,
      ),
    },
    arenaBattles: {
      description: (target) => text(
        `Bestreite ${target} Arenakämpfe.`,
        `Play ${target} arena matches.`,
        `Joue ${target} combats d'arène.`,
      ),
    },
    boostersOpened: {
      description: (target) => text(
        `Öffne ${target} Booster.`,
        `Open ${target} boosters.`,
        `Ouvre ${target} boosters.`,
      ),
    },
    cardsOpened: {
      description: (target) => text(
        `Ziehe ${target} Karten aus Boostern.`,
        `Pull ${target} cards from boosters.`,
        `Obtiens ${target} cartes via des boosters.`,
      ),
    },
    goldEarned: {
      description: (target) => text(
        `Verdiene ${target} Gold.`,
        `Earn ${target} gold.`,
        `Gagne ${target} or.`,
      ),
    },
    marketDeals: {
      description: (target) => text(
        `Schließe ${target} Marktplatz-Deals ab.`,
        `Complete ${target} marketplace deals.`,
        `Conclue ${target} transactions au marché.`,
      ),
    },
    rankPoints: {
      description: (target) => text(
        `Sammle ${target} Rangpunkte.`,
        `Earn ${target} rank points.`,
        `Gagne ${target} points de rang.`,
      ),
    },
    uniqueCards: {
      description: (target) => text(
        `Füge ${target} neue einzigartige Karten deiner Sammlung hinzu.`,
        `Add ${target} new unique cards to your collection.`,
        `Ajoute ${target} nouvelles cartes uniques à ta collection.`,
      ),
    },
    totalCards: {
      description: (target) => text(
        `Erhalte ${target} Karten für deine Sammlung.`,
        `Gain ${target} cards for your collection.`,
        `Obtiens ${target} cartes pour ta collection.`,
      ),
    },
    friendMatches: {
      description: (target) => text(
        `Bestreite ${target} Freundesduelle.`,
        `Play ${target} friend duels.`,
        `Joue ${target} duels amicaux.`,
      ),
    },
    tradesCompleted: {
      description: (target) => text(
        `Schließe ${target} Handel ab.`,
        `Complete ${target} trades.`,
        `Conclue ${target} échanges.`,
      ),
    },
    legendaryPlusPulled: {
      description: (target) => text(
        `Ziehe ${target} legendäre oder bessere Karten.`,
        `Pull ${target} legendary-or-better cards.`,
        `Obtiens ${target} cartes légendaires ou mieux.`,
      ),
    },
    hardcoreWins: {
      description: (target) => text(
        `Gewinne ${target} Hardcore-Kämpfe.`,
        `Win ${target} hardcore matches.`,
        `Gagne ${target} combats hardcore.`,
      ),
    },
  });

  function createQuestSeries(config) {
    return config.targets.map((target, index) => ({
      id: `${config.period}-${config.seriesId}-${index + 1}`,
      bucket: config.bucket,
      metric: config.metric,
      target,
      rewardGold: config.baseReward + (config.rewardStep * index),
      rewardPackId: config.rewardPackId && index >= config.rewardPackFrom ? config.rewardPackId : "",
      title: text(
        `${config.title.de} ${ROMAN_NUMERALS[index]}`,
        `${config.title.en} ${ROMAN_NUMERALS[index]}`,
        `${config.title.fr} ${ROMAN_NUMERALS[index]}`,
      ),
      description: METRIC_META[config.metric].description(target),
    }));
  }

  const DAILY_SERIES = Object.freeze([
    { period: "daily", bucket: "combat", seriesId: "combat-blade", title: text("Klingenlauf", "Blade Run", "Course de lame"), metric: "arenaWins", targets: [1, 2, 2, 3, 4], baseReward: 55, rewardStep: 12, rewardPackId: "", rewardPackFrom: 99 },
    { period: "daily", bucket: "combat", seriesId: "combat-crown", title: text("Siegeskrone", "Victory Crown", "Couronne des victoires"), metric: "arenaWins", targets: [1, 2, 3, 4, 5], baseReward: 60, rewardStep: 14, rewardPackId: "market", rewardPackFrom: 4 },
    { period: "daily", bucket: "combat", seriesId: "combat-rhythm", title: text("Kampfrhythmus", "Battle Rhythm", "Rythme de combat"), metric: "arenaBattles", targets: [2, 3, 4, 5, 6], baseReward: 50, rewardStep: 11, rewardPackId: "", rewardPackFrom: 99 },
    { period: "daily", bucket: "combat", seriesId: "combat-pressure", title: text("Ligadruck", "Ladder Pressure", "Pression de ligue"), metric: "rankPoints", targets: [20, 30, 40, 55, 70], baseReward: 58, rewardStep: 13, rewardPackId: "market", rewardPackFrom: 3 },
    { period: "daily", bucket: "opening", seriesId: "opening-spark", title: text("Boosterfunke", "Booster Spark", "Étincelle de booster"), metric: "boostersOpened", targets: [1, 1, 2, 3, 4], baseReward: 48, rewardStep: 11, rewardPackId: "", rewardPackFrom: 99 },
    { period: "daily", bucket: "opening", seriesId: "opening-flood", title: text("Kartenflut", "Card Flood", "Vague de cartes"), metric: "cardsOpened", targets: [5, 8, 12, 16, 20], baseReward: 52, rewardStep: 10, rewardPackId: "", rewardPackFrom: 99 },
    { period: "daily", bucket: "opening", seriesId: "opening-archive", title: text("Archivdrang", "Archive Surge", "Élan d'archive"), metric: "cardsOpened", targets: [6, 10, 14, 18, 22], baseReward: 55, rewardStep: 11, rewardPackId: "starter", rewardPackFrom: 4 },
    { period: "daily", bucket: "opening", seriesId: "opening-glow", title: text("Glanzjagd", "Glow Hunt", "Chasse à l'éclat"), metric: "legendaryPlusPulled", targets: [1, 1, 1, 2, 2], baseReward: 78, rewardStep: 16, rewardPackId: "market", rewardPackFrom: 2 },
    { period: "daily", bucket: "economy", seriesId: "economy-trade", title: text("Marktspur", "Market Trail", "Piste du marché"), metric: "marketDeals", targets: [1, 2, 2, 3, 4], baseReward: 50, rewardStep: 12, rewardPackId: "", rewardPackFrom: 99 },
    { period: "daily", bucket: "economy", seriesId: "economy-vault", title: text("Goldlauf", "Gold Run", "Course à l'or"), metric: "goldEarned", targets: [120, 180, 240, 320, 420], baseReward: 60, rewardStep: 14, rewardPackId: "", rewardPackFrom: 99 },
    { period: "daily", bucket: "economy", seriesId: "economy-rank", title: text("Aufstiegspfad", "Climb Route", "Route de montée"), metric: "rankPoints", targets: [25, 35, 45, 60, 80], baseReward: 58, rewardStep: 13, rewardPackId: "market", rewardPackFrom: 4 },
    { period: "daily", bucket: "economy", seriesId: "economy-desk", title: text("Handelstisch", "Trade Desk", "Table d'échange"), metric: "tradesCompleted", targets: [1, 1, 2, 2, 3], baseReward: 62, rewardStep: 12, rewardPackId: "market", rewardPackFrom: 3 },
    { period: "daily", bucket: "collection", seriesId: "collection-rare", title: text("Archivkamm", "Archive Crest", "Crête d'archive"), metric: "uniqueCards", targets: [1, 2, 2, 3, 4], baseReward: 54, rewardStep: 12, rewardPackId: "", rewardPackFrom: 99 },
    { period: "daily", bucket: "collection", seriesId: "collection-stock", title: text("Sammlungsschub", "Collection Surge", "Poussée de collection"), metric: "totalCards", targets: [5, 8, 12, 16, 20], baseReward: 50, rewardStep: 11, rewardPackId: "", rewardPackFrom: 99 },
    { period: "daily", bucket: "collection", seriesId: "collection-draw", title: text("Albumdrang", "Album Push", "Élan d'album"), metric: "cardsOpened", targets: [6, 10, 14, 18, 24], baseReward: 53, rewardStep: 11, rewardPackId: "starter", rewardPackFrom: 4 },
    { period: "daily", bucket: "collection", seriesId: "collection-find", title: text("Fundstück", "Finder's Mark", "Trouvaille"), metric: "uniqueCards", targets: [2, 3, 4, 5, 6], baseReward: 58, rewardStep: 12, rewardPackId: "market", rewardPackFrom: 4 },
    { period: "daily", bucket: "social", seriesId: "social-ring", title: text("Freundesring", "Friend Ring", "Cercle d'amis"), metric: "friendMatches", targets: [1, 1, 2, 2, 3], baseReward: 60, rewardStep: 12, rewardPackId: "", rewardPackFrom: 99 },
    { period: "daily", bucket: "social", seriesId: "social-barter", title: text("Tauschpfad", "Barter Path", "Voie du troc"), metric: "tradesCompleted", targets: [1, 2, 3, 4, 5], baseReward: 64, rewardStep: 12, rewardPackId: "market", rewardPackFrom: 3 },
    { period: "daily", bucket: "social", seriesId: "social-ally", title: text("Kontaktkette", "Contact Chain", "Chaîne de contacts"), metric: "friendMatches", targets: [2, 3, 4, 5, 6], baseReward: 68, rewardStep: 13, rewardPackId: "market", rewardPackFrom: 4 },
    { period: "daily", bucket: "social", seriesId: "social-flare", title: text("Funkenjagd", "Flare Hunt", "Chasse à l'éclat"), metric: "legendaryPlusPulled", targets: [1, 1, 2, 2, 3], baseReward: 84, rewardStep: 16, rewardPackId: "champion", rewardPackFrom: 3 },
  ]);

  const WEEKLY_SERIES = Object.freeze([
    { period: "weekly", bucket: "combat", seriesId: "weekly-combat-crown", title: text("Wochensieg", "Weekly Victory", "Victoire hebdo"), metric: "arenaWins", targets: [3, 5, 7, 10, 14], baseReward: 160, rewardStep: 30, rewardPackId: "market", rewardPackFrom: 2 },
    { period: "weekly", bucket: "combat", seriesId: "weekly-combat-gauntlet", title: text("Kampfkette", "Battle Chain", "Chaîne de combat"), metric: "arenaBattles", targets: [6, 9, 12, 16, 20], baseReward: 150, rewardStep: 26, rewardPackId: "market", rewardPackFrom: 3 },
    { period: "weekly", bucket: "combat", seriesId: "weekly-combat-ladder", title: text("Ligaschub", "Ladder Push", "Poussée de ligue"), metric: "rankPoints", targets: [80, 120, 170, 230, 320], baseReward: 175, rewardStep: 32, rewardPackId: "champion", rewardPackFrom: 2 },
    { period: "weekly", bucket: "combat", seriesId: "weekly-combat-hardcore", title: text("Hardcore-Siegel", "Hardcore Seal", "Sceau hardcore"), metric: "hardcoreWins", targets: [1, 1, 2, 3, 4], baseReward: 190, rewardStep: 40, rewardPackId: "relic", rewardPackFrom: 2 },
    { period: "weekly", bucket: "opening", seriesId: "weekly-opening-rain", title: text("Boosterregen", "Booster Rain", "Pluie de boosters"), metric: "boostersOpened", targets: [4, 6, 8, 11, 14], baseReward: 150, rewardStep: 26, rewardPackId: "market", rewardPackFrom: 2 },
    { period: "weekly", bucket: "opening", seriesId: "weekly-opening-archive", title: text("Archivwelle", "Archive Wave", "Vague d'archive"), metric: "cardsOpened", targets: [20, 30, 42, 56, 72], baseReward: 160, rewardStep: 28, rewardPackId: "champion", rewardPackFrom: 3 },
    { period: "weekly", bucket: "opening", seriesId: "weekly-opening-glow", title: text("Lichtzug", "Shining Pull", "Tir lumineux"), metric: "legendaryPlusPulled", targets: [1, 2, 3, 4, 5], baseReward: 195, rewardStep: 36, rewardPackId: "relic", rewardPackFrom: 2 },
    { period: "weekly", bucket: "opening", seriesId: "weekly-opening-stream", title: text("Boosterstrom", "Booster Stream", "Flux de boosters"), metric: "boostersOpened", targets: [5, 7, 9, 12, 15], baseReward: 165, rewardStep: 27, rewardPackId: "champion", rewardPackFrom: 3 },
    { period: "weekly", bucket: "economy", seriesId: "weekly-economy-bourse", title: text("Marktdruck", "Market Pressure", "Pression du marché"), metric: "marketDeals", targets: [4, 6, 8, 10, 12], baseReward: 155, rewardStep: 28, rewardPackId: "market", rewardPackFrom: 2 },
    { period: "weekly", bucket: "economy", seriesId: "weekly-economy-vault", title: text("Gewölbekasse", "Vault Treasury", "Trésor du caveau"), metric: "goldEarned", targets: [700, 1000, 1400, 1900, 2500], baseReward: 170, rewardStep: 32, rewardPackId: "champion", rewardPackFrom: 3 },
    { period: "weekly", bucket: "economy", seriesId: "weekly-economy-climb", title: text("Aufstiegsdruck", "Climb Pressure", "Pression de montée"), metric: "rankPoints", targets: [100, 150, 210, 280, 360], baseReward: 180, rewardStep: 34, rewardPackId: "champion", rewardPackFrom: 2 },
    { period: "weekly", bucket: "economy", seriesId: "weekly-economy-barter", title: text("Tauschkammer", "Trade Vault", "Chambre d'échange"), metric: "tradesCompleted", targets: [2, 3, 5, 7, 9], baseReward: 175, rewardStep: 30, rewardPackId: "market", rewardPackFrom: 3 },
    { period: "weekly", bucket: "collection", seriesId: "weekly-collection-rare", title: text("Kuratorenruf", "Curator Call", "Appel du curateur"), metric: "uniqueCards", targets: [4, 6, 8, 10, 12], baseReward: 160, rewardStep: 28, rewardPackId: "market", rewardPackFrom: 2 },
    { period: "weekly", bucket: "collection", seriesId: "weekly-collection-stock", title: text("Sammlungswelle", "Collection Wave", "Vague de collection"), metric: "totalCards", targets: [24, 36, 48, 62, 78], baseReward: 155, rewardStep: 28, rewardPackId: "champion", rewardPackFrom: 3 },
    { period: "weekly", bucket: "collection", seriesId: "weekly-collection-draw", title: text("Archivhammer", "Archive Hammer", "Marteau d'archive"), metric: "cardsOpened", targets: [24, 36, 48, 64, 82], baseReward: 165, rewardStep: 29, rewardPackId: "champion", rewardPackFrom: 3 },
    { period: "weekly", bucket: "collection", seriesId: "weekly-collection-find", title: text("Fundkammer", "Finders' Vault", "Réserve de trouvailles"), metric: "uniqueCards", targets: [5, 7, 9, 12, 15], baseReward: 170, rewardStep: 30, rewardPackId: "relic", rewardPackFrom: 4 },
    { period: "weekly", bucket: "social", seriesId: "weekly-social-ring", title: text("Kontaktfeuer", "Contact Fire", "Feu des contacts"), metric: "friendMatches", targets: [3, 4, 6, 8, 10], baseReward: 165, rewardStep: 30, rewardPackId: "market", rewardPackFrom: 2 },
    { period: "weekly", bucket: "social", seriesId: "weekly-social-barter", title: text("Handelsforum", "Trade Forum", "Forum d'échange"), metric: "tradesCompleted", targets: [2, 4, 6, 8, 10], baseReward: 170, rewardStep: 32, rewardPackId: "champion", rewardPackFrom: 3 },
    { period: "weekly", bucket: "social", seriesId: "weekly-social-allies", title: text("Freundesnetz", "Allied Net", "Réseau allié"), metric: "friendMatches", targets: [4, 6, 8, 10, 12], baseReward: 175, rewardStep: 32, rewardPackId: "champion", rewardPackFrom: 3 },
    { period: "weekly", bucket: "social", seriesId: "weekly-social-signal", title: text("Signalsprung", "Signal Leap", "Bond du signal"), metric: "legendaryPlusPulled", targets: [1, 2, 3, 4, 6], baseReward: 185, rewardStep: 34, rewardPackId: "relic", rewardPackFrom: 3 },
  ]);

  const DAILY_QUEST_DEFS = Object.freeze(DAILY_SERIES.flatMap((series) => createQuestSeries(series)));
  const WEEKLY_QUEST_DEFS = Object.freeze(WEEKLY_SERIES.flatMap((series) => createQuestSeries(series)));

  const ACHIEVEMENT_SPECS = Object.freeze([
    { id: "ach-first-win", metric: "arenaWins", target: 1, rewardGold: 120, rewardPackId: "", title: text("Erster Triumph", "First Triumph", "Premier triomphe") },
    { id: "ach-arena-5", metric: "arenaWins", target: 5, rewardGold: 150, rewardPackId: "", title: text("Arena-Aufstieg I", "Arena Climb I", "Ascension d'arène I") },
    { id: "ach-arena-15", metric: "arenaWins", target: 15, rewardGold: 190, rewardPackId: "market", title: text("Arena-Aufstieg II", "Arena Climb II", "Ascension d'arène II") },
    { id: "ach-arena-35", metric: "arenaWins", target: 35, rewardGold: 250, rewardPackId: "champion", title: text("Arena-Aufstieg III", "Arena Climb III", "Ascension d'arène III") },
    { id: "ach-arena-75", metric: "arenaWins", target: 75, rewardGold: 340, rewardPackId: "relic", title: text("Arena-Aufstieg IV", "Arena Climb IV", "Ascension d'arène IV") },

    { id: "ach-market-hand", metric: "marketDeals", target: 10, rewardGold: 180, rewardPackId: "", title: text("Markthändler", "Market Trader", "Marchand du marché") },
    { id: "ach-market-25", metric: "marketDeals", target: 25, rewardGold: 220, rewardPackId: "market", title: text("Markthändler II", "Market Trader II", "Marchand du marché II") },
    { id: "ach-market-60", metric: "marketDeals", target: 60, rewardGold: 280, rewardPackId: "champion", title: text("Markthändler III", "Market Trader III", "Marchand du marché III") },
    { id: "ach-market-120", metric: "marketDeals", target: 120, rewardGold: 360, rewardPackId: "relic", title: text("Markthändler IV", "Market Trader IV", "Marchand du marché IV") },
    { id: "ach-market-250", metric: "marketDeals", target: 250, rewardGold: 480, rewardPackId: "astral", title: text("Markthändler V", "Market Trader V", "Marchand du marché V") },

    { id: "ach-collection-50", metric: "uniqueCards", target: 50, rewardGold: 220, rewardPackId: "", title: text("Archiv erweitert", "Expanded Archive", "Archive étendue") },
    { id: "ach-collection-100", metric: "uniqueCards", target: 100, rewardGold: 260, rewardPackId: "market", title: text("Archiv erweitert II", "Expanded Archive II", "Archive étendue II") },
    { id: "ach-collection-180", metric: "uniqueCards", target: 180, rewardGold: 320, rewardPackId: "champion", title: text("Archiv erweitert III", "Expanded Archive III", "Archive étendue III") },
    { id: "ach-collection-280", metric: "uniqueCards", target: 280, rewardGold: 410, rewardPackId: "relic", title: text("Archiv erweitert IV", "Expanded Archive IV", "Archive étendue IV") },
    { id: "ach-collection-420", metric: "uniqueCards", target: 420, rewardGold: 520, rewardPackId: "astral", title: text("Archiv erweitert V", "Expanded Archive V", "Archive étendue V") },

    { id: "ach-legend", metric: "legendaryPlusPulled", target: 5, rewardGold: 260, rewardPackId: "champion", title: text("Glanzzug", "Shining Pull", "Tir brillant") },
    { id: "ach-legend-12", metric: "legendaryPlusPulled", target: 12, rewardGold: 320, rewardPackId: "champion", title: text("Glanzzug II", "Shining Pull II", "Tir brillant II") },
    { id: "ach-legend-25", metric: "legendaryPlusPulled", target: 25, rewardGold: 410, rewardPackId: "relic", title: text("Glanzzug III", "Shining Pull III", "Tir brillant III") },
    { id: "ach-legend-40", metric: "legendaryPlusPulled", target: 40, rewardGold: 520, rewardPackId: "astral", title: text("Glanzzug IV", "Shining Pull IV", "Tir brillant IV") },
    { id: "ach-legend-70", metric: "legendaryPlusPulled", target: 70, rewardGold: 680, rewardPackId: "astral", title: text("Glanzzug V", "Shining Pull V", "Tir brillant V") },

    { id: "ach-hardcore", metric: "hardcoreWins", target: 1, rewardGold: 320, rewardPackId: "relic", title: text("Hardcore-Siegel", "Hardcore Seal", "Sceau hardcore") },
    { id: "ach-hardcore-3", metric: "hardcoreWins", target: 3, rewardGold: 390, rewardPackId: "relic", title: text("Hardcore-Siegel II", "Hardcore Seal II", "Sceau hardcore II") },
    { id: "ach-hardcore-7", metric: "hardcoreWins", target: 7, rewardGold: 480, rewardPackId: "astral", title: text("Hardcore-Siegel III", "Hardcore Seal III", "Sceau hardcore III") },
    { id: "ach-hardcore-15", metric: "hardcoreWins", target: 15, rewardGold: 620, rewardPackId: "astral", title: text("Hardcore-Siegel IV", "Hardcore Seal IV", "Sceau hardcore IV") },
    { id: "ach-hardcore-30", metric: "hardcoreWins", target: 30, rewardGold: 780, rewardPackId: "astral", title: text("Hardcore-Siegel V", "Hardcore Seal V", "Sceau hardcore V") },

    { id: "ach-rank-60", metric: "rankPoints", target: 60, rewardGold: 170, rewardPackId: "", title: text("Ligafunken I", "League Spark I", "Étincelle de ligue I") },
    { id: "ach-rank-180", metric: "rankPoints", target: 180, rewardGold: 220, rewardPackId: "market", title: text("Ligafunken II", "League Spark II", "Étincelle de ligue II") },
    { id: "ach-rank-360", metric: "rankPoints", target: 360, rewardGold: 300, rewardPackId: "champion", title: text("Ligafunken III", "League Spark III", "Étincelle de ligue III") },
    { id: "ach-rank-720", metric: "rankPoints", target: 720, rewardGold: 420, rewardPackId: "relic", title: text("Ligafunken IV", "League Spark IV", "Étincelle de ligue IV") },
    { id: "ach-rank-1200", metric: "rankPoints", target: 1200, rewardGold: 560, rewardPackId: "astral", title: text("Ligafunken V", "League Spark V", "Étincelle de ligue V") },

    { id: "ach-booster-5", metric: "boostersOpened", target: 5, rewardGold: 130, rewardPackId: "", title: text("Boostergeist I", "Booster Spirit I", "Esprit booster I") },
    { id: "ach-booster-20", metric: "boostersOpened", target: 20, rewardGold: 190, rewardPackId: "market", title: text("Boostergeist II", "Booster Spirit II", "Esprit booster II") },
    { id: "ach-booster-60", metric: "boostersOpened", target: 60, rewardGold: 280, rewardPackId: "champion", title: text("Boostergeist III", "Booster Spirit III", "Esprit booster III") },
    { id: "ach-booster-140", metric: "boostersOpened", target: 140, rewardGold: 390, rewardPackId: "relic", title: text("Boostergeist IV", "Booster Spirit IV", "Esprit booster IV") },
    { id: "ach-booster-280", metric: "boostersOpened", target: 280, rewardGold: 520, rewardPackId: "astral", title: text("Boostergeist V", "Booster Spirit V", "Esprit booster V") },
  ]);

  const ACHIEVEMENT_DEFS = Object.freeze(ACHIEVEMENT_SPECS.map((spec) => ({
    ...spec,
    description: METRIC_META[spec.metric].description(spec.target),
  })));

  function getCurrentDateKey(date) {
    const currentDate = date instanceof Date ? date : new Date();
    return currentDate.toISOString().slice(0, 10);
  }

  function getCurrentWeekKey(date) {
    const currentDate = date instanceof Date ? date : new Date();
    const monday = new Date(currentDate);
    const day = monday.getUTCDay() || 7;
    monday.setUTCDate(monday.getUTCDate() - (day - 1));
    return monday.toISOString().slice(0, 10);
  }

  function buildQuestClaimKey(quest, periodKey) {
    return `${periodKey}:${quest.id}`;
  }

  function getSnapshotMetricValue(snapshot, metric) {
    const safeSnapshot = snapshot && typeof snapshot === "object" ? snapshot : createDefaultQuestSnapshot();
    const stats = safeSnapshot.stats || {};
    const summary = safeSnapshot.summary || {};

    switch (metric) {
      case "arenaWins":
        return sanitizeInteger(stats.arenaWins);
      case "arenaBattles":
        return sanitizeInteger(stats.arenaWins) + sanitizeInteger(stats.arenaLosses);
      case "boostersOpened":
        return sanitizeInteger(stats.boostersOpened);
      case "cardsOpened":
        return sanitizeInteger(stats.cardsOpened);
      case "goldEarned":
        return sanitizeInteger(stats.goldEarned);
      case "marketDeals":
        return sanitizeInteger(stats.marketDeals);
      case "rankPoints":
        return sanitizeInteger(safeSnapshot.rankPoints);
      case "uniqueCards":
        return sanitizeInteger(summary.uniqueCards);
      case "totalCards":
        return sanitizeInteger(summary.totalCards);
      case "friendMatches":
        return sanitizeInteger(stats.friendWins) + sanitizeInteger(stats.friendLosses);
      case "tradesCompleted":
        return sanitizeInteger(stats.tradesCompleted);
      case "legendaryPlusPulled":
        return sanitizeInteger(stats.legendaryPlusPulled);
      case "hardcoreWins":
        return sanitizeInteger(stats.hardcoreWins);
      default:
        return 0;
    }
  }

  function getQuestProgress(definition, currentSnapshot, baselineSnapshot) {
    const currentValue = getSnapshotMetricValue(currentSnapshot, definition.metric);
    const baselineValue = getSnapshotMetricValue(baselineSnapshot, definition.metric);
    return clamp(0, Number.POSITIVE_INFINITY, currentValue - baselineValue);
  }

  function getAchievementProgress(definition, currentSnapshot) {
    return getSnapshotMetricValue(currentSnapshot, definition.metric);
  }

  function isAchievementComplete(definition, currentSnapshot) {
    return getAchievementProgress(definition, currentSnapshot) >= sanitizeInteger(definition.target);
  }

  function hashString(input) {
    let hash = 2166136261;
    const textValue = String(input || "");
    for (let index = 0; index < textValue.length; index += 1) {
      hash ^= textValue.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function sortBySeed(definitions, seed) {
    return [...definitions].sort((left, right) => {
      const leftScore = hashString(`${seed}:${left.id}`);
      const rightScore = hashString(`${seed}:${right.id}`);
      if (leftScore !== rightScore) {
        return leftScore - rightScore;
      }
      return left.id.localeCompare(right.id);
    });
  }

  function selectQuestDefinitions(definitions, periodKey, limit, bucketOrder) {
    const grouped = bucketOrder.map((bucket) => ({
      bucket,
      entries: definitions.filter((definition) => definition.bucket === bucket),
    }));
    const selected = [];

    grouped.forEach(({ bucket, entries }) => {
      if (!entries.length || selected.length >= limit) {
        return;
      }
      const candidate = sortBySeed(entries, `${periodKey}:${bucket}`)[0];
      if (candidate) {
        selected.push(candidate);
      }
    });

    if (selected.length < limit) {
      const remaining = definitions.filter((definition) => !selected.some((entry) => entry.id === definition.id));
      selected.push(...sortBySeed(remaining, `${periodKey}:overflow`).slice(0, limit - selected.length));
    }

    return selected.slice(0, limit);
  }

  function getCurrentQuestDefinitions(period, periodKey) {
    if (period === "weekly") {
      return selectQuestDefinitions(WEEKLY_QUEST_DEFS, periodKey, WEEKLY_QUEST_LIMIT, WEEKLY_BUCKET_ORDER);
    }
    return selectQuestDefinitions(DAILY_QUEST_DEFS, periodKey, DAILY_QUEST_LIMIT, DAILY_BUCKET_ORDER);
  }

  return Object.freeze({
    DAILY_QUEST_LIMIT,
    WEEKLY_QUEST_LIMIT,
    SNAPSHOT_STAT_KEYS,
    DAILY_QUEST_DEFS,
    WEEKLY_QUEST_DEFS,
    ACHIEVEMENT_DEFS,
    createDefaultQuestSnapshot,
    createDefaultQuestWindow,
    createDefaultQuestState,
    createProgressSnapshot,
    summarizeSaveForProgression,
    getCurrentDateKey,
    getCurrentWeekKey,
    buildQuestClaimKey,
    getQuestProgress,
    getAchievementProgress,
    isAchievementComplete,
    getCurrentQuestDefinitions,
  });
}));
