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
  const [input,    setInput]   = useState('');      // free-text fields (rewrite/grammar)
  const [jd,       setJd]      = useState('');      // job description
  const [company,  setCompany] = useState('');

  /* ── Summary form state ─────────────────────────────────────── */
  const [summaryWho,     setSummaryWho]     = useState('');   // Who you are
  const [summaryRole,    setSummaryRole]    = useState('');   // Education / current role
  const [summarySkills,  setSummarySkills]  = useState('');   // Strongest technical skills
  const [summaryStrengths, setSummaryStrengths] = useState(''); // Relevant strengths
  const [summaryTarget,  setSummaryTarget]  = useState('');   // Target job role
  const [summaryContribute, setSummaryContribute] = useState(''); // What you can contribute
  const [summaryProjects, setSummaryProjects] = useState(''); // Relevant experience/projects

  /* ── Bullets form state (BULLETS-01) ─────────────────────────── */
  const [bulletSectionType,  setBulletSectionType]  = useState('Work Experience');
  const [bulletRole,         setBulletRole]         = useState('');
  const [bulletCompany,      setBulletCompany]      = useState('');
  const [bulletDescription,  setBulletDescription]  = useState('');
  const [bulletTech,         setBulletTech]         = useState('');
  const [bulletOutcome,      setBulletOutcome]      = useState('');
  const [bulletMetrics,      setBulletMetrics]      = useState('');
  const [bulletCount,        setBulletCount]        = useState(3);

  const reset = () => {
    setResult(null);
    setError('');
    setInput('');
    setSummaryWho('');
    setSummaryRole('');
    setSummarySkills('');
    setSummaryStrengths('');
    setSummaryTarget('');
    setSummaryContribute('');
    setSummaryProjects('');
    setBulletSectionType('Work Experience');
    setBulletRole('');
    setBulletCompany('');
    setBulletDescription('');
    setBulletTech('');
    setBulletOutcome('');
    setBulletMetrics('');
    setBulletCount(3);
  };

  const run = async (id) => {
    setActive(id); setLoading(true); setResult(null); setError('');
    try {
      let res;
      switch (id) {

        /* ── Summary ─────────────────────────────────────── */
        case 'summary': {
          const effectiveTargetRole = summaryTarget.trim() || resume.professionalTitle || '';
          const effectiveSkills = summarySkills.trim()
            ? summarySkills.split(',').map(s => s.trim()).filter(Boolean)
            : (resume.skills || []);

          if (!summaryWho.trim()) {
            setError('Please tell us who you are (e.g. your background or student status).');
            setLoading(false); return;
          }
          if (effectiveSkills.length === 0) {
            setError('Please list at least one of your strongest skills.');
            setLoading(false); return;
          }
          if (!effectiveTargetRole) {
            setError('Please enter your target job role.');
            setLoading(false); return;
          }

          res = await generateSummary({
            whoYouAre:        summaryWho.trim(),
            educationOrRole:  summaryRole.trim(),
            targetRole:       effectiveTargetRole,
            skills:           effectiveSkills,
            strengths:        summaryStrengths.trim(),
            contribution:     summaryContribute.trim(),
            relevantProjects: summaryProjects.trim(),
            achievements:     resume.achievements || [],
          });
          setResult({ type: 'text', text: res?.text || '' });
          break;
        }

        /* ── Bullets (BULLETS-01) ─────────────────────────────── */
        case 'bullets': {
          // Validate the fields the AI actually needs before calling.
          const effRole = bulletRole.trim() || resume.professionalTitle || '';
          const effTech = bulletTech.trim()
            ? bulletTech.split(',').map(s => s.trim()).filter(Boolean)
            : [];

          if (!bulletDescription.trim()) {
            setError('Please describe what you did. This is required to write meaningful bullet points.');
            setLoading(false); return;
          }
          if (!effRole) {
            setError('Please enter your role / position (or set your professional title).');
            setLoading(false); return;
          }
          if (bulletDescription.trim().length < 10) {
            setError('Please provide a bit more detail about what you did (at least a sentence).');
            setLoading(false); return;
          }

          res = await generateBullets({
            sectionType:  bulletSectionType,
            role:         effRole,
            company:      bulletCompany.trim(),
            description:  bulletDescription.trim(),
            technologies: effTech,
            outcome:      bulletOutcome.trim(),
            metrics:      bulletMetrics.trim(),
            numBullets:   bulletCount,
          });

          // Response shape: { bullets: [{ text, keywords }] } (BULLETS-01).
          const bullets = Array.isArray(res?.bullets)
            ? res.bullets
            : (Array.isArray(res?.items)
                ? res.items.map(t => (typeof t === 'string' ? { text: t, keywords: [] } : t))
                : []);
          setResult({ type: 'bullets', items: bullets });
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

          {/* Summary form */}
          {active === 'summary' && !loading && !result && (
            <>
              <p className="label text-xs font-medium text-ink-600 uppercase tracking-wide mb-2">
                Tell us about yourself
              </p>
              <div className="space-y-3">
                <div>
                  <label className="label text-xs">
                    Who you are <span className="text-danger-600">*</span>
                  </label>
                  <textarea
                    className="input min-h-[50px] resize-none text-xs"
                    value={summaryWho} onChange={e => setSummaryWho(e.target.value)}
                    placeholder="e.g. Computer Science Engineering student"
                  />
                </div>
                <div>
                  <label className="label text-xs">Education / current role</label>
                  <textarea
                    className="input min-h-[50px] resize-none text-xs"
                    value={summaryRole} onChange={e => setSummaryRole(e.target.value)}
                    placeholder="e.g. B.Tech CSE, Final Year"
                  />
                </div>
                <div>
                  <label className="label text-xs">
                    Strongest technical skills <span className="text-danger-600">*</span>
                  </label>
                  <textarea
                    className="input min-h-[50px] resize-none text-xs"
                    value={summarySkills} onChange={e => setSummarySkills(e.target.value)}
                    placeholder="e.g. Java, SQL, React, Spring Boot (comma-separated)"
                  />
                </div>
                <div>
                  <label className="label text-xs">Relevant strengths</label>
                  <textarea
                    className="input min-h-[50px] resize-none text-xs"
                    value={summaryStrengths} onChange={e => setSummaryStrengths(e.target.value)}
                    placeholder="e.g. Problem-solving, OOP, database fundamentals"
                  />
                </div>
                <div>
                  <label className="label text-xs">
                    Target job role
                    {!resume.professionalTitle && <span className="text-danger-600 ml-1">*</span>}
                  </label>
                  <textarea
                    className="input min-h-[50px] resize-none text-xs"
                    value={summaryTarget} onChange={e => setSummaryTarget(e.target.value)}
                    placeholder={resume.professionalTitle
                      ? `Optional — defaults to "${resume.professionalTitle}"`
                      : 'e.g. Java Developer, Software Developer'}
                  />
                </div>
                <div>
                  <label className="label text-xs">What you can contribute</label>
                  <textarea
                    className="input min-h-[50px] resize-none text-xs"
                    value={summaryContribute} onChange={e => setSummaryContribute(e.target.value)}
                    placeholder="e.g. Build maintainable applications and contribute to software development projects"
                  />
                </div>
                <div>
                  <label className="label text-xs">Relevant experience or projects (optional)</label>
                  <textarea
                    className="input min-h-[50px] resize-none text-xs"
                    value={summaryProjects} onChange={e => setSummaryProjects(e.target.value)}
                    placeholder="Optional — mention only if you have relevant projects or experience"
                  />
                </div>
              </div>
            </>
          )}

          {/* Bullets form (BULLETS-01) */}
          {active === 'bullets' && !loading && !result && (
            <>
              <p className="label text-xs font-medium text-ink-600 uppercase tracking-wide mb-2">
                Describe your experience
              </p>
              <div className="space-y-3">
                <div>
                  <label className="label text-xs">
                    Section type <span className="text-danger-600">*</span>
                  </label>
                  <select
                    className="input text-xs"
                    value={bulletSectionType}
                    onChange={e => setBulletSectionType(e.target.value)}
                  >
                    <option>Work Experience</option>
                    <option>Internship</option>
                    <option>Project</option>
                    <option>Achievement</option>
                    <option>Leadership / Responsibility</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="label text-xs">
                    Role / Position
                    {!resume.professionalTitle && <span className="text-danger-600 ml-1">*</span>}
                  </label>
                  <input
                    className="input text-xs"
                    type="text"
                    value={bulletRole}
                    onChange={e => setBulletRole(e.target.value)}
                    placeholder={resume.professionalTitle
                      ? `Optional — defaults to "${resume.professionalTitle}"`
                      : 'e.g. Java Developer Intern'}
                  />
                </div>
                <div>
                  <label className="label text-xs">Organization / Company (optional)</label>
                  <input
                    className="input text-xs"
                    type="text"
                    value={bulletCompany}
                    onChange={e => setBulletCompany(e.target.value)}
                    placeholder="e.g. ABC Tech Solutions"
                  />
                </div>
                <div>
                  <label className="label text-xs">
                    What did you do? <span className="text-danger-600">*</span>
                  </label>
                  <textarea
                    className="input min-h-[70px] resize-none text-xs"
                    value={bulletDescription}
                    onChange={e => setBulletDescription(e.target.value)}
                    placeholder="Describe your actual work or responsibility. e.g. Built a student management application using Java and MySQL to manage student records."
                  />
                </div>
                <div>
                  <label className="label text-xs">Technologies / Tools Used</label>
                  <input
                    className="input text-xs"
                    type="text"
                    value={bulletTech}
                    onChange={e => setBulletTech(e.target.value)}
                    placeholder="Only the ones you actually used — comma separated. e.g. Java, MySQL"
                  />
                </div>
                <div>
                  <label className="label text-xs">Result / Outcome (optional)</label>
                  <textarea
                    className="input min-h-[50px] resize-none text-xs"
                    value={bulletOutcome}
                    onChange={e => setBulletOutcome(e.target.value)}
                    placeholder="What was achieved, improved, built, fixed, or delivered?"
                  />
                </div>
                <div>
                  <label className="label text-xs">Metrics (optional)</label>
                  <input
                    className="input text-xs"
                    type="text"
                    value={bulletMetrics}
                    onChange={e => setBulletMetrics(e.target.value)}
                    placeholder="Only real numbers you can back up. e.g. reduced response time from 2s to 800ms"
                  />
                </div>
                <div>
                  <label className="label text-xs">Number of bullet points</label>
                  <select
                    className="input text-xs"
                    value={bulletCount}
                    onChange={e => setBulletCount(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
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
        {result.type === 'bullets' ? 'Copy all' : 'Copy'}
      </button>
      <button type="button" onClick={onReset}
        className="btn-secondary btn-sm flex-1 justify-center">
        Back
      </button>
    </div>
  </div>
);

const ResultContent = ({ result }) => {
  switch (result.type) {

    case 'text':
      return <p className="text-xs text-ink-700 leading-relaxed whitespace-pre-wrap">{result.text}</p>;

    // BULLETS-01: each bullet has { text, keywords }. Renders with a
    // copy-per-bullet button and inline keyword chips.
    case 'bullets':
      return (
        <div className="space-y-2.5">
          {(result.items || []).map((b, i) => {
            const text = typeof b === 'string' ? b : b?.text || '';
            const keywords = typeof b === 'object' && Array.isArray(b?.keywords) ? b.keywords : [];
            return (
              <div key={i} className="group rounded-lg border border-surface-200 bg-white p-2.5 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-ink-700 leading-relaxed">{text}</p>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(text)}
                    className="shrink-0 rounded-lg border border-surface-200 px-2 py-1 text-[10px] font-medium text-ink-500 hover:border-brand-300 hover:text-brand-600"
                  >
                    Copy
                  </button>
                </div>
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {keywords.map((k, ki) => (
                      <span key={ki} className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] text-brand-700 border border-brand-100">
                        {k}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );

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
      const data = result.data && typeof result.data === 'object' ? result.data : {};
      const { correctedText, issueCount, clean } = data;
      const issuesFound = Array.isArray(data.issuesFound) ? data.issuesFound : [];
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
    case 'bullets':   return (result.items || [])
                             .map(b => `• ${typeof b === 'string' ? b : b?.text || ''}`)
                             .join('\n');
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