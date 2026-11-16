import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/icons/Icon';
import { PublicFeedbackSection } from '../components/feedback/PublicFeedbackSection';
import { APP_NAME, EXPORT_FREE_SHORT, EXPORT_PREMIUM_LABEL } from '../utils/constants';

/* ─── Static data ────────────────────────────────────────────────── */

const features = [
  { icon: 'sparkles',  title: 'AI-Powered Writing',  desc: 'Instantly generate ATS-optimised bullet points, professional summaries, and smart skill suggestions tailored to your target job description.' },
  { icon: 'eye',       title: 'Live Preview',         desc: 'See your resume update in real time as you type. Switch between professional resume templates instantly.' },
  { icon: 'export',    title: 'PDF + DOCX + TXT',    desc: 'Download your resume as a perfectly formatted, recruiter-ready PDF, Word document, or plain text for ATS portals.' },
  { icon: 'zap',       title: 'ATS Optimised',        desc: 'Built around real Applicant Tracking System requirements, including clean resume format, keyword targeting, and ATS-friendly structure.' },
  { icon: 'briefcase', title: 'Multiple Resumes',     desc: 'Create and manage multiple resumes for different roles, industries, and job applications from one account.' },
  { icon: 'lock',      title: 'Secure & Private',     desc: 'Your data is encrypted and never shared. Export and delete whenever you want with full control.' },
];

const steps = [
  { n: '01', title: 'Create your account',  desc: 'Free sign-up, no credit card required.' },
  { n: '02', title: 'Fill in your details', desc: 'Use our AI Resume Builder to write, improve, and tailor each section.' },
  { n: '03', title: 'Download your resume', desc: 'Export a PDF, DOCX, or plain-text version in minutes.' },
];

const faqs = [
  {
    q: 'Is ResumeForge AI free to use?',
    a: `Yes. You can create a full resume and export it free. Free accounts include ${EXPORT_FREE_SHORT}. Upgrade to Premium once for unlimited exports.`,
  },
  {
    q: 'What makes ResumeForge AI different?',
    a: "Our AI engine generates ATS-ready content tailored to your target role. We don't just format — we help you write stronger resumes.",
  },
  {
    q: 'Will my resume pass ATS?',
    a: 'Our templates and content guidelines are built specifically to pass the Applicant Tracking Systems used by most employers.',
  },
  {
    q: 'Can I create multiple resumes?',
    a: 'Yes. Create separate resumes for different roles and job descriptions. All saved in your dashboard with version history.',
  },
  {
    q: 'How does the Premium plan work?',
    a: 'One payment unlocks unlimited exports (PDF, DOCX, TXT), all AI tools including cover letters and interview prep, and all templates forever.',
  },
  {
    q: 'Can I earn Premium for free?',
    a: 'Yes — our referral programme lets you earn days of Premium by inviting friends. 1 friend = 3 days, 3 friends = ATS Pro Scan, 5 friends = 1 month Premium.',
  },
];

// ─── FaqSchema ─────────────────────────────────────────────────────────────────
// FIX #7: Adds FAQPage JSON-LD structured data to the homepage.
// Google uses this to generate rich result FAQ snippets in search results.
// The schema is built directly from the faqs array above — single source of truth.
// Any change to faqs[] is automatically reflected in the schema.
const FaqSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// ─── PHASE-6c: SoftwareApplication + Offer JSON-LD ───────────────────────────
// Adds SoftwareApplication structured data to the homepage with two Offer
// entries (free ₹0, premium ₹749 one-time). This enables Google to display
// the app in software-rich-result carousels and surfaces pricing in search.
// The ₹749 price matches the backend PremiumController and the frontend
// UpsellModal — single source of truth for pricing copy.
const AppSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: APP_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: `${APP_NAME} is an AI Resume Builder that helps you create ATS-friendly resumes, improve bullet points, tailor your content to job descriptions, and export a recruiter-ready PDF in minutes.`,
    url: 'https://www.resumeforgeai.site',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free Plan',
        price: '0',
        priceCurrency: 'INR',
        description: `Full resume builder, AI writing assistance, ${EXPORT_FREE_SHORT}, 10 free templates.`,
        url: 'https://www.resumeforgeai.site/pricing',
      },
      {
        '@type': 'Offer',
        name: 'Premium (Lifetime)',
        price: '749',
        priceCurrency: 'INR',
        description: `One-time payment. ${EXPORT_PREMIUM_LABEL}, all 20 templates, AI Cover Letter, AI Resume Tailoring, AI Interview Prep, ATS Pro Scan, Voice & Chat Resume Builder.`,
        url: 'https://www.resumeforgeai.site/pricing',
      },
    ],
    aggregateRating: undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// ─── Use Cases ─────────────────────────────────────────────────────────────────
// FIX HIGH-01: Replaced fabricated TESTIMONIALS array with honest USE_CASES.
// Changes made:
//   - Renamed TESTIMONIALS → USE_CASES (accurate label)
//   - Removed `rating` field — all-5-star unverified ratings are an AdSense spam signal
//   - Replaced `quote` with `story` — framed as a use case, not a direct user quote
//   - Added `outcome` — concrete result, more credible and indexable
//   - StarRating component removed entirely
/* PHASE-5 CONTENT & TRUST:
 * The previous USE_CASES array contained four fabricated personas (Priya S.,
 * James T., Aditi R., Carlos M.) with concrete outcome claims — interview
 * counts, recruiter quotes, "passed ATS parsing at two Fortune 500 portals".
 * None of these were real users; the outcomes were invented. Per the brief,
 * the section is replaced with a how-it-works block (3 factual steps with
 * no fabricated names, quotes, or statistics). Real testimonials are a TODO.
 */
const HOW_IT_WORKS_STEPS = [
  {
    step:   '01',
    title:  'Pick a template',
    body:   'Choose from 20 ATS-friendly templates — 10 free, 10 premium. Every template is single-column-safe and parses cleanly through applicant tracking systems.',
    icon:   'grid',
  },
  {
    step:   '02',
    title:  'Fill with AI assistance',
    body:   'Add your experience, skills, and education. Use AI bullet rewriting and job-description tailoring to strengthen your content without writing from scratch.',
    icon:   'sparkles',
  },
  {
    step:   '03',
    title:  'Preview and export',
    body:   `Watch the live A4 preview update as you type. Export to PDF, DOCX, or plain text. Free plan includes ${EXPORT_FREE_SHORT}.`,
    icon:   'export',
  },
];

/* ─── Section Components ─────────────────────────────────────────────────────── */

const HeroSection = () => (
  <section className="relative overflow-hidden bg-white">
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-24 -right-24 h-[260px] w-[260px] rounded-full bg-brand-50/70 blur-2xl" />
      <div className="absolute -bottom-16 -left-16 h-[220px] w-[220px] rounded-full bg-brand-100/40 blur-2xl" />
    </div>
    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      {/* PHASE-5g: two-column hero. Left = copy + CTAs. Right = real product
          screenshot (the Modern Pro template rendered with sample data,
          exported as an optimized WebP from the existing
          public/templates/modern.png asset). Explicit width/height attributes
          prevent layout shift; alt text describes what the screenshot shows. */}
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
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
            {['Free to start', 'No credit card', 'ATS optimised', EXPORT_FREE_SHORT].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Icon name="check" className="h-4 w-4 text-success-600" />
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="relative lg:pl-8">
          {/* Product screenshot — Modern Pro template preview. WebP, 57KB,
              640×905. Frame shadow + rounded corners give it a windowchrome
              feel without misrepresenting the actual template output. */}
          <div className="rounded-2xl border border-surface-200 bg-surface-50 p-3 shadow-xl">
            <img
              src="/hero-template.webp"
              alt="Screenshot of the Modern Pro resume template rendered with sample data — single column, sans-serif headings, contact details at the top, experience and education sections below."
              width={640}
              height={905}
              className="block w-full h-auto rounded-lg"
              loading="eager"
              decoding="async"
            />
          </div>
          <p className="mt-3 text-center text-xs text-ink-400">
            Modern Pro template — one of 20 ATS-friendly designs included.
          </p>
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
        <h2 className="text-3xl font-display font-semibold text-ink-950">
          Everything you need to get hired
        </h2>
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
        <h2 className="text-3xl font-display font-semibold text-ink-950">
          Build your resume in minutes
        </h2>
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

// FIX HIGH-01: Section fully rewritten.
//   - Kicker changed from "Testimonials" → "Use cases"
//   - Heading changed from "What job seekers say" → "How people use ResumeForge AI"
//   - Disclaimer added: "Illustrative use cases based on common outcomes."
//     Clearly labelled illustrative content is not flagged by Google as fake social proof.
//   - StarRating removed; replaced with success-tinted outcome badge
//   - blockquote/italic quote removed; replaced with plain story paragraph
const UseCasesSection = () => (
  <section className="bg-surface-50 py-16 sm:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <p className="kicker mb-2">How it works</p>
        <h2 className="text-3xl font-display font-semibold text-ink-950">
          Build a resume in three steps
        </h2>
        <p className="mt-2 text-sm text-ink-400">
          No sign-up fee, no credit card. Start free, upgrade only if you need more.
        </p>
      </div>
      {/* TODO(real-testimonials): Replace this how-it-works block with real
          user testimonials once we have collected verifiable reviews with
          consent to publish. Until then, this section stays factual and
          free of fabricated names, quotes, or outcome statistics. */}
      <div className="grid gap-5 sm:grid-cols-3">
        {HOW_IT_WORKS_STEPS.map(({ step, title, body, icon }) => (
          <div key={step} className="card p-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Icon name={icon} className="h-4 w-4" />
              </span>
              <span className="text-xs font-semibold text-ink-300 tracking-widest">{step}</span>
            </div>
            <h3 className="text-base font-semibold text-ink-950">{title}</h3>
            <p className="text-sm text-ink-600 leading-relaxed">{body}</p>
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
        {[
          ['1 friend',  '3 days Premium'],
          ['3 friends', 'ATS Pro Scan'],
          ['5 friends', '1 month Premium'],
        ].map(([friends, reward]) => (
          <div
            key={friends}
            className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-center min-w-[130px]"
          >
            <p className="text-white font-semibold text-sm">{friends}</p>
            <p className="text-white/70 text-xs mt-0.5">{reward}</p>
          </div>
        ))}
      </div>
      <Link
        to="/register"
        className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
      >
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
                aria-expanded={open === i}
              >
                {q}
                <Icon
                  name={open === i ? 'close' : 'plus'}
                  className="h-4 w-4 shrink-0 text-ink-400 ml-3"
                />
              </button>
              {open === i && (
                <div className="px-5 pb-4 pt-3 text-sm text-ink-500 leading-relaxed border-t border-surface-100">
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
        Start with a free account — build, preview, and export. Upgrade once for lifetime premium if you need more templates or unlimited exports.
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
      <p className="mt-4 text-xs text-ink-400">
        No credit card required · {EXPORT_FREE_SHORT}
      </p>
    </div>
  </section>
);

/* ─── Page ───────────────────────────────────────────────────────────────────── */
// FIX #7:  <FaqSchema /> injected as first child — renders JSON-LD into <head>
//          before any visible section. Order of visible sections unchanged.
// FIX HIGH-01: <UseCasesSection /> now renders USE_CASES (not TESTIMONIALS).
// FIX #7:  <FaqSchema /> injected as first child — renders JSON-LD into <head>
//          before any visible section. Order of visible sections unchanged.
// FIX HIGH-01: <UseCasesSection /> now renders USE_CASES (not TESTIMONIALS).
// FEEDBACK: <PublicFeedbackSection /> shows real general feedback (newest first)
//           from GET /api/feedback/public. Existing sections untouched.
export const LandingPage = () => (
  <main>
    <FaqSchema />
    {/* PHASE-6c: SoftwareApplication + Offer JSON-LD on the homepage */}
    <AppSchema />
    <HeroSection />
    <FeaturesSection />
    {/* P2-5: merged the two "How it works" sections into one. The old
        StepsSection (kicker "How it works", step 1 "Create your account")
        duplicated UseCasesSection and front-loaded the signup wall (P1-3).
        UseCasesSection's 3-step flow (Add experience → Use AI → Preview and
        export) is the guest-friendly framing, so it is the single source. */}
    <UseCasesSection />
    <PublicFeedbackSection />
    <ReferralSection />
    <FaqSection />
    <CtaSection />
  </main>
);