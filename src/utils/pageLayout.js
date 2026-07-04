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

// px. Kept in sync with each template's own designed density — a template
// that reads "airy" (Minimal, Executive) gets a roomier margin; a template
// built for maximum ATS/keyword density (Classic) gets a tighter one.
// Left/right insets remain wherever they already live inside each
// template's own JSX (px-8, px-10, px-6, etc.) and are untouched here.
export const TEMPLATE_PAGE_MARGINS = {
  modern:    { top: 32, bottom: 32 },
  executive: { top: 32, bottom: 32 },
  fresher:   { top: 32, bottom: 32 },
  minimal:   { top: 32, bottom: 32 },
  classic:   { top: 24, bottom: 24 },
  creative:  { top: 32, bottom: 32 },
};

export const DEFAULT_PAGE_MARGIN = { top: 32, bottom: 32 };

export function getPageMargin(templateId) {
  return TEMPLATE_PAGE_MARGINS[templateId] || DEFAULT_PAGE_MARGIN;
}
