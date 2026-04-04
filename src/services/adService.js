import api from './api';

export const startAd    = async () => { const { data } = await api.post('/api/ads/start');    return data; };
export const completeAd = async () => { const { data } = await api.post('/api/ads/complete'); return data; };
export const failAd     = async () => { const { data } = await api.post('/api/ads/fail');     return data; };
