/**
 * fetch wrapper that transparently retries once through the refresh endpoint
 * when the access token has expired.
 */
export async function apiFetch(url: string, options?: RequestInit) {
  let res = await fetch(url, options);
  if (res.status === 401) {
    const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
    if (refreshRes.ok) {
      res = await fetch(url, options);
    }
  }
  return res;
}

/** GET + parse JSON, resolving to `fallback` on any network/parse failure. */
export async function fetchJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await apiFetch(url);
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

/** POST/PUT/PATCH/DELETE with a JSON body. */
export function apiSend(url: string, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', body?: unknown) {
  return apiFetch(url, {
    method,
    ...(body === undefined
      ? {}
      : { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  });
}
