export const ResumePreview = ({ resume }) => (
  <div className="card sticky top-24 overflow-hidden p-0">
    <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Live preview</p>
      <p className="mt-1 text-sm text-slate-600">ATS-friendly layout tuned for export</p>
    </div>
    <div className="max-h-[calc(100vh-10rem)] overflow-y-auto bg-white px-8 py-8">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold text-slate-950">{resume.fullName || 'Your Name'}</h1>
        <p className="mt-2 text-lg text-brand-700">{resume.professionalTitle}</p>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
          {[resume.email, resume.phone, resume.location, resume.linkedin, resume.github, resume.portfolio]
            .filter(Boolean)
            .map((item) => (
              <span key={item}>{item}</span>
            ))}
        </div>
      </header>

      {resume.summary ? (
        <section className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Professional Summary</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">{resume.summary}</p>
        </section>
      ) : null}

      {resume.skills?.length ? (
        <section className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Skills</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-700">
            {resume.skills.map((skill) => (
              <span key={skill} className="rounded-full border border-slate-200 px-3 py-1">{skill}</span>
            ))}
          </div>
        </section>
      ) : null}

      {resume.experience?.length ? (
        <section className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Experience</h2>
          <div className="mt-4 space-y-5">
            {resume.experience.map((item) => (
              <article key={item.id}>
                <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.role}</h3>
                    <p className="text-sm text-slate-600">{item.company} · {item.location}</p>
                  </div>
                  <p className="text-sm text-slate-500">{item.startDate} — {item.endDate}</p>
                </div>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                  {item.bullets?.filter(Boolean).map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {resume.projects?.length ? (
        <section className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Projects</h2>
          <div className="mt-4 space-y-4">
            {resume.projects.map((project) => (
              <article key={project.id}>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-slate-900">{project.name}</h3>
                  {project.link ? <span className="text-sm text-brand-700">{project.link}</span> : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-700">{project.description}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {resume.education?.length ? (
        <section className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Education</h2>
          <div className="mt-4 space-y-4">
            {resume.education.map((edu) => (
              <article key={edu.id} className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{edu.degree}</h3>
                  <p className="text-sm text-slate-600">{edu.institution} · {edu.location}</p>
                </div>
                <p className="text-sm text-slate-500">{edu.startDate} — {edu.endDate}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {resume.certifications?.length ? (
        <section className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Certifications</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {resume.certifications.map((cert) => (
              <li key={cert.id}>{cert.name} · {cert.issuer} · {cert.year}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {resume.achievements?.length ? (
        <section className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Achievements</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
            {resume.achievements.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      ) : null}
    </div>
  </div>
);
