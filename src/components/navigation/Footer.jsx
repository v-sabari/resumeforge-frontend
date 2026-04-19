import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { APP_NAME } from '../../utils/constants';

const currentYear = new Date().getFullYear();

const footerSections = [
  {
    heading: 'Product',
    ariaLabel: 'Product links',
    links: [
      { to: '/tools',     label: 'Free Resume Tools' },
      { to: '/pricing',   label: 'Pricing'           },
      { to: '/resources', label: 'Career Resources'  },
      { to: '/register',  label: 'Get started free'  },
    ],
  },
  {
    heading: 'Company',
    ariaLabel: 'Company links',
    links: [
      { to: '/about',   label: 'About Us'     },
      { to: '/contact', label: 'Contact'      },
      { to: '/app/referral', label: 'Refer & earn' },
    ],
  },
  {
    heading: 'Legal',
    ariaLabel: 'Legal links',
    links: [
      { to: '/privacy',       label: 'Privacy Policy' },
      { to: '/terms',         label: 'Terms of Service' },
      { to: '/refund-policy', label: 'Refund Policy'  },
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
  { to: '/privacy',       label: 'Privacy'  },
  { to: '/terms',         label: 'Terms'    },
  { to: '/refund-policy', label: 'Refunds'  },
  { to: '/contact',       label: 'Support'  },
];

const footerLinkClass =
  'text-sm text-ink-500 transition-colors hover:text-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-sm';

const utilityLinkClass =
  'text-xs text-ink-400 transition-colors hover:text-ink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-sm';

export const Footer = () => (
  <footer className="border-t border-surface-200 bg-white">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      {/* Main footer grid */}
      <div className="grid gap-10 py-12 md:grid-cols-[2fr_1fr_1fr_1fr]">

        {/* Brand column */}
        <div>
          <Logo size="sm" linkTo="/" />
          <p className="mt-4 text-sm text-ink-500 leading-relaxed max-w-xs">
            {APP_NAME} helps job seekers build ATS-optimised resumes with AI assistance.
            Free to start. Export PDF or DOCX in minutes.
          </p>

          {/* Trust badges */}
          <ul className="mt-5 space-y-1.5" aria-label="Trust signals">
            {trustBadges.map((badge) => (
              <li key={badge} className="flex items-center gap-2 text-xs text-ink-400">
                <span className="h-1.5 w-1.5 rounded-full bg-success-500 shrink-0" aria-hidden="true" />
                {badge}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/register"
              className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
              Get Started Free
            </Link>
            <Link to="/pricing"
              className="inline-flex items-center justify-center rounded-xl border border-surface-300 bg-white px-5 py-3 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700">
              See Pricing
            </Link>
          </div>
        </div>

        {/* Link columns */}
        {footerSections.map((section) => (
          <nav key={section.heading} aria-label={section.ariaLabel}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink-400">
              {section.heading}
            </p>
            <ul className="space-y-3">
              {section.links.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={footerLinkClass}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-surface-100 py-6 sm:flex-row">
        <p className="text-xs text-ink-400">
          © {currentYear} {APP_NAME}. All rights reserved.
        </p>

        <nav className="flex flex-wrap items-center gap-4" aria-label="Footer utility links">
          {utilityLinks.map(({ to, label }) => (
            <Link key={to} to={to} className={utilityLinkClass}>{label}</Link>
          ))}
          <a href="mailto:support@resumeforgeai.site" className={utilityLinkClass}>
            support@resumeforgeai.site
          </a>
        </nav>
      </div>
    </div>
  </footer>
);
