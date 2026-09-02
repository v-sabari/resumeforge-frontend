import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { verifyEmailOtp, resendEmailOtp } from '../services/authService';
import { Logo } from '../components/common/Logo';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { formatApiError } from '../utils/helpers';

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      await verifyEmailOtp({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });
      setSuccess('Email verified successfully. You can now log in.');
      setTimeout(() => {
        navigate('/login', {
          replace: true,
          state: { email: email.trim().toLowerCase() },
        });
      }, 1200);
    } catch (err) {
      setError(formatApiError(err, 'Could not verify OTP.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Enter your email to resend OTP.');
      return;
    }

    setResending(true);
    try {
      await resendEmailOtp({
        email: email.trim().toLowerCase(),
      });
      setSuccess('A new OTP has been sent to your email.');
      setCooldown(30);
    } catch (err) {
      setError(formatApiError(err, 'Could not resend OTP.'));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo size="md" linkTo="/" className="justify-center" />
          <h1 className="mt-6 text-2xl font-display font-semibold text-ink-950">Verify your email</h1>
          <p className="mt-1.5 text-sm text-ink-400">
            Enter the 6-digit OTP sent to your email address.
          </p>
        </div>

        <div className="card p-6 shadow-lift">
          <Alert variant="error" className="mb-4">{error}</Alert>
          <Alert variant="success" className="mb-4">{success}</Alert>

          <form onSubmit={handleVerify} className="space-y-4" noValidate>
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">OTP</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                className="input tracking-[0.35em] text-center text-lg font-semibold"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
            </div>

            <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
              {loading ? <Loader label="Verifying…" size="sm" /> : 'Verify email'}
            </button>
          </form>

          <button
            type="button"
            className="btn-secondary w-full justify-center mt-3"
            disabled={resending || cooldown > 0}
            onClick={handleResend}
          >
            {resending ? (
              <Loader label="Resending…" size="sm" />
            ) : cooldown > 0 ? (
              `Resend OTP in ${cooldown}s`
            ) : (
              'Resend OTP'
            )}
          </button>
        </div>

        <p className="text-center mt-5 text-sm text-ink-400">
          Already verified?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};