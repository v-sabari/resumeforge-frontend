import { Link } from 'react-router-dom';
import { useState } from 'react';
import { SectionBadge } from '../components/common/SectionBadge';
import { premiumFeatures } from '../utils/constants';
import { createPayment } from '../services/paymentService';
import { Alert } from '../components/common/Alert';
import { formatApiError } from '../utils/helpers';
import { Card } from '../components/ui/Card';

export const PricingPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await createPayment({ source: 'pricing-page' });

      const paymentUrl =
        response?.paymentLink ||
        response?.payment_link ||
        response?.url ||
        response?.short_url ||
        response?.data?.paymentLink ||
        response?.data?.payment_link ||
        response?.data?.url ||
        response?.data?.short_url ||
        import.meta.env.VITE_RAZORPAY_LINK;

      if (!paymentUrl) {
        console.error('Payment response did not contain a valid URL:', response);
        setError('Payment link not received from server. Please try again.');
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
      <div className="mx-auto max-w-3xl text-center">
        <SectionBadge>Pricing</SectionBadge>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          Clear pricing for every stage of the job search.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          Start with the full builder experience, unlock an export through the existing free flow, and upgrade only when you need unlimited downloads and less friction.
        </p>
      </div>

      <Alert variant="error" className="mx-auto mt-8 max-w-2xl">
        {error}
      </Alert>

      <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-2">
        <Card className="flex h-full flex-col p-6 sm:p-8 lg:p-10" hover>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Free</p>
            <h2 className="mt-4 text-4xl font-semibold text-slate-950">₹0</h2>
            <p className="mt-4 text-sm leading-8 text-slate-600">
              A strong starting point for users who want to experience the builder, improve content with AI, and unlock the first export through the current ad-enabled workflow.
            </p>
          </div>
          <ul className="mt-8 space-y-3 text-sm text-slate-700">
            <li>✓ Full editing workspace</li>
            <li>✓ AI summary, bullet, rewrite, and skills tools</li>
            <li>✓ One free ad-unlocked export</li>
            <li>✓ Live ATS-friendly preview</li>
            <li>✓ Backend-driven export and auth state</li>
          </ul>
          <div className="mt-auto pt-6">
            <Link to="/register" className="btn-secondary w-full justify-center">
              Start free
            </Link>
          </div>
        </Card>

        <Card premium hover className="relative flex h-full flex-col p-6 sm:p-8 lg:p-10">
          <div className="absolute right-6 top-6 rounded-full bg-brand-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">
            Best value
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-200">Premium</p>
            <h2 className="mt-4 text-4xl font-semibold text-white">₹99</h2>
            <p className="mt-4 text-sm leading-8 text-slate-300">
              Built for serious applicants who need unlimited exports, a faster editing workflow, and a smoother premium experience without changing the underlying backend logic.
            </p>
          </div>

          <ul className="mt-8 space-y-3 text-sm text-slate-100">
            {premiumFeatures.map((feature) => (
              <li key={feature}>✓ {feature}</li>
            ))}
          </ul>

          <div className="mt-auto pt-6">
            <button
              type="button"
              className="btn-secondary w-full justify-center border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white"
              onClick={handleUpgrade}
              disabled={loading}
            >
              {loading ? 'Redirecting...' : 'Upgrade to Premium'}
            </button>
          </div>
        </Card>
      </div>
    </section>
  );
};
