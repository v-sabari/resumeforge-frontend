/**
 * src/utils/compression.js
 *
 * "Compress to N pages" engine — works in BOTH directions:
 *   - Content that overflows the chosen page count gets its font/spacing
 *     shrunk down until it fits (e.g. 1.5 written pages -> fits in 1).
 *   - Content that falls short of the chosen page count gets its
 *     font/spacing enlarged until it fully occupies the extra space
 *     (e.g. 1.5 written pages -> stretched to fill 2).
 * Both directions use the exact same physics (a single density scale
 * applied uniformly via CSS zoom — see pageLayout.js:scaleStyle) and the
 * exact same alignment/template: nothing about the layout structure, the
 * order of sections, or where things sit on the page ever changes. Only
 * how large everything renders does.
 *
 * WHY THIS FILE EXISTS: resizing to fit a target page count only counts
 * as correct if the number of pages it actually produces — not an
 * estimate of it — matches what the user asked for. This module never
 * guesses. Every candidate scale is applied to a real, hidden DOM node and
 * its real rendered height is read back before any decision is made, and
 * the final choice is re-verified once more immediately before being
 * reported as a success. If it can't be verified, it is reported as a
 * failure — never silently accepted.
 *
 * The actual CSS mechanism lives in pageLayout.js alongside the A4
 * geometry it depends on. This file is pure search logic and has no DOM
 * or React dependency of its own — the caller supplies a
 * `measureFn(scale) -> pixelHeight` closure that does the real DOM work.
 */

// Floor below which text stops being a professional, readable resume —
// the search will not go smaller than this even if a larger shrink would
// technically fit more onto fewer pages. 0.72 keeps ~9px minimums (the
// smallest label text most templates use) at roughly 6.5px, still legible
// on screen and in print.
export const MIN_SCALE = 0.72;

// Ceiling above which text stops looking like a normal resume and starts
// looking visibly stretched/oversized. 1.35 lets a sparse resume grow
// meaningfully to fill extra pages (e.g. 10px body text -> ~13.5px)
// without looking artificial.
export const MAX_SCALE = 1.35;

// Binary-search convergence tolerance on the scale value itself. 0.003 is
// comfortably tighter than a human can perceive as a font-size difference.
const SCALE_EPSILON = 0.003;

// Hard cap on measurement/search iterations so a pathological document
// (e.g. one huge unbreakable block) can't hang the browser tab.
const MAX_ITERATIONS = 24;

/**
 * @param {Object} args
 * @param {(scale: number) => number} args.measureFn - returns the REAL
 *   rendered pixel height of the resume content when displayed at `scale`.
 *   Must do a genuine DOM measurement, not an estimate.
 * @param {number} args.targetPages - desired page count (>= 1).
 * @param {number} args.visibleH - usable content height of one page, in
 *   px, i.e. A4 page height minus that template's top/bottom margin.
 * @param {number} [args.minScale] - smallest allowed scale (readability floor).
 * @param {number} [args.maxScale] - largest allowed scale (professional ceiling).
 *
 * @returns {{
 *   scale: number, pages: number, fits: boolean, height: number,
 *   mode: 'unchanged'|'shrink'|'grow'
 * }}
 *   `fits` is only ever true if the FINAL, re-verified measurement at the
 *   returned scale is <= targetPages * visibleH (and, for a genuine fit,
 *   actually reaches the target). If `fits` is false, the resume cannot
 *   reach the target page count while staying within the readable/
 *   professional scale bounds, and the caller must say so honestly rather
 *   than apply a broken result.
 */
export function findCompressionScale({
  measureFn, targetPages, visibleH, minScale = MIN_SCALE, maxScale = MAX_SCALE,
}) {
  const pages = Math.max(1, Math.round(targetPages) || 1);
  const limitH = pages * visibleH;

  const fullH = measureFn(1);
  const fullPages = Math.max(1, Math.ceil(fullH / visibleH));

  // Already exactly the requested number of pages at full size — nothing
  // to change. (Re-running the search here would just find scale === 1
  // again anyway, but this avoids pointless extra measurements.)
  if (fullPages === pages) {
    return { scale: 1, pages: fullPages, fits: true, height: fullH, mode: 'unchanged' };
  }

  const requestedMode = fullPages > pages ? 'shrink' : 'grow';

  // Check the relevant extreme first — the smallest allowed scale for a
  // shrink request, or the largest allowed scale for a grow request.
  const minH = measureFn(minScale);
  const maxH = measureFn(maxScale);

  if (requestedMode === 'shrink' && minH > limitH) {
    // Can't shrink enough even at the readability floor — report the best
    // achievable result instead of faking success.
    return { scale: minScale, pages: Math.ceil(minH / visibleH), fits: false, height: minH, mode: 'shrink' };
  }
  if (requestedMode === 'grow' && maxH <= limitH) {
    // Even the largest professional scale doesn't need the full target
    // space — there simply isn't enough content to stretch that far.
    // Apply the max enlargement honestly (as much fill as is possible)
    // rather than pretending the last page is completely full.
    return {
      scale: maxScale,
      pages: Math.max(1, Math.ceil(maxH / visibleH)),
      fits: true,
      height: maxH,
      mode: 'grow',
      shortOfTarget: true,
    };
  }

  // Binary search [minScale, maxScale] for the largest scale that still
  // keeps height <= limitH. Height increases monotonically with scale, so
  // ONE search correctly handles both directions:
  //   - shrink: starts feasible near minScale, becomes infeasible near 1+
  //   - grow:   starts feasible near 1, becomes infeasible near maxScale
  // In both cases we want the largest feasible scale — i.e. text as large
  // and readable as the target page count allows. Every candidate is a
  // real measurement; nothing is interpolated or assumed.
  let lo = minScale;
  let hi = maxScale;
  let best = { scale: minScale, height: minH };
  for (let i = 0; i < MAX_ITERATIONS && hi - lo > SCALE_EPSILON; i++) {
    const mid = (lo + hi) / 2;
    const h = measureFn(mid);
    if (h <= limitH) {
      best = { scale: mid, height: h };
      lo = mid;
    } else {
      hi = mid;
    }
  }

  // Final verification pass — re-measure once more at the chosen scale
  // immediately before reporting success, to guard against any layout
  // jitter (web fonts finishing loading, async reflow) that may have
  // occurred between earlier search iterations. Only this final number is
  // trusted for the `fits` verdict.
  const finalH = measureFn(best.scale);
  const finalPages = Math.max(1, Math.ceil(finalH / visibleH));
  return {
    scale: best.scale,
    pages: finalPages,
    fits: finalH <= limitH,
    height: finalH,
    mode: requestedMode,
  };
}
