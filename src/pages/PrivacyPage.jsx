import { StaticPageLayout } from './static/StaticPageLayout';

export const PrivacyPage = () => (
  <StaticPageLayout
    eyebrow="Privacy"
    title="Privacy Policy"
    description="This Privacy Policy explains how ResumeForge AI may collect, use, and protect information provided through the application and connected account workflows. Last updated: January 2025."
  >
    <p>
      ResumeForge AI may collect information you provide directly, including your name, email address, account credentials, resume content, profile data, and payment-related references returned by integrated payment services. We use this information to authenticate users, save resume drafts, support exports, provide AI-assisted features, and maintain account access.
    </p>

    <h2>Information we process</h2>
    <ul>
      <li>Account details such as name, email address, and login credentials used to authenticate your session.</li>
      <li>Resume information such as work history, education, certifications, projects, and skills you enter into the builder.</li>
      <li>Usage information needed to maintain sessions, show plan status, and support export eligibility.</li>
      <li>Payment metadata or status updates needed to confirm premium activation through the integrated payment provider.</li>
    </ul>

    <h2>How information is used</h2>
    <p>
      Information may be used to operate the service, personalise the builder experience, improve resume suggestions, process payments, prevent abuse, respond to support inquiries, and comply with legal obligations. Resume content may also be sent to configured AI services when you intentionally use AI improvement actions such as summary improvement or bullet generation.
    </p>

    <h2>Data sharing</h2>
    <p>
      We do not sell personal information. Information may be shared with service providers involved in hosting, authentication, payments, analytics, or AI processing only to the extent needed to operate the service. We select providers who maintain appropriate data protection standards.
    </p>

    <h2>Retention and security</h2>
    <p>
      We aim to retain data only as long as needed for account access, product operation, legal compliance, and fraud prevention. Reasonable technical and organisational measures are used to protect your data, though no internet-based service can guarantee absolute security.
    </p>

    <h2>Your choices</h2>
    <p>
      You may contact us to request account help, profile corrections, or questions about your data. If you no longer wish to use the service, you may stop using the application and contact support regarding account-related requests. We will respond within a reasonable timeframe.
    </p>

    <h2>Contact</h2>
    <p>
      For privacy-related questions, please contact us at privacy@resumeforge.ai or through the Contact page.
    </p>
  </StaticPageLayout>
);
