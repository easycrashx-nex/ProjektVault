const crypto = require("node:crypto");
const {
  PASSWORD_ITERATIONS,
  PASSWORD_KEYLEN,
  PASSWORD_DIGEST,
  SESSION_TTL_HOURS,
} = require("../config");

const PLAYER_NAME_MIN_LENGTH = 3;
const PLAYER_NAME_MAX_LENGTH = 12;
const PLAYER_NAME_PATTERN = /^[A-Za-z\u00C4\u00D6\u00DC\u00E4\u00F6\u00FC\u00DF0-9_-]+$/u;

function canonicalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function sanitizeUsername(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 18);
}

function normalizeReservedUsernameCheck(value) {
  return String(value || "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[@4]/g, "a")
    .replace(/[1!|l]/g, "i")
    .replace(/[^a-z0-9]/g, "");
}

function isReservedPlayerName(value) {
  const username = String(value || "").trim();
  if (!username) {
    return false;
  }
  return normalizeReservedUsernameCheck(username).includes("admin");
}

function getPlayerUsernameValidation(value) {
  const username = String(value || "").trim();
  if (
    !username
    || username.length < PLAYER_NAME_MIN_LENGTH
    || username.length > PLAYER_NAME_MAX_LENGTH
    || !PLAYER_NAME_PATTERN.test(username)
  ) {
    return {
      code: "invalid_username",
      message: "Bitte einen Spielernamen mit 3 bis 12 Zeichen verwenden.",
    };
  }

  if (isReservedPlayerName(username)) {
    return {
      code: "reserved_username",
      message: "Namen mit Admin oder adminähnlichen Varianten sind reserviert.",
    };
  }

  return null;
}

function createPasswordHash(password) {
  const salt = crypto.randomBytes(16).toString("base64");
  const hash = crypto.pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEYLEN, PASSWORD_DIGEST).toString("base64");
  return {
    algo: `pbkdf2-${PASSWORD_DIGEST}`,
    iterations: PASSWORD_ITERATIONS,
    salt,
    hash,
  };
}

function verifyPassword(password, passwordHash) {
  if (!passwordHash?.salt || !passwordHash?.hash || !passwordHash?.iterations) {
    return false;
  }

  const candidate = crypto.pbkdf2Sync(
    password,
    passwordHash.salt,
    passwordHash.iterations,
    PASSWORD_KEYLEN,
    PASSWORD_DIGEST,
  ).toString("base64");

  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(passwordHash.hash));
}

function createSession(username) {
  const token = crypto.randomBytes(32).toString("hex");
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000).toISOString();

  return {
    token,
    username,
    createdAt,
    expiresAt,
  };
}

function isSessionExpired(session) {
  return !session?.expiresAt || Date.parse(session.expiresAt) <= Date.now();
}

function getBearerToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : null;
}

module.exports = {
  canonicalizeUsername,
  sanitizeUsername,
  createPasswordHash,
  verifyPassword,
  createSession,
  isSessionExpired,
  getBearerToken,
  PLAYER_NAME_MIN_LENGTH,
  PLAYER_NAME_MAX_LENGTH,
  isReservedPlayerName,
  getPlayerUsernameValidation,
};
