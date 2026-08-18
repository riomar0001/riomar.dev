import { LoadingRow, metaLabelCls, panelCls } from '@/components/dashboard/ui';
import { buildDailySeries } from '@/lib/dashboard/visitors';
import type { VisitorStats } from '@/lib/dashboard/types';
import { BreakdownPanel } from './BreakdownPanel';
import { DailyChart } from './DailyChart';
import { SummaryCards } from './SummaryCards';

/** Everything above the visitor log: summary tiles, daily chart, top-N breakdowns. */
export function VisitorStatsPanel({ stats }: { stats: VisitorStats | null }) {
  if (!stats) {
    return (
      <div className={`flex items-center justify-center ${panelCls}`}>
        <LoadingRow label="Loading statistics" />
      </div>
    );
  }

  return (
    <>
      <SummaryCards summary={stats.summary} />

      <div className={`${panelCls} p-5`}>
        <p className={`mb-4 ${metaLabelCls}`}>Daily Visits — Last 30 Days</p>
        <DailyChart data={buildDailySeries(stats.daily)} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <BreakdownPanel
          title="Top Countries"
          emptyLabel="No location data yet."
          data={stats.topCountries.map((c) => ({ label: c.countryCode, count: c.count }))}
        />
        <BreakdownPanel
          title="Top Pages"
          emptyLabel="No page data yet."
          data={stats.topPages.map((p) => ({ label: p.page || '/', count: p.count }))}
        />
        <BreakdownPanel
          title="Top Sources"
          emptyLabel="No source data yet."
          data={(stats.topSources ?? []).map((s) => ({ label: s.source, count: s.count }))}
        />
      </div>
    </>
  );
}
