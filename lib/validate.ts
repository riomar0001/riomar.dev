const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(val: unknown): val is string {
  return typeof val === 'string' && UUID_RE.test(val);
}

/** Required string — trimmed, capped. Returns null if missing/empty/wrong type. */
export function str(val: unknown, max = 500): string | null {
  if (typeof val !== 'string') return null;
  const t = val.trim();
  return t ? t.slice(0, max) : null;
}

/**
 * Optional string — trimmed, capped.
 * Returns undefined if the field is absent (undefined/null → treat as "not provided").
 * Returns null if present but empty (caller can use to clear the field).
 */
export function strOpt(val: unknown, max = 500): string | null | undefined {
  if (val === undefined || val === null) return undefined;
  if (typeof val !== 'string') return undefined;
  const t = val.trim();
  return t ? t.slice(0, max) : null;
}

/**
 * Optional URL — validates scheme (http/https only).
 * Same absence/empty semantics as strOpt.
 */
export function urlOpt(val: unknown): string | null | undefined {
  const s = strOpt(val, 2048);
  if (s === undefined || s === null) return s;
  try {
    const u = new URL(s);
    return u.protocol === 'https:' || u.protocol === 'http:' ? s : null;
  } catch {
    return null;
  }
}

/** String array — filters non-strings, trims, caps each item and total count. */
export function strArray(val: unknown, maxItems = 50, maxItemLen = 500): string[] | null {
  if (!Array.isArray(val)) return null;
  return val
    .filter((v): v is string => typeof v === 'string')
    .map((v) => v.trim().slice(0, maxItemLen))
    .filter(Boolean)
    .slice(0, maxItems);
}
