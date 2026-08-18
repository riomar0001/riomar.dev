/** Blinking-square placeholder shown while a panel's contents load. */
export function LoadingRow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2.5 py-16 font-mono text-xs tracking-wider uppercase opacity-50">
      <span className="inline-block h-[7px] w-[7px] animate-blink bg-black dark:bg-white" />
      {label}
    </div>
  );
}

/** Centred message for an empty list or a filter that matched nothing. */
export function EmptyState({ message }: { message: string }) {
  return (
    <p className="p-8 text-center font-mono text-xs tracking-wider uppercase opacity-40">{message}</p>
  );
}
