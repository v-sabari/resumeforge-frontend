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
    setLoading(true); setVariant('info'); setMessage('Preparing payment link...');
    try {
      const response = await createPayment();
      const link = response?.paymentLink || response?.url || response?.data?.paymentLink;
      if (!link) throw new Error('Payment link unavailable.');
      window.location.href = link;
    } catch (e) {
      setVariant('error'); setMessage(formatApiError(e, 'Could not start the upgrade flow.'));
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!resumeId) { setVariant('warning'); setMessage('Please save your resume before exporting.'); return; }
    setLoading(true); setVariant('info'); setMessage('Checking export access...');
    try {
      const access = await checkExportAccess();
      if (access?.allowed) {
        setMessage('Generating your PDF...');
        await recordExport({ resumeId });
        await downloadResumePdf(resumeId);
        await refreshStatuses?.();
        setVariant('success'); setMessage('Resume PDF downloaded successfully.');
        onExported?.(access);
      } else {
        setVariant('warning'); setMessage(access?.message || access?.reason || 'Export currently unavailable.');
      }
    } catch (e) {
      setVariant('error'); setMessage(formatApiError(e, 'Could not export the resume PDF.'));
    } finally { setLoading(false); }
  };

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Export</p>
          <h3 className="panel-title mt-1">Download-ready PDF</h3>
          <p className="mt-1 text-xs text-slate-500">
            {premium?.isPremium ? 'Unlimited export access is active.' : 'Free users get 1 export. Upgrade for unlimited.'}
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white">
          <Icon name="export" className="h-4 w-4" />
        </div>
      </div>

      <div className="space-y-2">
        <button type="button" className="btn-primary w-full justify-center" onClick={handleExport} disabled={loading}>
          <Icon name="export" className="h-4 w-4" />
          {loading ? 'Processing...' : 'Export resume PDF'}
        </button>
        <button type="button" className="btn-secondary w-full justify-center" onClick={handleUpgrade}
          disabled={loading || premium?.isPremium}>
          <Icon name="lock" className="h-4 w-4" />
          {premium?.isPremium ? 'Premium active ✓' : 'Upgrade to Premium'}
        </button>
        <button type="button" className="btn-ghost w-full justify-center text-xs" onClick={() => navigate('/pricing')}>
          View pricing details
        </button>
      </div>

      <div className="mt-3 min-h-8">
        {loading ? <Loader label="Working on export..." /> : <Alert variant={variant}>{message}</Alert>}
      </div>
    </div>
  );
};
