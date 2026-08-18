import type { ResourceType } from '@/lib/dashboard/types';

/** Collection endpoint per resource — POST to create, GET to list. */
export const COLLECTION_ENDPOINTS = {
  personalInfo: '/api/personal-info',
  skill: '/api/skills',
  project: '/api/projects',
  experience: '/api/experiences',
  achievement: '/api/achievements',
  certification: '/api/certifications',
  contactCard: '/api/contact-cards'
} as const satisfies Record<ResourceType | 'personalInfo', string>;

/** Item endpoint for a single record — PUT to update, DELETE to remove. */
export function itemEndpoint(type: ResourceType, id: string): string {
  return `${COLLECTION_ENDPOINTS[type]}/${id}`;
}

export const AUTH_ENDPOINTS = {
  me: '/api/auth/me',
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  refresh: '/api/auth/refresh',
  changePassword: '/api/auth/change-password',
  loginHistory: '/api/auth/login-history'
} as const;

export const VISITOR_ENDPOINTS = {
  logs: '/api/visitor',
  stats: '/api/visitor/stats'
} as const;

export const LINK_ENDPOINTS = {
  collection: '/api/links',
  item: (id: string) => `/api/links/${id}`
} as const;
