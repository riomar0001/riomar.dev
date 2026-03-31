'use client';

import { useEffect } from 'react';

export default function VisitorBeacon() {
  useEffect(() => {
    fetch('/api/visitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: window.location.pathname })
    }).catch(() => {});
  }, []);

  return null;
}
