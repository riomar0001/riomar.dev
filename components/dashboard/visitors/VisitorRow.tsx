import { badgeCls } from '@/components/dashboard/ui';
import type { VisitorLog } from '@/lib/dashboard/types';

const UA_PREVIEW_CHARS = 80;

export function VisitorRow({ visitor, onViewRaw }: { visitor: VisitorLog; onViewRaw: () => void }) {
  const location = [visitor.city, visitor.region, visitor.country].filter(Boolean).join(', ');

  return (
    <div className="group flex items-start gap-4 px-5 py-3.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-black/20 font-mono text-[10px] font-semibold dark:border-white/20">
        {visitor.countryCode ?? '??'}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-sm opacity-90">{location || 'Unknown location'}</span>
          <span className="opacity-30">·</span>
          <span className="font-mono text-[11px] opacity-55">{visitor.ipAddress}</span>
          <span className="opacity-30">·</span>
          <span className="font-mono text-[11px] opacity-55">{visitor.page || '/'}</span>
          {visitor.source && (
            <span className={badgeCls}>
              {visitor.source}
              {visitor.sourceDetail ? ` / ${visitor.sourceDetail}` : ''}
            </span>
          )}
        </div>
        {visitor.isp && <p className="font-mono text-[11px] opacity-40">{visitor.isp}</p>}
        {visitor.userAgent && (
          <p className="truncate font-mono text-[11px] opacity-40">{visitor.userAgent.slice(0, UA_PREVIEW_CHARS)}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          onClick={onViewRaw}
          title="View raw HTTP request & response"
          className="border border-black/20 px-2 py-1 font-mono text-[10px] tracking-wider uppercase opacity-40 transition-all hover:bg-black hover:text-white group-hover:opacity-100 dark:border-white/20 dark:hover:bg-white dark:hover:text-black"
        >
          Raw
        </button>
        <time className="font-mono text-[11px] opacity-40">{new Date(visitor.createdAt).toLocaleString()}</time>
      </div>
    </div>
  );
}
