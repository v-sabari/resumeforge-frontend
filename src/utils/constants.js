export const APP_NAME          = import.meta.env.VITE_APP_NAME || 'ResumeForge AI';
// BUG-004 FIX: TOKEN_STORAGE_KEY removed — the JWT is now delivered as an
// httpOnly cookie (see AuthController.setAuthCookie / api.js withCredentials)
// instead of being stored in localStorage, so there's no client-side key left.
export const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000;
export const FREE_EXPORT_LIMIT     = 3;

export const defaultResume = {
  fullName: '', professionalTitle: '', email: '', phone: '',
  location: '', linkedin: '', github: '', portfolio: '',
  summary: '', skills: [], experience: [], projects: [],
  education: [], certifications: [], achievements: [],
  languages: [], customSections: {},
  sectionsConfig: null, // null → use DEFAULT_SECTIONS_CONFIG
  layoutScale: 1, // 1 = full size; < 1 = compressed via the Compress feature (see compression.js)
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

// ─── Standard sections catalog ─────────────────────────────────────────────
// Moved to sectionsCatalog.js so the same data can also be imported by
// api/render-pdf.js (a plain Node function that can't import this file,
// since line 1 above touches import.meta.env). Re-exported here unchanged
// so every existing import of these names from constants.js keeps working.
export { STANDARD_SECTIONS, ADDABLE_STANDARD_SECTIONS, DEFAULT_SECTIONS_CONFIG } from './sectionsCatalog.js';
import { STANDARD_SECTIONS } from './sectionsCatalog.js';

// ─── Builder sections for the left nav (derived dynamically in page, kept
//     here only for the icon lookup helper used elsewhere) ──────────────────
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