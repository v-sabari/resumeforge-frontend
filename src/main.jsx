import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// F1 FIX: react-snap pre-renders pages to static HTML using a headless browser
// at build time. On first load, if the page was pre-rendered, we hydrate the
// existing HTML (hydrateRoot) instead of replacing it (createRoot).
// This preserves the pre-rendered content for crawlers while keeping full
// React interactivity for users.
const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
  // Page was pre-rendered by react-snap — hydrate instead of replacing
  hydrateRoot(
    rootElement,
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  // Normal CSR — no pre-rendered content (e.g. /app/dashboard)
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}