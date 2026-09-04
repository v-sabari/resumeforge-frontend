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
import { A4_W, A4_H, getPageMargin, scaleStyle } from '../utils/pageLayout.js';
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

function wrapHtml(bodyHtml) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; background: #fff; }
  body { width: ${A4_W}px; }
  ${compiledCss}
  h1, h2, h3 { break-after: avoid; page-break-after: avoid; }
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

    // COMPRESS FEATURE: apply the exact density scale the user verified in
    // the live preview (see utils/pageLayout.js:scaleStyle and
    // utils/compression.js for how it was derived and re-measured client
    // side). Wrapping here — rather than inside each template — means the
    // PDF's real layout height shrinks by the identical CSS mechanism
    // (`zoom`) the preview used, so Puppeteer's native pagination below
    // produces the SAME page count the user already confirmed on screen.
    const layoutScale = typeof resume.layoutScale === 'number' ? resume.layoutScale : 1;
    const wrapStyle = scaleStyle(layoutScale);
    const templateEl = React.createElement(Template, { data });
    const bodyHtml = ReactDOMServer.renderToStaticMarkup(
      wrapStyle ? React.createElement('div', { style: wrapStyle }, templateEl) : templateEl
    );
    const html = wrapHtml(bodyHtml);

    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: A4_W, height: A4_H });
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      width: `${A4_W}px`,
      height: `${A4_H}px`,
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
    });

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
