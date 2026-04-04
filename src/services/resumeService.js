import api from './api';

// Map internal frontend shape → API payload expected by backend
const toApiPayload = (resume) => ({
  fullName:       resume.fullName        || '',
  role:           resume.professionalTitle || resume.role || '',
  email:          resume.email           || '',
  phone:          resume.phone           || '',
  location:       resume.location        || '',
  linkedin:       resume.linkedin        || '',
  github:         resume.github          || '',
  portfolio:      resume.portfolio       || '',
  summary:        resume.summary         || '',
  skills:         Array.isArray(resume.skills)   ? resume.skills   : [],
  achievements:   Array.isArray(resume.achievements) ? resume.achievements : [],
  // BUG FIX: certifications sent as array of {name,issuer,year} objects
  // Backend JsonUtil.toJson() serialises them; toStringList() deserialises.
  // We send cert names as strings so backend round-trips correctly.
  certifications: Array.isArray(resume.certifications)
    ? resume.certifications.map((c) => (typeof c === 'string' ? c : `${c.name}${c.issuer ? ' – ' + c.issuer : ''}${c.year ? ' (' + c.year + ')' : ''}`))
    : [],
  experiences: Array.isArray(resume.experience)
    ? resume.experience.map((e) => ({
        id:        e.id        || null,
        company:   e.company   || '',
        role:      e.role      || '',
        location:  e.location  || '',
        startDate: e.startDate || '',
        endDate:   e.endDate   || '',
        bullets:   Array.isArray(e.bullets) ? e.bullets : [],
      }))
    : [],
  education: Array.isArray(resume.education)
    ? resume.education.map((e) => ({
        id:          e.id          || null,
        institution: e.institution || '',
        degree:      e.degree      || '',
        field:       e.field       || '',
        startDate:   e.startDate   || '',
        endDate:     e.endDate     || '',
      }))
    : [],
  projects: Array.isArray(resume.projects)
    ? resume.projects.map((p) => ({
        id:          p.id          || null,
        name:        p.name        || '',
        link:        p.link        || '',
        description: p.description || '',
      }))
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
