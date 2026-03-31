'use client';

import { useState } from 'react';
import { useDashboard } from '@/lib/dashboard/context';
import { apiFetch } from '@/lib/dashboard/api';
import { Field, inputCls, inputErrorCls } from '@/components/dashboard/ui';
import type { Achievement } from '@/lib/dashboard/types';

type Errors = Partial<Record<'title' | 'event' | 'date' | 'description', string>>;

export default function AchievementForm({ initial }: { initial?: Achievement }) {
  const { saving, setSaving, setModal, loadAll, showToast } = useDashboard();
  const [form, setForm] = useState<Partial<Achievement>>(initial ?? {});
  const [errors, setErrors] = useState<Errors>({});

  function validate(): boolean {
    const e: Errors = {};
    if (!form.title?.trim()) e.title = 'Title is required';
    if (!form.event?.trim()) e.event = 'Event is required';
    if (!form.date?.trim()) e.date = 'Date is required';
    if (!form.description?.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSave() {
    if (!validate()) return;
    setSaving(true);
    const res = initial
      ? await apiFetch(`/api/achievements/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      : await apiFetch('/api/achievements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { await loadAll(); setModal(null); showToast(initial ? 'Achievement updated' : 'Achievement added'); }
    else { const d = await res.json(); showToast(d.error ?? 'Save failed', 'error'); }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <Field label="Title" error={errors.title}>
        <input
          className={errors.title ? inputErrorCls : inputCls}
          value={form.title ?? ''}
          onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); setErrors((er) => ({ ...er, title: undefined })); }}
          placeholder="Award Title"
        />
      </Field>
      <Field label="Event" error={errors.event}>
        <input
          className={errors.event ? inputErrorCls : inputCls}
          value={form.event ?? ''}
          onChange={(e) => { setForm((f) => ({ ...f, event: e.target.value })); setErrors((er) => ({ ...er, event: undefined })); }}
          placeholder="Event or Organization"
        />
      </Field>
      <Field label="Date" error={errors.date}>
        <input
          className={errors.date ? inputErrorCls : inputCls}
          value={form.date ?? ''}
          onChange={(e) => { setForm((f) => ({ ...f, date: e.target.value })); setErrors((er) => ({ ...er, date: undefined })); }}
          placeholder="June 2025"
        />
      </Field>
      <Field label="Description" error={errors.description}>
        <textarea
          className={`${errors.description ? inputErrorCls : inputCls} min-h-[80px] resize-none`}
          value={form.description ?? ''}
          onChange={(e) => { setForm((f) => ({ ...f, description: e.target.value })); setErrors((er) => ({ ...er, description: undefined })); }}
          placeholder="Brief description…"
        />
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <button onClick={() => setModal(null)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">Cancel</button>
        <button onClick={onSave} disabled={saving} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </div>
  );
}
