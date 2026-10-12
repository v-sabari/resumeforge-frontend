import api from './api';

// Free, anonymous ATS tools (backend: PublicToolsController under
// /api/public/tools). Both endpoints accept multipart/form-data; axios detects
// the FormData body and sets the correct multipart boundary automatically, so we
// leave Content-Type unset for these calls.

// JD-Based ATS Score Checker + Missing Keywords.
// POST /api/public/tools/ats-score  →  ApiResponse.data = AtsScoreResponse
export const checkAtsScore = async (file, jobDescription) => {
  const form = new FormData();
  form.append('file', file);
  if (jobDescription && jobDescription.trim()) {
    form.append('jobDescription', jobDescription);
  }
  const { data } = await api.post('/api/public/tools/ats-score', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// ATS Format & Parsing Checker.
// POST /api/public/tools/format-check  →  ApiResponse.data = FormatCheckResponse
export const checkFormat = async (file) => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post('/api/public/tools/format-check', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const toolsService = { checkAtsScore, checkFormat };

export default toolsService;
