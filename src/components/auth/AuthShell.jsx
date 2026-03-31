import { Logo } from '../common/Logo';

export const AuthShell = ({ title, subtitle, children, sideTitle, sideCopy }) => (
  <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
    <div className="hidden bg-slate-950 px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between">
      <Logo compact surface="dark" className="w-fit mt-2" />

      <div className="max-w-lg">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-200">ResumeForge AI</p>
        <h2 className="mt-6 text-5xl font-semibold tracking-tight">{sideTitle}</h2>
        <p className="mt-6 text-lg leading-8 text-slate-300">{sideCopy}</p>
      </div>

      <p className="text-sm text-slate-400">
        AI-powered resumes, live preview, export controls, and premium upgrades built into one polished workflow.
      </p>
    </div>

    <div className="flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Logo surface="light" className="mb-10 lg:hidden" />

        <div className="card p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  </div>
);