import { Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';

export const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
    <div className="w-full max-w-md text-center">
      <Logo className="mx-auto mb-10 justify-center" />
      <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl font-bold text-slate-400">
        404
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Page not found</h1>
      <p className="mt-3 text-base leading-7 text-slate-500">
        The link may be outdated or incorrect. Your dashboard and all main routes are still working.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/" className="btn-secondary">Go home</Link>
        <Link to="/app/dashboard" className="btn-primary">Open dashboard</Link>
      </div>
    </div>
  </div>
);
