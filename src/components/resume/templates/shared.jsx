/* shared.jsx — shared, presentational building blocks for the resume templates.
 *
 * Every template renders the same transformed resume data (see
 * utils/transformResume.js) and the same sectionsConfig. Historically each
 * template re-implemented custom-section rendering, which drifted: grid and
 * entries modes were unsupported in 19/20 templates, addable standard
 * sections (interests/awards/references/volunteer/publications) were dropped,
 * and certification credential URLs were never shown.
 *
 * These helpers centralise that rendering so all templates stay in lock-step
 * with the builder and the DOCX/TXT exporters. Styling is intentionally kept
 * to literal Tailwind classes so tailwind.pdf.config.js (which scans this
 * directory) compiles them into the PDF stylesheet.
 */

export const ensure = (arr) => (Array.isArray(arr) ? arr : []);

export const isText = (value) => typeof value === 'string' && value.trim() !== '';

export const textOf = (value) => (value == null ? '' : String(value)).trim();

export const prettyLabel = (key) =>
  String(key || '')
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());

/* Use the user's (possibly renamed) section label, falling back to the
 * template's own wording and finally a humanised key. */
export const labelOf = (section, fallback = '') =>
  isText(section?.label)
    ? section.label.trim()
    : (fallback || prettyLabel(section?.key) || 'Section');

/* Degree + field, joined the way the builder presents them. The field is a
 * first-class education input, so it must never be dropped from a rendering. */
export const educationTitle = (education) =>
  [textOf(education?.degree), textOf(education?.field)].filter(Boolean).join(', ');

/* True when a custom-style content object has anything worth rendering.
 * Templates use this to avoid emitting an orphan heading. */
export const hasCustomContent = (content) => {
  if (!content) return false;
  if (content.mode === 'grid') {
    return ensure(content.columns).some(
      (column) => textOf(column?.label) || ensure(column?.items).some(isText)
    );
  }
  if (content.mode === 'entries') {
    return ensure(content.entries).some(
      (entry) =>
        textOf(entry?.title) ||
        textOf(entry?.subtitle) ||
        textOf(entry?.date) ||
        textOf(entry?.location) ||
        ensure(entry?.bullets).some(isText)
    );
  }
  if (content.mode === 'bullets') return ensure(content.items).some(isText);
  return isText(content.text);
};

const TONES = {
  light: {
    text: 'text-[10.5px] text-gray-700 leading-relaxed break-words',
    item: 'text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid',
    sub: 'text-[10px] text-gray-500 leading-relaxed break-words',
    meta: 'text-[9.5px] text-gray-400 break-words',
    gridLabel: 'text-[10px] font-semibold text-gray-700 break-words',
    gridItem: 'text-[10.5px] text-gray-700 leading-relaxed break-words',
    entryTitle: 'text-[10.5px] font-semibold text-gray-900 break-words min-w-0',
    entryDate: 'text-[9.5px] text-gray-400 whitespace-nowrap shrink-0',
  },
  dark: {
    text: 'text-[10.5px] text-gray-100 leading-relaxed break-words',
    item: 'text-[10.5px] text-gray-100 leading-relaxed break-words break-inside-avoid',
    sub: 'text-[10px] text-gray-300 leading-relaxed break-words',
    meta: 'text-[9.5px] text-gray-400 break-words',
    gridLabel: 'text-[10px] font-semibold text-white break-words',
    gridItem: 'text-[10.5px] text-gray-100 leading-relaxed break-words',
    entryTitle: 'text-[10.5px] font-semibold text-white break-words min-w-0',
    entryDate: 'text-[9.5px] text-gray-400 whitespace-nowrap shrink-0',
  },
};

/* Bullet list used by standard sections (project highlights, achievements,
 * custom bullets). `tone` selects light or dark typography. */
export const BulletList = ({ items, tone = 'light', className = '', itemClassName = '', marker = '• ' }) => {
  const list = ensure(items).filter(isText);
  if (!list.length) return null;
  const t = TONES[tone] || TONES.light;

  return (
    <ul className={className || 'space-y-0.5'}>
      {list.map((item, index) => (
        <li key={index} className={itemClassName || t.item}>
          {marker ? <span className="break-words">{marker}</span> : null}
          <span className="break-words">{item}</span>
        </li>
      ))}
    </ul>
  );
};

/* Certification line: name — issuer (year) — credential URL.
 * All four stored fields are rendered so preview, PDF, DOCX and TXT agree. */
export const CertItem = ({ cert, tone = 'light', className = '' }) => {
  if (typeof cert === 'string') {
    return <div className={className || TONES.light.text}>{cert}</div>;
  }
  if (!cert) return null;

  const t = TONES[tone] || TONES.light;
  const name = textOf(cert.name);
  const issuer = textOf(cert.issuer);
  const year = textOf(cert.year);
  const url = textOf(cert.credentialUrl);

  if (!name && !issuer && !year && !url) return null;

  return (
    <div className={className || t.text}>
      {name ? <span className="font-medium break-words">{name}</span> : null}
      {issuer ? <span className="break-words"> — {issuer}</span> : null}
      {year ? <span className="break-words"> ({year})</span> : null}
      {url ? <span className="break-all"> — {url}</span> : null}
    </div>
  );
};

/* Custom-section body for all four builder modes. The calling template owns
 * the section heading; this only renders the stored content. */
export const CustomContent = ({ content, tone = 'light' }) => {
  if (!hasCustomContent(content)) return null;
  const t = TONES[tone] || TONES.light;

  if (content.mode === 'grid') {
    const columns = ensure(content.columns).filter(
      (column) => column && (textOf(column.label) || ensure(column.items).some(isText))
    );
    if (!columns.length) return null;

    return (
      <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
        {columns.map((column, index) => (
          <div key={index} className="min-w-0 break-inside-avoid">
            {textOf(column.label) ? (
              <div className={t.gridLabel}>{column.label}</div>
            ) : null}
            {ensure(column.items).filter(isText).length > 0 ? (
              <div className={t.gridItem}>{ensure(column.items).filter(isText).join(', ')}</div>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  if (content.mode === 'entries') {
    const entries = ensure(content.entries).filter(
      (entry) =>
        entry &&
        (textOf(entry.title) ||
          textOf(entry.subtitle) ||
          textOf(entry.date) ||
          textOf(entry.location) ||
          ensure(entry.bullets).some(isText))
    );
    if (!entries.length) return null;

    return (
      <div>
        {entries.map((entry, index) => (
          <div key={index} className="mb-2 break-inside-avoid">
            {(textOf(entry.title) || textOf(entry.date)) && (
              <div className="flex items-baseline justify-between gap-1 flex-wrap">
                <span className={t.entryTitle}>{entry.title}</span>
                {textOf(entry.date) ? <span className={t.entryDate}>{entry.date}</span> : null}
              </div>
            )}
            {(textOf(entry.subtitle) || textOf(entry.location)) && (
              <div className="flex items-baseline justify-between gap-1 flex-wrap">
                <span className={t.sub}>{entry.subtitle}</span>
                {textOf(entry.location) ? (
                  <span className={`${t.meta} shrink-0`}>{entry.location}</span>
                ) : null}
              </div>
            )}
            {ensure(entry.bullets).filter(isText).length > 0 && (
              <BulletList
                items={entry.bullets}
                tone={tone}
                className="mt-0.5 space-y-0.5 pl-3"
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  if (content.mode === 'bullets') {
    return <BulletList items={content.items} tone={tone} />;
  }

  if (!isText(content.text)) return null;
  return <p className={t.text}>{content.text}</p>;
};
