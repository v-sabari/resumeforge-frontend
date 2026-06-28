import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { Icon } from '../components/icons/Icon';
import { forgotPassword } from '../services/authService';
import { formatApiError } from '../utils/helpers';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address.');
      setSuccess('');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const response = await forgotPassword({
        email: normalizedEmail,
      });

      setSuccess(
        response?.message || 'If an account exists with this email, a password reset OTP has been sent.'
      );

      setTimeout(() => {
        navigate('/reset-password', {
          replace: true,
          state: { email: normalizedEmail },
        });
      }, 1000);
    } catch (err) {
      setError(formatApiError(err, 'Could not process your request. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo size="md" linkTo="/" className="justify-center" />
          <h1 className="mt-6 text-2xl font-display font-semibold text-ink-950">
            Forgot password
          </h1>
          <p className="mt-1.5 text-sm text-ink-400">
            Enter your registered email to receive a password reset OTP
          </p>
        </div>

        <div className="card p-6 shadow-lift">
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
          <Alert variant="success" className="mb-4">
            {success}
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Icon
                  name="mail"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300 pointer-events-none"
                />
                <input
                  type="email"
                  autoComplete="email"
                  required
                  className="input pl-9"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
              {loading ? <Loader label="Sending OTP…" size="sm" /> : 'Send reset OTP'}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-sm text-ink-400">
          Remembered your password?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};