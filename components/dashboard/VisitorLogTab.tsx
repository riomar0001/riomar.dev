'use client';

import { useState } from 'react';
import { TabHeader, TabShell } from '@/components/dashboard/ui';
import { useVisitorLog } from '@/lib/dashboard/hooks';
import type { VisitorLog, VisitorStats } from '@/lib/dashboard/types';
import { RawHttpDialog } from '@/components/dashboard/visitors/RawHttpDialog';
import { VisitorFilterBar } from '@/components/dashboard/visitors/VisitorFilterBar';
import { VisitorList } from '@/components/dashboard/visitors/VisitorList';
import { VisitorStatsPanel } from '@/components/dashboard/visitors/VisitorStatsPanel';

export default function VisitorLogTab({ stats }: { stats: VisitorStats | null }) {
  const { visitors, total, page, limit, loading, filters, setFilters, resetFilters, activeCount, goToPage } =
    useVisitorLog();
  const [selected, setSelected] = useState<VisitorLog | null>(null);

  return (
    <TabShell>
      <TabHeader
        eyebrow="Analytics"
        title="Visitor Statistics"
        aside={stats ? `${stats.summary.total.toLocaleString()} total` : undefined}
      />

      <VisitorStatsPanel stats={stats} />

      <div>
        <div className="mb-4 flex items-center justify-between gap-4 border-t border-black/15 pt-8 dark:border-white/15">
          <h3 className="font-mono text-xs tracking-widest uppercase opacity-60">Recent Visitors</h3>
          {!loading && (
            <span className="font-mono text-[11px] tracking-wider uppercase opacity-50">
              {total.toLocaleString()} {activeCount > 0 ? 'matching' : 'total'}
            </span>
          )}
        </div>

        <div className="mb-4">
          <VisitorFilterBar
            filters={filters}
            onChange={setFilters}
            onClear={resetFilters}
            stats={stats}
            activeCount={activeCount}
          />
        </div>

        <VisitorList
          visitors={visitors}
          loading={loading}
          filtered={activeCount > 0}
          page={page}
          total={total}
          limit={limit}
          onPage={goToPage}
          onViewRaw={setSelected}
        />
      </div>

      {selected && <RawHttpDialog visitor={selected} onClose={() => setSelected(null)} />}
    </TabShell>
  );
}
