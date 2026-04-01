import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { str, strOpt, urlOpt, strArray } from '@/lib/validate';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });
  return json(projects);
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

  const title       = str(body.title, 200);
  const description = str(body.description, 2000);
  if (!title || !description) return error('Title and description are required');

  const imageUrl = urlOpt(body.imageUrl);
  const link     = urlOpt(body.link);
  const github   = strOpt(body.github, 500);  // can be URL or "user/repo" path
  const tags     = strArray(body.tags, 20, 50) ?? [];
  const featured = typeof body.featured === 'boolean' ? body.featured : false;

  const maxOrder = await prisma.project.aggregate({ _max: { order: true } });
  const order = (maxOrder._max.order ?? -1) + 1;

  const project = await prisma.project.create({
    data: { title, description, imageUrl: imageUrl ?? null, tags, link: link ?? null, github: github ?? null, featured, order }
  });

  return json(project, 201);
}
