import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/common/Alert';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, errorFormatter } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const { values, errors, setErrors, handleChange } = useForm({ name: '', email: '', password: '', confirmPassword: '' });

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = 'Full name is required.';
    if (!values.email.trim()) e.email = 'Email is required.';
    if (!values.password.trim()) e.password = 'Password is required.';
    if (values.password.length < 6) e.password = 'Use at least 6 characters.';
    if (values.confirmPassword !== values.password) e.confirmPassword = 'Passwords must match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError('');
    try {
      await register({ name: values.name, email: values.email, password: values.password });
      navigate('/app/dashboard', { replace: true });
    } catch (error) {
      setServerError(errorFormatter(error, 'Unable to create your account.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start building smarter resumes with AI-assisted writing and a polished dashboard."
      sideTitle="Get into a professional builder flow from your very first resume."
      sideCopy="Sign up once, keep the same backend logic, and start editing inside a cleaner workspace inspired by top-tier resume tools."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" autoComplete="name"
            className="input" value={values.name} onChange={handleChange}
            placeholder="Aarav Mehta" />
          {errors.name && <p className="mt-1.5 text-xs text-rose-600">{errors.name}</p>}
        </div>
        <div>
          <label className="label" htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email"
            className="input" value={values.email} onChange={handleChange}
            placeholder="you@example.com" />
          {errors.email && <p className="mt-1.5 text-xs text-rose-600">{errors.email}</p>}
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="new-password"
            className="input" value={values.password} onChange={handleChange}
            placeholder="Min. 6 characters" />
          {errors.password && <p className="mt-1.5 text-xs text-rose-600">{errors.password}</p>}
        </div>
        <div>
          <label className="label" htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password"
            className="input" value={values.confirmPassword} onChange={handleChange}
            placeholder="Repeat password" />
          {errors.confirmPassword && <p className="mt-1.5 text-xs text-rose-600">{errors.confirmPassword}</p>}
        </div>
        <Alert variant="error">{serverError}</Alert>
        <button type="submit" className="btn-primary w-full justify-center py-3 mt-2"
          disabled={submitting}>
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">Log in</Link>
        </p>
      </form>
    </AuthShell>
  );
};
