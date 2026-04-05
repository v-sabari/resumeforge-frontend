import axios from 'axios';
import { TOKEN_STORAGE_KEY } from '../utils/constants';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim();

console.log('VITE_API_BASE_URL runtime =', API_BASE_URL);

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is missing. Set it in .env and Vercel Environment Variables.');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      if (
        !window.location.pathname.startsWith('/login') &&
        !window.location.pathname.startsWith('/register')
      ) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;