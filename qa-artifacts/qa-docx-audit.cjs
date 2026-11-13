/* eslint-disable no-console */
/**
 * qa-docx-audit.cjs — inspects the Word-rendered PDF of the exported DOCX.
 *
 * The backend JUnit harness proves every field/heading survives inside the
 * .docx package. This script complements it by rendering that DOCX with Word
 * (see docs/qa/field-coverage-matrix.md for the COM command) and checking the
 * paginated result: page count, per-page fill, no blank page, no orphan
 * section heading at the bottom of a page.
 *
 * Usage: node qa-artifacts/qa-docx-audit.cjs <word-rendered.pdf> [output.json]
 */
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const { pathToFileURL } = require('node:url');

const canvasPkg = createRequire(path.join(__dirname, '.tools', 'node_modules', 'pdfjs-dist', 'package.json'))('@napi-rs/canvas');
globalThis.Path2D = canvasPkg.Path2D;
globalThis.ImageData = canvasPkg.ImageData;

const LABELS = [
  'EXECUTIVE PROFILE', 'TECHNICAL SKILLS', 'PROFESSIONAL EXPERIENCE',
  'SELECTED PROJECTS', 'EDUCATION & TRAINING', 'CERTIFICATIONS & CREDENTIALS',
  'AWARDS & ACHIEVEMENTS', 'LANGUAGES', 'INTERESTS', 'HONOURS', 'REFERENCES',
  'VOLUNTEERING', 'PUBLICATIONS & TALKS', 'TECHNICAL TOOLKIT',
  'TEACHING & ADVISORY', 'COMMUNITY INVOLVEMENT', 'CAREER PHILOSOPHY',
];

const flat = (s) => String(s || '').replace(/\s+/g, ' ').trim();

async function main() {
  const input = process.argv[2];
  const output = process.argv[3] || path.join(__dirname, 'pdf-audit', 'docx-audit.json');
  if (!input) throw new Error('usage: qa-docx-audit.cjs <word-rendered.pdf> [output.json]');

  const entry = path.join(__dirname, '.tools', 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.mjs');
  const pdfjs = await import(pathToFileURL(entry).href);
  const doc = await pdfjs.getDocument({ data: new Uint8Array(fs.readFileSync(input)), useSystemFonts: true, isEvalSupported: false }).promise;

  const pages = [];
  for (let p = 1; p <= doc.numPages; p += 1) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    let current = '';
    const lines = [];
    for (const item of content.items) {
      if (typeof item.str !== 'string') continue;
      current += item.str;
      if (item.hasEOL) { lines.push(current); current = ''; }
    }
    if (current) lines.push(current);
    pages.push({ page: p, lines: lines.filter((l) => flat(l)) });
  }
  await doc.destroy();

  const blankPages = pages.filter((p) => p.lines.length === 0).map((p) => p.page);
  const orphanHeadings = [];
  const headings = [];
  for (const page of pages) {
    page.lines.forEach((line, index) => {
      const value = flat(line).toUpperCase();
      if (!LABELS.includes(value)) return;
      headings.push({ label: value, page: page.page, line: index });
      if (index === page.lines.length - 1) {
        orphanHeadings.push({ label: value, page: page.page });
      }
    });
  }

  const report = {
    generatedAt: new Date().toISOString(),
    source: input,
    pages: pages.length,
    linesPerPage: pages.map((p) => p.lines.length),
    blankPages,
    lastPageBlank: blankPages.includes(pages.length),
    headingsFound: headings.length,
    missingHeadings: LABELS.filter((l) => !headings.some((h) => h.label === l)),
    orphanHeadings,
    lastPageTail: pages[pages.length - 1].lines.slice(-6),
  };
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(report, null, 2), 'utf8');

  console.log(`pages=${report.pages} lines/page=${report.linesPerPage.join(',')}`);
  console.log(`headings=${headings.length}/${LABELS.length} missing=${report.missingHeadings.join(', ') || '-'}`);
  console.log(`blankPages=${blankPages.join(',') || '-'} orphanHeadings=${orphanHeadings.map((o) => o.label).join(', ') || '-'}`);
  console.log('last page tail:');
  report.lastPageTail.forEach((l) => console.log('  ' + flat(l).slice(0, 110)));
}

main().catch((err) => { console.error(err); process.exit(1); });
