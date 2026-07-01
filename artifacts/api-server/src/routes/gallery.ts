import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { galleryTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/gallery", async (req: Request, res: Response) => {
  try {
    const items = await db.select().from(galleryTable);
    res.json(items);
  } catch (err) {
    req.log.error({ err }, "Failed to list gallery");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/gallery", async (req: Request, res: Response) => {
  const { title, category, imageUrl, description } = req.body;
  if (!title || !category || !imageUrl) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  try {
    const [item] = await db.insert(galleryTable).values({
      title,
      category,
      imageUrl,
      description: description || null,
      selected: false,
      featured: false,
    }).returning();
    res.status(201).json(item);
  } catch (err) {
    req.log.error({ err }, "Failed to create gallery item");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/gallery/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const existing = await db.select().from(galleryTable).where(eq(galleryTable.id, id));
    if (!existing[0]) { res.status(404).json({ error: "Not found" }); return; }
    const { title, category, imageUrl, description, selected, featured } = req.body;
    const updates: Partial<typeof galleryTable.$inferInsert> = {};
    if (title !== undefined) updates.title = title;
    if (category !== undefined) updates.category = category;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (description !== undefined) updates.description = description;
    if (selected !== undefined) updates.selected = selected;
    if (featured !== undefined) updates.featured = featured;
    const [updated] = await db.update(galleryTable).set(updates).where(eq(galleryTable.id, id)).returning();
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update gallery item");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/gallery/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    await db.delete(galleryTable).where(eq(galleryTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete gallery item");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
