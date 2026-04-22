export const APP_NAME          = import.meta.env.VITE_APP_NAME || 'ResumeForge AI';
export const TOKEN_STORAGE_KEY = 'resumeforge_token';
export const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
export const FREE_EXPORT_LIMIT     = 2;

// Empty defaults — never pre-fill with sample data
export const defaultResume = {
  fullName: '', professionalTitle: '', email: '', phone: '',
  location: '', linkedin: '', github: '', portfolio: '',
  summary: '', skills: [], experience: [], projects: [],
  education: [], certifications: [], achievements: [],
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
  {
    id:          'modern',
    label:       'Modern Pro',
    description: 'Clean and professional for all industries — ATS-optimized',
  },
  {
    id:          'minimal',
    label:       'Minimal ATS',
    description: 'Maximum ATS compatibility with minimal styling',
  },
  {
    id:          'executive',
    label:       'Executive',
    description: 'Bold and authoritative for senior roles',
  },
  {
    id:          'fresher',
    label:       'Fresher',
    description: 'Optimized for entry-level candidates with projects focus',
  },
  {
    id:          'creative',
    label:       'Creative ATS',
    description: 'Stylish with accent colors, yet ATS-safe',
  },
];
