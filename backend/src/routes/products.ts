import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, sql, and } from 'drizzle-orm';
import { db } from '../db/index';
import { products, categories } from '../db/schema';

const router = new Hono();

// ─── GET /api/products ────────────────────────────────────────────────────────
// Query params: category (slug), featured (true), inStock (true), limit, offset
router.get('/', async (c) => {
  const { category, featured, inStock, limit: limitStr = '50', offset: offsetStr = '0' } = c.req.query();
  const limit = Math.min(Math.max(parseInt(limitStr) || 50, 1), 100);
  const offset = Math.max(parseInt(offsetStr) || 0, 0);

  const conditions = [];

  if (featured === 'true') {
    conditions.push(eq(products.featured, true));
  }
  if (inStock === 'true') {
    conditions.push(eq(products.inStock, true));
  }

  let rows;

  if (category) {
    // Join to filter by category slug
    rows = await db
      .select({
        product: products,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(
        and(
          eq(categories.slug, category),
          ...conditions,
        ),
      )
      .limit(limit)
      .offset(offset);
  } else {
    rows = await db
      .select({
        product: products,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset);
  }

  const data = rows.map(({ product, categoryName, categorySlug }) => ({
    ...product,
    category: categorySlug ?? null,
    categoryName: categoryName ?? null,
  }));

  return c.json({ data });
});

// ─── GET /api/products/search?q=... ──────────────────────────────────────────
router.get('/search', async (c) => {
  const q = c.req.query('q')?.trim();

  if (!q || q.length < 2) {
    return c.json({ data: [] });
  }

  // Uses the tsvector index (created in seed.ts) for fast full-text search.
  // Falls back to ILIKE on name when no full-text match is found.
  const result = await db.execute(sql`
    SELECT
      p.*,
      c.name AS category_name,
      c.slug AS category_slug,
      ts_rank(p.search_vector, plainto_tsquery('english', ${q})) AS rank
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE
      p.search_vector @@ plainto_tsquery('english', ${q})
      OR p.name ILIKE ${'%' + q + '%'}
      OR c.name ILIKE ${'%' + q + '%'}
    ORDER BY rank DESC, p.created_at DESC
    LIMIT 20
  `);

  // Normalize snake_case from raw SQL to camelCase to match the rest of the API
  const rows = (result.rows ?? result) as Record<string, unknown>[];
  const data = rows.map((r) => ({
    id: r.id,
    categoryId: r.category_id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    shortDescription: r.short_description,
    price: r.price,
    compareAtPrice: r.compare_at_price,
    images: r.images,
    fabric: r.fabric,
    embroideryType: r.embroidery_type,
    colors: r.colors,
    sizes: r.sizes,
    badge: r.badge,
    inStock: r.in_stock,
    stockQuantity: r.stock_quantity,
    featured: r.featured,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    category: r.category_slug ?? null,
    categoryName: r.category_name ?? null,
  }));

  return c.json({ data });
});

// ─── GET /api/products/:slug ──────────────────────────────────────────────────
router.get('/:slug', async (c) => {
  const slug = c.req.param('slug');

  const [row] = await db
    .select({
      product: products,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);

  if (!row) {
    return c.json({ error: 'Product not found' }, 404);
  }

  return c.json({
    data: {
      ...row.product,
      category: row.categorySlug ?? null,
      categoryName: row.categoryName ?? null,
    },
  });
});

export default router;
