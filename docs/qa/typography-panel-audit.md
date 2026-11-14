# Typography panel (3d) — audit

**Scope:** the Builder **Typography** panel (font family + base size) and
everything it drives — the live preview, the persisted value, the exported
**PDF**/**DOCX**/**TXT**, and the backend bound. Covers the unit switch to
**pt**, the bundled metric-compatible fonts, accessibility/safety, the widened
backend range, and the tests.

**Status:** implementation complete; frontend and backend verified independently.
Live save/reload + DB round-trip and logged-in browser E2E remain **BLOCKED**
in this environment (see [Blocked](#blocked)). The one deferred item is raising
the slider maximum to 12pt, which is gated on the V28 backend being live (see
[Known limitations](#known-limitations)).

Repos:
- frontend `resumeforge-frontend-master`, branch `feat/typography-panel-pt-fonts`
- backend  `resumeforge-backend-master`,  branch `feat/typography-font-size-range`

---

## 1. Root cause / starting point (file:line)

The typography control already existed (V27, px). This task changed three
things that were wrong or missing:

1. **The size control showed px.** `src/components/builder/TemplatesPanel.jsx`
   labelled the value as px and the slider bounds were `8–13`. The product wants
   **pt**, and the *default* must not move.
2. **Preview and PDF could disagree on fonts.** Each template sizes text with
   absolute `text-[Npx]` utilities and the family dropdown fell back to *system*
   fonts. The preview resolved e.g. "Georgia" to the user's installed Georgia,
   but the headless PDF renderer ships **no system fonts** — a different
   fallback, different glyph metrics, different line wraps, different page
   count. Root cause: the two surfaces did not share font bytes.
3. **The slider had no accessible value text and no readability guidance.**
   `src/components/builder/TemplatesPanel.jsx` exposed a bare range input.

The earlier preview-scaling defect (the sheet overflowing its column) was
already fixed and is re-verified here (see §6).

---

## 2. Units model — stored px, displayed pt

Storage stays **px** (the backend CHECK/DTO/entity and the DB column all speak
px). **pt is a UI/display layer only.** Conversion happens at the single
persistence boundary so no stored value is ever rewritten and there is no unit
marker or ambiguity.

`src/utils/resumeTypography.js`:

| Symbol | Value | Meaning |
| --- | --- | --- |
| `PT_PER_PX` / `pxToPt` / `ptToPx` | `0.75` | 1px = 0.75pt at the 96dpi CSS reference |
| `BASE_FONT_SIZE_PX` | `10.5` | the historical base that maps to **scale 1** |
| `BASE_FONT_SIZE_PT` | `7.875` | the same base in pt (`10.5 × 0.75`) |
| `DEFAULT_FONT_SIZE` | `7.875` (pt) | **unchanged** — equals legacy 10.5px |
| `MIN_FONT_SIZE` | `7.5` (pt) | slider min |
| `MAX_FONT_SIZE` | `9.75` (pt) | slider max = **13px**, the *live* backend ceiling |
| `FONT_SIZE_STEP` | `0.5` (pt) | slider step |

- **Read:** `fontSizeFromStoredPx(px) = pxToPt(px)` (`resumeTypography.js:167`).
- **Write:** `fontSizeToStoredPx(pt) = ptToPx(pt)` (`resumeTypography.js:173`).
- Both call sites are in `src/services/resumeService.js` (read on load, write on
  save) — the *only* places a size crosses the boundary.
- `normaliseFontSize` (`resumeTypography.js:156`) deliberately **does not clamp
  and does not snap to the step**. An existing out-of-range value (e.g. an old
  8px = 6pt) is preserved; only the slider *thumb* is pinned into range in the
  panel, and the badge always shows the true value.
- `getFontScale` = `size / BASE_FONT_SIZE_PT`, so the default is scale **1** and
  the wrapper is completely inert at the default (zero visual change).

`MAX_FONT_SIZE` is a **single constant**, intentionally left at the old ceiling
(9.75pt = 13px) until the V28 backend is confirmed live. Raising it to 12pt is a
one-line follow-up (see §9).

---

## 3. Bundled metric-compatible fonts

To make **preview == PDF** on wraps and page count, the same font **bytes** are
used on both surfaces. Each offered family leads its CSS stack with a bundled
OFL font; the system families remain as fallbacks.

| Dropdown label (unchanged) | Bundled OFL family | CSS stack lead | Bundle size (400+700, latin WOFF2) |
| --- | --- | --- | --- |
| Template default | *(none)* | — keeps each template's own typeface | 0 KB |
| Times New Roman | **Tinos** | `'Tinos', 'Times New Roman', …` | 35.9 KB |
| Georgia | **Gelasio** | `'Gelasio', Georgia, …` | 68.0 KB |
| Garamond | **EB Garamond** | `'EB Garamond', Garamond, …` | 86.6 KB |
| Arial | **Arimo** | `'Arimo', Arial, Helvetica, …` | 39.3 KB |
| Helvetica | **Arimo** | `'Arimo', Helvetica, …` | 39.3 KB (shared) |
| Calibri | **Carlito** | `'Carlito', Calibri, …` | 60.2 KB |
| Cambria | **Caladea** | `'Caladea', Cambria, …` | 40.9 KB |
| Courier New | **Cousine** | `'Cousine', 'Courier New', …` | 30.0 KB |

Every single family is **well under the ~100KB budget** (largest: EB Garamond
86.6 KB); nothing needed to be flagged before adding.

- **Source / reproducibility:** `scripts/fetch-bundled-fonts.mjs` (Google Fonts
  `css2` API, **latin** subset, WOFF2). Re-runnable; writes
  `src/fonts/<family>.js` (base64 modules) + `src/fonts/sizes.json`.
- **Weights:** 400 + 700 only. Italics are not bundled (documented limitation).
- **Preview = lazy, one family only:** `src/fonts/index.js` maps a family name
  to a **dynamic `import()`**; the preview loads a family only when the user
  selects it. `template` (the default) loads nothing. Nothing here is in the
  app's first-load bundle.
- **PDF = static aggregate:** `src/fonts/pdfFonts.js` imports every family and
  `renderPdfHandler.jsx` embeds the selected family's faces. This module is
  **not reachable from the app bundle** (the app never imports the PDF handler),
  so first-load payload is unaffected; the cost is paid once per export inside
  the serverless function.
- **Single source of truth for the CSS:** `getResumeTypographyCss`
  (`resumeTypography.js:223`) returns the scoped rule
  `.resume-typography[data-font-family="X"] .resume-template, … * { font-family: … }`
  and is injected by **both** the preview (`<style>` inside the wrapper) and the
  PDF handler. The per-family rules were removed from `src/index.css`, so the
  two surfaces cannot drift.
- **Licensing:** every family is SIL Open Font License 1.1; the license text for
  each is committed under `src/fonts/licenses/<family>-OFL.txt`.
- **Backward compatibility:** `normaliseFontFamily`
  (`resumeTypography.js:139`) never throws and never resets other typography. A
  removed/renamed family id maps through `FONT_FAMILY_ALIASES`
  (`resumeTypography.js:123`, currently empty because every listed family is
  bundled) to the nearest supported family, else to `template`.
- **Garamond decision:** kept. The family parity sweep shows preview == PDF for
  **all 9 families**, including Garamond, so no family had to be removed.

### First-load impact

- **App JS/CSS:** no bundled font bytes are imported by the app shell. The
  default (`template`) loads zero font modules; selecting one family fetches a
  single dynamic chunk (30–87 KB). First-load JS/CSS is unchanged.
- **PDF function:** `src/fonts/pdfFonts.js` pulls all 7 families into
  `api/render-pdf.js` (the embedding cost). That file is a generated serverless
  artifact and is not part of the browser payload.

---

## 4. Accessibility & safety

`src/components/builder/TemplatesPanel.jsx`:

- `aria-valuetext={`${fontSize.toFixed(1)} points`}` on the range input
  (`:200`) — screen readers announce "10.5 points", not the raw number.
- `aria-describedby` points at the warning paragraph only while a warning is
  shown (`:201`).
- Warning thresholds (`getFontSizeWarning`, `resumeTypography.js:69`):
  - **< 9pt** → `warn`: *"Small text may be hard to read or parse."*
  - **9–10pt** → `hint`: *"Most recruiters prefer 10pt or larger."*
  - **≥ 10pt** → silent.
- **Soft floor only:** the warning is advisory. It **never clamps, rewrites or
  blocks** any value or export. It is computed from the *current* value, so it
  also appears on an existing sub-9pt resume — including the legacy 7.875pt
  default (verified by case A).
- **Save failure preserves the draft:** `src/hooks/useResumeEditor.jsx` sets
  `saveFailed` on error without discarding `resume`; `BuilderLayout.jsx` shows
  "Save failed" plus a **Retry** button that calls the same `saveResume`. No
  edit is discarded and the size is never silently changed.

---

## 5. Backend — widen the range (Option 1)

The slider is capped at the *live* backend ceiling (13px) precisely so no
out-of-range value can be saved before the backend is widened. The backend
change is **separate** from the frontend change (own branch/PR).

`V28__widen_font_size_range.sql`:

- Widens **only** the upper bound: `CHECK (font_size >= 8.0 AND font_size <= 16.0)`.
  Lower bound 8.0 unchanged.
- **No data rewrite:** the migration never `UPDATE`s/`DELETE`s a row; 10.5 and
  13.0 are read back byte-for-byte identical.
- **Non-blocking lock:** `ADD CONSTRAINT … NOT VALID` first (records the rule for
  new/updated rows without scanning), then a separate `VALIDATE CONSTRAINT`
  (scans under `SHARE UPDATE EXCLUSIVE`, which does not block reads/writes).
- Idempotent: `DROP CONSTRAINT IF EXISTS` then re-add, like V27.

Code kept in sync with the CHECK:

| Layer | File | Change |
| --- | --- | --- |
| DTO | `dto/ResumeRequest.java` | `@DecimalMax` `13.0` → `16.0` |
| Entity hooks | `entity/Resume.java` | both `prePersist`/`preUpdate` bounds `13.0` → `16.0` |
| Service sanitizer | `service/ResumeService.java` | `FONT_SIZE_CEILING` `13.0` → `16.0` |
| DOCX scale | `service/ExportService.java` | `docxSizeScale` bound `13.0` → `16.0` |
| Test | `ResumeTypographyConstraintConsistencyTest.java` | extended (below) |

---

## 6. Results

### 6a. Frontend behaviour

| Area | Result | Evidence |
| --- | --- | --- |
| Editor (panel mounts, real providers) | OK | `qa-artifacts/typography/report.json` case A |
| Preview (scaling, no clipping 390/768/1024/1536) | OK | case E → `qa-artifacts/typography/scaling/report.json` |
| Save / reload | **BLOCKED** (no live API/DB) | see §10 |
| DB round-trip | **BLOCKED** | see §10 |
| PDF | OK | parity sweeps below |
| DOCX | OK (programmatic only) | backend `mvn test` + existing docx audit |
| TXT | OK (programmatic only) | backend `mvn test` |

Measured **default body size** (modern, `template`, `fontSize=7.875pt`):

- **Preview:** `11px = 8.25pt` (computed `font-size` of the first `<li>/<p>`).
- **PDF:** `8.25pt` (median text height from the rendered PDF).

These are the rendered body sizes, not the base scale value.

### 6b. Preview == PDF page count, by template (live range 7.5 / 9 / 9.75pt)

All gating cases pass (10/10 live-range; 13/15 across the wider 9/10.5/12pt
probe — the 2 non-gating failures are the 12pt known limitation below).

| Template | 7.5pt | 9pt | 9.75pt | 12pt (future max) |
| --- | --- | --- | --- | --- |
| modern | ✓ | ✓ | ✓ | ✓ |
| classic | ✓ | ✓ | ✓ | ✓ |
| academic | ✓ | ✓ | ✓ | **✗ (known)** |
| engineering | ✓ | ✓ | ✓ | ✓ |
| research | ✓ | ✓ | ✓ | **✗ (known)** |

### 6c. Preview == PDF page count, by family (`modern`, 10.5pt)

| Family | Result |
| --- | --- |
| times | ✓ |
| georgia | ✓ |
| garamond | ✓ |
| arial | ✓ |
| helvetica | ✓ |
| calibri | ✓ |
| cambria | ✓ |
| courier | ✓ |

8/8 OK. Line-break equality on the first 10 bullets is enforced indirectly by a
test asserting the preview and PDF load **byte-identical** font faces for every
family (`typography-logic.test.mjs`), plus the page-count parity above; exact
per-line extraction is not practical in this environment (documented limitation).

---

## 7. Verification

### Pass 1 — during development

- `npm run lint` → clean (`eslint . --max-warnings 0`).
- `npm run build` → clean.
- `node --test qa-artifacts/typography-logic.test.mjs` → **14/14 pass**.
- `node qa-artifacts/qa-typography.mjs` → own cases 6/6, scaling OK, families OK.

### Pass 2 — full `npm run test:typography`

Runs, in order: `build:pdf-css`, `build:api`, `build-app-css.mjs`,
`build-preview-harness.mjs`, `build-scaling-harness.mjs`,
`build-typography-harness.mjs`, `node --test typography-logic.test.mjs`,
`qa-typography.mjs`. Result:

> **PASS** — `node --test` 14/14; own cases 6/6; `E.preview-scaling` OK;
> `F.parity-sizes` (live range) OK; `F.parity-families` OK; non-gating
> `future-max-12pt` recorded under `knownLimitations`. Exit 0.
> Full log: `qa-artifacts/test-typography.log` (gitignored, reproducible).

### Tests — what was added, and how to run

| Test | Type | Covers |
| --- | --- | --- |
| `qa-artifacts/typography-logic.test.mjs` | `node:test` (pure logic, 14) | px↔pt + garbage fallback; legacy 10.5px renders at scale 1 before/after migration; default wrapper inert; `normaliseFontSize` never clamps; warning thresholds <9 / 9–10 / ≥10; `formatFontSizePt`; unknown family falls back and never throws; aliases point at supported families; every family has a coherent stack + bundled mapping; preview/PDF font faces are byte-identical; bundled modules exist and are <100KB; slider bounds/step |
| `qa-artifacts/qa-typography.mjs` | browser (real panel + preview) | A slider min/max/step/default + aria + warning; B reset restores defaults; C page count grows with size (40-bullet sample); D template switch preserves typography; G preview default body pt; G2 PDF default body pt; E delegates scaling; F delegates parity |
| `qa-artifacts/qa-preview-scaling.mjs` | browser (extended) | no sheet clipping at 390/768/1024/1536 |
| `qa-artifacts/qa-preview-pdf-parity.mjs` | browser + PDF (extended) | preview == PDF page count per template/size/family (now pt; `QA_FAMILIES` env) |
| `ResumeTypographyConstraintConsistencyTest.java` | JUnit (extended) | 16.0 accepted / 16.1 rejected / 8.0 accepted / 7.9 rejected; stored 10.5 & 13.0 read back unchanged; V28 has NOT VALID + VALIDATE and no UPDATE/DELETE |

Run everything:

```
# frontend
npm run test:typography          # exits non-zero on failure
# backend
mvn -B test                      # 51/51
```

No existing case was modified except to extend it; no case failed before the
change. Vitest/jsdom were deliberately **not** introduced — the browser harness
(served from a real loopback origin) is the regression test.

---

## 8. Known limitations

1. **12pt (16px) preview != PDF for `academic` and `research`.** Their
   experience "card" is a `break-inside: avoid` bubble taller than one page; the
   preview's element-aware packer force-splits it while Chrome's fragmenter adds
   a page, so neither the annotated nor the natural PDF run reproduces the
   preview count. Threshold: academic passes 11pt, fails 11.5pt; research passes
   11.5pt, fails 12pt. This is a **pre-existing paginator limitation** that does
   **not** reproduce anywhere in the live 7.5–9.75pt range. It is recorded
   **non-gating** under `report.knownLimitations['parity-future-max-12pt']`, and
   it is the gating item for the "raise the slider max to 12pt" follow-up.
2. **Italics not bundled** (weights 400/700 only).
3. **Default thumb snap:** the default `7.875pt` is off the 0.5pt grid (min
   7.5), so the native range thumb snaps to `8`; the true value is still shown by
   the badge and `aria-valuetext` ("7.9 points"). Cases A/B assert within
   `FONT_SIZE_STEP/2`.
4. **Harness origin:** the browser harness must be served from a real loopback
   HTTP origin (not `about:blank`), because `useResumeEditor.jsx:99` reads
   `sessionStorage` unguarded and an opaque origin throws `SecurityError`,
   aborting the render. This is a harness limitation only; production always has
   a real origin, so no production code was changed for it.

---

## 9. Deploy order & rollback

**Deploy order:**

1. Backend + migration (V28) — **after a DB backup/snapshot**.
2. Staging: verify a **16.0 save succeeds** and reads back unchanged.
3. Only then raise `MAX_FONT_SIZE` in `src/utils/resumeTypography.js` to `12`
   (pt) in a one-line frontend follow-up.

**Rollback:**

- The migration **cannot be rolled back once any row holds a value > 13px**
  (re-adding the old CHECK would fail validation). The supported rollback is to
  **lower `MAX_FONT_SIZE` back to 9.75pt in the frontend and leave the CHECK
  widened** — never shrink the constraint while out-of-range rows exist.
- Do **not** run V28 against production from here; it is applied by the normal
  migration runner after the snapshot.

---

## 10. Blocked

- **Live save/reload + DB round-trip + logged-in browser E2E:** the backend
  needs `SPRING_DATASOURCE_URL/USERNAME/PASSWORD` and a PostgreSQL instance;
  this environment has no `.env`, Postgres, `psql` or Docker, and the Builder
  routes sit behind `ProtectedRoute`. Covered programmatically instead
  (service-boundary logic tests + backend `mvn test`).
- **DOCX visual open:** no LibreOffice/Pandoc/Word/ImageMagick — verified
  programmatically only.
- **Exact PDF line-break extraction** for the "first 10 bullets": mitigated by
  the byte-identical font-faces test + page-count parity.

---

## 11. Follow-up (recommended, not built): "Fit to N pages"

**Goal:** a control that picks the largest body size (within 7.5–12pt) that keeps
the resume at or under a target page count N, instead of the user guessing.

**Short design note:**

- Pure client-side; no new backend surface.
- Reuse the preview's element-aware paginator: for a candidate size, compute the
  scale, re-measure the off-screen flow and call `computePageStarts` to get the
  page count — the same function the preview already trusts.
- Binary search over the 0.5pt grid (≤ 10 candidate sizes between 7.5 and 12),
  which is cheap because measurement is a single layout pass.
- If even the minimum size exceeds N, surface a non-blocking message
  ("Can't fit N pages at 7.5pt — trim content") rather than silently shrinking
  below the slider minimum. Never rewrite content.
- Gate it behind the same `MAX_FONT_SIZE`; when the 12pt ceiling lands, the
  search upper bound rises with it automatically.
- Blocked on the same 12pt parity item (§8.1) for the top of the range; the
  search itself is safe for any size that already passes parity.
