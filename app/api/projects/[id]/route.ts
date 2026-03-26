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

  const project = await prisma.project.update({
    where: { id },
    data: {
      title: body.title as string | undefined,
      description: body.description as string | undefined,
      imageUrl: body.imageUrl as string | null | undefined,
      tags: body.tags as string[] | undefined,
      link: body.link as string | null | undefined,
      github: body.github as string | null | undefined,
      featured: body.featured as boolean | undefined
    }
  });

  return json(project);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return json({ message: 'Deleted' });
}
