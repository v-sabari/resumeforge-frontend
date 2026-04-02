import { StaticPageLayout } from './static/StaticPageLayout';

export const ContactPage = () => (
  <StaticPageLayout
    eyebrow="Contact"
    title="Contact ResumeForge AI"
    description="Need help with your account, billing, exports, or general product questions? Use the details below to reach the support team."
  >
    <p>
      We welcome product questions, account support requests, feedback about resume-building workflows, and issues related to payments or exports. To help us respond faster, please include the email address associated with your account and a clear description of the issue or request when reaching out.
    </p>

    <h2>Support topics we handle</h2>
    <ul>
      <li>Login problems, account access issues, and password-related assistance.</li>
      <li>Premium activation and payment follow-up for transactions that did not activate premium correctly.</li>
      <li>Resume export errors, PDF generation failures, or download-related issues.</li>
      <li>AI feature feedback, unexpected output, or suggestions for improvements.</li>
      <li>General product feedback, feature requests, partnership inquiries, or press contacts.</li>
    </ul>

    <h2>Contact details</h2>
    <p><strong>General support:</strong> support@resumeforge.ai</p>
    <p><strong>Billing and payments:</strong> billing@resumeforge.ai</p>
    <p><strong>Business inquiries:</strong> hello@resumeforge.ai</p>
    <p><strong>Privacy matters:</strong> privacy@resumeforge.ai</p>
    <p><strong>Response time:</strong> Within 2 business days for standard support requests. Billing and payment issues are typically resolved within 1 business day.</p>

    <h2>Reporting a bug</h2>
    <p>
      If you are reporting a technical issue, please include: the page you were on when the issue occurred, the action you took, any error message or unexpected behaviour you saw, and whether it happened on mobile or desktop. Screenshots are helpful but not required. The more detail you can provide, the faster the team can reproduce and resolve the issue.
    </p>

    <h2>Before contacting support</h2>
    <p>
      Many common questions about how exports work, what is included in the Premium plan, and how the AI writing tools function are answered in detail on the FAQ section of the homepage. You may find your answer there without needing to wait for a reply from the support team.
    </p>
  </StaticPageLayout>
);
