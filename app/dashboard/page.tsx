'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { apiFetch } from '@/lib/dashboard/api';
import { DashboardContext } from '@/lib/dashboard/context';
import type {
  PersonalInfo, SkillGroup, Project, Experience,
  Achievement, Certification, ContactCard, LoginHistory
} from '@/lib/dashboard/types';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoginHistoryTab from '@/components/dashboard/LoginHistoryTab';
import { ConfirmDialog, Modal } from '@/components/dashboard/ui';
import PersonalInfoForm from '@/components/dashboard/forms/PersonalInfoForm';
import SkillForm from '@/components/dashboard/forms/SkillForm';
import ProjectForm from '@/components/dashboard/forms/ProjectForm';
import ExperienceForm from '@/components/dashboard/forms/ExperienceForm';
import AchievementForm from '@/components/dashboard/forms/AchievementForm';
import CertificationForm from '@/components/dashboard/forms/CertificationForm';
import ContactCardForm from '@/components/dashboard/forms/ContactCardForm';
import PersonalInfoSection from '@/components/dashboard/sections/PersonalInfoSection';
import SkillsSection from '@/components/dashboard/sections/SkillsSection';
import ProjectsSection from '@/components/dashboard/sections/ProjectsSection';
import ExperienceSection from '@/components/dashboard/sections/ExperienceSection';
import ContactSection from '@/components/dashboard/sections/ContactSection';

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<{ username: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'history'>('content');

  // Data
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [contactCards, setContactCards] = useState<ContactCard[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);

  // Modal state
  const [modal, setModal] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string; label: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

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

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch('/api/auth/me');
        if (!res.ok) { router.push('/dashboard/login'); return; }
        setUser(await res.json());
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
    if (res.ok) { await loadAll(); showToast('Deleted successfully'); }
    else showToast('Delete failed', 'error');
    setConfirmDelete(null);
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-emerald-500" />
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={{
      personalInfo, skillGroups, projects, experiences,
      achievements, certifications, contactCards,
      saving, setSaving, setModal, setEditingItem, setConfirmDelete,
      loadAll, showToast
    }}>
      <div className="bg-background dark:bg-green-950/20 min-h-screen">
        <DashboardHeader
          username={user?.username}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />

        {activeTab === 'history' && <LoginHistoryTab loginHistory={loginHistory} />}

        {activeTab === 'content' && (
          <main className="space-y-0">
            <PersonalInfoSection />
            <SkillsSection />
            <ProjectsSection />
            <ExperienceSection />
            <ContactSection />
          </main>
        )}

        {/* Modals */}
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

        {/* Confirm Delete */}
        {confirmDelete && (
          <ConfirmDialog
            message={`Are you sure you want to delete this ${confirmDelete.label}? This cannot be undone.`}
            onConfirm={() => deleteItem(confirmDelete.type, confirmDelete.id)}
            onCancel={() => setConfirmDelete(null)}
          />
        )}

        {/* Toast */}
        {toast && (
          <div className={`fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg transition-all duration-300 ${
            toast.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
              : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/50 dark:text-red-300'
          }`}>
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
    </DashboardContext.Provider>
  );
}
