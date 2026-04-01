import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { isUuid, str, strArray } from '@/lib/validate';
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

  const category = str(body.category, 100);
  const items    = strArray(body.items, 50, 100);

  // Delete existing items and recreate
  await prisma.skillItem.deleteMany({ where: { groupId: id } });

  const group = await prisma.skillGroup.update({
    where: { id },
    data: {
      category: category ?? undefined,
      items: items ? { create: items.map((name, i) => ({ name, order: i })) } : undefined
    },
    include: { items: { orderBy: { order: 'asc' } } }
  });

  return json(group);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUuid(id)) return error('Invalid ID', 400);

  await prisma.skillGroup.delete({ where: { id } });
  return json({ message: 'Deleted' });
}
