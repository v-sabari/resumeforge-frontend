import api from './api';

export const getPremiumStatus = async () => {
  const { data } = await api.get('/api/premium/status');
  return data;
};

export const activatePremium = async (payload = {}) => {
  const { data } = await api.post('/api/premium/activate', payload);
  return data;
};
