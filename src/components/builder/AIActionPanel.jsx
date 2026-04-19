import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  generateSummary,
  generateBullets,
  suggestSkills,
  rewriteText,
  getAtsScore,
  generateCoverLetter,
  tailorResume,
  optimizeLinkedIn,
  generateInterviewPrep,
  checkGrammar,
} from '../../services/aiService';
import { Alert } from '../common/Alert';
import { Loader } from '../common/Loader';
import { Icon } from '../icons/Icon';
import { formatApiError } from '../../utils/helpers';

/* ─── Action definitions ──────────────────────────────────────────── */
const FREE_ACTIONS = [
  { id: 'summary',       label: 'Write summary',    icon: 'text',     desc: 'Generate a professional ATS summary' },
  { id: 'bullets',       label: 'Write bullets',    icon: 'sparkles', desc: 'Craft 5 strong experience bullets'   },
  { id: 'skills',        label: 'Suggest skills',   icon: 'star',     desc: 'Get role-matched keyword skills'     },
  { id: 'rewrite',       label: 'Rewrite text',     icon: 'zap',      desc: 'Improve any text for ATS & clarity' },
  { id: 'grammar',       label: 'Grammar check',    icon: 'check',    desc: 'Catch errors and clarity issues'     },
  { id: 'ats',           label: 'ATS score',        icon: 'eye',      desc: '3/day free · unlimited on Premium'   },
  { id: 'linkedin',      label: 'LinkedIn',         icon: 'briefcase',desc: '1/day free · unlimited on Premium'   },
];

const PREMIUM_ACTIONS = [
  { id: 'cover',         label: 'Cover letter',     icon: 'export',   desc: 'Full cover letter for any role'      },
  { id: 'tailor',        label: 'Tailor resume',    icon: 'sparkles', desc: 'Rewrite for a specific job posting'  },
  { id: 'interview',     label: 'Interview prep',   icon: 'star',     desc: '5 questions + model answers'         },
];

/* ─── Helpers ────────────────────────────────────────────────────────── */
const PremiumBadge = () => (
  <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-50 px-1.5 py-0.5
                   text-[9px] font-semibold uppercase tracking-wide text-amber-700 border border-amber-200">
    Pro
  </span>
);

const ScoreBar = ({ score }) => {
  const color = score >= 90 ? 'bg-success-500'
              : score >= 75 ? 'bg-brand-500'
              : score >= 60 ? 'bg-warning-500'
              : 'bg-danger-500';
  return (
    <div className="mt-2 mb-3">
      <div className="flex justify-between text-xs text-ink-400 mb-1">
        <span>ATS Score</span>
        <span className="font-semibold text-ink-950">{score}/100</span>
      </div>
      <div className="h-2 w-full rounded-full bg-surface-200">
        <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────── */
export const AIActionPanel = ({ resume, setResume }) => {
  const { premium } = useAuth();
  const isPremium   = premium?.isPremium;

  const [active,   setActive]  = useState(null);
  const [loading,  setLoading] = useState(false);
  const [result,   setResult]  = useState(null);   // typed result object
  const [error,    setError]   = useState('');
  const [input,    setInput]   = useState('');      // free-text fields
  const [jd,       setJd]      = useState('');      // job description
  const [company,  setCompany] = useState('');

  const reset = () => { setResult(null); setError(''); setInput(''); };

  const run = async (id) => {
    setActive(id); setLoading(true); setResult(null); setError('');
    try {
      let res;
      switch (id) {

        /* ── Summary ─────────────────────────────────────── */
        case 'summary':
          res = await generateSummary({
            targetRole:     resume.professionalTitle || '',
            skills:         resume.skills            || [],
            achievements:   resume.achievements      || [],
            highlights:     [],
            currentSummary: resume.summary           || '',
          });
          setResult({ type: 'text', text: res?.text || '' });
          break;

        /* ── Bullets ─────────────────────────────────────── */
        case 'bullets': {
          const exp = (resume.experience || [])[0] || {};
          res = await generateBullets({
            role:             exp.role    || resume.professionalTitle || '',
            company:          exp.company || '',
            responsibilities: exp.bullets || [],
            technologies:     resume.skills || [],
            currentText:      '',
          });
          setResult({ type: 'list', items: res?.items || [] });
          break;
        }

        /* ── Skills ──────────────────────────────────────── */
        case 'skills':
          res = await suggestSkills({
            targetRole:         resume.professionalTitle || '',
            currentSkills:      resume.skills            || [],
            experienceKeywords: (resume.experience || []).flatMap(e => [e.role, e.company]).filter(Boolean),
            projectKeywords:    (resume.projects   || []).map(p => p.name).filter(Boolean),
          });
          setResult({ type: 'skills', items: res?.items || [] });
          break;

        /* ── Rewrite ─────────────────────────────────────── */
        case 'rewrite':
          if (!input.trim()) { setError('Please enter some text to rewrite.'); setLoading(false); return; }
          res = await rewriteText({ text: input, targetRole: resume.professionalTitle || '', tone: 'professional' });
          setResult({ type: 'text', text: res?.text || '' });
          break;

        /* ── Grammar check ───────────────────────────────── */
        case 'grammar':
          if (!input.trim()) { setError('Please enter some text to check.'); setLoading(false); return; }
          res = await checkGrammar({ text: input, context: 'general' });
          setResult({ type: 'grammar', data: res });
          break;

        /* ── ATS Score ───────────────────────────────────── */
        case 'ats':
          res = await getAtsScore({
            targetRole:       resume.professionalTitle || '',
            summary:          resume.summary           || '',
            skills:           resume.skills            || [],
            experienceBullets:(resume.experience || []).flatMap(e => e.bullets || []),
            achievements:     resume.achievements      || [],
            jobDescription:   jd || undefined,
          });
          setResult({ type: 'ats', data: res });
          break;

        /* ── LinkedIn ────────────────────────────────────── */
        case 'linkedin':
          res = await optimizeLinkedIn({
            currentRole:     resume.professionalTitle || '',
            targetRole:      resume.professionalTitle || '',
            currentHeadline: '',
            currentAbout:    resume.summary || '',
            topSkills:       (resume.skills || []).slice(0, 8),
            achievements:    resume.achievements || [],
          });
          setResult({ type: 'linkedin', data: res });
          break;

        /* ── Cover letter ────────────────────────────────── */
        case 'cover':
          res = await generateCoverLetter({
            candidateName:   resume.fullName         || '',
            targetRole:      resume.professionalTitle || '',
            companyName:     company                  || '',
            summary:         resume.summary           || '',
            topAchievements: resume.achievements      || [],
            skills:          (resume.skills || []).slice(0, 8),
            jobDescription:  jd || undefined,
            tone:            'professional',
          });
          setResult({ type: 'text', text: res?.text || '' });
          break;

        /* ── Tailor ──────────────────────────────────────── */
        case 'tailor':
          if (!jd.trim()) { setError('Please paste the job description to tailor your resume.'); setLoading(false); return; }
          res = await tailorResume({
            targetRole:             resume.professionalTitle || '',
            currentSummary:         resume.summary           || '',
            skills:                 resume.skills            || [],
            experienceBulletGroups: (resume.experience || []).slice(0, 3).map(e => e.bullets || []),
            jobDescription:         jd,
          });
          setResult({ type: 'tailor', data: res });
          break;

        /* ── Interview prep ──────────────────────────────── */
        case 'interview':
          res = await generateInterviewPrep({
            targetRole:      resume.professionalTitle || '',
            companyName:     company                  || '',
            summary:         resume.summary           || '',
            skills:          resume.skills            || [],
            topAchievements: resume.achievements      || [],
            jobDescription:  jd || undefined,
          });
          setResult({ type: 'interview', data: res });
          break;

        default: break;
      }
    } catch (e) {
      setError(formatApiError(e, 'AI request failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  /* ── Apply result to resume ─────────────────────────────────────── */
  const applyToResume = () => {
    if (!result) return;
    if (result.type === 'text'   && active === 'summary') setResume(p => ({ ...p, summary: result.text }));
    if (result.type === 'skills')                         setResume(p => ({ ...p, skills: result.items }));
    if (result.type === 'tailor' && result.data) {
      const d = result.data;
      setResume(p => ({
        ...p,
        summary:    d.tailoredSummary || p.summary,
        experience: (p.experience || []).map((exp, i) => ({
          ...exp,
          bullets: d.tailoredBulletGroups?.[i] || exp.bullets,
        })),
      }));
    }
    reset(); setActive(null);
  };

  /* ── Input fields for certain actions ──────────────────────────── */
  const needsTextInput    = ['rewrite', 'grammar'].includes(active) && !loading && !result;
  const needsJdInput      = ['ats', 'cover', 'tailor', 'interview'].includes(active) && !loading && !result;
  const needsCompanyInput = ['cover', 'interview'].includes(active) && !loading && !result;

  const allActions = [...FREE_ACTIONS, ...PREMIUM_ACTIONS];

  return (
    <div className="card p-5 space-y-4">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="kicker mb-0.5">AI Copilot</p>
          <h3 className="panel-title">Writing assistant</h3>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
          <Icon name="sparkles" className="h-4 w-4" />
        </div>
      </div>

      {/* Action grid */}
      {!loading && !result && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">Free tools</p>
          <div className="grid grid-cols-2 gap-1.5">
            {FREE_ACTIONS.map(({ id, label, icon }) => (
              <ActionBtn key={id} id={id} label={label} icon={icon}
                active={active} onClick={() => { reset(); setActive(id); }}
              />
            ))}
          </div>

          <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">
            Premium tools
            {!isPremium && (
              <a href="/pricing" className="ml-2 text-brand-600 hover:underline font-normal normal-case">
                Upgrade
              </a>
            )}
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {PREMIUM_ACTIONS.map(({ id, label, icon }) => (
              <ActionBtn key={id} id={id} label={label} icon={icon}
                active={active} isPremium locked={!isPremium}
                onClick={() => { if (!isPremium) return; reset(); setActive(id); }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Input fields */}
      {active && !loading && !result && (
        <div className="space-y-2">
          {needsTextInput && (
            <>
              <label className="label">
                {active === 'rewrite' ? 'Text to rewrite' : 'Text to check'}
              </label>
              <textarea className="input min-h-[80px] resize-none text-xs"
                value={input} onChange={e => setInput(e.target.value)}
                placeholder={active === 'rewrite'
                  ? 'Paste the text you want to improve…'
                  : 'Paste any resume text to check for errors…'
                }
              />
            </>
          )}

          {needsCompanyInput && (
            <>
              <label className="label">Company name (optional)</label>
              <input className="input text-xs" type="text"
                value={company} onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Google, Accenture, HDFC Bank"
              />
            </>
          )}

          {needsJdInput && (
            <>
              <label className="label">
                Job description
                {active === 'tailor' && <span className="text-danger-600 ml-1">*</span>}
                {active !== 'tailor' && <span className="text-ink-400 ml-1">(optional)</span>}
              </label>
              <textarea className="input min-h-[90px] resize-none text-xs"
                value={jd} onChange={e => setJd(e.target.value)}
                placeholder="Paste the job description here to get role-specific results…"
              />
            </>
          )}

          <button type="button" onClick={() => run(active)}
            className="btn-primary btn-sm w-full justify-center">
            <Icon name="sparkles" className="h-3.5 w-3.5" />
            {labelForAction(active)}
          </button>

          <button type="button" onClick={() => { reset(); setActive(null); }}
            className="btn-secondary btn-sm w-full justify-center text-xs">
            Cancel
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-4">
          <Loader label="AI is working…" className="justify-center" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="space-y-2">
          <Alert variant="error">{error}</Alert>
          <button type="button" onClick={() => { setError(''); }}
            className="btn-secondary btn-sm w-full justify-center">
            Try again
          </button>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <ResultPanel
          result={result}
          active={active}
          onApply={applyToResume}
          onCopy={() => navigator.clipboard.writeText(getResultText(result))}
          onReset={() => { reset(); setActive(null); }}
          canApply={['summary', 'skills', 'tailor'].includes(active)}
        />
      )}
    </div>
  );
};

/* ─── Sub-components ─────────────────────────────────────────────────── */

const ActionBtn = ({ id, label, icon, active, isPremium, locked, onClick }) => (
  <button type="button" onClick={onClick}
    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium
                transition-all text-left relative
                ${locked ? 'cursor-not-allowed opacity-60 border-surface-200 text-ink-400' :
                  active === id
                    ? 'border-brand-400 bg-brand-50 text-brand-700'
                    : 'border-surface-200 text-ink-500 hover:border-brand-200 hover:bg-brand-50/50'}`}>
    <Icon name={icon} className="h-3.5 w-3.5 shrink-0" />
    <span className="flex-1">{label}</span>
    {isPremium && <PremiumBadge />}
  </button>
);

const ResultPanel = ({ result, active, onApply, onCopy, onReset, canApply }) => (
  <div className="space-y-3">
    <div className="rounded-xl border border-surface-200 bg-surface-50 p-3 max-h-80 overflow-y-auto">
      <ResultContent result={result} active={active} />
    </div>
    <div className="flex flex-wrap gap-2">
      {canApply && (
        <button type="button" onClick={onApply}
          className="btn-primary btn-sm flex-1 justify-center">
          <Icon name="check" className="h-3.5 w-3.5" /> Apply to resume
        </button>
      )}
      <button type="button" onClick={onCopy}
        className="btn-secondary btn-sm flex-1 justify-center">
        Copy
      </button>
      <button type="button" onClick={onReset}
        className="btn-secondary btn-sm flex-1 justify-center">
        Back
      </button>
    </div>
  </div>
);

const ResultContent = ({ result, active }) => {
  switch (result.type) {

    case 'text':
      return <p className="text-xs text-ink-700 leading-relaxed whitespace-pre-wrap">{result.text}</p>;

    case 'list':
    case 'skills':
      return (
        <ul className="space-y-1.5">
          {result.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-ink-700">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );

    case 'grammar': {
      const { correctedText, issuesFound, issueCount, clean } = result.data;
      return (
        <div className="space-y-3">
          {clean ? (
            <div className="flex items-center gap-2 text-xs text-success-700">
              <Icon name="check" className="h-4 w-4 text-success-600" />
              No issues found — your text looks great!
            </div>
          ) : (
            <div className="text-xs text-warning-700 font-medium">
              {issueCount} issue{issueCount !== 1 ? 's' : ''} found
            </div>
          )}
          {issuesFound.length > 0 && (
            <ul className="space-y-1">
              {issuesFound.map((issue, i) => (
                <li key={i} className="text-xs text-ink-600 flex gap-1.5">
                  <span className="text-warning-500 shrink-0">→</span>{issue}
                </li>
              ))}
            </ul>
          )}
          {correctedText && !clean && (
            <>
              <p className="text-xs font-medium text-ink-500 mt-2">Corrected text:</p>
              <p className="text-xs text-ink-700 leading-relaxed whitespace-pre-wrap">{correctedText}</p>
            </>
          )}
        </div>
      );
    }

    case 'ats': {
      const { score, grade, matchedKeywords, missingKeywords, topFixes, summary } = result.data;
      return (
        <div className="space-y-3">
          <ScoreBar score={score} />
          <p className="text-xs font-semibold text-ink-700">Grade: {grade}</p>
          <p className="text-xs text-ink-500 leading-relaxed">{summary}</p>

          {topFixes?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">Top fixes:</p>
              <ol className="space-y-1">
                {topFixes.map((fix, i) => (
                  <li key={i} className="text-xs text-ink-600 flex gap-1.5">
                    <span className="font-semibold text-danger-500 shrink-0">{i + 1}.</span>{fix}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {missingKeywords?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">Missing keywords:</p>
              <div className="flex flex-wrap gap-1">
                {missingKeywords.map((kw, i) => (
                  <span key={i} className="rounded-full bg-danger-50 px-2 py-0.5 text-[10px] text-danger-700 border border-danger-100">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
          {matchedKeywords?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">Matched keywords:</p>
              <div className="flex flex-wrap gap-1">
                {matchedKeywords.map((kw, i) => (
                  <span key={i} className="rounded-full bg-success-50 px-2 py-0.5 text-[10px] text-success-700 border border-success-100">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    case 'linkedin': {
      const { optimizedHeadline, optimizedAbout, headlineTips } = result.data;
      return (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-ink-700 mb-1">Headline:</p>
            <p className="text-xs text-ink-700 leading-relaxed font-medium">{optimizedHeadline}</p>
            {headlineTips && <p className="text-xs text-ink-400 mt-1 italic">{headlineTips}</p>}
          </div>
          <div>
            <p className="text-xs font-medium text-ink-700 mb-1">About section:</p>
            <p className="text-xs text-ink-700 leading-relaxed whitespace-pre-wrap">{optimizedAbout}</p>
          </div>
        </div>
      );
    }

    case 'tailor': {
      const { tailoredSummary, suggestedSkillsToAdd, keywordsMissing } = result.data;
      return (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-ink-700 mb-1">Tailored summary:</p>
            <p className="text-xs text-ink-700 leading-relaxed">{tailoredSummary}</p>
          </div>
          {suggestedSkillsToAdd?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">Suggested skills to add:</p>
              <div className="flex flex-wrap gap-1">
                {suggestedSkillsToAdd.map((s, i) => (
                  <span key={i} className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] text-brand-700 border border-brand-100">{s}</span>
                ))}
              </div>
            </div>
          )}
          {keywordsMissing?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">Keywords missing from resume:</p>
              <div className="flex flex-wrap gap-1">
                {keywordsMissing.map((k, i) => (
                  <span key={i} className="rounded-full bg-warning-50 px-2 py-0.5 text-[10px] text-warning-700 border border-warning-100">{k}</span>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-ink-400">
            Click "Apply to resume" to update your summary and experience bullets.
          </p>
        </div>
      );
    }

    case 'interview': {
      const { questions, generalTips } = result.data;
      return (
        <div className="space-y-3">
          {generalTips && (
            <p className="text-xs text-ink-500 italic border-l-2 border-brand-200 pl-2">{generalTips}</p>
          )}
          {(questions || []).map((qa, i) => (
            <div key={i} className="border border-surface-200 rounded-lg p-2.5 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wide
                                 text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-full">
                  {qa.category}
                </span>
              </div>
              <p className="text-xs font-medium text-ink-800">{i + 1}. {qa.question}</p>
              <p className="text-xs text-ink-500 leading-relaxed">{qa.modelAnswer}</p>
            </div>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
};

/* ─── Utilities ──────────────────────────────────────────────────────── */

function labelForAction(id) {
  const labels = {
    summary:   'Generate summary',
    bullets:   'Generate bullets',
    skills:    'Suggest skills',
    rewrite:   'Rewrite with AI',
    grammar:   'Check grammar',
    ats:       'Analyze ATS score',
    linkedin:  'Optimize LinkedIn',
    cover:     'Generate cover letter',
    tailor:    'Tailor my resume',
    interview: 'Generate prep questions',
  };
  return labels[id] || 'Run AI';
}

function getResultText(result) {
  if (!result) return '';
  switch (result.type) {
    case 'text':      return result.text;
    case 'list':
    case 'skills':    return result.items.join('\n');
    case 'grammar':   return result.data?.correctedText || '';
    case 'ats':       return `Score: ${result.data?.score}/100 (${result.data?.grade})\n\n` +
                             `${result.data?.summary}\n\nTop fixes:\n` +
                             (result.data?.topFixes || []).map((f, i) => `${i + 1}. ${f}`).join('\n');
    case 'linkedin':  return `Headline:\n${result.data?.optimizedHeadline}\n\nAbout:\n${result.data?.optimizedAbout}`;
    case 'tailor':    return result.data?.tailoredSummary || '';
    case 'interview': return (result.data?.questions || [])
                             .map((q, i) => `Q${i+1}: ${q.question}\n\nA: ${q.modelAnswer}`)
                             .join('\n\n---\n\n');
    default:          return '';
  }
}
