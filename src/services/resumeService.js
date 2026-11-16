import api from './api';
import {
  DEFAULT_FONT_FAMILY,
  normaliseFontFamily,
  fontSizeFromStoredPx,
  fontSizeToStoredPx,
} from '../utils/resumeTypography.js';
import { normalizeResumeUrls } from '../utils/resumeValidation.js';

const safeJsonParse = (value, fallback = null) => {
  if (value == null || value === '') return fallback;
  if (typeof value === 'object')    return value;
  try { return JSON.parse(value); } catch { return fallback; }
};

export function fromApiResponse(data) {
  const personalInfo = safeJsonParse(data.personalInfo, {});
  return {
    id: data.id, userId: data.userId,
    title: data.title ?? '', template: data.template ?? 'modern',
    personalInfo,
    fullName:          personalInfo.fullName          || '',
    professionalTitle: personalInfo.professionalTitle || personalInfo.title || '',
    email:    personalInfo.email    || '',
    phone:    personalInfo.phone    || '',
    location: personalInfo.location || '',
    linkedin: personalInfo.linkedin || '',
    github:   personalInfo.github   || '',
    portfolio:personalInfo.portfolio|| '',
    summary:        data.summary        ?? '',
    experience:     safeJsonParse(data.experience,     []),
    education:      safeJsonParse(data.education,      []),
    skills:         safeJsonParse(data.skills,         []),
    projects:       safeJsonParse(data.projects,       []),
    certifications: safeJsonParse(data.certifications, []),
    achievements:   safeJsonParse(data.achievements,   []),
    languages:      safeJsonParse(data.languages,      []),
    customSections: safeJsonParse(data.customSections, {}),
    sectionsConfig: safeJsonParse(data.sectionsConfig, null),
    // Resume-only typography — round-tripped so a saved choice survives
    // refresh and drives both the preview and the PDF export. The API/stored
    // unit is px; the UI works in pt, so convert at this boundary only.
    fontFamily: normaliseFontFamily(data.fontFamily ?? DEFAULT_FONT_FAMILY),
    fontSize:   fontSizeFromStoredPx(data.fontSize),
    createdAt: data.createdAt, updatedAt: data.updatedAt,
  };
}

/**
 * PHASE-1 DATA SAFETY: title fallback.
 *
 * Previously: `resume.title || resume.fullName || 'Untitled Resume'` — so a
 * brand-new resume with only a professionalTitle (no fullName) was saved
 * with title='' (empty), and a resume with fullName="Priya" but no
 * professionalTitle got title="Priya" (no role context). The requirement is
 * '<Full name> – <Professional title>' when both exist, falling back to
 * whichever exists, finally 'Untitled resume' (lowercase 'r' per spec) when
 * neither does. Combined with the editor-side `hasContent()` gate, this
 * guarantees we never POST a record whose title is the empty string.
 */
const computeResumeTitle = (resume) => {
  const explicit = (resume.title || '').trim();
  if (explicit) return explicit;
  const name = (resume.fullName || '').trim();
  const role = (resume.professionalTitle || '').trim();
  if (name && role) return `${name} – ${role}`;
  if (name) return name;
  if (role) return role;
  return 'Untitled resume';
};

export function toApiPayload(resume) {
  // P1-1: normalize URL fields (trim + https://) at the save boundary so the
  // server always receives canonical URLs. This matches what the preview
  // renders (transformResume.js applies the same normalizeUrl).
  const r = normalizeResumeUrls(resume);
  const s = (v) => { if (v==null) return null; if (typeof v==='string') return v; try{return JSON.stringify(v);}catch{return null;} };
  const personalInfo = {
    fullName: r.fullName||'', professionalTitle: r.professionalTitle||'',
    email: r.email||'', phone: r.phone||'', location: r.location||'',
    linkedin: r.linkedin||'', github: r.github||'', portfolio: r.portfolio||'',
  };
  return {
    title:          computeResumeTitle(r),
    template:       r.template ?? 'modern',
    personalInfo:   s(personalInfo),
    summary:        r.summary ?? null,
    experience:     s(r.experience),
    education:      s(r.education),
    skills:         s(r.skills),
    projects:       s(r.projects),
    certifications: s(r.certifications),
    achievements:   s(r.achievements),
    languages:      s(r.languages),
    customSections: s(r.customSections),
    sectionsConfig: s(r.sectionsConfig),
    // Resume-only typography: persisted with the resume so export matches the
    // preview exactly. UI unit is pt; the API/stored unit is px — convert here.
    // Backend re-validates both (allow-list + 8.0–16.0px after V28).
    fontFamily: normaliseFontFamily(r.fontFamily),
    fontSize:   fontSizeToStoredPx(r.fontSize),
  };
}

/**
 * PHASE-1 DATA SAFETY: `opts.skipAuthRedirect` is forwarded to axios as
 * `skipAuthRedirect:true` on the request config. The response interceptor in
 * api.js reads this flag and suppresses the global 401→/login redirect for
 * that one call, so an expired session during autosave surfaces as a
 * rejected promise (caught by the editor) instead of a navigation that
 * would discard the user's unsaved edits.
 */
export const createResume = async (r, opts = {}) => {
  const { data } = await api.post('/api/resumes', toApiPayload(r), {
    skipAuthRedirect: Boolean(opts.skipAuthRedirect),
  });
  return fromApiResponse(data);
};
export const updateResume = async (id, r, opts = {}) => {
  const { data } = await api.put(`/api/resumes/${id}`, toApiPayload(r), {
    skipAuthRedirect: Boolean(opts.skipAuthRedirect),
  });
  return fromApiResponse(data);
};
export const getResumeById   = async (id)    => { const {data} = await api.get(`/api/resumes/${id}`); return fromApiResponse(data); };
export const getAllResumes    = async ()      => { const {data} = await api.get('/api/resumes'); return data.map(fromApiResponse); };
export const deleteResume    = async (id)    => api.delete(`/api/resumes/${id}`);
export const getResumeHistory= async (id)    => { const {data} = await api.get(`/api/resumes/${id}/history`); return data; };
export const restoreResumeSnapshot = async (id, sid) => { const {data} = await api.post(`/api/resumes/${id}/history/${sid}/restore`); return fromApiResponse(data); };
