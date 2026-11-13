/* eslint-disable no-console */
/**
 * qa-summary-pdf.cjs — real PDF export check for the summary-wrapping dataset.
 *
 * Uses the SAME generated handler the API serves (api/render-pdf.js) with the
 * serverless Chrome launcher swapped for local Chrome (identical approach to
 * qa-artifacts/qa-pdf.cjs), but feeds the multi-paragraph summary dataset and
 * writes to an UNTRACKED output dir so the tracked pdf-audit evidence is not
 * disturbed.
 *
 * Usage: node qa-artifacts/qa-summary-pdf.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const apiDir = path.join(root, 'api');
const buildDir = path.join(__dirname, '.build', 'api');
const outDir = path.join(__dirname, 'summary-bug', 'pdf-after');

const TEMPLATES = ['modern', 'classic', 'academic', 'clean', 'executive', 'finance'];
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SECRET = 'qa-local-secret';

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

function countPages(buffer) {
  return (Buffer.from(buffer).toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length;
}

async function main() {
  if (!fs.existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}`);
  process.env.CHROME_PATH = CHROME;
  process.env.RENDER_INTERNAL_SECRET = SECRET;

  const handlerPath = buildLocalHandler();
  const { default: handler } = await import(pathToFileURL(handlerPath).href);

  const dataset = JSON.parse(fs.readFileSync(path.join(__dirname, 'summary-wrap-dataset.json'), 'utf8'));
  const resume = JSON.parse(fs.readFileSync(path.join(__dirname, 'resume-max-coverage.json'), 'utf8'));
  resume.summary = dataset.summary;

  fs.mkdirSync(outDir, { recursive: true });
  const report = { generatedAt: new Date().toISOString(), summaryNewlines: (dataset.summary.match(/\n/g) || []).length, templates: {} };

  for (const template of TEMPLATES) {
    const res = {
      statusCode: 200,
      headers: {},
      setHeader(k, v) { this.headers[k] = v; },
      status(c) { this.statusCode = c; return this; },
      json(b) { this.jsonBody = b; return this; },
      send(b) { this.body = Buffer.from(b); },
    };
    const req = { method: 'POST', headers: { 'x-internal-secret': SECRET }, body: { resume: { ...resume, template }, template } };
    await handler(req, res);
    if (res.statusCode !== 200 || !res.body) {
      console.error(template, 'FAILED', JSON.stringify(res.jsonBody));
      report.templates[template] = { ok: false, error: res.jsonBody };
      continue;
    }
    const file = path.join(outDir, `${template}.pdf`);
    fs.writeFileSync(file, res.body);
    report.templates[template] = { ok: true, bytes: res.body.length, pages: countPages(res.body), file: path.relative(root, file).replace(/\\/g, '/') };
    console.log(`${template.padEnd(12)} ${String(report.templates[template].pages).padStart(2)} pages  ${res.body.length} bytes`);
  }

  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2), 'utf8');
  console.log('report:', path.relative(root, path.join(outDir, 'report.json')).replace(/\\/g, '/'));
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
