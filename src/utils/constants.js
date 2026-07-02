export const APP_NAME          = import.meta.env.VITE_APP_NAME || 'ResumeForge AI';
export const TOKEN_STORAGE_KEY = 'resumeforge_token';
export const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000;
export const FREE_EXPORT_LIMIT     = 3;

export const defaultResume = {
  fullName: '', professionalTitle: '', email: '', phone: '',
  location: '', linkedin: '', github: '', portfolio: '',
  summary: '', skills: [], experience: [], projects: [],
  education: [], certifications: [], achievements: [],
  languages: [], customSections: {},
  sectionsConfig: null,
};

export const premiumFeatures = [
  'Unlimited PDF + DOCX exports',
  'No ad interruptions ever',
  'Classic, Modern & Minimal templates',
  'AI Cover Letter generation',
  'AI Resume Tailoring to job descriptions',
  'AI Interview Prep (5 questions + answers)',
  'ATS Pro Scan — unlimited per day',
  'Lifetime access — pay once',
];

export const STANDARD_SECTIONS = [
  { key: 'basics',         label: 'Personal Info',  icon: 'user',      removable: false },
  { key: 'summary',        label: 'Summary',        icon: 'text',      removable: true  },
  { key: 'skills',         label: 'Skills',         icon: 'star',      removable: true  },
  { key: 'experience',     label: 'Experience',     icon: 'briefcase', removable: true  },
  { key: 'projects',       label: 'Projects',       icon: 'code',      removable: true  },
  { key: 'education',      label: 'Education',      icon: 'academic',  removable: true  },
  { key: 'certifications', label: 'Certifications', icon: 'badge',     removable: true  },
  { key: 'achievements',   label: 'Achievements',   icon: 'trophy',    removable: true  },
];

/* Languages is addable but NOT in the default set so new resumes
   don't show an empty Languages section by default. Users add it
   via SectionsManager if they need it. */
export const ADDABLE_STANDARD_SECTIONS = [
  { key: 'languages',   label: 'Languages',   icon: 'globe'  },
  { key: 'interests',   label: 'Interests',   icon: 'heart'  },
  { key: 'references',  label: 'References',  icon: 'users'  },
  { key: 'volunteer',   label: 'Volunteering',icon: 'hand'   },
  { key: 'awards',      label: 'Awards',      icon: 'medal'  },
  { key: 'publications',label: 'Publications',icon: 'book'   },
];

/* Default config — used when resume.sectionsConfig is null.
   Does NOT include languages (matches original app behaviour). */
export const DEFAULT_SECTIONS_CONFIG = STANDARD_SECTIONS.map((s, i) => ({
  id:      s.key,
  type:    'standard',
  key:     s.key,
  label:   s.label,
  visible: true,
  order:   i,
}));

export const builderSections = STANDARD_SECTIONS.map((s) => ({
  id:    s.key,
  label: s.label,
  icon:  s.icon,
}));

export const RESUME_TEMPLATES = [
  { id: 'modern',    label: 'Modern Pro',   description: 'Clean and professional for all industries — ATS-optimized' },
  { id: 'classic',   label: 'Classic',      description: 'Single-column traditional layout — maximum ATS compatibility' },
  { id: 'minimal',   label: 'Minimal ATS',  description: 'Maximum ATS compatibility with minimal styling' },
  { id: 'executive', label: 'Executive',    description: 'Bold and authoritative for senior roles' },
  { id: 'fresher',   label: 'Fresher',      description: 'Optimized for entry-level candidates with projects focus' },
  { id: 'creative',  label: 'Creative ATS', description: 'Stylish with accent colors, yet ATS-safe' },
];
