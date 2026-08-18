/** Placeholder shown when no image has been chosen yet. */
export function ImageDropzone({ frameClass, onPick }: { frameClass: string; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={`flex ${frameClass} flex-col items-center justify-center gap-2.5 border border-dashed border-black/25 font-mono text-[11px] tracking-wider uppercase opacity-50 transition-colors hover:opacity-100 dark:border-white/25`}
    >
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
      </svg>
      Click to upload
    </button>
  );
}
