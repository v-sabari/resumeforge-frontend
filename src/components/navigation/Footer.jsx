import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { APP_NAME } from '../../utils/constants';

const currentYear = new Date().getFullYear();

const footerSections = [
  {
    heading: 'Product',
    ariaLabel: 'Product links',
    links: [
      { to: '/pricing', label: 'Pricing' },
      { to: '/resources', label: 'Resources' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Company',
    ariaLabel: 'Company links',
    links: [
      { to: '/about', label: 'About Us' },
      { to: '/contact', label: 'Support' },
    ],
  },
  {
    heading: 'Legal',
    ariaLabel: 'Legal links',
    links: [
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms of Service' },
      { to: '/refund-policy', label: 'Refund Policy' },
    ],
  },
];

const trustBadges = [
  'ATS-friendly resumes',
  'Free plan available',
  'No credit card to start',
  'Secure payment flow',
];

const utilityLinks = [
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/refund-policy', label: 'Refunds' },
  { to: '/contact', label: 'Support' },
];

const footerLinkClass =
  'text-sm text-ink-500 transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-sm';

const utilityLinkClass =
  'text-xs text-ink-400 transition-colors hover:text-ink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-sm';

export const Footer = () => {
  return (
    <footer
      className="border-t border-surface-200 bg-white"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-10 rounded-2xl border border-surface-200 bg-surface-50 px-5 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-ink-900 sm:text-xl">
                Build a professional, ATS-friendly resume in minutes
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-500 sm:text-base">
                Start free, write faster with AI assistance, and export a polished
                resume built for modern hiring workflows.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                Get Started Free
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-xl border border-surface-300 bg-white px-5 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>

        <ul
          className="mb-10 flex flex-wrap gap-2 border-b border-surface-100 pb-8"
          aria-label="Trust highlights"
        >
          {trustBadges.map((item) => (
            <li key={item}>
              <span className="inline-flex items-center rounded-full border border-surface-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-500">
                {item}
              </span>
            </li>
          ))}
        </ul>

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link
              to="/"
              aria-label={`${APP_NAME} home`}
              className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              <Logo size="sm" />
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-ink-500">
              {APP_NAME} helps job seekers create polished, professional resumes
              with ATS-friendly layouts, AI-assisted writing, and a faster path
              from draft to application.
            </p>

            <div className="mt-5 space-y-2 text-sm text-ink-500">
              <p>
                Support:{' '}
                <a
                  href="mailto:support@resumeforgeai.site"
                  className="font-medium text-ink-700 transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-sm"
                >
                  support@resumeforgeai.site
                </a>
              </p>
              <p>
                Billing:{' '}
                <a
                  href="mailto:billing@resumeforgeai.site"
                  className="font-medium text-ink-700 transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-sm"
                >
                  billing@resumeforgeai.site
                </a>
              </p>
            </div>

            <p className="mt-5 text-xs leading-5 text-ink-400">
              Free to start. No credit card required for the free plan. Secure
              payment processing for premium upgrades.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            {footerSections.map((section) => (
              <nav key={section.heading} aria-label={section.ariaLabel}>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-ink-400">
                  {section.heading}
                </h3>
                <ul className="space-y-3">
                  {section.links.map(({ to, label }) => (
                    <li key={to}>
                      <Link to={to} className={footerLinkClass}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-surface-100 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs leading-5 text-ink-400">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>

          <nav
            aria-label="Footer utility links"
            className="flex flex-wrap gap-x-4 gap-y-2"
          >
            {utilityLinks.map(({ to, label }) => (
              <Link key={to} to={to} className={utilityLinkClass}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};