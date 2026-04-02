const Line = ({ w = '100' }) => (
  <div className="h-1.5 rounded-full bg-slate-100" style={{ width: `${w}%` }} />
);

const PreviewSection = ({ title, children }) => (
  <section className="mt-5">
    <div className="mb-2 flex items-center gap-3">
      <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">{title}</p>
      <div className="h-px flex-1 bg-slate-100" />
    </div>
    {children}
  </section>
);

export const ResumePreview = ({ resume }) => (
  <div className="card sticky top-6 overflow-hidden">
    {/* Preview header */}
    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Live preview</p>
        <p className="text-xs text-slate-500">ATS-ready paper layout</p>
      </div>
      <span className="badge badge-green">Preview ready</span>
    </div>

    {/* Paper */}
    <div className="max-h-[calc(100vh-10rem)] overflow-y-auto bg-slate-100/60 p-3 sm:p-4">
      <div className="mx-auto min-h-[900px] w-full max-w-[680px] rounded-xl border border-slate-200 bg-white px-7 py-7 shadow-soft">
        {/* Header */}
        <header className="border-b border-slate-100 pb-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-950">{resume.fullName || 'Your Name'}</h1>
              <p className="mt-0.5 text-sm font-medium text-brand-700">{resume.professionalTitle || 'Professional Title'}</p>
            </div>
            <div className="space-y-0.5 text-right text-xs text-slate-500">
              {[resume.email, resume.phone, resume.location].filter(Boolean).map((v) => <p key={v}>{v}</p>)}
            </div>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-x-3 text-xs text-slate-400">
            {[resume.linkedin, resume.github, resume.portfolio].filter(Boolean).map((v) => <span key={v}>{v}</span>)}
          </div>
        </header>

        {resume.summary && (
          <PreviewSection title="Summary">
            <p className="text-xs leading-6 text-slate-700">{resume.summary}</p>
          </PreviewSection>
        )}

        {resume.skills?.length > 0 && (
          <PreviewSection title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.map((s) => (
                <span key={s} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">{s}</span>
              ))}
            </div>
          </PreviewSection>
        )}

        {resume.experience?.length > 0 && (
          <PreviewSection title="Experience">
            <div className="space-y-4">
              {resume.experience.map((x) => (
                <article key={x.id}>
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{x.role}</p>
                      <p className="text-[10px] text-slate-500">{[x.company, x.location].filter(Boolean).join(' · ')}</p>
                    </div>
                    <p className="text-[10px] text-slate-400">{[x.startDate, x.endDate].filter(Boolean).join(' — ')}</p>
                  </div>
                  <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[10px] leading-5 text-slate-700">
                    {x.bullets?.filter(Boolean).map((b) => <li key={b}>{b}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </PreviewSection>
        )}

        {resume.projects?.length > 0 && (
          <PreviewSection title="Projects">
            <div className="space-y-3">
              {resume.projects.map((p) => (
                <article key={p.id}>
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-semibold text-slate-900">{p.name}</p>
                    {p.link && <span className="text-[10px] text-brand-600">{p.link}</span>}
                  </div>
                  <p className="mt-0.5 text-[10px] leading-5 text-slate-700">{p.description}</p>
                </article>
              ))}
            </div>
          </PreviewSection>
        )}

        {resume.education?.length > 0 && (
          <PreviewSection title="Education">
            <div className="space-y-3">
              {resume.education.map((e) => (
                <article key={e.id} className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{e.degree}</p>
                    <p className="text-[10px] text-slate-500">{[e.institution, e.location || e.field].filter(Boolean).join(' · ')}</p>
                  </div>
                  <p className="text-[10px] text-slate-400">{[e.startDate, e.endDate].filter(Boolean).join(' — ')}</p>
                </article>
              ))}
            </div>
          </PreviewSection>
        )}

        {resume.certifications?.length > 0 && (
          <PreviewSection title="Certifications">
            <ul className="space-y-1 text-[10px] text-slate-700">
              {resume.certifications.map((c) => (
                <li key={c.id}>{[c.name, c.issuer, c.year].filter(Boolean).join(' · ')}</li>
              ))}
            </ul>
          </PreviewSection>
        )}

        {resume.achievements?.length > 0 && (
          <PreviewSection title="Achievements">
            <ul className="list-disc space-y-1 pl-4 text-[10px] leading-5 text-slate-700">
              {resume.achievements.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </PreviewSection>
        )}
      </div>
    </div>
  </div>
);
