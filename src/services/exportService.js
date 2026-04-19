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

/**
 * Returns the user's export history.
 * Each entry: { id, exportCount, adCompleted, createdAt }
 */
export const getExportHistory = async () => {
  const { data } = await api.get('/api/export/history');
  return data;
};

/** Download resume as PDF. Triggers browser file download. */
export const downloadResumePdf = async (resumeId) => {
  if (!resumeId) throw new Error('Resume must be saved before downloading.');
  const r = await api.get(`/api/export/download/${resumeId}`, { responseType: 'blob' });
  triggerDownload(r, 'resume.pdf', 'application/pdf');
};

/** Download resume as DOCX. ATS-safe single-column layout. */
export const downloadResumeDocx = async (resumeId) => {
  if (!resumeId) throw new Error('Resume must be saved before downloading.');
  const r = await api.get(`/api/export/download/${resumeId}/docx`, { responseType: 'blob' });
  triggerDownload(r, 'resume.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
};

/**
 * Download resume as plain text (.txt).
 * Best for pasting into ATS portals or LinkedIn.
 */
export const downloadResumeTxt = async (resumeId) => {
  if (!resumeId) throw new Error('Resume must be saved before downloading.');
  const r = await api.get(`/api/export/download/${resumeId}/txt`, { responseType: 'blob' });
  triggerDownload(r, 'resume.txt', 'text/plain');
};

function triggerDownload(response, defaultFilename, mimeType) {
  const blob = new Blob([response.data], { type: mimeType });
  const url  = window.URL.createObjectURL(blob);
  const cd   = response.headers['content-disposition'];
  let filename = defaultFilename;
  if (cd) {
    const m = cd.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (m?.[1]) filename = m[1].replace(/['"]/g, '');
  }
  const link = document.createElement('a');
  link.href = url; link.download = filename;
  document.body.appendChild(link); link.click();
  link.remove(); window.URL.revokeObjectURL(url);
}
