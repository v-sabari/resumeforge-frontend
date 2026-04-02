import { Logo } from '../common/Logo';

const highlights = [
  { icon: '⌘', label: 'Structured editor' },
  { icon: '◎', label: 'Live preview' },
  { icon: '✦', label: 'AI assistance' },
  { icon: '⬡', label: 'Smart exports' },
];

export const AuthShell = ({ title, subtitle, children, sideTitle, sideCopy }) => (
  <div className="grid min-h-screen lg:grid-cols-2">
    {/* Left panel */}
    <div className="hidden flex-col bg-slate-950 p-8 lg:flex xl:p-12">
      <Logo linkTo="/" surface="dark" />

      <div className="my-auto max-w-md">
        <p className="eyebrow text-brand-300">ResumeForge AI</p>
        <h2 className="mt-4 text-4xl font-semibold leading-tight text-white xl:text-5xl">{sideTitle}</h2>
        <p className="mt-4 text-base leading-7 text-slate-400">{sideCopy}</p>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {highlights.map((item) => (
            <div key={item.label}
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              <span className="text-base">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-600">
        Premium SaaS polish. Same app routes, services, and product identity.
      </p>
    </div>

    {/* Right panel */}
    <div className="flex items-center justify-center bg-white px-5 py-10 sm:px-8">
      <div className="w-full max-w-md">
        {/* Mobile logo */}
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>

        <div>
          <p className="eyebrow">Account access</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </div>
  </div>
);
