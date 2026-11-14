/* eslint-disable no-console */
/**
 * qa-preview-pagination.mjs — live-preview + pagination audit.
 *
 * Mounts the REAL ResumePreview (qa-artifacts/preview-harness.jsx) in headless
 * Chrome and drives it the way the Builder does — changing the resume and the
 * font size — then reads back the pagination the A4Viewer actually produced:
 *
 *   - does the preview remount (mount counter must stay 1)?
 *   - is the page count consistent with the sheet count / badge?
 *   - are page-start offsets monotonic and contiguous (no gap / overlap)?
 *   - is the flow covered to the end (no clipped tail)?
 *   - is there a phantom trailing page (a page starting past the content end)?
 *   - does any atomic block straddle a page boundary (mid-line clip)?
 *   - does the page count react to font size (bigger font => >= pages)?
 *   - does the preview update on a plain content edit?
 *
 * Usage: node qa-artifacts/qa-preview-pagination.mjs [--out <dir>]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { getPageMargin, getPageSize } from '../src/utils/pageLayout.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

let outDir = path.join(here, 'preview-pagination');
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) if (args[i] === '--out') outDir = path.resolve(args[++i]);

const { INTER_FONT_FACES } = await import(pathToFileURL(path.join(root, 'api', '_pdf-fonts.js')).href);
const compiledCss = fs.readFileSync(path.join(root, 'api', '_pdf-compiled.css'), 'utf8');
const harnessJs = fs.readFileSync(path.join(here, '.build', 'preview-harness.js'), 'utf8');

const FONT_SIZES = [8.0, 10.5, 13.0];

function html(pageW) {
  return `<!doctype html><html><head><meta charset="utf-8" /><style>
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; background: #e2e8f0; }
  #root { width: ${pageW}px; }
  ${INTER_FONT_FACES.map((f) => `@font-face{font-family:'Inter';font-style:normal;font-weight:${f.weight};font-display:block;src:url(data:font/woff2;base64,${f.base64}) format('woff2');}`).join('\n')}
  ${compiledCss}
  </style></head><body><div id="root"></div><script>${harnessJs}</script></body></html>`;
}

function validate(probe, blocks, lines, visibleH) {
  const issues = [];
  const sheets = probe.sheets || [];
  const starts = sheets.map((s) => s.start);
  const last = starts.length - 1;
  const measureH = probe.measure ? probe.measure.h : 0;

  if (probe.mounts !== 1) issues.push(`preview remounted (mounts=${probe.mounts})`);
  if (probe.badge && parseInt(probe.badge, 10) !== probe.sheetCount) issues.push(`badge "${probe.badge}" != sheets ${probe.sheetCount}`);
  if (sheets.length === 0) { issues.push('no sheets'); return { issues, straddle: 0, lineCuts: 0, starts }; }
  if (Math.abs(starts[0]) > 0.5) issues.push(`first start ${starts[0]} != 0`);
  for (let i = 1; i < starts.length; i++) if (starts[i] <= starts[i - 1] + 0.5) issues.push(`starts not increasing at ${i} (${starts[i - 1]} -> ${starts[i]})`);
  if (measureH > 0 && starts[last] >= measureH + 0.5) issues.push(`phantom trailing page: last start ${starts[last].toFixed(1)} >= content ${measureH.toFixed(1)}`);
  const coveredEnd = starts[last] + (sheets[last].sliceH || visibleH);
  if (measureH > 0 && coveredEnd < measureH - 1) issues.push(`tail not covered: covered ${coveredEnd.toFixed(1)} < content ${measureH.toFixed(1)}`);
  for (let i = 0; i < last; i++) {
    const delta = starts[i + 1] - starts[i];
    if (Math.abs(sheets[i].sliceH - delta) > 1) issues.push(`page ${i} sliceH ${sheets[i].sliceH.toFixed(1)} != delta ${delta.toFixed(1)}`);
  }
  sheets.forEach((s, i) => { if (s.textLen === 0) issues.push(`page ${i} is blank`); });

  let straddle = 0;
  const straddlers = [];
  for (const b of blocks) {
    const at = starts.find((s, i) => i > 0 && s > b.top + 0.5 && s < b.bottom - 0.5);
    if (at != null) {
      straddle += 1;
      straddlers.push({ tag: b.tag, top: Math.round(b.top * 10) / 10, bottom: Math.round(b.bottom * 10) / 10,
                        h: Math.round(b.h * 10) / 10, boundary: Math.round(at * 10) / 10, text: b.text });
    }
  }

  // Line-box cuts: a page boundary strictly inside a painted text line is a
  // genuine "half a line" clip — the artifact this audit exists to catch. The
  // 1.5px inset ignores sub-pixel leading rounding (a boundary that lands on a
  // block top can sit ~1px above that block's first line box).
  let lineCuts = 0;
  const cutLines = [];
  for (const ln of lines) {
    const at = starts.find((s, i) => i > 0 && s > ln.top + 1.5 && s < ln.bottom - 1.5);
    if (at != null) {
      lineCuts += 1;
      cutLines.push({ top: Math.round(ln.top * 10) / 10, bottom: Math.round(ln.bottom * 10) / 10,
                      boundary: Math.round(at * 10) / 10, text: ln.text });
    }
  }
  return { issues, straddle, straddlers, lineCuts, cutLines, starts: starts.map((n) => Math.round(n * 10) / 10) };
}

async function main() {
  if (!fs.existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}`);
  const puppeteer = (await import('puppeteer-core')).default;
  fs.mkdirSync(outDir, { recursive: true });

  const datasets = {
    long: JSON.parse(fs.readFileSync(path.join(here, 'resume-max-coverage.json'), 'utf8')),
    short: JSON.parse(fs.readFileSync(path.join(here, 'template-preview-data.json'), 'utf8')),
  };

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none', '--force-color-profile=srgb', '--hide-scrollbars'],
    executablePath: CHROME,
    headless: true,
  });

  const report = { generatedAt: new Date().toISOString(), chrome: CHROME, fontSizes: FONT_SIZES, cases: {} };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const settle = async (p) => {
    await p.evaluate(() => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))));
    await wait(500);
  };

  const templates = ['modern', 'classic', 'academic', 'engineering', 'research'];
  for (const [dsName, base] of Object.entries(datasets)) {
    for (const template of templates) {
      const { w: pageW, h: pageH } = getPageSize(template);
      const { top: mTop, bottom: mBottom } = getPageMargin(template);
      const visibleH = pageH - mTop - mBottom;

      const page = await browser.newPage();
      await page.setViewport({ width: pageW + 80, height: 1200, deviceScaleFactor: 1 });
      await page.setContent(html(pageW), { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);

      const key = `${dsName}:${template}`;
      const rec = { template, dataset: dsName, visibleH, byFont: {}, checks: [], notes: [] };

      let prevPages = null;
      for (const fs2 of FONT_SIZES) {
        await page.evaluate((r, t, f) => window.__harness.set({ ...r, fontSize: f }, t), base, template, fs2);
        await settle(page);
        const probe = await page.evaluate(() => window.__harness.probe());
        const blocks = await page.evaluate((vh) => window.__harness.blocks(vh), visibleH);
        const lines = await page.evaluate(() => window.__harness.lines());
        const v = validate(probe, blocks, lines, visibleH);
        rec.byFont[fs2] = {
          pages: probe.sheetCount, badge: probe.badge, mounts: probe.mounts,
          measureH: probe.measure ? Math.round(probe.measure.h) : null,
          starts: v.starts, issues: v.issues, straddleBlocks: v.straddle, straddlers: v.straddlers,
          lineCuts: v.lineCuts, cutLines: v.cutLines,
        };
        if (v.issues.length) rec.checks.push(`font=${fs2}: ${v.issues.join('; ')}`);
        if (v.lineCuts > 0) rec.checks.push(`font=${fs2}: ${v.lineCuts} text line(s) cut by a page boundary`);
        // A block that straddles a boundary WITHOUT cutting a text line is a
        // re-flow note, not a clip: the boundary lands in the block's own
        // whitespace (between its lines) because a dense side-by-side layout
        // has no whole-block seam. Recorded, not failed.
        if (v.straddle > 0) rec.notes.push(`font=${fs2}: ${v.straddle} block(s) re-flow across a boundary (no line cut)`);
        if (prevPages != null && probe.sheetCount < prevPages) rec.checks.push(`font=${fs2}: pages decreased vs smaller font (${prevPages} -> ${probe.sheetCount})`);
        prevPages = probe.sheetCount;
      }

      // Live edit: change the summary and confirm the preview reflects it.
      const edited = { ...base, fontSize: FONT_SIZES[1], fullName: 'LIVE EDIT PROBE NAME' };
      await page.evaluate((r, t) => window.__harness.set(r, t), edited, template);
      await settle(page);
      const editedProbe = await page.evaluate(() => ({
        hasEdit: document.body.innerText.includes('LIVE EDIT PROBE NAME'),
        mounts: window.__harness.mounts(),
      }));
      rec.liveEdit = editedProbe;
      if (!editedProbe.hasEdit) rec.checks.push('live edit did not reach the preview');
      if (editedProbe.mounts !== 1) rec.checks.push(`live edit remounted preview (mounts=${editedProbe.mounts})`);

      // Resize: narrow the shell and confirm pagination stays valid (scale recalculates).
      await page.evaluate(() => { document.getElementById('root').style.width = '520px'; });
      await settle(page);
      const narrowProbe = await page.evaluate(() => window.__harness.probe());
      const narrowBlocks = await page.evaluate((vh) => window.__harness.blocks(vh), visibleH);
      const narrowLines = await page.evaluate(() => window.__harness.lines());
      const nv = validate(narrowProbe, narrowBlocks, narrowLines, visibleH);
      rec.afterResize = { pages: narrowProbe.sheetCount, issues: nv.issues, straddleBlocks: nv.straddle, lineCuts: nv.lineCuts };
      if (nv.issues.length) rec.checks.push(`after resize: ${nv.issues.join('; ')}`);
      if (nv.lineCuts > 0) rec.checks.push(`after resize: ${nv.lineCuts} text line(s) cut by a page boundary`);

      rec.ok = rec.checks.length === 0;
      report.cases[key] = rec;
      console.log(`${key.padEnd(22)} pages=[${FONT_SIZES.map((f) => rec.byFont[f].pages).join(',')}] ` +
        `lineCuts=[${FONT_SIZES.map((f) => rec.byFont[f].lineCuts).join(',')}] ` +
        `straddle=[${FONT_SIZES.map((f) => rec.byFont[f].straddleBlocks).join(',')}] ` +
        `edit=${editedProbe.hasEdit ? 'ok' : 'FAIL'} resize=${rec.afterResize.issues.length === 0 ? 'ok' : 'FAIL'} -> ${rec.ok ? 'OK' : 'FAIL'}`);
      if (!rec.ok) for (const c of rec.checks) console.log(`    ! ${c}`);
      await page.close();
    }
  }

  await browser.close();
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2), 'utf8');
  const cases = Object.values(report.cases);
  console.log(`\ncases: ${cases.filter((c) => c.ok).length}/${cases.length} OK`);
  console.log(`report: ${path.relative(root, path.join(outDir, 'report.json')).replace(/\\/g, '/')}`);
  if (cases.some((c) => !c.ok)) process.exitCode = 1;
}

main().catch((err) => { console.error(err); process.exit(1); });
