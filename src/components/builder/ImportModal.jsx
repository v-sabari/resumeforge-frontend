import { useState } from 'react';
import { Icon } from '../icons/Icon';

export const ImportModal = ({ open, onClose, onImport }) => {
  const [text, setText] = useState('');
  const [err,  setErr]  = useState('');
  if (!open) return null;

  const handleImport = () => {
    if (!text.trim()) return;
    setErr('');
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const parsed = { summary: '', skills: [], achievements: [] };
    let section = '';
    for (const line of lines) {
      const up = line.toUpperCase();
      if (/^(SUMMARY|PROFESSIONAL SUMMARY|PROFILE|OBJECTIVE|CAREER OBJECTIVE|ABOUT ME)/.test(up)) { section = 'summary'; continue; }
      if (/^(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|KEY SKILLS)/.test(up)) { section = 'skills'; continue; }
      if (/^(ACHIEVEMENT|ACHIEVEMENTS|HONORS|AWARDS|ACCOMPLISHMENTS)/.test(up)) { section = 'achievements'; continue; }
      if (/^[-=*_]{3,}$/.test(line)) continue;
      if (section === 'summary') { parsed.summary = (parsed.summary ? parsed.summary + ' ' : '') + line; }
      else if (section === 'skills') {
        line.split(/[,;|•·]/).map((s) => s.trim().replace(/^[-*]\s*/, '')).filter(Boolean)
          .forEach((s) => { if (!parsed.skills.includes(s)) parsed.skills.push(s); });
      } else if (section === 'achievements') {
        const c = line.replace(/^[•\-*]\s*/, '').trim();
        if (c) parsed.achievements.push(c);
      }
    }
    const fl = lines[0];
    if (fl && !/^(SUMMARY|PROFESSIONAL|SKILLS|EXPERIENCE|EDUCATION|CERTIFICATIONS|PROJECTS|ACHIEVEMENTS)/.test(fl.toUpperCase()))
      parsed.fullName = fl.split(/[|,•·]/)[0].trim();
    if (!parsed.fullName && !parsed.summary && !parsed.skills.length && !parsed.achievements.length) {
      setErr('Could not extract information. Add section headers like SUMMARY, SKILLS, or ACHIEVEMENTS.'); return;
    }
    onImport(parsed); setText(''); setErr(''); onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm"
         onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="card max-w-lg w-full space-y-4 p-6 shadow-lift-lg animate-fade-up">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-950">Import resume text</h2>
          <button type="button" onClick={onClose} className="text-ink-300 hover:text-ink-600"><Icon name="close" className="h-5 w-5" /></button>
        </div>
        <p className="text-sm text-ink-500">Paste your existing resume as plain text. We'll extract summary, skills, and achievements.</p>
        <textarea className="input min-h-[200px] w-full resize-none font-mono text-sm" placeholder="Paste resume text here…"
          value={text} onChange={(e) => { setText(e.target.value); setErr(''); }} />
        {err && <p className="text-xs text-danger-600 bg-danger-50 border border-danger-200 rounded-lg px-3 py-2">{err}</p>}
        <div className="flex gap-2">
          <button type="button" onClick={handleImport} disabled={!text.trim()} className="btn-primary flex-1 justify-center">
            <Icon name="sparkles" className="h-4 w-4" /> Import
          </button>
          <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
        </div>
      </div>
    </div>
  );
};
