import { Link } from 'react-router-dom';
import { useState } from 'react';
import { SectionBadge } from '../components/common/SectionBadge';
import { Alert } from '../components/common/Alert';
import { premiumFeatures } from '../utils/constants';
import { createPayment } from '../services/paymentService';
import { formatApiError } from '../utils/helpers';

const FREE_FEATURES = [
  'Full editing workspace',
  'AI summary, bullets, rewrites & skills tools',
  'One ad-unlocked export',
  'Live ATS-friendly resume preview',
  'Backend-driven export and auth state',
  'Dashboard with resume history',
];

const Check = ({ light }) => (
  <svg className={`mt-0.5 h-4 w-4 shrink-0 ${light ? 'text-brand-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m20 6-11 11-5-5" />
  </svg>
);

export const PricingPage = () => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleUpgrade = async () => {
    setLoading(true); setError('');
    try {
      const response = await createPayment({ source: 'pricing-page' });
      const paymentUrl =
        response?.paymentLink || response?.payment_link || response?.url || response?.short_url ||
        response?.data?.paymentLink || response?.data?.payment_link || response?.data?.url ||
        response?.data?.short_url || import.meta.env.VITE_RAZORPAY_LINK;
      if (!paymentUrl) {
        console.error('Payment response missing URL:', response);
        setError('Payment link not received. Please try again.');
        setLoading(false);
        return;
      }
      window.location.assign(paymentUrl);
    } catch (err) {
      console.error('Payment creation failed:', err);
      setError(formatApiError(err, 'Unable to create payment session.'));
      setLoading(false);
    }
  };

  return (
    <section className="section-shell pt-12 sm:pt-16 lg:pt-20">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <SectionBadge>Pricing</SectionBadge>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Clear pricing, no surprises.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Start with the full builder for free. Upgrade to Premium with a single one-time payment
          when you need unlimited exports and a smoother workflow.
        </p>
      </div>

      {error && <Alert variant="error" className="mx-auto mt-8 max-w-xl">{error}</Alert>}

      {/* Pricing cards — equal height via items-stretch */}
      <div className="mx-auto mt-12 grid max-w-4xl items-stretch gap-6 sm:grid-cols-2">
        {/* Free */}
        <div className="card flex flex-col p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card">
          <div>
            <p className="kicker">Free</p>
            <div className="mt-3 flex items-end gap-1.5">
              <span className="text-5xl font-semibold text-slate-950">₹0</span>
              <span className="mb-1.5 text-sm text-slate-400">/ forever</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Perfect for testing the workflow, improving content with AI, and unlocking
              the first export through the ad-enabled flow.
            </p>
          </div>
          <ul className="mt-8 flex-1 space-y-3">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                <Check /> {f}
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-slate-100 pt-6">
            <Link to="/register" className="btn-secondary w-full justify-center">Get started free</Link>
          </div>
        </div>

        {/* Premium */}
        <div className="card-premium relative flex flex-col p-8 transition-all duration-200 hover:-translate-y-0.5">
          {/* Best value badge */}
          <div className="absolute right-5 top-5 rounded-full bg-brand-500/25 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-300">
            Best value
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-300">Premium</p>
            <div className="mt-3 flex items-end gap-1.5">
              <span className="text-5xl font-semibold text-white">₹99</span>
              <span className="mb-1.5 text-sm text-slate-400">/ one-time</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Built for serious applicants who need unlimited exports, a faster workflow,
              and a cleaner premium experience.
            </p>
          </div>
          <ul className="mt-8 flex-1 space-y-3">
            {premiumFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-200">
                <Check light /> {f}
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-white/10 pt-6">
            <button type="button" onClick={handleUpgrade} disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/20 disabled:opacity-60">
              {loading ? 'Redirecting…' : 'Upgrade to Premium — ₹99'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-10 text-center text-sm text-slate-500">
        Questions?{' '}
        <Link to="/contact" className="font-medium text-brand-700 hover:underline">Contact support</Link>
        {' · '}
        <a href="/#faq" className="font-medium text-brand-700 hover:underline">Read FAQ</a>
      </p>
    </section>
  );
};
