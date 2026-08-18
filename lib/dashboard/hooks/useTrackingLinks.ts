'use client';

import { useCallback, useEffect, useState } from 'react';
import { LINK_ENDPOINTS, apiFetch, apiSend } from '@/lib/dashboard/api';
import { EMPTY_LINK_DRAFT, validateLinkDraft } from '@/lib/dashboard/links';
import type { ShowToast, TrackingLink, TrackingLinkDraft } from '@/lib/dashboard/types';

/** CRUD state for the shareable tracking links tab. */
export function useTrackingLinks(showToast: ShowToast) {
  const [links, setLinks] = useState<TrackingLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<TrackingLinkDraft>(EMPTY_LINK_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchLinks = useCallback(async () => {
    try {
      const res = await apiFetch(LINK_ENDPOINTS.collection);
      const json = await res.json();
      if (Array.isArray(json)) setLinks(json);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  const resetDraft = useCallback(() => {
    setDraft(EMPTY_LINK_DRAFT);
    setEditingId(null);
  }, []);

  const startEdit = useCallback((link: TrackingLink) => {
    setEditingId(link.id);
    setDraft({ label: link.label, source: link.source, sourceDetail: link.sourceDetail ?? '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const save = useCallback(async () => {
    const error = validateLinkDraft(draft);
    if (error) { showToast(error, 'error'); return; }

    setSaving(true);
    try {
      const payload = {
        label: draft.label.trim(),
        source: draft.source,
        sourceDetail: draft.sourceDetail || null
      };
      const res = editingId
        ? await apiSend(LINK_ENDPOINTS.item(editingId), 'PUT', payload)
        : await apiSend(LINK_ENDPOINTS.collection, 'POST', payload);
      const json = await res.json();
      if (!res.ok) { showToast(json.error ?? 'Save failed', 'error'); return; }
      resetDraft();
      await fetchLinks();
      showToast(editingId ? 'Link updated' : 'Link created');
    } finally {
      setSaving(false);
    }
  }, [draft, editingId, fetchLinks, resetDraft, showToast]);

  const remove = useCallback(async (link: TrackingLink) => {
    const res = await apiFetch(LINK_ENDPOINTS.item(link.id), { method: 'DELETE' });
    if (res.ok) {
      if (editingId === link.id) resetDraft();
      await fetchLinks();
      showToast('Link deleted');
    } else {
      showToast('Delete failed', 'error');
    }
  }, [editingId, fetchLinks, resetDraft, showToast]);

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);

  return {
    links, loading, totalClicks,
    draft, setDraft, editingId,
    saving, save, remove, startEdit, resetDraft
  };
}
