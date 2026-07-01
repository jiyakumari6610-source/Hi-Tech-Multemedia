import { Router, type Request, type Response } from "express";
import { randomBytes } from "node:crypto";
import { db } from "@workspace/db";
import { photoReviewSessionsTable, insertPhotoReviewSessionSchema } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function generateToken(): string {
  return randomBytes(16).toString("hex");
}

function formatSession(s: typeof photoReviewSessionsTable.$inferSelect) {
  return {
    ...s,
    photoUrls: JSON.parse(s.photoUrls) as string[],
    createdAt: s.createdAt.toISOString(),
  };
}

// Admin: list all photo review sessions
router.get("/admin/photo-reviews", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(photoReviewSessionsTable).orderBy(photoReviewSessionsTable.createdAt);
    res.json(rows.reverse().map(formatSession));
  } catch (err) {
    req.log.error({ err }, "Failed to list photo review sessions");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: create a new photo review session for a booking, with selected photo URLs.
// Returns the session including a token used to build the customer-facing link: /review/:token
router.post("/admin/photo-reviews", async (req: Request, res: Response) => {
  const body = { ...req.body };
  const photoUrls = Array.isArray(body.photoUrls) ? body.photoUrls : [];
  delete body.photoUrls;

  const parsed = insertPhotoReviewSessionSchema.safeParse(body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid photo review data", details: parsed.error });
    return;
  }
  try {
    const [row] = await db
      .insert(photoReviewSessionsTable)
      .values({
        ...parsed.data,
        photoUrls: JSON.stringify(photoUrls),
        token: generateToken(),
      })
      .returning();
    res.status(201).json(formatSession(row));
  } catch (err) {
    req.log.error({ err }, "Failed to create photo review session");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: update photo selection for an existing session (e.g. add/remove photos before sending)
router.patch("/admin/photo-reviews/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const updates: Partial<typeof photoReviewSessionsTable.$inferInsert> = {};
    if (Array.isArray(req.body.photoUrls)) updates.photoUrls = JSON.stringify(req.body.photoUrls);
    if (req.body.status !== undefined) updates.status = req.body.status;
    const [updated] = await db
      .update(photoReviewSessionsTable)
      .set(updates)
      .where(eq(photoReviewSessionsTable.id, id))
      .returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatSession(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update photo review session");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/photo-reviews/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    await db.delete(photoReviewSessionsTable).where(eq(photoReviewSessionsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete photo review session");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Public: customer fetches their review session by token (no auth — token is the secret)
router.get("/photo-reviews/:token", async (req: Request, res: Response) => {
  try {
    const token = String(req.params.token);
    const [row] = await db
      .select()
      .from(photoReviewSessionsTable)
      .where(eq(photoReviewSessionsTable.token, token));
    if (!row) { res.status(404).json({ error: "Review link not found" }); return; }
    res.json(formatSession(row));
  } catch (err) {
    req.log.error({ err }, "Failed to get photo review session");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Public: customer confirms their selection (optionally narrowing photoUrls down, plus a note)
router.post("/photo-reviews/:token/confirm", async (req: Request, res: Response) => {
  try {
    const token = String(req.params.token);
    const [existing] = await db
      .select()
      .from(photoReviewSessionsTable)
      .where(eq(photoReviewSessionsTable.token, token));
    if (!existing) { res.status(404).json({ error: "Review link not found" }); return; }

    const updates: Partial<typeof photoReviewSessionsTable.$inferInsert> = {
      status: "confirmed",
    };
    if (Array.isArray(req.body.photoUrls)) {
      updates.photoUrls = JSON.stringify(req.body.photoUrls);
    }
    if (typeof req.body.customerNote === "string") {
      updates.customerNote = req.body.customerNote;
    }

    const [updated] = await db
      .update(photoReviewSessionsTable)
      .set(updates)
      .where(eq(photoReviewSessionsTable.token, token))
      .returning();
    res.json(formatSession(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to confirm photo review session");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
