import { Link } from 'react-router-dom';
import { SectionBadge } from '../common/SectionBadge';
import { Icon } from '../icons/Icon';

const metricCards = [
  ['20k+', 'Resumes generated'],
  ['4.9/5', 'Average user rating'],
  ['2x faster', 'Application prep time'],
];

export const HeroSection = () => (
  <section className="section-shell pt-12 sm:pt-16 lg:pt-20">
    <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
      <div>
        <SectionBadge>AI resume builder</SectionBadge>
        <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
          Premium resume building for candidates who need speed, clarity, and better interview-ready output.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          ResumeForge AI combines structured editing, real-time preview, AI-powered refinement, and payment-aware export controls in one polished workspace that feels calmer, cleaner, and easier to trust.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
          Instead of juggling disconnected forms, messy layouts, and unclear upgrade prompts, users can move from first draft to final PDF inside a guided flow that keeps every important action visible. The frontend is redesigned to feel premium while preserving the routes, APIs, backend integrations, and export logic that already power the product.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link to="/register" className="btn-primary">
            Create your resume
          </Link>
          <a href="#features" className="btn-secondary">
            Explore features
          </a>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {metricCards.map(([value, label]) => (
            <div key={label} className="glass-panel p-4 card-interactive">
              <p className="text-2xl font-semibold text-slate-950">{value}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="card overflow-hidden p-4 sm:p-5 lg:p-6">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Live preview</p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-950">Aarav Mehta</h3>
                      <p className="text-sm text-slate-500">Senior Product Designer</p>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      ATS Ready
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    <div className="h-2 rounded-full bg-slate-100" />
                    <div className="h-2 w-11/12 rounded-full bg-slate-100" />
                    <div className="h-2 w-10/12 rounded-full bg-slate-100" />
                    <div className="h-2 w-8/12 rounded-full bg-slate-100" />
                  </div>
                </div>
                <div className="rounded-3xl border border-brand-100 bg-brand-50/70 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white p-2 text-brand-700 shadow-sm">
                      <Icon name="sparkles" className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">AI suggestion</p>
                      <p className="text-sm text-slate-600">Add measurable outcomes to your latest role and sharpen the summary for recruiter scans.</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Why this redesign matters</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Better spacing, clearer hierarchy, aligned cards, and calmer interactions make the product feel more reliable for users preparing important job applications.
                  </p>
                </div>
              </div>

              <div className="surface-dark p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-200">Export access</p>
                <h3 className="mt-3 text-2xl font-semibold text-white">1 free export via ad unlock</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  The UI becomes much more premium without touching the existing monetization flow, payment integration, or download logic already wired into the app.
                </p>
                <div className="mt-6 space-y-3">
                  {['Unlimited exports after upgrade', 'Cleaner dashboard and builder flow', 'Faster editing and preview loop'].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                      <Icon name="check" className="h-4 w-4" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <button type="button" className="btn-secondary mt-6 w-full justify-center border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white">Premium workflow</button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-6 -top-6 hidden h-24 w-24 rounded-full bg-brand-300/30 blur-3xl lg:block" />
      </div>
    </div>
  </section>
);
