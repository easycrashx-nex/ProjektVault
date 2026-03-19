const { sendJson } = require("../lib/http");
const { BOOSTER_CATALOG, PACK_CATALOG } = require("../lib/catalog");

function registerShopRoutes(router) {
  router.get("/api/shop/catalog", async (_req, res) => {
    sendJson(res, 200, {
      ok: true,
      boosters: BOOSTER_CATALOG,
      packs: PACK_CATALOG,
    });
  });
}

module.exports = { registerShopRoutes };
