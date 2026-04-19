import { useState, useEffect } from 'react';
import { RESUME_TEMPLATES } from '../../utils/constants';

const safe = (v) => v || '';

/* ── Bullet helpers ──────────────────────────────────────────────────
   Do NOT use Tailwind before:content-['•'] — the bullet character
   inside a Tailwind class string breaks esbuild's JS parser.
   Use explicit HTML entity spans instead.
────────────────────────────────────────────────────────────────────── */
const Bullet = ({ children, className }) => (
  <li className="flex gap-1.5">
    <span className="text-gray-400 shrink-0 select-none" aria-hidden="true">&#8226;</span>
    <span className={className || 'text-gray-700'}>{children}</span>
  </li>
);

const ChevronBullet = ({ children }) => (
  <li className="flex gap-1.5">
    <span className="text-blue-400 shrink-0 select-none" aria-hidden="true">&#8250;</span>
    <span className="text-gray-600">{children}</span>
  </li>
);

const SectionHead = ({ children, dark }) => (
  <div className={[
    'text-[9px] font-bold uppercase tracking-widest pb-0.5 mb-1.5 border-b',
    dark ? 'text-slate-400 border-slate-600' : 'text-gray-500 border-gray-200',
  ].join(' ')}>
    {children}
  </div>
);

/* ── Classic template ────────────────────────────────────────────── */
const ClassicTemplate = ({ r }) => (
  <div className="font-sans text-[10px] leading-tight text-gray-900 bg-white p-6 space-y-3">

    <div className="text-center border-b border-gray-300 pb-3">
      <div className="text-lg font-bold tracking-wide uppercase">
        {safe(r.fullName) || 'Your Name'}
      </div>
      <div className="text-[10px] text-gray-600 mt-0.5">
        {safe(r.professionalTitle) || safe(r.role)}
      </div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1 text-gray-500">
        {r.email    && <span>{r.email}</span>}
        {r.phone    && <span>{r.phone}</span>}
        {r.location && <span>{r.location}</span>}
      </div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-0.5 text-gray-500">
        {r.linkedin  && <span>{r.linkedin}</span>}
        {r.github    && <span>{r.github}</span>}
        {r.portfolio && <span>{r.portfolio}</span>}
      </div>
    </div>

    {r.summary && (
      <div>
        <SectionHead>Professional Summary</SectionHead>
        <p className="text-gray-700 leading-relaxed">{r.summary}</p>
      </div>
    )}

    {(r.skills || []).length > 0 && (
      <div>
        <SectionHead>Skills</SectionHead>
        <p>{(r.skills || []).join(', ')}</p>
      </div>
    )}

    {(r.experience || []).length > 0 && (
      <div>
        <SectionHead>Experience</SectionHead>
        <div className="space-y-2">
          {(r.experience || []).map((e, i) => (
            <div key={e.id || i}>
              <div className="flex justify-between">
                <span className="font-semibold">
                  {e.role}{e.company ? ' \u2014 ' + e.company : ''}
                </span>
                <span className="text-gray-500">
                  {e.startDate}{e.endDate ? ' \u2013 ' + e.endDate : ''}
                </span>
              </div>
              {e.location && <div className="text-gray-500">{e.location}</div>}
              {(e.bullets || []).filter(Boolean).length > 0 && (
                <ul className="mt-1 space-y-0.5 pl-1">
                  {(e.bullets || []).filter(Boolean).map((b, j) => (
                    <Bullet key={j}>{b}</Bullet>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {(r.projects || []).length > 0 && (
      <div>
        <SectionHead>Projects</SectionHead>
        <div className="space-y-1.5">
          {(r.projects || []).map((p, i) => (
            <div key={p.id || i}>
              <span className="font-semibold">{p.name}</span>
              {p.link && <span className="text-gray-500 ml-2">{p.link}</span>}
              {p.description && <p className="text-gray-700 mt-0.5">{p.description}</p>}
            </div>
          ))}
        </div>
      </div>
    )}

    {(r.education || []).length > 0 && (
      <div>
        <SectionHead>Education</SectionHead>
        <div className="space-y-1">
          {(r.education || []).map((e, i) => (
            <div key={e.id || i} className="flex justify-between">
              <div>
                <span className="font-semibold">{e.degree}</span>
                {e.field && <span className="text-gray-600"> in {e.field}</span>}
                {e.institution && <div className="text-gray-500">{e.institution}</div>}
              </div>
              <span className="text-gray-500 shrink-0 ml-2">
                {e.startDate}{e.endDate ? ' \u2013 ' + e.endDate : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}

    {(r.certifications || []).length > 0 && (
      <div>
        <SectionHead>Certifications</SectionHead>
        <p>{(r.certifications || []).join(' · ')}</p>
      </div>
    )}

    {(r.achievements || []).length > 0 && (
      <div>
        <SectionHead>Achievements</SectionHead>
        <ul className="space-y-0.5 pl-1">
          {(r.achievements || []).map((a, i) => <Bullet key={i}>{a}</Bullet>)}
        </ul>
      </div>
    )}
  </div>
);

/* ── Modern template ─────────────────────────────────────────────── */
const ModernTemplate = ({ r }) => (
  <div className="font-sans text-[10px] leading-tight text-gray-900 bg-white flex">

    {/* Left sidebar */}
    <div className="w-[38%] bg-slate-800 text-white p-4 space-y-3">
      <div>
        <div className="text-sm font-bold leading-tight">{safe(r.fullName) || 'Your Name'}</div>
        <div className="text-[9px] text-slate-300 mt-0.5">
          {safe(r.professionalTitle) || safe(r.role)}
        </div>
      </div>

      {(r.email || r.phone || r.location) && (
        <div className="space-y-1">
          <SectionHead dark>Contact</SectionHead>
          {r.email    && <div className="text-slate-300">{r.email}</div>}
          {r.phone    && <div className="text-slate-300">{r.phone}</div>}
          {r.location && <div className="text-slate-300">{r.location}</div>}
          {r.linkedin && <div className="text-slate-300">{r.linkedin}</div>}
          {r.github   && <div className="text-slate-300">{r.github}</div>}
        </div>
      )}

      {(r.skills || []).length > 0 && (
        <div>
          <SectionHead dark>Skills</SectionHead>
          <div className="flex flex-wrap gap-1">
            {(r.skills || []).map((s, i) => (
              <span key={i} className="rounded bg-slate-700 px-1.5 py-0.5 text-slate-200">{s}</span>
            ))}
          </div>
        </div>
      )}

      {(r.education || []).length > 0 && (
        <div>
          <SectionHead dark>Education</SectionHead>
          {(r.education || []).map((e, i) => (
            <div key={i} className="mb-1.5">
              <div className="font-semibold text-slate-100">{e.degree}</div>
              <div className="text-slate-300">{e.institution}</div>
              <div className="text-slate-400">
                {e.startDate}{e.endDate ? '\u2013' + e.endDate : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      {(r.certifications || []).length > 0 && (
        <div>
          <SectionHead dark>Certifications</SectionHead>
          {(r.certifications || []).map((c, i) => (
            <div key={i} className="text-slate-300">{c}</div>
          ))}
        </div>
      )}
    </div>

    {/* Right main */}
    <div className="flex-1 p-4 space-y-3">
      {r.summary && (
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-blue-700 border-b border-blue-100 pb-0.5 mb-1.5">
            Summary
          </div>
          <p className="text-gray-600 leading-relaxed">{r.summary}</p>
        </div>
      )}

      {(r.experience || []).length > 0 && (
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-blue-700 border-b border-blue-100 pb-0.5 mb-1.5">
            Experience
          </div>
          {(r.experience || []).map((e, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold">{e.role}</span>
                <span className="text-gray-400">
                  {e.startDate}{e.endDate ? '\u2013' + e.endDate : ''}
                </span>
              </div>
              <div className="text-blue-600 font-medium">{e.company}</div>
              {(e.bullets || []).filter(Boolean).length > 0 && (
                <ul className="mt-0.5 pl-1 space-y-0.5">
                  {(e.bullets || []).filter(Boolean).map((b, j) => (
                    <ChevronBullet key={j}>{b}</ChevronBullet>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {(r.projects || []).length > 0 && (
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-blue-700 border-b border-blue-100 pb-0.5 mb-1.5">
            Projects
          </div>
          {(r.projects || []).map((p, i) => (
            <div key={i} className="mb-1.5">
              <span className="font-semibold">{p.name}</span>
              {p.description && <p className="text-gray-600 mt-0.5">{p.description}</p>}
            </div>
          ))}
        </div>
      )}

      {(r.achievements || []).length > 0 && (
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-blue-700 border-b border-blue-100 pb-0.5 mb-1.5">
            Achievements
          </div>
          <ul className="space-y-0.5 pl-1">
            {(r.achievements || []).map((a, i) => <ChevronBullet key={i}>{a}</ChevronBullet>)}
          </ul>
        </div>
      )}
    </div>
  </div>
);

/* ── Minimal template ────────────────────────────────────────────── */
/*
 * Design: maximum whitespace, ultra-clean typography, no borders or rules.
 * ATS-safe: single-column, semantic headings, no graphics.
 * Appeals to creative/senior roles where design taste matters.
 */
const MinimalTemplate = ({ r }) => {
  const MinHead = ({ children }) => (
    <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mt-3 mb-1">
      {children}
    </div>
  );

  return (
    <div className="font-sans text-[10px] leading-relaxed text-gray-800 bg-white px-8 py-6 space-y-0.5">

      {/* Name + title */}
      <div className="mb-4">
        <div className="text-xl font-light tracking-tight text-gray-900">
          {safe(r.fullName) || 'Your Name'}
        </div>
        {(safe(r.professionalTitle) || safe(r.role)) && (
          <div className="text-[10px] text-gray-500 mt-0.5 font-medium">
            {safe(r.professionalTitle) || safe(r.role)}
          </div>
        )}
        <div className="flex flex-wrap gap-x-4 mt-1.5 text-gray-400 text-[9px]">
          {r.email    && <span>{r.email}</span>}
          {r.phone    && <span>{r.phone}</span>}
          {r.location && <span>{r.location}</span>}
          {r.linkedin && <span>{r.linkedin}</span>}
          {r.github   && <span>{r.github}</span>}
        </div>
      </div>

      {r.summary && (
        <>
          <MinHead>Profile</MinHead>
          <p className="text-gray-600 leading-relaxed">{r.summary}</p>
        </>
      )}

      {(r.experience || []).length > 0 && (
        <>
          <MinHead>Experience</MinHead>
          {(r.experience || []).map((e, i) => (
            <div key={i} className="mb-2.5">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-gray-900">{e.role}</span>
                <span className="text-gray-400 text-[9px]">
                  {e.startDate}{e.endDate ? ' – ' + e.endDate : ''}
                </span>
              </div>
              <div className="text-gray-500">{e.company}{e.location ? ', ' + e.location : ''}</div>
              {(e.bullets || []).filter(Boolean).length > 0 && (
                <ul className="mt-0.5 space-y-0.5">
                  {(e.bullets || []).filter(Boolean).map((b, j) => (
                    <li key={j} className="flex gap-2 text-gray-600">
                      <span className="text-gray-300 shrink-0">–</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {(r.skills || []).length > 0 && (
        <>
          <MinHead>Skills</MinHead>
          <p className="text-gray-600">{(r.skills || []).join('  ·  ')}</p>
        </>
      )}

      {(r.projects || []).length > 0 && (
        <>
          <MinHead>Projects</MinHead>
          {(r.projects || []).map((p, i) => (
            <div key={i} className="mb-1.5">
              <span className="font-semibold text-gray-900">{p.name}</span>
              {p.link && <span className="text-gray-400 ml-2 text-[9px]">{p.link}</span>}
              {p.description && <p className="text-gray-500 mt-0.5">{p.description}</p>}
            </div>
          ))}
        </>
      )}

      {(r.education || []).length > 0 && (
        <>
          <MinHead>Education</MinHead>
          {(r.education || []).map((e, i) => (
            <div key={i} className="flex justify-between mb-1">
              <div>
                <span className="font-semibold text-gray-900">{e.degree}</span>
                {e.field && <span className="text-gray-500"> in {e.field}</span>}
                {e.institution && <span className="text-gray-400">, {e.institution}</span>}
              </div>
              <span className="text-gray-400 text-[9px] shrink-0 ml-2">
                {e.startDate}{e.endDate ? ' – ' + e.endDate : ''}
              </span>
            </div>
          ))}
        </>
      )}

      {(r.certifications || []).length > 0 && (
        <>
          <MinHead>Certifications</MinHead>
          <p className="text-gray-600">{(r.certifications || []).join('  ·  ')}</p>
        </>
      )}

      {(r.achievements || []).length > 0 && (
        <>
          <MinHead>Achievements</MinHead>
          <ul className="space-y-0.5">
            {(r.achievements || []).map((a, i) => (
              <li key={i} className="flex gap-2 text-gray-600">
                <span className="text-gray-300 shrink-0">–</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

/* ── ResumePreview wrapper ───────────────────────────────────────── */
export const ResumePreview = ({ resume, template = 'classic', onTemplateChange }) => {
  const [activeTemplate, setActiveTemplate] = useState(template);

  // Sync when parent changes template (e.g. from ExportPanel selector)
  useEffect(() => {
    setActiveTemplate(template);
  }, [template]);

  const handleChange = (id) => {
    setActiveTemplate(id);
    onTemplateChange?.(id);
  };

  return (
    <div>
      {/* Template switcher pills */}
      <div className="flex gap-1 mb-3 rounded-xl bg-surface-100 p-1 w-fit">
        {RESUME_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleChange(t.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTemplate === t.id
                ? 'bg-white shadow-sm text-ink-950'
                : 'text-ink-400 hover:text-ink-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Resume paper */}
      <div className="rounded-xl border border-surface-200 overflow-hidden shadow-sm bg-white">
        {activeTemplate === 'modern'  && <ModernTemplate  r={resume} />}
        {activeTemplate === 'minimal' && <MinimalTemplate r={resume} />}
        {(!activeTemplate || activeTemplate === 'classic') && <ClassicTemplate r={resume} />}
      </div>
    </div>
  );
};
