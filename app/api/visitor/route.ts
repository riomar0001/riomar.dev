import { NextRequest, after } from 'next/server';
import { getClientIp, isAuthError, json, error, requireAuth } from '@/lib/api-helpers';
import { checkRateLimit } from '@/lib/rate-limit';
import { getIpLocation, isPrivateIp } from '@/lib/geo';
import { slug } from '@/lib/validate';
import { prisma } from '@/lib/prisma';

const REFERRER_SOURCES: [RegExp, string][] = [
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, 'linkedin'],
  [/(^|\.)github\.com$/, 'github'],
  [/(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com)$/, 'search'],
  [/(^|\.)(facebook\.com|fb\.com|instagram\.com)$/, 'facebook'],
  [/(^|\.)(twitter\.com|x\.com|t\.co)$/, 'x']
];

function sourceFromReferrer(referrer: string | null): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    for (const [re, source] of REFERRER_SOURCES) {
      if (re.test(host)) return source;
    }
  } catch {
    // malformed referrer — no derived source
  }
  return null;
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Don't track localhost / private-network visits (local dev, health probes)
  // unless NEXT_PUBLIC_TRACK_PRIVATE_IPS=true (temporary escape hatch for local
  // testing; NEXT_PUBLIC_ so the VisitorBeacon client guard sees the same flag)
  if (isPrivateIp(ip) && process.env.NEXT_PUBLIC_TRACK_PRIVATE_IPS !== 'true') return json({ ok: true });

  // 5 logs per IP per minute — prevents DB flood from automated requests
  if (!checkRateLimit(`visitor:${ip}`, 5, 60 * 1000)) {
    return error('Rate limit exceeded', 429);
  }

  const userAgent = request.headers.get('user-agent') ?? undefined;

  let page = '/';
  let source: string | null = null;
  let sourceDetail: string | null = null;
  let referrer: string | null = null;
  try {
    const body = await request.json();
    if (typeof body.page === 'string') page = body.page.slice(0, 500);
    source = slug(body.from);
    sourceDetail = slug(body.applicationFrom);
    if (typeof body.referrer === 'string' && /^https?:\/\//i.test(body.referrer)) {
      referrer = body.referrer.slice(0, 500);
    }
  } catch {
    // ignore — page defaults to "/"
  }

  // No explicit ?from= — attribute known referrers (linkedin, github, search, …)
  source ??= sourceFromReferrer(referrer);

  // Geo lookup + insert can take seconds; run them after the response is sent
  after(async () => {
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
        source,
        sourceDetail,
        referrer,
        userAgent
      }
    });
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
