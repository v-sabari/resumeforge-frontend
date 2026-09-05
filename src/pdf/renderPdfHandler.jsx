/**
 * src/pdf/renderPdfHandler.jsx
 *
 * THIS is the real, editable source for the PDF render endpoint.
 * It is NOT deployed directly — api/render-pdf.js is a GENERATED file,
 * produced from this one by `npm run build:api` (esbuild), which compiles
 * away all JSX syntax before Vercel ever sees it.
 *
 * WHY THIS FILE MOVED OUT OF api/:
 * Root cause of the July 2026 export outage: Vercel's Node Functions use
 * Node File Trace to copy an entrypoint's imported files as-is into the
 * deployed function — it does NOT transpile .jsx syntax (only .ts/.tsx get
 * any build-time transform). When api/render-pdf.js imported
 * ModernProTemplate.jsx etc. directly, Node File Trace copied the raw,
 * untranspiled .jsx file into the deployed function, and Node's native ESM
 * loader crashed at runtime with:
 *   TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".jsx"
 * because Node has no built-in rule for parsing ".jsx" — ever, regardless
 * of Node version. Every export attempt failed 100% of the time.
 *
 * THE FIX: esbuild now bundles this file — and everything it imports,
 * including all 6 .jsx templates — into a single, dependency-free (except
 * declared node_modules externals) plain-JavaScript file at api/render-pdf.js
 * as part of the Vercel build step, before Node File Trace ever runs. By the
 * time Vercel packages the function, zero .jsx files remain in the import
 * graph — the JSX was already compiled away by esbuild.
 *
 * This is the exact same technique the original standalone render-service
 * used successfully (esbuild --loader:.jsx=jsx --jsx=automatic), just now
 * run as part of this repo's own build instead of a separate service's.
 *
 * DO NOT edit api/render-pdf.js directly — it is regenerated on every build
 * and any manual edits there will be silently overwritten and lost.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

import { buildTransformed } from '../utils/transformResume.js';
import { A4_W, A4_H, getPageMargin, getPageSize, scaleStyle } from '../utils/pageLayout.js';
import { DEFAULT_SECTIONS_CONFIG } from '../utils/sectionsCatalog.js';
import {
  ModernProTemplate,
  MinimalATSTemplate,
  ExecutiveTemplate,
  FresherTemplate,
  CreativeATSTemplate,
  ClassicTemplate,
  CorporateTemplate,
  TraditionalTemplate,
  CleanTemplate,
  GraduateTemplate,
  TechTemplate,
  EngineeringTemplate,
  LeadershipTemplate,
  DesignerTemplate,
  SleekTemplate,
  ContemporaryTemplate,
  AcademicTemplate,
  ResearchTemplate,
  MedicalTemplate,
  FinanceTemplate,
} from '../components/resume/templates/index.js';

// NOTE: __dirname here resolves relative to the FINAL BUNDLED file's
// location at runtime (api/render-pdf.js), not this source file's location
// — esbuild preserves import.meta.url semantics correctly through bundling,
// so this correctly points at api/ where _pdf-compiled.css also lives.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TEMPLATE_MAP = {
  modern: ModernProTemplate,
  classic: ClassicTemplate,
  minimal: MinimalATSTemplate,
  executive: ExecutiveTemplate,
  fresher: FresherTemplate,
  creative: CreativeATSTemplate,
  corporate: CorporateTemplate,
  traditional: TraditionalTemplate,
  clean: CleanTemplate,
  graduate: GraduateTemplate,
  tech: TechTemplate,
  engineering: EngineeringTemplate,
  leadership: LeadershipTemplate,
  designer: DesignerTemplate,
  sleek: SleekTemplate,
  contemporary: ContemporaryTemplate,
  academic: AcademicTemplate,
  research: ResearchTemplate,
  medical: MedicalTemplate,
  finance: FinanceTemplate,
};

// Compiled by `npm run build:pdf-css` (see package.json), which runs
// tailwindcss scoped to src/components/resume/templates/**/*.jsx only —
// kept separate from the app's main Tailwind build so this function's
// bundle stays small.
const compiledCss = readFileSync(path.join(__dirname, '_pdf-compiled.css'), 'utf8');

// Source of utils/previewPagination.js, embedded as a text file by
// scripts/build-pagination.mjs (see api/_pagination.text.js). The live
// preview computes page breaks with this EXACT module; re-running it inside
// the print page lets us stamp the same breaks into Chrome's pagination, so
// the PDF always prints the page count (and break positions) the user saw on
// screen. Read at runtime from the bundled api/ directory, exactly like
// _pdf-compiled.css above.
let PAGINATION_SOURCE = null;
try {
  PAGINATION_SOURCE = readFileSync(path.join(__dirname, '_pagination.text.js'), 'utf8');
} catch {
  // older standalone deployments without the generated file: fall back to
  // Chrome's native pagination (no annotation) — export still works.
}

function wrapHtml(bodyHtml, pageW) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; background: #fff; }
  body { width: ${pageW}px; }
  ${compiledCss}
  /* PAGE-BREAK RULES: the same break-controls the on-screen preview now
     enforces element-wise (see utils/previewPagination.js) are expressed here
     for the export engine. Chrome's print fragmenter honors these, so a list
     item or paragraph that would straddle a page edge moves whole to the next
     page instead of being sliced mid-line — and because the fraction assumes
     line-level granularity, orphans/widows stop single stray lines from being
     orphaned alone at a page bottom. Applies inside @media print so the
     exported PDF and the on-screen preview break consistently. */
  @media print {
    p, li, .break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
    p { orphans: 3; widows: 3; }
    h1, h2, h3, h4, h5, h6 { break-after: avoid; page-break-after: avoid; }
  }
  h1, h2, h3, h4, h5, h6 { break-after: avoid; page-break-after: avoid; }
  li { break-inside: avoid; page-break-inside: avoid; }
</style>
</head>
<body>${bodyHtml}</body>
</html>`;
}

let browserPromise = null;
async function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: A4_W, height: A4_H },
      executablePath: await chromium.executablePath(
        process.env.CHROMIUM_PACK_URL // see README note for how to set this
      ),
      headless: chromium.headless,
    });
  }
  return browserPromise;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const secret = req.headers['x-internal-secret'];
  if (!secret || secret !== process.env.RENDER_INTERNAL_SECRET) {
    return res.status(403).json({ error: 'forbidden' });
  }

  try {
    const { resume, template } = req.body || {};
    if (!resume) return res.status(400).json({ error: 'resume is required' });

    const sectionsConfig = (resume.sectionsConfig && resume.sectionsConfig.length > 0)
      ? resume.sectionsConfig
      : DEFAULT_SECTIONS_CONFIG;

    const data = buildTransformed(resume, sectionsConfig);
    // Resolve to the SAME key used to look up the margin config, so a
    // resume with an unknown/missing template falls back to 'modern' in
    // both the rendered markup and the margin applied to it — never one
    // without the other.
    const templateKey = TEMPLATE_MAP[template] ? template : 'modern';
    const Template = TEMPLATE_MAP[templateKey];
    const { top: marginTop, bottom: marginBottom } = getPageMargin(templateKey);
    const { w: pageW, h: pageH } = getPageSize(templateKey);

    // COMPRESS FEATURE: apply the exact density scale the user verified in
    // the live preview (see utils/pageLayout.js:scaleStyle and
    // utils/compression.js for how it was derived and re-measured client
    // side). Wrapping here — rather than inside each template — means the
    // PDF's real layout height shrinks by the identical CSS mechanism
    // (`zoom`) the preview used, so Puppeteer's native pagination below
    // produces the SAME page count the user already confirmed on screen.
    const layoutScale = typeof resume.layoutScale === 'number' ? resume.layoutScale : 1;
    const wrapStyle = scaleStyle(layoutScale, pageW);
    const templateEl = React.createElement(Template, { data });
    const bodyHtml = ReactDOMServer.renderToStaticMarkup(
      wrapStyle ? React.createElement('div', { style: wrapStyle }, templateEl) : templateEl
    );
    const html = wrapHtml(bodyHtml, pageW);

    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: pageW, height: pageH });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // PREVIEW/EXPORT PARITY: re-run the LIVE preview's pagination inside the
    // print page and stamp an explicit print break at every element-aware
    // boundary the user just saw. Chrome honors break-before:page on these
    // atomic-block tops, so the exported PDF paginates at EXACTLY the same
    // flow positions (and therefore the same page count) as the on-screen
    // preview — at any compress scale — instead of letting Chrome's own
    // fragmenter choose (which can differ for over-tall section bubbles such
    // as the Research template's experience card). If no atomic blocks exist
    // (computePageStarts returns null) nothing is stamped and Chrome paginates
    // naturally, as before.
    const visibleH = pageH - marginTop - marginBottom;
    let annotation = null;
    if (PAGINATION_SOURCE) {
      annotation = await page.evaluate(([source, scale, visibleH]) => {
        (0, eval)(source);
        const root = document.body.firstElementChild;
        if (!root) return null;
        // computePageStarts is injected at runtime by (0, eval)(source).
        // eslint-disable-next-line no-undef
        const starts = computePageStarts(root, visibleH, scale);
        if (!starts || starts.length < 2) return null;
        const isAtomic = (el) => {
          if (!(el instanceof HTMLElement)) return false;
          const tag = el.tagName;
          if (tag === 'LI' || tag === 'P' || /^H[1-6]$/.test(tag)) return true;
          const cs = getComputedStyle(el);
          return cs.breakInside === 'avoid' || cs.pageBreakInside === 'avoid';
        };
        const atomics = [];
        const all = [];
        const walk = (p) => {
          for (const c of p.children) {
            all.push(c);
            if (isAtomic(c)) atomics.push(c);
            if (c.firstElementChild) walk(c);
          }
        };
        walk(root);
        const rootTop = root.getBoundingClientRect().top;
        const unTop = (el) => (el.getBoundingClientRect().top - rootTop) / scale;
        const applyBreak = (el) => {
          el.style.setProperty('break-before', 'page');
          el.style.setProperty('page-break-before', 'always');
        };
        let count = 0;
        for (const b of starts.slice(1)) {
          // EXACT atomic-top boundary: stamp the break on that element.
          let best = null;
          let bestD = Infinity;
          for (const el of atomics) {
            const d = Math.abs(unTop(el) - b);
            if (d < bestD) { bestD = d; best = el; }
          }
          if (best && bestD <= 1.5) { applyBreak(best); count += 1; continue; }
          // INTERIOR forced-split: this boundary sits inside an over-tall
          // break-inside:avoid bubble (the preview slices it mid-container).
          // Insert a zero-height break-before sentinel at that flow position —
          // a forced break is honored even inside a break-inside:avoid box,
          // so Chrome paginates at EXACTLY the y the preview showed.
          let minEl = null;
          let minT = Infinity;
          for (const el of all) {
            const t = unTop(el);
            if (t >= b - 0.01 && t < minT) { minT = t; minEl = el; }
          }
          if (minEl && minT - b <= visibleH) {
            const sentinel = document.createElement('div');
            sentinel.style.cssText = 'height:0;margin:0;padding:0;border:0;width:0;break-before:page;page-break-before:always;';
            minEl.parentNode.insertBefore(sentinel, minEl);
            count += 1;
          }
        }
        return { stamped: count, expected: starts.length };
      }, [PAGINATION_SOURCE, layoutScale, visibleH]);
    }

    if (annotation && annotation.stamped > 0) console.log(`render-pdf: stamped ${annotation.stamped} element-aware page breaks (template=${templateKey} scale=${layoutScale})`);

    const pdfOpts = {
      width: `${pageW}px`,
      height: `${pageH}px`,
      printBackground: true,
      // Real top/bottom margin, per template, applied by Chrome's print
      // engine to EVERY page it paginates — this is what actually fixes
      // "content touching the page edge": Puppeteer re-applies this margin
      // at each page break automatically, not just at the very start/end
      // of the document. Left/right stay at 0 because each template's own
      // horizontal padding already runs continuously down the whole page
      // and needs no per-page repetition (see utils/pageLayout.js).
      margin: { top: `${marginTop}px`, bottom: `${marginBottom}px`, left: '0px', right: '0px' },
      preferCSSPageSize: false,
    };
    const countPdfPages = (buf) => (Buffer.from(buf).toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length;

    let pdfBuffer = await page.pdf(pdfOpts);
    let pdfPages = countPdfPages(pdfBuffer);

    // VERIFY the annotated render reproduced the preview's exact page count.
    // Forced breaks are honored even inside break-inside:avoid, but in rare
    // cases (non-collapsing margins, orphan/keep-next chains) the sentinel can
    // land a few px off the util boundary and Chrome shifts a fragment onto an
    // extra page. When that happens the annotated render diverges, so fall
    // back to Chrome's native pagination — which was the previous (and
    // verified-on-20-templates) behavior. If even the natural render misses,
    // prefer whichever run reproduced the preview count; else keep the
    // annotated output (closest to what the user saw).
    if (annotation && annotation.expected != null && pdfPages !== annotation.expected) {
      await page.close();
      const cleanPage = await browser.newPage();
      await cleanPage.setViewport({ width: pageW, height: pageH });
      await cleanPage.setContent(html, { waitUntil: 'networkidle0' });
      const naturalBuffer = await cleanPage.pdf(pdfOpts);
      const naturalPages = countPdfPages(naturalBuffer);
      await cleanPage.close();
      console.log(`render-pdf: annotated=${pdfPages} natural=${naturalPages} expected=${annotation.expected} (template=${templateKey} scale=${layoutScale})`);
      if (naturalPages === annotation.expected) pdfBuffer = naturalBuffer;
      else if (naturalPages === pdfPages && pdfPages !== annotation.expected) {
        // neither matches: fall back to the previous verified (natural) output.
        pdfBuffer = naturalBuffer;
      }
    }

    await page.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.status(200).send(Buffer.from(pdfBuffer));
  } catch (err) {
    console.error('render-pdf failed:', err);
    res.status(500).json({ error: 'render_failed', message: err.message });
  }
}

export const config = {
  api: { bodyParser: { sizeLimit: '5mb' } },
  maxDuration: 60, // requires Vercel Pro; Hobby caps at 10s regardless of this value
};
