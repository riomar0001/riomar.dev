'use client';

import { useEscapeKey } from '@/lib/dashboard/hooks';
import { btnGhostCls } from './styles';

export function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  useEscapeKey(onCancel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="animate-fade-in-up relative z-10 w-full max-w-sm border border-black/20 bg-white p-6 shadow-2xl dark:border-white/20 dark:bg-black">
        <div className="mb-4 flex items-center gap-2.5 font-mono text-xs tracking-widest uppercase text-red-500">
          <span className="inline-block h-[7px] w-[7px] animate-blink bg-red-500" />
          Confirm Delete
        </div>
        <p className="mb-6 text-sm leading-relaxed opacity-75">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className={`flex-1 ${btnGhostCls}`}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center border border-red-500 bg-red-500 px-5 py-2.5 font-mono text-xs tracking-wider uppercase text-white transition-colors hover:bg-transparent hover:text-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
