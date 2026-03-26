import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const certifications = await prisma.certification.findMany({ orderBy: { order: 'asc' } });
  return json(certifications);
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

  const { title, issuer, iconUrl, credlyUrl, description } = body;
  if (!title || !issuer || !description) return error('Title, issuer, and description are required');

  const maxOrder = await prisma.certification.aggregate({ _max: { order: true } });
  const order = (maxOrder._max.order ?? -1) + 1;

  const certification = await prisma.certification.create({
    data: {
      title: title as string,
      issuer: issuer as string,
      iconUrl: iconUrl as string | undefined,
      credlyUrl: credlyUrl as string | undefined,
      description: description as string,
      order
    }
  });

  return json(certification, 201);
}
