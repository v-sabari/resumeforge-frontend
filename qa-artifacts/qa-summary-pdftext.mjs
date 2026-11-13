/* eslint-disable no-console */
/**
 * qa-summary-pdftext.mjs — extracts text from the real exported PDFs and proves
 * each paragraph of the multi-paragraph summary begins its own line (i.e. the
 * author's paragraph breaks survived the PDF export, rather than collapsing
 * into one run-on block).
 *
 * Usage: node qa-artifacts/qa-summary-pdftext.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const pdfDir = path.join(here, 'summary-bug', 'pdf-after');
const dataset = JSON.parse(fs.readFileSync(path.join(here, 'summary-wrap-dataset.json'), 'utf8'));
const lines = dataset.summary.split('\n').filter((l) => l.trim());
const leads = lines.map((l) => l.trim().split(/\s+/)[0]);

async function extract(file) {
  const data = new Uint8Array(fs.readFileSync(file));
  const doc = await getDocument({ data, useSystemFonts: true }).promise;
  let out = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const tc = await page.getTextContent();
    for (const item of tc.items) {
      out += item.str;
      if (item.hasEOL) out += '\n';
    }
    out += '\n';
  }
  await doc.destroy();
  return out;
}

const report = { generatedAt: new Date().toISOString(), leads, templates: {} };
for (const file of fs.readdirSync(pdfDir).filter((f) => f.endsWith('.pdf'))) {
  const key = path.basename(file, '.pdf');
  const text = await extract(path.join(pdfDir, file));
  const extractedLines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  // each paragraph must begin an extracted line
  const perLine = lines.map((l, i) => extractedLines.some((e) => e.startsWith(leads[i])));
  // and the paragraphs must appear in order
  const positions = leads.map((lead) => extractedLines.findIndex((e) => e.startsWith(lead)));
  const orderOk = positions.every((p, i) => p >= 0 && (i === 0 || p > positions[i - 1]));
  report.templates[key] = { everyParagraphStartsLine: perLine.every(Boolean), perLine, orderOk, lineCount: extractedLines.length };
  console.log(`${key.padEnd(12)} paragraphsOnOwnLine=${perLine.every(Boolean)} order=${orderOk} lines=${extractedLines.length}`);
  if (!perLine.every(Boolean)) console.log('  failed:', JSON.stringify(lines.filter((_, i) => !perLine[i])));
}
fs.writeFileSync(path.join(pdfDir, 'text-report.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('report:', path.relative(here, path.join(pdfDir, 'text-report.json')).replace(/\\/g, '/'));
