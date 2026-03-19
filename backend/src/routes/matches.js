const { sendJson } = require("../lib/http");

function registerMatchRoutes(router) {
  router.get("/api/matches/active", async (_req, res) => {
    sendJson(res, 200, {
      ok: true,
      supported: false,
      message: "Match-Persistenz ist lokal im Frontend aktiv. Ein serverseitiger Match-Store kann hier später ergänzt werden.",
    });
  });
}

module.exports = { registerMatchRoutes };
