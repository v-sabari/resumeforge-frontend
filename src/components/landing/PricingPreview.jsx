import { Link } from 'react-router-dom';
import { premiumFeatures } from '../../utils/constants';
import { Card } from '../ui/Card';
import { SectionContainer } from '../ui/SectionContainer';

export const PricingPreview = () => (
  <SectionContainer id="pricing">
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Pricing</p>
      <h2 className="section-heading mt-4">Start free, upgrade when you need unlimited export momentum.</h2>
      <p className="mt-5 text-lg leading-8 text-slate-600">
        Both plans are designed to stay visually aligned, clearly comparable, and easy to understand on every screen size.
      </p>
    </div>

    <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-2">
      <Card className="flex h-full flex-col p-6 sm:p-8" hover>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Free</p>
          <h3 className="mt-4 text-3xl font-semibold text-slate-950">₹0</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Perfect for testing the workflow, improving content with AI, and unlocking the first export through the existing ad-based flow.
          </p>
        </div>
        <ul className="mt-8 space-y-3 text-sm text-slate-700">
          <li>✓ Full builder workspace</li>
          <li>✓ AI-assisted editing tools</li>
          <li>✓ One ad-unlocked export</li>
          <li>✓ ATS-friendly live preview</li>
          <li>✓ Dashboard and saved resume access</li>
        </ul>
        <Link to="/pricing" className="btn-secondary mt-auto w-full justify-center pt-3">
          View free plan
        </Link>
      </Card>

      <Card premium hover className="relative flex h-full flex-col p-6 sm:p-8">
        <div className="absolute right-6 top-6 rounded-full bg-brand-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">
          Best value
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-200">Premium</p>
          <div className="mt-4 flex items-end gap-2">
            <h3 className="text-3xl font-semibold text-white">₹99</h3>
            <p className="pb-1 text-sm text-slate-300">one-time unlock</p>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Designed for active applicants who want unlimited exports, a smoother workflow, and a cleaner premium experience.
          </p>
        </div>
        <ul className="mt-8 space-y-3 text-sm text-slate-100">
          {premiumFeatures.map((feature) => (
            <li key={feature}>✓ {feature}</li>
          ))}
        </ul>
        <Link to="/pricing" className="btn-secondary mt-auto w-full justify-center border-white/20 bg-white/10 pt-3 text-white hover:bg-white/15 hover:text-white">
          Compare plans
        </Link>
      </Card>
    </div>
  </SectionContainer>
);
