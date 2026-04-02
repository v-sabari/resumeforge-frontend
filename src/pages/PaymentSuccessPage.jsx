import { Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';

export const PaymentSuccessPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
    <div className="w-full max-w-md text-center">
      <Logo className="mx-auto mb-8 justify-center" />
      <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
        ✓
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Payment successful!</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Your Premium plan is now active. Enjoy unlimited exports and a smoother workflow.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link to="/app/dashboard" className="btn-primary">Open dashboard</Link>
        <Link to="/app/builder" className="btn-secondary">Start building</Link>
      </div>
    </div>
  </div>
);
