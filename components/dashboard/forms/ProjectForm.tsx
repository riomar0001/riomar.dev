/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { useDashboard } from '@/lib/dashboard/context';
import { apiFetch, handleFilePick, uploadFile } from '@/lib/dashboard/api';
import { Field, inputCls, inputErrorCls, Spinner } from '@/components/dashboard/ui';
import type { Project } from '@/lib/dashboard/types';

type Errors = Partial<Record<'title' | 'description', string>>;

export default function ProjectForm({ initial }: { initial?: Project }) {
  const { saving, setSaving, setModal, loadAll, showToast } = useDashboard();
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
    if (res.ok) { await loadAll(); setModal(null); showToast(initial ? 'Project updated' : 'Project added'); }
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
      <Field label="Project Image">
        <div className="flex items-center gap-3">
          {form.imageUrl && <img src={form.imageUrl} alt="Project" className="h-12 w-16 rounded-lg object-cover" />}
          <button
            type="button"
            onClick={() => handleFilePick((file, previewUrl) => { setPendingImage(file); setForm((f) => ({ ...f, imageUrl: previewUrl })); })}
            className="rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-700 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          >
            {pendingImage ? 'Change Image' : 'Upload Image'}
          </button>
          {form.imageUrl && (
            <button type="button" onClick={() => { setPendingImage(null); setForm((f) => ({ ...f, imageUrl: null })); }} className="text-xs text-red-500 hover:underline">Remove</button>
          )}
        </div>
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
      <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
        <input type="checkbox" checked={form.featured ?? false} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="h-4 w-4 rounded accent-emerald-500" />
        Featured project
      </label>
      <div className="flex justify-end gap-3 pt-2">
        <button onClick={() => setModal(null)} disabled={saving} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">Cancel</button>
        <button onClick={onSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-60">{saving && <Spinner />}{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </div>
  );
}
