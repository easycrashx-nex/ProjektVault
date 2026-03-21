const { DATA_DIR, DATA_FILE } = require("../config");
const { sendJson } = require("../lib/http");

function registerSystemRoutes(router) {
  router.get("/api/health", async (_req, res) => {
    sendJson(res, 200, {
      ok: true,
      mode: "server-backed",
      timestamp: new Date().toISOString(),
    });
  });

  router.get("/api/meta", async (_req, res) => {
    sendJson(res, 200, {
      ok: true,
      app: "Projekt Vault",
      storage: "json-file",
      dataDir: DATA_DIR,
      dataFile: DATA_FILE,
      frontend: "frontend/public",
      apiBase: "/api",
    });
  });
}

module.exports = { registerSystemRoutes };
