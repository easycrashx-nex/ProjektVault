const { sendJson, parseJsonBody } = require("../lib/http");
const {
  sanitizeUsername,
  canonicalizeUsername,
  createPasswordHash,
  verifyPassword,
  createSession,
  getBearerToken,
  getPlayerUsernameValidation,
  isReservedPlayerName,
} = require("../lib/security");
const { createEmptySave, sanitizeSave } = require("../lib/game-state");
const {
  updateDatabase,
  findAccountByUsername,
  sanitizeAccountForClient,
} = require("../lib/store");

const LEGACY_PLAYER_NAME_PATTERN = /^[A-Za-z\u00C4\u00D6\u00DC\u00E4\u00F6\u00FC\u00DF0-9_-]+$/u;

function validateCredentials(username, password) {
  const usernameValidation = getPlayerUsernameValidation(username);
  if (usernameValidation) {
    return usernameValidation;
  }
  if (!password || password.length < 4) {
    return { code: "invalid_password", message: "Das Passwort muss mindestens 4 Zeichen lang sein." };
  }
  return null;
}

function validateLegacyRecoveryInput(username, password) {
  if (
    !username
    || username.length < 3
    || username.length > 18
    || !LEGACY_PLAYER_NAME_PATTERN.test(username)
  ) {
    return { code: "invalid_username", message: "Dieser alte Spielername kann nicht wiederhergestellt werden." };
  }

  if (isReservedPlayerName(username)) {
    return { code: "reserved_username", message: "Reservierte Admin-Namen können nicht über die Wiederherstellung importiert werden." };
  }

  if (!password || password.length < 4) {
    return { code: "invalid_password", message: "Das Passwort muss mindestens 4 Zeichen lang sein." };
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
      sendJson(res, 400, { ok: false, error: error.code || "invalid_input", message: error.message });
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
        save: createEmptySave(),
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
      account: sanitizeAccountForClient(account, { includeSave: true }),
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
      account: sanitizeAccountForClient(account, { includeSave: true }),
    });
  });

  router.post("/api/auth/recover-legacy", async (req, res) => {
    const body = await parseJsonBody(req);
    const username = sanitizeUsername(body?.username);
    const password = String(body?.password || "");
    const validationError = validateLegacyRecoveryInput(username, password);

    if (validationError) {
      sendJson(res, 400, { ok: false, error: validationError.code, message: validationError.message });
      return;
    }

    if (!body?.save || typeof body.save !== "object") {
      sendJson(res, 400, { ok: false, error: "invalid_save", message: "Kein gültiger alter Spielstand übergeben." });
      return;
    }

    const canonical = canonicalizeUsername(username);
    let createdSessionToken = null;
    let responseAccount = null;
    let authFailed = false;

    await updateDatabase((database) => {
      const existing = findAccountByUsername(database, username);
      const sanitizedLegacySave = sanitizeSave({
        ...body.save,
        friends: existing?.save?.friends || body.save?.friends,
      }, sanitizeUsername);

      if (existing) {
        if (!verifyPassword(password, existing.passwordHash)) {
          authFailed = true;
          return database;
        }

        existing.save = sanitizedLegacySave;
        if (typeof body?.createdAt === "string") {
          existing.createdAt = existing.createdAt && Date.parse(existing.createdAt) <= Date.parse(body.createdAt)
            ? existing.createdAt
            : body.createdAt;
        }
        responseAccount = existing;
      } else {
        database.accounts[username] = {
          username,
          canonical,
          createdAt: typeof body?.createdAt === "string" ? body.createdAt : new Date().toISOString(),
          roles: [],
          passwordHash: createPasswordHash(password),
          save: sanitizedLegacySave,
        };
        responseAccount = database.accounts[username];
      }

      const session = createSession(responseAccount.username);
      database.sessions[session.token] = session;
      createdSessionToken = session.token;
      return database;
    });

    if (authFailed || !responseAccount || !createdSessionToken) {
      sendJson(res, 401, { ok: false, error: "invalid_credentials", message: "Der alte Spielstand konnte nicht sicher zugeordnet werden." });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      recovered: true,
      sessionToken: createdSessionToken,
      account: sanitizeAccountForClient(responseAccount, { includeSave: true }),
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
