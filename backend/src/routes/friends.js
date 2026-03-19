const { sendJson } = require("../lib/http");

function registerFriendsRoutes(router) {
  router.get("/api/friends/overview", async (_req, res) => {
    sendJson(res, 200, {
      ok: true,
      ready: false,
      message: "Freundeslisten und Handel sind im Backend vorbereitet, aber noch nicht an das Frontend gekoppelt.",
    });
  });
}

module.exports = { registerFriendsRoutes };
