import type { LoginHistory } from '@/lib/dashboard/types';

const UA_PREVIEW_CHARS = 60;

export function LoginHistoryRow({ entry }: { entry: LoginHistory }) {
  return (
    <div className="flex items-center gap-4 px-5 py-3.5">
      <span className={`h-[7px] w-[7px] shrink-0 ${entry.success ? 'bg-black dark:bg-white' : 'bg-red-500'}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className={`tracking-wider uppercase ${entry.success ? 'opacity-90' : 'text-red-500'}`}>
            {entry.success ? 'Success' : 'Failed'}
          </span>
          {entry.reason && <span className="opacity-40">· {entry.reason}</span>}
        </div>
        <p className="truncate font-mono text-[11px] opacity-50">
          {entry.ipAddress} · {entry.userAgent?.slice(0, UA_PREVIEW_CHARS)}…
        </p>
      </div>
      <time className="shrink-0 font-mono text-[11px] opacity-40">
        {new Date(entry.createdAt).toLocaleString()}
      </time>
    </div>
  );
}
