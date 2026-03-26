import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return error('Invalid request body');
  }

  const card = await prisma.contactCard.update({
    where: { id },
    data: {
      title: body.title as string | undefined,
      value: body.value as string | undefined,
      iconType: body.iconType as string | undefined
    }
  });

  return json(card);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  await prisma.contactCard.delete({ where: { id } });
  return json({ message: 'Deleted' });
}
