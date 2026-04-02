import { Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';

export const PaymentFailedPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
    <div className="w-full max-w-md text-center">
      <Logo className="mx-auto mb-8 justify-center" />
      <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-2xl">
        ✕
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Payment not completed</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Your payment was not processed successfully. No charge has been made to your account. Please try again or contact support if the issue persists.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link to="/pricing" className="btn-primary">Try again</Link>
        <Link to="/contact" className="btn-secondary">Contact support</Link>
      </div>
    </div>
  </div>
);
