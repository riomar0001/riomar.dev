'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/dashboard/api';
import { useDashboard } from '@/lib/dashboard/context';
import { Field, inputCls, inputErrorCls, Spinner } from '@/components/dashboard/ui';

type Props = {
  onClose: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
};

type Errors = Partial<Record<'currentPassword' | 'newPassword' | 'confirmPassword', string>>;

export default function ChangePasswordForm({ onClose, showToast }: Props) {
  const { saving, setSaving } = useDashboard();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Errors>({});

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!form.currentPassword) e.currentPassword = 'Current password is required';
    if (!form.newPassword) e.newPassword = 'New password is required';
    else if (form.newPassword.length < 8) e.newPassword = 'Must be at least 8 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your new password';
    else if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const res = await apiFetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Password changed successfully');
        onClose();
      } else {
        showToast(data.error ?? 'Failed to change password', 'error');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Current Password" error={errors.currentPassword}>
        <input
          type="password"
          value={form.currentPassword}
          onChange={(e) => set('currentPassword', e.target.value)}
          className={errors.currentPassword ? inputErrorCls : inputCls}
          placeholder="Enter current password"
          autoComplete="current-password"
        />
      </Field>
      <Field label="New Password" error={errors.newPassword}>
        <input
          type="password"
          value={form.newPassword}
          onChange={(e) => set('newPassword', e.target.value)}
          className={errors.newPassword ? inputErrorCls : inputCls}
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
      </Field>
      <Field label="Confirm New Password" error={errors.confirmPassword}>
        <input
          type="password"
          value={form.confirmPassword}
          onChange={(e) => set('confirmPassword', e.target.value)}
          className={errors.confirmPassword ? inputErrorCls : inputCls}
          placeholder="Repeat new password"
          autoComplete="new-password"
        />
      </Field>
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="flex-1 rounded-xl border border-neutral-200 bg-white py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
        >
          {saving && <Spinner />}{saving ? 'Saving…' : 'Change Password'}
        </button>
      </div>
    </form>
  );
}
