import { NextRequest } from 'next/server';
import { error, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { isUuid, slug, str } from '@/lib/validate';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUuid(id)) return error('Invalid ID', 400);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return error('Invalid request body');
  }

  const label = str(body.label, 100) ?? undefined;

  let source: string | undefined;
  if (body.source !== undefined) {
    const s = slug(body.source);
    if (!s) return error('Source must be a slug (lowercase letters, numbers, "-", "_", ".")');
    source = s;
  }

  // null clears the detail; a non-empty value must be a valid slug
  let sourceDetail: string | null | undefined;
  if (body.sourceDetail !== undefined) {
    sourceDetail = body.sourceDetail ? slug(body.sourceDetail) : null;
    if (body.sourceDetail && !sourceDetail) {
      return error('Detail must be a slug (lowercase letters, numbers, "-", "_", ".")');
    }
  }

  const existing = await prisma.trackingLink.findUnique({ where: { id } });
  if (!existing) return error('Link not found', 404);

  const nextSource = source ?? existing.source;
  const nextDetail = sourceDetail === undefined ? existing.sourceDetail : sourceDetail;
  const duplicate = await prisma.trackingLink.findFirst({
    where: { source: nextSource, sourceDetail: nextDetail, NOT: { id } }
  });
  if (duplicate) return error('A link with this source/detail already exists');

  const link = await prisma.trackingLink.update({
    where: { id },
    data: { label, source, sourceDetail }
  });

  return json(link);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUuid(id)) return error('Invalid ID', 400);

  await prisma.trackingLink.delete({ where: { id } });
  return json({ message: 'Deleted' });
}
