'use client';

import { EmptyState, LoadingRow, panelCls } from '@/components/dashboard/ui';
import type { ShowToast, TrackingLink } from '@/lib/dashboard/types';
import { LinkRow } from './LinkRow';

export function LinkList({
  links,
  loading,
  onEdit,
  onDelete,
  showToast
}: {
  links: TrackingLink[];
  loading: boolean;
  onEdit: (link: TrackingLink) => void;
  onDelete: (link: TrackingLink) => void;
  showToast: ShowToast;
}) {
  return (
    <div className={panelCls}>
      {loading ? (
        <LoadingRow label="Loading links" />
      ) : links.length === 0 ? (
        <EmptyState message="No links yet — create one above to start tracking where visitors come from" />
      ) : (
        <div className="divide-y divide-black/10 dark:divide-white/10">
          {links.map((link) => (
            <LinkRow
              key={link.id}
              link={link}
              onEdit={() => onEdit(link)}
              onDelete={() => onDelete(link)}
              showToast={showToast}
            />
          ))}
        </div>
      )}
    </div>
  );
}
