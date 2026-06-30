import api from './api';

const safeJsonParse = (value, fallback = null) => {
  if (value == null || value === '') return fallback;
  if (typeof value === 'object')    return value;
  try {
    return JSON.parse(value);
  } catch {
    console.warn('[resumeService] safeJsonParse failed for value:', value);
    return fallback;
  }
};

/**
 * Convert backend API response → frontend resume object.
 *
 * ROOT CAUSE FIX (personal info lost on dashboard):
 * Previously fromApiResponse only set personalInfo as a nested object.
 * DashboardPage reads resume.fullName / resume.professionalTitle directly, so
 * they were always undefined → cards showed "Untitled Resume" / "No title set".
 * Now we parse personalInfo and also spread its fields to the top level so every
 * consumer (DashboardPage, normaliseResume, builder) sees them without extra work.
 */
export function fromApiResponse(data) {
  const personalInfo = safeJsonParse(data.personalInfo, {});

  return {
    id:             data.id,
    userId:         data.userId,
    title:          data.title    ?? '',
    template:       data.template ?? 'modern',

    // Nested personalInfo object (kept for normaliseResume compatibility)
    personalInfo,

    // Flattened contact fields — available to every caller without normaliseResume
    fullName:          personalInfo.fullName          || '',
    professionalTitle: personalInfo.professionalTitle || personalInfo.title || '',
    email:             personalInfo.email             || '',
    phone:             personalInfo.phone             || '',
    location:          personalInfo.location          || '',
    linkedin:          personalInfo.linkedin          || '',
    github:            personalInfo.github            || '',
    portfolio:         personalInfo.portfolio         || '',

    summary:        data.summary        ?? '',
    experience:     safeJsonParse(data.experience,     []),
    education:      safeJsonParse(data.education,      []),
    skills:         safeJsonParse(data.skills,         []),
    projects:       safeJsonParse(data.projects,       []),
    certifications: safeJsonParse(data.certifications, []),
    achievements:   safeJsonParse(data.achievements,   []),
    languages:      safeJsonParse(data.languages,      []),
    customSections: safeJsonParse(data.customSections, []),
    createdAt:      data.createdAt,
    updatedAt:      data.updatedAt,
  };
}

/**
 * Convert frontend resume state → backend API payload.
 *
 * ROOT CAUSE FIX (all personal info lost on save):
 * The builder stores contact fields at the TOP LEVEL of the resume state object
 * (resume.fullName, resume.email, etc.), NOT inside resume.personalInfo.
 * Previously toApiPayload did `personalInfo: s(resume.personalInfo)` which
 * serialised undefined → null. The backend stored null in the personalInfo column,
 * so on reload fullName/email/phone/etc were always blank.
 *
 * Fix: build a personalInfo object from the individual top-level fields before
 * serialising, so the backend always has the full personal info to return.
 */
export function toApiPayload(resume) {
  const s = (v) => {
    if (v == null) return null;
    if (typeof v === 'string') return v;
    try { return JSON.stringify(v); } catch { return null; }
  };

  const personalInfo = {
    fullName:          resume.fullName          || '',
    professionalTitle: resume.professionalTitle || '',
    email:             resume.email             || '',
    phone:             resume.phone             || '',
    location:          resume.location          || '',
    linkedin:          resume.linkedin          || '',
    github:            resume.github            || '',
    portfolio:         resume.portfolio         || '',
  };

  return {
    // Use fullName as the resume title so the dashboard shows a meaningful name.
    title:          resume.title || resume.fullName || 'Untitled Resume',
    template:       resume.template       ?? 'modern',
    personalInfo:   s(personalInfo),
    summary:        resume.summary        ?? null,
    experience:     s(resume.experience),
    education:      s(resume.education),
    skills:         s(resume.skills),
    projects:       s(resume.projects),
    certifications: s(resume.certifications),
    achievements:   s(resume.achievements),
    languages:      s(resume.languages),
    customSections: s(resume.customSections),
  };
}

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