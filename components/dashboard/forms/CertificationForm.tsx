/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { useDashboard } from '@/lib/dashboard/context';
import { apiFetch, handleFilePick, uploadFile } from '@/lib/dashboard/api';
import { Field, inputCls, inputErrorCls, Spinner } from '@/components/dashboard/ui';
import type { Certification } from '@/lib/dashboard/types';

type Errors = Partial<Record<'title' | 'issuer' | 'description', string>>;

export default function CertificationForm({ initial }: { initial?: Certification }) {
  const { saving, setSaving, setModal, loadAll, showToast } = useDashboard();
  const [form, setForm] = useState<Partial<Certification>>(initial ?? {});
  const [pendingIcon, setPendingIcon] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  function validate(): boolean {
    const e: Errors = {};
    if (!form.title?.trim()) e.title = 'Title is required';
    if (!form.issuer?.trim()) e.issuer = 'Issuer is required';
    if (!form.description?.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSave() {
    if (!validate()) return;
    setSaving(true);
    let iconUrl = form.iconUrl;
    if (pendingIcon) {
      try {
        iconUrl = await uploadFile('projects', pendingIcon);
      } catch (e) {
        showToast((e as Error).message, 'error');
        setSaving(false);
        return;
      }
    }
    const res = initial
      ? await apiFetch(`/api/certifications/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, iconUrl }) })
      : await apiFetch('/api/certifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, iconUrl }) });
    if (res.ok) { await loadAll(); setModal(null); showToast(initial ? 'Certification updated' : 'Certification added'); }
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
          placeholder="IT Specialist - Java"
        />
      </Field>
      <Field label="Issuer" error={errors.issuer}>
        <input
          className={errors.issuer ? inputErrorCls : inputCls}
          value={form.issuer ?? ''}
          onChange={(e) => { setForm((f) => ({ ...f, issuer: e.target.value })); setErrors((er) => ({ ...er, issuer: undefined })); }}
          placeholder="Certiport / Pearson VUE"
        />
      </Field>
      <Field label="Icon (optional)">
        <div className="flex items-center gap-3">
          {form.iconUrl && <img src={form.iconUrl} alt="Icon" className="h-10 w-10 rounded-lg object-contain border border-neutral-200 dark:border-neutral-700" />}
          <button
            type="button"
            onClick={() => handleFilePick((file, previewUrl) => { setPendingIcon(file); setForm((f) => ({ ...f, iconUrl: previewUrl })); })}
            className="rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-700 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          >
            {pendingIcon ? 'Change Icon' : 'Upload Icon'}
          </button>
          {form.iconUrl && (
            <button type="button" onClick={() => { setPendingIcon(null); setForm((f) => ({ ...f, iconUrl: null })); }} className="text-xs text-red-500 hover:underline">Remove</button>
          )}
        </div>
      </Field>
      <Field label="Credly URL (optional)">
        <input className={inputCls} value={form.credlyUrl ?? ''} onChange={(e) => setForm((f) => ({ ...f, credlyUrl: e.target.value }))} placeholder="https://credly.com/badges/…" />
      </Field>
      <Field label="Description" error={errors.description}>
        <textarea
          className={`${errors.description ? inputErrorCls : inputCls} min-h-20 resize-none`}
          value={form.description ?? ''}
          onChange={(e) => { setForm((f) => ({ ...f, description: e.target.value })); setErrors((er) => ({ ...er, description: undefined })); }}
          placeholder="Brief description…"
        />
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <button onClick={() => setModal(null)} disabled={saving} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">Cancel</button>
        <button onClick={onSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-60">{saving && <Spinner />}{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </div>
  );
}
