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

const ensure = (arr) => (Array.isArray(arr) ? arr : []);

/* ─── Section heading: centered bold title with a thin rule directly
   above AND below — identical treatment for every section. ─────────── */
const SectionTitle = ({ children }) => (
  <div style={{
    marginTop: '11pt', marginBottom: '5pt',
    borderTop: `0.75pt solid ${RULE}`, borderBottom: `0.75pt solid ${RULE}`,
    textAlign: 'center', fontSize: '10pt', fontWeight: 'bold',
    letterSpacing: '0.04em', color: INK, padding: '2.5pt 0',
  }}>
    {children}
  </div>
);

/* ─── Bullet: 10pt, "●" marker, indented row (marker column + text). ─ */
const Bullet = ({ text }) => (
  <div style={{
    display: 'flex', fontSize: '10pt', lineHeight: '1.3',
    margin: '0 0 1.5pt 0', breakInside: 'avoid',
  }}>
    <span style={{ width: '11pt', flexShrink: 0 }}>●</span>
    <span style={{ flex: 1, minWidth: 0 }}>{text}</span>
  </div>
);

/* ─── Entry: title + date on the top row, subtitle + location on the
   second row, an optional italic 9pt meta/tech line, then bullets. ──── */
const Entry = ({ title, date, subtitle, location, meta, summary, bullets }) => {
  const bulletList = ensure(bullets).filter(Boolean);
  return (
    <div style={{ marginBottom: '6pt', breakInside: 'avoid' }}>
      {(title || date) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10pt' }}>
          <span style={{ fontSize: '10.6pt', fontWeight: 'bold', color: INK, minWidth: 0 }}>{title}</span>
          {date ? <span style={{ fontSize: '9pt', fontWeight: 'normal', whiteSpace: 'nowrap' }}>{date}</span> : null}
        </div>
      )}
      {(subtitle || location) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10pt' }}>
          <span style={{ fontSize: '10pt', fontStyle: 'italic', minWidth: 0 }}>{subtitle}</span>
          {location ? <span style={{ fontSize: '9pt', fontStyle: 'italic', whiteSpace: 'nowrap' }}>{location}</span> : null}
        </div>
      )}
      {summary ? <p style={{ fontSize: '10pt', lineHeight: '1.35', margin: '1pt 0 0' }}>{summary}</p> : null}
      {meta ? <div style={{ fontSize: '9pt', fontStyle: 'italic', marginTop: '1pt' }}>{meta}</div> : null}
      {bulletList.length > 0 && (
        <div style={{ marginTop: '2pt' }}>
          {bulletList.map((b, i) => <Bullet key={i} text={b} />)}
        </div>
      )}
    </div>
  );
};

/* ─── 3-column grid: bold category label over its regular items. ────── */
const Grid = ({ columns }) => {
  const cols = ensure(columns).filter(Boolean);
  if (!cols.length) return null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', columnGap: '14pt', rowGap: '5pt' }}>
      {cols.map((col, i) => (
        <div key={i} style={{ breakInside: 'avoid' }}>
          {col.label ? <div style={{ fontSize: '10pt', fontWeight: 'bold', color: INK }}>{col.label}</div> : null}
          {ensure(col.items).filter(Boolean).length > 0 ? (
            <div style={{ fontSize: '10pt', lineHeight: '1.3' }}>
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
  if (!c.text || !c.text.trim()) return null;
  return <p style={{ fontSize: '10pt', lineHeight: '1.35' }}>{c.text}</p>;
};

/* ─── Skills → 3-column grid. A line in the flat skills array like
   "Languages: English, Tamil" becomes a bold "Languages" label with its
   items; a plain skill ("Python") becomes a single cell. Real category
   data ({ label, items } objects) also renders directly. ───────────── */
const skillsToColumns = (skills) =>
  ensure(skills).filter(Boolean).map((s) => {
    if (typeof s === 'string' && s.includes(':')) {
      const idx = s.indexOf(':');
      const label = s.slice(0, idx).trim();
      const rest = s.slice(idx + 1).split(',').map((x) => x.trim()).filter(Boolean);
      return { label, items: rest.length ? rest : [s] };
    }
    return { label: '', items: [String(s)] };
  });

/* ─── Section content, chosen per standard section key. Each branch
   returns null when its content is empty so no orphan heading renders. ─ */
const renderSectionBody = (sec, data) => {
  if (sec.type === 'custom') {
    return renderCustomBody(sec.id, data.customSections);
  }
  switch (sec.key) {
    case 'summary': {
      if (!data.summary || !data.summary.trim()) return null;
      return <p style={{ fontSize: '10pt', lineHeight: '1.35' }}>{data.summary}</p>;
    }
    case 'experience': {
      if (!ensure(data.experience).length) return null;
      return ensure(data.experience)
        .filter((e) => e.position || e.company)
        .map((e, i) => (
          <Entry key={i} title={e.position} date={e.duration}
            subtitle={[e.company, e.employmentType].filter(Boolean).join(' · ')}
            location={e.location} summary={e.summary} bullets={e.responsibilities} />
        ));
    }
    case 'education': {
      if (!ensure(data.education).length) return null;
      return ensure(data.education).map((e, i) => (
        <Entry key={i} title={[e.degree, e.field].filter(Boolean).join(', ')} date={e.year}
          subtitle={e.institution} location=""
          summary={[e.details, e.gpa].filter(Boolean).join(' — ') || undefined} />
      ));
    }
    case 'projects': {
      if (!ensure(data.projects).length) return null;
      return ensure(data.projects)
        .filter((p) => p.name)
        .map((p, i) => (
          <Entry key={i} title={p.name} subtitle={p.role}
            meta={[p.technologies, p.link, p.github].filter(Boolean).join(' · ')}
            bullets={p.highlights} />
        ));
    }
    case 'skills': {
      const columns = skillsToColumns(data.skills);
      return columns.length ? <Grid columns={columns} /> : null;
    }
    case 'certifications': {
      const items = ensure(data.certifications).filter(Boolean)
        .map((c) => [c?.name, c?.issuer, c?.year].filter(Boolean).join(' — '))
        .filter(Boolean);
      return items.length ? <Grid columns={items.map((t) => ({ label: '', items: [t] }))} /> : null;
    }
    case 'achievements': {
      const items = ensure(data.achievements).filter(Boolean);
      if (!items.length) return null;
      return items.map((a, i) => <Bullet key={i} text={a} />);
    }
    case 'languages': {
      const items = ensure(data.languages).filter(Boolean);
      if (!items.length) return null;
      return <p style={{ fontSize: '10pt', lineHeight: '1.3' }}>{items.join(' · ')}</p>;
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
    <header style={{ marginBottom: '5pt' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '0 8pt' }}>
        <h1 style={{ fontSize: '17pt', fontWeight: 'bold', color: '#000', margin: 0 }}>
          {p.fullName || 'Your Name'}
        </h1>
        {p.title ? <span style={{ fontSize: '10.6pt', color: INK }}>{p.title}</span> : null}
      </div>
      {contact.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '14pt',
          rowGap: '1pt', marginTop: '4pt', fontSize: '9pt', color: INK,
        }}>
          <div>{left.map((it, i) => <div key={i} style={{ wordBreak: 'break-word' }}>{it}</div>)}</div>
          <div>{right.map((it, i) => <div key={i} style={{ wordBreak: 'break-word' }}>{it}</div>)}</div>
        </div>
      )}
    </header>
  );
};

export const AcademicTemplate = ({ data }) => {
  const sections = (data.sectionsConfig || [])
    .filter((s) => s.visible && s.key !== 'basics');

  return (
    <div className="resume-template academic" style={{
      width: '100%', background: '#ffffff', color: INK,
      fontFamily: FONT, padding: '0 0.35in',
    }}>
      <Header personalInfo={data.personalInfo} />
      {sections.map((sec) => {
        const body = renderSectionBody(sec, data);
        if (body === null) return null;
        return (
          <section key={sec.id}>
            <SectionTitle>{sec.label}</SectionTitle>
            {body}
          </section>
        );
      })}
    </div>
  );
};