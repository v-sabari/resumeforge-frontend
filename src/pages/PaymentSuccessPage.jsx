import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { verifyPayment } from '../services/paymentService';
import { activatePremium } from '../services/premiumService';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import { formatApiError } from '../utils/helpers';
import { Logo } from '../components/common/Logo';

export const PaymentSuccessPage = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Verifying payment and unlocking premium…');
  const [error,   setError]   = useState('');
  const location = useLocation();
  const { refreshPremiumStatus } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const params  = new URLSearchParams(location.search);
        const payload = Object.fromEntries(params.entries());
        await verifyPayment(payload);
        await activatePremium(payload);
        await refreshPremiumStatus();
        setMessage('Payment verified. Premium is now active on your account.');
      } catch (err) {
        setError(formatApiError(err, 'We could not verify your payment automatically. Please contact support.'));
      } finally { setLoading(false); }
    })();
  }, [location.search]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="card w-full max-w-md p-8 text-center shadow-card">
        <Logo className="mx-auto mb-8 justify-center" />
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 text-2xl">✓</div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Payment successful</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Your Premium plan is being activated and synced with backend state.</p>
        {loading ? (
          <div className="mt-7 flex justify-center"><Loader label="Verifying payment…" /></div>
        ) : (
          <Alert variant={error ? 'error' : 'success'} className="mt-7 text-left">{error || message}</Alert>
        )}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/app/dashboard" className="btn-primary">Go to dashboard</Link>
          <Link to="/app/builder" className="btn-secondary">Open builder</Link>
        </div>
      </div>
    </div>
  );
};
