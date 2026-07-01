import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { testimonialsTable, insertTestimonialSchema } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// Public: only active testimonials, newest first
router.get("/testimonials", async (req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(testimonialsTable)
      .where(eq(testimonialsTable.active, true))
      .orderBy(testimonialsTable.createdAt);
    res.json(rows.reverse());
  } catch (err) {
    req.log.error({ err }, "Failed to list testimonials");
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: all testimonials including inactive
router.get("/admin/testimonials", async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(testimonialsTable).orderBy(testimonialsTable.createdAt);
    res.json(rows.reverse());
  } catch (err) {
    req.log.error({ err }, "Failed to list testimonials");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/testimonials", async (req: Request, res: Response) => {
  const parsed = insertTestimonialSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid testimonial data", details: parsed.error });
    return;
  }
  try {
    const [row] = await db.insert(testimonialsTable).values(parsed.data).returning();
    res.status(201).json(row);
  } catch (err) {
    req.log.error({ err }, "Failed to create testimonial");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/testimonials/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const { name, event, text, rating, active } = req.body;
    const updates: Partial<typeof testimonialsTable.$inferInsert> = {};
    if (name !== undefined) updates.name = name;
    if (event !== undefined) updates.event = event;
    if (text !== undefined) updates.text = text;
    if (rating !== undefined) updates.rating = rating;
    if (active !== undefined) updates.active = active;
    const [updated] = await db.update(testimonialsTable).set(updates).where(eq(testimonialsTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Not found" }); return; }
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update testimonial");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/testimonials/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    await db.delete(testimonialsTable).where(eq(testimonialsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete testimonial");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
