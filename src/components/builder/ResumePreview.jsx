import { useState, useEffect, useRef } from 'react';
import { RESUME_TEMPLATES, DEFAULT_SECTIONS_CONFIG } from '../../utils/constants';
import { buildTransformed } from '../../utils/transformResume';
import {
  ModernProTemplate,
  MinimalATSTemplate,
  ExecutiveTemplate,
  FresherTemplate,
  CreativeATSTemplate,
  ClassicTemplate,
} from '../resume/templates';

/* ─── A4 constants ─────────────────────────────────────────────── */
const A4_W = 794;
const A4_H = 1123;

/* ─── A4 page-wise viewer ─────────────────────────────────────── */
const A4Viewer = ({ children }) => {
  const shellRef = useRef(null);
  const paperRef = useRef(null);
  const [scale,  setScale]  = useState(1);
  const [rawH,   setRawH]   = useState(A4_H);

  useEffect(() => {
    const shell = shellRef.current;
    const paper = paperRef.current;
    if (!shell || !paper) return;
    const calc = () => {
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
    <div ref={shellRef} className="w-full rounded-xl" style={{ background: '#475569', padding: '16px' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-widest">A4 Preview</span>
        <span className="rounded-full bg-slate-700 px-2.5 py-0.5 text-[10px] font-medium text-slate-300">
          {numPages} {numPages === 1 ? 'page' : 'pages'}
        </span>
      </div>
      <div className="relative mx-auto" style={{ width: scaledW, height: scaledH }}>
        <div className="absolute inset-0 bg-white"
             style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.25)' }} />
        <div ref={paperRef} className="absolute top-0 left-0 bg-white"
             style={{ width: A4_W, transformOrigin: 'top left', transform: `scale(${scale})` }}>
          {children}
        </div>
        {numPages > 1 && Array.from({ length: numPages - 1 }).map((_, i) => {
          const y = (i + 1) * A4_H * scale;
          return (
            <div key={i} className="absolute inset-x-0 flex items-center"
                 style={{ top: y, zIndex: 30, pointerEvents: 'none' }}>
              <div className="flex-1 border-t-2 border-dashed border-blue-400/70" />
              <span className="mx-2 rounded-full bg-blue-600 px-2.5 py-0.5 text-[9px] font-bold text-white whitespace-nowrap shadow">
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

/* ─── Public ResumePreview ─────────────────────────────────────── */
export const ResumePreview = ({ resume, template = 'modern', onTemplateChange }) => {
  const [active, setActive] = useState(template);
  useEffect(() => { setActive(template); }, [template]);
  const change = (id) => { setActive(id); onTemplateChange?.(id); };

  if (!resume) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-surface-200 bg-white p-12 text-sm text-ink-400">
        Loading preview…
      </div>
    );
  }

  const sectionsConfig = (resume.sectionsConfig && resume.sectionsConfig.length > 0)
    ? resume.sectionsConfig
    : DEFAULT_SECTIONS_CONFIG;

  const td = buildTransformed(resume, sectionsConfig);

  // External templates receive both the full transformed data AND sectionsConfig
  // so they can render sections in user-defined order (including custom sections).
  const renders = {
    modern:    <ModernProTemplate    data={td} />,
    classic:   <ClassicTemplate      data={td} />,
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
          <button key={t.id} type="button" onClick={() => change(t.id)}
            className={['flex-1 min-w-fit rounded-lg px-2 py-1.5 text-[11px] font-semibold',
              'transition-all duration-150 whitespace-nowrap',
              active === t.id ? 'bg-white shadow text-slate-900 ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800',
            ].join(' ')}>
            {t.label}
          </button>
        ))}
      </div>
      <A4Viewer>{content}</A4Viewer>
      <p className="text-center text-[10px] text-slate-400 select-none tracking-wide">
        A4 · 210 × 297 mm · Live preview
      </p>
    </div>
  );
};
