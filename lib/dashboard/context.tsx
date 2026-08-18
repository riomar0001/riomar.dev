'use client';

import { createContext, useContext } from 'react';
import type {
  Achievement, Certification, ContactCard, DeleteTarget, Experience,
  PersonalInfo, Project, ShowToast, SkillGroup
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
  setConfirmDelete: (v: DeleteTarget | null) => void;
  // Actions
  loadAll: () => Promise<void>;
  reloadPersonalInfo: () => Promise<void>;
  reloadSkills: () => Promise<void>;
  reloadProjects: () => Promise<void>;
  reloadExperiences: () => Promise<void>;
  reloadAchievements: () => Promise<void>;
  reloadCertifications: () => Promise<void>;
  reloadContactCards: () => Promise<void>;
  showToast: ShowToast;
};

export const DashboardContext = createContext<DashboardContextType | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used inside DashboardContext.Provider');
  return ctx;
}
