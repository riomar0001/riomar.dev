'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DashboardContextType } from '@/lib/dashboard/context';
import type { DashboardTab, DeleteTarget } from '@/lib/dashboard/types';
import { useAuthGuard } from './useAuthGuard';
import { useDashboardData } from './useDashboardData';
import { useToast } from './useToast';

/**
 * Composes the dashboard's page-level state: content data, auth, the active
 * tab, the open dialog and toasts. Returns the value for DashboardContext plus
 * the extras the page shell itself renders.
 */
export function useDashboardShell() {
  const data = useDashboardData();
  const { toast, showToast } = useToast();

  const [activeTab, setActiveTab] = useState<DashboardTab>('content');
  const [modal, setModal] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<DeleteTarget | null>(null);
  const [saving, setSaving] = useState(false);

  const { loadAll, deleteItem, reloadVisitorStats } = data;
  const { user, authChecked, logout } = useAuthGuard(loadAll);

  // Stats are loaded once with the dashboard; refresh them whenever the
  // Visitors tab is opened so new visits show up without a full reload
  useEffect(() => {
    if (activeTab === 'visitors') reloadVisitorStats();
  }, [activeTab, reloadVisitorStats]);

  const closeModal = useCallback(() => setModal(null), []);

  const confirmDeleteItem = useCallback(async (target: DeleteTarget) => {
    const ok = await deleteItem(target.type, target.id);
    showToast(ok ? 'Deleted successfully' : 'Delete failed', ok ? 'success' : 'error');
    setConfirmDelete(null);
  }, [deleteItem, showToast]);

  const contextValue = useMemo<DashboardContextType>(() => ({
    personalInfo: data.personalInfo,
    skillGroups: data.skillGroups,
    projects: data.projects,
    experiences: data.experiences,
    achievements: data.achievements,
    certifications: data.certifications,
    contactCards: data.contactCards,
    saving,
    setSaving,
    setModal,
    setEditingItem,
    setConfirmDelete,
    loadAll: data.loadAll,
    reloadPersonalInfo: data.reloadPersonalInfo,
    reloadSkills: data.reloadSkills,
    reloadProjects: data.reloadProjects,
    reloadExperiences: data.reloadExperiences,
    reloadAchievements: data.reloadAchievements,
    reloadCertifications: data.reloadCertifications,
    reloadContactCards: data.reloadContactCards,
    showToast
  }), [data, saving, showToast]);

  return {
    contextValue,
    user,
    authChecked,
    logout,
    activeTab,
    setActiveTab,
    loginHistory: data.loginHistory,
    visitorStats: data.visitorStats,
    modal,
    editingItem,
    confirmDelete,
    saving,
    toast,
    showToast,
    openChangePassword: useCallback(() => setModal('changePassword'), []),
    closeModal,
    confirmDeleteItem,
    cancelDelete: useCallback(() => setConfirmDelete(null), [])
  };
}
