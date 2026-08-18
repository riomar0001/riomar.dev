export function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-black/15 p-4 dark:border-white/15">
      <p className="font-mono text-[10px] tracking-widest uppercase opacity-40">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight">{value.toLocaleString()}</p>
    </div>
  );
}
