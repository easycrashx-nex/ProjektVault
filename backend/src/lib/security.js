const crypto = require("node:crypto");
const {
  PASSWORD_ITERATIONS,
  PASSWORD_KEYLEN,
  PASSWORD_DIGEST,
  SESSION_TTL_HOURS,
} = require("../config");

function canonicalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function sanitizeUsername(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 18);
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
};
