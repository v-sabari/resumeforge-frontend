import { useState } from 'react';
import { improveSummary, generateBullets, rewriteProfessionally, suggestSkills } from '../../services/aiService';
import { formatApiError } from '../../utils/helpers';
import { Alert } from '../common/Alert';
import { Loader } from '../common/Loader';
import { Icon } from '../icons/Icon';

const actions = [
  { id: 'summary', label: 'Improve summary', icon: 'sparkles', desc: 'Refine your professional summary' },
  { id: 'bullets', label: 'Generate bullets', icon: 'builder', desc: 'Stronger experience bullets' },
  { id: 'skills', label: 'Suggest skills', icon: 'check', desc: 'Surface relevant skills' },
  { id: 'rewrite', label: 'Rewrite copy', icon: 'magic', desc: 'Professional tone & clarity' },
];

export const AIActionPanel = ({ resume, setResume }) => {
  const [loading, setLoading] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('info');

  const latestExperience = resume.experience?.[0];

  const handleSummary = async () => {
    setLoading('summary'); setMessage('');
    try {
      const response = await improveSummary({
        currentSummary: resume.summary, targetRole: resume.professionalTitle,
        skills: resume.skills, achievements: resume.achievements,
        highlights: latestExperience?.bullets || [],
      });
      const next = response?.result || response?.data?.result;
      if (next) { setResume((p) => ({ ...p, summary: next })); setVariant('success'); setMessage('Summary improved.'); }
    } catch (e) { setVariant('error'); setMessage(formatApiError(e, 'Could not improve summary.')); }
    finally { setLoading(''); }
  };

  const handleBullets = async () => {
    setLoading('bullets'); setMessage('');
    try {
      const response = await generateBullets({
        role: latestExperience?.role, company: latestExperience?.company,
        responsibilities: latestExperience?.bullets || [], technologies: resume.skills || [],
        currentText: resume.summary,
      });
      const bullets = response?.items || response?.data?.items || [];
      if (bullets.length) {
        setResume((p) => ({ ...p, experience: p.experience.map((item, i) => i === 0 ? { ...item, bullets } : item) }));
        setVariant('success'); setMessage('Generated stronger bullets for your latest role.');
      }
    } catch (e) { setVariant('error'); setMessage(formatApiError(e, 'Could not generate bullets.')); }
    finally { setLoading(''); }
  };

  const handleSkills = async () => {
    setLoading('skills'); setMessage('');
    try {
      const response = await suggestSkills({
        targetRole: resume.professionalTitle, currentSkills: resume.skills,
        experienceKeywords: resume.experience.flatMap((i) => [i.role, i.company, ...(i.bullets || [])]).filter(Boolean),
        projectKeywords: resume.projects.flatMap((i) => [i.name, i.description]).filter(Boolean),
      });
      const skills = response?.items || response?.data?.items || [];
      if (skills.length) { setResume((p) => ({ ...p, skills })); setVariant('success'); setMessage('Skills refreshed from AI suggestions.'); }
    } catch (e) { setVariant('error'); setMessage(formatApiError(e, 'Could not suggest skills.')); }
    finally { setLoading(''); }
  };

  const handleRewrite = async () => {
    setLoading('rewrite'); setMessage('');
    try {
      const response = await rewriteProfessionally({ text: resume.summary, targetRole: resume.professionalTitle, tone: 'impactful' });
      const rewritten = response?.result || response?.data?.result;
      if (rewritten) { setResume((p) => ({ ...p, summary: rewritten })); setVariant('success'); setMessage('Summary rewritten professionally.'); }
    } catch (e) { setVariant('error'); setMessage(formatApiError(e, 'Could not rewrite content.')); }
    finally { setLoading(''); }
  };

  const handlers = { summary: handleSummary, bullets: handleBullets, skills: handleSkills, rewrite: handleRewrite };

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">AI copilot</p>
          <h3 className="panel-title mt-1">Polish content without leaving the builder</h3>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon name="sparkles" className="h-4 w-4" />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {actions.map((action) => (
          <button key={action.id} type="button"
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-left text-sm transition hover:border-slate-300 hover:bg-white hover:shadow-sm disabled:opacity-50"
            onClick={handlers[action.id]} disabled={Boolean(loading)}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm text-slate-600">
              <Icon name={action.icon} className="h-3.5 w-3.5" />
            </span>
            <span>
              <span className="block text-xs font-semibold text-slate-900">
                {loading === action.id ? 'Working…' : action.label}
              </span>
              <span className="block text-[10px] text-slate-500">{action.desc}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 min-h-8">
        {loading ? <Loader label="Talking to AI service..." /> : <Alert variant={variant}>{message}</Alert>}
      </div>
    </div>
  );
};
