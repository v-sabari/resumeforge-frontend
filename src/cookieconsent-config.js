import {
  run as runCookieConsentLib,
  acceptedCategory,
  showPreferences,
  eraseCookies,
} from 'vanilla-cookieconsent';
import {
  initAnalytics,
  analyticsConsentKey,
} from './utils/analytics';

// Central, single source of truth for which cookies the site can set.
// Used by the banner config (categories, readOnly, duration) AND rendered
// into the /cookie-policy page table, so the two can never drift apart.
//
// Category keys MUST match the `categories` object names passed to
// CookieConsent.run() below.
export const cookieRegistry = [
  // ── Backend (Spring Boot) ─────────────────────────────────────────────
  {
    name: 'resumeforge_token',
    category: 'necessary',
    purpose:
      'HTTP-only JWT bearer token set by the Spring Boot backend (AuthController) ' +
      'on login/register. Keeps the visitor signed in; required for every ' +
      'authenticated API call. Cannot be read by JavaScript.',
    duration: '24 hours (or 14 days when "Remember me" is chosen); cleared on logout',
    party: 'First-party',
    setBy: 'Backend',
  },
  // ── Consent management (vanilla-cookieconsent) ────────────────────────
  {
    name: 'cc_cookie',
    category: 'necessary',
    purpose:
      "Stores the visitor's cookie-consent choice (analytics accepted/declined), " +
      'the consent revision, and a consent ID. Required so the site remembers ' +
      'your preference and does not re-show the banner.',
    duration: '6 months, or until the visitor resets consent',
    party: 'First-party',
    setBy: 'Frontend',
  },
  // ── Analytics (only after explicit opt-in) ────────────────────────────
  {
    name: '_ga',
    category: 'analytics',
    purpose:
      'Google Analytics 4 cookie. Only set AFTER the visitor accepts the "analytics" ' +
      'category. Registers a unique ID to distinguish visits.',
    duration: '2 years',
    party: 'First-party (Google script)',
    setBy: 'Frontend (opt-in)',
  },
  {
    name: '_ga_<container-id>',
    category: 'analytics',
    purpose:
      'Google Analytics 4 cookie. Only set AFTER the visitor accepts the "analytics" ' +
      'category. Persists session and visit state.',
    duration: '2 years',
    party: 'First-party (Google script)',
    setBy: 'Frontend (opt-in)',
  },
];

export const COOKIE_POLICY_ROUTE = '/cookie-policy';

// Keep the in-app analytics flag + script loading in sync with the visitor's
// current choice. Reads the *authoritative* state from the plugin.
const syncAnalytics = () => {
  if (acceptedCategory('analytics')) {
    localStorage.setItem(analyticsConsentKey, 'accepted');
    initAnalytics();
  } else {
    localStorage.setItem(analyticsConsentKey, 'declined');
    // Revoke: erase any GA cookies that may have been set while consent was
    // granted, so revoking analytics actually removes the tracking data.
    try {
      eraseCookies(['_ga', /_ga_.*/], '/');
    } catch {
      /* best-effort only */
    }
  }
};

// Configure and run the consent banner. Idempotent: run() is invoked once;
// calling it again is a no-op (the plugin guards via its own _ccRun flag and
// the module-level guard here protects the StrictMode double-effect too).
export const runCookieConsent = async () => {
  await runCookieConsentLib({
    mode: 'opt-in',
    autoShow: true,
    revision: 1,

    // Consent choice is persisted in the plugin's own cookie (cc_cookie),
    // so it survives reloads and navigation without extra state.
    cookie: {
      name: 'cc_cookie',
      expiresAfterDays: 182,
    },

    categories: {
      // readOnly + required: always enabled, cannot be turned off. Auth
      // cookies and the consent cookie itself fall here, so login/CSRF-style
      // behaviour is NEVER gated or blocked by this consent.
      necessary: {
        enabled: true,
        readOnly: true,
      },
      // Opt-in only: not set by default; scripts only load after accept.
      analytics: {
        enabled: false,
      },
    },

    // Fired on every consent action AND on each page load (with prior consent).
    onChange: syncAnalytics,
    onConsent: syncAnalytics,
    onFirstConsent: syncAnalytics,

    language: {
      default: 'en',
      translations: {
        en: {
          consentModal: {
            title: 'We value your privacy',
            description:
              'We use essential cookies to keep you signed in. We also offer ' +
              'optional analytics cookies to help us understand how the site is used. ' +
              'Analytics are turned off unless you choose to enable them.',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            showPreferencesBtn: 'Manage preferences',
            footer: `
              <a href="${COOKIE_POLICY_ROUTE}" target="_blank">Cookie policy</a>
              <a href="/privacy" target="_blank">Privacy policy</a>`,
          },
          preferencesModal: {
            title: 'Cookie preferences',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            savePreferencesBtn: 'Save preferences',
            sections: [
              {
                title: 'Necessary',
                description:
                  'These cookies are required for the site to work and cannot be turned off.',
                linkedCategory: 'necessary',
                cookieTable: {
                  headers: {
                    name: 'Name',
                    purpose: 'Purpose',
                    duration: 'Duration',
                  },
                  body: cookieRegistry
                    .filter((c) => c.category === 'necessary')
                    .map((c) => ({
                      name: c.name,
                      purpose: c.purpose,
                      duration: c.duration,
                    })),
                },
              },
              {
                title: 'Analytics',
                description:
                  'These cookies help us understand how you use the site. ' +
                  'They are off by default and only set if you accept.',
                linkedCategory: 'analytics',
                cookieTable: {
                  headers: {
                    name: 'Name',
                    purpose: 'Purpose',
                    duration: 'Duration',
                  },
                  body: cookieRegistry.filter((c) => c.category === 'analytics'),
                },
              },
            ],
          },
        },
      },
    },
  });

  // On this (re)load: if the visitor already accepted analytics, ensure the
  // scripts load right away (covers a hard refresh where no consent action
  // fires but the plugin cookie says analytics is accepted).
  syncAnalytics();
};

// Open the preferences modal (used by the footer "Cookie settings" link).
export const openCookiePreferences = () => {
  showPreferences();
};