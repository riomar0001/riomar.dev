import { NextRequest } from 'next/server';
import { json } from '@/lib/api-helpers';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (refreshToken) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revokedAt: new Date() }
    });
  }

  const response = json({ message: 'Logged out' });
  response.cookies.delete('access_token');
  response.cookies.delete('refresh_token');
  return response;
}
