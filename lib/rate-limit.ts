type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();
let lastPrune = Date.now();

function maybePrune() {
  const now = Date.now();
  if (now - lastPrune < 60_000) return;
  lastPrune = now;
  for (const [key, entry] of store) {
    if (now >= entry.resetAt) store.delete(key);
  }
}

/**
 * Returns true if the request is allowed, false if the limit is exceeded.
 *
 * @param key    Unique key for this limit bucket, e.g. `"login:1.2.3.4"`
 * @param limit  Max requests allowed in the window
 * @param windowMs  Window duration in milliseconds
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  maybePrune();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}
