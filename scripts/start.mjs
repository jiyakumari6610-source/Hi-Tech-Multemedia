import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function run(cmd, cwd = root) {
  console.log(`▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd });
}

// Push DB schema (creates tables if they don't exist, safe to run repeatedly)
try {
  run("pnpm --filter @workspace/db run push-force", root);
  console.log("✅ DB schema up to date");
} catch (err) {
  console.error("⚠️  DB push failed (continuing anyway):", err.message);
}

// Start the API server
run("node artifacts/api-server/dist/index.mjs", root);
