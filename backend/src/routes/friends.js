const { sendJson, parseJsonBody } = require("../lib/http");
const { getBearerToken, sanitizeUsername } = require("../lib/security");
const { updateDatabase, getAccountBySessionToken } = require("../lib/store");
const { sanitizeSave } = require("../lib/game-state");

function registerFriendsRoutes(router) {
  router.get("/api/friends/overview", async (req, res) => {
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
      friends: account.save?.friends || {
        friends: [],
        incoming: [],
        outgoing: [],
        blocked: [],
      },
    });
  });

  router.patch("/api/friends/overview", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const body = await parseJsonBody(req);
    const nextFriends = body?.friends;

    let account = null;
    await updateDatabase((database) => {
      account = getAccountBySessionToken(database, token);
      if (!account) {
        return database;
      }

      account.save = sanitizeSave({
        ...account.save,
        friends: {
          friends: nextFriends?.friends || [],
          incoming: nextFriends?.incoming || [],
          outgoing: nextFriends?.outgoing || [],
          blocked: nextFriends?.blocked || [],
        },
      }, sanitizeUsername);
      return database;
    });

    if (!account) {
      sendJson(res, 401, { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      friends: account.save?.friends || { friends: [], incoming: [], outgoing: [], blocked: [] },
    });
  });
}

module.exports = { registerFriendsRoutes };
