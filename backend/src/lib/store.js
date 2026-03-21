const fs = require("node:fs/promises");
const path = require("node:path");
const {
  DATA_FILE,
  DATA_BACKUP_FILE,
  LEGACY_DATA_DIR,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
} = require("../config");
const {
  canonicalizeUsername,
  sanitizeUsername,
  createPasswordHash,
  isSessionExpired,
} = require("./security");
const {
  createEmptySave,
  createInitialMarketState,
  sanitizeSave,
  sanitizeMarketState,
  sanitizeAccountForClient,
} = require("./game-state");

function createEmptyDatabase() {
  return {
    version: 2,
    accounts: {},
    sessions: {},
    market: createInitialMarketState(),
    audit: [],
  };
}

let databaseMutationQueue = Promise.resolve();

async function ensureDataFile() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    const legacyFile = path.join(LEGACY_DATA_DIR, "local-database.json");
    try {
      if (path.resolve(legacyFile) !== path.resolve(DATA_FILE)) {
        await fs.access(legacyFile);
        const legacyRaw = await fs.readFile(legacyFile, "utf8");
        const migrated = normalizeDatabase(JSON.parse(legacyRaw));
        await fs.writeFile(DATA_FILE, JSON.stringify(migrated, null, 2), "utf8");
        await fs.writeFile(DATA_BACKUP_FILE, JSON.stringify(migrated, null, 2), "utf8");
        return;
      }
    } catch {
      // Fallback to creating a fresh database below.
    }

    const emptyDatabase = createEmptyDatabase();
    await fs.writeFile(DATA_FILE, JSON.stringify(emptyDatabase, null, 2), "utf8");
    await fs.writeFile(DATA_BACKUP_FILE, JSON.stringify(emptyDatabase, null, 2), "utf8");
  }
}

function normalizeSession(session) {
  if (!session?.token || !session?.username) {
    return null;
  }

  return {
    token: String(session.token),
    username: sanitizeUsername(session.username),
    createdAt: typeof session.createdAt === "string" ? session.createdAt : new Date().toISOString(),
    expiresAt: typeof session.expiresAt === "string" ? session.expiresAt : null,
  };
}

function normalizeAccount(account) {
  const username = sanitizeUsername(account?.username);
  if (!username) {
    return null;
  }

  const roles = Array.isArray(account?.roles)
    ? [...new Set(account.roles.map((role) => String(role || "").trim()).filter(Boolean))]
    : [];

  return {
    username,
    canonical: canonicalizeUsername(username),
    createdAt: typeof account?.createdAt === "string" ? account.createdAt : new Date().toISOString(),
    roles,
    passwordHash: account?.passwordHash || null,
    save: sanitizeSave(account?.save, sanitizeUsername),
  };
}

function ensureBootstrapAdmin(database) {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    return database;
  }

  const existing = findAccountByUsername(database, ADMIN_USERNAME);
  if (existing) {
    if (!existing.roles.includes("admin")) {
      existing.roles = [...existing.roles, "admin"];
    }
    return database;
  }

  const username = sanitizeUsername(ADMIN_USERNAME);
  database.accounts[username] = normalizeAccount({
    username,
    roles: ["admin"],
    createdAt: new Date().toISOString(),
    passwordHash: createPasswordHash(ADMIN_PASSWORD),
    save: createEmptySave(),
  });
  return database;
}

function normalizeDatabase(database) {
  const base = createEmptyDatabase();
  const next = {
    version: 2,
    accounts: {},
    sessions: {},
    market: sanitizeMarketState(database?.market),
    audit: Array.isArray(database?.audit) ? database.audit.slice(-400) : [],
  };

  if (database?.accounts && typeof database.accounts === "object") {
    Object.entries(database.accounts).forEach(([key, account]) => {
      const normalized = normalizeAccount({
        ...account,
        username: sanitizeUsername(account?.username || key),
      });
      if (normalized) {
        next.accounts[normalized.username] = normalized;
      }
    });
  }

  if (database?.sessions && typeof database.sessions === "object") {
    Object.entries(database.sessions).forEach(([token, session]) => {
      const normalized = normalizeSession({ ...session, token });
      if (normalized && !isSessionExpired(normalized)) {
        next.sessions[normalized.token] = normalized;
      }
    });
  }

  ensureBootstrapAdmin(next);

  return {
    ...base,
    ...next,
  };
}

async function readDatabase() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    return normalizeDatabase(JSON.parse(raw));
  } catch {
    return normalizeDatabase(createEmptyDatabase());
  }
}

async function writeDatabase(database) {
  await ensureDataFile();
  const normalized = normalizeDatabase(database);
  await fs.mkdir(path.dirname(DATA_BACKUP_FILE), { recursive: true });
  try {
    const existingRaw = await fs.readFile(DATA_FILE, "utf8");
    await fs.writeFile(DATA_BACKUP_FILE, existingRaw, "utf8");
  } catch {
    // Ignore backup refresh issues and still try to write the live database.
  }
  await fs.writeFile(DATA_FILE, JSON.stringify(normalized, null, 2), "utf8");
}

async function updateDatabase(updater) {
  const operation = databaseMutationQueue.then(async () => {
    const database = await readDatabase();
    const nextDatabase = (await updater(database)) || database;
    const normalized = normalizeDatabase(nextDatabase);
    await writeDatabase(normalized);
    return normalized;
  });

  databaseMutationQueue = operation.catch(() => undefined);
  return operation;
}

function findAccountByUsername(database, username) {
  const canonicalTarget = canonicalizeUsername(username);
  return Object.values(database.accounts || {}).find((account) => canonicalizeUsername(account.username) === canonicalTarget) || null;
}

function getAccountBySessionToken(database, token) {
  const session = database.sessions?.[token];
  if (!session || isSessionExpired(session)) {
    return null;
  }
  return findAccountByUsername(database, session.username);
}

function hasAdminRole(account) {
  return Boolean(account?.roles && account.roles.includes("admin"));
}

module.exports = {
  createEmptyDatabase,
  ensureDataFile,
  readDatabase,
  writeDatabase,
  updateDatabase,
  findAccountByUsername,
  getAccountBySessionToken,
  hasAdminRole,
  normalizeAccount,
  normalizeDatabase,
  sanitizeAccountForClient,
};
