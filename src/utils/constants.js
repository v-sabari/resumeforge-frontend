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
};

export const premiumFeatures = [
  'Unlimited PDF + DOCX exports',
  'No ad interruptions ever',
  'All 20 resume templates (10 premium-exclusive)',
  'AI Cover Letter generation',
  'AI Resume Tailoring to job descriptions',
  'AI Interview Prep (5 questions + answers)',
  'ATS Pro Scan — unlimited per day',
  'Voice & Chat Resume Builder (flagship)',
  'Personalized AI Resume Guidance',
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

export const TEMPLATE_CATEGORIES = [
  { id: 'professional', label: 'Professional',   description: 'Clean and polished for corporate and business roles' },
  { id: 'classic',      label: 'Classic',        description: 'Timeless layouts with maximum ATS compatibility' },
  { id: 'minimalist',   label: 'Minimalist',     description: 'Ultra-clean designs with generous whitespace' },
  { id: 'entry-level',  label: 'Entry-Level',    description: 'Optimised for fresh graduates and early-career candidates' },
  { id: 'technical',    label: 'Technical',      description: 'Structured layouts for engineers and IT professionals' },
  { id: 'executive',    label: 'Executive',      description: 'Bold, authoritative designs for senior leadership roles' },
  { id: 'creative',     label: 'Creative',       description: 'Stylish designs with accent colours, yet ATS-safe' },
  { id: 'modern',       label: 'Modern',         description: 'Contemporary layouts with fresh visual appeal' },
  { id: 'academic',     label: 'Academic',       description: 'Scholarly formats for research and education roles' },
  { id: 'industry',     label: 'Industry',       description: 'Specialised templates for healthcare, finance, and more' },
];

export const RESUME_TEMPLATES = [
  // ── Free: 10 templates (2 per category × 5 free categories) ─────────
  // Professional
  { id: 'modern',     label: 'Modern Pro',      description: 'Clean and professional for all industries — ATS-optimized',     category: 'professional', isPremium: false },
  { id: 'corporate',  label: 'Corporate',       description: 'Dark header with blue accents — suited for business roles',   category: 'professional', isPremium: false },
  // Classic
  { id: 'classic',    label: 'Classic',         description: 'Single-column traditional layout — maximum ATS compatibility', category: 'classic',      isPremium: false },
  { id: 'traditional',label: 'Traditional',     description: 'Serif-accented traditional layout for formal industries',     category: 'classic',      isPremium: false },
  // Minimalist
  { id: 'minimal',    label: 'Minimal ATS',     description: 'Maximum ATS compatibility with minimal styling',              category: 'minimalist',   isPremium: false },
  { id: 'clean',      label: 'Clean',           description: 'Ultra-clean whitespace with refined sans-serif typography',   category: 'minimalist',   isPremium: false },
  // Entry-Level
  { id: 'fresher',    label: 'Fresher',         description: 'Optimised for entry-level candidates with projects focus',   category: 'entry-level',  isPremium: false },
  { id: 'graduate',   label: 'Graduate',        description: 'Light blue tones with education-first layout',               category: 'entry-level',  isPremium: false },
  // Technical
  { id: 'tech',       label: 'Tech Pro',        description: 'Monospace accents with structured skill formatting',         category: 'technical',    isPremium: false },
  { id: 'engineering',label: 'Engineering',     description: 'Two-column header with technical competency focus',          category: 'technical',    isPremium: false },

  // ── Premium: 10 templates (2 per category × 5 premium categories) ───
  // Executive
  { id: 'executive',  label: 'Executive',       description: 'Bold and authoritative for senior roles',                    category: 'executive',    isPremium: true },
  { id: 'leadership', label: 'Leadership',      description: 'Gold-accented design for C-suite and VP-level roles',       category: 'executive',    isPremium: true },
  // Creative
  { id: 'creative',   label: 'Creative ATS',    description: 'Stylish with accent colours, yet ATS-safe',                category: 'creative',     isPremium: true },
  { id: 'designer',   label: 'Designer',        description: 'Vibrant gradient accent with bold typography',              category: 'creative',     isPremium: true },
  // Modern
  { id: 'sleek',      label: 'Sleek',           description: 'Ultra-modern minimal design with sharp lines',             category: 'modern',       isPremium: true },
  { id: 'contemporary',label: 'Contemporary',   description: 'Fresh modern layout with subtle shadow accents',           category: 'modern',       isPremium: true },
  // Academic
  { id: 'academic',   label: 'Academic',        description: 'Scholarly format with serif headings for research roles',   category: 'academic',     isPremium: true },
  { id: 'research',   label: 'Research',        description: 'Publication-style layout with structured citations',        category: 'academic',     isPremium: true },
  // Industry
  { id: 'medical',    label: 'Medical',         description: 'Healthcare-focused layout with credentials emphasis',       category: 'industry',     isPremium: true },
  { id: 'finance',    label: 'Finance',         description: 'Conservative navy design for banking and finance',          category: 'industry',     isPremium: true },
];

export const FREE_TEMPLATE_IDS  = RESUME_TEMPLATES.filter((t) => !t.isPremium).map((t) => t.id);
export const PAID_TEMPLATE_IDS  = RESUME_TEMPLATES.filter((t) =>  t.isPremium).map((t) => t.id);
