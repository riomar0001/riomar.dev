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
  resumeUrl?: string | null;
};

export type SkillItem = { id: string; name: string; order: number };
export type SkillGroup = { id: string; category: string; order: number; items: SkillItem[] };

export type Project = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
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

export type Achievement = { id: string; title: string; event: string; date: string; description: string };
export type Certification = { id: string; title: string; issuer: string; iconUrl?: string | null; credlyUrl?: string | null; description: string };
export type ContactCard = { id: string; title: string; value: string; iconType: string };
export type LoginHistory = { id: string; ipAddress?: string; userAgent?: string; success: boolean; reason?: string; createdAt: string };
export type VisitorLog = { id: string; ipAddress: string; country?: string; countryCode?: string; region?: string; city?: string; isp?: string; page: string; userAgent?: string; createdAt: string };
