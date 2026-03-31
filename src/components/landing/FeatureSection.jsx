const features = [
  {
    title: 'Guided resume workspace',
    description: 'Edit your resume in a clean split layout with structured sections and realistic professional defaults.',
  },
  {
    title: 'Real-time ATS preview',
    description: 'Watch every change land instantly in a practical, recruiter-friendly preview tuned for export readiness.',
  },
  {
    title: 'AI writing assistance',
    description: 'Improve summaries, generate experience bullets, rewrite content professionally, and surface relevant skills.',
  },
  {
    title: 'Monetization-ready export logic',
    description: 'Support first free export through ad unlock and route later exports through a premium payment experience.',
  },
  {
    title: 'Premium growth loop',
    description: 'Show plan status, payment history, upgrade CTAs, and improved product value throughout the journey.',
  },
  {
    title: 'Startup-polished UX',
    description: 'Responsive components, empty states, clear loading feedback, and product-level visual consistency.',
  },
];

export const FeatureSection = () => (
  <section id="features" className="mx-auto max-w-7xl px-6 py-20">
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Why ResumeForge AI</p>
      <h2 className="section-heading mt-4">Everything you need to go from blank page to confident application.</h2>
      <p className="mt-4 text-lg text-slate-600">
        The builder feels practical for job seekers and realistic for a production SaaS team launching a paid resume product.
      </p>
    </div>
    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {features.map((feature) => (
        <div key={feature.title} className="card p-6">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-xl">✦</div>
          <h3 className="text-xl font-semibold text-slate-950">{feature.title}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
        </div>
      ))}
    </div>
  </section>
);
