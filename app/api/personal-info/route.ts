import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { str, strOpt, urlOpt, strArray } from '@/lib/validate';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const info = await prisma.personalInfo.findUnique({ where: { id: 'singleton' } });
  if (!info) return error('Personal info not found', 404);
  return json(info);
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return error('Invalid request body');
  }

  const name     = str(body.name, 100);
  const role     = str(body.role, 100);
  const tagline  = str(body.tagline, 200);
  const bio      = strArray(body.bio, 20, 2000);
  const email    = str(body.email, 254);
  const linkedin = strOpt(body.linkedin, 2048);
  const github   = strOpt(body.github, 2048);
  const location = str(body.location, 200);
  const photoUrl  = urlOpt(body.photoUrl);
  const resumeUrl = urlOpt(body.resumeUrl);

  if (!name)    return error('Name is required');
  if (!role)    return error('Role is required');
  if (!tagline) return error('Tagline is required');
  if (!bio)     return error('Bio must be an array of strings');
  if (!email)   return error('Email is required');
  if (!location) return error('Location is required');

  const info = await prisma.personalInfo.upsert({
    where: { id: 'singleton' },
    update: { name, role, tagline, bio, email, linkedin: linkedin ?? undefined, github: github ?? undefined, location, photoUrl: photoUrl ?? null, resumeUrl: resumeUrl ?? null },
    create: { id: 'singleton', name, role, tagline, bio, email, linkedin: linkedin ?? '', github: github ?? '', location, photoUrl: photoUrl ?? null, resumeUrl: resumeUrl ?? null }
  });

  return json(info);
}
