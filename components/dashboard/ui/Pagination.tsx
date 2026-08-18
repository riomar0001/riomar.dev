import { btnSmallCls } from './styles';

/**
 * Page numbers to render: always the first and last page plus a window of two
 * either side of the current one, with '…' standing in for each skipped run.
 */
function pageItems(page: number, totalPages: number): (number | '…')[] {
  const range = new Set<number>([1, totalPages]);
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) range.add(i);

  const sorted = [...range].sort((a, b) => a - b);
  const items: (number | '…')[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) items.push('…');
    items.push(sorted[i]);
  }
  return items;
}

export function PaginationBar({
  page,
  total,
  limit,
  loading,
  onPage
}: {
  page: number;
  total: number;
  limit: number;
  loading: boolean;
  onPage: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between gap-4 border-t border-black/15 px-5 py-3 dark:border-white/15">
      <span className="font-mono text-[11px] opacity-40">
        {from}–{to} of {total.toLocaleString()}
      </span>
      <div className="flex items-center gap-1.5">
        <button onClick={() => onPage(page - 1)} disabled={page === 1 || loading} className={btnSmallCls}>← Prev</button>
        {pageItems(page, totalPages).map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className="px-1 font-mono text-[11px] opacity-40">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              disabled={loading}
              className={`min-w-[28px] border px-2 py-1 font-mono text-[11px] transition-colors disabled:pointer-events-none ${
                p === page
                  ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                  : 'border-black/20 hover:bg-black hover:text-white dark:border-white/20 dark:hover:bg-white dark:hover:text-black'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button onClick={() => onPage(page + 1)} disabled={page === totalPages || loading} className={btnSmallCls}>Next →</button>
      </div>
    </div>
  );
}
