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

const arrayFromLines = (value) => value.split('\n').map((item) => item.trim()).filter(Boolean);
const jumpTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const MiniItem = ({ children }) => <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">{children}</div>;

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
    const fetchResume = async () => {
      if (!resumeId) return;
      setLoading(true);
      setError('');
      try {
        const payload = await getResumeById(resumeId);
        setResume({ ...defaultResume, ...payload });
        setCurrentId(payload.id || payload._id || resumeId);
      } catch (err) {
        setError(formatApiError(err, 'Could not load this resume.'));
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  const saveResume = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (currentId) {
        const payload = await updateResume(currentId, resume);
        setResume((prev) => ({ ...prev, ...payload }));
        setSuccess('Resume saved successfully.');
      } else {
        const payload = await createResume(resume);
        const id = payload.id || payload._id;
        setCurrentId(id);
        setResume((prev) => ({ ...prev, ...payload }));
        setSuccess('Resume created successfully.');
        navigate(`/app/builder/${id}`, { replace: true });
      }
    } catch (err) {
      setError(formatApiError(err, 'Could not save the resume.'));
    } finally {
      setSaving(false);
    }
  };

  const refreshStatuses = async () => Promise.all([refreshExportStatus(), refreshPremiumStatus()]);
  const updateTopField = (field, value) => setResume((prev) => ({ ...prev, [field]: value }));
  const updateArrayItem = (section, id, field, value) => setResume((prev) => ({ ...prev, [section]: prev[section].map((item) => (item.id === id ? { ...item, [field]: value } : item)) }));

  const addExperience = () => setResume((prev) => ({ ...prev, experience: [...prev.experience, { id: uid('exp'), company: '', role: '', startDate: '', endDate: '', location: '', bullets: [''] }] }));
  const addProject = () => setResume((prev) => ({ ...prev, projects: [...prev.projects, { id: uid('proj'), name: '', link: '', description: '' }] }));
  const addEducation = () => setResume((prev) => ({ ...prev, education: [...prev.education, { id: uid('edu'), institution: '', degree: '', startDate: '', endDate: '', location: '', field: '' }] }));
  const addCertification = () => setResume((prev) => ({ ...prev, certifications: [...prev.certifications, { id: uid('cert'), name: '', issuer: '', year: '' }] }));
  const removeItem = (section, id) => setResume((prev) => ({ ...prev, [section]: prev[section].filter((item) => item.id !== id) }));

  const handleExported = () => setSuccess('Export recorded successfully.');

  if (loading) return <div className="card p-6"><Loader label="Opening resume builder..." /></div>;

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        eyebrow="Resume builder"
        title="Build with a cleaner editor and live preview"
        description="The layout now mirrors a more professional resume-builder flow: quick section jumps, structured cards, stronger spacing, and a high-clarity preview pane."
        actions={<button type="button" className="btn-primary" onClick={saveResume} disabled={saving}>{saving ? 'Saving...' : 'Save resume'}</button>}
      />

      <Alert variant="error">{error}</Alert>
      <Alert variant="success">{success}</Alert>

      <section className="card overflow-hidden p-0">
        <div className="grid gap-0 xl:grid-cols-[260px_minmax(0,1fr)_520px]">
          <aside className="border-b border-slate-200 bg-slate-50/80 p-5 xl:border-b-0 xl:border-r">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Sections</p>
            <div className="mt-4 space-y-2">
              {builderSections.map((section) => (
                <button key={section.id} type="button" className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950" onClick={() => jumpTo(section.id)}>
                  <span>{section.label}</span>
                  <Icon name="arrowRight" className="h-4 w-4" />
                </button>
              ))}
            </div>
            <div className="mt-6 rounded-[24px] bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Checklist</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• Fill essentials</li>
                <li>• Add measurable bullets</li>
                <li>• Review live preview</li>
                <li>• Save before export</li>
              </ul>
            </div>
          </aside>

          <div className="space-y-6 p-4 sm:p-6">
            <SectionCard id="basics" eyebrow="Profile" title="Personal information" description="Keep your resume header sharp, scannable, and recruiter-friendly.">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ['fullName', 'Full name'], ['professionalTitle', 'Professional title'], ['email', 'Email'], ['phone', 'Phone'], ['location', 'Location'], ['linkedin', 'LinkedIn'], ['github', 'GitHub'], ['portfolio', 'Portfolio'],
                ].map(([field, label]) => (
                  <div key={field} className={field === 'portfolio' ? 'md:col-span-2' : ''}>
                    <label className="label">{label}</label>
                    <input className="input" value={resume[field] || ''} onChange={(e) => updateTopField(field, e.target.value)} />
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard id="summary" eyebrow="Pitch" title="Professional summary" description="Lead with a concise story about your value, scope, and measurable impact.">
              <label className="label">Summary</label>
              <textarea className="input min-h-40" value={resume.summary || ''} onChange={(e) => updateTopField('summary', e.target.value)} />
            </SectionCard>

            <SectionCard id="skills" eyebrow="Strengths" title="Skills" description="Add focused keywords to improve scanability and ATS coverage.">
              <label className="label">Skills</label>
              <input className="input" value={skillsText} onChange={(e) => updateTopField('skills', toArray(e.target.value))} />
            </SectionCard>

            <SectionCard id="experience" eyebrow="Career" title="Experience" description="Organize each role around outcomes, tools, and context." actions={<button type="button" className="btn-secondary" onClick={addExperience}><Icon name="plus" className="h-4 w-4" />Add experience</button>}>
              <div className="space-y-5">
                {resume.experience.map((item) => (
                  <MiniItem key={item.id}>
                    <div className="mb-4 flex justify-end"><button type="button" className="text-sm font-semibold text-rose-600" onClick={() => removeItem('experience', item.id)}>Remove</button></div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {[['role','Role'],['company','Company'],['startDate','Start date'],['endDate','End date'],['location','Location']].map(([field,label]) => (
                        <div key={field} className={field === 'location' ? 'md:col-span-2' : ''}>
                          <label className="label">{label}</label>
                          <input className="input" value={item[field] || ''} onChange={(e) => updateArrayItem('experience', item.id, field, e.target.value)} />
                        </div>
                      ))}
                      <div className="md:col-span-2">
                        <label className="label">Bullets (one per line)</label>
                        <textarea className="input min-h-32" value={(item.bullets || []).join('\n')} onChange={(e) => updateArrayItem('experience', item.id, 'bullets', arrayFromLines(e.target.value))} />
                      </div>
                    </div>
                  </MiniItem>
                ))}
              </div>
            </SectionCard>

            <SectionCard id="projects" eyebrow="Proof of work" title="Projects" description="Highlight relevant shipped work, side projects, or case studies." actions={<button type="button" className="btn-secondary" onClick={addProject}><Icon name="plus" className="h-4 w-4" />Add project</button>}>
              <div className="space-y-5">
                {resume.projects.map((item) => (
                  <MiniItem key={item.id}>
                    <div className="mb-4 flex justify-end"><button type="button" className="text-sm font-semibold text-rose-600" onClick={() => removeItem('projects', item.id)}>Remove</button></div>
                    <div className="grid gap-4">
                      {[['name','Project name'],['link','Project link']].map(([field,label]) => (
                        <div key={field}>
                          <label className="label">{label}</label>
                          <input className="input" value={item[field] || ''} onChange={(e) => updateArrayItem('projects', item.id, field, e.target.value)} />
                        </div>
                      ))}
                      <div>
                        <label className="label">Description</label>
                        <textarea className="input min-h-28" value={item.description || ''} onChange={(e) => updateArrayItem('projects', item.id, 'description', e.target.value)} />
                      </div>
                    </div>
                  </MiniItem>
                ))}
              </div>
            </SectionCard>

            <SectionCard id="education" eyebrow="Background" title="Education" description="Add degree details, timeline, and institution context." actions={<button type="button" className="btn-secondary" onClick={addEducation}><Icon name="plus" className="h-4 w-4" />Add education</button>}>
              <div className="space-y-5">
                {resume.education.map((item) => (
                  <MiniItem key={item.id}>
                    <div className="mb-4 flex justify-end"><button type="button" className="text-sm font-semibold text-rose-600" onClick={() => removeItem('education', item.id)}>Remove</button></div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {[['institution','Institution'],['degree','Degree'],['startDate','Start year'],['endDate','End year'],['location','Location']].map(([field,label]) => (
                        <div key={field} className={field === 'location' ? 'md:col-span-2' : ''}>
                          <label className="label">{label}</label>
                          <input className="input" value={item[field] || ''} onChange={(e) => updateArrayItem('education', item.id, field, e.target.value)} />
                        </div>
                      ))}
                    </div>
                  </MiniItem>
                ))}
              </div>
            </SectionCard>

            <SectionCard id="certifications" eyebrow="Credentials" title="Certifications" description="Keep certifications tidy and easy to scan." actions={<button type="button" className="btn-secondary" onClick={addCertification}><Icon name="plus" className="h-4 w-4" />Add certification</button>}>
              <div className="space-y-5">
                {resume.certifications.map((item) => (
                  <MiniItem key={item.id}>
                    <div className="mb-4 flex justify-end"><button type="button" className="text-sm font-semibold text-rose-600" onClick={() => removeItem('certifications', item.id)}>Remove</button></div>
                    <div className="grid gap-4 md:grid-cols-3">
                      {[['name','Certification'],['issuer','Issuer'],['year','Year']].map(([field,label]) => (
                        <div key={field}>
                          <label className="label">{label}</label>
                          <input className="input" value={item[field] || ''} onChange={(e) => updateArrayItem('certifications', item.id, field, e.target.value)} />
                        </div>
                      ))}
                    </div>
                  </MiniItem>
                ))}
              </div>
            </SectionCard>

            <SectionCard id="achievements" eyebrow="Highlights" title="Achievements" description="Use one line per achievement to keep the section crisp.">
              <textarea className="input min-h-32" value={achievementsText} onChange={(e) => updateTopField('achievements', arrayFromLines(e.target.value))} />
            </SectionCard>
          </div>

          <div className="space-y-6 border-t border-slate-200 bg-slate-50/65 p-4 sm:p-6 xl:border-l xl:border-t-0">
            <AIActionPanel resume={resume} setResume={setResume} />
            <ExportPanel resumeId={currentId} premium={premium} onExported={handleExported} refreshStatuses={refreshStatuses} />
            <ResumePreview resume={resume} />
          </div>
        </div>
      </section>
    </div>
  );
};
