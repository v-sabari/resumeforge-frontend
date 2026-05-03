import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/icons/Icon';
import { APP_NAME } from '../utils/constants';

/* ─── Static data ────────────────────────────────────────────────── */
const features = [
  { icon: 'sparkles', title: 'AI-Powered Writing',   desc: 'Instantly generate ATS-optimised bullet points, professional summaries, and smart skill suggestions tailored to your target job description.' },
  { icon: 'eye',      title: 'Live Preview',          desc: 'See your resume update in real time as you type. Switch between professional resume templates instantly.' },
  { icon: 'export',   title: 'PDF + DOCX + TXT',     desc: 'Download your resume as a perfectly formatted, recruiter-ready PDF, Word document, or plain text for ATS portals.' },
  { icon: 'zap',      title: 'ATS Optimised',         desc: 'Built around real Applicant Tracking System requirements, including clean resume format, keyword targeting, and ATS-friendly structure.' },
  { icon: 'briefcase', title: 'Multiple Resumes',    desc: 'Create and manage multiple resumes for different roles, industries, and job applications from one account.' },
  { icon: 'lock',     title: 'Secure & Private',      desc: 'Your data is encrypted and never shared. Export and delete whenever you want with full control.' },
];

const steps = [
  { n: '01', title: 'Create your account',    desc: 'Free sign-up, no credit card required.' },
  { n: '02', title: 'Fill in your details',   desc: 'Use our AI Resume Builder to write, improve, and tailor each section.' },
  { n: '03', title: 'Download your resume',   desc: 'Export a PDF, DOCX, or plain-text version in minutes.' },
];

const faqs = [
  { q: 'Is ResumeForge AI free to use?',
    a: 'Yes. You can create a full resume and export it free. Free accounts include 2 PDF downloads. Upgrade to Premium once for unlimited exports.' },
  { q: 'What makes ResumeForge AI different?',
    a: "Our AI engine generates ATS-ready content tailored to your target role. We don't just format — we help you write stronger resumes." },
  { q: 'Will my resume pass ATS?',
    a: 'Our templates and content guidelines are built specifically to pass the Applicant Tracking Systems used by most employers.' },
  { q: 'Can I create multiple resumes?',
    a: 'Yes. Create separate resumes for different roles and job descriptions. All saved in your dashboard with version history.' },
  { q: 'How does the Premium plan work?',
    a: 'One payment unlocks unlimited exports (PDF, DOCX, TXT), all AI tools including cover letters and interview prep, and all templates forever.' },
  { q: 'Can I earn Premium for free?',
    a: 'Yes — our referral programme lets you earn days of Premium by inviting friends. 1 friend = 3 days, 3 friends = ATS Pro Scan, 5 friends = 1 month Premium.' },
];

const TESTIMONIALS = [
  { authorName: 'Priya S.',   authorRole: 'Software Engineer, Bengaluru', quote: 'Landed my dream job at a top startup. The AI bullets saved me hours of staring at a blank page.', rating: 5 },
  { authorName: 'James T.',   authorRole: 'Product Manager, London',      quote: "Cleanest resume I've ever had. Recruiters actually comment on the formatting.",                      rating: 5 },
  { authorName: 'Aditi R.',   authorRole: 'UX Designer, Mumbai',          quote: 'I had 5 interviews in 2 weeks after using ResumeForge AI. The ATS optimisation really works.',      rating: 5 },
  { authorName: 'Carlos M.',  authorRole: 'Data Analyst, São Paulo',      quote: 'Super easy to use and the PDF output looks completely professional. Worth every rupee.',            rating: 5 },
];

const StarRating = ({ rating = 5 }) => (
  <div className="flex gap-0.5 mb-3" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} viewBox="0 0 16 16" className={`h-4 w-4 ${i < rating ? 'text-amber-400' : 'text-surface-200'}`} fill="currentColor">
        <path d="M8 1l1.9 3.9L14 5.7l-3 2.9.7 4.1L8 10.6l-3.7 2.1.7-4.1-3-2.9 4.1-.8z" />
      </svg>
    ))}
  </div>
);

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
          <Link to="/tools" className="btn-secondary btn-lg">
            Free resume tools
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
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="bg-surface-50 py-16 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <p className="kicker mb-2">Features</p>
        <h2 className="text-3xl font-display font-semibold text-ink-950">Everything you need to get hired</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon, title, desc }) => (
          <div key={title} className="card p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon name={icon} className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-ink-950 mb-2">{title}</h3>
            <p className="text-sm text-ink-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const StepsSection = () => (
  <section className="bg-white py-16 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <p className="kicker mb-2">How it works</p>
        <h2 className="text-3xl font-display font-semibold text-ink-950">Build your resume in minutes</h2>
      </div>
      <div className="grid gap-8 sm:grid-cols-3 max-w-4xl mx-auto">
        {steps.map(({ n, title, desc }) => (
          <div key={n} className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white font-display font-bold text-lg">
              {n}
            </div>
            <h3 className="text-base font-semibold text-ink-950 mb-2">{title}</h3>
            <p className="text-sm text-ink-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="bg-surface-50 py-16 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <p className="kicker mb-2">Testimonials</p>
        <h2 className="text-3xl font-display font-semibold text-ink-950">What job seekers say</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map(({ authorName, authorRole, quote, rating }, i) => (
          <div key={i} className="card p-6 flex flex-col">
            <StarRating rating={rating} />
            <blockquote className="flex-1 text-sm text-ink-600 leading-relaxed italic mb-4">
              "{quote}"
            </blockquote>
            <div>
              <p className="text-sm font-semibold text-ink-950">{authorName}</p>
              <p className="text-xs text-ink-400 mt-0.5">{authorRole}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ReferralSection = () => (
  <section className="bg-brand-600 py-14">
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80 mb-5">
        <Icon name="sparkles" className="h-4 w-4" />
        Earn Premium for free
      </div>
      <h2 className="text-2xl sm:text-3xl font-display font-semibold text-white mb-3">
        Refer friends. Unlock Premium rewards.
      </h2>
      <p className="text-white/70 text-base max-w-xl mx-auto mb-6">
        Share your unique link. When a friend signs up and builds their first resume,
        you earn days of Premium access — completely free.
      </p>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {[['1 friend', '3 days Premium'], ['3 friends', 'ATS Pro Scan'], ['5 friends', '1 month Premium']].map(([friends, reward]) => (
          <div key={friends} className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-center min-w-[130px]">
            <p className="text-white font-semibold text-sm">{friends}</p>
            <p className="text-white/70 text-xs mt-0.5">{reward}</p>
          </div>
        ))}
      </div>
      <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors">
        Sign up and get your referral link
        <Icon name="arrowRight" className="h-4 w-4" />
      </Link>
    </div>
  </section>
);

const FaqSection = () => {
  const [open, setOpen] = useState(null);
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="kicker mb-2">FAQ</p>
          <h2 className="text-3xl font-display font-semibold text-ink-950">Common questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-ink-950 hover:bg-surface-50 transition-colors"
                aria-expanded={open === i}>
                {q}
                <Icon name={open === i ? 'close' : 'plus'} className="h-4 w-4 shrink-0 text-ink-400 ml-3" />
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-ink-500 leading-relaxed border-t border-surface-100 pt-3">
                  {a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CtaSection = () => (
  <section className="bg-surface-50 py-16 sm:py-20">
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl font-display font-semibold text-ink-950 mb-4">
        Ready to build your resume?
      </h2>
      <p className="text-ink-500 text-lg mb-8 max-w-lg mx-auto">
        Join thousands of job seekers using AI to write stronger resumes and land more interviews.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/register" className="btn-primary btn-lg">
          Build my resume — free
          <Icon name="arrowRight" className="h-4 w-4" />
        </Link>
        <Link to="/tools" className="btn-secondary btn-lg">
          Try free tools first
        </Link>
      </div>
      <p className="mt-4 text-xs text-ink-400">No credit card required · 2 free PDF exports · Cancel anytime</p>
    </div>
  </section>
);

/* ── Page ── */
export const LandingPage = () => (
  <main>
    <HeroSection />
    <FeaturesSection />
    <StepsSection />
    <TestimonialsSection />
    <ReferralSection />
    <FaqSection />
    <CtaSection />
  </main>
);