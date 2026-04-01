import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { str } from '@/lib/validate';
import { prisma } from '@/lib/prisma';

const ALLOWED_ICON_TYPES = new Set(['location', 'clock', 'briefcase']);

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

  const title    = str(body.title, 100);
  const value    = str(body.value, 200);
  const iconType = str(body.iconType, 50);

  if (!title || !value || !iconType) return error('All fields are required');
  if (!ALLOWED_ICON_TYPES.has(iconType)) return error('Invalid iconType');

  const maxOrder = await prisma.contactCard.aggregate({ _max: { order: true } });
  const order = (maxOrder._max.order ?? -1) + 1;

  const card = await prisma.contactCard.create({
    data: { title, value, iconType, order }
  });

  return json(card, 201);
}
