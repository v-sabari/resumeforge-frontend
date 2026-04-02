const PreviewSection = ({ title, children }) => (
  <section className="mt-5">
    <div className="flex items-center gap-3 mb-2.5">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">{title}</h2>
      <div className="h-px flex-1 bg-slate-100" />
    </div>
    {children}
  </section>
);

export const ResumePreview = ({ resume }) => (
  <div className="card overflow-hidden sticky top-20">
    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live preview</p>
        <p className="text-xs text-slate-500 mt-0.5">ATS-friendly paper layout</p>
      </div>
      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
        Preview ready
      </span>
    </div>

    <div className="max-h-[calc(100vh-10rem)] overflow-y-auto bg-slate-100/70 p-4">
      <div className="mx-auto w-full max-w-[700px] min-h-[900px] rounded-xl border border-slate-200 bg-white px-7 py-8 shadow-sm">
        <header className="border-b border-slate-100 pb-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">{resume.fullName || 'Your Name'}</h1>
              <p className="mt-1 text-sm font-medium text-brand-700">{resume.professionalTitle || 'Professional Title'}</p>
            </div>
            <div className="space-y-0.5 text-right text-xs text-slate-600">
              {[resume.email, resume.phone, resume.location].filter(Boolean).map((i) => <p key={i}>{i}</p>)}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
            {[resume.linkedin, resume.github, resume.portfolio].filter(Boolean).map((i) => <span key={i}>{i}</span>)}
          </div>
        </header>

        {resume.summary && (
          <PreviewSection title="Professional Summary">
            <p className="text-xs leading-6 text-slate-700">{resume.summary}</p>
          </PreviewSection>
        )}

        {resume.skills?.length > 0 && (
          <PreviewSection title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.map((s) => (
                <span key={s} className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-700">{s}</span>
              ))}
            </div>
          </PreviewSection>
        )}

        {resume.experience?.length > 0 && (
          <PreviewSection title="Experience">
            <div className="space-y-4">
              {resume.experience.map((item) => (
                <article key={item.id}>
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-slate-900">{item.role}</h3>
                      <p className="text-[10px] text-slate-500">{[item.company, item.location].filter(Boolean).join(' · ')}</p>
                    </div>
                    <p className="text-[10px] text-slate-500">{[item.startDate, item.endDate].filter(Boolean).join(' — ')}</p>
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-[10px] leading-5 text-slate-700">
                    {item.bullets?.filter(Boolean).map((b) => <li key={b}>{b}</li>)}
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
                    <h3 className="text-xs font-semibold text-slate-900">{p.name}</h3>
                    {p.link && <span className="text-[10px] text-brand-600">{p.link}</span>}
                  </div>
                  <p className="mt-1 text-[10px] leading-5 text-slate-700">{p.description}</p>
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
                    <h3 className="text-xs font-semibold text-slate-900">{e.degree}</h3>
                    <p className="text-[10px] text-slate-500">{[e.institution, e.location || e.field].filter(Boolean).join(' · ')}</p>
                  </div>
                  <p className="text-[10px] text-slate-500">{[e.startDate, e.endDate].filter(Boolean).join(' — ')}</p>
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
