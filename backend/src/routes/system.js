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
      app: "Arcane Vault",
      storage: "json-file",
      frontend: "frontend/public",
      apiBase: "/api",
    });
  });
}

module.exports = { registerSystemRoutes };
