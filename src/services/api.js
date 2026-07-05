import axios from 'axios';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || '').trim() ||
  'https://resumeforge-backend-9uj6.onrender.com';

// BUG-004 FIX: the JWT is now delivered as an httpOnly cookie set by the
// backend (see AuthController.setAuthCookie) instead of being stored in
// localStorage and attached manually here. `withCredentials: true` makes
// the browser send/receive that cookie on every cross-origin request to
// the API. There is nothing left for JS to read or attach — the browser
// handles it, and it's not reachable from JS even if a future XSS occurred.
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
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      if (
        !path.startsWith('/login') &&
        !path.startsWith('/register') &&
        !path.startsWith('/verify-email')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;