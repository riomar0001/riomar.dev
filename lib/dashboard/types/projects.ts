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
