import { createMiddleware } from 'hono/factory';

/**
 * Admin API key middleware.
 * Pass the key in requests as:  x-api-key: <your ADMIN_API_KEY>
 */
export const adminAuth = createMiddleware(async (c, next) => {
  const key = c.req.header('x-api-key');
  if (!key || key !== process.env.ADMIN_API_KEY) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
});
