/**
 * Customer auth routes — register, login, /me, logout.
 *
 * Security model:
 *  - Passwords hashed with bcrypt (12 rounds).
 *  - Sessions are stateless JWTs (HS256) signed with AUTH_JWT_SECRET.
 *  - Tokens are delivered ONLY via HttpOnly, Secure, SameSite=Lax cookies —
 *    they are never returned in the JSON response body, so they cannot be
 *    stolen by XSS.
 *  - TTL: 24 h (short-lived; refresh on activity is a future enhancement).
 *  - SameSite=Lax prevents CSRF without requiring a CSRF token.
 *  - Logout clears the cookie server-side via an expired Set-Cookie.
 */
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import { db } from '../db/index';
import { users } from '../db/schema';

const router = new Hono();

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_JWT_SECRET ?? 'fallback_dev_secret_change_in_prod',
);
const JWT_ALG = 'HS256';
const JWT_TTL = '24h';
const COOKIE_NAME = 'lyra_token';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 h in seconds
const IS_PROD = process.env.NODE_ENV === 'production';

async function signToken(userId: number, email: string): Promise<string> {
  return new SignJWT({ sub: String(userId), email })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(JWT_TTL)
    .sign(JWT_SECRET);
}

async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload;
}

function setAuthCookie(c: Parameters<typeof setCookie>[0], token: string) {
  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'Lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────

router.post(
  '/register',
  zValidator('json', z.object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  })),
  async (c) => {
    const { email, password, firstName, lastName } = c.req.valid('json');

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existing) {
      return c.json({ error: 'An account with this email already exists.' }, 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db
      .insert(users)
      .values({ email: email.toLowerCase(), passwordHash, firstName, lastName })
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      });

    const token = await signToken(user.id, user.email);
    setAuthCookie(c, token);

    // Token is NOT returned in the body — it lives only in the HttpOnly cookie.
    return c.json({ data: { user } }, 201);
  },
);

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

router.post(
  '/login',
  zValidator('json', z.object({
    email: z.string().email(),
    password: z.string().min(1),
  })),
  async (c) => {
    const { email, password } = c.req.valid('json');

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    // Always run bcrypt.compare even on miss — prevents timing-based user enumeration.
    const dummy = '$2a$12$invalidhashpaddingtomatch64charsXXXXXXXXXXXXXXXXXXXXXXXX';
    const passwordMatch = await bcrypt.compare(password, user?.passwordHash ?? dummy);

    if (!user || !passwordMatch) {
      return c.json({ error: 'Incorrect email or password.' }, 401);
    }

    const token = await signToken(user.id, user.email);
    setAuthCookie(c, token);

    return c.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt,
        },
      },
    });
  },
);

// ─── GET /api/auth/me — reads JWT from HttpOnly cookie ───────────────────────

router.get('/me', async (c) => {
  const token = getCookie(c, COOKIE_NAME);
  if (!token) return c.json({ error: 'Unauthorised' }, 401);

  try {
    const payload = await verifyToken(token);
    const userId = Number(payload.sub);

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) return c.json({ error: 'User not found' }, 404);
    return c.json({ data: user });
  } catch {
    return c.json({ error: 'Invalid or expired token.' }, 401);
  }
});

// ─── POST /api/auth/logout — clears the cookie server-side ───────────────────

router.post('/logout', (c) => {
  deleteCookie(c, COOKIE_NAME, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'Lax',
    path: '/',
  });
  return c.json({ success: true });
});

export default router;
