import { useNavigate } from 'react-router-dom';
import { Modal } from '../../../components/common/Modal';

export const PremiumUpsellModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade to Premium">
      <div className="space-y-4">
        <p className="text-sm leading-6 text-slate-600">
          You&apos;ve used your 2 free exports. Upgrade to Premium for unlimited exports, premium templates, and a smoother export workflow.
        </p>
        <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p>• Unlimited exports</p>
          <p>• Premium resume templates</p>
          <p>• Faster export workflow</p>
          <p>• No access restrictions after your free limit</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={() => navigate('/pricing')}>
            View plans
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Maybe later
          </button>
        </div>
      </div>
    </Modal>
  );
};
