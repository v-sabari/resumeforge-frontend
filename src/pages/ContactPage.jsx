import { StaticPageLayout } from './static/StaticPageLayout';

export const ContactPage = () => (
  <StaticPageLayout
    eyebrow="Contact"
    title="Contact ResumeForge AI"
    description="Need help with your account, billing, exports, or general product questions? Use the details below to reach the ResumeForge AI team."
  >
    <p>
      We welcome product questions, account support requests, feedback about resume-building workflows, and issues related to payments or exports. When reaching out, please include the email address associated with your account and a short description of the issue so the team can respond more efficiently.
    </p>

    <h2>Support topics we handle</h2>
    <ul>
      <li>Login or account access problems and password reset assistance.</li>
      <li>Premium activation and payment follow-up for unresolved transactions.</li>
      <li>Resume export issues, including PDF generation errors.</li>
      <li>AI feature feedback or unexpected output from AI writing tools.</li>
      <li>General product feedback, bug reports, and partnership inquiries.</li>
    </ul>

    <h2>Contact details</h2>
    <p>
      <strong>General support:</strong> support@resumeforge.ai
    </p>
    <p>
      <strong>Business & partnerships:</strong> hello@resumeforge.ai
    </p>
    <p>
      <strong>Privacy & legal:</strong> privacy@resumeforge.ai
    </p>
    <p>
      <strong>Response time:</strong> Within 2 business days for standard support requests. Payment-related issues are typically resolved within 1 business day.
    </p>

    <h2>Before you contact us</h2>
    <p>
      If you are reporting a bug, please include: the page you were on, the action you took, any error message you saw, and whether the issue occurred on mobile or desktop. This helps the team reproduce and resolve issues faster. For payment issues, please have your transaction reference or payment confirmation ready.
    </p>

    <h2>Frequently asked questions</h2>
    <p>
      Many common questions about how exports work, what premium includes, and how AI tools function are answered on our main page FAQ section. You may find your answer there without needing to wait for a reply.
    </p>
  </StaticPageLayout>
);
