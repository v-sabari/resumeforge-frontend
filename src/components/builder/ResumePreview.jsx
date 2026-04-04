import { useState } from 'react';
import { Icon } from '../icons/Icon';
import { RESUME_TEMPLATES } from '../../utils/constants';

const safe = (v) => v || '';

/* ── Classic template ───────────────────────────────────────────── */
const ClassicTemplate = ({ r }) => (
  <div className="font-sans text-[10px] leading-tight text-gray-900 bg-white p-6 space-y-3">
    {/* Header */}
    <div className="text-center border-b border-gray-300 pb-3">
      <div className="text-lg font-bold tracking-wide uppercase">{safe(r.fullName) || 'Your Name'}</div>
      <div className="text-[10px] text-gray-600 mt-0.5">{safe(r.professionalTitle) || safe(r.role)}</div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1 text-gray-500">
        {r.email    && <span>{r.email}</span>}
        {r.phone    && <span>{r.phone}</span>}
        {r.location && <span>{r.location}</span>}
      </div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-0.5 text-gray-500">
        {r.linkedin  && <span>{r.linkedin}</span>}
        {r.github    && <span>{r.github}</span>}
        {r.portfolio && <span>{r.portfolio}</span>}
      </div>
    </div>

    {/* Summary */}
    {r.summary && (
      <div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-0.5 mb-1.5">Professional Summary</div>
        <p className="text-gray-700 leading-relaxed">{r.summary}</p>
      </div>
    )}

    {/* Skills */}
    {(r.skills || []).length > 0 && (
      <div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-0.5 mb-1.5">Skills</div>
        <p>{(r.skills || []).join(' · ')}</p>
      </div>
    )}

    {/* Experience */}
    {(r.experience || []).length > 0 && (
      <div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-0.5 mb-1.5">Experience</div>
        <div className="space-y-2">
          {(r.experience || []).map((e, i) => (
            <div key={e.id || i}>
              <div className="flex justify-between">
                <span className="font-semibold">{e.role} {e.company && `— ${e.company}`}</span>
                <span className="text-gray-500">{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span>
              </div>
              {e.location && <div className="text-gray-500">{e.location}</div>}
              <ul className="mt-1 space-y-0.5 pl-3">
                {(e.bullets || []).filter(Boolean).map((b, j) => (
                  <li key={j} className="before:content-['•'] before:mr-1 before:text-gray-400">{b}</li>
                ))}
              </ul>
            </div>
          ))}
          </div>
        </div>
      </div>
    )}

    {/* Projects */}
    {(r.projects || []).length > 0 && (
      <div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-0.5 mb-1.5">Projects</div>
        <div className="space-y-1.5">
          {(r.projects || []).map((p, i) => (
            <div key={p.id || i}>
              <span className="font-semibold">{p.name}</span>
              {p.link && <span className="text-gray-500 ml-2">{p.link}</span>}
              {p.description && <p className="text-gray-700 mt-0.5">{p.description}</p>}
            </div>
          ))}
          </div>
        </div>
      </div>
    )}

    {/* Education */}
    {(r.education || []).length > 0 && (
      <div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-0.5 mb-1.5">Education</div>
        <div className="space-y-1">
          {(r.education || []).map((e, i) => (
            <div key={e.id || i} className="flex justify-between">
              <div>
                <span className="font-semibold">{e.degree}</span>
                {e.institution && <span className="text-gray-600"> — {e.institution}</span>}
                {e.field && <span className="text-gray-500">, {e.field}</span>}
              </div>
              <span className="text-gray-500 shrink-0 ml-2">{e.startDate}{e.endDate ? `–${e.endDate}` : ''}</span>
            </div>
          ))}
          </div>
        </div>
      </div>
    )}

    {/* Certifications */}
    {(r.certifications || []).length > 0 && (
      <div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-0.5 mb-1.5">Certifications</div>
        <ul className="space-y-0.5">
          {(r.certifications || []).map((c, i) => (
            <li key={i} className="before:content-['•'] before:mr-1 before:text-gray-400">
              {typeof c === 'string' ? c : `${c.name}${c.issuer ? ' – ' + c.issuer : ''}${c.year ? ' (' + c.year + ')' : ''}`}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Achievements */}
    {(r.achievements || []).filter(Boolean).length > 0 && (
      <div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-0.5 mb-1.5">Achievements</div>
        <ul className="space-y-0.5">
          {(r.achievements || []).filter(Boolean).map((a, i) => (
            <li key={i} className="before:content-['•'] before:mr-1 before:text-gray-400">{a}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

/* ── Modern template ────────────────────────────────────────────── */
const ModernTemplate = ({ r }) => (
  <div className="font-sans text-[10px] leading-tight text-gray-900 bg-white flex">
    {/* Sidebar */}
    <div className="w-[38%] bg-slate-800 text-white p-4 space-y-3">
      <div>
        <div className="text-sm font-bold leading-tight">{safe(r.fullName) || 'Your Name'}</div>
        <div className="text-[9px] text-slate-300 mt-0.5">{safe(r.professionalTitle) || safe(r.role)}</div>
      </div>
      {(r.email || r.phone || r.location) && (
        <div className="space-y-1">
          <div className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1">Contact</div>
          {r.email    && <div className="text-slate-300">{r.email}</div>}
          {r.phone    && <div className="text-slate-300">{r.phone}</div>}
          {r.location && <div className="text-slate-300">{r.location}</div>}
          {r.linkedin && <div className="text-slate-300">{r.linkedin}</div>}
          {r.github   && <div className="text-slate-300">{r.github}</div>}
        </div>
      )}
      {(r.skills || []).length > 0 && (
        <div>
          <div className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Skills</div>
          <div className="flex flex-wrap gap-1">
            {(r.skills || []).map((s, i) => (
              <span key={i} className="rounded bg-slate-700 px-1.5 py-0.5 text-slate-200">{s}</span>
            ))}
          </div>
        </div>
      )}
      {(r.education || []).length > 0 && (
        <div>
          <div className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Education</div>
          {(r.education || []).map((e, i) => (
            <div key={i} className="mb-1.5">
              <div className="font-semibold text-slate-100">{e.degree}</div>
              <div className="text-slate-300">{e.institution}</div>
              <div className="text-slate-400">{e.startDate}{e.endDate ? `–${e.endDate}` : ''}</div>
            </div>
          ))}
        </div>
      )}
    </div>
    {/* Main */}
    <div className="flex-1 p-4 space-y-3">
      {r.summary && (
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-blue-700 border-b border-blue-100 pb-0.5 mb-1.5">Summary</div>
          <p className="text-gray-600 leading-relaxed">{r.summary}</p>
        </div>
      )}
      {(r.experience || []).length > 0 && (
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-blue-700 border-b border-blue-100 pb-0.5 mb-1.5">Experience</div>
          {(r.experience || []).map((e, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold">{e.role}</span>
                <span className="text-gray-400">{e.startDate}{e.endDate ? `–${e.endDate}` : ''}</span>
              </div>
              <div className="text-blue-600 font-medium">{e.company}</div>
              <ul className="mt-0.5 pl-3 space-y-0.5">
                {(e.bullets || []).filter(Boolean).map((b, j) => (
                  <li key={j} className="text-gray-600 before:content-['›'] before:mr-1 before:text-blue-400">{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {(r.projects || []).length > 0 && (
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-blue-700 border-b border-blue-100 pb-0.5 mb-1.5">Projects</div>
          {(r.projects || []).map((p, i) => (
            <div key={i} className="mb-1.5">
              <span className="font-semibold">{p.name}</span>
              {p.description && <p className="text-gray-600 mt-0.5">{p.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

/* ── ResumePreview wrapper ───────────────────────────────────────── */
export const ResumePreview = ({ resume, template = 'classic' }) => {
  const [activeTemplate, setActiveTemplate] = useState(template);

  return (
    <div className="card overflow-hidden">
      {/* Template switcher */}
      <div className="flex items-center justify-between p-3 border-b border-surface-200 bg-surface-50">
        <p className="kicker">Preview</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ink-400">Preview only:</span>
          <div className="flex gap-1">
          {RESUME_TEMPLATES.map((t) => (
            <button key={t.id} onClick={() => setActiveTemplate(t.id)}
              className={`btn-sm rounded-lg text-xs ${activeTemplate === t.id ? 'bg-brand-600 text-white' : 'btn-ghost'}`}>
              {t.label}
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* Scaled preview */}
      <div className="relative bg-white overflow-hidden" style={{ height: '480px' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div style={{ transform: 'scale(0.68)', transformOrigin: 'top left', width: '147%', height: '147%' }}>
            {activeTemplate === 'modern'
              ? <ModernTemplate r={resume} />
              : <ClassicTemplate r={resume} />}
          </div>
        </div>
      </div>

      <div className="p-2.5 bg-surface-50 border-t border-surface-200 text-center">
        <p className="text-xs text-ink-400">Live preview · PDF always exports Classic (ATS-safe)</p>
      </div>
    </div>
  );
};
