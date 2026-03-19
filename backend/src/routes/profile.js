const { sendJson, parseJsonBody } = require("../lib/http");
const {
  getBearerToken,
  sanitizeUsername,
  canonicalizeUsername,
  verifyPassword,
  createPasswordHash,
} = require("../lib/security");
const { updateDatabase, sanitizeAccountForClient } = require("../lib/store");

async function resolveSessionAccount(token) {
  let sessionAccount = null;

  await updateDatabase((database) => {
    const session = database.sessions[token];
    if (!session) {
      return database;
    }
    sessionAccount = Object.values(database.accounts).find((account) => canonicalizeUsername(account.username) === canonicalizeUsername(session.username)) || null;
    return database;
  });

  return sessionAccount;
}

function registerProfileRoutes(router) {
  router.get("/api/profile/me", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const account = await resolveSessionAccount(token);
    if (!account) {
      sendJson(res, 401, { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." });
      return;
    }

    sendJson(res, 200, { ok: true, account: sanitizeAccountForClient(account) });
  });

  router.patch("/api/profile/me", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const body = await parseJsonBody(req);
    const requestedUsername = sanitizeUsername(body.username);
    if (!requestedUsername) {
      sendJson(res, 400, { ok: false, error: "invalid_username", message: "Kein gültiger Spielername angegeben." });
      return;
    }

    let responseAccount = null;
    let conflict = false;

    await updateDatabase((database) => {
      const session = database.sessions[token];
      if (!session) {
        return database;
      }

      const currentAccount = Object.values(database.accounts).find((account) => canonicalizeUsername(account.username) === canonicalizeUsername(session.username));
      if (!currentAccount) {
        return database;
      }

      const duplicate = Object.values(database.accounts).find((account) => canonicalizeUsername(account.username) === canonicalizeUsername(requestedUsername) && account.username !== currentAccount.username);
      if (duplicate) {
        conflict = true;
        return database;
      }

      delete database.accounts[currentAccount.username];
      currentAccount.username = requestedUsername;
      currentAccount.canonical = canonicalizeUsername(requestedUsername);
      database.accounts[currentAccount.username] = currentAccount;
      session.username = requestedUsername;
      responseAccount = currentAccount;
      return database;
    });

    if (conflict) {
      sendJson(res, 409, { ok: false, error: "username_taken", message: "Dieser Spielername ist bereits vergeben." });
      return;
    }

    if (!responseAccount) {
      sendJson(res, 401, { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." });
      return;
    }

    sendJson(res, 200, { ok: true, account: sanitizeAccountForClient(responseAccount) });
  });

  router.patch("/api/profile/password", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const body = await parseJsonBody(req);
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");

    if (!currentPassword) {
      sendJson(res, 400, { ok: false, error: "missing_current_password", message: "Aktuelles Passwort fehlt." });
      return;
    }

    if (newPassword.length < 4) {
      sendJson(res, 400, { ok: false, error: "invalid_new_password", message: "Das neue Passwort muss mindestens 4 Zeichen lang sein." });
      return;
    }

    let changed = false;
    await updateDatabase((database) => {
      const session = database.sessions[token];
      if (!session) {
        return database;
      }

      const currentAccount = Object.values(database.accounts).find((account) => canonicalizeUsername(account.username) === canonicalizeUsername(session.username));
      if (!currentAccount) {
        return database;
      }

      if (!verifyPassword(currentPassword, currentAccount.passwordHash)) {
        return database;
      }

      currentAccount.passwordHash = createPasswordHash(newPassword);
      changed = true;
      return database;
    });

    if (!changed) {
      sendJson(res, 401, { ok: false, error: "invalid_credentials", message: "Aktuelles Passwort ist falsch." });
      return;
    }

    sendJson(res, 200, { ok: true });
  });
}

module.exports = { registerProfileRoutes };
