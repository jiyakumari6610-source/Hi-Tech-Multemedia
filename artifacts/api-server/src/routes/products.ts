import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/products", async (req: Request, res: Response) => {
  try {
    const items = await db.select().from(productsTable);
    res.json(items.map(p => ({ ...p, price: parseFloat(p.price) })));
  } catch (err) {
    req.log.error({ err }, "Failed to list products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/products", async (req: Request, res: Response) => {
  const { name, description, price, category, imageUrl } = req.body;
  if (!name || !description || price === undefined || !category) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  try {
    const [item] = await db.insert(productsTable).values({ name, description, price: String(price), category, imageUrl: imageUrl || null }).returning();
    res.status(201).json({ ...item, price: parseFloat(item.price) });
  } catch (err) {
    req.log.error({ err }, "Failed to create product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/products/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const existing = await db.select().from(productsTable).where(eq(productsTable.id, id));
    if (!existing[0]) { res.status(404).json({ error: "Not found" }); return; }
    const { name, description, price, category, imageUrl } = req.body;
    const updates: Partial<typeof productsTable.$inferInsert> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = String(price);
    if (category !== undefined) updates.category = category;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    const [updated] = await db.update(productsTable).set(updates).where(eq(productsTable.id, id)).returning();
    res.json({ ...updated, price: parseFloat(updated.price) });
  } catch (err) {
    req.log.error({ err }, "Failed to update product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/products/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete product");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
