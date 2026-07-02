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
 */

export const normCerts = (arr = []) =>
  arr.map((c) =>
    typeof c === 'string'
      ? { name: c, issuer: '', year: '', credentialUrl: '' }
      : { name: c?.name || '', issuer: c?.issuer || '', year: c?.year || '', credentialUrl: c?.credentialUrl || '' }
  );

export const buildTransformed = (resume, sectionsConfig) => ({
  sectionsConfig,
  personalInfo: {
    fullName:  resume.fullName          || 'Your Name',
    title:     resume.professionalTitle || '',
    email:     resume.email    || '',
    phone:     resume.phone    || '',
    location:  resume.location || '',
    linkedin:  resume.linkedin  || '',
    github:    resume.github    || '',
    portfolio: resume.portfolio || '',
  },
  summary:    resume.summary || '',
  experience: (resume.experience || []).map((e) => ({
    position:       e.role           || '',
    company:        e.company        || '',
    duration:       e.duration       || `${e.startDate||''} – ${e.endDate||'Present'}`.trim(),
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
    link:         p.link        || '',
    github:       p.github      || '',
    description:  p.description || '',
    technologies: p.techStack   || p.technologies || '',
    highlights:   p.highlights  || [],
  })),
  certifications: normCerts(resume.certifications),
  achievements:   resume.achievements   || [],
  languages:      resume.languages      || [],
  customSections: resume.customSections || {},
});
