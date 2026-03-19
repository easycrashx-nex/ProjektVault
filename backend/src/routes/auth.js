const { sendJson, parseJsonBody } = require("../lib/http");
const {
  sanitizeUsername,
  canonicalizeUsername,
  createPasswordHash,
  verifyPassword,
  createSession,
  getBearerToken,
} = require("../lib/security");
const { updateDatabase, findAccountByUsername, sanitizeAccountForClient } = require("../lib/store");

function validateCredentials(username, password) {
  if (!username || username.length < 3 || username.length > 18) {
    return "Bitte einen Spielernamen mit 3 bis 18 Zeichen verwenden.";
  }
  if (!password || password.length < 4) {
    return "Das Passwort muss mindestens 4 Zeichen lang sein.";
  }
  return null;
}

function registerAuthRoutes(router) {
  router.post("/api/auth/register", async (req, res) => {
    const body = await parseJsonBody(req);
    const username = sanitizeUsername(body.username);
    const password = String(body.password || "");
    const error = validateCredentials(username, password);

    if (error) {
      sendJson(res, 400, { ok: false, error: "invalid_input", message: error });
      return;
    }

    const canonical = canonicalizeUsername(username);
    let conflict = false;
    let createdSessionToken = null;
    const result = await updateDatabase((database) => {
      if (findAccountByUsername(database, username)) {
        conflict = true;
        return database;
      }

      const session = createSession(username);
      database.accounts[username] = {
        username,
        canonical,
        createdAt: new Date().toISOString(),
        roles: [],
        passwordHash: createPasswordHash(password),
        profile: { gold: 260, cards: 0, boosters: 5 },
      };
      database.sessions[session.token] = session;
      createdSessionToken = session.token;
      return database;
    });

    if (conflict) {
      sendJson(res, 409, { ok: false, error: "username_taken", message: "Dieser Spielername ist bereits vergeben." });
      return;
    }

    const account = findAccountByUsername(result, username);
    if (!account || canonicalizeUsername(account.username) !== canonical) {
      sendJson(res, 500, { ok: false, error: "register_failed", message: "Konto konnte nicht erstellt werden." });
      return;
    }

    sendJson(res, 201, {
      ok: true,
      sessionToken: createdSessionToken,
      account: sanitizeAccountForClient(account),
    });
  });

  router.post("/api/auth/login", async (req, res) => {
    const body = await parseJsonBody(req);
    const username = sanitizeUsername(body.username);
    const password = String(body.password || "");

    const database = await updateDatabase((current) => current);
    const account = findAccountByUsername(database, username);
    if (!account || !verifyPassword(password, account.passwordHash)) {
      sendJson(res, 401, { ok: false, error: "invalid_credentials", message: "Spielername oder Passwort sind falsch." });
      return;
    }

    const session = createSession(account.username);
    database.sessions[session.token] = session;
    await updateDatabase(() => database);

    sendJson(res, 200, {
      ok: true,
      sessionToken: session.token,
      account: sanitizeAccountForClient(account),
    });
  });

  router.post("/api/auth/logout", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 400, { ok: false, error: "missing_token", message: "Kein Session-Token übergeben." });
      return;
    }

    await updateDatabase((database) => {
      delete database.sessions[token];
      return database;
    });

    sendJson(res, 200, { ok: true });
  });
}

module.exports = { registerAuthRoutes };
