'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ShowToast, Toast } from '@/lib/dashboard/types';

const TOAST_MS = 3000;

/** Transient status message shown bottom-right; auto-dismisses after 3s. */
export function useToast(): { toast: Toast | null; showToast: ShowToast } {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback<ShowToast>((msg, type = 'success') => {
    // A second toast replaces the first — restart the clock rather than
    // letting the earlier timer cut the new message short.
    if (timer.current) clearTimeout(timer.current);
    setToast({ msg, type });
    timer.current = setTimeout(() => setToast(null), TOAST_MS);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return { toast, showToast };
}
