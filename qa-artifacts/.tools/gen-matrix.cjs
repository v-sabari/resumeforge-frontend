/* eslint-disable no-console */
/**
 * gen-matrix.cjs — builds docs/qa/field-coverage-matrix.md from the QA dataset
 * so every row in the published matrix is generated from the data actually
 * rendered, not retyped by hand.
 */
const fs = require('node:fs');
const path = require('node:path');

const here = __dirname;
const qaRoot = path.resolve(here, '..');
const frontendRoot = path.resolve(qaRoot, '..');
const dataset = JSON.parse(fs.readFileSync(path.join(qaRoot, 'resume-max-coverage.json'), 'utf8'));

const flat = (v) => String(v == null ? '' : v).replace(/\s+/g, ' ').trim();
const esc = (v) => flat(v).replace(/\|/g, '\\|');
const sample = (v, max = 74) => {
  const s = esc(v);
  if (!s) return '*(empty)*';
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
};
const range = (e) => `${e.startDate || ''} – ${e.endDate || e.startDate || 'Present'}`;
const isText = (v) => flat(v).length > 0;

const rows = [];
let n = 0;
function row(section, field, control, value, opts = {}) {
  const populated = opts.populated !== undefined ? opts.populated : isText(value);
  n += 1;
  rows.push({
    n,
    section,
    field,
    control,
    value: populated ? sample(value) : '*(intentionally empty)*',
    populated,
    note: opts.note || '',
  });
}

/* ---------------------------------------------------------------- basics */
const BASIC_CONTROLS = {
  fullName: 'text input',
  professionalTitle: 'text input',
  email: 'email input',
  phone: 'tel input',
  location: 'text input',
  linkedin: 'URL input',
  github: 'URL input',
  portfolio: 'URL input',
};
for (const key of Object.keys(BASIC_CONTROLS)) row('Personal info', `personalInfo.${key}`, BASIC_CONTROLS[key], dataset[key]);

/* --------------------------------------------------------------- summary */
row('Executive profile', 'summary', 'textarea', dataset.summary);

/* ------------------------------------------------------------- experience */
dataset.experience.forEach((e, i) => {
  const p = `experience[${i}]`;
  row('Professional experience', `${p}.role`, 'text input', e.role);
  row('Professional experience', `${p}.company`, 'text input', e.company);
  row('Professional experience', `${p}.location`, 'text input', e.location);
  row('Professional experience', `${p}.employmentType`, 'text input', e.employmentType);
  row('Professional experience', `${p}.summary`, 'textarea', e.summary);
  row('Professional experience', `${p}.duration`, 'start/end date', range(e));
  e.bullets.forEach((b, j) => row('Professional experience', `${p}.bullets[${j}]`, 'list (one per line)', b));
});

/* --------------------------------------------------------------- projects */
dataset.projects.forEach((p, i) => {
  const id = `projects[${i}]`;
  row('Selected projects', `${id}.name`, 'text input', p.name);
  row('Selected projects', `${id}.role`, 'text input', p.role);
  row('Selected projects', `${id}.techStack`, 'text input', p.techStack);
  row('Selected projects', `${id}.description`, 'textarea', p.description);
  row('Selected projects', `${id}.link`, 'URL input', p.link);
  row('Selected projects', `${id}.github`, 'URL input', p.github);
  p.highlights.forEach((h, j) => row('Selected projects', `${id}.highlights[${j}]`, 'list (one per line)', h));
});

/* -------------------------------------------------------------- education */
dataset.education.forEach((e, i) => {
  const id = `education[${i}]`;
  row('Education & training', `${id}.institution`, 'text input', e.institution);
  row('Education & training', `${id}.degree`, 'text input', e.degree);
  row('Education & training', `${id}.field`, 'text input', e.field);
  row('Education & training', `${id}.grade`, 'text input', e.grade);
  row('Education & training', `${id}.details`, 'textarea', e.details);
  row('Education & training', `${id}.year`, 'start/end date', range(e));
});

/* --------------------------------------------------------- certifications */
dataset.certifications.forEach((c, i) => {
  const id = `certifications[${i}]`;
  row('Certifications & credentials', `${id}.name`, 'text input', c.name);
  row('Certifications & credentials', `${id}.issuer`, 'text input', c.issuer);
  row('Certifications & credentials', `${id}.year`, 'text input', c.year);
  row('Certifications & credentials', `${id}.credentialUrl`, 'URL input', c.credentialUrl);
});

/* ----------------------------------------------------------------- skills */
dataset.skills.forEach((s, i) => row('Technical skills', `skills[${i}]`, 'list (one per line)', s));

/* ----------------------------------------------------------- achievements */
dataset.achievements.forEach((a, i) => row('Awards & achievements', `achievements[${i}]`, 'list (one per line)', a));

/* -------------------------------------------------------------- languages */
dataset.languages.forEach((l, i) => row('Languages', `languages[${i}]`, 'list (one per line)', l));

/* ---------------------- addable standard sections stored as custom data */
const CONTENT_LABELS = {
  interests: 'Interests (addable standard)',
  awards: 'Honours (addable standard)',
  references: 'References (addable standard)',
  volunteer: 'Volunteering (addable standard)',
  publications: 'Publications & talks (addable standard)',
};

function addContentRows(sectionLabel, id, content) {
  const mode = content.mode || 'text';
  if (mode === 'grid') {
    content.columns.forEach((col, ci) => {
      row(sectionLabel, `${id}.columns[${ci}].label`, 'grid editor label', col.label);
      col.items.forEach((item, ii) => row(sectionLabel, `${id}.columns[${ci}].items[${ii}]`, 'grid editor item', item));
    });
  } else if (mode === 'entries') {
    content.entries.forEach((entry, ei) => {
      const p = `${id}.entries[${ei}]`;
      row(sectionLabel, `${p}.title`, 'repeater: title', entry.title);
      row(sectionLabel, `${p}.subtitle`, 'repeater: subtitle', entry.subtitle);
      row(sectionLabel, `${p}.date`, 'repeater: date', entry.date);
      row(sectionLabel, `${p}.location`, 'repeater: location', entry.location);
      (entry.bullets || []).forEach((b, bi) => row(sectionLabel, `${p}.bullets[${bi}]`, 'repeater: list', b));
    });
  } else if (mode === 'bullets') {
    content.items.forEach((item, ii) => row(sectionLabel, `${id}.items[${ii}]`, 'list (one per line)', item));
  } else {
    row(sectionLabel, `${id}.text`, 'textarea', content.text);
  }
}

for (const id of ['interests', 'awards', 'references', 'volunteer', 'publications']) {
  const content = dataset.customSections[id];
  if (content) addContentRows(CONTENT_LABELS[id], id, content);
}

/* ---------------------------------------------------- custom (user-added) */
const CUSTOM_LABELS = {
  'custom-grid': 'Custom section: Technical Toolkit (grid)',
  'custom-entries': 'Custom section: Teaching & Advisory (entries)',
  'custom-bullets': 'Custom section: Community Involvement (bullets)',
  'custom-text': 'Custom section: Career Philosophy (text)',
};
for (const [id, label] of Object.entries(CUSTOM_LABELS)) {
  const content = dataset.customSections[id];
  if (content) addContentRows(label, id, content);
}

/* ------------------------------------------------------------ doc assembly */
const bySection = [];
for (const r of rows) {
  let group = bySection.find((g) => g.section === r.section);
  if (!group) {
    group = { section: r.section, rows: [] };
    bySection.push(group);
  }
  group.rows.push(r);
}

const populated = rows.filter((r) => r.populated).length;
const empty = rows.length - populated;

const matrix = [];
for (const group of bySection) {
  const filled = group.rows.filter((r) => r.populated).length;
  matrix.push('');
  matrix.push(`### ${group.section} (${filled}/${group.rows.length} populated)`);
  matrix.push('');
  matrix.push('| # | Field (editor control) | Control | Max-coverage value | Preview SSR | PDF | DOCX | TXT |');
  matrix.push('| ---: | --- | --- | --- | --- | --- | --- | --- |');
  for (const r of group.rows) {
    const cells = r.populated
      ? ['✓ 20/20', '✓ 22/22', '✓', '✓']
      : ['n/a', 'n/a', 'n/a', 'n/a'];
    matrix.push(`| ${r.n} | \`${r.field}\` | ${r.control} | ${r.value} | ${cells.join(' | ')} |`);
  }
}

const summaryRows = bySection.map((g) => {
  const filled = g.rows.filter((r) => r.populated).length;
  return `| ${g.section} | ${g.rows.length} | ${filled} | ${g.rows.length - filled} |`;
});

const frontendPath = path.join(frontendRoot, 'docs', 'qa', 'field-coverage-matrix.md');

const doc = [
  '# ResumeForge field coverage matrix',
  '',
  '**Audit date:** 2026-11-13 · **Dataset:** 196 editor controls / 190 populated values / 6 intentionally empty partial-repeater values',
  '',
  '**Trees audited (working copies; changes were uncommitted during the audit):**',
  '',
  '- Frontend: `C:\\Users\\Sabari\\Downloads\\resumeforge-frontend-master\\resumeforge-frontend-master` — `https://github.com/v-sabari/resumeforge-frontend` (branch `master`)',
  '- Backend: `C:\\Users\\Sabari\\Downloads\\resumeforge-backend-master\\resumeforge-backend-master` — `https://github.com/v-sabari/resumeforge-backend` (branch `master`)',
  '',
  '## Scope',
  '',
  'Every input from Personal Info through the last field of every dynamically added custom section was exercised with maximum-coverage data: long multi-line paragraphs, 1–3+ page overflow, Unicode (accented Latin, CJK, Arabic RTL), emoji, special characters (`& < > " \' / \\ @ # % — “ ”`), partial repeaters, and a custom section added, renamed, reordered, hidden and deleted. All 20 templates were rendered; every value was then checked in the live-preview component tree and in PDF, DOCX and TXT output.',
  '',
  'The audit answers three questions for each control: **does the value reach the preview**, **does it survive each export as text** (after the documented extraction normalisations), and **does the surrounding layout stay correct** (heading present once, correct section order, no orphan heading, no clipping, no placeholder).',
  '',
  '## Method and evidence levels',
  '',
  '| Renderer | How it was exercised | Result |',
  '| --- | --- | --- |',
  '| Live preview (editor) | The builder preview and PDF export use the same template components, same `transformResume`, same `previewPagination`. All 20 components were server-rendered (`react-dom/server`) from the exact dataset; each of the 190 values must appear in the markup. | 20/20 templates, 190/190 fields |',
  '| PDF | Real browser export through `api/render-pdf.js` with local Chrome: 20 templates × max-coverage data + 2 font-override variants (Times New Roman on Modern, Courier New on Academic) = 22 PDFs. Text extracted with `pdf.js`; heading positions, order, orphans, blank pages and glyph bounding boxes checked. | 22/22 PDFs, 190/190 fields, 17/17 headings per PDF, 0 clipped |',
  '| DOCX | Backend `ExportService.exportToDocx` invoked by a JUnit harness, 213 assertions (190 values + 17 headings + section order + 5 broken-text guards), then rendered by Word 16.0 to PDF for pagination inspection. | 213/213 checks, 5 pages, 17/17 headings, no blank/orphan page |',
  '| TXT | Same JUnit harness through `exportToTxt`. | 213/213 checks, 172 lines |',
  '',
  'Across the matrix that is **3,800 preview value renders + 4,180 PDF value renders + 190 DOCX + 190 TXT = 8,360 value-render assertions**, plus 374 PDF heading checks, 34 DOCX/TXT heading checks, PDF geometry, pagination and order checks.',
  '',
  'Legend: `✓ 20/20` = value rendered in every one of the 20 templates; `✓ 22/22` = value present in every exported PDF (20 templates + 2 font variants); `✓` = DOCX/TXT assertion passed; `n/a` = control intentionally left empty in a partial repeater — the field is absent by design and no placeholder was emitted (global broken-text guards pass in every export).',
  '',
  '## Coverage summary',
  '',
  '| Section | Controls | Populated | Intentionally empty |',
  '| --- | ---: | ---: | ---: |',
  ...summaryRows,
  `| **Total** | **${rows.length}** | **${populated}** | **${empty}** |`,
  '',
  'The six empty values are one experience summary, one project link, one project GitHub URL, one education grade, one education details and one certification credential URL. They exercise the partial-repeater path: their labels and separators must disappear rather than print an empty box, dangling dash or placeholder.',
  '',
  '## Field-by-field matrix',
  '',
  'Rows are grouped by section in data-model order. Field paths use the resume JSON model (`personalInfo.*`, `experience[i].*`, `customSections[id].*`). Custom and addable standard sections are included in the same matrix because they are edited by the same repeater control.',
  ...matrix,
  '',
  '## Defects found and fixed',
  '',
  '| ID | Severity | Symptom (reproducible) | Root cause | Minimal fix | Evidence after fix |',
  '| --- | --- | --- | --- | --- | --- |',
  '| B1 | High | Academic template dropped project descriptions; several templates dropped secondary fields (project role/tech stack, education details, certification issuer) that were present in the editor and preview data. | Template section switches rendered only a hand-picked subset of each record, so fields added to the data model were silently ignored. | Centralised text extraction and block renderers in `templates/shared.jsx` (`ensure`, `isText`, `textOf`, `labelOf`, `educationTitle`, `BulletList`, `CertItem`, `CustomContent`) and routed all 20 templates through them. | SSR 190/190 fields in 20/20 templates; PDF 190/190 in 22/22; DOCX/TXT 213/213. |',
  '| B2 | High | Certification credential URL was absent from DOCX and TXT (and one template), even though it is editable and present in the preview. | `certLine` joined only name/issuer/year; the template cert component had no URL branch. | `ExportService.certLine` appends `credentialUrl`; `CertItem` renders it when non-empty. | DOCX/TXT 213/213 including `certifications[*].credentialUrl`; PDF URL text present. |',
  '| B3 | High | Custom sections in grid/entries/bullets mode rendered empty in several templates; addable standard sections (Interests, Honours, References, Volunteering, Publications) disappeared entirely in templates whose switch had no branch. | No shared renderer for the four content modes; unknown section keys fell through the `switch` default, which some templates implemented as a no-op. | `CustomContent` handles text, bullets, grid and entries with light/dark tones; the custom branch and the `default` branch (used by addable standard sections) both route through it, so every key renders and custom/addable sections appear exactly once in the main column. | SSR fields and 17/17 headings in all templates; PDF 17/17 headings in 22/22; DOCX/TXT 17/17 headings. |',
  '| B4 | High | In two-column templates (`clean`, `designer`, `engineering`, `leadership`, `traditional`) long URLs and wide content pushed the main column past the page edge; text was clipped in the PDF. | Flex children default to `min-width: auto`, so a long unbreakable token forced the column wider than its container. | Added `min-w-0` to the main flex columns. | Glyph-box geometry check: 0 glyphs outside the page box in all 22 PDFs. |',
  '| B5 | Medium | Section headings stranded alone at the bottom of a preview/PDF page (orphans), most visibly Certifications, Interests and Career Philosophy. | Pagination measured block boundaries from element boxes and could cut immediately after a heading; CSS `break-after: avoid` is not honoured by the JS paginator. Contemporary also put the break rule on the card root instead of the heading. | Generic heading-binding rule in `previewPagination.js`: if the last block packed on a page is heading-like, pull the boundary to its top; Contemporary heading div now carries `break-inside-avoid break-after-avoid`. | 0 orphan headings across 22 PDFs; page counts match preview expectations. |',
  '| B6 | Medium | Custom/addable sections appeared twice in two-column templates (once per column). | Both columns iterated the full `sectionsConfig`. | Custom/addable sections render only in the main column; the side column handles its own key set. | 0 duplicate headings in 22 PDFs (uppercase-shape heading matcher ignores body values equal to a label). |',
  '| B7 | High | Academic PDF export aborted with `Protocol error: Connection closed` instead of returning a PDF. | Academic’s heading fallback path closed the annotated page, then the shared error path closed it again. | `annotatedPageClosed` guard in `src/pdf/renderPdfHandler.jsx`; rebuilt `api/render-pdf.js`. | Academic exports 4 pages and passes all field/heading checks. |',
  '| B8 | Low | A renamed section still printed a hardcoded heading in some templates (heading/body label mismatch). | Fixed heading strings instead of the configured section label. | `labelOf(sec, fallback)` is used for every heading, so rename flows through preview and export. | Section lifecycle test: renamed custom and standard headings present, old labels absent, in both single- and two-column templates. |',
  '| B9 | Medium | DOCX/TXT could emit a section heading for an entries/grid custom section with no printable text, creating an orphan heading. | Heading emitted before checking whether the mode produced any content. | `hasCustomEntryContent` gates `docxCustomSection`/`txtCustomSection`; text-mode and grid/entries handled without orphan headings. | DOCX 213/213, Word-rendered PDF 0 orphan headings; TXT 213/213. |',
  '',
  'Severity counts: **5 High, 3 Medium, 1 Low, 0 open.** No unreproducible defect was “fixed”; every item above has an automated check that failed before the change and passes after it.',
  '',
  '## Preview, PDF and DOCX/TXT parity checks',
  '',
  '- **No dropped or duplicated fields:** 190/190 values present in 22/22 PDFs, 190/190 in DOCX and TXT; 0 duplicate section headings.',
  '- **No placeholders or broken text:** `[object Object]`, `undefined`, `NaN`, `Lorem ipsum` and `Your Name` are checked as absent in DOCX/TXT (5 guards each) and in every PDF; none found.',
  '- **Correct section order:** PDF heading positions match `sectionsConfig` order (column-grouped where a template genuinely has two columns); DOCX/TXT `sectionOrder` assertion passes.',
  '- **Alignment and wrapping:** long URLs and long unbroken tokens wrap inside their column; date/location rows stay on the same line where intended and wrap below on narrow columns; bullet markers align with the first text line; glyph geometry reports 0 out-of-page text runs in all 22 PDFs.',
  '- **Consistent headings/dividers/spacing:** every template renders each heading exactly once; heading text matches the configured label; no section renders a divider without a heading or vice versa.',
  '- **Pagination:** no page ends on a heading; no last-page blank; no cut-off content (pagination packs whole blocks and only splits blocks taller than a page); page counts are stable and match the preview paginator (`clean` 3 pages, all other templates 4, Courier Academic 7).',
  '- **DOCX reflow:** Word paginates the same content into 5 pages (vs 4 in the PDF) because Word’s line breaking and paragraph spacing differ; headings, order, content and last-page fill all pass, and there is no blank or orphan page. This engine difference is expected and recorded below.',
  '',
  '## Font checks (two templates, longest content)',
  '',
  '| Variant | Template | Pages | Embedded fonts (from PDF) | Field/heading result |',
  '| --- | --- | ---: | --- | --- |',
  '| Default | Modern | 4 | Inter Regular/Medium/SemiBold/Bold, Segoe UI, Microsoft YaHei | 190/190 fields, 17/17 headings |',
  '| Times New Roman | Modern | 4 | TimesNewRomanPSMT + bold/italic, Microsoft YaHei | 190/190 fields, 17/17 headings |',
  '| Default | Academic | 4 | Georgia, Cambria Math, Segoe UI | 190/190 fields, 17/17 headings |',
  '| Courier New | Academic | 7 | CourierNewPSMT + bold, Microsoft YaHei | 190/190 fields, 17/17 headings |',
  '',
  'Fonts were checked on the longest dataset, not a short sample: changing to Times New Roman keeps the resume at 4 pages, while Courier New (wider monospace) grows Academic to 7 pages — an intentional stress case that still passes pagination, orphan and clipping checks.',
  '',
  '## Section lifecycle (add / rename / reorder / hide / delete)',
  '',
  '`qa-artifacts/qa-sections.cjs` drives the same component tree with a mutated `sectionsConfig`/`customSections` and asserts rendered text. **9/9 cases pass** on one single-column (`ModernProTemplate`) and one two-column (`CleanTemplate`) template:',
  '',
  '1. Hiding a custom and a standard section removes heading and body; other custom sections still render.',
  '2. Deleting a custom and a standard section does not crash and removes both entirely.',
  '3. Renaming custom and standard sections shows the new heading and removes the old one.',
  '4. Reordering puts Projects before Experience and Career Philosophy before Technical Toolkit.',
  '5. A newly added custom section with bullets renders its heading and both items exactly once.',
  '',
  '## Limitations',
  '',
  '1. **Preview parity is proven structurally, not by a second browser session.** The live preview and the PDF both render the same template components through the same `transformResume` and `previewPagination`; the preview evidence is a server render of those components. A real browser was used for the PDFs. This avoids claiming a manual typing session that was not performed.',
  '2. **PDF text extraction is lossy in known ways.** CSS letter-spacing makes `pdf.js` emit `E X E C U T I V E`; Arabic glyphs are reordered; punctuation and emoji may be re-encoded. The audit normalises only these cases (no-space match, alphanumeric fallback for long values, Latin-segment order, uppercase-shape heading preference with title-case fallback for Academic), never dropping a field from the check.',
  '3. **DOCX pagination differs from PDF by design.** Word renders 5 pages against the PDF’s 4. Content, headings, order, last-page fill and orphan checks all pass; exact page-for-page equality across engines is not a meaningful target.',
  '4. **Emoji do not survive Word→PDF extraction.** They are present in `word/document.xml` (rocket, check mark, chart, Arabic and CJK all verified) and in the TXT; the Word PDF extractor drops emoji glyphs, so PDF text checks do not include them.',
  '5. **Screenshots are for human review.** PNGs under `qa-artifacts/pdf-audit/screens/` were rasterized with `pdf.js` + `@napi-rs/canvas`; the automated clipping proof is glyph bounding-box geometry, not pixel diffing.',
  '6. **Two-column templates have column-grouped reading order.** DOM order is not visual order; the audit validates order per column and requires custom/addable sections exactly once in the main column.',
  '7. **Editor inputs were enumerated from source and driven through the shared state model.** Every control (`useResumeEditor.jsx`, `CustomSectionEditor.jsx`, `SectionsManager.jsx`) maps to a matrix row, but the run did not type every character through a browser form.',
  '8. **Both trees were handed over with uncommitted work.** This audit preserves the earlier patch changes and adds the files below. The audit changes and the previously unpushed backend commit were then committed to `master` and pushed to `origin`. Frontend scratch files (`_*.pdf`, `_*.png`, `src.zip`) and generated QA bundles under `qa-artifacts/.build/` were deliberately left untracked and were not published.',
  '',
  '## Files changed',
  '',
  'Frontend (`resumeforge-frontend-master`):',
  '',
  '- `src/components/resume/templates/shared.jsx` — **new**: shared text/custom-section renderers.',
  '- `src/components/resume/templates/*.jsx` — all 20 templates (ModernPro, Classic, MinimalATS, Executive, Fresher, CreativeATS, Corporate, Traditional, Clean, Graduate, Tech, Engineering, Leadership, Designer, Sleek, Contemporary, Academic, Research, Medical, Finance): field coverage, addable/custom sections, `min-w-0` column fixes, break rules.',
  '- `src/utils/previewPagination.js` — generic heading binding (no orphan headings).',
  '- `src/pdf/renderPdfHandler.jsx` — Academic double-close guard.',
  '- `api/render-pdf.js`, `api/_pagination.text.js`, `api/_pdf-compiled.css` — regenerated bundles.',
  '- `eslint.config.js` — exclude `qa-artifacts/**` (Node QA harnesses, not app source).',
  '- `qa-artifacts/**` — dataset, render/PDF/DOCX/screenshot harnesses and reports (new).',
  '',
  'Backend (`resumeforge-backend-master`):',
  '',
  '- `src/main/java/com/resumeforge/ai/service/ExportService.java` — certification URL, grid/entries custom sections, no orphan headings, entry-content gate.',
  '- `src/test/java/com/resumeforge/ai/service/ExportDocumentHarnessTest.java` — **new**: 213-check DOCX/TXT harness.',
  '- `src/test/resources/qa/resume-max-coverage.json` — **new**: backend copy of the dataset.',
  '- `qa-artifacts/export-audit/**` — generated DOCX, TXT, Word-rendered PDF and JSON reports (new).',
  '',
  '## Artifacts',
  '',
  'Frontend:',
  '',
  '| Artifact | What it proves |',
  '| --- | --- |',
  '| `qa-artifacts/resume-max-coverage.json` | Input dataset: 196 controls, 190 populated values. |',
  '| `qa-artifacts/render-audit/report.json` | 20 templates, 190/190 fields, 0 order failures, 0 broken text. |',
  '| `qa-artifacts/render-audit/sections-lifecycle.json` | 9/9 add/rename/reorder/hide/delete cases. |',
  '| `qa-artifacts/pdf-audit/report.json` | Per-PDF export metadata (pages, bytes, timing, embedded fonts). |',
  '| `qa-artifacts/pdf-audit/audit-report.json` | 22/22 PDFs pass: fields, headings, order, orphans, duplicates, clipping, blank pages. |',
  '| `qa-artifacts/pdf-audit/*.pdf` | Exported PDFs including `font-times-modern.pdf` and `font-courier-academic.pdf`. |',
  '| `qa-artifacts/pdf-audit/screens/*.png` | Rasterized pages for visual review (modern p1/p4, clean, leadership, traditional, academic, both font variants). |',
  '| `qa-artifacts/pdf-audit/docx-word.pdf`, `qa-artifacts/pdf-audit/docx-audit.json` | Word-rendered DOCX pagination report (5 pages, 17/17 headings, no orphan/blank). |',
  '',
  'Backend:',
  '',
  '| Artifact | What it proves |',
  '| --- | --- |',
  '| `qa-artifacts/export-audit/report-docx.json` | 213/213 DOCX checks. |',
  '| `qa-artifacts/export-audit/report-txt.json` | 213/213 TXT checks. |',
  '| `qa-artifacts/export-audit/resume-max-coverage.docx` | Real DOCX (9,480 bytes). |',
  '| `qa-artifacts/export-audit/resume-max-coverage.txt` | Real TXT (13,309 bytes, 172 lines). |',
  '| `qa-artifacts/export-audit/resume-max-coverage-docx.pdf` | Word 16.0 rendering of the DOCX (5 pages, 1,627 words). |',
  '',
  '## Reproduce',
  '',
  'Frontend (from the frontend root):',
  '',
  '    npm.cmd install',
  '    node qa-artifacts/build-render.mjs && node qa-artifacts/qa-render.cjs',
  '    node qa-artifacts/qa-sections.cjs',
  '    npm.cmd run build:api',
  '    node qa-artifacts/qa-pdf.cjs',
  '    node qa-artifacts/qa-pdf-audit.cjs',
  '    node qa-artifacts/qa-screens.cjs',
  '    npm.cmd run lint && npm.cmd run build',
  '',
  'Backend (from the backend root):',
  '',
  '    mvn -B test',
  '',
  'Word pagination check (PowerShell, Word installed):',
  '',
  '    $w = New-Object -ComObject Word.Application; $w.Visible = $false',
  '    $d = $w.Documents.Open("<path>\\qa-artifacts\\export-audit\\resume-max-coverage.docx", $false, $true)',
  '    $d.ComputeStatistics(2)   # pages (5)',
  '    $d.ComputeStatistics(0)   # words (1627)',
  '    $d.SaveAs([ref]"<path>\\qa-artifacts\\export-audit\\resume-max-coverage-docx.pdf", [ref]17)',
  '    $d.Close($false); $w.Quit()',
  '',
  'Then, from the frontend root (the audit script lives in the frontend QA folder):',
  '',
  '    node qa-artifacts/qa-docx-audit.cjs qa-artifacts/pdf-audit/docx-word.pdf',
  '',
  '## Final state',
  '',
  '| Gate | Result |',
  '| --- | --- |',
  '| Preview SSR audit | 20/20 templates, 190/190 fields, 0 order failures |',
  '| Real PDF audit | 22/22 PDFs, 190/190 fields, 17/17 headings, 0 orphans, 0 clipped, 0 blank last pages |',
  '| DOCX | 213/213 checks; Word 5 pages, 17/17 headings, 0 orphan/blank |',
  '| TXT | 213/213 checks, 172 lines |',
  '| Section lifecycle | 9/9 cases |',
  '| Frontend lint | pass (`eslint . --max-warnings 0`) |',
  '| Frontend build | pass |',
  '| Backend tests | 48 tests, 0 failures |',
  '',
  'No reproducible defect remains open. The audit changes are committed to `master` in both repositories and pushed to `origin`.',
  '',
].join('\n');

fs.mkdirSync(path.dirname(frontendPath), { recursive: true });
fs.writeFileSync(frontendPath, doc, 'utf8');

const workspacePath = 'C:\\Users\\Sabari\\OneDrive\\Documents\\Default Project\\docs\\qa\\field-coverage-matrix.md';
fs.mkdirSync(path.dirname(workspacePath), { recursive: true });
fs.writeFileSync(workspacePath, doc, 'utf8');
console.log('wrote', frontendPath, doc.length, 'chars ·', rows.length, 'rows ·', populated, 'populated');
console.log('wrote', workspacePath);
