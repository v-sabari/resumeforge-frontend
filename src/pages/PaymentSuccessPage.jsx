import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { verifyPayment } from '../services/paymentService';
import { activatePremium } from '../services/premiumService';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';
import { formatApiError } from '../utils/helpers';

export const PaymentSuccessPage = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Verifying payment and unlocking premium...');
  const [error, setError] = useState('');
  const location = useLocation();
  const { refreshPremiumStatus } = useAuth();

  useEffect(() => {
    const runVerification = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const payload = Object.fromEntries(params.entries());
        await verifyPayment(payload);
        await activatePremium(payload);
        await refreshPremiumStatus();
        setMessage('Payment verified successfully. Premium is now active on your account.');
      } catch (err) {
        setError(formatApiError(err, 'We could not verify your payment automatically.'));
      } finally {
        setLoading(false);
      }
    };

    runVerification();
  }, [location.search]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="card w-full max-w-2xl p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-3xl">✓</div>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950">Payment successful</h1>
        <p className="mt-4 text-lg text-slate-600">Your Premium experience is being activated and synced with backend status.</p>
        {loading ? <div className="mt-8 flex justify-center"><Loader label="Verifying payment..." /></div> : <Alert variant={error ? 'error' : 'success'} className="mt-8 text-left">{error || message}</Alert>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/app/dashboard" className="btn-primary">Go to dashboard</Link>
          <Link to="/app/builder" className="btn-secondary">Open builder</Link>
        </div>
      </div>
    </div>
  );
};
