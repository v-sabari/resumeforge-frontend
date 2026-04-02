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

const arrayFromLines = (v) => v.split('\n').map((s) => s.trim()).filter(Boolean);

const FieldRow = ({ children }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">{children}</div>
);

export const ResumeBuilderPage = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { premium, refreshExportStatus, refreshPremiumStatus } = useAuth();
  const [resume, setResume] = useState(defaultResume);
  const [loading, setLoading] = useState(Boolean(resumeId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentId, setCurrentId] = useState(resumeId || null);

  const achievementsText = useMemo(() => (resume.achievements || []).join('\n'), [resume.achievements]);
  const skillsText = useMemo(() => (resume.skills || []).join(', '), [resume.skills]);

  useEffect(() => {
    if (!resumeId) return;
    setLoading(true);
    setError('');
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
        const payload = await updateResume(currentId, resume);
        setResume((p) => ({ ...p, ...payload }));
        setSuccess('Resume saved.');
      } else {
        const payload = await createResume(resume);
        const id = payload.id || payload._id;
        setCurrentId(id);
        setResume((p) => ({ ...p, ...payload }));
        setSuccess('Resume created.');
        navigate(`/app/builder/${id}`, { replace: true });
      }
    } catch (err) {
      setError(formatApiError(err, 'Could not save the resume.'));
    } finally {
      setSaving(false);
    }
  };

  const refreshStatuses = () => Promise.all([refreshExportStatus(), refreshPremiumStatus()]);
  const updateTopField = (field, value) => setResume((p) => ({ ...p, [field]: value }));
  const updateArrayItem = (section, id, field, value) =>
    setResume((p) => ({ ...p, [section]: p[section].map((item) => item.id === id ? { ...item, [field]: value } : item) }));
  const removeItem = (section, id) =>
    setResume((p) => ({ ...p, [section]: p[section].filter((item) => item.id !== id) }));
  const addExperience = () => setResume((p) => ({ ...p, experience: [...p.experience, { id: uid('exp'), company: '', role: '', startDate: '', endDate: '', location: '', bullets: [''] }] }));
  const addProject = () => setResume((p) => ({ ...p, projects: [...p.projects, { id: uid('proj'), name: '', link: '', description: '' }] }));
  const addEducation = () => setResume((p) => ({ ...p, education: [...p.education, { id: uid('edu'), institution: '', degree: '', startDate: '', endDate: '', location: '', field: '' }] }));
  const addCertification = () => setResume((p) => ({ ...p, certifications: [...p.certifications, { id: uid('cert'), name: '', issuer: '', year: '' }] }));
  const handleExported = () => setSuccess('Export recorded successfully.');
  const jumpTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-14">
        <Loader label="Opening resume builder..." />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-10 animate-fade-in-up">
      <PageHeader
        eyebrow="Resume builder"
        title="Build with a clean editor and live preview"
        description="Structured sections, drag-to-reorder, AI copilot, and ATS-friendly preview — all in one workspace."
        actions={
          <button type="button" className="btn-primary" onClick={saveResume} disabled={saving}>
            <Icon name="check" className="h-4 w-4" />
            {saving ? 'Saving…' : 'Save resume'}
          </button>
        }
      />

      <Alert variant="error">{error}</Alert>
      <Alert variant="success">{success}</Alert>

      {/* Main builder grid */}
      <div className="grid gap-5 xl:grid-cols-[220px_1fr_380px]">

        {/* Section nav sidebar */}
        <aside className="hidden xl:block">
          <div className="card sticky top-20 p-4">
            <p className="eyebrow mb-3">Sections</p>
            <nav className="space-y-0.5">
              {builderSections.map((section) => (
                <button key={section.id} type="button"
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                  onClick={() => jumpTo(section.id)}>
                  <span>{section.label}</span>
                  <Icon name="arrowRight" className="h-3.5 w-3.5 text-slate-400" />
                </button>
              ))}
            </nav>
            <div className="mt-5 rounded-xl bg-slate-50 p-3.5 border border-slate-200">
              <p className="eyebrow mb-2">Checklist</p>
              <ul className="space-y-1.5 text-xs text-slate-500">
                {['Fill basics', 'Write strong bullets', 'Review preview', 'Save before export'].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-slate-300" />{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Editor sections */}
        <div className="space-y-4 min-w-0">
          {/* Personal info */}
          <SectionCard id="basics" eyebrow="Profile" title="Personal information"
            description="Keep your header sharp, scannable, and recruiter-friendly.">
            <div className="grid gap-4 sm:grid-cols-2">
              {[['fullName','Full name'],['professionalTitle','Professional title'],['email','Email'],['phone','Phone'],['location','Location'],['linkedin','LinkedIn'],['github','GitHub'],['portfolio','Portfolio']].map(([field, label]) => (
                <div key={field} className={field === 'portfolio' ? 'sm:col-span-2' : ''}>
                  <label className="label">{label}</label>
                  <input className="input" value={resume[field] || ''} onChange={(e) => updateTopField(field, e.target.value)} />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Summary */}
          <SectionCard id="summary" eyebrow="Pitch" title="Professional summary"
            description="Lead with a concise story about your value, scope, and measurable impact.">
            <label className="label">Summary</label>
            <textarea className="input min-h-36 resize-y" value={resume.summary || ''} onChange={(e) => updateTopField('summary', e.target.value)} />
          </SectionCard>

          {/* Skills */}
          <SectionCard id="skills" eyebrow="Strengths" title="Skills"
            description="Add focused keywords to improve scanability and ATS coverage.">
            <label className="label">Skills (comma-separated)</label>
            <input className="input" value={skillsText} onChange={(e) => updateTopField('skills', toArray(e.target.value))} placeholder="React, TypeScript, Figma, Product Strategy" />
          </SectionCard>

          {/* Experience */}
          <SectionCard id="experience" eyebrow="Career" title="Experience"
            description="Organize each role around outcomes, tools, and context."
            actions={<button type="button" className="btn-secondary text-xs py-2" onClick={addExperience}><Icon name="plus" className="h-3.5 w-3.5" />Add</button>}>
            <div className="space-y-4">
              {resume.experience.map((item) => (
                <FieldRow key={item.id}>
                  <div className="mb-3 flex justify-end">
                    <button type="button" className="text-xs font-semibold text-rose-600 hover:text-rose-700" onClick={() => removeItem('experience', item.id)}>Remove</button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[['role','Role'],['company','Company'],['startDate','Start date'],['endDate','End date'],['location','Location']].map(([field, label]) => (
                      <div key={field} className={field === 'location' ? 'sm:col-span-2' : ''}>
                        <label className="label">{label}</label>
                        <input className="input" value={item[field] || ''} onChange={(e) => updateArrayItem('experience', item.id, field, e.target.value)} />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="label">Bullets (one per line)</label>
                      <textarea className="input min-h-28 resize-y" value={(item.bullets || []).join('\n')}
                        onChange={(e) => updateArrayItem('experience', item.id, 'bullets', arrayFromLines(e.target.value))} />
                    </div>
                  </div>
                </FieldRow>
              ))}
              {resume.experience.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No experience added yet. Click "Add" above.</p>
              )}
            </div>
          </SectionCard>

          {/* Projects */}
          <SectionCard id="projects" eyebrow="Proof of work" title="Projects"
            description="Highlight relevant shipped work, side projects, or case studies."
            actions={<button type="button" className="btn-secondary text-xs py-2" onClick={addProject}><Icon name="plus" className="h-3.5 w-3.5" />Add</button>}>
            <div className="space-y-4">
              {resume.projects.map((item) => (
                <FieldRow key={item.id}>
                  <div className="mb-3 flex justify-end">
                    <button type="button" className="text-xs font-semibold text-rose-600 hover:text-rose-700" onClick={() => removeItem('projects', item.id)}>Remove</button>
                  </div>
                  <div className="grid gap-3">
                    {[['name','Project name'],['link','Project link']].map(([field, label]) => (
                      <div key={field}>
                        <label className="label">{label}</label>
                        <input className="input" value={item[field] || ''} onChange={(e) => updateArrayItem('projects', item.id, field, e.target.value)} />
                      </div>
                    ))}
                    <div>
                      <label className="label">Description</label>
                      <textarea className="input min-h-24 resize-y" value={item.description || ''} onChange={(e) => updateArrayItem('projects', item.id, 'description', e.target.value)} />
                    </div>
                  </div>
                </FieldRow>
              ))}
              {resume.projects.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No projects added yet. Click "Add" above.</p>
              )}
            </div>
          </SectionCard>

          {/* Education */}
          <SectionCard id="education" eyebrow="Background" title="Education"
            description="Add degree details, timeline, and institution context."
            actions={<button type="button" className="btn-secondary text-xs py-2" onClick={addEducation}><Icon name="plus" className="h-3.5 w-3.5" />Add</button>}>
            <div className="space-y-4">
              {resume.education.map((item) => (
                <FieldRow key={item.id}>
                  <div className="mb-3 flex justify-end">
                    <button type="button" className="text-xs font-semibold text-rose-600 hover:text-rose-700" onClick={() => removeItem('education', item.id)}>Remove</button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[['institution','Institution'],['degree','Degree'],['startDate','Start year'],['endDate','End year'],['location','Location']].map(([field, label]) => (
                      <div key={field} className={field === 'location' ? 'sm:col-span-2' : ''}>
                        <label className="label">{label}</label>
                        <input className="input" value={item[field] || ''} onChange={(e) => updateArrayItem('education', item.id, field, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </FieldRow>
              ))}
              {resume.education.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No education added yet. Click "Add" above.</p>
              )}
            </div>
          </SectionCard>

          {/* Certifications */}
          <SectionCard id="certifications" eyebrow="Credentials" title="Certifications"
            description="Keep certifications tidy and easy to scan."
            actions={<button type="button" className="btn-secondary text-xs py-2" onClick={addCertification}><Icon name="plus" className="h-3.5 w-3.5" />Add</button>}>
            <div className="space-y-4">
              {resume.certifications.map((item) => (
                <FieldRow key={item.id}>
                  <div className="mb-3 flex justify-end">
                    <button type="button" className="text-xs font-semibold text-rose-600 hover:text-rose-700" onClick={() => removeItem('certifications', item.id)}>Remove</button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[['name','Certification'],['issuer','Issuer'],['year','Year']].map(([field, label]) => (
                      <div key={field}>
                        <label className="label">{label}</label>
                        <input className="input" value={item[field] || ''} onChange={(e) => updateArrayItem('certifications', item.id, field, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </FieldRow>
              ))}
              {resume.certifications.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No certifications added yet. Click "Add" above.</p>
              )}
            </div>
          </SectionCard>

          {/* Achievements */}
          <SectionCard id="achievements" eyebrow="Highlights" title="Achievements"
            description="One line per achievement keeps this section crisp and easy to scan.">
            <label className="label">Achievements (one per line)</label>
            <textarea className="input min-h-28 resize-y" value={achievementsText}
              onChange={(e) => updateTopField('achievements', arrayFromLines(e.target.value))}
              placeholder="Speaker at SaaS Design Summit 2024 on scalable systems thinking." />
          </SectionCard>

          {/* Mobile AI + Export panels */}
          <div className="xl:hidden space-y-4">
            <AIActionPanel resume={resume} setResume={setResume} />
            <ExportPanel resumeId={currentId} premium={premium} onExported={handleExported} refreshStatuses={refreshStatuses} />
          </div>
        </div>

        {/* Right column: Preview + AI + Export (desktop) */}
        <div className="hidden xl:flex xl:flex-col xl:gap-4">
          <ResumePreview resume={resume} />
          <AIActionPanel resume={resume} setResume={setResume} />
          <ExportPanel resumeId={currentId} premium={premium} onExported={handleExported} refreshStatuses={refreshStatuses} />
        </div>
      </div>
    </div>
  );
};
