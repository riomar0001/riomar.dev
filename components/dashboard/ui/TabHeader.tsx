/**
 * Title block at the top of a full-width tab (Logins, Visitors, Links).
 * `eyebrow` is the "/ Analytics"-style kicker; `aside` sits flush right.
 */
export function TabHeader({
  eyebrow,
  title,
  aside
}: {
  eyebrow: string;
  title: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="mb-2 font-mono text-xs tracking-widest uppercase opacity-50">/ {eyebrow}</div>
        <h2 className="text-[18px] font-medium tracking-tight sm:text-[26px]">{title}</h2>
      </div>
      {aside && <span className="font-mono text-[11px] tracking-wider uppercase opacity-50">{aside}</span>}
    </div>
  );
}

/** Outer wrapper giving every tab the same max width and page padding. */
export function TabShell({ children }: { children: React.ReactNode }) {
  return <div className="relative z-10 mx-auto max-w-[1160px] space-y-8 px-6 py-14">{children}</div>;
}
