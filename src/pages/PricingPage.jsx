import { Link } from 'react-router-dom';
import { useState } from 'react';
import { SectionBadge } from '../components/common/SectionBadge';
import { Alert } from '../components/common/Alert';
import { premiumFeatures } from '../utils/constants';
import { createPayment } from '../services/paymentService';
import { formatApiError } from '../utils/helpers';

const freeFeatures = [
  'Full editing workspace',
  'AI summary, bullets, rewrites & skills',
  'One free ad-unlocked export',
  'Live ATS-friendly preview',
  'Backend-driven auth & export state',
];

const CheckIcon = ({ premium }) => (
  <svg className={`mt-0.5 h-4 w-4 shrink-0 ${premium ? 'text-brand-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m20 6-11 11-5-5" />
  </svg>
);

export const PricingPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');
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
      console.error('Payment failed:', err);
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
          Clear pricing for every stage of the job search
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Start with the full builder experience, unlock your first export for free, and upgrade only when you need unlimited downloads.
        </p>
      </div>

      {error && (
        <Alert variant="error" className="mx-auto mt-8 max-w-xl">{error}</Alert>
      )}

      {/* Pricing cards */}
      <div className="mx-auto mt-12 grid max-w-4xl items-stretch gap-6 sm:grid-cols-2">
        {/* Free */}
        <div className="card flex flex-col p-7 sm:p-8 card-hover">
          <div>
            <p className="eyebrow">Free</p>
            <div className="mt-3 flex items-end gap-1">
              <span className="text-5xl font-semibold text-slate-950">₹0</span>
              <span className="mb-1.5 text-sm text-slate-500">/ forever</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              A strong starting point — experience the full builder, use AI tools, and unlock your first export through the ad-enabled workflow.
            </p>
          </div>
          <ul className="mt-7 flex-1 space-y-3.5">
            {freeFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                <CheckIcon />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-slate-100 pt-6">
            <Link to="/register" className="btn-secondary w-full justify-center">
              Start for free
            </Link>
          </div>
        </div>

        {/* Premium */}
        <div className="relative flex flex-col rounded-2xl border border-brand-900/40 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0c1a3a] p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 sm:p-8">
          {/* Badge */}
          <div className="absolute right-5 top-5 rounded-full bg-brand-500/25 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-300">
            Best value
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-300">Premium</p>
            <div className="mt-3 flex items-end gap-1">
              <span className="text-5xl font-semibold text-white">₹99</span>
              <span className="mb-1.5 text-sm text-slate-400">/ one-time</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              For serious applicants who need unlimited exports, a faster workflow, and a premium experience without extra friction.
            </p>
          </div>
          <ul className="mt-7 flex-1 space-y-3.5">
            {premiumFeatures.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-200">
                <CheckIcon premium />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-white/10 pt-6">
            <button type="button"
              onClick={handleUpgrade}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/20 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Redirecting...' : 'Upgrade to Premium — ₹99'}
            </button>
          </div>
        </div>
      </div>

      {/* FAQ teaser */}
      <div className="mx-auto mt-14 max-w-2xl text-center">
        <p className="text-sm text-slate-600">
          Have questions?{' '}
          <Link to="/contact" className="font-semibold text-brand-700 hover:underline">Contact support</Link>
          {' '}or read the{' '}
          <a href="/#faq" className="font-semibold text-brand-700 hover:underline">FAQ</a>.
        </p>
      </div>
    </section>
  );
};
