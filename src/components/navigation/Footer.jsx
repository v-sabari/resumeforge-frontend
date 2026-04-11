import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { APP_NAME } from '../../utils/constants';

const cols = [
  {
    heading: 'Product',
    links: [
      { to: '/features',  label: 'Features'     },
      { to: '/pricing',   label: 'Pricing'      },
      { to: '/resources', label: 'Resources'    },
      { to: '/app/builder', label: 'Build Resume' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { to: '/about',   label: 'About Us' },
      { to: '/contact', label: 'Contact'  },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { to: '/privacy',       label: 'Privacy Policy'    },
      { to: '/terms',         label: 'Terms of Service'  },
      { to: '/refund-policy', label: 'Refund Policy'     },
    ],
  },
];

const trustItems = [
  '🔒 Secure & encrypted',
  '✅ ATS-optimised',
  '🌏 Used worldwide',
  '💳 Powered by Razorpay',
];

export const Footer = () => (
  <footer className="border-t border-surface-200 bg-white">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Trust bar */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10 pb-8 border-b border-surface-100">
        {trustItems.map((t) => (
          <span key={t} className="text-xs text-ink-400 font-medium">{t}</span>
        ))}
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Logo size="sm" />
          <p className="mt-3 text-sm text-ink-400 max-w-xs leading-relaxed">
            AI-powered resume builder for modern professionals.
            ATS-ready, free to start, trusted by job seekers worldwide.
          </p>
          <div className="mt-4 space-y-1 text-xs text-ink-400">
            <p><a href="mailto:support@resumeforgeai.site" className="hover:text-brand-600 transition-colors">support@resumeforgeai.site</a></p>
            <p><a href="mailto:billing@resumeforgeai.site"  className="hover:text-brand-600 transition-colors">billing@resumeforgeai.site</a></p>
          </div>
          <p className="mt-4 text-xs text-ink-300">© {new Date().getFullYear()} {APP_NAME}.<br />All rights reserved.</p>
        </div>

        {cols.map((col) => (
          <div key={col.heading}>
            <h4 className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-4">{col.heading}</h4>
            <ul className="space-y-2.5">
              {col.links.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-ink-500 hover:text-brand-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="mt-10 pt-6 border-t border-surface-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-ink-300">
          Free to start · No credit card needed · Instant PDF download
        </p>
        <div className="flex gap-4">
          {[
            { to: '/privacy',       label: 'Privacy' },
            { to: '/terms',         label: 'Terms'   },
            { to: '/refund-policy', label: 'Refunds' },
            { to: '/contact',       label: 'Support' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className="text-xs text-ink-300 hover:text-ink-500 transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
