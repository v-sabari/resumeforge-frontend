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
import { Icon } from '../components/icons/Icon';
import { defaultResume, builderSections } from '../utils/constants';
import { formatApiError, normaliseResume, uid } from '../utils/helpers';

const fromLines = (v = '') =>
  v.split('\n').map((s) => s.trim()).filter(Boolean);

const jumpTo = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

const FieldGroup = ({ children }) => (
  <div className="rounded-xl border border-surface-200 bg-surface-50/60 p-4">
    {children}
  </div>
);

/* ── Import modal: paste plain text resume ──────────────────────────── */
const ImportModal = ({ open, onClose, onImport }) => {
  const [text, setText] = useState('');

  if (!open) return null;

  const handleImport = () => {
    if (!text.trim()) return;

    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const parsed = { summary: '', skills: [], achievements: [] };

    let currentSection = '';

    for (const line of lines) {
      const up = line.toUpperCase();

      if (/^(SUMMARY|PROFESSIONAL SUMMARY|PROFILE|OBJECTIVE)/.test(up)) {
        currentSection = 'summary';
        continue;
      }
      if (/^(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES)/.test(up)) {
        currentSection = 'skills';
        continue;
      }
      if (/^(ACHIEVEMENT|ACHIEVEMENTS|HONORS|AWARDS)/.test(up)) {
        currentSection = 'achievements';
        continue;
      }
      if (/^(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT)/.test(up)) {
        currentSection = 'exp';
        continue;
      }
      if (/^(EDUCATION|ACADEMIC)/.test(up)) {
        currentSection = 'edu';
        continue;
      }
      if (/^[-=]{4,}/.test(line)) continue;

      if (currentSection === 'summary') {
        parsed.summary = `${parsed.summary ? `${parsed.summary} ` : ''}${line}`;
      } else if (currentSection === 'skills') {
        line
          .split(/[,;|]/)
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((s) => {
            if (!parsed.skills.includes(s)) parsed.skills.push(s);
          });
      } else if (currentSection === 'achievements') {
        const clean = line.replace(/^[•\-*]\s*/, '').trim();
        if (clean) parsed.achievements.push(clean);
      }
    }

    const firstLine = lines[0];
    if (
      firstLine &&
      !/^(SUMMARY|SKILLS|EXPERIENCE|EDUCATION|PROFILE|OBJECTIVE)/.test(firstLine.toUpperCase())
    ) {
      parsed.fullName = firstLine;
    }

    onImport(parsed);
    setText('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card max-w-lg w-full space-y-4 p-6 shadow-lift-lg animate-fade-up">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-950">Import resume text</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-300 hover:text-ink-600"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-ink-500">
          Paste your existing resume as plain text. We&apos;ll extract your summary,
          skills, and achievements. You can then edit each section in the builder.
        </p>

        <textarea
          className="input min-h-[200px] w-full resize-none font-mono text-sm"
          placeholder="Paste your resume text here…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleImport}
            disabled={!text.trim()}
            className="btn-primary flex-1 justify-center"
          >
            <Icon name="sparkles" className="h-4 w-4" />
            Import
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1 justify-center"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-ink-400">
          Import fills in Summary, Skills, and Achievements. Experience and Education
          need to be entered manually.
        </p>
      </div>
    </div>
  );
};

/* ── Main page ──────────────────────────────────────────────────────── */
export const ResumeBuilderPage = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { premium, exportStatus, refreshExportStatus, refreshPremiumStatus } = useAuth();

  const [resume, setResume] = useState({ ...defaultResume, template: 'modern' });
  const [loading, setLoading] = useState(Boolean(resumeId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentId, setCurrentId] = useState(resumeId || null);
  const [mobileTab, setMobileTab] = useState('edit');
  const [template, setTemplate] = useState('modern');
  const [showImport, setShowImport] = useState(false);

  const skillsText = useMemo(() => (resume.skills || []).join(', '), [resume.skills]);
  const achievementsText = useMemo(
    () => (resume.achievements || []).join('\n'),
    [resume.achievements]
  );

  useEffect(() => {
    if (!resumeId) return;

    setLoading(true);
    setError('');

    getResumeById(resumeId)
      .then((payload) => {
        const normalised = normaliseResume(payload);
        const merged = { ...defaultResume, ...normalised, template: normalised?.template || 'modern' };

        setResume(merged);
        setTemplate(merged.template || 'modern');
        setCurrentId(payload.id || resumeId);
      })
      .catch((err) => setError(formatApiError(err, 'Could not load this resume.')))
      .finally(() => setLoading(false));
  }, [resumeId]);

  useEffect(() => {
    setResume((prev) => ({ ...prev, template }));
  }, [template]);

  const saveResume = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    const payloadToSave = {
      ...resume,
      template,
    };

    try {
      if (currentId) {
        const p = await updateResume(currentId, payloadToSave);
        const n = normaliseResume(p);
        setResume((prev) => ({ ...prev, ...n, template: n?.template || template }));
        setTemplate(n?.template || template);
        setSuccess('Resume saved successfully.');
      } else {
        const p = await createResume(payloadToSave);
        const id = p.id || p._id;
        const n = normaliseResume(p);

        setCurrentId(id);
        setResume((prev) => ({ ...prev, ...n, template: n?.template || template }));
        setTemplate(n?.template || template);
        setSuccess('Resume created. You can now export it.');
        navigate(`/app/builder/${id}`, { replace: true });
      }
    } catch (err) {
      setError(formatApiError(err, 'Could not save the resume.'));
    } finally {
      setSaving(false);
    }
  };

  const handleImport = useCallback((parsed) => {
    setResume((prev) => ({
      ...prev,
      fullName: parsed.fullName || prev.fullName,
      summary: parsed.summary || prev.summary,
      skills: parsed.skills?.length ? parsed.skills : prev.skills,
      achievements: parsed.achievements?.length ? parsed.achievements : prev.achievements,
    }));
    setSuccess('Resume content imported. Review and edit each section below.');
  }, []);

  const refreshStatuses = () =>
    Promise.all([refreshExportStatus(), refreshPremiumStatus()]);

  const top = (field, value) =>
    setResume((prev) => ({ ...prev, [field]: value }));

  const arr = (section, id, field, value) =>
    setResume((prev) => ({
      ...prev,
      [section]: (prev[section] || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));

  const remove = (section, id) =>
    setResume((prev) => ({
      ...prev,
      [section]: (prev[section] || []).filter((item) => item.id !== id),
    }));
const addExp = () =>
  setResume((prev) => ({
    ...prev,
    experience: [
      ...(prev.experience || []),
      {
        id: uid('exp'),
        company: '',
        role: '',
        location: '',
        employmentType: '',
        startDate: '',
        endDate: '',
        summary: '',
        bullets: [],
      },
    ],
  }));

const addProj = () =>
  setResume((prev) => ({
    ...prev,
    projects: [
      ...(prev.projects || []),
      {
        id: uid('proj'),
        name: '',
        role: '',
        link: '',
        github: '',
        techStack: '',
        description: '',
        highlights: [],
      },
    ],
  }));

const addEdu = () =>
  setResume((prev) => ({
    ...prev,
    education: [
      ...(prev.education || []),
      {
        id: uid('edu'),
        institution: '',
        degree: '',
        field: '',
        grade: '',
        startDate: '',
        endDate: '',
        details: '',
      },
    ],
  }));

const addCert = () =>
  setResume((prev) => ({
    ...prev,
    certifications: [
      ...(prev.certifications || []),
      {
        id: uid('cert'),
        name: '',
        issuer: '',
        year: '',
        credentialUrl: '',
      },
    ],
  }));
  const updateCertification = (index, field, value) =>
    setResume((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).map((cert, i) => {
        if (i !== index) return cert;

        if (typeof cert === 'string') {
          return {
            id: uid('cert'),
            name: field === 'name' ? value : cert,
            issuer: field === 'issuer' ? value : '',
            year: field === 'year' ? value : '',
          };
        }

        return {
          ...cert,
          [field]: value,
        };
      }),
    }));

  const removeCertification = (index) =>
    setResume((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter((_, i) => i !== index),
    }));

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-20">
        <Loader label="Opening resume builder…" size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <ImportModal
        open={showImport}
        onClose={() => setShowImport(false)}
        onImport={handleImport}
      />

      <PageHeader
        eyebrow="Resume builder"
        title={currentId ? 'Edit resume' : 'New resume'}
        description="Fill in your details, preview in real time, then export your resume."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => setShowImport(true)}
              title="Import resume text"
            >
              <Icon name="export" className="h-4 w-4 rotate-180" />
              Import
            </button>

            {!currentId && <span className="badge-warning text-xs">Unsaved</span>}

            <button
              type="button"
              className="btn-primary"
              onClick={saveResume}
              disabled={saving}
            >
              <Icon name="check" className="h-4 w-4" />
              {saving ? 'Saving…' : currentId ? 'Save changes' : 'Save resume'}
            </button>
          </div>
        }
      />

      {error ? <Alert variant="error">{error}</Alert> : null}
      {success ? <Alert variant="success">{success}</Alert> : null}

      {!currentId && (
        <Alert variant="warning">
          Save your resume first before exporting. Click &quot;Save resume&quot; above.
        </Alert>
      )}

      <div className="flex gap-1 rounded-xl border border-surface-200 bg-surface-50 p-1 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileTab('edit')}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
            mobileTab === 'edit'
              ? 'bg-white text-ink-950 shadow-sm'
              : 'text-ink-400 hover:text-ink-700'
          }`}
        >
          ✏️ Edit
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
            mobileTab === 'preview'
              ? 'bg-white text-ink-950 shadow-sm'
              : 'text-ink-400 hover:text-ink-700'
          }`}
        >
          👁 Preview
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[180px_1fr_320px] xl:grid-cols-[200px_1fr_340px]">
        <aside className="hidden lg:block">
          <div className="card sticky top-6 p-4">
            <p className="kicker mb-3">Sections</p>

            <nav className="space-y-0.5">
              {builderSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => jumpTo(section.id)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-ink-500 transition hover:bg-surface-100 hover:text-ink-950"
                >
                  <Icon name={section.icon} className="h-3.5 w-3.5 shrink-0" />
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-4 rounded-xl border border-surface-200 bg-surface-50 p-3.5">
              <p className="kicker mb-2">Tips</p>
              {['Fill all sections', 'Add strong bullets', 'Use AI copilot', 'Save → Export'].map(
                (tip) => (
                  <p key={tip} className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-400">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                    {tip}
                  </p>
                )
              )}
            </div>
          </div>
        </aside>

        <div className={`min-w-0 space-y-4 ${mobileTab === 'preview' ? 'hidden lg:block' : ''}`}>
          <SectionCard
            id="basics"
            eyebrow="Profile"
            title="Personal information"
            description="Your contact details appear at the top of every resume."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['fullName', 'Full name', 'text'],
                ['professionalTitle', 'Professional title', 'text'],
                ['email', 'Email', 'email'],
                ['phone', 'Phone', 'tel'],
                ['location', 'Location / City', 'text'],
                ['linkedin', 'LinkedIn URL', 'url'],
                ['github', 'GitHub URL', 'url'],
                ['portfolio', 'Portfolio URL', 'url'],
              ].map(([field, label, type]) => (
                <div key={field} className={field === 'portfolio' ? 'sm:col-span-2' : ''}>
                  <label className="label">{label}</label>
                  <input
                    className="input"
                    type={type}
                    value={resume[field] || ''}
                    onChange={(e) => top(field, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            id="summary"
            eyebrow="Summary"
            title="Professional summary"
            description="A 2-4 sentence overview of your background and target role."
          >
            <textarea
              className="input min-h-[100px] resize-none"
              value={resume.summary || ''}
              onChange={(e) => top('summary', e.target.value)}
              placeholder="Write a concise summary of your professional background…"
            />
          </SectionCard>

          <SectionCard
            id="skills"
            eyebrow="Skills"
            title="Skills"
            description="Comma-separated list. Be specific — add tools, frameworks, and methodologies."
          >
            <textarea
              className="input min-h-[80px] resize-none"
              value={skillsText}
              onChange={(e) =>
                top(
                  'skills',
                  e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              placeholder="React, Node.js, PostgreSQL, Figma, Agile…"
            />
          </SectionCard>
          <SectionCard
  id="experience"
  eyebrow="Experience"
  title="Work experience"
  description="Add roles in reverse chronological order with measurable impact."
  action={
    <button type="button" onClick={addExp} className="btn-secondary btn-sm gap-1">
      <Icon name="plus" className="h-3.5 w-3.5" />
      Add role
    </button>
  }
>
  {(resume.experience || []).length === 0 ? (
    <div className="rounded-xl border border-dashed border-surface-300 bg-surface-50 p-4 text-sm text-ink-500">
      No work experience added yet. Click <span className="font-semibold">Add role</span> to start.
    </div>
  ) : (
    (resume.experience || []).map((exp, index) => (
      <FieldGroup key={exp.id}>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-900">
              Role {index + 1}
            </p>
            <p className="text-xs text-ink-500">
              Add role title, company, dates, and strong achievement bullets.
            </p>
          </div>
          <button
            type="button"
            onClick={() => remove('experience', exp.id)}
            className="btn-danger btn-sm"
          >
            <Icon name="trash" className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Job title</label>
            <input
              className="input"
              value={exp.role || ''}
              onChange={(e) => arr('experience', exp.id, 'role', e.target.value)}
              placeholder="Frontend Developer"
            />
          </div>

          <div>
            <label className="label">Company</label>
            <input
              className="input"
              value={exp.company || ''}
              onChange={(e) => arr('experience', exp.id, 'company', e.target.value)}
              placeholder="Acme Technologies"
            />
          </div>

          <div>
            <label className="label">Location</label>
            <input
              className="input"
              value={exp.location || ''}
              onChange={(e) => arr('experience', exp.id, 'location', e.target.value)}
              placeholder="Chennai, India"
            />
          </div>

          <div>
            <label className="label">Employment type</label>
            <input
              className="input"
              value={exp.employmentType || ''}
              onChange={(e) => arr('experience', exp.id, 'employmentType', e.target.value)}
              placeholder="Full-time / Internship / Freelance"
            />
          </div>

          <div>
            <label className="label">Start date</label>
            <input
              className="input"
              value={exp.startDate || ''}
              onChange={(e) => arr('experience', exp.id, 'startDate', e.target.value)}
              placeholder="Jan 2024"
            />
          </div>

          <div>
            <label className="label">End date</label>
            <input
              className="input"
              value={exp.endDate || ''}
              onChange={(e) => arr('experience', exp.id, 'endDate', e.target.value)}
              placeholder="Present"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="label">Brief role summary</label>
          <textarea
            className="input min-h-[72px] resize-none text-sm"
            value={exp.summary || ''}
            onChange={(e) => arr('experience', exp.id, 'summary', e.target.value)}
            placeholder="Describe your responsibility scope in 1–2 lines."
          />
        </div>

        <div className="mt-3">
          <label className="label">Achievement bullets (one per line)</label>
          <textarea
            className="input min-h-[120px] resize-none text-sm"
            value={(exp.bullets || []).join('\n')}
            onChange={(e) => arr('experience', exp.id, 'bullets', fromLines(e.target.value))}
            placeholder={'Built responsive UI for 20+ pages\nImproved page speed by 35%\nIntegrated REST APIs and reduced manual workflow time'}
          />
          <p className="mt-1 text-xs text-ink-400">
            Write impact-driven bullets with action + result + metric wherever possible.
          </p>
        </div>
      </FieldGroup>
    ))
  )}
</SectionCard>
          <SectionCard
  id="projects"
  eyebrow="Projects"
  title="Projects"
  description="Highlight strong projects with stack, links, and measurable outcomes."
  action={
    <button type="button" onClick={addProj} className="btn-secondary btn-sm gap-1">
      <Icon name="plus" className="h-3.5 w-3.5" />
      Add project
    </button>
  }
>
  {(resume.projects || []).length === 0 ? (
    <div className="rounded-xl border border-dashed border-surface-300 bg-surface-50 p-4 text-sm text-ink-500">
      No projects added yet. Add projects that prove your skills.
    </div>
  ) : (
    (resume.projects || []).map((proj, index) => (
      <FieldGroup key={proj.id}>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-900">
              Project {index + 1}
            </p>
            <p className="text-xs text-ink-500">
              Add title, links, technologies, and the outcome.
            </p>
          </div>
          <button
            type="button"
            onClick={() => remove('projects', proj.id)}
            className="btn-danger btn-sm"
          >
            <Icon name="trash" className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Project name</label>
            <input
              className="input"
              value={proj.name || ''}
              onChange={(e) => arr('projects', proj.id, 'name', e.target.value)}
              placeholder="ResumeForge AI"
            />
          </div>

          <div>
            <label className="label">Project role</label>
            <input
              className="input"
              value={proj.role || ''}
              onChange={(e) => arr('projects', proj.id, 'role', e.target.value)}
              placeholder="Full Stack Developer"
            />
          </div>

          <div>
            <label className="label">Live URL</label>
            <input
              className="input"
              value={proj.link || ''}
              onChange={(e) => arr('projects', proj.id, 'link', e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="label">GitHub URL</label>
            <input
              className="input"
              value={proj.github || ''}
              onChange={(e) => arr('projects', proj.id, 'github', e.target.value)}
              placeholder="https://github.com/username/project"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="label">Tech stack</label>
          <input
            className="input"
            value={proj.techStack || ''}
            onChange={(e) => arr('projects', proj.id, 'techStack', e.target.value)}
            placeholder="React, Spring Boot, PostgreSQL, JWT, Razorpay"
          />
        </div>

        <div className="mt-3">
          <label className="label">Project description</label>
          <textarea
            className="input min-h-[100px] resize-none text-sm"
            value={proj.description || ''}
            onChange={(e) => arr('projects', proj.id, 'description', e.target.value)}
            placeholder="Describe what the project does, your contribution, and why it matters."
          />
        </div>

        <div className="mt-3">
          <label className="label">Key highlights (one per line)</label>
          <textarea
            className="input min-h-[100px] resize-none text-sm"
            value={(proj.highlights || []).join('\n')}
            onChange={(e) => arr('projects', proj.id, 'highlights', fromLines(e.target.value))}
            placeholder={'Implemented secure JWT authentication\nBuilt ATS resume scoring workflow\nDeployed frontend and backend separately for scalability'}
          />
        </div>
      </FieldGroup>
    ))
  )}
</SectionCard>

<SectionCard
  id="education"
  eyebrow="Education"
  title="Education"
  description="Add institution, degree, specialization, and academic results if relevant."
  action={
    <button type="button" onClick={addEdu} className="btn-secondary btn-sm gap-1">
      <Icon name="plus" className="h-3.5 w-3.5" />
      Add education
    </button>
  }
>
  {(resume.education || []).length === 0 ? (
    <div className="rounded-xl border border-dashed border-surface-300 bg-surface-50 p-4 text-sm text-ink-500">
      No education details added yet.
    </div>
  ) : (
    (resume.education || []).map((edu, index) => (
      <FieldGroup key={edu.id}>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-900">
              Education {index + 1}
            </p>
            <p className="text-xs text-ink-500">
              Include degree, field, institution, and score if useful.
            </p>
          </div>
          <button
            type="button"
            onClick={() => remove('education', edu.id)}
            className="btn-danger btn-sm"
          >
            <Icon name="trash" className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Institution</label>
            <input
              className="input"
              value={edu.institution || ''}
              onChange={(e) => arr('education', edu.id, 'institution', e.target.value)}
              placeholder="XYZ Engineering College"
            />
          </div>

          <div>
            <label className="label">Degree</label>
            <input
              className="input"
              value={edu.degree || ''}
              onChange={(e) => arr('education', edu.id, 'degree', e.target.value)}
              placeholder="B.E / B.Tech / M.Sc"
            />
          </div>

          <div>
            <label className="label">Field of study</label>
            <input
              className="input"
              value={edu.field || ''}
              onChange={(e) => arr('education', edu.id, 'field', e.target.value)}
              placeholder="Computer Science and Engineering"
            />
          </div>

          <div>
            <label className="label">Grade / CGPA</label>
            <input
              className="input"
              value={edu.grade || ''}
              onChange={(e) => arr('education', edu.id, 'grade', e.target.value)}
              placeholder="8.4 CGPA"
            />
          </div>

          <div>
            <label className="label">Start year</label>
            <input
              className="input"
              value={edu.startDate || ''}
              onChange={(e) => arr('education', edu.id, 'startDate', e.target.value)}
              placeholder="2021"
            />
          </div>

          <div>
            <label className="label">End year</label>
            <input
              className="input"
              value={edu.endDate || ''}
              onChange={(e) => arr('education', edu.id, 'endDate', e.target.value)}
              placeholder="2025"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="label">Additional details</label>
          <textarea
            className="input min-h-[80px] resize-none text-sm"
            value={edu.details || ''}
            onChange={(e) => arr('education', edu.id, 'details', e.target.value)}
            placeholder="Relevant coursework, honors, academic achievements, scholarships, etc."
          />
        </div>
      </FieldGroup>
    ))
  )}
</SectionCard>
<SectionCard
  id="certifications"
  eyebrow="Certifications"
  title="Certifications"
  description="Add professional certifications with issuer, year, and credential link."
  action={
    <button type="button" onClick={addCert} className="btn-secondary btn-sm gap-1">
      <Icon name="plus" className="h-3.5 w-3.5" />
      Add certification
    </button>
  }
>
  {(resume.certifications || []).length === 0 ? (
    <div className="rounded-xl border border-dashed border-surface-300 bg-surface-50 p-4 text-sm text-ink-500">
      No certifications added yet.
    </div>
  ) : (
    (resume.certifications || []).map((cert, index) => {
      const certObj =
        typeof cert === 'string'
          ? { id: uid('cert'), name: cert, issuer: '', year: '', credentialUrl: '' }
          : {
              id: cert?.id || uid('cert'),
              name: cert?.name || '',
              issuer: cert?.issuer || '',
              year: cert?.year || '',
              credentialUrl: cert?.credentialUrl || '',
            };

      return (
        <FieldGroup key={certObj.id}>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink-900">
                Certification {index + 1}
              </p>
              <p className="text-xs text-ink-500">
                Keep certification name exact and add issuer details clearly.
              </p>
            </div>
            <button
              type="button"
              onClick={() => removeCertification(index)}
              className="btn-danger btn-sm"
            >
              <Icon name="trash" className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Certification name</label>
              <input
                className="input"
                value={certObj.name}
                onChange={(e) => updateCertification(index, 'name', e.target.value)}
                placeholder="AWS Certified Solutions Architect – Associate"
              />
            </div>

            <div>
              <label className="label">Issuer</label>
              <input
                className="input"
                value={certObj.issuer}
                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                placeholder="Amazon Web Services"
              />
            </div>

            <div>
              <label className="label">Year</label>
              <input
                className="input"
                value={certObj.year}
                onChange={(e) => updateCertification(index, 'year', e.target.value)}
                placeholder="2024"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="label">Credential URL</label>
              <input
                className="input"
                value={certObj.credentialUrl}
                onChange={(e) => updateCertification(index, 'credentialUrl', e.target.value)}
                placeholder="https://www.credly.com/..."
              />
            </div>
          </div>
        </FieldGroup>
      );
    })
  )}
</SectionCard>

          <SectionCard
            id="achievements"
            eyebrow="Achievements"
            title="Achievements"
            description="Awards, recognition, and notable accomplishments."
          >
            <textarea
              className="input min-h-[80px] resize-none"
              value={achievementsText}
              onChange={(e) => top('achievements', fromLines(e.target.value))}
              placeholder={'Won the company hackathon 2024\nLed migration to a 40% cost reduction in infrastructure'}
            />
          </SectionCard>
        </div>

        <div className={`space-y-4 ${mobileTab === 'edit' ? 'hidden lg:block' : ''}`}>
          <div className={`space-y-4 lg:hidden ${mobileTab === 'preview' ? 'hidden' : ''}`}>
            <AIActionPanel resume={resume} setResume={setResume} />
            <ExportPanel
              resumeId={currentId}
              premium={premium}
              exportStatus={exportStatus}
              selectedTemplate={template}
              onTemplateChange={setTemplate}
              onExported={() => setSuccess('Your resume has been downloaded!')}
              refreshStatuses={refreshStatuses}
            />
          </div>

          <div className={`space-y-4 lg:hidden ${mobileTab === 'edit' ? 'hidden' : ''}`}>
            <ResumePreview
              resume={resume}
              template={template}
              onTemplateChange={setTemplate}
            />
            <ExportPanel
              resumeId={currentId}
              premium={premium}
              exportStatus={exportStatus}
              selectedTemplate={template}
              onTemplateChange={setTemplate}
              onExported={() => setSuccess('Your resume has been downloaded!')}
              refreshStatuses={refreshStatuses}
            />
          </div>

          <div className="hidden space-y-4 lg:block">
            <ResumePreview
              resume={resume}
              template={template}
              onTemplateChange={setTemplate}
            />
            <AIActionPanel resume={resume} setResume={setResume} />
            <ExportPanel
              resumeId={currentId}
              premium={premium}
              exportStatus={exportStatus}
              selectedTemplate={template}
              onTemplateChange={setTemplate}
              onExported={() => setSuccess('Your resume has been downloaded!')}
              refreshStatuses={refreshStatuses}
            />
          </div>
        </div>
      </div>
    </div>
  );
};