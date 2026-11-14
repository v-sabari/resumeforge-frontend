/* eslint-disable no-console */
/**
 * qa-wrapping.mjs — right-edge wrapping / clipping regression suite.
 *
 * Two independent, zoom-safe invariants:
 *
 *   A. TEMPLATE-COORDINATE WRAPPING. For every template x font size, in the
 *      hidden true-size measurement node (real page units), no painted text
 *      node may extend past the template's own content-box right edge, and no
 *      element may report scrollWidth > clientWidth. This is the invariant that
 *      catches a long unbreakable token (a URL) escaping a flex row or a narrow
 *      column and being clipped by the template's `overflow-hidden`.
 *
 *   B. SHEET INSIDE ITS FRAME. For every template x viewport (including the
 *      short 1536x674 case where the preview frame shows its own vertical
 *      scrollbar), the A4 sheet's scaled box must sit inside its frame
 *      (clipVsColumn <= 0.5) and the page must not overflow horizontally
 *      (scrollWidth <= clientWidth), with the A4Viewer scale in (0, 1].
 *
 *   C. OWNER REPRO — Finance + Times at small sizes. The reported bug:
 *      /app/builder/14/templates, Finance template, Times New Roman, ~1920px
 *      wide, 7.5pt (the smallest size) — text, section rules, the Skills grid
 *      and the right-aligned dates ran to/past the sheet's right edge and were
 *      clipped, while 9.5pt looked fine. Root cause: the size control's
 *      `zoom` wrapper compensated its width with `100 / zoom %`, which
 *      Chromium resolves to `sheet / zoom` — WIDER than the sheet as soon as
 *      zoom < 1. Invariant asserted here: at 7.5 / 8 / 9.5 / 12pt, in the
 *      hidden true-size node, the template's border box AND content box right
 *      edges must not exceed the sheet width, no painted text node may exceed
 *      the content box, and the sheet must stay inside its frame. Fails before
 *      the fix at 7.5pt (content box right edge ~803.2 > 794), passes after.
 *
 * CONTENT-BOX EDGE (recorded, non-gating). The size control is a CSS `zoom`
 * on `.resume-typography`, so a template's own horizontal padding (fixed in
 * template units) is rendered at `padding * zoom` and the content-box right
 * edge is `sheet − padding * zoom`. For a 794px A4 sheet with 32px right
 * padding that is ~769.6px at 8px, 762px at 10.5px and ~754.4px at 13px, i.e.
 * it still moves slightly with the size. This is by design — moving the padding
 * outside the zoom would change the page geometry — so the value is recorded,
 * not asserted. What IS asserted is that the content box (and the template
 * border box) never pass the SHEET's right edge, and that no text passes the
 * content box (section A / section C).
 *
 * Usage: node qa-artifacts/qa-wrapping.mjs [--out <dir>]
 * Requires the harness bundles (built by the `test:wrapping` npm script).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

let outDir = path.join(here, 'wrapping');
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) if (args[i] === '--out') outDir = path.resolve(args[++i]);

const SIZES_PX = [8, 10.5, 13];
const TEMPLATES = [
  'modern', 'classic', 'minimal', 'executive', 'fresher', 'creative', 'corporate',
  'traditional', 'clean', 'graduate', 'tech', 'engineering', 'leadership', 'designer',
  'sleek', 'contemporary', 'academic', 'research', 'medical', 'finance',
];
// Widths the spec calls out, plus the short 1536x674 frame (its own vertical
// scrollbar is present) and the same width at a taller viewport for contrast.
const VIEWPORTS = [
  [390, 800], [768, 900], [1024, 900], [1536, 900], [1536, 674], [1536, 1200],
];

const { INTER_FONT_FACES } = await import(pathToFileURL(path.join(root, 'api', '_pdf-fonts.js')).href);
const compiledCss = fs.readFileSync(path.join(here, '.build', 'app.css'), 'utf8');
const previewHarnessJs = fs.readFileSync(path.join(here, '.build', 'preview-harness.js'), 'utf8');
const scalingHarnessJs = fs.readFileSync(path.join(here, '.build', 'preview-scaling-harness.js'), 'utf8');

const interFaces = INTER_FONT_FACES
  .map((f) => `@font-face{font-family:'Inter';font-style:normal;font-weight:${f.weight};font-display:block;src:url(data:font/woff2;base64,${f.base64}) format('woff2');}`)
  .join('\n');

const html = (harnessJs) => `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><style>
* { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
html, body { margin: 0; padding: 0; background: #e2e8f0; }
${interFaces}
${compiledCss}
</style></head><body><div id="root"></div><script>${harnessJs}</script></body></html>`;

const pxToPt = (px) => px * 0.75;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const settle = async (p) => {
  await p.evaluate(() => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res))));
  await wait(250);
};

/** Invariant A: measured in the hidden, true-size node (real page units). */
const measureWrapping = () => {
  const hidden = document.querySelector('div[aria-hidden="true"]');
  const wrap = hidden && hidden.firstElementChild;
  const rootEl = wrap && wrap.firstElementChild;      // .resume-typography
  const tpl = rootEl && rootEl.querySelector('.resume-template');
  if (!rootEl || !tpl) return null;
  const zoom = parseFloat(rootEl.style.zoom) || 1;
  const tcs = getComputedStyle(tpl);
  const tRect = tpl.getBoundingClientRect();
  const padR = (parseFloat(tcs.paddingRight) || 0) * zoom;
  // Content-box right edge in rendered px (= border-box right minus rendered
  // right padding). Compared against text line boxes in the same space.
  const contentRight = tRect.right - padR;
  let over = 0;
  const offenders = [];
  const walker = document.createTreeWalker(tpl, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    if (!n.nodeValue || !n.nodeValue.trim()) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    for (const r of range.getClientRects()) {
      if (r.width <= 0 || r.height <= 0) continue;
      if (r.right > contentRight + 0.5) {
        over += 1;
        if (offenders.length < 3) offenders.push({ text: n.nodeValue.replace(/\s+/g, ' ').trim().slice(0, 40), excess: +(r.right - contentRight).toFixed(1) });
      }
    }
  }
  const overflowing = [];
  for (const el of tpl.querySelectorAll('*')) {
    if (el.scrollWidth > el.clientWidth + 1) overflowing.push(`${el.tagName}.${(el.className || '').toString().slice(0, 40)} sw=${el.scrollWidth} cw=${el.clientWidth}`);
  }
  // Recorded (non-gating) content-box right edge: page width minus the
  // zoom-scaled padding (see header). Not asserted.
  // The hidden measure wrapper carries the true page width (e.g. 794 for A4); the
  // template's own padding is fixed in template units and rendered at `padding*zoom`.
  const pageW = Math.round(hidden.getBoundingClientRect().width);
  const contentBoxRightDrift = +(pageW - (parseFloat(tcs.paddingRight) || 0) * zoom).toFixed(2);
  return { zoom: +zoom.toFixed(4), over, offenders, overflowing, contentBoxRightDrift, pages: window.__harness.probe().sheetCount };
};

/**
 * Invariant C: geometry of the typography wrapper vs the A4 sheet, in the
 * hidden true-size measurement node (page coordinates). Returns the sheet
 * width, the wrapper/template right edges and the max painted-text right edge
 * — all relative to the sheet's own left edge — plus how far the content box
 * and the max text line spill past the sheet.
 */
const measureSheetGeometry = () => {
  const hidden = document.querySelector('div[aria-hidden="true"]');
  const wrap = hidden && hidden.firstElementChild && hidden.firstElementChild.firstElementChild; // .resume-typography
  const tpl = wrap && wrap.querySelector('.resume-template');
  if (!wrap || !tpl) return null;
  const sheetLeft = hidden.getBoundingClientRect().left;
  const pageW = hidden.getBoundingClientRect().width;
  const zoom = parseFloat(wrap.style.zoom) || 1;
  const wRect = wrap.getBoundingClientRect();
  const tRect = tpl.getBoundingClientRect();
  const tcs = getComputedStyle(tpl);
  const padR = (parseFloat(tcs.paddingRight) || 0) * zoom;
  const contentRight = tRect.right - sheetLeft - padR;

  let maxTextRight = -Infinity;
  let overContent = 0;
  const offenders = [];
  const walker = document.createTreeWalker(tpl, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    if (!n.nodeValue || !n.nodeValue.trim()) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    for (const r of range.getClientRects()) {
      if (r.width <= 0 || r.height <= 0) continue;
      const right = r.right - sheetLeft;
      if (right > maxTextRight) maxTextRight = right;
      if (right > contentRight + 0.5) {
        overContent += 1;
        if (offenders.length < 3) offenders.push({ text: n.nodeValue.replace(/\s+/g, ' ').trim().slice(0, 40), excess: +(right - contentRight).toFixed(1) });
      }
    }
  }
  return {
    pageW: +pageW.toFixed(2),
    inlineWidth: wrap.style.width,
    zoom: +zoom.toFixed(4),
    wrapRight: +(wRect.right - sheetLeft).toFixed(2),
    tplRight: +(tRect.right - sheetLeft).toFixed(2),
    contentRight: +contentRight.toFixed(2),
    maxTextRight: maxTextRight === -Infinity ? null : +maxTextRight.toFixed(2),
    overContent,
    offenders,
    templatePastSheet: +Math.max(0, (wRect.right - sheetLeft) - pageW).toFixed(2),
    contentPastSheet: +Math.max(0, contentRight - pageW).toFixed(2),
    fontLoaded: typeof document.fonts.check === 'function' ? document.fonts.check("16px 'Tinos'") : null,
  };
};

async function main() {
  if (!fs.existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}`);
  fs.mkdirSync(outDir, { recursive: true });
  const puppeteer = (await import('puppeteer-core')).default;
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none', '--force-color-profile=srgb'],
    executablePath: CHROME, headless: true,
  });

  const report = { generatedAt: new Date().toISOString(), chrome: CHROME, sizes: SIZES_PX, viewports: VIEWPORTS, wrapping: {}, scaling: {}, knownAccepted: {} };
  const failures = [];

  /* ── A. template-coordinate wrapping ──────────────────────────────────── */
  const dataset = JSON.parse(fs.readFileSync(path.join(here, 'resume-max-coverage.json'), 'utf8'));
  const pageA = await browser.newPage();
  await pageA.setViewport({ width: 1280, height: 1000, deviceScaleFactor: 1 });
  await pageA.setContent(html(previewHarnessJs), { waitUntil: 'networkidle0' });
  await pageA.evaluate(() => document.fonts.ready);

  for (const template of TEMPLATES) {
    report.wrapping[template] = {};
    for (const px of SIZES_PX) {
      await pageA.evaluate((r, t) => window.__harness.set(r, t), { ...dataset, fontFamily: 'template', fontSize: pxToPt(px) }, template);
      await pageA.evaluate(() => document.fonts.ready);
      await settle(pageA);
      const m = await pageA.evaluate(measureWrapping);
      report.wrapping[template][px] = m;
      const ok = !!m && m.over === 0 && m.overflowing.length === 0;
      if (!ok) failures.push(`A ${template}@${px}px: over=${m && m.over} overflowing=${m && m.overflowing.length} ${m && m.overflowing[0] ? '| ' + m.overflowing[0] : ''}`);
      console.log(`[A] ${template.padEnd(12)} ${String(px).padStart(4)}px  over=${m.over} ovf=${m.overflowing.length} pages=${m.pages} contentRight=${m.contentBoxRightDrift} ${ok ? 'OK' : '<<< FAIL'}`);
    }
  }
  await pageA.close();

  /* ── B. sheet inside its frame (incl. 1536x674) ───────────────────────── */
  const pageB = await browser.newPage();
  await pageB.setViewport({ width: 1536, height: 900, deviceScaleFactor: 1 });
  await pageB.setContent(html(scalingHarnessJs), { waitUntil: 'networkidle0' });
  await pageB.evaluate(() => document.fonts.ready);

  // Fidelity: the dataset stores the size in px (the persisted unit), exactly
  // like a saved resume; the app converts px→pt at its read boundary
  // (services/resumeService.js fontSizeFromStoredPx) before ResumePreview sees
  // it. Do the same here so section B renders an EXISTING resume at its saved
  // size (10.5px → 7.875pt → scale 1), not an accidental scale-1.33 size.
  const datasetAtSavedSize = { ...dataset, fontSize: pxToPt(dataset.fontSize ?? 10.5) };

  for (const template of TEMPLATES) {
    report.scaling[template] = {};
    await pageB.evaluate((r, t) => window.__scaling.set({ ...r }, t), datasetAtSavedSize, template);
    for (const [vw, vh] of VIEWPORTS) {
      await pageB.setViewport({ width: vw, height: vh, deviceScaleFactor: 1 });
      await settle(pageB);
      const m = await pageB.evaluate(() => window.__scaling.measure());
      const clip = m.clipVsColumn == null ? 0 : m.clipVsColumn;
      const ovfPage = m.viewport.overflowPage;
      report.scaling[template][`${vw}x${vh}`] = { scale: m.scale, clipVsColumn: clip, overflowPage: ovfPage, pages: m.sheetCount };
      const checks = [];
      if (clip > 0.5) checks.push(`sheet clipped ${clip.toFixed(1)}px past frame`);
      if (ovfPage > 0.5) checks.push(`page overflows horizontally ${ovfPage.toFixed(1)}px`);
      if (!(m.scale > 0) || m.scale > 1.0001) checks.push(`scale ${m.scale} not in (0,1]`);
      if (checks.length) failures.push(`B ${template}@${vw}x${vh}: ${checks.join('; ')}`);
      console.log(`[B] ${template.padEnd(12)} ${String(vw).padStart(4)}x${String(vh).padEnd(4)} scale=${m.scale.toFixed(4)} clip=${clip.toFixed(1)} ovfPage=${ovfPage} pages=${m.sheetCount} ${checks.length ? '<<< FAIL' : 'OK'}`);
    }
  }

  /* ── C. owner repro — Finance + Times, small sizes ────────────────────── */
  const ownerRepro = JSON.parse(fs.readFileSync(path.join(here, 'finance-repro.json'), 'utf8'));
  const OWNER_SIZES = [7.5, 8, 9.5, 12];
  const OWNER_VIEWPORTS = [[1920, 1080], [1536, 674]];
  report.ownerRepro = {};
  for (const [vw, vh] of OWNER_VIEWPORTS) {
    await pageB.setViewport({ width: vw, height: vh, deviceScaleFactor: 1 });
    await pageB.evaluate((r) => window.__scaling.set({ ...r }, 'finance'), ownerRepro);
    await pageB.evaluate(() => document.fonts.ready);
    report.ownerRepro[`${vw}x${vh}`] = {};
    for (const pt of OWNER_SIZES) {
      await pageB.evaluate((r, pt) => window.__scaling.set({ ...r, fontSize: pt }, 'finance'), ownerRepro, pt);
      await pageB.evaluate(() => document.fonts.ready);
      await settle(pageB);
      const g = await pageB.evaluate(measureSheetGeometry);
      const sc = await pageB.evaluate(() => window.__scaling.measure());
      report.ownerRepro[`${vw}x${vh}`][pt] = { ...g, scale: sc.scale, clipVsColumn: sc.clipVsColumn, overflowPage: sc.viewport.overflowPage, pages: sc.sheetCount };
      const checks = [];
      if (!g) checks.push('no .resume-template found');
      else {
        if (g.templatePastSheet > 0.5) checks.push(`template box ${g.templatePastSheet.toFixed(1)}px past the sheet (right edge ${g.tplRight} > ${g.pageW})`);
        if (g.contentPastSheet > 0.5) checks.push(`content box ${g.contentPastSheet.toFixed(1)}px past the sheet (right edge ${g.contentRight} > ${g.pageW})`);
        if (g.overContent > 0) checks.push(`${g.overContent} text node(s) past the content box`);
      }
      if (sc.clipVsColumn > 0.5) checks.push(`sheet clipped ${sc.clipVsColumn.toFixed(1)}px past frame`);
      if (sc.viewport.overflowPage > 0.5) checks.push(`page overflows horizontally ${sc.viewport.overflowPage.toFixed(1)}px`);
      if (checks.length) failures.push(`C finance@${pt}pt ${vw}x${vh}: ${checks.join('; ')}`);
      console.log(`[C] finance@${String(pt).padEnd(4)}pt ${String(vw).padStart(4)}x${String(vh).padEnd(4)} zoom=${g ? g.zoom : '?'} tplRight=${g ? g.tplRight : '?'}/${g ? g.pageW : '?'} contentRight=${g ? g.contentRight : '?'} maxTextRight=${g ? g.maxTextRight : '?'} clip=${sc.clipVsColumn.toFixed(1)} pages=${sc.sheetCount} ${checks.length ? '<<< FAIL' : 'OK'}`);
    }
  }

  await pageB.close();

  /* ── recorded (non-gating): content-box right edge (documented) ────────── */
  for (const template of ['modern', 'classic', 'clean']) {
    report.knownAccepted[template] = {};
    for (const px of SIZES_PX) report.knownAccepted[template][px] = report.wrapping[template][px].contentBoxRightDrift;
  }

  await browser.close();
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2), 'utf8');

  const totalA = TEMPLATES.length * SIZES_PX.length;
  const totalB = TEMPLATES.length * VIEWPORTS.length;
  const totalC = OWNER_SIZES.length * OWNER_VIEWPORTS.length;
  console.log(`\nA. wrapping: ${totalA - failures.filter((f) => f.startsWith('A ')).length}/${totalA} OK`);
  console.log(`B. sheet-in-frame: ${totalB - failures.filter((f) => f.startsWith('B ')).length}/${totalB} OK`);
  console.log(`C. owner repro (finance+times): ${totalC - failures.filter((f) => f.startsWith('C ')).length}/${totalC} OK`);
  console.log(`recorded content-box right edge (page px): modern ${JSON.stringify(report.knownAccepted.modern)}`);
  console.log('report:', path.relative(root, path.join(outDir, 'report.json')).replace(/\\/g, '/'));
  if (failures.length) {
    console.log(`\n${failures.length} FAILURE(S):`);
    for (const f of failures) console.log('  ! ' + f);
    process.exitCode = 1;
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
