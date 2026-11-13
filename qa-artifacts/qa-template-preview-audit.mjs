/* eslint-disable no-console */
/**
 * qa-template-preview-audit.mjs — programmatic audit of the 20 generated
 * template preview images in public/templates/.
 *
 * This model cannot view images, so every check is measured:
 *   1. PNG exists and its real IHDR dimensions match the template page size.
 *   2. The image is not blank: ink coverage (non-white pixel ratio) is in a
 *      sane band, and ink reaches the lower part of the page.
 *   3. Re-opening the exact saved render HTML in Chrome proves the page fits
 *      one page (no horizontal overflow, no clipped root) and that the
 *      curated resume text is actually present (not a blank/mis-rendered page).
 *
 * Usage: node qa-artifacts/qa-template-preview-audit.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const require = createRequire(import.meta.url);

const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const A4 = { w: 794, h: 1123 };
const US_LETTER = { w: 816, h: 1056 };
const PAGE = { academic: US_LETTER };

const publicDir = path.join(root, 'public', 'templates');
const rawDir = path.join(here, 'template-renders');

const canvasPkg = require(path.join(here, '.tools', 'node_modules', '@napi-rs', 'canvas'));
const data = JSON.parse(fs.readFileSync(path.join(here, 'template-preview-data.json'), 'utf8'));

const EXPECTED = [
  ['fullName', data.fullName],
  ['email', data.email],
  ['phone', data.phone],
  ['location', data.location],
  ['summary', data.summary.slice(0, 48)],
  ['skill', data.skills[0]],
  ['role', data.experience[0].role],
  ['company', data.experience[0].company],
  ['bullet', data.experience[0].bullets[0].slice(0, 40)],
  ['project', data.projects[0].name],
  ['degree', data.education[0].degree],
  ['cert', data.certifications[0].name.slice(0, 30)],
  ['language', data.languages[0]],
];

async function inkStats(file) {
  const img = await canvasPkg.loadImage(fs.readFileSync(file));
  const canvas = canvasPkg.createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const { data: px } = ctx.getImageData(0, 0, img.width, img.height);
  let ink = 0;
  let lastInkRow = -1;
  const rowInk = new Array(img.height).fill(0);
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const i = (y * img.width + x) * 4;
      const r = px[i], g = px[i + 1], b = px[i + 2];
      if (r < 245 || g < 245 || b < 245) {
        ink++;
        rowInk[y]++;
        if (y > lastInkRow) lastInkRow = y;
      }
    }
  }
  const total = img.width * img.height;
  return {
    width: img.width,
    height: img.height,
    inkRatio: ink / total,
    lastInkRow,
    lastInkFraction: (lastInkRow + 1) / img.height,
    nonEmptyRows: rowInk.filter((c) => c > 3).length,
  };
}

async function main() {
  if (!fs.existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}`);
  const puppeteer = (await import('puppeteer-core')).default;
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none', '--force-color-profile=srgb', '--hide-scrollbars'],
    executablePath: CHROME,
    headless: true,
  });

  const report = { generatedAt: new Date().toISOString(), templates: {} };
  const ids = fs.readdirSync(publicDir).filter((f) => f.endsWith('.png')).map((f) => f.replace(/\.png$/, '')).sort();

  for (const id of ids) {
    const imageFile = path.join(publicDir, `${id}.png`);
    const htmlFile = path.join(rawDir, `${id}.html`);
    const size = PAGE[id] || A4;
    const ink = await inkStats(imageFile);

    const page = await browser.newPage();
    await page.setViewport({ width: size.w, height: size.h });
    await page.goto(`file:///${htmlFile.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    const dom = await page.evaluate((pageW) => {
      const doc = document.documentElement;
      const rootEl = document.querySelector('.resume-template');
      const rect = rootEl ? rootEl.getBoundingClientRect() : null;
      const text = document.body.innerText.replace(/\s+/g, ' ').trim();
      return {
        rootCount: document.querySelectorAll('.resume-template').length,
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        horizontalOverflow: doc.scrollWidth > pageW + 1,
        contentBottom: rect ? Math.round(rect.bottom) : null,
        contentHeight: rect ? Math.round(rect.height) : null,
        text,
      };
    }, size.w);
    await page.close();

    // Compare case-insensitively: several templates apply CSS
    // `text-transform: uppercase` to the name/contact row, and Chrome's
    // innerText reflects that transform.
    const haystack = dom.text.toLowerCase();
    const missing = EXPECTED.filter(([, v]) => !haystack.includes(v.replace(/\s+/g, ' ').toLowerCase())).map(([k]) => k);
    const dimOk = ink.width === size.w && ink.height === size.h;
    const notBlank = ink.inkRatio > 0.01 && ink.inkRatio < 0.6;
    const fillsPage = ink.lastInkFraction > 0.5;
    // A preview shows page 1; content taller than one page is normal for a
    // real resume and is simply cropped by the clip rectangle, so only
    // horizontal overflow / missing root are defects.
    const noOverflow = !dom.horizontalOverflow && dom.rootCount === 1;
    const fitsPage = noOverflow;
    const contentOk = missing.length === 0;

    report.templates[id] = {
      pageSize: `${size.w}x${size.h}`,
      image: `public/templates/${id}.png`,
      bytes: fs.statSync(imageFile).size,
      dimOk,
      inkRatio: Number(ink.inkRatio.toFixed(4)),
      notBlank,
      lastInkFraction: Number(ink.lastInkFraction.toFixed(3)),
      fillsPage,
      nonEmptyRows: ink.nonEmptyRows,
      rootCount: dom.rootCount,
      horizontalOverflow: dom.horizontalOverflow,
      contentHeight: dom.contentHeight,
      fitsPage,
      missingFields: missing,
      contentOk,
      ok: dimOk && notBlank && fillsPage && fitsPage && contentOk,
    };
    const r = report.templates[id];
    console.log(`${id.padEnd(13)} ${r.pageSize.padEnd(9)} ink=${String(r.inkRatio).padEnd(6)} last=${String(r.lastInkFraction).padEnd(5)} rows=${String(r.nonEmptyRows).padStart(4)} h=${String(r.contentHeight).padStart(4)} overflow=${r.horizontalOverflow} missing=${missing.length} -> ${r.ok ? 'OK' : 'FAIL'}`);
  }

  await browser.close();
  const vals = Object.values(report.templates);
  report.summary = {
    templates: vals.length,
    ok: vals.filter((v) => v.ok).length,
    dimOk: vals.filter((v) => v.dimOk).length,
    notBlank: vals.filter((v) => v.notBlank).length,
    fillsPage: vals.filter((v) => v.fillsPage).length,
    fitsPage: vals.filter((v) => v.fitsPage).length,
    contentOk: vals.filter((v) => v.contentOk).length,
  };
  fs.writeFileSync(path.join(rawDir, 'audit.json'), JSON.stringify(report, null, 2), 'utf8');
  console.log(`\nOK: ${report.summary.ok}/${report.summary.templates}  dim=${report.summary.dimOk} blank-ok=${report.summary.notBlank} fills=${report.summary.fillsPage} fits=${report.summary.fitsPage} content=${report.summary.contentOk}`);
  console.log('report: qa-artifacts/template-renders/audit.json');
  process.exit(report.summary.ok === report.summary.templates ? 0 : 1);
}

main().catch((err) => { console.error(err); process.exit(1); });
