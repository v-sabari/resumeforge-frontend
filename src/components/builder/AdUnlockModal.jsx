import { Modal } from '../common/Modal';
import { Alert } from '../common/Alert';

export const AdUnlockModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Support">
      <div className="space-y-4">
        <Alert variant="info">
          Exports are no longer gated by ad completion. You can close this dialog and continue exporting if your plan allows it.
        </Alert>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
          Ads can be shown separately in the app for monetization, but they do not unlock exports.
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};