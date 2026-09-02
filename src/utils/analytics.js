// Loads the Google Analytics 4 and AdSense scripts only when the matching
// env var is set. Without this, window.gtag / window.adsbygoogle were
// referenced all over the app but never loaded, so GA tracking and ad
// rendering silently did nothing.
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA4_ID;
const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT;

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
  if (typeof window === 'undefined') return;

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
