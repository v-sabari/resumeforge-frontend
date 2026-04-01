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

export const downloadResumePdf = async (resumeId) => {
  const response = await api.get(`/api/export/download/${resumeId}`, {
    responseType: 'blob',
  });

  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);

  const contentDisposition = response.headers['content-disposition'];
  let filename = 'resume.pdf';

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match?.[1]) {
      filename = match[1];
    }
  }

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};