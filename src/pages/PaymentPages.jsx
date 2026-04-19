import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { verifyPaymentCallback } from '../services/paymentService';
import { Icon } from '../components/icons/Icon';
import { Loader } from '../components/common/Loader';

/* ─────────────────────────────────────────────────────────────────────────────
   PAYMENT CALLBACK PAGE
   Route: /payment/callback
   Configured as the Razorpay Payment Link callback URL in your Razorpay Dashboard.

   Flow:
   1. Razorpay redirects here with HMAC-signed query params.
   2. We POST all params to /api/payments/verify.
   3. Backend verifies the HMAC signature — premium is only granted server-side.
   4. We poll /api/auth/me to confirm premium status.
   5. If verify fails or params are missing, we fall back to polling only
      (webhook may have already activated premium).

   Security:
   - No status field is sent to the backend. The backend ignores any client-
     provided status and grants premium ONLY after verifying the Razorpay
     HMAC-SHA256 signature.
   - Polling is a fallback for webhook-activated accounts; it never activates
     premium itself — only reads it.
───────────────────────────────────────────────────────────────────────────── */
export const PaymentCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const { refreshPremiumStatus } = useAuth();

  // stage: 'verifying' | 'polling' | 'success' | 'timeout' | 'invalid'
  const [stage, setStage]         = useState('verifying');
  const [errorMsg, setErrorMsg]   = useState('');
  const pollCount                 = useRef(0);
  const MAX_POLLS                 = 14; // 14 × 2.5 s = 35 s max
  const hasRan                    = useRef(false);

  useEffect(() => {
    // Strict Mode double-invoke guard
    if (hasRan.current) return;
    hasRan.current = true;

    const razorpayPaymentId       = searchParams.get('razorpay_payment_id');
    const razorpayPaymentLinkStatus = searchParams.get('razorpay_payment_link_status');
    const razorpaySignature       = searchParams.get('razorpay_signature');

    const allParamsPresent =
      razorpayPaymentId &&
      razorpayPaymentLinkStatus &&
      razorpaySignature;

    if (!allParamsPresent) {
      // No Razorpay params — user may have navigated here directly,
      // or this is a webhook-only activation. Poll for premium status.
      setStage('polling');
      startPolling();
      return;
    }

    if (razorpayPaymentLinkStatus !== 'paid') {
      // Razorpay explicitly says payment is not paid
      setStage('invalid');
      setErrorMsg('Payment was not completed. No charges were made.');
      return;
    }

    // Attempt client-side verification (backend validates HMAC)
    verifyPaymentCallback(searchParams)
      .then(() => {
        // Backend confirmed — now poll to get updated premium status in AuthContext
        setStage('polling');
        startPolling();
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || '';
        if (msg.includes('already been processed')) {
          // Idempotent — webhook already activated premium. Poll to confirm.
          setStage('polling');
          startPolling();
        } else {
          // Signature mismatch or server error — fall back to polling.
          // Webhook may have already granted premium.
          console.warn('Payment verify endpoint error, falling back to polling:', msg);
          setStage('polling');
          startPolling();
        }
      });
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

  /* ── Verifying ── */
  if (stage === 'verifying') return (
    <PageShell>
      <Loader size="lg" label="" className="justify-center mb-4" />
      <h2 className="text-lg font-semibold text-ink-950 mt-2">Verifying your payment…</h2>
      <p className="mt-2 text-sm text-ink-400">Confirming with Razorpay. Please don't close this page.</p>
    </PageShell>
  );

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
  if (stage === 'timeout') return (
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

  /* ── Invalid / not paid ── */
  return (
    <PageShell>
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-danger-50">
        <Icon name="warning" className="h-8 w-8 text-danger-600" />
      </div>
      <h1 className="text-xl font-display font-semibold text-ink-950">Payment not completed</h1>
      <p className="mt-3 text-sm text-ink-400">
        {errorMsg || 'Your payment was not completed. No charges were made.'}
      </p>
      <div className="mt-8 space-y-3 w-full">
        <Link to="/pricing" className="btn-primary w-full justify-center">
          Try again
        </Link>
        <Link to="/app/dashboard" className="btn-secondary w-full justify-center">
          Back to dashboard
        </Link>
      </div>
    </PageShell>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   PAYMENT FAILED PAGE
   Route: /payment/failed
   Shown when Razorpay reports an explicit failure (status=failed in URL).
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
