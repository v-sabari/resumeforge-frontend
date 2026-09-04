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

  /* ── Rewrite Text form state (REWRITE-01) ─────────────────────── */
  const [rewriteSection, setRewriteSection] = useState('Summary');   // Summary / Experience / Project / Education / Skills / Other
  const [rewriteStyle,   setRewriteStyle]   = useState('Professional'); // Professional / Concise / ATS-Friendly / Stronger wording

  /* ── Grammar Check form state (GRAMMAR-01) ──────────────────── */
  const [grammarSection, setGrammarSection] = useState('Summary'); // Summary / Experience / Project / Education / Skills / Other

  /* ── LinkedIn Optimization form state (LINKEDIN-01) ────────── */
  const [linkedinResumeInfo,      setLinkedinResumeInfo]      = useState(''); // full resume/profile details
  const [linkedinTargetRole,      setLinkedinTargetRole]      = useState(''); // target job role
  const [linkedinExistingContent, setLinkedinExistingContent] = useState(''); // optional existing LinkedIn content

  /* ── Cover Letter form state (COVER-01) ───────────────────── */
  const [coverResumeInfo, setCoverResumeInfo] = useState('');   // full resume/profile details
  const [coverJobTitle,   setCoverJobTitle]   = useState('');   // target job title
  const [coverCompany,    setCoverCompany]    = useState('');   // company name (optional)
  const [coverJd,         setCoverJd]         = useState('');   // job description
  const [coverAdditional, setCoverAdditional] = useState('');   // additional info (optional)

  /* ── Tailor Resume form state (TAILOR-01) ─────────────────── */
  const [tailorResumeInfo, setTailorResumeInfo] = useState(''); // complete resume content
  const [tailorJobTitle,   setTailorJobTitle]   = useState(''); // target job title (optional)

  /* ── Suggest Skills form state (SKILLS-02) ─────────────────── */
  const [skillCurrent,       setSkillCurrent]       = useState('');  // current skills (comma)
  const [skillResumeInfo,    setSkillResumeInfo]    = useState('');  // resume info textarea
  const [skillRole,          setSkillRole]          = useState('');  // target job role
  const [skillJobDesc,       setSkillJobDesc]       = useState('');  // job description textarea
  const [skillCategory,      setSkillCategory]      = useState('All Relevant Skills');

  const reset = () => {
    // Always return to the idle state when (re)selecting an action or clearing
    // results. Not resetting `loading` here is what caused the Suggest Skills
    // form to be skipped: if loading was left true, the form's `!loading` guard
    // failed and the panel went straight to the AI loading screen. (SKILLS-04)
    setLoading(false);
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
    setRewriteSection('Summary');
    setRewriteStyle('Professional');
    setGrammarSection('Summary');
    setSkillCurrent('');
    setSkillResumeInfo('');
    setSkillRole('');
    setSkillJobDesc('');
    setSkillCategory('All Relevant Skills');
    setLinkedinResumeInfo('');
    setLinkedinTargetRole('');
    setLinkedinExistingContent('');
    setCoverResumeInfo('');
    setCoverJobTitle('');
    setCoverCompany('');
    setCoverJd('');
    setCoverAdditional('');
    setTailorResumeInfo('');
    setTailorJobTitle('');
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

        /* ── Suggest Skills (SKILLS-02) ───────────────────────── */
        case 'skills': {
          const effSkills = skillCurrent.trim()
            ? skillCurrent.split(',').map(s => s.trim()).filter(Boolean)
            : (resume.skills || []);

          if (effSkills.length === 0 && !skillResumeInfo.trim()) {
            setError('Please enter at least one current skill or paste some resume information so the AI can analyze your background.');
            setLoading(false); return;
          }

          res = await suggestSkills({
            targetRole:        skillRole.trim() || resume.professionalTitle || '',
            currentSkills:     effSkills,
            resumeInformation: skillResumeInfo.trim(),
            jobDescription:    skillJobDesc.trim() || undefined,
            skillCategory:     skillCategory,
          });

          // Response shape (SKILLS-03): canonical keys with defensive aliases so
          // skill sections render even if the model drifts on a key name.
          // Canonical: existingSkills, demonstratedSkills, jobRelevantSkills, recommendedSkills.
          // Aliases accepted: jobRelevantSkillsNotDemonstrated, recommendedResumeSkills.
          setResult({
            type: 'skills',
            data: {
              existingSkills:   normalizeSkills(skillPick(res, ['existingSkills'])),
              demonstratedSkills: normalizeSkills(skillPick(res, ['demonstratedSkills'])),
              jobRelevantSkills:  normalizeSkills(skillPick(res, ['jobRelevantSkills', 'jobRelevantSkillsNotDemonstrated'])),
              // recommendedSkills must stay a flat string array (used directly as
              // chips and written into resume.skills on Apply). Wrapping it in
              // normalizeSkills turned it into [{name,reason}] objects, which the
              // editor/preview then tried to render as React children → error #31.
              recommendedSkills:  flatStrings(skillPick(res, ['recommendedSkills', 'recommendedResumeSkills'])),
            },
          });
          break;
        }

        /* ── Rewrite ─────────────────────────────────────── */
        case 'rewrite': {
          if (!input.trim()) { setError('Please enter some text to rewrite.'); setLoading(false); return; }
          // REWRITE-01: send the original text together with the chosen resume
          // section and rewrite style. The backend rewrites only this text with
          // strict no-invention rules.
          res = await rewriteText({
            text:          input,
            resumeSection: rewriteSection,
            rewriteStyle:  rewriteStyle,
          });
          const rewritten = (typeof res?.rewrittenText === 'string' && res.rewrittenText.trim())
            ? res.rewrittenText
            : (typeof res?.text === 'string' && res.text.trim() ? res.text : '');
          setResult({
            type: 'rewrite',
            data: { originalText: input, rewrittenText: rewritten },
          });
          break;
        }

        /* ── Grammar check (GRAMMAR-01) ────────────────────── */
        case 'grammar': {
          if (!input.trim()) { setError('Please enter some text to check.'); setLoading(false); return; }
          const originalText = input.trim();
          res = await checkGrammar({ text: originalText, grammarSection });
          // GRAMMAR-01: preserve the original so we can always fall back to it if
          // the AI omits correctedText, and to display original vs corrected side
          // by side.
          setResult({ type: 'grammar', data: {
            originalText,
            correctedText: (typeof res?.correctedText === 'string' && res.correctedText.trim()) ? res.correctedText : originalText,
            issues: Array.isArray(res?.issues) ? res.issues : [],
          } });
          break;
        }

        /* ── ATS Score (ATS-01) ───────────────────────────── */
        case 'ats': {
          // ATS-01: compose the FULL resume content (all sections) so the backend
          // can procure an accurate factor-level analysis against the job
          // description. The backend computes the weighted final score — the AI
          // only returns the six factor scores and advisory data.
          const resumeText = [
            `Full Name: ${resume.fullName || ''}`,
            `Professional Title: ${resume.professionalTitle || ''}`,
            `Summary: ${resume.summary || ''}`,
            `Skills: ${(resume.skills || []).join(', ')}`,
            `Experience: ${(resume.experience || []).map(e =>
              `${e.role || ''}${e.company ? ' at ' + e.company : ''}${e.summary ? ' — ' + e.summary : ''}${(e.bullets || []).length ? ':\n  - ' + (e.bullets || []).join('\n  - ') : ''}`
            ).filter(Boolean).join('\n')}`,
            `Projects: ${(resume.projects || []).map(p =>
              `${p.name || ''}${p.techStack ? ' (' + p.techStack + ')' : ''}${p.description ? ' — ' + p.description : ''}${(p.highlights || []).length ? ':\n  - ' + (p.highlights || []).join('\n  - ') : ''}`
            ).filter(Boolean).join('\n')}`,
            `Education: ${(resume.education || []).map(e => `${e.school || ''}${e.degree ? ' — ' + e.degree : ''}`).filter(Boolean).join(' | ')}`,
            `Achievements: ${(resume.achievements || []).join(', ')}`,
          ].filter(Boolean).join('\n');

          res = await getAtsScore({
            targetRole:       resume.professionalTitle || '',
            resumeText,
            summary:          resume.summary           || '',
            skills:           resume.skills            || [],
            experienceBullets:(resume.experience || []).flatMap(e => e.bullets || []),
            achievements:     resume.achievements      || [],
            jobDescription:   jd || undefined,
          });
          setResult({ type: 'ats', data: res });
          break;
        }

        /* ── LinkedIn (LINKEDIN-01) ──────────────────────────── */
        case 'linkedin': {
          if (!linkedinResumeInfo.trim()) {
            setError('Please paste your resume/profile information so the AI can generate your LinkedIn content.');
            setLoading(false); return;
          }
          // LINKEDIN-01: send the user's full resume info, target role, and
          // optional existing LinkedIn content. The AI generates headline,
          // about, relevant skills, and improvement suggestions — all based
          // strictly on the provided information.
          res = await optimizeLinkedIn({
            targetRole:            linkedinTargetRole.trim() || resume.professionalTitle || '',
            linkedinResumeInfo:    linkedinResumeInfo.trim(),
            linkedinExistingContent: linkedinExistingContent.trim() || undefined,
          });
          setResult({ type: 'linkedin', data: res });
          break;
        }

        /* ── Cover letter (COVER-01) ────────────────────────── */
        case 'cover': {
          if (!coverResumeInfo.trim()) {
            setError('Please paste your resume information so the AI can generate your cover letter.');
            setLoading(false); return;
          }
          if (!coverJd.trim()) {
            setError('Please paste the job description to generate a tailored cover letter.');
            setLoading(false); return;
          }
          // COVER-01: send the user's full resume info, job title, company name,
          // job description, and optional additional info. The AI generates a
          // cover letter based strictly on the provided information.
          res = await generateCoverLetter({
            candidateName:   resume.fullName || '',
            targetRole:      coverJobTitle.trim(),
            companyName:     coverCompany.trim() || undefined,
            jobDescription:  coverJd.trim(),
            coverResumeInfo: coverResumeInfo.trim(),
            additionalInfo:  coverAdditional.trim() || undefined,
          });
          const coverLetter = res?.coverLetter || res?.text || '';
          setResult({ type: 'coverletter', data: { coverLetter } });
          break;
        }

        /* ── Tailor ──────────────────────────────────────── */
        case 'tailor':
          if (!tailorResumeInfo.trim()) { setError('Please paste your resume content to tailor it.'); setLoading(false); return; }
          if (!jd.trim()) { setError('Please paste the job description to tailor your resume.'); setLoading(false); return; }
          res = await tailorResume({
            tailorResumeInfo,
            targetRole:      tailorJobTitle,
            jobDescription:  jd,
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
    // SKILLS-03: apply only the skills the user's information actually supports
    // (existing + demonstrated), never the job-relevant-but-not-demonstrated ones.
    if (result.type === 'skills' && result.data) {
      const d = result.data;
      // Force-flatten to plain strings: resume.skills must only ever contain
      // strings (ListField + preview templates render them directly). Never
      // leak {name, reason} objects into the resume. (SKILLS-05)
      const supported = flatStrings(
        (Array.isArray(d.recommendedSkills) && d.recommendedSkills.length)
          ? d.recommendedSkills
          : (Array.isArray(d.existingSkills) ? d.existingSkills : [])
              .map(s => (typeof s === 'string' ? s : s?.name)).filter(Boolean)
      );
      setResume(p => ({ ...p, skills: supported }));
    }
    if (result.type === 'tailor' && result.data) {
      // TAILOR-01: only apply the improved summary. The tailored bullets are a
      // generic reworking reference (not grouped by role), so we do NOT auto-apply
      // them — the user reviews and manually updates experience/project bullets.
      const d = result.data;
      setResume(p => ({ ...p, summary: d.tailoredSummary || p.summary }));
    }
    reset(); setActive(null);
  };

  /* ── Input fields for certain actions ──────────────────────────── */
  const needsTextInput    = ['grammar'].includes(active) && !loading && !result;
  const needsJdInput      = ['ats', 'interview'].includes(active) && !loading && !result;
  const needsCompanyInput = ['interview'].includes(active) && !loading && !result;

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
              <label className="label">Text to check</label>
              <textarea className="input min-h-[80px] resize-none text-xs"
                value={input} onChange={e => setInput(e.target.value)}
                placeholder="Paste any resume text to check for errors…"
              />
              {/* Grammar Check resume-section selector (GRAMMAR-01) */}
              {active === 'grammar' && (
                <div>
                  <label className="label text-xs">Resume section</label>
                  <select
                    className="input text-xs"
                    value={grammarSection}
                    onChange={e => setGrammarSection(e.target.value)}
                  >
                    <option>Summary</option>
                    <option>Experience</option>
                    <option>Project</option>
                    <option>Education</option>
                    <option>Skills</option>
                    <option>Other</option>
                  </select>
                </div>
              )}
            </>
          )}

          {/* Rewrite Text form (REWRITE-01) */}
          {active === 'rewrite' && !loading && !result && (
            <>
              <p className="label text-xs font-medium text-ink-600 uppercase tracking-wide mb-2">
                What would you like to rewrite?
              </p>
              <div className="space-y-3">
                <div>
                  <label className="label text-xs">
                    Original text <span className="text-danger-600">*</span>
                  </label>
                  <textarea className="input min-h-[80px] resize-none text-xs"
                    value={input} onChange={e => setInput(e.target.value)}
                    placeholder="Paste the resume text you want rewritten, e.g. Created a website using React."
                  />
                </div>
                <div>
                  <label className="label text-xs">Resume section</label>
                  <select
                    className="input text-xs"
                    value={rewriteSection}
                    onChange={e => setRewriteSection(e.target.value)}
                  >
                    <option>Summary</option>
                    <option>Experience</option>
                    <option>Project</option>
                    <option>Education</option>
                    <option>Skills</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="label text-xs">Rewrite style</label>
                  <select
                    className="input text-xs"
                    value={rewriteStyle}
                    onChange={e => setRewriteStyle(e.target.value)}
                  >
                    <option>Professional</option>
                    <option>Concise</option>
                    <option>ATS-Friendly</option>
                    <option>Stronger wording</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* LinkedIn Optimization form (LINKEDIN-01) */}
          {active === 'linkedin' && !loading && !result && (
            <>
              <p className="label text-xs font-medium text-ink-600 uppercase tracking-wide mb-2">
                LinkedIn Optimization
              </p>
              <div className="space-y-3">
                <div>
                  <label className="label text-xs">
                    Resume / profile information <span className="text-danger-600">*</span>
                  </label>
                  <textarea className="input min-h-[100px] resize-none text-xs"
                    value={linkedinResumeInfo} onChange={e => setLinkedinResumeInfo(e.target.value)}
                    placeholder="Paste your education, skills, experience, projects, and achievements here…"
                  />
                  <p className="text-[10px] text-ink-400 mt-0.5">Include education, skills, experience, internships, projects, and achievements.</p>
                </div>
                <div>
                  <label className="label text-xs">
                    Target job role <span className="text-danger-600">*</span>
                  </label>
                  <input className="input text-xs" type="text"
                    value={linkedinTargetRole} onChange={e => setLinkedinTargetRole(e.target.value)}
                    placeholder="e.g. Java Developer, Frontend Engineer, Data Analyst"
                  />
                </div>
                <div>
                  <label className="label text-xs">
                    Existing LinkedIn content <span className="text-ink-400">(optional)</span>
                  </label>
                  <textarea className="input min-h-[60px] resize-none text-xs"
                    value={linkedinExistingContent} onChange={e => setLinkedinExistingContent(e.target.value)}
                    placeholder="Paste your current LinkedIn headline or About section if you want it improved…"
                  />
                </div>
              </div>
            </>
          )}

          {/* Cover Letter form (COVER-01) */}
          {active === 'cover' && !loading && !result && (
            <>
              <p className="label text-xs font-medium text-ink-600 uppercase tracking-wide mb-2">
                Cover Letter Generator
              </p>
              <div className="space-y-3">
                <div>
                  <label className="label text-xs">
                    Resume / profile information <span className="text-danger-600">*</span>
                  </label>
                  <textarea className="input min-h-[100px] resize-none text-xs"
                    value={coverResumeInfo} onChange={e => setCoverResumeInfo(e.target.value)}
                    placeholder="Paste your education, skills, experience, projects, and achievements here…"
                  />
                  <p className="text-[10px] text-ink-400 mt-0.5">Include education, skills, experience, internships, and projects.</p>
                </div>
                <div>
                  <label className="label text-xs">
                    Job title <span className="text-danger-600">*</span>
                  </label>
                  <input className="input text-xs" type="text"
                    value={coverJobTitle} onChange={e => setCoverJobTitle(e.target.value)}
                    placeholder="e.g. Java Developer, Frontend Engineer, Data Analyst"
                  />
                </div>
                <div>
                  <label className="label text-xs">
                    Company name <span className="text-ink-400">(optional)</span>
                  </label>
                  <input className="input text-xs" type="text"
                    value={coverCompany} onChange={e => setCoverCompany(e.target.value)}
                    placeholder="e.g. Google, Accenture, HDFC Bank"
                  />
                </div>
                <div>
                  <label className="label text-xs">
                    Job description <span className="text-danger-600">*</span>
                  </label>
                  <textarea className="input min-h-[90px] resize-none text-xs"
                    value={coverJd} onChange={e => setCoverJd(e.target.value)}
                    placeholder="Paste the job description here to get a tailored cover letter…"
                  />
                </div>
                <div>
                  <label className="label text-xs">
                    Additional information <span className="text-ink-400">(optional)</span>
                  </label>
                  <textarea className="input min-h-[60px] resize-none text-xs"
                    value={coverAdditional} onChange={e => setCoverAdditional(e.target.value)}
                    placeholder="Anything else you want mentioned in the cover letter…"
                  />
                </div>
              </div>
            </>
          )}

          {/* Tailor Resume form (TAILOR-01) */}
          {active === 'tailor' && !loading && !result && (
            <>
              <p className="label text-xs font-medium text-ink-600 uppercase tracking-wide mb-2">
                Tailor Resume to the Job
              </p>
              <div className="space-y-3">
                <div>
                  <label className="label text-xs">
                    Current resume content <span className="text-danger-600">*</span>
                  </label>
                  <textarea className="input min-h-[100px] resize-none text-xs"
                    value={tailorResumeInfo} onChange={e => setTailorResumeInfo(e.target.value)}
                    placeholder="Paste your complete resume — summary, skills, experience, projects, education…"
                  />
                  <p className="text-[10px] text-ink-400 mt-0.5">
                    Include your summary, skills, experience, and projects so the AI can analyze your actual content.
                  </p>
                </div>
                <div>
                  <label className="label text-xs">
                    Job description <span className="text-danger-600">*</span>
                  </label>
                  <textarea className="input min-h-[90px] resize-none text-xs"
                    value={jd} onChange={e => setJd(e.target.value)}
                    placeholder="Paste the job description to tailor your resume for this role…"
                  />
                </div>
                <div>
                  <label className="label text-xs">
                    Target job title <span className="text-ink-400">(optional)</span>
                  </label>
                  <input className="input text-xs" type="text"
                    value={tailorJobTitle} onChange={e => setTailorJobTitle(e.target.value)}
                    placeholder="e.g. Java Developer (optional — you can leave this blank)"
                  />
                  <p className="text-[10px] text-ink-400 mt-0.5">Optional if it can be extracted from the job description.</p>
                </div>
              </div>
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

          {/* Suggest Skills form (SKILLS-02) */}
          {active === 'skills' && !loading && !result && (
            <>
              <p className="label text-xs font-medium text-ink-600 uppercase tracking-wide mb-2">
                Analyze your skills
              </p>
              <div className="space-y-3">
                <div>
                  <label className="label text-xs">
                    Current skills {!(resume.skills || []).length
                      ? <span className="text-danger-600">*</span> : null}
                  </label>
                  <input
                    className="input text-xs"
                    type="text"
                    value={skillCurrent}
                    onChange={e => setSkillCurrent(e.target.value)}
                    placeholder={resume.skills && resume.skills.length
                      ? `Optional — defaults to your resume skills (${resume.skills.join(', ')})`
                      : 'Comma separated, only skills you actually know. e.g. Java, SQL, React'}
                  />
                </div>
                <div>
                  <label className="label text-xs">Resume information (optional)</label>
                  <textarea
                    className="input min-h-[80px] resize-none text-xs"
                    value={skillResumeInfo}
                    onChange={e => setSkillResumeInfo(e.target.value)}
                    placeholder="Paste your summary, education, experience, internships, projects or certifications so the AI can detect demonstrated skills…"
                  />
                </div>
                <div>
                  <label className="label text-xs">Target job role (optional)</label>
                  <input
                    className="input text-xs"
                    type="text"
                    value={skillRole}
                    onChange={e => setSkillRole(e.target.value)}
                    placeholder={resume.professionalTitle
                      ? `Optional — defaults to "${resume.professionalTitle}"`
                      : 'e.g. Java Developer, Full Stack Developer'}
                  />
                </div>
                <div>
                  <label className="label text-xs">Target job description (optional, recommended)</label>
                  <textarea
                    className="input min-h-[90px] resize-none text-xs"
                    value={skillJobDesc}
                    onChange={e => setSkillJobDesc(e.target.value)}
                    placeholder="Paste the job description to see which missing skills are relevant…"
                  />
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

    // COVER-01: dedicated cover letter display with formatted text and copy support.
    case 'coverletter': {
      const cl = result.data?.coverLetter || '';
      return (
        <div className="space-y-3">
          <p className="text-xs font-medium text-ink-700 mb-1">Cover Letter:</p>
          <p className="text-xs text-ink-700 leading-relaxed whitespace-pre-wrap">{cl}</p>
        </div>
      );
    }

    // REWRITE-01: shows the original text alongside the rewritten result so
    // the user can compare them. Copy-button copies only the rewritten text.
    case 'rewrite': {
      const d = result.data || {};
      return (
        <div className="space-y-2">
          {d.originalText && (
            <div>
              <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-1">Original text</p>
              <p className="text-xs text-ink-500 leading-relaxed whitespace-pre-wrap border-l-2 border-surface-200 pl-2">
                {d.originalText}
              </p>
            </div>
          )}
          <div>
            <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-1">Rewritten text</p>
            <p className="text-xs text-ink-700 leading-relaxed whitespace-pre-wrap">{d.rewrittenText || ''}</p>
          </div>
        </div>
      );
    }

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

    // SKILLS-03: categorized skills result (canonical keys, aliases handled at parse time).
    case 'skills': {
      const d = result.data || {};
      const existing = Array.isArray(d.existingSkills) ? d.existingSkills : [];
      const demonstrated = Array.isArray(d.demonstratedSkills) ? d.demonstratedSkills : [];
      const jobRelevant = Array.isArray(d.jobRelevantSkills) ? d.jobRelevantSkills : [];
      const recommended = Array.isArray(d.recommendedSkills) ? d.recommendedSkills : [];
      if (!existing.length && !demonstrated.length && !jobRelevant.length && !recommended.length) {
        return <p className="text-xs text-ink-400">No skills could be identified.</p>;
      }
      return (
        <div className="space-y-3">
          {recommended.length > 0 && (
            <SkillGroup
              title="Recommended resume skills"
              tone="brand"
              chips={recommended}
            />
          )}
          {existing.length > 0 && (
            <SkillGroup
              title="My existing skills"
              tone="success"
              items={existing}
            />
          )}
          {demonstrated.length > 0 && (
            <SkillGroup
              title="Skills demonstrated"
              tone="ink"
              items={demonstrated}
            />
          )}
          {jobRelevant.length > 0 && (
            <div className="rounded-lg border border-warning-200 bg-warning-50 p-2.5 space-y-1.5">
              <p className="text-xs font-semibold text-warning-700">Job-relevant skills</p>
              <p className="text-[10px] text-warning-700/80 leading-relaxed">
                Do not add to your resume unless you actually have this skill.
              </p>
              <SkillsItemList items={jobRelevant} />
            </div>
          )}
        </div>
      );
    }

    case 'grammar': {
      // GRAMMAR-01: structured output — originalText + correctedText + a list of
      // issues each with { original, correction, reason }. Backwards-compatible
      // with the old string[] issuesFound shape.
      const data = result.data && typeof result.data === 'object' ? result.data : {};
      const originalText = data.originalText || '';
      const correctedText = data.correctedText || '';
      const issues = Array.isArray(data.issues)
        ? data.issues.filter(i => i && typeof i === 'object')
        : (Array.isArray(data.issuesFound) ? data.issuesFound.map(s => ({ reason: s })) : []);
      const noIssues = issues.length === 0;
      return (
        <div className="space-y-3">
          {noIssues ? (
            <div className="flex items-center gap-2 text-xs text-success-700">
              <Icon name="check" className="h-4 w-4 text-success-600" />
              No issues found — your text looks great!
            </div>
          ) : (
            <div className="text-xs text-warning-700 font-medium">
              {issues.length} issue{issues.length !== 1 ? 's' : ''} found
            </div>
          )}

          {issues.length > 0 && (
            <ul className="space-y-2">
              {issues.map((issue, i) => (
                <li key={i} className="rounded-lg border border-ink-100 bg-surface-50 p-2 text-xs">
                  <div className="flex gap-1.5">
                    <span className="font-semibold text-ink-700 shrink-0">
                      {typeof issue?.original === 'string' && issue.original
                        ? issue.original
                        : issue?.reason || 'Issue'}
                    </span>
                    <span className="text-danger-600 shrink-0">→</span>
                    <span className="font-medium text-success-700">
                      {typeof issue?.correction === 'string' && issue.correction ? issue.correction : ''}
                    </span>
                  </div>
                  {typeof issue?.reason === 'string' && issue.reason && (
                    <p className="text-ink-400 mt-0.5">{issue.reason}</p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {correctedText && (
            <div>
              <p className="text-xs font-medium text-ink-500 mt-2">
                {noIssues ? 'Text (no changes needed)' : 'Corrected text:'}
              </p>
              <p className="text-xs text-ink-700 leading-relaxed whitespace-pre-wrap">{correctedText}</p>
            </div>
          )}

          {originalText && correctedText && originalText !== correctedText && (
            <div>
              <p className="text-xs font-medium text-ink-500 mt-2">Original text:</p>
              <p className="text-xs text-ink-400 leading-relaxed whitespace-pre-wrap line-through decoration-ink-300">{originalText}</p>
            </div>
          )}
        </div>
      );
    }

    case 'ats': {
      // ATS-01: final weighted score + grade are computed on the backend. The
      // six factor scores (weight + value 0-100), matched/missing keywords,
      // strengths, and improvements come from the structured AI analysis.
      const d = result.data || {};
      const fs = d.factorScores || {};
      const factors = [
        { key: 'keywordMatch',        label: 'Keyword Match',             weight: '30%', value: fs.keywordMatch ?? d.keywordMatch },
        { key: 'skillsMatch',         label: 'Required Skills Match',     weight: '25%', value: fs.skillsMatch ?? d.skillsMatch },
        { key: 'experienceRelevance', label: 'Experience / Role Relevance', weight: '15%', value: fs.experienceRelevance ?? d.experienceRelevance },
        { key: 'educationMatch',      label: 'Education / Qualification', weight: '10%', value: fs.educationMatch ?? d.educationMatch },
        { key: 'structureReadability',label: 'Structure & Readability',   weight: '10%', value: fs.structureReadability ?? d.structureReadability },
        { key: 'jobAlignment',        label: 'Overall JD Alignment',      weight: '10%', value: fs.jobAlignment ?? d.jobAlignment },
      ].filter(f => typeof f.value === 'number');

      const matched = (d.matchingKeywords ?? d.matchedKeywords) || [];
      const missing = d.missingKeywords || [];
      const strengths = d.strengths || [];
      const improvements = d.improvements || d.topFixes || [];

      return (
        <div className="space-y-3">
          <ScoreBar score={d.score} />

          {typeof d.score === 'number' && d.grade && (
            <p className="text-xs font-semibold text-ink-700">Overall grade: {d.grade}</p>
          )}

          {factors.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">Factor breakdown:</p>
              <div className="space-y-1.5">
                {factors.map((f) => (
                  <div key={f.key} className="flex items-center gap-2">
                    <span className="w-40 shrink-0 text-[10px] text-ink-500">{f.label}</span>
                    <div className="h-1.5 flex-1 rounded-full bg-surface-200 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${f.value >= 60 ? 'bg-brand-500' : 'bg-danger-500'}`}
                        style={{ width: `${f.value}%` }}
                      />
                    </div>
                    <span className="w-14 shrink-0 text-right text-[10px] font-semibold text-ink-600">
                      {f.value}/100 <span className="text-ink-400 font-normal">({f.weight})</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {strengths.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">Strengths:</p>
              <ul className="space-y-1">
                {strengths.map((s, i) => (
                  <li key={i} className="text-xs text-ink-600 flex gap-1.5">
                    <span className="font-semibold text-success-500 shrink-0">✓</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {improvements.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">Improvements:</p>
              <ol className="space-y-1">
                {improvements.map((fix, i) => (
                  <li key={i} className="text-xs text-ink-600 flex gap-1.5">
                    <span className="font-semibold text-danger-500 shrink-0">{i + 1}.</span>{fix}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {missing.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">Missing keywords:</p>
              <div className="flex flex-wrap gap-1">
                {missing.map((kw, i) => (
                  <span key={i} className="rounded-full bg-danger-50 px-2 py-0.5 text-[10px] text-danger-700 border border-danger-100">
                    {kw}
                  </span>
                ))}
              </div>
              <p className="text-xs text-ink-400 mt-1">
                Missing from resume – add only if you actually have this skill.
              </p>
            </div>
          )}

          {matched.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">Matched keywords:</p>
              <div className="flex flex-wrap gap-1">
                {matched.map((kw, i) => (
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
      // LINKEDIN-01: structured output — headline, about, skills, and suggestions.
      const d = result.data || {};
      const headline = d.headline || d.optimizedHeadline || '';
      const about    = d.about    || d.optimizedAbout    || '';
      const skills   = Array.isArray(d.skills) ? d.skills.filter(s => typeof s === 'string') : [];
      const suggestions = Array.isArray(d.suggestions) ? d.suggestions.filter(s => typeof s === 'string') : [];
      const headlineTips = d.headlineTips || '';
      return (
        <div className="space-y-3">
          {headline && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">Headline:</p>
              <p className="text-xs text-ink-700 leading-relaxed font-medium">{headline}</p>
              {headlineTips && <p className="text-xs text-ink-400 mt-1 italic">{headlineTips}</p>}
            </div>
          )}
          {about && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">About section:</p>
              <p className="text-xs text-ink-700 leading-relaxed whitespace-pre-wrap">{about}</p>
            </div>
          )}
          {skills.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">Relevant skills:</p>
              <div className="flex flex-wrap gap-1">
                {skills.map((sk, i) => (
                  <span key={i} className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] text-brand-700 border border-brand-100">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}
          {suggestions.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">Profile improvement suggestions:</p>
              <ul className="space-y-1">
                {suggestions.map((s, i) => (
                  <li key={i} className="text-xs text-ink-600 flex gap-1.5">
                    <span className="font-semibold text-success-500 shrink-0">✓</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    case 'tailor': {
      const {
        tailoredSummary, tailoredSkills, tailoredBullets,
        matchingKeywords, missingKeywords, suggestions,
      } = result.data || {};
      return (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-ink-700 mb-1">Tailored summary:</p>
            <p className="text-xs text-ink-700 leading-relaxed">{tailoredSummary}</p>
          </div>
          {tailoredSkills?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">Skills:</p>
              <div className="flex flex-wrap gap-1">
                {tailoredSkills.map((s, i) => (
                  <span key={i} className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] text-brand-700 border border-brand-100">{s}</span>
                ))}
              </div>
            </div>
          )}
          {tailoredBullets?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">Improved bullets:</p>
              <ul className="space-y-1.5">
                {tailoredBullets.map((b, i) => (
                  <li key={i} className="text-xs text-ink-700 leading-relaxed">• {b}</li>
                ))}
              </ul>
            </div>
          )}
          {matchingKeywords?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">Matching keywords:</p>
              <div className="flex flex-wrap gap-1">
                {matchingKeywords.map((k, i) => (
                  <span key={i} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700 border border-emerald-100">{k}</span>
                ))}
              </div>
            </div>
          )}
          {missingKeywords?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">Missing keywords:</p>
              <div className="flex flex-wrap gap-1">
                {missingKeywords.map((k, i) => (
                  <span key={i} className="rounded-full bg-warning-50 px-2 py-0.5 text-[10px] text-warning-700 border border-warning-100">{k}</span>
                ))}
              </div>
              <p className="text-[10px] text-ink-400 mt-0.5">Add only if you actually have this skill — never invent information.</p>
            </div>
          )}
          {suggestions?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-ink-700 mb-1">Suggestions:</p>
              <ul className="space-y-1">
                {suggestions.map((s, i) => (
                  <li key={i} className="text-xs text-ink-500 leading-relaxed">• {s}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-xs text-ink-400">
            Click "Apply to resume" to update your summary.
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
    case 'coverletter': return result.data?.coverLetter || '';
    case 'list':      return result.items.join('\n');
    case 'rewrite':   return result.data?.rewrittenText || '';
    case 'bullets':   return (result.items || [])
                             .map(b => `• ${typeof b === 'string' ? b : b?.text || ''}`)
                             .join('\n');
    // SKILLS-03: copy-all includes only the recommended resume skills.
    case 'skills': {
      const d = result.data || {};
      return flatStrings(
        (Array.isArray(d.recommendedSkills) && d.recommendedSkills.length)
          ? d.recommendedSkills
          : (Array.isArray(d.existingSkills) ? d.existingSkills : [])
              .map(s => (typeof s === 'string' ? s : s?.name)).filter(Boolean)
      ).join('\n');
    }
    case 'grammar': {
      const g = result.data && typeof result.data === 'object' ? result.data : {};
      const issues = Array.isArray(g.issues)
        ? g.issues
        : (Array.isArray(g.issuesFound) ? g.issuesFound.map(s => ({ reason: s })) : []);
      const parts = [];
      if (typeof g.correctedText === 'string' && g.correctedText) parts.push(g.correctedText);
      if (issues.length) {
        parts.push('\n\nIssues:\n' + issues.map((it, i) =>
          `${i + 1}. ${typeof it?.original === 'string' && it.original ? it.original : ''} → ${typeof it?.correction === 'string' ? it.correction : ''}${typeof it?.reason === 'string' && it.reason ? ` (${it.reason})` : ''}`
        ).join('\n'));
      }
      return parts.join('');
    }
    case 'ats': {
      const d = result.data || {};
      const fs = d.factorScores || {};
      const factors = [
        ['Keyword Match', fs.keywordMatch ?? d.keywordMatch],
        ['Required Skills Match', fs.skillsMatch ?? d.skillsMatch],
        ['Experience / Role Relevance', fs.experienceRelevance ?? d.experienceRelevance],
        ['Education / Qualification', fs.educationMatch ?? d.educationMatch],
        ['Structure & Readability', fs.structureReadability ?? d.structureReadability],
        ['Overall JD Alignment', fs.jobAlignment ?? d.jobAlignment],
      ].filter(([, v]) => typeof v === 'number');
      const matched = (d.matchingKeywords ?? d.matchedKeywords) || [];
      const missing = d.missingKeywords || [];
      const strengths = d.strengths || [];
      const improvements = d.improvements || d.topFixes || [];

      const lines = [];
      lines.push(`ATS Score: ${d.score}/100 (${d.grade || ''})`);
      if (factors.length) {
        lines.push('', 'Factor breakdown:');
        factors.forEach(([label, v]) => lines.push(`- ${label}: ${v}/100`));
      }
      if (matched.length) lines.push('', `Matched keywords: ${matched.join(', ')}`);
      if (missing.length) lines.push('', `Missing keywords: ${missing.join(', ')}\n(missing from resume - add only if you actually have this skill)`);
      if (strengths.length) lines.push('', 'Strengths:\n' + strengths.map((s, i) => `${i + 1}. ${s}`).join('\n'));
      if (improvements.length) lines.push('', 'Improvements:\n' + improvements.map((f, i) => `${i + 1}. ${f}`).join('\n'));
      return lines.join('\n');
    }

    case 'linkedin': {
      const d = result.data || {};
      const headline = d.headline || d.optimizedHeadline || '';
      const about = d.about || d.optimizedAbout || '';
      const skills = Array.isArray(d.skills) ? d.skills : [];
      const suggestions = Array.isArray(d.suggestions) ? d.suggestions : [];
      const parts = [];
      if (headline) parts.push(`Headline:\n${headline}`);
      if (about) parts.push(`\nAbout:\n${about}`);
      if (skills.length) parts.push(`\nRelevant skills:\n${skills.map(s => `- ${s}`).join('\n')}`);
      if (suggestions.length) parts.push(`\nProfile suggestions:\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`);
      return parts.join('\n');
    }
    case 'tailor': {
      const d = result.data || {};
      const parts = [];
      if (d.tailoredSummary) parts.push('Tailored summary:\n' + d.tailoredSummary);
      if (d.matchingKeywords?.length) parts.push('\nMatching keywords: ' + d.matchingKeywords.join(', '));
      if (d.missingKeywords?.length) parts.push('\nMissing keywords: ' + d.missingKeywords.join(', '));
      if (d.suggestions?.length) parts.push('\nSuggestions:\n' + d.suggestions.map(s => '- ' + s).join('\n'));
      return parts.join('\n');
    }
    case 'interview': return (result.data?.questions || [])
                             .map((q, i) => `Q${i+1}: ${q.question}\n\nA: ${q.modelAnswer}`)
                             .join('\n\n---\n\n');
    default:          return '';
  }
}

/* ─── Suggest Skills helper components (SKILLS-03) ──────────────────── */

// Return the first present array from the given response keys (defensive
// against LLM field-name drift / older schema variants).
const skillPick = (obj, keys) => {
  for (const k of keys) {
    const v = obj && obj[k];
    if (Array.isArray(v)) return v;
  }
  return [];
};

// Normalize a list of skills into [{ name, reason }] form (accepts plain
// strings or { name, reason } objects) and drops empty entries.
const normalizeSkills = (list) =>
  (list || []).map(s => (typeof s === 'string' ? { name: s, reason: '' } : s || {}))
    .filter(s => s && s.name && String(s.name).trim());

// Reduce a list to plain non-empty skill-name strings (for copy/apply chips).
const flatStrings = (list) =>
  list.map(s => (typeof s === 'string' ? s : s?.name || '')).filter(Boolean);

const skillName = (s) => (typeof s === 'string' ? s : s?.name || '');

const SkillChip = ({ label }) => (
  <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-ink-700 border border-surface-200">
    {label}
  </span>
);

const SkillsItemList = ({ items }) => (
  <ul className="space-y-1">
    {(items || []).map((s, i) => (
      <li key={i} className="text-xs text-ink-700 leading-relaxed">
        <span className="font-medium">{skillName(s)}</span>
        {s?.reason && <span className="text-ink-400"> — {s.reason}</span>}
      </li>
    ))}
  </ul>
);

const SkillGroup = ({ title, chips, items, tone }) => {
  const border = tone === 'success' ? 'border-success-200 bg-success-50'
               : tone === 'brand'   ? 'border-brand-200 bg-brand-50'
               : 'border-surface-200 bg-surface-50';
  return (
    <div className={`rounded-lg border p-2.5 space-y-1.5 ${border}`}>
      <p className="text-[11px] font-semibold text-ink-700 uppercase tracking-wide">{title}</p>
      {chips ? (
        <div className="flex flex-wrap gap-1">
          {(chips || []).map((c, i) => <SkillChip key={i} label={typeof c === 'string' ? c : c?.name || c} />)}
        </div>
      ) : (
        <SkillsItemList items={items} />
      )}
    </div>
  );
};