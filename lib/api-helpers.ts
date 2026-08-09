import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from './auth';
import { prisma } from './prisma';

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Redirect to a path on this same site.
 *
 * Deliberately not `NextResponse.redirect()`: that needs an absolute URL, and
 * the only origin this server knows is its own bind address. Next builds
 * `request.url` / `request.nextUrl` from `HOSTNAME` + `PORT` (`0.0.0.0:3000`
 * in the container), not from the `Host` header, so an absolute redirect sends
 * visitors to `https://0.0.0.0:3000/...` instead of riomar.dev. Middleware
 * redirects escape this because Next relativizes those itself; route handler
 * responses go out untouched.
 *
 * A relative `Location` (RFC 7231 §7.1.2) keeps the browser on whatever origin
 * it actually used, so this works the same locally, in Docker and through the
 * Cloudflare Tunnel.
 */
export function redirectTo(path: string, status: 302 | 307 | 308 = 307) {
  return new NextResponse(null, { status, headers: { Location: path } });
}

export async function requireAuth(request: NextRequest): Promise<{ userId: string } | NextResponse> {
  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    return error('Unauthorized', 401);
  }

  const payload = await verifyAccessToken(accessToken);
  if (!payload) {
    return error('Invalid or expired token', 401);
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    return error('User not found', 401);
  }

  return { userId: payload.userId };
}

export function isAuthError(result: unknown): result is NextResponse {
  return result instanceof NextResponse;
}

/**
 * Rebuild the ISR-cached public pages. Call after any CMS mutation so
 * dashboard edits show up immediately instead of waiting for revalidation.
 */
export function revalidatePublic() {
  revalidatePath('/');
  revalidatePath('/projects');
}

export function getClientIp(request: NextRequest): string {
  // CF-Connecting-IP is the real client IP set by Cloudflare Tunnel
  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}
