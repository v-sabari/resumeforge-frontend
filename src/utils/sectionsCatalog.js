/**
 * src/utils/sectionsCatalog.js
 *
 * Single source of truth for the standard resume sections and the default
 * sectionsConfig derived from them.
 *
 * This was split out of constants.js so it can be imported from BOTH:
 *  - the Vite frontend (constants.js re-exports everything below), and
 *  - api/render-pdf.js, a plain Node serverless function that runs outside
 *    Vite's build pipeline and therefore cannot import constants.js directly
 *    (constants.js reads `import.meta.env.VITE_APP_NAME` at module scope,
 *    which throws in a non-Vite Node context).
 *
 * This file must never reference `import.meta.env` or anything else that
 * only exists inside Vite, precisely so both consumers can import it safely.
 *
 * Previously, render-pdf.js hand-maintained its own duplicate copy of the
 * standard section keys with a comment asking future engineers to manually
 * mirror any change made here. That duplication is now removed — there is
 * exactly one array of standard sections in the whole project.
 */

// ─── Standard sections catalog ─────────────────────────────────────────────
// Every section the builder knows how to render natively.
// key   → the resume state property that holds the data
// label → default display name (user can rename)
// icon  → Icon component name
export const STANDARD_SECTIONS = [
  { key: 'basics',         label: 'Personal Info',   icon: 'user',      removable: false },
  { key: 'summary',        label: 'Summary',         icon: 'text',      removable: true  },
  { key: 'skills',         label: 'Skills',          icon: 'star',      removable: true  },
  { key: 'experience',     label: 'Experience',      icon: 'briefcase', removable: true  },
  { key: 'projects',       label: 'Projects',        icon: 'code',      removable: true  },
  { key: 'education',      label: 'Education',       icon: 'academic',  removable: true  },
  { key: 'certifications', label: 'Certifications',  icon: 'badge',     removable: true  },
  { key: 'achievements',   label: 'Achievements',    icon: 'trophy',    removable: true  },
  { key: 'languages',      label: 'Languages',       icon: 'globe',     removable: true  },
];

// ─── Addable standard sections (not shown by default) ──────────────────────
export const ADDABLE_STANDARD_SECTIONS = [
  { key: 'interests',   label: 'Interests',   icon: 'heart'  },
  { key: 'references',  label: 'References',  icon: 'users'  },
  { key: 'volunteer',   label: 'Volunteering',icon: 'hand'   },
  { key: 'awards',      label: 'Awards',      icon: 'medal'  },
  { key: 'publications',label: 'Publications',icon: 'book'   },
];

// ─── Default section config ─────────────────────────────────────────────────
// Used when resume.sectionsConfig is null (new resumes, legacy resumes).
// Each entry: { id, type, key, label, visible, order }
export const DEFAULT_SECTIONS_CONFIG = STANDARD_SECTIONS.map((s, i) => ({
  id:      s.key,
  type:    'standard',
  key:     s.key,
  label:   s.label,
  visible: true,
  order:   i,
}));