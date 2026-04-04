import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { Icon } from '../components/icons/Icon';
import { formatApiError } from '../utils/helpers';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form,     setForm]     = useState({ name: '', email: '', password: '', confirm: '' });
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    if (!form.name.trim())               return 'Full name is required.';
    if (!form.email.includes('@'))        return 'Please enter a valid email address.';
    if (form.password.length < 6)         return 'Password must be at least 6 characters.';
    if (form.password !== form.confirm)   return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError('');
    try {
      await register({
        name:     form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        password: form.password,
      });
      navigate('/app/dashboard', { replace: true });
    } catch (err) {
      setError(formatApiError(err, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo size="md" linkTo="/" className="justify-center" />
          <h1 className="mt-6 text-2xl font-display font-semibold text-ink-950">Create your account</h1>
          <p className="mt-1.5 text-sm text-ink-400">Free forever. No credit card needed.</p>
        </div>

        <div className="card p-6 shadow-lift">
          <Alert variant="error" className="mb-4">{error}</Alert>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <Icon name="user" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300 pointer-events-none" />
                <input type="text" autoComplete="name" required
                  className="input pl-9" placeholder="Your full name"
                  value={form.name} onChange={set('name')} />
              </div>
            </div>

            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Icon name="mail" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300 pointer-events-none" />
                <input type="email" autoComplete="email" required
                  className="input pl-9" placeholder="you@example.com"
                  value={form.email} onChange={set('email')} />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Icon name="lock" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300 pointer-events-none" />
                <input type={showPass ? 'text' : 'password'} autoComplete="new-password" required
                  className="input pl-9 pr-10" placeholder="Min. 6 characters"
                  value={form.password} onChange={set('password')} />
                <button type="button" tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500"
                  onClick={() => setShowPass(!showPass)}>
                  <Icon name={showPass ? 'eyeOff' : 'eye'} className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm password</label>
              <div className="relative">
                <Icon name="lock" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300 pointer-events-none" />
                <input type="password" autoComplete="new-password" required
                  className="input pl-9" placeholder="Repeat your password"
                  value={form.confirm} onChange={set('confirm')} />
              </div>
            </div>

            <p className="text-xs text-ink-400">
              By registering you agree to our{' '}
              <Link to="/terms"   className="text-brand-600 hover:underline">Terms</Link> and{' '}
              <Link to="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>.
            </p>

            <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
              {loading ? <Loader label="Creating account…" size="sm" /> : 'Create free account'}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-sm text-ink-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
