import { NextRequest } from 'next/server';
import { signAccessToken, REFRESH_TOKEN_EXPIRY_MS } from '@/lib/auth';
import { error, json, redirectTo } from '@/lib/api-helpers';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

async function handleRefresh(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (!refreshToken) {
    return { response: error('No refresh token', 401), accessToken: null, newRefreshToken: null };
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true }
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    return { response: error('Invalid or expired refresh token', 401), accessToken: null, newRefreshToken: null };
  }

  // Rotate refresh token
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() }
  });

  const newRefreshToken = randomUUID();
  const refreshExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

  await prisma.refreshToken.create({
    data: { token: newRefreshToken, userId: stored.userId, expiresAt: refreshExpiresAt }
  });

  const accessToken = await signAccessToken(stored.userId);
  return { response: null, accessToken, newRefreshToken };
}

/**
 * Where to send the user once the refresh succeeds. Middleware passes the page
 * they were originally after; only same-site paths are accepted so a crafted
 * `?redirect=` can't bounce anyone off to another host.
 */
function safeRedirectTarget(request: NextRequest) {
  const target = request.nextUrl.searchParams.get('redirect');
  if (target?.startsWith('/dashboard') && !target.startsWith('//')) return target;
  return '/dashboard';
}

// GET - used by middleware redirect flow
export async function GET(request: NextRequest) {
  const { response, accessToken, newRefreshToken } = await handleRefresh(request);

  if (response) {
    // Refresh failed, redirect to login
    const res = redirectTo('/dashboard/login');
    res.cookies.delete('access_token');
    res.cookies.delete('refresh_token');
    return res;
  }

  const res = redirectTo(safeRedirectTarget(request));

  res.cookies.set('access_token', accessToken!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60,
    path: '/'
  });

  res.cookies.set('refresh_token', newRefreshToken!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/'
  });

  return res;
}

// POST - used by client-side API calls
export async function POST(request: NextRequest) {
  const { response, accessToken, newRefreshToken } = await handleRefresh(request);

  if (response) return response;

  const res = json({ message: 'Token refreshed' });

  res.cookies.set('access_token', accessToken!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60,
    path: '/'
  });

  res.cookies.set('refresh_token', newRefreshToken!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/'
  });

  return res;
}
