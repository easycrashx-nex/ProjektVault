const { sendJson } = require("../lib/http");
const { updateDatabase, sanitizeAccountForClient } = require("../lib/store");

function registerAdminRoutes(router) {
  router.get("/api/admin/accounts", async (_req, res) => {
    let accounts = [];
    await updateDatabase((database) => {
      accounts = Object.values(database.accounts || {}).map((account) => sanitizeAccountForClient(account));
      return database;
    });

    sendJson(res, 200, { ok: true, accounts });
  });
}

module.exports = { registerAdminRoutes };
