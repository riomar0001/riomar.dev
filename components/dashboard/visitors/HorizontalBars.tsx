import type { BarDatum } from '@/lib/dashboard/types';

export function HorizontalBars({ data }: { data: BarDatum[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-20 shrink-0 truncate text-right font-mono text-[11px] uppercase opacity-60">
            {d.label}
          </span>
          <div className="flex-1 border border-black/15 dark:border-white/15">
            <div
              className="h-2.5 bg-black opacity-80 transition-all duration-500 dark:bg-white"
              style={{ width: `${Math.max((d.count / max) * 100, d.count > 0 ? 2 : 0)}%` }}
            />
          </div>
          <span className="w-8 shrink-0 text-right font-mono text-[11px] tabular-nums opacity-60">
            {d.count}
          </span>
        </div>
      ))}
    </div>
  );
}
