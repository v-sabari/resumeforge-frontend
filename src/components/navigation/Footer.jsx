import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';

const footerLinks = {
  Product: [
    { label: 'Home', to: '/' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Features', href: '#features' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms & Conditions', to: '/terms' },
  ],
  Account: [
    { label: 'Login', to: '/login' },
    { label: 'Create account', to: '/register' },
    { label: 'Dashboard', to: '/app/dashboard' },
  ],
};

export const Footer = () => (
  <footer className="mt-12 border-t border-slate-200/70 bg-white">
    <div className="app-shell py-12 lg:py-16">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo className="mb-4" />
          <p className="max-w-xs text-sm leading-6 text-slate-600">
            Build sharper resumes with AI-assisted writing, real-time preview, and a clean workspace designed for serious job seekers.
          </p>
          <div className="mt-5 flex gap-2">
            <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
              AI-powered
            </span>
            <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
              ATS-friendly
            </span>
          </div>
        </div>

        {/* Link columns — use h2 for section headings (semantic) */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">{title}</h2>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <a
                      href={link.href}
                      className="text-sm text-slate-600 transition-colors hover:text-slate-950"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      className="text-sm text-slate-600 transition-colors hover:text-slate-950"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar — no duplicate links; all section links already above */}
      <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} ResumeForge AI. All rights reserved.</p>
        <p className="text-xs text-slate-500">
          Made for serious job seekers
        </p>
      </div>
    </div>
  </footer>
);
