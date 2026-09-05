import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { GSI_SCRIPT_SRC } from './components/common/GoogleSignInButton.jsx';

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Pre-warm the Google Identity Services script during idle time so that by the
// time the user reaches the login/register pages the client is already loaded
// and the button renders on first paint — no late "button appears" moment that
// the auth card then shuffles around. Only runs when a client id is configured.
if (import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  const warmGsi = () => {
    if (window.google?.accounts?.id || document.querySelector(`script[src="${GSI_SCRIPT_SRC}"]`)) {
      return;
    }
    const script = document.createElement('script');
    script.src = GSI_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  };
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(warmGsi);
  } else {
    window.setTimeout(warmGsi, 1500);
  }
}