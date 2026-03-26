import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
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

  const { title, description, imageUrl, tags, link, github, featured } = body;
  if (!title || !description) return error('Title and description are required');

  const maxOrder = await prisma.project.aggregate({ _max: { order: true } });
  const order = (maxOrder._max.order ?? -1) + 1;

  const project = await prisma.project.create({
    data: {
      title: title as string,
      description: description as string,
      imageUrl: imageUrl as string | undefined,
      tags: (tags as string[]) ?? [],
      link: link as string | undefined,
      github: github as string | undefined,
      featured: (featured as boolean) ?? false,
      order
    }
  });

  return json(project, 201);
}
