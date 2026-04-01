import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';

export const Footer = () => (
  <footer className="mt-8 border-t border-slate-200/80 bg-white/90">
    <div className="layout-wrapper grid gap-10 py-12 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div className="space-y-4">
        <Logo />
        <p className="max-w-md text-sm leading-7 text-slate-600">
          ResumeForge AI gives job seekers a structured, AI-assisted workspace for building stronger resumes, previewing changes instantly, and upgrading only when they need more export power.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Product</h3>
        <div className="mt-4 grid gap-3 text-sm text-slate-600">
          <Link to="/">Home</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/about">About</Link>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Company</h3>
        <div className="mt-4 grid gap-3 text-sm text-slate-600">
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Account</h3>
        <div className="mt-4 grid gap-3 text-sm text-slate-600">
          <Link to="/login">Login</Link>
          <Link to="/register">Create account</Link>
          <Link to="/app/dashboard">Dashboard</Link>
        </div>
      </div>
    </div>
  </footer>
);
