'use client';

import { EmptyState, LoadingRow, PaginationBar, panelCls } from '@/components/dashboard/ui';
import type { VisitorLog } from '@/lib/dashboard/types';
import { VisitorRow } from './VisitorRow';

export function VisitorList({
  visitors,
  loading,
  filtered,
  page,
  total,
  limit,
  onPage,
  onViewRaw
}: {
  visitors: VisitorLog[];
  loading: boolean;
  /** Whether any filter is active — changes the empty-state wording. */
  filtered: boolean;
  page: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
  onViewRaw: (visitor: VisitorLog) => void;
}) {
  return (
    <div className={panelCls}>
      {loading ? (
        <LoadingRow label="Loading" />
      ) : visitors.length === 0 ? (
        <EmptyState message={filtered ? 'No visitors match these filters' : 'No visitors logged yet'} />
      ) : (
        <>
          <div className="divide-y divide-black/10 dark:divide-white/10">
            {visitors.map((v) => (
              <VisitorRow key={v.id} visitor={v} onViewRaw={() => onViewRaw(v)} />
            ))}
          </div>
          <PaginationBar page={page} total={total} limit={limit} loading={loading} onPage={onPage} />
        </>
      )}
    </div>
  );
}
