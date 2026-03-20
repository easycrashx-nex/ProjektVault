const { sendJson, parseJsonBody } = require("../lib/http");
const { getBearerToken } = require("../lib/security");
const {
  updateDatabase,
  getAccountBySessionToken,
  sanitizeAccountForClient,
} = require("../lib/store");
const { sanitizeSave, sanitizeMarketState } = require("../lib/game-state");

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

module.exports = { registerGameRoutes };
