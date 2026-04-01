import { useEffect, useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { EmptyState } from '../components/common/EmptyState';
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
        description="Review account details, premium state, payment history, and session controls in a cleaner account workspace."
        actions={<button type="button" className="btn-secondary" onClick={logout}>Logout</button>}
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Account" value={user?.name || user?.email || 'Member'} helper={user?.email} />
        <StatCard label="Plan" value={premium?.isPremium ? 'Premium' : 'Free'} helper={premium?.message || 'Synced from premium status'} />
        <StatCard label="Exports used" value={exportStatus?.exportCount ?? exportStatus?.used ?? 0} helper={exportStatus?.adUnlocked ? 'Free export unlocked' : 'Awaiting ad unlock or premium'} />
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-slate-950">Payment history</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">All records are fetched from the payment history endpoint.</p>
        <Alert variant="error" className="mt-4">{error}</Alert>

        {loading ? (
          <div className="mt-6">
            <Loader label="Loading payment history..." />
          </div>
        ) : payments.length ? (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Reference</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr key={payment.id || payment._id || index} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-4 py-4 text-slate-700">{prettyDate(payment.createdAt || payment.date || payment.updatedAt)}</td>
                    <td className="px-4 py-4 text-slate-700">{payment.amount ?? payment.total ?? '—'}</td>
                    <td className="px-4 py-4 text-slate-700">{payment.status || 'Processed'}</td>
                    <td className="px-4 py-4 text-slate-500">{payment.reference || payment.orderId || payment.paymentId || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              title="No payment history yet"
              description="When you upgrade or complete a billing event, the records fetched from your backend will appear here."
            />
          </div>
        )}
      </div>
    </div>
  );
};
