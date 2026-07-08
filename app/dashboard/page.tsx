'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { apiFetch } from '@/lib/dashboard/api';
import { DashboardContext } from '@/lib/dashboard/context';
import type {
  PersonalInfo, SkillGroup, Project, Experience,
  Achievement, Certification, ContactCard, LoginHistory, VisitorStats
} from '@/lib/dashboard/types';

import Background from '@/components/Background';
import { firaCode } from '@/lib/fonts';
import DashboardHeader, { type DashboardTab } from '@/components/dashboard/DashboardHeader';
import LoginHistoryTab from '@/components/dashboard/LoginHistoryTab';
import VisitorLogTab from '@/components/dashboard/VisitorLogTab';
import LinksTab from '@/components/dashboard/LinksTab';
import { ConfirmDialog, Modal } from '@/components/dashboard/ui';
import ChangePasswordForm from '@/components/dashboard/forms/ChangePasswordForm';
import PersonalInfoForm from '@/components/dashboard/forms/PersonalInfoForm';
import ProfilePhotoForm from '@/components/dashboard/forms/ProfilePhotoForm';
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
  const [activeTab, setActiveTab] = useState<DashboardTab>('content');

  // Data
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [contactCards, setContactCards] = useState<ContactCard[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);

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

  const reloadPersonalInfo = useCallback(async () => {
    const pi = await apiFetch('/api/personal-info').then((r) => r.json()).catch(() => null);
    if (pi && !pi.error) setPersonalInfo(pi);
  }, []);

  const reloadSkills = useCallback(async () => {
    const sg = await apiFetch('/api/skills').then((r) => r.json()).catch(() => null);
    if (Array.isArray(sg)) setSkillGroups(sg);
  }, []);

  const reloadProjects = useCallback(async () => {
    const pr = await apiFetch('/api/projects').then((r) => r.json()).catch(() => null);
    if (Array.isArray(pr)) setProjects(pr);
  }, []);

  const reloadExperiences = useCallback(async () => {
    const ex = await apiFetch('/api/experiences').then((r) => r.json()).catch(() => null);
    if (Array.isArray(ex)) setExperiences(ex);
  }, []);

  const reloadAchievements = useCallback(async () => {
    const ac = await apiFetch('/api/achievements').then((r) => r.json()).catch(() => null);
    if (Array.isArray(ac)) setAchievements(ac);
  }, []);

  const reloadCertifications = useCallback(async () => {
    const ce = await apiFetch('/api/certifications').then((r) => r.json()).catch(() => null);
    if (Array.isArray(ce)) setCertifications(ce);
  }, []);

  const reloadContactCards = useCallback(async () => {
    const cc = await apiFetch('/api/contact-cards').then((r) => r.json()).catch(() => null);
    if (Array.isArray(cc)) setContactCards(cc);
  }, []);

  const reloadVisitorStats = useCallback(async () => {
    const vs = await apiFetch('/api/visitor/stats').then((r) => r.json()).catch(() => null);
    if (vs && !vs.error) setVisitorStats(vs);
  }, []);

  // Stats are loaded once with the dashboard; refresh them whenever the
  // Visitors tab is opened so new visits show up without a full reload
  useEffect(() => {
    if (activeTab === 'visitors') reloadVisitorStats();
  }, [activeTab, reloadVisitorStats]);

  const loadAll = useCallback(async () => {
    const [pi, sg, pr, ex, ac, ce, cc, lh, vs] = await Promise.all([
      apiFetch('/api/personal-info').then((r) => r.json()).catch(() => null),
      apiFetch('/api/skills').then((r) => r.json()).catch(() => []),
      apiFetch('/api/projects').then((r) => r.json()).catch(() => []),
      apiFetch('/api/experiences').then((r) => r.json()).catch(() => []),
      apiFetch('/api/achievements').then((r) => r.json()).catch(() => []),
      apiFetch('/api/certifications').then((r) => r.json()).catch(() => []),
      apiFetch('/api/contact-cards').then((r) => r.json()).catch(() => []),
      apiFetch('/api/auth/login-history').then((r) => r.json()).catch(() => []),
      apiFetch('/api/visitor/stats').then((r) => r.json()).catch(() => null)
    ]);
    if (pi && !pi.error) setPersonalInfo(pi);
    if (Array.isArray(sg)) setSkillGroups(sg);
    if (Array.isArray(pr)) setProjects(pr);
    if (Array.isArray(ex)) setExperiences(ex);
    if (Array.isArray(ac)) setAchievements(ac);
    if (Array.isArray(ce)) setCertifications(ce);
    if (Array.isArray(cc)) setContactCards(cc);
    if (Array.isArray(lh)) setLoginHistory(lh);
    if (vs && !vs.error) setVisitorStats(vs);
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
    const reloaders: Record<string, () => Promise<void>> = {
      skill: reloadSkills,
      project: reloadProjects,
      experience: reloadExperiences,
      achievement: reloadAchievements,
      certification: reloadCertifications,
      contactCard: reloadContactCards
    };
    const res = await apiFetch(endpoints[type], { method: 'DELETE' });
    if (res.ok) { await reloaders[type]?.(); showToast('Deleted successfully'); }
    else showToast('Delete failed', 'error');
    setConfirmDelete(null);
  }

  if (!authChecked) {
    return (
      <div className={`${firaCode.variable} dashboard-root flex min-h-screen items-center justify-center bg-white text-black dark:bg-black dark:text-white`}>
        <div className="flex items-center gap-2.5 font-mono text-xs tracking-widest uppercase opacity-60">
          <span className="inline-block h-[7px] w-[7px] animate-blink bg-black dark:bg-white" />
          Authenticating
        </div>
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={{
      personalInfo, skillGroups, projects, experiences,
      achievements, certifications, contactCards,
      saving, setSaving, setModal, setEditingItem, setConfirmDelete,
      loadAll, reloadPersonalInfo, reloadSkills, reloadProjects,
      reloadExperiences, reloadAchievements, reloadCertifications, reloadContactCards,
      showToast
    }}>
      <div className={`${firaCode.variable} dashboard-root relative min-h-screen bg-white text-black dark:bg-black dark:text-white`}>
        <Background />
        <DashboardHeader
          username={user?.username}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onChangePassword={() => setModal('changePassword')}
          onLogout={handleLogout}
        />

        {activeTab === 'history' && <LoginHistoryTab loginHistory={loginHistory} />}
        {activeTab === 'visitors' && <VisitorLogTab stats={visitorStats} />}
        {activeTab === 'links' && <LinksTab showToast={showToast} />}

        {activeTab === 'content' && (
          <main className="relative z-10">
            <PersonalInfoSection />
            <SkillsSection />
            <ProjectsSection />
            <ExperienceSection />
            <ContactSection />
          </main>
        )}

        {/* Modals */}
        {modal === 'personalInfo' && (
          <Modal title="Edit Personal Info" onClose={() => setModal(null)} saving={saving}>
            <PersonalInfoForm />
          </Modal>
        )}
        {modal === 'profilePhoto' && (
          <Modal title="Profile Photo" onClose={() => setModal(null)} saving={saving}>
            <ProfilePhotoForm />
          </Modal>
        )}
        {modal === 'skill' && (
          <Modal title={editingItem ? 'Edit Skill Group' : 'Add Skill Group'} onClose={() => setModal(null)} saving={saving}>
            <SkillForm initial={editingItem ? (editingItem as unknown as SkillGroup) : undefined} />
          </Modal>
        )}
        {modal === 'project' && (
          <Modal title={editingItem ? 'Edit Project' : 'Add Project'} onClose={() => setModal(null)} saving={saving}>
            <ProjectForm initial={editingItem ? (editingItem as unknown as Project) : undefined} />
          </Modal>
        )}
        {modal === 'experience' && (
          <Modal title={editingItem ? 'Edit Experience' : 'Add Experience'} onClose={() => setModal(null)} saving={saving}>
            <ExperienceForm initial={editingItem ? (editingItem as unknown as Experience) : undefined} />
          </Modal>
        )}
        {modal === 'achievement' && (
          <Modal title={editingItem ? 'Edit Achievement' : 'Add Achievement'} onClose={() => setModal(null)} saving={saving}>
            <AchievementForm initial={editingItem ? (editingItem as unknown as Achievement) : undefined} />
          </Modal>
        )}
        {modal === 'certification' && (
          <Modal title={editingItem ? 'Edit Certification' : 'Add Certification'} onClose={() => setModal(null)} saving={saving}>
            <CertificationForm initial={editingItem ? (editingItem as unknown as Certification) : undefined} />
          </Modal>
        )}
        {modal === 'contactCard' && (
          <Modal title={editingItem ? 'Edit Contact Card' : 'Add Contact Card'} onClose={() => setModal(null)} saving={saving}>
            <ContactCardForm initial={editingItem ? (editingItem as unknown as ContactCard) : undefined} />
          </Modal>
        )}

        {modal === 'changePassword' && (
          <Modal title="Change Password" onClose={() => setModal(null)} saving={saving}>
            <ChangePasswordForm onClose={() => setModal(null)} showToast={showToast} />
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
          <div className={`animate-fade-in-up fixed right-4 bottom-4 z-50 flex items-center gap-2.5 border px-4 py-3 font-mono text-xs tracking-wide shadow-lg ${
            toast.type === 'success'
              ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
              : 'border-red-500 bg-red-500 text-white'
          }`}>
            <span className="inline-block h-[7px] w-[7px] bg-current opacity-80" />
            {toast.msg}
          </div>
        )}
      </div>
    </DashboardContext.Provider>
  );
}
