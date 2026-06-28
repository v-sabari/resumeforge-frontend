import api from './api';

export const getPremiumStatus = async () => {
  const { data } = await api.get('/api/premium/status');
  return data;
};

export const activatePremium = async (paymentId) => {
  const { data } = await api.post('/api/premium/activate', { paymentId });
  return data;
};
