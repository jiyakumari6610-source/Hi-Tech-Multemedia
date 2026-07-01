import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { businessSettingsTable, DEFAULT_BUSINESS_SETTINGS, updateBusinessSettingsSchema } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

async function ensureDefaults() {
  const existing = await db.select().from(businessSettingsTable);
  const existingKeys = new Set(existing.map((row) => row.key));
  const missing = Object.entries(DEFAULT_BUSINESS_SETTINGS).filter(([key]) => !existingKeys.has(key));
  if (missing.length > 0) {
    await db.insert(businessSettingsTable).values(
      missing.map(([key, value]) => ({ key, value }))
    );
  }
}

async function getAllSettings(): Promise<Record<string, string>> {
  await ensureDefaults();
  const rows = await db.select().from(businessSettingsTable);
  const result: Record<string, string> = { ...DEFAULT_BUSINESS_SETTINGS };
  for (const row of rows) {
    result[row.key] = row.value;
  }
  return result;
}

// Public: anyone can read business settings (used by the public site)
router.get("/settings", async (req: Request, res: Response) => {
  try {
    const settings = await getAllSettings();
    res.json(settings);
  } catch (err) {
    req.log.error({ err }, "Failed to get settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: update one or more settings at once
router.put("/admin/settings", async (req: Request, res: Response) => {
  const parsed = updateBusinessSettingsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid settings data", details: parsed.error });
    return;
  }
  try {
    await ensureDefaults();
    const entries = Object.entries(parsed.data).filter(([, value]) => value !== undefined) as [string, string][];
    for (const [key, value] of entries) {
      await db
        .insert(businessSettingsTable)
        .values({ key, value, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: businessSettingsTable.key,
          set: { value, updatedAt: new Date() },
        });
    }
    const settings = await getAllSettings();
    res.json(settings);
  } catch (err) {
    req.log.error({ err }, "Failed to update settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
