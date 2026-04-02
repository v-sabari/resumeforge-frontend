import { useNavigate } from 'react-router-dom';
import { Modal } from '../../../components/common/Modal';

export const PremiumUpsellModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade to Premium">
      <div className="space-y-4">
        <p className="text-sm leading-6 text-slate-600">
          You've used your free exports. Upgrade to Premium for unlimited exports, premium templates, and a smoother workflow.
        </p>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
          {['Unlimited exports', 'Premium resume templates', 'Faster export workflow', 'No access restrictions after upgrade'].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
              <svg className="h-4 w-4 text-brand-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m20 6-11 11-5-5" />
              </svg>
              {f}
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button type="button" className="btn-primary" onClick={() => navigate('/pricing')}>View plans</button>
          <button type="button" className="btn-secondary" onClick={onClose}>Maybe later</button>
        </div>
      </div>
    </Modal>
  );
};
