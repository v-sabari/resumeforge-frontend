// P1-1 unit tests for resume field validators.
// Run: node --test scripts/test-resume-validation.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  normalizeUrl,
  validateField,
  validateResume,
  normalizeResumeUrls,
} from '../src/utils/resumeValidation.js';

// ── isValidEmail ──
test('isValidEmail: accepts standard addresses', () => {
  assert.equal(isValidEmail(''), true);        // empty = no error
  assert.equal(isValidEmail('a@b.co'), true);
  assert.equal(isValidEmail('user.name+tag@sub.domain.in'), true);
});
test('isValidEmail: rejects garbage', () => {
  assert.equal(isValidEmail('not-an-email'), false);
  assert.equal(isValidEmail('a@b'), false);
  assert.equal(isValidEmail('@b.co'), false);
});

// ── isValidPhone ──
test('isValidPhone: accepts 7-15 digits with separators', () => {
  assert.equal(isValidPhone(''), true);
  assert.equal(isValidPhone('+91 98765 43210'), true);
  assert.equal(isValidPhone('(415) 555-0132'), true);
  assert.equal(isValidPhone('1234567'), true);
});
test('isValidPhone: rejects too few/many digits and letters', () => {
  assert.equal(isValidPhone('abc123'), false);
  assert.equal(isValidPhone('123456'), false);          // 6 digits < 7
  assert.equal(isValidPhone('1234567890123456'), false); // 16 digits > 15
});

// ── isValidUrl ──
test('isValidUrl: accepts http(s) URLs with a domain', () => {
  assert.equal(isValidUrl(''), true);
  assert.equal(isValidUrl('https://linkedin.com/in/me'), true);
  assert.equal(isValidUrl('http://example.com'), true);
});
test('isValidUrl: rejects bare words and missing scheme', () => {
  assert.equal(isValidUrl('linkedin'), false);
  assert.equal(isValidUrl('linkedin.com/in/me'), false); // no scheme
  assert.equal(isValidUrl('ftp://example.com'), false);   // wrong scheme
});

// ── normalizeUrl ──
test('normalizeUrl: prepends https:// to bare domains', () => {
  assert.equal(normalizeUrl('linkedin.com/in/me'), 'https://linkedin.com/in/me');
  assert.equal(normalizeUrl('github.com/user'), 'https://github.com/user');
});
test('normalizeUrl: leaves existing scheme + trims whitespace', () => {
  assert.equal(normalizeUrl('  https://example.com  '), 'https://example.com');
  assert.equal(normalizeUrl('http://x.io'), 'http://x.io');
});
test('normalizeUrl: does not prepend to non-domain text', () => {
  assert.equal(normalizeUrl('linkedin'), 'linkedin'); // no dot → not a domain
  assert.equal(normalizeUrl(''), '');
});

// ── validateField ──
test('validateField: returns message for invalid, empty for valid', () => {
  assert.equal(validateField('email', 'bad'), 'Enter a valid email address.');
  assert.equal(validateField('email', 'a@b.co'), '');
  assert.equal(validateField('tel', 'abc'), 'Enter a valid phone (7-15 digits, +/spaces/dashes allowed).');
  assert.equal(validateField('url', 'linkedin'), 'Enter a valid URL (e.g. https://example.com).');
});

// ── validateResume ──
test('validateResume: clean resume has no errors', () => {
  const r = { email: 'a@b.co', phone: '+91 98765 43210',
    linkedin: 'https://linkedin.com/in/me', github: 'https://github.com/me',
    portfolio: 'https://me.dev', experience: [], education: [], projects: [], certifications: [] };
  const { errors, hasErrors } = validateResume(r);
  assert.equal(hasErrors, false);
  assert.deepEqual(errors, {});
});

test('validateResume: flags invalid contact fields', () => {
  const r = { email: 'not-an-email', phone: 'abc123', linkedin: 'linkedin',
    github: '', portfolio: '', experience: [], education: [], projects: [], certifications: [] };
  const { errors, hasErrors } = validateResume(r);
  assert.equal(hasErrors, true);
  assert.ok(errors.email);
  assert.ok(errors.phone);
  assert.ok(errors.linkedin);
});

test('validateResume: end date before start date is flagged', () => {
  const r = { email: '', phone: '', linkedin: '', github: '', portfolio: '',
    experience: [{ role: 'SWE', company: 'X', startDate: '2024-06', endDate: '2023-01' }],
    education: [], projects: [], certifications: [] };
  const { errors, hasErrors } = validateResume(r);
  assert.equal(hasErrors, true);
  assert.ok(errors['experience.0.endDate']);
});

test('validateResume: end=Present with no start is flagged', () => {
  const r = { email: '', phone: '', linkedin: '', github: '', portfolio: '',
    experience: [{ role: 'SWE', company: 'X', startDate: '', endDate: 'Present' }],
    education: [], projects: [], certifications: [] };
  const { errors, hasErrors } = validateResume(r);
  assert.equal(hasErrors, true);
  assert.ok(errors['experience.0.startDate']);
});

test('validateResume: empty arrays/strings produce no errors', () => {
  const r = { email: '', phone: '', linkedin: '', github: '', portfolio: '',
    experience: [], education: [], projects: [], certifications: [] };
  const { hasErrors } = validateResume(r);
  assert.equal(hasErrors, false);
});

// ── normalizeResumeUrls ──
test('normalizeResumeUrls: prepends https:// to all URL fields incl. nested', () => {
  const r = {
    email: '', phone: '',
    linkedin: 'linkedin.com/in/me', github: 'github.com/me', portfolio: 'me.dev',
    projects: [{ name: 'P', link: 'p.io', github: 'g.com' }],
    certifications: [{ name: 'C', credentialUrl: 'credly.com/x' }],
  };
  const n = normalizeResumeUrls(r);
  assert.equal(n.linkedin, 'https://linkedin.com/in/me');
  assert.equal(n.github, 'https://github.com/me');
  assert.equal(n.portfolio, 'https://me.dev');
  assert.equal(n.projects[0].link, 'https://p.io');
  assert.equal(n.projects[0].github, 'https://g.com');
  assert.equal(n.certifications[0].credentialUrl, 'https://credly.com/x');
  // original not mutated
  assert.equal(r.linkedin, 'linkedin.com/in/me');
});
