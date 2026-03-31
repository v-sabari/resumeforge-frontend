import api from './api';

export const createPayment = async (payload = {}) => {
  const { data } = await api.post('/api/payments/create', payload);
  return data;
};

export const verifyPayment = async (payload = {}) => {
  const { data } = await api.post('/api/payments/verify', payload);
  return data;
};

export const getPaymentHistory = async () => {
  const { data } = await api.get('/api/payments/history');
  return data;
};
