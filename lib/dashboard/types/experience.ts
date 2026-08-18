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

export type Achievement = {
  id: string;
  title: string;
  event: string;
  date?: string | null;
  description: string;
  imageUrl?: string | null;
  imagePosition?: string | null;
  imageZoom?: number | null;
  link?: string | null;
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  iconUrl?: string | null;
  credlyUrl?: string | null;
  description: string;
};
