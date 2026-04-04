export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const formatApiError = (error, fallback = 'Something went wrong. Please try again.') => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error)   return error.response.data.error;
  if (typeof error?.message === 'string') return error.message;
  return fallback;
};

export const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

export const uid = (prefix = 'item') => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

export const prettyDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(date);
};

export const truncate = (str, len = 60) =>
  str && str.length > len ? str.slice(0, len) + '…' : str || '';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Safely normalise resume payload from API → internal shape
export const normaliseResume = (payload) => {
  if (!payload) return null;
  return {
    ...payload,
    // FIX: Map API `role` → frontend `professionalTitle` so editor field populates on load
    professionalTitle: payload.professionalTitle || payload.role || '',
    skills:         Array.isArray(payload.skills)         ? payload.skills         : [],
    experience:     Array.isArray(payload.experiences)    ? payload.experiences.map(normExp) : [],
    education:      Array.isArray(payload.education)      ? payload.education.map(normEdu)   : [],
    projects:       Array.isArray(payload.projects)       ? payload.projects.map(normProj)   : [],
    certifications: Array.isArray(payload.certifications) ? payload.certifications.map(normCert) : [],
    achievements:   Array.isArray(payload.achievements)   ? payload.achievements    : [],
  };
};

const normExp = (e) => ({
  id:        e.id   || uid('exp'),
  company:   e.company   || '',
  role:      e.role      || '',
  location:  e.location  || '',
  startDate: e.startDate || '',
  endDate:   e.endDate   || '',
  bullets:   Array.isArray(e.bullets) ? e.bullets : [],
});

const normEdu = (e) => ({
  id:          e.id          || uid('edu'),
  institution: e.institution || '',
  degree:      e.degree      || '',
  field:       e.field       || '',
  startDate:   e.startDate   || '',
  endDate:     e.endDate     || '',
});

const normProj = (p) => ({
  id:          p.id          || uid('proj'),
  name:        p.name        || '',
  link:        p.link        || '',
  description: p.description || '',
});

// BUG FIX: certifications were objects {id,name,issuer,year} but backend
// was returning them as flat strings. We normalise both shapes.
const normCert = (c) => {
  if (typeof c === 'string') {
    return { id: uid('cert'), name: c, issuer: '', year: '' };
  }
  return {
    id:     c.id     || uid('cert'),
    name:   c.name   || '',
    issuer: c.issuer || '',
    year:   c.year   || '',
  };
};
