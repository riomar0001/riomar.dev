import { Spinner } from './Spinner';
import { btnGhostCls, btnPrimaryCls } from './styles';

export function FormActions({
  onCancel,
  onSave,
  saving,
  saveLabel = 'Save',
  savingLabel = 'Saving…'
}: {
  onCancel: () => void;
  onSave: () => void;
  saving?: boolean;
  saveLabel?: string;
  savingLabel?: string;
}) {
  /*
   * Pinned to the bottom of the dialog's scroll area so Save stays reachable in
   * tall forms. The negative margins bleed the bar out to the edges of the
   * modal body's p-6 padding — every consumer is a dialog form.
   */
  return (
    <div className="sticky bottom-0 z-10 -mx-6 -mb-6 flex justify-end gap-3 border-t border-black/10 bg-white px-6 py-4 dark:border-white/10 dark:bg-black">
      <button type="button" onClick={onCancel} disabled={saving} className={btnGhostCls}>
        Cancel
      </button>
      <button type="button" onClick={onSave} disabled={saving} className={btnPrimaryCls}>
        {saving && <Spinner />}
        {saving ? savingLabel : saveLabel}
      </button>
    </div>
  );
}
