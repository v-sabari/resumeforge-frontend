/* eslint-disable no-console */
/**
 * qa-pdf-audit.cjs — machine-checks the real exported PDFs.
 *
 * For every PDF produced by qa-pdf.cjs this script:
 *   • extracts per-page text with pdf.js,
 *   • asserts every populated field value survives (URL wrap tolerant),
 *   • asserts every section heading appears, in order, with body content
 *     (no orphan heading), on a non-blank page,
 *   • asserts no blank/trailing blank page and no placeholder/broken text,
 *   • compares the PDF page count with the handler's preview-parity count,
 *   • records the embedded font names.
 *
 * Evidence: qa-artifacts/pdf-audit/audit-report.json
 * Usage: node qa-artifacts/qa-pdf-audit.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const here = __dirname;
const outDir = path.join(here, 'pdf-audit');
const data = JSON.parse(fs.readFileSync(path.join(here, 'resume-max-coverage.json'), 'utf8'));
const report = JSON.parse(fs.readFileSync(path.join(outDir, 'report.json'), 'utf8'));

const BROKEN = ['[object Object]', 'undefined', 'NaN', 'Lorem ipsum', 'Your Name', '<div', '&lt;', '&amp;'];

const TWO_COLUMN_GROUPS = {
  traditional: [
    ['summary', 'experience', 'projects', 'education', 'interests', 'awards', 'references', 'volunteer', 'publications', 'custom-grid', 'custom-entries', 'custom-bullets', 'custom-text'],
    ['skills', 'certifications', 'achievements', 'languages'],
  ],
  engineering: [
    ['summary', 'experience', 'projects', 'education', 'interests', 'awards', 'references', 'volunteer', 'publications', 'custom-grid', 'custom-entries', 'custom-bullets', 'custom-text'],
    ['skills', 'certifications', 'achievements', 'languages'],
  ],
  designer: [
    ['summary', 'experience', 'projects', 'education', 'interests', 'awards', 'references', 'volunteer', 'publications', 'custom-grid', 'custom-entries', 'custom-bullets', 'custom-text'],
    ['skills', 'certifications', 'achievements', 'languages'],
  ],
  clean: [
    ['summary', 'skills', 'certifications', 'achievements', 'languages', 'custom-grid', 'custom-entries', 'custom-bullets', 'custom-text'],
    ['experience', 'projects', 'education', 'interests', 'awards', 'references', 'volunteer', 'publications'],
  ],
};

const flat = (s) => String(s || '').replace(/\s+/g, ' ').trim();
const noSpace = (s) => String(s || '').replace(/\s+/g, '');
const shortUrl = (u) => String(u || '').trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/+$/, '');

function expectedFields() {
  const fields = [];
  const add = (section, field, value) => {
    const v = flat(value);
    if (v) fields.push({ section, field, value: v });
  };
  for (const key of ['fullName', 'professionalTitle', 'email', 'phone', 'location', 'linkedin', 'github', 'portfolio']) {
    add('basics', key, data[key]);
  }
  add('summary', 'summary', data.summary);
  (data.experience || []).forEach((e, i) => {
    add('experience', `experience[${i}].role`, e.role);
    add('experience', `experience[${i}].company`, e.company);
    add('experience', `experience[${i}].location`, e.location);
    add('experience', `experience[${i}].employmentType`, e.employmentType);
    add('experience', `experience[${i}].summary`, e.summary);
    add('experience', `experience[${i}].duration`, `${e.startDate || ''} – ${e.endDate || 'Present'}`.trim());
    (e.bullets || []).forEach((b, j) => add('experience', `experience[${i}].bullets[${j}]`, b));
  });
  (data.projects || []).forEach((p, i) => {
    add('projects', `projects[${i}].name`, p.name);
    add('projects', `projects[${i}].role`, p.role);
    add('projects', `projects[${i}].techStack`, p.techStack);
    add('projects', `projects[${i}].description`, p.description);
    add('projects', `projects[${i}].link`, p.link);
    add('projects', `projects[${i}].github`, p.github);
    (p.highlights || []).forEach((h, j) => add('projects', `projects[${i}].highlights[${j}]`, h));
  });
  (data.education || []).forEach((e, i) => {
    add('education', `education[${i}].institution`, e.institution);
    add('education', `education[${i}].degree`, e.degree);
    add('education', `education[${i}].field`, e.field);
    add('education', `education[${i}].grade`, e.grade);
    add('education', `education[${i}].details`, e.details);
    add('education', `education[${i}].year`, `${e.startDate || ''} – ${e.endDate || ''}`.trim());
  });
  (data.certifications || []).forEach((c, i) => {
    add('certifications', `certifications[${i}].name`, c.name);
    add('certifications', `certifications[${i}].issuer`, c.issuer);
    add('certifications', `certifications[${i}].year`, c.year);
    add('certifications', `certifications[${i}].credentialUrl`, c.credentialUrl);
  });
  (data.skills || []).forEach((s, i) => add('skills', `skills[${i}]`, s));
  (data.achievements || []).forEach((a, i) => add('achievements', `achievements[${i}]`, a));
  (data.languages || []).forEach((l, i) => add('languages', `languages[${i}]`, l));

  for (const section of data.sectionsConfig || []) {
    if (!section.visible || section.key === 'basics') continue;
    const content = (data.customSections || {})[section.id];
    if (!content) continue;
    const mode = content.mode || 'text';
    if (mode === 'grid') {
      (content.columns || []).forEach((col, i) => {
        add(section.id, `${section.id}.columns[${i}].label`, col.label);
        (col.items || []).forEach((item, j) => add(section.id, `${section.id}.columns[${i}].items[${j}]`, item));
      });
    } else if (mode === 'entries') {
      (content.entries || []).forEach((en, i) => {
        add(section.id, `${section.id}.entries[${i}].title`, en.title);
        add(section.id, `${section.id}.entries[${i}].subtitle`, en.subtitle);
        add(section.id, `${section.id}.entries[${i}].date`, en.date);
        add(section.id, `${section.id}.entries[${i}].location`, en.location);
        (en.bullets || []).forEach((b, j) => add(section.id, `${section.id}.entries[${i}].bullets[${j}]`, b));
      });
    } else if (mode === 'bullets') {
      (content.items || []).forEach((item, i) => add(section.id, `${section.id}.items[${i}]`, item));
    } else {
      add(section.id, `${section.id}.text`, content.text);
    }
  }
  return fields;
}

function sectionLabels() {
  return (data.sectionsConfig || [])
    .filter((s) => s.visible && s.key !== 'basics')
    .map((s) => ({ id: s.id, label: s.label }));
}

async function loadPdfjs() {
  const entry = path.join(here, '.tools', 'node_modules', 'pdfjs-dist', 'legacy', 'build', 'pdf.mjs');
  return import(pathToFileURL(entry).href);
}

async function extractPages(pdfjs, file) {
  const bytes = new Uint8Array(fs.readFileSync(file));
  const doc = await pdfjs.getDocument({ data: bytes, useSystemFonts: true, isEvalSupported: false }).promise;
  const pages = [];
  for (let p = 1; p <= doc.numPages; p += 1) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const width = page.view[2];
    const height = page.view[3];
    let current = '';
    const lines = [];
    const glyphs = [];
    for (const item of content.items) {
      if (typeof item.str !== 'string') continue;
      if (item.str.trim()) {
        const x = item.transform[4];
        const y = item.transform[5];
        glyphs.push({
          text: item.str,
          x0: x,
          x1: x + (item.width || 0),
          y0: y,
          y1: y + (item.height || 0),
        });
      }
      current += item.str;
      if (item.hasEOL) {
        lines.push(current);
        current = '';
      }
    }
    if (current) lines.push(current);
    pages.push({ page: p, lines, glyphs, width, height });
  }
  await doc.destroy();
  return pages;
}

/* A text run painted outside the printable page box is clipped in the PDF (the
   reader can never scroll to it). Report the worst offenders per PDF. */
function outOfBounds(pages) {
  const bad = [];
  for (const page of pages) {
    for (const g of page.glyphs) {
      const overRight = g.x1 - page.width;
      const overLeft = -g.x0;
      const overBottom = -g.y0;
      const overTop = g.y1 - page.height;
      const worst = Math.max(overRight, overLeft, overBottom, overTop);
      if (worst > 2) {
        bad.push({
          page: page.page,
          text: flat(g.text).slice(0, 60),
          over: Math.round(worst * 10) / 10,
          side: worst === overRight ? 'right' : worst === overLeft ? 'left' : worst === overBottom ? 'bottom' : 'top',
        });
      }
    }
  }
  return bad.slice(0, 12);
}

function checkField(textAll, textNoSpace, entry) {
  const lowerText = textAll.toLowerCase();
  const lowerValue = entry.value.toLowerCase();
  if (textAll.includes(entry.value)) return true;
  if (lowerText.includes(lowerValue)) return true; // e.g. Executive's CSS uppercase header
  const compact = noSpace(entry.value);
  if (compact.length >= 8 && textNoSpace.includes(compact)) return true;
  if (compact.length >= 8 && noSpace(lowerText).includes(noSpace(lowerValue))) return true;

  // Punctuation and quotes are re-encoded by the PDF text extractor (curly vs
  // straight quotes, soft hyphens, emoji), so for long values fall back to an
  // alphanumeric-only comparison. It still proves no letter/digit was lost.
  const alnum = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  const alnumValue = alnum(entry.value);
  if (alnumValue.length >= 12 && alnum(textAll).includes(alnumValue)) return true;

  // Arabic/Hebrew text is shaped and re-ordered by the PDF text extractor, so
  // an exact whole-string match is impossible even when the glyphs rendered
  // correctly. Verify every Latin/ASCII segment survives in order instead.
  const segments = entry.value.split(/[^\x20-\x7E]+/).map(flat).filter((s) => s.length >= 4);
  if (segments.length > 1) {
    let from = 0;
    let matched = true;
    for (const segment of segments) {
      const index = lowerText.indexOf(segment.toLowerCase(), from);
      if (index < 0) { matched = false; break; }
      from = index + segment.length;
    }
    if (matched) return true;
  }

  if (entry.field.endsWith('.link') || entry.field.endsWith('.github') || entry.field.endsWith('.credentialUrl')) {
    const short = flat(shortUrl(entry.value));
    if (textAll.includes(short) || lowerText.includes(short.toLowerCase())) return true;
    if (short.length >= 6 && textNoSpace.includes(noSpace(short))) return true;
  }
  return false;
}

const normalizeHeading = (s) => noSpace(s)
  // Templates may decorate a heading with a leading glyph (e.g. Tech's "▸");
  // strip leading/trailing punctuation and symbols before comparing.
  .replace(/^[^\p{L}\p{N}]+/u, '')
  .replace(/[^\p{L}\p{N}]+$/u, '');

function isHeadingShape(s) {
  const letters = String(s || '').replace(/[^\p{L}]/gu, '');
  return letters.length > 0 && letters === letters.toUpperCase();
}

function headingPositions(pages, labels) {
  const positions = new Map();
  const duplicates = [];
  for (const label of labels) {
    // CSS letter-spacing/tracking makes pdf.js emit "E X E C U T I V E ...";
    // comparing without spaces recovers the true heading text. Narrow columns
    // may also wrap a long heading onto two lines, so allow a 1–2 line span.
    const wanted = normalizeHeading(label.label).toLowerCase();
    const matches = [];
    for (const page of pages) {
      page.lines.forEach((line, index) => {
        if (!normalizeHeading(line)) return;
        for (let span = 1; span <= 2 && index + span <= page.lines.length; span += 1) {
          const slice = page.lines.slice(index, index + span);
          if (slice.some((l) => !normalizeHeading(l))) break;
          const raw = slice.join('');
          if (normalizeHeading(raw).toLowerCase() === wanted) {
            matches.push({ page: page.page, line: index, endLine: index + span - 1, shape: isHeadingShape(raw) });
            break;
          }
        }
      });
    }
    // Prefer an uppercase/letter-spaced occurrence (every template's heading
    // shape) over a body value that merely equals the label (e.g. a language
    // literally called "Languages"). Templates that render title-case headings
    // (Academic) fall back to the plain textual match.
    const shaped = matches.filter((m) => m.shape);
    const chosen = shaped.length ? shaped : matches;
    if (chosen.length) positions.set(label.id, chosen[0]);
    if (shaped.length > 1) {
      duplicates.push({ id: label.id, label: label.label, count: shaped.length });
    }
  }
  return { positions, duplicates };
}

function orderOk(template, positions) {
  const groups = TWO_COLUMN_GROUPS[template];
  const checkGroup = (ids) => {
    let previous = null;
    for (const id of ids) {
      const pos = positions.get(id);
      if (!pos) continue;
      if (previous) {
        if (pos.page < previous.page || (pos.page === previous.page && pos.line <= previous.line)) return false;
      }
      previous = pos;
    }
    return true;
  };
  if (groups) return groups.every(checkGroup);
  return checkGroup([...positions.keys()]);
}

function orphanHeadings(pages, labels, positions) {
  const orphans = [];
  for (const label of labels) {
    const pos = positions.get(label.id);
    if (!pos) continue;
    const page = pages.find((p) => p.page === pos.page);
    if (!page) continue;
    const remaining = page.lines.slice(pos.line + 1).map(flat).filter(Boolean);
    if (remaining.length === 0) {
      orphans.push({ id: label.id, label: label.label, page: pos.page });
    }
  }
  return orphans;
}

async function main() {
  const pdfjs = await loadPdfjs();
  const fields = expectedFields();
  const labels = sectionLabels();
  const results = [];
  const files = [];

  for (const entry of Object.values(report.templates)) if (entry.ok) files.push(entry);
  for (const entry of report.fontVariants || []) if (entry.ok) files.push(entry);

  for (const entry of files) {
    const file = path.join(path.resolve(here, '..'), entry.file);
    const pages = await extractPages(pdfjs, file);
    const pageTexts = pages.map((p) => flat(p.lines.join(' ')));
    const textAll = pageTexts.join(' ');
    const textNoSpace = noSpace(textAll);

    const blankPages = pages.filter((p) => !flat(p.lines.join(' '))).map((p) => p.page);
    const lastBlank = blankPages.includes(pages.length) || pages.length === 0;
    const missing = fields.filter((f) => !checkField(textAll, textNoSpace, f));
    const broken = BROKEN.filter((marker) => textAll.includes(marker));
    const { positions, duplicates } = headingPositions(pages, labels);
    const missingHeadings = labels.filter((l) => !positions.has(l.id)).map((l) => l.label);
    const orphans = orphanHeadings(pages, labels, positions);
    const ordered = orderOk(entry.template, positions);
    const clipped = outOfBounds(pages);

    const ok = !lastBlank && missing.length === 0 && broken.length === 0
      && missingHeadings.length === 0 && duplicates.length === 0 && orphans.length === 0 && ordered
      && clipped.length === 0
      && (entry.expectedPages == null || entry.expectedPages === pages.length);

    results.push({
      name: entry.fontFamily ? `font-${entry.fontFamily}-${entry.template}` : entry.template,
      template: entry.template,
      pages: pages.length,
      expectedPages: entry.expectedPages ?? null,
      blankPages,
      lastBlank,
      fieldsChecked: fields.length,
      missing: missing.map((m) => `${m.section}:${m.field}`),
      broken,
      missingHeadings,
      duplicateHeadings: duplicates,
      orphanHeadings: orphans,
      orderOk: ordered,
      clipped,
      fonts: entry.fonts || [],
      ok,
    });

    console.log(`${(entry.fontFamily ? `font-${entry.fontFamily}-${entry.template}` : entry.template).padEnd(22)} `
      + `${String(pages.length).padStart(2)}p  fields ${fields.length - missing.length}/${fields.length}  `
      + `headings ${labels.length - missingHeadings.length}/${labels.length}  `
      + `${ok ? 'PASS' : 'FAIL'}${missing.length ? `  missing=${missing.length}` : ''}`
      + `${orphans.length ? ` orphans=${orphans.length}` : ''}${clipped.length ? ` clipped=${clipped.length}` : ''}${ordered ? '' : ' ORDER'}`);
  }

  const failed = results.filter((r) => !r.ok);
  const summary = {
    generatedAt: new Date().toISOString(),
    pdfs: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
    fieldsChecked: fields.length,
    headingsChecked: labels.length,
    results,
  };
  fs.writeFileSync(path.join(outDir, 'audit-report.json'), JSON.stringify(summary, null, 2), 'utf8');
  console.log(`\nPDFs: ${summary.passed}/${summary.pdfs} pass · fields ${fields.length} · headings ${labels.length}`);
  if (failed.length) {
    console.log('Failures:');
    for (const f of failed) {
      console.log(`  ${f.name}: missing=${f.missing.join(', ') || '-'} orphans=${f.orphanHeadings.map((o) => o.label).join(', ') || '-'} `
        + `missingHeadings=${f.missingHeadings.join(', ') || '-'} order=${f.orderOk} lastBlank=${f.lastBlank} `
        + `expectedPages=${f.expectedPages} pages=${f.pages}`);
    }
  }
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
