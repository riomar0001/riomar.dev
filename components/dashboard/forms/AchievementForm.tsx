'use client';

import { useState } from 'react';
import { useDashboard } from '@/lib/dashboard/context';
import { apiFetch, uploadFile } from '@/lib/dashboard/api';
import { Field, inputCls, inputErrorCls, FormActions, ImagePicker } from '@/components/dashboard/ui';
import type { Achievement } from '@/lib/dashboard/types';

type Errors = Partial<Record<'title' | 'event' | 'description', string>>;

export default function AchievementForm({ initial }: { initial?: Achievement }) {
  const { saving, setSaving, setModal, reloadAchievements, showToast } = useDashboard();
  const [form, setForm] = useState<Partial<Achievement>>(initial ?? {});
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  function validate(): boolean {
    const e: Errors = {};
    if (!form.title?.trim()) e.title = 'Title is required';
    if (!form.event?.trim()) e.event = 'Event is required';
    if (!form.description?.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSave() {
    if (!validate()) return;
    setSaving(true);
    let imageUrl = form.imageUrl;
    if (pendingImage) {
      try {
        imageUrl = await uploadFile('achievements', pendingImage);
      } catch (e) {
        showToast((e as Error).message, 'error');
        setSaving(false);
        return;
      }
    }
    const body = { ...form, imageUrl };
    const res = initial
      ? await apiFetch(`/api/achievements/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      : await apiFetch('/api/achievements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) { await reloadAchievements(); setModal(null); showToast(initial ? 'Achievement updated' : 'Achievement added'); }
    else { const d = await res.json(); showToast(d.error ?? 'Save failed', 'error'); }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <ImagePicker
        label="Photo"
        value={form.imageUrl}
        isPending={!!pendingImage}
        onPick={(file, previewUrl) => { setPendingImage(file); setForm((f) => ({ ...f, imageUrl: previewUrl })); }}
        onRemove={() => { setPendingImage(null); setForm((f) => ({ ...f, imageUrl: null })); }}
      />
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
      <Field label="Date (optional)">
        <input
          type="date"
          className={inputCls}
          value={form.date ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
        />
      </Field>
      <Field label="Link URL (optional)">
        <input
          className={inputCls}
          value={form.link ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
          placeholder="https://…"
        />
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
