import { useState, useEffect } from 'react';

/**
 * src/components/builder/ListField.jsx
 *
 * A textarea for resume fields stored as an array of strings — skills,
 * achievements, languages, experience bullets, project highlights, custom
 * section bullets.
 *
 * THE BUG THIS FIXES: the previous pattern re-derived the textarea's
 * displayed value from the array on every keystroke, e.g.
 *   value={skills.join(', ')}
 *   onChange={(e) => setSkills(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
 * `filter(Boolean)` drops empty tokens immediately — so the instant someone
 * typed a trailing comma, a blank line, or paused between words, the
 * displayed value snapped back to the filtered version before the next
 * character even landed. It looked like the field was "eating" spaces and
 * refusing to move to a new line.
 *
 * THE FIX: keep a local "draft" copy of the exact text being typed. The
 * textarea's value is always bound to that local draft — never to a value
 * re-derived from the parsed array — so nothing is reformatted mid-edit.
 * The parsed array is still pushed up to the parent on every change (so the
 * live preview keeps updating in real time); only the *displayed* text is
 * shielded from that round-trip. On blur, the draft is tidied back to a
 * clean, normalized form — trimmed, blank lines removed — the same gentle
 * "clean up when you're done" behaviour people expect from Notion, Google
 * Docs, and every other modern text editor.
 */
export default function ListField({
  value,
  onChange,
  mode = 'lines',        // 'lines'  → one item per line (bullets, achievements, languages, skills)
                          // 'commas' → comma-separated, kept for backward-compatible call sites
  className = 'input min-h-[80px] resize-none',
  placeholder,
  rows,
}) {
  const separator = mode === 'lines' ? '\n' : ', ';
  const splitter  = mode === 'lines' ? '\n' : ',';

  const serialize = (arr) => (arr || []).join(separator);
  const parse = (text) => text.split(splitter).map((s) => s.trim()).filter(Boolean);

  const [draft, setDraft] = useState(() => serialize(value));
  const [dirty, setDirty] = useState(false);

  // Re-sync from outside changes (resume import, AI rewrite, loading a
  // saved resume) — but only while the person isn't actively typing here.
  // Re-syncing while `dirty` is true is exactly the bug this component
  // exists to prevent.
  useEffect(() => {
    if (!dirty) setDraft(serialize(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <textarea
      className={className}
      rows={rows}
      value={draft}
      placeholder={placeholder}
      onChange={(e) => {
        const text = e.target.value;
        setDraft(text);
        setDirty(true);
        onChange(parse(text));
      }}
      onBlur={() => {
        setDirty(false);
        setDraft(serialize(value));
      }}
    />
  );
}
