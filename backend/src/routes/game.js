const { sendJson, parseJsonBody } = require("../lib/http");
const { getBearerToken } = require("../lib/security");
const {
  updateDatabase,
  getAccountBySessionToken,
  sanitizeAccountForClient,
} = require("../lib/store");
const { sanitizeSave, sanitizeMarketState, summarizeSave } = require("../lib/game-state");
const PROGRESSION_RULES = require("../../../shared/progression-defs.js");

const DAILY_QUEST_DEFS = PROGRESSION_RULES.DAILY_QUEST_DEFS;
const WEEKLY_QUEST_DEFS = PROGRESSION_RULES.WEEKLY_QUEST_DEFS;
const ACHIEVEMENT_DEFS = PROGRESSION_RULES.ACHIEVEMENT_DEFS;

function getCurrentDateKey() {
  return PROGRESSION_RULES.getCurrentDateKey();
}

function getCurrentWeekKey() {
  return PROGRESSION_RULES.getCurrentWeekKey();
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

function ensureQuestWindowState(save, period = "daily") {
  const progression = save.progression;
  const { windowKey, claimedKey, periodKey } = getQuestWindowKeys(period);
  const windowState = progression.quests?.[windowKey] && typeof progression.quests[windowKey] === "object"
    ? progression.quests[windowKey]
    : PROGRESSION_RULES.createDefaultQuestWindow();
  const expectedIds = PROGRESSION_RULES.getCurrentQuestDefinitions(period, periodKey).map((entry) => entry.id);

  if (windowState.key !== periodKey) {
    progression.quests[claimedKey] = [];
    progression.quests[windowKey] = {
      key: periodKey,
      activeIds: [...expectedIds],
      snapshot: PROGRESSION_RULES.createProgressSnapshot(progression, save),
    };
    return true;
  }

  if (!Array.isArray(windowState.activeIds) || !windowState.activeIds.length) {
    windowState.activeIds = [...expectedIds];
  }
  if (!windowState.snapshot || typeof windowState.snapshot !== "object") {
    windowState.snapshot = PROGRESSION_RULES.createProgressSnapshot(progression, save);
  }
  progression.quests[windowKey] = windowState;
  return false;
}

function ensureQuestRotationState(save) {
  const dailyChanged = ensureQuestWindowState(save, "daily");
  const weeklyChanged = ensureQuestWindowState(save, "weekly");
  return dailyChanged || weeklyChanged;
}

function getActiveQuestDefinitions(save, period) {
  ensureQuestWindowState(save, period);
  const { windowKey } = getQuestWindowKeys(period);
  const windowState = save.progression.quests?.[windowKey] || PROGRESSION_RULES.createDefaultQuestWindow();
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

function grantRewardPackage(save, progression, { rewardGold = 0, rewardPackId = "" } = {}) {
  if (rewardGold > 0) {
    save.gold = Math.max(0, Number(save.gold || 0) + rewardGold);
    progression.stats.goldEarned = Math.max(0, Number(progression.stats?.goldEarned || 0) + rewardGold);
  }

  if (rewardPackId && save.packs && Object.prototype.hasOwnProperty.call(save.packs, rewardPackId)) {
    save.packs[rewardPackId] = Math.max(0, Number(save.packs[rewardPackId] || 0) + 1);
  }
}

function registerGameRoutes(router) {
  router.get("/api/game/state", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    let account = null;
    let market = null;
    await updateDatabase((database) => {
      account = getAccountBySessionToken(database, token);
      market = sanitizeMarketState(database.market);
      if (account) {
        ensureQuestRotationState(account.save);
      }
      return database;
    });

    if (!account) {
      sendJson(res, 401, { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      account: sanitizeAccountForClient(account, { includeSave: true }),
      market,
    });
  });

  router.patch("/api/game/state", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const body = await parseJsonBody(req);
    if (!body?.save || typeof body.save !== "object") {
      sendJson(res, 400, { ok: false, error: "invalid_save", message: "Kein gültiger Spielstand übergeben." });
      return;
    }

    let account = null;
    await updateDatabase((database) => {
      account = getAccountBySessionToken(database, token);
      if (!account) {
        return database;
      }

      account.save = sanitizeSave({
        ...body.save,
        friends: account.save?.friends,
      }, (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, 18));
      ensureQuestRotationState(account.save);
      return database;
    });

    if (!account) {
      sendJson(res, 401, { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      account: sanitizeAccountForClient(account, { includeSave: true }),
    });
  });

  router.post("/api/game/claim-reward", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const body = await parseJsonBody(req);
    const kind = String(body?.kind || "").trim();
    const period = String(body?.period || "").trim();
    const questId = String(body?.questId || "").trim();
    const achievementId = String(body?.achievementId || "").trim();

    let account = null;
    let errorPayload = null;
    let successMessage = "Belohnung eingelöst.";

    await updateDatabase((database) => {
      account = getAccountBySessionToken(database, token);
      if (!account) {
        return database;
      }

      const save = account.save;
      const progression = save.progression;
      ensureQuestRotationState(save);

      if (kind === "quest") {
        const questPool = getActiveQuestDefinitions(save, period === "weekly" ? "weekly" : "daily");
        const quest = questPool.find((entry) => entry.id === questId);
        if (!quest) {
          errorPayload = { status: 404, body: { ok: false, error: "quest_not_found", message: "Quest nicht gefunden." } };
          return database;
        }

        const periodKey = quest.periodKey;
        const claimKey = buildQuestClaimKey(quest, periodKey);
        const claimedList = period === "weekly" ? progression.quests.weeklyClaimed : progression.quests.dailyClaimed;
        if (claimedList.includes(claimKey)) {
          errorPayload = { status: 409, body: { ok: false, error: "quest_already_claimed", message: "Diese Quest-Belohnung wurde bereits abgeholt." } };
          return database;
        }

        const { windowKey } = getQuestWindowKeys(period === "weekly" ? "weekly" : "daily");
        const baselineSnapshot = progression.quests?.[windowKey]?.snapshot || PROGRESSION_RULES.createDefaultQuestSnapshot();
        const currentSnapshot = PROGRESSION_RULES.createProgressSnapshot(progression, save);
        const progress = Math.min(quest.target, Math.max(0, Number(PROGRESSION_RULES.getQuestProgress(quest, currentSnapshot, baselineSnapshot) || 0)));
        if (progress < quest.target) {
          errorPayload = { status: 409, body: { ok: false, error: "quest_not_ready", message: "Diese Quest ist noch nicht abgeschlossen." } };
          return database;
        }

        if (period === "weekly") {
          progression.quests.weeklyClaimed = [...progression.quests.weeklyClaimed, claimKey];
        } else {
          progression.quests.dailyClaimed = [...progression.quests.dailyClaimed, claimKey];
        }
        grantRewardPackage(save, progression, quest);
        successMessage = "Quest-Belohnung abgeholt.";
        return database;
      }

      if (kind === "achievement") {
        const achievement = ACHIEVEMENT_DEFS.find((entry) => entry.id === achievementId);
        if (!achievement) {
          errorPayload = { status: 404, body: { ok: false, error: "achievement_not_found", message: "Errungenschaft nicht gefunden." } };
          return database;
        }

        if (progression.achievementsClaimed.includes(achievement.id)) {
          errorPayload = { status: 409, body: { ok: false, error: "achievement_already_claimed", message: "Diese Errungenschaft wurde bereits eingelöst." } };
          return database;
        }

        const currentSnapshot = PROGRESSION_RULES.createProgressSnapshot(progression, save);
        if (!PROGRESSION_RULES.isAchievementComplete(achievement, currentSnapshot)) {
          errorPayload = { status: 409, body: { ok: false, error: "achievement_not_ready", message: "Diese Errungenschaft ist noch nicht abgeschlossen." } };
          return database;
        }

        progression.achievementsClaimed = [...progression.achievementsClaimed, achievement.id];
        grantRewardPackage(save, progression, achievement);
        successMessage = "Errungenschaft eingelöst.";
        return database;
      }

      errorPayload = { status: 400, body: { ok: false, error: "invalid_claim_kind", message: "Ungültige Belohnungsart." } };
      return database;
    });

    if (!account) {
      sendJson(res, 401, { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." });
      return;
    }

    if (errorPayload) {
      sendJson(res, errorPayload.status, errorPayload.body);
      return;
    }

    sendJson(res, 200, {
      ok: true,
      message: successMessage,
      account: sanitizeAccountForClient(account, { includeSave: true }),
    });
  });
}

module.exports = { registerGameRoutes };
