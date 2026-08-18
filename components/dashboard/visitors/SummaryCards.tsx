import type { VisitorStats } from '@/lib/dashboard/types';
import { StatCard } from './StatCard';

export function SummaryCards({ summary }: { summary: VisitorStats['summary'] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard label="All-time" value={summary.total} />
      <StatCard label="Today" value={summary.today} />
      <StatCard label="Unique IPs" value={summary.uniqueIps} />
      <StatCard label="Countries" value={summary.countries} />
    </div>
  );
}
