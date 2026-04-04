import api from './api';

export const checkExportAccess = async () => {
  const { data } = await api.post('/api/export/check-access');
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

// BUG FIX: resumeId is now correctly passed to download endpoint.
// Original code called the correct URL but ExportPanel sometimes passed null resumeId.
export const downloadResumePdf = async (resumeId) => {
  if (!resumeId) throw new Error('Resume must be saved before downloading.');

  const response = await api.get(`/api/export/download/${resumeId}`, {
    responseType: 'blob',
  });

  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url  = window.URL.createObjectURL(blob);

  const contentDisposition = response.headers['content-disposition'];
  let filename = 'resume.pdf';
  if (contentDisposition) {
    const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (match?.[1]) filename = match[1].replace(/['"]/g, '');
  }

  const link = document.createElement('a');
  link.href     = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
