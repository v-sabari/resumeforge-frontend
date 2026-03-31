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
    const nextErrors = {};
    if (!values.email.trim()) nextErrors.email = 'Email is required.';
    if (!values.password.trim()) nextErrors.password = 'Password is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError('');
    try {
      await login(values);
      const nextPath = location.state?.from?.pathname || '/app/dashboard';
      navigate(nextPath, { replace: true });
    } catch (error) {
      setServerError(errorFormatter(error, 'Unable to log in right now.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Access your builder, export controls, and premium workspace."
      sideTitle="Log in to continue shaping your best application."
      sideCopy="Pick up right where you left off, refresh plan status from the backend, and keep your resume export-ready."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="input" value={values.email} onChange={handleChange} />
          {errors.email ? <p className="mt-2 text-sm text-rose-600">{errors.email}</p> : null}
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" className="input" value={values.password} onChange={handleChange} />
          {errors.password ? <p className="mt-2 text-sm text-rose-600">{errors.password}</p> : null}
        </div>
        <Alert variant="error">{serverError}</Alert>
        <button type="submit" className="btn-primary w-full justify-center" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
        <p className="text-center text-sm text-slate-600">
          New to ResumeForge AI? <Link to="/register" className="font-semibold text-brand-700">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
};
