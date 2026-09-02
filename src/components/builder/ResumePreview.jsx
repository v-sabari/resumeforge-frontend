import { useState, useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { RESUME_TEMPLATES, DEFAULT_SECTIONS_CONFIG } from '../../utils/constants';
import { buildTransformed } from '../../utils/transformResume';
import { A4_W, A4_H, getPageMargin, scaleStyle } from '../../utils/pageLayout';
import { findCompressionScale, MIN_SCALE, MAX_SCALE } from '../../utils/compression';
import { CompressModal } from './CompressModal';
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
 *
 * `contentScale` (from the Compress feature) is applied to the SAME
 * hidden measurement node this component already used for pagination —
 * see pageLayout.js:scaleStyle for why `zoom` (not `transform`) is used,
 * which is what lets one real measurement drive both the on-screen page
 * count AND the compression search below, with no separate estimate path.
 * ────────────────────────────────────────────────────────────────── */
const A4Viewer = forwardRef(({ children, margin, contentScale = 1, onPagesChange }, ref) => {
  const shellRef   = useRef(null);
  const measureRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [rawH,  setRawH]  = useState(A4_H);

  const { top: mTop, bottom: mBottom } = margin;
  const visibleH = Math.max(1, A4_H - mTop - mBottom);

  const recalc = useCallback(() => {
    const shell   = shellRef.current;
    const measure = measureRef.current;
    if (!shell || !measure) return;
    const aw = shell.clientWidth - 32;
    if (aw <= 0) return;
    setScale(aw / A4_W);
    // NOTE: intentionally getBoundingClientRect().height, NOT scrollHeight.
    // Verified directly: Chromium's `scrollHeight`/`offsetHeight` report an
    // element's box size in its PRE-zoom local coordinate space and do not
    // change when `zoom` is applied — only the actually-painted box
    // (getBoundingClientRect) reflects the zoomed size. Reading
    // scrollHeight here would silently ignore every compression/enlarge
    // scale and always report the same, wrong height.
    setRawH(measure.getBoundingClientRect().height);
  }, []);

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
  }, [contentScale]);

  const numPages    = Math.max(1, Math.ceil(rawH / visibleH));
  const scaledW     = A4_W * scale;
  const scaledPageH = A4_H * scale;

  useEffect(() => { onPagesChange?.(numPages); }, [numPages, onPagesChange]);

  /* ── Imperative measurement API for the compression search ─────────
   * findCompressionScale() (utils/compression.js) needs to try many
   * candidate scales and read back the REAL rendered height for each one
   * before deciding anything. It does that through this single hidden
   * node, applying a candidate scale, forcing a synchronous layout read
   * via a real rendered measurement, then restoring whatever scale is
   * actually active — so the visible preview never flickers during a
   * search. Uses getBoundingClientRect().height rather than scrollHeight —
   * see the note above recalc() for why that distinction is essential
   * once `zoom` is involved. */
  useImperativeHandle(ref, () => ({
    measureAtScale(candidateScale) {
      const measure = measureRef.current;
      if (!measure) return rawH;
      const prevStyle = measure.getAttribute('style') || '';
      const style = scaleStyle(candidateScale);
      Object.assign(measure.style, { width: `${A4_W}px`, zoom: '' }); // reset first
      if (style) Object.assign(measure.style, style);
      void measure.offsetHeight; // force synchronous layout before reading rect
      const h = measure.getBoundingClientRect().height;
      measure.setAttribute('style', prevStyle);
      return h;
    },
    getVisibleH: () => visibleH,
  }), [rawH, visibleH]);

  const innerStyle = scaleStyle(contentScale);

  return (
    <div ref={shellRef} className="w-full rounded-xl" style={{ background: '#475569', padding: '16px' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-widest">A4 Preview</span>
        <span className="rounded-full bg-slate-700 px-2.5 py-0.5 text-[10px] font-medium text-slate-300">
          {numPages} {numPages === 1 ? 'page' : 'pages'}
        </span>
      </div>

      {/* Hidden measurement copy — full, unsliced content at true width.
          Never shown; exists only so we know the total flowed height,
          AND doubles as the compression search's measurement node. */}
      <div style={{ position: 'absolute', top: 0, left: -99999, width: A4_W, visibility: 'hidden' }} aria-hidden="true">
        <div ref={measureRef} style={innerStyle}>{children}</div>
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
                <div style={{ marginTop: -(i * visibleH) }}>
                  <div style={innerStyle}>{children}</div>
                </div>
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
});
A4Viewer.displayName = 'A4Viewer';

/* ─── Public ResumePreview ─────────────────────────────────────── */
export const ResumePreview = ({ resume, template = 'modern', onTemplateChange, onScaleChange }) => {
  const [active, setActive] = useState(template);
  const [pages,  setPages]  = useState(1);
  const [showCompress, setShowCompress] = useState(false);
  const [compressing,  setCompressing]  = useState(false);
  const [compressMsg,  setCompressMsg]  = useState(null); // { variant, text }
  const viewerRef = useRef(null);

  useEffect(() => { setActive(template); }, [template]);
  const change = (id) => { setActive(id); onTemplateChange?.(id); };

  // The compressed scale lives on the resume itself (resume.layoutScale)
  // so it survives Save and is what actually gets sent to PDF export —
  // see pageLayout.js and renderPdfHandler.jsx for the export-side half
  // of this. Default to fully uncompressed (1) for resumes that have
  // never been compressed.
  const contentScale = typeof resume?.layoutScale === 'number' && resume.layoutScale >= MIN_SCALE && resume.layoutScale <= MAX_SCALE
    ? resume.layoutScale
    : 1;

  const applyScale = (next) => {
    onScaleChange?.(next);
  };

  const runCompress = (targetPages) => {
    setCompressing(true);
    setCompressMsg(null);
    // Deferred so the "Compressing…" state actually paints before the
    // (synchronous, but occasionally slow-ish for long resumes) search
    // runs its repeated real-DOM measurements.
    setTimeout(() => {
      const viewer = viewerRef.current;
      if (!viewer) { setCompressing(false); return; }
      const visibleH = viewer.getVisibleH();
      const result = findCompressionScale({
        measureFn: (s) => viewer.measureAtScale(s),
        targetPages,
        visibleH,
      });

      if (result.mode === 'unchanged') {
        setCompressMsg({ variant: 'info', text: `Already exactly ${result.pages} page${result.pages === 1 ? '' : 's'} — no change needed.` });
      } else if (result.fits) {
        applyScale(result.scale);
        if (result.mode === 'shrink') {
          setCompressMsg({
            variant: 'success',
            text: `Shrunk to fit ${result.pages} page${result.pages === 1 ? '' : 's'}, verified by re-measuring the actual layout. Alignment and template are unchanged. Save to keep this in your exported PDF.`,
          });
        } else if (result.shortOfTarget) {
          setCompressMsg({
            variant: 'info',
            text: `Grown as much as it can while staying professional — there isn't enough content to fully reach ${targetPages} pages, so it settled at ${result.pages}. Save to keep this, or add more content and compress again.`,
          });
        } else {
          setCompressMsg({
            variant: 'success',
            text: `Grown to fill ${result.pages} page${result.pages === 1 ? '' : 's'}, verified by re-measuring the actual layout. Alignment and template are unchanged. Save to keep this in your exported PDF.`,
          });
        }
      } else {
        // Honest failure: we do NOT apply a partial/guessed result. The
        // floor scale is the smallest we'll ever go without text becoming
        // unreadable, and even that only reaches result.pages pages.
        setCompressMsg({
          variant: 'error',
          text: `Can't fit this into ${targetPages} page${targetPages === 1 ? '' : 's'} without shrinking text below a readable size. `
              + `The most it can compress to while staying readable is ${result.pages} page${result.pages === 1 ? '' : 's'}. `
              + `Try ${result.pages} instead, or shorten some content first.`,
        });
      }
      setCompressing(false);
    }, 30);
  };

  const resetCompression = () => {
    applyScale(1);
    setCompressMsg({ variant: 'info', text: 'Compression reset to full size.' });
  };

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
      <CompressModal
        open={showCompress}
        currentPages={pages}
        busy={compressing}
        onClose={() => setShowCompress(false)}
        onConfirm={(target) => { setShowCompress(false); runCompress(target); }}
      />

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

      {/* Compress controls */}
      <div className="flex items-center justify-between gap-2 rounded-xl border border-surface-200 bg-white px-3 py-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-ink-700">
            {contentScale < 1 ? `Compressed · ${Math.round(contentScale * 100)}% density`
              : contentScale > 1 ? `Enlarged · ${Math.round(contentScale * 100)}% density`
              : 'Full size'}
          </p>
          {compressMsg && (
            <p className={[
              'mt-0.5 text-[11px] leading-snug',
              compressMsg.variant === 'error'   ? 'text-danger-600'  :
              compressMsg.variant === 'success' ? 'text-success-600' : 'text-ink-400',
            ].join(' ')}>
              {compressMsg.text}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-1.5">
          {contentScale !== 1 && (
            <button type="button" onClick={resetCompression}
              className="btn-secondary btn-sm text-xs" disabled={compressing}>
              Reset
            </button>
          )}
          <button type="button" onClick={() => setShowCompress(true)}
            className="btn-secondary btn-sm text-xs" disabled={compressing}>
            {compressing ? 'Working…' : 'Compress'}
          </button>
        </div>
      </div>

      <A4Viewer ref={viewerRef} margin={getPageMargin(active)} contentScale={contentScale} onPagesChange={setPages}>
        {content}
      </A4Viewer>
      <p className="text-center text-[10px] text-slate-400 select-none tracking-wide">
        A4 · 210 × 297 mm · Live preview
      </p>
    </div>
  );
};
