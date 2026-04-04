import api from './api';

export const createPayment = async (amount) => {
  const { data } = await api.post('/api/payments/create', amount ? { amount } : {});
  return data;
};

export const verifyPayment = async (paymentId, status = 'VERIFIED') => {
  const { data } = await api.post('/api/payments/verify', { paymentId, status });
  return data;
};

export const getPaymentHistory = async () => {
  const { data } = await api.get('/api/payments/history');
  return data;
};
