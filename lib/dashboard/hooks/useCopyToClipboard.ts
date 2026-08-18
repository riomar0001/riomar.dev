'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Copy helper with a short-lived `copied` flag for "Copied ✓" affordances.
 * Resolves false when the clipboard is unavailable (insecure origin / denied).
 */
export function useCopyToClipboard(resetMs = 1500) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (timer.current) clearTimeout(timer.current);
      setCopied(true);
      timer.current = setTimeout(() => setCopied(false), resetMs);
      return true;
    } catch {
      return false;
    }
  }, [resetMs]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return { copied, copy };
}
