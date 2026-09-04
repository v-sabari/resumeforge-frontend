import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createResume, getResumeById, updateResume } from '../services/resumeService';
import { SectionCard } from '../components/builder/SectionCard';
import { CustomSectionEditor } from '../components/builder/CustomSectionEditor';
import ListField from '../components/builder/ListField';
import { Icon } from '../components/icons/Icon';
import { defaultResume, DEFAULT_SECTIONS_CONFIG } from '../utils/constants';
import { formatApiError, normaliseResume, uid } from '../utils/helpers';

const FieldGroup = ({ children }) => (
  <div className="rounded-xl border border-surface-200 bg-surface-50/60 p-4 space-y-3">
    {children}
  </div>
);

/**
 * useResumeEditor
 *
 * ALL of the resume-editing state and logic (load / save / field mutators
 * / section content renderers) lives here, in exactly one place. It used
 * to live inline inside ResumeBuilderPage.jsx; it's been extracted,
 * unchanged in behavior, so that BOTH the Editor page and the new
 * Sections page can share the SAME live resume object via one Context
 * Provider (see context/ResumeEditorContext.jsx) instead of each having
 * their own copy.
 *
 * This is what makes "real-time sync" between the Sections page and the
 * Resume Preview actually real-time and 100% correct: there is only ever
 * ONE `resume` state instance in memory for a given builder session. The
 * Sections page's Add/Edit/Delete/Reorder actions call the exact same
 * `setSectionsConfig` that the Preview panel reads from — there is no
 * serialization, no re-fetch, and no possibility of the two drifting
 * apart while you're on the Sections page. When you Save, that same
 * object is what's persisted and what PDF export reads back — so preview,
 * sections editing, and the exported file can never disagree.
 */
export function useResumeEditor(resumeId) {
  const navigate = useNavigate();
  const { premium, exportStatus, refreshExportStatus, refreshPremiumStatus } = useAuth();

  const [resume,      setResume]      = useState({ ...defaultResume, template: 'modern' });
  const [loading,     setLoading]     = useState(Boolean(resumeId));
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');
  const [currentId,   setCurrentId]   = useState(resumeId || null);
  const [template,    setTemplate]    = useState('modern');

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

  const visibleSections = sectionsConfig.filter((s) => s.visible);

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

  /* ── CHAT-01: prefill a fresh resume from the Premium Chat Builder ──
     When the user generates a resume in the Voice/Chat builder and clicks
     "Open in Builder", the generated object is kept in sessionStorage under
     `chat_resume_draft`. On mount of a NEW resume (no resumeId), we merge
     it in so the builder opens already populated, then clear the key so it
     only applies once. */
  useEffect(() => {
    if (resumeId) return;
    const raw = sessionStorage.getItem('chat_resume_draft');
    if (!raw) return;
    sessionStorage.removeItem('chat_resume_draft');
    try {
      const draft = JSON.parse(raw);
      if (!draft || typeof draft !== 'object') return;
      const withIds = (arr, prefix) => (Array.isArray(arr) ? arr.map((it) => ({ id: it?.id || uid(prefix), ...it })) : []);
      setResume((prev) => ({
        ...prev,
        fullName:        draft.fullName        || prev.fullName,
        professionalTitle: draft.professionalTitle || prev.professionalTitle,
        email:           draft.email           || prev.email,
        phone:           draft.phone           || prev.phone,
        location:        draft.location        || prev.location,
        summary:         draft.summary         || prev.summary,
        skills:          Array.isArray(draft.skills) ? draft.skills : prev.skills,
        achievements:    Array.isArray(draft.achievements) ? draft.achievements : prev.achievements,
        experience:      withIds(draft.experience, 'exp'),
        projects:        withIds(draft.projects, 'proj'),
        education:       withIds(draft.education, 'edu'),
        certifications:  withIds(draft.certifications, 'cert'),
      }));
      setSuccess('Your AI-generated resume is ready. Review and edit below.');
    } catch {
      /* ignore malformed draft */
    }
  }, [resumeId, setSuccess]);

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

  /* ════════════════════════════════════════════════════════════════
     SECTION RENDERERS — identical to the original inline versions.
     ════════════════════════════════════════════════════════════════ */

  const renderStandard = (sec) => {
    switch (sec.key) {

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

      case 'summary': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Summary" title={sec.label}
          description="A 2–4 sentence overview of your background and target role.">
          <textarea className="input min-h-[100px] resize-none" value={resume.summary || ''}
            onChange={(e) => top('summary', e.target.value)}
            placeholder="Write a concise summary of your professional background…" />
        </SectionCard>
      );

      case 'skills': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Skills" title={sec.label}
          description="One skill per line. Tools, frameworks, methodologies.">
          <ListField className="input min-h-[100px] resize-none" value={resume.skills}
            onChange={(v) => top('skills', v)}
            placeholder={"React\nNode.js\nPostgreSQL\nFigma\nAgile"} />
        </SectionCard>
      );

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
              <div><label className="label">Role summary</label>
                <textarea className="input min-h-[80px] resize-none text-sm" value={exp.summary||''}
                  onChange={(e)=>arr('experience',exp.id,'summary',e.target.value)}
                  placeholder="One or two lines describing scope and focus."/></div>
              <div><label className="label">Bullet points (one per line)</label>
                <ListField className="input min-h-[100px] resize-none text-sm"
                  value={exp.bullets}
                  onChange={(v)=>arr('experience',exp.id,'bullets',v)}
                  placeholder={"Led a team of 4 engineers to ship X\nImproved API latency by 35%"}/></div>
            </FieldGroup>
          ))}
        </SectionCard>
      );

      case 'projects': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Projects" title={sec.label}
          description="Personal, academic, or freelance projects worth highlighting."
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
                <ListField className="input min-h-[100px] resize-none text-sm"
                  value={proj.highlights}
                  onChange={(v)=>arr('projects',proj.id,'highlights',v)}
                  placeholder={"Implemented JWT auth\nBuilt ATS scoring workflow\nDeployed on AWS"}/></div>
            </FieldGroup>
          ))}
        </SectionCard>
      );

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

      case 'achievements': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Achievements" title={sec.label}
          description="One achievement per line. Awards, recognition, and notable accomplishments.">
          <ListField className="input min-h-[100px] resize-none" value={resume.achievements}
            onChange={(v) => top('achievements', v)}
            placeholder={"Won company hackathon 2024\nLed migration reducing costs by 40%"} />
        </SectionCard>
      );

      case 'languages': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Languages" title={sec.label}
          description="One language per line. Include proficiency levels.">
          <ListField className="input min-h-[80px] resize-none" value={resume.languages}
            onChange={(v) => top('languages', v)}
            placeholder={"English — Fluent\nTamil — Native\nHindi — Intermediate"} />
        </SectionCard>
      );

      default:
        return renderCustom(sec);
    }
  };

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

  return {
    // state
    resume, setResume, loading, saving, error, setError, success, setSuccess,
    currentId, template, setTemplate,
    sectionsConfig, setSectionsConfig, visibleSections,
    premium, exportStatus,
    // actions
    saveResume, handleImport, refreshStatuses,
    top, arr, removeItem, addExp, addProj, addEdu, addCert, updateCert, removeCert,
    getCustomContent, setCustomContent,
    // renderers
    renderStandard, renderCustom,
  };
}
