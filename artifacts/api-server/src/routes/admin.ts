import { Router, type Request, type Response } from "express";
import { createHash } from "node:crypto";
import { db } from "@workspace/db";
import { adminCredentialsTable } from "@workspace/db";

const router = Router();

const SALT = "htmm_bokaro_studio_2024";
const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "Admin@9939";

function hashPassword(password: string): string {
  return createHash("sha256").update(SALT + password).digest("hex");
}

async function ensureDefaultCredentials() {
  const existing = await db.select().from(adminCredentialsTable);
  if (existing.length === 0) {
    await db.insert(adminCredentialsTable).values({
      username: DEFAULT_USERNAME,
      passwordHash: hashPassword(DEFAULT_PASSWORD),
    });
  }
}

router.post("/admin/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }
  try {
    await ensureDefaultCredentials();
    const rows = await db.select().from(adminCredentialsTable);
    const creds = rows[0];
    if (!creds) {
      res.status(500).json({ error: "No credentials configured" });
      return;
    }
    if (creds.username !== username || creds.passwordHash !== hashPassword(password)) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }
    res.json({ success: true, username: creds.username });
  } catch (err) {
    req.log.error({ err }, "Admin login failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/me", async (req: Request, res: Response) => {
  try {
    await ensureDefaultCredentials();
    const rows = await db.select().from(adminCredentialsTable);
    res.json({ username: rows[0]?.username ?? DEFAULT_USERNAME });
  } catch (err) {
    req.log.error({ err }, "Failed to get admin info");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/admin/credentials", async (req: Request, res: Response) => {
  const { currentPassword, newPassword, newUsername } = req.body;
  if (!currentPassword) {
    res.status(400).json({ error: "Current password is required" });
    return;
  }
  try {
    await ensureDefaultCredentials();
    const rows = await db.select().from(adminCredentialsTable);
    const creds = rows[0];
    if (!creds || creds.passwordHash !== hashPassword(currentPassword)) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }
    const updates: { username?: string; passwordHash?: string; updatedAt: Date } = {
      updatedAt: new Date(),
    };
    if (newUsername && newUsername.trim()) updates.username = newUsername.trim();
    if (newPassword && newPassword.length >= 4) updates.passwordHash = hashPassword(newPassword);
    if (!updates.username && !updates.passwordHash) {
      res.status(400).json({ error: "Provide newUsername or newPassword to update" });
      return;
    }
    const [final] = await db
      .update(adminCredentialsTable)
      .set(updates)
      .returning();
    res.json({ success: true, username: final.username });
  } catch (err) {
    req.log.error({ err }, "Failed to update admin credentials");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
