import { Logo } from '../common/Logo';

export const AuthShell = ({ title, subtitle, children, sideTitle, sideCopy }) => (
  <div className="grid min-h-screen overflow-x-hidden bg-transparent xl:grid-cols-[1.02fr_0.98fr]">
    <div className="hidden p-6 xl:flex xl:flex-col">
      <div className="surface-dark flex h-full flex-col justify-between p-10 xl:p-12">
        <Logo compact surface="dark" className="w-fit" />
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-200">ResumeForge AI</p>
          <h2 className="mt-6 text-5xl font-semibold tracking-tight text-white">{sideTitle}</h2>
          <p className="mt-6 text-lg leading-8 text-slate-300">{sideCopy}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {['Structured builder', 'Live preview', 'AI assistance', 'Responsive dashboard'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-slate-400">Premium SaaS polish with the same app routes, services, and product identity.</p>
      </div>
    </div>

    <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 xl:px-10">
      <div className="w-full max-w-xl">
        <div className="mb-8 xl:hidden">
          <Logo />
        </div>
        <div className="card p-6 sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">Account access</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
          <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  </div>
);
