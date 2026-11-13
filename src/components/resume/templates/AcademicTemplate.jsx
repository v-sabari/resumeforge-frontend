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
const INK = '#111111';
const RULE = '#8a8a8a';
const LH = '1.25'; // single line-height used for every text block

const ensure = (arr) => (Array.isArray(arr) ? arr : []);
const isText = (value) => typeof value === 'string' && value.trim() !== '';

/* Fallbacks used only when the builder hands us no/blank section data. */
const DEFAULT_KEYS = [
  'summary',
  'experience',
  'education',
  'projects',
  'skills',
  'certifications',
  'achievements',
  'languages',
];

const prettyLabel = (key) =>
  String(key || '')
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());

const labelOf = (section) =>
  isText(section.label)
    ? section.label.trim()
    : prettyLabel(section.key) || 'Section';

/* Section heading: centered bold title with a thin rule above and below.
 * Avoid breaking immediately after a heading so it is not stranded at the
 * bottom of a page.
 */
const SectionTitle = ({ children }) => (
  <div
    style={{
      marginTop: '11pt',
      marginBottom: '5pt',
      borderTop: `0.75pt solid ${RULE}`,
      borderBottom: `0.75pt solid ${RULE}`,
      textAlign: 'center',
      fontSize: '10pt',
      fontWeight: 'bold',
      letterSpacing: '0.04em',
      color: INK,
      padding: '2.5pt 0',
      breakAfter: 'avoid',
      pageBreakAfter: 'avoid',
    }}
  >
    {children}
  </div>
);

/* Bullet: 10pt, CSS-drawn dot marker, indented row (marker column + text). */
const Bullet = ({ text }) => (
  <div
    style={{
      display: 'flex',
      fontSize: '10pt',
      lineHeight: LH,
      margin: '0 0 1.5pt 0',
      breakInside: 'avoid',
    }}
  >
    {/* Draw the bullet with CSS rather than a text glyph. This avoids missing
        glyphs in headless Chromium PDF rendering. */}
    <span
      style={{
        width: '11pt',
        flexShrink: 0,
        alignSelf: 'flex-start',
        height: '1.3em',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          width: '4.6pt',
          height: '4.6pt',
          borderRadius: '50%',
          background: 'currentColor',
        }}
      />
    </span>
    <span style={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>
      {text}
    </span>
  </div>
);

/* Link helpers: display a clean URL without protocol, www, or trailing slash,
 * while preserving a real clickable href.
 */
const shortUrl = (url) =>
  String(url || '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '');

const hrefOf = (url) => {
  const value = String(url || '').trim();
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

const linkNode = (url) =>
  url && String(url).trim() ? (
    <a
      href={hrefOf(url)}
      style={{ color: 'inherit', textDecoration: 'none' }}
    >
      {shortUrl(url)}
    </a>
  ) : null;

/* Right-hand slot style: dates stay on one line; URLs may wrap anywhere. */
const rightSlot = (nowrap) => ({
  flexShrink: 0,
  maxWidth: '55%',
  textAlign: 'right',
  whiteSpace: nowrap ? 'nowrap' : 'normal',
  overflowWrap: 'anywhere',
});

/* Entry: title + date on the top row, subtitle + location on the second row,
 * optional italic meta/tech line, then bullets.
 *
 * titleRight: top row (for example, GitHub URL)
 * metaRight: meta/tech row (for example, live URL)
 */
const Entry = ({
  title,
  date,
  titleRight,
  subtitle,
  location,
  meta,
  metaRight,
  summary,
  bullets,
}) => {
  const bulletList = ensure(bullets).filter(Boolean);
  const topRight = date || titleRight;

  return (
    <div style={{ marginBottom: '6pt', breakInside: 'avoid' }}>
      {(title || topRight) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '10pt',
          }}
        >
          <span
            style={{
              fontSize: '10.6pt',
              fontWeight: 'bold',
              color: INK,
              minWidth: 0,
              overflowWrap: 'anywhere',
            }}
          >
            {title}
          </span>
          {topRight ? (
            <span
              style={{
                fontSize: '9pt',
                fontWeight: 'normal',
                ...rightSlot(!!date),
              }}
            >
              {topRight}
            </span>
          ) : null}
        </div>
      )}

      {(subtitle || location) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '10pt',
          }}
        >
          <span
            style={{
              fontSize: '10pt',
              fontStyle: 'italic',
              minWidth: 0,
              overflowWrap: 'anywhere',
            }}
          >
            {subtitle}
          </span>
          {location ? (
            <span
              style={{
                fontSize: '9pt',
                fontStyle: 'italic',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              {location}
            </span>
          ) : null}
        </div>
      )}

      {summary ? (
        <p style={{ fontSize: '10pt', lineHeight: LH, margin: '1pt 0 0' }}>
          {summary}
        </p>
      ) : null}

      {(meta || metaRight) ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '10pt',
            fontSize: '9pt',
            fontStyle: 'italic',
            marginTop: '1pt',
          }}
        >
          <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{meta}</span>
          {metaRight ? (
            <span style={rightSlot(false)}>{metaRight}</span>
          ) : null}
        </div>
      ) : null}

      {bulletList.length > 0 && (
        <div style={{ marginTop: '2pt' }}>
          {bulletList.map((bullet, index) => (
            <Bullet key={index} text={bullet} />
          ))}
        </div>
      )}
    </div>
  );
};

/* Grid: bold category label over regular items. Use up to maxCols columns;
 * sparse lists (such as one or two certifications) do not occupy narrow
 * one-third-width cells.
 */
const Grid = ({ columns, maxCols = 3 }) => {
  const cols = ensure(columns).filter(Boolean);
  if (!cols.length) return null;

  const columnCount = Math.max(1, Math.min(maxCols, cols.length));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        columnGap: '14pt',
        rowGap: '3pt',
      }}
    >
      {cols.map((column, index) => (
        <div
          key={index}
          style={{
            breakInside: 'avoid',
            minWidth: 0,
            overflowWrap: 'anywhere',
          }}
        >
          {column.label ? (
            <div style={{ fontSize: '10pt', fontWeight: 'bold', color: INK }}>
              {column.label}
            </div>
          ) : null}

          {ensure(column.items).filter(Boolean).length > 0 ? (
            <div style={{ fontSize: '10pt', lineHeight: LH }}>
              {ensure(column.items).filter(Boolean).join(', ')}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

/* Custom-section body for all four content modes. */
const renderCustomBody = (id, customSections) => {
  const customSection = (customSections || {})[id];
  if (!customSection) return null;

  if (customSection.mode === 'grid') {
    const columns = ensure(customSection.columns).filter(Boolean);
    return columns.length ? <Grid columns={columns} /> : null;
  }

  if (customSection.mode === 'entries') {
    const entries = ensure(customSection.entries).filter(Boolean);
    if (!entries.length) return null;

    return entries.map((entry, index) => (
      <Entry
        key={index}
        title={entry?.title}
        date={entry?.date}
        subtitle={entry?.subtitle}
        location={entry?.location}
        bullets={entry?.bullets}
      />
    ));
  }

  if (customSection.mode === 'bullets') {
    const items = ensure(customSection.items).filter(Boolean);
    if (!items.length) return null;

    return items.map((item, index) => (
      <Bullet key={index} text={item} />
    ));
  }

  if (!isText(customSection.text)) return null;

  return (
    <p style={{ fontSize: '10pt', lineHeight: LH, margin: 0 }}>
      {customSection.text}
    </p>
  );
};

/* Convert skills into category columns. */
const skillsToColumns = (skills) =>
  ensure(skills)
    .filter(Boolean)
    .map((skill) => {
      if (typeof skill === 'object') {
        return {
          label: skill.label || '',
          items: ensure(skill.items).filter(Boolean).map(String),
        };
      }

      const value = String(skill);

      if (value.includes(':')) {
        const separatorIndex = value.indexOf(':');
        const label = value.slice(0, separatorIndex).trim();
        const items = value
          .slice(separatorIndex + 1)
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean);

        if (items.length) return { label, items };

        // For example, "Python:" becomes a single unlabelled item.
        return { label: '', items: label ? [label] : [] };
      }

      return { label: '', items: [value] };
    })
    .filter((column) => column.label || column.items.length);

/* Add the "Tech Stack:" label only once. */
const techStackLine = (tech) => {
  const value = String(tech || '')
    .trim()
    .replace(/^tech(?:nology)?\s*stack\s*:\s*/i, '');

  return value ? `Tech Stack: ${value}` : '';
};

/* Render content for each standard section key. Return null for empty
 * sections so that no orphan section heading is rendered.
 */
const renderSectionBody = (section, data) => {
  if (section.type === 'custom') {
    return renderCustomBody(section.id, data.customSections);
  }

  switch (section.key) {
    case 'summary': {
      if (!isText(data.summary)) return null;

      return (
        <p style={{ fontSize: '10pt', lineHeight: LH, margin: 0 }}>
          {data.summary}
        </p>
      );
    }

    case 'experience': {
      const rows = ensure(data.experience).filter(
        (item) => item && (item.position || item.company),
      );
      if (!rows.length) return null;

      return rows.map((item, index) => (
        <Entry
          key={index}
          title={item.position}
          date={item.duration}
          subtitle={[item.company, item.employmentType].filter(Boolean).join(' · ')}
          location={item.location}
          summary={item.summary}
          bullets={item.responsibilities}
        />
      ));
    }

    case 'education': {
      const rows = ensure(data.education).filter(
        (item) =>
          item &&
          (item.degree ||
            item.field ||
            item.institution ||
            item.year ||
            item.details ||
            item.gpa),
      );
      if (!rows.length) return null;

      return rows.map((item, index) => (
        <Entry
          key={index}
          title={[item.degree, item.field].filter(Boolean).join(', ')}
          date={item.year}
          subtitle={item.institution}
          location=""
          summary={
            [item.details, item.gpa].filter(Boolean).join(' — ') || undefined
          }
        />
      ));
    }

    case 'projects': {
      const rows = ensure(data.projects).filter((project) => project && project.name);
      if (!rows.length) return null;

      return rows.map((project, index) => (
        <Entry
          key={index}
          title={project.name}
          subtitle={project.role}
          titleRight={linkNode(project.github)}
          meta={techStackLine(project.technologies)}
          metaRight={linkNode(project.link)}
          summary={project.description}
          bullets={project.highlights}
        />
      ));
    }

    case 'skills': {
      const columns = skillsToColumns(data.skills);
      return columns.length ? <Grid columns={columns} /> : null;
    }

    case 'certifications': {
      const items = ensure(data.certifications)
        .filter(Boolean)
        .map((certification) =>
          typeof certification === 'string'
            ? certification
            : [
                certification?.name,
                certification?.issuer,
                certification?.year,
                certification?.credentialUrl,
              ]
                .filter(Boolean)
                .join(' — '),
        )
        .filter(Boolean);

      return items.length ? (
        <Grid
          maxCols={3}
          columns={items.map((item) => ({ label: '', items: [item] }))}
        />
      ) : null;
    }

    case 'achievements': {
      const items = ensure(data.achievements).filter(Boolean);
      if (!items.length) return null;

      return items.map((item, index) => (
        <Bullet key={index} text={item} />
      ));
    }

    case 'languages': {
      const items = ensure(data.languages).filter(Boolean);
      if (!items.length) return null;

      return (
        <p style={{ fontSize: '10pt', lineHeight: LH, margin: 0 }}>
          {items.join(' · ')}
        </p>
      );
    }

    default:
      return renderCustomBody(section.id, data.customSections);
  }
};

/* Header: name and job title on the same line, contact information below. */
const Header = ({ personalInfo }) => {
  const personal = personalInfo || {};
  const contact = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.github,
    personal.portfolio,
  ].filter(Boolean);

  const half = Math.ceil(contact.length / 2);
  const left = contact.slice(0, half);
  const right = contact.slice(half);

  return (
    <header style={{ marginBottom: '5pt' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '0 8pt',
        }}
      >
        <h1
          style={{
            fontSize: '17pt',
            fontWeight: 'bold',
            color: '#000',
            margin: 0,
          }}
        >
          {personal.fullName || 'Your Name'}
        </h1>

        {personal.title ? (
          <span style={{ fontSize: '10.6pt', color: INK }}>
            {personal.title}
          </span>
        ) : null}
      </div>

      {contact.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            columnGap: '14pt',
            rowGap: '1pt',
            marginTop: '4pt',
            fontSize: '9pt',
            color: INK,
          }}
        >
          <div>
            {left.map((item, index) => (
              <div key={index} style={{ overflowWrap: 'anywhere' }}>
                {item}
              </div>
            ))}
          </div>
          <div>
            {right.map((item, index) => (
              <div key={index} style={{ overflowWrap: 'anywhere' }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export const AcademicTemplate = ({ data }) => {
  const resumeData = data || {};

  const config = Array.isArray(resumeData.sectionsConfig)
    ? resumeData.sectionsConfig
    : DEFAULT_KEYS.map((key) => ({
        id: key,
        key,
        label: prettyLabel(key),
        visible: true,
      }));

  const sections = config.filter(
    (section) => section && section.visible && section.key !== 'basics',
  );

  return (
    <div
      className="resume-template academic"
      style={{
        width: '100%',
        boxSizing: 'border-box',
        background: '#ffffff',
        color: INK,
        fontFamily: FONT,
        padding: '0 0.35in',
        // Use one explicit line-height for consistent leading across fonts.
        lineHeight: LH,
      }}
    >
      <Header personalInfo={resumeData.personalInfo} />

      {sections.map((section, index) => {
        const body = renderSectionBody(section, resumeData);
        if (body === null) return null;

        return (
          <section key={section.id || section.key || index}>
            <SectionTitle>{labelOf(section)}</SectionTitle>
            {body}
          </section>
        );
      })}
    </div>
  );
};
