const path = require("node:path");

const ROOT_DIR = path.resolve(__dirname, "..", "..");

function parsePort(value, fallback) {
  const port = Number.parseInt(String(value || ""), 10);
  return Number.isFinite(port) && port > 0 ? port : fallback;
}

module.exports = {
  ROOT_DIR,
  HOST: process.env.HOST || "0.0.0.0",
  PORT: parsePort(process.env.PORT, 3000),
  PUBLIC_DIR: path.join(ROOT_DIR, "frontend", "public"),
  DATA_FILE: path.join(ROOT_DIR, "backend", "data", "local-database.json"),
  SESSION_TTL_HOURS: 24 * 30,
  PASSWORD_ITERATIONS: 120000,
  PASSWORD_KEYLEN: 32,
  PASSWORD_DIGEST: "sha256",
};
