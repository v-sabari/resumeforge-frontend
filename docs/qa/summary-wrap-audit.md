# Summary text wrapping & paragraph preservation — audit

**Scope:** the resume **Summary** field, end to end — editor → live preview →
save/reload → database → exports (PDF, DOCX, TXT).

**Status:** fix applied and verified for editor, live preview, PDF, DOCX and TXT.
Live save/reload + database round-trip is **BLOCKED** in this environment (no
PostgreSQL / Docker / credentials — see [Blocked](#blocked)).

Two repositories are involved:

| Repo | Path | Branch |
| --- | --- | --- |
| Frontend | `resumeforge-frontend-master` | `fix/summary-wrap-and-template-sync` |
| Backend | `resumeforge-backend-master` | `fix/summary-wrap-and-template-sync` |

---

## 1. Root cause (file:line)

The summary is stored as one free-text string and may contain `\n` paragraph
breaks. Three independent layers mishandled those breaks.

### 1a. Live preview / PDF — the `<p>` never opted into `pre-line`

Every template renders the summary inside a `<p>` whose Tailwind classes are the
CSS default `white-space: normal`. Under `normal`, CSS **collapses** `\n` (and
runs of whitespace) to a single space, so a multi-paragraph summary was painted
as one run-on block.

Representative line (before the fix):

- `src/components/resume/templates/ModernProTemplate.jsx:42` —
  `<p className={P}>{summary}</p>` where
  `P = "text-[11px] text-gray-600 leading-relaxed break-words"` (no
  `whitespace-pre-line`).

All 20 templates had the same defect. Machine proof (BEFORE) in
`qa-artifacts/summary-bug/report.json`:

```
white-space computed value:  normal  (20/20 templates)
modern line boxes:           9       (summary has 5 non-empty paragraphs)
classic line boxes:          9
horizontal overflow:         1/20    (academic)
```

### 1b. Academic template — no `overflow-wrap`

`AcademicTemplate.jsx` rendered the summary with only font/line-height styles, so
the long unbroken URL / 127-char token had nowhere to break and produced
**horizontal overflow** (the only `overflow: 1/20` in the BEFORE run).

### 1c. DOCX export — one run swallowed every `\n`

`resumeforge-backend-master/.../ExportService.java` `dBody(...)` wrote the whole
value into a single run:

```java
private void dBody(XWPFDocument d, String t) { ... XWPFRun r=p.createRun(); r.setText(t); ... }
```

Word does **not** interpret `\n` inside a run's text, so paragraphs collapsed.
Proof: with the fix reverted, `SummaryWrapRegressionTest.docxPreservesSummaryParagraphBreaks`
fails `expected: <4> but was: <0>` (zero `<w:br/>`).

### 1d. TXT export — already correct

`ExportService.java:694` appends the raw value:
`t.append(resume.getSummary()).append("\n\n");` → newlines preserved. No change
made; behaviour is locked by `SummaryWrapRegressionTest.txtPreservesSummaryParagraphBreaks`.

### 1e. Editor — **not a bug** (verified, no change)

The summary editor is a native `<textarea>`:

- `src/hooks/useResumeEditor.jsx:240` —
  `<textarea className="input min-h-[100px] resize-none" value={resume.summary || ''} ... />`
- `src/index.css:77-82` — `.input` has **no** `white-space` / `nowrap` /
  `text-overflow` rule.

A `<textarea>` preserves `\n` by definition, so the "single line in the editor"
symptom is **not reproducible**. No editor code was changed (avoiding a
speculative fix).

---

## 2. Reproduction dataset

Exact test value: `qa-artifacts/summary-wrap-dataset.json` — **593 chars, 6
newlines, 5 non-empty lines**:

- a long sentence paragraph,
- a second paragraph,
- a Unicode line `Résumé — QA ✓ Tamil: தமிழ் · 東京 · مرحبا · 🚀`,
- a long URL that must wrap,
- a 127-character unbroken token `AAAA…`.

Harness: `qa-artifacts/qa-summary.mjs` renders **all 20 templates through the
same React components** the live preview (`src/components/builder/ResumePreview.jsx:194-218`)
and the PDF service use, in real Chrome, with the same compiled CSS and the same
embedded Inter fonts.

---

## 3. Fixes applied (per layer)

| Layer | Change | Files |
| --- | --- | --- |
| Live preview + PDF templates | Added `whitespace-pre-line` to the summary `<p>` | all 20 `src/components/resume/templates/*.jsx` (summary case; see table below) |
| Academic template | Added inline `whiteSpace:'pre-line'` **and** `overflowWrap:'anywhere'` to both summary paragraphs | `AcademicTemplate.jsx:234`, `AcademicTemplate.jsx:413` |
| PDF render service bundle | Regenerated from the templates | `api/render-pdf.js`, `api/_pdf-compiled.css` (now contains `.whitespace-pre-line{white-space:pre-line}`) via `npm run build` |
| DOCX export | `dBody` writes **one run per line**, `addBreak()` between lines | backend `ExportService.java:1044-1056` |
| TXT export | unchanged (already correct) | backend `ExportService.java:694` |
| Editor | unchanged (not a defect) | — |

### Summary `<p>` location per template (after fix)

| Template | file:line |
| --- | --- |
| modern | `ModernProTemplate.jsx:42` |
| classic | `ClassicTemplate.jsx:27` |
| minimal | `MinimalATSTemplate.jsx:27` |
| executive | `ExecutiveTemplate.jsx:31` |
| fresher | `FresherTemplate.jsx:44` |
| creative | `CreativeATSTemplate.jsx:27` |
| corporate | `CorporateTemplate.jsx:27` |
| traditional | `TraditionalTemplate.jsx:35` |
| clean | `CleanTemplate.jsx:31` |
| graduate | `GraduateTemplate.jsx:79` |
| tech | `TechTemplate.jsx:27` |
| engineering | `EngineeringTemplate.jsx:44` |
| leadership | `LeadershipTemplate.jsx:27` |
| designer | `DesignerTemplate.jsx:44` |
| sleek | `SleekTemplate.jsx:27` |
| contemporary | `ContemporaryTemplate.jsx:35` |
| academic | `AcademicTemplate.jsx:234`, `:413` |
| research | `ResearchTemplate.jsx:37` |
| medical | `MedicalTemplate.jsx:27` |
| finance | `FinanceTemplate.jsx:27` |

No CSS band-aids were used: no `truncate`, `line-clamp`, `overflow:hidden`,
`nowrap`, or fixed heights were added to mask wrapping.

---

## 4. Results table

| Layer | How verified | Result |
| --- | --- | --- |
| **Editor** | Static review of the native `<textarea>` + `.input`; no `white-space` override | ✅ verified not-a-bug — newlines survive typing |
| **Live preview** | `qa-artifacts/qa-summary.mjs` (real Chrome, exact components) | ✅ **20/20** `white-space: pre-line`, **0/20** overflow; line boxes rose 9→16 (modern/classic), academic 18 |
| **Save / reload** | Requires running app + API | ⛔ **BLOCKED** (see below) |
| **Database** | Requires PostgreSQL | ⛔ **BLOCKED**; column is `resume.summary TEXT` (`V1__initial_schema.sql:44`), stored verbatim, no transform on the path |
| **PDF** | `qa-artifacts/qa-summary-pdf.cjs` (real export through `api/render-pdf.js`) then `qa-summary-pdftext.mjs` (pdf.js text extraction) | ✅ **6/6** sampled templates `paragraphsOnOwnLine=true, order=true` |
| **DOCX** | `SummaryWrapRegressionTest.docxPreservesSummaryParagraphBreaks` (unzips `word/document.xml`, counts `<w:br/>`) | ✅ 4 breaks == 4 source newlines; paragraphs present |
| **TXT** | `SummaryWrapRegressionTest.txtPreservesSummaryParagraphBreaks` | ✅ blank lines preserved |

PDF text proof (`qa-artifacts/summary-bug/pdf-after/text-report.json`), leads in
order `["Results-driven","Led","Résumé","Portfolio:","Token:"]`:

```
academic   paragraphsOnOwnLine=true order=true
classic    paragraphsOnOwnLine=true order=true
clean      paragraphsOnOwnLine=true order=true
executive  paragraphsOnOwnLine=true order=true
finance    paragraphsOnOwnLine=true order=true
modern     paragraphsOnOwnLine=true order=true
```

---

## 5. Verification passes

### Pass 1 (after the fix, clean build)

```
$ npm run build      → ✓ built (dist) ; regenerated api/render-pdf.js + api/_pdf-compiled.css
$ npm run lint       → eslint . --max-warnings 0   (clean)
$ node qa-artifacts/qa-summary.mjs --out qa-artifacts/summary-fixed
    pre-line: 20/20   overflow: 0/20
$ node qa-artifacts/qa-summary-pdf.cjs
    modern 5p · classic 4p · academic 5p · clean 4p · executive 5p · finance 5p
$ node qa-artifacts/qa-summary-pdftext.mjs
    all 6: paragraphsOnOwnLine=true order=true
```

Backend:

```
$ mvn.cmd -B test
    Tests run: 50, Failures: 0, Errors: 0, Skipped: 0
    BUILD SUCCESS
    (includes SummaryWrapRegressionTest: 2/2)
```

### Pass 2

Re-ran the full frontend build, lint, the Chrome wrap audit and the PDF
export/text extraction after the template-preview work (see
`template-image-audit.md`) — identical results (20/20 pre-line, 0 overflow, 6/6
PDFs). Backend suite re-run: 50/50 green.

---

## 6. Blocked

| Item | Why blocked | Unblocked by |
| --- | --- | --- |
| Save/reload round-trip | App/API not running; needs a live backend + DB | Start backend with a reachable database |
| Database storage proof | No PostgreSQL, no Docker, no `psql`, no credentials, no `.env` | `SPRING_DATASOURCE_URL/USERNAME/PASSWORD` + PostgreSQL |
| Logged-in browser E2E | Builder routes are behind `ProtectedRoute` and need auth | Running backend + test account |
| DOCX visual opening | No LibreOffice / Pandoc / Word / ImageMagick installed | Any of those installed |

DOCX and PDF "visual" confirmation is therefore **programmatic** (DOCX XML
`<w:br/>` counts and extracted paragraph text; PDF text extraction and
line-box measurement) rather than a screenshot, and this model cannot view
images directly.
