/**
 * api/render-pdf.js
 *
 * Vercel serverless function. Replaces the standalone `resume-render-service`
 * (Node/Playwright, deployed separately) so PDF rendering lives inside this
 * same frontend repo/deployment instead of a third repo.
 *
 * Why this is safe to co-locate here: it imports the EXACT SAME
 * `buildTransformed` function and the EXACT SAME 6 template components used
 * by the live browser preview (src/components/builder/ResumePreview.jsx).
 * There is no copy of these files anymore — this function and the preview
 * both import directly from src/, so they can never drift apart.
 *
 * Auth: this endpoint is public at the URL level (Vercel serverless
 * functions have no "private service" mode), so it's protected by a shared
 * secret header instead. Only the Java backend, which holds the same
 * secret via an env var, can successfully call it.
 *
 * Called by: ExportService.java -> POST https://<your-vercel-domain>/api/render-pdf
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

import { buildTransformed } from '../src/utils/transformResume.js';
import {
  ModernProTemplate,
  MinimalATSTemplate,
  ExecutiveTemplate,
  FresherTemplate,
  CreativeATSTemplate,
  ClassicTemplate,
} from '../src/components/resume/templates/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/*
 * Inlined default sections config — deliberately NOT imported from
 * src/utils/constants.js, because that file's first line reads
 * `import.meta.env.VITE_APP_NAME`, a Vite-only global that doesn't exist
 * when this file runs as a plain Node serverless function outside Vite's
 * build pipeline. Importing constants.js here would throw at cold start.
 *
 * SYNC NOTE: if you ever reorder/rename/add a STANDARD_SECTIONS entry in
 * src/utils/constants.js, mirror the same change in this array. This is the
 * one remaining manually-synced piece (down from 4 whole files in the old
 * separate render-service).
 */
const STANDARD_SECTION_KEYS = [
  'basics', 'summary', 'skills', 'experience', 'projects',
  'education', 'certifications', 'achievements', 'languages',
];
const DEFAULT_SECTIONS_CONFIG = STANDARD_SECTION_KEYS.map((key, i) => ({
  id: key, type: 'standard', key, label: key, visible: true, order: i,
}));

// A4 @ 96dpi — identical constants to A4_W/A4_H in ResumePreview.jsx, so the
// printed page is dimensionally the same box the person previewed.
const A4_W = 794;
const A4_H = 1123;

const TEMPLATE_MAP = {
  modern: ModernProTemplate,
  classic: ClassicTemplate,
  minimal: MinimalATSTemplate,
  executive: ExecutiveTemplate,
  fresher: FresherTemplate,
  creative: CreativeATSTemplate,
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
        process.env.CHROMIUM_PACK_URL // see README note below for how to set this
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
    const Template = TEMPLATE_MAP[template] || TEMPLATE_MAP.modern;

    const bodyHtml = ReactDOMServer.renderToStaticMarkup(
      React.createElement(Template, { data })
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
      margin: { top: '0px', bottom: '0px', left: '0px', right: '0px' },
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
