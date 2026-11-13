/* eslint-disable no-console */
/**
 * qa-summary.mjs — summary text wrapping / paragraph-preservation audit.
 *
 * Renders every one of the 20 resume templates through the SAME React
 * component the live preview and the PDF export use, inside real Chrome with
 * the SAME compiled CSS + Inter fonts the export page uses, then measures the
 * summary element:
 *
 *   - computed `white-space` (must be `pre-line` so Enter/newlines survive)
 *   - computed `overflow-wrap` / `word-break`
 *   - number of visual line boxes (Range.getClientRects().length)
 *   - horizontal overflow (scrollWidth > clientWidth)
 *
 * A full-page screenshot per template is written so the collapse/overflow is
 * visible, not just asserted.
 *
 * Usage:
 *   node qa-artifacts/qa-summary.mjs [--out <dir>] [template ...]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const require = createRequire(import.meta.url);

const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const A4 = { modern: { w: 794, h: 1123 }, academic: { w: 816, h: 1056 } };

const args = process.argv.slice(2);
let outDir = path.join(here, 'summary-bug');
const requested = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out') outDir = path.resolve(args[++i]);
  else requested.push(args[i]);
}

const { INTER_FONT_FACES } = await import(pathToFileURL(path.join(root, 'api', '_pdf-fonts.js')).href);
const compiledCss = fs.readFileSync(path.join(root, 'api', '_pdf-compiled.css'), 'utf8');
const { render } = require(path.join(here, '.build', 'render.cjs'));

const dataset = JSON.parse(fs.readFileSync(path.join(here, 'summary-wrap-dataset.json'), 'utf8'));
const SUMMARY = dataset.summary;
const TOKEN = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

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

function measureInPage(token, summaryLineCount) {
  const all = Array.from(document.querySelectorAll('*'));
  const candidates = all.filter((el) => el.children.length === 0 && el.textContent.includes(token));
  const el = candidates.sort((a, b) => a.textContent.length - b.textContent.length)[0]
    || all.filter((e) => e.textContent.includes(token)).pop();
  if (!el) return { found: false };
  const cs = getComputedStyle(el);
  const range = document.createRange();
  range.selectNodeContents(el);
  const rects = Array.from(range.getClientRects());
  const box = el.getBoundingClientRect();
  const text = el.textContent;
  return {
    found: true,
    tag: el.tagName,
    className: el.className && el.className.toString ? el.className.toString() : String(el.className || ''),
    inlineStyle: el.getAttribute('style') || '',
    whiteSpace: cs.whiteSpace,
    overflowWrap: cs.overflowWrap,
    wordBreak: cs.wordBreak,
    lineBoxes: rects.length,
    expectedLines: summaryLineCount,
    newlineCount: (text.match(/\n/g) || []).length,
    textLength: text.length,
    clientWidth: el.clientWidth,
    scrollWidth: el.scrollWidth,
    horizontalOverflow: el.scrollWidth > el.clientWidth + 1,
    height: Math.round(box.height),
  };
}

async function main() {
  if (!fs.existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}`);
  const puppeteer = (await import('puppeteer-core')).default;
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none', '--force-color-profile=srgb', '--hide-scrollbars'],
    executablePath: CHROME,
    headless: true,
  });

  const resume = JSON.parse(fs.readFileSync(path.join(here, 'resume-max-coverage.json'), 'utf8'));
  resume.summary = SUMMARY;
  const expectedLines = SUMMARY.split('\n').filter((l) => l.trim()).length;

  const templates = requested.length ? requested : TEMPLATE_ORDER;
  const report = {
    generatedAt: new Date().toISOString(),
    chrome: CHROME,
    summaryLength: SUMMARY.length,
    summaryNewlines: (SUMMARY.match(/\n/g) || []).length,
    expectedNonEmptyLines: expectedLines,
    templates: {},
  };

  for (const key of templates) {
    const component = TEMPLATE_COMPONENT[key];
    const markup = render(component, resume);
    const page = await browser.newPage();
    const size = A4[key] || A4.modern;
    await page.setViewport({ width: size.w, height: size.h });
    await page.setContent(wrapHtml(markup, size.w), { waitUntil: 'networkidle0' });
    const measured = await page.evaluate(measureInPage, TOKEN, expectedLines);
    report.templates[key] = measured;
    await page.screenshot({ path: path.join(outDir, `${key}.png`), fullPage: true });
    await page.close();
    const flag = measured.horizontalOverflow ? 'OVERFLOW' : (measured.whiteSpace === 'pre-line' ? 'pre-line' : 'COLLAPSE');
    console.log(`${key.padEnd(13)} ws=${String(measured.whiteSpace).padEnd(9)} wrap=${String(measured.overflowWrap).padEnd(11)} lines=${String(measured.lineBoxes).padStart(3)} overflow=${measured.horizontalOverflow} -> ${flag}`);
  }

  await browser.close();
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2), 'utf8');
  const values = Object.values(report.templates);
  console.log(`\npre-line: ${values.filter((t) => t.whiteSpace === 'pre-line').length}/${values.length}`);
  console.log(`overflow: ${values.filter((t) => t.horizontalOverflow).length}/${values.length}`);
  console.log(`report: ${path.relative(root, path.join(outDir, 'report.json')).replace(/\\/g, '/')}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
