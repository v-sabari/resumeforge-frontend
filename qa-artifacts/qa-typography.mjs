/* eslint-disable no-console */
/**
 * qa-typography.mjs — browser regression suite for the resume typography panel.
 *
 * Mounts the REAL TemplatesPanel + REAL ResumePreview inside the REAL providers
 * (qa-artifacts/typography-harness.jsx) and drives them like a user would:
 *
 *   A. slider min / max / step / default value + aria-valuetext + warning
 *   B. "Reset to template defaults" restores family + size
 *   C. page count grows with the base size (40-bullet sample)
 *   D. switching template preserves the typography choice
 *   G. measured default body size in pt (preview) — for the report
 *
 * It then delegates two existing audits:
 *   E. qa-preview-scaling.mjs      — no sheet clipping at 390/768/1024/1536
 *   F. qa-preview-pdf-parity.mjs   — preview == PDF page count per family
 *
 * Usage: node qa-artifacts/qa-typography.mjs [--out <dir>]
 * Requires: `npm run build:pdf-css && npm run build:api` and the harness
 * bundles built (see the `test:typography` npm script).
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import {
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
  FONT_SIZE_STEP,
  DEFAULT_FONT_SIZE,
  FONT_FAMILY_OPTIONS,
  pxToPt,
} from '../src/utils/resumeTypography.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SECRET = 'qa-local-secret';

let outDir = path.join(here, 'typography');
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) if (args[i] === '--out') outDir = path.resolve(args[++i]);

const { INTER_FONT_FACES } = await import(pathToFileURL(path.join(root, 'api', '_pdf-fonts.js')).href);
const compiledCss = fs.readFileSync(path.join(here, '.build', 'app.css'), 'utf8');
const typographyHarnessJs = fs.readFileSync(path.join(here, '.build', 'typography-harness.js'), 'utf8');
const previewHarnessJs = fs.readFileSync(path.join(here, '.build', 'preview-harness.js'), 'utf8');

const interFaces = INTER_FONT_FACES
  .map((f) => `@font-face{font-family:'Inter';font-style:normal;font-weight:${f.weight};font-display:block;src:url(data:font/woff2;base64,${f.base64}) format('woff2');}`)
  .join('\n');

function pageHtml(harnessJs, extraRootCss = '') {
  return `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><style>
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; background: #e2e8f0; }
  #root { ${extraRootCss} }
  ${interFaces}
  ${compiledCss}
  </style></head><body><div id="root"></div><script>${harnessJs}</script></body></html>`;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const settle = async (p) => {
  await p.evaluate(() => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))));
  await wait(350);
};

/**
 * The editor hooks (useResumeEditor) read localStorage/sessionStorage on mount.
 * An about:blank page (page.setContent) has an opaque origin where those reads
 * throw SecurityError, which aborts the React render. Serve the harnesses from
 * a real loopback origin so the production storage code paths behave normally.
 */
function startServer(routes) {
  const server = http.createServer((req, res) => {
    const html = routes[req.url];
    if (html == null) { res.statusCode = 404; res.end('not found'); return; }
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.end(html);
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

// Build a resume with exactly 40 experience bullets (test fixture derived from
// the real max-coverage dataset — not a change to any sample data).
function withFortyBullets(resume) {
  const pool = (resume.experience || []).flatMap((e) => (e.bullets || []).map((b) => String(b)));
  const src = pool.length ? pool : ['Delivered a measurable, documented outcome.'];
  const bullets = Array.from({ length: 40 }, (_, i) => src[i % src.length]);
  const first = (resume.experience || [])[0] || {};
  return {
    ...resume,
    experience: [{ ...first, id: 'exp-40', role: 'Senior Engineer', company: 'Acme Corp', bullets }],
    projects: [],
    education: [],
    certifications: [],
    achievements: [],
    languages: [],
    customSections: {},
  };
}

// React-controlled <input>/<select> need the native value setter + events.
const NATIVE_SET = `(el, v) => {
  const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
  setter.call(el, String(v));
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}`;

async function main() {
  if (!fs.existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}`);
  process.env.CHROME_PATH = CHROME;
  process.env.RENDER_INTERNAL_SECRET = SECRET;
  fs.mkdirSync(outDir, { recursive: true });

  const puppeteer = (await import('puppeteer-core')).default;
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none', '--force-color-profile=srgb', '--hide-scrollbars'],
    executablePath: CHROME, headless: true,
  });

  const { server, port } = await startServer({
    '/typography': pageHtml(typographyHarnessJs),
    '/preview': pageHtml(previewHarnessJs, 'width: 794px;'),
  });
  const base = `http://127.0.0.1:${port}`;

  const report = { generatedAt: new Date().toISOString(), cases: {}, delegated: {}, knownLimitations: {} };
  const record = (id, ok, detail) => {
    report.cases[id] = { ok, ...detail };
    console.log(`[${id}] ${ok ? 'OK' : 'FAIL'}${detail && detail.note ? ' — ' + detail.note : ''}`);
  };

  /* ── Page A: real TemplatesPanel + real ResumePreview ─────────────────── */
  const pageA = await browser.newPage();
  await pageA.setRequestInterception(true);
  pageA.on('request', (r) => (/\/api\//.test(r.url()) ? r.abort() : r.continue()));
  await pageA.setViewport({ width: 1280, height: 1000, deviceScaleFactor: 1 });
  await pageA.goto(base + '/typography', { waitUntil: 'domcontentloaded' });
  await pageA.waitForFunction('window.__typ && typeof window.__typ.state === "function"', { timeout: 15000 });
  await pageA.evaluate(() => document.fonts.ready);
  await settle(pageA);

  // ── A. slider min / max / step / default ────────────────────────────────
  {
    const slider = await pageA.evaluate(() => window.__typ.slider());
    const state = await pageA.evaluate(() => window.__typ.state());
    const family = await pageA.evaluate(() => window.__typ.familySelect());
    const badge = await pageA.evaluate(() => window.__typ.sizeBadge());
    const warning = await pageA.evaluate(() => window.__typ.warning());
    const optCount = await pageA.evaluate(() => window.__typ.familyOptionCount());
    const checks = {
      min: Number(slider.min) === MIN_FONT_SIZE,
      max: Number(slider.max) === MAX_FONT_SIZE,
      step: Number(slider.step) === FONT_SIZE_STEP,
      // The default (7.875pt = legacy 10.5px) is deliberately NOT rewritten, but
      // it is off the 0.5pt grid, so the native range thumb snaps to the nearest
      // step. The true value is still reported by the badge + aria-valuetext.
      defaultValue: Math.abs(Number(slider.value) - DEFAULT_FONT_SIZE) <= FONT_SIZE_STEP / 2,
      ariaValueText: slider.ariaValueText === `${DEFAULT_FONT_SIZE.toFixed(1)} points`,
      familyDefault: family === 'template',
      badge: badge === `${DEFAULT_FONT_SIZE.toFixed(1)} pt`,
      defaultWarns: /hard to read/i.test(warning || ''),
      familyOptions: optCount === FONT_FAMILY_OPTIONS.length,
      storedDefault: state.fontSize === DEFAULT_FONT_SIZE && state.fontFamily === 'template',
    };
    const ok = Object.values(checks).every(Boolean);
    record('A.slider-bounds-default', ok, { slider, family, badge, warning, optCount, checks, note: ok ? '' : JSON.stringify(checks) });
  }

  // ── B. reset restores defaults ──────────────────────────────────────────
  {
    await pageA.evaluate(() => window.__typ.setResume({ fontFamily: 'courier', fontSize: 9.5 }));
    await settle(pageA);
    const before = {
      state: await pageA.evaluate(() => window.__typ.state()),
      slider: await pageA.evaluate(() => window.__typ.slider()),
      family: await pageA.evaluate(() => window.__typ.familySelect()),
    };
    const clicked = await pageA.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => /reset to template defaults/i.test(b.textContent));
      if (!btn) return false;
      btn.click();
      return true;
    });
    await settle(pageA);
    const after = {
      state: await pageA.evaluate(() => window.__typ.state()),
      slider: await pageA.evaluate(() => window.__typ.slider()),
      family: await pageA.evaluate(() => window.__typ.familySelect()),
    };
    const checks = {
      clicked,
      appliedBefore: before.state.fontFamily === 'courier' && before.state.fontSize === 9.5,
      resetFamily: after.state.fontFamily === 'template' && after.family === 'template',
      resetSize: after.state.fontSize === DEFAULT_FONT_SIZE
        && Math.abs(Number(after.slider.value) - DEFAULT_FONT_SIZE) <= FONT_SIZE_STEP / 2,
      warningBack: /hard to read/i.test((await pageA.evaluate(() => window.__typ.warning())) || ''),
    };
    const ok = Object.values(checks).every(Boolean);
    record('B.reset-restores-defaults', ok, { before, after, checks, note: ok ? '' : JSON.stringify(checks) });
  }

  // ── D. template switch preserves typography ─────────────────────────────
  {
    await pageA.evaluate(() => { window.__typ.setResume({ fontFamily: 'calibri', fontSize: 9 }); window.__typ.setTemplate('modern'); });
    await settle(pageA);
    const clicked = await pageA.evaluate(() => {
      const span = Array.from(document.querySelectorAll('#panel button span')).find((s) => s.textContent.trim() === 'Classic');
      if (!span) return false;
      (span.closest('button') || span).click();
      return true;
    });
    await settle(pageA);
    const state = await pageA.evaluate(() => window.__typ.state());
    const slider = await pageA.evaluate(() => window.__typ.slider());
    const family = await pageA.evaluate(() => window.__typ.familySelect());
    const checks = {
      clicked,
      templateChanged: state.template === 'classic' && state.resumeTemplate === 'classic',
      familyPreserved: state.fontFamily === 'calibri' && family === 'calibri',
      sizePreserved: state.fontSize === 9 && Number(slider.value) === 9,
    };
    const ok = Object.values(checks).every(Boolean);
    record('D.template-switch-preserves-typography', ok, { state, slider, family, checks, note: ok ? '' : JSON.stringify(checks) });
  }
  await pageA.close();

  /* ── Page B: real ResumePreview only (measurement) ────────────────────── */
  const resume = JSON.parse(fs.readFileSync(path.join(here, 'resume-max-coverage.json'), 'utf8'));
  const pageB = await browser.newPage();
  await pageB.setViewport({ width: 900, height: 1200, deviceScaleFactor: 1 });
  await pageB.goto(base + '/preview', { waitUntil: 'domcontentloaded' });
  await pageB.evaluate(() => document.fonts.ready);

  const previewPages = async (r, template = 'modern') => {
    await pageB.evaluate((rr, t) => window.__harness.set(rr, t), r, template);
    await pageB.evaluate(() => document.fonts.ready);
    await pageB.evaluate(() => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))));
    await wait(400);
    await pageB.evaluate(() => document.fonts.ready);
    const probe = await pageB.evaluate(() => window.__harness.probe());
    return probe.sheetCount;
  };

  // ── C. page count changes with size (40 bullets) ────────────────────────
  {
    const forty = withFortyBullets(resume);
    const small = await previewPages({ ...forty, fontFamily: 'template', fontSize: MIN_FONT_SIZE });
    const large = await previewPages({ ...forty, fontFamily: 'template', fontSize: MAX_FONT_SIZE });
    const ok = large > small;
    record('C.page-count-grows-with-size', ok, { small, large, note: ok ? `${small} -> ${large} pages` : `no change (${small} -> ${large})` });
  }

  // ── G. measured default body pt in the PREVIEW ──────────────────────────
  {
    await previewPages({ ...resume, fontFamily: 'template', fontSize: DEFAULT_FONT_SIZE });
    const measured = await pageB.evaluate(() => {
      const hidden = document.querySelector('div[aria-hidden="true"]');
      const rootEl = hidden && hidden.firstElementChild;
      if (!rootEl) return null;
      const cand = rootEl.querySelector('li') || rootEl.querySelector('p');
      if (!cand) return null;
      const cs = getComputedStyle(cand);
      return { tag: cand.tagName, fontSizePx: parseFloat(cs.fontSize), text: (cand.innerText || '').slice(0, 40) };
    });
    report.measuredPreviewBodyPt = measured ? { ...measured, fontSizePt: pxToPt(measured.fontSizePx) } : null;
    record('G.preview-default-body-pt', !!measured, { measured, note: measured ? `${measured.fontSizePx}px = ${pxToPt(measured.fontSizePx).toFixed(2)}pt` : 'not found' });
  }
  await pageB.close();
  await browser.close();

  /* ── G2. measured default body pt in the PDF (via the real handler) ───── */
  try {
    const localHandler = buildLocalHandler();
    const { default: handler } = await import(pathToFileURL(localHandler).href);
    const res = {
      statusCode: 200, headers: {},
      setHeader(k, v) { this.headers[k] = v; },
      status(c) { this.statusCode = c; return this; },
      json(b) { this.jsonBody = b; return this; },
      send(b) { this.body = Buffer.from(b); },
    };
    await handler({ method: 'POST', headers: { 'x-internal-secret': SECRET }, body: { resume: { ...resume, fontFamily: 'template', fontSize: 10.5 }, template: 'modern' } }, res);
    if (res.statusCode === 200 && res.body) {
      const doc = await getDocument({ data: new Uint8Array(res.body), useSystemFonts: true }).promise;
      const page = await doc.getPage(1);
      const tc = await page.getTextContent();
      const heights = tc.items.filter((i) => i.str && i.str.trim()).map((i) => i.height).filter((h) => h > 0).sort((a, b) => a - b);
      const median = heights.length ? heights[Math.floor(heights.length / 2)] : null;
      await doc.destroy();
      report.measuredPdfBodyPt = median;
      record('G2.pdf-default-body-pt', median != null, { medianPt: median, note: median != null ? `${median.toFixed(2)}pt (median text height)` : 'no text' });
    } else {
      record('G2.pdf-default-body-pt', false, { error: res.jsonBody });
    }
  } catch (e) {
    record('G2.pdf-default-body-pt', false, { error: String(e) });
  }

  /* ── E. delegated: no sheet clipping at 390/768/1024/1536 ─────────────── */
  {
    const out = path.join(outDir, 'scaling');
    const r = spawnSync(process.execPath, [path.join(here, 'qa-preview-scaling.mjs'), '--out', out], { encoding: 'utf8', env: process.env });
    const ok = r.status === 0;
    report.delegated.scaling = { ok, status: r.status, out };
    console.log(`[E.preview-scaling] ${ok ? 'OK' : 'FAIL'} (exit ${r.status})`);
    if (!ok) console.log((r.stdout || '') + (r.stderr || ''));
  }

  /* ── F. delegated: preview == PDF page count ──────────────────────────── */
  const runParity = (label, env, gating = true) => {
    const out = path.join(outDir, `parity-${label}`);
    const r = spawnSync(process.execPath, [path.join(here, 'qa-preview-pdf-parity.mjs'), '--out', out], { encoding: 'utf8', env: { ...process.env, ...env } });
    const ok = r.status === 0;
    if (gating) report.delegated[`parity-${label}`] = { ok, status: r.status, out, env };
    else report.knownLimitations[`parity-${label}`] = { ok, status: r.status, out, env };
    console.log(`[F.parity-${label}] ${gating ? '' : '(non-gating) '}${ok ? 'OK' : 'FAIL'} (exit ${r.status})`);
    if (!ok) console.log((r.stdout || '').slice(-4000) + (r.stderr || ''));
    return ok;
  };
  const families = FONT_FAMILY_OPTIONS.map((f) => f.id).filter((id) => id !== 'template');
  // GATING: the range the slider can actually reach today (MIN 7.5pt .. MAX
  // 9.75pt), across single- and multi-column templates. This is the shipping
  // contract, so it must be green.
  runParity('sizes', { QA_TEMPLATES: 'modern,classic,academic,engineering,research', QA_FONTS: '7.5,9,9.75', QA_FAMILIES: 'template' });
  // GATING: every bundled family must give preview == PDF at the default size.
  runParity('families', { QA_TEMPLATES: 'modern', QA_FONTS: '10.5', QA_FAMILIES: families.join(',') });
  // NON-GATING (known limitation): 12pt = 16px is the deferred future maximum
  // (frontend MAX stays 9.75pt until the V28 backend is confirmed live). At
  // 12pt the academic and research templates — whose experience "card" is a
  // break-inside:avoid bubble taller than one page — diverge: the preview's
  // element-aware packer force-splits the over-tall bubble while Chrome's
  // fragmenter adds a page, so neither the annotated nor the natural PDF run
  // reproduces the preview count. This is a pre-existing paginator limitation
  // (it does not reproduce anywhere in the live 7.5–9.75pt range), recorded
  // here so it is not silently lost, and it is the gating item for the
  // "raise the slider max to 12pt" follow-up.
  runParity('future-max-12pt', { QA_TEMPLATES: 'modern,classic,academic,engineering,research', QA_FONTS: '12', QA_FAMILIES: 'template' }, false);

  /* ── summary ──────────────────────────────────────────────────────────── */
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2), 'utf8');
  const own = Object.values(report.cases);
  const delegated = Object.values(report.delegated);
  const known = Object.values(report.knownLimitations);
  const failed = own.filter((c) => !c.ok).length + delegated.filter((c) => !c.ok).length;
  console.log(`\nown cases: ${own.filter((c) => c.ok).length}/${own.length} OK`);
  console.log(`delegated (gating): ${delegated.filter((c) => c.ok).length}/${delegated.length} OK`);
  console.log(`known limitations (non-gating): ${known.filter((c) => c.ok).length}/${known.length} OK`);
  console.log('report:', path.relative(root, path.join(outDir, 'report.json')).replace(/\\/g, '/'));
  await new Promise((r) => server.close(r));
  process.exit(failed ? 1 : 0);
}

/** Same local-Chrome launcher swap the parity driver uses. */
function buildLocalHandler() {
  const apiDir = path.join(root, 'api');
  const buildDir = path.join(here, '.build', 'api');
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
  const out = path.join(buildDir, 'render-pdf-local.mjs');
  fs.writeFileSync(out, transformed, 'utf8');
  return out;
}

void NATIVE_SET; // documented helper for manual driving; not needed by the flow above
main().catch((err) => { console.error(err); process.exit(1); });
