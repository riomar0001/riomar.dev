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
