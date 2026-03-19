const fs = require("node:fs/promises");
const path = require("node:path");
const { DATA_FILE } = require("../config");
const { canonicalizeUsername } = require("./security");

function createEmptyDatabase() {
  return {
    version: 1,
    accounts: {},
    sessions: {},
    market: {
      feeVault: 0,
      cards: {},
      updatedAt: null,
    },
    audit: [],
  };
}

async function ensureDataFile() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(createEmptyDatabase(), null, 2), "utf8");
  }
}

async function readDatabase() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : createEmptyDatabase();
  } catch {
    return createEmptyDatabase();
  }
}

async function writeDatabase(database) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(database, null, 2), "utf8");
}

async function updateDatabase(updater) {
  const database = await readDatabase();
  const nextDatabase = await updater(database) || database;
  await writeDatabase(nextDatabase);
  return nextDatabase;
}

function findAccountByUsername(database, username) {
  const canonicalTarget = canonicalizeUsername(username);
  return Object.values(database.accounts || {}).find((account) => canonicalizeUsername(account.username) === canonicalTarget) || null;
}

function sanitizeAccountForClient(account) {
  if (!account) {
    return null;
  }

  return {
    username: account.username,
    createdAt: account.createdAt,
    roles: Array.isArray(account.roles) ? [...account.roles] : [],
    profile: {
      gold: Number(account.profile?.gold || 0),
      cards: Number(account.profile?.cards || 0),
      boosters: Number(account.profile?.boosters || 0),
    },
  };
}

module.exports = {
  createEmptyDatabase,
  ensureDataFile,
  readDatabase,
  writeDatabase,
  updateDatabase,
  findAccountByUsername,
  sanitizeAccountForClient,
};
