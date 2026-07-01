import { execSync } from "node:child_process";
import { cpSync, rmSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function run(cmd, cwd = root) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd });
}

// 1. Build the shared libs (db, api-zod, api-client-react)
run("pnpm --filter @workspace/db build 2>/dev/null || true");
run("pnpm --filter @workspace/api-zod build 2>/dev/null || true");
run("pnpm --filter @workspace/api-client-react build 2>/dev/null || true");

// 2. Build the Vite frontend
run("pnpm --filter @workspace/hitech-multimedia run build");

// 3. Build the API server
run("pnpm --filter @workspace/api-server run build");

// 4. Copy the frontend dist into the API server's public folder
const frontendDist = path.join(root, "artifacts/hitech-multimedia/dist");
const apiPublic = path.join(root, "artifacts/api-server/dist/public");

if (existsSync(apiPublic)) rmSync(apiPublic, { recursive: true, force: true });
mkdirSync(apiPublic, { recursive: true });
cpSync(frontendDist, apiPublic, { recursive: true });

console.log("\n✅ Build complete — frontend copied into API dist/public");
