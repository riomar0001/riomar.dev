'use client';

import { useState } from 'react';
import { useDashboard } from '@/lib/dashboard/context';
import { handleFilePick, uploadFile } from '@/lib/dashboard/api';
import { Field, inputCls, inputErrorCls } from '@/components/dashboard/ui';
import type { PersonalInfo } from '@/lib/dashboard/types';

type Errors = Partial<Record<'name' | 'role' | 'tagline' | 'bio' | 'email' | 'location', string>>;

export default function PersonalInfoForm() {
  const { personalInfo, saving, setSaving, setModal, loadAll, showToast } = useDashboard();
  const [form, setForm] = useState<Partial<PersonalInfo>>(personalInfo ?? {});
  const [bioText, setBioText] = useState((personalInfo?.bio ?? []).join('\n\n'));
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  function validate(): boolean {
    const e: Errors = {};
    if (!form.name?.trim()) e.name = 'Name is required';
    if (!form.role?.trim()) e.role = 'Role is required';
    if (!form.tagline?.trim()) e.tagline = 'Tagline is required';
    if (!bioText.trim()) e.bio = 'Bio is required';
    if (!form.email?.trim()) e.email = 'Email is required';
    if (!form.location?.trim()) e.location = 'Location is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSave() {
    if (!validate()) return;
    setSaving(true);
    let photoUrl = form.photoUrl;
    if (pendingPhoto) {
      try {
        photoUrl = await uploadFile('photos', pendingPhoto);
      } catch (e) {
        showToast((e as Error).message, 'error');
        setSaving(false);
        return;
      }
    }
    const res = await fetch('/api/personal-info', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, photoUrl, bio: bioText.split('\n\n').filter(Boolean) })
    });
    if (res.ok) { await loadAll(); setModal(null); showToast('Personal info updated'); }
    else { const d = await res.json(); showToast(d.error ?? 'Save failed', 'error'); }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" error={errors.name}>
          <input
            className={errors.name ? inputErrorCls : inputCls}
            value={form.name ?? ''}
            onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setErrors((er) => ({ ...er, name: undefined })); }}
            placeholder="Your name"
          />
        </Field>
        <Field label="Role" error={errors.role}>
          <input
            className={errors.role ? inputErrorCls : inputCls}
            value={form.role ?? ''}
            onChange={(e) => { setForm((f) => ({ ...f, role: e.target.value })); setErrors((er) => ({ ...er, role: undefined })); }}
            placeholder="Software Engineer"
          />
        </Field>
      </div>
      <Field label="Tagline" error={errors.tagline}>
        <textarea
          className={`${errors.tagline ? inputErrorCls : inputCls} min-h-[80px] resize-none`}
          value={form.tagline ?? ''}
          onChange={(e) => { setForm((f) => ({ ...f, tagline: e.target.value })); setErrors((er) => ({ ...er, tagline: undefined })); }}
          placeholder="Short bio shown in hero"
        />
      </Field>
      <Field label="Bio paragraphs (separate with blank line)" error={errors.bio}>
        <textarea
          className={`${errors.bio ? inputErrorCls : inputCls} min-h-[120px] resize-y`}
          value={bioText}
          onChange={(e) => { setBioText(e.target.value); setErrors((er) => ({ ...er, bio: undefined })); }}
          placeholder={"Paragraph 1\n\nParagraph 2\n\nParagraph 3"}
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email" error={errors.email}>
          <input
            className={errors.email ? inputErrorCls : inputCls}
            type="email"
            value={form.email ?? ''}
            onChange={(e) => { setForm((f) => ({ ...f, email: e.target.value })); setErrors((er) => ({ ...er, email: undefined })); }}
          />
        </Field>
        <Field label="Location" error={errors.location}>
          <input
            className={errors.location ? inputErrorCls : inputCls}
            value={form.location ?? ''}
            onChange={(e) => { setForm((f) => ({ ...f, location: e.target.value })); setErrors((er) => ({ ...er, location: undefined })); }}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="LinkedIn URL">
          <input className={inputCls} value={form.linkedin ?? ''} onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))} />
        </Field>
        <Field label="GitHub URL">
          <input className={inputCls} value={form.github ?? ''} onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))} />
        </Field>
      </div>
      <Field label="Profile Photo">
        <div className="flex items-center gap-3">
          {form.photoUrl ? (
            <img src={form.photoUrl} alt="Photo" className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700">
              <svg className="h-7 w-7 text-neutral-400 dark:text-neutral-500" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" />
              </svg>
            </div>
          )}
          <button
            type="button"
            onClick={() => handleFilePick((file, previewUrl) => { setPendingPhoto(file); setForm((f) => ({ ...f, photoUrl: previewUrl })); })}
            className="rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-700 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
          >
            {pendingPhoto ? 'Change Photo' : 'Upload Photo'}
          </button>
          {form.photoUrl && (
            <button type="button" onClick={() => { setPendingPhoto(null); setForm((f) => ({ ...f, photoUrl: null })); }} className="text-xs text-red-500 hover:underline">
              Remove
            </button>
          )}
        </div>
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <button onClick={() => setModal(null)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">Cancel</button>
        <button onClick={onSave} disabled={saving} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </div>
  );
}
