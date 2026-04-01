import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkExportAccess, downloadResumePdf, recordExport } from '../../services/exportService';
import { createPayment } from '../../services/paymentService';
import { formatApiError } from '../../utils/helpers';
import { Alert } from '../common/Alert';
import { Loader } from '../common/Loader';
import { Icon } from '../icons/Icon';

export const ExportPanel = ({ resumeId, premium, onExported, refreshStatuses }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [variant, setVariant] = useState('info');
  const [message, setMessage] = useState('Save your latest changes before exporting.');

  const handleUpgrade = async () => {
    setLoading(true);
    setVariant('info');
    setMessage('Preparing payment link...');

    try {
      const response = await createPayment();
      const paymentLink = response?.paymentLink || response?.url || response?.data?.paymentLink;
      if (!paymentLink) throw new Error('Payment link is unavailable.');
      window.location.href = paymentLink;
    } catch (error) {
      setVariant('error');
      setMessage(formatApiError(error, 'Could not start the upgrade flow.'));
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
      const exportAccess = await checkExportAccess();
      if (exportAccess?.allowed) {
        setMessage('Generating your PDF...');
        await recordExport({ resumeId });
        await downloadResumePdf(resumeId);
        await refreshStatuses?.();
        setVariant('success');
        setMessage('Your resume PDF has been downloaded.');
        onExported?.(exportAccess);
      } else {
        setVariant('warning');
        setMessage(exportAccess?.message || exportAccess?.reason || 'Export is currently unavailable.');
      }
    } catch (error) {
      setVariant('error');
      setMessage(formatApiError(error, 'Could not export the resume PDF.'));
    } finally {
      setLoading(false);
    }
  };

  const upgradeCopy = premium?.isPremium
    ? 'Unlimited export access is already active on your account.'
    : 'Free users can unlock limited export access, then upgrade for unlimited PDF downloads.';

  return (
    <div className="card p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Export flow</p>
          <h3 className="mt-2 panel-title">Download-ready and payment-aware</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{upgradeCopy}</p>
        </div>
        <div className="rounded-2xl bg-slate-950 p-3 text-white">
          <Icon name="export" className="h-5 w-5" />
        </div>
      </div>

      <div className="grid gap-3">
        <button type="button" className="btn-primary w-full justify-center" onClick={handleExport} disabled={loading}>
          <Icon name="export" className="h-4 w-4" />
          {loading ? 'Processing...' : 'Export resume PDF'}
        </button>

        <button type="button" className="btn-secondary w-full justify-center" onClick={handleUpgrade} disabled={loading || premium?.isPremium}>
          <Icon name="lock" className="h-4 w-4" />
          {premium?.isPremium ? 'Premium active' : 'Upgrade to Premium'}
        </button>

        <button type="button" className="btn-ghost w-full justify-center" onClick={() => navigate('/pricing')}>
          View pricing details
        </button>
      </div>

      <div className="mt-4 min-h-10">{loading ? <Loader label="Working on export..." /> : <Alert variant={variant}>{message}</Alert>}</div>
    </div>
  );
};
