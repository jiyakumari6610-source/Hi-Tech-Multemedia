import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { servicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/services", async (req: Request, res: Response) => {
  try {
    const services = await db.select().from(servicesTable);
    res.json(services.map(s => ({ ...s, price: parseFloat(s.price) })));
  } catch (err) {
    req.log.error({ err }, "Failed to list services");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/services", async (req: Request, res: Response) => {
  const { name, description, price, category, imageUrl } = req.body;
  if (!name || !description || price === undefined || !category) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  try {
    const [item] = await db.insert(servicesTable).values({ name, description, price: String(price), category, imageUrl: imageUrl || null }).returning();
    res.status(201).json({ ...item, price: parseFloat(item.price) });
  } catch (err) {
    req.log.error({ err }, "Failed to create service");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/services/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const existing = await db.select().from(servicesTable).where(eq(servicesTable.id, id));
    if (!existing[0]) { res.status(404).json({ error: "Not found" }); return; }
    const { name, description, price, category, imageUrl } = req.body;
    const updates: Partial<typeof servicesTable.$inferInsert> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = String(price);
    if (category !== undefined) updates.category = category;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    const [updated] = await db.update(servicesTable).set(updates).where(eq(servicesTable.id, id)).returning();
    res.json({ ...updated, price: parseFloat(updated.price) });
  } catch (err) {
    req.log.error({ err }, "Failed to update service");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/services/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    await db.delete(servicesTable).where(eq(servicesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete service");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
