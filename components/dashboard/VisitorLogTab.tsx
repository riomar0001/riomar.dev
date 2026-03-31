'use client';

import type { VisitorLog } from '@/lib/dashboard/types';

export default function VisitorLogTab({ visitors }: { visitors: VisitorLog[] }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">Visitor Log</h2>
        <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
        <span className="text-xs text-neutral-500">{visitors.length} recent</span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white dark:border-neutral-800/50 dark:bg-neutral-900/80">
        {visitors.length === 0 ? (
          <p className="p-8 text-center text-sm text-neutral-500">No visitors logged yet.</p>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {visitors.map((v) => (
              <div key={v.id} className="flex items-start gap-4 px-5 py-3">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                  {v.countryCode ?? '??'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      {[v.city, v.region, v.country].filter(Boolean).join(', ') || 'Unknown location'}
                    </span>
                    <span className="text-xs text-neutral-400">·</span>
                    <span className="font-mono text-xs text-neutral-500">{v.ipAddress}</span>
                    {v.page && v.page !== '/' && (
                      <>
                        <span className="text-xs text-neutral-400">·</span>
                        <span className="text-xs text-neutral-500">{v.page}</span>
                      </>
                    )}
                  </div>
                  {v.isp && (
                    <p className="text-xs text-neutral-400">{v.isp}</p>
                  )}
                  {v.userAgent && (
                    <p className="truncate text-xs text-neutral-400">{v.userAgent.slice(0, 80)}</p>
                  )}
                </div>
                <time className="flex-shrink-0 text-xs text-neutral-400">
                  {new Date(v.createdAt).toLocaleString()}
                </time>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
