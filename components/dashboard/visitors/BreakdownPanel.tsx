import { metaLabelCls, panelCls } from '@/components/dashboard/ui';
import type { BarDatum } from '@/lib/dashboard/types';
import { HorizontalBars } from './HorizontalBars';

/** One "Top X" card — bars when there's data, a muted note when there isn't. */
export function BreakdownPanel({
  title,
  data,
  emptyLabel
}: {
  title: string;
  data: BarDatum[];
  emptyLabel: string;
}) {
  return (
    <div className={`${panelCls} p-5`}>
      <p className={`mb-4 ${metaLabelCls}`}>{title}</p>
      {data.length > 0 ? (
        <HorizontalBars data={data} />
      ) : (
        <p className="font-mono text-[11px] opacity-40">{emptyLabel}</p>
      )}
    </div>
  );
}
