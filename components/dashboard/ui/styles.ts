/* ===== Shared control classes (brutalist / mono) ===== */

export const inputCls =
  'w-full border border-black/20 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:opacity-40 focus:border-black dark:border-white/20 dark:focus:border-white';

export const inputErrorCls =
  'w-full border border-red-500 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:opacity-40 focus:border-red-500 dark:border-red-500';

/** Compact variant of inputCls for dense toolbars (filter bars, inline controls). */
export const controlCls =
  'border border-black/20 bg-transparent px-2.5 py-1.5 font-mono text-[11px] outline-none transition-colors placeholder:opacity-40 focus:border-black dark:border-white/20 dark:focus:border-white';

export const btnPrimaryCls =
  'flex items-center justify-center gap-2 border border-black bg-black px-5 py-2.5 font-mono text-xs tracking-wider uppercase text-white transition-colors hover:bg-transparent hover:text-black disabled:pointer-events-none disabled:opacity-50 dark:border-white dark:bg-white dark:text-black dark:hover:bg-transparent dark:hover:text-white';

export const btnGhostCls =
  'flex items-center justify-center gap-2 border border-black/25 px-5 py-2.5 font-mono text-xs tracking-wider uppercase transition-colors hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-40 dark:border-white/25 dark:hover:bg-white dark:hover:text-black';

export const uploadBtnCls =
  'border border-black/25 px-3.5 py-2 font-mono text-xs tracking-wider uppercase transition-colors hover:bg-black hover:text-white dark:border-white/25 dark:hover:bg-white dark:hover:text-black';

/** Small bordered button used for row-level actions (Copy, Raw, pagination). */
export const btnSmallCls =
  'border border-black/20 px-2.5 py-1 font-mono text-[11px] tracking-wider uppercase transition-colors hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-30 dark:border-white/20 dark:hover:bg-white dark:hover:text-black';

/** Inline badge for source / tag chips. */
export const badgeCls =
  'border border-black/25 px-1.5 py-px font-mono text-[10px] tracking-wider uppercase opacity-70 dark:border-white/25';

/** Muted uppercase mono label used above values and panels. */
export const metaLabelCls = 'font-mono text-[11px] tracking-widest uppercase opacity-50';

/** Bordered panel wrapping a chart, list or form group. */
export const panelCls = 'border border-black/15 dark:border-white/15';
