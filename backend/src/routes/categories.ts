import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { categories, products } from '../db/schema.js';

const router = new Hono();

// ─── GET /api/categories ──────────────────────────────────────────────────────
router.get('/', async (c) => {
  const rows = await db.select().from(categories).orderBy(categories.name);
  return c.json({ data: rows });
});

// ─── GET /api/categories/:slug/products ──────────────────────────────────────
router.get('/:slug/products', async (c) => {
  const slug = c.req.param('slug');

  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  if (!category) {
    return c.json({ error: 'Category not found' }, 404);
  }

  const productRows = await db
    .select()
    .from(products)
    .where(eq(products.categoryId, category.id));

  return c.json({ data: { category, products: productRows } });
});

export default router;
