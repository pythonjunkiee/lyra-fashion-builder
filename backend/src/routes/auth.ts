/**
 * Customer auth routes — register, login, profile.
 * Passwords are hashed with bcryptjs.
 * Sessions are stateless JWTs signed with AUTH_JWT_SECRET, valid for 30 days.
 */
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { db } from '../db/index';
import { users } from '../db/schema';

const router = new Hono();

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_JWT_SECRET ?? 'fallback_dev_secret_change_in_prod'
);
const JWT_ALG = 'HS256';
const JWT_TTL = '30d';

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

    // Check if email already in use
    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing) {
      return c.json({ error: 'An account with this email already exists.' }, 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db
      .insert(users)
      .values({ email, passwordHash, firstName, lastName })
      .returning({ id: users.id, email: users.email, firstName: users.firstName, lastName: users.lastName, createdAt: users.createdAt });

    const token = await signToken(user.id, user.email);
    return c.json({ data: { token, user } }, 201);
  }
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
      .where(eq(users.email, email))
      .limit(1);

    // Use constant-time comparison to prevent timing attacks
    const passwordMatch = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !passwordMatch) {
      return c.json({ error: 'Incorrect email or password.' }, 401);
    }

    const token = await signToken(user.id, user.email);
    return c.json({
      data: {
        token,
        user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, createdAt: user.createdAt },
      },
    });
  }
);

// ─── GET /api/auth/me — requires Authorization: Bearer <token> ────────────────

router.get('/me', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorised' }, 401);
  }
  const token = authHeader.slice(7);
  try {
    const payload = await verifyToken(token);
    const userId = Number(payload.sub);
    const [user] = await db
      .select({ id: users.id, email: users.email, firstName: users.firstName, lastName: users.lastName, createdAt: users.createdAt })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!user) return c.json({ error: 'User not found' }, 404);
    return c.json({ data: user });
  } catch {
    return c.json({ error: 'Invalid or expired token.' }, 401);
  }
});

export default router;
