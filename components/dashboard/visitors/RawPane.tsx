'use client';

import { useCopyToClipboard } from '@/lib/dashboard/hooks';
import { panelCls } from '@/components/dashboard/ui';

/** One side of the raw HTTP exchange (request or response) with a copy button. */
export function RawPane({ label, body }: { label: string; body?: string | null }) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className={panelCls}>
      <div className="flex items-center justify-between border-b border-black/15 px-3 py-2 dark:border-white/15">
        <span className="font-mono text-[11px] tracking-widest uppercase opacity-60">{label}</span>
        {body && (
          <button
            onClick={() => copy(body)}
            className="border border-black/20 px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase transition-colors hover:bg-black hover:text-white dark:border-white/20 dark:hover:bg-white dark:hover:text-black"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>
      {body ? (
        <pre className="max-h-[40vh] overflow-auto px-3 py-2.5 font-mono text-[11px] leading-relaxed break-all whitespace-pre-wrap opacity-80">
          {body}
        </pre>
      ) : (
        <p className="px-3 py-4 font-mono text-[11px] opacity-40">
          Not captured — this visit predates raw HTTP logging.
        </p>
      )}
    </div>
  );
}
