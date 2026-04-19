import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { Loader } from '../common/Loader';
import { formatApiError } from '../../utils/helpers';
import { createPayment } from '../../services/paymentService';

const BENEFITS = [
  'Unlimited PDF and DOCX exports',
  'ATS Pro Scan — unlimited per day',
  'Cover letter, tailor, interview prep AI tools',
  'All resume templates (Classic, Modern, Minimal)',
  'No ads, no rate limits',
  'One-time payment — no subscription ever',
];

/**
 * Modal shown when a free user hits their export limit.
 *
 * Props:
 *   open         — boolean, controls visibility
 *   onClose      — () => void
 *   onReferral   — () => void, navigate to /app/referral
 */
export const UpsellModal = ({ open, onClose, onReferral }) => {
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  if (!open) return null;

  const handleUpgrade = async () => {
    setLoading(true); setError('');
    try {
      const r    = await createPayment();
      const link = r?.paymentLink || r?.data?.paymentLink;
      if (!link) throw new Error('Payment link unavailable.');
      window.location.href = link;
    } catch (e) {
      setError(formatApiError(e, 'Could not start payment. Please try the Pricing page.'));
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="card max-w-md w-full p-8 relative animate-fade-up shadow-lift-lg">

        {/* Close */}
        <button type="button" onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-ink-300 hover:text-ink-600 transition-colors">
          <Icon name="close" className="h-5 w-5" />
        </button>

        {/* Crown icon */}
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 mb-5">
          <Icon name="crown" className="h-7 w-7" />
        </div>

        <h2 className="text-xl font-display font-semibold text-ink-950 mb-1">
          You've used your free exports
        </h2>
        <p className="text-sm text-ink-500 mb-5">
          Upgrade to Premium once for unlimited exports, all AI tools, and all templates — forever.
        </p>

        {/* Benefits list */}
        <ul className="space-y-2 mb-6">
          {BENEFITS.map(b => (
            <li key={b} className="flex items-center gap-2.5 text-sm text-ink-700">
              <Icon name="check" className="h-4 w-4 text-success-600 shrink-0" />
              {b}
            </li>
          ))}
        </ul>

        {error && (
          <p className="text-xs text-danger-600 mb-3">{error}</p>
        )}

        {/* Primary CTA */}
        <button type="button" onClick={handleUpgrade} disabled={loading}
          className="btn-primary w-full justify-center mb-3 text-base py-3">
          {loading
            ? <><Loader size="sm" label="" /> Preparing payment…</>
            : <>Upgrade to Premium — $9 one-time <Icon name="arrowRight" className="h-4 w-4" /></>}
        </button>

        {/* Referral CTA */}
        <button type="button"
          onClick={() => { onClose(); onReferral?.(); }}
          className="btn-secondary w-full justify-center text-sm">
          <Icon name="sparkles" className="h-4 w-4" />
          Earn free Premium by referring friends
        </button>

        <p className="mt-4 text-center text-xs text-ink-300">
          Pay once. No subscription. No hidden fees.{' '}
          <Link to="/pricing" onClick={onClose} className="hover:underline">See full pricing</Link>
        </p>
      </div>
    </div>
  );
};
