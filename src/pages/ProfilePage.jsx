import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPaymentHistory } from '../services/paymentService';
import { PageHeader } from '../components/common/PageHeader';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { Icon } from '../components/icons/Icon';
import { prettyDate } from '../utils/helpers';
import api from '../services/api';

/* ── Data export ── */
const exportAccountData = async () => {
  const response = await api.get('/api/account/export', { responseType: 'blob' });
  const url  = window.URL.createObjectURL(new Blob([response.data], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `resumeforgeai_data_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const deleteAccount = async () => api.delete('/api/account');

export const ProfilePage = () => {
  const { user, premium, exportStatus, logout } = useAuth();
  const navigate = useNavigate();

  const [payments,      setPayments]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [exporting,     setExporting]     = useState(false);
  const [deleting,      setDeleting]      = useState(false);
  const [deleteStep,    setDeleteStep]    = useState(0); // 0=idle, 1=confirm, 2=typing
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [error,         setError]         = useState('');
  const [copied,        setCopied]        = useState(false);

  useEffect(() => {
    getPaymentHistory()
      .then(setPayments).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleExport = async () => {
    setExporting(true); setError('');
    try { await exportAccountData(); }
    catch { setError('Could not export data. Please try again.'); }
    finally { setExporting(false); }
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm.toLowerCase() !== 'delete my account') return;
    setDeleting(true); setError('');
    try {
      await deleteAccount();
      logout();
      navigate('/', { replace: true });
    } catch {
      setError('Account deletion failed. Please contact support.');
      setDeleting(false);
    }
  };

  const copyReferralCode = () => {
    if (!user?.referralCode) return;
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader eyebrow="Account" title="Your profile"
        description="Manage your account details, payment history, and data." />

      <Alert variant="error">{error}</Alert>

      <div className="grid gap-5 md:grid-cols-2">

        {/* Account info */}
        <div className="card p-6">
          <h3 className="panel-title mb-4">Account details</h3>
          <div className="space-y-3">
            {[
              ['Name',         user?.name],
              ['Email',        user?.email],
              ['Plan',         premium?.isPremium ? 'Premium' : 'Free'],
              ['Member since', prettyDate(user?.createdAt)],
              ['Role',         user?.role || 'USER'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-surface-100 last:border-0">
                <span className="text-sm text-ink-400">{label}</span>
                <span className="text-sm font-medium text-ink-950 flex items-center gap-2">
                  {label === 'Plan' && premium?.isPremium && (
                    <Icon name="crown" className="h-4 w-4 text-amber-500" />
                  )}
                  {value || '—'}
                </span>
              </div>
            ))}

            {/* Referral code */}
            {user?.referralCode && (
              <div className="flex items-center justify-between py-2 border-b border-surface-100">
                <span className="text-sm text-ink-400">Referral code</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-brand-700 tracking-widest">
                    {user.referralCode}
                  </span>
                  <button type="button" onClick={copyReferralCode}
                    className="text-xs text-brand-600 hover:underline">
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Referral hub link */}
          <Link to="/app/referral"
            className="mt-4 flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700">
            <Icon name="sparkles" className="h-4 w-4" />
            Go to referral hub — earn free Premium
          </Link>
        </div>

        {/* Export usage */}
        <div className="card p-6">
          <h3 className="panel-title mb-4">Export usage</h3>
          <div className="space-y-3">
            {[
              ['Exports used',      exportStatus?.usedExports ?? 0],
              ['Exports remaining', premium?.isPremium ? 'Unlimited' : Math.max(0, 2 - (exportStatus?.usedExports ?? 0))],
              ['Plan type',         premium?.isPremium ? 'Premium (unlimited)' : 'Free (2 exports)'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-surface-100 last:border-0">
                <span className="text-sm text-ink-400">{label}</span>
                <span className="text-sm font-medium text-ink-950">{value}</span>
              </div>
            ))}
          </div>
          {!premium?.isPremium && (
            <Link to="/pricing" className="btn-primary btn-sm mt-4 w-full justify-center">
              <Icon name="crown" className="h-4 w-4" />
              Upgrade for unlimited exports
            </Link>
          )}
        </div>
      </div>

      {/* Payment history */}
      <div className="card p-6">
        <h3 className="panel-title mb-4">Payment history</h3>
        {loading ? <Loader label="Loading…" /> : payments.length === 0 ? (
          <p className="text-sm text-ink-400">No payments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200">
                  {['Payment ID', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left py-2 text-xs font-semibold text-ink-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {payments.map(p => (
                  <tr key={p.id}>
                    <td className="py-3 font-mono text-xs text-ink-500">{p.paymentId}</td>
                    <td className="py-3 font-semibold text-ink-800">₹{Number(p.amount).toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        p.status === 'PAID'
                          ? 'bg-success-50 border-success-200 text-success-700'
                          : p.status === 'FAILED'
                            ? 'bg-danger-50 border-danger-200 text-danger-700'
                            : 'bg-surface-100 border-surface-200 text-ink-500'
                      }`}>{p.status}</span>
                    </td>
                    <td className="py-3 text-ink-400 text-xs">{prettyDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Data & Privacy */}
      <div className="card p-6">
        <h3 className="panel-title mb-1">Data &amp; privacy</h3>
        <p className="text-sm text-ink-400 mb-5">
          Download your data or permanently delete your account. Deletion is immediate and irreversible.
        </p>

        <div className="space-y-3">
          {/* Export data */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-surface-200 p-4">
            <div>
              <p className="text-sm font-medium text-ink-800">Download my data</p>
              <p className="text-xs text-ink-400 mt-0.5">
                Download a JSON file of all your account data including all resumes.
              </p>
            </div>
            <button type="button" onClick={handleExport} disabled={exporting}
              className="btn-secondary btn-sm shrink-0">
              {exporting ? <><Loader size="sm" label="" /> Exporting…</> : 'Download'}
            </button>
          </div>

          {/* Delete account */}
          <div className="rounded-xl border border-danger-200 bg-danger-50/40 p-4">
            <p className="text-sm font-medium text-danger-800 mb-0.5">Delete account</p>
            <p className="text-xs text-danger-600 mb-3">
              Permanently deletes your account, all resumes, and all data. This cannot be undone.
            </p>

            {deleteStep === 0 && (
              <button type="button" onClick={() => setDeleteStep(1)}
                className="btn-danger btn-sm">
                Delete my account
              </button>
            )}

            {deleteStep === 1 && (
              <div className="space-y-3">
                <p className="text-xs text-danger-700 font-medium">
                  Are you absolutely sure? Type <strong>delete my account</strong> to confirm.
                </p>
                <input type="text" className="input text-sm"
                  value={deleteConfirm}
                  onChange={e => setDeleteConfirm(e.target.value)}
                  placeholder="delete my account" />
                <div className="flex gap-2">
                  <button type="button"
                    onClick={handleDeleteConfirm}
                    disabled={deleteConfirm.toLowerCase() !== 'delete my account' || deleting}
                    className="btn-danger btn-sm">
                    {deleting ? 'Deleting…' : 'Confirm deletion'}
                  </button>
                  <button type="button" onClick={() => { setDeleteStep(0); setDeleteConfirm(''); }}
                    className="btn-secondary btn-sm">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
