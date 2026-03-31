import { NextRequest } from 'next/server';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return error('Invalid request body');
  }

  const { currentPassword, newPassword } = body;
  if (!currentPassword || !newPassword) {
    return error('currentPassword and newPassword are required');
  }
  if (newPassword.length < 8) {
    return error('New password must be at least 8 characters');
  }

  const user = await prisma.user.findUnique({ where: { id: auth.userId } });
  if (!user) return error('User not found', 404);

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) return error('Current password is incorrect', 401);

  const passwordHash = await hashPassword(newPassword);

  // Update password and revoke all refresh tokens (force re-login on other sessions)
  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
    prisma.refreshToken.deleteMany({ where: { userId: user.id } })
  ]);

  return json({ message: 'Password changed successfully' });
}
