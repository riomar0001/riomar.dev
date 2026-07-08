'use client';

import { useState } from 'react';
import { useDashboard } from '@/lib/dashboard/context';
import { uploadFile } from '@/lib/dashboard/api';
import { FormActions, ImagePicker } from '@/components/dashboard/ui';

/** Updates only the profile photo + its focal point; other personal info fields are sent through unchanged. */
export default function ProfilePhotoForm() {
  const { personalInfo, saving, setSaving, setModal, reloadPersonalInfo, showToast } = useDashboard();
  const [photoUrl, setPhotoUrl] = useState<string | null>(personalInfo?.photoUrl ?? null);
  const [photoPosition, setPhotoPosition] = useState<string | null>(personalInfo?.photoPosition ?? null);
  const [photoZoom, setPhotoZoom] = useState<number | null>(personalInfo?.photoZoom ?? null);
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);

  async function onSave() {
    if (!personalInfo) {
      showToast('Add personal info first', 'error');
      return;
    }
    setSaving(true);
    let url = photoUrl;
    if (pendingPhoto) {
      try {
        url = await uploadFile('photos', pendingPhoto);
      } catch (e) {
        showToast((e as Error).message, 'error');
        setSaving(false);
        return;
      }
    }
    const res = await fetch('/api/personal-info', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...personalInfo, photoUrl: url, photoPosition, photoZoom })
    });
    if (res.ok) { await reloadPersonalInfo(); setModal(null); showToast('Profile photo updated'); }
    else { const d = await res.json(); showToast(d.error ?? 'Save failed', 'error'); }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <ImagePicker
        label="Profile Photo"
        value={photoUrl}
        isPending={!!pendingPhoto}
        frameClass="mx-auto aspect-square w-full max-w-[320px]"
        position={photoPosition ?? '50% 0%'}
        onPositionChange={setPhotoPosition}
        zoom={photoZoom}
        onZoomChange={setPhotoZoom}
        onPick={(file, previewUrl) => { setPendingPhoto(file); setPhotoUrl(previewUrl); }}
        onRemove={() => { setPendingPhoto(null); setPhotoUrl(null); setPhotoPosition(null); setPhotoZoom(null); }}
      />
      <FormActions onCancel={() => setModal(null)} onSave={onSave} saving={saving} />
    </div>
  );
}
