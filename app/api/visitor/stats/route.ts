import { NextRequest } from 'next/server';
import { isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [summaryRows, daily, topCountries, topPages, topSources] = await Promise.all([
    prisma.$queryRaw<{ total: bigint; today: bigint; unique_ips: bigint; countries: bigint }[]>`
      SELECT
        COUNT(*)                                                    AS total,
        COUNT(*) FILTER (WHERE "createdAt" >= ${todayStart})        AS today,
        COUNT(DISTINCT "ipAddress")                                 AS unique_ips,
        COUNT(DISTINCT "country")                                   AS countries
      FROM visitor_logs
    `,
    prisma.$queryRaw<{ date: string; count: bigint }[]>`
      SELECT
        TO_CHAR(DATE_TRUNC('day', "createdAt"), 'YYYY-MM-DD') AS date,
        COUNT(*) AS count
      FROM visitor_logs
      WHERE "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date ASC
    `,
    prisma.visitorLog.groupBy({
      by: ['country', 'countryCode'],
      where: { country: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 8
    }),
    prisma.visitorLog.groupBy({
      by: ['page'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 8
    }),
    prisma.visitorLog.groupBy({
      by: ['source'],
      where: { source: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 8
    })
  ]);

  const summary = summaryRows[0];

  return json({
    summary: {
      total: Number(summary?.total ?? 0),
      today: Number(summary?.today ?? 0),
      uniqueIps: Number(summary?.unique_ips ?? 0),
      countries: Number(summary?.countries ?? 0)
    },
    daily: daily.map((d) => ({ date: d.date, count: Number(d.count) })),
    topCountries: topCountries.map((c) => ({
      country: c.country!,
      countryCode: c.countryCode ?? '??',
      count: c._count.id
    })),
    topPages: topPages.map((p) => ({ page: p.page, count: p._count.id })),
    topSources: topSources.map((s) => ({ source: s.source!, count: s._count.id }))
  });
}
