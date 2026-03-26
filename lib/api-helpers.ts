import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from './auth';
import { prisma } from './prisma';

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
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

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}
