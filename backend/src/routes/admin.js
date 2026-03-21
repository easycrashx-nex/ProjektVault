const { sendJson, parseJsonBody } = require("../lib/http");
const {
  getBearerToken,
  sanitizeUsername,
  createPasswordHash,
  getPlayerUsernameValidation,
} = require("../lib/security");
const {
  updateDatabase,
  getAccountBySessionToken,
  findAccountByUsername,
  hasAdminRole,
  sanitizeAccountForClient,
} = require("../lib/store");
const { sanitizeSave, createEmptySave } = require("../lib/game-state");

function resolveAdmin(database, token) {
  const account = getAccountBySessionToken(database, token);
  return hasAdminRole(account) ? account : null;
}

function registerAdminRoutes(router) {
  router.get("/api/admin/accounts", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    let accounts = [];
    let admin = null;
    await updateDatabase((database) => {
      admin = resolveAdmin(database, token);
      if (!admin) {
        return database;
      }

      accounts = Object.values(database.accounts || {}).map((account) => sanitizeAccountForClient(account, { includeSave: true }));
      return database;
    });

    if (!admin) {
      sendJson(res, 403, { ok: false, error: "forbidden", message: "Adminrechte erforderlich." });
      return;
    }

    sendJson(res, 200, { ok: true, accounts });
  });

  router.post("/api/admin/action", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const body = await parseJsonBody(req);
    const action = String(body?.action || "");
    const targetUsername = String(body?.username || "").trim();
    const password = String(body?.password || "");
    const amount = Number.parseInt(String(body?.amount || "0"), 10);
    const packId = String(body?.packId || "").trim();
    const cardId = String(body?.cardId || "").trim();

    let updatedAccount = null;
    let admin = null;
    let actionError = null;

    await updateDatabase((database) => {
      admin = resolveAdmin(database, token);
      if (!admin) {
        return database;
      }

      const account = findAccountByUsername(database, targetUsername);
      if (action === "createAccount") {
        const username = sanitizeUsername(targetUsername);
        const usernameError = getPlayerUsernameValidation(username);
        if (usernameError) {
          actionError = usernameError.message;
          return database;
        }
        if (password.length < 4) {
          actionError = "Das Passwort muss mindestens 4 Zeichen lang sein.";
          return database;
        }
        if (findAccountByUsername(database, username)) {
          actionError = "Dieser Spielername ist bereits vergeben.";
          return database;
        }

        database.accounts[username] = {
          username,
          canonical: username.toLowerCase(),
          createdAt: new Date().toISOString(),
          roles: [],
          passwordHash: createPasswordHash(password),
          save: createEmptySave(),
        };
        updatedAccount = database.accounts[username];
        return database;
      }

      if (!account) {
        return database;
      }

      if (action === "deleteAccount") {
        if (hasAdminRole(account)) {
          return database;
        }

        delete database.accounts[account.username];
        Object.keys(database.sessions || {}).forEach((sessionToken) => {
          if (database.sessions[sessionToken]?.username === account.username) {
            delete database.sessions[sessionToken];
          }
        });
        updatedAccount = null;
        return database;
      }

      const safeAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;
      const draftSave = sanitizeSave(account.save, (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, 18));

      switch (action) {
        case "grantGold":
          draftSave.gold += safeAmount;
          break;
        case "removeGold":
          draftSave.gold = Math.max(0, draftSave.gold - safeAmount);
          break;
        case "grantPack":
          if (draftSave.packs[packId] !== undefined) {
            draftSave.packs[packId] += safeAmount;
          }
          break;
        case "removePack":
          if (draftSave.packs[packId] !== undefined) {
            draftSave.packs[packId] = Math.max(0, draftSave.packs[packId] - safeAmount);
          }
          break;
        case "grantCard":
          if (cardId) {
            draftSave.collection[cardId] = Math.max(0, Number(draftSave.collection[cardId] || 0) + safeAmount);
          }
          break;
        case "removeCard":
          if (cardId) {
            draftSave.collection[cardId] = Math.max(0, Number(draftSave.collection[cardId] || 0) - safeAmount);
            if (!draftSave.collection[cardId]) {
              delete draftSave.collection[cardId];
            }
          }
          break;
        case "resetAccount":
          if (hasAdminRole(account)) {
            return database;
          }
          account.save = sanitizeSave(undefined, (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, 18));
          updatedAccount = account;
          return database;
        default:
          return database;
      }

      account.save = sanitizeSave(draftSave, (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, 18));
      updatedAccount = account;
      return database;
    });

    if (!admin) {
      sendJson(res, 403, { ok: false, error: "forbidden", message: "Adminrechte erforderlich." });
      return;
    }

    if (actionError) {
      sendJson(res, 400, { ok: false, error: "admin_action_failed", message: actionError });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      account: updatedAccount ? sanitizeAccountForClient(updatedAccount, { includeSave: true }) : null,
    });
  });
}

module.exports = { registerAdminRoutes };
