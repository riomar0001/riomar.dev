'use client';

import { useCallback, useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { apiFetch } from '@/lib/dashboard/api';
import type { VisitorLog, VisitorStats } from '@/lib/dashboard/types';

const LIMIT = 20;

function getLast30Days(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function fmtDate(iso: string) {
  if (!iso) return '';
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-black/15 p-4 dark:border-white/15">
      <p className="font-mono text-[10px] tracking-widest uppercase opacity-40">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight">{value.toLocaleString()}</p>
    </div>
  );
}

function ChartTooltip({
  active,
  payload
}: {
  active?: boolean;
  payload?: { payload: { date: string; count: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="border border-black bg-black px-2.5 py-1 font-mono text-[11px] text-white dark:border-white dark:bg-white dark:text-black">
      <span className="font-semibold">{d.count}</span>
      <span className="ml-1.5 opacity-60">{fmtDate(d.date)}</span>
    </div>
  );
}

// Square hover marker, to match the site's other square accents
function SquareDot({ cx, cy }: { cx?: number; cy?: number }) {
  if (cx === undefined || cy === undefined) return null;
  return <rect x={cx - 4} y={cy - 4} width={8} height={8} fill="currentColor" />;
}

function DailyChart({ data }: { data: { date: string; count: number }[] }) {
  return (
    <div>
      {/* currentColor = black in light mode, white in dark — one stroke fits both */}
      <div className="h-32 border-b border-black/15 text-black dark:border-white/15 dark:text-white">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: 'currentColor', strokeOpacity: 0.25, strokeWidth: 1 }}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="currentColor"
              strokeOpacity={0.8}
              strokeWidth={2}
              fill="currentColor"
              fillOpacity={0.08}
              activeDot={<SquareDot />}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex justify-between font-mono text-[11px] opacity-40">
        <span>{fmtDate(data[0]?.date ?? '')}</span>
        <span>{fmtDate(data[14]?.date ?? '')}</span>
        <span>{fmtDate(data[29]?.date ?? '')}</span>
      </div>
    </div>
  );
}

function HorizontalBars({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-20 shrink-0 truncate text-right font-mono text-[11px] uppercase opacity-60">
            {d.label}
          </span>
          <div className="flex-1 border border-black/15 dark:border-white/15">
            <div className="h-2.5 bg-black opacity-80 transition-all duration-500 dark:bg-white" style={{ width: `${Math.max((d.count / max) * 100, d.count > 0 ? 2 : 0)}%` }} />
          </div>
          <span className="w-8 shrink-0 text-right font-mono text-[11px] tabular-nums opacity-60">
            {d.count}
          </span>
        </div>
      ))}
    </div>
  );
}

function PaginationBar({
  page,
  total,
  limit,
  loading,
  onPage
}: {
  page: number;
  total: number;
  limit: number;
  loading: boolean;
  onPage: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages: (number | '…')[] = [];
  const range = new Set<number>();
  range.add(1);
  range.add(totalPages);
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) range.add(i);
  const sorted = [...range].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) pages.push('…');
    pages.push(sorted[i]);
  }

  const btn = 'border border-black/20 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-30 dark:border-white/20 dark:hover:bg-white dark:hover:text-black';

  return (
    <div className="flex items-center justify-between gap-4 border-t border-black/15 px-5 py-3 dark:border-white/15">
      <span className="font-mono text-[11px] opacity-40">
        {from}–{to} of {total.toLocaleString()}
      </span>
      <div className="flex items-center gap-1.5">
        <button onClick={() => onPage(page - 1)} disabled={page === 1 || loading} className={btn}>← Prev</button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className="px-1 font-mono text-[11px] opacity-40">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              disabled={loading}
              className={`min-w-[28px] border px-2 py-1 font-mono text-[11px] transition-colors disabled:pointer-events-none ${
                p === page
                  ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                  : 'border-black/20 hover:bg-black hover:text-white dark:border-white/20 dark:hover:bg-white dark:hover:text-black'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button onClick={() => onPage(page + 1)} disabled={page === totalPages || loading} className={btn}>Next →</button>
      </div>
    </div>
  );
}

function LoadingRow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2.5 py-16 font-mono text-xs tracking-wider uppercase opacity-50">
      <span className="inline-block h-[7px] w-[7px] animate-blink bg-black dark:bg-white" />
      {label}
    </div>
  );
}

export default function VisitorLogTab({ stats }: { stats: VisitorStats | null }) {
  const [visitors, setVisitors] = useState<VisitorLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPage = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/visitor?page=${p}&limit=${LIMIT}`);
      const json = await res.json();
      if (json.data) {
        setVisitors(json.data);
        setTotal(json.total);
        setPage(json.page);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPage(1); }, [fetchPage]);

  const days = getLast30Days();
  const dailyMap = new Map((stats?.daily ?? []).map((d) => [d.date, d.count]));
  const chartData = days.map((date) => ({ date, count: dailyMap.get(date) ?? 0 }));

  return (
    <div className="relative z-10 mx-auto max-w-[1160px] space-y-8 px-6 py-14 bg-white">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="mb-2 font-mono text-xs tracking-widest uppercase opacity-50">/ Analytics</div>
          <h2 className="text-[18px] font-medium tracking-tight sm:text-[26px]">Visitor Statistics</h2>
        </div>
        {stats && <span className="font-mono text-[11px] uppercase tracking-wider opacity-50">{stats.summary.total.toLocaleString()} total</span>}
      </div>

      {stats ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="All-time" value={stats.summary.total} />
            <StatCard label="Today" value={stats.summary.today} />
            <StatCard label="Unique IPs" value={stats.summary.uniqueIps} />
            <StatCard label="Countries" value={stats.summary.countries} />
          </div>

          {/* Daily Chart */}
          <div className="border border-black/15 p-5 dark:border-white/15">
            <p className="mb-4 font-mono text-[11px] tracking-widest uppercase opacity-50">Daily Visits — Last 30 Days</p>
            <DailyChart data={chartData} />
          </div>

          {/* Country + Pages + Sources */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border border-black/15 p-5 dark:border-white/15">
              <p className="mb-4 font-mono text-[11px] tracking-widest uppercase opacity-50">Top Countries</p>
              {stats.topCountries.length > 0 ? (
                <HorizontalBars data={stats.topCountries.map((c) => ({ label: c.countryCode, count: c.count }))} />
              ) : (
                <p className="font-mono text-[11px] opacity-40">No location data yet.</p>
              )}
            </div>
            <div className="border border-black/15 p-5 dark:border-white/15">
              <p className="mb-4 font-mono text-[11px] tracking-widest uppercase opacity-50">Top Pages</p>
              {stats.topPages.length > 0 ? (
                <HorizontalBars data={stats.topPages.map((p) => ({ label: p.page || '/', count: p.count }))} />
              ) : (
                <p className="font-mono text-[11px] opacity-40">No page data yet.</p>
              )}
            </div>
            <div className="border border-black/15 p-5 dark:border-white/15">
              <p className="mb-4 font-mono text-[11px] tracking-widest uppercase opacity-50">Top Sources</p>
              {(stats.topSources ?? []).length > 0 ? (
                <HorizontalBars data={stats.topSources.map((s) => ({ label: s.source, count: s.count }))} />
              ) : (
                <p className="font-mono text-[11px] opacity-40">No source data yet.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center border border-black/15 dark:border-white/15">
          <LoadingRow label="Loading statistics" />
        </div>
      )}

      {/* Paginated Visitor Log */}
      <div>
        <div className="mb-4 flex items-center justify-between gap-4 border-t border-black/15 pt-8 dark:border-white/15">
          <h3 className="font-mono text-xs tracking-widest uppercase opacity-60">Recent Visitors</h3>
          {!loading && total > 0 && (
            <span className="font-mono text-[11px] uppercase tracking-wider opacity-50">{total.toLocaleString()} total</span>
          )}
        </div>

        <div className="border border-black/15 dark:border-white/15">
          {loading ? (
            <LoadingRow label="Loading" />
          ) : visitors.length === 0 ? (
            <p className="p-8 text-center font-mono text-xs tracking-wider uppercase opacity-40">No visitors logged yet</p>
          ) : (
            <>
              <div className="divide-y divide-black/10 dark:divide-white/10">
                {visitors.map((v) => (
                  <div key={v.id} className="flex items-start gap-4 px-5 py-3.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-black/20 font-mono text-[10px] font-semibold dark:border-white/20">
                      {v.countryCode ?? '??'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="text-sm opacity-90">
                          {[v.city, v.region, v.country].filter(Boolean).join(', ') || 'Unknown location'}
                        </span>
                        <span className="opacity-30">·</span>
                        <span className="font-mono text-[11px] opacity-55">{v.ipAddress}</span>
                        <span className="opacity-30">·</span>
                        <span className="font-mono text-[11px] opacity-55">{v.page || '/'}</span>
                        {v.source && (
                          <span className="border border-black/25 px-1.5 py-px font-mono text-[10px] tracking-wider uppercase opacity-70 dark:border-white/25">
                            {v.source}
                            {v.sourceDetail ? ` / ${v.sourceDetail}` : ''}
                          </span>
                        )}
                      </div>
                      {v.isp && <p className="font-mono text-[11px] opacity-40">{v.isp}</p>}
                      {v.userAgent && <p className="truncate font-mono text-[11px] opacity-40">{v.userAgent.slice(0, 80)}</p>}
                    </div>
                    <time className="shrink-0 font-mono text-[11px] opacity-40">
                      {new Date(v.createdAt).toLocaleString()}
                    </time>
                  </div>
                ))}
              </div>
              <PaginationBar page={page} total={total} limit={LIMIT} loading={loading} onPage={(p) => fetchPage(p)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
