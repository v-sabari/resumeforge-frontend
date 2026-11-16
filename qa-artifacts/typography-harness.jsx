import { createElement, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext.jsx';
import { ResumeEditorProvider, useResumeEditorContext } from '../src/context/ResumeEditorContext.jsx';
import { TemplatesPanel } from '../src/components/builder/TemplatesPanel.jsx';
import { ResumePreview } from '../src/components/builder/ResumePreview.jsx';

/**
 * typography-harness.jsx
 *
 * Mounts the REAL editor pieces — the real TemplatesPanel (slider, family
 * select, reset, template grid) and the REAL ResumePreview — inside the REAL
 * providers (AuthProvider + ResumeEditorProvider), so the driver exercises the
 * production components and state, not a reimplementation.
 *
 * `window.__typ` exposes only reads + the same setters the editor itself uses,
 * so a headless driver can drive the control exactly like a user would.
 *
 * Network: the harness aborts /api/* requests at the Puppeteer level (see
 * qa-typography.mjs); AuthProvider's probes fail safe to "logged out", which is
 * irrelevant to typography.
 */

let mounts = 0;

function Inner() {
  const editor = useResumeEditorContext();
  const latest = useRef(editor);
  latest.current = editor;

  useEffect(() => { mounts += 1; }, []);

  useEffect(() => {
    window.__typ = {
      mounts: () => mounts,
      setResume(patch) { latest.current.setResume((p) => ({ ...p, ...patch })); },
      setTemplate(t) { latest.current.setTemplate(t); },
      state() {
        const e = latest.current;
        return {
          fontFamily: e.resume.fontFamily,
          fontSize: e.resume.fontSize,
          template: e.template,
          resumeTemplate: e.resume.template,
          currentId: e.currentId,
        };
      },
      slider() {
        const el = document.getElementById('resume-font-size');
        if (!el) return null;
        return {
          min: el.min, max: el.max, step: el.step, value: el.value,
          ariaValueText: el.getAttribute('aria-valuetext'),
          ariaDescribedBy: el.getAttribute('aria-describedby'),
        };
      },
      familySelect() {
        const el = document.getElementById('resume-font-family');
        return el ? el.value : null;
      },
      warning() {
        const el = document.getElementById('resume-font-size-warning');
        return el ? el.textContent.trim() : null;
      },
      sizeBadge() {
        const span = Array.from(document.querySelectorAll('span'))
          .find((s) => /^\d+\.\d\s+pt$/.test(s.textContent.trim()));
        return span ? span.textContent.trim() : null;
      },
      familyOptionCount() {
        const el = document.getElementById('resume-font-family');
        return el ? el.options.length : 0;
      },
      probe() {
        const holder = document.querySelector('.mx-auto.flex.flex-col.items-center');
        const badge = Array.from(document.querySelectorAll('span'))
          .find((s) => /^\d+\s+pages?$/.test(s.textContent.trim()));
        const sheets = holder ? Array.from(holder.children) : [];
        const text = sheets.map((s) => (s.innerText || '')).join(' ').replace(/\s+/g, ' ').trim();
        return {
          sheetCount: sheets.length,
          badge: badge ? badge.textContent.trim() : null,
          paintedTextLen: text.length,
          fontFamilyAttr: (() => {
            const w = document.querySelector('.resume-typography');
            return w ? w.getAttribute('data-font-family') : null;
          })(),
          typographyCss: (() => {
            const st = Array.from(document.querySelectorAll('style'))
              .find((s) => /resume-typography\[data-font-family/.test(s.textContent || ''));
            return st ? st.textContent.trim() : null;
          })(),
        };
      },
    };
  }, []);

  return createElement(
    'div',
    { className: 'mx-auto max-w-7xl px-4 sm:px-6 py-6' },
    createElement(
      'div',
      { className: 'grid gap-6 lg:grid-cols-2' },
      createElement(
        'div',
        { className: 'min-w-0 space-y-5', id: 'panel' },
        createElement(TemplatesPanel),
      ),
      createElement(
        'div',
        { className: 'min-w-0 flex flex-col gap-5', id: 'preview' },
        createElement(ResumePreview, {
          resume: { ...editor.resume, sectionsConfig: editor.sectionsConfig },
          template: editor.template,
        }),
      ),
    ),
  );
}

const container = document.getElementById('root');
createRoot(container).render(
  createElement(
    MemoryRouter,
    null,
    createElement(
      AuthProvider,
      null,
      createElement(ResumeEditorProvider, null, createElement(Inner)),
    ),
  ),
);
