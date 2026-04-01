import api from './api';

export const checkExportAccess = async (payload = {}) => {
  const { data } = await api.post('/api/export/check-access', payload);
  return data;
};

export const recordExport = async (payload = {}) => {
  const { data } = await api.post('/api/export/record', payload);
  return data;
};

export const getExportStatus = async () => {
  const { data } = await api.get('/api/export/status');
  return data;
};