import api from './api';

const numericIdOnly = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && /^\d+$/.test(value.trim())) return Number(value.trim());
  return undefined;
};

const cleanStringArray = (value) =>
  Array.isArray(value)
    ? value.map((item) => String(item || '').trim()).filter(Boolean)
    : [];

const toApiPayload = (resume) => ({
  fullName: resume.fullName || '',
  role: resume.professionalTitle || resume.role || '',
  email: resume.email || '',
  phone: resume.phone || '',
  location: resume.location || '',
  linkedin: resume.linkedin || '',
  github: resume.github || '',
  portfolio: resume.portfolio || '',
  summary: resume.summary || '',
  skills: cleanStringArray(resume.skills),
  achievements: cleanStringArray(resume.achievements),

  certifications: Array.isArray(resume.certifications)
    ? resume.certifications
        .map((c) => {
          if (typeof c === 'string') return c.trim();
          return String(c?.name || '').trim();
        })
        .filter(Boolean)
    : [],

  experiences: Array.isArray(resume.experience)
    ? resume.experience.map((e) => {
        const id = numericIdOnly(e.id);
        return {
          ...(id !== undefined ? { id } : {}),
          company: e.company || '',
          role: e.role || '',
          location: e.location || '',
          startDate: e.startDate || '',
          endDate: e.isCurrent ? 'Present' : (e.endDate || ''),
          bullets: cleanStringArray(e.bullets),
        };
      })
    : [],

  education: Array.isArray(resume.education)
    ? resume.education.map((e) => {
        const id = numericIdOnly(e.id);
        return {
          ...(id !== undefined ? { id } : {}),
          institution: e.institution || '',
          degree: e.degree || '',
          field: e.field || '',
          startDate: e.startDate || '',
          endDate: e.endDate || '',
        };
      })
    : [],

  projects: Array.isArray(resume.projects)
    ? resume.projects.map((p) => {
        const id = numericIdOnly(p.id);
        return {
          ...(id !== undefined ? { id } : {}),
          name: p.name || '',
          link: p.link || '',
          description: p.description || '',
        };
      })
    : [],
});

export const getAllResumes = async () => {
  const { data } = await api.get('/api/resumes');
  return data;
};

export const getResumeById = async (id) => {
  const { data } = await api.get(`/api/resumes/${id}`);
  return data;
};

export const createResume = async (resume) => {
  const { data } = await api.post('/api/resumes', toApiPayload(resume));
  return data;
};

export const updateResume = async (id, resume) => {
  const { data } = await api.put(`/api/resumes/${id}`, toApiPayload(resume));
  return data;
};

export const deleteResume = async (id) => {
  await api.delete(`/api/resumes/${id}`);
};

export const getResumeHistory = async (id) => {
  const { data } = await api.get(`/api/resumes/${id}/history`);
  return data;
};

export const restoreResumeSnapshot = async (id, snapshotId) => {
  const { data } = await api.post(`/api/resumes/${id}/history/${snapshotId}/restore`);
  return data;
};