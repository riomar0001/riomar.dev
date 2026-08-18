'use client';

import { Field, Spinner, btnGhostCls, btnPrimaryCls, inputCls, metaLabelCls, panelCls } from '@/components/dashboard/ui';
import { linkUrl, slugify } from '@/lib/dashboard/links';
import type { TrackingLinkDraft } from '@/lib/dashboard/types';

/** Create/edit form for a tracking link, with a live preview of the built URL. */
export function LinkForm({
  draft,
  onChange,
  onSave,
  onCancel,
  editing,
  saving
}: {
  draft: TrackingLinkDraft;
  onChange: (next: TrackingLinkDraft) => void;
  onSave: () => void;
  onCancel: () => void;
  editing: boolean;
  saving: boolean;
}) {
  const set = <K extends keyof TrackingLinkDraft>(key: K, value: string) =>
    onChange({ ...draft, [key]: value });

  return (
    <div className={`${panelCls} p-5`}>
      <p className={`mb-4 ${metaLabelCls}`}>{editing ? 'Edit Link' : 'New Link'}</p>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Label">
          <input
            className={inputCls}
            value={draft.label}
            onChange={(e) => set('label', e.target.value)}
            placeholder="Resume — PDF footer"
            maxLength={100}
          />
        </Field>
        <Field label="Source (?from=)">
          <input
            className={inputCls}
            value={draft.source}
            onChange={(e) => set('source', slugify(e.target.value))}
            placeholder="resume"
          />
        </Field>
        <Field label="Detail (?application-from=) — optional">
          <input
            className={inputCls}
            value={draft.sourceDetail}
            onChange={(e) => set('sourceDetail', slugify(e.target.value))}
            placeholder="jobstreet"
          />
        </Field>
      </div>

      {draft.source && (
        <p className="mt-3 break-all font-mono text-[11px] opacity-50">
          {linkUrl({ source: draft.source, sourceDetail: draft.sourceDetail || null })}
        </p>
      )}

      <div className="mt-4 flex justify-end gap-3">
        {editing && (
          <button type="button" onClick={onCancel} disabled={saving} className={btnGhostCls}>
            Cancel
          </button>
        )}
        <button type="button" onClick={onSave} disabled={saving} className={btnPrimaryCls}>
          {saving && <Spinner />}
          {saving ? 'Saving…' : editing ? 'Update Link' : 'Create Link'}
        </button>
      </div>
    </div>
  );
}
