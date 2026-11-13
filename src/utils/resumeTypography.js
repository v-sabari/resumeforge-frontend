/**
 * src/utils/resumeTypography.js
 *
 * Traditional font-family and font-size options for RESUME RENDERING ONLY.
 *
 * Scope guarantee: nothing here is imported by the app shell, shared layout,
 * navigation, or any general UI component. Only the resume preview
 * (components/builder/ResumePreview.jsx) and the PDF render handler
 * (src/pdf/renderPdfHandler.jsx) consume these helpers, and the CSS overrides
 * live under `.resume-typography` (see src/index.css), which wraps ONLY the
 * `.resume-template` subtree. Changing a resume's typography can therefore
 * never alter the application's own UI.
 *
 * This module is deliberately pure: no React, no `import.meta.env`, no DOM.
 * The Node/Chromium PDF handler imports it directly, so it must stay usable
 * outside a Vite build.
 *
 * How font size works
 * -------------------
 * The 20 templates size text with absolute utilities (text-[13px], text-[10px]
 * …) rather than one inherited unit. Rewriting all of them would be invasive
 * and error-prone, so the size control instead renders the whole template
 * inside a scoped `zoom` wrapper. `zoom` scales every descendant uniformly
 * (text, padding, rules, avatars), which is exactly what a font-size control
 * should do for a fixed-layout resume. The wrapper compensates its own width
 * (100 / zoom %) so the template keeps filling the page instead of
 * overflowing it. 10.5px is the base size that maps to scale 1, so the default
 * is scale 1 (zero visual change for existing resumes). The templates
 * themselves now ship one +0.5px step above their original design sizes, which
 * keeps their stored typography values — and therefore the scale mapping —
 * unchanged while making the default resumes slightly more legible.
 */

/** The template body size that maps to scale 1. */
export const BASE_FONT_SIZE = 10.5;

export const DEFAULT_FONT_SIZE = BASE_FONT_SIZE;
export const MIN_FONT_SIZE     = 8.0;
export const MAX_FONT_SIZE     = 13.0;
export const FONT_SIZE_STEP    = 0.5;

export const DEFAULT_FONT_FAMILY = 'template';

/**
 * Allow-listed families. `id` is what we persist (backend @Pattern / DB CHECK
 * validate the same list); `stack` is the CSS applied to the template root.
 * `template` has no stack — it means "keep whatever the chosen template
 * already ships with", so existing resumes look identical.
 */
export const FONT_FAMILY_OPTIONS = [
  { id: 'template',  label: 'Template default', description: 'Use the font each template was designed with', stack: null },
  { id: 'times',     label: 'Times New Roman',  description: 'Classic serif — traditional and ATS-safe',   stack: "'Times New Roman', Times, 'Liberation Serif', 'Nimbus Roman', 'Inter', serif" },
  { id: 'georgia',   label: 'Georgia',          description: 'Warm serif — highly readable on screen',      stack: "Georgia, 'Times New Roman', 'Liberation Serif', 'Inter', serif" },
  { id: 'garamond',  label: 'Garamond',         description: 'Elegant old-style serif for editorial roles', stack: "Garamond, 'EB Garamond', 'Apple Garamond', 'Times New Roman', 'Inter', serif" },
  { id: 'arial',     label: 'Arial',            description: 'Neutral sans-serif — the ATS baseline',       stack: "Arial, Helvetica, 'Liberation Sans', 'Inter', sans-serif" },
  { id: 'helvetica', label: 'Helvetica',        description: 'Swiss sans-serif — clean and modern',         stack: "Helvetica, 'Helvetica Neue', Arial, 'Liberation Sans', 'Inter', sans-serif" },
  { id: 'calibri',   label: 'Calibri',          description: 'Friendly sans-serif — common in offices',     stack: "Calibri, Carlito, 'Segoe UI', 'Liberation Sans', 'Inter', sans-serif" },
  { id: 'cambria',   label: 'Cambria',          description: 'Sturdy serif designed for body text',         stack: "Cambria, Caladea, 'Liberation Serif', Georgia, 'Inter', serif" },
  { id: 'courier',   label: 'Courier New',      description: 'Monospace — technical and academic CVs',      stack: "'Courier New', Courier, 'Liberation Mono', 'Inter', monospace" },
];

export const FONT_FAMILY_IDS = FONT_FAMILY_OPTIONS.map((f) => f.id);

const FONT_BY_ID = new Map(FONT_FAMILY_OPTIONS.map((f) => [f.id, f]));

/** Persisted id -> option. Unknown ids fall back to `template`. */
export const getFontFamilyOption = (id) =>
  FONT_BY_ID.get(normaliseFontFamily(id));

export const getFontFamilyLabel = (id) => getFontFamilyOption(id).label;

/** CSS stack for an id, or null for `template` / unknown ids. */
export const getFontFamilyStack = (id) => getFontFamilyOption(id).stack;

export const normaliseFontFamily = (value) => {
  if (typeof value !== 'string') return DEFAULT_FONT_FAMILY;
  const id = value.trim().toLowerCase();
  return FONT_BY_ID.has(id) ? id : DEFAULT_FONT_FAMILY;
};

/** Clamp to the supported range, snap to the 0.5 step, keep one decimal. */
export const normaliseFontSize = (value) => {
  const n = typeof value === 'number' ? value : Number.parseFloat(value);
  if (!Number.isFinite(n)) return DEFAULT_FONT_SIZE;
  const clamped = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, n));
  const snapped = Math.round(clamped / FONT_SIZE_STEP) * FONT_SIZE_STEP;
  return Math.round(snapped * 10) / 10;
};

/** Zoom factor that turns the chosen body size into a uniform scale. */
export const getFontScale = (fontSize) =>
  normaliseFontSize(fontSize) / BASE_FONT_SIZE;

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
