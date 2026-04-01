import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkExportAccess, downloadResumePdf, recordExport } from '../../services/exportService';
import { createPayment } from '../../services/paymentService';
import { RAZORPAY_LINK } from '../../utils/constants';
import { Alert } from '../common/Alert';
import { Loader } from '../common/Loader';
import { formatApiError } from '../../utils/helpers';

export const ExportPanel = ({ resumeId, premium, onExported, refreshStatuses }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Your free exports are available directly. Upgrade to Premium for more exports and extras.');
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
    if (!resumeId) {
      setVariant('warning');
      setMessage('Please save your resume before exporting.');
      return;
    }

    setLoading(true);
    setVariant('info');
    setMessage('Checking export access...');

    try {
      const access = await checkExportAccess({ resumeId });
      const exportAccess = access?.access || access?.data || access;

      if (exportAccess?.allowed) {
        setMessage('Preparing your PDF...');
        await recordExport({ resumeId, source: 'direct' });
        await downloadResumePdf(resumeId);
        await refreshStatuses?.();
        setVariant('success');
        setMessage('Your resume PDF has been downloaded.');
        onExported?.(exportAccess);
      } else {
        setVariant('warning');
        setMessage(exportAccess?.message || 'Export is currently unavailable.');
      }
    } catch (error) {
      setVariant('error');
      setMessage(formatApiError(error, 'Could not export the resume PDF.'));
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
            ? 'Premium unlocked: export without limits.'
            : 'Your free exports are available directly. Upgrade to Premium for more exports and extras.'}
        </p>
      </div>

      <div className="space-y-3">
        <button type="button" className="btn-primary w-full justify-center" onClick={handleExport} disabled={loading}>
          {loading ? 'Processing...' : 'Export resume'}
        </button>

        <button type="button" className="btn-secondary w-full justify-center" onClick={handleUpgrade} disabled={loading}>
          Upgrade to Premium
        </button>

        <button type="button" className="btn-secondary w-full justify-center" onClick={() => navigate('/pricing')}>
          View pricing details
        </button>
      </div>

      <div className="mt-4 min-h-10">
        {loading ? <Loader label="Working on export..." /> : <Alert variant={variant}>{message}</Alert>}
      </div>
    </div>
  );
};