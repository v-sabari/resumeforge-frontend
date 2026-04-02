import { StaticPageLayout } from './static/StaticPageLayout';

export const PrivacyPage = () => (
  <StaticPageLayout
    eyebrow="Privacy"
    title="Privacy Policy"
    description="This Privacy Policy explains how ResumeForge AI collects, uses, and protects information provided through the application. Last reviewed: January 2025."
  >
    <p>
      ResumeForge AI collects information you provide directly, including your name, email address, account credentials, resume content, profile data, and payment-related references returned by integrated payment services. This information is used to authenticate your account, save resume drafts, support export functionality, provide AI-assisted features, and maintain access to your workspace.
    </p>

    <h2>Information we process</h2>
    <ul>
      <li>Account details including name, email address, and login credentials used to authenticate your session.</li>
      <li>Resume content including work history, education, certifications, projects, skills, and achievements you enter into the builder.</li>
      <li>Usage information needed to maintain sessions, display plan status, and support export eligibility tracking.</li>
      <li>Payment metadata or status updates from integrated payment providers needed to confirm premium activation.</li>
    </ul>

    <h2>How information is used</h2>
    <p>
      Information is used to operate the service, personalise the builder experience, improve resume suggestions, process payments, prevent abuse, respond to support inquiries, and comply with applicable legal obligations. Resume content may be sent to configured AI services when you intentionally trigger AI improvement actions such as summary improvement, bullet generation, or professional rewriting.
    </p>

    <h2>Data sharing</h2>
    <p>
      We do not sell personal information. Information may be shared with service providers involved in hosting, authentication, payment processing, analytics, or AI processing only to the extent necessary to operate the service. We select providers who maintain appropriate data protection standards and contractual obligations.
    </p>

    <h2>Retention and security</h2>
    <p>
      We retain data only as long as needed for account access, product operation, legal compliance, and fraud prevention. Reasonable technical and organisational measures are in place to protect your data, though no internet-based service can guarantee absolute security. You are responsible for keeping your account credentials confidential.
    </p>

    <h2>Your rights and choices</h2>
    <p>
      You may contact us to request account help, data corrections, or information about how your data is handled. If you no longer wish to use the service, you may stop using the application and contact support at privacy@resumeforge.ai regarding account deletion or data-related requests. We will respond within a reasonable timeframe.
    </p>

    <h2>Contact</h2>
    <p>For privacy-related questions, contact us at privacy@resumeforge.ai or through the Contact page.</p>
  </StaticPageLayout>
);
