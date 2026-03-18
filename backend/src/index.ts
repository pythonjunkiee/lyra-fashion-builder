import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { config } from 'dotenv';

config();

import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import uploadRouter from './routes/upload.js';
import adminRouter from './routes/admin.js';

const app = new Hono();

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use('*', logger());
app.use(
  '*',
  cors({
    origin: (origin) => {
      const allowed = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:8080',
        'http://localhost:3000',
        'https://lyra-fashion.vercel.app',
      ];
      // Allow any Vercel preview/deploy URL for this project
      if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
        return origin ?? '*';
      }
      return null;
    },
    allowHeaders: ['Content-Type', 'x-api-key'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
);

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.route('/api/products', productsRouter);
app.route('/api/categories', categoriesRouter);
app.route('/api/upload', uploadRouter);
app.route('/api/admin', adminRouter);

// ─── Start ────────────────────────────────────────────────────────────────────

const port = Number(process.env.PORT) || 3001;

serve({ fetch: app.fetch, port }, () => {
  console.log(`\n🌸 Lyra backend running → http://localhost:${port}`);
  console.log(`   Health check: http://localhost:${port}/api/health\n`);
});
