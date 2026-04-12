import { Link } from 'react-router-dom';
import { Icon } from '../components/icons/Icon';
import { APP_NAME } from '../utils/constants';
import AdBanner from '../components/common/AdBanner';
/* ─── Data ──────────────────────────────────────────────────────── */
const features = [
  { icon: 'sparkles', title: 'AI-Powered Writing',    desc: 'Instantly generate ATS-optimised bullet points, professional summaries, and smart skill suggestions — powered by AI.' },
  { icon: 'eye',      title: 'Live Preview',          desc: 'See your resume update in real time as you type. Switch between Classic and Modern templates instantly.' },
  { icon: 'export',   title: 'One-Click PDF Export',  desc: 'Download your resume as a perfectly formatted, recruiter-ready PDF with a single click.' },
  { icon: 'zap',      title: 'ATS Optimised',         desc: 'Built around real Applicant Tracking System requirements — correct structure, keywords, and formatting.' },
  { icon: 'briefcase','title': 'Multiple Resumes',    desc: 'Create and manage unlimited resume versions for different roles, all stored securely in your account.' },
  { icon: 'lock',     title: 'Secure & Private',      desc: 'Your data is encrypted and never shared. Export and delete whenever you want — full control.' },
];

const steps = [
  { n: '01', title: 'Create your account',  desc: 'Free sign-up, no credit card required.' },
  { n: '02', title: 'Fill in your details', desc: 'Simple section-by-section editor with AI assistance.' },
  { n: '03', title: 'Download your PDF',    desc: 'One click. Perfectly formatted resume, ready to send.' },
];

const testimonials = [
  { name: 'Priya S.',    role: 'Software Engineer, Bengaluru', quote: 'Landed my dream job at a top startup. The AI bullets saved me hours of staring at a blank page.' },
  { name: 'James T.',    role: 'Product Manager, London',      quote: 'Cleanest resume I\'ve ever had. Recruiters actually comment on the formatting.' },
  { name: 'Aditi R.',    role: 'UX Designer, Mumbai',          quote: 'I had 5 interviews in 2 weeks after using ResumeForge AI. The ATS optimisation really works.' },
  { name: 'Carlos M.',   role: 'Data Analyst, São Paulo',      quote: 'Super easy to use and the PDF output looks completely professional. Worth every rupee.' },
];

const faqs = [
  { q: 'Is ResumeForge AI free to use?',                     a: 'Yes. You can create a full resume and export it free. Free accounts include 2 PDF downloads. Upgrade to Premium for unlimited exports.' },
  { q: 'What makes ResumeForge AI different from other builders?', a: 'Our AI engine generates ATS-ready content tailored to your target role. We don\'t just format — we help you write.' },
  { q: 'Will my resume pass ATS?',                       a: 'Our templates and content guidelines are built specifically to pass Applicant Tracking Systems used by Fortune 500 companies.' },
  { q: 'Can I create multiple resumes?',                 a: 'Yes. Create separate resumes for different roles and industries. All saved in your dashboard.' },
  { q: 'How does the Premium plan work?',                a: 'One payment unlocks unlimited PDF exports, no ad gates, and premium template access for your account.' },
];

/* ─── Sections ───────────────────────────────────────────────────── */
const HeroSection = () => (
  <section className="relative overflow-hidden bg-white">
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-brand-50 opacity-60 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-brand-100/40 blur-3xl" />
    </div>

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 badge-brand mb-6 py-1 px-3">
          <Icon name="sparkles" className="h-3.5 w-3.5" />
          <span>AI-Powered Resume Builder</span>
        </div>

        <h1 className="hero-title">
          Build a resume that<br />
          <span className="gradient-text">gets you hired</span>
        </h1>

        <p className="mt-6 text-lg text-ink-500 max-w-2xl leading-relaxed">
          {APP_NAME} uses AI to help you write powerful bullet points, optimise for ATS systems,
          and download a beautiful PDF — in minutes, not hours.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to="/register" className="btn-primary btn-lg">
            Build my resume — free
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
          <Link to="/pricing" className="btn-secondary btn-lg">
            See pricing
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-ink-400">
          {['Free to start', 'No credit card', 'ATS optimised', '2 free exports'].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <Icon name="check" className="h-4 w-4 text-success-600" />{t}
            </span>
          ))}
        </div>
      </div>

      {/* Mock resume card */}
      <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-72 card shadow-lift-lg p-5 space-y-3">
        <div className="space-y-1">
          <div className="h-5 w-36 rounded-lg bg-brand-600" />
          <div className="h-3 w-24 rounded bg-surface-200" />
        </div>
        <div className="h-px bg-surface-200" />
        <div className="space-y-1.5">
          <div className="h-2.5 w-full rounded bg-surface-200" />
          <div className="h-2.5 w-5/6 rounded bg-surface-200" />
          <div className="h-2.5 w-4/5 rounded bg-surface-100" />
        </div>
        <div>
          <div className="h-3 w-20 rounded bg-brand-100 mb-2" />
          <div className="flex flex-wrap gap-1.5">
            {['React', 'TypeScript', 'Node.js', 'Figma'].map((s) => (
              <span key={s} className="badge-brand text-[11px]">{s}</span>
            ))}
          </div>
        </div>
        <div className="h-px bg-surface-200" />
        <div className="space-y-2">
          {[1,2].map((i) => (
            <div key={i} className="flex gap-2">
              <div className="h-2 w-2 mt-1 rounded-full bg-brand-400 shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="h-2 w-full rounded bg-surface-200" />
                <div className="h-2 w-4/5 rounded bg-surface-100" />
              </div>
            </div>
          ))}
        </div>
        <div className="pt-2">
          <div className="flex items-center gap-2 bg-brand-600 rounded-xl px-3 py-2">
            <Icon name="export" className="h-3.5 w-3.5 text-white" />
            <span className="text-xs font-semibold text-white">Export PDF</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section id="features" className="py-20 bg-surface-50">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <p className="kicker mb-2">Why ResumeForge AI</p>
        <h2 className="section-title text-3xl sm:text-4xl">Everything you need to land the job</h2>
        <p className="mt-3 text-ink-400 max-w-xl mx-auto">
          No fluff. Every feature is built around helping you create a resume that gets shortlisted.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon, title, desc }) => (
          <div key={title} className="card p-6 hover:shadow-lift transition-all duration-200 hover:-translate-y-0.5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon name={icon} className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-ink-950 mb-1.5">{title}</h3>
            <p className="text-sm text-ink-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorksSection = () => (
  <section className="py-20 bg-white">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <p className="kicker mb-2">Process</p>
        <h2 className="section-title text-3xl sm:text-4xl">Three steps to a winning resume</h2>
      </div>
      <div className="grid gap-8 md:grid-cols-3 relative">
        {steps.map(({ n, title, desc }, i) => (
          <div key={n} className="relative text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white font-display font-bold text-xl shadow-lift">
              {n}
            </div>
            <h3 className="text-base font-semibold text-ink-950 mb-1.5">{title}</h3>
            <p className="text-sm text-ink-400 max-w-xs mx-auto">{desc}</p>
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-px bg-surface-200" />
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link to="/register" className="btn-primary btn-lg">
          Start building for free
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

const PricingPreviewSection = () => (
  <section className="py-20 bg-surface-50">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <p className="kicker mb-2">Pricing</p>
        <h2 className="section-title text-3xl sm:text-4xl">Simple, transparent pricing</h2>
        <p className="mt-3 text-ink-400">Start free. Upgrade only when you need more.</p>
      </div>

      <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
        {/* Free */}
        <div className="card p-7">
          <p className="kicker mb-2">Free</p>
          <div className="flex items-end gap-1 mb-4">
            <span className="text-4xl font-display font-semibold text-ink-950">$0</span>
            <span className="text-ink-400 mb-1">/forever</span>
          </div>
          <ul className="space-y-2.5 mb-6 text-sm text-ink-500">
            {['Full resume builder', 'AI writing assistance', '2 PDF exports', 'Classic template'].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-success-600 shrink-0" />{f}
              </li>
            ))}
          </ul>
          <Link to="/register" className="btn-secondary w-full justify-center">Get started free</Link>
        </div>

        {/* Premium */}
        <div className="card p-7 border-2 border-brand-500 relative overflow-hidden">
          <div className="absolute top-4 right-4 premium-badge">POPULAR</div>
          <p className="kicker text-brand-600 mb-2">Premium</p>
          <div className="flex items-end gap-1 mb-4">
            <span className="text-4xl font-display font-semibold text-ink-950">$9</span>
            <span className="text-ink-400 mb-1">/one-time</span>
          </div>
          <ul className="space-y-2.5 mb-6 text-sm text-ink-500">
            {['Everything in Free', 'Unlimited PDF exports', 'Modern + Classic templates', 'No ad interruptions', 'Priority support'].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 text-brand-600 shrink-0" />{f}
              </li>
            ))}
          </ul>
          <Link to="/pricing" className="btn-primary w-full justify-center">Get Premium</Link>
        </div>
      </div>
    </div>
  </section>
);

// ── FIX BUG-20: Added aria-label to first star, aria-hidden to remaining 4 ──
const StarRating = () => (
  <div className="flex gap-0.5 mb-3" role="img" aria-label="5 out of 5 stars">
    {[...Array(5)].map((_, i) => (
      <Icon
        key={i}
        name="star"
        className="h-4 w-4 fill-amber-400 text-amber-400"
        aria-hidden="true"
      />
    ))}
  </div>
);

const TestimonialsSection = () => (
  <section className="py-20 bg-white">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <p className="kicker mb-2">Social proof</p>
        <h2 className="section-title text-3xl sm:text-4xl">Trusted by job seekers worldwide</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map(({ name, role, quote }) => (
          <div key={name} className="card p-5">
            <StarRating />
            <p className="text-sm text-ink-600 leading-relaxed mb-4">"{quote}"</p>
            <div>
              <p className="text-sm font-semibold text-ink-950">{name}</p>
              <p className="text-xs text-ink-400">{role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FaqSection = () => {
  return (
    <section className="py-20 bg-surface-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="kicker mb-2">FAQ</p>
          <h2 className="section-title text-3xl sm:text-4xl">Common questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <details key={q} className="card group">
              <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-semibold text-ink-950 list-none">
                {q}
                <Icon name="chevronDown" className="h-4 w-4 text-ink-400 transition-transform group-open:rotate-180 shrink-0 ml-3" />
              </summary>
              <div className="px-5 pb-5 text-sm text-ink-500 leading-relaxed border-t border-surface-100 pt-3">
                {a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

const CtaBanner = () => (
  <section className="py-20 bg-brand-600">
    <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
      <h2 className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight">
        Ready to land your next job?
      </h2>
      <p className="mt-4 text-brand-200 text-lg">
        Join thousands of professionals who built their winning resume with {APP_NAME}.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/register" className="btn btn-lg bg-white text-brand-700 hover:bg-brand-50 shadow-lift">
          Start building — it's free
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

export const LandingPage = () => (
  <div>
    <HeroSection />
    <AdBanner className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />
    <FeaturesSection />
    <HowItWorksSection />
    <PricingPreviewSection />
    <TestimonialsSection />
    <FaqSection />
    <CtaBanner />
  </div>
);