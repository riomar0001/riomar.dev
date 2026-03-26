import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;

  let body: { category?: string; items?: string[] };
  try {
    body = await request.json();
  } catch {
    return error('Invalid request body');
  }

  const { category, items } = body;

  // Delete existing items and recreate
  await prisma.skillItem.deleteMany({ where: { groupId: id } });

  const group = await prisma.skillGroup.update({
    where: { id },
    data: {
      category,
      items: items
        ? {
            create: items.map((name, i) => ({ name, order: i }))
          }
        : undefined
    },
    include: { items: { orderBy: { order: 'asc' } } }
  });

  return json(group);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  await prisma.skillGroup.delete({ where: { id } });
  return json({ message: 'Deleted' });
}
