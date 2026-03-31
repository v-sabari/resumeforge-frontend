import { useEffect, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import { getPaymentHistory } from '../services/paymentService';
import { prettyDate, formatApiError } from '../utils/helpers';

export const ProfilePage = () => {
  const { user, premium, exportStatus, logout } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPayments = async () => {
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

    loadPayments();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Profile"
        title="Account and plan overview"
        description="Review account details, premium state, payment history, and session controls."
        actions={<button type="button" className="btn-secondary" onClick={logout}>Logout</button>}
      />

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Account" value={user?.name || user?.email || 'Member'} helper={user?.email} />
        <StatCard label="Plan" value={premium?.isPremium ? 'Premium' : 'Free'} helper={premium?.message || 'Synced from premium status'} />
        <StatCard label="Exports used" value={exportStatus?.exportCount ?? exportStatus?.used ?? 0} helper={exportStatus?.adUnlocked ? 'Free export unlocked' : 'Awaiting ad unlock or premium'} />
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-slate-950">Payment history</h2>
        <p className="mt-2 text-sm text-slate-600">All records are fetched from the payment history endpoint.</p>
        <Alert variant="error" className="mt-4">{error}</Alert>
        {loading ? (
          <div className="mt-6"><Loader label="Loading payment history..." /></div>
        ) : payments.length ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {payments.map((payment, index) => (
                  <tr key={payment.id || payment._id || index}>
                    <td className="px-4 py-3 text-slate-700">{prettyDate(payment.createdAt || payment.date)}</td>
                    <td className="px-4 py-3 text-slate-700">{payment.reference || payment.paymentId || '—'}</td>
                    <td className="px-4 py-3 text-slate-700">{payment.amount || '—'}</td>
                    <td className="px-4 py-3 text-slate-700">{payment.status || 'completed'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">No payment history yet. Upgrade to Premium when you need more exports.</div>
        )}
      </div>
    </div>
  );
};
