import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { isUuid, str, urlOpt } from '@/lib/validate';
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

  const certification = await prisma.certification.update({
    where: { id },
    data: {
      title:       str(body.title, 200)       ?? undefined,
      issuer:      str(body.issuer, 100)      ?? undefined,
      iconUrl:     urlOpt(body.iconUrl),
      credlyUrl:   urlOpt(body.credlyUrl),
      description: str(body.description, 2000) ?? undefined
    }
  });

  return json(certification);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUuid(id)) return error('Invalid ID', 400);

  await prisma.certification.delete({ where: { id } });
  return json({ message: 'Deleted' });
}
