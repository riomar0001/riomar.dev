import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const cards = await prisma.contactCard.findMany({ orderBy: { order: 'asc' } });
  return json(cards);
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

  const { title, value, iconType } = body;
  if (!title || !value || !iconType) return error('All fields are required');

  const maxOrder = await prisma.contactCard.aggregate({ _max: { order: true } });
  const order = (maxOrder._max.order ?? -1) + 1;

  const card = await prisma.contactCard.create({
    data: {
      title: title as string,
      value: value as string,
      iconType: iconType as string,
      order
    }
  });

  return json(card, 201);
}
