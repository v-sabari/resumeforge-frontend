import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkExportAccess, downloadResumePdf, recordExport } from '../../services/exportService';
import { createPayment } from '../../services/paymentService';
import { Alert } from '../common/Alert';
import { Loader } from '../common/Loader';
import { Icon } from '../icons/Icon';
import { formatApiError } from '../../utils/helpers';
import { FREE_EXPORT_LIMIT } from '../../utils/constants';

export const ExportPanel = ({ resumeId, premium, exportStatus, onExported, refreshStatuses }) => {
  const navigate  = useNavigate();
  const [loading,  setLoading]  = useState(false);
  const [variant,  setVariant]  = useState('info');
  const [message,  setMessage]  = useState('Save your resume first, then download your PDF.');

  const exportsUsed      = exportStatus?.usedExports || 0;
  const exportsRemaining = premium?.isPremium ? '∞' : Math.max(0, FREE_EXPORT_LIMIT - exportsUsed);
  const isBlocked        = !premium?.isPremium && exportsUsed >= FREE_EXPORT_LIMIT;

  const handleUpgrade = async () => {
    setLoading(true); setVariant('info'); setMessage('Preparing payment link…');
    try {
      const r    = await createPayment();
      const link = r?.paymentLink || r?.data?.paymentLink;
      if (!link) throw new Error('Payment link unavailable. Please visit the Pricing page.');
      window.location.href = link;
    } catch (e) {
      setVariant('error');
      setMessage(formatApiError(e, 'Could not start upgrade. Please try the Pricing page.'));
      setLoading(false);
    }
  };

  const handleExport = async () => {
    // BUG FIX: Guard against null resumeId — this was causing default resume downloads
    if (!resumeId) {
      setVariant('warning');
      setMessage('Please save your resume before exporting.');
      return;
    }

    setLoading(true); setVariant('info'); setMessage('Checking export access…');

    try {
      const access = await checkExportAccess();

      if (!access?.allowed) {
        setVariant('warning');
        setMessage(access?.message || 'Export limit reached. Upgrade to Premium for unlimited exports.');
        setLoading(false);
        return;
      }

      setMessage('Generating your PDF…');
      // FIX: Download FIRST — record quota only after successful download.
      // Previous code recorded before download; if download failed, the user lost a free slot.
      await downloadResumePdf(resumeId);
      await recordExport({ resumeId });
      await refreshStatuses?.();
      setVariant('success');
      setMessage('Resume PDF downloaded successfully! Check your downloads folder.');
      onExported?.();
    } catch (e) {
      setVariant('error');
      setMessage(formatApiError(e, 'Export failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="kicker mb-0.5">Export</p>
          <h3 className="panel-title">Download PDF</h3>
          <p className="mt-1 text-xs text-ink-400">
            {premium?.isPremium
              ? 'Unlimited exports active.'
              : `${exportsRemaining} of ${FREE_EXPORT_LIMIT} free exports remaining.`}
          </p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Icon name="export" className="h-4 w-4" />
        </div>
      </div>

      {/* Export bar */}
      {!premium?.isPremium && (
        <div className="mb-4">
          <div className="h-1.5 w-full rounded-full bg-surface-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-600 transition-all"
              style={{ width: `${Math.min(100, (exportsUsed / FREE_EXPORT_LIMIT) * 100)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-ink-400">{exportsUsed} / {FREE_EXPORT_LIMIT} exports used</p>
        </div>
      )}

      {/* PDF template notice */}
      <div className="mb-3 rounded-lg bg-surface-50 border border-surface-200 px-3 py-2">
        <p className="text-[11px] text-ink-400 leading-relaxed">
          <span className="font-medium text-ink-600">Classic ATS-safe layout</span> — PDF always exports the
          Classic single-column format, which passes all ATS scanners.
          The Modern template is preview-only.
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          type="button"
          className="btn-primary w-full justify-center"
          onClick={handleExport}
          disabled={loading || isBlocked}>
          <Icon name="export" className="h-4 w-4" />
          {loading ? 'Processing…' : isBlocked ? 'Limit reached' : 'Export resume PDF'}
        </button>

        {!premium?.isPremium && (
          <button
            type="button"
            className="btn-secondary w-full justify-center"
            onClick={handleUpgrade}
            disabled={loading}>
            <Icon name="crown" className="h-4 w-4" />
            Upgrade to Premium — $9
          </button>
        )}

        <button
          type="button"
          className="btn-ghost w-full justify-center text-xs"
          onClick={() => navigate('/pricing')}>
          View pricing details
        </button>
      </div>

      {/* Status message */}
      <div className="mt-4 min-h-[36px]">
        {loading
          ? <Loader label="Working on export…" />
          : <Alert variant={variant}>{message}</Alert>}
      </div>
    </div>
  );
};
