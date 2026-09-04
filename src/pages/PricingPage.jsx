import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { initiatePayment } from '../utils/razorpay';
import { Alert } from '../components/common/Alert';
import { Icon } from '../components/icons/Icon';
import { premiumFeatures } from '../utils/constants';

const freeFeatures = ['Full resume builder', 'AI writing assistance', '3 PDF exports', 'Classic template', 'Secure cloud storage'];

export const PricingPage = () => {
  const { isAuthenticated, premium } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleUpgrade = async () => {
    if (!isAuthenticated) { navigate('/register'); return; }
    setLoading(true);
    setError('');

    initiatePayment(
      // onSuccess — redirect to callback page
      () => {
        window.location.href = '/payment/callback';
      },
      // onFailure — show error
      (errMsg) => {
        setError(errMsg || 'Payment failed. Please try again.');
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="kicker mb-2">Pricing</p>
          <h1 className="hero-title text-4xl sm:text-5xl">Simple, transparent pricing</h1>
          <p className="mt-4 text-ink-400 text-lg max-w-lg mx-auto">
            Start free. Upgrade once for unlimited access — no subscription, no recurring charges.
          </p>
        </div>

        <Alert variant="error" className="mb-6 max-w-lg mx-auto">{error}</Alert>

        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {/* Free plan */}
          <div className="card p-8">
            <div className="mb-6">
              <p className="kicker mb-2">Free</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-display font-semibold text-ink-950">₹0</span>
                <span className="text-ink-400 mb-1">/forever</span>
              </div>
              <p className="mt-2 text-sm text-ink-400">Get started without a credit card.</p>
            </div>
            <ul className="space-y-3 mb-8">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-ink-600">
                  <Icon name="check" className="h-4 w-4 text-success-600 shrink-0" />{f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate(isAuthenticated ? '/app/dashboard' : '/register')}
              className="btn-secondary w-full justify-center">
              {isAuthenticated ? 'Go to dashboard' : 'Get started free'}
            </button>
          </div>

          {/* Premium plan */}
          <div className="card p-8 border-2 border-brand-500 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="premium-badge px-3 py-1">MOST POPULAR</span>
            </div>
            <div className="mb-6">
              <p className="kicker text-brand-600 mb-2">Premium</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-display font-semibold text-ink-950">₹749</span>
                <span className="text-ink-400 mb-1">/one-time</span>
              </div>
              <p className="mt-2 text-sm text-ink-400">Pay once. Unlimited access forever.</p>
            </div>
            <ul className="space-y-3 mb-8">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-ink-600">
                  <Icon name="check" className="h-4 w-4 text-brand-600 shrink-0" />{f}
                </li>
              ))}
            </ul>
            {premium?.isPremium ? (
              <div className="btn-secondary w-full justify-center flex items-center gap-2 cursor-default">
                <Icon name="check" className="h-4 w-4 text-success-600" />
                Premium active
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="btn-primary w-full justify-center">
                {loading ? 'Opening payment…' : 'Get Premium — ₹749'}
                {!loading && <Icon name="arrowRight" className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>

        {/* CHAT-01: Premium flagship Voice & Chat Resume Builder advertisement */}
        <div className="mt-10 max-w-3xl mx-auto">
          <div className="card p-6 sm:p-8 border-2 border-brand-500 relative overflow-hidden">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="premium-badge px-3 py-1">FLAGSHIP AI FEATURE</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl
                              bg-gradient-to-br from-brand-600 to-brand-700 text-white">
                <Icon name="sparkles" className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="kicker text-brand-600 mb-1">Premium Feature</p>
                <h3 className="text-xl font-display font-bold text-ink-950">Voice &amp; Chat Resume Builder</h3>
                <p className="mt-2 text-sm text-ink-500 leading-relaxed">
                  Build your resume by simply talking to AI or chatting with it.
                  Answer a few questions and let ResumeForge AI guide you through creating a professional resume.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ['🎙️', 'Voice-based resume creation'],
                ['💬', 'Conversational AI resume builder'],
                ['🤖', 'AI-guided questions'],
                ['✨', 'Smart resume improvements'],
                ['📄', 'Generate complete resume sections'],
                ['🎯', 'Job-focused resume guidance'],
              ].map(([emoji, text]) => (
                <div key={text} className="flex items-center gap-2.5 rounded-xl bg-surface-50 border border-surface-200 px-3 py-2.5 text-sm text-ink-600">
                  <span className="text-base">{emoji}</span>{text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust signals */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-ink-400">
          {['Secure payment via Razorpay', 'No subscription — pay once', 'Instant activation', '30-day support guarantee'].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <Icon name="check" className="h-4 w-4 text-success-600" />{t}
            </span>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-xl font-display font-semibold text-ink-950 mb-6 text-center">Payment FAQ</h2>
          <div className="space-y-3">
            {[
              { q: 'Is this a subscription?', a: 'No. It\'s a one-time payment. Pay once, use forever.' },
              { q: 'What payment methods are accepted?', a: 'We use Razorpay which accepts all major credit/debit cards, UPI, net banking, and wallets.' },
              { q: 'When does premium activate?', a: 'Immediately after payment is confirmed — usually within seconds.' },
              { q: 'Can I get a refund?', a: 'Contact us within 30 days if you have any issues and we\'ll make it right.' },
            ].map(({ q, a }) => (
              <details key={q} className="card group">
                <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-semibold text-ink-950 list-none">
                  {q}
                  <Icon name="chevronDown" className="h-4 w-4 text-ink-400 transition-transform group-open:rotate-180 shrink-0 ml-3" />
                </summary>
                <div className="px-4 pb-4 text-sm text-ink-500 border-t border-surface-100 pt-3">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};