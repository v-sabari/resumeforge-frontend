import { Link } from 'react-router-dom';
import { Icon } from '../components/icons/Icon';
import { APP_NAME } from '../utils/constants';

/* ─── Data ──────────────────────────────────────────────────────── */
const features = [
  {
    icon: 'sparkles',
    title: 'AI-Powered Writing',
    desc: 'Instantly generate ATS-optimised bullet points, professional summaries, and smart skill suggestions tailored to your target job description.',
  },
  {
    icon: 'eye',
    title: 'Live Preview',
    desc: 'See your resume update in real time as you type. Switch between professional resume templates instantly.',
  },
  {
    icon: 'export',
    title: 'One-Click PDF Export',
    desc: 'Download your resume as a perfectly formatted, recruiter-ready PDF with a single click.',
  },
  {
    icon: 'zap',
    title: 'ATS Optimised',
    desc: 'Built around real Applicant Tracking System requirements, including clean resume format, keyword targeting, and ATS-friendly structure.',
  },
  {
    icon: 'briefcase',
    title: 'Multiple Resumes',
    desc: 'Create and manage multiple resumes for different roles, industries, and job applications from one account.',
  },
  {
    icon: 'lock',
    title: 'Secure & Private',
    desc: 'Your data is encrypted and never shared. Export and delete whenever you want with full control.',
  },
];

const steps = [
  { n: '01', title: 'Create your account', desc: 'Free sign-up, no credit card required.' },
  { n: '02', title: 'Fill in your details', desc: 'Use our AI Resume Builder to write, improve, and tailor each section.' },
  { n: '03', title: 'Download your PDF', desc: 'Export an ATS-friendly, recruiter-ready resume in minutes.' },
];

const testimonials = [
  {
    name: 'Priya S.',
    role: 'Software Engineer, Bengaluru',
    quote: 'Landed my dream job at a top startup. The AI bullets saved me hours of staring at a blank page.',
  },
  {
    name: 'James T.',
    role: 'Product Manager, London',
    quote: "Cleanest resume I've ever had. Recruiters actually comment on the formatting.",
  },
  {
    name: 'Aditi R.',
    role: 'UX Designer, Mumbai',
    quote: 'I had 5 interviews in 2 weeks after using ResumeForge AI. The ATS optimisation really works.',
  },
  {
    name: 'Carlos M.',
    role: 'Data Analyst, São Paulo',
    quote: 'Super easy to use and the PDF output looks completely professional. Worth every rupee.',
  },
];

const faqs = [
  {
    q: 'Is ResumeForge AI free to use?',
    a: 'Yes. You can create a full resume and export it free. Free accounts include 2 PDF downloads. Upgrade to Premium for unlimited exports.',
  },
  {
    q: 'What makes ResumeForge AI different from other builders?',
    a: "Our AI engine generates ATS-ready content tailored to your target role. We don't just format — we help you write stronger resumes for real job applications.",
  },
  {
    q: 'Will my resume pass ATS?',
    a: 'Our templates and content guidelines are built specifically to pass Applicant Tracking Systems used by many employers and hiring teams.',
  },
  {
    q: 'Can I create multiple resumes?',
    a: 'Yes. Create separate resumes for different roles, industries, and job descriptions. All are saved in your dashboard.',
  },
  {
    q: 'How does the Premium plan work?',
    a: 'One payment unlocks unlimited PDF exports, no ad gates, and premium template access for your account.',
  },
];

/* ─── Sections ───────────────────────────────────────────────────── */
const HeroSection = () => (
  <section className="relative overflow-hidden bg-white">
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-24 -right-24 h-[260px] w-[260px] rounded-full bg-brand-50/70 blur-2xl" />
      <div className="absolute -bottom-16 -left-16 h-[220px] w-[220px] rounded-full bg-brand-100/40 blur-2xl" />
    </div>

    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="max-w-3xl">
        <div className="badge-brand mb-6 inline-flex items-center gap-2 px-3 py-1">
          <Icon name="sparkles" className="h-3.5 w-3.5" />
          <span>AI Resume Builder</span>
        </div>

        <h1 className="hero-title">
          AI Resume Builder to Create
          <br />
          <span className="gradient-text">ATS-Friendly Resumes</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-500">
          {APP_NAME} is an AI Resume Builder that helps you create ATS-friendly resumes, improve
          bullet points, tailor your content to job descriptions, and export a recruiter-ready PDF
          in minutes.
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
              <Icon name="check" className="h-4 w-4 text-success-600" />
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="card absolute right-8 top-1/2 hidden w-64 -translate-y-1/2 space-y-3 p-4 shadow-lift xl:block">
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
          <div className="mb-2 h-3 w-20 rounded bg-brand-100" />
          <div className="flex flex-wrap gap-1.5">
            {['React', 'TypeScript', 'Node.js', 'Figma'].map((s) => (
              <span key={s} className="badge-brand text-[11px]">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="h-px bg-surface-200" />

        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-2">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-400" />
              <div className="flex-1 space-y-1">
                <div className="h-2 w-full rounded bg-surface-200" />
                <div className="h-2 w-4/5 rounded bg-surface-100" />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <div className="flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2">
            <Icon name="export" className="h-3.5 w-3.5 text-white" />
            <span className="text-xs font-semibold text-white">Export PDF</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section id="features" className="bg-surface-50 py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="kicker mb-2">Why ResumeForge AI</p>
        <h2 className="section-title text-3xl sm:text-4xl">Everything you need to build a better resume</h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-400">
          Every feature is designed to help job seekers create stronger resumes, improve ATS
          compatibility, and apply with confidence.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon, title, desc }) => (
          <div
            key={title}
            className="card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon name={icon} className="h-5 w-5" />
            </div>
            <h3 className="mb-1.5 text-base font-semibold text-ink-950">{title}</h3>
            <p className="text-sm leading-relaxed text-ink-400">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const SeoContentSection = () => (
  <section className="bg-white py-20">
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="kicker mb-2">Built for modern job applications</p>
        <h2 className="section-title text-3xl sm:text-4xl">Why use our AI Resume Builder?</h2>
      </div>

      <div className="space-y-5 text-base leading-relaxed text-ink-500">
        <p>
          ResumeForge AI helps job seekers create professional resumes that are optimized for modern
          Applicant Tracking Systems. Our AI Resume Builder improves your resume format, strengthens
          your experience bullets, and helps you present your skills more clearly.
        </p>

        <p>
          You can choose from ATS-friendly resume templates, tailor your resume to job descriptions,
          refine bullet points for impact, and build resumes that are easier for recruiters and ATS
          software to read.
        </p>

        <p>
          Whether you are applying for internships, fresher roles, technical positions, design jobs,
          or management roles, ResumeForge AI helps you prepare stronger job applications with less
          manual effort.
        </p>

        <p>
          You can also create multiple resume versions for different roles, improve keyword relevance,
          and export a recruiter-ready PDF resume in just a few clicks.
        </p>
      </div>
    </div>
  </section>
);

const HowItWorksSection = () => (
  <section className="bg-white py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="kicker mb-2">Process</p>
        <h2 className="section-title text-3xl sm:text-4xl">Three steps to create your resume</h2>
      </div>

      <div className="relative grid gap-8 md:grid-cols-3">
        {steps.map(({ n, title, desc }, i) => (
          <div key={n} className="relative text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-xl font-bold text-white shadow-lift">
              {n}
            </div>
            <h3 className="mb-1.5 text-base font-semibold text-ink-950">{title}</h3>
            <p className="mx-auto max-w-xs text-sm text-ink-400">{desc}</p>

            {i < steps.length - 1 && (
              <div className="absolute left-[60%] top-7 hidden h-px w-[80%] bg-surface-200 md:block" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/register" className="btn-primary btn-lg">
          Start building for free
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

const PricingPreviewSection = () => (
  <section className="bg-surface-50 py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="kicker mb-2">Pricing</p>
        <h2 className="section-title text-3xl sm:text-4xl">Simple, transparent pricing</h2>
        <p className="mt-3 text-ink-400">Start free. Upgrade only when you need more.</p>
      </div>

      <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
        <div className="card p-7">
          <p className="kicker mb-2">Free</p>
          <div className="mb-4 flex items-end gap-1">
            <span className="font-display text-4xl font-semibold text-ink-950">$0</span>
            <span className="mb-1 text-ink-400">/forever</span>
          </div>
          <ul className="mb-6 space-y-2.5 text-sm text-ink-500">
            {['Full resume builder', 'AI writing assistance', '2 PDF exports', 'Classic template'].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 shrink-0 text-success-600" />
                {f}
              </li>
            ))}
          </ul>
          <Link to="/register" className="btn-secondary w-full justify-center">
            Get started free
          </Link>
        </div>

        <div className="card relative overflow-hidden border-2 border-brand-500 p-7">
          <div className="premium-badge absolute right-4 top-4">POPULAR</div>
          <p className="kicker mb-2 text-brand-600">Premium</p>
          <div className="mb-4 flex items-end gap-1">
            <span className="font-display text-4xl font-semibold text-ink-950">$9</span>
            <span className="mb-1 text-ink-400">/one-time</span>
          </div>
          <ul className="mb-6 space-y-2.5 text-sm text-ink-500">
            {[
              'Everything in Free',
              'Unlimited PDF exports',
              'Modern + Classic templates',
              'No ad interruptions',
              'Priority support',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Icon name="check" className="h-4 w-4 shrink-0 text-brand-600" />
                {f}
              </li>
            ))}
          </ul>
          <Link to="/pricing" className="btn-primary w-full justify-center">
            Get Premium
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const StarRating = () => (
  <div className="mb-3 flex gap-0.5" role="img" aria-label="5 out of 5 stars">
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
  <section className="bg-white py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="kicker mb-2">Social proof</p>
        <h2 className="section-title text-3xl sm:text-4xl">Trusted by job seekers worldwide</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {testimonials.map(({ name, role, quote }) => (
          <div key={name} className="card p-5">
            <StarRating />
            <p className="mb-4 text-sm leading-relaxed text-ink-600">"{quote}"</p>
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

const FaqSection = () => (
  <section className="bg-surface-50 py-20">
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <div className="mb-12 text-center">
        <p className="kicker mb-2">FAQ</p>
        <h2 className="section-title text-3xl sm:text-4xl">Common questions</h2>
      </div>
      <div className="space-y-3">
        {faqs.map(({ q, a }) => (
          <details key={q} className="card group">
            <summary className="flex cursor-pointer list-none items-center justify-between p-5 text-sm font-semibold text-ink-950">
              {q}
              <Icon
                name="chevronDown"
                className="ml-3 h-4 w-4 shrink-0 text-ink-400 transition-transform group-open:rotate-180"
              />
            </summary>
            <div className="border-t border-surface-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-ink-500">
              {a}
            </div>
          </details>
        ))}
      </div>
    </div>
  </section>
);

const CtaBanner = () => (
  <section className="bg-brand-600 py-20">
    <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
      <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Ready to build a better ATS-friendly resume?
      </h2>
      <p className="mt-4 text-lg text-brand-200">
        Join professionals using {APP_NAME} to create stronger resumes and apply with confidence.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/register"
          className="btn btn-lg bg-white text-brand-700 shadow-lift hover:bg-brand-50"
        >
          Start building — it&apos;s free
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

export const LandingPage = () => (
  <div>
    <HeroSection />
    <FeaturesSection />
    <SeoContentSection />
    <HowItWorksSection />
    <PricingPreviewSection />
    <TestimonialsSection />
    <FaqSection />
    <CtaBanner />
  </div>
);