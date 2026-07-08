'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

// Dedupe StrictMode double-effects and rapid remounts on the same path
let lastLogged = { path: '', at: 0 };

export default function VisitorBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    // No tracking during local development unless the testing flag is on
    if (LOCAL_HOSTS.has(window.location.hostname) && process.env.NEXT_PUBLIC_TRACK_PRIVATE_IPS !== 'true') return;

    // Admin pages aren't public traffic
    if (pathname.startsWith('/dashboard')) return;

    if (lastLogged.path === pathname && Date.now() - lastLogged.at < 2000) return;
    lastLogged = { path: pathname, at: Date.now() };

    const params = new URLSearchParams(window.location.search);
    const from = params.get('from');
    const applicationFrom = params.get('application-from');
    // Only external referrers are meaningful for source attribution
    let referrer: string | null = null;
    try {
      if (document.referrer && new URL(document.referrer).host !== window.location.host) {
        referrer = document.referrer;
      }
    } catch {
      // malformed referrer — ignore
    }

    fetch('/api/visitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: pathname, from, applicationFrom, referrer })
    }).catch(() => {});

    // Clean the tracking params out of the address bar
    if (from !== null || applicationFrom !== null) {
      params.delete('from');
      params.delete('application-from');
      const query = params.toString();
      window.history.replaceState(null, '', pathname + (query ? `?${query}` : '') + window.location.hash);
    }
  }, [pathname]);

  return null;
}
