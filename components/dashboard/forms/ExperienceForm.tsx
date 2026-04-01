'use client';

import { useState } from 'react';
import { useDashboard } from '@/lib/dashboard/context';
import { apiFetch } from '@/lib/dashboard/api';
import { Field, inputCls, inputErrorCls, Spinner } from '@/components/dashboard/ui';
import type { Experience } from '@/lib/dashboard/types';

type Errors = Partial<Record<'role' | 'company' | 'location' | 'period' | 'description', string>>;

export default function ExperienceForm({ initial }: { initial?: Experience }) {
  const { saving, setSaving, setModal, loadAll, showToast } = useDashboard();
  const [form, setForm] = useState<Partial<Experience>>(initial ?? { description: [], tags: [] });
  const [descText, setDescText] = useState((initial?.description ?? []).join('\n'));
  const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(', '));
  const [errors, setErrors] = useState<Errors>({});

  function validate(): boolean {
    const e: Errors = {};
    if (!form.role?.trim()) e.role = 'Role is required';
    if (!form.company?.trim()) e.company = 'Company is required';
    if (!form.location?.trim()) e.location = 'Location is required';
    if (!form.period?.trim()) e.period = 'Period is required';
    if (!descText.trim()) e.description = 'At least one bullet is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSave() {
    if (!validate()) return;
    setSaving(true);
    const body = {
      ...form,
      description: descText.split('\n').map((s) => s.trim()).filter(Boolean),
      tags: tagsText.split(',').map((s) => s.trim()).filter(Boolean)
    };
    const res = initial
      ? await apiFetch(`/api/experiences/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      : await apiFetch('/api/experiences', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) { await loadAll(); setModal(null); showToast(initial ? 'Experience updated' : 'Experience added'); }
    else { const d = await res.json(); showToast(d.error ?? 'Save failed', 'error'); }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Role" error={errors.role}>
          <input
            className={errors.role ? inputErrorCls : inputCls}
            value={form.role ?? ''}
            onChange={(e) => { setForm((f) => ({ ...f, role: e.target.value })); setErrors((er) => ({ ...er, role: undefined })); }}
            placeholder="Frontend Engineer"
          />
        </Field>
        <Field label="Company" error={errors.company}>
          <input
            className={errors.company ? inputErrorCls : inputCls}
            value={form.company ?? ''}
            onChange={(e) => { setForm((f) => ({ ...f, company: e.target.value })); setErrors((er) => ({ ...er, company: undefined })); }}
            placeholder="Acme Corp"
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Location" error={errors.location}>
          <input
            className={errors.location ? inputErrorCls : inputCls}
            value={form.location ?? ''}
            onChange={(e) => { setForm((f) => ({ ...f, location: e.target.value })); setErrors((er) => ({ ...er, location: undefined })); }}
            placeholder="Remote"
          />
        </Field>
        <Field label="Period" error={errors.period}>
          <input
            className={errors.period ? inputErrorCls : inputCls}
            value={form.period ?? ''}
            onChange={(e) => { setForm((f) => ({ ...f, period: e.target.value })); setErrors((er) => ({ ...er, period: undefined })); }}
            placeholder="Jan 2024 – Present"
          />
        </Field>
      </div>
      <Field label="Description bullets (one per line)" error={errors.description}>
        <textarea
          className={`${errors.description ? inputErrorCls : inputCls} min-h-30 resize-y`}
          value={descText}
          onChange={(e) => { setDescText(e.target.value); setErrors((er) => ({ ...er, description: undefined })); }}
          placeholder={"Built scalable REST APIs…\nLed a team of 5 engineers…"}
        />
      </Field>
      <Field label="Tags (comma-separated)">
        <input className={inputCls} value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="React, TypeScript, Node.js" />
      </Field>
      <Field label="Website URL (optional)">
        <input className={inputCls} value={form.link ?? ''} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} placeholder="https://…" />
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <button onClick={() => setModal(null)} disabled={saving} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">Cancel</button>
        <button onClick={onSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-60">{saving && <Spinner />}{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </div>
  );
}
