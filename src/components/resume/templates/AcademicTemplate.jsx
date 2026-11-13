/* AcademicTemplate.jsx — monochrome US Letter academic CV.
 *
 * US Letter sheet (see utils/pageLayout.js PAGE_SIZES.academic), 0.35in
 * margins all around, single column, black text on white with thin dark
 * gray rules only. Type stack: Calibri → Carlito → Lato → system sans.
 *
 * Sections are fully dynamic: it walks `data.sectionsConfig` (the ordered,
 * user-renamable, eye-toggleable section list the builder maintains) in the
 * user's chosen order and renders each section's content from the shared
 * transformed resume data, so add/remove/reorder/rename all work with zero
 * hardcoded structure here. Custom sections additionally support four
 * content modes: text, bullets, a 3-column category grid, and dated entries.
 */

const FONT = "'Calibri', 'Carlito', 'Lato', 'Segoe UI', sans-serif";
const INK  = '#111111';
const RULE = '#8a8a8a';
const LH   = '1.25'; // single line-height used for every text block

const ensure = (arr) => (Array.isArray(arr) ? arr : []);
const isText = (v) => typeof v === 'string' && v.trim() !== '';

/* Fallbacks used only when the builder hands us no/blank section data. */
const DEFAULT_KEYS = ['summary', 'experience', 'education', 'projects',
  'skills', 'certifications', 'achievements', 'languages'];
const prettyLabel = (key) =>
  String(key || '').replace(/[-_]+/g, ' ').trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
const labelOf = (sec) => (isText(sec.label) ? sec.label.trim() : prettyLabel(sec.key) || 'Section');

/* ─── Section heading: centered bold title with a thin rule directly
   above AND below — identical treatment for every section. breakAfter
   keeps a heading from being stranded at the bottom of a page. ───────── */
const SectionTitle = ({ children }) => (
  <div style={{
    marginTop: '7pt', marginBottom: '4pt',
    borderTop: `0.75pt solid ${RULE}`, borderBottom: `0.75pt solid ${RULE}`,
    textAlign: 'center', fontSize: '10pt', fontWeight: 'bold',
    letterSpacing: '0.04em', color: INK, padding: '2pt 0',
    breakAfter: 'avoid', pageBreakAfter: 'avoid',
  }}>
    {children}
  </div>
);

/* ─── Bullet: 10pt, drawn-dot marker, indented row (marker column + text). ─ */
const Bullet = ({ text }) => (
  <div style={{
    display: 'flex', fontSize: '10pt', lineHeight: LH,
    margin: '0 0 1pt 0', breakInside: 'avoid',
  }}>
    {/* Bullet dot is DRAWN with CSS, not the "●" text character: the PDF renderer
        (headless Chromium on Vercel) lacks a font with that glyph, so the character
        printed blank in the exported PDF. A drawn circle needs no font. The 1.25em
        height equals one text line, so the dot stays on the first line of wrapped
        bullets. Width stays 11pt so the layout is unchanged. */}
    <span style={{
      width: '11pt', flexShrink: 0, alignSelf: 'flex-start',
      height: '1.25em', display: 'flex', alignItems: 'center',
    }}>
      <span style={{ width: '4.6pt', height: '4.6pt', borderRadius: '50%', background: 'currentColor' }} />
    </span>
    <span style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>{text}</span>
  </div>
);

/* ─── Link helpers: show a clean "github.com/user/repo" (no protocol,
   no www., no trailing slash) but keep a real clickable href. ───────── */
const shortUrl = (u) =>
  String(u || '').trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/+$/, '');
const hrefOf = (u) => {
  const t = String(u || '').trim();
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
};
const linkNode = (url) => (url && String(url).trim()
  ? <a href={hrefOf(url)} style={{ color: 'inherit', textDecoration: 'none' }}>{shortUrl(url)}</a>
  : null);

/* Right-hand slot style: dates/locations stay on one line; URLs may wrap
   (anywhere) instead of overflowing the margin or crushing the left text. */
const rightSlot = (nowrap) => ({
  flexShrink: 0, maxWidth: '55%', textAlign: 'right',
  whiteSpace: nowrap ? 'nowrap' : 'normal', overflowWrap: 'anywhere',
});

/* ─── Entry: title + date on the top row, subtitle + location on the
   second row, an optional italic 9pt meta/tech line, then bullets.
   Right-hand slots (all optional, right-aligned on the same row):
     titleRight → top row, used when there is no date (e.g. GitHub URL)
     metaRight  → meta/tech row (e.g. Live URL)                          */
const Entry = ({ title, date, titleRight, subtitle, location, meta, metaRight, summary, bullets }) => {
  const bulletList = ensure(bullets).filter(Boolean);
  const topRight = date || titleRight;
  return (
    <div style={{ marginBottom: '3pt', breakInside: 'avoid' }}>
      {(title || topRight) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10pt' }}>
          <span style={{ fontSize: '10.6pt', fontWeight: 'bold', color: INK, minWidth: 0, overflowWrap: 'anywhere' }}>{title}</span>
          {topRight ? <span style={{ fontSize: '9pt', fontWeight: 'normal', ...rightSlot(!!date) }}>{topRight}</span> : null}
        </div>
      )}
      {(subtitle || location) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10pt' }}>
          <span style={{ fontSize: '10pt', fontStyle: 'italic', minWidth: 0, overflowWrap: 'anywhere' }}>{subtitle}</span>
          {location ? <span style={{ fontSize: '9pt', fontStyle: 'italic', flexShrink: 0, whiteSpace: 'nowrap' }}>{location}</span> : null}
        </div>
      )}
      {summary ? <p style={{ fontSize: '10pt', lineHeight: LH, margin: '1pt 0 0' }}>{summary}</p> : null}
      {(meta || metaRight) ? (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          gap: '10pt', fontSize: '9pt', fontStyle: 'italic', marginTop: '1pt',
        }}>
          <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{meta}</span>
          {metaRight ? <span style={rightSlot(false)}>{metaRight}</span> : null}
        </div>
      ) : null}
      {bulletList.length > 0 && (
        <div style={{ marginTop: '2pt' }}>
          {bulletList.map((b, i) => <Bullet key={i} text={b} />)}
        </div>
      )}
    </div>
  );
};

/* ─── Grid: bold category label over its regular items. 3 columns by
   default (the design); `maxCols` lets sparse lists (e.g. 1–2
   certifications) use fewer columns instead of wrapping in a 1/3 cell. ─ */
const Grid = ({ columns, maxCols = 3 }) => {
  const cols = ensure(columns).filter(Boolean);
  if (!cols.length) return null;
  const n = Math.max(1, Math.min(maxCols, cols.length));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, columnGap: '14pt', rowGap: '3pt' }}>
      {cols.map((col, i) => (
        <div key={i} style={{ breakInside: 'avoid', minWidth: 0, overflowWrap: 'anywhere' }}>
          {col.label ? <div style={{ fontSize: '10pt', fontWeight: 'bold', color: INK }}>{col.label}</div> : null}
          {ensure(col.items).filter(Boolean).length > 0 ? (
            <div style={{ fontSize: '10pt', lineHeight: LH }}>
              {ensure(col.items).filter(Boolean).join(', ')}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

/* ─── Custom-section body for all four content modes. ──────────────── */
const renderCustomBody = (id, customSections) => {
  const c = (customSections || {})[id];
  if (!c) return null;
  if (c.mode === 'grid') {
    const columns = ensure(c.columns).filter(Boolean);
    return columns.length ? <Grid columns={columns} /> : null;
  }
  if (c.mode === 'entries') {
    const entries = ensure(c.entries).filter(Boolean);
    if (!entries.length) return null;
    return entries.map((e, i) => (
      <Entry key={i} title={e?.title} date={e?.date} subtitle={e?.subtitle}
        location={e?.location} bullets={e?.bullets} />
    ));
  }
  if (c.mode === 'bullets') {
    const items = ensure(c.items).filter(Boolean);
    if (!items.length) return null;
    return items.map((it, i) => <Bullet key={i} text={it} />);
  }
  if (!isText(c.text)) return null;
  return <p style={{ fontSize: '10pt', lineHeight: LH, margin: 0 }}>{c.text}</p>;
};

/* ─── Skills → 3-column grid. A line in the flat skills array like
   "Languages: English, Tamil" becomes a bold "Languages" label with its
   items; a plain skill ("Python") becomes a single cell. Real category
   data ({ label, items } objects) also renders directly. ───────────── */
const skillsToColumns = (skills) =>
  ensure(skills).filter(Boolean).map((s) => {
    if (typeof s === 'object') {
      return { label: s.label || '', items: ensure(s.items).filter(Boolean).map(String) };
    }
    const str = String(s);
    if (str.includes(':')) {
      const idx = str.indexOf(':');
      const label = str.slice(0, idx).trim();
      const rest = str.slice(idx + 1).split(',').map((x) => x.trim()).filter(Boolean);
      if (rest.length) return { label, items: rest };
      return { label: '', items: label ? [label] : [] }; // "Python:" with nothing after it; bare ":" is dropped
    }
    return { label: '', items: [str] };
  }).filter((c) => c.label || c.items.length);

/* ─── "Tech Stack: A, B, C" — adds the label once, even if the user
   already typed it into the field. ───────────────────────────────────── */
const techStackLine = (tech) => {
  const t = String(tech || '').trim().replace(/^tech(?:nology)?\s*stack\s*:\s*/i, '');
  return t ? `Tech Stack: ${t}` : '';
};

/* ─── Section content, chosen per standard section key. Each branch
   returns null when its content is empty so no orphan heading renders. ─ */
const renderSectionBody = (sec, data) => {
  if (sec.type === 'custom') {
    return renderCustomBody(sec.id, data.customSections);
  }
  switch (sec.key) {
    case 'summary': {
      if (!isText(data.summary)) return null;
      return <p style={{ fontSize: '10pt', lineHeight: LH, margin: 0 }}>{data.summary}</p>;
    }
    case 'experience': {
      const rows = ensure(data.experience).filter((e) => e && (e.position || e.company));
      if (!rows.length) return null;
      return rows.map((e, i) => (
        <Entry key={i} title={e.position} date={e.duration}
          subtitle={[e.company, e.employmentType].filter(Boolean).join(' · ')}
          location={e.location} summary={e.summary} bullets={e.responsibilities} />
      ));
    }
    case 'education': {
      const rows = ensure(data.education)
        .filter((e) => e && (e.degree || e.field || e.institution || e.year || e.details || e.gpa));
      if (!rows.length) return null;
      return rows.map((e, i) => (
        <Entry key={i} title={[e.degree, e.field].filter(Boolean).join(', ')} date={e.year}
          subtitle={e.institution} location=""
          summary={[e.details, e.gpa].filter(Boolean).join(' — ') || undefined} />
      ));
    }
    case 'projects': {
      const rows = ensure(data.projects).filter((p) => p && p.name);
      if (!rows.length) return null;
      return rows.map((p, i) => (
        <Entry key={i} title={p.name} subtitle={p.role}
          titleRight={linkNode(p.github)}
          meta={techStackLine(p.technologies)}
          metaRight={linkNode(p.link)}
          bullets={p.highlights} />
      ));
    }
    case 'skills': {
      const columns = skillsToColumns(data.skills);
      return columns.length ? <Grid columns={columns} /> : null;
    }
    case 'certifications': {
      const items = ensure(data.certifications).filter(Boolean)
        .map((c) => (typeof c === 'string' ? c : [c?.name, c?.issuer, c?.year].filter(Boolean).join(' — ')))
        .filter(Boolean);
      return items.length
        ? <Grid maxCols={3} columns={items.map((t) => ({ label: '', items: [t] }))} />
        : null;
    }
    case 'achievements': {
      const items = ensure(data.achievements).filter(Boolean);
      if (!items.length) return null;
      return items.map((a, i) => <Bullet key={i} text={a} />);
    }
    case 'languages': {
      const items = ensure(data.languages).filter(Boolean);
      if (!items.length) return null;
      return <p style={{ fontSize: '10pt', lineHeight: LH, margin: 0 }}>{items.join(' · ')}</p>;
    }
    default:
      return renderCustomBody(sec.id, data.customSections);
  }
};

/* ─── Header: name (bold 17pt) + job title (10.6pt) on the same line,
   contact info at 9pt split into two columns beneath. ──────────────── */
const Header = ({ personalInfo }) => {
  const p = personalInfo || {};
  const contact = [p.email, p.phone, p.location, p.linkedin, p.github, p.portfolio]
    .filter(Boolean);
  const half = Math.ceil(contact.length / 2);
  const left = contact.slice(0, half);
  const right = contact.slice(half);
  return (
    <header style={{ marginBottom: '3pt' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '0 8pt' }}>
        <h1 style={{ fontSize: '17pt', fontWeight: 'bold', color: '#000', margin: 0 }}>
          {p.fullName || 'Your Name'}
        </h1>
        {p.title ? <span style={{ fontSize: '10.6pt', color: INK }}>{p.title}</span> : null}
      </div>
      {contact.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', columnGap: '14pt',
          rowGap: '1pt', marginTop: '4pt', fontSize: '9pt', color: INK,
        }}>
          <div>{left.map((it, i) => <div key={i} style={{ overflowWrap: 'anywhere' }}>{it}</div>)}</div>
          <div>{right.map((it, i) => <div key={i} style={{ overflowWrap: 'anywhere' }}>{it}</div>)}</div>
        </div>
      )}
    </header>
  );
};

export const AcademicTemplate = ({ data }) => {
  const d = data || {};
  const config = Array.isArray(d.sectionsConfig)
    ? d.sectionsConfig
    : DEFAULT_KEYS.map((key) => ({ id: key, key, label: prettyLabel(key), visible: true }));
  const sections = config.filter((s) => s && s.visible && s.key !== 'basics');

  return (
    <div className="resume-template academic" style={{
      width: '100%', boxSizing: 'border-box', background: '#ffffff', color: INK,
      fontFamily: FONT, padding: '0 0.35in',
      // One explicit line-height for every row that doesn't set its own, so leading is
      // identical in Calibri, Open Sans (the PDF renderer's fallback) or any other font.
      lineHeight: LH,
    }}>
      <Header personalInfo={d.personalInfo} />
      {sections.map((sec, idx) => {
        const body = renderSectionBody(sec, d);
        if (body === null) return null;
        return (
          <section key={sec.id || sec.key || idx}>
            <SectionTitle>{labelOf(sec)}</SectionTitle>
            {body}
          </section>
        );
      })}
    </div>
  );
};