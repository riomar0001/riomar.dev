'use client';

import { useState } from 'react';
import { useDashboard } from '@/lib/dashboard/context';
import { apiFetch, uploadFile } from '@/lib/dashboard/api';
import { Field, inputCls, inputErrorCls, FormActions, ImagePicker } from '@/components/dashboard/ui';
import type { Project } from '@/lib/dashboard/types';

type Errors = Partial<Record<'title' | 'description', string>>;

export default function ProjectForm({ initial }: { initial?: Project }) {
  const { saving, setSaving, setModal, reloadProjects, showToast } = useDashboard();
  const [form, setForm] = useState<Partial<Project>>(initial ?? { tags: [], featured: false });
  const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(', '));
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  function validate(): boolean {
    const e: Errors = {};
    if (!form.title?.trim()) e.title = 'Title is required';
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
        imageUrl = await uploadFile('projects', pendingImage);
      } catch (e) {
        showToast((e as Error).message, 'error');
        setSaving(false);
        return;
      }
    }
    const body = { ...form, imageUrl, tags: tagsText.split(',').map((s) => s.trim()).filter(Boolean) };
    const res = initial
      ? await apiFetch(`/api/projects/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      : await apiFetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) { await reloadProjects(); setModal(null); showToast(initial ? 'Project updated' : 'Project added'); }
    else { const d = await res.json(); showToast(d.error ?? 'Save failed', 'error'); }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <ImagePicker
        label="Project Image"
        value={form.imageUrl}
        isPending={!!pendingImage}
        position={form.imagePosition ?? '50% 0%'}
        onPositionChange={(pos) => setForm((f) => ({ ...f, imagePosition: pos }))}
        zoom={form.imageZoom}
        onZoomChange={(z) => setForm((f) => ({ ...f, imageZoom: z }))}
        onPick={(file, previewUrl) => { setPendingImage(file); setForm((f) => ({ ...f, imageUrl: previewUrl })); }}
        onRemove={() => { setPendingImage(null); setForm((f) => ({ ...f, imageUrl: null, imagePosition: null, imageZoom: null })); }}
      />
      <Field label="Title" error={errors.title}>
        <input
          className={errors.title ? inputErrorCls : inputCls}
          value={form.title ?? ''}
          onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); setErrors((er) => ({ ...er, title: undefined })); }}
          placeholder="My Awesome Project"
        />
      </Field>
      <Field label="Description" error={errors.description}>
        <textarea
          className={`${errors.description ? inputErrorCls : inputCls} min-h-25 resize-none`}
          value={form.description ?? ''}
          onChange={(e) => { setForm((f) => ({ ...f, description: e.target.value })); setErrors((er) => ({ ...er, description: undefined })); }}
          placeholder="Project description…"
        />
      </Field>
      <Field label="Tags (comma-separated)">
        <input className={inputCls} value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="React, TypeScript, Node.js" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Live URL">
          <input className={inputCls} value={form.link ?? ''} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} placeholder="https://…" />
        </Field>
        <Field label="GitHub URL">
          <input className={inputCls} value={form.github ?? ''} onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))} placeholder="https://github.com/…" />
        </Field>
      </div>
      <label className="flex cursor-pointer items-center gap-2.5 font-mono text-xs uppercase tracking-wider">
        <input type="checkbox" checked={form.featured ?? false} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="h-4 w-4 accent-black dark:accent-white" />
        Featured project
      </label>
      <FormActions onCancel={() => setModal(null)} onSave={onSave} saving={saving} />
    </div>
  );
}
