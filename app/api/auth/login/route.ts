import { NextRequest } from 'next/server';
import { signAccessToken, verifyPassword, LOCKOUT_DURATION_MS, MAX_FAILED_ATTEMPTS, REFRESH_TOKEN_EXPIRY_MS } from '@/lib/auth';
import { getClientIp, error, json } from '@/lib/api-helpers';
import { checkRateLimit } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent') ?? undefined;

  // 10 login attempts per IP per 15 minutes
  if (!checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000)) {
    return error('Too many login attempts. Try again later.', 429);
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return error('Invalid request body');
  }

  const { username, password } = body;
  if (!username || !password) {
    return error('Username and password are required');
  }

  const user = await prisma.user.findUnique({ where: { username } });

  // Log failed attempt for unknown user
  if (!user) {
    await prisma.loginHistory.create({
      data: { ipAddress: ip, userAgent, success: false, reason: 'User not found' }
    });
    // Generic error to avoid username enumeration
    return error('Invalid credentials', 401);
  }

  // Check lockout
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const remaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    await prisma.loginHistory.create({
      data: { userId: user.id, ipAddress: ip, userAgent, success: false, reason: 'Account locked' }
    });
    return error(`Account locked. Try again in ${remaining} minute(s).`, 403);
  }

  const valid = await verifyPassword(password, user.passwordHash);

  if (!valid) {
    const newFailedAttempts = user.failedAttempts + 1;
    const shouldLock = newFailedAttempts >= MAX_FAILED_ATTEMPTS;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedAttempts: newFailedAttempts,
        lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_DURATION_MS) : null
      }
    });

    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        ipAddress: ip,
        userAgent,
        success: false,
        reason: shouldLock ? `Locked after ${MAX_FAILED_ATTEMPTS} failed attempts` : 'Wrong password'
      }
    });

    if (shouldLock) {
      return error(`Too many failed attempts. Account locked for 15 minutes.`, 403);
    }

    const remaining = MAX_FAILED_ATTEMPTS - newFailedAttempts;
    return error(`Invalid credentials. ${remaining} attempt(s) remaining.`, 401);
  }

  // Successful login - reset failed attempts
  await prisma.user.update({
    where: { id: user.id },
    data: { failedAttempts: 0, lockedUntil: null }
  });

  // Generate tokens
  const accessToken = await signAccessToken(user.id);
  const refreshToken = randomUUID();
  const refreshExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

  // Clean up old refresh tokens for this user
  await prisma.refreshToken.deleteMany({
    where: { userId: user.id, expiresAt: { lt: new Date() } }
  });

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt: refreshExpiresAt }
  });

  await prisma.loginHistory.create({
    data: { userId: user.id, ipAddress: ip, userAgent, success: true }
  });

  const response = json({ message: 'Logged in successfully' });

  response.cookies.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60, // 15 minutes
    path: '/'
  });

  response.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/'
  });

  return response;
}
