import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
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

  const { name, role, tagline, bio, email, linkedin, github, location, photoUrl, resumeUrl } = body;

  const info = await prisma.personalInfo.upsert({
    where: { id: 'singleton' },
    update: {
      name: name as string,
      role: role as string,
      tagline: tagline as string,
      bio: (bio as string[]) ?? [],
      email: email as string,
      linkedin: linkedin as string,
      github: github as string,
      location: location as string,
      photoUrl: photoUrl as string | null | undefined,
      resumeUrl: resumeUrl as string | null | undefined
    },
    create: {
      id: 'singleton',
      name: name as string,
      role: role as string,
      tagline: tagline as string,
      bio: (bio as string[]) ?? [],
      email: email as string,
      linkedin: linkedin as string,
      github: github as string,
      location: location as string,
      photoUrl: photoUrl as string | undefined,
      resumeUrl: resumeUrl as string | undefined
    }
  });

  return json(info);
}
