// Loads the Google Analytics 4 and AdSense scripts ONLY after the visitor has
// explicitly opted in via the cookie-consent banner (see cookieconsent-config).
// Before that, no analytics or advertising script is loaded and no tracking
// cookie is set. This keeps the site's consent promise (Privacy Policy §6)
// truthful: measurement starts only on opt-in and stops if the visitor clears
// site data or declines. Without this gate, window.gtag / window.adsbygoogle
// were referenced and could load regardless of consent.
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA4_ID;
const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT;

export const analyticsConsentKey = 'rf_cookie_consent';

const consentGranted = () => {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(analyticsConsentKey) === 'accepted';
};

const loadScript = (src) => {
  if (typeof document === 'undefined') return;
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

export const initAnalytics = () => {
  if (typeof window === 'undefined' || !consentGranted()) return;

  if (GA_MEASUREMENT_ID && !window.dataLayer) {
    window.dataLayer = window.dataLayer || [];
    const gtag = function () { window.dataLayer.push(arguments); };
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`);
  }

  if (ADSENSE_CLIENT) {
    loadScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
  }
};