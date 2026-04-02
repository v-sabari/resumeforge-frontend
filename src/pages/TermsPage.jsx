import { StaticPageLayout } from './static/StaticPageLayout';

export const TermsPage = () => (
  <StaticPageLayout
    eyebrow="Terms"
    title="Terms & Conditions"
    description="These Terms & Conditions govern your access to and use of ResumeForge AI. By using the application, you agree to use the service responsibly and in accordance with applicable laws. Last reviewed: January 2025."
  >
    <p>
      ResumeForge AI provides a software interface for creating, editing, previewing, and exporting resume content. Your use of the service is subject to these terms, along with any policies referenced within the application or linked from these terms.
    </p>

    <h2>Acceptable use</h2>
    <ul>
      <li>You agree to provide accurate registration information and to keep your credentials confidential.</li>
      <li>You are responsible for all activity conducted through your account, whether or not authorised by you.</li>
      <li>You may not misuse the service, interfere with infrastructure, or attempt unauthorised access to any system, account, or data.</li>
      <li>You may not use the service for any unlawful, fraudulent, misleading, or abusive purpose.</li>
      <li>You may not attempt to reverse-engineer, copy, or redistribute any part of the service without permission.</li>
    </ul>

    <h2>Content responsibility</h2>
    <p>
      You remain solely responsible for the resume content you create, upload, or export through the service. AI-assisted suggestions are provided for convenience and editorial support. You should review all AI-generated content carefully before using it in any professional or employment context. ResumeForge AI does not guarantee employment outcomes from use of the service.
    </p>

    <h2>Payments and premium access</h2>
    <p>
      Premium access requires successful payment confirmation from the integrated payment provider. Prices, plan features, and access rules displayed in the application may change over time with reasonable notice. If a payment does not complete or verify successfully, premium access will not be activated. For unresolved payment issues, contact support at support@resumeforge.ai.
    </p>

    <h2>Service availability</h2>
    <p>
      We aim to keep the service available and functional at all times, but cannot guarantee uninterrupted operation. Features may be updated, improved, temporarily suspended, or removed when necessary for security, product quality, or legal compliance. We will make reasonable efforts to communicate material changes in advance.
    </p>

    <h2>Limitation of liability</h2>
    <p>
      ResumeForge AI is provided on an as-available basis. To the extent permitted by applicable law, we disclaim all warranties not expressly stated in these terms and are not liable for indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability is limited to the amount you paid in the twelve months preceding any claim.
    </p>

    <h2>Contact</h2>
    <p>For terms-related questions, contact us at legal@resumeforge.ai or through the Contact page.</p>
  </StaticPageLayout>
);
