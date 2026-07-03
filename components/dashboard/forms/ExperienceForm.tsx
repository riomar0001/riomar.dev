'use client';

import { useState } from 'react';
import { useDashboard } from '@/lib/dashboard/context';
import { apiFetch } from '@/lib/dashboard/api';
import { Field, inputCls, inputErrorCls, FormActions } from '@/components/dashboard/ui';
import { composePeriod, parsePeriod } from '@/lib/format';
import type { Experience } from '@/lib/dashboard/types';

type Errors = Partial<Record<'role' | 'company' | 'location' | 'period' | 'description', string>>;

export default function ExperienceForm({ initial }: { initial?: Experience }) {
  const { saving, setSaving, setModal, reloadExperiences, showToast } = useDashboard();
  const [form, setForm] = useState<Partial<Experience>>(initial ?? { description: [], tags: [] });
  const [descText, setDescText] = useState((initial?.description ?? []).join('\n'));
  const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(', '));
  const [errors, setErrors] = useState<Errors>({});

  const initPeriod = parsePeriod(initial?.period);
  const [start, setStart] = useState(initPeriod.start);
  const [end, setEnd] = useState(initPeriod.end);
  const [present, setPresent] = useState(initPeriod.present);

  function updatePeriod(nextStart: string, nextEnd: string, nextPresent: boolean) {
    const cleanEnd = nextPresent ? '' : nextEnd;
    setStart(nextStart);
    setEnd(cleanEnd);
    setPresent(nextPresent);
    setForm((f) => ({ ...f, period: composePeriod(nextStart, cleanEnd, nextPresent) }));
    setErrors((er) => ({ ...er, period: undefined }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (!form.role?.trim()) e.role = 'Role is required';
    if (!form.company?.trim()) e.company = 'Company is required';
    if (!form.location?.trim()) e.location = 'Location is required';
    if (!form.period?.trim()) e.period = 'Period is required';
    if (!descText.trim()) e.description = 'At least one bullet is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSave() {
    if (!validate()) return;
    setSaving(true);
    const body = {
      ...form,
      description: descText.split('\n').map((s) => s.trim()).filter(Boolean),
      tags: tagsText.split(',').map((s) => s.trim()).filter(Boolean)
    };
    const res = initial
      ? await apiFetch(`/api/experiences/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      : await apiFetch('/api/experiences', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) { await reloadExperiences(); setModal(null); showToast(initial ? 'Experience updated' : 'Experience added'); }
    else { const d = await res.json(); showToast(d.error ?? 'Save failed', 'error'); }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Role" error={errors.role}>
          <input
            className={errors.role ? inputErrorCls : inputCls}
            value={form.role ?? ''}
            onChange={(e) => { setForm((f) => ({ ...f, role: e.target.value })); setErrors((er) => ({ ...er, role: undefined })); }}
            placeholder="Frontend Engineer"
          />
        </Field>
        <Field label="Company" error={errors.company}>
          <input
            className={errors.company ? inputErrorCls : inputCls}
            value={form.company ?? ''}
            onChange={(e) => { setForm((f) => ({ ...f, company: e.target.value })); setErrors((er) => ({ ...er, company: undefined })); }}
            placeholder="Acme Corp"
          />
        </Field>
      </div>
      <Field label="Location" error={errors.location}>
        <input
          className={errors.location ? inputErrorCls : inputCls}
          value={form.location ?? ''}
          onChange={(e) => { setForm((f) => ({ ...f, location: e.target.value })); setErrors((er) => ({ ...er, location: undefined })); }}
          placeholder="Remote"
        />
      </Field>
      <Field label="Period" error={errors.period}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="mb-1 block font-mono text-[10px] tracking-wider uppercase opacity-40">Start</span>
            <input
              type="month"
              className={errors.period ? inputErrorCls : inputCls}
              value={start}
              onChange={(e) => updatePeriod(e.target.value, end, present)}
            />
          </div>
          <div>
            <span className="mb-1 block font-mono text-[10px] tracking-wider uppercase opacity-40">End</span>
            <input
              type="month"
              className={`${inputCls} ${present ? 'opacity-40' : ''}`}
              value={end}
              disabled={present}
              onChange={(e) => updatePeriod(start, e.target.value, present)}
            />
          </div>
        </div>
        <label className="mt-2.5 flex w-fit cursor-pointer items-center gap-2.5 font-mono text-xs tracking-wider uppercase">
          <input
            type="checkbox"
            checked={present}
            onChange={(e) => updatePeriod(start, end, e.target.checked)}
            className="h-4 w-4 accent-black dark:accent-white"
          />
          Currently here (Present)
        </label>
        {form.period && <p className="mt-2 font-mono text-[11px] opacity-50">Preview · {form.period}</p>}
      </Field>
      <Field label="Description bullets (one per line)" error={errors.description}>
        <textarea
          className={`${errors.description ? inputErrorCls : inputCls} min-h-30 resize-y`}
          value={descText}
          onChange={(e) => { setDescText(e.target.value); setErrors((er) => ({ ...er, description: undefined })); }}
          placeholder={"Built scalable REST APIs…\nLed a team of 5 engineers…"}
        />
      </Field>
      <Field label="Tags (comma-separated)">
        <input className={inputCls} value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="React, TypeScript, Node.js" />
      </Field>
      <Field label="Website URL (optional)">
        <input className={inputCls} value={form.link ?? ''} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} placeholder="https://…" />
      </Field>
      <FormActions onCancel={() => setModal(null)} onSave={onSave} saving={saving} />
    </div>
  );
}
