import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPaymentHistory } from '../services/paymentService';
import { PageHeader } from '../components/common/PageHeader';
import { Loader } from '../components/common/Loader';
import { Icon } from '../components/icons/Icon';
import { prettyDate } from '../utils/helpers';

export const ProfilePage = () => {
  const { user, premium, exportStatus } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getPaymentHistory()
      .then(setPayments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader eyebrow="Account" title="Your Profile" description="Your account details and payment history." />

      <div className="grid gap-5 md:grid-cols-2">
        {/* Account info */}
        <div className="card p-6">
          <h3 className="panel-title mb-4">Account details</h3>
          <div className="space-y-3">
            {[
              ['Name',    user?.name],
              ['Email',   user?.email],
              ['Plan',    premium?.isPremium ? 'Premium' : 'Free'],
              ['Member since', prettyDate(user?.createdAt)],
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
          </div>
        </div>

        {/* Export stats */}
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
        </div>
      </div>

      {/* Payment history */}
      <div className="card p-6">
        <h3 className="panel-title mb-4">Payment history</h3>
        {loading ? <Loader label="Loading payments…" /> : payments.length === 0 ? (
          <p className="text-sm text-ink-400">No payments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="text-left py-2 text-xs font-semibold text-ink-400 uppercase tracking-wide">Payment ID</th>
                  <th className="text-left py-2 text-xs font-semibold text-ink-400 uppercase tracking-wide">Amount</th>
                  <th className="text-left py-2 text-xs font-semibold text-ink-400 uppercase tracking-wide">Status</th>
                  <th className="text-left py-2 text-xs font-semibold text-ink-400 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-surface-100 last:border-0">
                    <td className="py-3 font-mono text-xs text-ink-400">{p.paymentId}</td>
                    <td className="py-3 text-ink-950">${p.amount}</td>
                    <td className="py-3">
                      <span className={p.status === 'PAID' || p.status === 'VERIFIED'
                        ? 'badge-success' : 'badge-warning'}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 text-ink-400">{prettyDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
