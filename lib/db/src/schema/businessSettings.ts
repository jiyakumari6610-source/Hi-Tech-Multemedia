import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const businessSettingsTable = pgTable("business_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const DEFAULT_BUSINESS_SETTINGS: Record<string, string> = {
  business_name: "Hi-Tech Multimedia",
  tagline: "Timeless Memories, Beautifully Captured",
  address: "Bokaro Steel City, Jharkhand, India",
  phone: "+91 99398 60818",
  whatsapp: "+91 99398 60818",
  email: "hitechbokaro@gmail.com",
  studio_hours: "Mon – Sat: 9 AM – 7 PM",
  instagram: "",
  facebook: "",
};

export const updateBusinessSettingsSchema = z.object({
  business_name: z.string().min(1).optional(),
  tagline: z.string().optional(),
  address: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional(),
  studio_hours: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
});
export type UpdateBusinessSettings = z.infer<typeof updateBusinessSettingsSchema>;
