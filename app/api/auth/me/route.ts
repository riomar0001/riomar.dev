import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { id: true, username: true, createdAt: true }
  });

  if (!user) return error('User not found', 404);

  return json(user);
}
