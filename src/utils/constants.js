export const APP_NAME          = import.meta.env.VITE_APP_NAME || 'ResumeForge AI';
export const TOKEN_STORAGE_KEY = 'resumeforge_token';
export const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
export const FREE_EXPORT_LIMIT     = 2;

// BUG FIX: Empty defaults — never pre-fill with sample person's data
export const defaultResume = {
  fullName: '', professionalTitle: '', email: '', phone: '',
  location: '', linkedin: '', github: '', portfolio: '',
  summary: '', skills: [], experience: [], projects: [],
  education: [], certifications: [], achievements: [],
};

export const premiumFeatures = [
  'Unlimited PDF exports',
  'No ad interruptions ever',
  'Classic & Modern templates',
  'Multiple saved resume versions',
  'Priority AI writing assistance',
  'Lifetime access — pay once',
];

export const builderSections = [
  { id: 'basics',         label: 'Personal Info',  icon: 'user'      },
  { id: 'summary',        label: 'Summary',        icon: 'text'      },
  { id: 'skills',         label: 'Skills',         icon: 'star'      },
  { id: 'experience',     label: 'Experience',     icon: 'briefcase' },
  { id: 'projects',       label: 'Projects',       icon: 'code'      },
  { id: 'education',      label: 'Education',      icon: 'academic'  },
  { id: 'certifications', label: 'Certifications', icon: 'badge'     },
  { id: 'achievements',   label: 'Achievements',   icon: 'trophy'    },
];

export const RESUME_TEMPLATES = [
  { id: 'classic', label: 'Classic', description: 'Clean, ATS-safe single column' },
  { id: 'modern',  label: 'Modern',  description: 'Two-column with accent sidebar' },
];
