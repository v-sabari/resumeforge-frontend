const d = require('../resume-max-coverage.json');
const vals = [];
const add = (s, f, v) => {
  if (String(v || '').replace(/\s+/g, ' ').trim()) vals.push(`${s}:${f}`);
  else console.log('EMPTY', s, f);
};
for (const k of ['fullName', 'professionalTitle', 'email', 'phone', 'location', 'linkedin', 'github', 'portfolio']) add('basics', k, d[k]);
add('summary', 'summary', d.summary);
d.experience.forEach((e) => {
  for (const k of ['role', 'company', 'location', 'employmentType', 'summary']) add('experience', k, e[k]);
  add('experience', 'duration', `${e.startDate || ''} \u2013 ${e.endDate || 'Present'}`);
  e.bullets.forEach((b, j) => add('experience', `bullet${j}`, b));
});
d.projects.forEach((p) => {
  for (const k of ['name', 'role', 'techStack', 'description', 'link', 'github']) add('projects', k, p[k]);
  p.highlights.forEach((h, j) => add('projects', `highlight${j}`, h));
});
d.education.forEach((e) => {
  for (const k of ['institution', 'degree', 'field', 'grade', 'details']) add('education', k, e[k]);
  add('education', 'year', `${e.startDate || ''} \u2013 ${e.endDate || ''}`);
});
d.certifications.forEach((c) => ['name', 'issuer', 'year', 'credentialUrl'].forEach((k) => add('certifications', k, c[k])));
d.skills.forEach((s) => add('skills', 'skill', s));
d.achievements.forEach((a) => add('achievements', 'item', a));
d.languages.forEach((l) => add('languages', 'item', l));
const cs = d.customSections;
d.sectionsConfig.filter((s) => s.visible && s.key !== 'basics').forEach((s) => {
  const c = cs[s.id];
  if (!c) return;
  if (c.mode === 'grid') {
    c.columns.forEach((col) => {
      add(s.id, 'label', col.label);
      col.items.forEach((it) => add(s.id, 'item', it));
    });
  } else if (c.mode === 'entries') {
    c.entries.forEach((en) => {
      for (const k of ['title', 'subtitle', 'date', 'location']) add(s.id, k, en[k]);
      en.bullets.forEach((b) => add(s.id, 'bullet', b));
    });
  } else if (c.mode === 'bullets') {
    c.items.forEach((it) => add(s.id, 'item', it));
  } else {
    add(s.id, 'text', c.text);
  }
});
console.log('TOTAL', vals.length);
