import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { initAnalytics, ANALYTICS_CONSENT_KEY } from '../../utils/analytics';

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(ANALYTICS_CONSENT_KEY);
    if (!consent) {
      // Delay slightly so it doesn't flash on first paint
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, 'accepted');
    // Start optional analytics only once the visitor has opted in.
    initAnalytics();
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-full max-w-[calc(100%-1rem)] -translate-x-1/2 px-2 sm:max-w-3xl sm:px-0">
      <div className="mx-auto max-w-3xl card shadow-lift-lg p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-up">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink-950 mb-0.5">We use cookies</p>
          <p className="text-xs text-ink-400 leading-relaxed">
            We use essential cookies to keep you signed in. Analytics are off by default and only
            run if you accept.{' '}
            <Link to="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={decline} className="btn-secondary btn-sm">Decline</button>
          <button onClick={accept}  className="btn-primary  btn-sm">Accept</button>
        </div>
      </div>
    </div>
  );
};
