import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
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

  const { role, company, location, period, description, tags, link } = body;
  if (!role || !company || !period) return error('Role, company, and period are required');

  const maxOrder = await prisma.experience.aggregate({ _max: { order: true } });
  const order = (maxOrder._max.order ?? -1) + 1;

  const experience = await prisma.experience.create({
    data: {
      role: role as string,
      company: company as string,
      location: (location as string) ?? '',
      period: period as string,
      description: (description as string[]) ?? [],
      tags: (tags as string[]) ?? [],
      link: link as string | undefined,
      order
    }
  });

  return json(experience, 201);
}
