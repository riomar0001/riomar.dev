'use client';

import { useEffect } from 'react';
import { handleFilePick } from '@/lib/dashboard/api';

export function Spinner() {
  return (
    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

/* ===== Shared control classes (brutalist / mono) ===== */

export const inputCls =
  'w-full border border-black/20 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:opacity-40 focus:border-black dark:border-white/20 dark:focus:border-white';

export const inputErrorCls =
  'w-full border border-red-500 bg-transparent px-3 py-2.5 text-sm outline-none transition-colors placeholder:opacity-40 focus:border-red-500 dark:border-red-500';

export const btnPrimaryCls =
  'flex items-center justify-center gap-2 border border-black bg-black px-5 py-2.5 font-mono text-xs tracking-wider uppercase text-white transition-colors hover:bg-transparent hover:text-black disabled:pointer-events-none disabled:opacity-50 dark:border-white dark:bg-white dark:text-black dark:hover:bg-transparent dark:hover:text-white';

export const btnGhostCls =
  'flex items-center justify-center gap-2 border border-black/25 px-5 py-2.5 font-mono text-xs tracking-wider uppercase transition-colors hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-40 dark:border-white/25 dark:hover:bg-white dark:hover:text-black';

export const uploadBtnCls =
  'border border-black/25 px-3.5 py-2 font-mono text-xs tracking-wider uppercase transition-colors hover:bg-black hover:text-white dark:border-white/25 dark:hover:bg-white dark:hover:text-black';

/**
 * Large image picker shown at the top of a form. Picking a file only creates a
 * local preview (via handleFilePick → object URL); the actual upload is deferred
 * until the form's Save handler calls uploadFile. `isPending` surfaces that the
 * shown image is an unsaved preview.
 */
export function ImagePicker({
  label,
  value,
  isPending,
  onPick,
  onRemove,
  frameClass = 'aspect-[16/9] w-full',
  fit = 'cover',
  grayscale = false,
  objectTop = false
}: {
  label?: string;
  value?: string | null;
  isPending?: boolean;
  onPick: (file: File, previewUrl: string) => void;
  onRemove: () => void;
  frameClass?: string;
  fit?: 'cover' | 'contain';
  grayscale?: boolean;
  objectTop?: boolean;
}) {
  const pick = () => handleFilePick(onPick);

  return (
    <div>
      {label && <label className="mb-2 block font-mono text-[11px] tracking-wider uppercase opacity-60">{label}</label>}
      {value ? (
        <button
          type="button"
          onClick={pick}
          title="Click to change"
          className={`group relative block ${frameClass} overflow-hidden border border-black/20 dark:border-white/20`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className={`h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain'} ${objectTop ? 'object-top' : ''} ${grayscale ? 'grayscale transition-[filter] duration-500 group-hover:grayscale-0' : ''}`}
          />
          {isPending && (
            <span className="absolute left-0 top-0 bg-black px-2 py-1 font-mono text-[10px] tracking-wider uppercase text-white dark:bg-white dark:text-black">
              Preview · uploads on save
            </span>
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 font-mono text-[11px] tracking-wider uppercase text-white opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
            Change image
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={pick}
          className={`flex ${frameClass} flex-col items-center justify-center gap-2.5 border border-dashed border-black/25 font-mono text-[11px] tracking-wider uppercase opacity-50 transition-colors hover:opacity-100 dark:border-white/25`}
        >
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>
          Click to upload
        </button>
      )}
      {value && (
        <div className="mt-2 flex items-center gap-3">
          <button type="button" onClick={pick} className={uploadBtnCls}>Change</button>
          <button type="button" onClick={onRemove} className="font-mono text-[11px] uppercase tracking-wider text-red-500 hover:underline">
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

export function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[11px] tracking-wider uppercase opacity-60">{label}</label>
      {children}
      {error && <p className="mt-1.5 font-mono text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

export function FormActions({
  onCancel,
  onSave,
  saving,
  saveLabel = 'Save',
  savingLabel = 'Saving…'
}: {
  onCancel: () => void;
  onSave: () => void;
  saving?: boolean;
  saveLabel?: string;
  savingLabel?: string;
}) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button type="button" onClick={onCancel} disabled={saving} className={btnGhostCls}>
        Cancel
      </button>
      <button type="button" onClick={onSave} disabled={saving} className={btnPrimaryCls}>
        {saving && <Spinner />}
        {saving ? savingLabel : saveLabel}
      </button>
    </div>
  );
}

export function SectionHeader({
  index,
  title,
  onAdd,
  addLabel = 'Add'
}: {
  index?: string;
  title: string;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {index && <div className="mb-2 font-mono text-xs tracking-widest uppercase opacity-50">{index} / {title}</div>}
        <h2 className="text-[18px] font-medium tracking-tight sm:text-[26px]">{title}</h2>
      </div>
      {onAdd && <AddButton onClick={onAdd} label={addLabel} />}
    </div>
  );
}

export function SubSectionHeader({ title, onAdd, addLabel = 'Add' }: { title: string; onAdd?: () => void; addLabel?: string }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 border-t border-black/15 pt-8 dark:border-white/15">
      <h3 className="font-mono text-xs tracking-widest uppercase opacity-60">{title}</h3>
      {onAdd && <AddButton onClick={onAdd} label={addLabel} />}
    </div>
  );
}

export function AddButton({ onClick, label = 'Add' }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="flex shrink-0 items-center gap-1.5 border border-black dark:border-white px-3.5 py-1.5 font-mono text-[11px] tracking-wider uppercase transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
    >
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
      </svg>
      {label}
    </button>
  );
}

export function ItemActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex gap-1.5">
      <button
        onClick={onEdit}
        className="border border-black/20 p-1.5 transition-colors hover:bg-black hover:text-white dark:border-white/20 dark:hover:bg-white dark:hover:text-black"
        title="Edit"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button
        onClick={onDelete}
        className="border border-black/20 p-1.5 transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white dark:border-white/20"
        title="Delete"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

export function Modal({ title, onClose, saving, children }: { title: string; onClose: () => void; saving?: boolean; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !saving) onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, saving]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={saving ? undefined : onClose} />
      <div className="animate-fade-in-up relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto border border-black/20 bg-white shadow-2xl dark:border-white/20 dark:bg-black">
        <div className="flex items-center justify-between border-b border-black/15 px-6 py-4 dark:border-white/15">
          <h3 className="font-mono text-xs tracking-widest uppercase opacity-80">{title}</h3>
          <button
            onClick={onClose}
            disabled={saving}
            className="border border-black/20 p-1 transition-colors hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-30 dark:border-white/20 dark:hover:bg-white dark:hover:text-black"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="animate-fade-in-up relative z-10 w-full max-w-sm border border-black/20 bg-white p-6 shadow-2xl dark:border-white/20 dark:bg-black">
        <div className="mb-4 flex items-center gap-2.5 font-mono text-xs tracking-widest uppercase text-red-500">
          <span className="inline-block h-[7px] w-[7px] animate-blink bg-red-500" />
          Confirm Delete
        </div>
        <p className="mb-6 text-sm leading-relaxed opacity-75">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className={`flex-1 ${btnGhostCls}`}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center border border-red-500 bg-red-500 px-5 py-2.5 font-mono text-xs tracking-wider uppercase text-white transition-colors hover:bg-transparent hover:text-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
