import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';

export const Footer = () => (
  <footer className="mt-8 border-t border-slate-200/80 bg-white/90">
    <div className="app-shell py-12 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.5fr_0.85fr_0.85fr_0.8fr]">
        <div className="space-y-5">
          <Logo />
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            ResumeForge AI helps job seekers create stronger resumes through a cleaner editing workflow, AI-assisted writing support, live preview, and a premium upgrade path that stays aligned with the app&apos;s current backend and export logic.
          </p>
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-2">Premium UI</span>
            <span className="rounded-full bg-slate-100 px-3 py-2">Responsive layout</span>
            <span className="rounded-full bg-slate-100 px-3 py-2">AdSense-ready pages</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Product</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
            <Link to="/">Home</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/app/dashboard">Dashboard</Link>
            <Link to="/app/builder">Builder</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Company</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Account</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
            <Link to="/login">Login</Link>
            <Link to="/register">Create account</Link>
            <Link to="/pricing">Upgrade</Link>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 ResumeForge AI. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/about">About</Link>
        </div>
      </div>
    </div>
  </footer>
);
