import api from './api';

const safeJsonParse = (value, fallback = null) => {
  if (value == null || value === '') return fallback;
  if (typeof value === 'object')    return value;
  try { return JSON.parse(value); } catch { return fallback; }
};

export function fromApiResponse(data) {
  const personalInfo = safeJsonParse(data.personalInfo, {});
  return {
    id: data.id, userId: data.userId,
    title: data.title ?? '', template: data.template ?? 'modern',
    personalInfo,
    fullName:          personalInfo.fullName          || '',
    professionalTitle: personalInfo.professionalTitle || personalInfo.title || '',
    email:    personalInfo.email    || '',
    phone:    personalInfo.phone    || '',
    location: personalInfo.location || '',
    linkedin: personalInfo.linkedin || '',
    github:   personalInfo.github   || '',
    portfolio:personalInfo.portfolio|| '',
    summary:        data.summary        ?? '',
    experience:     safeJsonParse(data.experience,     []),
    education:      safeJsonParse(data.education,      []),
    skills:         safeJsonParse(data.skills,         []),
    projects:       safeJsonParse(data.projects,       []),
    certifications: safeJsonParse(data.certifications, []),
    achievements:   safeJsonParse(data.achievements,   []),
    languages:      safeJsonParse(data.languages,      []),
    customSections: safeJsonParse(data.customSections, {}),
    sectionsConfig: safeJsonParse(data.sectionsConfig, null),
    createdAt: data.createdAt, updatedAt: data.updatedAt,
  };
}

export function toApiPayload(resume) {
  const s = (v) => { if (v==null) return null; if (typeof v==='string') return v; try{return JSON.stringify(v);}catch{return null;} };
  const personalInfo = {
    fullName: resume.fullName||'', professionalTitle: resume.professionalTitle||'',
    email: resume.email||'', phone: resume.phone||'', location: resume.location||'',
    linkedin: resume.linkedin||'', github: resume.github||'', portfolio: resume.portfolio||'',
  };
  return {
    title:          resume.title || resume.fullName || 'Untitled Resume',
    template:       resume.template ?? 'modern',
    personalInfo:   s(personalInfo),
    summary:        resume.summary ?? null,
    experience:     s(resume.experience),
    education:      s(resume.education),
    skills:         s(resume.skills),
    projects:       s(resume.projects),
    certifications: s(resume.certifications),
    achievements:   s(resume.achievements),
    languages:      s(resume.languages),
    customSections: s(resume.customSections),
    sectionsConfig: s(resume.sectionsConfig),
  };
}

export const createResume    = async (r)     => { const {data} = await api.post('/api/resumes', toApiPayload(r)); return fromApiResponse(data); };
export const updateResume    = async (id, r) => { const {data} = await api.put(`/api/resumes/${id}`, toApiPayload(r)); return fromApiResponse(data); };
export const getResumeById   = async (id)    => { const {data} = await api.get(`/api/resumes/${id}`); return fromApiResponse(data); };
export const getAllResumes    = async ()      => { const {data} = await api.get('/api/resumes'); return data.map(fromApiResponse); };
export const deleteResume    = async (id)    => api.delete(`/api/resumes/${id}`);
export const getResumeHistory= async (id)    => { const {data} = await api.get(`/api/resumes/${id}/history`); return data; };
export const restoreResumeSnapshot = async (id, sid) => { const {data} = await api.post(`/api/resumes/${id}/history/${sid}/restore`); return fromApiResponse(data); };
