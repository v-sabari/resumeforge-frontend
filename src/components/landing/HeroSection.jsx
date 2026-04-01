import { Link } from 'react-router-dom';
import { SectionBadge } from '../common/SectionBadge';
import { Icon } from '../icons/Icon';

const metrics = [
  ['20k+', 'Resumes generated'],
  ['4.9/5', 'Average user rating'],
  ['2x faster', 'Application prep time'],
];

const highlights = [
  'Structured editing with live preview',
  'AI-assisted writing improvements',
  'Payment-aware export controls',
  'Responsive dashboard and builder',
];

export const HeroSection = () => (
  <section className="section-shell pt-12 sm:pt-16 lg:pt-20">
    <div className="grid items-center gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:gap-12">
      <div>
        <SectionBadge>AI resume builder</SectionBadge>
        <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          Build sharper resumes with a premium workflow that feels calm, fast, and trustworthy.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          ResumeForge AI combines structured editing, real-time preview, AI-powered refinement, and payment-aware export controls in one polished workspace designed for serious job seekers. Instead of bouncing between scattered tools, candidates can draft, improve, preview, and export inside one modern interface that keeps every important action close at hand.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          The redesign focuses on premium SaaS quality without changing the working logic behind your app. That means the same routes, services, backend integrations, and monetization flow continue to do their job while the frontend becomes cleaner, better aligned, more responsive, and far easier to trust on mobile, tablet, laptop, and desktop. The result is a product experience that feels more like a polished workspace and less like a basic form tool.
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
          {metrics.map(([value, label]) => (
            <div key={label} className="card p-4">
              <p className="text-2xl font-semibold text-slate-950">{value}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="card overflow-hidden p-4 sm:p-6">
          <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="grid gap-4">
              <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
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
                  <div className="h-2 rounded-full bg-slate-200" />
                  <div className="h-2 w-11/12 rounded-full bg-slate-200" />
                  <div className="h-2 w-10/12 rounded-full bg-slate-200" />
                  <div className="h-2 w-8/12 rounded-full bg-slate-200" />
                </div>
              </div>

              <div className="rounded-[28px] border border-brand-100 bg-brand-50/70 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white p-2 text-brand-700 shadow-sm">
                    <Icon name="sparkles" className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">AI suggestion</p>
                    <p className="text-sm text-slate-600">Add measurable outcomes to your latest role and tighten your professional summary.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="surface-dark flex h-full flex-col p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-200">Premium workflow</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">1 free export via ad unlock, then seamless upgrade options</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Keep the existing payment and export logic while presenting a cleaner path for unlimited downloads, clearer plan messaging, and fewer UI distractions.
              </p>
              <div className="mt-6 grid gap-3">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                    <Icon name="check" className="h-4 w-4 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <button type="button" className="btn-secondary mt-6 w-full justify-center border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white">
                Premium workflow
              </button>
            </div>
          </div>
        </div>
        <div className="absolute -right-6 -top-6 hidden h-24 w-24 rounded-full bg-brand-300/30 blur-3xl lg:block" />
      </div>
    </div>
  </section>
);
