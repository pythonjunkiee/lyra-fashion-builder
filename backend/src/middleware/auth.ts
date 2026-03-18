import { timingSafeEqual } from 'crypto';
import { createMiddleware } from 'hono/factory';

/**
 * Admin API key middleware with two layers of protection:
 *
 * 1. Constant-time comparison — uses crypto.timingSafeEqual so an attacker
 *    cannot guess the key character-by-character by measuring response times.
 *
 * 2. Auth failure lockout — after 10 consecutive failures from the same IP,
 *    that IP is blocked for 15 minutes. Resets on first successful auth.
 *    (In-memory per Vercel instance; sufficient to stop interactive brute-force.)
 *
 * Pass the key in requests as:  x-api-key: <your ADMIN_API_KEY>
 */

interface FailRecord {
  count: number;
  blockedUntil: number;
}

const failedAttempts = new Map<string, FailRecord>();

// Prune stale lockout records every 15 minutes to prevent unbounded growth
const pruneInterval = setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of failedAttempts) {
    if (rec.blockedUntil < now) failedAttempts.delete(ip);
  }
}, 15 * 60 * 1000);

if (pruneInterval.unref) pruneInterval.unref();

export const adminAuth = createMiddleware(async (c, next) => {
  const ip =
    c.req.header('x-forwarded-for')?.split(',')[0].trim() ??
    c.req.header('x-real-ip') ??
    'unknown';

  const now = Date.now();
  const record = failedAttempts.get(ip);

  // Check lockout before touching the key at all
  if (record && record.blockedUntil > now) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
    return c.json(
      { error: 'Too many failed attempts. Try again later.' },
      429,
      { 'Retry-After': String(retryAfter) },
    );
  }

  const key = c.req.header('x-api-key') ?? '';
  const expected = process.env.ADMIN_API_KEY ?? '';

  // Constant-time comparison using fixed 64-byte buffers.
  // A naive `!==` exits on the first differing character, leaking timing info
  // that could let an attacker guess the key one byte at a time.
  const BUF_LEN = 64;
  const keyBuf = Buffer.alloc(BUF_LEN);
  const expBuf = Buffer.alloc(BUF_LEN);
  Buffer.from(key).copy(keyBuf);
  Buffer.from(expected).copy(expBuf);

  const valid = expected.length > 0 && timingSafeEqual(keyBuf, expBuf);

  if (!valid) {
    const current = failedAttempts.get(ip) ?? { count: 0, blockedUntil: 0 };
    current.count++;
    if (current.count >= 10) {
      current.blockedUntil = now + 15 * 60 * 1000; // 15-minute block
    }
    failedAttempts.set(ip, current);
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // Successful auth — clear any previous failure record for this IP
  failedAttempts.delete(ip);
  await next();
});
