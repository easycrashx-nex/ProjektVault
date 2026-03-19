const { sendJson, parseJsonBody } = require("../lib/http");
const { getBearerToken } = require("../lib/security");
const {
  updateDatabase,
  getAccountBySessionToken,
  sanitizeAccountForClient,
} = require("../lib/store");
const { sanitizeSave } = require("../lib/game-state");

function registerMatchRoutes(router) {
  router.get("/api/matches/active", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    let account = null;
    await updateDatabase((database) => {
      account = getAccountBySessionToken(database, token);
      return database;
    });

    if (!account) {
      sendJson(res, 401, { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      activeMatch: account.save?.activeMatch || null,
    });
  });

  router.patch("/api/matches/active", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const body = await parseJsonBody(req);
    if (!("activeMatch" in body)) {
      sendJson(res, 400, { ok: false, error: "invalid_match", message: "Kein Match-Snapshot übergeben." });
      return;
    }

    let account = null;
    await updateDatabase((database) => {
      account = getAccountBySessionToken(database, token);
      if (!account) {
        return database;
      }

      account.save = sanitizeSave({
        ...account.save,
        activeMatch: body.activeMatch,
      }, (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, 18));
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
}

module.exports = { registerMatchRoutes };
