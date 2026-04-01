'use client';

import { useState } from 'react';
import { useDashboard } from '@/lib/dashboard/context';
import { apiFetch } from '@/lib/dashboard/api';
import { Field, inputCls, inputErrorCls, Spinner } from '@/components/dashboard/ui';
import type { ContactCard } from '@/lib/dashboard/types';

type Errors = Partial<Record<'title' | 'value', string>>;

export default function ContactCardForm({ initial }: { initial?: ContactCard }) {
  const { saving, setSaving, setModal, loadAll, showToast } = useDashboard();
  const [form, setForm] = useState<Partial<ContactCard>>(initial ?? { iconType: 'location' });
  const [errors, setErrors] = useState<Errors>({});

  function validate(): boolean {
    const e: Errors = {};
    if (!form.title?.trim()) e.title = 'Title is required';
    if (!form.value?.trim()) e.value = 'Value is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSave() {
    if (!validate()) return;
    setSaving(true);
    const res = initial
      ? await apiFetch(`/api/contact-cards/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      : await apiFetch('/api/contact-cards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { await loadAll(); setModal(null); showToast(initial ? 'Card updated' : 'Card added'); }
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
          placeholder="Location"
        />
      </Field>
      <Field label="Value" error={errors.value}>
        <input
          className={errors.value ? inputErrorCls : inputCls}
          value={form.value ?? ''}
          onChange={(e) => { setForm((f) => ({ ...f, value: e.target.value })); setErrors((er) => ({ ...er, value: undefined })); }}
          placeholder="Davao City, Philippines"
        />
      </Field>
      <Field label="Icon">
        <select className={inputCls} value={form.iconType ?? 'location'} onChange={(e) => setForm((f) => ({ ...f, iconType: e.target.value }))}>
          <option value="location">Location</option>
          <option value="clock">Clock</option>
          <option value="briefcase">Briefcase</option>
        </select>
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <button onClick={() => setModal(null)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">Cancel</button>
        <button onClick={onSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-60">{saving && <Spinner />}{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </div>
  );
}
