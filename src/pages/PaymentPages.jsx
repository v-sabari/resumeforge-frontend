import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/icons/Icon';
import { Loader } from '../components/common/Loader';

/* ─────────────────────────────────────────────────────────────────────────────
   PAYMENT CALLBACK PAGE
   Route: /payment/callback
   
   Flow:
   1. razorpay.js verifies payment with backend → redirects here
   2. We poll /api/auth/me until premium is confirmed in AuthContext
   3. Webhook may also activate premium independently — polling catches both
───────────────────────────────────────────────────────────────────────────── */
export const PaymentCallbackPage = () => {
  const { refreshPremiumStatus } = useAuth();

  // stage: 'polling' | 'success' | 'timeout'
  const [stage, setStage]   = useState('polling');
  const pollCount           = useRef(0);
  const MAX_POLLS           = 14; // 14 × 2.5 s = 35 s max
  const hasRan              = useRef(false);

  useEffect(() => {
    // Strict Mode double-invoke guard
    if (hasRan.current) return;
    hasRan.current = true;

    startPolling();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startPolling = () => {
    const poll = async () => {
      pollCount.current += 1;
      try {
        const result = await refreshPremiumStatus();
        if (result?.isPremium) {
          setStage('success');
          return;
        }
      } catch {
        // Ignore transient errors and keep polling
      }
      if (pollCount.current >= MAX_POLLS) {
        setStage('timeout');
        return;
      }
      setTimeout(poll, 2500);
    };
    poll();
  };

  /* ── Polling ── */
  if (stage === 'polling') return (
    <PageShell>
      <Loader size="lg" label="" className="justify-center mb-4" />
      <h2 className="text-lg font-semibold text-ink-950 mt-2">Activating your Premium account…</h2>
      <p className="mt-2 text-sm text-ink-400">This takes a moment. Please don't close this page.</p>
    </PageShell>
  );

  /* ── Success ── */
  if (stage === 'success') return (
    <PageShell>
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success-50">
        <Icon name="check" className="h-8 w-8 text-success-600" />
      </div>
      <h1 className="text-2xl font-display font-semibold text-ink-950">You're Premium!</h1>
      <p className="mt-3 text-ink-400 text-sm leading-relaxed">
        Your account has been upgraded. You now have unlimited PDF exports,
        all templates, and priority AI access.
      </p>
      <div className="mt-8 space-y-3 w-full">
        <Link to="/app/dashboard" className="btn-primary w-full justify-center">
          Go to dashboard <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
        <Link to="/app/builder" className="btn-secondary w-full justify-center">
          Build a resume
        </Link>
      </div>
    </PageShell>
  );

  /* ── Timeout (payment received, activation slow) ── */
  return (
    <PageShell>
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-warning-50">
        <Icon name="warning" className="h-8 w-8 text-warning-600" />
      </div>
      <h1 className="text-xl font-display font-semibold text-ink-950">
        Payment received — activation pending
      </h1>
      <p className="mt-3 text-sm text-ink-400">
        Your payment was received but premium activation is taking longer than usual.
        Please refresh your dashboard in a minute. If it doesn't activate within 10 minutes,
        contact{' '}
        <a href="mailto:support@resumeforgeai.site" className="text-brand-600 hover:underline">
          support@resumeforgeai.site
        </a>.
      </p>
      <div className="mt-8 space-y-3 w-full">
        <Link to="/app/dashboard" className="btn-primary w-full justify-center">
          Go to dashboard <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </div>
    </PageShell>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   PAYMENT FAILED PAGE
   Route: /payment/failed
───────────────────────────────────────────────────────────────────────────── */
export const PaymentFailedPage = () => (
  <PageShell>
    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-danger-50">
      <Icon name="warning" className="h-8 w-8 text-danger-600" />
    </div>
    <h1 className="text-2xl font-display font-semibold text-ink-950">Payment unsuccessful</h1>
    <p className="mt-3 text-ink-400 text-sm">
      Your payment was not completed. No charges were made.
    </p>
    <div className="mt-8 space-y-3 w-full">
      <Link to="/pricing" className="btn-primary w-full justify-center">Try again</Link>
      <Link to="/app/dashboard" className="btn-secondary w-full justify-center">Back to dashboard</Link>
    </div>
    <p className="mt-4 text-xs text-ink-400">
      Need help?{' '}
      <a href="mailto:support@resumeforgeai.site" className="text-brand-600 hover:underline">
        support@resumeforgeai.site
      </a>
    </p>
  </PageShell>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Shared page shell
───────────────────────────────────────────────────────────────────────────── */
const PageShell = ({ children }) => (
  <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
    <div className="card max-w-md w-full p-10 text-center shadow-lift-lg animate-fade-in">
      {children}
    </div>
  </div>
);