import ListField from './ListField';
import { Icon } from '../icons/Icon';

const ensure = (arr) => (Array.isArray(arr) ? arr : []);

/* ─── grid mode: lines "Label: item, item" become a 3-column grid of
   category labels with their items; a bare line becomes a single cell. ─ */
const gridTextToColumns = (text) =>
  (text || '').split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
    const idx = line.indexOf(':');
    if (idx > 0) {
      const label = line.slice(0, idx).trim();
      const items = line.slice(idx + 1).split(',').map((s) => s.trim()).filter(Boolean);
      return { label, items: items.length ? items : [] };
    }
    return { label: '', items: [line] };
  });

const columnsToGridText = (columns) =>
  ensure(columns)
    .filter(Boolean)
    .map((c) => (c.label ? `${c.label}: ${ensure(c.items).join(', ')}` : ensure(c.items).join(', ')))
    .join('\n');

export const CustomSectionEditor = ({ section, content, onChange }) => {
  // content shape: { mode: 'text'|'bullets'|'grid'|'entries', ... }
  const mode    = content?.mode  || 'text';
  const text    = content?.text  || '';
  const items   = content?.items || [];
  const entries = content?.entries || [];

  const setMode = (m) => onChange({ ...content, mode: m });

  const MODES = [
    ['text',    'Paragraph'],
    ['bullets', 'Bullet list'],
    ['grid',    'Grid'],
    ['entries', 'Entries'],
  ];

  const updateEntry = (i, field, value) =>
    onChange({
      ...content,
      mode: 'entries',
      entries: entries.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)),
    });

  const addEntry = () =>
    onChange({
      ...content,
      mode: 'entries',
      entries: [...entries, { title: '', subtitle: '', date: '', location: '', bullets: [] }],
    });

  const removeEntry = (i) =>
    onChange({ ...content, mode: 'entries', entries: entries.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex gap-2 flex-wrap">
        {MODES.map(([value, label]) => (
          <label key={value} className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              className="accent-brand-600"
              checked={mode === value}
              onChange={() => setMode(value)}
            />
            <span className="text-xs font-medium text-ink-600">{label}</span>
          </label>
        ))}
      </div>

      {mode === 'text' && (
        <textarea
          className="input min-h-[100px] resize-none text-sm"
          placeholder={`Write the content for "${section.label}"…`}
          value={text}
          onChange={(e) => onChange({ ...content, mode: 'text', text: e.target.value })}
        />
      )}

      {mode === 'bullets' && (
        <div className="space-y-2">
          <ListField
            className="input min-h-[100px] resize-none text-sm"
            placeholder="One bullet per line…"
            value={items}
            onChange={(v) => onChange({ ...content, mode: 'bullets', items: v })}
          />
          <p className="text-xs text-ink-400">Each line becomes a separate bullet point in the preview and export.</p>
        </div>
      )}

      {mode === 'grid' && (
        <div className="space-y-2">
          <textarea
            className="input min-h-[100px] resize-none text-sm"
            placeholder={"Languages: English, Tamil\nFrameworks: React, Flask, Node.js\nPython\nPostgreSQL"}
            value={columnsToGridText(content?.columns)}
            onChange={(e) =>
              onChange({ ...content, mode: 'grid', columns: gridTextToColumns(e.target.value) })
            }
          />
          <p className="text-xs text-ink-400">
            Each line renders as one cell in a 3-column grid. A line like
            &ldquo;Languages: English, Tamil&rdquo; shows a bold label with its items.
          </p>
        </div>
      )}

      {mode === 'entries' && (
        <div className="space-y-2">
          {entries.map((en, i) => (
            <div key={i} className="rounded-lg border border-surface-200 p-3 space-y-2">
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="label">Title</label>
                  <input className="input text-sm" value={en.title || ''}
                    onChange={(e) => updateEntry(i, 'title', e.target.value)}
                    placeholder="e.g. Research Assistant" />
                </div>
                <div>
                  <label className="label">Date</label>
                  <input className="input text-sm" value={en.date || ''}
                    onChange={(e) => updateEntry(i, 'date', e.target.value)}
                    placeholder="e.g. 2022 – 2024" />
                </div>
                <div>
                  <label className="label">Subtitle</label>
                  <input className="input text-sm" value={en.subtitle || ''}
                    onChange={(e) => updateEntry(i, 'subtitle', e.target.value)}
                    placeholder="e.g. University of Example" />
                </div>
                <div>
                  <label className="label">Location</label>
                  <input className="input text-sm" value={en.location || ''}
                    onChange={(e) => updateEntry(i, 'location', e.target.value)}
                    placeholder="e.g. Chennai, India" />
                </div>
              </div>
              <div>
                <label className="label">Bullets (one per line)</label>
                <ListField className="input min-h-[60px] resize-none text-sm"
                  value={en.bullets || []}
                  onChange={(v) => updateEntry(i, 'bullets', v)}
                  placeholder="One bullet per line…" />
              </div>
              <button type="button" onClick={() => removeEntry(i)}
                className="btn-danger btn-sm">
                <Icon name="trash" className="h-3.5 w-3.5" />Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addEntry} className="btn-secondary btn-sm gap-1">
            <Icon name="plus" className="h-3.5 w-3.5" />Add entry
          </button>
        </div>
      )}
    </div>
  );
};