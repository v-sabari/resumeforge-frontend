import { StaticPageLayout } from './static/StaticPageLayout';

export const TermsPage = () => (
  <StaticPageLayout
    eyebrow="Terms"
    title="Terms & Conditions"
    description="These Terms & Conditions govern access to and use of ResumeForge AI. By using the application, you agree to use the service responsibly and in accordance with applicable laws. Last updated: January 2025."
  >
    <p>
      ResumeForge AI provides a software interface for creating, editing, previewing, and exporting resume content. Your use of the service is subject to these terms, along with any policies referenced inside the application.
    </p>

    <h2>Acceptable use</h2>
    <ul>
      <li>You agree to provide accurate registration information and keep your credentials confidential.</li>
      <li>You are responsible for all activity conducted through your account.</li>
      <li>You may not misuse the service, interfere with infrastructure, or attempt unauthorised access to any system or account.</li>
      <li>You may not use the service for unlawful, fraudulent, or misleading activity of any kind.</li>
    </ul>

    <h2>Content responsibility</h2>
    <p>
      You remain responsible for the resume content you create, upload, or export through the service. AI-assisted suggestions are provided for convenience and should be reviewed carefully before use in professional applications. ResumeForge AI does not guarantee employment outcomes from use of the service.
    </p>

    <h2>Payments and premium access</h2>
    <p>
      Premium access depends on successful payment confirmation from the integrated payment provider. Prices, features, and access rules shown in the application may change over time with reasonable notice. If a payment does not complete or verify successfully, premium access may not be activated. Contact support if you believe a payment was processed but premium was not activated.
    </p>

    <h2>Availability</h2>
    <p>
      We aim to keep the service available and functional, but cannot guarantee uninterrupted operation. Features may be updated, improved, restricted, or removed when necessary for security, product quality, or legal compliance. We will make reasonable efforts to communicate significant changes.
    </p>

    <h2>Limitation of liability</h2>
    <p>
      ResumeForge AI is provided on an as-available basis. To the extent allowed by applicable law, we disclaim warranties not expressly stated and are not liable for indirect, incidental, or consequential damages arising from use of the service.
    </p>

    <h2>Contact</h2>
    <p>
      For terms-related questions, please contact us at legal@resumeforge.ai or through the Contact page.
    </p>
  </StaticPageLayout>
);
