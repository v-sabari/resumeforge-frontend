import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../utils/constants';
import { Icon } from '../components/icons/Icon';
import { sendContactMessage } from '../services/contactService';

const SUPPORT_EMAIL = 'sabarivenkatesan2962006@gmail.com';
const BILLING_EMAIL = 'sabarivenkatesan2962006@gmail.com';
const LEGAL_EMAIL = 'sabarivenkatesan2962006@gmail.com';
const PRIVACY_EMAIL = 'sabarivenkatesan2962006@gmail.com';

const Wrap = ({ title, lastUpdated, children }) => (
  <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
    <div className="mb-8">
      <h1 className="text-3xl font-display font-semibold text-ink-950">{title}</h1>
      {lastUpdated ? (
        <p className="mt-2 text-sm text-ink-400">Last updated: {lastUpdated}</p>
      ) : null}
    </div>
    <div className="space-y-5 text-sm leading-relaxed text-ink-600">{children}</div>
  </div>
);

const H2 = ({ children }) => (
  <h2 className="mt-8 mb-2 text-lg font-semibold text-ink-950">{children}</h2>
);

const P = ({ children }) => <p>{children}</p>;

const UL = ({ items }) => (
  <ul className="list-disc space-y-1 pl-5">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

export const PrivacyPage = () => (
  <Wrap title="Privacy Policy" lastUpdated="11 April 2026">
    <P>
      ResumeForge AI (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting
      your personal information. This Privacy Policy explains what data we collect, how we use it,
      and your rights as a user. By using ResumeForge AI, you agree to this policy.
    </P>

    <H2>1. Information We Collect</H2>
    <P>
      <strong>Account data:</strong> When you register, we collect your full name and email
      address.
    </P>
    <P>
      <strong>Resume content:</strong> Any information you enter into the resume builder —
      including work history, education, skills, and contact details — is stored securely and used
      only to deliver the service to you.
    </P>
    <P>
      <strong>Payment data:</strong> Payments are processed by Razorpay. We store only a payment
      reference ID and status. We do not store your card numbers, bank details, or CVV codes.
      Razorpay&apos;s privacy policy governs their data handling.
    </P>
    <P>
      <strong>Usage data:</strong> We may collect anonymous usage analytics, such as pages visited,
      features used, and export counts, to improve the product. This data does not personally
      identify you.
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
        'To send account-related emails such as verification emails and support responses',
        'To improve the platform based on anonymised usage patterns',
        'To detect and prevent fraud or abuse',
      ]}
    />

    <H2>3. Data Sharing</H2>
    <P>We do not sell, rent, or share your personal data with third parties for marketing purposes.</P>
    <P>We share data only with:</P>
    <UL
      items={[
        'Razorpay — for payment processing',
        'Render — our backend hosting provider',
        'Vercel — our frontend hosting provider',
        'Resend — for transactional emails',
        'If required by law, court order, or government authority',
      ]}
    />

    <H2>4. Data Retention</H2>
    <P>
      We retain your account and resume data for as long as your account is active. If you delete
      your account, your data is permanently deleted within a reasonable operational window. Payment
      records may be retained for legal and accounting compliance where required.
    </P>

    <H2>5. Security</H2>
    <P>
      We use industry-standard security measures including HTTPS, bcrypt password h