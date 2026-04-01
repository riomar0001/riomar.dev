import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { isUuid, str } from '@/lib/validate';
import { prisma } from '@/lib/prisma';

const ALLOWED_ICON_TYPES = new Set(['location', 'clock', 'briefcase']);

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

  const iconType = str(body.iconType, 50) ?? undefined;
  if (iconType !== undefined && !ALLOWED_ICON_TYPES.has(iconType)) {
    return error('Invalid iconType');
  }

  const card = await prisma.contactCard.update({
    where: { id },
    data: {
      title:    str(body.title, 100)    ?? undefined,
      value:    str(body.value, 200)    ?? undefined,
      iconType: iconType
    }
  });

  return json(card);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUuid(id)) return error('Invalid ID', 400);

  await prisma.contactCard.delete({ where: { id } });
  return json({ message: 'Deleted' });
}
