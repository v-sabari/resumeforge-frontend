import api from './api';

// ── Original features ─────────────────────────────────────────────────────────

export const generateSummary = async (payload) => {
  const { data } = await api.post('/api/ai/summary', payload);
  return data; // { text: "..." }
};

export const generateBullets = async (payload) => {
  const { data } = await api.post('/api/ai/bullets', payload);
  return data; // { items: [...] }
};

export const suggestSkills = async (payload) => {
  const { data } = await api.post('/api/ai/skills', payload);
  return data; // { items: [...] }
};

export const rewriteText = async (payload) => {
  const { data } = await api.post('/api/ai/rewrite', payload);
  return data; // { text: "..." }
};

// ── New Phase 2 features ──────────────────────────────────────────────────────

/**
 * ATS score analysis.
 * Free: 3/day. Premium: unlimited.
 *
 * @param {object} payload - { targetRole, summary, skills[], experienceBullets[], achievements[], jobDescription? }
 * @returns {{ score, grade, matchedKeywords[], missingKeywords[], topFixes[], summary }}
 */
export const getAtsScore = async (payload) => {
  const { data } = await api.post('/api/ai/ats-score', payload);
  return data;
};

/**
 * Cover letter generation.
 * Premium only.
 *
 * @param {object} payload - { candidateName, targetRole, companyName, summary, topAchievements[], skills[], jobDescription?, tone? }
 * @returns {{ text: "..." }}
 */
export const generateCoverLetter = async (payload) => {
  const { data } = await api.post('/api/ai/cover-letter', payload);
  return data;
};

/**
 * Job-specific resume tailoring.
 * Premium only.
 *
 * @param {object} payload - { targetRole, currentSummary, skills[], experienceBulletGroups[][], jobDescription }
 * @returns {{ tailoredSummary, tailoredBulletGroups[][], suggestedSkillsToAdd[], keywordsMissing[] }}
 */
export const tailorResume = async (payload) => {
  const { data } = await api.post('/api/ai/tailor', payload);
  return data;
};

/**
 * LinkedIn headline and About section optimizer.
 * Free: 1/day. Premium: unlimited.
 *
 * @param {object} payload - { currentRole, targetRole, currentHeadline, currentAbout, topSkills[], achievements[] }
 * @returns {{ optimizedHeadline, optimizedAbout, headlineTips }}
 */
export const optimizeLinkedIn = async (payload) => {
  const { data } = await api.post('/api/ai/linkedin', payload);
  return data;
};

/**
 * Interview preparation: 5 questions with model answers.
 * Premium only.
 *
 * @param {object} payload - { targetRole, companyName, summary, skills[], topAchievements[], jobDescription? }
 * @returns {{ questions: [{ question, modelAnswer, category }], generalTips }}
 */
export const generateInterviewPrep = async (payload) => {
  const { data } = await api.post('/api/ai/interview-prep', payload);
  return data;
};

/**
 * Grammar and clarity check.
 * Free for all users.
 *
 * @param {object} payload - { text, context? }
 * @returns {{ correctedText, issuesFound[], issueCount, clean }}
 */
export const checkGrammar = async (payload) => {
  const { data } = await api.post('/api/ai/grammar-check', payload);
  return data;
};

// Default export with all methods
export const aiService = {
  generateSummary,
  generateBullets,
  suggestSkills,
  rewriteText,
  getATSScore: getAtsScore,
  generateCoverLetter,
  tailorResume,
  optimizeLinkedIn,
  generateInterviewPrep,
  checkGrammar,
};

export default aiService;

