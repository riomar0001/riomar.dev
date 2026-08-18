export function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[11px] tracking-wider uppercase opacity-60">{label}</label>
      {children}
      {error && <p className="mt-1.5 font-mono text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
