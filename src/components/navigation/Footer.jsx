import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';

export const Footer = () => (
  <footer className="border-t border-slate-200/80 bg-white/90">
    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
      <div>
        <Logo className="mb-4" />
        <p className="max-w-md text-sm leading-7 text-slate-600">ResumeForge AI helps job seekers create ATS-friendly resumes with a cleaner editing flow, stronger visual hierarchy, and a dependable export experience.</p>
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Product</h3>
        <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
          <a href="#features">Features</a>
          <Link to="/pricing">Pricing</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Get started</h3>
        <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
          <Link to="/register">Create account</Link>
          <a href="#faq">FAQ</a>
          <span>Support available inside your configured backend flows.</span>
        </div>
      </div>
    </div>
  </footer>
);
