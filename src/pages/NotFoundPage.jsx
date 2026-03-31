import { Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';

export const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center px-6 py-12">
    <div className="card w-full max-w-xl p-8 text-center">
      <Logo className="mx-auto mb-8 justify-center" />
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">We couldn’t find that page.</h1>
      <p className="mt-4 text-lg text-slate-600">Head back to the landing page or continue inside your dashboard.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-secondary">Go home</Link>
        <Link to="/app/dashboard" className="btn-primary">Open dashboard</Link>
      </div>
    </div>
  </div>
);
