import { Logo } from '../common/Logo';

export const AuthShell = ({ title, subtitle, children, sideTitle, sideCopy }) => (
  <div className="grid min-h-screen bg-transparent lg:grid-cols-[1.05fr_0.95fr]">
    <div className="hidden px-8 py-8 lg:flex lg:flex-col lg:justify-between">
      <div className="card h-full overflow-hidden bg-slate-950 p-10 text-white">
        <div className="flex h-full flex-col justify-between">
          <Logo compact surface="dark" className="w-fit" />
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-200">ResumeForge AI</p>
            <h2 className="mt-6 text-5xl font-semibold tracking-tight">{sideTitle}</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">{sideCopy}</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold">Live resume preview</p>
                <p className="mt-2 text-sm text-slate-300">See every edit on a clean export-ready canvas.</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold">AI-assisted workflow</p>
                <p className="mt-2 text-sm text-slate-300">Improve copy and structure without breaking your data flow.</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-400">A more polished builder experience, with the same product identity and business logic intact.</p>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Logo surface="light" className="mb-8 lg:hidden" />
        <div className="card p-8 sm:p-9">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  </div>
);
