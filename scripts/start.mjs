import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
try {
  execSync("node_modules/.bin/drizzle-kit push --force --config lib/db/drizzle.config.ts", { stdio: "inherit", cwd: root });
} catch (e) {
  console.error("DB push skipped:", e.message);
}
execSync("node artifacts/api-server/dist/index.mjs", { stdio: "inherit", cwd: root });
