export function AddButton({ onClick, label = 'Add' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="flex shrink-0 items-center gap-1.5 border border-black dark:border-white px-3.5 py-1.5 font-mono text-[11px] tracking-wider uppercase transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
    >
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
      </svg>
      {label}
    </button>
  );
}
