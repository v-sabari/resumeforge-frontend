import { useEffect } from 'react';
import 'vanilla-cookieconsent/dist/cookieconsent.css';
import { runCookieConsent } from '../cookieconsent-config';

// StrictMode safety: in development (and in React StrictMode generally) the
// effect body runs twice, which would call CookieConsent.run() twice and
// mount two banners/consent cookies. A module-level flag guards against this.
let consentStarted = false;

/**
 * Renders nothing itself; it boots the vanilla-cookieconsent banner once at
 * app start. The plugin injects its own consent/preferences modals into the
 * DOM, so this component is purely a lifecycle hook rendered at the top of
 * the app.
 */
export const CookieConsentBanner = () => {
  useEffect(() => {
    if (consentStarted) return;
    consentStarted = true;
    runCookieConsent().catch((err) => {
      // Never let a consent-banner failure take down the app.
      if (import.meta.env?.DEV) console.warn('CookieConsent init failed:', err);
    });
  }, []);

  return null;
};