import { Link } from 'react-router-dom';
import { SectionContainer } from '../ui/SectionContainer';
import { premiumFeatures } from '../../utils/constants';

const freeFeatures = [
  'Full editing workspace',
  'AI summary, bullets & rewrites',
  'One free ad-unlocked export',
  'Live ATS-friendly preview',
  'Backend-driven auth & export state',
];

export const PricingPreview = () => (
  <SectionContainer id="pricing">
    <div className="text-center">
      <p className="eyebrow">Pricing</p>
      <h2 className="section-heading mt-3">Simple pricing, no surprises</h2>
      <p className="mt-4 text-base text-slate-600 max-w-xl mx-auto">
        Start free and upgrade only when you need more. One payment, unlimited exports.
      </p>
    </div>

    <div className="mx-auto mt-12 grid max-w-4xl items-stretch gap-5 sm:grid-cols-2">
      {/* Free */}
      <div className="card flex flex-col p-7 card-hover">
        <div>
          <p className="eyebrow">Free</p>
          <div className="mt-3 flex items-end gap-1">
            <span className="text-4xl font-semibold text-slate-950">₹0</span>
            <span className="mb-1 text-sm text-slate-500">forever</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Start building, use AI tools, and unlock your first export through the ad-enabled workflow.
          </p>
        </div>
        <ul className="mt-7 flex-1 space-y-3">
          {freeFeatures.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m20 6-11 11-5-5" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
        <Link to="/register" className="btn-secondary mt-8 w-full justify-center">Get started free</Link>
      </div>

      {/* Premium */}
      <div className="relative flex flex-col rounded-2xl border border-brand-900/40 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0c1a3a] p-7 shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="absolute right-5 top-5 rounded-full bg-brand-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-300">
          Best value
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-300">Premium</p>
          <div className="mt-3 flex items-end gap-1">
            <span className="text-4xl font-semibold text-white">₹99</span>
            <span className="mb-1 text-sm text-slate-400">one-time</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Unlimited exports, no ad gate, and a smoother premium experience for serious applicants.
          </p>
        </div>
        <ul className="mt-7 flex-1 space-y-3">
          {premiumFeatures.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-slate-200">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m20 6-11 11-5-5" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
        <Link to="/pricing" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-white/20 hover:-translate-y-0.5">
          Upgrade to Premium
        </Link>
      </div>
    </div>
  </SectionContainer>
);
