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

// Safely normalise resume payload from API → internal shape.
// Handles two input shapes:
//   A) Raw API response where JSON fields are still strings (direct Spring response)
//   B) Already-processed fromApiResponse output where JSON fields are already arrays
// In case B, JSON.parse(array) would throw. We guard with Array.isArray checks.
export const normaliseResume = (payload) => {
  if (!payload) return null;

  const safeParse = (value, fallback) => {
    // FIX 3: If value is already an array/object (fromApiResponse already parsed it),
    // return it directly. Do NOT try JSON.parse on an already-parsed value —
    // that causes JSON.parse([...]) to throw, and safeParse silently returns [].
    if (Array.isArray(value)) return value;
    if (value !== null && typeof value === 'object') return value;
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  // FIX 4: Only parse personalInfo if it's a raw string. If the payload already
  // has top-level fullName (from fromApiResponse), use those directly so we don't
  // overwrite them with empty strings from an already-consumed personalInfo field.
  const personalRaw = payload.personalInfo;
  const personal = (personalRaw && typeof personalRaw === 'string')
    ? safeParse(personalRaw, {})
    : (personalRaw && typeof personalRaw === 'object' ? personalRaw : {});

  return {
    ...payload,

    // Use personal fields from parsed personalInfo if available,
    // fall back to already-mapped top-level fields (from fromApiResponse),
    // then fall back to empty string.
    fullName: personal.fullName || payload.fullName || '',
    // FIX: backend stores the title as personalInfo.professionalTitle (or .title).
    // personal.role was only correct for old data; check all variants.
    professionalTitle: personal.professionalTitle || personal.title || personal.role || payload.professionalTitle || '',
    email: personal.email || payload.email || '',
    phone: personal.phone || payload.phone || '',
    location: personal.location || payload.location || '',
    linkedin: personal.linkedin || payload.linkedin || '',
    github: personal.github || payload.github || '',
    portfolio: personal.portfolio || payload.portfolio || '',

    skills: safeParse(payload.skills, []),
    experience: safeParse(payload.experience, []),
    education: safeParse(payload.education, []),
    projects: safeParse(payload.projects, []),
    certifications: safeParse(payload.certifications, []),
    // FIX: achievements live at payload.achievements — do NOT read from
    // customSections first, which is an unrelated JSONB field and always
    // returns {} here, masking the real achievements array.
    achievements: safeParse(payload.achievements, []),
  };
};

// Individual normalisation helpers — exported for use anywhere that processes
// raw API entries. Each one ensures every field the builder form reads is present
// with a safe default, preventing undefined access on form inputs.
export const normExp = (e) => ({
  id:             e.id             || uid('exp'),
  company:        e.company        || '',
  role:           e.role           || '',
  location:       e.location       || '',
  employmentType: e.employmentType || '',
  startDate:      e.startDate      || '',
  endDate:        e.endDate        || '',
  summary:        e.summary        || '',
  bullets:        Array.isArray(e.bullets) ? e.bullets : [],
});

export const normEdu = (e) => ({
  id:          e.id          || uid('edu'),
  institution: e.institution || '',
  degree:      e.degree      || '',
  field:       e.field       || '',
  grade:       e.grade       || '',
  startDate:   e.startDate   || '',
  endDate:     e.endDate     || '',
  details:     e.details     || '',
});

export const normProj = (p) => ({
  id:          p.id          || uid('proj'),
  name:        p.name        || '',
  role:        p.role        || '',
  link:        p.link        || '',
  github:      p.github      || '',
  techStack:   p.techStack   || '',
  description: p.description || '',
  highlights:  Array.isArray(p.highlights) ? p.highlights : [],
});

// FIX: normCert now handles both legacy string format and full object format,
// and includes the credentialUrl field.
export const normCert = (c) => {
  if (typeof c === 'string') {
    return { id: uid('cert'), name: c, issuer: '', year: '', credentialUrl: '' };
  }
  return {
    id:            c.id            || uid('cert'),
    name:          c.name          || '',
    issuer:        c.issuer        || '',
    year:          c.year          || '',
    credentialUrl: c.credentialUrl || '',
  };
};