import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../utils/constants';
import { Icon } from '../components/icons/Icon';
import { sendContactMessage } from '../services/contactService';

// ─── Email Constants ───────────────────────────────────────────────────────────
const SUPPORT_EMAIL = 'support@resumeforgeai.site';
const BILLING_EMAIL = 'billing@resumeforgeai.site';
const LEGAL_EMAIL   = 'legal@resumeforgeai.site';
const PRIVACY_EMAIL = 'privacy@resumeforgeai.site';

// ─── Shared Layout Components ──────────────────────────────────────────────────

const Wrap = ({ title, lastUpdated, children }) => (
  <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
    <div className="mb-8">
      <h1 className="text-3xl font-display font-semibold text-ink-950">{title}</h1>
      {lastUpdated && (
        <p className="mt-2 text-sm text-ink-400">Last updated: {lastUpdated}</p>
      )}
    </div>
    <div className="space-y-5 text-sm text-ink-600 leading-relaxed">{children}</div>
  </div>
);

const H2 = ({ children }) => (
  <h2 className="text-lg font-semibold text-ink-950 mt-8 mb-2">{children}</h2>
);

const P = ({ children }) => <p>{children}</p>;

const UL = ({ items }) => (
  <ul className="list-disc pl-5 space-y-1">
    {items.map((item, idx) => (
      <li key={idx}>{item}</li>
    ))}
  </ul>
);

const MailLink = ({ email, className = 'text-brand-600 hover:underline' }) => (
  <a href={`mailto:${email}`} className={className}>
    {email}
  </a>
);

// ─── Privacy Policy ────────────────────────────────────────────────────────────

export const PrivacyPage = () => (
  <Wrap title="Privacy Policy" lastUpdated="1 April 2025">
    <P>
      {APP_NAME} ("we", "our", "us") is committed to protecting your personal information. This
      Privacy Policy explains what data we collect, how we use it, and your rights as a user. By
      using {APP_NAME}, you agree to this policy.
    </P>

    <H2>1. Information We Collect</H2>
    <P>
      <strong>Account data:</strong> When you register, we collect your full name and email address.
    </P>
    <P>
      <strong>Resume content:</strong> Any information you enter into the resume builder — including
      work history, education, skills, and contact details — is stored securely and used only to
      deliver the service to you. We do not use your resume content to train AI models.
    </P>
    <P>
      <strong>Payment data:</strong> Payments are processed by Razorpay. We store only a payment
      reference ID and status. We do not store your card numbers, bank details, or CVV codes.
      Razorpay's privacy policy governs their data handling.
    </P>
    <P>
      <strong>Email communications:</strong> Transactional emails (account confirmation, password
      resets, support replies) are sent via Resend. We do not share your email address with any
      marketing third parties.
    </P>
    <P>
      <strong>Usage data:</strong> We may collect anonymous usage analytics (pages visited, features
      used, export counts) to improve the product. This data does not personally identify you.
    </P>
    <P>
      <strong>Device data:</strong> Standard server logs may capture your IP address, browser type,
      and device type for security and debugging purposes.
    </P>

    <H2>2. How We Use Your Data</H2>
    <UL
      items={[
        'To create and maintain your account',
        'To store and deliver your resume content',
        'To process payments and activate Premium features',
        'To send account-related emails via Resend (registration confirmation, support responses)',
        'To improve the platform based on anonymised usage patterns',
        'To detect and prevent fraud or abuse',
      ]}
    />

    <H2>3. Data Sharing</H2>
    <P>
      We do not sell, rent, or share your personal data with third parties for marketing purposes.
      We share data only with:
    </P>
    <UL
      items={[
        'Razorpay — for secure payment processing',
        'Render — our backend hosting provider (data is encrypted at rest and in transit)',
        'Vercel — our frontend hosting provider',
        'Resend — for transactional email delivery',
        'If required by law, court order, or government authority',
      ]}
    />

    <H2>4. Data Retention</H2>
    <P>
      We retain your account and resume data for as long as your account is active. If you delete
      your account, your data is permanently deleted within 30 days. Payment records may be retained
      for up to 7 years for legal and accounting compliance.
    </P>

    <H2>5. Security</H2>
    <P>
      We use industry-standard security measures including HTTPS, bcrypt password hashing,
      JWT-based authentication, encrypted database connections, and secure hosting infrastructure
      on Render and Vercel. No system is 100% secure, but we take all reasonable precautions to
      protect your data.
    </P>

    <H2>6. Cookies and Local Storage</H2>
    <P>
      We use browser localStorage to store your authentication token locally on your device. This
      is required for you to stay logged in. We do not use advertising cookies or third-party
      tracking cookies. If you opt into analytics, an analytics cookie may be set.
    </P>

    <H2>7. Your Rights</H2>
    <P>Depending on your region, you may have the right to:</P>
    <UL
      items={[
        'Access a copy of your personal data',
        'Request correction of inaccurate data',
        'Request deletion of your account and all associated data',
        'Withdraw consent to analytics tracking',
        'Lodge a complaint with your local data protection authority',
      ]}
    />
    <P>
      To exercise any of these rights, contact us at{' '}
      <MailLink email={PRIVACY_EMAIL} />.
    </P>

    <H2>8. Children</H2>
    <P>
      {APP_NAME} is intended for users aged 16 and above. We do not knowingly collect data from
      children under 16. If you believe a child has registered without parental consent, contact us
      immediately.
    </P>

    <H2>9. Changes to This Policy</H2>
    <P>
      We may update this policy periodically. We will notify registered users of significant changes
      by email or in-app notice. Continued use of the platform after such notice constitutes
      acceptance of the updated policy.
    </P>

    <H2>10. Contact</H2>
    <P>
      For privacy concerns: <MailLink email={PRIVACY_EMAIL} />
    </P>
  </Wrap>
);

// ─── Terms of Service ──────────────────────────────────────────────────────────

export const TermsPage = () => (
  <Wrap title="Terms of Service" lastUpdated="1 April 2025">
    <P>
      These Terms of Service ("Terms") govern your use of {APP_NAME} ("Service"), operated by the{' '}
      {APP_NAME} team ("we", "us", "our"). By creating an account or using the Service, you agree
      to these Terms. If you do not agree, do not use the Service.
    </P>

    <H2>1. The Service</H2>
    <P>
      {APP_NAME} provides an AI-assisted resume building platform accessible via web browser.
      Features include resume creation, AI writing assistance, PDF export, and premium plan
      upgrades.
    </P>

    <H2>2. Accounts</H2>
    <P>
      You must be at least 16 years old to create an account. You are responsible for maintaining
      the confidentiality of your password and for all activities that occur under your account.
      One person may hold only one account. You may not share your account with others.
    </P>
    <P>You agree not to use the Service to:</P>
    <UL
      items={[
        'Violate any applicable law or regulation',
        'Infringe any intellectual property rights',
        'Submit false, misleading, or fraudulent content',
        'Attempt to gain unauthorized access to other accounts or our systems',
        'Use automated scripts, bots, or scrapers to access the Service',
        'Upload malware, viruses, or any harmful code',
      ]}
    />

    <H2>3. Free Plan</H2>
    <P>
      Free accounts include access to the resume builder, AI writing assistance, and up to 2 PDF
      exports. No credit card is required. We reserve the right to adjust free plan limits with
      reasonable notice.
    </P>

    <H2>4. Premium Plan</H2>
    <P>
      Premium access is available as a one-time payment. Upon successful payment verification, your
      account is upgraded to Premium status, which includes unlimited PDF exports and all current
      premium features. Premium access does not expire unless your account is terminated for a
      violation of these Terms.
    </P>

    <H2>5. Payments and Billing</H2>
    <P>
      All payments are processed by Razorpay. By making a purchase, you agree to Razorpay's terms
      and conditions. All prices are listed in USD or INR as displayed on the pricing page. Prices
      may change with notice. Your current purchase is billed at the price displayed at checkout.
    </P>

    <H2>6. Refunds</H2>
    <P>
      See our{' '}
      <Link to="/refund-policy" className="text-brand-600 hover:underline">
        Refund Policy
      </Link>{' '}
      for full details. In summary: we offer refunds within 7 days of purchase if the product did
      not function as described, subject to review.
    </P>

    <H2>7. Intellectual Property</H2>
    <P>
      <strong>Your content:</strong> You own all resume content you create using the Service. You
      grant us a limited, non-exclusive license to store and process your content solely for the
      purpose of providing the Service. We do not use your content to train AI models.
    </P>
    <P>
      <strong>Our content:</strong> The {APP_NAME} name, logo, interface design, and underlying
      software are owned by us and protected by applicable intellectual property laws. You may not
      copy, reverse-engineer, or redistribute any part of the platform without our explicit written
      permission.
    </P>

    <H2>8. Disclaimer of Warranties</H2>
    <P>
      The Service is provided "as is" and "as available" without warranties of any kind, express or
      implied. We do not warrant that the Service will be uninterrupted, error-free, or that resumes
      created using the Service will result in employment. AI-generated content is provided as a
      starting point and should be reviewed and customised by you before submission.
    </P>

    <H2>9. Limitation of Liability</H2>
    <P>
      To the fullest extent permitted by law, we shall not be liable for any indirect, incidental,
      special, consequential, or punitive damages arising from your use of or inability to use the
      Service, even if we have been advised of the possibility of such damages. Our total liability
      shall not exceed the amount you paid us in the 12 months preceding the claim.
    </P>

    <H2>10. Termination</H2>
    <P>
      We reserve the right to suspend or terminate accounts that violate these Terms, engage in
      fraudulent activity, or cause harm to the platform or other users. You may delete your account
      at any time by contacting support. Upon termination, your data is deleted in accordance with
      our Privacy Policy.
    </P>

    <H2>11. Governing Law</H2>
    <P>
      These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive
      jurisdiction of the courts of India.
    </P>

    <H2>12. Changes to These Terms</H2>
    <P>
      We reserve the right to modify these Terms at any time. We will notify registered users of
      material changes by email. Continued use of the Service after such notification constitutes
      acceptance of the revised Terms.
    </P>

    <H2>13. Contact</H2>
    <P>
      For questions about these Terms: <MailLink email={LEGAL_EMAIL} />
    </P>
  </Wrap>
);

// ─── Refund Policy ─────────────────────────────────────────────────────────────

export const RefundPolicyPage = () => (
  <Wrap title="Refund & Cancellation Policy" lastUpdated="1 April 2025">
    <P>
      {APP_NAME} offers a limited refund policy for Premium plan purchases. Please read the
      following carefully before making a purchase.
    </P>

    <H2>Refund Eligibility</H2>
    <P>
      You may request a refund within <strong>7 days</strong> of your original purchase date if:
    </P>
    <UL
      items={[
        'The Premium features did not work as described at the time of purchase',
        'You experienced a technical issue that prevented you from using the product and our support team was unable to resolve it within a reasonable timeframe',
        'You were charged twice for the same purchase (duplicate charge)',
      ]}
    />

    <H2>Non-Refundable Situations</H2>
    <P>Refunds will not be issued in the following situations:</P>
    <UL
      items={[
        'You changed your mind after purchase',
        'You did not find the product useful after successfully using it',
        'Refund requests made more than 7 days after the original purchase date',
        'Accounts terminated due to violations of our Terms of Service',
        'You have successfully exported 3 or more PDF resumes using Premium features',
        'Issues caused by third-party integrations outside our control',
      ]}
    />

    <H2>How to Request a Refund</H2>
    <P>
      Email us at <MailLink email={BILLING_EMAIL} /> with the following information:
    </P>
    <UL
      items={[
        'Your registered email address',
        'The date of purchase',
        'Your Razorpay payment ID (visible on your profile page under Billing)',
        'A brief description of the issue you experienced',
      ]}
    />
    <P>
      We will respond within 3 business days. Approved refunds are processed within 5–10 business
      days depending on your payment method and bank.
    </P>

    <H2>Partial Refunds</H2>
    <P>
      In exceptional circumstances, we may offer a partial refund at our discretion. This will be
      communicated to you during the review process.
    </P>

    <H2>Cancellation</H2>
    <P>
      The current Premium plan is a one-time payment granting lifetime access — it is not a
      recurring subscription. There is nothing to cancel and your Premium access does not auto-renew.
      If we introduce subscription plans in the future, cancellation will stop future charges and
      your access will continue until the end of the current billing period.
    </P>

    <H2>Dispute Resolution</H2>
    <P>
      If you initiate a chargeback or payment dispute through your bank without first contacting us,
      we reserve the right to suspend your account pending resolution. We encourage you to reach out
      to us first — we're committed to resolving issues fairly.
    </P>

    <H2>Contact</H2>
    <P>
      For billing enquiries: <MailLink email={BILLING_EMAIL} />
    </P>
  </Wrap>
);

// ─── About Page ────────────────────────────────────────────────────────────────

export const AboutPage = () => (
  <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
    <div className="text-center mb-12">
      <p className="kicker mb-2">About us</p>
      <h1 className="text-4xl font-display font-semibold text-ink-950 tracking-tight leading-tight">
        Built to help real people get real jobs
      </h1>
      <p className="mt-4 text-ink-400 text-lg max-w-xl mx-auto">
        {APP_NAME} was built because the most stressful part of job searching — writing a great
        resume — shouldn't require a design degree or hours of guesswork.
      </p>
    </div>

    <div className="grid gap-6 md:grid-cols-3 mb-14">
      {[
        {
          emoji: '✍️',
          title: 'AI that actually helps',
          desc: 'Our AI generates bullet points that sound human, not robotic. It tailors your content to your role and industry so your experience shines.',
        },
        {
          emoji: '📋',
          title: 'ATS-first design',
          desc: 'Every template is built to pass Applicant Tracking Systems. We test against real ATS parsers used by global companies.',
        },
        {
          emoji: '🔒',
          title: 'Your data stays yours',
          desc: 'We never sell your data or use your resume content to train AI models. Your information is yours — full stop.',
        },
      ].map(({ emoji, title, desc }) => (
        <div key={title} className="card p-6">
          <div className="text-3xl mb-3">{emoji}</div>
          <h3 className="font-semibold text-ink-950 mb-2">{title}</h3>
          <p className="text-sm text-ink-400 leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>

    <div className="card p-8 mb-6">
      <h2 className="text-xl font-display font-semibold text-ink-950 mb-4">Why we built this</h2>
      <div className="space-y-3 text-sm text-ink-600 leading-relaxed">
        <p>
          Most resume builders charge a monthly subscription, watermark your PDFs until you pay, or
          bury their pricing so you don't realise you're being charged. We built {APP_NAME} to be
          genuinely transparent: free to start, pay once if you want more.
        </p>
        <p>
          We believe that a person looking for a better job shouldn't have to fight their own tools
          to get there. Our builder is simple, fast, and focused on the thing that matters: getting
          your resume in front of recruiters and through ATS filters.
        </p>
        <p>
          We serve job seekers in India, the US, UK, Australia, Southeast Asia, and across the
          world. Our templates are tested for ATS systems used by global companies, not just local
          ones.
        </p>
      </div>
    </div>

    <div className="grid gap-6 sm:grid-cols-3 mb-6">
      {[
        { number: '50,000+', label: 'Resumes created' },
        { number: '120+',    label: 'Countries served' },
        { number: '4.8 / 5', label: 'Average user rating' },
      ].map(({ number, label }) => (
        <div key={label} className="card p-6 text-center">
          <p className="text-3xl font-display font-bold text-ink-950">{number}</p>
          <p className="mt-1 text-sm text-ink-400">{label}</p>
        </div>
      ))}
    </div>

    <div className="card p-8">
      <h2 className="text-xl font-display font-semibold text-ink-950 mb-4">
        Contact &amp; support
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 text-sm">
        {[
          { label: 'General support', email: SUPPORT_EMAIL },
          { label: 'Billing',         email: BILLING_EMAIL },
          { label: 'Legal',           email: LEGAL_EMAIL },
          { label: 'Privacy',         email: PRIVACY_EMAIL },
        ].map(({ label, email }) => (
          <div key={email} className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-ink-400 uppercase tracking-wide">
              {label}
            </span>
            <MailLink email={email} />
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-ink-400">
        We respond to all enquiries within 24 hours on business days.
      </p>
    </div>
  </div>
);

// ─── Contact Page ──────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ContactPage = () => {
  const [status, setStatus]   = React.useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = React.useState('');
  const [fieldErrors, setFieldErrors] = React.useState({});

  const formRef = React.useRef(null);

  const validate = (data) => {
    const errors = {};
    if (!data.name.trim())                       errors.name    = 'Full name is required.';
    if (!data.email.trim())                      errors.email   = 'Email address is required.';
    else if (!EMAIL_REGEX.test(data.email))      errors.email   = 'Please enter a valid email address.';
    if (!data.subject.trim())                    errors.subject = 'Subject is required.';
    if (!data.message.trim())                    errors.message = 'Message is required.';
    else if (data.message.trim().length < 10)    errors.message = 'Message must be at least 10 characters.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setErrorMsg('');

    const form = formRef.current;
    const data = {
      name:    form.querySelector('[name=name]').value,
      email:   form.querySelector('[name=email]').value,
      subject: form.querySelector('[name=subject]').value,
      message: form.querySelector('[name=message]').value,
    };

    const errors = validate(data);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setStatus('sending');

    try {
      await sendContactMessage(data);
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err?.message || 'Something went wrong. Please try again or email us directly.'
      );
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setErrorMsg('');
    setFieldErrors({});
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <div className="text-center mb-10">
        <p className="kicker mb-2">Support</p>
        <h1 className="text-3xl font-display font-semibold text-ink-950">Contact us</h1>
        <p className="mt-3 text-ink-400 text-sm">
          We respond within 24 hours on business days.
        </p>
      </div>

      <div className="card p-8">
        {status === 'success' ? (
          <div className="py-10 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-50">
              <Icon name="check" className="h-7 w-7 text-success-600" />
            </div>
            <h2 className="text-lg font-semibold text-ink-950">Message sent!</h2>
            <p className="text-sm text-ink-400">We'll get back to you within 24 hours.</p>
            <button onClick={handleReset} className="btn-secondary mt-2">
              Send another message
            </button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
            {status === 'error' && (
              <div className="rounded-xl bg-danger-50 border border-danger-200 px-4 py-3 text-sm text-danger-700">
                {errorMsg || 'Something went wrong.'} Please email us directly at{' '}
                <MailLink email={SUPPORT_EMAIL} className="font-semibold underline text-danger-700" />.
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="contact-name">Full Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  className={`input${fieldErrors.name ? ' border-danger-400 focus:ring-danger-400' : ''}`}
                  placeholder="Your full name"
                  autoComplete="name"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-danger-600">{fieldErrors.name}</p>
                )}
              </div>
              <div>
                <label className="label" htmlFor="contact-email">Email Address</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  className={`input${fieldErrors.email ? ' border-danger-400 focus:ring-danger-400' : ''}`}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-danger-600">{fieldErrors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label className="label" htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                className={`input${fieldErrors.subject ? ' border-danger-400 focus:ring-danger-400' : ''}`}
                placeholder="How can we help?"
              />
              {fieldErrors.subject && (
                <p className="mt-1 text-xs text-danger-600">{fieldErrors.subject}</p>
              )}
            </div>

            <div>
              <label className="label" htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                className={`input min-h-36 resize-y${fieldErrors.message ? ' border-danger-400 focus:ring-danger-400' : ''}`}
                placeholder="Describe your question or issue in detail (minimum 10 characters)…"
              />
              {fieldErrors.message && (
                <p className="mt-1 text-xs text-danger-600">{fieldErrors.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-surface-200">
          <p className="text-sm text-ink-400 text-center">
            Or email us directly at{' '}
            <MailLink email={SUPPORT_EMAIL} />
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-ink-400">
            <span>
              Billing: <MailLink email={BILLING_EMAIL} className="text-brand-600 hover:underline" />
            </span>
            <span>
              Privacy: <MailLink email={PRIVACY_EMAIL} className="text-brand-600 hover:underline" />
            </span>
            <span>
              Legal: <MailLink email={LEGAL_EMAIL} className="text-brand-600 hover:underline" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── 404 Not Found ─────────────────────────────────────────────────────────────

export const NotFoundPage = () => (
  <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
    <div className="text-center max-w-sm mx-auto">
      <p className="text-8xl font-display font-bold text-surface-200 mb-4 select-none">404</p>
      <h1 className="text-2xl font-display font-semibold text-ink-950 mb-2">Page not found</h1>
      <p className="text-ink-400 mb-8 max-w-xs mx-auto text-sm">
        This page doesn't exist or may have been moved. Let's get you back on track.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className="btn-primary">
          Go to homepage
        </Link>
        <Link to="/pricing" className="btn-secondary">
          View pricing
        </Link>
      </div>
      <p className="mt-8 text-xs text-ink-400">
        Need help?{' '}
        <MailLink email={SUPPORT_EMAIL} className="text-brand-600 hover:underline" />
      </p>
    </div>
  </div>
);