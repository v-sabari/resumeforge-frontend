import { useState } from 'react';
import { improveSummary, generateBullets, rewriteProfessionally, suggestSkills } from '../../services/aiService';
import { formatApiError } from '../../utils/helpers';
import { Alert } from '../common/Alert';
import { Loader } from '../common/Loader';
import { Icon } from '../icons/Icon';

const actions = [
  { id: 'summary', label: 'Improve summary', icon: 'sparkles' },
  { id: 'bullets', label: 'Generate bullets', icon: 'builder' },
  { id: 'skills', label: 'Suggest skills', icon: 'check' },
  { id: 'rewrite', label: 'Rewrite professionally', icon: 'magic' },
];

export const AIActionPanel = ({ resume, setResume }) => {
  const [loading, setLoading] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('info');

  const latestExperience = resume.experience?.[0];

  const handleSummary = async () => {
    setLoading('summary');
    setMessage('');
    try {
      const response = await improveSummary({
        currentSummary: resume.summary,
        targetRole: resume.professionalTitle,
        skills: resume.skills,
        achievements: resume.achievements,
        highlights: latestExperience?.bullets || [],
      });
      const nextSummary = response?.result || response?.data?.result;
      if (nextSummary) {
        setResume((prev) => ({ ...prev, summary: nextSummary }));
        setVariant('success');
        setMessage('Summary improved successfully.');
      }
    } catch (error) {
      setVariant('error');
      setMessage(formatApiError(error, 'Could not improve summary.'));
    } finally {
      setLoading('');
    }
  };

  const handleBullets = async () => {
    setLoading('bullets');
    setMessage('');
    try {
      const response = await generateBullets({
        role: latestExperience?.role,
        company: latestExperience?.company,
        responsibilities: latestExperience?.bullets || [],
        technologies: resume.skills || [],
        currentText: resume.summary,
      });
      const bullets = response?.items || response?.data?.items || [];
      if (bullets.length) {
        setResume((prev) => ({
          ...prev,
          experience: prev.experience.map((item, index) => (index === 0 ? { ...item, bullets } : item)),
        }));
        setVariant('success');
        setMessage('Generated stronger bullets for your latest role.');
      }
    } catch (error) {
      setVariant('error');
      setMessage(formatApiError(error, 'Could not generate bullets.'));
    } finally {
      setLoading('');
    }
  };

  const handleSkills = async () => {
    setLoading('skills');
    setMessage('');
    try {
      const response = await suggestSkills({
        targetRole: resume.professionalTitle,
        currentSkills: resume.skills,
        experienceKeywords: resume.experience.flatMap((item) => [item.role, item.company, ...(item.bullets || [])]).filter(Boolean),
        projectKeywords: resume.projects.flatMap((item) => [item.name, item.description]).filter(Boolean),
      });
      const skills = response?.items || response?.data?.items || [];
      if (skills.length) {
        setResume((prev) => ({ ...prev, skills }));
        setVariant('success');
        setMessage('Skills refreshed from AI suggestions.');
      }
    } catch (error) {
      setVariant('error');
      setMessage(formatApiError(error, 'Could not suggest skills.'));
    } finally {
      setLoading('');
    }
  };

  const handleRewrite = async () => {
    setLoading('rewrite');
    setMessage('');
    try {
      const response = await rewriteProfessionally({
        text: resume.summary,
        targetRole: resume.professionalTitle,
        tone: 'impactful',
      });
      const rewritten = response?.result || response?.data?.result;
      if (rewritten) {
        setResume((prev) => ({ ...prev, summary: rewritten }));
        setVariant('success');
        setMessage('Summary rewritten professionally.');
      }
    } catch (error) {
      setVariant('error');
      setMessage(formatApiError(error, 'Could not rewrite content.'));
    } finally {
      setLoading('');
    }
  };

  const handlers = {
    summary: handleSummary,
    bullets: handleBullets,
    skills: handleSkills,
    rewrite: handleRewrite,
  };

  return (
    <div className="card p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">AI copilot</p>
          <h3 className="mt-2 panel-title">Polish content without leaving the builder</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Use your existing backend AI routes with cleaner prompts and a faster action tray.</p>
        </div>
        <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
          <Icon name="sparkles" className="h-5 w-5" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white hover:text-slate-950 disabled:opacity-60"
            onClick={handlers[action.id]}
            disabled={Boolean(loading)}
          >
            <span className="flex items-center gap-3">
              <span className="rounded-xl bg-white p-2 text-slate-700 shadow-sm"><Icon name={action.icon} className="h-4 w-4" /></span>
              {loading === action.id ? 'Working…' : action.label}
            </span>
            <Icon name="arrowRight" className="h-4 w-4" />
          </button>
        ))}
      </div>

      <div className="mt-4 min-h-10">{loading ? <Loader label="Talking to the AI service..." /> : <Alert variant={variant}>{message}</Alert>}</div>
    </div>
  );
};
