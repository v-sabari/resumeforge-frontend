import { Modal } from '../common/Modal';
import { Alert } from '../common/Alert';

export const AdUnlockModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Export access">
    <div className="space-y-4">
      <Alert variant="info">
        Exports are no longer gated by ad completion. Close this dialog and continue exporting if your plan allows it.
      </Alert>
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        Ads can be shown separately for monetisation but do not gate exports.
      </div>
      <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
    </div>
  </Modal>
);
