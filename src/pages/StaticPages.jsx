import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../utils/constants';
import { Icon } from '../components/icons/Icon';

const Wrap = ({ title, lastUpdated, children }) => (
  <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
    <div className="mb-8">
      <h1 className="text-3xl font-display font-semibold text-ink-950">{title}</h1>
      {lastUpdated && <p className="mt-2 text-sm text-ink-400">Last updated: {lastUpdated}</p>}
    </div>
    <div className="space-y-5 text-sm text-ink-600 leading-relaxed">{children}</div>
  </div>
);

const H2 = ({ children }) => <h2 className="text-lg font-semibold text-ink-950 mt-8 mb-2">{children}</h2>;
const P  = ({ children }) => <p>{children}</p>;
const UL = ({ items })   => <ul className="list-disc pl-5 space-y-1">{items.map((i,k) => <li key={k}>{i}</li>)}</ul>;

export const PrivacyPage = () => (
  <Wrap title="Privacy Policy" lastUpdated="1 April 2025">
    <P>ResumeForge AI ("we", "our", "us") is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights as a user. By using ResumeForge AI, you agree to this policy.</P>

    <H2>1. Information We Collect</H2>
    <P><strong>Account data:</strong> When you register, we collect your full name and email address.</P>
    <P><strong>Resume content:</strong> Any information you enter into the resume builder — including work history, education, skills, and contact details — is stored securely and used only to deliver the service to you.</P>
    <P><strong>Payment data:</strong> Payments are processed by Razorpay. We store only a payment reference ID and status. We do not store your card numbers, bank details, or CVV codes. Razorpay's privacy policy governs their data handling.</P>
    <P><strong>Usage data:</strong> We may collect anonymous usage analytics (pages visited, features used, export counts) to improve the product. This data does not personally identify you.</P>
    <P><strong>Device data:</strong> Standard server logs may capture your IP address, browser type, and device type for security and debugging purposes.</P>

    <H2>2. How We Use Your Data</H2>
    <UL items={[
      'To create and maintain your account',
      'To store and deliver your resume content',
      'To process payments and activate Premium features',
      'To send account-related emails (registration confirmation, support responses)',
      'To improve the platform based on anonymised usage patterns',
      'To detect and prevent fraud or abuse',
    ]} />

    <H2>3. Data Sharing</H2>
    <P>We do not sell, rent, or share your personal data with third parties for marketing purposes. We share data only with:</P>
    <UL items={[
      'Razorpay — for payment processing',
      'Render — our backend hosting provider (data is encrypted at rest)',
      'If required by law, court order, or government authority',
    ]} />

    <H2>4. Data Retention</H2>
    <P>We retain your account and resume data for as long as your account is active. If you delete your account, your data is permanently deleted within 30 days. Payment records may be retained for up to 7 years for legal and accounting compliance.</P>

    <H2>5. Security</H2>
    <P>We use industry-standard security measures including HTTPS, bcrypt password hashing, JWT-based authentication, and encrypted database connections. No system is 100% secure, but we take all reasonable precautions to protect your data.</P>

    <H2>6. Cookies and Local Storage</H2>
    <P>We use browser localStorage to store your authentication token locally on your device. This is required for you to stay logged in. We do not use advertising cookies or third-party tracking cookies. If you use the optional consent to analytics, an analytics cookie may be set by Google Analytics.</P>

    <H2>7. Your Rights</H2>
    <P>Depending on your region, you may have the right to:</P>
    <UL items={[
      'Access a copy of your personal data',
      'Request correction of inaccurate data',
      'Request deletion of your account and all associated data',
      'Withdraw consent to analytics tracking',
      'Lodge a complaint with your local data protection authority',
    ]} />
    <P>To exercise any of these rights, contact us at <a href="mailto:privacy@resumeforge.ai" className="text-brand-600 hover:underline">privacy@resumeforge.ai</a>.</P>

    <H2>8. Children</H2>
    <P>ResumeForge AI is intended for users aged 16 and above. We do not knowingly collect data from children under 16. If you believe a child has registered without parental consent, contact us immediately.</P>

    <H2>9. Changes to This Policy</H2>
    <P>We may update this policy periodically. We will notify registered users of significant changes by email or in-app notice. Continued use of the platform after such notice constitutes acceptance of the updated policy.</P>

    <H2>10. Contact</H2>
    <P>For privacy concerns: <a href="mailto:privacy@resumeforge.ai" className="text-brand-600 hover:underline">privacy@resumeforge.ai</a></P>
  </Wrap>
);

export const TermsPage = () => (
  <Wrap title="Terms of Service" lastUpdated="1 April 2025">
    <P>These Terms of Service ("Terms") govern your use of ResumeForge AI ("Service"), operated by the ResumeForge AI team ("we", "us", "our"). By creating an account or using the Service, you agree to these Terms. If you do not agree, do not use the Service.</P>

    <H2>1. The Service</H2>
    <P>ResumeForge AI provides an AI-assisted resume building platform accessible via web browser. Features include resume creation, AI writing assistance, PDF export, and premium plan upgrades.</P>

    <H2>2. Accounts</H2>
    <P>You must be at least 16 years old to create an account. You are responsible for maintaining the confidentiality of your password. One person may hold only one account. You may not share your account with others.</P>
    <P>You agree not to use the Service to: violate any applicable law; infringe any intellectual property rights; submit false, misleading, or fraudulent content; attempt to gain unauthorized access to other accounts or our systems; or use automated scripts to access the Service.</P>

    <H2>3. Free Plan</H2>
    <P>Free accounts include access to the resume builder, AI writing assistance, and up to 2 PDF exports. No credit card is required. We reserve the right to adjust free plan limits with reasonable notice.</P>

    <H2>4. Premium Plan</H2>
    <P>Premium access is available as a one-time payment. Upon successful payment verification, your account is upgraded to Premium status, which includes unlimited PDF exports and all current premium features. Premium access does not expire unless your account is terminated for a violation of these Terms.</P>

    <H2>5. Payments and Billing</H2>
    <P>All payments are processed by Razorpay. By making a purchase, you agree to Razorpay's terms and conditions. All prices are listed in USD or INR as displayed on the pricing page. Prices may change with notice. Your current purchase is billed at the price displayed at checkout.</P>

    <H2>6. Refunds</H2>
    <P>See our <Link to="/refund-policy" className="text-brand-600 hover:underline">Refund Policy</Link> for full details. In summary: we offer refunds within 7 days of purchase if the product did not function as described, subject to review.</P>

    <H2>7. Intellectual Property</H2>
    <P><strong>Your content:</strong> You own all resume content you create using the Service. You grant us a limited, non-exclusive license to store and process your content solely for the purpose of providing the Service.</P>
    <P><strong>Our content:</strong> The ResumeForge AI name, logo, interface design, and underlying software are owned by us and protected by applicable intellectual property laws. You may not copy, reverse-engineer, or redistribute any part of the platform.</P>

    <H2>8. Disclaimer of Warranties</H2>
    <P>The Service is provided "as is" and "as available" without warranties of any kind, express or implied. We do not warrant that the Service will be uninterrupted, error-free, or that resumes created using the Service will result in employment. We do not guarantee AdSense or any third-party approval.</P>

    <H2>9. Limitation of Liability</H2>
    <P>To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service, even if we have been advised of the possibility of such damages. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.</P>

    <H2>10. Termination</H2>
    <P>We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or cause harm to the platform or other users. You may delete your account at any time by contacting support.</P>

    <H2>11. Governing Law</H2>
    <P>These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the courts of India.</P>

    <H2>12. Contact</H2>
    <P>For questions about these Terms: <a href="mailto:legal@resumeforge.ai" className="text-brand-600 hover:underline">legal@resumeforge.ai</a></P>
  </Wrap>
);

export const RefundPolicyPage = () => (
  <Wrap title="Refund & Cancellation Policy" lastUpdated="1 April 2025">
    <P>ResumeForge AI offers a limited refund policy for Premium plan purchases. Please read the following carefully before making a purchase.</P>

    <H2>Refund Eligibility</H2>
    <P>You may request a refund within <strong>7 days</strong> of your original purchase date if:</P>
    <UL items={[
      'The Premium features did not work as described at the time of purchase',
      'You experienced a technical issue that prevented you from using the product and our support team was unable to resolve it within a reasonable timeframe',
      'You were charged twice for the same purchase',
    ]} />

    <H2>Non-Refundable Situations</H2>
    <UL items={[
      'You changed your mind after purchase',
      'You did not find the product useful after successfully using it',
      'Refund requests made more than 7 days after purchase',
      'Accounts terminated due to Terms of Service violations',
      'If you have successfully exported 3 or more PDF resumes using Premium features',
    ]} />

    <H2>How to Request a Refund</H2>
    <P>Email <a href="mailto:billing@resumeforge.ai" className="text-brand-600 hover:underline">billing@resumeforge.ai</a> with:</P>
    <UL items={[
      'Your registered email address',
      'The date of purchase',
      'Your Razorpay payment ID (visible in your profile page)',
      'A brief description of the issue',
    ]} />
    <P>We will respond within 3 business days. Approved refunds are processed within 5–10 business days depending on your payment method.</P>

    <H2>Cancellation</H2>
    <P>The current Premium plan is a one-time payment (lifetime access), not a subscription. There is nothing to cancel — your Premium access does not renew. If we introduce subscription plans in the future, cancellation will stop future charges and your access will continue until the end of the billing period.</P>

    <H2>Contact</H2>
    <P>For billing enquiries: <a href="mailto:billing@resumeforge.ai" className="text-brand-600 hover:underline">billing@resumeforge.ai</a></P>
  </Wrap>
);

export const AboutPage = () => (
  <div className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
    <div className="text-center mb-12">
      <p className="kicker mb-2">About us</p>
      <h1 className="text-4xl font-display font-semibold text-ink-950 tracking-tight leading-tight">
        Built to help real people get real jobs
      </h1>
      <p className="mt-4 text-ink-400 text-lg max-w-xl mx-auto">
        {APP_NAME} was built because the most stressful part of job searching — writing a great resume —
        shouldn't require a design degree or hours of guesswork.
      </p>
    </div>

    <div className="grid gap-6 md:grid-cols-3 mb-14">
      {[
        { emoji: '✍️', title: 'AI that actually helps', desc: 'Our AI generates bullet points that sound human, not robotic. It tailors your content to your role and industry.' },
        { emoji: '📋', title: 'ATS-first design',       desc: 'Every template is built to pass Applicant Tracking Systems. We test against real ATS parsers.' },
        { emoji: '🔒', title: 'Your data stays yours',  desc: 'We never sell your data or use your resume content to train AI models. Full stop.' },
      ].map(({ emoji, title, desc }) => (
        <div key={title} className="card p-6">
          <div className="text-3xl mb-3">{emoji}</div>
          <h3 className="font-semibold text-ink-950 mb-2">{title}</h3>
          <p className="text-sm text-ink-400 leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>

    <div className="card p-8 mb-10">
      <h2 className="text-xl font-display font-semibold text-ink-950 mb-4">Why we built this</h2>
      <div className="space-y-3 text-sm text-ink-600 leading-relaxed">
        <p>Most resume builders charge a monthly subscription, watermark your PDFs until you pay, or bury their pricing so you don't realize you're being charged. We built {APP_NAME} to be genuinely transparent: free to start, pay once if you want more.</p>
        <p>We believe that a person looking for a better job shouldn't have to fight their own tools to get there. Our builder is simple, fast, and focused on the thing that matters: getting your resume in front of recruiters and through ATS filters.</p>
        <p>We serve job seekers in India, the US, UK, Australia, Southeast Asia, and across the world. Our templates are tested for ATS systems used by global companies, not just local ones.</p>
      </div>
    </div>

    <div className="card p-8">
      <h2 className="text-xl font-display font-semibold text-ink-950 mb-4">Contact &amp; support</h2>
      <div className="grid gap-4 sm:grid-cols-2 text-sm">
        {[
          { label: 'General enquiries', email: 'hello@resumeforge.ai' },
          { label: 'Support',           email: 'support@resumeforge.ai' },
          { label: 'Billing',           email: 'billing@resumeforge.ai' },
          { label: 'Legal / Privacy',   email: 'legal@resumeforge.ai' },
        ].map(({ label, email }) => (
          <div key={email} className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-ink-400 uppercase tracking-wide">{label}</span>
            <a href={`mailto:${email}`} className="text-brand-600 hover:underline">{email}</a>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-ink-400">We respond to all enquiries within 24 hours on business days.</p>
    </div>
  </div>
);

export const ContactPage = () => {
  const [status, setStatus] = React.useState('idle'); // idle | sending | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const form = e.target;
    const data = {
      name:    form.querySelector('[name=name]').value,
      email:   form.querySelector('[name=email]').value,
      subject: form.querySelector('[name=subject]').value,
      message: form.querySelector('[name=message]').value,
    };

    try {
      // ─────────────────────────────────────────────────────────────────────
      // ACTION REQUIRED ▶ Replace YOUR_FORMSPREE_ID with your real form ID.
      // How to get it:
      //   1. Go to https://formspree.io and create a free account.
      //   2. Create a new form — get an ID like "xyzabcde".
      //   3. Replace YOUR_FORMSPREE_ID below.
      //   4. Formspree free tier: 50 submissions/month — sufficient for launch.
      //
      // Alternative: Use EmailJS (emailjs.com) or connect to your own backend endpoint.
      // ─────────────────────────────────────────────────────────────────────
      const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORMSPREE_ID';

      // Fallback: if Formspree is not configured yet, open mailto as a last resort
      if (FORMSPREE_ENDPOINT.includes('YOUR_FORMSPREE_ID')) {
        window.location.href =
          `mailto:support@resumeforge.ai?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`From: ${data.name} (${data.email})\n\n${data.message}`)}`;
        setStatus('idle');
        return;
      }

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <div className="text-center mb-10">
        <p className="kicker mb-2">Support</p>
        <h1 className="text-3xl font-display font-semibold text-ink-950">Contact us</h1>
        <p className="mt-3 text-ink-400 text-sm">We respond within 24 hours on business days.</p>
      </div>
      <div className="card p-8">
        {status === 'success' ? (
          <div className="py-10 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-50">
              <Icon name="check" className="h-7 w-7 text-success-600" />
            </div>
            <h2 className="text-lg font-semibold text-ink-950">Message sent!</h2>
            <p className="text-sm text-ink-400">We'll get back to you within 24 hours.</p>
            <button onClick={() => setStatus('idle')} className="btn-secondary mt-2">Send another message</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'error' && (
              <div className="rounded-xl bg-danger-50 border border-danger-200 px-4 py-3 text-sm text-danger-700">
                Something went wrong. Please email us directly at{' '}
                <a href="mailto:support@resumeforge.ai" className="font-semibold underline">support@resumeforge.ai</a>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Name</label>
                <input name="name" type="text" className="input" placeholder="Your full name" required autoComplete="name" />
              </div>
              <div>
                <label className="label">Email</label>
                <input name="email" type="email" className="input" placeholder="you@example.com" required autoComplete="email" />
              </div>
            </div>
            <div>
              <label className="label">Subject</label>
              <input name="subject" type="text" className="input" placeholder="How can we help?" required />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea name="message" className="input min-h-36 resize-y" placeholder="Describe your question or issue in detail…" required />
            </div>
            <button type="submit" className="btn-primary w-full justify-center" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}
        <div className="mt-6 pt-5 border-t border-surface-200">
          <p className="text-sm text-ink-400 text-center">
            Or email us directly at{' '}
            <a href="mailto:support@resumeforge.ai" className="text-brand-600 hover:underline">support@resumeforge.ai</a>
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-ink-400">
            <span>Billing: <a href="mailto:billing@resumeforge.ai" className="text-brand-600 hover:underline">billing@resumeforge.ai</a></span>
            <span>Privacy: <a href="mailto:privacy@resumeforge.ai" className="text-brand-600 hover:underline">privacy@resumeforge.ai</a></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NotFoundPage = () => (
  <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
    <div className="text-center">
      <p className="text-8xl font-display font-bold text-surface-200 mb-4 select-none">404</p>
      <h1 className="text-2xl font-display font-semibold text-ink-950 mb-2">Page not found</h1>
      <p className="text-ink-400 mb-8 max-w-xs mx-auto text-sm">This page doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary">Go to homepage</Link>
    </div>
  </div>
);
