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
  const { values, errors, setErrors, handleChange } = useForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validate = () => {
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = 'Name is required.';
    if (!values.email.trim()) nextErrors.email = 'Email is required.';
    if (!values.password.trim()) nextErrors.password = 'Password is required.';
    if (values.password.length < 6) nextErrors.password = 'Use at least 6 characters.';
    if (values.confirmPassword !== values.password) nextErrors.confirmPassword = 'Passwords must match.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
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
      subtitle="Start building smarter resumes with AI-guided editing and export controls."
      sideTitle="Join the modern resume workflow built to convert."
      sideCopy="From polished templates to premium unlock flows, ResumeForge AI is made to feel like a real product from day one."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" className="input" value={values.name} onChange={handleChange} />
          {errors.name ? <p className="mt-2 text-sm text-rose-600">{errors.name}</p> : null}
        </div>
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
        <div>
          <label className="label" htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" className="input" value={values.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword ? <p className="mt-2 text-sm text-rose-600">{errors.confirmPassword}</p> : null}
        </div>
        <Alert variant="error">{serverError}</Alert>
        <button type="submit" className="btn-primary w-full justify-center" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
        <p className="text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="font-semibold text-brand-700">Log in</Link>
        </p>
      </form>
    </AuthShell>
  );
};
