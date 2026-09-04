import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { Icon } from '../components/icons/Icon';
import { formatApiError } from '../utils/helpers';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Prefer the react-router destination (ProtectedRoute navigate), then fall
  // back to the path stashed by the api.js 401 interceptor, then dashboard.
  const storedFrom = (() => {
    try {
      const v = sessionStorage.getItem('auth_redirect');
      sessionStorage.removeItem('auth_redirect');
      return v;
    } catch {
      return null;
    }
  })();
  const from = location.state?.from?.pathname || storedFrom || '/app/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  // REMEMBER-ME: unchecked by default so a session is never unknowingly made
  // persistent. Defaults to the regular (24h) session; tick to extend it to
  // the longer remember-me lifetime. This never saves the password.
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        // REMEMBER-ME: passed to the backend, which issues the longer-lived
        // session token only when this is true. No password is saved anywhere.
        rememberMe,
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(formatApiError(err, 'Invalid email or password. Please try again.'));
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
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-ink-400">
            Sign in to continue building your resume
          </p>
        </div>

        <div className="card p-6 shadow-lift">
          <Alert variant="error" className="mb-4">
            {error}
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
                  name="email"
                  autoComplete="username"
                  required
                  className="input pl-9"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set('email')}
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Icon
                  name="lock"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300 pointer-events-none"
                />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                  className="input pl-9 pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500"
                  onClick={() => setShowPass(!showPass)}
                >
                  <Icon name={showPass ? 'eyeOff' : 'eye'} className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2.5 select-none text-sm text-ink-500 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  className="h-4 w-4 rounded accent-brand cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-brand-600 hover:text-brand-700">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center mt-2"
              disabled={loading}
            >
              {loading ? <Loader label="Signing in…" size="sm" /> : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-sm text-ink-400">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
};