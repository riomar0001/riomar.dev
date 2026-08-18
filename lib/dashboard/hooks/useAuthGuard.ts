'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_ENDPOINTS, apiFetch } from '@/lib/dashboard/api';
import type { DashboardUser } from '@/lib/dashboard/types';

/**
 * Redirects to the login page unless the session is valid. `onAuthenticated`
 * runs once the identity is confirmed — that's where the initial data load goes,
 * so no content request fires for a signed-out visitor.
 */
export function useAuthGuard(onAuthenticated: () => Promise<void>) {
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch(AUTH_ENDPOINTS.me);
        if (!res.ok) { router.push('/dashboard/login'); return; }
        setUser(await res.json());
        await onAuthenticated();
      } finally {
        setAuthChecked(true);
      }
    })();
  }, [router, onAuthenticated]);

  const logout = useCallback(async () => {
    await fetch(AUTH_ENDPOINTS.logout, { method: 'POST' });
    router.push('/dashboard/login');
  }, [router]);

  return { user, authChecked, logout };
}
