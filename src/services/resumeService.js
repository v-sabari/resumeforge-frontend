import api from './api';

const isNumberId = (value) => typeof value === 'number' && Number.isFinite(value);

const normalizeString = (value) => {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  return String(value);
};

const normalizeArray = (value) => Array.isArray(value) ? value : [];

const toBackendCertification = (item) => {
  if (typeof item === 'string') {
    return item.trim();
  }

  if (!item || typeof item !== 'object') {
    return '';
  }

  const parts = [
    normalizeString(item.name).trim(),
    normalizeString(item.issuer).trim(),
    normalizeString(item.year).trim(),
  ].filter(Boolean);

  return parts.join(' | ');
};

const fromBackendCertification = (item, index) => {
  if (typeof item !== 'string') {
    return {
      id: `cert-${index + 1}`,
      name: '',
      issuer: '',
      year: '',
    };
  }

  const parts = item.split('|').map((part) => part.trim());

  return {
    id: `cert-${index + 1}`,
    name: parts[0] || item,
    issuer: parts[1] || '',
    year: parts[2] || '',
  };
};

const toBackendResumePayload = (resume) => ({
  id: isNumberId(resume?.id) ? resume.id : null,
  fullName: normalizeString(resume?.fullName),
  role: normalizeString(resume?.professionalTitle),
  email: normalizeString(resume?.email),
  phone: normalizeString(resume?.phone),
  location: normalizeString(resume?.location),
  linkedin: normalizeString(resume?.linkedin),
  github: normalizeString(resume?.github),
  portfolio: normalizeString(resume?.portfolio),
  summary: normalizeString(resume?.summary),
  skills: normalizeArray(resume?.skills)
    .map((skill) => normalizeString(skill))
    .filter(Boolean),

  experiences: normalizeArray(resume?.experience).map((item) => ({
    id: isNumberId(item?.id) ? item.id : null,
    company: normalizeString(item?.company),
    role: normalizeString(item?.role),
    location: normalizeString(item?.location),
    startDate: normalizeString(item?.startDate),
    endDate: normalizeString(item?.endDate),
    bullets: normalizeArray(item?.bullets)
      .map((bullet) => normalizeString(bullet))
      .filter(Boolean),
  })),

  education: normalizeArray(resume?.education).map((item) => ({
    id: isNumberId(item?.id) ? item.id : null,
    institution: normalizeString(item?.institution),
    degree: normalizeString(item?.degree),
    field: normalizeString(item?.location || item?.field),
    startDate: normalizeString(item?.startDate),
    endDate: normalizeString(item?.endDate),
  })),

  projects: normalizeArray(resume?.projects).map((item) => ({
    id: isNumberId(item?.id) ? item.id : null,
    name: normalizeString(item?.name),
    link: normalizeString(item?.link),
    description: normalizeString(item?.description),
  })),

  certifications: normalizeArray(resume?.certifications)
    .map(toBackendCertification)
    .filter(Boolean),

  achievements: normalizeArray(resume?.achievements)
    .map((item) => normalizeString(item))
    .filter(Boolean),
});

const fromBackendResume = (resume) => ({
  id: resume?.id ?? null,
  fullName: resume?.fullName ?? '',
  professionalTitle: resume?.role ?? '',
  email: resume?.email ?? '',
  phone: resume?.phone ?? '',
  location: resume?.location ?? '',
  linkedin: resume?.linkedin ?? '',
  github: resume?.github ?? '',
  portfolio: resume?.portfolio ?? '',
  summary: resume?.summary ?? '',
  skills: Array.isArray(resume?.skills) ? resume.skills : [],

  experience: Array.isArray(resume?.experiences)
    ? resume.experiences.map((item, index) => ({
        id: item?.id ?? `exp-${index + 1}`,
        company: item?.company ?? '',
        role: item?.role ?? '',
        location: item?.location ?? '',
        startDate: item?.startDate ?? '',
        endDate: item?.endDate ?? '',
        bullets: Array.isArray(item?.bullets) ? item.bullets : [],
      }))
    : [],

  education: Array.isArray(resume?.education)
    ? resume.education.map((item, index) => ({
        id: item?.id ?? `edu-${index + 1}`,
        institution: item?.institution ?? '',
        degree: item?.degree ?? '',
        field: item?.field ?? '',
        location: item?.field ?? '',
        startDate: item?.startDate ?? '',
        endDate: item?.endDate ?? '',
      }))
    : [],

  projects: Array.isArray(resume?.projects)
    ? resume.projects.map((item, index) => ({
        id: item?.id ?? `proj-${index + 1}`,
        name: item?.name ?? '',
        link: item?.link ?? '',
        description: item?.description ?? '',
      }))
    : [],

  certifications: Array.isArray(resume?.certifications)
    ? resume.certifications.map(fromBackendCertification)
    : [],

  achievements: Array.isArray(resume?.achievements) ? resume.achievements : [],
  createdAt: resume?.createdAt ?? null,
  updatedAt: resume?.updatedAt ?? null,
});

export const getResumes = async () => {
  const { data } = await api.get('/api/resumes');
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.resumes)
      ? data.resumes
      : Array.isArray(data?.data)
        ? data.data
        : [];

  return list.map(fromBackendResume);
};

export const createResume = async (payload) => {
  const requestBody = toBackendResumePayload(payload);
  const { data } = await api.post('/api/resumes', requestBody);
  return fromBackendResume(data);
};

export const getResumeById = async (id) => {
  const { data } = await api.get(`/api/resumes/${id}`);
  return fromBackendResume(data);
};

export const updateResume = async (id, payload) => {
  const requestBody = toBackendResumePayload(payload);
  const { data } = await api.put(`/api/resumes/${id}`, requestBody);
  return fromBackendResume(data);
};

export const deleteResume = async (id) => {
  const { data } = await api.delete(`/api/resumes/${id}`);
  return data;
};