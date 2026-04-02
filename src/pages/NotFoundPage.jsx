import { Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';

export const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
    <div className="w-full max-w-lg text-center">
      <Logo className="mx-auto mb-8 justify-center" />
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
        🔍
      </div>
      <p className="text-sm font-bold uppercase tracking-widest text-brand-700">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 text-base leading-7 text-slate-600">
        The link may be outdated or incomplete. Your dashboard and main routes are still available.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/" className="btn-secondary">Go home</Link>
        <Link to="/app/dashboard" className="btn-primary">Open dashboard</Link>
      </div>
    </div>
  </div>
);
