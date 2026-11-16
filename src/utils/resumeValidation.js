// P1-1: Shared, framework-agnostic resume-field validation.
//
// ValidatedInput.jsx keeps its OWN local error state for inline display on
// blur, but that state is invisible to the editor, the preview, the save
// payload, and the export gate. This module is the single source of truth
// that all of them can call: it takes a resume object and returns a list of
// field-level errors plus a normalized copy of the resume (URLs get
// https:// prepended and trimmed).
//
// Server-side validation lives in the Spring backend (ResumeRequest /
// ResumeService). The client rules here MUST stay in sync with the server's
// @Pattern / @Size constraints — see ResumeRequest.java.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_RE = /\d/g;
export const URL_RE = /^https?:\/\/[^\s/]+\.[^\s]+/;

export const isValidEmail = (v) => !v || EMAIL_RE.test(v);

export const isValidPhone = (v) => {
  if (!v) return true;
  const digits = (v.match(PHONE_DIGITS_RE) || []).join('');
  if (digits.length < 7 || digits.length > 15) return false;
  return /^[0-9+\-\s()]+$/.test(v);
};

export const isValidUrl = (v) => !v || URL_RE.test(v);

/** Auto-prepend https:// to a URL string if it looks like a bare domain. */
export const normalizeUrl = (v) => {
  if (!v) return v;
  const trimmed = v.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // Only prepend if it looks like a domain (at least one dot, no spaces).
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+/i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
};

export const validateField = (type, value) => {
  if (type === 'email' && !isValidEmail(value)) return 'Enter a valid email address.';
  if (type === 'tel'  && !isValidPhone(value)) return 'Enter a valid phone (7-15 digits, +/spaces/dashes allowed).';
  if (type === 'url'  && !isValidUrl(value))   return 'Enter a valid URL (e.g. https://example.com).';
  return '';
};

/**
 * Validate every relevant field on a resume object. Returns:
 *   { errors: { path: message }, hasErrors: boolean }
 *
 * `path` is a dotted key matching the resume shape, e.g.:
 *   'email', 'phone', 'linkedin', 'github', 'portfolio'
 *   'experience.0.startDate', 'experience.3.endDate'  (date ordering)
 *   'projects.0.link', 'projects.0.github'
 *   'certifications.0.credentialUrl'
 *
 * This is the gate the export panel calls before generating a file, and the
 * gate the editor can read to mark fields invalid in real time.
 */
export const validateResume = (resume) => {
  const errors = {};
  if (!resume) return { errors, hasErrors: false };

  // ── Contact fields ──
  if (!isValidEmail(resume.email))     errors.email = 'Enter a valid email address.';
  if (!isValidPhone(resume.phone))     errors.phone = 'Enter a valid phone (7-15 digits, +/spaces/dashes allowed).';
  if (!isValidUrl(resume.linkedin))    errors.linkedin = 'Enter a valid LinkedIn URL.';
  if (!isValidUrl(resume.github))      errors.github = 'Enter a valid GitHub URL.';
  if (!isValidUrl(resume.portfolio))   errors.portfolio = 'Enter a valid portfolio URL.';

  // ── Experience: dates ──
  // end >= start when both are present and not 'Present'. Start is required
  // for each role once an end date or 'Present' is set (prevents the
  // '– Present' with no start date the user saw in the preview).
  (resume.experience || []).forEach((exp, i) => {
    const start = (exp.startDate || '').trim();
    const end = (exp.endDate || '').trim();
    const isPresent = end.toLowerCase() === 'present';
    if (!start && (end || isPresent)) {
      errors[`experience.${i}.startDate`] = 'Start date is required.';
    }
    if (start && end && !isPresent) {
      if (end < start) errors[`experience.${i}.endDate`] = 'End date cannot be before the start date.';
    }
  });

  // ── Education: same date rules ──
  (resume.education || []).forEach((edu, i) => {
    const start = (edu.startDate || '').trim();
    const end = (edu.endDate || '').trim();
    const isPresent = end.toLowerCase() === 'present';
    if (!start && (end || isPresent)) {
      errors[`education.${i}.startDate`] = 'Start date is required.';
    }
    if (start && end && !isPresent && end < start) {
      errors[`education.${i}.endDate`] = 'End date cannot be before the start date.';
    }
  });

  // ── Project URLs ──
  (resume.projects || []).forEach((proj, i) => {
    if (!isValidUrl(proj.link))   errors[`projects.${i}.link`] = 'Enter a valid live URL.';
    if (!isValidUrl(proj.github)) errors[`projects.${i}.github`] = 'Enter a valid GitHub URL.';
  });

  // ── Certification credential URLs ──
  (resume.certifications || []).forEach((cert, i) => {
    const url = typeof cert === 'string' ? '' : (cert.credentialUrl || '');
    if (!isValidUrl(url)) errors[`certifications.${i}.credentialUrl`] = 'Enter a valid credential URL.';
  });

  const hasErrors = Object.keys(errors).length > 0;
  return { errors, hasErrors };
};

/**
 * Return a copy of `resume` with URL fields normalized (trimmed + https://
 * prepended where missing). Used at the save boundary so the server always
 * receives canonical URLs, and at the preview boundary so a user typing
 * 'linkedin.com/in/me' sees the normalized value render correctly.
 */
export const normalizeResumeUrls = (resume) => {
  if (!resume) return resume;
  const next = { ...resume };
  next.linkedin  = resume.linkedin  ? normalizeUrl(resume.linkedin)  : resume.linkedin;
  next.github    = resume.github    ? normalizeUrl(resume.github)    : resume.github;
  next.portfolio = resume.portfolio ? normalizeUrl(resume.portfolio) : resume.portfolio;
  if (Array.isArray(resume.projects)) {
    next.projects = resume.projects.map((p) => ({
      ...p,
      link:   p.link   ? normalizeUrl(p.link)   : p.link,
      github: p.github ? normalizeUrl(p.github) : p.github,
    }));
  }
  if (Array.isArray(resume.certifications)) {
    next.certifications = resume.certifications.map((c) =>
      typeof c === 'string' ? c : { ...c, credentialUrl: c.credentialUrl ? normalizeUrl(c.credentialUrl) : c.credentialUrl }
    );
  }
  return next;
};
