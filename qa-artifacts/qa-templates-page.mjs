/* eslint-disable no-console */
/**
 * qa-templates-page.mjs — loads the built /templates page in real Chrome and
 * proves every template card now shows its real preview image.
 *
 * Usage: node qa-artifacts/qa-templates-page.mjs [url]
 * Default url: http://127.0.0.1:4173/templates (vite preview)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const url = process.argv[2] || 'http://127.0.0.1:4173/templates';

const puppeteer = (await import('puppeteer-core')).default;
const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
  executablePath: CHROME,
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });

const failed = [];
page.on('response', (res) => {
  if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
});
page.on('requestfailed', (req) => failed.push(`FAILED ${req.url()} ${req.failure()?.errorText}`));

await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
await page.waitForSelector('img[src^="/templates/"]', { timeout: 30000 });
await page.evaluate(() => Promise.all(Array.from(document.images).map((i) => i.complete ? null : new Promise((r) => { i.onload = r; i.onerror = r; }))));

const result = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('img[src^="/templates/"]'));
  return {
    imgCount: imgs.length,
    loaded: imgs.filter((i) => i.naturalWidth > 0 && i.naturalHeight > 0).length,
    srcs: imgs.map((i) => i.getAttribute('src')),
    sizes: imgs.map((i) => `${i.naturalWidth}x${i.naturalHeight}`),
    cardLabels: Array.from(document.querySelectorAll('img[src^="/templates/"]')).length,
  };
});
const shot = path.join(here, 'template-renders', 'templates-page.png');
await page.screenshot({ path: shot, fullPage: true });
await browser.close();

const uniqueSrcs = [...new Set(result.srcs)];
const ok = result.imgCount === 20 && result.loaded === 20 && uniqueSrcs.length === 20 && failed.length === 0;
const report = { generatedAt: new Date().toISOString(), url, ...result, uniqueSrcs: uniqueSrcs.length, failed, ok, screenshot: 'qa-artifacts/template-renders/templates-page.png' };
fs.writeFileSync(path.join(here, 'template-renders', 'page-check.json'), JSON.stringify(report, null, 2), 'utf8');
console.log(`images=${result.imgCount} loaded=${result.loaded} unique=${uniqueSrcs.length} failedRequests=${failed.length}`);
console.log(`sizes=${[...new Set(result.sizes)].join(', ')}`);
console.log(`screenshot=${report.screenshot}`);
if (failed.length) console.log('failed:', failed.slice(0, 10));
console.log(ok ? 'PAGE OK' : 'PAGE FAIL');
process.exit(ok ? 0 : 1);
