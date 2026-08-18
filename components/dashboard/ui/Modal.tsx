'use client';

import { useCallback, useEffect } from 'react';
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

  // The page behind the dialog must not scroll while it is open
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      {/*
        Column layout so only the body scrolls: a tall form (the project dialog
        with its image picker) used to push the header out of the viewport.
      */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`animate-fade-in-up relative z-10 flex max-h-[90vh] w-full ${maxWidthCls} flex-col border border-black/20 bg-white shadow-2xl dark:border-white/20 dark:bg-black`}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-black/15 px-6 py-4 dark:border-white/15">
          <h3 className="min-w-0 truncate font-mono text-xs tracking-widest uppercase opacity-80">{title}</h3>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={close}
            disabled={saving}
            className="shrink-0 border border-black/20 p-1 transition-colors hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-30 dark:border-white/20 dark:hover:bg-white dark:hover:text-black"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">{children}</div>
      </div>
    </div>
  );
}
