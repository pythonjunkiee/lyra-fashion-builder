import { createMiddleware } from 'hono/factory';
import type { Context } from 'hono';

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clientIp(c: Context): string {
  return (
    c.req.header('x-forwarded-for')?.split(',')[0].trim() ??
    c.req.header('x-real-ip') ??
    'unknown'
  );
}

// ─── In-memory rate limiter ───────────────────────────────────────────────────
/**
 * Sliding-window rate limiter backed by a local Map.
 *
 * ⚠️  On Vercel serverless, each warm function instance has its own Map.
 *    This provides per-instance protection (useful for burst abuse) but is
 *    NOT globally consistent. For strict global limits on auth endpoints,
 *    set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN and the Redis
 *    limiter below will be used automatically.
 */
export function rateLimit({ windowMs, max, keyFn }: RateLimitOptions) {
  const store = new Map<string, Entry>();

  const pruneInterval = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of store) {
      if (v.resetAt < now) store.delete(k);
    }
  }, Math.min(windowMs, 60_000));

  if (pruneInterval.unref) pruneInterval.unref();

  return createMiddleware(async (c, next) => {
    const key = keyFn ? keyFn(c) : clientIp(c);
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

// ─── Redis-backed rate limiter (Upstash / Vercel KV) ─────────────────────────
/**
 * Globally consistent sliding-window rate limiter using Upstash Redis.
 * Works across all Vercel serverless instances.
 *
 * Required env vars (add to Vercel backend project settings):
 *   UPSTASH_REDIS_REST_URL   — from console.upstash.com → Redis → REST API
 *   UPSTASH_REDIS_REST_TOKEN — same dashboard
 *
 * Falls back silently to the in-memory limiter if env vars are absent,
 * so local development and fresh deploys continue to work without Redis.
 */

let _redisLimiter: unknown = null; // lazily initialised

async function getRedisLimiter(
  requests: number,
  windowSeconds: number,
  prefix: string,
): Promise<{ limit: (key: string) => Promise<{ success: boolean; limit: number; remaining: number; reset: number }> } | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) return null;

  if (!_redisLimiter) {
    try {
      const { Ratelimit } = await import('@upstash/ratelimit');
      const { Redis } = await import('@upstash/redis');
      const redis = new Redis({ url, token });
      _redisLimiter = new Ratelimit({
        redis,
        // Sliding window: more accurate than fixed window against burst attacks
        limiter: Ratelimit.slidingWindow(requests, `${windowSeconds} s`),
        analytics: false,
        prefix,
      });
    } catch {
      // Package not installed — fall back gracefully
      return null;
    }
  }

  return _redisLimiter as ReturnType<typeof getRedisLimiter> extends Promise<infer T> ? T : never;
}

/**
 * Strict auth rate limiter.
 *
 * With Redis: 10 requests per 15 minutes per IP (globally consistent).
 * Without Redis: 10 requests per 15 minutes per IP (per-instance).
 *
 * Applied to: POST /api/auth/login, POST /api/auth/register.
 * Designed to make credential-stuffing and brute-force attacks infeasible.
 */
export function authRateLimit() {
  const REQUESTS = 10;
  const WINDOW_S = 15 * 60; // 15 minutes
  const WINDOW_MS = WINDOW_S * 1000;

  // In-memory fallback limiter (shared across calls to this middleware)
  const fallback = rateLimit({ windowMs: WINDOW_MS, max: REQUESTS });

  return createMiddleware(async (c, next) => {
    const ip = clientIp(c);

    try {
      const limiter = await getRedisLimiter(REQUESTS, WINDOW_S, 'lyra_auth');
      if (limiter) {
        const { success, limit, remaining, reset } = await limiter.limit(ip);

        c.header('X-RateLimit-Limit', String(limit));
        c.header('X-RateLimit-Remaining', String(remaining));
        c.header('X-RateLimit-Reset', String(Math.ceil(reset / 1000)));

        if (!success) {
          const retryAfter = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
          return c.json(
            { error: 'Too many login attempts. Please wait 15 minutes before trying again.' },
            429,
            { 'Retry-After': String(retryAfter) },
          );
        }

        return next();
      }
    } catch {
      // Redis error — degrade gracefully to in-memory limiter
    }

    // In-memory fallback
    return fallback(c, next);
  });
}
