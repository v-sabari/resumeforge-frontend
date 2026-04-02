import { Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';

export const PaymentFailedPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
    <div className="card w-full max-w-md p-8 text-center shadow-card">
      <Logo className="mx-auto mb-8 justify-center" />
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 text-2xl">✕</div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Payment not completed</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Your upgrade did not process. No charge was made. You can retry or continue with the free plan.
      </p>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/pricing" className="btn-primary">Retry upgrade</Link>
        <Link to="/app/dashboard" className="btn-secondary">Back to dashboard</Link>
      </div>
    </div>
  </div>
);
