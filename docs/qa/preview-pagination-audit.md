# Live preview & pagination — audit (multi-column seam)

**Scope:** the resume **live preview** right pane and the pagination it
computes — page count, page-break positions, and whether any text is clipped,
duplicated, or lost — across templates, font sizes, a live edit, a pane resize,
and the exported **PDF**.

**Status:** fix applied and verified. Preview pagination is clean for all
templates/sizes; the exported PDF matches the preview's page count in **15/15**
cases. Live save/reload + DB round-trip and logged-in browser E2E remain
**BLOCKED** in this environment (see [Blocked](#blocked)).

Repo: `resumeforge-frontend-master`, branch `fix/preview-pagination-multicolumn-seam`.

---

## 1. Root cause (file:line)

### 1a. The A4 viewer clips each page window at a single horizontal Y

The preview renders the resume once, off-screen, to measure it, then paints it
again inside N fixed-height, clipped "windows":

- `src/components/builder/ResumePreview.jsx:137` — `sliceH = sliceEnd - start`
  (the window height is the gap to the next page start).
- `src/components/builder/ResumePreview.jsx:153-154` —
  `style={{ height: sliceH, overflow: 'hidden' }}` wrapping
  `style={{ marginTop: -start }}`.

So a page edge is **one horizontal Y that spans every column**. Anything the
content paints across that Y is sliced in half by `overflow: hidden` — the top
half clipped on page N, the bottom half re-drawn at the top of page N+1.

### 1b. The greedy packer reasons about a single reading order

`src/utils/previewPagination.js` `computePageStarts()` sorts atomic blocks by
painted `top` and greedily packs whole blocks into each page. For
**single-column** templates document order == visual order, so the boundary it
picks always lands in a gap and every block stays whole.

For **side-by-side multi-column** templates (`EngineeringTemplate.jsx` is the
dense one) the two columns stack independently, so blocks in different columns
sit at different Ys. The boundary the packer picks for the reading order can
still fall **inside a block in the other column** — and the viewer then cuts
that line.

Proof before the fix (`qa-artifacts/preview-pagination/report-nosnap.json`):

```
long:engineering   font=13   pages=8   textLineCuts=3   blockStraddles=2
short:engineering  font=13   pages=2   textLineCuts=1   blockStraddles=1
```

The cut lines were real painted text, e.g. `Tamil (Native)` cut at y=2358.7
(overlap 9.0px) and `An open-source dashboard that explains every cent` cut at
y=874.3 (overlap 15.4px).

### 1c. Why a whole-block seam alone cannot fix dense two-column layouts

A seam must be a Y in a **gap of *all* columns at once**. For dense
side-by-side columns the union of the block spans is *continuous* — one
column's tail always overlaps the other column's next block — so **no single
horizontal Y clears every block**. (Measured: the merged span set has no gap
large enough.) A block-only fix therefore cannot exist; the best guarantee is
**line granularity**.

---

## 2. Fix (per layer)

| Layer | Change | Files |
| --- | --- | --- |
| Pagination util | New `collectLineSpans()` + `seamForSpans()`; snap the greedy boundary to a zero-cost seam, preferring a whole-**block** seam and falling back to a line-granular seam | `src/utils/previewPagination.js` |
| PDF service | Regenerated embed of the pagination source (read at runtime by the handler) | `api/_pagination.text.js` (via `npm run build:api`) |

### 2a. `seamForSpans()` — snap a boundary to a Y no span strictly crosses

`src/utils/previewPagination.js:132`. It merges the vertical spans that reach
into the current page, then:

- if the candidate is already in a gap → return it unchanged (**single-column
  templates are a no-op**);
- else prefer the cutting span's **far edge** when it still fits the page
  (keep the span whole on this page);
- else back up to its **near edge** (push the span wholly to the next page);
- else return `null` (no clearance possible without losing all progress).

### 2b. `collectLineSpans()` — the fallback granularity

`src/utils/previewPagination.js:99`. Walks the measure node's text nodes and
uses `Range.getClientRects()` to get **one rect per wrapped line box**, in the
same unzoomed units as the blocks.

### 2c. Integration

`src/utils/previewPagination.js:330-343`:

```js
let snapped = seamForSpans(blockSpans, pageStart, capBoundary, boundary);
if (snapped == null) {
  if (lineSpans === null) lineSpans = collectLineSpans(rootEl, rootRect, z);
  snapped = seamForSpans(lineSpans, pageStart, capBoundary, boundary);
}
if (snapped != null && snapped - pageStart >= minGain) boundary = snapped;
```

Line spans are measured **lazily**, only when some page has no whole-block seam,
so single-column templates pay nothing.

**Guarantee:** no painted text **line** is ever sliced. A block may re-flow
across a boundary (its own inter-line whitespace is the seam) — exactly how a
word processor splits a paragraph between pages — but no glyph is cut.

No CSS band-aids were used: no `truncate`, `line-clamp`, `overflow:hidden`,
`nowrap`, or fixed heights were added to mask wrapping. The existing
`overflow: hidden` in `ResumePreview.jsx:153` is the pre-existing clip this fix
makes correct, not a new mask.

---

## 3. Harnesses & datasets

| Artifact | What it does |
| --- | --- |
| `qa-artifacts/preview-harness.jsx` | Mounts the **REAL** `ResumePreview` (same component the Builder right pane uses); exposes `probe()` (sheet count, badge, mounts, per-sheet start/sliceH, measure height), `blocks()` (atomic blocks, mirroring `collectAtomicBlocks`), `lines()` (painted text line boxes). |
| `qa-artifacts/build-preview-harness.mjs` | esbuild IIFE bundle of the harness → `qa-artifacts/.build/preview-harness.js` (git-ignored). |
| `qa-artifacts/qa-preview-pagination.mjs` | Drives the harness: 5 templates × 3 font sizes × {short,long} + live edit + pane resize; validates pagination and counts line cuts. |
| `qa-artifacts/qa-preview-pdf-parity.mjs` | Runs the **real** `api/render-pdf.js` handler (local-Chrome launcher) and compares the exported PDF page count + text against the live preview. |

Datasets: `qa-artifacts/resume-max-coverage.json` (long, multi-page) and
`qa-artifacts/template-preview-data.json` (short). Font sizes: **8.0 / 10.5 /
13.0** (`resumeTypography.js` MIN / DEFAULT / MAX).

Pass criteria: FAIL on **cut text lines**, remount, badge/page mismatch,
non-monotonic or non-contiguous starts, phantom/blank pages, uncovered tail,
sliceH mismatch. A block straddle **without** a line cut is recorded as an
informational `note` (a re-flow, not a clip).

---

## 4. Results

### 4a. Live preview + pagination (`qa-artifacts/preview-pagination/report.json`)

All 10 cases OK; **0 text-line cuts** anywhere. Page counts per font
`[8.0, 10.5, 13.0]`:

| Case | pages | lineCuts | blockStraddles | edit | resize |
| --- | --- | --- | --- | --- | --- |
| long:modern | [3,4,7] | [0,0,0] | [0,0,0] | ok | ok |
| long:classic | [3,4,7] | [0,0,0] | [0,0,0] | ok | ok |
| long:academic | [3,4,7] | [0,0,0] | [0,0,0] | ok | ok |
| long:engineering | [3,4,7] | [0,0,0] | [1,1,1] | ok | ok |
| long:research | [3,4,7] | [0,0,0] | [0,0,0] | ok | ok |
| short:modern | [1,2,2] | [0,0,0] | [0,0,0] | ok | ok |
| short:classic | [1,2,2] | [0,0,0] | [0,0,0] | ok | ok |
| short:academic | [1,2,2] | [0,0,0] | [0,0,0] | ok | ok |
| short:engineering | [1,1,2] | [0,0,0] | [0,0,1] | ok | ok |
| short:research | [1,1,2] | [0,0,0] | [0,0,0] | ok | ok |

The residual `engineering` straddles are **re-flow notes**, not clips: the
boundary lands in the block's own inter-line whitespace, so no line is cut
(verified by the line-box detector). Page count rises monotonically with font
size in every case.

### 4b. With-snap vs without-snap (same harness, snap disabled)

| Case:font | line cuts (no → with) | block straddles (no → with) | pages (no → with) |
| --- | --- | --- | --- |
| long:engineering:13 | **3 → 0** | 2 → 1 | **8 → 7** |
| short:engineering:13 | **1 → 0** | 1 → 1 | 2 → 2 |
| long:academic:8 | 1 → 0 | 0 → 0 | 3 → 3 |
| all other 27 rows | 0 → 0 | unchanged | unchanged |

The snap is a strict improvement: it removes every line cut and never
regresses a page count or another template. `long:engineering:13` drops 8→7
pages because the line seam packs one more block per page — now consistent with
the other templates at font 13 — with no content lost (tail-coverage check
passes).

### 4c. Preview ↔ PDF parity (`qa-artifacts/preview-pdf-parity/report.json`)

Real handler output vs live preview, 5 templates × 3 font sizes = **15/15 OK**,
**0** page-count mismatches, **0** missing resume tokens:

| Template | 8.0 | 10.5 | 13.0 |
| --- | --- | --- | --- |
| modern | pdf=3 preview=3 ✅ | pdf=4 preview=4 ✅ | pdf=7 preview=7 ✅ |
| classic | pdf=3 preview=3 ✅ | pdf=4 preview=4 ✅ | pdf=7 preview=7 ✅ |
| academic | pdf=3 preview=3 ✅ | pdf=4 preview=4 ✅ | pdf=7 preview=7 ✅ |
| engineering | pdf=3 preview=3 ✅ | pdf=4 preview=4 ✅ | pdf=7 preview=7 ✅ |
| research | pdf=3 preview=3 ✅ | pdf=4 preview=4 ✅ | pdf=7 preview=7 ✅ |

For `academic:13` and `engineering:13` the element-aware annotation produced 8
pages, so the handler's existing safety net
(`src/pdf/renderPdfHandler.jsx:344-374`) fell back to Chrome's natural
pagination (7 pages), which matches the preview. This is a pre-existing
fallback path, not a regression.

---

## 5. Verification passes

### Pass 1 (after the fix)

```
$ node qa-artifacts/build-preview-harness.mjs
$ node qa-artifacts/qa-preview-pagination.mjs
    cases: 10/10 OK    (lineCuts = 0 in all 30 template×font×dataset rows)
$ npm run build:api     # regenerates api/_pagination.text.js + api/render-pdf.js
    (verified collectLineSpans / seamForSpans embedded)
$ node qa-artifacts/qa-preview-pdf-parity.mjs
    cases: 15/15 OK    (0 page-count mismatches, 0 missing tokens)
```

### Pass 2 (after harness cleanup + full build)

```
$ node qa-artifacts/build-preview-harness.mjs
$ node qa-artifacts/qa-preview-pagination.mjs
    cases: 10/10 OK    (identical to Pass 1)
$ npm run build
    ✓ built in 6.51s
$ npm run lint
    eslint . --max-warnings 0    (clean, exit 0)
```

`npm run build` regenerates `api/_pagination.text.js` (tracked) and
`api/_pdf-compiled.css` (git-ignored); `api/render-pdf.js` is unchanged because
it imports the pagination text at runtime.

---

## 6. Blocked

| Item | Why blocked | Unblocked by |
| --- | --- | --- |
| Save/reload round-trip | App/API not running; needs a live backend + DB | Start backend with a reachable database |
| Database storage proof | No PostgreSQL, no Docker, no `psql`, no credentials, no `.env` | `SPRING_DATASOURCE_URL/USERNAME/PASSWORD` + PostgreSQL |
| Logged-in browser E2E | Builder routes are behind `ProtectedRoute` and need auth | Running backend + test account |
| PDF/DOCX visual opening | No LibreOffice / Pandoc / Word / ImageMagick installed | Any of those installed |

All visual claims above are therefore **programmatic** — computed CSS, line-box
rects (`Range.getClientRects`), page-start offsets read back from the real
`A4Viewer`, and pdf.js text extraction — rather than screenshots, which this
model cannot view. The generated PDFs are written to
`qa-artifacts/preview-pdf-parity/*.pdf` (untracked) as local evidence.
