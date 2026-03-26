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

  const certification = await prisma.certification.update({
    where: { id },
    data: {
      title: body.title as string | undefined,
      issuer: body.issuer as string | undefined,
      iconUrl: body.iconUrl as string | null | undefined,
      credlyUrl: body.credlyUrl as string | null | undefined,
      description: body.description as string | undefined
    }
  });

  return json(certification);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  await prisma.certification.delete({ where: { id } });
  return json({ message: 'Deleted' });
}
