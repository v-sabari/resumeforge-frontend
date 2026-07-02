import { useState, useRef } from 'react';
import { STANDARD_SECTIONS, ADDABLE_STANDARD_SECTIONS } from '../../utils/constants';
import { uid } from '../../utils/helpers';

const ICON_MAP = {
  user:'👤', text:'📝', star:'⭐', briefcase:'💼', code:'💻',
  academic:'🎓', badge:'🏅', trophy:'🏆', globe:'🌐',
  heart:'❤️', users:'👥', hand:'🤝', medal:'🥇', book:'📚',
};
const emoji = (iconKey) => ICON_MAP[iconKey] || '📋';

const STD_ICON = Object.fromEntries(
  [...STANDARD_SECTIONS, ...ADDABLE_STANDARD_SECTIONS].map((s) => [s.key, s.icon])
);

export const SectionsManager = ({ sectionsConfig, onChange }) => {
  const [editingId,    setEditingId]    = useState(null);
  const [editLabel,    setEditLabel]    = useState('');
  const [showAddMenu,  setShowAddMenu]  = useState(false);
  const [addingCustom, setAddingCustom] = useState(false);
  const [customLabel,  setCustomLabel]  = useState('');
  const dragItem     = useRef(null);
  const dragOverItem = useRef(null);

  /* ── drag-and-drop ──────────────────────────────────────────── */
  const onDragStart = (e, index) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const onDragEnd = () => {
    const from = dragItem.current;
    const to   = dragOverItem.current;
    dragItem.current = null;
    dragOverItem.current = null;
    if (from === null || to === null || from === to) return;
    const next = [...sectionsConfig];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next.map((s, i) => ({ ...s, order: i })));
  };

  /* ── visibility ─────────────────────────────────────────────── */
  const toggleVisible = (id) =>
    onChange(sectionsConfig.map((s) => s.id === id ? { ...s, visible: !s.visible } : s));

  /* ── rename ─────────────────────────────────────────────────── */
  const startEdit = (sec) => { setEditingId(sec.id); setEditLabel(sec.label); };
  const commitEdit = () => {
    if (editLabel.trim()) {
      onChange(sectionsConfig.map((s) => s.id === editingId ? { ...s, label: editLabel.trim() } : s));
    }
    setEditingId(null);
  };

  /* ── remove ──────────────────────────────────────────────────── */
  const remove = (id) => onChange(sectionsConfig.filter((s) => s.id !== id));

  /* ── duplicate ───────────────────────────────────────────────── */
  const duplicate = (sec) => {
    const newSec = {
      ...sec,
      id:    uid('custom'),
      type:  'custom',
      key:   undefined,
      label: sec.label + ' (copy)',
      order: sectionsConfig.length,
    };
    onChange([...sectionsConfig, newSec]);
  };

  /* ── add standard ────────────────────────────────────────────── */
  const addStandard = (candidate) => {
    if (sectionsConfig.find((s) => s.type === 'standard' && s.key === candidate.key)) return;
    onChange([...sectionsConfig, {
      id: candidate.key, type: 'standard', key: candidate.key,
      label: candidate.label, visible: true, order: sectionsConfig.length,
    }]);
    setShowAddMenu(false);
  };

  /* ── add custom ──────────────────────────────────────────────── */
  const addCustom = () => {
    const label = customLabel.trim() || 'Custom Section';
    const id    = uid('custom');
    onChange([...sectionsConfig, { id, type: 'custom', label, visible: true, order: sectionsConfig.length }]);
    setCustomLabel(''); setAddingCustom(false); setShowAddMenu(false);
  };

  const addedKeys = new Set(sectionsConfig.filter((s) => s.type === 'standard').map((s) => s.key));
  const available = ADDABLE_STANDARD_SECTIONS.filter((s) => !addedKeys.has(s.key));

  return (
    <div className="rounded-xl border border-surface-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-100 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-ink-900">Manage Sections</p>
          <p className="text-[11px] text-ink-400 mt-0.5">Drag to reorder · click label to rename · toggle eye to hide</p>
        </div>
        <div className="relative">
          <button type="button" onClick={() => setShowAddMenu((v) => !v)}
            className="btn-primary btn-sm gap-1">
            <span className="text-base leading-none">+</span> Add section
          </button>
          {showAddMenu && (
            <div className="absolute right-0 top-full z-50 mt-1 w-64 rounded-xl border border-surface-200 bg-white shadow-lift p-2">
              {available.length > 0 && (
                <>
                  <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-ink-400">Standard</p>
                  {available.map((s) => (
                    <button key={s.key} type="button" onClick={() => addStandard(s)}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-ink-700 hover:bg-surface-100 transition">
                      <span>{emoji(s.icon)}</span>{s.label}
                    </button>
                  ))}
                  <div className="my-1 border-t border-surface-100" />
                </>
              )}
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-ink-400">Custom</p>
              {addingCustom ? (
                <div className="px-2 pb-2 space-y-2">
                  <input autoFocus className="input text-sm w-full"
                    placeholder="Section name (e.g. Volunteer Work)"
                    value={customLabel} onChange={(e) => setCustomLabel(e.target.value)}
                    onKeyDown={(e) => { if (e.key==='Enter') addCustom(); if (e.key==='Escape') setAddingCustom(false); }} />
                  <div className="flex gap-2">
                    <button type="button" onClick={addCustom} className="btn-primary btn-sm flex-1 justify-center">Add</button>
                    <button type="button" onClick={() => setAddingCustom(false)} className="btn-secondary btn-sm flex-1 justify-center">Cancel</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setAddingCustom(true)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-ink-700 hover:bg-surface-100 transition">
                  <span>📋</span> Custom section…
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Section list */}
      <ul className="divide-y divide-surface-50 px-2 py-1">
        {sectionsConfig.map((sec, index) => {
          const isPersonalInfo = sec.type === 'standard' && sec.key === 'basics';
          const iconKey = sec.type === 'standard' ? STD_ICON[sec.key] : 'grid';

          return (
            <li key={sec.id} draggable
              onDragStart={(e) => onDragStart(e, index)}
              onDragEnter={() => onDragEnter(index)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={onDragEnd}
              className={[
                'flex items-center gap-2 rounded-lg px-2 py-2 transition select-none',
                'cursor-grab active:cursor-grabbing',
                sec.visible ? 'bg-white' : 'bg-surface-50 opacity-60',
              ].join(' ')}>

              {/* drag handle */}
              <span className="text-ink-300 text-sm flex-none" title="Drag to reorder">⠿</span>

              {/* icon */}
              <span className="text-sm flex-none">{emoji(iconKey)}</span>

              {/* label */}
              {editingId === sec.id ? (
                <input autoFocus className="input flex-1 py-0.5 text-sm"
                  value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(e) => { if (e.key==='Enter') commitEdit(); if (e.key==='Escape') setEditingId(null); }} />
              ) : (
                <button type="button"
                  className="flex-1 text-left text-sm font-medium text-ink-800 truncate hover:text-brand-600 transition"
                  onClick={() => startEdit(sec)} title="Click to rename">
                  {sec.label}
                  {sec.type === 'custom' && (
                    <span className="ml-1.5 rounded bg-surface-100 px-1 py-0.5 text-[10px] text-ink-400">custom</span>
                  )}
                </button>
              )}

              {/* actions */}
              <div className="flex items-center gap-0.5 flex-none">
                {/* duplicate */}
                <button type="button" onClick={() => duplicate(sec)} title="Duplicate"
                  className="rounded-lg p-1 text-ink-300 hover:bg-surface-100 hover:text-ink-600 transition">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>

                {/* show/hide */}
                <button type="button" onClick={() => toggleVisible(sec.id)}
                  title={sec.visible ? 'Hide section' : 'Show section'}
                  className={['rounded-lg p-1 transition',
                    sec.visible ? 'text-brand-500 hover:bg-brand-50' : 'text-ink-300 hover:bg-surface-100'].join(' ')}>
                  {sec.visible ? (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>

                {/* remove — disabled for Personal Info */}
                {!isPersonalInfo && (
                  <button type="button" onClick={() => remove(sec.id)} title="Remove section"
                    className="rounded-lg p-1 text-ink-300 hover:bg-danger-50 hover:text-danger-500 transition">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {sectionsConfig.length === 0 && (
        <p className="px-4 py-6 text-center text-sm text-ink-400">
          All sections removed. Use "Add section" to start fresh.
        </p>
      )}
    </div>
  );
};
