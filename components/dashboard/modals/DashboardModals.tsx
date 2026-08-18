'use client';

import { ConfirmDialog, Modal } from '@/components/dashboard/ui';
import type { DeleteTarget, ModalKey, ShowToast } from '@/lib/dashboard/types';
import { MODALS } from './registry';

/**
 * Single mount point for every dashboard dialog. `modal` selects the form from
 * the registry; `confirmDelete` is independent so a delete prompt can sit on top
 * of nothing else.
 */
export function DashboardModals({
  modal,
  editingItem,
  confirmDelete,
  saving,
  showToast,
  onClose,
  onConfirmDelete,
  onCancelDelete
}: {
  modal: string | null;
  editingItem: Record<string, unknown> | null;
  confirmDelete: DeleteTarget | null;
  saving: boolean;
  showToast: ShowToast;
  onClose: () => void;
  onConfirmDelete: (target: DeleteTarget) => void;
  onCancelDelete: () => void;
}) {
  const active = modal ? MODALS[modal as ModalKey] : undefined;

  return (
    <>
      {active && (
        <Modal
          title={active.title(!!editingItem)}
          onClose={onClose}
          saving={saving}
          maxWidthCls={active.maxWidthCls}
        >
          {active.render(editingItem, { close: onClose, showToast })}
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmDialog
          message={`Are you sure you want to delete this ${confirmDelete.label}? This cannot be undone.`}
          onConfirm={() => onConfirmDelete(confirmDelete)}
          onCancel={onCancelDelete}
        />
      )}
    </>
  );
}
