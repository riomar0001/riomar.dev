'use client';

import { controlCls } from '@/components/dashboard/ui';
import { NONE } from '@/lib/dashboard/visitors';
import type { VisitorFilters, VisitorStats } from '@/lib/dashboard/types';

export function VisitorFilterBar({
  filters,
  onChange,
  onClear,
  stats,
  activeCount
}: {
  filters: VisitorFilters;
  onChange: (next: VisitorFilters) => void;
  onClear: () => void;
  stats: VisitorStats | null;
  activeCount: number;
}) {
  const set = <K extends keyof VisitorFilters>(key: K, value: VisitorFilters[K]) =>
    onChange({ ...filters, [key]: value });

  // Dropdown options come from the stats payload the tab already has —
  // its top-N lists cover effectively every value worth filtering on.
  const sources = stats?.topSources ?? [];
  const countries = stats?.topCountries ?? [];
  const paths = stats?.topPages ?? [];

  return (
    <div className="flex flex-wrap items-center gap-2 border border-black/15 p-3 dark:border-white/15">
      <input
        type="search"
        value={filters.q}
        onChange={(e) => set('q', e.target.value)}
        placeholder="Search IP, city, ISP, page, referrer, UA…"
        className={`${controlCls} min-w-[220px] flex-1`}
      />

      <select value={filters.source} onChange={(e) => set('source', e.target.value)} className={controlCls}>
        <option value="">All sources</option>
        {sources.map((s) => (
          <option key={s.source} value={s.source}>{s.source}</option>
        ))}
        <option value={NONE}>— no source —</option>
      </select>

      <select value={filters.country} onChange={(e) => set('country', e.target.value)} className={controlCls}>
        <option value="">All countries</option>
        {countries.map((c) => (
          <option key={c.countryCode} value={c.countryCode}>{c.countryCode} · {c.country}</option>
        ))}
        <option value={NONE}>— no country —</option>
      </select>

      <select value={filters.path} onChange={(e) => set('path', e.target.value)} className={controlCls}>
        <option value="">All pages</option>
        {paths.map((p) => (
          <option key={p.page} value={p.page}>{p.page || '/'}</option>
        ))}
      </select>

      <label className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase opacity-50">
        From
        <input type="date" value={filters.from} max={filters.to || undefined} onChange={(e) => set('from', e.target.value)} className={controlCls} />
      </label>
      <label className="flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase opacity-50">
        To
        <input type="date" value={filters.to} min={filters.from || undefined} onChange={(e) => set('to', e.target.value)} className={controlCls} />
      </label>

      {activeCount > 0 && (
        <button
          onClick={onClear}
          className="border border-black/20 px-2.5 py-1.5 font-mono text-[11px] tracking-wider uppercase transition-colors hover:bg-black hover:text-white dark:border-white/20 dark:hover:bg-white dark:hover:text-black"
        >
          Clear ({activeCount})
        </button>
      )}
    </div>
  );
}
