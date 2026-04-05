import { useEffect, useMemo, useState } from 'react';
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
import { Icon } from '../components/icons/Icon';
import { defaultResume, builderSections } from '../utils/constants';
import { formatApiError, normaliseResume, toArray, uid } from '../utils/helpers';

const fromLines = (v) => v.split('\n').map((s) => s.trim()).filter(Boolean);
const jumpTo    = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const FieldGroup = ({ children }) => (
  <div className="rounded-xl border border-surface-200 bg-surface-50/60 p-4">{children}</div>
);

export const ResumeBuilderPage = () => {
  const { resumeId }                                    = useParams();
  const navigate                                        = useNavigate();
  const { premium, exportStatus, refreshExportStatus, refreshPremiumStatus } = useAuth();

  // BUG FIX: defaultResume is now empty — no more pre-filled "Aarav Mehta" data
  const [resume,    setResume]    = useState(defaultResume);
  const [loading,   setLoading]   = useState(Boolean(resumeId));
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [currentId, setCurrentId] = useState(resumeId || null);
  // Mobile tab: 'edit' | 'preview'
  const [mobileTab, setMobileTab] = useState('edit');

  const skillsText       = useMemo(() => (resume.skills       || []).join(', '),  [resume.skills]);
  const achievementsText = useMemo(() => (resume.achievements || []).join('\n'), [resume.achievements]);

  // Load existing resume if editing
  useEffect(() => {
    if (!resumeId) return;
    setLoading(true); setError('');
    getResumeById(resumeId)
      .then((payload) => {
        // BUG FIX: normaliseResume properly maps API shape (experiences→experience, etc.)
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
        setResume((prev) => ({ ...prev, ...n }));
        setSuccess('Resume saved successfully.');
      } else {
        const p  = await createResume(resume);
        const id = p.id || p._id;
        setCurrentId(id);
        const n = normaliseResume(p);
        setResume((prev) => ({ ...prev, ...n }));
        setSuccess('Resume created. You can now export it.');
        navigate(`/app/builder/${id}`, { replace: true });
      }
    } catch (err) {
      setError(formatApiError(err, 'Could not save the resume.'));
    } finally {
      setSaving(false); }
  };

  const refreshStatuses = () => Promise.all([refreshExportStatus(), refreshPremiumStatus()]);
  const top    = (f, v) => setResume((p) => ({ ...p, [f]: v }));
  const arr    = (sec, id, f, v) => setResume((p) => ({ ...p, [sec]: p[sec].map((x) => x.id === id ? { ...x, [f]: v } : x) }));
  const remove = (sec, id) => setResume((p) => ({ ...p, [sec]: p[sec].filter((x) => x.id !== id) }));

  const addExp  = () => setResume((p) => ({ ...p, experience:    [...p.experience,    { id: uid('exp'),  company:'', role:'', startDate:'', endDate:'', location:'', bullets:[] }] }));
  const addProj = () => setResume((p) => ({ ...p, projects:      [...p.projects,      { id: uid('proj'), name:'', link:'', description:'' }] }));
  const addEdu  = () => setResume((p) => ({ ...p, education:     [...p.education,     { id: uid('edu'),  institution:'', degree:'', startDate:'', endDate:'', field:'' }] }));
  const addCert = () => setResume((p) => ({ ...p, certifications:[...p.certifications,{ id: uid('cert'), name:'', issuer:'', year:'' }] }));

  if (loading) return (
    <div className="card flex items-center justify-center py-20">
      <Loader label="Opening resume builder…" size="lg" />
    </div>
  );

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        eyebrow="Resume builder"
        title={currentId ? 'Edit resume' : 'New resume'}
        description="Fill in your details, preview in real time, then export your PDF."
        actions={
          <div className="flex items-center gap-2">
            {!currentId && (
              <span className="badge-warning text-xs">Unsaved</span>
            )}
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

      {/* ── Mobile / tablet tab toggle (below lg) ─────────────────── */}
      <div className="flex lg:hidden rounded-xl border border-surface-200 bg-surface-50 p-1 gap-1">
        <button
          type="button"
          onClick={() => setMobileTab('edit')}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
            mobileTab === 'edit'
              ? 'bg-white shadow-sm text-ink-950'
              : 'text-ink-400 hover:text-ink-700'
          }`}>
          ✏️ Edit
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
            mobileTab === 'preview'
              ? 'bg-white shadow-sm text-ink-950'
              : 'text-ink-400 hover:text-ink-700'
          }`}>
          👁 Preview
        </button>
      </div>

      {/* Three-column grid — visible on lg+ */}
      <div className="grid gap-5 lg:grid-cols-[180px_1fr_320px] xl:grid-cols-[200px_1fr_340px]">

        {/* Col 1: Section nav (desktop lg+) */}
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

            {/* Save hint */}
            <div className="mt-5 rounded-xl bg-surface-50 border border-surface-200 p-3.5">
              <p className="kicker mb-2">Tips</p>
              {['Fill all sections', 'Add strong bullets', 'Use AI copilot', 'Save → Export'].map((t) => (
                <p key={t} className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-400">
                  <span className="h-1 w-1 rounded-full bg-brand-400 shrink-0" />{t}
                </p>
              ))}
            </div>
          </div>
        </aside>

        {/* Col 2: Editor sections */}
        <div className={`space-y-4 min-w-0 ${mobileTab === 'preview' ? 'hidden lg:block' : ''}`}>

          {/* Personal info */}
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

          {/* Summary */}
          <SectionCard id="summary" eyebrow="Pitch" title="Professional summary"
            description="2–4 sentences about your value, expertise, and impact.">
            <label className="label">Summary</label>
            <textarea className="input min-h-36 resize-y"
              value={resume.summary || ''}
              onChange={(e) => top('summary', e.target.value)}
              placeholder="Product designer with 7+ years of experience building SaaS platforms…" />
          </SectionCard>

          {/* Skills */}
          <SectionCard id="skills" eyebrow="Strengths" title="Skills"
            description="Comma-separated. Improve ATS coverage with relevant keywords.">
            <label className="label">Skills (comma-separated)</label>
            <input className="input"
              value={skillsText}
              onChange={(e) => top('skills', toArray(e.target.value))}
              placeholder="React, TypeScript, Figma, Leadership, REST APIs" />
          </SectionCard>

          {/* Experience */}
          <SectionCard id="experience" eyebrow="Career" title="Experience"
            description="Most recent role first. Strong bullets = strong resume."
            actions={
              <button type="button" className="btn-secondary btn-sm" onClick={addExp}>
                <Icon name="plus" className="h-3.5 w-3.5" />Add
              </button>
            }>
            <div className="space-y-4">
              {(resume.experience || []).map((x) => (
                <FieldGroup key={x.id}>
                  <div className="mb-3 flex justify-end">
                    <button type="button"
                      className="text-xs font-medium text-danger-600 hover:text-danger-700"
                      onClick={() => remove('experience', x.id)}>Remove</button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[['role','Role'],['company','Company'],['startDate','Start date'],['endDate','End date / Present'],['location','Location']].map(([f, label]) => (
                      <div key={f} className={f === 'location' ? 'sm:col-span-2' : ''}>
                        <label className="label">{label}</label>
                        <input className="input" value={x[f] || ''}
                          onChange={(e) => arr('experience', x.id, f, e.target.value)} />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="label">Bullets (one per line)</label>
                      <textarea className="input min-h-28 resize-y text-sm"
                        value={(x.bullets || []).join('\n')}
                        placeholder="• Led redesign of onboarding, improving activation by 24%"
                        onChange={(e) => arr('experience', x.id, 'bullets', fromLines(e.target.value))} />
                    </div>
                  </div>
                </FieldGroup>
              ))}
              {(!resume.experience || resume.experience.length === 0) && (
                <p className="py-6 text-center text-sm text-ink-400">No experience added. Click "Add" above.</p>
              )}
            </div>
          </SectionCard>

          {/* Projects */}
          <SectionCard id="projects" eyebrow="Proof of work" title="Projects"
            description="Side projects, case studies, or open-source work."
            actions={
              <button type="button" className="btn-secondary btn-sm" onClick={addProj}>
                <Icon name="plus" className="h-3.5 w-3.5" />Add
              </button>
            }>
            <div className="space-y-4">
              {(resume.projects || []).map((x) => (
                <FieldGroup key={x.id}>
                  <div className="mb-3 flex justify-end">
                    <button type="button"
                      className="text-xs font-medium text-danger-600 hover:text-danger-700"
                      onClick={() => remove('projects', x.id)}>Remove</button>
                  </div>
                  <div className="grid gap-3">
                    {[['name','Project name'],['link','Project link (URL)']].map(([f, label]) => (
                      <div key={f}>
                        <label className="label">{label}</label>
                        <input className="input" value={x[f] || ''}
                          onChange={(e) => arr('projects', x.id, f, e.target.value)} />
                      </div>
                    ))}
                    <div>
                      <label className="label">Description</label>
                      <textarea className="input min-h-24 resize-y" value={x.description || ''}
                        onChange={(e) => arr('projects', x.id, 'description', e.target.value)} />
                    </div>
                  </div>
                </FieldGroup>
              ))}
              {(!resume.projects || resume.projects.length === 0) && (
                <p className="py-6 text-center text-sm text-ink-400">No projects added. Click "Add" above.</p>
              )}
            </div>
          </SectionCard>

          {/* Education */}
          <SectionCard id="education" eyebrow="Background" title="Education"
            actions={
              <button type="button" className="btn-secondary btn-sm" onClick={addEdu}>
                <Icon name="plus" className="h-3.5 w-3.5" />Add
              </button>
            }>
            <div className="space-y-4">
              {(resume.education || []).map((x) => (
                <FieldGroup key={x.id}>
                  <div className="mb-3 flex justify-end">
                    <button type="button"
                      className="text-xs font-medium text-danger-600 hover:text-danger-700"
                      onClick={() => remove('education', x.id)}>Remove</button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[['institution','Institution'],['degree','Degree'],['field','Field of study'],['startDate','Start year'],['endDate','End year']].map(([f, label]) => (
                      <div key={f}>
                        <label className="label">{label}</label>
                        <input className="input" value={x[f] || ''}
                          onChange={(e) => arr('education', x.id, f, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </FieldGroup>
              ))}
              {(!resume.education || resume.education.length === 0) && (
                <p className="py-6 text-center text-sm text-ink-400">No education added.</p>
              )}
            </div>
          </SectionCard>

          {/* Certifications */}
          <SectionCard id="certifications" eyebrow="Credentials" title="Certifications"
            actions={
              <button type="button" className="btn-secondary btn-sm" onClick={addCert}>
                <Icon name="plus" className="h-3.5 w-3.5" />Add
              </button>
            }>
            <div className="space-y-4">
              {(resume.certifications || []).map((x) => (
                <FieldGroup key={x.id}>
                  <div className="mb-3 flex justify-end">
                    <button type="button"
                      className="text-xs font-medium text-danger-600 hover:text-danger-700"
                      onClick={() => remove('certifications', x.id)}>Remove</button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[['name','Certificate name'],['issuer','Issuing body'],['year','Year']].map(([f, label]) => (
                      <div key={f}>
                        <label className="label">{label}</label>
                        <input className="input" value={x[f] || ''}
                          onChange={(e) => arr('certifications', x.id, f, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </FieldGroup>
              ))}
              {(!resume.certifications || resume.certifications.length === 0) && (
                <p className="py-6 text-center text-sm text-ink-400">No certifications added.</p>
              )}
            </div>
          </SectionCard>

          {/* Achievements */}
          <SectionCard id="achievements" eyebrow="Highlights" title="Achievements"
            description="One achievement per line — awards, publications, talks, metrics.">
            <label className="label">Achievements (one per line)</label>
            <textarea className="input min-h-28 resize-y"
              value={achievementsText}
              onChange={(e) => top('achievements', fromLines(e.target.value))}
              placeholder="Speaker at SaaS Design Summit 2024&#10;Grew organic traffic by 140% in 6 months" />
          </SectionCard>

          {/* Mobile: AI + Export (edit tab only) */}
          <div className={`lg:hidden space-y-4 ${mobileTab === 'preview' ? 'hidden' : ''}`}>
            <AIActionPanel resume={resume} setResume={setResume} />
            <ExportPanel
              resumeId={currentId}
              premium={premium}
              exportStatus={exportStatus}
              onExported={() => setSuccess('Your PDF has been downloaded!')}
              refreshStatuses={refreshStatuses}
            />
          </div>

          {/* Mobile: Preview (preview tab only) */}
          <div className={`lg:hidden space-y-4 ${mobileTab === 'edit' ? 'hidden' : ''}`}>
            <ResumePreview resume={resume} />
            <ExportPanel
              resumeId={currentId}
              premium={premium}
              exportStatus={exportStatus}
              onExported={() => setSuccess('Your PDF has been downloaded!')}
              refreshStatuses={refreshStatuses}
            />
          </div>
        </div>

        {/* Col 3: Preview + AI + Export (desktop lg+) */}
        <div className="hidden lg:flex lg:flex-col lg:gap-4">
          <ResumePreview resume={resume} />
          <AIActionPanel resume={resume} setResume={setResume} />
          <ExportPanel
            resumeId={currentId}
            premium={premium}
            exportStatus={exportStatus}
            onExported={() => setSuccess('Your PDF has been downloaded!')}
            refreshStatuses={refreshStatuses}
          />
        </div>
      </div>
    </div>
  );
};