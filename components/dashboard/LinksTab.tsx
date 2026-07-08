'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/dashboard/api';
import { btnGhostCls, btnPrimaryCls, ConfirmDialog, Field, inputCls, ItemActions, Spinner } from '@/components/dashboard/ui';
import type { TrackingLink } from '@/lib/dashboard/types';

const SLUG_RE = /^[a-z0-9][a-z0-9_.-]{0,49}$/;

// Live-normalize free text into a valid tracking slug as the user types
function slugify(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_.-]/g, '').slice(0, 50);
}

function linkUrl(link: Pick<TrackingLink, 'source' | 'sourceDetail'>): string {
  const origin = typeof window === 'undefined' ? '' : window.location.origin;
  const params = new URLSearchParams({ from: link.source });
  if (link.sourceDetail) params.set('application-from', link.sourceDetail);
  return `${origin}/clicked?${params.toString()}`;
}

const emptyForm = { label: '', source: '', sourceDetail: '' };

export default function LinksTab({ showToast }: { showToast: (msg: string, type?: 'success' | 'error') => void }) {
  const [links, setLinks] = useState<TrackingLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<TrackingLink | null>(null);

  const fetchLinks = useCallback(async () => {
    try {
      const res = await apiFetch('/api/links');
      const json = await res.json();
      if (Array.isArray(json)) setLinks(json);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSave() {
    if (!form.label.trim()) { showToast('Label is required', 'error'); return; }
    if (!SLUG_RE.test(form.source)) { showToast('Source is required (lowercase slug)', 'error'); return; }

    setSaving(true);
    try {
      const payload = {
        label: form.label.trim(),
        source: form.source,
        sourceDetail: form.sourceDetail || null
      };
      const res = editingId
        ? await apiFetch(`/api/links/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
        : await apiFetch('/api/links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
      const json = await res.json();
      if (!res.ok) { showToast(json.error ?? 'Save failed', 'error'); return; }
      resetForm();
      await fetchLinks();
      showToast(editingId ? 'Link updated' : 'Link created');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(link: TrackingLink) {
    const res = await apiFetch(`/api/links/${link.id}`, { method: 'DELETE' });
    if (res.ok) {
      if (editingId === link.id) resetForm();
      await fetchLinks();
      showToast('Link deleted');
    } else {
      showToast('Delete failed', 'error');
    }
    setConfirmDelete(null);
  }

  async function copyLink(link: TrackingLink) {
    try {
      await navigator.clipboard.writeText(linkUrl(link));
      setCopiedId(link.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      showToast('Copy failed', 'error');
    }
  }

  function startEdit(link: TrackingLink) {
    setEditingId(link.id);
    setForm({ label: link.label, source: link.source, sourceDetail: link.sourceDetail ?? '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);

  return (
    <div className="relative z-10 mx-auto max-w-[1160px] space-y-8 px-6 py-14">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="mb-2 font-mono text-xs tracking-widest uppercase opacity-50">/ Tracking</div>
          <h2 className="text-[18px] font-medium tracking-tight sm:text-[26px]">Shareable Links</h2>
        </div>
        {!loading && links.length > 0 && (
          <span className="font-mono text-[11px] uppercase tracking-wider opacity-50">
            {links.length} link{links.length === 1 ? '' : 's'} · {totalClicks.toLocaleString()} clicks
          </span>
        )}
      </div>

      {/* Create / edit form */}
      <div className="border border-black/15 p-5 dark:border-white/15">
        <p className="mb-4 font-mono text-[11px] tracking-widest uppercase opacity-50">
          {editingId ? 'Edit Link' : 'New Link'}
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Label">
            <input
              className={inputCls}
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="Resume — PDF footer"
              maxLength={100}
            />
          </Field>
          <Field label="Source (?from=)">
            <input
              className={inputCls}
              value={form.source}
              onChange={(e) => setForm((f) => ({ ...f, source: slugify(e.target.value) }))}
              placeholder="resume"
            />
          </Field>
          <Field label="Detail (?application-from=) — optional">
            <input
              className={inputCls}
              value={form.sourceDetail}
              onChange={(e) => setForm((f) => ({ ...f, sourceDetail: slugify(e.target.value) }))}
              placeholder="jobstreet"
            />
          </Field>
        </div>

        {/* Live URL preview */}
        {form.source && (
          <p className="mt-3 break-all font-mono text-[11px] opacity-50">
            {linkUrl({ source: form.source, sourceDetail: form.sourceDetail || null })}
          </p>
        )}

        <div className="mt-4 flex justify-end gap-3">
          {editingId && (
            <button type="button" onClick={resetForm} disabled={saving} className={btnGhostCls}>
              Cancel
            </button>
          )}
          <button type="button" onClick={handleSave} disabled={saving} className={btnPrimaryCls}>
            {saving && <Spinner />}
            {saving ? 'Saving…' : editingId ? 'Update Link' : 'Create Link'}
          </button>
        </div>
      </div>

      {/* Link list */}
      <div className="border border-black/15 dark:border-white/15">
        {loading ? (
          <div className="flex flex-col items-center gap-2.5 py-16 font-mono text-xs tracking-wider uppercase opacity-50">
            <span className="inline-block h-[7px] w-[7px] animate-blink bg-black dark:bg-white" />
            Loading links
          </div>
        ) : links.length === 0 ? (
          <p className="p-8 text-center font-mono text-xs tracking-wider uppercase opacity-40">
            No links yet — create one above to start tracking where visitors come from
          </p>
        ) : (
          <div className="divide-y divide-black/10 dark:divide-white/10">
            {links.map((link) => (
              <div key={link.id} className="flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4">
                {/* Clicks */}
                <div className="flex w-16 shrink-0 flex-col items-center border border-black/15 py-1.5 dark:border-white/15">
                  <span className="text-lg font-bold tabular-nums leading-tight">{link.clicks.toLocaleString()}</span>
                  <span className="font-mono text-[9px] tracking-widest uppercase opacity-40">clicks</span>
                </div>

                {/* Label + URL */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="text-sm font-medium opacity-90">{link.label}</span>
                    <span className="border border-black/25 px-1.5 py-px font-mono text-[10px] tracking-wider uppercase opacity-70 dark:border-white/25">
                      {link.source}
                      {link.sourceDetail ? ` / ${link.sourceDetail}` : ''}
                    </span>
                  </div>
                  <p className="mt-0.5 break-all font-mono text-[11px] opacity-50">{linkUrl(link)}</p>
                  <p className="mt-0.5 font-mono text-[11px] opacity-40">
                    Created {new Date(link.createdAt).toLocaleDateString()}
                    {link.lastClickAt && ` · Last click ${new Date(link.lastClickAt).toLocaleString()}`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => copyLink(link)}
                    className="border border-black/20 px-2.5 py-1.5 font-mono text-[11px] tracking-wider uppercase transition-colors hover:bg-black hover:text-white dark:border-white/20 dark:hover:bg-white dark:hover:text-black"
                    title="Copy URL"
                  >
                    {copiedId === link.id ? 'Copied ✓' : 'Copy'}
                  </button>
                  <ItemActions onEdit={() => startEdit(link)} onDelete={() => setConfirmDelete(link)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm delete */}
      {confirmDelete && (
        <ConfirmDialog
          message={`Are you sure you want to delete the link "${confirmDelete.label}"? Existing visitor logs keep their source data; only the shareable link entry is removed.`}
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
