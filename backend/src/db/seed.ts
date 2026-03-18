/**
 * Seed script — populates the database with your 8 existing mock products.
 * Run with: npm run db:seed  (from the backend/ directory)
 */
import { db } from './index.js';
import { categories, products } from './schema.js';
import { sql } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding database...');

  // ─── Clear existing data ────────────────────────────────────────────────────
  await db.execute(sql`TRUNCATE products, categories RESTART IDENTITY CASCADE`);

  // ─── Categories ────────────────────────────────────────────────────────────
  const [mukhawar, shaila, kids, premium] = await db
    .insert(categories)
    .values([
      { name: 'Mukhawar', slug: 'mukhawar', description: 'Traditional Mukhawar designs for everyday and special occasions' },
      { name: 'Shaila', slug: 'shaila', description: 'Lightweight shailas to complement your outfit' },
      { name: 'Kids', slug: 'kids', description: 'Soft, breathable Mukhawar designed for little ones' },
      { name: 'Premium Edit', slug: 'premium', description: 'Luxurious silk-blend pieces for weddings and celebrations' },
    ])
    .returning();

  console.log('✅ Categories inserted');

  // ─── Products ──────────────────────────────────────────────────────────────
  await db.insert(products).values([
    {
      categoryId: mukhawar.id,
      name: 'Lyra Mukhawar – Desert Rose FG 1905',
      slug: 'desert-rose-fg-1905',
      price: '295.00',
      description: 'A stunning desert rose Mukhawar featuring delicate gold embroidery along the neckline and sleeves. Crafted from 100% premium Egyptian cotton for ultimate comfort and breathability.',
      shortDescription: 'Desert rose with gold embroidery',
      images: ['/placeholder.svg'],
      colors: ['Desert Rose', 'Gold Accent'],
      sizes: ['S', 'M', 'L', 'XL'],
      badge: 'BESTSELLER',
      fabric: '100% Egyptian Cotton',
      embroideryType: 'Hand-stitched gold thread',
      inStock: true,
      stockQuantity: 15,
      featured: true,
    },
    {
      categoryId: mukhawar.id,
      name: 'Lyra Mukhawar – Midnight Teal FG 2001',
      slug: 'midnight-teal-fg-2001',
      price: '345.00',
      description: 'An elegant midnight teal Mukhawar with intricate silver embroidery. Perfect for special occasions while maintaining everyday comfort.',
      shortDescription: 'Midnight teal with silver embroidery',
      images: ['/placeholder.svg'],
      colors: ['Midnight Teal', 'Silver Accent'],
      sizes: ['S', 'M', 'L', 'XL'],
      badge: 'NEW',
      fabric: '100% Premium Cotton',
      embroideryType: 'Machine embroidered silver thread',
      inStock: true,
      stockQuantity: 10,
      featured: true,
    },
    {
      categoryId: premium.id,
      name: 'Lyra Mukhawar – Champagne Dream FG 1888',
      slug: 'champagne-dream-fg-1888',
      price: '425.00',
      compareAtPrice: '495.00',
      description: 'A luxurious champagne Mukhawar from our Premium Edit collection. Features hand-embroidered pearl details and silk-blend lining.',
      shortDescription: 'Champagne with pearl embroidery',
      images: ['/placeholder.svg'],
      colors: ['Champagne', 'Pearl White'],
      sizes: ['S', 'M', 'L', 'XL'],
      badge: 'LIMITED',
      fabric: 'Cotton-Silk Blend',
      embroideryType: 'Hand-embroidered pearls',
      inStock: true,
      stockQuantity: 5,
      featured: true,
    },
    {
      categoryId: mukhawar.id,
      name: 'Lyra Mukhawar – Soft Blush FG 1750',
      slug: 'soft-blush-fg-1750',
      price: '275.00',
      description: 'A delicate blush pink Mukhawar perfect for everyday elegance. Features subtle tone-on-tone embroidery.',
      shortDescription: 'Soft blush with subtle embroidery',
      images: ['/placeholder.svg'],
      colors: ['Soft Blush'],
      sizes: ['S', 'M', 'L', 'XL'],
      fabric: '100% Premium Cotton',
      embroideryType: 'Tone-on-tone embroidery',
      inStock: true,
      stockQuantity: 20,
      featured: true,
    },
    {
      categoryId: kids.id,
      name: 'Little Lyra – Princess Bloom FG 501',
      slug: 'princess-bloom-fg-501',
      price: '195.00',
      description: 'A charming Mukhawar for little ones featuring playful floral embroidery. Soft, breathable cotton perfect for active kids.',
      shortDescription: 'Kids floral embroidered Mukhawar',
      images: ['/placeholder.svg'],
      colors: ['Lavender', 'Pink Accents'],
      sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
      badge: 'NEW',
      fabric: '100% Soft Cotton',
      embroideryType: 'Floral machine embroidery',
      inStock: true,
      stockQuantity: 12,
      featured: true,
    },
    {
      categoryId: shaila.id,
      name: 'Lyra Shaila – Classic Ivory SH 100',
      slug: 'classic-ivory-sh-100',
      price: '85.00',
      description: 'A timeless ivory shaila crafted from lightweight cotton. Perfect for pairing with any Mukhawar.',
      shortDescription: 'Classic ivory lightweight shaila',
      images: ['/placeholder.svg'],
      colors: ['Ivory'],
      sizes: ['One Size'],
      badge: 'BESTSELLER',
      fabric: '100% Lightweight Cotton',
      inStock: true,
      stockQuantity: 30,
      featured: false,
    },
    {
      categoryId: mukhawar.id,
      name: 'Lyra Mukhawar – Ocean Mist FG 2010',
      slug: 'ocean-mist-fg-2010',
      price: '315.00',
      description: 'A serene ocean-inspired Mukhawar with wave-pattern embroidery in silver thread.',
      shortDescription: 'Ocean blue with wave embroidery',
      images: ['/placeholder.svg'],
      colors: ['Ocean Blue', 'Silver'],
      sizes: ['S', 'M', 'L', 'XL'],
      fabric: '100% Premium Cotton',
      embroideryType: 'Wave pattern silver thread',
      inStock: true,
      stockQuantity: 8,
      featured: true,
    },
    {
      categoryId: mukhawar.id,
      name: 'Lyra Mukhawar – Emerald Garden FG 1999',
      slug: 'emerald-garden-fg-1999',
      price: '365.00',
      description: 'A rich emerald green Mukhawar with botanical-inspired gold embroidery. A statement piece for special occasions.',
      shortDescription: 'Emerald green with botanical gold',
      images: ['/placeholder.svg'],
      colors: ['Emerald Green', 'Gold'],
      sizes: ['S', 'M', 'L', 'XL'],
      badge: 'LIMITED',
      fabric: '100% Premium Cotton',
      embroideryType: 'Botanical gold thread embroidery',
      inStock: true,
      stockQuantity: 6,
      featured: true,
    },
  ]);

  console.log('✅ Products inserted');

  // ─── Full-text search trigger ───────────────────────────────────────────────
  // Creates a tsvector column and trigger so search is fast at query time.
  // Safe to run multiple times (uses CREATE OR REPLACE).
  await db.execute(sql`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS search_vector tsvector;
  `);

  await db.execute(sql`
    CREATE OR REPLACE FUNCTION update_product_search_vector()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.short_description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(NEW.fabric, '')), 'D');
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await db.execute(sql`
    DROP TRIGGER IF EXISTS trg_product_search_vector ON products
  `);

  await db.execute(sql`
    CREATE TRIGGER trg_product_search_vector
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_product_search_vector()
  `);

  // Backfill search_vector for existing rows
  await db.execute(sql`
    UPDATE products SET search_vector =
      setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(short_description, '')), 'B') ||
      setweight(to_tsvector('english', COALESCE(description, '')), 'C') ||
      setweight(to_tsvector('english', COALESCE(fabric, '')), 'D');
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(search_vector);
  `);

  console.log('✅ Full-text search index created');
  console.log('🎉 Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
