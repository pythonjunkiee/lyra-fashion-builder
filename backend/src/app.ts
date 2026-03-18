import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import productsRouter from './routes/products';
import categoriesRouter from './routes/categories';
import uploadRouter from './routes/upload';
import adminRouter from './routes/admin';
import { rateLimit } from './middleware/rateLimit';

const app = new Hono();

app.use('*', logger());
// Explicit allowlist — no wildcard subdomains. Any attacker Vercel project
// (evil.vercel.app) will receive null and the browser will block the request.
const ALLOWED_ORIGINS = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:8080',
  'http://localhost:3000',
  'https://lyra-fashion.vercel.app',          // main storefront
  'https://lyra-fashion-builder.vercel.app',  // CRM
]);

app.use(
  '*',
  cors({
    origin: (origin) => {
      if (!origin || ALLOWED_ORIGINS.has(origin)) return origin ?? '*';
      return null;
    },
    allowHeaders: ['Content-Type', 'x-api-key'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
);

// ─── Rate limiting ────────────────────────────────────────────────────────────
// Public endpoints: 60 req/min per IP
const publicLimit = rateLimit({ windowMs: 60_000, max: 60 });
// Admin endpoints: 120 req/min per IP (API key required; higher ceiling)
const adminLimit = rateLimit({ windowMs: 60_000, max: 120 });
// Upload: 20 req/min (prevents Cloudinary quota abuse)
const uploadLimit = rateLimit({ windowMs: 60_000, max: 20 });

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use('/api/products/*', publicLimit);
app.use('/api/categories/*', publicLimit);
app.use('/api/upload/*', uploadLimit);
app.use('/api/admin/*', adminLimit);

app.route('/api/products', productsRouter);
app.route('/api/categories', categoriesRouter);
app.route('/api/upload', uploadRouter);
app.route('/api/admin', adminRouter);

export default app;
