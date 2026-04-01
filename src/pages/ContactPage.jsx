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
    <h2>Support topics</h2>
    <ul>
      <li>Login or account access problems</li>
      <li>Premium activation and payment follow-up</li>
      <li>Resume export issues</li>
      <li>General product feedback or partnership inquiries</li>
    </ul>
    <h2>Contact details</h2>
    <p>
      Email: support@resumeforge.ai
    </p>
    <p>
      Business inquiries: hello@resumeforge.ai
    </p>
    <p>
      Response goal: within 2 business days for standard support requests.
    </p>
    <h2>Before you contact us</h2>
    <p>
      If you are reporting a bug, please include the page you were using, the action you took, any error message you saw, and whether the issue happened on mobile or desktop. This helps us reproduce issues and resolve them faster.
    </p>
  </StaticPageLayout>
);
