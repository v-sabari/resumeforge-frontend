import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/icons/Icon';
import { Loader } from '../components/common/Loader';
import { Alert } from '../components/common/Alert';
import { formatApiError } from '../utils/helpers';
import toolsService from '../services/toolsService';

const ACCEPT = '.pdf,.docx,.txt';
const MAX_MB = 5;

const humanSize = (bytes) => {
  if (!Number.isFinite(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const clampScore = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
};

// Only shades that exist in tailwind.config.js (success/warning/danger 50 + 600)
// are used so every class is guaranteed to be generated.
const scoreTone = (score) => {
  const s = clampScore(score);
  if (s >= 70) return { bar: 'bg-success-600', text: 'text-success-600', soft: 'bg-success-50 border-success-600/20', label: 'Strong' };
  if (s >= 45) return { bar: 'bg-warning-600', text: 'text-warning-600', soft: 'bg-warning-50 border-warning-600/20', label: 'Moderate' };
  return { bar: 'bg-danger-600', text: 'text-danger-600', soft: 'bg-danger-50 border-danger-600/20', label: 'Weak' };
};

/* ─── Shared UI ── */
const FileInput = ({ file, onSelect, inputId }) => (
  <label
    htmlFor={inputId}
    className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-surface-300 bg-surface-50 px-4 py-3 cursor-pointer transition-colors hover:border-brand-300 hover:bg-brand-50/40"
  >
    <span className="flex items-center gap-3 min-w-0">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon name="export" className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink-800 truncate">
          {file ? file.name : 'Choose your resume file'}
        </span>
        <span className="block text-[11px] text-ink-400">
          {file ? humanSize(file.size) : 'PDF, DOCX or TXT · max 5 MB'}
        </span>
      </span>
    </span>
    <span className="text-xs font-semibold text-brand-600 shrink-0">
      {file ? 'Change' : 'Browse'}
    </span>
    <input
      id={inputId}
      type="file"
      accept={ACCEPT}
      className="sr-only"
      onChange={(e) => onSelect(e.target.files?.[0] || null)}
    />
  </label>
);

const ScoreHero = ({ score, headline, sub }) => {
  const t = scoreTone(score);
  return (
    <div className={`card p-6 ${t.soft}`}>
      <div className="flex items-center gap-5">
        <div className="flex flex-col items-center justify-center shrink-0">
          <span className={`text-5xl font-display font-semibold leading-none ${t.text}`}>
            {clampScore(score)}
          </span>
          <span className="text-[11px] text-ink-400 mt-1">out of 100</span>
        </div>
        <div className="min-w-0">
          <p className="text-base font-semibold text-ink-950">{headline}</p>
          {sub && <p className="text-xs text-ink-500 mt-1">{sub}</p>}
        </div>
      </div>
    </div>
  );
};

const Chip = ({ children, tone = 'neutral', title }) => {
  const cls = {
    success: 'bg-success-50 border-success-600/20 text-success-600',
    warning: 'bg-warning-50 border-warning-600/20 text-warning-600',
    danger: 'bg-danger-50 border-danger-600/20 text-danger-600',
    brand: 'bg-brand-50 border-brand-200 text-brand-700',
    neutral: 'bg-surface-100 border-surface-200 text-ink-500',
  }[tone] || 'bg-surface-100 border-surface-200 text-ink-500';
  return (
    <span title={title} className={`rounded-full border px-2 py-0.5 text-[11px] ${cls}`}>
      {children}
    </span>
  );
};

const SectionList = ({ title, items, ordered = false }) => {
  if (!items?.length) return null;
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-3">{title}</p>
      {ordered ? (
        <ol className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-ink-700">
              <span className="font-semibold text-ink-300 shrink-0">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-ink-700">
              <Icon name="check" className="h-4 w-4 mt-0.5 shrink-0 text-brand-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Disclaimer = ({ text }) =>
  text ? <p className="text-[11px] text-ink-400 leading-relaxed">{text}</p> : null;

/* ─── Tool 1: JD-Based ATS Score Checker ── */
const AtsScoreTool = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const reset = () => {
    setResult(null);
    setError('');
  };

  const run = async () => {
    if (!file) {
      setError('Please attach your resume file (PDF, DOCX or TXT).');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`That file is larger than ${MAX_MB} MB. Please upload a smaller resume.`);
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await toolsService.checkAtsScore(file, jobDescription);
      setResult(res?.data || null);
    } catch (err) {
      setError(formatApiError(err, 'We could not score your resume. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    const requirements = result.jobRequirements || [];
    const factors = result.factorScores || [];
    return (
      <div className="space-y-5 animate-fade-in">
        <ScoreHero
          score={result.score}
          headline={result.scoreLabel || 'Your estimated ATS score'}
          sub={result.grade ? `Grade ${result.grade} · ${result.fileName || 'your resume'}` : result.fileName}
        />

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="card p-4">
            <p className="text-2xl font-display font-semibold text-ink-950">{result.matchedCount ?? result.matchedKeywords?.length ?? 0}</p>
            <p className="text-xs text-ink-400 mt-0.5">Matched keywords</p>
          </div>
          <div className="card p-4">
            <p className="text-2xl font-display font-semibold text-ink-950">{result.missingKeywordCount ?? result.missingKeywords?.length ?? 0}</p>
            <p className="text-xs text-ink-400 mt-0.5">Missing keywords</p>
          </div>
          <div className="card p-4">
            <p className="text-2xl font-display font-semibold text-ink-950">{result.semanticMatches?.length || 0}</p>
            <p className="text-xs text-ink-400 mt-0.5">Related matches</p>
          </div>
        </div>

        {/* Keywords */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-success-600 mb-3">
              Matched keywords ({(result.matchedKeywords || []).length})
            </p>
            {(result.matchedKeywords || []).length ? (
              <div className="flex flex-wrap gap-1.5">
                {result.matchedKeywords.map((k) => <Chip key={k} tone="success">{k}</Chip>)}
              </div>
            ) : (
              <p className="text-xs text-ink-400">No keyword matches found.</p>
            )}

            {(result.semanticMatches || []).length > 0 && (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 mt-5 mb-3">
                  Related matches ({(result.semanticMatches || []).length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result.semanticMatches.map((k) => <Chip key={k} tone="brand">{k}</Chip>)}
                </div>
              </>
            )}
          </div>

          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-warning-600 mb-3">
              Missing / weak keywords ({(result.missingKeywords || []).length})
            </p>
            {(result.missingKeywords || []).length ? (
              <div className="flex flex-wrap gap-1.5">
                {result.missingKeywords.map((item) => (
                  <Chip
                    key={item.keyword}
                    tone={item.required ? 'danger' : 'warning'}
                    title={item.required ? 'Required by the job description' : 'Preferred by the job description'}
                  >
                    {item.keyword}{item.required ? ' *' : ''}
                  </Chip>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-400">No missing keywords detected.</p>
            )}
            {(result.missingKeywords || []).some((m) => m.required) && (
              <p className="text-[11px] text-ink-400 mt-3">* required by the job description</p>
            )}
          </div>
        </div>

        {/* Factor breakdown */}
        {factors.length > 0 && (
          <div className="card p-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Score breakdown</p>
            {factors.map((f) => (
              <div key={f.key || f.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-700">{f.label}</span>
                  <span className="text-ink-400">{clampScore(f.score)}/100 · weight {f.weight}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-100 overflow-hidden">
                  <div className={`h-1.5 rounded-full ${scoreTone(f.score).bar}`} style={{ width: `${clampScore(f.score)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Job requirements */}
        {requirements.length > 0 && (
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-3">Key job requirements</p>
            <div className="flex flex-wrap gap-1.5">
              {requirements.map((r) => (
                <Chip
                  key={r.keyword}
                  tone={r.matchType === 'MISSING' ? (r.required ? 'danger' : 'warning') : 'success'}
                  title={r.matchedWith ? `Matched with: ${r.matchedWith}` : undefined}
                >
                  {r.keyword}
                </Chip>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <SectionList title="Strengths" items={result.strengths} />
          <SectionList title="Recommendations" items={result.recommendations} ordered />
        </div>
        <SectionList title="Suggested improvements" items={result.improvements} ordered />

        {result.aiEnhanced && (
          <p className="text-[11px] text-ink-400 flex items-center gap-1.5">
            <Icon name="sparkles" className="h-3.5 w-3.5" /> Enhanced with AI semantic matching.
          </p>
        )}
        <Disclaimer text={result.disclaimer} />

        <button type="button" onClick={reset} className="btn-secondary">
          Check another resume
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <FileInput file={file} onSelect={setFile} inputId="ats-score-file" />

      <div>
        <label htmlFor="ats-jd" className="block text-xs font-semibold text-ink-700 mb-2">
          Job description <span className="font-normal text-ink-400">(recommended — improves keyword matching)</span>
        </label>
        <textarea
          id="ats-jd"
          className="input min-h-[160px] resize-y text-sm w-full"
          placeholder="Paste the job description here to compare your resume against the role's requirements…"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <button type="button" onClick={run} disabled={loading || !file} className="btn-primary">
        {loading ? <Loader label="Scoring…" className="text-white" /> : (
          <>
            <Icon name="eye" className="h-4 w-4" />
            Check my ATS score
          </>
        )}
      </button>
      <p className="text-[11px] text-ink-400">
        Your file is processed securely and is not stored. The score is an estimate, not a guarantee of ATS behaviour.
      </p>
    </div>
  );
};

/* ─── Tool 2: ATS Format & Parsing Checker ── */
const FormatCheckTool = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const reset = () => {
    setResult(null);
    setError('');
  };

  const run = async () => {
    if (!file) {
      setError('Please attach your resume file (PDF, DOCX or TXT).');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`That file is larger than ${MAX_MB} MB. Please upload a smaller resume.`);
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await toolsService.checkFormat(file);
      setResult(res?.data || null);
    } catch (err) {
      setError(formatApiError(err, 'We could not check your resume format. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    const SignalRow = ({ ok, label }) => (
      <div className="flex items-center justify-between text-sm py-1.5">
        <span className="text-ink-700">{label}</span>
        <span className={`font-semibold ${ok ? 'text-success-600' : 'text-warning-600'}`}>
          {ok ? 'Found' : 'Not found'}
        </span>
      </div>
    );

    return (
      <div className="space-y-5 animate-fade-in">
        <ScoreHero
          score={result.score}
          headline={result.scoreLabel || 'Format readiness estimate'}
          sub={`${result.fileName || 'Your resume'}${result.fileType ? ` · ${String(result.fileType).toUpperCase()}` : ''}${result.pageCount ? ` · ${result.pageCount} page(s)` : ''}`}
        />

        {!result.textExtracted && (
          <Alert variant="error">
            We could not extract readable text from this file. If it's a scanned/image-based PDF, most ATS systems will not be able to read it either.
          </Alert>
        )}

        <div className="grid sm:grid-cols-3 gap-3">
          <div className="card p-4">
            <p className="text-2xl font-display font-semibold text-ink-950">{result.pageCount ?? '—'}</p>
            <p className="text-xs text-ink-400 mt-0.5">Pages</p>
          </div>
          <div className="card p-4">
            <p className="text-2xl font-display font-semibold text-ink-950">{result.wordCount ?? '—'}</p>
            <p className="text-xs text-ink-400 mt-0.5">Words detected</p>
          </div>
          <div className="card p-4">
            <p className="text-2xl font-display font-semibold text-ink-950">{result.signals?.garbledPercent ?? 0}%</p>
            <p className="text-xs text-ink-400 mt-0.5">Garbled text</p>
          </div>
        </div>

        {/* Problems + risks */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-danger-600 mb-3">
              Confirmed problems ({(result.problems || []).length})
            </p>
            {(result.problems || []).length ? (
              <ul className="space-y-3">
                {result.problems.map((p, i) => (
                  <li key={i} className="text-sm">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-300">{p.category}</span>
                    <p className="text-ink-700">{p.message}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-ink-400">No confirmed parsing problems found.</p>
            )}
          </div>

          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-warning-600 mb-3">
              Potential risks ({(result.risks || []).length})
            </p>
            {(result.risks || []).length ? (
              <ul className="space-y-3">
                {result.risks.map((p, i) => (
                  <li key={i} className="text-sm">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-300">{p.category}</span>
                    <p className="text-ink-700">{p.message}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-ink-400">No formatting risks detected.</p>
            )}
          </div>
        </div>

        {/* Sections */}
        <div className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-3">Sections</p>
          <div className="flex flex-wrap gap-1.5">
            {(result.detectedSections || []).map((s) => (
              <Chip key={s.name} tone={s.found ? 'success' : 'warning'}
                title={s.heading ? `Heading: ${s.heading}` : undefined}>
                {s.name}
              </Chip>
            ))}
          </div>
          {(result.missingSections || []).length > 0 && (
            <p className="text-xs text-ink-400 mt-3">
              Missing: {result.missingSections.join(', ')}
            </p>
          )}
        </div>

        {/* Signals */}
        {result.signals && (
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400 mb-3">Parse signals</p>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
              <SignalRow label="Email detected" ok={result.signals.hasEmail} />
              <SignalRow label="Phone detected" ok={result.signals.hasPhone} />
              <SignalRow label="LinkedIn detected" ok={result.signals.hasLinkedin} />
              <SignalRow label="Name-like line" ok={result.signals.hasNameLikeLine} />
              <SignalRow label="No images" ok={result.signals.imageCount === 0} />
              <SignalRow label="No tables" ok={result.signals.tableCount === 0} />
              <SignalRow label="Single-column layout" ok={!result.signals.multiColumnSuspected} />
              <SignalRow label="No header/footer text" ok={!result.signals.headerFooterTextPresent} />
            </div>
          </div>
        )}

        <SectionList title="Recommendations" items={result.recommendations} ordered />

        {result.textPreview && (
          <details className="card p-5">
            <summary className="text-xs font-semibold uppercase tracking-wide text-ink-400 cursor-pointer">
              What the parser read
            </summary>
            <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap text-xs text-ink-600 leading-relaxed">{result.textPreview}</pre>
          </details>
        )}

        <Disclaimer text={result.disclaimer} />

        <button type="button" onClick={reset} className="btn-secondary">
          Check another file
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <FileInput file={file} onSelect={setFile} inputId="format-check-file" />

      {error && <Alert variant="error">{error}</Alert>}

      <button type="button" onClick={run} disabled={loading || !file} className="btn-primary">
        {loading ? <Loader label="Analysing…" className="text-white" /> : (
          <>
            <Icon name="grid" className="h-4 w-4" />
            Run format check
          </>
        )}
      </button>
      <p className="text-[11px] text-ink-400">
        Checks whether your resume's structure and formatting can be parsed by applicant tracking systems. Processed securely, never stored.
      </p>
    </div>
  );
};

/* ─── Tool metadata ── */
const TOOL_DEFS = [
  {
    id: 'ats-score',
    title: 'JD-Based ATS Score Checker',
    desc: 'Upload your resume and paste a job description. Get an estimated ATS match score out of 100, plus the keywords you\'re missing.',
    icon: 'eye',
    badge: 'Free · No account',
  },
  {
    id: 'format',
    title: 'ATS Format & Parsing Checker',
    desc: 'Upload your resume to find out whether its layout, sections and formatting will parse cleanly in applicant tracking systems.',
    icon: 'grid',
    badge: 'Free · No account',
  },
];

/* ─── Page ── */
export const FreeToolsPage = () => {
  const [activeTool, setActiveTool] = useState('ats-score');

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10">
        <p className="kicker mb-2">Free Tools</p>
        <h1 className="text-3xl sm:text-4xl font-display font-semibold text-ink-950 tracking-tight">
          Free ATS resume tools — no account required
        </h1>
        <p className="mt-3 text-ink-400 max-w-xl">
          Upload your resume to check how well it matches a specific job description and whether its formatting will survive
          applicant tracking systems. No sign-up needed.
        </p>
      </div>

      {/* Tool selector */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {TOOL_DEFS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTool(t.id)}
            className={`card p-5 text-left transition-all hover:border-brand-300 ${
              activeTool === t.id ? 'border-2 border-brand-500 bg-brand-50/40' : ''
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                activeTool === t.id ? 'bg-brand-600 text-white' : 'bg-surface-100 text-ink-400'
              }`}>
                <Icon name={t.icon} className="h-4 w-4" />
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5 ${
                activeTool === t.id ? 'bg-brand-100 text-brand-700' : 'bg-surface-100 text-ink-400'
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
          {TOOL_DEFS.find((t) => t.id === activeTool)?.title}
        </h2>
        {activeTool === 'ats-score' && <AtsScoreTool />}
        {activeTool === 'format' && <FormatCheckTool />}
      </div>

      {/* AI upsell strip */}
      <div className="mt-12 card p-8 text-center border-brand-200 bg-gradient-to-r from-brand-50 to-surface-50">
        <p className="kicker mb-2">Want the full picture?</p>
        <h2 className="text-xl font-display font-semibold text-ink-950 mb-2">
          AI-powered resume analysis + builder
        </h2>
        <p className="text-sm text-ink-400 max-w-lg mx-auto mb-5">
          Get an AI ATS score, tailored keyword suggestions, cover letter generation, and a full resume builder — free to start.
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

export default FreeToolsPage;
