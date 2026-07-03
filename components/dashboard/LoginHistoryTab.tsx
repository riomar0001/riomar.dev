'use client';

import type { LoginHistory } from '@/lib/dashboard/types';

export default function LoginHistoryTab({ loginHistory }: { loginHistory: LoginHistory[] }) {
  return (
    <div className="relative z-10 mx-auto max-w-[1160px] px-6 py-14">
      <div className="mb-8">
        <div className="mb-2 font-mono text-xs tracking-widest uppercase opacity-50">/ Security</div>
        <h2 className="text-[18px] font-medium tracking-tight sm:text-[26px]">Login History</h2>
      </div>

      <div className="border border-black/15 dark:border-white/15">
        {loginHistory.length === 0 ? (
          <p className="p-8 text-center font-mono text-xs tracking-wider uppercase opacity-40">No login history yet</p>
        ) : (
          <div className="divide-y divide-black/10 dark:divide-white/10">
            {loginHistory.map((entry) => (
              <div key={entry.id} className="flex items-center gap-4 px-5 py-3.5">
                <span className={`h-[7px] w-[7px] shrink-0 ${entry.success ? 'bg-black dark:bg-white' : 'bg-red-500'}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className={`tracking-wider uppercase ${entry.success ? 'opacity-90' : 'text-red-500'}`}>
                      {entry.success ? 'Success' : 'Failed'}
                    </span>
                    {entry.reason && <span className="opacity-40">· {entry.reason}</span>}
                  </div>
                  <p className="truncate font-mono text-[11px] opacity-50">{entry.ipAddress} · {entry.userAgent?.slice(0, 60)}…</p>
                </div>
                <time className="shrink-0 font-mono text-[11px] opacity-40">
                  {new Date(entry.createdAt).toLocaleString()}
                </time>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
