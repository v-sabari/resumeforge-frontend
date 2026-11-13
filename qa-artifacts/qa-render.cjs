/* eslint-disable no-console */
/**
 * qa-render.cjs â€” automated field-level render audit.
 *
 * Renders every one of the 20 resume templates through the SAME React
 * component the live preview and the PDF handler use (react-dom/server),
 * then asserts that every populated editor field appears in the rendered
 * markup. Evidence (HTML + extracted text + JSON report) is written under
 * qa-artifacts/render-audit/.
 *
 * Usage: node qa-artifacts/qa-render.cjs
 */
const fs = require('node:fs');
const path = require('node:path');

const here = __dirname;
const { render, transform, templates } = require(path.join(here, '.build', 'render.cjs'));

const TEMPLATE_ORDER = [
  'modern', 'classic', 'minimal', 'executive', 'fresher', 'creative',
  'corporate', 'traditional', 'clean', 'graduate', 'tech', 'engineering',
  'leadership', 'designer', 'sleek', 'contemporary', 'academic', 'research',
  'medical', 'finance',
];
const TEMPLATE_COMPONENT = {
  modern: 'ModernProTemplate', classic: 'ClassicTemplate', minimal: 'MinimalATSTemplate',
  executive: 'ExecutiveTemplate', fresher: 'FresherTemplate', creative: 'CreativeATSTemplate',
  corporate: 'CorporateTemplate', traditional: 'TraditionalTemplate', clean: 'CleanTemplate',
  graduate: 'GraduateTemplate', tech: 'TechTemplate', engineering: 'EngineeringTemplate',
  leadership: 'LeadershipTemplate', designer: 'DesignerTemplate', sleek: 'SleekTemplate',
  contemporary: 'ContemporaryTemplate', academic: 'AcademicTemplate', research: 'ResearchTemplate',
  medical: 'MedicalTemplate', finance: 'FinanceTemplate',
};

const OUT = path.join(here, 'render-audit');
const OUT_HTML = path.join(OUT, 'html');
const OUT_TXT = path.join(OUT, 'text');
fs.mkdirSync(OUT_HTML, { recursive: true });
fs.mkdirSync(OUT_TXT, { recursive: true });

const decode = (s) => s
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#x27;|&#39;/g, "'")
  .replace(/&#x2F;/g, '/')
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));

const htmlToText = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]*>/g, ' '))
  .replace(/\s+/g, ' ')
  .trim();

const shortUrl = (url) => String(url || '')
  .trim()
  .replace(/^https?:\/\//i, '')
  .replace(/^www\./i, '')
  .replace(/\/+$/, '');

const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim();

// â”€â”€â”€ expectation builder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Each expectation: { section, field, type, required, values, mode }
// mode 'all'  â†’ every alternative in `values` must appear (default)
// mode 'any'  â†’ at least one alternative must appear
// An alternative may be a plain string (whitespace-normalised substring check).
const expectations = [];
const add = (section, field, type, required, values, mode = 'all') => {
  const list = (Array.isArray(values) ? values : [values])
    .map(norm)
    .filter(Boolean);
  if (list.length) expectations.push({ section, field, type, required, values: list, mode });
};

const r = JSON.parse(fs.readFileSync(path.join(here, 'resume-max-coverage.json'), 'utf8'));

// basics
add('basics', 'fullName', 'text', true, r.fullName);
add('basics', 'professionalTitle', 'text', true, r.professionalTitle);
add('basics', 'email', 'email', true, r.email);
add('basics', 'phone', 'tel', true, r.phone);
add('basics', 'location', 'text', true, r.location);
add('basics', 'linkedin', 'url', true, [r.linkedin, shortUrl(r.linkedin)], 'any');
add('basics', 'github', 'url', true, [r.github, shortUrl(r.github)], 'any');
add('basics', 'portfolio', 'url', true, [r.portfolio, shortUrl(r.portfolio)], 'any');

add('summary', 'summary', 'textarea', true, r.summary);

r.skills.forEach((s, i) => add('skills', `skills[${i}]`, 'list-item', true, s));

r.experience.forEach((e, i) => {
  add('experience', `experience[${i}].role`, 'text', true, e.role);
  add('experience', `experience[${i}].company`, 'text', true, e.company);
  add('experience', `experience[${i}].location`, 'text', true, e.location);
  add('experience', `experience[${i}].employmentType`, 'select', true, e.employmentType);
  add('experience', `experience[${i}].duration`, 'date-range', true, `${e.startDate} – ${e.endDate}`);
  if (e.summary) add('experience', `experience[${i}].summary`, 'textarea', false, e.summary);
  e.bullets.forEach((b, j) => add('experience', `experience[${i}].bullets[${j}]`, 'list-item', true, b));
});

r.projects.forEach((p, i) => {
  add('projects', `projects[${i}].name`, 'text', true, p.name);
  add('projects', `projects[${i}].role`, 'text', false, p.role);
  if (p.link) add('projects', `projects[${i}].link`, 'url', false, [p.link, shortUrl(p.link)], 'any');
  if (p.github) add('projects', `projects[${i}].github`, 'url', false, [p.github, shortUrl(p.github)], 'any');
  add('projects', `projects[${i}].techStack`, 'text', false, p.techStack);
  add('projects', `projects[${i}].description`, 'textarea', false, p.description);
  p.highlights.forEach((h, j) => add('projects', `projects[${i}].highlights[${j}]`, 'list-item', false, h));
});

r.education.forEach((e, i) => {
  add('education', `education[${i}].institution`, 'text', true, e.institution);
  add('education', `education[${i}].degree`, 'text', true, e.degree);
  add('education', `education[${i}].field`, 'text', true, e.field);
  add('education', `education[${i}].year`, 'date-range', true, `${e.startDate} – ${e.endDate}`);
  if (e.grade) add('education', `education[${i}].grade`, 'text', false, e.grade);
  if (e.details) add('education', `education[${i}].details`, 'textarea', false, e.details);
});

r.certifications.forEach((c, i) => {
  add('certifications', `certifications[${i}].name`, 'text', true, c.name);
  add('certifications', `certifications[${i}].issuer`, 'text', true, c.issuer);
  add('certifications', `certifications[${i}].year`, 'text', true, c.year);
  if (c.credentialUrl) {
    add('certifications', `certifications[${i}].credentialUrl`, 'url', false,
      [c.credentialUrl, shortUrl(c.credentialUrl)], 'any');
  }
});

r.achievements.forEach((a, i) => add('achievements', `achievements[${i}]`, 'list-item', true, a));
r.languages.forEach((l, i) => add('languages', `languages[${i}]`, 'list-item', true, l));

// custom content keyed by section id
const addCustom = (sectionId, content) => {
  if (!content) return;
  if (content.mode === 'text') {
    add(sectionId, `${sectionId}.text`, 'textarea', true, content.text);
  } else if (content.mode === 'bullets') {
    (content.items || []).forEach((it, i) => add(sectionId, `${sectionId}.items[${i}]`, 'list-item', true, it));
  } else if (content.mode === 'grid') {
    (content.columns || []).forEach((col, i) => {
      add(sectionId, `${sectionId}.columns[${i}].label`, 'text', false, col.label);
      (col.items || []).forEach((it, j) => add(sectionId, `${sectionId}.columns[${i}].items[${j}]`, 'list-item', true, it));
    });
  } else if (content.mode === 'entries') {
    (content.entries || []).forEach((en, i) => {
      add(sectionId, `${sectionId}.entries[${i}].title`, 'text', true, en.title);
      add(sectionId, `${sectionId}.entries[${i}].subtitle`, 'text', false, en.subtitle);
      add(sectionId, `${sectionId}.entries[${i}].date`, 'text', false, en.date);
      add(sectionId, `${sectionId}.entries[${i}].location`, 'text', false, en.location);
      (en.bullets || []).forEach((b, j) => add(sectionId, `${sectionId}.entries[${i}].bullets[${j}]`, 'list-item', false, b));
    });
  }
};
Object.entries(r.customSections).forEach(([id, content]) => addCustom(id, content));

// section headings (configured labels must be honoured â€” this catches the
// "renamed label ignored" defect). Basics never renders a heading.
const visibleSections = (r.sectionsConfig || []).filter((s) => s.visible && s.key !== 'basics');
const headingExpectations = visibleSections.map((s) => ({ id: s.id, label: s.label }));

// Two-column templates deliberately read column-by-column: the sidebar is
// rendered before/after the main column, so a single global left-to-right
// order check would report every headline as "out of order". These groups
// describe the real visual reading order of each column; within a column the
// sections must still follow sectionsConfig order.
const COLUMN_GROUPS = {
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

// â”€â”€â”€ run â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BROKEN_TEXT = ['[object Object]', 'undefined', 'NaN', 'Lorem ipsum', 'Your Name'];

const report = {
  generatedAt: new Date().toISOString(),
  source: 'resume-max-coverage.json',
  fieldCount: expectations.length,
  templates: {},
  summary: {},
};

const fieldStats = new Map();
for (const e of expectations) fieldStats.set(e.field, { section: e.section, field: e.field, type: e.type, required: e.required, passed: 0, failed: 0, failedTemplates: [] });

for (const key of TEMPLATE_ORDER) {
  const component = TEMPLATE_COMPONENT[key];
  const html = render(component, r);
  const text = htmlToText(html);
  const lower = text.toLowerCase();

  const fieldResults = expectations.map((e) => {
    const hits = e.values.filter((v) => text.includes(v));
    const ok = e.mode === 'any' ? hits.length > 0 : hits.length === e.values.length;
    const st = fieldStats.get(e.field);
    if (ok) st.passed += 1;
    else {
      st.failed += 1;
      st.failedTemplates.push(key);
    }
    return { section: e.section, field: e.field, type: e.type, required: e.required, ok, missing: ok ? [] : e.values.filter((v) => !text.includes(v)) };
  });

  const headingResults = headingExpectations.map((h) => {
    const ok = text.includes(norm(h.label));
    return { id: h.id, label: h.label, ok };
  });

  const broken = BROKEN_TEXT.filter((b) => text.includes(b));
  const headingPositions = headingExpectations
    .map((h) => ({ id: h.id, pos: text.indexOf(norm(h.label)) }))
    .filter((h) => h.pos >= 0);
  const posById = new Map(headingPositions.map((h) => [h.id, h.pos]));
  const groups = COLUMN_GROUPS[key];
  const orderOk = groups
    ? groups.every((group) => {
        const ordered = group
          .map((id) => posById.get(id))
          .filter((pos) => pos !== undefined);
        return ordered.every((pos, i) => i === 0 || pos > ordered[i - 1]);
      })
    : headingPositions.every((h, i) => i === 0 || h.pos > headingPositions[i - 1].pos);

  const failed = fieldResults.filter((f) => !f.ok);
  const missingHeadings = headingResults.filter((h) => !h.ok);

  report.templates[key] = {
    component,
    fieldsTotal: fieldResults.length,
    fieldsPassed: fieldResults.length - failed.length,
    fieldsFailed: failed.length,
    failedFields: failed,
    headingsTotal: headingResults.length,
    headingsPassed: headingResults.length - missingHeadings.length,
    missingHeadings,
    orderOk,
    headingPositions,
    brokenText: broken,
  };

  fs.writeFileSync(path.join(OUT_HTML, `${key}.html`), html, 'utf8');
  fs.writeFileSync(path.join(OUT_TXT, `${key}.txt`), text, 'utf8');
}

const fields = [...fieldStats.values()].map((s) => ({
  ...s,
  status: s.failed === 0 ? 'PASS' : s.passed === 0 ? 'FAIL' : 'PARTIAL',
}));

report.summary = {
  templates: TEMPLATE_ORDER.length,
  fieldsTotal: expectations.length,
  fieldsPassedAllTemplates: fields.filter((f) => f.status === 'PASS').length,
  fieldsFailedAllTemplates: fields.filter((f) => f.status === 'FAIL').length,
  fieldsPartial: fields.filter((f) => f.status === 'PARTIAL').length,
  templatesFullyGreen: Object.values(report.templates).filter((t) => t.fieldsFailed === 0 && t.missingHeadings.length === 0 && t.orderOk && t.brokenText.length === 0).length,
  brokenTextTemplates: Object.entries(report.templates).filter(([, t]) => t.brokenText.length).map(([k]) => k),
  orderFailures: Object.entries(report.templates).filter(([, t]) => !t.orderOk).map(([k]) => k),
};
report.fields = fields;

fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2), 'utf8');

// console summary
console.log(`Templates: ${report.summary.templates}`);
console.log(`Fields: ${report.summary.fieldsTotal} (${report.summary.fieldsPassedAllTemplates} pass in all, ${report.summary.fieldsPartial} partial, ${report.summary.fieldsFailedAllTemplates} fail in all)`);
console.log(`Templates fully green: ${report.summary.templatesFullyGreen}/${report.summary.templates}`);
console.log(`Order failures: ${report.summary.orderFailures.join(', ') || 'none'}`);
console.log(`Broken text: ${report.summary.brokenTextTemplates.join(', ') || 'none'}`);
console.log('\nTop failing fields:');
fields
  .filter((f) => f.status !== 'PASS')
  .sort((a, b) => b.failed - a.failed)
  .slice(0, 25)
  .forEach((f) => console.log(`  ${f.status.padEnd(7)} ${f.field.padEnd(48)} failed in ${f.failed}/20`));
