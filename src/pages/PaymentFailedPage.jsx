import { Link } from 'react-router-dom';

export const PaymentFailedPage = () => (
  <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
    <div className="card w-full max-w-2xl p-8 text-center sm:p-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-3xl">!</div>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950">Payment failed</h1>
      <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">Your upgrade did not complete. You can retry the payment flow or continue using the free plan.</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/pricing" className="btn-primary">Retry upgrade</Link>
        <Link to="/app/dashboard" className="btn-secondary">Back to dashboard</Link>
      </div>
    </div>
  </div>
);
