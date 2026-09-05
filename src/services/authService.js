import api from './api';

export const registerUser = async (payload) => {
  const { data } = await api.post('/api/auth/register', payload);
  return data;
};

export const verifyEmailOtp = async (payload) => {
  const { data } = await api.post('/api/auth/verify-email-otp', payload);
  return data;
};

export const resendEmailOtp = async (payload) => {
  const { data } = await api.post('/api/auth/resend-email-otp', payload);
  return data;
};

export const forgotPassword = async (payload) => {
  const { data } = await api.post('/api/auth/forgot-password', payload);
  return data;
};

export const resetPassword = async (payload) => {
  const { data } = await api.post('/api/auth/reset-password', payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post('/api/auth/login', payload);
  return data;
};

// GOOGLE SIGN-IN: one endpoint serves both login and registration — the raw
// credential (ID token) from the Google button. The backend creates the
// account when it doesn't exist yet and returns isNewUser so the UI can branch.
export const googleLogin = async (payload) => {
  const { data } = await api.post('/api/auth/google', payload);
  return data;
};

// BUG-004 FIX: httpOnly cookies can't be cleared by client-side JS, so
// logout has to call the backend, which clears it via Set-Cookie (maxAge=0).
export const logoutUser = async () => {
  const { data } = await api.post('/api/auth/logout');
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get('/api/auth/me');
  return data;
};