'use client';

import { useState } from 'react';
import { useDashboard } from '@/lib/dashboard/context';
import { uploadFile } from '@/lib/dashboard/api';
import { Field, inputCls, inputErrorCls, FormActions, ImagePicker } from '@/components/dashboard/ui';
import type { PersonalInfo } from '@/lib/dashboard/types';

type Errors = Partial<Record<'name' | 'role' | 'tagline' | 'bio' | 'email' | 'location', string>>;

export default function PersonalInfoForm() {
  const { personalInfo, saving, setSaving, setModal, reloadPersonalInfo, showToast } = useDashboard();
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
    if (res.ok) { await reloadPersonalInfo(); setModal(null); showToast('Personal info updated'); }
    else { const d = await res.json(); showToast(d.error ?? 'Save failed', 'error'); }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <ImagePicker
        label="Profile Photo"
        value={form.photoUrl}
        isPending={!!pendingPhoto}
        objectTop
        onPick={(file, previewUrl) => { setPendingPhoto(file); setForm((f) => ({ ...f, photoUrl: previewUrl })); }}
        onRemove={() => { setPendingPhoto(null); setForm((f) => ({ ...f, photoUrl: null })); }}
      />
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
          className={`${errors.tagline ? inputErrorCls : inputCls} min-h-20 resize-none`}
          value={form.tagline ?? ''}
          onChange={(e) => { setForm((f) => ({ ...f, tagline: e.target.value })); setErrors((er) => ({ ...er, tagline: undefined })); }}
          placeholder="Short bio shown in hero"
        />
      </Field>
      <Field label="Bio paragraphs (separate with blank line)" error={errors.bio}>
        <textarea
          className={`${errors.bio ? inputErrorCls : inputCls} min-h-30 resize-y`}
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
      <FormActions onCancel={() => setModal(null)} onSave={onSave} saving={saving} />
    </div>
  );
}
