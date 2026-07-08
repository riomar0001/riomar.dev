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
 * Absence semantics like strOpt, with one difference: an explicit `null`
 * means "clear this field" (returns null) rather than "not provided", so
 * removing an uploaded image persists. `undefined` still means unchanged.
 */
export function urlOpt(val: unknown): string | null | undefined {
  if (val === null) return null;
  const s = strOpt(val, 2048);
  if (s === undefined || s === null) return s;
  try {
    const u = new URL(s);
    return u.protocol === 'https:' || u.protocol === 'http:' ? s : null;
  } catch {
    return null;
  }
}

/**
 * Optional image focal point — CSS object-position as "X% Y%" (0–100 each),
 * set by dragging the preview in the dashboard image picker.
 * Absence semantics like urlOpt: explicit `null` clears the field,
 * `undefined`/invalid means unchanged.
 */
export function positionOpt(val: unknown): string | null | undefined {
  if (val === null) return null;
  if (typeof val !== 'string') return undefined;
  const m = val.trim().match(/^(\d{1,3}(?:\.\d+)?)% (\d{1,3}(?:\.\d+)?)%$/);
  if (!m) return undefined;
  const x = parseFloat(m[1]);
  const y = parseFloat(m[2]);
  if (x > 100 || y > 100) return undefined;
  return `${x}% ${y}%`;
}

/**
 * Optional image zoom — 1 (fit) to 3, set by the dashboard zoom slider.
 * Absence semantics like positionOpt: explicit `null` clears the field,
 * `undefined`/invalid means unchanged.
 */
export function zoomOpt(val: unknown): number | null | undefined {
  if (val === null) return null;
  if (typeof val !== 'number' || !Number.isFinite(val)) return undefined;
  if (val < 1 || val > 3) return undefined;
  return Math.round(val * 100) / 100;
}

// Tracking source slugs: "linkedin", "resume", "application", "job-street", …
const SLUG_RE = /^[a-z0-9][a-z0-9_.-]{0,49}$/;

/** Tracking slug — lowercased, trimmed. Returns null if missing/invalid. */
export function slug(val: unknown): string | null {
  if (typeof val !== 'string') return null;
  const s = val.trim().toLowerCase().slice(0, 50);
  return SLUG_RE.test(s) ? s : null;
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
