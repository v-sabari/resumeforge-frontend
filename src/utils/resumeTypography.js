/**
 * src/utils/resumeTypography.js
 *
 * Traditional font-family and font-size options for RESUME RENDERING ONLY.
 *
 * Scope guarantee: nothing here is imported by the app shell, shared layout,
 * navigation, or any general UI component. Only the resume preview
 * (components/builder/ResumePreview.jsx) and the PDF render handler
 * (src/pdf/renderPdfHandler.jsx) consume these helpers, and the CSS overrides
 * are generated from this module (see getResumeTypographyCss), which is applied
 * ONLY around the `.resume-template` subtree. Changing a resume's typography
 * can therefore never alter the application's own UI.
 *
 * This module is deliberately pure: no React, no `import.meta.env`, no DOM.
 * The Node/Chromium PDF handler imports it directly, so it must stay usable
 * outside a Vite build.
 *
 * ── Units: stored px, displayed pt ─────────────────────────────────────────
 * The 20 templates size text with absolute utilities (text-[13px], text-[10px]
 * …) rather than one inherited unit. Rewriting all of them would be invasive
 * and error-prone, so the size control instead renders the whole template
 * inside a scoped `zoom` wrapper. `zoom` scales every descendant uniformly
 * (text, padding, rules, avatars), which is exactly what a font-size control
 * should do for a fixed-layout resume. The wrapper compensates its own width
 * (100 / zoom %) so the template keeps filling the page instead of
 * overflowing it.
 *
 * The size is PERSISTED in CSS px (the backend CHECK/DTO/entity all speak px,
 * see V27/V28) but PRESENTED to the user in points (1px = 0.75pt at the CSS
 * reference of 96dpi). Conversion happens ONLY at the persistence boundary in
 * services/resumeService.js — read converts px→pt, write converts pt→px — so
 * no stored value is ever rewritten and there is no unit marker or ambiguity.
 *
 * 10.5px was, and remains, the base size that maps to scale 1, so the default
 * is scale 1 (zero visual change for existing resumes). 10.5px is 7.875pt,
 * which is what the UI shows at the default; an existing 10.5px resume renders
 * pixel-for-pixel identically before and after the px→pt migration.
 */

/* ── Unit conversion (persistence boundary only) ─────────────────────────── */
export const PT_PER_PX = 0.75;                 // 1px = 0.75pt at 96dpi
export const pxToPt = (px) => px * PT_PER_PX;
export const ptToPx = (pt) => pt / PT_PER_PX;

/** The template body size that maps to scale 1 — the historical base. */
export const BASE_FONT_SIZE_PX = 10.5;
/** The same base expressed in the UI's unit. 10.5px === 7.875pt. */
export const BASE_FONT_SIZE_PT = pxToPt(BASE_FONT_SIZE_PX); // 7.875

/* UI domain (pt). DEFAULT is deliberately UNCHANGED from the legacy 10.5px so
 * new resumes keep their historical size; MIN/MAX are the slider bounds.
 * MAX_FONT_SIZE is a single constant: it currently equals the backend's live
 * ceiling (13px = 9.75pt). Once migration V28 (16px) is confirmed live this is
 * raised to 12 (pt) in one line — see the deploy notes in the PR. */
export const DEFAULT_FONT_SIZE = BASE_FONT_SIZE_PT; // 7.875pt (= legacy 10.5px)
export const MIN_FONT_SIZE     = 7.5;               // pt
export const MAX_FONT_SIZE     = 9.75;              // pt (= 13px, backend live ceiling)
export const FONT_SIZE_STEP    = 0.5;               // pt

/* ── Readability guidance (advisory only) ─────────────────────────────────
 * Non-blocking. Never blocks export, never clamps, never rewrites a value —
 * it only surfaces a short message beside the control. Applied to the CURRENT
 * value, so it also shows on an existing sub-9pt resume (including the legacy
 * 7.875pt default). */
export const RECOMMENDED_MIN_PT = 9;  // below this: "Small text …"
export const COMFORT_MIN_PT     = 10; // 9–10pt: gentler "prefer 10pt or larger"

/** @returns {{level:'warn'|'hint', message:string}|null} */
export const getFontSizeWarning = (pt) => {
  const n = typeof pt === 'number' ? pt : Number.parseFloat(pt);
  if (!Number.isFinite(n)) return null;
  if (n < RECOMMENDED_MIN_PT) {
    return { level: 'warn', message: 'Small text may be hard to read or parse.' };
  }
  if (n < COMFORT_MIN_PT) {
    return { level: 'hint', message: 'Most recruiters prefer 10pt or larger.' };
  }
  return null;
};

/** Display helper — one decimal, matching the slider's precision. */
export const formatFontSizePt = (pt) => `${(Number.isFinite(Number(pt)) ? Number(pt) : 0).toFixed(1)} pt`;

export const DEFAULT_FONT_FAMILY = 'template';

/**
 * Allow-listed families. `id` is what we persist (backend @Pattern / DB CHECK
 * validate the same list); `stack` is the CSS applied to the template root.
 * `template` has no stack — it means "keep whatever the chosen template
 * already ships with", so existing resumes look identical.
 *
 * Every other family now leads its stack with a BUNDLED metric-compatible OFL
 * font (see src/fonts/), so the live preview and the exported PDF resolve to
 * the exact same glyphs and metrics — the two surfaces can no longer disagree
 * on line wraps or page count. The system families remain as fallbacks (and as
 * the sole source for a family we do not bundle, e.g. `template`).
 * `bundled` names the OFL family whose @font-face the preview lazily loads and
 * the PDF embeds; it is null for `template`.
 */
export const FONT_FAMILY_OPTIONS = [
  { id: 'template',  label: 'Template default', description: 'Use the font each template was designed with', stack: null, bundled: null },
  { id: 'times',     label: 'Times New Roman',  description: 'Classic serif — traditional and ATS-safe',   stack: "'Tinos', 'Times New Roman', Times, 'Liberation Serif', 'Nimbus Roman', serif", bundled: 'Tinos' },
  { id: 'georgia',   label: 'Georgia',          description: 'Warm serif — highly readable on screen',      stack: "'Gelasio', Georgia, 'Times New Roman', 'Liberation Serif', serif", bundled: 'Gelasio' },
  { id: 'garamond',  label: 'Garamond',         description: 'Elegant old-style serif for editorial roles', stack: "'EB Garamond', Garamond, 'Apple Garamond', 'Times New Roman', 'Liberation Serif', serif", bundled: 'EB Garamond' },
  { id: 'arial',     label: 'Arial',            description: 'Neutral sans-serif — the ATS baseline',       stack: "'Arimo', Arial, Helvetica, 'Liberation Sans', sans-serif", bundled: 'Arimo' },
  { id: 'helvetica', label: 'Helvetica',        description: 'Swiss sans-serif — clean and modern',         stack: "'Arimo', Helvetica, 'Helvetica Neue', Arial, 'Liberation Sans', sans-serif", bundled: 'Arimo' },
  { id: 'calibri',   label: 'Calibri',          description: 'Friendly sans-serif — common in offices',     stack: "'Carlito', Calibri, 'Segoe UI', 'Liberation Sans', sans-serif", bundled: 'Carlito' },
  { id: 'cambria',   label: 'Cambria',          description: 'Sturdy serif designed for body text',         stack: "'Caladea', Cambria, 'Liberation Serif', Georgia, serif", bundled: 'Caladea' },
  { id: 'courier',   label: 'Courier New',      description: 'Monospace — technical and academic CVs',      stack: "'Cousine', 'Courier New', Courier, 'Liberation Mono', monospace", bundled: 'Cousine' },
];

export const FONT_FAMILY_IDS = FONT_FAMILY_OPTIONS.map((f) => f.id);

const FONT_BY_ID = new Map(FONT_FAMILY_OPTIONS.map((f) => [f.id, f]));

/**
 * Removed / renamed family ids → the nearest still-supported family, so an
 * existing resume that referenced a family we later dropped still opens with a
 * sensible typeface instead of silently reverting to `template`. (Populated
 * only if a family is removed; currently empty — every listed family is
 * bundled.) This NEVER touches the resume's size or template.
 */
export const FONT_FAMILY_ALIASES = Object.freeze({
  // e.g. 'garamond': 'times',
});

/** Persisted id -> option. Unknown ids fall back to `template` (never throws). */
export const getFontFamilyOption = (id) =>
  FONT_BY_ID.get(normaliseFontFamily(id));

export const getFontFamilyLabel = (id) => getFontFamilyOption(id).label;

/** CSS stack for an id, or null for `template` / unknown ids. */
export const getFontFamilyStack = (id) => getFontFamilyOption(id).stack;

/** The bundled OFL family name for an id, or null (e.g. `template`). */
export const getBundledFontFamily = (id) => getFontFamilyOption(id).bundled;

export const normaliseFontFamily = (value) => {
  if (typeof value !== 'string') return DEFAULT_FONT_FAMILY;
  const id = value.trim().toLowerCase();
  if (FONT_BY_ID.has(id)) return id;
  if (FONT_FAMILY_ALIASES[id]) return FONT_FAMILY_ALIASES[id];
  return DEFAULT_FONT_FAMILY;
};

/**
 * Sanitise a font size expressed in the UI's unit (pt).
 *
 * IMPORTANT: this deliberately does NOT clamp to the slider range and does NOT
 * snap to the step. Existing resumes may hold a size the current slider cannot
 * reach (e.g. an old 8px = 6pt), and the product rule is "never clamp or
 * rewrite an existing value". A non-finite value (missing/garbage) falls back
 * to the default. Use the MIN/MAX constants for the slider's bounds instead.
 */
export const normaliseFontSize = (value) => {
  const n = typeof value === 'number' ? value : Number.parseFloat(value);
  return Number.isFinite(n) ? n : DEFAULT_FONT_SIZE;
};

/**
 * Persistence-boundary converters. The stored unit is px; the UI unit is pt.
 * These are the ONLY places a resume's size crosses the boundary, so the
 * conversion is exact and one-directional in each direction. Missing/garbage
 * input falls back to the historical default (10.5px === 7.875pt).
 */
export const fontSizeFromStoredPx = (px) => {
  if (px == null) return DEFAULT_FONT_SIZE;
  const n = typeof px === 'number' ? px : Number.parseFloat(px);
  return Number.isFinite(n) ? pxToPt(n) : DEFAULT_FONT_SIZE;
};

export const fontSizeToStoredPx = (pt) => {
  if (pt == null) return BASE_FONT_SIZE_PX;
  const n = typeof pt === 'number' ? pt : Number.parseFloat(pt);
  return Number.isFinite(n) ? ptToPx(n) : BASE_FONT_SIZE_PX;
};

/** Zoom factor that turns the chosen body size (pt) into a uniform scale. */
export const getFontScale = (fontSize) =>
  normaliseFontSize(fontSize) / BASE_FONT_SIZE_PT;

/**
 * Props for the scoped wrapper that must surround `.resume-template` in both
 * the live preview and the exported PDF.
 *
 * `zoom` is honoured by Chromium (preview + PDF engine), Safari and modern
 * Firefox. `width: 100 / scale` counteracts the zoom so the template still
 * spans the full page width instead of spilling out of the page sheet.
 */
export const getResumeTypographyProps = (fontFamily, fontSize) => {
  const family = normaliseFontFamily(fontFamily);
  const scale  = getFontScale(fontSize);

  const style = { width: `${100 / scale}%` };
  // scale === 1 (the default) leaves the wrapper completely inert.
  if (scale !== 1) {
    style.zoom = scale;
    // Firefox < 126 ignores zoom; a transform keeps the size control working
    // there too without changing layout in Chromium.
    if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
        && !CSS.supports('zoom', String(scale))) {
      style.transform = `scale(${scale})`;
      style.transformOrigin = 'top left';
    }
  }

  return {
    className: 'resume-typography',
    'data-font-family': family,
    style,
  };
};

/**
 * Scoped CSS that applies the chosen family's stack to the template subtree.
 *
 * SINGLE SOURCE OF TRUTH: the live preview injects this string via a <style>
 * element and the PDF handler injects the exact same string into the print
 * page, so the two surfaces cannot drift apart. Returns '' for `template`
 * (which keeps each template's own designed typeface).
 */
export const getResumeTypographyCss = (fontFamily) => {
  const family = normaliseFontFamily(fontFamily);
  const stack  = getFontFamilyStack(family);
  if (!stack) return '';
  const scope = `.resume-typography[data-font-family="${family}"] .resume-template`;
  return `${scope}, ${scope} * { font-family: ${stack} !important; }`;
};
