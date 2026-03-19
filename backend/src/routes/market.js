const { sendJson } = require("../lib/http");
const { updateDatabase } = require("../lib/store");

function registerMarketRoutes(router) {
  router.get("/api/market/overview", async (_req, res) => {
    let market = null;
    await updateDatabase((database) => {
      market = {
        feeVault: Number(database.market?.feeVault || 0),
        updatedAt: database.market?.updatedAt || null,
        trackedCards: Object.keys(database.market?.cards || {}).length,
      };
      return database;
    });

    sendJson(res, 200, { ok: true, market });
  });
}

module.exports = { registerMarketRoutes };
