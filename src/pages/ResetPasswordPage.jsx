import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { Icon } from '../components/icons/Icon';
import { resetPassword } from '../services/authService';
import { formatApiError } from '../utils/helpers';

// BUG-001 FIX: The backend's /api/auth/reset-password endpoint (see
// ResetPasswordRequest.java) has always expected { token, newPassword } —
// the "token" is the random reset token emailed as a link
// (https://www.resumeforgeai.site/reset-password?token=XXXX), not a
// user-typed OTP. This page previously asked the user to manually type a
// 6-digit "OTP" and never sent a token at all, so every reset request was
// rejected with "Token is required" regardless of what was entered.
// Fix: read the token from the URL query string (where the emailed link
// puts it) and drop the email/OTP fields entirely.
export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('This reset link is invalid or incomplete. Please request a new one.');
      setSuccess('');
      return;
    }

    if (!form.newPassword || !form.confirmPassword) {
      setError('Please fill in all fields.');
      setSuccess('');
      return;
    }

    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      setSuccess('');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.');
      setSuccess('');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await resetPassword({
        token,
        newPassword: form.newPassword,
      });

      setSuccess(response?.message || 'Password reset successfully');

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    } catch (err) {
      setError(formatApiError(err, 'Could not reset password. Please try again.'));
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
            Reset password
          </h1>
          <p className="mt-1.5 text-sm text-ink-400">
            {token
              ? 'Choose a new password for your account'
              : 'Open the reset link from your email to continue'}
          </p>
        </div>

        <div className="card p-6 shadow-lift">
          <Alert variant="error" className="mb-4">{error}</Alert>
          <Alert variant="success" className="mb-4">{success}</Alert>

          {!token ? (
            <div className="space-y-4">
              <p className="text-sm text-ink-400">
                We couldn't find a reset token in this link. Please request a
                new password reset email and click the link it contains.
              </p>
              <Link to="/forgot-password" className="btn-primary w-full justify-center inline-flex">
                Request a new reset link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="label">New password</label>
                <div className="relative">
                  <Icon
                    name="lock"
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300 pointer-events-none"
                  />
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="input pl-9 pr-10"
                    placeholder="••••••••"
                    value={form.newPassword}
                    onChange={set('newPassword')}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500"
                    onClick={() => setShowNewPass((v) => !v)}
                  >
                    <Icon name={showNewPass ? 'eyeOff' : 'eye'} className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Confirm new password</label>
                <div className="relative">
                  <Icon
                    name="lock"
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300 pointer-events-none"
                  />
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="input pl-9 pr-10"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={set('confirmPassword')}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500"
                    onClick={() => setShowConfirmPass((v) => !v)}
                  >
                    <Icon name={showConfirmPass ? 'eyeOff' : 'eye'} className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
                {loading ? <Loader label="Resetting..." size="sm" /> : 'Reset password'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-5 text-sm text-ink-400">
          Back to{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};