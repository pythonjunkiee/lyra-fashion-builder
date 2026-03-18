import { createMiddleware } from 'hono/factory';
import type { Context } from 'hono';

interface RateLimitOptions {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum requests allowed per window per key */
  max: number;
  /** Custom key extractor — defaults to client IP */
  keyFn?: (c: Context) => string;
}

interface Entry {
  count: number;
  resetAt: number;
}

/**
 * In-memory sliding window rate limiter.
 *
 * NOTE: On Vercel serverless each warm function instance has independent state.
 * This provides meaningful protection against burst abuse within a single
 * instance. For global rate limiting across all instances, use Upstash Redis.
 */
export function rateLimit({ windowMs, max, keyFn }: RateLimitOptions) {
  const store = new Map<string, Entry>();

  // Prune expired entries to prevent unbounded memory growth
  const pruneInterval = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of store) {
      if (v.resetAt < now) store.delete(k);
    }
  }, Math.min(windowMs, 60_000));

  // Allow GC when running in a non-persistent environment
  if (pruneInterval.unref) pruneInterval.unref();

  return createMiddleware(async (c, next) => {
    const ip =
      c.req.header('x-forwarded-for')?.split(',')[0].trim() ??
      c.req.header('x-real-ip') ??
      'unknown';
    const key = keyFn ? keyFn(c) : ip;
    const now = Date.now();

    let entry = store.get(key);

    if (!entry || entry.resetAt < now) {
      entry = { count: 0, resetAt: now + windowMs };
      store.set(key, entry);
    }

    if (entry.count >= max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return c.json(
        { error: 'Too many requests — please slow down.' },
        429,
        {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(max),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(entry.resetAt / 1000)),
        },
      );
    }

    entry.count++;
    c.header('X-RateLimit-Limit', String(max));
    c.header('X-RateLimit-Remaining', String(max - entry.count));
    c.header('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)));

    await next();
  });
}
