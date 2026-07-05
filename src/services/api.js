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
    // REGRESSION FIX: AuthContext now calls getCurrentUser() unconditionally
    // on every mount (there's no client-readable token left to gate on with
    // httpOnly cookies) — so an anonymous visitor on the homepage, pricing
    // page, etc. now legitimately gets a 401 back from /api/auth/me. That's
    // normal and expected, not an error. This redirect previously only
    // excluded /login, /register, /verify-email, so every other public page
    // (including the homepage) was forcing anonymous visitors to /login.
    // The redirect should only fire for the actual protected app area.
    if (error.response?.status === 401 && window.location.pathname.startsWith('/app')) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;