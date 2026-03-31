import { Link } from 'react-router-dom';
import { premiumFeatures } from '../../utils/constants';

export const PricingPreview = () => (
  <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Free</p>
        <h3 className="mt-4 text-3xl font-semibold text-slate-950">₹0 to start</h3>
        <p className="mt-3 text-sm text-slate-600">Perfect for trying ResumeForge AI and unlocking your first export through a rewarded ad flow.</p>
        <ul className="mt-6 space-y-3 text-sm text-slate-700">
          <li>✓ Full builder workspace</li>
          <li>✓ AI-assisted editing tools</li>
          <li>✓ One ad-unlocked export</li>
          <li>✓ ATS-friendly live preview</li>
        </ul>
      </div>
      <div className="card border-brand-200 bg-slate-950 p-8 text-white shadow-glow">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-200">Premium</p>
        <div className="mt-4 flex items-end gap-2">
          <h3 className="text-3xl font-semibold">₹99</h3>
          <p className="pb-1 text-sm text-slate-300">one-time unlock</p>
        </div>
        <p className="mt-3 text-sm text-slate-300">Built for serious job seekers who need unlimited exports and a smoother resume workflow.</p>
        <ul className="mt-6 space-y-3 text-sm text-slate-100">
          {premiumFeatures.map((feature) => (
            <li key={feature}>✓ {feature}</li>
          ))}
        </ul>
        <Link to="/pricing" className="btn-primary mt-8 w-full justify-center">
          Compare plans
        </Link>
      </div>
    </div>
  </section>
);
