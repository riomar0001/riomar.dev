export type TrackingLink = {
  id: string;
  label: string;
  source: string;
  sourceDetail?: string | null;
  createdAt: string;
  clicks: number;
  lastClickAt?: string | null;
};

/** Draft state of the create/edit form — all fields are strings while editing. */
export type TrackingLinkDraft = { label: string; source: string; sourceDetail: string };
