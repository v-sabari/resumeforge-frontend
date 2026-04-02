import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';

const PRODUCT_LINKS = [
  { label: 'Home',    to: '/'       },
  { label: 'Pricing', to: '/pricing'},
  { label: 'About',   to: '/about'  },
];
const LEGAL_LINKS = [
  { label: 'Privacy Policy',    to: '/privacy'},
  { label: 'Terms & Conditions',to: '/terms'  },
  { label: 'Contact',           to: '/contact'},
];
const ACCOUNT_LINKS = [
  { label: 'Log in',         to: '/login'          },
  { label: 'Create account', to: '/register'       },
  { label: 'Dashboard',      to: '/app/dashboard'  },
];

export const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="page-container py-12 lg:py-16">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        {/* Brand column */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo className="mb-4" />
          <p className="max-w-xs text-sm leading-6 text-slate-500">
            ResumeForge AI is an AI-assisted resume builder that helps job seekers draft, refine, and export professional resumes with less friction and more confidence.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="badge badge-blue">AI-powered</span>
            <span className="badge badge-neutral">ATS-friendly</span>
            <span className="badge badge-green">Free to start</span>
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Product</p>
          <ul className="space-y-3">
            {PRODUCT_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-slate-600 transition hover:text-slate-950">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Legal</p>
          <ul className="space-y-3">
            {LEGAL_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-slate-600 transition hover:text-slate-950">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Account</p>
          <ul className="space-y-3">
            {ACCOUNT_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-slate-600 transition hover:text-slate-950">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row sm:items-center">
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} ResumeForge AI. All rights reserved.</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {[{ label: 'Privacy', to: '/privacy' }, { label: 'Terms', to: '/terms' }, { label: 'Contact', to: '/contact' }, { label: 'About', to: '/about' }].map((l) => (
            <Link key={l.to} to={l.to} className="text-xs text-slate-400 transition hover:text-slate-600">{l.label}</Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
