import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createResume, getResumeById, updateResume } from '../services/resumeService';
import { PageHeader }   from '../components/common/PageHeader';
import { Alert }        from '../components/common/Alert';
import { Loader }       from '../components/common/Loader';
import { SectionCard }  from '../components/builder/SectionCard';
import { ResumePreview } from '../components/builder/ResumePreview';
import { AIActionPanel } from '../components/builder/AIActionPanel';
import { ExportPanel }  from '../components/builder/ExportPanel';
import { Icon }         from '../components/icons/Icon';
import { defaultResume, builderSections } from '../utils/constants';
import { formatApiError, normaliseResume, toArray, uid } from '../utils/helpers';

const fromLines = (v) => v.split('\n').map((s) => s.trim()).filter(Boolean);
const jumpTo    = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const FieldGroup = ({ children }) => (
  <div className="rounded-xl border border-surface-200 bg-surface-50/60 p-4">{children}</div>
);

/* ── Import modal: paste plain text resume ──────────────────────────── */
const ImportModal = ({ open, onClose, onImport }) => {
  const [text, setText] = useState('');
  if (!open) return null;

  const handleImport = () => {
    if (!text.trim()) return;
    // Basic parser: extract sections from plain text
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const parsed = { summary: '', skills: [], achievements: [] };

    let currentSection = '';
    for (const line of lines) {
      const up = line.toUpperCase();
      if (/^(SUMMARY|PROFESSIONAL SUMMARY|PROFILE|OBJECTIVE)/.test(up)) { currentSection = 'summary'; continue; }
      if (/^(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES)/.test(up)) { currentSection = 'skills'; continue; }
      if (/^(ACHIEVEMENT|HONORS|AWARDS)/.test(up)) { currentSection = 'achievements'; continue; }
      if (/^(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT)/.test(up)) { currentSection = 'exp'; continue; }
      if (/^(EDUCATION|ACADEMIC)/.test(up)) { currentSection = 'edu'; continue; }
      if (/^[-=]{4,}/.test(line)) continue; // separator line

      if (currentSection === 'summary') {
        parsed.summary = (parsed.summary ? parsed.summary + ' ' : '') + line;
      } else if (currentSection === 'skills') {
        line.split(/[,;|]/).map(s => s.trim()).filter(Boolean)
          .forEach(s => { if (!parsed.skills.includes(s)) parsed.skills.push(s); });
      } else if (currentSection === 'achievements') {
        const clean = line.replace(/^[•\-*]\s*/, '').trim();
        if (clean) parsed.achievements.push(clean);
      }
    }

    // Try to find name from first non-empty line (before any section heading)
    const firstLine = lines[0];
    if (firstLine && !/^(SUMMARY|SKILLS|EXPERIENCE|EDUCATION|PROFILE)/.test(firstLine.toUpperCase())) {
      parsed.fullName = firstLine;
    }

    onImport(parsed);
    setText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="card max-w-lg w-full p-6 space-y-4 animate-fade-up shadow-lift-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-950">Import resume text</h2>
          <button type="button" onClick={onClose} className="text-ink-300 hover:text-ink-600">
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-ink-500">
          Paste your existing resume as plain text. We'll extract your summary, skills, and achievements.
          You can then edit each section in the builder.
        </p>
        <textarea
          className="input min-h-[200px] resize-none text-sm w-full font-mono"
          placeholder="Paste your resume text here…"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="flex gap-2">
          <button type="button" onClick={handleImport} disabled={!text.trim()}
            className="btn-primary flex-1 justify-center">
            <Icon name="sparkles" className="h-4 w-4" />
            Import
          </button>
          <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
            Cancel
          </button>
        </div>
        <p className="text-xs text-ink-400">
          Import fills in Summary, Skills, and Achievements. Experience and Education need to be entered manually.
        </p>
      </div>
    </div>
  );
};

/* ── Main page ──────────────────────────────────────────────────────── */
export const ResumeBuilderPage = () => {
  const { resumeId }  = useParams();
  const navigate      = useNavigate();
  const { premium, exportStatus, refreshExportStatus, refreshPremiumStatus } = useAuth();

  const [resume,    setResume]    = useState(defaultResume);
  const [loading,   setLoading]   = useState(Boolean(resumeId));
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [currentId, setCurrentId] = useState(resumeId || null);
  const [mobileTab, setMobileTab] = useState('edit');
  const [template,  setTemplate]  = useState('classic');
  const [showImport,setShowImport] = useState(false);

  const skillsText       = useMemo(() => (resume.skills       || []).join(', '),  [resume.skills]);
  const achievementsText = useMemo(() => (resume.achievements || []).join('\n'), [resume.achievements]);

  useEffect(() => {
    if (!resumeId) return;
    setLoading(true); setError('');
    getResumeById(resumeId)
      .then((payload) => {
        const normalised = normaliseResume(payload);
        setResume({ ...defaultResume, ...normalised });
        setCurrentId(payload.id || resumeId);
      })
      .catch((err) => setError(formatApiError(err, 'Could not load this resume.')))
      .finally(() => setLoading(false));
  }, [resumeId]);

  const saveResume = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      if (currentId) {
        const p = await updateResume(currentId, resume);
        const n = normaliseResume(p);
        setResume(prev => ({ ...prev, ...n }));
        setSuccess('Resume saved successfully.');
      } else {
        const p  = await createResume(resume);
        const id = p.id || p._id;
        setCurrentId(id);
        const n = normaliseResume(p);
        setResume(prev => ({ ...prev, ...n }));
        setSuccess('Resume created. You can now export it.');
        navigate(`/app/builder/${id}`, { replace: true });
      }
    } catch (err) {
      setError(formatApiError(err, 'Could not save the resume.'));
    } finally { setSaving(false); }
  };

  const handleImport = useCallback((parsed) => {
    setResume(prev => ({
      ...prev,
      fullName:     parsed.fullName     || prev.fullName,
      summary:      parsed.summary      || prev.summary,
      skills:       parsed.skills?.length  ? parsed.skills      : prev.skills,
      achievements: parsed.achievements?.length ? parsed.achievements : prev.achievements,
    }));
    setSuccess('Resume content imported. Review and edit each section below.');
  }, []);

  const refreshStatuses = () => Promise.all([refreshExportStatus(), refreshPremiumStatus()]);

  const top    = (f, v) => setResume(p => ({ ...p, [f]: v }));
  const arr    = (sec, id, f, v) => setResume(p => ({ ...p, [sec]: p[sec].map(x => x.id === id ? { ...x, [f]: v } : x) }));
  const remove = (sec, id) => setResume(p => ({ ...p, [sec]: p[sec].filter(x => x.id !== id) }));

  const addExp  = () => setResume(p => ({ ...p, experience:    [...p.experience,    { id: uid('exp'),  company:'', role:'', startDate:'', endDate:'', location:'', bullets:[] }] }));
  const addProj = () => setResume(p => ({ ...p, projects:      [...p.projects,      { id: uid('proj'), name:'', link:'', description:'' }] }));
  const addEdu  = () => setResume(p => ({ ...p, education:     [...p.education,     { id: uid('edu'),  institution:'', degree:'', startDate:'', endDate:'', field:'' }] }));
  const addCert = () => setResume(p => ({ ...p, certifications:[...p.certifications,{ id: uid('cert'), name:'', issuer:'', year:'' }] }));

  if (loading) return (
    <div className="card flex items-center justify-center py-20">
      <Loader label="Opening resume builder…" size="lg" />
    </div>
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <ImportModal open={showImport} onClose={() => setShowImport(false)} onImport={handleImport} />

      <PageHeader
        eyebrow="Resume builder"
        title={currentId ? 'Edit resume' : 'New resume'}
        description="Fill in your details, preview in real time, then export your resume."
        actions={
          <div className="flex items-center gap-2">
            <button type="button" className="btn-secondary btn-sm"
              onClick={() => setShowImport(true)} title="Import resume text">
              <Icon name="export" className="h-4 w-4 rotate-180" />
              Import
            </button>
            {!currentId && <span className="badge-warning text-xs">Unsaved</span>}
            <button type="button" className="btn-primary" onClick={saveResume} disabled={saving}>
              <Icon name="check" className="h-4 w-4" />
              {saving ? 'Saving…' : currentId ? 'Save changes' : 'Save resume'}
            </button>
          </div>
        }
      />

      <Alert variant="error">{error}</Alert>
      <Alert variant="success">{success}</Alert>

      {!currentId && (
        <Alert variant="warning">
          Save your resume first before exporting. Click "Save resume" above.
        </Alert>
      )}

      {/* Mobile tab toggle */}
      <div className="flex lg:hidden rounded-xl border border-surface-200 bg-surface-50 p-1 gap-1">
        <button type="button" onClick={() => setMobileTab('edit')}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
            mobileTab === 'edit' ? 'bg-white shadow-sm text-ink-950' : 'text-ink-400 hover:text-ink-700'}`}>
          ✏️ Edit
        </button>
        <button type="button" onClick={() => setMobileTab('preview')}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
            mobileTab === 'preview' ? 'bg-white shadow-sm text-ink-950' : 'text-ink-400 hover:text-ink-700'}`}>
          👁 Preview
        </button>
      </div>

      {/* Three-column grid */}
      <div className="grid gap-5 lg:grid-cols-[180px_1fr_320px] xl:grid-cols-[200px_1fr_340px]">

        {/* Col 1: Section nav */}
        <aside className="hidden lg:block">
          <div className="card sticky top-6 p-4">
            <p className="kicker mb-3">Sections</p>
            <nav className="space-y-0.5">
              {builderSections.map((s) => (
                <button key={s.id} type="button"
                  onClick={() => jumpTo(s.id)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-ink-500
                             transition hover:bg-surface-100 hover:text-ink-950">
                  <Icon name={s.icon} className="h-3.5 w-3.5 shrink-0" />
                  <span>{s.label}</span>
                </button>
              ))}
            </nav>
            <div className="mt-4 rounded-xl bg-surface-50 border border-surface-200 p-3.5">
              <p className="kicker mb-2">Tips</p>
              {['Fill all sections', 'Add strong bullets', 'Use AI copilot', 'Save → Export'].map((t) => (
                <p key={t} className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-400">
                  <span className="h-1 w-1 rounded-full bg-brand-400 shrink-0" />{t}
                </p>
              ))}
            </div>
          </div>
        </aside>

        {/* Col 2: Editor */}
        <div className={`space-y-4 min-w-0 ${mobileTab === 'preview' ? 'hidden lg:block' : ''}`}>

          <SectionCard id="basics" eyebrow="Profile" title="Personal information"
            description="Your contact details appear at the top of every resume.">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['fullName',          'Full name',          'text'],
                ['professionalTitle', 'Professional title', 'text'],
                ['email',             'Email',              'email'],
                ['phone',             'Phone',              'tel'],
                ['location',          'Location / City',    'text'],
                ['linkedin',          'LinkedIn URL',       'url'],
                ['github',            'GitHub URL',         'url'],
                ['portfolio',         'Portfolio URL',      'url'],
              ].map(([f, label, type]) => (
                <div key={f} className={f === 'portfolio' ? 'sm:col-span-2' : ''}>
                  <label className="label">{label}</label>
                  <input className="input" type={type}
                    value={resume[f] || ''}
                    onChange={(e) => top(f, e.target.value)} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard id="summary" eyebrow="Summary" title="Professional summary"
            description="A 2-4 sentence overview of your background and target role.">
            <textarea className="input min-h-[100px] resize-none"
              value={resume.summary || ''}
              onChange={(e) => top('summary', e.target.value)}
              placeholder="Write a concise summary of your professional background…" />
          </SectionCard>

          <SectionCard id="skills" eyebrow="Skills" title="Skills"
            description="Comma-separated list. Be specific — add tools, frameworks, and methodologies.">
            <textarea className="input min-h-[80px] resize-none"
              value={skillsText}
              onChange={(e) => top('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              placeholder="React, Node.js, PostgreSQL, Figma, Agile…" />
          </SectionCard>

          <SectionCard id="experience" eyebrow="Experience" title="Work experience"
            description="List your most recent role first."
            action={<button type="button" onClick={addExp} className="btn-secondary btn-sm gap-1"><Icon name="plus" className="h-3.5 w-3.5" />Add role</button>}>
            {(resume.experience || []).map((exp) => (
              <FieldGroup key={exp.id}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[['role','Job title'],['company','Company'],['location','Location'],['startDate','Start date'],['endDate','End date (or "Present")']].map(([f,label]) => (
                    <div key={f}>
                      <label className="label">{label}</label>
                      <input className="input" value={exp[f] || ''} onChange={(e) => arr('experience', exp.id, f, e.target.value)} />
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="label">Bullet points (one per line)</label>
                  <textarea className="input min-h-[80px] resize-none text-xs"
                    value={(exp.bullets || []).join('\n')}
                    onChange={(e) => arr('experience', exp.id, 'bullets', fromLines(e.target.value))}
                    placeholder="• Led a team of 5 engineers to deliver X ahead of schedule&#10;• Reduced load time by 40% through caching" />
                </div>
                <button type="button" onClick={() => remove('experience', exp.id)}
                  className="btn-danger btn-sm mt-2"><Icon name="trash" className="h-3.5 w-3.5" />Remove</button>
              </FieldGroup>
            ))}
          </SectionCard>

          <SectionCard id="projects" eyebrow="Projects" title="Projects"
            action={<button type="button" onClick={addProj} className="btn-secondary btn-sm gap-1"><Icon name="plus" className="h-3.5 w-3.5" />Add project</button>}>
            {(resume.projects || []).map((proj) => (
              <FieldGroup key={proj.id}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><label className="label">Project name</label><input className="input" value={proj.name || ''} onChange={(e) => arr('projects', proj.id, 'name', e.target.value)} /></div>
                  <div><label className="label">Link / URL</label><input className="input" value={proj.link || ''} onChange={(e) => arr('projects', proj.id, 'link', e.target.value)} /></div>
                </div>
                <div className="mt-3"><label className="label">Description</label>
                  <textarea className="input min-h-[60px] resize-none text-xs"
                    value={proj.description || ''} onChange={(e) => arr('projects', proj.id, 'description', e.target.value)} /></div>
                <button type="button" onClick={() => remove('projects', proj.id)} className="btn-danger btn-sm mt-2"><Icon name="trash" className="h-3.5 w-3.5" />Remove</button>
              </FieldGroup>
            ))}
          </SectionCard>

          <SectionCard id="education" eyebrow="Education" title="Education"
            action={<button type="button" onClick={addEdu} className="btn-secondary btn-sm gap-1"><Icon name="plus" className="h-3.5 w-3.5" />Add education</button>}>
            {(resume.education || []).map((edu) => (
              <FieldGroup key={edu.id}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[['institution','Institution'],['degree','Degree'],['field','Field of study'],['startDate','Start year'],['endDate','End year']].map(([f,label]) => (
                    <div key={f}><label className="label">{label}</label><input className="input" value={edu[f] || ''} onChange={(e) => arr('education', edu.id, f, e.target.value)} /></div>
                  ))}
                </div>
                <button type="button" onClick={() => remove('education', edu.id)} className="btn-danger btn-sm mt-2"><Icon name="trash" className="h-3.5 w-3.5" />Remove</button>
              </FieldGroup>
            ))}
          </SectionCard>

          <SectionCard id="certifications" eyebrow="Certifications" title="Certifications"
            action={<button type="button" onClick={addCert} className="btn-secondary btn-sm gap-1"><Icon name="plus" className="h-3.5 w-3.5" />Add</button>}>
            {(resume.certifications || []).map((cert, i) => (
              <div key={i} className="flex gap-2">
                <input className="input flex-1" value={typeof cert === 'string' ? cert : cert.name || ''} placeholder="e.g. AWS Certified Solutions Architect"
                  onChange={(e) => setResume(p => ({ ...p, certifications: p.certifications.map((c, ci) => ci === i ? e.target.value : c) }))} />
                <button type="button" onClick={() => setResume(p => ({ ...p, certifications: p.certifications.filter((_, ci) => ci !== i) }))} className="btn-danger btn-sm p-2"><Icon name="trash" className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </SectionCard>

          <SectionCard id="achievements" eyebrow="Achievements" title="Achievements"
            description="Awards, recognition, and notable accomplishments.">
            <textarea className="input min-h-[80px] resize-none"
              value={achievementsText}
              onChange={(e) => top('achievements', fromLines(e.target.value))}
              placeholder="Won the company hackathon 2024&#10;Led migration to a 40% cost reduction in infrastructure" />
          </SectionCard>
        </div>

        {/* Col 3: Preview + AI + Export */}
        <div className={`space-y-4 ${mobileTab === 'edit' ? 'hidden lg:block' : ''}`}>

          {/* Mobile: AI panel in edit tab */}
          <div className={`lg:hidden space-y-4 ${mobileTab === 'preview' ? 'hidden' : ''}`}>
            <AIActionPanel resume={resume} setResume={setResume} />
            <ExportPanel
              resumeId={currentId} premium={premium} exportStatus={exportStatus}
              selectedTemplate={template} onTemplateChange={setTemplate}
              onExported={() => setSuccess('Your resume has been downloaded!')}
              refreshStatuses={refreshStatuses} />
          </div>

          {/* Mobile: Preview in preview tab */}
          <div className={`lg:hidden space-y-4 ${mobileTab === 'edit' ? 'hidden' : ''}`}>
            <ResumePreview resume={resume} template={template} onTemplateChange={setTemplate} />
            <ExportPanel
              resumeId={currentId} premium={premium} exportStatus={exportStatus}
              selectedTemplate={template} onTemplateChange={setTemplate}
              onExported={() => setSuccess('Your resume has been downloaded!')}
              refreshStatuses={refreshStatuses} />
          </div>

          {/* Desktop: all three panels */}
          <div className="hidden lg:block space-y-4">
            <ResumePreview resume={resume} template={template} onTemplateChange={setTemplate} />
            <AIActionPanel resume={resume} setResume={setResume} />
            <ExportPanel
              resumeId={currentId} premium={premium} exportStatus={exportStatus}
              selectedTemplate={template} onTemplateChange={setTemplate}
              onExported={() => setSuccess('Your resume has been downloaded!')}
              refreshStatuses={refreshStatuses} />
          </div>
        </div>
      </div>
    </div>
  );
};
