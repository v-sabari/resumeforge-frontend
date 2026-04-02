import { Link } from 'react-router-dom';
import { SectionBadge } from '../common/SectionBadge';
import { Icon } from '../icons/Icon';

const stats = [
  ['20k+', 'Resumes created'],
  ['4.9★', 'Average rating'],
  ['2× faster', 'Job prep time'],
];

export const HeroSection = () => (
  <section className="section-shell pt-12 sm:pt-16 lg:pt-20">
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

      {/* Left */}
      <div className="animate-fade-in-up">
        <SectionBadge>AI Resume Builder</SectionBadge>

        <h1 className="mt-5 text-[2.75rem] font-semibold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.5rem]">
          Build sharper resumes with{' '}
          <span className="relative inline-block">
            <span className="relative z-10">AI precision</span>
            <span className="absolute inset-x-0 bottom-1 h-3 -skew-x-2 bg-brand-100 -z-0" />
          </span>
        </h1>

        <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
          ResumeForge AI combines structured editing, real-time preview, AI-powered refinement, and payment-aware export controls — in one polished workspace designed for serious job seekers.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/register" className="btn-primary px-6 py-3 text-sm">
            Create your resume
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
          <a href="#features" className="btn-secondary px-6 py-3 text-sm">
            Explore features
          </a>
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
          {stats.map(([value, label], i) => (
            <div key={label} className={`card px-4 py-4 animate-fade-in-up stagger-${i + 2}`}>
              <p className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">{value}</p>
              <p className="mt-1 text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right — UI mockup */}
      <div className="relative animate-fade-in-up stagger-3">
        {/* Glow blob */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-6 bottom-8 h-32 w-32 rounded-full bg-brand-300/15 blur-2xl" />

        {/* Main card */}
        <div className="card overflow-hidden p-4 shadow-lg sm:p-5">
          {/* Top bar */}
          <div className="mb-4 flex items-center gap-2 px-1">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 text-xs text-slate-400">ResumeForge AI — Builder</span>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
            {/* Editor side */}
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live preview</p>
                    <p className="mt-1.5 text-lg font-semibold text-slate-950">Aarav Mehta</p>
                    <p className="text-sm text-slate-500">Senior Product Designer</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">ATS Ready</span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-1.5 rounded-full bg-slate-100" />
                  <div className="h-1.5 w-10/12 rounded-full bg-slate-100" />
                  <div className="h-1.5 w-8/12 rounded-full bg-slate-100" />
                </div>
              </div>

              <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-brand-600 shadow-sm">
                    <Icon name="sparkles" className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-950">AI suggestion</p>
                    <p className="text-xs text-slate-600">Add measurable outcomes to your latest role.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark panel */}
            <div className="surface-dark p-4">
              <p className="eyebrow text-brand-300">Export access</p>
              <h3 className="mt-2.5 text-base font-semibold text-white">1 free export, unlimited after upgrade</h3>
              <div className="mt-4 space-y-2">
                {['Unlimited exports', 'Clean dashboard', 'Faster workflow'].map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
                    <Icon name="check" className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <Link to="/pricing" className="btn-secondary mt-4 w-full justify-center border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white text-xs py-2">
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
