import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { isUuid, str } from '@/lib/validate';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUuid(id)) return error('Invalid ID', 400);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return error('Invalid request body');
  }

  const achievement = await prisma.achievement.update({
    where: { id },
    data: {
      title:       str(body.title, 100)       ?? undefined,
      event:       str(body.event, 200)       ?? undefined,
      date:        str(body.date, 50)         ?? undefined,
      description: str(body.description, 2000) ?? undefined
    }
  });

  return json(achievement);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUuid(id)) return error('Invalid ID', 400);

  await prisma.achievement.delete({ where: { id } });
  return json({ message: 'Deleted' });
}
