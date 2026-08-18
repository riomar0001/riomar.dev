import { NextRequest, NextResponse, after } from 'next/server';
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

// Next's runtime never exposes the protocol version it negotiated (the edge in
// front of us may well have spoken HTTP/2), so the reconstructed message uses
// 1.1 as a nominal version. Everything else in the capture is verbatim.
const HTTP_VERSION = 'HTTP/1.1';

// Headers that can carry a visitor's own credentials — never persisted.
const REDACTED_HEADERS = new Set(['cookie', 'set-cookie', 'authorization', 'proxy-authorization', 'x-api-key']);

const MAX_RAW_BODY = 2_000;
const MAX_RAW_MESSAGE = 8_000;

function renderHeaders(headers: Headers | Record<string, string>): string {
  const entries = headers instanceof Headers ? [...headers.entries()] : Object.entries(headers);
  return entries
    .map(([name, value]) => `${name}: ${REDACTED_HEADERS.has(name.toLowerCase()) ? '[redacted]' : value}`)
    .sort()
    .join('\n');
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}\n… [truncated, ${text.length} bytes total]` : text;
}

/** Reconstruct the wire form of an HTTP message: start line, headers, blank line, body. */
function rawMessage(startLine: string, headers: Headers | Record<string, string>, body: string): string {
  const head = `${startLine}\n${renderHeaders(headers)}`;
  return truncate(body ? `${head}\n\n${truncate(body, MAX_RAW_BODY)}` : head, MAX_RAW_MESSAGE);
}

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

  // Read the body as text first so the raw capture keeps it byte-for-byte;
  // parsing happens off the same string.
  const rawBody = await request.text().catch(() => '');

  let page = '/';
  let source: string | null = null;
  let sourceDetail: string | null = null;
  let referrer: string | null = null;
  try {
    const body = JSON.parse(rawBody);
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

  const rawRequest = rawMessage(
    `${request.method} ${request.nextUrl.pathname}${request.nextUrl.search} ${HTTP_VERSION}`,
    request.headers,
    rawBody
  );

  // Build the response by hand so the capture matches what this handler emits
  // (the platform still appends its own date/content-length/etc. on the wire)
  const responseBody = JSON.stringify({ ok: true });
  const responseHeaders = { 'content-type': 'application/json' };
  const rawResponse = rawMessage(`${HTTP_VERSION} 200 OK`, responseHeaders, responseBody);

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
        userAgent,
        rawRequest,
        rawResponse
      }
    });
  });

  return new NextResponse(responseBody, { status: 200, headers: responseHeaders });
}

/** Parse a YYYY-MM-DD filter value into a Date, or null if absent/malformed. */
function parseDay(value: string | null): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));
  const skip = (page - 1) * limit;

  const q = searchParams.get('q')?.trim().slice(0, 200);
  const source = searchParams.get('source');
  const country = searchParams.get('country');
  const path = searchParams.get('path');
  const from = parseDay(searchParams.get('from'));
  const to = parseDay(searchParams.get('to'));

  const where: NonNullable<Parameters<typeof prisma.visitorLog.findMany>[0]>['where'] = {};

  if (q) {
    const contains = { contains: q, mode: 'insensitive' } as const;
    where.OR = [
      { ipAddress: contains },
      { country: contains },
      { countryCode: contains },
      { region: contains },
      { city: contains },
      { isp: contains },
      { page: contains },
      { source: contains },
      { sourceDetail: contains },
      { referrer: contains },
      { userAgent: contains }
    ];
  }

  // "(none)" targets rows where the attribution was never resolved
  if (source) where.source = source === '(none)' ? null : source;
  if (country) where.countryCode = country === '(none)' ? null : country;
  if (path) where.page = path;

  if (from || to) {
    // `to` is an inclusive day — advance to the start of the next one
    const toExclusive = to ? new Date(to.getTime() + 24 * 60 * 60 * 1000) : undefined;
    where.createdAt = { ...(from ? { gte: from } : {}), ...(toExclusive ? { lt: toExclusive } : {}) };
  }

  const [data, total] = await Promise.all([
    prisma.visitorLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.visitorLog.count({ where })
  ]);

  return json({ data, total, page, limit });
}
