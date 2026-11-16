/**
 * src/fonts/index.js
 *
 * Lazy loader for the bundled metric-compatible OFL families used by the
 * resume typography control (see utils/resumeTypography.js).
 *
 * WHY BUNDLE FONTS AT ALL: the exported PDF is rendered by a headless
 * serverless Chromium that ships NO system fonts. Previously the family the
 * user picked in the preview resolved to a system font on their machine but to
 * a generic fallback on the server — different metrics -> different line wraps
 * -> a different page count. Bundling the exact same WOFF2 bytes and loading
 * them on BOTH surfaces removes that class of mismatch entirely.
 *
 * LAZY: each family is a separate module, imported on demand with a dynamic
 * `import()` — only when the user actually selects that family. Nothing here
 * is in the app's first-load bundle. `template` (the default) loads nothing.
 *
 * The SAME modules are statically aggregated for the PDF by ./pdfFonts.js.
 */

/** CSS family name -> a function returning a dynamic import of its faces. */
export const BUNDLED_FONT_MODULES = {
  Tinos:         () => import('./tinos.js'),
  Gelasio:       () => import('./gelasio.js'),
  'EB Garamond': () => import('./ebgaramond.js'),
  Arimo:         () => import('./arimo.js'),
  Carlito:       () => import('./carlito.js'),
  Caladea:       () => import('./caladea.js'),
  Cousine:       () => import('./cousine.js'),
};

/** Build the @font-face rules for a family from its face list. */
export const fontFaceCss = (family, faces) =>
  faces
    .map(
      (f) =>
        `@font-face{font-family:'${family}';font-style:normal;font-weight:${f.weight};` +
        `font-display:block;src:url(data:font/woff2;base64,${f.base64}) format('woff2');}`,
    )
    .join('\n');

// family -> in-flight/settled Promise, so repeated calls never re-import or
// inject twice.
const loaded = new Map();

/**
 * Lazily import and inject the @font-face for a bundled family, then wait for
 * the faces to actually load so the caller can rely on final metrics.
 * Idempotent and safe to call on every render. Resolves to true once the
 * family is available (or false for an unknown/null family).
 *
 * @param {string|null} family CSS family name (e.g. 'Tinos')
 */
export function ensureBundledFontLoaded(family) {
  if (!family || !BUNDLED_FONT_MODULES[family]) return Promise.resolve(false);
  if (loaded.has(family)) return loaded.get(family);

  const task = (async () => {
    const mod = await BUNDLED_FONT_MODULES[family]();
    const styleId = `bundled-font-${family.replace(/\s+/g, '-').toLowerCase()}`;
    if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
      const el = document.createElement('style');
      el.id = styleId;
      el.textContent = fontFaceCss(family, mod.FACES);
      document.head.appendChild(el);
    }
    if (typeof document !== 'undefined' && document.fonts && document.fonts.load) {
      await Promise.all(
        mod.FACES.map((f) => document.fonts.load(`${f.weight} 16px '${family}'`)),
      ).catch(() => {});
    }
    return true;
  })();

  loaded.set(family, task);
  return task;
}
