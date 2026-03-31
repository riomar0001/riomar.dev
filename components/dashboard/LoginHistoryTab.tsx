'use client';

import type { LoginHistory } from '@/lib/dashboard/types';

export default function LoginHistoryTab({ loginHistory }: { loginHistory: LoginHistory[] }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">Login History</h2>
        <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white dark:border-neutral-800/50 dark:bg-neutral-900/80">
        {loginHistory.length === 0 ? (
          <p className="p-8 text-center text-sm text-neutral-500">No login history yet.</p>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {loginHistory.map((entry) => (
              <div key={entry.id} className="flex items-center gap-4 px-5 py-3">
                <div className={`h-2 w-2 flex-shrink-0 rounded-full ${entry.success ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${entry.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {entry.success ? 'Success' : 'Failed'}
                    </span>
                    {entry.reason && <span className="text-xs text-neutral-500">· {entry.reason}</span>}
                  </div>
                  <p className="truncate text-xs text-neutral-500">{entry.ipAddress} · {entry.userAgent?.slice(0, 60)}…</p>
                </div>
                <time className="flex-shrink-0 text-xs text-neutral-400">
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
