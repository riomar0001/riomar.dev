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
  return (
    <div className="flex justify-end gap-3 pt-2">
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
