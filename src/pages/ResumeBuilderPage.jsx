import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { SectionCard } from '../components/builder/SectionCard';
import { ResumePreview } from '../components/builder/ResumePreview';
import { AIActionPanel } from '../components/builder/AIActionPanel';
import { ExportPanel } from '../components/builder/ExportPanel';
import { useAuth } from '../context/AuthContext';
import { createResume, getResumeById, updateResume } from '../services/resumeService';
import { builderSections, defaultResume } from '../utils/constants';
import { formatApiError, toArray, uid } from '../utils/helpers';
import { Icon } from '../components/icons/Icon';

const fromLines = (v) => v.split('\n').map((s) => s.trim()).filter(Boolean);
const jumpTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const FieldGroup = ({ children }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">{children}</div>
);

export const ResumeBuilderPage = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { premium, refreshExportStatus, refreshPremiumStatus } = useAuth();

  const [resume,    setResume]    = useState(defaultResume);
  const [loading,   setLoading]   = useState(Boolean(resumeId));
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [currentId, setCurrentId] = useState(resumeId || null);

  const skillsText       = useMemo(() => (resume.skills       || []).join(', '),  [resume.skills]);
  const achievementsText = useMemo(() => (resume.achievements || []).join('\n'), [resume.achievements]);

  useEffect(() => {
    if (!resumeId) return;
    setLoading(true); setError('');
    getResumeById(resumeId)
      .then((payload) => {
        setResume({ ...defaultResume, ...payload });
        setCurrentId(payload.id || payload._id || resumeId);
      })
      .catch((err) => setError(formatApiError(err, 'Could not load this resume.')))
      .finally(() => setLoading(false));
  }, [resumeId]);

  const saveResume = async () => {
    setSaving(true); setError(''); setSuccess('');
    try {
      if (currentId) {
        const p = await updateResume(currentId, resume);
        setResume((prev) => ({ ...prev, ...p }));
        setSuccess('Resume saved.');
      } else {
        const p = await createResume(resume);
        const id = p.id || p._id;
        setCurrentId(id);
        setResume((prev) => ({ ...prev, ...p }));
        setSuccess('Resume created.');
        navigate(`/app/builder/${id}`, { replace: true });
      }
    } catch (err) {
      setError(formatApiError(err, 'Could not save the resume.'));
    } finally { setSaving(false); }
  };

  const refreshStatuses = () => Promise.all([refreshExportStatus(), refreshPremiumStatus()]);
  const top    = (f, v) => setResume((p) => ({ ...p, [f]: v }));
  const arr    = (sec, id, f, v) => setResume((p) => ({ ...p, [sec]: p[sec].map((x) => x.id === id ? { ...x, [f]: v } : x) }));
  const remove = (sec, id) => setResume((p) => ({ ...p, [sec]: p[sec].filter((x) => x.id !== id) }));
  const addExp  = () => setResume((p) => ({ ...p, experience:    [...p.experience,    { id: uid('exp'),  company: '', role: '', startDate: '', endDate: '', location: '', bullets: [''] }] }));
  const addProj = () => setResume((p) => ({ ...p, projects:      [...p.projects,      { id: uid('proj'), name: '', link: '', description: '' }] }));
  const addEdu  = () => setResume((p) => ({ ...p, education:     [...p.education,     { id: uid('edu'),  institution: '', degree: '', startDate: '', endDate: '', location: '', field: '' }] }));
  const addCert = () => setResume((p) => ({ ...p, certifications:[...p.certifications,{ id: uid('cert'), name: '', issuer: '', year: '' }] }));

  if (loading) {
    return <div className="card flex items-center justify-center py-16"><Loader label="Opening builder…" /></div>;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Resume builder"
        title="Build with a clean editor and live preview"
        description="Section-based editing, AI copilot, and a live ATS preview — all in one workspace."
        actions={
          <button type="button" className="btn-primary" onClick={saveResume} disabled={saving}>
            <Icon name="check" className="h-4 w-4" />
            {saving ? 'Saving…' : 'Save resume'}
          </button>
        }
      />

      <Alert variant="error">{error}</Alert>
      <Alert variant="success">{success}</Alert>

      {/* Three-column grid */}
      <div className="grid gap-5 xl:grid-cols-[200px_1fr_360px]">

        {/* Col 1: Section nav */}
        <aside className="hidden xl:block">
          <div className="card sticky top-6 p-4">
            <p className="kicker mb-3">Sections</p>
            <nav className="space-y-0.5">
              {builderSections.map((s) => (
                <button key={s.id} type="button"
                  onClick={() => jumpTo(s.id)}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
                  <span>{s.label}</span>
                  <Icon name="arrowRight" className="h-3.5 w-3.5 text-slate-400" />
                </button>
              ))}
            </nav>
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <p className="kicker mb-2">Checklist</p>
              {['Fill basics', 'Add strong bullets', 'Review preview', 'Save then export'].map((t) => (
                <p key={t} className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="h-1 w-1 rounded-full bg-slate-300" />{t}
                </p>
              ))}
            </div>
          </div>
        </aside>

        {/* Col 2: Editor sections */}
        <div className="space-y-4 min-w-0">
          {/* Personal info */}
          <SectionCard id="basics" eyebrow="Profile" title="Personal information" description="Sharp header, scannable contact details.">
            <div className="grid gap-4 sm:grid-cols-2">
              {[['fullName','Full name'],['professionalTitle','Professional title'],['email','Email'],['phone','Phone'],['location','Location'],['linkedin','LinkedIn'],['github','GitHub'],['portfolio','Portfolio']].map(([f, label]) => (
                <div key={f} className={f === 'portfolio' ? 'sm:col-span-2' : ''}>
                  <label className="label">{label}</label>
                  <input className="input" value={resume[f] || ''} onChange={(e) => top(f, e.target.value)} />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Summary */}
          <SectionCard id="summary" eyebrow="Pitch" title="Professional summary" description="Concise story about your value, scope, and impact.">
            <label className="label">Summary</label>
            <textarea className="input min-h-36 resize-y" value={resume.summary || ''} onChange={(e) => top('summary', e.target.value)} placeholder="Product designer with 7+ years…" />
          </SectionCard>

          {/* Skills */}
          <SectionCard id="skills" eyebrow="Strengths" title="Skills" description="Comma-separated keywords improve ATS coverage.">
            <label className="label">Skills (comma-separated)</label>
            <input className="input" value={skillsText} onChange={(e) => top('skills', toArray(e.target.value))} placeholder="React, TypeScript, Figma, Leadership" />
          </SectionCard>

          {/* Experience */}
          <SectionCard id="experience" eyebrow="Career" title="Experience" description="Outcomes, tools, and context per role."
            actions={<button type="button" className="btn-secondary text-xs py-2 gap-1" onClick={addExp}><Icon name="plus" className="h-3.5 w-3.5"/>Add</button>}>
            <div className="space-y-4">
              {resume.experience.map((x) => (
                <FieldGroup key={x.id}>
                  <div className="mb-3 flex justify-end">
                    <button type="button" className="text-xs font-medium text-rose-600 hover:text-rose-700" onClick={() => remove('experience', x.id)}>Remove</button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[['role','Role'],['company','Company'],['startDate','Start date'],['endDate','End date'],['location','Location']].map(([f, label]) => (
                      <div key={f} className={f === 'location' ? 'sm:col-span-2' : ''}>
                        <label className="label">{label}</label>
                        <input className="input" value={x[f] || ''} onChange={(e) => arr('experience', x.id, f, e.target.value)} />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="label">Bullets (one per line)</label>
                      <textarea className="input min-h-28 resize-y" value={(x.bullets || []).join('\n')}
                        onChange={(e) => arr('experience', x.id, 'bullets', fromLines(e.target.value))} />
                    </div>
                  </div>
                </FieldGroup>
              ))}
              {resume.experience.length === 0 && <p className="py-4 text-center text-sm text-slate-400">No experience added. Click "Add" above.</p>}
            </div>
          </SectionCard>

          {/* Projects */}
          <SectionCard id="projects" eyebrow="Proof of work" title="Projects" description="Shipped work, case studies, or side projects."
            actions={<button type="button" className="btn-secondary text-xs py-2 gap-1" onClick={addProj}><Icon name="plus" className="h-3.5 w-3.5"/>Add</button>}>
            <div className="space-y-4">
              {resume.projects.map((x) => (
                <FieldGroup key={x.id}>
                  <div className="mb-3 flex justify-end">
                    <button type="button" className="text-xs font-medium text-rose-600 hover:text-rose-700" onClick={() => remove('projects', x.id)}>Remove</button>
                  </div>
                  <div className="grid gap-3">
                    {[['name','Project name'],['link','Project link']].map(([f, label]) => (
                      <div key={f}>
                        <label className="label">{label}</label>
                        <input className="input" value={x[f] || ''} onChange={(e) => arr('projects', x.id, f, e.target.value)} />
                      </div>
                    ))}
                    <div>
                      <label className="label">Description</label>
                      <textarea className="input min-h-24 resize-y" value={x.description || ''} onChange={(e) => arr('projects', x.id, 'description', e.target.value)} />
                    </div>
                  </div>
                </FieldGroup>
              ))}
              {resume.projects.length === 0 && <p className="py-4 text-center text-sm text-slate-400">No projects added. Click "Add" above.</p>}
            </div>
          </SectionCard>

          {/* Education */}
          <SectionCard id="education" eyebrow="Background" title="Education" description="Degrees, institutions, and timeline."
            actions={<button type="button" className="btn-secondary text-xs py-2 gap-1" onClick={addEdu}><Icon name="plus" className="h-3.5 w-3.5"/>Add</button>}>
            <div className="space-y-4">
              {resume.education.map((x) => (
                <FieldGroup key={x.id}>
                  <div className="mb-3 flex justify-end">
                    <button type="button" className="text-xs font-medium text-rose-600 hover:text-rose-700" onClick={() => remove('education', x.id)}>Remove</button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[['institution','Institution'],['degree','Degree'],['startDate','Start year'],['endDate','End year'],['location','Location']].map(([f, label]) => (
                      <div key={f} className={f === 'location' ? 'sm:col-span-2' : ''}>
                        <label className="label">{label}</label>
                        <input className="input" value={x[f] || ''} onChange={(e) => arr('education', x.id, f, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </FieldGroup>
              ))}
              {resume.education.length === 0 && <p className="py-4 text-center text-sm text-slate-400">No education added. Click "Add" above.</p>}
            </div>
          </SectionCard>

          {/* Certifications */}
          <SectionCard id="certifications" eyebrow="Credentials" title="Certifications" description="Relevant credentials that build trust."
            actions={<button type="button" className="btn-secondary text-xs py-2 gap-1" onClick={addCert}><Icon name="plus" className="h-3.5 w-3.5"/>Add</button>}>
            <div className="space-y-4">
              {resume.certifications.map((x) => (
                <FieldGroup key={x.id}>
                  <div className="mb-3 flex justify-end">
                    <button type="button" className="text-xs font-medium text-rose-600 hover:text-rose-700" onClick={() => remove('certifications', x.id)}>Remove</button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[['name','Certification'],['issuer','Issuer'],['year','Year']].map(([f, label]) => (
                      <div key={f}>
                        <label className="label">{label}</label>
                        <input className="input" value={x[f] || ''} onChange={(e) => arr('certifications', x.id, f, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </FieldGroup>
              ))}
              {resume.certifications.length === 0 && <p className="py-4 text-center text-sm text-slate-400">No certifications added. Click "Add" above.</p>}
            </div>
          </SectionCard>

          {/* Achievements */}
          <SectionCard id="achievements" eyebrow="Highlights" title="Achievements" description="One line per achievement keeps the section crisp.">
            <label className="label">Achievements (one per line)</label>
            <textarea className="input min-h-28 resize-y" value={achievementsText}
              onChange={(e) => top('achievements', fromLines(e.target.value))}
              placeholder="Speaker at SaaS Design Summit 2024…" />
          </SectionCard>

          {/* Mobile-only AI + Export panels */}
          <div className="xl:hidden space-y-4">
            <AIActionPanel resume={resume} setResume={setResume} />
            <ExportPanel resumeId={currentId} premium={premium} onExported={() => setSuccess('Export recorded.')} refreshStatuses={refreshStatuses} />
          </div>
        </div>

        {/* Col 3: Preview + AI + Export (desktop only) */}
        <div className="hidden xl:flex xl:flex-col xl:gap-4">
          <ResumePreview resume={resume} />
          <AIActionPanel resume={resume} setResume={setResume} />
          <ExportPanel resumeId={currentId} premium={premium} onExported={() => setSuccess('Export recorded.')} refreshStatuses={refreshStatuses} />
        </div>
      </div>
    </div>
  );
};
