import type { TrackingLink, TrackingLinkDraft } from '@/lib/dashboard/types';

export const SLUG_RE = /^[a-z0-9][a-z0-9_.-]{0,49}$/;

export const EMPTY_LINK_DRAFT: TrackingLinkDraft = { label: '', source: '', sourceDetail: '' };

/** Live-normalize free text into a valid tracking slug as the user types. */
export function slugify(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_.-]/g, '').slice(0, 50);
}

/** Shareable /clicked URL for a link. Origin is empty during SSR. */
export function linkUrl(link: Pick<TrackingLink, 'source' | 'sourceDetail'>): string {
  const origin = typeof window === 'undefined' ? '' : window.location.origin;
  const params = new URLSearchParams({ from: link.source });
  if (link.sourceDetail) params.set('application-from', link.sourceDetail);
  return `${origin}/clicked?${params.toString()}`;
}

/** Returns an error message, or null when the draft is safe to submit. */
export function validateLinkDraft(draft: TrackingLinkDraft): string | null {
  if (!draft.label.trim()) return 'Label is required';
  if (!SLUG_RE.test(draft.source)) return 'Source is required (lowercase slug)';
  return null;
}
