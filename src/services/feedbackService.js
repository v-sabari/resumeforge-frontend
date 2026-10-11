import api from './api';

/**
 * Submit feedback (bug / feature / general).
 * Payload: { type, rating, title, details, pageUrl, userAgent, userEmail, userName, website }
 * (website is the honeypot field — always send it empty).
 */
export const submitFeedback = async (payload) => {
  const { data } = await api.post('/api/feedback', payload);
  return data;
};

/**
 * Public listing of general feedback only, newest first.
 * Backend wraps the page in { success, message, data: { content, ... } }.
 */
export const getPublicFeedback = async ({ page = 0, size = 6 } = {}) => {
  const { data } = await api.get('/api/feedback/public', { params: { page, size } });
  return data;
};
