import { Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';

export const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
    <div className="card w-full max-w-2xl p-8 text-center sm:p-10">
      <Logo className="mx-auto mb-8 justify-center" />
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">This page does not exist.</h1>
      <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
        The link may be outdated or incomplete, but your dashboard and main routes are still available.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/" className="btn-secondary">Go home</Link>
        <Link to="/app/dashboard" className="btn-primary">Open dashboard</Link>
      </div>
    </div>
  </div>
);
