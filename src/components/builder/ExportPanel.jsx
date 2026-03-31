import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkExportAccess, recordExport } from '../../services/exportService';
import { createPayment } from '../../services/paymentService';
import { RAZORPAY_LINK } from '../../utils/constants';
import { Alert } from '../common/Alert';
import { Loader } from '../common/Loader';
import { formatApiError } from '../../utils/helpers';

export const ExportPanel = ({ resumeId, premium, onRequireAd, onExported, refreshStatuses }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Exports are checked against backend permissions before being recorded.');
  const [variant, setVariant] = useState('info');
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    setLoading(true);
    setVariant('info');
    setMessage('Preparing your payment session...');
    try {
      const response = await createPayment({ source: 'export-panel', resumeId });
      const url = response?.paymentLink || response?.url || response?.data?.paymentLink || RAZORPAY_LINK;
      window.location.href = url;
    } catch (error) {
      setVariant('error');
      setMessage(formatApiError(error, 'Could not create the payment session.'));
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    setVariant('info');
    setMessage('Checking export access...');

    try {
      const access = await checkExportAccess({ resumeId });
      const exportAccess = access?.access || access?.data || access;

      if (exportAccess?.allowed) {
        await recordExport({ resumeId, source: exportAccess?.source || 'direct' });
        await refreshStatuses?.();
        setVariant('success');
        setMessage('Export recorded successfully. Your backend can now generate the PDF.');
        onExported?.(exportAccess);
      } else if (exportAccess?.requiresAd) {
        setVariant('warning');
        setMessage('Complete the ad unlock flow to access your first free export.');
        onRequireAd?.();
      } else if (exportAccess?.requiresPremium) {
        setVariant('warning');
        setMessage('Additional exports require Premium. Redirecting to pricing options is available below.');
      } else {
        setVariant('error');
        setMessage(exportAccess?.message || 'Export is currently unavailable.');
      }
    } catch (error) {
      setVariant('error');
      setMessage(formatApiError(error, 'Could not verify export access.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Export flow</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-950">Ship your resume with the right access state</h3>
        <p className="mt-2 text-sm text-slate-600">
          {premium?.isPremium
            ? 'Premium unlocked: export without ads or watermark gates.'
            : 'Free users unlock the first export via ad completion. More exports require Premium.'}
        </p>
      </div>
      <div className="space-y-3">
        <button type="button" className="btn-primary w-full justify-center" onClick={handleExport} disabled={loading}>
          {loading ? 'Processing...' : 'Check access & export'}
        </button>
        <button type="button" className="btn-secondary w-full justify-center" onClick={handleUpgrade} disabled={loading}>
          Upgrade to Premium
        </button>
        <button type="button" className="btn-secondary w-full justify-center" onClick={() => navigate('/pricing')}>
          View pricing details
        </button>
      </div>
      <div className="mt-4 min-h-10">
        {loading ? <Loader label="Working on export access..." /> : <Alert variant={variant}>{message}</Alert>}
      </div>
    </div>
  );
};
