const PreviewSection = ({ title, children }) => (
  <section className="mt-6">
    <div className="flex items-center gap-3">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">{title}</h2>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
    <div className="mt-3">{children}</div>
  </section>
);

export const ResumePreview = ({ resume }) => (
  <div className="card sticky top-6 overflow-hidden">
    <div className="border-b border-slate-200 bg-slate-50/90 px-5 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Live preview</p>
          <p className="mt-1 text-sm text-slate-600">Paper-style layout inspired by modern resume builders</p>
        </div>
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Preview ready</div>
      </div>
    </div>

    <div className="max-h-[calc(100vh-7rem)] overflow-y-auto bg-[#eef2f7] p-4 sm:p-5">
      <div className="mx-auto min-h-[960px] w-full max-w-[760px] rounded-[28px] border border-slate-200 bg-white px-7 py-8 shadow-soft sm:px-10 sm:py-10">
        <header className="border-b border-slate-200 pb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-[32px] font-semibold tracking-tight text-slate-950">{resume.fullName || 'Your Name'}</h1>
              <p className="mt-2 text-base font-medium text-brand-700">{resume.professionalTitle || 'Your Professional Title'}</p>
            </div>
            <div className="max-w-xs space-y-1 text-right text-sm text-slate-600">
              {[resume.email, resume.phone, resume.location].filter(Boolean).map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
            {[resume.linkedin, resume.github, resume.portfolio].filter(Boolean).map((item) => <span key={item}>{item}</span>)}
          </div>
        </header>

        {resume.summary ? (
          <PreviewSection title="Professional Summary">
            <p className="text-sm leading-7 text-slate-700">{resume.summary}</p>
          </PreviewSection>
        ) : null}

        {resume.skills?.length ? (
          <PreviewSection title="Skills">
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">{skill}</span>
              ))}
            </div>
          </PreviewSection>
        ) : null}

        {resume.experience?.length ? (
          <PreviewSection title="Experience">
            <div className="space-y-5">
              {resume.experience.map((item) => (
                <article key={item.id}>
                  <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{item.role}</h3>
                      <p className="text-sm text-slate-600">{[item.company, item.location].filter(Boolean).join(' · ')}</p>
                    </div>
                    <p className="text-sm text-slate-500">{[item.startDate, item.endDate].filter(Boolean).join(' — ')}</p>
                  </div>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                    {item.bullets?.filter(Boolean).map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </PreviewSection>
        ) : null}

        {resume.projects?.length ? (
          <PreviewSection title="Projects">
            <div className="space-y-4">
              {resume.projects.map((project) => (
                <article key={project.id}>
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                    <h3 className="font-semibold text-slate-900">{project.name}</h3>
                    {project.link ? <span className="text-sm text-brand-700">{project.link}</span> : null}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{project.description}</p>
                </article>
              ))}
            </div>
          </PreviewSection>
        ) : null}

        {resume.education?.length ? (
          <PreviewSection title="Education">
            <div className="space-y-4">
              {resume.education.map((edu) => (
                <article key={edu.id} className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{edu.degree}</h3>
                    <p className="text-sm text-slate-600">{[edu.institution, edu.location || edu.field].filter(Boolean).join(' · ')}</p>
                  </div>
                  <p className="text-sm text-slate-500">{[edu.startDate, edu.endDate].filter(Boolean).join(' — ')}</p>
                </article>
              ))}
            </div>
          </PreviewSection>
        ) : null}

        {resume.certifications?.length ? (
          <PreviewSection title="Certifications">
            <ul className="space-y-2 text-sm text-slate-700">
              {resume.certifications.map((cert) => (
                <li key={cert.id}>{[cert.name, cert.issuer, cert.year].filter(Boolean).join(' · ')}</li>
              ))}
            </ul>
          </PreviewSection>
        ) : null}

        {resume.achievements?.length ? (
          <PreviewSection title="Achievements">
            <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
              {resume.achievements.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </PreviewSection>
        ) : null}
      </div>
    </div>
  </div>
);
