import { useState } from 'react';
import { sendContactMessage } from '../services/contactService';
import { Logo } from '../components/common/Logo';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { formatApiError } from '../utils/helpers';

export const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const update = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.email.trim()) return 'Email is required.';
    if (!form.email.includes('@')) return 'Enter a valid email address.';
    if (!form.subject.trim()) return 'Subject is required.';
    if (!form.message.trim()) return 'Message is required.';
    if (form.message.trim().length < 10) return 'Message must be at least 10 characters.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      setSuccess('Your message has been sent successfully.');
      setForm({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      setError(formatApiError(err, 'Could not send message. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Logo size="md" linkTo="/" className="justify-center" />
          <h1 className="mt-6 text-3xl font-display font-semibold text-ink-950">Contact Us</h1>
          <p className="mt-2 text-sm text-ink-400">
            Have a question, feedback, or support request? Send us a message.
          </p>
        </div>

        <div className="card p-6 shadow-lift">
          {!!error && <Alert variant="error" className="mb-4">{error}</Alert>}
          {!!success && <Alert variant="success" className="mb-4">{success}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  className="input"
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="label">Subject</label>
              <input
                type="text"
                className="input"
                value={form.subject}
                onChange={update('subject')}
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="label">Message</label>
              <textarea
                className="input min-h-40 resize-y"
                value={form.message}
                onChange={update('message')}
                placeholder="Write your message here..."
              />
            </div>

            <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
              {loading ? <Loader label="Sending..." size="sm" /> : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};