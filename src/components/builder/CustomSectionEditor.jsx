import { useState } from 'react';

const fromLines = (v = '') => v.split('\n').map((s) => s.trim()).filter(Boolean);

export const CustomSectionEditor = ({ section, content, onChange }) => {
  // content shape: { mode: 'text'|'bullets', text: '', items: [] }
  const mode  = content?.mode  || 'text';
  const text  = content?.text  || '';
  const items = content?.items || [];

  const setMode = (m) => onChange({ ...content, mode: m });

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="radio"
            className="accent-brand-600"
            checked={mode === 'text'}
            onChange={() => setMode('text')}
          />
          <span className="text-xs font-medium text-ink-600">Paragraph</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="radio"
            className="accent-brand-600"
            checked={mode === 'bullets'}
            onChange={() => setMode('bullets')}
          />
          <span className="text-xs font-medium text-ink-600">Bullet list</span>
        </label>
      </div>

      {mode === 'text' ? (
        <textarea
          className="input min-h-[100px] resize-none text-sm"
          placeholder={`Write the content for "${section.label}"…`}
          value={text}
          onChange={(e) => onChange({ ...content, mode: 'text', text: e.target.value })}
        />
      ) : (
        <div className="space-y-2">
          <textarea
            className="input min-h-[100px] resize-none text-sm"
            placeholder="One bullet per line…"
            value={items.join('\n')}
            onChange={(e) => onChange({ ...content, mode: 'bullets', items: fromLines(e.target.value) })}
          />
          <p className="text-xs text-ink-400">Each line becomes a separate bullet point in the preview and export.</p>
        </div>
      )}
    </div>
  );
};
