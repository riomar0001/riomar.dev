'use client';

import { useCallback, useEffect, useState } from 'react';
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
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-neutral-900 dark:text-neutral-50">{value.toLocaleString()}</p>
    </div>
  );
}

function DailyChart({ data }: { data: { date: string; count: number }[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div>
      <div className="flex h-32 items-end gap-px">
        {data.map((d, i) => {
          const pct = (d.count / max) * 100;
          const isHov = hovered === i;
          return (
            <div
              key={i}
              className="relative flex flex-1 flex-col justify-end"
              style={{ height: '100%' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {isHov && (
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1 text-xs text-white shadow-lg dark:bg-neutral-700">
                  <span className="font-semibold">{d.count}</span>
                  <span className="ml-1.5 opacity-60">{fmtDate(d.date)}</span>
                </div>
              )}
              <div
                className="w-full rounded-t-sm"
                style={{
                  height: `${Math.max(pct, d.count > 0 ? 4 : 0.5)}%`,
                  backgroundColor: isHov ? '#10b981' : '#34d399',
                  opacity: hovered !== null && !isHov ? 0.3 : 0.8,
                  transition: 'background-color 0.1s ease, opacity 0.1s ease'
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-xs text-neutral-400">
        <span>{fmtDate(data[0]?.date ?? '')}</span>
        <span>{fmtDate(data[14]?.date ?? '')}</span>
        <span>{fmtDate(data[29]?.date ?? '')}</span>
      </div>
    </div>
  );
}

function HorizontalBars({ data, color = '#10b981' }: { data: { label: string; count: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-20 shrink-0 truncate text-right font-mono text-xs text-neutral-500 dark:text-neutral-400">
            {d.label}
          </span>
          <div className="flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${(d.count / max) * 100}%`, backgroundColor: color }}
            />
          </div>
          <span className="w-8 shrink-0 text-right text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
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

  // Build page number list: always show first, last, current ±2, with ellipsis
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

  return (
    <div className="flex items-center justify-between gap-4 border-t border-neutral-200 px-5 py-3 dark:border-neutral-800">
      <span className="text-xs text-neutral-400">
        {from}–{to} of {total.toLocaleString()}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1 || loading}
          className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
        >
          ← Prev
        </button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className="px-1 text-xs text-neutral-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              disabled={loading}
              className={`min-w-[28px] rounded-lg border px-2 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed ${
                p === page
                  ? 'border-emerald-400 bg-emerald-500 text-white'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages || loading}
          className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
        >
          Next →
        </button>
      </div>
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
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">Visitor Statistics</h2>
        <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
        {stats && <span className="text-xs text-neutral-500">{stats.summary.total.toLocaleString()} total</span>}
      </div>

      {stats ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="All-time" value={stats.summary.total} />
            <StatCard label="Today" value={stats.summary.today} />
            <StatCard label="Unique IPs" value={stats.summary.uniqueIps} />
            <StatCard label="Countries" value={stats.summary.countries} />
          </div>

          {/* Daily Chart */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              Daily Visits — Last 30 Days
            </p>
            <DailyChart data={chartData} />
          </div>

          {/* Country + Pages */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <p className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Top Countries</p>
              {stats.topCountries.length > 0 ? (
                <HorizontalBars data={stats.topCountries.map((c) => ({ label: c.countryCode, count: c.count }))} color="#10b981" />
              ) : (
                <p className="text-xs text-neutral-400">No location data yet.</p>
              )}
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <p className="mb-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Top Pages</p>
              {stats.topPages.length > 0 ? (
                <HorizontalBars data={stats.topPages.map((p) => ({ label: p.page || '/', count: p.count }))} color="#34d399" />
              ) : (
                <p className="text-xs text-neutral-400">No page data yet.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-48 items-center justify-center rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-emerald-500" />
            <p className="text-xs text-neutral-400">Loading statistics…</p>
          </div>
        </div>
      )}

      {/* Paginated Visitor Log */}
      <div>
        <div className="mb-4 flex items-center gap-4">
          <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">Recent Visitors</h3>
          <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
          {!loading && total > 0 && (
            <span className="text-xs text-neutral-500">{total.toLocaleString()} total</span>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800/50 dark:bg-neutral-900/80">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-200 border-t-emerald-500" />
            </div>
          ) : visitors.length === 0 ? (
            <p className="p-8 text-center text-sm text-neutral-500">No visitors logged yet.</p>
          ) : (
            <>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {visitors.map((v) => (
                  <div key={v.id} className="flex items-start gap-4 px-5 py-3">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                      {v.countryCode ?? '??'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                          {[v.city, v.region, v.country].filter(Boolean).join(', ') || 'Unknown location'}
                        </span>
                        <span className="text-xs text-neutral-400">·</span>
                        <span className="font-mono text-xs text-neutral-500">{v.ipAddress}</span>
                        {v.page && v.page !== '/' && (
                          <>
                            <span className="text-xs text-neutral-400">·</span>
                            <span className="text-xs text-neutral-500">{v.page}</span>
                          </>
                        )}
                      </div>
                      {v.isp && <p className="text-xs text-neutral-400">{v.isp}</p>}
                      {v.userAgent && (
                        <p className="truncate text-xs text-neutral-400">{v.userAgent.slice(0, 80)}</p>
                      )}
                    </div>
                    <time className="flex-shrink-0 text-xs text-neutral-400">
                      {new Date(v.createdAt).toLocaleString()}
                    </time>
                  </div>
                ))}
              </div>
              <PaginationBar
                page={page}
                total={total}
                limit={LIMIT}
                loading={loading}
                onPage={(p) => fetchPage(p)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
