import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth, revalidatePublic } from '@/lib/api-helpers';
import { positionOpt, str, strOpt, urlOpt, zoomOpt } from '@/lib/validate';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const achievements = await prisma.achievement.findMany({ orderBy: { order: 'asc' } });
  return json(achievements);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return error('Invalid request body');
  }

  const title       = str(body.title, 100);
  const event       = str(body.event, 200);
  const date        = strOpt(body.date, 50);
  const description = str(body.description, 2000);

  if (!title || !event || !description) return error('Title, event and description are required');

  const imageUrl      = urlOpt(body.imageUrl);
  const imagePosition = positionOpt(body.imagePosition);
  const imageZoom     = zoomOpt(body.imageZoom);
  const link = urlOpt(body.link);

  const maxOrder = await prisma.achievement.aggregate({ _max: { order: true } });
  const order = (maxOrder._max.order ?? -1) + 1;

  const achievement = await prisma.achievement.create({
    data: { title, event, date: date ?? null, description, imageUrl: imageUrl ?? null, imagePosition: imagePosition ?? null, imageZoom: imageZoom ?? null, link: link ?? null, order }
  });

  revalidatePublic();
  return json(achievement, 201);
}
