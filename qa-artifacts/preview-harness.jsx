import { createElement, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ResumePreview } from '../src/components/builder/ResumePreview.jsx';

/**
 * preview-harness.jsx
 *
 * Mounts the REAL ResumePreview component (same one the Builder's right pane
 * uses) in a plain browser page so a headless driver can:
 *   - change the resume / font size exactly like the editor does,
 *   - confirm the preview does not remount or blank,
 *   - read back the pagination the A4Viewer actually produced
 *     (page count, per-page flow start + slice height, measure height).
 *
 * It intentionally does NOT reimplement pagination — it only reads the DOM
 * the production component rendered.
 */

let mounts = 0;
const onMount = () => { mounts += 1; };

function Host({ resume, template }) {
  useEffect(() => { onMount(); }, []);
  return createElement(ResumePreview, { resume, template });
}

const container = document.getElementById('root');
const root = createRoot(container);

let state = { resume: null, template: 'modern' };
const render = () => {
  root.render(createElement(Host, { resume: state.resume, template: state.template }));
};

function readSheets() {
  const holder = document.querySelector('.mx-auto.flex.flex-col.items-center');
  if (!holder) return [];
  return Array.from(holder.children).map((sheet) => {
    const page = sheet.firstElementChild;          // transform: scale(fit) page
    const windowEl = page && page.children[1];     // [topMargin, window, spacer, bottomMargin]
    const shiftEl = windowEl && windowEl.firstElementChild; // marginTop: -start
    const start = -(parseFloat(shiftEl && shiftEl.style.marginTop) || 0);
    const sliceH = parseFloat(windowEl && windowEl.style.height) || 0;
    const content = shiftEl && shiftEl.firstElementChild;
    const text = (content && content.innerText ? content.innerText : '').replace(/\s+/g, ' ').trim();
    return { start, sliceH, textLen: text.length, text };
  });
}

function readMeasure() {
  const hidden = document.querySelector('div[aria-hidden="true"]');
  const m = hidden && hidden.firstElementChild;
  return m ? { h: m.getBoundingClientRect().height, w: m.getBoundingClientRect().width } : null;
}

function readBadge() {
  const b = Array.from(document.querySelectorAll('span'))
    .find((s) => /^\d+\s+pages?$/.test(s.textContent.trim()));
  return b ? b.textContent.trim() : null;
}

// Mirrors utils/previewPagination.js collectAtomicBlocks EXACTLY, so the
// harness flags only the page units the paginator itself treats as atomic
// (an over-tall `break-inside:avoid` bubble is unwrapped, not flagged).
function readBlocks(visibleH) {
  const EPS = 0.5;
  const hidden = document.querySelector('div[aria-hidden="true"]');
  const rootEl = hidden && hidden.firstElementChild;
  if (!rootEl) return [];
  const rootRect = rootEl.getBoundingClientRect();
  const isAtomic = (el) => {
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
  const out = [];
  const walk = (p) => {
    for (const c of p.children) {
      const h = c.getBoundingClientRect().height;
      if ((isAtomic(c) || isHeadingLike(c)) && h <= visibleH + EPS) {
        const r = c.getBoundingClientRect();
        out.push({ tag: c.tagName, top: r.top - rootRect.top, bottom: r.bottom - rootRect.top, h: r.height,
                   text: (c.innerText || c.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60) });
      } else {
        walk(c);
      }
    }
  };
  walk(rootEl);
  return out;
}

// Every painted TEXT line box (one per wrapped line) in the measure node,
// relative to the measure root. A page boundary that falls strictly inside one
// of these is a genuine "half a line" cut — the artifact this audit exists to
// catch. Range.getClientRects() returns one rect per line box for a text node,
// which is exactly line granularity.
function readLines() {
  const hidden = document.querySelector('div[aria-hidden="true"]');
  const rootEl = hidden && hidden.firstElementChild;
  if (!rootEl) return [];
  const rootRect = rootEl.getBoundingClientRect();
  const out = [];
  const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (!node.nodeValue || !node.nodeValue.trim()) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) {
      if (r.height <= 0 || r.width <= 0) continue;
      out.push({
        top: r.top - rootRect.top,
        bottom: r.bottom - rootRect.top,
        text: node.nodeValue.replace(/\s+/g, ' ').trim().slice(0, 50),
      });
    }
  }
  return out;
}

window.__harness = {
  set(resume, template) { state = { resume, template }; render(); },
  mounts: () => mounts,
  blocks: readBlocks,
  lines: readLines,
  probe() {
    const sheets = readSheets();
    return {
      mounts,
      badge: readBadge(),
      sheetCount: sheets.length,
      sheets,
      measure: readMeasure(),
      // Sanity: is any of the resume's headline text actually painted?
      paintedTextLen: sheets.reduce((n, s) => n + s.textLen, 0),
    };
  },
};
