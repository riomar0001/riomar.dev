'use client';

import { useState } from 'react';
import { ConfirmDialog, TabHeader, TabShell } from '@/components/dashboard/ui';
import { useTrackingLinks } from '@/lib/dashboard/hooks';
import type { ShowToast, TrackingLink } from '@/lib/dashboard/types';
import { LinkForm } from '@/components/dashboard/links/LinkForm';
import { LinkList } from '@/components/dashboard/links/LinkList';

export default function LinksTab({ showToast }: { showToast: ShowToast }) {
  const { links, loading, totalClicks, draft, setDraft, editingId, saving, save, remove, startEdit, resetDraft } =
    useTrackingLinks(showToast);
  const [confirmDelete, setConfirmDelete] = useState<TrackingLink | null>(null);

  async function handleDelete(link: TrackingLink) {
    await remove(link);
    setConfirmDelete(null);
  }

  return (
    <TabShell>
      <TabHeader
        eyebrow="Tracking"
        title="Shareable Links"
        aside={
          !loading && links.length > 0
            ? `${links.length} link${links.length === 1 ? '' : 's'} · ${totalClicks.toLocaleString()} clicks`
            : undefined
        }
      />

      <LinkForm
        draft={draft}
        onChange={setDraft}
        onSave={save}
        onCancel={resetDraft}
        editing={!!editingId}
        saving={saving}
      />

      <LinkList
        links={links}
        loading={loading}
        onEdit={startEdit}
        onDelete={setConfirmDelete}
        showToast={showToast}
      />

      {confirmDelete && (
        <ConfirmDialog
          message={`Are you sure you want to delete the link "${confirmDelete.label}"? Existing visitor logs keep their source data; only the shareable link entry is removed.`}
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </TabShell>
  );
}
