import axios from 'axios';

// COOKIE FIX: previously called the Render backend directly
// (https://resumeforge-backend-9uj6.onrender.com) from the browser. Since
// that's a different registrable domain from the frontend, the auth cookie
// was a third-party cookie — browsers/users with third-party cookie
// blocking enabled (Safari by default, Firefox strict mode, or anyone who's
// turned it on in Chrome) rejected it outright and prompted to disable that
// protection just to use the site, which isn't an acceptable ask for a
// production app.
//
// Fix: call a same-origin path instead. vercel.json rewrites /api/:path* to
// the Render backend server-side (edge-to-origin, not subject to CORS or
// third-party cookie rules at all). The browser only ever sees requests to
// its own origin, so any Set-Cookie the backend returns arrives without an
// explicit Domain attribute and is scoped by the browser to the site it
// actually thinks it talked to — the frontend's own origin. That makes it a
// normal first-party cookie, and the prompt goes away entirely.
//
// If VITE_API_BASE_URL is set in your Vercel project's environment
// variables, remove it (or leave it unset) — this relative path only works
// if requests stay same-origin and get proxied through vercel.json. Left
// empty (not '/api') because every call site already includes the '/api/'
// prefix in its path, e.g. api.post('/api/auth/login', ...) — baseURL
// '/api' would double it up into '/api/api/auth/login'.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Session-probe note: AuthContext calls /api/auth/me on every mount. That
    // endpoint now returns 200 with an all-null body for anonymous visitors
    // (so public pages don't log console 401s), meaning this redirect only
    // fires when a genuinely protected endpoint 401s while the user is inside
    // the /app area — e.g. an expired session mid-use.
    if (error.response?.status === 401 && window.location.pathname.startsWith('/app')) {
      // Remember where the user was heading so /login can bounce them back
      // after they sign in (LoginPage reads this via sessionStorage).
      try {
        sessionStorage.setItem('auth_redirect', window.location.pathname + window.location.search);
      } catch { /* sessionStorage unavailable — proceed without */ }
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;