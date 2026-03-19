const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const { HOST, PORT, PUBLIC_DIR } = require("./config");
const { createRouter } = require("./lib/router");
const { sendJson, sendFile, getRequestUrl } = require("./lib/http");
const { ensureDataFile } = require("./lib/store");
const { registerSystemRoutes } = require("./routes/system");
const { registerAuthRoutes } = require("./routes/auth");
const { registerProfileRoutes } = require("./routes/profile");
const { registerShopRoutes } = require("./routes/shop");
const { registerMarketRoutes } = require("./routes/market");
const { registerFriendsRoutes } = require("./routes/friends");
const { registerAdminRoutes } = require("./routes/admin");
const { registerMatchRoutes } = require("./routes/matches");

function safePublicPath(requestPath) {
  const cleaned = requestPath === "/" ? "/index.html" : requestPath;
  const targetPath = path.normalize(path.join(PUBLIC_DIR, cleaned));
  if (!targetPath.startsWith(PUBLIC_DIR)) {
    return null;
  }
  return targetPath;
}

async function serveStatic(req, res) {
  const requestPath = getRequestUrl(req).pathname;
  const targetPath = safePublicPath(requestPath);
  if (!targetPath) {
    sendJson(res, 400, { ok: false, error: "invalid_path" });
    return;
  }

  try {
    const stats = await fs.stat(targetPath);
    if (stats.isDirectory()) {
      await sendFile(res, path.join(targetPath, "index.html"));
      return;
    }
    await sendFile(res, targetPath);
  } catch {
    await sendFile(res, path.join(PUBLIC_DIR, "index.html"));
  }
}

async function createAppServer() {
  await ensureDataFile();
  const router = createRouter();

  registerSystemRoutes(router);
  registerAuthRoutes(router);
  registerProfileRoutes(router);
  registerShopRoutes(router);
  registerMarketRoutes(router);
  registerFriendsRoutes(router);
  registerAdminRoutes(router);
  registerMatchRoutes(router);

  return http.createServer(async (req, res) => {
    const handled = await router.handle(req, res, {});
    if (handled) {
      return;
    }

    if (req.url.startsWith("/api/")) {
      sendJson(res, 404, { ok: false, error: "not_found", message: "API-Route nicht gefunden." });
      return;
    }

    await serveStatic(req, res);
  });
}

if (require.main === module) {
  createAppServer()
    .then((server) => {
      server.listen(PORT, HOST, () => {
        console.log(`Arcane Vault server ready on http://${HOST}:${PORT}`);
      });
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
}

module.exports = { createAppServer };
