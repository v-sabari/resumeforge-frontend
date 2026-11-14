/**
 * qa-artifacts/typography-logic.test.mjs
 *
 * Pure-logic regression suite for the resume typography model
 * (src/utils/resumeTypography.js). No DOM, no React, no jsdom — the module
 * under test is deliberately pure, and so is this suite.
 *
 * Run:  node --test qa-artifacts/typography-logic.test.mjs
 * (also wired into `npm run test:typography`).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  PT_PER_PX,
  pxToPt,
  ptToPx,
  BASE_FONT_SIZE_PX,
  BASE_FONT_SIZE_PT,
  DEFAULT_FONT_SIZE,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
  FONT_SIZE_STEP,
  RECOMMENDED_MIN_PT,
  COMFORT_MIN_PT,
  getFontSizeWarning,
  formatFontSizePt,
  DEFAULT_FONT_FAMILY,
  FONT_FAMILY_OPTIONS,
  FONT_FAMILY_IDS,
  FONT_FAMILY_ALIASES,
  normaliseFontFamily,
  getFontFamilyOption,
  getFontFamilyStack,
  getBundledFontFamily,
  getResumeTypographyCss,
  getResumeTypographyProps,
  getFontScale,
  normaliseFontSize,
  fontSizeFromStoredPx,
  fontSizeToStoredPx,
} from '../src/utils/resumeTypography.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const near = (a, b, eps = 1e-9) => Math.abs(a - b) <= eps;

/* ── px → pt conversion ─────────────────────────────────────────────────── */

test('pxToPt / ptToPx use the 96dpi CSS reference (1px = 0.75pt)', () => {
  assert.equal(PT_PER_PX, 0.75);
  assert.equal(pxToPt(10.5), 7.875);
  assert.equal(pxToPt(16), 12);
  assert.equal(pxToPt(0), 0);
  assert.equal(ptToPx(7.875), 10.5);
  assert.equal(ptToPx(12), 16);
  // Exact round-trip for the canonical sizes.
  for (const px of [8, 10.5, 13, 16]) assert.ok(near(ptToPx(pxToPt(px)), px));
});

test('BASE_FONT_SIZE is 10.5px === 7.875pt and DEFAULT is the historical size', () => {
  assert.equal(BASE_FONT_SIZE_PX, 10.5);
  assert.equal(BASE_FONT_SIZE_PT, 7.875);
  assert.equal(DEFAULT_FONT_SIZE, 7.875);
  assert.equal(DEFAULT_FONT_FAMILY, 'template');
});

test('persistence-boundary converters map px<->pt and fail safe on garbage', () => {
  assert.equal(fontSizeFromStoredPx(10.5), 7.875);
  assert.equal(fontSizeFromStoredPx(13), 9.75);
  assert.equal(fontSizeFromStoredPx('13'), 9.75);
  assert.equal(fontSizeFromStoredPx(null), DEFAULT_FONT_SIZE);
  assert.equal(fontSizeFromStoredPx(undefined), DEFAULT_FONT_SIZE);
  assert.equal(fontSizeFromStoredPx('nope'), DEFAULT_FONT_SIZE);

  assert.equal(fontSizeToStoredPx(7.875), 10.5);
  assert.equal(fontSizeToStoredPx(9), 12);
  assert.equal(fontSizeToStoredPx('9'), 12);
  assert.equal(fontSizeToStoredPx(null), BASE_FONT_SIZE_PX);
  assert.equal(fontSizeToStoredPx('nope'), BASE_FONT_SIZE_PX);

  // Round trip is identity for in-range stored values.
  for (const px of [8, 10.5, 13, 16]) {
    assert.ok(near(fontSizeToStoredPx(fontSizeFromStoredPx(px)), px));
  }
});

/* ── legacy migration renders identically ───────────────────────────────── */

test('a legacy 10.5px resume renders at scale 1 before AND after the px→pt migration', () => {
  // OLD model: the UI carried px and the base was 10.5px.
  const legacyScale = (px) => px / 10.5;
  // NEW model: the UI carries pt (converted at the read boundary) and the base
  // is 7.875pt. The scale must be bit-for-bit identical.
  const migratedScale = (px) => getFontScale(fontSizeFromStoredPx(px));

  assert.equal(legacyScale(10.5), 1);
  assert.equal(migratedScale(10.5), 1);

  for (const px of [8, 9, 10.5, 12, 13, 16]) {
    assert.ok(near(legacyScale(px), migratedScale(px)),
      `scale for stored ${px}px must be unchanged (old=${legacyScale(px)} new=${migratedScale(px)})`);
  }
});

test('the default wrapper is completely inert (no zoom, full width)', () => {
  const props = getResumeTypographyProps('template', fontSizeFromStoredPx(10.5));
  assert.equal(props.style.zoom, undefined, 'default must not apply a zoom');
  assert.equal(props.style.width, '100%');
  assert.equal(props.className, 'resume-typography');
  assert.equal(props['data-font-family'], 'template');
});

test('normaliseFontSize never clamps or rewrites an existing value', () => {
  // Below the slider floor / above the ceiling: preserved verbatim.
  assert.equal(normaliseFontSize(6), 6);
  assert.equal(normaliseFontSize(7.5), 7.5);
  assert.equal(normaliseFontSize(20), 20);
  assert.equal(normaliseFontSize('11.3'), 11.3);
  // Only non-finite input falls back to the default.
  assert.equal(normaliseFontSize(null), DEFAULT_FONT_SIZE);
  assert.equal(normaliseFontSize(undefined), DEFAULT_FONT_SIZE);
  assert.equal(normaliseFontSize('nope'), DEFAULT_FONT_SIZE);
  assert.equal(normaliseFontSize(NaN), DEFAULT_FONT_SIZE);
});

/* ── advisory warning thresholds ────────────────────────────────────────── */

test('warning thresholds: <9pt warns, 9–10pt hints, >=10pt is silent', () => {
  assert.equal(RECOMMENDED_MIN_PT, 9);
  assert.equal(COMFORT_MIN_PT, 10);

  // Below 9pt → warning (this includes the legacy 7.875pt default).
  for (const v of [7.5, 7.875, 8, 8.5, 8.99]) {
    const w = getFontSizeWarning(v);
    assert.equal(w && w.level, 'warn', `${v}pt should warn`);
    assert.match(w.message, /hard to read/i);
  }

  // 9–10pt → gentler hint.
  for (const v of [9, 9.25, 9.5, 9.75, 9.99]) {
    const w = getFontSizeWarning(v);
    assert.equal(w && w.level, 'hint', `${v}pt should hint`);
    assert.match(w.message, /10pt or larger/i);
  }

  // >=10pt → nothing.
  for (const v of [10, 10.5, 12, 16]) {
    assert.equal(getFontSizeWarning(v), null, `${v}pt should be silent`);
  }

  // String input and non-finite input.
  assert.equal(getFontSizeWarning('8.5').level, 'warn');
  assert.equal(getFontSizeWarning('10'), null);
  assert.equal(getFontSizeWarning(NaN), null);
  assert.equal(getFontSizeWarning(null), null);
});

test('formatFontSizePt always shows one decimal', () => {
  assert.equal(formatFontSizePt(7.875), '7.9 pt');
  assert.equal(formatFontSizePt(10), '10.0 pt');
  assert.equal(formatFontSizePt('9.5'), '9.5 pt');
});

/* ── removed / renamed family fallback ──────────────────────────────────── */

test('an unknown/removed family falls back to template and never throws', () => {
  for (const bad of ['comic-sans', 'Times New Roman; color: red', '', '   ', null, undefined, 42, {}, []]) {
    assert.equal(normaliseFontFamily(bad), DEFAULT_FONT_FAMILY,
      `normaliseFontFamily(${JSON.stringify(bad)}) must fall back to template`);
  }
  assert.equal(getFontFamilyOption('comic-sans').id, 'template');
  assert.equal(getFontFamilyStack('comic-sans'), null);
  assert.equal(getBundledFontFamily('comic-sans'), null);
  assert.equal(getResumeTypographyCss('comic-sans'), '');
});

test('every declared alias points at a still-supported family', () => {
  for (const [from, to] of Object.entries(FONT_FAMILY_ALIASES)) {
    assert.ok(FONT_FAMILY_IDS.includes(to),
      `alias '${from}' -> '${to}' must resolve to a supported family`);
    assert.equal(normaliseFontFamily(from), to);
    // An aliased family must still expose a usable stack (or template null).
    assert.doesNotThrow(() => getResumeTypographyCss(from));
  }
});

test('every offered family has a coherent stack + bundled mapping', () => {
  for (const opt of FONT_FAMILY_OPTIONS) {
    if (opt.id === 'template') {
      assert.equal(opt.stack, null);
      assert.equal(opt.bundled, null);
      assert.equal(getResumeTypographyCss('template'), '');
    } else {
      assert.equal(typeof opt.stack, 'string');
      assert.equal(typeof opt.bundled, 'string');
      const css = getResumeTypographyCss(opt.id);
      assert.ok(css.includes(`data-font-family="${opt.id}"`), 'scope must be family-specific');
      assert.ok(css.includes('!important'), 'family override must win over template utilities');
      assert.ok(css.includes(opt.stack), 'generated CSS must use the declared stack');
    }
  }
});

/* ── preview/PDF font bytes are identical (metric parity by construction) ─ */

test('the preview and PDF load byte-identical font faces for every family', async () => {
  const { getBundledPdfFontFaces } = await import('../src/fonts/pdfFonts.js');
  const { BUNDLED_FONT_MODULES } = await import('../src/fonts/index.js');

  const bundledFamilies = FONT_FAMILY_OPTIONS.map((o) => o.bundled).filter(Boolean);
  const uniqueFamilies = [...new Set(bundledFamilies)];
  assert.ok(uniqueFamilies.length > 0, 'at least one bundled family is expected');

  for (const family of uniqueFamilies) {
    // The preview lazy-loader must know this family.
    assert.ok(BUNDLED_FONT_MODULES[family], `preview loader is missing '${family}'`);
    // The PDF aggregator must expose the same faces.
    const pdfFaces = getBundledPdfFontFaces(family);
    assert.ok(pdfFaces.length >= 2, `${family} must embed regular + bold`);
    // Load the exact module the preview dynamic-imports and compare bytes.
    const mod = await BUNDLED_FONT_MODULES[family]();
    assert.equal(pdfFaces.length, mod.FACES.length,
      `${family}: preview and PDF must load the same number of faces`);
    for (let i = 0; i < mod.FACES.length; i++) {
      assert.equal(pdfFaces[i].weight, mod.FACES[i].weight,
        `${family}: face weight order must match`);
      assert.equal(pdfFaces[i].base64, mod.FACES[i].base64,
        `${family} weight ${mod.FACES[i].weight}: preview and PDF bytes must be identical`);
    }
    // Every face must be a plausible, non-trivial WOFF2 payload.
    for (const f of mod.FACES) {
      assert.ok(f.base64.length > 1000, `${family} ${f.weight} looks empty`);
    }
  }

  // `template` embeds nothing (it keeps the template's own stack).
  assert.deepEqual(getBundledPdfFontFaces(null), []);
  assert.deepEqual(getBundledPdfFontFaces('nope'), []);
});

test('bundled font modules exist on disk and stay under the 100KB budget', () => {
  const dir = path.join(root, 'src', 'fonts');
  const sizes = JSON.parse(fs.readFileSync(path.join(dir, 'sizes.json'), 'utf8'));
  assert.ok(sizes.length > 0);
  for (const fam of sizes) {
    const totalKB = Number(fam.totalKB);
    assert.ok(totalKB < 100, `${fam.family} is ${totalKB}KB — exceeds the 100KB budget`);
    // License file must be committed alongside.
    const lic = path.join(dir, 'licenses', `${fam.id}-OFL.txt`);
    assert.ok(fs.existsSync(lic), `missing OFL license for ${fam.family} at ${lic}`);
  }
});

/* ── slider constants ───────────────────────────────────────────────────── */

test('slider bounds and step are the agreed pt values', () => {
  assert.equal(MIN_FONT_SIZE, 7.5);
  assert.equal(MAX_FONT_SIZE, 9.75); // = 13px, the backend's live ceiling
  assert.equal(FONT_SIZE_STEP, 0.5);
  // The default sits on the slider.
  assert.ok(DEFAULT_FONT_SIZE >= MIN_FONT_SIZE && DEFAULT_FONT_SIZE <= MAX_FONT_SIZE);
});
