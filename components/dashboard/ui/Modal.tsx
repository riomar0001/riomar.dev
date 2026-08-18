'use client';

import { useCallback } from 'react';
import { useEscapeKey } from '@/lib/dashboard/hooks';

export function Modal({
  title,
  onClose,
  saving,
  maxWidthCls = 'max-w-lg',
  children
}: {
  title: string;
  onClose: () => void;
  saving?: boolean;
  /** Width cap for the panel — widen it for content that needs the room (e.g. raw HTTP dumps) */
  maxWidthCls?: string;
  children: React.ReactNode;
}) {
  // An in-flight save must not be abandoned mid-request
  const close = useCallback(() => { if (!saving) onClose(); }, [onClose, saving]);
  useEscapeKey(close);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      <div className={`animate-fade-in-up relative z-10 max-h-[90vh] w-full ${maxWidthCls} overflow-y-auto border border-black/20 bg-white shadow-2xl dark:border-white/20 dark:bg-black`}>
        <div className="flex items-center justify-between border-b border-black/15 px-6 py-4 dark:border-white/15">
          <h3 className="font-mono text-xs tracking-widest uppercase opacity-80">{title}</h3>
          <button
            onClick={onClose}
            disabled={saving}
            className="border border-black/20 p-1 transition-colors hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-30 dark:border-white/20 dark:hover:bg-white dark:hover:text-black"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
