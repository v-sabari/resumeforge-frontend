import { Logo } from '../common/Logo';

const HIGHLIGHTS = [
  { icon: '⌘', label: 'Structured builder'    },
  { icon: '◉', label: 'Live preview'           },
  { icon: '✦', label: 'AI assistance'          },
  { icon: '⬡', label: 'Responsive dashboard'   },
];

export const AuthShell = ({ title, subtitle, children, sideTitle, sideCopy }) => (
  <div className="grid min-h-screen overflow-x-hidden xl:grid-cols-2">
    {/* ── Left panel (desktop only) ── */}
    <div className="hidden flex-col bg-slate-950 xl:flex">
      <div className="flex h-16 items-center border-b border-white/10 px-8">
        <Logo linkTo="/" surface="dark" />
      </div>
      <div className="flex flex-1 flex-col justify-center px-10 py-12 xl:px-14">
        <p className="kicker text-brand-400">ResumeForge AI</p>
        <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">
          {sideTitle}
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-400">{sideCopy}</p>
        <div className="mt-8 grid grid-cols-2 gap-3">
          {HIGHLIGHTS.map((h) => (
            <div key={h.label} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              <span className="text-base">{h.icon}</span>
              {h.label}
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 px-10 py-6 xl:px-14">
        <p className="text-xs text-slate-600">Same routes · Same services · Premium SaaS polish.</p>
      </div>
    </div>

    {/* ── Right panel: form ── */}
    <div className="flex flex-col bg-white">
      <div className="flex h-16 items-center border-b border-slate-100 px-6 xl:hidden">
        <Logo />
      </div>
      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <p className="kicker mb-3">Account access</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  </div>
);
