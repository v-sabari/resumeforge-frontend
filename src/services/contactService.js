import api from './api';

export const sendContactMessage = async (payload) => {
  const { data } = await api.post('/api/contact', payload);
  return data;
};