/* eslint-disable no-console */
/**
 * qa-preview-scaling.mjs — live-preview horizontal-clipping audit.
 *
 * Mounts the REAL ResumePreview inside the Builder's exact layout wrapper
 * (qa-artifacts/preview-scaling-harness.jsx) and measures, at the viewport
 * widths the spec calls out (390, 768, 1024, 1536):
 *   - does the A4 sheet's right edge pass its own frame's right edge?
 *   - does the page overflow horizontally (scrollWidth > clientWidth)?
 *   - what zoom scale did the A4Viewer actually apply?
 *
 * Usage: node qa-artifacts/qa-preview-scaling.mjs [--out <dir>]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

let outDir = path.join(here, 'preview-scaling');
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) if (args[i] === '--out') outDir = path.resolve(args[++i]);

const WIDTHS = [390, 768, 1024, 1536];

const { INTER_FONT_FACES } = await import(pathToFileURL(path.join(root, 'api', '_pdf-fonts.js')).href);
// The REAL app stylesheet (compiled from src/index.css + tailwind.config.js),
// so the harness sees the app-shell utilities (max-w-7xl, lg:grid-cols-2 …)
// exactly as the deployed app does. Built by qa-artifacts/build-scaling-harness.mjs.
const compiledCss = fs.readFileSync(path.join(here, '.build', 'app.css'), 'utf8');
const harnessJs = fs.readFileSync(path.join(here, '.build', 'preview-scaling-harness.js'), 'utf8');

function html(legacy) {
  return `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><style>
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; background: #e2e8f0; }
  ${INTER_FONT_FACES.map((f) => `@font-face{font-family:'Inter';font-style:normal;font-weight:${f.weight};font-display:block;src:url(data:font/woff2;base64,${f.base64}) format('woff2');}`).join('\n')}
  ${compiledCss}
  </style></head><body><div id="root"></div><script>window.__LEGACY__=${legacy ? 'true' : 'false'};</script><script>${harnessJs}</script></body></html>`;
}

async function main() {
  if (!fs.existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}`);
  const puppeteer = (await import('puppeteer-core')).default;
  fs.mkdirSync(outDir, { recursive: true });

  const dataset = JSON.parse(fs.readFileSync(path.join(here, 'resume-max-coverage.json'), 'utf8'));

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none', '--force-color-profile=srgb'],
    executablePath: CHROME,
    headless: true,
  });

  const report = { generatedAt: new Date().toISOString(), chrome: CHROME, widths: WIDTHS, cases: {} };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const settle = async (p) => {
    await p.evaluate(() => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))));
    await wait(400);
  };

  for (const template of ['modern', 'engineering']) {
    const rec = { template, byWidth: {}, checks: [] };
    // Two fresh pages: BEFORE (pre-fix markup, no min-w-0) and AFTER (fixed).
    // A fresh mount matters — the bug only shows on first render, when the
    // sheet is still at scale 1 (794px) and inflates the grid track.
    for (const legacy of [true, false]) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
      await page.setContent(html(legacy), { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);

      for (const w of WIDTHS) {
        await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
        await page.evaluate((r, t) => window.__scaling.set({ ...r }, t), dataset, template);
        await settle(page);
        const m = await page.evaluate(() => window.__scaling.measure());
        if (legacy) {
          rec.byWidth[w] = { ...(rec.byWidth[w] || {}), before: m };
        } else {
          rec.byWidth[w] = { ...(rec.byWidth[w] || {}), after: m };
          const clipCol = m.clipVsColumn == null ? 0 : m.clipVsColumn;
          if (clipCol > 0.5) rec.checks.push(`w=${w}: sheet clipped ${clipCol.toFixed(1)}px past its frame`);
          if (m.viewport.overflowPage > 0.5) rec.checks.push(`w=${w}: page overflows horizontally by ${m.viewport.overflowPage.toFixed(1)}px`);
          if (!(m.scale > 0) || m.scale > 1.0001) rec.checks.push(`w=${w}: scale ${m.scale} not in (0,1]`);
        }
      }
      await page.close();
    }

    for (const w of WIDTHS) {
      const { before, after } = rec.byWidth[w];
      const bClip = before.clipVsColumn == null ? 0 : before.clipVsColumn;
      const aClip = after.clipVsColumn == null ? 0 : after.clipVsColumn;
      console.log(`${template} @ ${String(w).padStart(4)}px  BEFORE scale=${before.scale.toFixed(4)} clip=${bClip.toFixed(0)} overflow=${before.viewport.overflowPage}  ->  AFTER scale=${after.scale.toFixed(4)} sheetW=${after.sheet ? after.sheet.width.toFixed(1) : '?'} clip=${aClip.toFixed(0)} overflow=${after.viewport.overflowPage}`);
    }
    rec.ok = rec.checks.length === 0;
    report.cases[template] = rec;
    if (!rec.ok) for (const c of rec.checks) console.log(`    ! ${c}`);
  }

  await browser.close();
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2), 'utf8');
  const cases = Object.values(report.cases);
  console.log(`\ncases: ${cases.filter((c) => c.ok).length}/${cases.length} OK`);
  console.log(`report: ${path.relative(root, path.join(outDir, 'report.json')).replace(/\\/g, '/')}`);
  if (cases.some((c) => !c.ok)) process.exitCode = 1;
}

main().catch((err) => { console.error(err); process.exit(1); });
