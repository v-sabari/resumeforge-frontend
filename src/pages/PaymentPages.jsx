import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/icons/Icon';
import { Loader } from '../components/common/Loader';

/**
 * SECURITY FIX: Premium is no longer activated by the frontend.
 * Razorpay calls the backend webhook which verifies the HMAC-SHA256 signature
 * and activates premium. This page only POLLS the backend to check status.
 *
 * Why: Any user could previously navigate to /payment/success?payment_id=fake
 * and hit the activate endpoint with a forged payment ID.
 */
export const PaymentSuccessPage = () => {
  const { refreshPremiumStatus, premium } = useAuth();
  const [status,  setStatus]     = useState('polling'); // polling | success | timeout
  const pollCount                = useRef(0);
  const MAX_POLLS                = 12; // 12 × 2.5s = 30 seconds max wait

  useEffect(() => {
    // The webhook may arrive slightly after the redirect. Poll premium status.
    const poll = async () => {
      pollCount.current++;
      const result = await refreshPremiumStatus();
      if (result?.isPremium) {
        setStatus('success');
        return;
      }
      if (pollCount.current >= MAX_POLLS) {
        setStatus('timeout');
        return;
      }
      setTimeout(poll, 2500);
    };
    poll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (status === 'polling') return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
      <div className="card max-w-md w-full p-10 text-center shadow-lift-lg">
        <Loader size="lg" label="" className="justify-center mb-4" />
        <h2 className="text-lg font-semibold text-ink-950 mt-2">Confirming your payment…</h2>
        <p className="mt-2 text-sm text-ink-400">
          This takes a few seconds. Please don't close this page.
        </p>
      </div>
    </div>
  );

  if (status === 'timeout') return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
      <div className="card max-w-md w-full p-10 text-center shadow-lift-lg">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-warning-50">
          <Icon name="warning" className="h-8 w-8 text-warning-600" />
        </div>
        <h1 className="text-xl font-display font-semibold text-ink-950">Payment received — activation pending</h1>
        <p className="mt-3 text-sm text-ink-400">
          Your payment was received but premium activation is taking longer than usual.
          Please refresh your dashboard in a minute. If it doesn't activate within 5 minutes,
          contact <a href="mailto:support@resumeforge.ai" className="text-brand-600 hover:underline">support@resumeforge.ai</a>.
        </p>
        <div className="mt-8 space-y-3">
          <Link to="/app/dashboard" className="btn-primary w-full justify-center">
            Go to dashboard <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
      <div className="card max-w-md w-full p-10 text-center shadow-lift-lg animate-fade-up">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success-50">
          <Icon name="check" className="h-8 w-8 text-success-600" />
        </div>
        <h1 className="text-2xl font-display font-semibold text-ink-950">You're Premium!</h1>
        <p className="mt-3 text-ink-400 text-sm leading-relaxed">
          Your account has been upgraded. You now have unlimited PDF exports,
          all templates, and no ad interruptions.
        </p>
        <div className="mt-8 space-y-3">
          <Link to="/app/dashboard" className="btn-primary w-full justify-center">
            Go to dashboard <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
          <Link to="/app/builder" className="btn-secondary w-full justify-center">
            Build a resume
          </Link>
        </div>
      </div>
    </div>
  );
};

export const PaymentFailedPage = () => (
  <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
    <div className="card max-w-md w-full p-10 text-center shadow-lift-lg">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-danger-50">
        <Icon name="warning" className="h-8 w-8 text-danger-600" />
      </div>
      <h1 className="text-2xl font-display font-semibold text-ink-950">Payment unsuccessful</h1>
      <p className="mt-3 text-ink-400 text-sm">
        Your payment was not completed. No charges were made.
      </p>
      <div className="mt-8 space-y-3">
        <Link to="/pricing" className="btn-primary w-full justify-center">Try again</Link>
        <Link to="/app/dashboard" className="btn-secondary w-full justify-center">Back to dashboard</Link>
      </div>
      <p className="mt-4 text-xs text-ink-400">
        Need help?{' '}
        <a href="mailto:support@resumeforge.ai" className="text-brand-600 hover:underline">
          support@resumeforge.ai
        </a>
      </p>
    </div>
  </div>
);
