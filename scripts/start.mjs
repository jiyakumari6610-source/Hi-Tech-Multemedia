import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function run(cmd, cwd = root) {
  console.log(`▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd });
}

try {
  run("node_modules/.bin/drizzle-kit push --force --config lib/db/drizzle.config.ts");
  console.log("✅ DB schema up to date");
} catch (err) {
  console.error("⚠️  DB push failed:", err.message);
}

run("node artifacts/api-server/dist/index.mjs");
