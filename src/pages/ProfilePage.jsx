import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { EmptyState } from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';
import { getPaymentHistory } from '../services/paymentService';
import { prettyDate, formatApiError } from '../utils/helpers';

const STATUS_STYLES = {
  completed: 'badge-green',
  pending:   'badge-orange',
  failed:    'badge-red',
};

export const ProfilePage = () => {
  const { user, premium, exportStatus, logout } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const r = await getPaymentHistory();
        const history = r?.payments || r?.data || r || [];
        setPayments(Array.isArray(history) ? history : []);
      } catch (err) {
        setError(formatApiError(err, 'Could not load payment history.'));
      } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile"
        title="Account & plan overview"
        description="Review your account details, premium status, and payment history."
        actions={<button type="button" className="btn-secondary" onClick={logout}>Log out</button>}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Account"      value={user?.name || 'Member'}              helper={user?.email} />
        <StatCard label="Plan"         value={premium?.isPremium ? 'Premium ✦' : 'Free'}  helper={premium?.message || 'Synced from backend'} />
        <StatCard label="Exports used" value={exportStatus?.exportCount ?? exportStatus?.used ?? 0} helper={exportStatus?.adUnlocked ? 'Free export unlocked' : 'Awaiting unlock or premium'} />
      </div>

      <div className="card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-950">Payment history</h2>
            <p className="mt-0.5 text-sm text-slate-500">Records fetched from your payment history endpoint.</p>
          </div>
          {!premium?.isPremium && (
            <Link to="/pricing" className="btn-primary shrink-0 text-xs py-2">Upgrade to Premium</Link>
          )}
        </div>

        <Alert variant="error" className="mt-4">{error}</Alert>

        {loading ? (
          <div className="mt-6"><Loader label="Loading payment history…" /></div>
        ) : payments.length ? (
          <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {['Date', 'Reference', 'Amount', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {payments.map((p, i) => (
                  <tr key={p.id || p._id || i} className="transition hover:bg-slate-50/80">
                    <td className="px-4 py-3 text-slate-700">{prettyDate(p.createdAt || p.date || p.updatedAt)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.reference || p.orderId || p.paymentId || '—'}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{p.amount ?? p.total ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${STATUS_STYLES[p.status] || 'badge-neutral'}`}>
                        {p.status || 'processed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState title="No payment history yet" description="Upgrade to Premium and billing events will appear here." />
          </div>
        )}
      </div>
    </div>
  );
};
