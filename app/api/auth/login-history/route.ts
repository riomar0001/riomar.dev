import { NextRequest } from 'next/server';
import { isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const history = await prisma.loginHistory.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      ipAddress: true,
      userAgent: true,
      success: true,
      reason: true,
      createdAt: true
    }
  });

  return json(history);
}
