import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  policyNumber: text("policy_number"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const indications = pgTable("indications", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  status: text("status").notNull().default("pending"),
  proposalLink: text("proposal_link"),
  notificationSent: boolean("notification_sent").default(false),
  whatsappSent: boolean("whatsapp_sent").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  discountPercentage: serial("discount_percentage").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).pick({
  uid: true,
  email: true,
  name: true,
  policyNumber: true,
  isAdmin: true
});

export const insertIndicationSchema = createInsertSchema(indications).pick({
  name: true,
  email: true,
  phone: true,
  proposalLink: true,
  notificationSent: true,
  whatsappSent:true
});

export const insertRewardSchema = createInsertSchema(rewards).pick({
  discountPercentage: true
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Indication = typeof indications.$inferSelect;
export type InsertIndication = z.infer<typeof insertIndicationSchema>;
export type Reward = typeof rewards.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;