import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { str, strOpt, urlOpt, strArray } from '@/lib/validate';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const experiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } });
  return json(experiences);
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

  const role    = str(body.role, 100);
  const company = str(body.company, 100);
  const period  = str(body.period, 100);
  if (!role || !company || !period) return error('Role, company, and period are required');

  const location    = strOpt(body.location, 200) ?? '';
  const description = strArray(body.description, 20, 1000) ?? [];
  const tags        = strArray(body.tags, 20, 50) ?? [];
  const link        = urlOpt(body.link) ?? null;

  const maxOrder = await prisma.experience.aggregate({ _max: { order: true } });
  const order = (maxOrder._max.order ?? -1) + 1;

  const experience = await prisma.experience.create({
    data: { role, company, location, period, description, tags, link, order }
  });

  return json(experience, 201);
}
