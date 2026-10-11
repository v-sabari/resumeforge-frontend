import { useState, useEffect, useRef, useCallback } from 'react';
import { DEFAULT_SECTIONS_CONFIG } from '../../utils/constants';
import { buildTransformed } from '../../utils/transformResume';
import { getPageMargin, getPageSize } from '../../utils/pageLayout';
import { computePageStarts } from '../../utils/previewPagination';
import { OrbitalBlink } from '../common/OrbitalBlink';
import {
  ModernProTemplate,
  MinimalATSTemplate,
  ExecutiveTemplate,
  FresherTemplate,
  CreativeATSTemplate,
  ClassicTemplate,
  CorporateTemplate,
  TraditionalTemplate,
  CleanTemplate,
  GraduateTemplate,
  TechTemplate,
  EngineeringTemplate,
  LeadershipTemplate,
  DesignerTemplate,
  SleekTemplate,
  ContemporaryTemplate,
  AcademicTemplate,
  ResearchTemplate,
  MedicalTemplate,
  FinanceTemplate,
} from '../resume/templates';

const PAGE_GAP = 16; // px between simulated sheets, at true (unscaled) size

/* ─── A4 page-wise viewer ─────────────────────────────────────────
 * Renders the resume as one or more true, margin-accurate A4 sheets
 * instead of one continuous strip with a line drawn over it.
 *
 * How it works: the content is rendered once, off-screen, purely to
 * measure its layout. It is then rendered again inside each page "window" —
 * a fixed-height, clipped box sized to that template's visible content area
 * (page height minus its own top/bottom margin) — shifted up by how much of
 * the content earlier pages already showed.
 *
 * Element-aware pagination (utils/previewPagination.js): instead of slicing
 * the continuous flow at blind pixel boundaries (which can cut a text line
 * in half and re-draw it on the next page), the measurement pass also
 * records every atomic block — <li>, <p>, headings, and every element the
 * templates marked `break-inside: avoid` — and each page starts its window
 * exactly at a block top, ending before the first block that would not fit.
 * The window's HEIGHT is the boundary delta, not the full page: a block
 * pushed to the next page is fully removed from this one (a true re-flow,
 * like Chrome's PDF engine), so nothing is ever clipped mid-line and nothing
 * is painted twice. The freed space reads as whitespace at the page bottom.
 *
 * Everything below renders at the template's TRUE, full size — there is no
 * density scaling (the old "Compress" feature was removed). One real
 * measurement node at natural size drives the on-screen page count, and the
 * PDF export re-runs this same pagination so printed pages match exactly.
 * ────────────────────────────────────────────────────────────────── */
const A4Viewer = ({ children, margin, size, onPagesChange }) => {
  const shellRef   = useRef(null);
  const measureRef = useRef(null);
  const [scale, setScale] = useState(1);
  const { w: pageW, h: pageH, name: pageName } = size;
  const [rawH,  setRawH]  = useState(pageH);
  const [pageStarts, setPageStarts] = useState(null);

  const { top: mTop, bottom: mBottom } = margin;
  const visibleH = Math.max(1, pageH - mTop - mBottom);

  const recalc = useCallback(() => {
    const shell   = shellRef.current;
    const measure = measureRef.current;
    if (!shell || !measure) return;
    const aw = shell.clientWidth - 32;
    if (aw <= 0) return;
    setScale(aw / pageW);
    setRawH(measure.getBoundingClientRect().height);
    // Element-aware page boundaries (whole atomic blocks, never a sliced
    // line) — see utils/previewPagination.js. Falls back to null (uniform
    // slicing) when a template has no detectable atomic blocks.
    setPageStarts(computePageStarts(measure, visibleH, 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  useEffect(() => {
    const shell   = shellRef.current;
    const measure = measureRef.current;
    if (!shell || !measure) return;
    const ro1 = new ResizeObserver(recalc);
    const ro2 = new ResizeObserver(recalc);
    ro1.observe(shell);
    ro2.observe(measure);
    recalc();
    return () => { ro1.disconnect(); ro2.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  const numPages = (pageStarts && pageStarts.length > 0)
    ? pageStarts.length
    : Math.max(1, Math.ceil(rawH / visibleH));
  const scaledW     = pageW * scale;
  const scaledPageH = pageH * scale;

  useEffect(() => { onPagesChange?.(numPages); }, [numPages, onPagesChange]);

  return (
    <div ref={shellRef} className="w-full rounded-xl" style={{ background: '#475569', padding: '16px' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-widest">{pageName} Preview</span>
        <span className="rounded-full bg-slate-700 px-2.5 py-0.5 text-[10px] font-medium text-slate-300">
          {numPages} {numPages === 1 ? 'page' : 'pages'}
        </span>
      </div>

      {/* Hidden measurement copy — full, unsliced content at true width and
          true size. Never shown; exists only so we know the total flowed
          height and can paginate element-aware. */}
      <div style={{ position: 'absolute', top: 0, left: -99999, width: pageW, visibility: 'hidden' }} aria-hidden="true">
        <div ref={measureRef}>{children}</div>
      </div>

      <div className="mx-auto flex flex-col items-center" style={{ width: scaledW, gap: PAGE_GAP * scale }}>
        {Array.from({ length: numPages }).map((_, i) => {
          // Element-aware re-flow: page i shows the flow from boundary[i] up
          // to exactly boundary[i+1] — the sheet's content window HEIGHT is
          // that slice, not the full page. A block that was pushed to the
          // next page is therefore FULLY REMOVED from this one, the same way
          // Chrome's PDF engine re-flows content — nothing is ever painted
          // twice, no line is ever half-drawn, and the freed space shows up
          // as whitespace at the page bottom. Without boundaries the legacy
          // blind-pixel slice is used (rare, no atomic blocks).
          const hasBounds = pageStarts && pageStarts.length > 0;
          const start = hasBounds ? pageStarts[i] : i * visibleH;
          const sliceEnd = hasBounds
            ? (i === pageStarts.length - 1 ? start + visibleH : (pageStarts[i + 1] || start + visibleH))
            : start + visibleH;
          const sliceH = Math.max(0, sliceEnd - start);
          return (
            <div key={i} className="relative overflow-hidden bg-white shrink-0"
                 style={{ width: scaledW, height: scaledPageH,
                          boxShadow: '0 8px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.25)' }}>
              {/* Everything below is laid out in TRUE page pixel units, then
                  scaled down once as a whole — keeps the margin/offset math
                  simple and exactly mirrors how the single-page version used
                  to scale itself. */}
              <div style={{ width: pageW, height: pageH, transform: `scale(${scale})`, transformOrigin: 'top left',
                            display: 'flex', flexDirection: 'column' }}>
                {/* Top margin — always blank, exactly like a print margin */}
                <div style={{ height: mTop, flexShrink: 0 }} />
                {/* This page's visible slice of the continuous content — its
                    height is the boundary delta, so it ends precisely where
                    the next page begins. */}
                <div style={{ height: sliceH, overflow: 'hidden', flexShrink: 0 }}>
                  <div style={{ marginTop: -start }}>
                    <div style={{ width: pageW }}>{children}</div>
                  </div>
                </div>
                {/* Re-flow gap: space vacated by content pushed to the next
                    page, exactly like a word processor. */}
                <div style={{ flexGrow: 1 }} />
                {/* Bottom margin — always blank, exactly like a print margin */}
                <div style={{ height: mBottom, flexShrink: 0 }} />
              </div>
              <span className="absolute bottom-1.5 right-2.5 text-[9px] font-semibold text-slate-300 select-none">
                {i + 1} / {numPages}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Public ResumePreview ─────────────────────────────────────── */
export const ResumePreview = ({ resume, template = 'modern' }) => {
  const [active, setActive] = useState(template);

  useEffect(() => { setActive(template); }, [template]);

  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-surface-200 bg-white p-12 gap-4">
        <OrbitalBlink size="lg" />
        <span className="text-sm text-ink-400">Loading preview…</span>
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
    modern:        <ModernProTemplate      data={td} />,
    classic:       <ClassicTemplate        data={td} />,
    minimal:       <MinimalATSTemplate     data={td} />,
    executive:     <ExecutiveTemplate      data={td} />,
    fresher:       <FresherTemplate        data={td} />,
    creative:      <CreativeATSTemplate    data={td} />,
    corporate:     <CorporateTemplate      data={td} />,
    traditional:   <TraditionalTemplate    data={td} />,
    clean:         <CleanTemplate          data={td} />,
    graduate:      <GraduateTemplate       data={td} />,
    tech:          <TechTemplate           data={td} />,
    engineering:   <EngineeringTemplate    data={td} />,
    leadership:    <LeadershipTemplate     data={td} />,
    designer:      <DesignerTemplate       data={td} />,
    sleek:         <SleekTemplate          data={td} />,
    contemporary:  <ContemporaryTemplate   data={td} />,
    academic:      <AcademicTemplate       data={td} />,
    research:      <ResearchTemplate       data={td} />,
    medical:       <MedicalTemplate        data={td} />,
    finance:       <FinanceTemplate        data={td} />,
  };

  const content = renders[active] || renders.modern;

  return (
    <div className="flex flex-col gap-3">
      <A4Viewer margin={getPageMargin(active)} size={getPageSize(active)}>
        {content}
      </A4Viewer>
      <p className="text-center text-[10px] text-slate-400 select-none tracking-wide">
        {getPageSize(active).name} · {getPageSize(active).meta} · Live preview
      </p>
    </div>
  );
};