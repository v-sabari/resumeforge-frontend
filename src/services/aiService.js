import api from './api';

// Professional resume summary generation
export const generateSummary = async (payload) => {
  const { data } = await api.post('/api/ai/summary', payload);
  return data;
};

export const generateBullets = async (payload) => {
  const { data } = await api.post('/api/ai/bullets', payload);
  return data;
};

export const suggestSkills = async (payload) => {
  const { data } = await api.post('/api/ai/skills', payload);
  return data;
};

export const rewriteText = async (payload) => {
  const { data } = await api.post('/api/ai/rewrite', payload);
  return data;
};

// ATS score analysis
export const getAtsScore = async (payload) => {
  const { data } = await api.post('/api/ai/ats-score', payload);
  return data;
};

// Cover letter generation
export const generateCoverLetter = async (payload) => {
  const { data } = await api.post('/api/ai/cover-letter', payload);
  return data;
};

// Job-specific resume tailoring
export const tailorResume = async (payload) => {
  const { data } = await api.post('/api/ai/tailor', payload);
  return data;
};

// LinkedIn headline and About section optimizer
export const optimizeLinkedIn = async (payload) => {
  const { data } = await api.post('/api/ai/linkedin', payload);
  return data;
};

// Interview preparation
export const generateInterviewPrep = async (payload) => {
  const { data } = await api.post('/api/ai/interview-prep', payload);
  return data;
};

// Grammar and clarity check
export const checkGrammar = async (payload) => {
  const { data } = await api.post('/api/ai/grammar-check', payload);
  return data;
};

// Premium Voice/Chat Resume Builder — one conversational turn.
// Sends the full in-memory conversation history + current collected context.
export const chatWithAI = async (payload) => {
  const { data } = await api.post('/api/ai/chat', payload);
  return data;
};

// Premium Voice/Chat Resume Builder — generate structured resume JSON
// from the collected conversation context.
export const generateResumeFromChat = async (payload) => {
  const { data } = await api.post('/api/ai/chat/generate', payload);
  return data;
};

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
  chatWithAI,
  generateResumeFromChat,
};

export default aiService;