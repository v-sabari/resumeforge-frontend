import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { ResumePreview } from '../src/components/builder/ResumePreview.jsx';

/**
 * preview-scaling-harness.jsx
 *
 * Mounts the REAL ResumePreview inside a wrapper that mirrors the Builder's
 * actual DOM: AppLayout's `mx-auto max-w-7xl px-4 sm:px-6` container, then the
 * Builder's `grid gap-6 lg:grid-cols-2` split with the same preview column
 * classes (components/builder/BuilderLayout.jsx + layouts/AppLayout.jsx).
 *
 * The point is to measure whether the A4 sheet is clipped by its frame at the
 * widths the spec calls out (390/768/1024/1536). It does NOT reimplement any
 * layout — it only reads the DOM the production components rendered.
 */

const container = document.getElementById('root');
const root = createRoot(container);

let state = { resume: null, template: 'modern', legacy: !!window.__LEGACY__ };

const render = () => root.render(
  createElement(
    'div',
    { className: 'mx-auto max-w-7xl px-4 sm:px-6 py-6' },
    createElement(
      'div',
      { className: 'grid gap-6 lg:grid-cols-2' },
      // Left tool panel (placeholder) — same min-w-0 the real one has.
      createElement('div', { className: 'min-w-0 space-y-5' },
        createElement('div', { style: { height: 40 } }, 'left panel')),
      // Live preview column — EXACT classes from BuilderLayout.jsx.
      // `legacy` reproduces the pre-fix markup (no min-w-0) for before/after.
      createElement(
        'div',
        {
          className: [
            state.legacy ? '' : 'min-w-0',
            'flex flex-col gap-5',
            'lg:sticky lg:top-6',
            'lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1',
          ].filter(Boolean).join(' '),
          style: { scrollbarWidth: 'thin' },
        },
        createElement(ResumePreview, { resume: state.resume, template: state.template }),
      ),
    ),
  ),
);

render();

const rectOf = (el) => {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
};

function measure() {
  const doc = document.documentElement;
  const holder = document.querySelector('.mx-auto.flex.flex-col.items-center');
  const shell = holder && holder.parentElement;
  const previewRoot = shell && shell.parentElement;        // ResumePreview root
  const column = previewRoot && previewRoot.parentElement;  // Builder preview column
  const outer = document.querySelector('.max-w-7xl');
  const sheet = holder && holder.firstElementChild;         // first A4 sheet
  const page = sheet && sheet.firstElementChild;            // transform: scale(...) page

  let scale = 1;
  const tf = page && page.style && page.style.transform;
  const m = tf && /scale\(([^)]+)\)/.exec(tf);
  if (m) scale = parseFloat(m[1]);

  const sheetRect = rectOf(sheet);
  const columnRect = rectOf(column);
  const outerRect = rectOf(outer);
  const shellRect = rectOf(shell);

  const overflowPage = Math.max(0, doc.scrollWidth - doc.clientWidth);
  // A sheet is "clipped" when its right edge passes the visible right edge of
  // its own frame (column content) or the page's outer container.
  const clipVsColumn = sheetRect && columnRect ? Math.max(0, sheetRect.right - columnRect.right) : null;
  const clipVsOuter  = sheetRect && outerRect  ? Math.max(0, sheetRect.right - outerRect.right)  : null;

  return {
    legacyFlag: !!window.__LEGACY__,
    columnClass: column ? column.className : null,
    viewport: { clientWidth: doc.clientWidth, scrollWidth: doc.scrollWidth, overflowPage },
    outer: outerRect,
    column: columnRect,
    shell: shellRect ? { ...shellRect, clientWidth: shell.clientWidth, clientHeight: shell.clientHeight } : null,
    sheet: sheetRect,
    scale,
    clipVsColumn,
    clipVsOuter,
    sheetCount: holder ? holder.children.length : 0,
  };
}

window.__scaling = {
  set(resume, template) { state = { ...state, resume, template }; render(); },
  setLegacy(v) { state = { ...state, legacy: !!v }; render(); },
  measure,
};
