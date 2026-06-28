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

export const getCurrentUser = async () => {
  const { data } = await api.get('/api/auth/me');
  return data;
};