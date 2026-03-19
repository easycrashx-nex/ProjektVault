import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "frontend", "public");

const files = [
  ["index.html", "index.html"],
  ["styles.css", "styles.css"],
  ["app.js", "app.js"],
];

await mkdir(publicDir, { recursive: true });

for (const [sourceName, targetName] of files) {
  const sourcePath = path.join(rootDir, sourceName);
  const targetPath = path.join(publicDir, targetName);
  await copyFile(sourcePath, targetPath);
  console.log(`sync ${sourceName} -> frontend/public/${targetName}`);
}
