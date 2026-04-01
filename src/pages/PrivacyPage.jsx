import { StaticPageLayout } from './static/StaticPageLayout';

export const PrivacyPage = () => (
  <StaticPageLayout
    eyebrow="Privacy"
    title="Privacy Policy"
    description="This Privacy Policy explains how ResumeForge AI may collect, use, and protect information provided through the frontend application and connected account workflows."
  >
    <p>
      ResumeForge AI may collect information you provide directly, including your name, email address, account credentials, resume content, profile data, and payment-related references returned by integrated payment services. We use this information to authenticate users, save resume drafts, support exports, provide AI-assisted features, and maintain account access.
    </p>
    <h2>Information we process</h2>
    <ul>
      <li>Account details such as name, email address, and login credentials.</li>
      <li>Resume information such as work history, education, certifications, projects, and skills.</li>
      <li>Usage information needed to maintain sessions, show plan status, and support export eligibility.</li>
      <li>Payment metadata or status updates needed to confirm premium activation.</li>
    </ul>
    <h2>How information is used</h2>
    <p>
      Information may be used to operate the service, personalize the builder experience, improve resume suggestions, process payments, prevent abuse, respond to support inquiries, and comply with legal obligations. Resume content may also be sent to configured AI services when you intentionally use AI improvement actions.
    </p>
    <h2>Data sharing</h2>
    <p>
      We do not describe this product as selling personal information. Information may be shared with service providers involved in hosting, authentication, payments, analytics, or AI processing only to the extent needed to operate the service.
    </p>
    <h2>Retention and security</h2>
    <p>
      We aim to retain data only as long as needed for account access, product operation, legal compliance, and fraud prevention. Reasonable technical and organizational measures should be used to protect data, but no internet-based service can guarantee absolute security.
    </p>
    <h2>Your choices</h2>
    <p>
      You may contact us to request account help, profile corrections, or questions about your data. If you no longer want to use the service, you can stop using the application and contact support regarding account-related requests.
    </p>
  </StaticPageLayout>
);
