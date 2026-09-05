/**
 * src/utils/previewPagination.js
 *
 * Element-aware pagination for the live resume preview.
 *
 * WHY THIS EXISTS: the preview (components/builder/ResumePreview.jsx) renders
 * the resume as a continuous flow and shows it in N fixed-height "windows".
 * Slicing that flow at blind pixel boundaries (`i * visibleHeight`) can cut a
 * text line in half — the top half gets clipped at the bottom of one page and
 * the same line re-appears at the top of the next, because every page is just
 * another window onto the same unstoppable flow. The `break-inside: avoid`
 * markers baked into every template are invisible to that approach.
 *
 * THIS FILE fixes it the way a print engine would: it measures every atomic
 * (never-split) content block — <li>, <p>, headings, and any element whose
 * computed break-inside is `avoid` (the template markers), binding each
 * section heading to the body that follows it — then greedily packs whole
 * blocks into pages. Every page starts at a block top and ends before the
 * first block that would not fit, so no block ever straddles a boundary and
 * every block is painted exactly once.
 *
 * All numbers returned are in UNZOOMED content units: the measure node they
 * are computed from is `zoom`-scaled (see utils/pageLayout.js:scaleStyle), so
 * this module divides painted geometry by the zoom factor to recover the
 * template's own coordinate space. The caller multiplies back by `zoom` when
 * applying the page offset, which keeps the math exact at every density scale.
 *
 * Pure DOM — no React, no build globals — so it can be imported by the app.
 */
const EPS = 0.5;

const isAtomicElement = (el) => {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  if (tag === 'LI' || tag === 'P' || /^H[1-6]$/.test(tag)) return true;
  const cs = getComputedStyle(el);
  return cs.breakInside === 'avoid' || cs.pageBreakInside === 'avoid';
};

const isHeadingLike = (el) => {
  if (!(el instanceof HTMLElement)) return false;
  if (/^H[1-6]$/.test(el.tagName)) return true;
  const cs = getComputedStyle(el);
  return cs.breakAfter === 'avoid' || cs.pageBreakAfter === 'avoid'
    || cs.breakBefore === 'avoid' || cs.pageBreakBefore === 'avoid'
    || /(^|\W)title(\W|$)/i.test(el.className || '');
};

/* Depth-first collection of the smallest unsplittable blocks, in document
   order, never descending into an element that is itself atomic. */
function collectAtomicBlocks(rootEl) {
  const blocks = [];
  const walk = (parent) => {
    for (const child of parent.children) {
      if (isAtomicElement(child)) blocks.push(child);
      else walk(child);
    }
  };
  walk(rootEl);
  return blocks;
}

/* The ancestor of `el` that is a DIRECT child of a <section> (or of the
   template root). Used to find the heading that visually couples to a block
   that heads a page. */
function sectionContainerOf(el, rootEl) {
  let node = el;
  while (node.parentElement && node.parentElement !== rootEl && node.parentElement.tagName !== 'SECTION') {
    node = node.parentElement;
  }
  return node.parentElement && node.parentElement.tagName === 'SECTION'
    ? node
    : null;
}

/**
 * Compute the page-start offsets (unzoomed content units, relative to the top
 * of `rootEl`'s flow) that keep every atomic block whole.
 *
 * @param {HTMLElement} rootEl  The hidden measure node (already zoom-scaled).
 * @param {number} visibleH     On-page content height in true pixels.
 * @param {number} [zoom=1]     Current density scale applied to the content.
 * @returns {number[]|null}     Page-start offsets; null when no atomic blocks
 *                              exist (caller falls back to uniform slicing).
 */
export function computePageStarts(rootEl, visibleH, zoom = 1) {
  if (!rootEl || !rootEl.firstElementChild) return null;
  const z = zoom > 0 ? zoom : 1;
  const rootRect = rootEl.getBoundingClientRect();

  const blocks = collectAtomicBlocks(rootEl)
    .map((el) => {
      const r = el.getBoundingClientRect();
      return {
        el,
        top: (r.top - rootRect.top) / z,
        bottom: (r.bottom - rootRect.top) / z,
        h: r.height / z,
      };
    })
    .filter((b) => b.h > EPS);

  if (!blocks.length) return null;

  // Painted capacity of one page, in the same unzoomed units as the blocks:
  // the page window is visibleH true-pixels tall, and content paints at
  // `zoom`, so one page holds visibleH / zoom of unzoomed content.
  const cap = visibleH / z;
  const starts = [0];
  let pageStart = 0;
  let idx = 0;

  while (idx < blocks.length) {
    // Skip blocks entirely above this page (possible after a forced split).
    while (idx < blocks.length && blocks[idx].bottom <= pageStart + EPS) idx += 1;
    if (idx >= blocks.length) break;

    // Fill the page with whole blocks while they fit.
    let fitEnd = idx;
    for (let k = idx; k < blocks.length; k += 1) {
      const relTop = Math.max(0, blocks[k].top - pageStart);
      if (relTop + blocks[k].h <= cap + EPS) fitEnd = k;
      else break;
    }

    // Everything left fits on this final page.
    if (fitEnd >= blocks.length - 1) break;

    const next = blocks[fitEnd + 1];
    // Never exceed a full page per window (over-tall blocks are force-split at
    // the page edge, exactly like a print engine — no flow is ever skipped).
    let boundary = Math.min(next.top, pageStart + cap);

    // Bind a section heading to its first body block: if the block that would
    // start this page belongs to a section that fits entirely from its own
    // top, start at the section top instead (heading + body stay together).
    const nextSectionBox = sectionContainerOf(next.el, rootEl);
    if (nextSectionBox && nextSectionBox !== rootEl && nextSectionBox.tagName === 'SECTION') {
      const sr = nextSectionBox.getBoundingClientRect();
      const sTop = (sr.top - rootRect.top) / z;
      const sBottom = (sr.bottom - rootRect.top) / z;
      if (sTop > pageStart + EPS && sTop < boundary - EPS && sBottom - pageStart <= cap + EPS) {
        boundary = sTop;
      }
    }

    // If the section is too big to move as a whole, still keep its title with
    // the first body block by pulling the title's own box up if it is a few
    // pixels above the candidate boundary (no orphaned headings).
    if (next.top <= pageStart + cap) {
      const container = sectionContainerOf(next.el, rootEl);
      const head = container ? container.previousElementSibling : null;
      if (head && head !== rootEl && isHeadingLike(head)) {
        const hr = head.getBoundingClientRect();
        const hTop = (hr.top - rootRect.top) / z;
        if (hTop >= pageStart - EPS && hTop < boundary - EPS) boundary = hTop;
      }
    }

    // Guard against zero/negative progress (pathological shapes).
    const minGain = Math.min(cap, Math.max(1, cap * 0.1));
    if (boundary - pageStart < minGain) boundary = pageStart + minGain;

    starts.push(boundary);
    pageStart = boundary;
  }

  return starts;
}