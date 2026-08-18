'use client';

import { ItemActions, badgeCls, btnSmallCls } from '@/components/dashboard/ui';
import { useCopyToClipboard } from '@/lib/dashboard/hooks';
import { linkUrl } from '@/lib/dashboard/links';
import type { ShowToast, TrackingLink } from '@/lib/dashboard/types';

export function LinkRow({
  link,
  onEdit,
  onDelete,
  showToast
}: {
  link: TrackingLink;
  onEdit: () => void;
  onDelete: () => void;
  showToast: ShowToast;
}) {
  const { copied, copy } = useCopyToClipboard();
  const url = linkUrl(link);

  async function handleCopy() {
    if (!(await copy(url))) showToast('Copy failed', 'error');
  }

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4">
      {/* Clicks */}
      <div className="flex w-16 shrink-0 flex-col items-center border border-black/15 py-1.5 dark:border-white/15">
        <span className="text-lg font-bold tabular-nums leading-tight">{link.clicks.toLocaleString()}</span>
        <span className="font-mono text-[9px] tracking-widest uppercase opacity-40">clicks</span>
      </div>

      {/* Label + URL */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-sm font-medium opacity-90">{link.label}</span>
          <span className={badgeCls}>
            {link.source}
            {link.sourceDetail ? ` / ${link.sourceDetail}` : ''}
          </span>
        </div>
        <p className="mt-0.5 break-all font-mono text-[11px] opacity-50">{url}</p>
        <p className="mt-0.5 font-mono text-[11px] opacity-40">
          Created {new Date(link.createdAt).toLocaleDateString()}
          {link.lastClickAt && ` · Last click ${new Date(link.lastClickAt).toLocaleString()}`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1.5">
        <button onClick={handleCopy} className={`${btnSmallCls} py-1.5`} title="Copy URL">
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
        <ItemActions onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}
