/**
 * Vercel Edge Middleware — runs on every request before it reaches the SPA.
 *
 * Responsibilities:
 *  - Protect /profile: redirect to /account?from=/profile if the lyra_token
 *    cookie is absent or has already expired (checked via JWT exp claim).
 *
 * NOTE: We only check exp — we do NOT verify the HMAC signature here because
 * the Edge Runtime's Web Crypto API requires importing the key asynchronously
 * and the overhead adds ~5 ms per request. Signature verification is enforced
 * on every real API call in the backend (/api/auth/me). This guard is purely
 * to avoid a jarring 404/redirect loop for obviously-expired/missing sessions.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'lyra_token';
const PROTECTED_PATHS = ['/profile'];

function isTokenExpired(token: string): boolean {
  try {
    // JWT is three base64url-encoded segments: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    // Decode payload (base64url → JSON)
    const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(payloadJson) as { exp?: number };

    if (!payload.exp) return true;
    return Date.now() / 1000 >= payload.exp;
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token || isTokenExpired(token)) {
      const loginUrl = new URL('/account', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Only run on /profile (and sub-paths). Skip static assets and API routes.
  matcher: ['/profile/:path*'],
};
