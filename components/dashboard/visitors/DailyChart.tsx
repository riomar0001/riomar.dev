'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatDayLabel } from '@/lib/dashboard/visitors';
import type { DailyPoint } from '@/lib/dashboard/types';

function ChartTooltip({
  active,
  payload
}: {
  active?: boolean;
  payload?: { payload: DailyPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="border border-black bg-black px-2.5 py-1 font-mono text-[11px] text-white dark:border-white dark:bg-white dark:text-black">
      <span className="font-semibold">{d.count}</span>
      <span className="ml-1.5 opacity-60">{formatDayLabel(d.date)}</span>
    </div>
  );
}

// Square hover marker, to match the site's other square accents
function SquareDot({ cx, cy }: { cx?: number; cy?: number }) {
  if (cx === undefined || cy === undefined) return null;
  return <rect x={cx - 4} y={cy - 4} width={8} height={8} fill="currentColor" />;
}

export function DailyChart({ data }: { data: DailyPoint[] }) {
  const mid = Math.floor(data.length / 2);

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
        <span>{formatDayLabel(data[0]?.date ?? '')}</span>
        <span>{formatDayLabel(data[mid]?.date ?? '')}</span>
        <span>{formatDayLabel(data[data.length - 1]?.date ?? '')}</span>
      </div>
    </div>
  );
}
