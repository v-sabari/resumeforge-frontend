# Template gallery preview images — audit

**Scope:** the 20 template cards on the public `/templates` page
(`src/pages/TemplatesPage.jsx`).

**Status:** ✅ 20/20 real preview images generated, committed to
`public/templates/`, wired into the cards, and verified.

---

## 1. Before

`src/pages/TemplatesPage.jsx` rendered a **generic SVG placeholder** (a document
glyph + the template label) for every card — no card showed the actual template.
There was no `public/templates/` directory and no `<img>` at all.

## 2. After

Each card shows a real, full-page render of that template (top-of-page crop):

- `src/pages/TemplatesPage.jsx:12-27` — `<img src={`/templates/${template.id}.png`} … className="h-full w-full object-cover object-top" />`
- `src/pages/TemplatesPage.jsx:29` — the template label moved into the card body
  so it is still visible now that the placeholder is gone.
- The Premium lock overlay is unchanged.

## 3. How the images were produced

`qa-artifacts/qa-template-previews.mjs`:

1. server-renders **the same React component** the live preview
   (`src/components/builder/ResumePreview.jsx:194-218`) and the PDF service use,
   via `qa-artifacts/.build/render.cjs` (built from the real
   `src/components/resume/templates/*`),
2. feeds the curated one-page resume `qa-artifacts/template-preview-data.json`,
3. loads it in real Chrome with the same compiled CSS (`api/_pdf-compiled.css`)
   and the same embedded Inter fonts the export page uses,
4. screenshots exactly one page at the template's real page size — A4
   **794×1123** for 19 templates, US Letter **816×1056** for `academic`
   (`api/render-pdf.js:61-67`, `getPageSize`),
5. writes the product image to `public/templates/<id>.png`.

Command:

```
$ node qa-artifacts/build-render.mjs
$ node qa-artifacts/qa-template-previews.mjs
images: 20/20
```

## 4. Programmatic image audit

Because this model cannot view images, every image is measured
(`qa-artifacts/qa-template-preview-audit.mjs` → `qa-artifacts/template-renders/audit.json`):

- **dimensions** decoded from the PNG IHDR must equal the template page size;
- **not blank** — non-white "ink" pixel ratio in `(0.01, 0.6)` and ink must reach
  the lower half of the page (`lastInkFraction > 0.5`);
- **content present** — the saved render HTML is re-opened in Chrome and must
  contain the curated name/email/phone/summary/skill/role/company/bullet/project/
  degree/certification/language text (case-insensitive, because classic/executive
  apply `text-transform: uppercase`);
- **no horizontal overflow** and exactly one `.resume-template` root.

`contentHeight` may exceed the page height: a real resume is longer than one
page and the clip rectangle simply crops it, which is expected for a gallery
thumbnail.

| Template | Page | Size | Ink | Last-ink | Ink rows | Content h | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| modern | 794x1123 | 159 KB | 0.0857 | 0.953 | 524 | 1089 | OK |
| classic | 794x1123 | 162 KB | 0.0996 | 0.961 | 535 | 1093 | OK |
| minimal | 794x1123 | 165 KB | 0.0864 | 0.994 | 505 | 1164 | OK |
| executive | 794x1123 | 157 KB | 0.1060 | 1.000 | 580 | 1240 | OK |
| fresher | 794x1123 | 160 KB | 0.1001 | 0.970 | 529 | 1102 | OK |
| creative | 794x1123 | 189 KB | 0.2268 | 1.000 | 637 | 1208 | OK |
| corporate | 794x1123 | 150 KB | 0.2054 | 1.000 | 621 | 1231 | OK |
| traditional | 794x1123 | 113 KB | 0.3871 | 0.957 | 1075 | 1075 | OK |
| clean | 794x1123 | 172 KB | 0.0836 | 0.943 | 656 | 1059 | OK |
| graduate | 794x1123 | 158 KB | 0.1624 | 0.996 | 617 | 1144 | OK |
| tech | 794x1123 | 102 KB | 0.1893 | 0.992 | 565 | 1134 | OK |
| engineering | 794x1123 | 172 KB | 0.3431 | 0.943 | 1059 | 1059 | OK |
| leadership | 794x1123 | 165 KB | 0.3432 | 0.966 | 1085 | 1085 | OK |
| designer | 794x1123 | 175 KB | 0.3426 | 0.943 | 1059 | 1059 | OK |
| sleek | 794x1123 | 152 KB | 0.0781 | 1.000 | 484 | 1233 | OK |
| contemporary | 794x1123 | 151 KB | 0.2484 | 1.000 | 645 | 1258 | OK |
| academic | 816x1056 | 87 KB | 0.0979 | 1.000 | 549 | 1166 | OK |
| research | 794x1123 | 155 KB | 0.0902 | 0.895 | 632 | 1007 | OK |
| medical | 794x1123 | 155 KB | 0.1188 | 1.000 | 569 | 1151 | OK |
| finance | 794x1123 | 155 KB | 0.0981 | 0.995 | 561 | 1190 | OK |

```
OK: 20/20  dim=20 blank-ok=20 fills=20 fits=20 content=20
total: ~3.0 MB
```

## 5. Page-level end-to-end check

Built app served with `vite preview`, `/templates` loaded in real Chrome
(`qa-artifacts/qa-templates-page.mjs`):

```
images=20 loaded=20 unique=20 failedRequests=0
sizes=794x1123, 816x1056
PAGE OK
```

Every `<img>` returned HTTP 200 (`naturalWidth > 0`), all 20 `src` values are
unique, and no request failed. Screenshot of the rendered page:
`qa-artifacts/template-renders/templates-page.png` (not committed — see the
repo's "no qa-artifacts screenshots" rule).

## 6. Limitations

- This model cannot view images, so the check is measurement-based (dimensions,
  ink coverage, in-DOM text presence, overflow) rather than a human eyeball. The
  raw renders are reproducible with the command in §3.
- The gallery uses the same curated dataset for all templates; it is not
  per-template sample content and is not used by the app at runtime.
