'use client';

import { useState } from 'react';
import { useDashboard } from '@/lib/dashboard/context';
import { apiFetch, uploadFile } from '@/lib/dashboard/api';
import { Field, inputCls, inputErrorCls, FormActions, ImagePicker } from '@/components/dashboard/ui';
import type { Certification } from '@/lib/dashboard/types';

type Errors = Partial<Record<'title' | 'issuer' | 'description', string>>;

export default function CertificationForm({ initial }: { initial?: Certification }) {
  const { saving, setSaving, setModal, reloadCertifications, showToast } = useDashboard();
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
        iconUrl = await uploadFile('certificates', pendingIcon);
      } catch (e) {
        showToast((e as Error).message, 'error');
        setSaving(false);
        return;
      }
    }
    const res = initial
      ? await apiFetch(`/api/certifications/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, iconUrl }) })
      : await apiFetch('/api/certifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, iconUrl }) });
    if (res.ok) { await reloadCertifications(); setModal(null); showToast(initial ? 'Certification updated' : 'Certification added'); }
    else { const d = await res.json(); showToast(d.error ?? 'Save failed', 'error'); }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <ImagePicker
        label="Icon (optional)"
        value={form.iconUrl}
        isPending={!!pendingIcon}
        fit="contain"
        onPick={(file, previewUrl) => { setPendingIcon(file); setForm((f) => ({ ...f, iconUrl: previewUrl })); }}
        onRemove={() => { setPendingIcon(null); setForm((f) => ({ ...f, iconUrl: null })); }}
      />
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
      <FormActions onCancel={() => setModal(null)} onSave={onSave} saving={saving} />
    </div>
  );
}
