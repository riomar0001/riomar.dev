import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { str, urlOpt } from '@/lib/validate';
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

  const title       = str(body.title, 200);
  const issuer      = str(body.issuer, 100);
  const description = str(body.description, 2000);
  if (!title || !issuer || !description) return error('Title, issuer, and description are required');

  const iconUrl   = urlOpt(body.iconUrl)   ?? null;
  const credlyUrl = urlOpt(body.credlyUrl) ?? null;

  const maxOrder = await prisma.certification.aggregate({ _max: { order: true } });
  const order = (maxOrder._max.order ?? -1) + 1;

  const certification = await prisma.certification.create({
    data: { title, issuer, iconUrl, credlyUrl, description, order }
  });

  return json(certification, 201);
}
