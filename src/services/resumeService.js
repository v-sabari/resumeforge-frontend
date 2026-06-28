import api from './api';

/**
 * Convert frontend resume → backend payload
 */
const safeJsonParse = (value, fallback = null) => {
    if (value == null || value === '') return fallback;
    if (typeof value === 'object')    return value;  // already an object/array
    try {
        return JSON.parse(value);
    } catch {
        console.warn('[resumeService] safeJsonParse failed for value:', value);
        return fallback;
    }
};
 
export function fromApiResponse(data) {
    return {
        id:             data.id,
        userId:         data.userId,
        title:          data.title          ?? '',
        template:       data.template       ?? 'modern',
        personalInfo:   safeJsonParse(data.personalInfo,   {}),
        summary:        data.summary        ?? '',
        experience:     safeJsonParse(data.experience,     []),
        education:      safeJsonParse(data.education,      []),
        skills:         safeJsonParse(data.skills,         []),
        projects:       safeJsonParse(data.projects,       []),
        certifications: safeJsonParse(data.certifications, []),
        achievements:   safeJsonParse(data.achievements,   []),  // ISSUE-10
        languages:      safeJsonParse(data.languages,      []),  // ISSUE-10
        customSections: safeJsonParse(data.customSections, []),
        createdAt:      data.createdAt,
        updatedAt:      data.updatedAt,
    };
}
 
export function toApiPayload(resume) {
    const s = (v) => {
        if (v == null) return null;
        if (typeof v === 'string') return v;
        try { return JSON.stringify(v); } catch { return null; }
    };
    return {
        title:          resume.title          ?? 'Untitled Resume',
        template:       resume.template       ?? 'modern',
        personalInfo:   s(resume.personalInfo),
        summary:        resume.summary        ?? null,
        experience:     s(resume.experience),
        education:      s(resume.education),
        skills:         s(resume.skills),
        projects:       s(resume.projects),
        certifications: s(resume.certifications),
        achievements:   s(resume.achievements),   // ISSUE-10
        languages:      s(resume.languages),      // ISSUE-10
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