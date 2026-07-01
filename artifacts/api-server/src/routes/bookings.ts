import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { bookingsTable, invoicesTable, insertBookingSchema } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router = Router();

function formatBooking(b: typeof bookingsTable.$inferSelect) {
  return { ...b, status: b.status, createdAt: b.createdAt.toISOString() };
}

router.get("/bookings", async (req: Request, res: Response) => {
  try {
    const bookings = await db.select().from(bookingsTable).orderBy(bookingsTable.createdAt);
    res.json(bookings.map(formatBooking));
  } catch (err) {
    req.log.error({ err }, "Failed to list bookings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/bookings", async (req: Request, res: Response) => {
  const parsed = insertBookingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid booking data", details: parsed.error });
    return;
  }
  try {
    const [booking] = await db.insert(bookingsTable).values(parsed.data).returning();
    res.status(201).json(formatBooking(booking));
  } catch (err) {
    req.log.error({ err }, "Failed to create booking");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bookings/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id));
    if (!booking) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatBooking(booking));
  } catch (err) {
    req.log.error({ err }, "Failed to get booking");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/bookings/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    const [existing] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id));
    if (!existing) { res.status(404).json({ error: "Not found" }); return; }
    const { status, name, phone, email, eventType, eventDate, message } = req.body;
    const updates: Partial<typeof bookingsTable.$inferInsert> = {};
    if (status !== undefined) updates.status = status;
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (email !== undefined) updates.email = email;
    if (eventType !== undefined) updates.eventType = eventType;
    if (eventDate !== undefined) updates.eventDate = eventDate;
    if (message !== undefined) updates.message = message;
    const [updated] = await db.update(bookingsTable).set(updates).where(eq(bookingsTable.id, id)).returning();
    res.json(formatBooking(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update booking");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/bookings/:id", async (req: Request, res: Response) => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  try {
    await db.delete(bookingsTable).where(eq(bookingsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete booking");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats", async (req: Request, res: Response) => {
  try {
    const [totalResult] = await db.select({ count: count() }).from(bookingsTable);
    const [pendingResult] = await db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "pending"));
    const [confirmedResult] = await db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "confirmed"));
    const [invoicesResult] = await db.select({ count: count() }).from(invoicesTable);
    const allInvoices = await db.select({ total: invoicesTable.total }).from(invoicesTable);
    const totalRevenue = allInvoices.reduce((sum, inv) => sum + parseFloat(inv.total || "0"), 0);
    res.json({
      totalBookings: totalResult.count,
      pendingBookings: pendingResult.count,
      confirmedBookings: confirmedResult.count,
      totalRevenue,
      totalInvoices: invoicesResult.count,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
