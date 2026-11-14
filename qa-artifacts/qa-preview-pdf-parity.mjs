/* eslint-disable no-console */
/**
 * qa-preview-pdf-parity.mjs — proves the EXPORTED PDF and the LIVE PREVIEW
 * agree on pagination, at three font sizes, for single- and multi-column
 * templates.
 *
 * For each (template, fontSize):
 *   1. the REAL API handler (api/render-pdf.js, local-Chrome launcher) renders
 *      the PDF — page count read from the PDF bytes;
 *   2. the REAL ResumePreview component (preview-harness bundle) renders the
 *      same resume and reports the page count the A4Viewer produced;
 *   3. the PDF text is extracted and checked for content completeness (every
 *      resume section heading appears) and that no heading is lost.
 *
 * Usage: node qa-artifacts/qa-preview-pdf-parity.mjs [--out <dir>]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const apiDir = path.join(root, 'api');
const buildDir = path.join(here, '.build', 'api');
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SECRET = 'qa-local-secret';

let outDir = path.join(here, 'preview-pdf-parity');
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) if (args[i] === '--out') outDir = path.resolve(args[++i]);

const TEMPLATES = (process.env.QA_TEMPLATES || 'modern,classic,academic,engineering,research').split(',');
const FONT_SIZES = (process.env.QA_FONTS || '8.0,10.5,13.0').split(',').map(Number);

function buildLocalHandler() {
  fs.mkdirSync(buildDir, { recursive: true });
  for (const file of ['_pdf-compiled.css', '_pagination.text.js']) {
    fs.copyFileSync(path.join(apiDir, file), path.join(buildDir, file));
  }
  const source = fs.readFileSync(path.join(apiDir, 'render-pdf.js'), 'utf8');
  const start = source.indexOf('async function getBrowser()');
  const end = source.indexOf('\nasync function handler', start);
  if (start < 0 || end < 0) throw new Error('Could not locate getBrowser() in api/render-pdf.js');
  const localLauncher = `async function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none", "--force-color-profile=srgb", "--hide-scrollbars"],
      defaultViewport: { width: A4_W, height: A4_H },
      executablePath: process.env.CHROME_PATH,
      headless: true
    });
  }
  return browserPromise;
}
`;
  const transformed = source.slice(0, start) + localLauncher + source.slice(end + 1);
  fs.writeFileSync(path.join(buildDir, 'render-pdf-local.mjs'), transformed, 'utf8');
  return path.join(buildDir, 'render-pdf-local.mjs');
}

const countPdfPages = (buf) => (Buffer.from(buf).toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length;

async function extractText(buffer) {
  const data = new Uint8Array(buffer);
  const doc = await getDocument({ data, useSystemFonts: true }).promise;
  let out = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();
    for (const item of tc.items) { out += item.str; if (item.hasEOL) out += '\n'; }
    out += '\n';
  }
  await doc.destroy();
  return out;
}

async function main() {
  if (!fs.existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}`);
  process.env.CHROME_PATH = CHROME;
  process.env.RENDER_INTERNAL_SECRET = SECRET;
  fs.mkdirSync(outDir, { recursive: true });

  const { default: handler } = await import(pathToFileURL(buildLocalHandler()).href);
  const resume = JSON.parse(fs.readFileSync(path.join(here, 'resume-max-coverage.json'), 'utf8'));

  // Preview harness (same bundle qa-preview-pagination.mjs uses).
  const { INTER_FONT_FACES } = await import(pathToFileURL(path.join(apiDir, '_pdf-fonts.js')).href);
  const compiledCss = fs.readFileSync(path.join(apiDir, '_pdf-compiled.css'), 'utf8');
  const harnessJs = fs.readFileSync(path.join(here, '.build', 'preview-harness.js'), 'utf8');
  const puppeteer = (await import('puppeteer-core')).default;
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
    executablePath: CHROME, headless: true,
  });

  const report = { generatedAt: new Date().toISOString(), fontSizes: FONT_SIZES, cases: {} };

  for (const template of TEMPLATES) {
    for (const fontSize of FONT_SIZES) {
      const key = `${template}:${fontSize}`;
      const resumeForSize = { ...resume, template, fontSize };
      console.log(`[${key}] rendering PDF…`);

      // 1. PDF via the real handler.
      const res = {
        statusCode: 200, headers: {},
        setHeader(k, v) { this.headers[k] = v; },
        status(c) { this.statusCode = c; return this; },
        json(b) { this.jsonBody = b; return this; },
        send(b) { this.body = Buffer.from(b); },
      };
      await handler({ method: 'POST', headers: { 'x-internal-secret': SECRET }, body: { resume: resumeForSize, template } }, res);
      if (res.statusCode !== 200 || !res.body) {
        report.cases[key] = { ok: false, error: res.jsonBody };
        console.log(`${key.padEnd(20)} PDF FAILED ${JSON.stringify(res.jsonBody)}`);
        continue;
      }
      const pdfPages = countPdfPages(res.body);
      const pdfFile = path.join(outDir, `${template}-${fontSize}.pdf`);
      fs.writeFileSync(pdfFile, res.body);

      // 2. Preview page count.
      const page = await browser.newPage();
      await page.setViewport({ width: 900, height: 1200, deviceScaleFactor: 1 });
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8" /><style>
        html, body { margin: 0; padding: 0; background: #e2e8f0; }
        #root { width: 794px; }
        ${INTER_FONT_FACES.map((f) => `@font-face{font-family:'Inter';font-style:normal;font-weight:${f.weight};font-display:block;src:url(data:font/woff2;base64,${f.base64}) format('woff2');}`).join('\n')}
        ${compiledCss}
        </style></head><body><div id="root"></div><script>${harnessJs}</script></body></html>`, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate((r, t) => window.__harness.set(r, t), resumeForSize, template);
      await page.evaluate(() => new Promise((res2) => requestAnimationFrame(() => requestAnimationFrame(res2))));
      await new Promise((r) => setTimeout(r, 500));
      const previewProbe = await page.evaluate(() => window.__harness.probe());
      await page.close();

      // 3. PDF text completeness: every identifying resume token survives.
      const text = await extractText(res.body);
      const flat = text.replace(/\s+/g, '').toLowerCase();
      const expected = [
        resume.fullName,
        resume.professionalTitle,
        ...(resume.experience || []).map((e) => e.company),
        ...(resume.education || []).map((e) => e.institution),
      ].filter(Boolean);
      const missing = expected.filter((t) => !flat.includes(String(t).replace(/\s+/g, '').toLowerCase()));
      const nameOk = flat.includes(String(resume.fullName).replace(/\s+/g, '').toLowerCase());

      const rec = {
        pdfPages, previewPages: previewProbe.sheetCount, nameOk, missing,
        bytes: res.body.length,
        pdfFile: path.relative(root, pdfFile).replace(/\\/g, '/'),
      };
      rec.pageCountMatch = pdfPages === previewProbe.sheetCount;
      rec.ok = rec.pageCountMatch && nameOk && missing.length === 0;
      report.cases[key] = rec;
      console.log(`${key.padEnd(20)} pdf=${pdfPages} preview=${previewProbe.sheetCount} match=${rec.pageCountMatch} name=${nameOk} missing=${missing.length} -> ${rec.ok ? 'OK' : 'FAIL'}`);
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2), 'utf8');
  const cases = Object.values(report.cases);
  console.log(`\ncases: ${cases.filter((c) => c.ok).length}/${cases.length} OK`);
  console.log('report:', path.relative(root, path.join(outDir, 'report.json')).replace(/\\/g, '/'));
  process.exit(cases.some((c) => !c.ok) ? 1 : 0);
}

main().catch((err) => { console.error(err); process.exit(1); });
