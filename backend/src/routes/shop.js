const { sendJson, parseJsonBody } = require("../lib/http");
const { getBearerToken } = require("../lib/security");
const { BOOSTER_CATALOG, PACK_CATALOG, COSMETIC_CATALOG } = require("../lib/catalog");
const { updateDatabase, getAccountBySessionToken, sanitizeAccountForClient } = require("../lib/store");

function getCosmeticItem(type, itemId) {
  const entries = COSMETIC_CATALOG[type];
  if (!Array.isArray(entries)) {
    return null;
  }
  return entries.find((entry) => entry.id === itemId) || null;
}

function registerShopRoutes(router) {
  router.get("/api/shop/catalog", async (_req, res) => {
    sendJson(res, 200, {
      ok: true,
      boosters: BOOSTER_CATALOG,
      packs: PACK_CATALOG,
      cosmetics: COSMETIC_CATALOG,
    });
  });

  router.post("/api/shop/cosmetics/purchase", async (req, res) => {
    const token = getBearerToken(req);
    if (!token) {
      sendJson(res, 401, { ok: false, error: "missing_token", message: "Nicht angemeldet." });
      return;
    }

    const body = await parseJsonBody(req);
    const cosmeticType = String(body?.cosmeticType || "");
    const itemId = String(body?.itemId || "");
    const item = getCosmeticItem(cosmeticType, itemId);

    if (!item) {
      sendJson(res, 404, { ok: false, error: "missing_cosmetic", message: "Dieses Profil-Objekt existiert nicht." });
      return;
    }

    let account = null;
    let status = 200;
    let error = null;
    await updateDatabase((database) => {
      account = getAccountBySessionToken(database, token);
      if (!account) {
        status = 401;
        error = { ok: false, error: "invalid_session", message: "Sitzung nicht gefunden." };
        return database;
      }

      const owned = account.save?.cosmetics?.[cosmeticType] || [];
      if (owned.includes(item.id)) {
        status = 409;
        error = { ok: false, error: "already_owned", message: "Dieses Profil-Objekt besitzt du bereits." };
        return database;
      }

      if ((account.save?.gold || 0) < item.price) {
        status = 400;
        error = { ok: false, error: "not_enough_gold", message: "Dafür reicht dein Gold nicht." };
        return database;
      }

      account.save.gold -= item.price;
      account.save.cosmetics[cosmeticType] = [...owned, item.id];
      return database;
    });

    if (error) {
      sendJson(res, status, error);
      return;
    }

    sendJson(res, 200, {
      ok: true,
      item,
      account: sanitizeAccountForClient(account, { includeSave: true }),
    });
  });
}

module.exports = { registerShopRoutes };
