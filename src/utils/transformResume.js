/**
 * transformResume.js
 *
 * SINGLE SOURCE OF TRUTH for shaping raw editor/API resume data into the
 * flat shape every template component consumes.
 *
 * Previously this logic (buildTransformed) lived inline inside
 * ResumePreview.jsx. It has been extracted here so that:
 *   1. The live preview (ResumePreview.jsx) and
 *   2. The PDF render service (render-service/templates/transformResume.js — a
 *      byte-identical copy of this file)
 * always compute the exact same transformed data from the exact same input.
 * Any change to field mapping only ever needs to happen in ONE place per
 * codebase, and the two copies must be kept in sync (see
 * render-service/README.md for the sync procedure).
 *
 * P1-1: URL fields are normalized (https:// prepended, trimmed) and invalid
 * email/phone are suppressed (blanked) so the preview and the exported PDF
 * never render obviously-wrong contact details. The editor's ValidatedInput
 * still shows the inline "fix this" error to guide the user.
 */
import { normalizeUrl, isValidEmail, isValidPhone, isValidUrl } from './resumeValidation.js';

const cleanUrl = (v) => (v ? normalizeUrl(v) : '');
const cleanEmail = (v) => (v && isValidEmail(v) ? v : '');
const cleanPhone = (v) => (v && isValidPhone(v) ? v : '');
const cleanUrlField = (v) => (v && isValidUrl(v) ? cleanUrl(v) : '');

export const normCerts = (arr = []) =>
  arr.map((c) =>
    typeof c === 'string'
      ? { name: c, issuer: '', year: '', credentialUrl: '' }
      : { name: c?.name || '', issuer: c?.issuer || '', year: c?.year || '', credentialUrl: c?.credentialUrl ? cleanUrlField(c.credentialUrl) : '' }
  );

export const buildTransformed = (resume, sectionsConfig) => ({
  sectionsConfig,
  personalInfo: {
    fullName:  resume.fullName          || 'Your Name',
    title:     resume.professionalTitle || '',
    // P1-1: suppress invalid email/phone so the preview/PDF don't render
    // "not-an-email" / "abc123". The editor shows the inline validation error.
    email:     cleanEmail(resume.email),
    phone:     cleanPhone(resume.phone),
    location:  resume.location || '',
    linkedin:  cleanUrlField(resume.linkedin),
    github:    cleanUrlField(resume.github),
    portfolio: cleanUrlField(resume.portfolio),
  },
  summary:    resume.summary || '',
  experience: (resume.experience || []).map((e) => ({
    position:       e.role           || '',
    company:        e.company        || '',
    // P1-1: hide the dangling "– Present" when there is no start date.
    duration:       (!e.startDate && !e.endDate) ? ''
                     : `${e.startDate||''} – ${e.endDate||'Present'}`.trim(),
    location:       e.location       || '',
    employmentType: e.employmentType || '',
    summary:        e.summary        || '',
    responsibilities: e.bullets || e.responsibilities || [],
  })),
  education: (resume.education || []).map((e) => ({
    degree:      e.degree              || '',
    field:       e.field               || '',
    institution: e.school || e.institution || '',
    year:        e.year || `${e.startDate||''} – ${e.endDate||''}`.trim(),
    gpa:         e.gpa    || e.grade   || '',
    details:     e.details             || '',
  })),
  skills:         resume.skills         || [],
  projects: (resume.projects || []).map((p) => ({
    name:         p.name        || '',
    role:         p.role        || '',
    link:         cleanUrlField(p.link),
    github:       cleanUrlField(p.github),
    description:  p.description || '',
    technologies: p.techStack   || p.technologies || '',
    highlights:   p.highlights  || [],
  })),
  certifications: normCerts(resume.certifications),
  achievements:   resume.achievements   || [],
  languages:      resume.languages      || [],
  customSections: resume.customSections || {},
});
