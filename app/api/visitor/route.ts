import { NextRequest } from 'next/server';
import { getClientIp, isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { getIpLocation } from '@/lib/geo';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get('user-agent') ?? undefined;

  let page = '/';
  try {
    const body = await request.json();
    if (typeof body.page === 'string') page = body.page.slice(0, 500);
  } catch {
    // ignore — page defaults to "/"
  }

  const location = await getIpLocation(ip);

  await prisma.visitorLog.create({
    data: {
      ipAddress: ip,
      country: location?.country,
      countryCode: location?.countryCode,
      region: location?.region,
      city: location?.city,
      isp: location?.isp,
      page,
      userAgent
    }
  });

  return json({ ok: true });
}

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const logs = await prisma.visitorLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return json(logs);
}
