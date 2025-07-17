import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const betaCodes = pgTable("beta_codes", {
  code: varchar("code", { length: 64 }).primaryKey(),
  partner: uuid("partner").references(() => partners.id),
  isUsed: boolean("is_used").default(false),
  redeemedAt: timestamp("redeemed_at", { withTimezone: true }),
});

export const partners = pgTable("partners", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  partnerName: varchar("partner_name", { length: 255 }).notNull(),
  mpcWallet: varchar("mpc_wallet", { length: 64 }).notNull(),
  receivingWallet: varchar("receiving_wallet", { length: 64 }).notNull(),
  website: varchar("website", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 20 }),
  country: varchar("country", { length: 3 }).notNull(),
  rateLimitPerMin: integer("rate_limit_per_min").default(60),
  defaultFeeBps: integer("default_fee_bps").default(0),
  isActive: boolean("is_active").default(true),
  apiKey: varchar("api_key", { length: 64 }).notNull().unique(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const shops = pgTable("shops", {
  id: varchar("id", { length: 64 }).primaryKey(),
  externalId: varchar("external_id", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  mpcWallet: varchar("mpc_wallet", { length: 64 }).notNull(),
  country: varchar("country", { length: 3 }).notNull(),
  preferredCurrency: varchar("preferred_currency", { length: 3 })
    .notNull()
    .default("USD"),
  receivingWallet: varchar("receiving_wallet", { length: 64 }).notNull(),
  isVentaPay: boolean("is_venta_pay").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  partner: uuid("partner")
    .notNull()
    .references(() => partners.id),
  feeBps: integer("fee_bps").notNull().default(0),
  email: varchar("email", { length: 255 }).notNull(),
  verified: boolean("verified").default(false),
  isActive: boolean("is_active").default(true),
});

// export const sessions = pgTable("sessions", {
//   reference: varchar("reference", { length: 64 }).primaryKey(),
//   shopId: uuid("shop_id")
//     .notNull()
//     .references(() => shops.id, { onDelete: "cascade" }),
//   amount: integer("amount").notNull(), // In minor units (e.g., cents)
//   expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
//   createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
// });

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  shopId: uuid("shop_id").references(() => shops.id),
  mint: varchar("mint", { length: 4 }).notNull(),
  amount: integer("amount").notNull(), // Confirmed paid amount
  buyerPubkey: varchar("buyer_pubkey", { length: 64 }).notNull(),
  transactionSignature: varchar("transaction_signature", {
    length: 128,
  }).notNull(),
  isPaid: boolean("is_paid").default(false),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
