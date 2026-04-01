import { StaticPageLayout } from './static/StaticPageLayout';

export const TermsPage = () => (
  <StaticPageLayout
    eyebrow="Terms"
    title="Terms & Conditions"
    description="These Terms & Conditions govern access to and use of ResumeForge AI. By using the application, you agree to use the service responsibly and in accordance with applicable laws."
  >
    <p>
      ResumeForge AI provides a software interface for creating, editing, previewing, and exporting resume content. Your use of the service is subject to these terms, along with any policies referenced inside the application.
    </p>
    <h2>Acceptable use</h2>
    <ul>
      <li>You agree to provide accurate registration information.</li>
      <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
      <li>You may not misuse the service, interfere with infrastructure, or attempt unauthorized access.</li>
      <li>You may not use the service for unlawful, fraudulent, or misleading activity.</li>
    </ul>
    <h2>Content responsibility</h2>
    <p>
      You remain responsible for the resume content you create, upload, or export through the service. AI-assisted suggestions are provided for convenience and should be reviewed by you before use in professional applications.
    </p>
    <h2>Payments and premium access</h2>
    <p>
      Premium access may depend on successful payment confirmation from integrated payment providers. Prices, features, and access rules shown in the application may change over time. If a payment does not complete or verify successfully, premium access may not be activated.
    </p>
    <h2>Availability</h2>
    <p>
      We aim to keep the service available and functional, but we cannot guarantee uninterrupted operation. Features may be updated, improved, restricted, or removed when necessary for security, product quality, or legal compliance.
    </p>
    <h2>Limitation of liability</h2>
    <p>
      ResumeForge AI is provided on an as-available basis. To the extent allowed by law, we disclaim warranties not expressly stated and are not liable for indirect, incidental, or consequential damages arising from use of the service.
    </p>
    <h2>Contact</h2>
    <p>
      For terms-related questions, please use the contact information on the Contact page.
    </p>
  </StaticPageLayout>
);
