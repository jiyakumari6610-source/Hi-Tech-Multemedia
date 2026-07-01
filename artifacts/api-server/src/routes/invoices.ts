import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { invoicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function formatInvoice(inv: typeof invoicesTable.$inferSelect) {
  return {
    ...inv,
    subtotal: parseFloat(inv.subtotal),
    tax: parseFloat(inv.tax),
    total: parseFloat(inv.total),
    status: inv.status,
    createdAt: inv.createdAt.toISOString(),
  };
}

router.get("/invoices", async (req: Request, res: Response) => {
  try {
    const invoices = await db.select().from(invoicesTable).orderBy(invoicesTable.createdAt);
    res.json(invoices.map(formatInvoice));
  } catch (err) {
    req.log.error({ err }, "Failed to list invoices");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/invoices", async (req: Request, res: Response) => {
  const { clientName, clientEmail, clientPhone, eventType, eventDate, items, tax, notes } = req.body;
  if (!clientName || !clientEmail || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  try {
    const subtotal = items.reduce((sum: number, item: { total: number }) => sum + item.total, 0);
    const taxRate = tax ?? 18;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    const invoiceNumber = `HM-${Date.now().toString().slice(-6)}`;

    const [invoice] = await db.insert(invoicesTable).values({
      invoiceNumber,
      clientName,
      clientEmail,
      clientPhone: clientPhone || null,
      eventType: eventType || null,
      eventDate: eventDate || null,
      items,
      subtotal: subtotal.toString(),
      tax: taxAmount.toString(),
      total: total.toString(),
      notes: notes || null,
    }).returning();

    res.status(201).json(formatInvoice(invoice));
  } catch (err) {
    req.log.error({ err }, "Failed to create invoice");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/invoices/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [invoice] = await db.select().from(invoicesTable).where(eq(invoicesTable.id, id));
    if (!invoice) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(formatInvoice(invoice));
  } catch (err) {
    req.log.error({ err }, "Failed to get invoice");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
