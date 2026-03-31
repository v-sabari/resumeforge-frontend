import { Link } from 'react-router-dom';
import { useState } from 'react';
import { SectionBadge } from '../components/common/SectionBadge';
import { premiumFeatures } from '../utils/constants';
import { createPayment } from '../services/paymentService';
import { Alert } from '../components/common/Alert';
import { formatApiError } from '../utils/helpers';

export const PricingPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await createPayment({ source: 'pricing-page' });
      const url = response?.paymentLink || response?.url || response?.data?.paymentLink || import.meta.env.VITE_RAZORPAY_LINK;
      window.location.href = url;
    } catch (err) {
      setError(formatApiError(err, 'Unable to create payment session.'));
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <SectionBadge>Pricing</SectionBadge>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-950">Choose the plan that matches your job search intensity.</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">Start free, unlock your first export through an ad, and upgrade once you need unlimited polished applications.</p>
      </div>

      <Alert variant="error" className="mx-auto mt-8 max-w-2xl">{error}</Alert>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <div className="card p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Free</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950">₹0</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">A strong starting point to test the workflow, build a resume, and unlock the first export through the rewarded ad flow.</p>
          <ul className="mt-8 space-y-3 text-sm text-slate-700">
            <li>✓ Full editing workspace</li>
            <li>✓ AI summary, bullets, rewrite, and skills tools</li>
            <li>✓ One free ad-unlocked export</li>
            <li>✓ Live ATS-friendly preview</li>
            <li>✓ Backend-driven export and auth state</li>
          </ul>
          <Link to="/register" className="btn-secondary mt-8 w-full justify-center">Start free</Link>
        </div>

        <div className="card border-brand-200 bg-slate-950 p-8 text-white shadow-glow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-200">Premium</p>
              <h2 className="mt-4 text-3xl font-semibold">₹99</h2>
            </div>
            <div className="rounded-full bg-brand-500/20 px-4 py-2 text-sm font-semibold text-brand-100">Best value</div>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">Built for serious applicants who need unlimited exports, a faster editing workflow, and a cleaner premium experience.</p>
          <ul className="mt-8 space-y-3 text-sm text-slate-100">
            {premiumFeatures.map((feature) => <li key={feature}>✓ {feature}</li>)}
          </ul>
          <button type="button" className="btn-primary mt-8 w-full justify-center" onClick={handleUpgrade} disabled={loading}>
            {loading ? 'Redirecting...' : 'Upgrade to Premium'}
          </button>
        </div>
      </div>
    </section>
  );
};
