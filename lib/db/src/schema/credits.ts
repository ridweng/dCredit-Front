import { pgTable, text, numeric, integer, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const creditsTable = pgTable("credits", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull().default("personal_loan"),
  balance: numeric("balance", { precision: 12, scale: 2 }).notNull(),
  originalBalance: numeric("original_balance", { precision: 12, scale: 2 }).notNull(),
  apr: numeric("apr", { precision: 5, scale: 2 }).notNull(),
  monthlyPayment: numeric("monthly_payment", { precision: 10, scale: 2 }).notNull(),
  nextPaymentDate: date("next_payment_date").notNull(),
  termMonths: integer("term_months").notNull(),
  paidMonths: integer("paid_months").notNull().default(0),
  priority: text("priority").notNull().default("medium"),
  institution: text("institution").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCreditSchema = createInsertSchema(creditsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCredit = z.infer<typeof insertCreditSchema>;
export type Credit = typeof creditsTable.$inferSelect;
