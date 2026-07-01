import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function run(cmd) {
  console.log(`▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: root });
}

try {
  run("node_modules/.bin/drizzle-kit push --force --config lib/db/drizzle.config.ts");
} catch (e) {
  console.error("DB push failed, continuing:", e.message);
}

run("node artifacts/api-server/dist/index.mjs");
