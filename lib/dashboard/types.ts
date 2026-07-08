export type PersonalInfo = {
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
  photoPosition?: string | null;
  photoZoom?: number | null;
  resumeUrl?: string | null;
};

export type SkillItem = { id: string; name: string; order: number };
export type SkillGroup = { id: string; category: string; order: number; items: SkillItem[] };

export type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  imagePosition?: string | null;
  imageZoom?: number | null;
  tags: string[];
  link?: string | null;
  github?: string | null;
  featured: boolean;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  tags: string[];
  link?: string | null;
};

export type Achievement = { id: string; title: string; event: string; date?: string | null; description: string; imageUrl?: string | null; imagePosition?: string | null; imageZoom?: number | null; link?: string | null };
export type Certification = { id: string; title: string; issuer: string; iconUrl?: string | null; credlyUrl?: string | null; description: string };
export type ContactCard = { id: string; title: string; value: string; iconType: string };
export type LoginHistory = { id: string; ipAddress?: string; userAgent?: string; success: boolean; reason?: string; createdAt: string };
export type VisitorLog = { id: string; ipAddress: string; country?: string; countryCode?: string; region?: string; city?: string; isp?: string; page: string; source?: string; sourceDetail?: string; referrer?: string; userAgent?: string; createdAt: string };

export type TrackingLink = {
  id: string;
  label: string;
  source: string;
  sourceDetail?: string | null;
  createdAt: string;
  clicks: number;
  lastClickAt?: string | null;
};

export type VisitorStats = {
  summary: { total: number; today: number; uniqueIps: number; countries: number };
  daily: { date: string; count: number }[];
  topCountries: { country: string; countryCode: string; count: number }[];
  topPages: { page: string; count: number }[];
  topSources: { source: string; count: number }[];
};
