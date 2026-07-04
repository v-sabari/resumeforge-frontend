import { useState, useEffect, useRef } from 'react';
import { RESUME_TEMPLATES, DEFAULT_SECTIONS_CONFIG } from '../../utils/constants';
import { buildTransformed } from '../../utils/transformResume';
import { A4_W, A4_H, getPageMargin } from '../../utils/pageLayout';
import {
  ModernProTemplate,
  MinimalATSTemplate,
  ExecutiveTemplate,
  FresherTemplate,
  CreativeATSTemplate,
  ClassicTemplate,
} from '../resume/templates';

const PAGE_GAP = 16; // px between simulated sheets, at true (unscaled) size

/* ─── A4 page-wise viewer ─────────────────────────────────────────
 * Renders the resume as one or more true, margin-accurate A4 sheets
 * instead of one continuous strip with a line drawn over it.
 *
 * How it works: the content is rendered once, off-screen, purely to
 * measure its total flowed height. It is then rendered again inside each
 * page "window" — a fixed-height, clipped box sized to that template's
 * visible content area (A4 height minus its own top/bottom margin) —
 * shifted up by however much of the content earlier pages already showed.
 * This mirrors what a print engine actually does: one continuous flow,
 * sliced into equal, margined pages — so every page (not just the first
 * and last) gets a proper top and bottom margin, matching the exported PDF.
 * ────────────────────────────────────────────────────────────────── */
const A4Viewer = ({ children, margin }) => {
  const shellRef   = useRef(null);
  const measureRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [rawH,  setRawH]  = useState(A4_H);

  const { top: mTop, bottom: mBottom } = margin;
  const visibleH = Math.max(1, A4_H - mTop - mBottom);

  useEffect(() => {
    const shell   = shellRef.current;
    const measure = measureRef.current;
    if (!shell || !measure) return;
    const calc = () => {
      const aw = shell.clientWidth - 32;
      if (aw <= 0) return;
      setScale(aw / A4_W);
      setRawH(measure.scrollHeight);
    };
    const ro1 = new ResizeObserver(calc);
    const ro2 = new ResizeObserver(calc);
    ro1.observe(shell);
    ro2.observe(measure);
    calc();
    return () => { ro1.disconnect(); ro2.disconnect(); };
  }, []);

  const numPages   = Math.max(1, Math.ceil(rawH / visibleH));
  const scaledW    = A4_W * scale;
  const scaledPageH = A4_H * scale;

  return (
    <div ref={shellRef} className="w-full rounded-xl" style={{ background: '#475569', padding: '16px' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-widest">A4 Preview</span>
        <span className="rounded-full bg-slate-700 px-2.5 py-0.5 text-[10px] font-medium text-slate-300">
          {numPages} {numPages === 1 ? 'page' : 'pages'}
        </span>
      </div>

      {/* Hidden measurement copy — full, unsliced content at true width.
          Never shown; exists only so we know the total flowed height. */}
      <div style={{ position: 'absolute', top: 0, left: -99999, width: A4_W, visibility: 'hidden' }} aria-hidden="true">
        <div ref={measureRef}>{children}</div>
      </div>

      <div className="mx-auto flex flex-col items-center" style={{ width: scaledW, gap: PAGE_GAP * scale }}>
        {Array.from({ length: numPages }).map((_, i) => (
          <div key={i} className="relative overflow-hidden bg-white shrink-0"
               style={{ width: scaledW, height: scaledPageH,
                        boxShadow: '0 8px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.25)' }}>
            {/* Everything below is laid out in TRUE A4 pixel units, then
                scaled down once as a whole — keeps the margin/offset math
                simple and exactly mirrors how the single-page version used
                to scale itself. */}
            <div style={{ width: A4_W, height: A4_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
              {/* Top margin — always blank, exactly like a print margin */}
              <div style={{ height: mTop }} />
              {/* This page's visible slice of the continuous content */}
              <div style={{ height: visibleH, overflow: 'hidden' }}>
                <div style={{ marginTop: -(i * visibleH) }}>{children}</div>
              </div>
              {/* Bottom margin — always blank, exactly like a print margin */}
              <div style={{ height: mBottom }} />
            </div>
            <span className="absolute bottom-1.5 right-2.5 text-[9px] font-semibold text-slate-300 select-none">
              {i + 1} / {numPages}
            </span>
          </div>
        ))}
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
      <A4Viewer margin={getPageMargin(active)}>{content}</A4Viewer>
      <p className="text-center text-[10px] text-slate-400 select-none tracking-wide">
        A4 · 210 × 297 mm · Live preview
      </p>
    </div>
  );
};
