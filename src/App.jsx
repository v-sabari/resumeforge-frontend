import { BrowserRouter, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { initAnalytics } from './utils/analytics';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA4_ID;

function PageTracking() {
  const location = useLocation();

  useEffect(() => {
    // initAnalytics() (see utils/analytics.js) lazily loads the gtag.js
    // script when VITE_GA4_ID is set. This effect fires for every route
    // change, so guard against double-initialization inside initAnalytics.
    initAnalytics();

    if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return;

    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [location]);

  return null;
}

const App = () => (
  <BrowserRouter>
    {/* Cookie consent banner (vanilla-cookieconsent). Mounted here, outside
        the routed pages, so it initializes once and persists across all pages. */}
    <CookieConsentBanner />
    <AuthProvider>
      <PageTracking />
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;