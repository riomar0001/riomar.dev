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

  const project = await prisma.project.update({
    where: { id },
    data: {
      title:       str(body.title, 200)          ?? undefined,
      description: str(body.description, 2000)   ?? undefined,
      imageUrl:    urlOpt(body.imageUrl),
      tags:        strArray(body.tags, 20, 50)   ?? undefined,
      link:        urlOpt(body.link),
      github:      strOpt(body.github, 500),
      featured:    typeof body.featured === 'boolean' ? body.featured : undefined
    }
  });

  return json(project);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUuid(id)) return error('Invalid ID', 400);

  await prisma.project.delete({ where: { id } });
  return json({ message: 'Deleted' });
}
