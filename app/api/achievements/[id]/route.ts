import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth, revalidatePublic } from '@/lib/api-helpers';
import { isUuid, str, strOpt, urlOpt } from '@/lib/validate';
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

  const achievement = await prisma.achievement.update({
    where: { id },
    data: {
      title:       str(body.title, 100)       ?? undefined,
      event:       str(body.event, 200)       ?? undefined,
      date:        strOpt(body.date, 50),
      description: str(body.description, 2000) ?? undefined,
      imageUrl:    urlOpt(body.imageUrl),
      link:        urlOpt(body.link)
    }
  });

  revalidatePublic();
  return json(achievement);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUuid(id)) return error('Invalid ID', 400);

  await prisma.achievement.delete({ where: { id } });
  revalidatePublic();
  return json({ message: 'Deleted' });
}
