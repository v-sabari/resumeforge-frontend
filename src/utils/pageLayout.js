/**
 * src/utils/pageLayout.js
 *
 * Single source of truth for A4 page geometry and per-template print
 * margins. Imported by BOTH:
 *  - the live on-screen preview (components/builder/ResumePreview.jsx), and
 *  - the PDF export handler (src/pdf/renderPdfHandler.jsx), which feeds
 *    these same numbers straight into Puppeteer's native per-page margin.
 *
 * Having one shared file means the preview and the exported PDF can never
 * silently drift apart — change a margin here and both surfaces update.
 *
 * Only TOP and BOTTOM margins are modelled here. Left/right margins are
 * deliberately NOT page-layout concerns: each template already bakes its
 * horizontal inset into the content itself (e.g. `px-8` on the root
 * wrapper), so it repeats correctly on every page for free, since the
 * content column runs continuously down the full, uninterrupted height of
 * the document. Only top/bottom margins need to be re-applied at every
 * page break when one continuous flow gets sliced into physical pages —
 * that's the part this file exists to keep consistent.
 *
 * This file must stay plain JS — no `import.meta.env`, no JSX — so it can
 * be imported both by Vite (the browser app) and by the plain-Node PDF
 * handler, which cannot use Vite-only globals (see sectionsCatalog.js for
 * the same constraint, applied to the same reason).
 */

// A4 @ 96dpi.
export const A4_W = 794;
export const A4_H = 1123;

// US Letter @ 96dpi: 8.5 × 96 = 816, 11 × 96 = 1056.
export const US_LETTER_W = 816;
export const US_LETTER_H = 1056;

// Per-template physical page size. Defaults to A4; the academic template is
// explicitly designed for US Letter and must export as exactly that, so the
// preview and the PDF handler share one lookup (getPageSize) and can never
// disagree on the sheet geometry.
export const PAGE_SIZES = {
  academic: { name: 'US Letter', meta: '8.5 × 11 in', w: US_LETTER_W, h: US_LETTER_H },
};

export const DEFAULT_PAGE_SIZE = { name: 'A4', meta: '210 × 297 mm', w: A4_W, h: A4_H };

export function getPageSize(templateId) {
  return PAGE_SIZES[templateId] || DEFAULT_PAGE_SIZE;
}

// px. Kept in sync with each template's own designed density — a template
// that reads "airy" (Minimal, Executive) gets a roomier margin; a template
// built for maximum ATS/keyword density (Classic) gets a tighter one.
// Left/right insets remain wherever they already live inside each
// template's own JSX (px-8, px-10, px-6, etc.) and are untouched here.
export const TEMPLATE_PAGE_MARGINS = {
  modern:        { top: 32, bottom: 32 },
  corporate:     { top: 32, bottom: 32 },
  classic:       { top: 24, bottom: 24 },
  traditional:   { top: 24, bottom: 24 },
  minimal:       { top: 32, bottom: 32 },
  clean:         { top: 32, bottom: 32 },
  fresher:       { top: 32, bottom: 32 },
  graduate:      { top: 32, bottom: 32 },
  tech:          { top: 32, bottom: 32 },
  engineering:   { top: 32, bottom: 32 },
  executive:     { top: 32, bottom: 32 },
  leadership:    { top: 32, bottom: 32 },
  creative:      { top: 32, bottom: 32 },
  designer:      { top: 32, bottom: 32 },
  sleek:         { top: 32, bottom: 32 },
  contemporary:  { top: 32, bottom: 32 },
  academic:      { top: 33.6, bottom: 33.6 }, // 0.35in @96dpi, matches the template's own L/R inset
  research:      { top: 28, bottom: 28 },
  medical:       { top: 32, bottom: 32 },
  finance:       { top: 32, bottom: 32 },
};

export const DEFAULT_PAGE_MARGIN = { top: 32, bottom: 32 };

export function getPageMargin(templateId) {
  return TEMPLATE_PAGE_MARGINS[templateId] || DEFAULT_PAGE_MARGIN;
}

/**
 * "Compress to N pages" support — shared by BOTH the live preview
 * (ResumePreview.jsx) and the PDF export handler (renderPdfHandler.jsx),
 * for the exact same reason the margin constants above are shared: so the
 * exported file can never silently drift from what the user approved on
 * screen.
 *
 * `scale` can go BOTH directions:
 *   - scale < 1 shrinks (used when the content overflows the chosen page
 *     count, e.g. 1.5 pages of writing squeezed into 1 page).
 *   - scale > 1 enlarges (used when the content is short of the chosen
 *     page count, e.g. 1.5 pages of writing stretched to fully occupy 2).
 * Both are the exact same mechanism in opposite directions — see
 * utils/compression.js for the closed-loop, re-measured search that picks
 * which one and by how much.
 *
 * HOW IT WORKS: `scale` is applied via the CSS `zoom` property, not
 * `transform: scale()`. This distinction matters:
 *   - `transform` is a paint-only effect — it does NOT change the box's
 *     layout size, so scrollHeight/offsetHeight (what both the preview's
 *     page-count math and Puppeteer's PDF paginator read) stay unchanged.
 *     Using transform here would visually resize text while leaving the
 *     measured/paginated height exactly as before — the page count would
 *     not actually change.
 *   - `zoom` genuinely reflows the box at the new size — fonts,
 *     line-heights, gaps, and padding all resize together, and
 *     scrollHeight/offsetHeight (and Puppeteer's own page-break
 *     measurements) report the RESIZED, already-zoomed value. That's what
 *     lets the page count actually change from a scale change, and it's
 *     why this technique — not transform — is what real "shrink/grow to
 *     fit" document tools use.
 *
 * The wrapping div's `width` is set to pageWidth / scale so that after zoom
 * is applied, the effective on-page width is exactly the page width again
 * (A4 by default; the academic template passes its US Letter width) —
 * content keeps filling the full page width at every scale, with no leftover
 * blank margin and no horizontal overflow. Only vertical density changes,
 * and the template's own alignment/layout structure is completely
 * untouched — every element just scales together, uniformly.
 *
 * This function does not decide the number by itself — see
 * utils/compression.js for the closed-loop, re-measured search that picks
 * `scale`. This is purely the CSS side of applying a scale once one has
 * been found.
 */
export function scaleStyle(scale, pageWidth = A4_W) {
  const s = (typeof scale === 'number' && scale > 0 && scale !== 1) ? scale : 1;
  if (s === 1) return undefined;
  return { width: `${pageWidth / s}px`, zoom: s };
}
