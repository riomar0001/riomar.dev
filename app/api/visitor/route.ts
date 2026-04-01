import { NextRequest } from 'next/server';
import { getClientIp, isAuthError, json, error, requireAuth } from '@/lib/api-helpers';
import { checkRateLimit } from '@/lib/rate-limit';
import { getIpLocation } from '@/lib/geo';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // 5 logs per IP per minute — prevents DB flood from automated requests
  if (!checkRateLimit(`visitor:${ip}`, 5, 60 * 1000)) {
    return error('Rate limit exceeded', 429);
  }

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

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.visitorLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.visitorLog.count()
  ]);

  return json({ data, total, page, limit });
}
