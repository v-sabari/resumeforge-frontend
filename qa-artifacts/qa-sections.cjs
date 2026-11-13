/* eslint-disable no-console */
/**
 * qa-sections.cjs — lifecycle proof for the section repeater: a custom section
 * that is added, renamed, reordered, hidden and deleted must be rendered
 * exactly the number of times a reader would expect (0 or 1) by the same
 * template components the live preview and the PDF handler use.
 *
 * Output: qa-artifacts/render-audit/sections-lifecycle.json
 */
const fs = require('node:fs');
const path = require('node:path');

const dataset = JSON.parse(fs.readFileSync(path.join(__dirname, 'resume-max-coverage.json'), 'utf8'));
const { render } = require('./.build/render.cjs');

const TEMPLATES = ['ModernProTemplate', 'CleanTemplate'];
const results = [];

const clone = (value) => JSON.parse(JSON.stringify(value));
const textOf = (html) => html.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/\s+/g, ' ').trim();
const count = (haystack, needle) => haystack.split(needle).length - 1;

function config(extra) {
  const base = clone(dataset);
  return Object.assign(base, extra);
}

function check(name, template, data, assertions) {
  let html = '';
  let error = null;
  try {
    html = render(template, data, data.sectionsConfig);
  } catch (err) {
    error = err.message;
  }
  const text = textOf(html);
  const checks = assertions.map(([label, passed]) => ({ label, passed: Boolean(passed) }));
  results.push({
    name,
    template,
    rendered: Boolean(html),
    error,
    checks,
    ok: !error && checks.every((c) => c.passed),
  });
}

// 1. HIDE a custom section and a standard section.
{
  const data = clone(dataset);
  data.sectionsConfig = data.sectionsConfig.map((s) => (s.id === 'custom-text' || s.key === 'interests'
    ? { ...s, visible: false } : s));
  for (const template of TEMPLATES) {
    const text = textOf(render(template, data, data.sectionsConfig));
    check('hidden-custom-and-standard', template, data, [
      ['hidden custom heading absent', !text.includes('Career Philosophy')],
      ['hidden custom body absent', !text.includes('reliability is a product feature')],
      ['hidden standard heading absent', !text.includes('Interests')],
      ['visible custom section still rendered', text.includes('Technical Toolkit')],
    ]);
  }
}

// 2. DELETE a custom section (and a whole standard section).
{
  const data = clone(dataset);
  data.sectionsConfig = data.sectionsConfig.filter((s) => s.id !== 'custom-bullets' && s.key !== 'languages');
  for (const template of TEMPLATES) {
    const text = textOf(render(template, data, data.sectionsConfig));
    check('deleted-custom-and-standard', template, data, [
      ['deleted custom heading absent', !text.includes('Community Involvement')],
      ['deleted standard heading absent', !text.includes('LANGUAGES')],
      ['remaining custom section present', text.includes('Teaching & Advisory')],
      ['remaining standard section present', text.includes('EXPERIENCE') || text.includes('Experience')],
    ]);
  }
}

// 3. RENAME a custom section and a standard section.
{
  const data = clone(dataset);
  data.sectionsConfig = data.sectionsConfig.map((s) => {
    if (s.id === 'custom-grid') return { ...s, label: 'Platform & Tooling Stack' };
    if (s.key === 'summary') return { ...s, label: 'Career Snapshot' };
    return s;
  });
  for (const template of TEMPLATES) {
    const text = textOf(render(template, data, data.sectionsConfig));
    check('renamed-custom-and-standard', template, data, [
      ['renamed custom heading present', text.includes('Platform & Tooling Stack')],
      ['old custom heading absent', !text.includes('Technical Toolkit')],
      ['renamed standard heading present', text.includes('Career Snapshot')],
      ['old standard heading absent', !text.includes('Executive Profile')],
    ]);
  }
}

// 4. REORDER: projects before experience, custom-text before custom-grid.
{
  const data = clone(dataset);
  const cfg = clone(dataset.sectionsConfig);
  const move = (id, beforeId) => {
    const from = cfg.findIndex((s) => s.id === id || s.key === id);
    const [moved] = cfg.splice(from, 1);
    const to = cfg.findIndex((s) => s.id === beforeId || s.key === beforeId);
    cfg.splice(to, 0, moved);
  };
  move('projects', 'experience');
  move('custom-text', 'custom-grid');
  data.sectionsConfig = cfg;
  const text = textOf(render('ModernProTemplate', data, cfg)).toLowerCase();
  check('reordered-sections', 'ModernProTemplate', data, [
    ['projects heading before experience heading', text.indexOf('selected projects') >= 0
      && text.indexOf('selected projects') < text.indexOf('professional experience')],
    ['custom text before custom grid', text.indexOf('career philosophy') >= 0
      && text.indexOf('career philosophy') < text.indexOf('technical toolkit')],
    ['all four headings present', ['selected projects', 'professional experience', 'career philosophy', 'technical toolkit']
      .every((h) => text.includes(h))],
  ]);
}

// 5. ADD a brand-new custom section with bullets; render exactly once.
{
  const data = clone(dataset);
  data.customSections = {
    ...data.customSections,
    'custom-speaking': { mode: 'bullets', items: ['Keynote: Reliable by Default', 'Panel: SLOs in Practice'] },
  };
  data.sectionsConfig = [...data.sectionsConfig, {
    id: 'custom-speaking', type: 'custom', label: 'Speaking Engagements', visible: true, order: data.sectionsConfig.length,
  }];
  for (const template of TEMPLATES) {
    const text = textOf(render(template, data, data.sectionsConfig));
    check('added-custom-section', template, data, [
      ['new heading present', text.includes('Speaking Engagements')],
      ['first item present once', count(text, 'Keynote: Reliable by Default') === 1],
      ['second item present once', count(text, 'Panel: SLOs in Practice') === 1],
      ['heading present once', count(text.toUpperCase(), 'SPEAKING ENGAGEMENTS') === 1],
    ]);
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  dataset: 'resume-max-coverage.json',
  cases: results,
  passed: results.filter((r) => r.ok).length,
  failed: results.filter((r) => !r.ok).length,
};
const out = path.join(__dirname, 'render-audit', 'sections-lifecycle.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(report, null, 2), 'utf8');

for (const r of results) {
  console.log(`${r.name.padEnd(30)} ${r.template.padEnd(8)} ${r.ok ? 'PASS' : 'FAIL'}${r.error ? `  error=${r.error}` : ''}`);
  for (const c of r.checks) if (!c.passed) console.log(`  FAIL: ${c.label}`);
}
console.log(`\ncases: ${report.passed}/${results.length} pass`);
process.exit(report.failed ? 1 : 0);
