import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── Enums ────────────────────────────────────────────────────────────────────

export const badgeEnum = pgEnum('badge_type', ['NEW', 'BESTSELLER', 'LIMITED', 'SALE']);
export const purchaseStatusEnum = pgEnum('purchase_status', ['pending', 'completed', 'refunded', 'cancelled']);

// ─── E-commerce ───────────────────────────────────────────────────────────────

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  slugUnique: uniqueIndex('idx_categories_slug').on(t.slug),
}));

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  shortDescription: text('short_description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal('compare_at_price', { precision: 10, scale: 2 }),
  // Arrays of image URLs from Cloudinary
  images: text('images').array().notNull().default([]),
  fabric: varchar('fabric', { length: 255 }),
  embroideryType: varchar('embroidery_type', { length: 255 }),
  colors: text('colors').array().notNull().default([]),
  sizes: text('sizes').array().notNull().default([]),
  badge: badgeEnum('badge'),
  inStock: boolean('in_stock').notNull().default(true),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  featured: boolean('featured').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  slugUnique: uniqueIndex('idx_products_slug').on(t.slug),
  categoryIdx: index('idx_products_category').on(t.categoryId),
  featuredIdx: index('idx_products_featured').on(t.featured),
}));

// ─── CRM ──────────────────────────────────────────────────────────────────────

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  // Example: { bust: 36, waist: 30, hips: 38, height: 165, shoulder: 14, sleeve: 22, unit: "inches" }
  measurements: jsonb('measurements').default({}),
  stylePreferences: text('style_preferences').array().default([]),
  notes: text('notes'),
  tags: text('tags').array().default([]),
  source: varchar('source', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  emailUnique: uniqueIndex('idx_clients_email').on(t.email),
}));

export const clientPurchases = pgTable('client_purchases', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').references(() => clients.id, { onDelete: 'cascade' }).notNull(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'set null' }),
  // Snapshot of product at purchase time (product data may change later)
  productName: varchar('product_name', { length: 255 }),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }),
  quantity: integer('quantity').notNull().default(1),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }),
  status: purchaseStatusEnum('status').default('completed'),
  notes: text('notes'),
  purchaseDate: timestamp('purchase_date').defaultNow(),
}, (t) => ({
  clientIdx: index('idx_purchases_client').on(t.clientId),
  dateIdx: index('idx_purchases_date').on(t.purchaseDate),
}));

// ─── Relations ────────────────────────────────────────────────────────────────

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  purchases: many(clientPurchases),
}));

export const clientPurchasesRelations = relations(clientPurchases, ({ one }) => ({
  client: one(clients, {
    fields: [clientPurchases.clientId],
    references: [clients.id],
  }),
  product: one(products, {
    fields: [clientPurchases.productId],
    references: [products.id],
  }),
}));

// ─── Types (inferred from schema) ────────────────────────────────────────────

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type ClientPurchase = typeof clientPurchases.$inferSelect;
export type NewClientPurchase = typeof clientPurchases.$inferInsert;
