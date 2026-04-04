import api from './api';

export const generateSummary = async (payload) => {
  const { data } = await api.post('/api/ai/summary', payload);
  return data; // { text: "..." }
};

export const generateBullets = async (payload) => {
  const { data } = await api.post('/api/ai/bullets', payload);
  return data; // { items: [...] }
};

export const suggestSkills = async (payload) => {
  const { data } = await api.post('/api/ai/skills', payload);
  return data; // { items: [...] }
};

export const rewriteText = async (payload) => {
  const { data } = await api.post('/api/ai/rewrite', payload);
  return data; // { text: "..." }
};
