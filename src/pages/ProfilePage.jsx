import { useEffect, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import { getPaymentHistory } from '../services/paymentService';
import { prettyDate, formatApiError } from '../utils/helpers';

const statusColors = {
  completed: 'bg-emerald-50 text-emerald-700',
  pending:   'bg-amber-50 text-amber-700',
  failed:    'bg-rose-50 text-rose-700',
};

export const ProfilePage = () => {
  const { user, premium, exportStatus, logout } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await getPaymentHistory();
        const history = response?.payments || response?.data || response || [];
        setPayments(Array.isArray(history) ? history : []);
      } catch (err) {
        setError(formatApiError(err, 'Could not load payment history.'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        eyebrow="Profile"
        title="Account & plan overview"
        description="Review account details, premium state, payment history, and session controls."
        actions={
          <button type="button" className="btn-secondary" onClick={logout}>Log out</button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Account" value={user?.name || 'Member'} helper={user?.email} />
        <StatCard label="Plan" value={premium?.isPremium ? 'Premium ✦' : 'Free'} helper={premium?.message || 'Synced from backend'} />
        <StatCard label="Exports used" value={exportStatus?.exportCount ?? exportStatus?.used ?? 0}
          helper={exportStatus?.adUnlocked ? 'Free export unlocked' : 'Awaiting unlock or premium'} />
      </div>

      <div className="card p-6">
        <h2 className="text-base font-semibold text-slate-950">Payment history</h2>
        <p className="mt-1 text-sm text-slate-500">All records fetched from the payment history endpoint.</p>
        <Alert variant="error" className="mt-4">{error}</Alert>

        {loading ? (
          <div className="mt-6"><Loader label="Loading payment history..." /></div>
        ) : payments.length ? (
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
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
                  <tr key={p.id || p._id || i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 text-slate-700">{prettyDate(p.createdAt || p.date)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{p.reference || p.paymentId || '—'}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{p.amount || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold ${statusColors[p.status] || statusColors.completed}`}>
                        {p.status || 'completed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center">
            <p className="text-sm text-slate-500">No payment history yet.</p>
            <p className="mt-1 text-xs text-slate-400">Upgrade to Premium when you need unlimited exports.</p>
          </div>
        )}
      </div>
    </div>
  );
};
