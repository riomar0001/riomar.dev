'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type PersonalInfo = {
  id: string;
  name: string;
  role: string;
  tagline: string;
  bio: string[];
  email: string;
  linkedin: string;
  github: string;
  location: string;
  photoUrl?: string | null;
  resumeUrl?: string | null;
};

type SkillItem = { id: string; name: string; order: number };
type SkillGroup = { id: string; category: string; order: number; items: SkillItem[] };

type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  tags: string[];
  link?: string | null;
  github?: string | null;
  featured: boolean;
};

type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  tags: string[];
  link?: string | null;
};

type Achievement = { id: string; title: string; event: string; date: string; description: string };
type Certification = { id: string; title: string; issuer: string; iconUrl?: string | null; credlyUrl?: string | null; description: string };
type ContactCard = { id: string; title: string; value: string; iconType: string };
type LoginHistory = { id: string; ipAddress?: string; userAgent?: string; success: boolean; reason?: string; createdAt: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function apiFetch(url: string, options?: RequestInit) {
  let res = await fetch(url, options);

  if (res.status === 401) {
    // Try refreshing the token
    const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
    if (refreshRes.ok) {
      res = await fetch(url, options);
    }
  }

  return res;
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function SectionHeader({
  title,
  onAdd,
  addLabel = 'Add'
}: {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
}) {
  return (
    <div className="mb-10 flex items-center gap-4 sm:mb-16 sm:gap-6">
      <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl md:text-3xl dark:text-neutral-50">{title}</h2>
      <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-medium text-emerald-700 transition-all duration-200 hover:bg-emerald-500 hover:text-white dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {addLabel}
        </button>
      )}
    </div>
  );
}

function SubSectionHeader({ title, onAdd, addLabel = 'Add' }: { title: string; onAdd?: () => void; addLabel?: string }) {
  return (
    <div className="mb-8 flex items-center gap-4 sm:mb-10 sm:gap-6">
      <h3 className="text-lg font-bold tracking-tight text-neutral-900 sm:text-xl dark:text-neutral-50">{title}</h3>
      <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 transition-all duration-200 hover:bg-emerald-500 hover:text-white dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {addLabel}
        </button>
      )}
    </div>
  );
}

function ItemActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex gap-1.5">
      <button
        onClick={onEdit}
        className="rounded-lg border border-neutral-200 bg-white p-1.5 text-neutral-500 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
        title="Edit"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button
        onClick={onDelete}
        className="rounded-lg border border-neutral-200 bg-white p-1.5 text-neutral-500 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-400"
        title="Delete"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 dark:border-neutral-800">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h4 className="mb-2 font-semibold text-neutral-900 dark:text-neutral-50">Confirm Delete</h4>
        <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-neutral-200 bg-white py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-red-500 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-all duration-200 placeholder:text-neutral-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:focus:border-emerald-500';

// ─── Main Dashboard Page ──────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();

  // ── Auth state ──
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // ── Data state ──
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [contactCards, setContactCards] = useState<ContactCard[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);

  // ── Modal state ──
  const [modal, setModal] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string; label: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // ── Tabs ──
  const [activeTab, setActiveTab] = useState<'content' | 'history'>('content');

  // ── Upload ref ──
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  // ── Load all data ──
  const loadAll = useCallback(async () => {
    const [pi, sg, pr, ex, ac, ce, cc, lh] = await Promise.all([
      apiFetch('/api/personal-info').then((r) => r.json()).catch(() => null),
      apiFetch('/api/skills').then((r) => r.json()).catch(() => []),
      apiFetch('/api/projects').then((r) => r.json()).catch(() => []),
      apiFetch('/api/experiences').then((r) => r.json()).catch(() => []),
      apiFetch('/api/achievements').then((r) => r.json()).catch(() => []),
      apiFetch('/api/certifications').then((r) => r.json()).catch(() => []),
      apiFetch('/api/contact-cards').then((r) => r.json()).catch(() => []),
      apiFetch('/api/auth/login-history').then((r) => r.json()).catch(() => [])
    ]);

    if (pi && !pi.error) setPersonalInfo(pi);
    if (Array.isArray(sg)) setSkillGroups(sg);
    if (Array.isArray(pr)) setProjects(pr);
    if (Array.isArray(ex)) setExperiences(ex);
    if (Array.isArray(ac)) setAchievements(ac);
    if (Array.isArray(ce)) setCertifications(ce);
    if (Array.isArray(cc)) setContactCards(cc);
    if (Array.isArray(lh)) setLoginHistory(lh);
  }, []);

  // ── Check auth & load data ──
  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch('/api/auth/me');
        if (!res.ok) {
          router.push('/dashboard/login');
          return;
        }
        const u = await res.json();
        setUser(u);
        await loadAll();
      } finally {
        setAuthChecked(true);
      }
    })();
  }, [router, loadAll]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/dashboard/login');
  }

  // ── File upload ──
  async function handleFileUpload(folder: 'photos' | 'projects', field: string, onUrl: (url: string) => void) {
    setUploadingFor(field);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) { setUploadingFor(null); return; }
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const res = await apiFetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) onUrl(data.url);
      else showToast(data.error ?? 'Upload failed', 'error');
      setUploadingFor(null);
    };
    input.addEventListener('cancel', () => { setUploadingFor(null); });
    input.click();
  }

  // ─── Generic delete ──
  async function deleteItem(type: string, id: string) {
    const endpoints: Record<string, string> = {
      skill: `/api/skills/${id}`,
      project: `/api/projects/${id}`,
      experience: `/api/experiences/${id}`,
      achievement: `/api/achievements/${id}`,
      certification: `/api/certifications/${id}`,
      contactCard: `/api/contact-cards/${id}`
    };
    const res = await apiFetch(endpoints[type], { method: 'DELETE' });
    if (res.ok) {
      await loadAll();
      showToast('Deleted successfully');
    } else {
      showToast('Delete failed', 'error');
    }
    setConfirmDelete(null);
  }

  // ── Forms ──────────────────────────────────────────────────────────────────

  function PersonalInfoForm() {
    const [form, setForm] = useState<Partial<PersonalInfo>>(personalInfo ?? {});
    const [bioText, setBioText] = useState((personalInfo?.bio ?? []).join('\n\n'));

    async function onSave() {
      setSaving(true);
      const res = await apiFetch('/api/personal-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          bio: bioText.split('\n\n').filter(Boolean)
        })
      });
      if (res.ok) { await loadAll(); setModal(null); showToast('Personal info updated'); }
      else { const d = await res.json(); showToast(d.error ?? 'Save failed', 'error'); }
      setSaving(false);
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name">
            <input className={inputCls} value={form.name ?? ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" />
          </Field>
          <Field label="Role">
            <input className={inputCls} value={form.role ?? ''} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="Software Engineer" />
          </Field>
        </div>
        <Field label="Tagline">
          <textarea className={`${inputCls} min-h-[80px] resize-none`} value={form.tagline ?? ''} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} placeholder="Short bio shown in hero" />
        </Field>
        <Field label="Bio paragraphs (separate with blank line)">
          <textarea className={`${inputCls} min-h-[120px] resize-y`} value={bioText} onChange={(e) => setBioText(e.target.value)} placeholder="Paragraph 1&#10;&#10;Paragraph 2&#10;&#10;Paragraph 3" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email">
            <input className={inputCls} type="email" value={form.email ?? ''} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </Field>
          <Field label="Location">
            <input className={inputCls} value={form.location ?? ''} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
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
            {form.photoUrl && <img src={form.photoUrl} alt="Photo" className="h-12 w-12 rounded-full object-cover" />}
            <button
              type="button"
              disabled={uploadingFor === 'photo'}
              onClick={() => handleFileUpload('photos', 'photo', (url) => setForm((f) => ({ ...f, photoUrl: url })))}
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-700 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              {uploadingFor === 'photo' ? 'Uploading…' : 'Upload Photo'}
            </button>
            {form.photoUrl && (
              <button type="button" onClick={() => setForm((f) => ({ ...f, photoUrl: null }))} className="text-xs text-red-500 hover:underline">
                Remove
              </button>
            )}
          </div>
        </Field>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => setModal(null)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
            Cancel
          </button>
          <button onClick={onSave} disabled={saving} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  function SkillForm({ initial }: { initial?: SkillGroup }) {
    const [category, setCategory] = useState(initial?.category ?? '');
    const [items, setItems] = useState((initial?.items ?? []).map((i) => i.name).join(', '));

    async function onSave() {
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
        <Field label="Category">
          <input className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Languages" />
        </Field>
        <Field label="Skills (comma-separated)">
          <input className={inputCls} value={items} onChange={(e) => setItems(e.target.value)} placeholder="TypeScript, JavaScript, Python" />
        </Field>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => setModal(null)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
            Cancel
          </button>
          <button onClick={onSave} disabled={saving} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  function ProjectForm({ initial }: { initial?: Project }) {
    const [form, setForm] = useState<Partial<Project>>(initial ?? { tags: [], featured: false });
    const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(', '));

    async function onSave() {
      setSaving(true);
      const body = { ...form, tags: tagsText.split(',').map((s) => s.trim()).filter(Boolean) };
      const res = initial
        ? await apiFetch(`/api/projects/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        : await apiFetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { await loadAll(); setModal(null); showToast(initial ? 'Project updated' : 'Project added'); }
      else { const d = await res.json(); showToast(d.error ?? 'Save failed', 'error'); }
      setSaving(false);
    }

    return (
      <div className="space-y-4">
        <Field label="Title">
          <input className={inputCls} value={form.title ?? ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="My Awesome Project" />
        </Field>
        <Field label="Description">
          <textarea className={`${inputCls} min-h-[100px] resize-none`} value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Project description…" />
        </Field>
        <Field label="Project Image">
          <div className="flex items-center gap-3">
            {form.imageUrl && <img src={form.imageUrl} alt="Project" className="h-12 w-16 rounded-lg object-cover" />}
            <button
              type="button"
              disabled={uploadingFor === 'project-img'}
              onClick={() => handleFileUpload('projects', 'project-img', (url) => setForm((f) => ({ ...f, imageUrl: url })))}
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-700 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              {uploadingFor === 'project-img' ? 'Uploading…' : 'Upload Image'}
            </button>
            {form.imageUrl && (
              <button type="button" onClick={() => setForm((f) => ({ ...f, imageUrl: null }))} className="text-xs text-red-500 hover:underline">
                Remove
              </button>
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
          <input
            type="checkbox"
            checked={form.featured ?? false}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            className="h-4 w-4 rounded accent-emerald-500"
          />
          Featured project
        </label>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => setModal(null)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
            Cancel
          </button>
          <button onClick={onSave} disabled={saving} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  function ExperienceForm({ initial }: { initial?: Experience }) {
    const [form, setForm] = useState<Partial<Experience>>(initial ?? { description: [], tags: [] });
    const [descText, setDescText] = useState((initial?.description ?? []).join('\n'));
    const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(', '));

    async function onSave() {
      setSaving(true);
      const body = {
        ...form,
        description: descText.split('\n').map((s) => s.trim()).filter(Boolean),
        tags: tagsText.split(',').map((s) => s.trim()).filter(Boolean)
      };
      const res = initial
        ? await apiFetch(`/api/experiences/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        : await apiFetch('/api/experiences', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) { await loadAll(); setModal(null); showToast(initial ? 'Experience updated' : 'Experience added'); }
      else { const d = await res.json(); showToast(d.error ?? 'Save failed', 'error'); }
      setSaving(false);
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Role">
            <input className={inputCls} value={form.role ?? ''} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="Frontend Engineer" />
          </Field>
          <Field label="Company">
            <input className={inputCls} value={form.company ?? ''} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} placeholder="Acme Corp" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Location">
            <input className={inputCls} value={form.location ?? ''} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="Remote" />
          </Field>
          <Field label="Period">
            <input className={inputCls} value={form.period ?? ''} onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))} placeholder="Jan 2024 – Present" />
          </Field>
        </div>
        <Field label="Description bullets (one per line)">
          <textarea className={`${inputCls} min-h-[120px] resize-y`} value={descText} onChange={(e) => setDescText(e.target.value)} placeholder="Built scalable REST APIs…&#10;Led a team of 5 engineers…" />
        </Field>
        <Field label="Tags (comma-separated)">
          <input className={inputCls} value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="React, TypeScript, Node.js" />
        </Field>
        <Field label="Website URL (optional)">
          <input className={inputCls} value={form.link ?? ''} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} placeholder="https://…" />
        </Field>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => setModal(null)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
            Cancel
          </button>
          <button onClick={onSave} disabled={saving} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  function AchievementForm({ initial }: { initial?: Achievement }) {
    const [form, setForm] = useState<Partial<Achievement>>(initial ?? {});

    async function onSave() {
      setSaving(true);
      const res = initial
        ? await apiFetch(`/api/achievements/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        : await apiFetch('/api/achievements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { await loadAll(); setModal(null); showToast(initial ? 'Achievement updated' : 'Achievement added'); }
      else { const d = await res.json(); showToast(d.error ?? 'Save failed', 'error'); }
      setSaving(false);
    }

    return (
      <div className="space-y-4">
        <Field label="Title">
          <input className={inputCls} value={form.title ?? ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Award Title" />
        </Field>
        <Field label="Event">
          <input className={inputCls} value={form.event ?? ''} onChange={(e) => setForm((f) => ({ ...f, event: e.target.value }))} placeholder="Event or Organization" />
        </Field>
        <Field label="Date">
          <input className={inputCls} value={form.date ?? ''} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} placeholder="June 2025" />
        </Field>
        <Field label="Description">
          <textarea className={`${inputCls} min-h-[80px] resize-none`} value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Brief description…" />
        </Field>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => setModal(null)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">Cancel</button>
          <button onClick={onSave} disabled={saving} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    );
  }

  function CertificationForm({ initial }: { initial?: Certification }) {
    const [form, setForm] = useState<Partial<Certification>>(initial ?? {});

    async function onSave() {
      setSaving(true);
      const res = initial
        ? await apiFetch(`/api/certifications/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        : await apiFetch('/api/certifications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { await loadAll(); setModal(null); showToast(initial ? 'Certification updated' : 'Certification added'); }
      else { const d = await res.json(); showToast(d.error ?? 'Save failed', 'error'); }
      setSaving(false);
    }

    return (
      <div className="space-y-4">
        <Field label="Title">
          <input className={inputCls} value={form.title ?? ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="IT Specialist - Java" />
        </Field>
        <Field label="Issuer">
          <input className={inputCls} value={form.issuer ?? ''} onChange={(e) => setForm((f) => ({ ...f, issuer: e.target.value }))} placeholder="Certiport / Pearson VUE" />
        </Field>
        <Field label="Icon (optional)">
          <div className="flex items-center gap-3">
            {form.iconUrl && <img src={form.iconUrl} alt="Icon" className="h-10 w-10 rounded-lg object-contain border border-neutral-200 dark:border-neutral-700" />}
            <button
              type="button"
              disabled={uploadingFor === 'cert-icon'}
              onClick={() => handleFileUpload('projects', 'cert-icon', (url) => setForm((f) => ({ ...f, iconUrl: url })))}
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-700 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              {uploadingFor === 'cert-icon' ? 'Uploading…' : 'Upload Icon'}
            </button>
            {form.iconUrl && (
              <button type="button" onClick={() => setForm((f) => ({ ...f, iconUrl: null }))} className="text-xs text-red-500 hover:underline">Remove</button>
            )}
          </div>
        </Field>
        <Field label="Credly URL (optional)">
          <input className={inputCls} value={form.credlyUrl ?? ''} onChange={(e) => setForm((f) => ({ ...f, credlyUrl: e.target.value }))} placeholder="https://credly.com/badges/…" />
        </Field>
        <Field label="Description">
          <textarea className={`${inputCls} min-h-[80px] resize-none`} value={form.description ?? ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Brief description…" />
        </Field>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => setModal(null)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">Cancel</button>
          <button onClick={onSave} disabled={saving} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    );
  }

  function ContactCardForm({ initial }: { initial?: ContactCard }) {
    const [form, setForm] = useState<Partial<ContactCard>>(initial ?? { iconType: 'location' });

    async function onSave() {
      setSaving(true);
      const res = initial
        ? await apiFetch(`/api/contact-cards/${initial.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        : await apiFetch('/api/contact-cards', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { await loadAll(); setModal(null); showToast(initial ? 'Card updated' : 'Card added'); }
      else { const d = await res.json(); showToast(d.error ?? 'Save failed', 'error'); }
      setSaving(false);
    }

    return (
      <div className="space-y-4">
        <Field label="Title">
          <input className={inputCls} value={form.title ?? ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Location" />
        </Field>
        <Field label="Value">
          <input className={inputCls} value={form.value ?? ''} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} placeholder="Davao City, Philippines" />
        </Field>
        <Field label="Icon">
          <select
            className={inputCls}
            value={form.iconType ?? 'location'}
            onChange={(e) => setForm((f) => ({ ...f, iconType: e.target.value }))}
          >
            <option value="location">Location</option>
            <option value="clock">Clock</option>
            <option value="briefcase">Briefcase</option>
          </select>
        </Field>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => setModal(null)} className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">Cancel</button>
          <button onClick={onSave} disabled={saving} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-emerald-500" />
      </div>
    );
  }

  return (
    <div className="bg-background dark:bg-green-950/20 min-h-screen">
      {/* ── Topbar ── */}
      <header className="sticky top-0 z-40 border-b border-neutral-200/60 bg-white/80 px-6 py-3 backdrop-blur-md dark:border-neutral-800/60 dark:bg-neutral-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <span className="font-semibold text-neutral-900 dark:text-neutral-50">CMS Dashboard</span>
            <span className="hidden rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 sm:block dark:bg-emerald-900/30 dark:text-emerald-400">
              {user?.username}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-full border border-neutral-200 bg-neutral-50 p-0.5 dark:border-neutral-700 dark:bg-neutral-800">
              {(['content', 'history'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-50'
                      : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
                  }`}
                >
                  {tab === 'history' ? 'Login History' : tab}
                </button>
              ))}
            </div>
            <a href="/" target="_blank" className="hidden rounded-lg border border-neutral-200 bg-white p-1.5 text-neutral-500 transition-all hover:border-emerald-300 hover:text-emerald-600 sm:block dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-emerald-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Login History Tab ── */}
      {activeTab === 'history' && (
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-8 flex items-center gap-4">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">Login History</h2>
            <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
          </div>
          <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white dark:border-neutral-800/50 dark:bg-neutral-900/80">
            {loginHistory.length === 0 ? (
              <p className="p-8 text-center text-sm text-neutral-500">No login history yet.</p>
            ) : (
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {loginHistory.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-4 px-5 py-3">
                    <div className={`h-2 w-2 flex-shrink-0 rounded-full ${entry.success ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${entry.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {entry.success ? 'Success' : 'Failed'}
                        </span>
                        {entry.reason && <span className="text-xs text-neutral-500">· {entry.reason}</span>}
                      </div>
                      <p className="truncate text-xs text-neutral-500">{entry.ipAddress} · {entry.userAgent?.slice(0, 60)}…</p>
                    </div>
                    <time className="flex-shrink-0 text-xs text-neutral-400">
                      {new Date(entry.createdAt).toLocaleString()}
                    </time>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Content Tab ── */}
      {activeTab === 'content' && (
        <main className="space-y-0">
          {/* ═══ HERO SECTION ═══ */}
          <section className="relative overflow-visible px-6 py-16">
            <div className="relative mx-auto max-w-5xl">
              <div className="mb-6 flex items-center gap-4">
                <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl md:text-3xl dark:text-neutral-50">Personal Info</h2>
                <div className="h-px flex-1 bg-linear-to-r from-neutral-200 to-transparent dark:from-neutral-800" />
                <button
                  onClick={() => setModal('personalInfo')}
                  className="flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-1.5 text-xs font-medium text-emerald-700 transition-all duration-200 hover:bg-emerald-500 hover:text-white dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              </div>

              {personalInfo ? (
                <div className="grid gap-6 rounded-2xl border border-neutral-100 bg-white p-6 sm:grid-cols-2 dark:border-neutral-800/50 dark:bg-neutral-900/80">
                  <div className="flex gap-4">
                    {personalInfo.photoUrl ? (
                      <img src={personalInfo.photoUrl} alt="Profile" className="h-20 w-20 flex-shrink-0 rounded-full object-cover ring-2 ring-emerald-400/50" />
                    ) : (
                      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-600 dark:bg-emerald-900/30">
                        {personalInfo.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{personalInfo.name}</p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">{personalInfo.role}</p>
                      <p className="mt-1 text-xs text-neutral-500">{personalInfo.location}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                    <p className="flex items-center gap-2">
                      <svg className="h-3.5 w-3.5 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {personalInfo.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="h-3.5 w-3.5 shrink-0 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      {personalInfo.linkedin}
                    </p>
                    <p className="flex items-center gap-2">
                      <svg className="h-3.5 w-3.5 shrink-0 text-neutral-400" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      {personalInfo.github}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium text-neutral-500 uppercase">Tagline</p>
                    <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{personalInfo.tagline}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium text-neutral-500 uppercase">Bio ({personalInfo.bio.length} paragraphs)</p>
                    <p className="mt-1 text-sm text-neutral-600 line-clamp-2 dark:text-neutral-400">{personalInfo.bio[0]}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-2xl border border-dashed border-neutral-200 p-12 dark:border-neutral-700">
                  <button onClick={() => setModal('personalInfo')} className="text-sm text-neutral-500 hover:text-emerald-500">
                    + Add personal info
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* ═══ ABOUT / SKILLS SECTION ═══ */}
          <section className="relative overflow-visible px-6 py-16">
            <div className="relative mx-auto max-w-5xl">
              <SectionHeader title="Skills" onAdd={() => { setEditingItem(null); setModal('skill'); }} addLabel="Add Skill Group" />
              <div className="space-y-4">
                {skillGroups.map((group) => (
                  <div
                    key={group.id}
                    className="group relative rounded-2xl border border-neutral-100 bg-white p-5 transition-all duration-300 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase dark:text-neutral-400">{group.category}</h3>
                      <ItemActions
                        onEdit={() => { setEditingItem(group as unknown as Record<string, unknown>); setModal('skill'); }}
                        onDelete={() => setConfirmDelete({ type: 'skill', id: group.id, label: `skill group "${group.category}"` })}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span key={item.id} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                          {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {skillGroups.length === 0 && (
                  <div className="flex items-center justify-center rounded-2xl border border-dashed border-neutral-200 p-12 dark:border-neutral-700">
                    <button onClick={() => { setEditingItem(null); setModal('skill'); }} className="text-sm text-neutral-500 hover:text-emerald-500">
                      + Add your first skill group
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ═══ PROJECTS SECTION ═══ */}
          <section className="relative overflow-visible px-6 py-16">
            <div className="relative mx-auto max-w-5xl">
              <SectionHeader title="Featured Projects" onAdd={() => { setEditingItem(null); setModal('project'); }} addLabel="Add Project" />
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <article
                    key={project.id}
                    className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50"
                  >
                    {/* Project image or placeholder */}
                    <div className="relative h-36 w-full overflow-hidden bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <svg className="h-12 w-12 text-emerald-300 dark:text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      {project.featured && (
                        <span className="absolute top-2 left-2 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-medium text-white">Featured</span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-neutral-900 group-hover:text-emerald-600 dark:text-neutral-50 dark:group-hover:text-emerald-400">{project.title}</h3>
                        <ItemActions
                          onEdit={() => { setEditingItem(project as unknown as Record<string, unknown>); setModal('project'); }}
                          onDelete={() => setConfirmDelete({ type: 'project', id: project.id, label: `project "${project.title}"` })}
                        />
                      </div>
                      <p className="mb-3 text-xs leading-relaxed text-neutral-600 line-clamp-2 dark:text-neutral-400">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
                <button
                  onClick={() => { setEditingItem(null); setModal('project'); }}
                  className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 text-sm text-neutral-400 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 dark:border-neutral-700 dark:bg-neutral-900/30 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
                >
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Project
                </button>
              </div>
            </div>
          </section>

          {/* ═══ EXPERIENCE SECTION ═══ */}
          <section className="relative overflow-visible px-6 py-16">
            <div className="relative mx-auto max-w-5xl">
              <SectionHeader title="Experience" onAdd={() => { setEditingItem(null); setModal('experience'); }} addLabel="Add Experience" />
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <article
                    key={exp.id}
                    className="group relative rounded-2xl border border-neutral-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 sm:p-6 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50"
                  >
                    <div className="mb-1 flex flex-col gap-1.5">
                      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
                        <h3 className="font-semibold text-neutral-900 group-hover:text-emerald-600 dark:text-neutral-50 dark:group-hover:text-emerald-400">{exp.role}</h3>
                        <div className="flex items-center gap-2">
                          <span className="shrink-0 whitespace-nowrap rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-xs text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">{exp.period}</span>
                          <ItemActions
                            onEdit={() => { setEditingItem(exp as unknown as Record<string, unknown>); setModal('experience'); }}
                            onDelete={() => setConfirmDelete({ type: 'experience', id: exp.id, label: `experience at "${exp.company}"` })}
                          />
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{exp.company} · {exp.location}</p>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {exp.description.map((item, i) => (
                        <li key={i} className="flex gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {exp.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">{tag}</span>
                      ))}
                    </div>
                  </article>
                ))}
                {experiences.length === 0 && (
                  <div className="flex items-center justify-center rounded-2xl border border-dashed border-neutral-200 p-12 dark:border-neutral-700">
                    <button onClick={() => { setEditingItem(null); setModal('experience'); }} className="text-sm text-neutral-500 hover:text-emerald-500">+ Add your first experience</button>
                  </div>
                )}
              </div>

              {/* ── Achievements ── */}
              <div className="mt-16">
                <SubSectionHeader title="Awards & Recognition" onAdd={() => { setEditingItem(null); setModal('achievement'); }} addLabel="Add Award" />
                <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
                  {achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className="group relative rounded-2xl border border-neutral-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 sm:p-5 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                        <ItemActions
                          onEdit={() => { setEditingItem(ach as unknown as Record<string, unknown>); setModal('achievement'); }}
                          onDelete={() => setConfirmDelete({ type: 'achievement', id: ach.id, label: `achievement "${ach.title}"` })}
                        />
                      </div>
                      <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-emerald-600 dark:text-neutral-50 dark:group-hover:text-emerald-400">{ach.title}</h4>
                      <p className="mt-1 text-xs text-neutral-500">{ach.event} · {ach.date}</p>
                      <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">{ach.description}</p>
                    </div>
                  ))}
                  <button
                    onClick={() => { setEditingItem(null); setModal('achievement'); }}
                    className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 text-xs text-neutral-400 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 dark:border-neutral-700 dark:bg-neutral-900/30 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Award
                  </button>
                </div>
              </div>

              {/* ── Certifications ── */}
              <div className="mt-16">
                <SubSectionHeader title="Certifications" onAdd={() => { setEditingItem(null); setModal('certification'); }} addLabel="Add Cert" />
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="group relative rounded-2xl border border-neutral-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 sm:p-5 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        {cert.iconUrl ? (
                          <img src={cert.iconUrl} alt={cert.issuer} className="h-8 w-8 rounded-lg object-contain" />
                        ) : (
                          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                          </div>
                        )}
                        <ItemActions
                          onEdit={() => { setEditingItem(cert as unknown as Record<string, unknown>); setModal('certification'); }}
                          onDelete={() => setConfirmDelete({ type: 'certification', id: cert.id, label: `certification "${cert.title}"` })}
                        />
                      </div>
                      <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-emerald-600 dark:text-neutral-50 dark:group-hover:text-emerald-400">{cert.title}</h4>
                      <p className="mt-1 text-xs text-neutral-500">{cert.issuer}</p>
                      <p className="mt-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">{cert.description}</p>
                      {cert.credlyUrl && <p className="mt-2 text-xs text-emerald-600 truncate dark:text-emerald-400">{cert.credlyUrl}</p>}
                    </div>
                  ))}
                  <button
                    onClick={() => { setEditingItem(null); setModal('certification'); }}
                    className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 text-xs text-neutral-400 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 dark:border-neutral-700 dark:bg-neutral-900/30 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Certification
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ CONTACT SECTION ═══ */}
          <section className="relative overflow-visible px-6 py-16">
            <div className="relative mx-auto max-w-5xl">
              <SectionHeader title="Contact Cards" onAdd={() => { setEditingItem(null); setModal('contactCard'); }} addLabel="Add Card" />
              <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
                {contactCards.map((card) => (
                  <div
                    key={card.id}
                    className="group relative rounded-2xl border border-neutral-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/15 sm:p-5 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:hover:border-emerald-500/50"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                        {card.iconType === 'location' && <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        {card.iconType === 'clock' && <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        {card.iconType === 'briefcase' && <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                      </div>
                      <ItemActions
                        onEdit={() => { setEditingItem(card as unknown as Record<string, unknown>); setModal('contactCard'); }}
                        onDelete={() => setConfirmDelete({ type: 'contactCard', id: card.id, label: `card "${card.title}"` })}
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">{card.title}</h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">{card.value}</p>
                  </div>
                ))}
                <button
                  onClick={() => { setEditingItem(null); setModal('contactCard'); }}
                  className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 text-xs text-neutral-400 transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 dark:border-neutral-700 dark:bg-neutral-900/30 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Card
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ── Modals ── */}
      {modal === 'personalInfo' && (
        <Modal title="Edit Personal Info" onClose={() => setModal(null)}>
          <PersonalInfoForm />
        </Modal>
      )}
      {modal === 'skill' && (
        <Modal title={editingItem ? 'Edit Skill Group' : 'Add Skill Group'} onClose={() => setModal(null)}>
          <SkillForm initial={editingItem ? (editingItem as unknown as SkillGroup) : undefined} />
        </Modal>
      )}
      {modal === 'project' && (
        <Modal title={editingItem ? 'Edit Project' : 'Add Project'} onClose={() => setModal(null)}>
          <ProjectForm initial={editingItem ? (editingItem as unknown as Project) : undefined} />
        </Modal>
      )}
      {modal === 'experience' && (
        <Modal title={editingItem ? 'Edit Experience' : 'Add Experience'} onClose={() => setModal(null)}>
          <ExperienceForm initial={editingItem ? (editingItem as unknown as Experience) : undefined} />
        </Modal>
      )}
      {modal === 'achievement' && (
        <Modal title={editingItem ? 'Edit Achievement' : 'Add Achievement'} onClose={() => setModal(null)}>
          <AchievementForm initial={editingItem ? (editingItem as unknown as Achievement) : undefined} />
        </Modal>
      )}
      {modal === 'certification' && (
        <Modal title={editingItem ? 'Edit Certification' : 'Add Certification'} onClose={() => setModal(null)}>
          <CertificationForm initial={editingItem ? (editingItem as unknown as Certification) : undefined} />
        </Modal>
      )}
      {modal === 'contactCard' && (
        <Modal title={editingItem ? 'Edit Contact Card' : 'Add Contact Card'} onClose={() => setModal(null)}>
          <ContactCardForm initial={editingItem ? (editingItem as unknown as ContactCard) : undefined} />
        </Modal>
      )}

      {/* ── Confirm Delete ── */}
      {confirmDelete && (
        <ConfirmDialog
          message={`Are you sure you want to delete this ${confirmDelete.label}? This cannot be undone.`}
          onConfirm={() => deleteItem(confirmDelete.type, confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg transition-all duration-300 ${
            toast.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/50 dark:text-red-300'
          }`}
        >
          {toast.type === 'success' ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
