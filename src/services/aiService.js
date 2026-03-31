import api from './api';

export const improveSummary = async (payload) => {
  const { data } = await api.post('/api/ai/summary', payload);
  return data;
};

export const generateBullets = async (payload) => {
  const { data } = await api.post('/api/ai/bullets', payload);
  return data;
};

export const suggestSkills = async (payload) => {
  const { data } = await api.post('/api/ai/skills', payload);
  return data;
};

export const rewriteProfessionally = async (payload) => {
  const { data } = await api.post('/api/ai/rewrite', payload);
  return data;
};
