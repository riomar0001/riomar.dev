'use client';

import { createContext, useContext } from 'react';
import type {
  PersonalInfo, SkillGroup, Project, Experience,
  Achievement, Certification, ContactCard
} from '@/lib/dashboard/types';

export type DashboardContextType = {
  // Data
  personalInfo: PersonalInfo | null;
  skillGroups: SkillGroup[];
  projects: Project[];
  experiences: Experience[];
  achievements: Achievement[];
  certifications: Certification[];
  contactCards: ContactCard[];
  // Modal / UI state
  saving: boolean;
  setSaving: (v: boolean) => void;
  setModal: (v: string | null) => void;
  setEditingItem: (v: Record<string, unknown> | null) => void;
  setConfirmDelete: (v: { type: string; id: string; label: string } | null) => void;
  // Actions
  loadAll: () => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
};

export const DashboardContext = createContext<DashboardContextType | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used inside DashboardContext.Provider');
  return ctx;
}
