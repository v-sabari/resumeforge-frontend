import { Link } from 'react-router-dom';
import { SectionContainer } from '../ui/SectionContainer';
import { premiumFeatures } from '../../utils/constants';

const FREE_FEATURES = [
  'Full editing workspace',
  'AI summary, bullets, rewrites & skills',
  'One ad-unlocked export',
  'Live ATS-friendly preview',
  'Dashboard with saved resumes',
];

const Check = ({ light }) => (
  <svg className={`mt-0.5 h-4 w-4 shrink-0 ${light ? 'text-brand-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m20 6-11 11-5-5" />
  </svg>
);

export const PricingPreview = () => (
  <SectionContainer id="pricing">
    <div className="mx-auto max-w-xl">
      <p className="kicker">Pricing</p>
      <h2 className="section-heading mt-3">Start free, upgrade when you need more.</h2>
      <p className="mt-4 text-base leading-7 text-slate-600">
        No hidden fees. Both plans give you the full builder and AI tools. Premium removes limits.
      </p>
    </div>

    <div className="mx-auto mt-12 grid max-w-4xl items-stretch gap-5 sm:grid-cols-2">
      {/* Free card */}
      <div className="card card-interactive flex flex-col p-7">
        <p className="kicker">Free</p>
        <div className="mt-3 flex items-end gap-1.5">
          <span className="text-4xl font-semibold text-slate-950">₹0</span>
          <span className="mb-1 text-sm text-slate-400">forever</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Perfect for testing the workflow and unlocking your first export.
        </p>
        <ul className="mt-6 flex-1 space-y-3">
          {FREE_FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
              <Check />
              {f}
            </li>
          ))}
        </ul>
        <Link to="/register" className="btn-secondary mt-8 w-full justify-center">Get started free</Link>
      </div>

      {/* Premium card */}
      <div className="card-premium relative flex flex-col p-7 transition-all duration-200 hover:-translate-y-0.5">
        <div className="absolute right-5 top-5 rounded-full bg-brand-500/25 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-300">
          Best value
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-300">Premium</p>
        <div className="mt-3 flex items-end gap-1.5">
          <span className="text-4xl font-semibold text-white">₹99</span>
          <span className="mb-1 text-sm text-slate-400">one-time</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          For serious applicants who need unlimited exports and zero friction.
        </p>
        <ul className="mt-6 flex-1 space-y-3">
          {premiumFeatures.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-slate-200">
              <Check light />
              {f}
            </li>
          ))}
        </ul>
        <Link to="/pricing" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/20">
          Compare all plans
        </Link>
      </div>
    </div>
  </SectionContainer>
);
