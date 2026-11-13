/* eslint-disable no-console */
/**
 * qa-screens.cjs — rasterizes representative exported PDF pages to PNG so the
 * layout can be visually inspected (alignment, wrapping, clipping, pagination)
 * alongside the machine checks.
 *
 * Usage: node qa-artifacts/qa-screens.cjs [name:page ...]
 * Default output: qa-artifacts/pdf-audit/screens/<name>-p<page>.png
 */
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const { pathToFileURL } = require('node:url');

// pdf.js's NodeCanvasFactory creates canvases through a CJS require of the same
// package, so the Path2D global must come from that exact instance too.
const canvasPkg = createRequire(path.join(__dirname, '.tools', 'node_modules', 'pdfjs-dist', 'package.json'))('@napi-rs/canvas');
globalThis.Path2D = canvasPkg.Path2D;
globalThis.ImageData = canvasPkg.ImageData;

const DEFAULT = [
  'modern:1', 'modern:4',
  'clean:1', 'leadership:1',
  'traditional:1', 'academic:1',
  'font-times-modern:1', 'font-courier-academic:1',
];

async function main() {
  const entry = path.join(__dirname, '.tools', 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.mjs');
  const pdfjs = await import(pathToFileURL(entry).href);
  const outDir = path.join(__dirname, 'pdf-audit', 'screens');
  fs.mkdirSync(outDir, { recursive: true });

  const requests = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT;
  for (const request of requests) {
    const [name, pageArg] = request.split(':');
    const file = path.join(__dirname, 'pdf-audit', `${name}.pdf`);
    if (!fs.existsSync(file)) { console.error('missing', file); continue; }
    const doc = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(file)), useSystemFonts: true, isEvalSupported: false }).promise;
    const pageNumber = Math.min(Number(pageArg || 1), doc.numPages);
    const page = await doc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.3 });
    const canvas = canvasPkg.createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;
    const out = path.join(outDir, `${name}-p${pageNumber}.png`);
    fs.writeFileSync(out, canvas.toBuffer('image/png'));
    console.log(`${path.relative(path.resolve(__dirname, '..'), out).replace(/\\/g, '/')}  ${Math.round(viewport.width)}x${Math.round(viewport.height)}`);
    await doc.destroy();
  }
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
