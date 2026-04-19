import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/icons/Icon';

/* ─── ATS Keyword Checker ── */
const ATS_POWER_KEYWORDS = [
  'managed','led','developed','built','designed','implemented','optimised',
  'increased','reduced','delivered','launched','collaborated','analysed',
  'created','established','coordinated','streamlined','executed','drove',
  'achieved','generated','improved','automated','deployed','architected',
  'negotiated','mentored','spearheaded','transformed','scaled',
];

const checkKeywords = (text) => {
  const lower = text.toLowerCase();
  const found  = ATS_POWER_KEYWORDS.filter(k => lower.includes(k));
  const missing = ATS_POWER_KEYWORDS.filter(k => !lower.includes(k)).slice(0, 10);
  const score  = Math.round((found.length / ATS_POWER_KEYWORDS.length) * 100);
  return { found, missing, score };
};

const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

const ScoreBar = ({ score }) => {
  const color = score >= 70 ? 'bg-success-500' : score >= 40 ? 'bg-warning-500' : 'bg-danger-500';
  const label = score >= 70 ? 'Strong' : score >= 40 ? 'Moderate' : 'Weak';
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-ink-500">Action verb score</span>
        <span className="font-semibold text-ink-800">{score}/100 · {label}</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-surface-200">
        <div className={`h-2.5 rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
};

const TOOL_DEFS = [
  {
    id: 'keyword',
    title: 'ATS Keyword Checker',
    desc: 'Paste your resume text. We check it for strong action verbs and flag what\'s missing.',
    icon: 'eye',
    badge: 'Free · No account needed',
  },
  {
    id: 'wordcount',
    title: 'Resume Word Count Checker',
    desc: 'Find out if your resume is the right length. Ideal: 400–600 words for most roles.',
    icon: 'text',
    badge: 'Free · No account needed',
  },
];

/* ─── Tool: ATS Keyword Checker ── */
const KeywordTool = () => {
  const [text,   setText]   = useState('');
  const [result, setResult] = useState(null);

  const run = () => {
    if (!text.trim()) return;
    setResult(checkKeywords(text));
  };

  return (
    <div className="space-y-4">
      <textarea
        className="input min-h-[160px] resize-none text-sm w-full"
        placeholder="Paste your resume text here…"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button type="button" onClick={run} disabled={!text.trim()}
        className="btn-primary">
        <Icon name="eye" className="h-4 w-4" />
        Check my resume
      </button>

      {result && (
        <div className="space-y-4 animate-fade-in">
          <ScoreBar score={result.score} />

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card p-4">
              <p className="text-xs font-semibold text-success-700 mb-2">
                ✓ Found ({result.found.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.found.map(k => (
                  <span key={k} className="rounded-full bg-success-50 border border-success-200 px-2 py-0.5 text-[11px] text-success-700">
                    {k}
                  </span>
                ))}
              </div>
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold text-warning-700 mb-2">
                ✗ Missing (top {result.missing.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.missing.map(k => (
                  <span key={k} className="rounded-full bg-warning-50 border border-warning-200 px-2 py-0.5 text-[11px] text-warning-700">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Upsell */}
          <div className="card p-4 border-brand-200 bg-brand-50/50">
            <p className="text-sm font-semibold text-ink-950 mb-1">
              Want an AI-powered full ATS score?
            </p>
            <p className="text-xs text-ink-500 mb-3">
              Our AI ATS Score gives you a 0–100 score, matched vs missing JD keywords, and the top 5 fixes to improve your score. Free users get 3 per day.
            </p>
            <Link to="/register" className="btn-primary btn-sm">
              Try AI ATS Score — free
              <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Tool: Word Count ── */
const WordCountTool = () => {
  const [text, setText] = useState('');
  const words = countWords(text);
  const chars = text.length;

  const lengthStatus = () => {
    if (!text.trim()) return null;
    if (words < 200) return { label: 'Too short', color: 'danger', tip: 'Add more detail to your experience and skills sections.' };
    if (words < 400) return { label: 'Slightly short', color: 'warning', tip: 'Consider expanding your bullets with quantified achievements.' };
    if (words <= 600) return { label: 'Ideal length', color: 'success', tip: 'Your resume length is in the sweet spot for most roles.' };
    if (words <= 800) return { label: 'Slightly long', color: 'warning', tip: 'Consider trimming older experience or reducing bullet points.' };
    return { label: 'Too long', color: 'danger', tip: 'Shorten to 1–2 pages. Focus on the last 10 years of experience.' };
  };

  const status = lengthStatus();

  return (
    <div className="space-y-4">
      <textarea
        className="input min-h-[160px] resize-none text-sm w-full"
        placeholder="Paste your resume text here…"
        value={text}
        onChange={e => setText(e.target.value)}
      />

      {text.trim() ? (
        <div className="space-y-3 animate-fade-in">
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4 text-center">
              <p className="text-2xl font-display font-semibold text-ink-950">{words}</p>
              <p className="text-xs text-ink-400 mt-1">words</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-2xl font-display font-semibold text-ink-950">{chars}</p>
              <p className="text-xs text-ink-400 mt-1">characters</p>
            </div>
          </div>

          {status && (
            <div className={`card p-4 border-${status.color}-200 bg-${status.color}-50/50`}>
              <p className={`text-sm font-semibold text-${status.color}-800 mb-1`}>
                {status.label}
              </p>
              <p className="text-xs text-ink-600">{status.tip}</p>
            </div>
          )}

          <div className="card p-4 border-brand-200 bg-brand-50/50">
            <p className="text-sm font-semibold text-ink-950 mb-1">
              Build a perfectly-sized resume with AI
            </p>
            <p className="text-xs text-ink-500 mb-3">
              ResumeForge AI generates concise, ATS-friendly bullet points so your resume hits the ideal 400–600 word range every time.
            </p>
            <Link to="/register" className="btn-primary btn-sm">
              Build my resume — free
              <Icon name="arrowRight" className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-sm text-ink-400">Paste your resume above to count words and check length.</p>
      )}
    </div>
  );
};

/* ─── Page ── */
export const FreeToolsPage = () => {
  const [activeTool, setActiveTool] = useState('keyword');

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10">
        <p className="kicker mb-2">Free Tools</p>
        <h1 className="text-3xl sm:text-4xl font-display font-semibold text-ink-950 tracking-tight">
          Free resume tools — no account required
        </h1>
        <p className="mt-3 text-ink-400 max-w-xl">
          Instantly check your resume for keyword strength, optimal length, and ATS compatibility. No sign-up needed for these basic tools.
        </p>
      </div>

      {/* Tool selector */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {TOOL_DEFS.map(t => (
          <button key={t.id} type="button" onClick={() => setActiveTool(t.id)}
            className={`card p-5 text-left transition-all hover:border-brand-300 ${
              activeTool === t.id ? 'border-2 border-brand-500 bg-brand-50/40' : ''
            }`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                activeTool === t.id ? 'bg-brand-600 text-white' : 'bg-surface-100 text-ink-400'
              }`}>
                <Icon name={t.icon} className="h-4 w-4" />
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${
                activeTool === t.id
                  ? 'bg-brand-100 text-brand-700'
                  : 'bg-surface-100 text-ink-400'
              }`}>{t.badge}</span>
            </div>
            <h2 className="text-sm font-semibold text-ink-950 mb-1">{t.title}</h2>
            <p className="text-xs text-ink-400 leading-relaxed">{t.desc}</p>
          </button>
        ))}
      </div>

      {/* Active tool */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-ink-950 mb-4">
          {TOOL_DEFS.find(t => t.id === activeTool)?.title}
        </h2>
        {activeTool === 'keyword'   && <KeywordTool />}
        {activeTool === 'wordcount' && <WordCountTool />}
      </div>

      {/* AI upsell strip */}
      <div className="mt-12 card p-8 text-center border-brand-200 bg-gradient-to-r from-brand-50 to-surface-50">
        <p className="kicker mb-2">Want the full picture?</p>
        <h2 className="text-xl font-display font-semibold text-ink-950 mb-2">
          AI-powered resume analysis + builder
        </h2>
        <p className="text-sm text-ink-400 max-w-lg mx-auto mb-5">
          Get an AI ATS score out of 100, missing keyword detection, cover letter generation, and a full resume builder — free to start.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/register" className="btn-primary">
            Start free — no card needed
            <Icon name="arrowRight" className="h-4 w-4" />
          </Link>
          <Link to="/pricing" className="btn-secondary">See pricing</Link>
        </div>
      </div>
    </div>
  );
};
