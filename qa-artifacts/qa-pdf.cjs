/* eslint-disable no-console */
/**
 * qa-pdf.cjs — real PDF export audit.
 *
 * Loads the SAME generated handler the API serves (`api/render-pdf.js`),
 * swapping only its serverless Chrome launcher for the local Chrome install.
 * Every template is exported from the maximum-coverage dataset, the PDF is
 * saved under qa-artifacts/pdf-audit/, and page metadata is recorded in
 * qa-artifacts/pdf-audit/report.json.
 *
 * It also exports the two longest templates with explicit resume typography
 * (Times New Roman and Courier New at 11.5pt) so the PDF font path is proven,
 * not just the template-default font.
 *
 * Usage: node qa-artifacts/qa-pdf.cjs [template ...]
 */
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const apiDir = path.join(root, 'api');
const buildDir = path.join(__dirname, '.build', 'api');
const outDir = path.join(__dirname, 'pdf-audit');

const TEMPLATES = [
  'modern', 'classic', 'minimal', 'executive', 'fresher', 'creative',
  'corporate', 'traditional', 'clean', 'graduate', 'tech', 'engineering',
  'leadership', 'designer', 'sleek', 'contemporary', 'academic', 'research',
  'medical', 'finance',
];

const FONT_VARIANTS = [
  { template: 'modern', fontFamily: 'times', fontSize: 11.5 },
  { template: 'academic', fontFamily: 'courier', fontSize: 11.5 },
];

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

function embeddedFonts(buffer) {
  const names = Buffer.from(buffer).toString('latin1').match(/\/BaseFont\s*\/([^\s/]+)/g) || [];
  return [...new Set(names.map((n) => n.replace(/\/BaseFont\s*\//, '')))];
}

async function exportOne(handler, resume, template, extra = {}) {
  const messages = [];
  const originalLog = console.log;
  console.log = (...args) => messages.push(args.join(' '));

  const res = {
    statusCode: 200,
    headers: {},
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.jsonBody = body; return this; },
    send(body) { this.body = Buffer.from(body); },
  };
  const req = {
    method: 'POST',
    headers: { 'x-internal-secret': SECRET },
    body: { resume: { ...resume, template, ...extra }, template },
  };

  const started = Date.now();
  try {
    await handler(req, res);
  } finally {
    console.log = originalLog;
    messages.forEach((m) => originalLog(m));
  }

  const result = { template, ...extra, ms: Date.now() - started, status: res.statusCode, logs: messages };
  const stamped = messages.map((m) => m.match(/stamped (\d+) element-aware page breaks/)).find(Boolean);
  const expected = messages.map((m) => m.match(/expected=(\d+)/)).find(Boolean);
  if (stamped) result.stamped = Number(stamped[1]);
  if (expected) result.expectedPages = Number(expected[1]);
  else if (result.stamped != null) result.expectedPages = result.stamped + 1;

  if (res.statusCode !== 200 || !res.body) {
    result.ok = false;
    result.error = res.jsonBody;
    console.error(template, 'FAILED', JSON.stringify(res.jsonBody));
    return result;
  }

  const name = extra.fontFamily ? `font-${extra.fontFamily}-${template}` : template;
  const file = path.join(outDir, `${name}.pdf`);
  fs.writeFileSync(file, res.body);
  result.ok = true;
  result.file = path.relative(root, file).replace(/\\/g, '/');
  result.bytes = res.body.length;
  result.pages = countPages(res.body);
  result.fonts = embeddedFonts(res.body);
  console.log(`${name.padEnd(22)} ${String(result.pages).padStart(2)} pages  ${result.bytes} bytes  ${result.ms}ms  fonts=${result.fonts.join(',')}`);
  return result;
}

async function main() {
  if (!fs.existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}`);
  process.env.CHROME_PATH = CHROME;
  process.env.RENDER_INTERNAL_SECRET = SECRET;

  const handlerPath = buildLocalHandler();
  const { default: handler } = await import(pathToFileURL(handlerPath).href);

  const resume = JSON.parse(fs.readFileSync(path.join(__dirname, 'resume-max-coverage.json'), 'utf8'));
  fs.mkdirSync(outDir, { recursive: true });

  const requested = process.argv.slice(2);
  const templates = requested.length ? requested : TEMPLATES;
  const report = { generatedAt: new Date().toISOString(), chrome: CHROME, templates: {} };

  for (const template of templates) {
    report.templates[template] = await exportOne(handler, resume, template);
  }

  if (!requested.length) {
    report.fontVariants = [];
    for (const variant of FONT_VARIANTS) {
      const result = await exportOne(handler, resume, variant.template, {
        fontFamily: variant.fontFamily,
        fontSize: variant.fontSize,
      });
      report.fontVariants.push(result);
    }
  }

  fs.writeFileSync(
    path.join(outDir, 'report.json'),
    JSON.stringify(report, null, 2),
    'utf8',
  );
  const all = [...Object.values(report.templates), ...(report.fontVariants || [])];
  const failed = all.filter((t) => !t.ok);
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
