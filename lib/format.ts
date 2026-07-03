/**
 * Display + parsing helpers for the date-driven fields (achievement date,
 * experience period). Values coming from native pickers are ISO
 * (`YYYY-MM-DD` for a date input, `YYYY-MM` for a month input). Legacy
 * free-text values entered before the pickers existed are passed through
 * unchanged so nothing breaks.
 */

/** Format an achievement date (`YYYY-MM-DD`) as e.g. "Jun 15, 2025". */
export function formatAwardDate(value?: string | null): string {
  if (!value) return '';
  const t = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return t; // legacy free text
  const d = new Date(`${t}T12:00:00`);
  if (isNaN(d.getTime())) return t;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Parse an achievement date into a sortable timestamp. Handles ISO dates
 * (`YYYY-MM-DD`), month values (`YYYY-MM`) and best-effort legacy free-text
 * ("June 2025"). Missing/unparseable values sort last (−Infinity).
 */
export function awardDateValue(value?: string | null): number {
  if (!value) return -Infinity;
  const t = value.trim();
  const iso = /^\d{4}-\d{2}$/.test(t)
    ? `${t}-01T12:00:00`
    : /^\d{4}-\d{2}-\d{2}$/.test(t)
      ? `${t}T12:00:00`
      : t;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? -Infinity : d.getTime();
}

/** Format a month input value (`YYYY-MM`) as e.g. "Jan 2024". */
export function formatMonthYear(value?: string | null): string {
  if (!value) return '';
  const t = value.trim();
  const m = /^(\d{4})-(\d{2})$/.exec(t);
  if (!m) return t; // legacy free text
  const d = new Date(Number(m[1]), Number(m[2]) - 1, 1);
  if (isNaN(d.getTime())) return t;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

/** Best-effort convert a display month ("Jan 2024") back to a month-input value ("2024-01"). */
export function monthToInputValue(value?: string | null): string {
  if (!value) return '';
  const t = value.trim();
  if (/^\d{4}-\d{2}$/.test(t)) return t;
  const d = new Date(t);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** Compose a period string from start/end month values + a "present" flag. */
export function composePeriod(start: string, end: string, present: boolean): string {
  const s = formatMonthYear(start);
  if (!s) return '';
  const e = present ? 'Present' : formatMonthYear(end);
  return e ? `${s} – ${e}` : s;
}

/** Parse an existing period string back into start/end/present for editing. */
export function parsePeriod(period?: string | null): { start: string; end: string; present: boolean } {
  if (!period) return { start: '', end: '', present: false };
  const parts = period.split(/\s*[–—-]\s*/);
  const start = monthToInputValue(parts[0]);
  const rawEnd = (parts[1] ?? '').trim();
  const present = /present|current|now|ongoing/i.test(rawEnd);
  const end = present ? '' : monthToInputValue(rawEnd);
  return { start, end, present };
}
