import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { str, strArray } from '@/lib/validate';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const groups = await prisma.skillGroup.findMany({
    orderBy: { order: 'asc' },
    include: { items: { orderBy: { order: 'asc' } } }
  });
  return json(groups);
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

  const category = str(body.category, 100);
  if (!category) return error('Category is required');

  const items = strArray(body.items, 50, 100) ?? [];

  const maxOrder = await prisma.skillGroup.aggregate({ _max: { order: true } });
  const order = (maxOrder._max.order ?? -1) + 1;

  const group = await prisma.skillGroup.create({
    data: {
      category,
      order,
      items: { create: items.map((name, i) => ({ name, order: i })) }
    },
    include: { items: { orderBy: { order: 'asc' } } }
  });

  return json(group, 201);
}
