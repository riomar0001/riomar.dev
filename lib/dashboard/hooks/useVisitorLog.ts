'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { VISITOR_ENDPOINTS, apiFetch } from '@/lib/dashboard/api';
import {
  EMPTY_VISITOR_FILTERS, VISITOR_PAGE_SIZE, buildVisitorQuery, countActiveFilters
} from '@/lib/dashboard/visitors';
import type { VisitorFilters, VisitorLog } from '@/lib/dashboard/types';

const DEBOUNCE_MS = 300;

/** Paginated, filtered visitor log with debounced search. */
export function useVisitorLog() {
  const [visitors, setVisitors] = useState<VisitorLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<VisitorFilters>(EMPTY_VISITOR_FILTERS);
  // Debounced copy of `filters` — what the in-flight request was built from
  const [applied, setApplied] = useState<VisitorFilters>(EMPTY_VISITOR_FILTERS);

  const activeCount = useMemo(() => countActiveFilters(filters), [filters]);

  // Typing in the search box shouldn't fire a request per keystroke
  useEffect(() => {
    const t = setTimeout(() => setApplied(filters), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [filters]);

  const fetchPage = useCallback(async (p: number, f: VisitorFilters) => {
    setLoading(true);
    try {
      const res = await apiFetch(`${VISITOR_ENDPOINTS.logs}?${buildVisitorQuery(p, f)}`);
      const json = await res.json();
      if (json.data) {
        setVisitors(json.data);
        setTotal(json.total);
        setPage(json.page);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Any change to the applied filters restarts from the first page
  useEffect(() => { fetchPage(1, applied); }, [fetchPage, applied]);

  const goToPage = useCallback((p: number) => fetchPage(p, applied), [fetchPage, applied]);
  const resetFilters = useCallback(() => setFilters(EMPTY_VISITOR_FILTERS), []);

  return {
    visitors,
    total,
    page,
    limit: VISITOR_PAGE_SIZE,
    loading,
    filters,
    setFilters,
    resetFilters,
    activeCount,
    goToPage
  };
}
