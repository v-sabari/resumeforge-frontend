/* eslint-disable no-console */
/**
 * qa-template-previews.mjs — renders the 20 template gallery preview images.
 *
 * For every resume template it:
 *   1. server-renders the SAME React component the live preview / PDF use
 *      (via qa-artifacts/.build/render.cjs) with the curated one-page
 *      qa-artifacts/template-preview-data.json,
 *   2. loads that markup in real Chrome with the SAME compiled CSS
 *      (api/_pdf-compiled.css) and the SAME embedded Inter fonts the export
 *      page uses,
 *   3. screenshots exactly one page at the template's real page size
 *      (A4 794x1123, US Letter 816x1056 for academic), and
 *   4. writes the product image to public/templates/<id>.png plus a raw copy
 *      and a JSON report under qa-artifacts/template-renders/.
 *
 * Usage: node qa-artifacts/qa-template-previews.mjs [template ...]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const require = createRequire(import.meta.url);

const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const A4 = { w: 794, h: 1123 };
const US_LETTER = { w: 816, h: 1056 };
const PAGE = { academic: US_LETTER };

const TEMPLATE_ORDER = [
  'modern', 'classic', 'minimal', 'executive', 'fresher', 'creative',
  'corporate', 'traditional', 'clean', 'graduate', 'tech', 'engineering',
  'leadership', 'designer', 'sleek', 'contemporary', 'academic', 'research',
  'medical', 'finance',
];
const TEMPLATE_COMPONENT = {
  modern: 'ModernProTemplate', classic: 'ClassicTemplate', minimal: 'MinimalATSTemplate',
  executive: 'ExecutiveTemplate', fresher: 'FresherTemplate', creative: 'CreativeATSTemplate',
  corporate: 'CorporateTemplate', traditional: 'TraditionalTemplate', clean: 'CleanTemplate',
  graduate: 'GraduateTemplate', tech: 'TechTemplate', engineering: 'EngineeringTemplate',
  leadership: 'LeadershipTemplate', designer: 'DesignerTemplate', sleek: 'SleekTemplate',
  contemporary: 'ContemporaryTemplate', academic: 'AcademicTemplate', research: 'ResearchTemplate',
  medical: 'MedicalTemplate', finance: 'FinanceTemplate',
};

const publicDir = path.join(root, 'public', 'templates');
const rawDir = path.join(here, 'template-renders');
fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(rawDir, { recursive: true });

const requested = process.argv.slice(2);
const templates = requested.length ? requested : TEMPLATE_ORDER;

const { INTER_FONT_FACES } = await import(pathToFileURL(path.join(root, 'api', '_pdf-fonts.js')).href);
const compiledCss = fs.readFileSync(path.join(root, 'api', '_pdf-compiled.css'), 'utf8');
const { render } = require(path.join(here, '.build', 'render.cjs'));
const resume = JSON.parse(fs.readFileSync(path.join(here, 'template-preview-data.json'), 'utf8'));

function wrapHtml(bodyHtml, pageW) {
  return `<!doctype html>
<html><head><meta charset="utf-8" /><style>
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; background: #fff; }
  body { width: ${pageW}px; }
  ${INTER_FONT_FACES.map((f) => `@font-face{font-family:'Inter';font-style:normal;font-weight:${f.weight};font-display:block;src:url(data:font/woff2;base64,${f.base64}) format('woff2');}`).join('\n')}
  ${compiledCss}
</style></head><body>${bodyHtml}</body></html>`;
}

function pngSize(buffer) {
  // PNG IHDR: width at byte 16, height at byte 20 (big-endian uint32).
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

async function main() {
  if (!fs.existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}`);
  const puppeteer = (await import('puppeteer-core')).default;

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none', '--force-color-profile=srgb', '--hide-scrollbars'],
    executablePath: CHROME,
    headless: true,
  });

  const report = {
    generatedAt: new Date().toISOString(),
    chrome: CHROME,
    sourceData: 'qa-artifacts/template-preview-data.json',
    css: 'api/_pdf-compiled.css',
    templates: {},
  };

  for (const key of templates) {
    const component = TEMPLATE_COMPONENT[key];
    const markup = render(component, resume);
    const size = PAGE[key] || A4;
    const page = await browser.newPage();
    await page.setViewport({ width: size.w, height: size.h, deviceScaleFactor: 1 });
    await page.setContent(wrapHtml(markup, size.w), { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    const buf = Buffer.from(await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: size.w, height: size.h } }));
    await page.close();

    const publicFile = path.join(publicDir, `${key}.png`);
    const rawFile = path.join(rawDir, `${key}.png`);
    fs.writeFileSync(publicFile, buf);
    fs.writeFileSync(rawFile, buf);
    fs.writeFileSync(path.join(rawDir, `${key}.html`), wrapHtml(markup, size.w), 'utf8');

    const dim = pngSize(buf);
    report.templates[key] = {
      component,
      pageSize: `${size.w}x${size.h}`,
      image: `public/templates/${key}.png`,
      width: dim.width,
      height: dim.height,
      bytes: buf.length,
    };
    console.log(`${key.padEnd(13)} ${dim.width}x${dim.height}  ${String(Math.round(buf.length / 1024)).padStart(4)} KB  public/templates/${key}.png`);
  }

  await browser.close();
  fs.writeFileSync(path.join(rawDir, 'report.json'), JSON.stringify(report, null, 2), 'utf8');
  console.log(`\nimages: ${Object.keys(report.templates).length}/${TEMPLATE_ORDER.length}`);
  console.log(`report: qa-artifacts/template-renders/report.json`);
}

main().catch((err) => { console.error(err); process.exit(1); });
