import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common/Alert';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, errorFormatter } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const { values, errors, setErrors, handleChange } = useForm({ email: '', password: '' });

  const validate = () => {
    const e = {};
    if (!values.email.trim()) e.email = 'Email is required.';
    if (!values.password.trim()) e.password = 'Password is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError('');
    try {
      await login(values);
      navigate(location.state?.from?.pathname || '/app/dashboard', { replace: true });
    } catch (error) {
      setServerError(errorFormatter(error, 'Unable to log in right now.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Access your resumes, export controls, and builder workspace."
      sideTitle="Return to the workspace that keeps editing and preview in sync."
      sideCopy="ResumeForge AI brings premium polish while keeping your auth flow, backend purpose, and product identity intact."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="label" htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email"
            className="input" value={values.email} onChange={handleChange}
            placeholder="you@example.com" />
          {errors.email && <p className="mt-1.5 text-xs text-rose-600">{errors.email}</p>}
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password"
            className="input" value={values.password} onChange={handleChange}
            placeholder="••••••••" />
          {errors.password && <p className="mt-1.5 text-xs text-rose-600">{errors.password}</p>}
        </div>
        <Alert variant="error">{serverError}</Alert>
        <button type="submit" className="btn-primary w-full justify-center py-3 mt-2"
          disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
        <p className="text-center text-sm text-slate-500">
          New to ResumeForge AI?{' '}
          <Link to="/register" className="font-semibold text-brand-700 hover:underline">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
};
