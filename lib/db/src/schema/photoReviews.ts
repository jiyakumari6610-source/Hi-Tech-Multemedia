import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const photoReviewSessionsTable = pgTable("photo_review_sessions", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(),
  bookingName: text("booking_name").notNull(),
  token: text("token").notNull().unique(),
  status: text("status").notNull().default("pending"),
  photoUrls: text("photo_urls").notNull().default("[]"),
  customerNote: text("customer_note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPhotoReviewSessionSchema = createInsertSchema(photoReviewSessionsTable).omit({ id: true, createdAt: true, token: true });
export type InsertPhotoReviewSession = z.infer<typeof insertPhotoReviewSessionSchema>;
export type PhotoReviewSession = typeof photoReviewSessionsTable.$inferSelect;
