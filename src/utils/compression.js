/**
 * src/utils/compression.js
 *
 * "Compress to N pages" engine.
 *
 * WHY THIS FILE EXISTS: shrinking a resume to fit a target page count only
 * counts as correct if the number of pages it actually produces — not an
 * estimate of it — matches what the user asked for. This module never
 * guesses. Every candidate scale is applied to a real, hidden DOM node and
 * its real rendered height is read back before any decision is made, and
 * the final choice is re-verified once more immediately before being
 * reported as a success. If it can't be verified, it is reported as a
 * failure — never silently accepted.
 *
 * The actual CSS mechanism (zoom-based, not transform-based, and why that
 * distinction matters for correct measurement) lives in pageLayout.js
 * alongside the A4 geometry it depends on. This file is pure search logic
 * and has no DOM or React dependency of its own — the caller supplies a
 * `measureFn(scale) -> pixelHeight` closure that does the real DOM work.
 */

// Floor below which text stops being a professional, readable resume —
// compression will not go smaller than this even if a larger shrink would
// technically fit more onto fewer pages. 0.72 keeps ~9px minimums (the
// smallest label text most templates use) at roughly 6.5px, still legible
// on screen and in print.
export const MIN_SCALE = 0.72;

// Binary-search convergence tolerance on the scale value itself. 0.003 is
// comfortably tighter than a human can perceive as a font-size difference.
const SCALE_EPSILON = 0.003;

// Hard cap on measurement/search iterations so a pathological document
// (e.g. one huge unbreakable block) can't hang the browser tab.
const MAX_ITERATIONS = 20;

/**
 * @param {Object} args
 * @param {(scale: number) => number} args.measureFn - returns the REAL
 *   rendered pixel height of the resume content when displayed at `scale`.
 *   Must do a genuine DOM measurement, not an estimate.
 * @param {number} args.targetPages - desired page count (>= 1).
 * @param {number} args.visibleH - usable content height of one page, in
 *   px, i.e. A4 page height minus that template's top/bottom margin.
 * @param {number} [args.floor] - smallest allowed scale (defaults to
 *   MIN_SCALE, the readability floor above).
 *
 * @returns {{ scale: number, pages: number, fits: boolean, height: number }}
 *   `fits` is only ever true if the FINAL, re-verified measurement at the
 *   returned scale is <= targetPages * visibleH. If `fits` is false, the
 *   resume cannot be compressed to the target page count while staying at
 *   or above the readability floor, and the caller (CompressModal) must
 *   say so honestly rather than apply a broken result.
 */
export function findCompressionScale({ measureFn, targetPages, visibleH, floor = MIN_SCALE }) {
  const pages = Math.max(1, Math.round(targetPages) || 1);
  const limitH = pages * visibleH;

  // 1) Nothing to do — full size already fits the target.
  const fullH = measureFn(1);
  if (fullH <= limitH) {
    return { scale: 1, pages: Math.max(1, Math.ceil(fullH / visibleH)), fits: true, height: fullH };
  }

  // 2) Check the readability floor. If even the smallest allowed scale
  //    can't reach the target, compression alone cannot honestly deliver
  //    it — report the best achievable result instead of faking success.
  const floorH = measureFn(floor);
  if (floorH > limitH) {
    return { scale: floor, pages: Math.ceil(floorH / visibleH), fits: false, height: floorH };
  }

  // 3) Binary search within [floor, 1] for the LARGEST scale that still
  //    fits, i.e. the least amount of shrinking needed — keeps text as
  //    large and readable as the target page count allows. Every
  //    candidate is a real measurement; nothing is interpolated.
  let lo = floor;
  let hi = 1;
  let best = { scale: floor, height: floorH };
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

  // 4) Final verification pass — re-measure once more at the chosen scale
  //    immediately before reporting success, to guard against any layout
  //    jitter (web fonts finishing loading, async reflow) that may have
  //    occurred between earlier search iterations. Only this final number
  //    is trusted for the `fits` verdict.
  const finalH = measureFn(best.scale);
  const finalPages = Math.max(1, Math.ceil(finalH / visibleH));
  return { scale: best.scale, pages: finalPages, fits: finalH <= limitH, height: finalH };
}
