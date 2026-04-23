import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { Icon } from '../components/icons/Icon';
import { formatApiError } from '../utils/helpers';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-fill referral code from URL: /register?ref=ABCD1234
  const [form, setForm] = useState({
    name:         '',
    email:        '',
    password:     '',
    confirm:      '',
    referralCode: searchParams.get('ref') || '',
  });

  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  // If the ref param changes (e.g. navigation), sync it
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) setForm(p => ({ ...p, referralCode: ref.toUpperCase() }));
  }, [searchParams]);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const name  = form.name.trim();
    const email = form.email.trim().toLowerCase();
    if (!name)                          return 'Full name is required.';
    if (!email)                         return 'Email address is required.';
    if (!EMAIL_REGEX.test(email))       return 'Please enter a valid email address.';
    if (form.password.length < 8)       return 'Password must be at least 8 characters.';
    if (!form.confirm)                  return 'Please confirm your password.';
    if (form.password !== form.confirm) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError('');
    try {
      const email = form.email.trim().toLowerCase();
      await register({
        name:     form.name.trim(),
        email,
        password: form.password,
        // Passed to backend; silently ignored if empty or invalid code
        referralCode: form.referralCode.trim().toUpperCase() || undefined,
      });
      navigate('/verify-email', { replace: true, state: { email } });
    } catch (err) {
      setError(formatApiError(err, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const hasRefCode = Boolean(form.referralCode);

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo size="md" linkTo="/" className="justify-center" />
          <h1 className="mt-6 text-2xl font-display font-semibold text-ink-950">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-ink-400">
            Free forever. No credit card needed.
          </p>
        </div>

        {/* Referral banner — shown when a code is pre-filled */}
        {hasRefCode && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
              <Icon name="sparkles" className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-brand-800">You were invited!</p>
              <p className="text-xs text-brand-600">
                Sign up, verify your email, and build your first resume to activate rewards.
              </p>
            </div>
          </div>
        )}

        <div className="card p-6 shadow-lift">
          <Alert variant="error" className="mb-4">{error}</Alert>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name */}
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <Icon name="user" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300 pointer-events-none" />
                <input type="text" className="input pl-9"
                  value={form.name} onChange={set('name')}
                  placeholder="Jane Smith" autoComplete="name" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Icon name="text" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300 pointer-events-none" />
                <input type="email" className="input pl-9"
                  value={form.email} onChange={set('email')}
                  placeholder="jane@example.com" autoComplete="email" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Icon name="lock" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300 pointer-events-none" />
                <input type={showPass ? 'text' : 'password'} className="input pl-9 pr-10"
                  value={form.password} onChange={set('password')}
                  placeholder="Min 8 characters" autoComplete="new-password" />
                <button type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-600">
                  <Icon name={showPass ? 'eyeOff' : 'eye'} className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="label">Confirm password</label>
              <div className="relative">
                <Icon name="lock" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300 pointer-events-none" />
                <input type="password" className="input pl-9"
                  value={form.confirm} onChange={set('confirm')}
                  placeholder="Repeat password" autoComplete="new-password" />
              </div>
            </div>

            {/* Referral code — collapsible when not pre-filled */}
            <div>
              <label className="label">
                Referral code
                <span className="ml-1.5 text-ink-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Icon name="star" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300 pointer-events-none" />
                <input type="text" className="input pl-9 font-mono uppercase tracking-widest"
                  value={form.referralCode}
                  onChange={e => setForm(p => ({ ...p, referralCode: e.target.value.toUpperCase() }))}
                  placeholder="e.g. ABCD1234"
                  maxLength={12}
                  autoComplete="off" />
              </div>
              {hasRefCode && (
                <p className="mt-1 text-xs text-brand-600">
                  Referral code pre-filled from your invite link.
                </p>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center mt-2">
              {loading ? <Loader size="sm" label="" /> : 'Create account'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-ink-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 hover:underline font-medium">Sign in</Link>
          </p>

          <p className="mt-3 text-center text-xs text-ink-300">
            By signing up, you agree to our{' '}
            <Link to="/terms" className="hover:underline">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};
