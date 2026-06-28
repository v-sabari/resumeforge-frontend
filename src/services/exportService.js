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

export const getExportHistory = async () => {
  const { data } = await api.get('/api/export/history');
  return data;
};

/** Download resume as PDF. Triggers browser file download. */
export const downloadResumePdf = async (resumeId) => {
  if (!resumeId) throw new Error('Resume must be saved before downloading.');
  const r = await blobRequest(`/api/export/download/${resumeId}`);
  triggerDownload(r, 'resume.pdf', 'application/pdf');
};

/** Download resume as DOCX. */
export const downloadResumeDocx = async (resumeId) => {
  if (!resumeId) throw new Error('Resume must be saved before downloading.');
  const r = await blobRequest(`/api/export/download/${resumeId}/docx`);
  triggerDownload(
    r,
    'resume.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  );
};

/** Download resume as plain text. */
export const downloadResumeTxt = async (resumeId) => {
  if (!resumeId) throw new Error('Resume must be saved before downloading.');
  const r = await blobRequest(`/api/export/download/${resumeId}/txt`);
  triggerDownload(r, 'resume.txt', 'text/plain');
};

/**
 * FIX-FRONTEND-1: Blob error parsing.
 *
 * When the backend returns an error (4xx / 5xx) and Axios is configured with
 * responseType:'blob', the error body is delivered as a Blob instead of a
 * parsed object.  Calling error.response.data.message on a Blob always returns
 * undefined, so formatApiError() falls back to the generic message and the
 * real server error is lost.
 *
 * This wrapper:
 *   1. Makes the GET request with responseType:'blob'.
 *   2. On success, returns the response as-is.
 *   3. On error, reads the Blob as text, attempts JSON.parse, and rethrows
 *      a plain Error whose .message is the server's message string.
 *      ExportPanel's formatApiError() then displays it correctly.
 */
async function blobRequest(url) {
  try {
    return await api.get(url, { responseType: 'blob' });
  } catch (error) {
    // Only attempt blob-to-JSON conversion when the response body is a Blob
    if (error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const json = JSON.parse(text);
        // json.message is the ApiResponse.message field from GlobalExceptionHandler
        const msg = json?.message || json?.error || `Server error ${error.response.status}`;
        throw new Error(msg);
      } catch (parseError) {
        // If Blob text is not JSON (e.g. an HTML error page from a proxy),
        // fall through and throw the HTTP status as the message.
        if (parseError instanceof SyntaxError) {
          throw new Error(`Export failed (HTTP ${error.response.status}). Please try again.`);
        }
        // parseError is the Error we threw above — rethrow it directly
        throw parseError;
      }
    }
    // Non-blob error (network timeout, CORS, etc.) — rethrow as-is
    throw error;
  }
}

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
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}