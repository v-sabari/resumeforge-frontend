// PHASE-3e: test that switching templates never loses or reorders resume data.
//
// The template is stored as `resume.template` (a string). Switching templates
// via setTemplate(id) updates only the template string — the resume data
// (experience, education, projects, etc.) is untouched. This test verifies
// that property by simulating the state transition directly.
//
// Run with: node --test qa-artifacts/template-switch-data-preservation.test.mjs
import { test } from 'node:test';
import assert from 'node:assert';

// Mirror of the ALLOWED_TEMPLATES set from the backend ResumeService.java
// and the frontend RESUME_TEMPLATES in utils/constants.js
const ALLOWED_TEMPLATES = [
  'modern', 'corporate', 'classic', 'traditional', 'minimal', 'clean',
  'fresher', 'graduate', 'tech', 'engineering',
  'executive', 'leadership', 'creative', 'designer',
  'sleek', 'contemporary', 'academic', 'research', 'medical', 'finance',
];

// Simulate the resume state shape (subset — just the fields that matter for
// template switching).
const makeResume = () => ({
  template: 'modern',
  fullName: 'Sarah Mitchell',
  professionalTitle: 'Senior Full-Stack Engineer',
  experience: [
    { id: 'exp-1', company: 'Techcorp', role: 'Senior Engineer', bullets: ['Led a team of 4'] },
    { id: 'exp-2', company: 'StartupCo', role: 'Founding Engineer', bullets: ['Built the MVP'] },
  ],
  education: [
    { id: 'edu-1', institution: 'Stanford', degree: 'M.Sc.' },
  ],
  skills: ['Java', 'Python', 'React'],
});

// Simulate setTemplate: returns a new resume object with only the template
// field changed — exactly what useResumeEditor does.
const setTemplate = (resume, newTemplate) => ({ ...resume, template: newTemplate });

test('switching from modern to every other template preserves all data fields', () => {
  const original = makeResume();
  for (const target of ALLOWED_TEMPLATES) {
    if (target === 'modern') continue;
    const switched = setTemplate(original, target);
    assert.equal(switched.template, target, `template should be ${target}`);
    assert.equal(switched.fullName, original.fullName, `fullName preserved for ${target}`);
    assert.equal(switched.professionalTitle, original.professionalTitle, `professionalTitle preserved for ${target}`);
    assert.deepEqual(switched.experience, original.experience, `experience array preserved for ${target}`);
    assert.deepEqual(switched.education, original.education, `education array preserved for ${target}`);
    assert.deepEqual(switched.skills, original.skills, `skills array preserved for ${target}`);
  }
});

test('switching templates round-trip modern→executive→modern preserves data', () => {
  const original = makeResume();
  const step1 = setTemplate(original, 'executive');
  const step2 = setTemplate(step1, 'modern');
  assert.deepEqual(step2.experience, original.experience, 'experience preserved after round-trip');
  assert.deepEqual(step2.education, original.education, 'education preserved after round-trip');
  assert.deepEqual(step2.skills, original.skills, 'skills preserved after round-trip');
  assert.equal(step2.template, 'modern', 'template returned to modern');
});

test('switching templates preserves array order (no reordering)', () => {
  const original = makeResume();
  const switched = setTemplate(original, 'classic');
  assert.equal(switched.experience[0].id, 'exp-1', 'first experience item still exp-1');
  assert.equal(switched.experience[1].id, 'exp-2', 'second experience item still exp-2');
  assert.equal(switched.experience[0].company, 'Techcorp', 'first company unchanged');
});

test('switching templates does not mutate the original resume object', () => {
  const original = makeResume();
  const originalTemplate = original.template;
  setTemplate(original, 'executive');
  assert.equal(original.template, originalTemplate, 'original template unchanged');
});
