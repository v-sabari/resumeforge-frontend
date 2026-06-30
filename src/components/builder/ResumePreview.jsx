import { useState, useEffect, useRef } from 'react';
import { RESUME_TEMPLATES } from '../../utils/constants';
import {
  ModernProTemplate,
  MinimalATSTemplate,
  ExecutiveTemplate,
  FresherTemplate,
  CreativeATSTemplate,
} from '../resume/templates';

/* ─── A4 dimensions at 96 dpi ───────────────────────────────────── */
const A4_W  = 794;   // 210 mm → px
const A4_H  = 1123;  // 297 mm → px

/* ─── Inline Classic template (raw resume data) ─────────────────── */
const safe = (v) => v || '';

const Bul = ({ c }) => (
  <li className="flex gap-1.5">
    <span className="text-gray-400 shrink-0 select-none">•</span>
    <span className="text-gray-700 break-words min-w-0">{c}</span>
  </li>
);

const SH = ({ children, dark }) => (
  <div className={`text-[9px] font-bold uppercase tracking-widest pb-0.5 mb-1.5 border-b
    ${dark ? 'text-slate-400 border-slate-600' : 'text-gray-500 border-gray-200'}`}>
    {children}
  </div>
);

const ClassicTemplate = ({ r }) => (
  <div className="font-sans text-[10px] leading-tight text-gray-900 bg-white p-6 space-y-3">
    <div className="text-center border-b border-gray-300 pb-3">
      <div className="text-lg font-bold tracking-wide uppercase">{safe(r.fullName) || 'Your Name'}</div>
      {r.professionalTitle && <div className="text-[10px] text-gray-600 mt-0.5">{r.professionalTitle}</div>}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1 text-gray-500">
        {r.email    && <span className="break-all">{r.email}</span>}
        {r.phone    && <span>{r.phone}</span>}
        {r.location && <span>{r.location}</span>}
      </div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-0.5 text-gray-500">
        {r.linkedin  && <span className="break-all">{r.linkedin}</span>}
        {r.github    && <span className="break-all">{r.github}</span>}
        {r.portfolio && <span className="break-all">{r.portfolio}</span>}
      </div>
    </div>
    {r.summary && <div><SH>Summary</SH><p className="text-gray-700 leading-relaxed break-words">{r.summary}</p></div>}
    {(r.skills||[]).length > 0 && <div><SH>Skills</SH><p className="break-words">{(r.skills||[]).join(', ')}</p></div>}
    {(r.experience||[]).length > 0 && (
      <div><SH>Experience</SH>
        {(r.experience||[]).map((e,i) => (
          <div key={e.id||i} className="mb-2">
            <div className="flex justify-between gap-2">
              <span className="font-semibold break-words min-w-0">{e.role}{e.company?` — ${e.company}`:''}</span>
              <span className="text-gray-500 shrink-0 whitespace-nowrap">{e.startDate}{e.endDate?` – ${e.endDate}`:''}</span>
            </div>
            {(e.location||e.employmentType)&&<div className="text-gray-500 text-[9px]">{[e.location,e.employmentType].filter(Boolean).join(' · ')}</div>}
            {e.summary&&<p className="text-gray-600 mt-0.5 break-words">{e.summary}</p>}
            {(e.bullets||[]).filter(Boolean).length>0&&<ul className="mt-1 space-y-0.5 pl-1">{(e.bullets||[]).filter(Boolean).map((b,j)=><Bul key={j} c={b}/>)}</ul>}
          </div>
        ))}
      </div>
    )}
    {(r.projects||[]).length > 0 && (
      <div><SH>Projects</SH>
        {(r.projects||[]).map((p,i) => (
          <div key={p.id||i} className="mb-1.5">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-semibold">{p.name}</span>
              {p.role&&<span className="text-gray-500 text-[9px]">({p.role})</span>}
            </div>
            {p.techStack&&<div className="text-gray-500 text-[9px]">{p.techStack}</div>}
            {(p.link||p.github)&&<div className="text-gray-400 text-[9px] break-all">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
            {p.description&&<p className="text-gray-700 mt-0.5 break-words">{p.description}</p>}
            {(p.highlights||[]).filter(Boolean).length>0&&<ul className="mt-0.5 space-y-0.5 pl-1">{(p.highlights||[]).filter(Boolean).map((h,j)=><Bul key={j} c={h}/>)}</ul>}
          </div>
        ))}
      </div>
    )}
    {(r.education||[]).length > 0 && (
      <div><SH>Education</SH>
        {(r.education||[]).map((e,i) => (
          <div key={e.id||i} className="mb-1.5">
            <div className="flex justify-between gap-2">
              <div className="min-w-0">
                <span className="font-semibold">{e.degree}</span>
                {e.field&&<span className="text-gray-600"> in {e.field}</span>}
                {e.institution&&<div className="text-gray-500">{e.institution}</div>}
                {e.grade&&<div className="text-gray-400 text-[9px]">Grade: {e.grade}</div>}
                {e.details&&<div className="text-gray-400 text-[9px] mt-0.5">{e.details}</div>}
              </div>
              <span className="text-gray-500 shrink-0 whitespace-nowrap">{e.startDate}{e.endDate?` – ${e.endDate}`:''}</span>
            </div>
          </div>
        ))}
      </div>
    )}
    {(r.certifications||[]).length > 0 && (
      <div><SH>Certifications</SH>
        {(r.certifications||[]).map((c,i)=>{
          const name=typeof c==='string'?c:(c?.name||'');
          const issuer=typeof c==='string'?'':(c?.issuer||'');
          const year=typeof c==='string'?'':(c?.year||'');
          return <div key={i} className="break-words"><span className="font-medium">{name}</span>{issuer&&<span className="text-gray-500"> — {issuer}</span>}{year&&<span className="text-gray-400"> ({year})</span>}</div>;
        })}
      </div>
    )}
    {(r.achievements||[]).length > 0 && <div><SH>Achievements</SH><ul className="space-y-0.5 pl-1">{(r.achievements||[]).map((a,i)=><Bul key={i} c={a}/>)}</ul></div>}
  </div>
);

/* ─── A4 page-wise viewer ─────────────────────────────────────────
 *
 *  Design:
 *  • Outer shell = slate PDF-viewer background
 *  • White A4 paper card with drop-shadow, centred
 *  • Content rendered at full 794 px then CSS-scaled to fit column
 *  • ResizeObserver tracks both container width AND inner content height
 *  • Page-break dashed lines inserted every A4_H scaled pixels
 *    so the user sees exactly where page 2/3 begin
 *  • No overflow:hidden on the outer div — the outer div's explicit
 *    height equals rawH*scale so nothing is clipped
 * ─────────────────────────────────────────────────────────────────*/
const A4Viewer = ({ children }) => {
  const shellRef = useRef(null);
  const paperRef = useRef(null);
  const [scale, setScale]   = useState(1);
  const [rawH,  setRawH]    = useState(A4_H);

  useEffect(() => {
    const shell = shellRef.current;
    const paper = paperRef.current;
    if (!shell || !paper) return;

    const calc = () => {
      /* available width = shell width minus horizontal padding (32px) */
      const aw = shell.clientWidth - 32;
      if (aw <= 0) return;
      const s = aw / A4_W;
      setScale(s);
      setRawH(paper.scrollHeight);
    };

    const ro1 = new ResizeObserver(calc);
    const ro2 = new ResizeObserver(calc);
    ro1.observe(shell);
    ro2.observe(paper);
    calc();
    return () => { ro1.disconnect(); ro2.disconnect(); };
  }, []);

  const scaledW  = A4_W * scale;
  const scaledH  = rawH  * scale;
  const numPages = Math.max(1, Math.ceil(rawH / A4_H));

  return (
    /* PDF-viewer shell */
    <div
      ref={shellRef}
      className="w-full rounded-xl"
      style={{ background: '#475569', padding: '16px' }}
    >
      {/* Page-count badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-widest">
          A4 Preview
        </span>
        <span className="rounded-full bg-slate-700 px-2.5 py-0.5 text-[10px] font-medium text-slate-300">
          {numPages} {numPages === 1 ? 'page' : 'pages'}
        </span>
      </div>

      {/* A4 paper wrapper — explicit height keeps outer div sized correctly */}
      <div
        className="relative mx-auto"
        style={{ width: scaledW, height: scaledH }}
      >
        {/* White paper background + shadow */}
        <div
          className="absolute inset-0 bg-white"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.25)' }}
        />

        {/* Resume content — 794 px wide, CSS-scaled down */}
        <div
          ref={paperRef}
          className="absolute top-0 left-0 bg-white"
          style={{
            width:           A4_W,
            transformOrigin: 'top left',
            transform:       `scale(${scale})`,
          }}
        >
          {children}
        </div>

        {/* Page-break markers — one for every page boundary */}
        {numPages > 1 && Array.from({ length: numPages - 1 }).map((_, i) => {
          const y = (i + 1) * A4_H * scale;
          return (
            <div
              key={i}
              className="absolute inset-x-0 flex items-center"
              style={{ top: y, zIndex: 30, pointerEvents: 'none' }}
            >
              <div className="flex-1 border-t-2 border-dashed border-blue-400/70" />
              <span className="mx-2 rounded-full bg-blue-600 px-2.5 py-0.5
                               text-[9px] font-bold text-white whitespace-nowrap shadow">
                ↓ Page {i + 2}
              </span>
              <div className="flex-1 border-t-2 border-dashed border-blue-400/70" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Template map helpers ─────────────────────────────────────── */
const normCerts = (arr = []) =>
  arr.map((c) =>
    typeof c === 'string'
      ? { name: c, issuer: '', year: '', credentialUrl: '' }
      : { name: c?.name||'', issuer: c?.issuer||'', year: c?.year||'', credentialUrl: c?.credentialUrl||'' }
  );

const buildTransformed = (resume) => ({
  personalInfo: {
    fullName:  resume.fullName          || 'Your Name',
    title:     resume.professionalTitle || '',
    email:     resume.email    || '',
    phone:     resume.phone    || '',
    location:  resume.location || '',
    linkedin:  resume.linkedin  || '',
    github:    resume.github    || '',
    portfolio: resume.portfolio || '',
  },
  summary: resume.summary || '',
  experience: (resume.experience || []).map((e) => ({
    position:       e.role           || '',
    company:        e.company        || '',
    duration:       e.duration       || `${e.startDate||''} – ${e.endDate||'Present'}`.trim(),
    location:       e.location       || '',
    employmentType: e.employmentType || '',
    summary:        e.summary        || '',
    responsibilities: e.bullets || e.responsibilities || [],
  })),
  education: (resume.education || []).map((e) => ({
    degree:      e.degree              || '',
    field:       e.field               || '',
    institution: e.school || e.institution || '',
    year:        e.year   || `${e.startDate||''} – ${e.endDate||''}`.trim(),
    gpa:         e.gpa    || e.grade   || '',
    details:     e.details             || '',
  })),
  skills:         resume.skills        || [],
  projects: (resume.projects || []).map((p) => ({
    name:         p.name        || '',
    role:         p.role        || '',
    link:         p.link        || '',
    github:       p.github      || '',
    description:  p.description || '',
    technologies: p.techStack   || p.technologies || '',
    highlights:   p.highlights  || [],
  })),
  certifications: normCerts(resume.certifications),
  achievements:   resume.achievements || [],
});

/* ─── Public component ─────────────────────────────────────────── */
export const ResumePreview = ({ resume, template = 'modern', onTemplateChange }) => {
  const [active, setActive] = useState(template);

  useEffect(() => { setActive(template); }, [template]);

  const change = (id) => { setActive(id); onTemplateChange?.(id); };

  if (!resume) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-surface-200
                      bg-white p-12 text-sm text-ink-400">
        Loading preview…
      </div>
    );
  }

  const td = buildTransformed(resume);

  const renders = {
    modern:    <ModernProTemplate    data={td} />,
    classic:   <ClassicTemplate      r={resume} />,
    minimal:   <MinimalATSTemplate   data={td} />,
    executive: <ExecutiveTemplate    data={td} />,
    fresher:   <FresherTemplate      data={td} />,
    creative:  <CreativeATSTemplate  data={td} />,
  };

  const content = renders[active] || renders.modern;

  return (
    <div className="flex flex-col gap-3">
      {/* Template switcher */}
      <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200">
        {RESUME_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => change(t.id)}
            className={[
              'flex-1 min-w-fit rounded-lg px-2 py-1.5 text-[11px] font-semibold',
              'transition-all duration-150 whitespace-nowrap',
              active === t.id
                ? 'bg-white shadow text-slate-900 ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-800',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* A4 page viewer */}
      <A4Viewer>{content}</A4Viewer>

      <p className="text-center text-[10px] text-slate-400 select-none tracking-wide">
        A4 · 210 × 297 mm · Live preview
      </p>
    </div>
  );
};
