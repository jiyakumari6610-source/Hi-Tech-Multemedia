import { execSync } from "node:child_process";
import { cpSync, rmSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function run(cmd, cwd = root) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd });
}

run("npx --yes pnpm@9.15.0 install --frozen-lockfile=false");
run("npx pnpm@9.15.0 --filter @workspace/hitech-multimedia run build");
run("npx pnpm@9.15.0 --filter @workspace/api-server run build");

const frontendDist = path.join(root, "artifacts/hitech-multimedia/dist/public");
const apiPublic = path.join(root, "artifacts/api-server/dist/public");

if (existsSync(apiPublic)) rmSync(apiPublic, { recursive: true, force: true });
mkdirSync(apiPublic, { recursive: true });
cpSync(frontendDist, apiPublic, { recursive: true });

console.log("\n✅ Build complete!");
