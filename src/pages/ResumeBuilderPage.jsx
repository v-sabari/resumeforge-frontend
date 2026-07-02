import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createResume, getResumeById, updateResume } from '../services/resumeService';
import { PageHeader } from '../components/common/PageHeader';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { SectionCard } from '../components/builder/SectionCard';
import { ResumePreview } from '../components/builder/ResumePreview';
import { AIActionPanel } from '../components/builder/AIActionPanel';
import { ExportPanel } from '../components/builder/ExportPanel';
import { SectionsManager } from '../components/builder/SectionsManager';
import { CustomSectionEditor } from '../components/builder/CustomSectionEditor';
import { Icon } from '../components/icons/Icon';
import {
  defaultResume,
  DEFAULT_SECTIONS_CONFIG,
  STANDARD_SECTIONS,
} from '../utils/constants';
import { formatApiError, normaliseResume, uid } from '../utils/helpers';

/* ── helpers ──────────────────────────────────────────────────────── */
const fromLines = (v = '') => v.split('\n').map((s) => s.trim()).filter(Boolean);
const jumpTo = (id) =>
  document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const FieldGroup = ({ children }) => (
  <div className="rounded-xl border border-surface-200 bg-surface-50/60 p-4 space-y-3">
    {children}
  </div>
);

const SECTION_ICON_MAP = {
  user: '👤', text: '📝', star: '⭐', briefcase: '💼', code: '💻',
  academic: '🎓', badge: '🏅', trophy: '🏆', globe: '🌐',
  heart: '❤️', users: '👥', hand: '🤝', medal: '🥇', book: '📚',
};
const sectionEmoji = (key) => {
  const std = STANDARD_SECTIONS.find((s) => s.key === key);
  return std ? (SECTION_ICON_MAP[std.icon] || '📋') : '📋';
};

/* ── Mobile tab bar ───────────────────────────────────────────────── */
const MOBILE_TABS = [
  { id: 'edit',    label: '✏️ Edit'    },
  { id: 'preview', label: '👁 Preview' },
  { id: 'export',  label: '⬇ Export'  },
];

/* ── Import modal ─────────────────────────────────────────────────── */
const ImportModal = ({ open, onClose, onImport }) => {
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

/* ══════════════════════════════════════════════════════════════════════
   ResumeBuilderPage
   ══════════════════════════════════════════════════════════════════════ */
export const ResumeBuilderPage = () => {
  const { resumeId } = useParams();
  const navigate     = useNavigate();
  const { premium, exportStatus, refreshExportStatus, refreshPremiumStatus } = useAuth();

  const [resume,      setResume]      = useState({ ...defaultResume, template: 'modern' });
  const [loading,     setLoading]     = useState(Boolean(resumeId));
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');
  const [currentId,   setCurrentId]   = useState(resumeId || null);
  const [mobileTab,   setMobileTab]   = useState('edit');
  const [template,    setTemplate]    = useState('modern');
  const [showImport,  setShowImport]  = useState(false);
  const [showMgr,     setShowMgr]     = useState(false);

  /* ── Derive active sectionsConfig ─────────────────────────────── */
  const sectionsConfig = useMemo(
    () => (resume.sectionsConfig && resume.sectionsConfig.length > 0)
      ? resume.sectionsConfig
      : DEFAULT_SECTIONS_CONFIG,
    [resume.sectionsConfig]
  );

  const setSectionsConfig = useCallback(
    (cfg) => setResume((p) => ({ ...p, sectionsConfig: cfg })),
    []
  );

  /* ── Derived text values ────────────────────────────────────────── */
  const skillsText       = useMemo(() => (resume.skills       || []).join(', '),  [resume.skills]);
  const achievementsText = useMemo(() => (resume.achievements || []).join('\n'),   [resume.achievements]);
  const languagesText    = useMemo(() => (resume.languages    || []).join('\n'),   [resume.languages]);

  /* ── Load resume ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!resumeId) return;
    setLoading(true); setError('');
    getResumeById(resumeId)
      .then((payload) => {
        const n = normaliseResume(payload);
        setResume({ ...defaultResume, ...n, template: n?.template || 'modern' });
        setTemplate(n?.template || 'modern');
        setCurrentId(payload.id || resumeId);
      })
      .catch((e) => setError(formatApiError(e, 'Could not load this resume.')))
      .finally(() => setLoading(false));
  }, [resumeId]);

  useEffect(() => { setResume((p) => ({ ...p, template })); }, [template]);

  /* ── Save ─────────────────────────────────────────────────────── */
  const saveResume = async () => {
    setSaving(true); setError(''); setSuccess('');
    const payload = { ...resume, template };
    try {
      if (currentId) {
        const p = await updateResume(currentId, payload);
        const n = normaliseResume(p);
        setResume((prev) => ({ ...prev, ...n, template: n?.template || template }));
        setTemplate(n?.template || template);
        setSuccess('Resume saved successfully.');
      } else {
        const p  = await createResume(payload);
        const id = p.id || p._id;
        const n  = normaliseResume(p);
        setCurrentId(id);
        setResume((prev) => ({ ...prev, ...n, template: n?.template || template }));
        setTemplate(n?.template || template);
        setSuccess('Resume created. You can now export it.');
        navigate(`/app/builder/${id}`, { replace: true });
      }
    } catch (e) {
      setError(formatApiError(e, 'Could not save the resume.'));
    } finally {
      setSaving(false);
    }
  };

  /* ── Import ───────────────────────────────────────────────────── */
  const handleImport = useCallback((parsed) => {
    setResume((prev) => ({
      ...prev,
      fullName:     parsed.fullName     || prev.fullName,
      summary:      parsed.summary      || prev.summary,
      skills:       parsed.skills?.length       ? parsed.skills       : prev.skills,
      achievements: parsed.achievements?.length ? parsed.achievements : prev.achievements,
    }));
    setSuccess('Resume content imported. Review and edit each section below.');
  }, []);

  /* ── State mutators ───────────────────────────────────────────── */
  const top = (f, v) => setResume((p) => ({ ...p, [f]: v }));
  const refreshStatuses = () => Promise.all([refreshExportStatus(), refreshPremiumStatus()]);

  const arr = (section, id, field, value) =>
    setResume((p) => ({
      ...p,
      [section]: (p[section] || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));

  const removeItem = (section, id) =>
    setResume((p) => ({ ...p, [section]: (p[section] || []).filter((item) => item.id !== id) }));

  const addExp  = () => setResume((p) => ({ ...p, experience:     [...(p.experience    ||[]), { id: uid('exp'),  company: '', role: '', location: '', employmentType: '', startDate: '', endDate: '', summary: '', bullets: [] }] }));
  const addProj = () => setResume((p) => ({ ...p, projects:       [...(p.projects      ||[]), { id: uid('proj'), name: '', role: '', link: '', github: '', techStack: '', description: '', highlights: [] }] }));
  const addEdu  = () => setResume((p) => ({ ...p, education:      [...(p.education     ||[]), { id: uid('edu'),  institution: '', degree: '', field: '', grade: '', startDate: '', endDate: '', details: '' }] }));
  const addCert = () => setResume((p) => ({ ...p, certifications: [...(p.certifications||[]), { id: uid('cert'), name: '', issuer: '', year: '', credentialUrl: '' }] }));

  const updateCert = (index, field, value) =>
    setResume((p) => ({
      ...p,
      certifications: (p.certifications || []).map((cert, i) => {
        if (i !== index) return cert;
        if (typeof cert === 'string') return { id: uid('cert'), name: field === 'name' ? value : cert, issuer: '', year: '' };
        return { ...cert, [field]: value };
      }),
    }));

  const removeCert = (index) =>
    setResume((p) => ({ ...p, certifications: (p.certifications || []).filter((_, i) => i !== index) }));

  /* ── Custom section content ───────────────────────────────────── */
  const getCustomContent = (id) =>
    (resume.customSections || {})[id] || { mode: 'text', text: '', items: [] };

  const setCustomContent = (id, content) =>
    setResume((p) => ({ ...p, customSections: { ...(p.customSections || {}), [id]: content } }));

  /* ── Loading guard ─────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="card flex items-center justify-center py-20">
        <Loader label="Opening resume builder…" size="lg" />
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════════
     SECTION RENDERERS
     ════════════════════════════════════════════════════════════════ */

  /* ── Standard section renderer ─────────────────────────────────── */
  const renderStandard = (sec) => {
    switch (sec.key) {

      /* Personal Information */
      case 'basics': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Profile" title={sec.label}
          description="Your contact details appear at the top of every resume.">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['fullName',          'Full name',         'text'],
              ['professionalTitle', 'Professional title','text'],
              ['email',             'Email',             'email'],
              ['phone',             'Phone',             'tel'],
              ['location',          'Location / City',   'text'],
              ['linkedin',          'LinkedIn URL',      'url'],
              ['github',            'GitHub URL',        'url'],
              ['portfolio',         'Portfolio URL',     'url'],
            ].map(([field, label, type]) => (
              <div key={field} className={field === 'portfolio' ? 'sm:col-span-2' : ''}>
                <label className="label">{label}</label>
                <input className="input" type={type} value={resume[field] || ''}
                  onChange={(e) => top(field, e.target.value)} />
              </div>
            ))}
          </div>
        </SectionCard>
      );

      /* Summary */
      case 'summary': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Summary" title={sec.label}
          description="A 2–4 sentence overview of your background and target role.">
          <textarea className="input min-h-[100px] resize-none" value={resume.summary || ''}
            onChange={(e) => top('summary', e.target.value)}
            placeholder="Write a concise summary of your professional background…" />
        </SectionCard>
      );

      /* Skills */
      case 'skills': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Skills" title={sec.label}
          description="Comma-separated. Tools, frameworks, methodologies.">
          <textarea className="input min-h-[80px] resize-none" value={skillsText}
            onChange={(e) => top('skills', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
            placeholder="React, Node.js, PostgreSQL, Figma, Agile…" />
        </SectionCard>
      );

      /* Experience */
      case 'experience': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Experience" title={sec.label}
          description="Reverse chronological order. Focus on measurable impact."
          actions={<button type="button" onClick={addExp} className="btn-secondary btn-sm gap-1"><Icon name="plus" className="h-3.5 w-3.5" />Add role</button>}>
          {!(resume.experience||[]).length ? (
            <div className="rounded-xl border border-dashed border-surface-300 bg-surface-50 p-4 text-sm text-ink-500">
              No experience yet. Click <span className="font-semibold">Add role</span> to start.
            </div>
          ) : (resume.experience || []).map((exp, idx) => (
            <FieldGroup key={exp.id}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink-900">Role {idx + 1}</p>
                <button type="button" onClick={() => removeItem('experience', exp.id)} className="btn-danger btn-sm"><Icon name="trash" className="h-3.5 w-3.5" />Remove</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[['role','Job title','Frontend Developer'],['company','Company','Acme Technologies'],
                  ['location','Location','Chennai, India'],['employmentType','Employment type','Full-time'],
                  ['startDate','Start date','Jan 2024'],['endDate','End date','Present']].map(([f,l,ph]) => (
                  <div key={f}><label className="label">{l}</label>
                    <input className="input" value={exp[f]||''} onChange={(e)=>arr('experience',exp.id,f,e.target.value)} placeholder={ph}/></div>
                ))}
              </div>
              <div><label className="label">Brief role summary</label>
                <textarea className="input min-h-[72px] resize-none text-sm" value={exp.summary||''}
                  onChange={(e)=>arr('experience',exp.id,'summary',e.target.value)} placeholder="Responsibility scope in 1–2 lines."/></div>
              <div><label className="label">Achievement bullets (one per line)</label>
                <textarea className="input min-h-[120px] resize-none text-sm"
                  value={(exp.bullets||[]).join('\n')}
                  onChange={(e)=>arr('experience',exp.id,'bullets',fromLines(e.target.value))}
                  placeholder={"Built responsive UI for 20+ pages\nImproved page speed by 35%\nIntegrated REST APIs"}/>
                <p className="mt-1 text-xs text-ink-400">Action + result + metric per bullet.</p></div>
            </FieldGroup>
          ))}
        </SectionCard>
      );

      /* Projects */
      case 'projects': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Projects" title={sec.label}
          description="Stack, links, and measurable outcomes."
          actions={<button type="button" onClick={addProj} className="btn-secondary btn-sm gap-1"><Icon name="plus" className="h-3.5 w-3.5" />Add project</button>}>
          {!(resume.projects||[]).length ? (
            <div className="rounded-xl border border-dashed border-surface-300 bg-surface-50 p-4 text-sm text-ink-500">No projects added yet.</div>
          ) : (resume.projects||[]).map((proj, idx) => (
            <FieldGroup key={proj.id}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink-900">Project {idx + 1}</p>
                <button type="button" onClick={() => removeItem('projects', proj.id)} className="btn-danger btn-sm"><Icon name="trash" className="h-3.5 w-3.5" />Remove</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[['name','Project name','ResumeForge AI'],['role','Your role','Full Stack Developer'],
                  ['link','Live URL','https://example.com'],['github','GitHub URL','https://github.com/...']].map(([f,l,ph]) => (
                  <div key={f}><label className="label">{l}</label>
                    <input className="input" value={proj[f]||''} onChange={(e)=>arr('projects',proj.id,f,e.target.value)} placeholder={ph}/></div>
                ))}
              </div>
              <div><label className="label">Tech stack</label>
                <input className="input" value={proj.techStack||''} onChange={(e)=>arr('projects',proj.id,'techStack',e.target.value)} placeholder="React, Spring Boot, PostgreSQL"/></div>
              <div><label className="label">Description</label>
                <textarea className="input min-h-[100px] resize-none text-sm" value={proj.description||''}
                  onChange={(e)=>arr('projects',proj.id,'description',e.target.value)}
                  placeholder="What it does, your contribution, and why it matters."/></div>
              <div><label className="label">Key highlights (one per line)</label>
                <textarea className="input min-h-[100px] resize-none text-sm"
                  value={(proj.highlights||[]).join('\n')}
                  onChange={(e)=>arr('projects',proj.id,'highlights',fromLines(e.target.value))}
                  placeholder={"Implemented JWT auth\nBuilt ATS scoring workflow\nDeployed on AWS"}/></div>
            </FieldGroup>
          ))}
        </SectionCard>
      );

      /* Education */
      case 'education': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Education" title={sec.label}
          description="Institution, degree, specialization, and results."
          actions={<button type="button" onClick={addEdu} className="btn-secondary btn-sm gap-1"><Icon name="plus" className="h-3.5 w-3.5" />Add education</button>}>
          {!(resume.education||[]).length ? (
            <div className="rounded-xl border border-dashed border-surface-300 bg-surface-50 p-4 text-sm text-ink-500">No education added yet.</div>
          ) : (resume.education||[]).map((edu, idx) => (
            <FieldGroup key={edu.id}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink-900">Education {idx + 1}</p>
                <button type="button" onClick={() => removeItem('education', edu.id)} className="btn-danger btn-sm"><Icon name="trash" className="h-3.5 w-3.5" />Remove</button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[['institution','Institution','XYZ Engineering College'],['degree','Degree','B.E / B.Tech'],
                  ['field','Field of study','Computer Science'],['grade','Grade / CGPA','8.4 CGPA'],
                  ['startDate','Start year','2021'],['endDate','End year','2025']].map(([f,l,ph]) => (
                  <div key={f}><label className="label">{l}</label>
                    <input className="input" value={edu[f]||''} onChange={(e)=>arr('education',edu.id,f,e.target.value)} placeholder={ph}/></div>
                ))}
              </div>
              <div><label className="label">Additional details</label>
                <textarea className="input min-h-[80px] resize-none text-sm" value={edu.details||''}
                  onChange={(e)=>arr('education',edu.id,'details',e.target.value)}
                  placeholder="Coursework, honours, scholarships…"/></div>
            </FieldGroup>
          ))}
        </SectionCard>
      );

      /* Certifications */
      case 'certifications': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Certifications" title={sec.label}
          description="Certifications with issuer, year, and credential link."
          actions={<button type="button" onClick={addCert} className="btn-secondary btn-sm gap-1"><Icon name="plus" className="h-3.5 w-3.5" />Add certification</button>}>
          {!(resume.certifications||[]).length ? (
            <div className="rounded-xl border border-dashed border-surface-300 bg-surface-50 p-4 text-sm text-ink-500">No certifications added yet.</div>
          ) : (resume.certifications||[]).map((cert, idx) => {
            const c = typeof cert==='string'
              ? { id: uid('cert'), name: cert, issuer: '', year: '', credentialUrl: '' }
              : { id: cert?.id||uid('cert'), name: cert?.name||'', issuer: cert?.issuer||'', year: cert?.year||'', credentialUrl: cert?.credentialUrl||'' };
            return (
              <FieldGroup key={c.id}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink-900">Certification {idx + 1}</p>
                  <button type="button" onClick={() => removeCert(idx)} className="btn-danger btn-sm"><Icon name="trash" className="h-3.5 w-3.5" />Remove</button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2"><label className="label">Certification name</label>
                    <input className="input" value={c.name} onChange={(e)=>updateCert(idx,'name',e.target.value)} placeholder="AWS Certified Solutions Architect"/></div>
                  <div><label className="label">Issuer</label>
                    <input className="input" value={c.issuer} onChange={(e)=>updateCert(idx,'issuer',e.target.value)} placeholder="Amazon Web Services"/></div>
                  <div><label className="label">Year</label>
                    <input className="input" value={c.year} onChange={(e)=>updateCert(idx,'year',e.target.value)} placeholder="2024"/></div>
                  <div className="sm:col-span-2"><label className="label">Credential URL</label>
                    <input className="input" value={c.credentialUrl} onChange={(e)=>updateCert(idx,'credentialUrl',e.target.value)} placeholder="https://www.credly.com/…"/></div>
                </div>
              </FieldGroup>
            );
          })}
        </SectionCard>
      );

      /* Achievements */
      case 'achievements': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Achievements" title={sec.label}
          description="Awards, recognition, and notable accomplishments.">
          <textarea className="input min-h-[80px] resize-none" value={achievementsText}
            onChange={(e) => top('achievements', fromLines(e.target.value))}
            placeholder={"Won company hackathon 2024\nLed migration reducing costs by 40%"} />
        </SectionCard>
      );

      /* Languages */
      case 'languages': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Languages" title={sec.label}
          description="Languages and proficiency levels.">
          <textarea className="input min-h-[80px] resize-none" value={languagesText}
            onChange={(e) => top('languages', fromLines(e.target.value))}
            placeholder={"English — Fluent\nTamil — Native\nHindi — Intermediate"} />
        </SectionCard>
      );

      /* Any other standard key (interests, references, volunteer, etc.) falls
         through to the custom/freeform renderer below */
      default:
        return renderCustom(sec);
    }
  };

  /* ── Custom / freeform section renderer ─────────────────────────── */
  const renderCustom = (sec) => (
    <SectionCard key={sec.id} id={`section-${sec.id}`}
      eyebrow={sec.type === 'custom' ? 'Custom section' : sec.label}
      title={sec.label}
      description={
        sec.type === 'custom'
          ? 'Add freeform content or a bullet list. Choose Paragraph or Bullet list mode below.'
          : `Add content for the ${sec.label} section.`
      }>
      <CustomSectionEditor
        section={sec}
        content={getCustomContent(sec.id)}
        onChange={(content) => setCustomContent(sec.id, content)}
      />
    </SectionCard>
  );

  /* ── Visible sections ordered by user config ─────────────────────── */
  const visibleSections = sectionsConfig.filter((s) => s.visible);

  /* ── Shared right-panel content ─────────────────────────────────── */
  const previewPanel = (
    <ResumePreview
      resume={{ ...resume, sectionsConfig }}
      template={template}
      onTemplateChange={setTemplate}
    />
  );
  const aiPanel     = <AIActionPanel resume={resume} setResume={setResume} />;
  const exportPanel = (
    <ExportPanel
      resumeId={currentId}
      premium={premium}
      exportStatus={exportStatus}
      selectedTemplate={template}
      onTemplateChange={setTemplate}
      onExported={() => setSuccess('Your resume has been downloaded!')}
      refreshStatuses={refreshStatuses}
    />
  );

  /* ══════════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════════ */
  return (
    <div className="animate-fade-in">
      <ImportModal open={showImport} onClose={() => setShowImport(false)} onImport={handleImport} />

      {/* Header */}
      <PageHeader
        eyebrow="Resume builder"
        title={currentId ? 'Edit resume' : 'New resume'}
        description="Fill in your details, choose a template, preview in real time, then export."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" className="btn-secondary btn-sm" onClick={() => setShowImport(true)}>
              <Icon name="export" className="h-4 w-4 rotate-180" /> Import
            </button>
            {!currentId && <span className="badge-warning text-xs">Unsaved</span>}
            <button type="button" className="btn-primary" onClick={saveResume} disabled={saving}>
              <Icon name="check" className="h-4 w-4" />
              {saving ? 'Saving…' : currentId ? 'Save changes' : 'Save resume'}
            </button>
          </div>
        }
      />

      {/* Alerts */}
      <div className="mt-4 space-y-2">
        {error   && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        {!currentId && (
          <Alert variant="warning">Save your resume first before exporting.</Alert>
        )}
      </div>

      {/* Mobile tab bar */}
      <div className="mt-4 flex gap-1 rounded-xl border border-surface-200 bg-surface-50 p-1 lg:hidden">
        {MOBILE_TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => setMobileTab(t.id)}
            className={['flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all',
              mobileTab === t.id ? 'bg-white text-ink-950 shadow-sm' : 'text-ink-400 hover:text-ink-700'].join(' ')}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 3-column grid */}
      <div className="mt-5 grid gap-6
                      lg:grid-cols-[176px_1fr_440px]
                      xl:grid-cols-[192px_1fr_520px]
                      2xl:grid-cols-[208px_1fr_580px]">

        {/* ── Col 1: Section nav (desktop only) ──────────────────── */}
        <aside className="hidden lg:block">
          <div className="card sticky top-6 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="kicker">Sections</p>
              <button type="button" title="Manage sections"
                onClick={() => setShowMgr((v) => !v)}
                className={['rounded-lg px-2 py-1 text-xs font-medium transition',
                  showMgr ? 'bg-brand-100 text-brand-600' : 'text-ink-400 hover:bg-surface-100'].join(' ')}>
                {showMgr ? '✕ Close' : '⚙ Manage'}
              </button>
            </div>

            {showMgr ? (
              <SectionsManager sectionsConfig={sectionsConfig} onChange={setSectionsConfig} />
            ) : (
              <>
                <nav className="space-y-0.5">
                  {visibleSections.map((s) => (
                    <button key={s.id} type="button" onClick={() => jumpTo(s.id)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left
                                 text-sm text-ink-500 transition hover:bg-surface-100 hover:text-ink-950">
                      <span className="shrink-0 text-sm">
                        {s.type === 'custom' ? '📋' : sectionEmoji(s.key)}
                      </span>
                      <span className="truncate">{s.label}</span>
                    </button>
                  ))}
                </nav>
                <button type="button" onClick={() => setShowMgr(true)}
                  className="mt-2 flex w-full items-center gap-2 rounded-xl border border-dashed
                             border-surface-300 px-3 py-2.5 text-sm text-ink-400
                             hover:bg-surface-50 hover:text-brand-600 transition">
                  <span>＋</span> Add / manage sections
                </button>
              </>
            )}

            {/* Tips */}
            {!showMgr && (
              <div className="mt-4 rounded-xl border border-surface-200 bg-surface-50 p-3.5">
                <p className="kicker mb-2">Tips</p>
                {['Fill all sections', 'Add strong bullets', 'Use AI copilot', 'Save → Export'].map((tip) => (
                  <p key={tip} className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-400">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-brand-400" />{tip}
                  </p>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* ── Col 2: Editor ──────────────────────────────────────── */}
        <div className={`min-w-0 space-y-5 ${mobileTab === 'preview' || mobileTab === 'export' ? 'hidden lg:block' : ''}`}>

          {/* Mobile sections manager toggle */}
          <div className="lg:hidden">
            <button type="button" onClick={() => setShowMgr((v) => !v)}
              className="btn-secondary w-full justify-center gap-2">
              ⚙ {showMgr ? 'Hide section manager' : 'Manage sections (add / reorder / rename)'}
            </button>
            {showMgr && (
              <div className="mt-3">
                <SectionsManager sectionsConfig={sectionsConfig} onChange={setSectionsConfig} />
              </div>
            )}
          </div>

          {/* Render each visible section in user-defined order */}
          {visibleSections.map((sec) =>
            sec.type === 'standard'
              ? renderStandard(sec)
              : renderCustom(sec)
          )}
        </div>

        {/* ── Col 3: Sticky right panel (desktop) ─────────────────── */}
        <div className={[
          'hidden lg:flex lg:flex-col lg:gap-5',
          'lg:sticky lg:top-6',
          'lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1',
        ].join(' ')} style={{ scrollbarWidth: 'thin' }}>
          {previewPanel}
          {aiPanel}
          {exportPanel}
        </div>

        {/* Mobile preview tab */}
        {mobileTab === 'preview' && (
          <div className="col-span-full space-y-4 lg:hidden">{previewPanel}</div>
        )}

        {/* Mobile export tab */}
        {mobileTab === 'export' && (
          <div className="col-span-full space-y-4 lg:hidden">{aiPanel}{exportPanel}</div>
        )}
      </div>
    </div>
  );
};
