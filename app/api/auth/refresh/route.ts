import { NextRequest, NextResponse } from 'next/server';
import { signAccessToken, REFRESH_TOKEN_EXPIRY_MS } from '@/lib/auth';
import { error, json } from '@/lib/api-helpers';
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

// GET - used by middleware redirect flow
export async function GET(request: NextRequest) {
  const { response, accessToken, newRefreshToken } = await handleRefresh(request);

  if (response) {
    // Refresh failed, redirect to login
    const res = NextResponse.redirect(new URL('/dashboard/login', request.url));
    res.cookies.delete('access_token');
    res.cookies.delete('refresh_token');
    return res;
  }

  const rawRedirect = request.nextUrl.searchParams.get('redirect') ?? '/dashboard';
  // Only allow relative /dashboard paths — prevents open redirect attacks
  const redirectPath = /^\/dashboard(\/|$)/.test(rawRedirect) ? rawRedirect : '/dashboard';
  const res = NextResponse.redirect(new URL(redirectPath, request.url));

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
