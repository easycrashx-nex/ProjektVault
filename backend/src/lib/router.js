const { getRequestUrl, sendJson } = require("./http");

function createRouter() {
  const routes = [];

  function register(method, path, handler) {
    routes.push({ method, path, handler });
  }

  async function handle(req, res, context) {
    const pathname = getRequestUrl(req).pathname;
    const route = routes.find((entry) => entry.method === req.method && entry.path === pathname);

    if (!route) {
      return false;
    }

    try {
      await route.handler(req, res, context);
    } catch (error) {
      console.error(error);
      sendJson(res, 500, {
        ok: false,
        error: "internal_error",
        message: error.message || "Internal server error.",
      });
    }

    return true;
  }

  return {
    get: (path, handler) => register("GET", path, handler),
    post: (path, handler) => register("POST", path, handler),
    patch: (path, handler) => register("PATCH", path, handler),
    del: (path, handler) => register("DELETE", path, handler),
    handle,
  };
}

module.exports = { createRouter };
