import { Link } from 'react-router-dom';
import { SectionBadge } from '../common/SectionBadge';
import { Icon } from '../icons/Icon';

const STATS = [
  { value: '20k+',    label: 'Resumes built'       },
  { value: '4.9/5',   label: 'Average rating'      },
  { value: '2× faster', label: 'Job prep time'     },
];

const HIGHLIGHTS = [
  'Structured editing with live preview',
  'AI-assisted writing improvements',
  'Payment-aware export controls',
  'Responsive across all devices',
];

export const HeroSection = () => (
  <section className="section-shell pt-12 sm:pt-16 lg:pt-20">
    <div className="grid items-center gap-12 xl:grid-cols-2 xl:gap-16">

      {/* ── Left: copy ── */}
      <div className="animate-fade-up">
        <SectionBadge>AI Resume Builder</SectionBadge>
        <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.25rem]">
          Build sharper resumes with a workflow that feels{' '}
          <span className="text-brand-700">effortlessly fast</span>.
        </h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
          ResumeForge AI combines structured editing, real-time ATS preview, AI-powered refinement,
          and payment-aware export controls in one polished workspace. Designed for serious job seekers
          who need to move fast without sacrificing quality.
        </p>
        <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
          Whether you are writing your first resume or tailoring the fifth version for a different role,
          the builder keeps everything in one place — your sections, your AI improvements, your export state,
          and your upgrade options — without any broken flows or misaligned UI.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/register" className="btn-primary">
            Create your resume
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
          <a href="#features" className="btn-secondary">Explore features</a>
        </div>

        {/* Stats row */}
        <div className="mt-10 grid grid-cols-3 gap-3">
          {STATS.map(({ value, label }, i) => (
            <div key={label} className={`card p-4 animate-fade-up delay-${(i + 1) * 100}`}>
              <p className="text-xl font-semibold text-slate-950 sm:text-2xl">{value}</p>
              <p className="mt-0.5 text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: UI preview ── */}
      <div className="relative animate-fade-up delay-200">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-brand-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-4 h-32 w-32 rounded-full bg-brand-200/15 blur-2xl" />

        <div className="card overflow-hidden p-4 shadow-lg sm:p-5">
          {/* Browser chrome dots */}
          <div className="mb-4 flex items-center gap-1.5 px-1">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 rounded-md bg-slate-100 px-3 py-0.5 text-[11px] text-slate-500">ResumeForge AI — Builder</span>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            {/* Editor mockup */}
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Live preview</p>
                    <h3 className="mt-1.5 text-lg font-semibold text-slate-950">Aarav Mehta</h3>
                    <p className="text-sm text-slate-500">Senior Product Designer</p>
                  </div>
                  <span className="badge badge-green">ATS Ready</span>
                </div>
                <div className="mt-4 space-y-1.5">
                  {[100, 92, 83, 67].map((w) => (
                    <div key={w} className="h-1.5 rounded-full bg-slate-100" style={{ width: `${w}%` }} />
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-brand-100 bg-brand-50/70 p-3.5">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-soft">
                    <Icon name="sparkles" className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-950">AI suggestion</p>
                    <p className="text-xs text-slate-600">Add measurable outcomes to your latest role.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dark premium panel */}
            <div className="surface-dark flex flex-col p-4">
              <p className="kicker text-brand-300">Premium workflow</p>
              <h3 className="mt-2 text-sm font-semibold text-white leading-snug">
                1 free export, then upgrade for unlimited
              </h3>
              <ul className="mt-4 flex-1 space-y-2">
                {HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-slate-300">
                    <Icon name="check" className="h-3 w-3 shrink-0 text-brand-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/pricing" className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 py-2 text-xs font-medium text-white transition hover:bg-white/20">
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
