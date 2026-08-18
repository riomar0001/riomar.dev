'use client';

import { useCallback, useMemo, useState } from 'react';
import { AUTH_ENDPOINTS, COLLECTION_ENDPOINTS, VISITOR_ENDPOINTS, apiFetch, fetchJson, itemEndpoint } from '@/lib/dashboard/api';
import type {
  Achievement, Certification, ContactCard, Experience, LoginHistory,
  PersonalInfo, Project, ResourceType, SkillGroup, VisitorStats
} from '@/lib/dashboard/types';

/** Singleton payloads answer with `{ error }` instead of 404 — treat those as "no data". */
function isRecord(value: unknown): boolean {
  return !!value && typeof value === 'object' && !('error' in (value as object));
}

/**
 * Owns every piece of dashboard content: the resource state, the per-resource
 * reloaders the forms call after saving, the initial parallel load, and delete.
 */
export function useDashboardData() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [contactCards, setContactCards] = useState<ContactCard[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);

  /** Refetch one list endpoint; a failed/mis-shaped response leaves state alone. */
  const reloadList = useCallback(
    async <T>(url: string, set: (rows: T[]) => void) => {
      const rows = await fetchJson<T[] | null>(url, null);
      if (Array.isArray(rows)) set(rows);
    },
    []
  );

  const reloadPersonalInfo = useCallback(async () => {
    const pi = await fetchJson<PersonalInfo | null>(COLLECTION_ENDPOINTS.personalInfo, null);
    if (isRecord(pi)) setPersonalInfo(pi);
  }, []);

  const reloadSkills = useCallback(() => reloadList(COLLECTION_ENDPOINTS.skill, setSkillGroups), [reloadList]);
  const reloadProjects = useCallback(() => reloadList(COLLECTION_ENDPOINTS.project, setProjects), [reloadList]);
  const reloadExperiences = useCallback(() => reloadList(COLLECTION_ENDPOINTS.experience, setExperiences), [reloadList]);
  const reloadAchievements = useCallback(() => reloadList(COLLECTION_ENDPOINTS.achievement, setAchievements), [reloadList]);
  const reloadCertifications = useCallback(() => reloadList(COLLECTION_ENDPOINTS.certification, setCertifications), [reloadList]);
  const reloadContactCards = useCallback(() => reloadList(COLLECTION_ENDPOINTS.contactCard, setContactCards), [reloadList]);
  const reloadLoginHistory = useCallback(() => reloadList(AUTH_ENDPOINTS.loginHistory, setLoginHistory), [reloadList]);

  const reloadVisitorStats = useCallback(async () => {
    const vs = await fetchJson<VisitorStats | null>(VISITOR_ENDPOINTS.stats, null);
    if (isRecord(vs)) setVisitorStats(vs);
  }, []);

  /** Reloader to run after a given resource is created, updated or deleted. */
  const reloaders = useMemo<Record<ResourceType, () => Promise<void>>>(() => ({
    skill: reloadSkills,
    project: reloadProjects,
    experience: reloadExperiences,
    achievement: reloadAchievements,
    certification: reloadCertifications,
    contactCard: reloadContactCards
  }), [reloadSkills, reloadProjects, reloadExperiences, reloadAchievements, reloadCertifications, reloadContactCards]);

  const loadAll = useCallback(async () => {
    await Promise.all([
      reloadPersonalInfo(),
      reloadSkills(),
      reloadProjects(),
      reloadExperiences(),
      reloadAchievements(),
      reloadCertifications(),
      reloadContactCards(),
      reloadLoginHistory(),
      reloadVisitorStats()
    ]);
  }, [
    reloadPersonalInfo, reloadSkills, reloadProjects, reloadExperiences, reloadAchievements,
    reloadCertifications, reloadContactCards, reloadLoginHistory, reloadVisitorStats
  ]);

  /** Deletes a record and refreshes its list. Resolves to whether it succeeded. */
  const deleteItem = useCallback(async (type: string, id: string) => {
    const endpoint = COLLECTION_ENDPOINTS[type as ResourceType] ? itemEndpoint(type as ResourceType, id) : null;
    if (!endpoint) return false;
    const res = await apiFetch(endpoint, { method: 'DELETE' });
    if (res.ok) await reloaders[type as ResourceType]?.();
    return res.ok;
  }, [reloaders]);

  return {
    personalInfo, skillGroups, projects, experiences,
    achievements, certifications, contactCards, loginHistory, visitorStats,
    loadAll, deleteItem,
    reloadPersonalInfo, reloadSkills, reloadProjects, reloadExperiences,
    reloadAchievements, reloadCertifications, reloadContactCards,
    reloadLoginHistory, reloadVisitorStats
  };
}
