import api from './api';

/**
 * Convert frontend resume → backend payload
 */
const toApiPayload = (resume) => {
  return {
    title: resume.fullName || 'Untitled Resume',
    template: resume.template || 'modern',

    personalInfo: JSON.stringify({
      fullName: resume.fullName || '',
      role: resume.professionalTitle || '',
      email: resume.email || '',
      phone: resume.phone || '',
      location: resume.location || '',
      linkedin: resume.linkedin || '',
      github: resume.github || '',
      portfolio: resume.portfolio || '',
    }),

    summary: resume.summary || '',

    experience: JSON.stringify(resume.experience || []),
    education: JSON.stringify(resume.education || []),
    skills: JSON.stringify(resume.skills || []),
    projects: JSON.stringify(resume.projects || []),
    certifications: JSON.stringify(resume.certifications || []),
    customSections: JSON.stringify({
      achievements: resume.achievements || [],
    }),
  };
};

/**
 * Convert backend → frontend usable format
 */
const fromApiResponse = (data) => {
  const safeParse = (value, fallback) => {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  const personal = safeParse(data.personalInfo, {});

  return {
    id: data.id,
    template: data.template || 'modern',

    fullName: personal.fullName || '',
    professionalTitle: personal.role || '',
    email: personal.email || '',
    phone: personal.phone || '',
    location: personal.location || '',
    linkedin: personal.linkedin || '',
    github: personal.github || '',
    portfolio: personal.portfolio || '',

    summary: data.summary || '',

    experience: safeParse(data.experience, []),
    education: safeParse(data.education, []),
    skills: safeParse(data.skills, []),
    projects: safeParse(data.projects, []),
    certifications: safeParse(data.certifications, []),

    achievements: safeParse(data.customSections, {}).achievements || [],
  };
};

export const createResume = async (resume) => {
  const { data } = await api.post('/api/resumes', toApiPayload(resume));
  return fromApiResponse(data);
};

export const updateResume = async (id, resume) => {
  const { data } = await api.put(`/api/resumes/${id}`, toApiPayload(resume));
  return fromApiResponse(data);
};

export const getResumeById = async (id) => {
  const { data } = await api.get(`/api/resumes/${id}`);
  return fromApiResponse(data);
};

export const getAllResumes = async () => {
  const { data } = await api.get('/api/resumes');
  return data.map(fromApiResponse);
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
  return fromApiResponse(data);
};