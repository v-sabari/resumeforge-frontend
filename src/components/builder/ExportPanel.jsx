import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  checkExportAccess,
  downloadResumePdf,
  downloadResumeDocx,
  downloadResumeTxt,
  recordExport,
} from '../../services/exportService';
import { getResumeHistory, restoreResumeSnapshot } from '../../services/resumeService';
import { createPayment } from '../../services/paymentService';
import { UpsellModal } from '../icons/UpsellModal';
import { Alert } from '../common/Alert';
import { Loader } from '../common/Loader';
import { Icon } from '../icons/Icon';
import { formatApiError, prettyDate } from '../../utils/helpers';
import { FREE_EXPORT_LIMIT } from '../../utils/constants';

const TEMPLATES = [
  { id: 'classic', label: 'Classic',  desc: 'Single-column — maximum ATS compatibility' },
  { id: 'modern',  label: 'Modern',   desc: 'Dark sidebar — stands out visually'         },
  { id: 'minimal', label: 'Minimal',  desc: 'Ultra-clean whitespace — refined look'      },
];

export const ExportPanel = ({
  resumeId,
  premium,
  exportStatus,
  onExported,
  refreshStatuses,
  selectedTemplate,
  onTemplateChange,
}) => {
  const navigate = useNavigate();

  const [loading,    setLoading]    = useState(false);
  const [variant,    setVariant]    = useState('info');
  const [message,    setMessage]    = useState('Save your resume first, then download it.');
  const [showUpsell, setShowUpsell] = useState(false);
  const [showHistory,setShowHistory] = useState(false);
  const [history,    setHistory]    = useState([]);
  const [histLoading,setHistLoading] = useState(false);
  const [restoring,  setRestoring]  = useState(null);

  const exportsUsed      = exportStatus?.usedExports || 0;
  const exportsRemaining = premium?.isPremium ? '∞' : Math.max(0, FREE_EXPORT_LIMIT - exportsUsed);
  const isBlocked        = !premium?.isPremium && exportsUsed >= FREE_EXPORT_LIMIT;

  // ── Shared export flow ───────────────────────────────────────────────
  const handleExport = async (format = 'pdf') => {
    if (!resumeId) {
      setVariant('warning');
      setMessage('Please save your resume before exporting.');
      return;
    }
    if (isBlocked) {
      setShowUpsell(true);
      return;
    }
    setLoading(true);
    setVariant('info');
    setMessage(format === 'pdf' ? 'Generating PDF…' : format === 'docx' ? 'Generating DOCX…' : 'Generating TXT…');
    try {
      const access = await checkExportAccess();
      if (!access?.allowed) {
        setShowUpsell(true);
        setLoading(false);
        return;
      }
      await recordExport({ resumeId });
      if (format === 'pdf')  await downloadResumePdf(resumeId);
      if (format === 'docx') await downloadResumeDocx(resumeId);
      if (format === 'txt')  await downloadResumeTxt(resumeId);
      await refreshStatuses?.();
      setVariant('success');
      setMessage(`${format.toUpperCase()} downloaded successfully.`);
      onExported?.();
    } catch (e) {
      setVariant('error');
      setMessage(formatApiError(e, 'Export failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // ── Upgrade ──────────────────────────────────────────────────────────
  const handleUpgrade = async () => {
    setLoading(true); setVariant('info'); setMessage('Preparing payment…');
    try {
      const r    = await createPayment();
      const link = r?.paymentLink || r?.data?.paymentLink;
      if (!link) throw new Error('Payment link unavailable.');
      window.location.href = link;
    } catch (e) {
      setVariant('error');
      setMessage(formatApiError(e, 'Could not start upgrade.'));
      setLoading(false);
    }
  };

  // ── Version history ───────────────────────────────────────────────────
  const openHistory = async () => {
    if (!resumeId) { setVariant('warning'); setMessage('Save your resume to view version history.'); return; }
    setShowHistory(true); setHistLoading(true);
    try { setHistory(await getResumeHistory(resumeId)); }
    catch { setHistory([]); }
    finally { setHistLoading(false); }
  };

  const handleRestore = async (snapshotId) => {
    if (!window.confirm('Restore this version? Your current resume is saved as a new version first.')) return;
    setRestoring(snapshotId);
    try {
      await restoreResumeSnapshot(resumeId, snapshotId);
      setShowHistory(false);
      setVariant('success');
      setMessage('Version restored. Reloading…');
      setTimeout(() => window.location.reload(), 1200);
    } catch (e) {
      setVariant('error');
      setMessage(formatApiError(e, 'Restore failed.'));
    } finally { setRestoring(null); }
  };

  return (
    <>
      <UpsellModal
        open={showUpsell}
        onClose={() => setShowUpsell(false)}
        onReferral={() => { setShowUpsell(false); navigate('/app/referral'); }}
      />

      <div className="card p-5 space-y-4">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="kicker mb-0.5">Export</p>
            <h3 className="panel-title">Download resume</h3>
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

        {/* Progress bar */}
        {!premium?.isPremium && (
          <div>
            <div className="h-1.5 w-full rounded-full bg-surface-200 overflow-hidden">
              <div className="h-full rounded-full bg-brand-600 transition-all"
                style={{ width: `${Math.min(100, (exportsUsed / FREE_EXPORT_LIMIT) * 100)}%` }} />
            </div>
            <p className="mt-1 text-xs text-ink-400">{exportsUsed} / {FREE_EXPORT_LIMIT} exports used</p>
          </div>
        )}

        {/* Template selector */}
        <div>
          <p className="text-xs font-medium text-ink-500 mb-2">Template</p>
          <div className="space-y-1.5">
            {TEMPLATES.map(({ id, label, desc }) => (
              <button key={id} type="button"
                onClick={() => onTemplateChange?.(id)}
                className={`w-full flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-all
                  ${selectedTemplate === id
                    ? 'border-brand-400 bg-brand-50'
                    : 'border-surface-200 hover:border-brand-200 hover:bg-brand-50/50'}`}>
                <div className={`mt-0.5 h-3.5 w-3.5 rounded-full border-2 shrink-0 transition-colors
                  ${selectedTemplate === id ? 'border-brand-500 bg-brand-500' : 'border-surface-300'}`} />
                <div>
                  <p className={`text-xs font-semibold ${selectedTemplate === id ? 'text-brand-700' : 'text-ink-700'}`}>
                    {label}
                  </p>
                  <p className="text-[10px] text-ink-400 mt-0.5">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Download buttons */}
        <div className="space-y-2">
          <button type="button"
            onClick={() => handleExport('pdf')}
            disabled={loading}
            className="btn-primary w-full justify-center">
            <Icon name="export" className="h-4 w-4" />
            {loading ? 'Processing…' : isBlocked ? 'Export limit reached' : 'Download PDF'}
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button type="button"
              onClick={() => handleExport('docx')}
              disabled={loading}
              className="btn-secondary justify-center text-xs">
              <Icon name="text" className="h-3.5 w-3.5" />
              DOCX (Word)
            </button>
            <button type="button"
              onClick={() => handleExport('txt')}
              disabled={loading}
              className="btn-secondary justify-center text-xs">
              <Icon name="text" className="h-3.5 w-3.5" />
              Plain Text
            </button>
          </div>

          {!premium?.isPremium && (
            <button type="button"
              onClick={() => setShowUpsell(true)}
              className="btn-ghost w-full justify-center text-xs text-brand-600 hover:text-brand-700">
              <Icon name="crown" className="h-3.5 w-3.5" />
              Upgrade to Premium — $9 one-time
            </button>
          )}

          {resumeId && (
            <button type="button"
              onClick={openHistory}
              className="btn-ghost w-full justify-center text-xs text-ink-400 hover:text-ink-700">
              <Icon name="eye" className="h-3.5 w-3.5" />
              Version history
            </button>
          )}
        </div>

        {/* Status */}
        <div className="min-h-[36px]">
          {loading
            ? <Loader label="Working on export…" />
            : <Alert variant={variant}>{message}</Alert>}
        </div>

        {/* Version history drawer */}
        {showHistory && (
          <div className="border-t border-surface-200 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-ink-700">Version history</p>
              <button type="button" onClick={() => setShowHistory(false)}
                className="text-xs text-ink-400 hover:text-ink-700">Close</button>
            </div>
            {histLoading ? (
              <Loader label="Loading history…" />
            ) : history.length === 0 ? (
              <p className="text-xs text-ink-400">
                No saved versions yet. Versions are created automatically each time you save.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div key={item.snapshotId}
                    className="flex items-center justify-between gap-2 rounded-xl border border-surface-200 bg-surface-50 p-2.5">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-ink-700 truncate">{item.label}</p>
                      <p className="text-[10px] text-ink-400 mt-0.5">{prettyDate(item.createdAt)}</p>
                    </div>
                    <button type="button"
                      onClick={() => handleRestore(item.snapshotId)}
                      disabled={restoring === item.snapshotId}
                      className="btn-secondary btn-sm shrink-0 text-xs">
                      {restoring === item.snapshotId ? '…' : 'Restore'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
