import api from './api';

export const startAd = async (payload = {}) => {
  const { data } = await api.post('/api/ads/start', payload);
  return data;
};

export const completeAd = async (payload = {}) => {
  const { data } = await api.post('/api/ads/complete', payload);
  return data;
};

export const failAd = async (payload = {}) => {
  const { data } = await api.post('/api/ads/fail', payload);
  return data;
};