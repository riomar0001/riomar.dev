'use client';

import { useState } from 'react';
import { useDashboard } from '@/lib/dashboard/context';
import { apiFetch } from '@/lib/dashboard/api';
import { Field, inputCls, inputErrorCls, Spinner } from '@/components/dashboard/ui';
import type { SkillGroup } from '@/lib/dashboard/types';

type Errors = Partial<Record<'category' | 'items', string>>;

export default function SkillForm({ initial }: { initial?: SkillGroup }) {
  const { saving, setSaving, setModal, loadAll, showToast } = useDashboard();
  const [category, setCategory] = useState(initial?.category ?? '');
  const [items, setItems] = useState((initial?.items ?? []).map((i) => i.name).join(', '));
  const [errors, setErrors] = useState<Errors>({});

  function validate(): boolean {
    const e: Errors = {};
    if (!category.trim()) e.category = 'Category is required';
    if (!items.trim()) e.items = 'At least one skill is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSave() {
    if (!validate()) return;
    setSaving(true);
    const body = { category, items: items.split(',').map((s) => s.trim()).filter(Boolean) };
    const res = initial
      ? await apiFetch(`/api/skills/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      : await apiFetch('/api/skills', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) { await loadAll(); setModal(null); showToast(initial ? 'Skill group updated' : 'Skill group added'); }
    else { const d = await res.json(); showToast(d.error ?? 'Save failed', 'error'); }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <Field label="Category" error={errors.category}>
        <input
          className={errors.category ? inputErrorCls : inputCls}
          value={category}
          onChange={(e) => { setCategory(e.target.value); setErrors((er) => ({ ...er, category: undefined })); }}
          placeholder="e.g. Languages"
        />
      </Field>
      <Field label="Skills (comma-separated)" error={errors.items}>
        <input
          className={errors.items ? inputErrorCls : inputCls}
          value={items}
          onChange={(e) => { setItems(e.target.value); setErrors((er) => ({ ...er, items: undefined })); }}
          placeholder="TypeScript, JavaScript, Python"
        />
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <button onClick={() => setModal(null)} disabled={saving} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">Cancel</button>
        <button onClick={onSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-60">{saving && <Spinner />}{saving ? 'Saving…' : 'Save'}</button>
      </div>
    </div>
  );
}
