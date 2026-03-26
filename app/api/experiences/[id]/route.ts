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

  const experience = await prisma.experience.update({
    where: { id },
    data: {
      role: body.role as string | undefined,
      company: body.company as string | undefined,
      location: body.location as string | undefined,
      period: body.period as string | undefined,
      description: body.description as string[] | undefined,
      tags: body.tags as string[] | undefined,
      link: body.link as string | null | undefined
    }
  });

  return json(experience);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  await prisma.experience.delete({ where: { id } });
  return json({ message: 'Deleted' });
}
