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

/**
 * Safely normalise resume payload from API → internal shape.
 *
 * Handles two input shapes:
 *   A) Raw API response where JSON fields are still strings (direct Spring response)
 *   B) Already-processed fromApiResponse output where JSON fields are already arrays/objects
 *
 * FIX (re-audit): normaliseResume previously did NOT preserve `sectionsConfig`,
 * `languages`, or `customSections`. After every save the API response was passed
 * through normaliseResume, which only returned a fixed set of fields — so all three
 * were silently dropped from React state. The next render showed no custom sections,
 * no languages, and the section order reverted to the default. Now all three are
 * forwarded via `...payload` plus explicit safe-parses so they always survive the
 * save/load cycle.
 */
export const normaliseResume = (payload) => {
  if (!payload) return null;

  const safeParse = (value, fallback) => {
    if (Array.isArray(value)) return value;
    if (value !== null && typeof value === 'object') return value;
    try {
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };

  const personalRaw = payload.personalInfo;
  const personal = (personalRaw && typeof personalRaw === 'string')
    ? safeParse(personalRaw, {})
    : (personalRaw && typeof personalRaw === 'object' ? personalRaw : {});

  return {
    // Spread everything first so no field from the API is silently dropped.
    // Individual overrides below correct specific fields that need normalisation.
    ...payload,

    // Contact fields — prefer parsed personalInfo, then top-level (from fromApiResponse)
    fullName:          personal.fullName          || payload.fullName          || '',
    professionalTitle: personal.professionalTitle || personal.title || personal.role
                       || payload.professionalTitle || '',
    email:     personal.email     || payload.email     || '',
    phone:     personal.phone     || payload.phone     || '',
    location:  personal.location  || payload.location  || '',
    linkedin:  personal.linkedin  || payload.linkedin  || '',
    github:    personal.github    || payload.github    || '',
    portfolio: personal.portfolio || payload.portfolio || '',

    // Array fields — safe-parse handles both string (raw API) and array (already parsed)
    skills:         safeParse(payload.skills,         []),
    experience:     safeParse(payload.experience,     []),
    education:      safeParse(payload.education,      []),
    projects:       safeParse(payload.projects,       []),
    certifications: safeParse(payload.certifications, []),
    achievements:   safeParse(payload.achievements,   []),

    // FIX: languages was not preserved — now explicitly normalised
    languages:      safeParse(payload.languages,      []),

    // FIX: customSections was not preserved — now explicitly normalised
    // customSections is a keyed object {sectionId: {mode,text,items}}
    customSections: safeParse(payload.customSections, {}),

    // FIX: sectionsConfig was not preserved — now explicitly normalised
    // null is a valid value (means "use DEFAULT_SECTIONS_CONFIG")
    sectionsConfig: safeParse(payload.sectionsConfig, null),
  };
};

// Individual normalisation helpers
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
