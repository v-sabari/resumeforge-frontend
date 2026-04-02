import { useState } from 'react';
import { improveSummary, generateBullets, rewriteProfessionally, suggestSkills } from '../../services/aiService';
import { formatApiError } from '../../utils/helpers';
import { Alert } from '../common/Alert';
import { Loader } from '../common/Loader';
import { Icon } from '../icons/Icon';

const AI_ACTIONS = [
  { id: 'summary', label: 'Improve summary',         subLabel: 'Refine your pitch',      icon: 'sparkles' },
  { id: 'bullets', label: 'Generate bullets',         subLabel: 'Stronger impact lines',  icon: 'builder'  },
  { id: 'skills',  label: 'Suggest skills',           subLabel: 'Surface relevant skills',icon: 'check'    },
  { id: 'rewrite', label: 'Rewrite professionally',  subLabel: 'Cleaner tone & clarity', icon: 'magic'    },
];

export const AIActionPanel = ({ resume, setResume }) => {
  const [loading, setLoading]   = useState('');
  const [message, setMessage]   = useState('');
  const [variant, setVariant]   = useState('info');
  const exp0 = resume.experience?.[0];

  const run = async (id, fn) => {
    setLoading(id); setMessage('');
    try { await fn(); }
    catch (e) { setVariant('error'); setMessage(formatApiError(e, 'Could not complete this action.')); }
    finally { setLoading(''); }
  };

  const handlers = {
    summary: () => run('summary', async () => {
      const r = await improveSummary({ currentSummary: resume.summary, targetRole: resume.professionalTitle, skills: resume.skills, achievements: resume.achievements, highlights: exp0?.bullets || [] });
      const v = r?.result || r?.data?.result;
      if (v) { setResume((p) => ({ ...p, summary: v })); setVariant('success'); setMessage('Summary improved.'); }
    }),
    bullets: () => run('bullets', async () => {
      const r = await generateBullets({ role: exp0?.role, company: exp0?.company, responsibilities: exp0?.bullets || [], technologies: resume.skills || [], currentText: resume.summary });
      const items = r?.items || r?.data?.items || [];
      if (items.length) { setResume((p) => ({ ...p, experience: p.experience.map((x, i) => i === 0 ? { ...x, bullets: items } : x) })); setVariant('success'); setMessage('Stronger bullets generated for your latest role.'); }
    }),
    skills: () => run('skills', async () => {
      const r = await suggestSkills({ targetRole: resume.professionalTitle, currentSkills: resume.skills, experienceKeywords: resume.experience.flatMap((x) => [x.role, x.company, ...(x.bullets||[])]).filter(Boolean), projectKeywords: resume.projects.flatMap((x) => [x.name, x.description]).filter(Boolean) });
      const items = r?.items || r?.data?.items || [];
      if (items.length) { setResume((p) => ({ ...p, skills: items })); setVariant('success'); setMessage('Skills updated from AI suggestions.'); }
    }),
    rewrite: () => run('rewrite', async () => {
      const r = await rewriteProfessionally({ text: resume.summary, targetRole: resume.professionalTitle, tone: 'impactful' });
      const v = r?.result || r?.data?.result;
      if (v) { setResume((p) => ({ ...p, summary: v })); setVariant('success'); setMessage('Summary rewritten professionally.'); }
    }),
  };

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="kicker mb-1">AI copilot</p>
          <h3 className="panel-title">Polish content instantly</h3>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Icon name="sparkles" className="h-4 w-4" />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {AI_ACTIONS.map((a) => (
          <button key={a.id} type="button" disabled={Boolean(loading)}
            onClick={handlers[a.id]}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-3 text-left transition hover:border-slate-300 hover:bg-white hover:shadow-soft disabled:opacity-50">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-soft text-slate-600">
              <Icon name={a.icon} className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold text-slate-900 truncate">
                {loading === a.id ? 'Working…' : a.label}
              </span>
              <span className="block text-[10px] text-slate-400">{a.subLabel}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 min-h-8">
        {loading ? <Loader label="Calling AI service…" /> : <Alert variant={variant}>{message}</Alert>}
      </div>
    </div>
  );
};
