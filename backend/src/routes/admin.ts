/**
 * Admin routes — all protected by x-api-key header.
 * These cover product/category management and the full CRM.
 */
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '../db/index';
import { categories, products, clients, clientPurchases } from '../db/schema';
import { adminAuth } from '../middleware/auth';

const router = new Hono();
router.use('*', adminAuth);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Parse and validate a route :id param as a positive integer.
 * Returns null if the value is not a positive integer (prevents NaN from
 * propagating into DB queries and causing unpredictable behaviour).
 */
function parseId(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

/** Clamp a pagination limit to a safe range. */
function parsePagination(limitStr: string, offsetStr: string) {
  const limit = Math.min(Math.max(parseInt(limitStr) || 50, 1), 200);
  const offset = Math.max(parseInt(offsetStr) || 0, 0);
  return { limit, offset };
}

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z.string().optional(),
});

const productSchema = z.object({
  categoryId: z.number().int().positive().optional().nullable(),
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Price must be a decimal number e.g. "295.00"'),
  compareAtPrice: z.string().regex(/^\d+(\.\d{1,2})?$/).optional().nullable(),
  images: z.array(z.string().url()).default([]),
  fabric: z.string().optional(),
  embroideryType: z.string().optional(),
  colors: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  badge: z.enum(['NEW', 'BESTSELLER', 'LIMITED', 'SALE']).optional().nullable(),
  inStock: z.boolean().default(true),
  stockQuantity: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
});

const clientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  measurements: z.record(z.unknown()).optional().default({}),
  stylePreferences: z.array(z.string()).optional().default([]),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  source: z.string().optional().nullable(),
});

const purchaseSchema = z.object({
  productId: z.number().int().positive().optional().nullable(),
  productName: z.string().optional(),
  unitPrice: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  quantity: z.number().int().positive().default(1),
  totalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  status: z.enum(['pending', 'completed', 'refunded', 'cancelled']).default('completed'),
  notes: z.string().optional(),
});

// ─── Category Admin ───────────────────────────────────────────────────────────

router.get('/categories', async (c) => {
  const rows = await db.select().from(categories).orderBy(categories.name);
  return c.json({ data: rows });
});

router.post('/categories', zValidator('json', categorySchema), async (c) => {
  const data = c.req.valid('json');
  const [row] = await db.insert(categories).values(data).returning();
  return c.json({ data: row }, 201);
});

router.put('/categories/:id', zValidator('json', categorySchema.partial()), async (c) => {
  const id = parseId(c.req.param('id'));
  if (!id) return c.json({ error: 'Invalid id' }, 400);
  const data = c.req.valid('json');
  const [row] = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
  if (!row) return c.json({ error: 'Category not found' }, 404);
  return c.json({ data: row });
});

router.delete('/categories/:id', async (c) => {
  const id = parseId(c.req.param('id'));
  if (!id) return c.json({ error: 'Invalid id' }, 400);
  const [row] = await db.delete(categories).where(eq(categories.id, id)).returning();
  if (!row) return c.json({ error: 'Category not found' }, 404);
  return c.json({ success: true });
});

// ─── Product Admin ────────────────────────────────────────────────────────────

router.get('/products', async (c) => {
  const rows = await db.select().from(products).orderBy(products.createdAt);
  return c.json({ data: rows });
});

router.get('/products/:id', async (c) => {
  const id = parseId(c.req.param('id'));
  if (!id) return c.json({ error: 'Invalid id' }, 400);
  const [row] = await db.select().from(products).where(eq(products.id, id));
  if (!row) return c.json({ error: 'Product not found' }, 404);
  return c.json({ data: row });
});

router.post('/products', zValidator('json', productSchema), async (c) => {
  const data = c.req.valid('json');
  const [row] = await db.insert(products).values(data).returning();
  return c.json({ data: row }, 201);
});

router.put('/products/:id', zValidator('json', productSchema.partial()), async (c) => {
  const id = parseId(c.req.param('id'));
  if (!id) return c.json({ error: 'Invalid id' }, 400);
  const data = c.req.valid('json');
  const [row] = await db
    .update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  if (!row) return c.json({ error: 'Product not found' }, 404);
  return c.json({ data: row });
});

router.delete('/products/:id', async (c) => {
  const id = parseId(c.req.param('id'));
  if (!id) return c.json({ error: 'Invalid id' }, 400);
  // Soft delete — mark out of stock rather than permanently deleting
  const [row] = await db
    .update(products)
    .set({ inStock: false, stockQuantity: 0, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  if (!row) return c.json({ error: 'Product not found' }, 404);
  return c.json({ data: row });
});

// ─── CRM — Clients ────────────────────────────────────────────────────────────

router.get('/clients', async (c) => {
  const { limit: limitStr = '50', offset: offsetStr = '0' } = c.req.query();
  const { limit, offset } = parsePagination(limitStr, offsetStr);

  const rows = await db
    .select()
    .from(clients)
    .orderBy(clients.createdAt)
    .limit(limit)
    .offset(offset);

  return c.json({ data: rows });
});

router.get('/clients/:id', async (c) => {
  const id = parseId(c.req.param('id'));
  if (!id) return c.json({ error: 'Invalid id' }, 400);

  const [client] = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  if (!client) return c.json({ error: 'Client not found' }, 404);

  const purchases = await db
    .select()
    .from(clientPurchases)
    .where(eq(clientPurchases.clientId, id))
    .orderBy(clientPurchases.purchaseDate);

  return c.json({ data: { ...client, purchases } });
});

router.post('/clients', zValidator('json', clientSchema), async (c) => {
  const data = c.req.valid('json');
  const [row] = await db.insert(clients).values(data).returning();
  return c.json({ data: row }, 201);
});

router.put('/clients/:id', zValidator('json', clientSchema.partial()), async (c) => {
  const id = parseId(c.req.param('id'));
  if (!id) return c.json({ error: 'Invalid id' }, 400);
  const data = c.req.valid('json');
  const [row] = await db
    .update(clients)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(clients.id, id))
    .returning();
  if (!row) return c.json({ error: 'Client not found' }, 404);
  return c.json({ data: row });
});

router.delete('/clients/:id', async (c) => {
  const id = parseId(c.req.param('id'));
  if (!id) return c.json({ error: 'Invalid id' }, 400);
  const [row] = await db.delete(clients).where(eq(clients.id, id)).returning();
  if (!row) return c.json({ error: 'Client not found' }, 404);
  return c.json({ success: true });
});

// ─── CRM — Purchases ─────────────────────────────────────────────────────────

router.post('/clients/:id/purchases', zValidator('json', purchaseSchema), async (c) => {
  const clientId = parseId(c.req.param('id'));
  if (!clientId) return c.json({ error: 'Invalid client id' }, 400);

  // Verify the client exists before inserting — prevents orphan purchase records
  // and ensures we return a proper 404 rather than a raw DB FK violation error
  const [clientRow] = await db.select({ id: clients.id }).from(clients).where(eq(clients.id, clientId)).limit(1);
  if (!clientRow) return c.json({ error: 'Client not found' }, 404);

  const data = c.req.valid('json');

  // If a productId is given, snapshot the product name/price automatically
  let productName = data.productName;
  let unitPrice = data.unitPrice;

  if (data.productId && !productName) {
    const [product] = await db
      .select({ name: products.name, price: products.price })
      .from(products)
      .where(eq(products.id, data.productId))
      .limit(1);
    if (product) {
      productName = product.name;
      unitPrice = unitPrice ?? product.price;
    }
  }

  const totalAmount =
    data.totalAmount ?? (unitPrice ? String(Number(unitPrice) * data.quantity) : undefined);

  const [row] = await db
    .insert(clientPurchases)
    .values({ ...data, clientId, productName, unitPrice, totalAmount })
    .returning();

  return c.json({ data: row }, 201);
});

export default router;
