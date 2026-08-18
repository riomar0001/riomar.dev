import type { DailyPoint, VisitorFilters, VisitorStats } from '@/lib/dashboard/types';

/** Rows per page in the visitor log. */
export const VISITOR_PAGE_SIZE = 20;

/** Days covered by the daily-visits chart. */
export const DAILY_WINDOW = 30;

/** Sentinel understood by GET /api/visitor — matches rows where the column is null. */
export const NONE = '(none)';

export const EMPTY_VISITOR_FILTERS: VisitorFilters = {
  q: '',
  source: '',
  country: '',
  path: '',
  from: '',
  to: ''
};

export function countActiveFilters(filters: VisitorFilters): number {
  return Object.values(filters).filter((v) => v !== '').length;
}

/** Serializes filters + pagination into the query GET /api/visitor expects. */
export function buildVisitorQuery(page: number, filters: VisitorFilters, limit = VISITOR_PAGE_SIZE): string {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const q = filters.q.trim();
  if (q) params.set('q', q);
  if (filters.source) params.set('source', filters.source);
  if (filters.country) params.set('country', filters.country);
  if (filters.path) params.set('path', filters.path);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  return params.toString();
}

function lastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

/** Gap-fills the API's sparse daily counts so the chart has one point per day. */
export function buildDailySeries(daily: VisitorStats['daily'] | undefined, days = DAILY_WINDOW): DailyPoint[] {
  const counts = new Map((daily ?? []).map((d) => [d.date, d.count]));
  return lastNDays(days).map((date) => ({ date, count: counts.get(date) ?? 0 }));
}

/** "2026-08-19" → "Aug 19"; noon UTC keeps the date stable across time zones. */
export function formatDayLabel(iso: string): string {
  if (!iso) return '';
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
