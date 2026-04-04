import { useState } from 'react';
import { generateSummary, generateBullets, suggestSkills, rewriteText } from '../../services/aiService';
import { Alert } from '../common/Alert';
import { Loader } from '../common/Loader';
import { Icon } from '../icons/Icon';
import { formatApiError } from '../../utils/helpers';

const actions = [
  { id: 'summary', label: 'Write summary',   icon: 'text',     desc: 'AI-generate a professional summary' },
  { id: 'bullets', label: 'Write bullets',   icon: 'sparkles', desc: 'Craft strong experience bullets'    },
  { id: 'skills',  label: 'Suggest skills',  icon: 'star',     desc: 'Get role-matched skill keywords'    },
  { id: 'rewrite', label: 'Rewrite text',    icon: 'zap',      desc: 'Improve any text you select'       },
];

export const AIActionPanel = ({ resume, setResume }) => {
  const [active,  setActive]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState('');
  const [error,   setError]   = useState('');
  const [input,   setInput]   = useState('');

  const run = async (id) => {
    setActive(id); setLoading(true); setResult(''); setError('');
    try {
      switch (id) {
        case 'summary': {
          const res = await generateSummary({
            targetRole:     resume.professionalTitle || '',
            skills:         resume.skills || [],
            achievements:   resume.achievements || [],
            highlights:     [],
            currentSummary: resume.summary || '',
          });
          setResult(res?.text || '');
          break;
        }
        case 'bullets': {
          const exp = (resume.experience || [])[0] || {};
          const res = await generateBullets({
            role:             exp.role || resume.professionalTitle || '',
            company:          exp.company || '',
            responsibilities: (exp.bullets || []).filter(Boolean),
            technologies:     resume.skills || [],
            currentText:      '',
          });
          setResult((res?.items || []).join('\n'));
          break;
        }
        case 'skills': {
          const res = await suggestSkills({
            targetRole:         resume.professionalTitle || '',
            currentSkills:      resume.skills || [],
            experienceKeywords: (resume.experience || []).flatMap((e) => [e.role, e.company]).filter(Boolean),
            projectKeywords:    (resume.projects  || []).map((p) => p.name).filter(Boolean),
          });
          setResult((res?.items || []).join(', '));
          break;
        }
        case 'rewrite': {
          if (!input.trim()) { setError('Please enter some text to rewrite.'); setLoading(false); return; }
          const res = await rewriteText({
            text:       input,
            targetRole: resume.professionalTitle || '',
            tone:       'professional',
          });
          setResult(res?.text || '');
          break;
        }
        default: break;
      }
    } catch (e) {
      setError(formatApiError(e, 'AI request failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const applyResult = () => {
    if (!result) return;
    switch (active) {
      case 'summary': setResume((p) => ({ ...p, summary: result })); break;
      case 'skills':  setResume((p) => ({ ...p, skills: result.split(',').map((s) => s.trim()).filter(Boolean) })); break;
      default: break;
    }
    setResult(''); setActive(null);
  };

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="kicker mb-0.5">AI Copilot</p>
          <h3 className="panel-title">Writing assistance</h3>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
          <Icon name="sparkles" className="h-4 w-4" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {actions.map(({ id, label, icon }) => (
          <button key={id} type="button"
            onClick={() => run(id)}
            disabled={loading}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-all text-left
              ${active === id
                ? 'border-brand-400 bg-brand-50 text-brand-700'
                : 'border-surface-200 text-ink-500 hover:border-brand-200 hover:bg-brand-50/50'}`}>
            <Icon name={icon} className="h-3.5 w-3.5 shrink-0" />
            {label}
          </button>
        ))}
      </div>

      {active === 'rewrite' && !loading && !result && (
        <div className="mb-3">
          <label className="label">Text to rewrite</label>
          <textarea className="input min-h-20 resize-none text-xs"
            value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Paste the text you want to improve…" />
          <button type="button" onClick={() => run('rewrite')}
            className="btn-primary btn-sm mt-2 w-full justify-center">
            Rewrite with AI
          </button>
        </div>
      )}

      {loading && <Loader label="AI is writing…" className="my-3" />}

      {error && <Alert variant="error" className="mb-3">{error}</Alert>}

      {result && !loading && (
        <div className="rounded-xl border border-surface-200 bg-surface-50 p-3">
          <p className="text-xs text-ink-600 leading-relaxed whitespace-pre-wrap mb-3">{result}</p>
          <div className="flex gap-2">
            {(active === 'summary' || active === 'skills') && (
              <button type="button" onClick={applyResult} className="btn-primary btn-sm flex-1 justify-center">
                <Icon name="check" className="h-3.5 w-3.5" /> Apply
              </button>
            )}
            <button type="button"
              onClick={() => { navigator.clipboard.writeText(result); }}
              className="btn-secondary btn-sm flex-1 justify-center">
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
