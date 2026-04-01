import { NextRequest } from 'next/server';
import { isAuthError, json, requireAuth } from '@/lib/api-helpers';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [total, today, ips, cntries, daily, topCountries, topPages] = await Promise.all([
    prisma.visitorLog.count(),
    prisma.visitorLog.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.visitorLog.findMany({ distinct: ['ipAddress'], select: { ipAddress: true } }).then((r) => r.length),
    prisma.visitorLog
      .findMany({ distinct: ['country'], where: { country: { not: null } }, select: { country: true } })
      .then((r) => r.length),
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
    })
  ]);

  return json({
    summary: { total, today, uniqueIps: ips, countries: cntries },
    daily: daily.map((d) => ({ date: d.date, count: Number(d.count) })),
    topCountries: topCountries.map((c) => ({
      country: c.country!,
      countryCode: c.countryCode ?? '??',
      count: c._count.id
    })),
    topPages: topPages.map((p) => ({ page: p.page, count: p._count.id }))
  });
}
