const fs = require("node:fs");
const path = require("node:path");

const ROOT_DIR = path.resolve(__dirname, "..", "..");
const LEGACY_DATA_DIR = path.join(ROOT_DIR, "backend", "data");
const DEFAULT_PERSISTENT_DATA_DIR = path.join("/data", "projekt-vault");

function parsePort(value, fallback) {
  const port = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(port) && port > 0 ? port : fallback;
}

function resolvePath(value, fallback) {
  const input = String(value || "").trim();
  if (!input) {
    return fallback;
  }
  return path.isAbsolute(input) ? input : path.join(ROOT_DIR, input);
}

function detectServerRuntime() {
  return (
    String(process.env.NODE_ENV || "").toLowerCase() === "production"
    || Boolean(process.env.COOLIFY_BRANCH)
    || Boolean(process.env.COOLIFY_FQDN)
    || Boolean(process.env.COOLIFY_URL)
  );
}

function resolveDefaultDataDir() {
  if (!detectServerRuntime()) {
    return LEGACY_DATA_DIR;
  }

  if (String(process.env.DATA_DIR || "").trim()) {
    return resolvePath(process.env.DATA_DIR, DEFAULT_PERSISTENT_DATA_DIR);
  }

  if (fs.existsSync(DEFAULT_PERSISTENT_DATA_DIR)) {
    return DEFAULT_PERSISTENT_DATA_DIR;
  }

  return LEGACY_DATA_DIR;
}

const DATA_DIR = resolveDefaultDataDir();
const DATA_FILE = resolvePath(process.env.DATA_FILE, path.join(DATA_DIR, "local-database.json"));
const DATA_BACKUP_FILE = resolvePath(process.env.DATA_BACKUP_FILE, path.join(DATA_DIR, "local-database.backup.json"));

module.exports = {
  ROOT_DIR,
  LEGACY_DATA_DIR,
  HOST: process.env.HOST || "0.0.0.0",
  PORT: parsePort(process.env.PORT, 3000),
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || "obsidian_admin",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "bitte-vor-serverstart-aendern",
  PUBLIC_DIR: path.join(ROOT_DIR, "frontend", "public"),
  DATA_DIR,
  DATA_FILE,
  DATA_BACKUP_FILE,
  SESSION_TTL_HOURS: 24 * 30,
  PASSWORD_ITERATIONS: 120000,
  PASSWORD_KEYLEN: 32,
  PASSWORD_DIGEST: "sha256",
};
