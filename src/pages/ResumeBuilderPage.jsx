import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { SectionCard } from '../components/builder/SectionCard';
import { ResumePreview } from '../components/builder/ResumePreview';
import { AIActionPanel } from '../components/builder/AIActionPanel';
import { AdUnlockModal } from '../components/builder/AdUnlockModal';
import { ExportPanel } from '../components/builder/ExportPanel';
import { useAuth } from '../context/AuthContext';
import { createResume, getResumeById, updateResume } from '../services/resumeService';
import { defaultResume } from '../utils/constants';
import { formatApiError, toArray, uid } from '../utils/helpers';

const arrayFromLines = (value) => value.split('\n').map((item) => item.trim()).filter(Boolean);

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
  const [showAdModal, setShowAdModal] = useState(false);

  const achievementsText = useMemo(() => (resume.achievements || []).join('\n'), [resume.achievements]);
  const skillsText = useMemo(() => (resume.skills || []).join(', '), [resume.skills]);

  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) return;
      setLoading(true);
      setError('');
      try {
        const response = await getResumeById(resumeId);
        const payload = response?.resume || response?.data || response;
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
        const response = await updateResume(currentId, resume);
        const payload = response?.resume || response?.data || response;
        setResume((prev) => ({ ...prev, ...payload }));
        setSuccess('Resume saved successfully.');
      } else {
        const response = await createResume(resume);
        const payload = response?.resume || response?.data || response;
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

  const refreshStatuses = async () => {
    await Promise.all([refreshExportStatus(), refreshPremiumStatus()]);
  };

  const updateTopField = (field, value) => {
    setResume((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayItem = (section, id, field, value) => {
    setResume((prev) => ({
      ...prev,
      [section]: prev[section].map((item) => item.id === id ? { ...item, [field]: value } : item),
    }));
  };

  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: uid('exp'), company: '', role: '', startDate: '', endDate: '', location: '', bullets: [''] },
      ],
    }));
  };

  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [...prev.projects, { id: uid('proj'), name: '', link: '', description: '' }],
    }));
  };

  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [...prev.education, { id: uid('edu'), institution: '', degree: '', startDate: '', endDate: '', location: '' }],
    }));
  };

  const addCertification = () => {
    setResume((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { id: uid('cert'), name: '', issuer: '', year: '' }],
    }));
  };

  const removeItem = (section, id) => {
    setResume((prev) => ({ ...prev, [section]: prev[section].filter((item) => item.id !== id) }));
  };

  const handleExported = () => {
    setSuccess('Export access granted and export recorded. Connect your PDF generation backend to complete file delivery.');
  };

  if (loading) {
    return <div className="card p-6"><Loader label="Opening resume builder..." /></div>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Resume builder"
        title="Create, refine, and export with confidence"
        description="Structured editing on the left. Live ATS preview, AI tools, and export controls on the right."
        actions={<button type="button" className="btn-primary" onClick={saveResume} disabled={saving}>{saving ? 'Saving...' : 'Save resume'}</button>}
      />

      <Alert variant="error">{error}</Alert>
      <Alert variant="success">{success}</Alert>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <SectionCard title="Personal information" description="Core identity and contact details for your resume header.">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['fullName', 'Full name'],
                ['professionalTitle', 'Professional title'],
                ['email', 'Email'],
                ['phone', 'Phone'],
                ['location', 'Location'],
                ['linkedin', 'LinkedIn'],
                ['github', 'GitHub'],
                ['portfolio', 'Portfolio'],
              ].map(([field, label]) => (
                <div key={field} className={field === 'portfolio' ? 'md:col-span-2' : ''}>
                  <label className="label">{label}</label>
                  <input className="input" value={resume[field] || ''} onChange={(e) => updateTopField(field, e.target.value)} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Professional summary" description="Use a concise, impact-driven overview.">
            <label className="label">Summary</label>
            <textarea className="input min-h-40" value={resume.summary || ''} onChange={(e) => updateTopField('summary', e.target.value)} />
          </SectionCard>

          <SectionCard title="Skills" description="Comma-separated skills are converted into resume tags.">
            <label className="label">Skills</label>
            <input className="input" value={skillsText} onChange={(e) => updateTopField('skills', toArray(e.target.value))} />
          </SectionCard>

          <SectionCard title="Experience" description="Add your most relevant work history." actions={<button type="button" className="btn-secondary" onClick={addExperience}>Add experience</button>}>
            <div className="space-y-5">
              {resume.experience.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-4 flex justify-end">
                    <button type="button" className="text-sm font-medium text-rose-600" onClick={() => removeItem('experience', item.id)}>Remove</button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      ['role', 'Role'],
                      ['company', 'Company'],
                      ['startDate', 'Start date'],
                      ['endDate', 'End date'],
                      ['location', 'Location'],
                    ].map(([field, label]) => (
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
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Projects" description="Highlight notable work, case studies, or shipped outcomes." actions={<button type="button" className="btn-secondary" onClick={addProject}>Add project</button>}>
            <div className="space-y-5">
              {resume.projects.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-4 flex justify-end"><button type="button" className="text-sm font-medium text-rose-600" onClick={() => removeItem('projects', item.id)}>Remove</button></div>
                  <div className="grid gap-4">
                    {[
                      ['name', 'Project name'],
                      ['link', 'Project link'],
                    ].map(([field, label]) => (
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
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Education" description="Include degrees, institutions, and timeline." actions={<button type="button" className="btn-secondary" onClick={addEducation}>Add education</button>}>
            <div className="space-y-5">
              {resume.education.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-4 flex justify-end"><button type="button" className="text-sm font-medium text-rose-600" onClick={() => removeItem('education', item.id)}>Remove</button></div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      ['institution', 'Institution'],
                      ['degree', 'Degree'],
                      ['startDate', 'Start year'],
                      ['endDate', 'End year'],
                      ['location', 'Location'],
                    ].map(([field, label]) => (
                      <div key={field} className={field === 'location' ? 'md:col-span-2' : ''}>
                        <label className="label">{label}</label>
                        <input className="input" value={item[field] || ''} onChange={(e) => updateArrayItem('education', item.id, field, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Certifications" description="Add trusted credentials and certifications." actions={<button type="button" className="btn-secondary" onClick={addCertification}>Add certification</button>}>
            <div className="space-y-5">
              {resume.certifications.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-4 flex justify-end"><button type="button" className="text-sm font-medium text-rose-600" onClick={() => removeItem('certifications', item.id)}>Remove</button></div>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      ['name', 'Certification'],
                      ['issuer', 'Issuer'],
                      ['year', 'Year'],
                    ].map(([field, label]) => (
                      <div key={field}>
                        <label className="label">{label}</label>
                        <input className="input" value={item[field] || ''} onChange={(e) => updateArrayItem('certifications', item.id, field, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Achievements" description="Use one line per achievement.">
            <textarea className="input min-h-32" value={achievementsText} onChange={(e) => updateTopField('achievements', arrayFromLines(e.target.value))} />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <AIActionPanel resume={resume} setResume={setResume} />
          <ExportPanel
            resumeId={currentId}
            premium={premium}
            onRequireAd={() => setShowAdModal(true)}
            onExported={handleExported}
            refreshStatuses={refreshStatuses}
          />
          <ResumePreview resume={resume} />
        </div>
      </div>

      <AdUnlockModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        resumeId={currentId}
        onUnlocked={async () => {
          setShowAdModal(false);
          await refreshStatuses();
          setSuccess('Ad unlock complete. You can now trigger export again.');
        }}
      />
    </div>
  );
};
