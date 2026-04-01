import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { isUuid, str, strOpt, urlOpt, strArray } from '@/lib/validate';
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

  const experience = await prisma.experience.update({
    where: { id },
    data: {
      role:        str(body.role, 100)                ?? undefined,
      company:     str(body.company, 100)             ?? undefined,
      location:    strOpt(body.location, 200) ?? undefined,
      period:      str(body.period, 100)              ?? undefined,
      description: strArray(body.description, 20, 1000) ?? undefined,
      tags:        strArray(body.tags, 20, 50)        ?? undefined,
      link:        urlOpt(body.link)
    }
  });

  return json(experience);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUuid(id)) return error('Invalid ID', 400);

  await prisma.experience.delete({ where: { id } });
  return json({ message: 'Deleted' });
}
