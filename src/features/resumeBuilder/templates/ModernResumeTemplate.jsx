export const ModernResumeTemplate = ({ resume }) => (
  <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
    <aside className="rounded-3xl bg-slate-950 p-6 text-white">
      <h1 className="text-3xl font-semibold">{resume.fullName || 'Your Name'}</h1>
      <p className="mt-2 text-brand-200">{resume.professionalTitle}</p>
      <div className="mt-6 space-y-2 text-sm text-slate-200">
        {[resume.email, resume.phone, resume.location, resume.linkedin, resume.github, resume.portfolio].filter(Boolean).map((item) => <p key={item}>{item}</p>)}
      </div>
      {resume.skills?.length ? (
        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">Skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {resume.skills.map((skill) => <span key={skill} className="rounded-full bg-white/10 px-3 py-1 text-xs">{skill}</span>)}
          </div>
        </section>
      ) : null}
      {resume.certifications?.length ? (
        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">Certifications</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-200">
            {resume.certifications.map((cert) => <p key={cert.id}>{cert.name} · {cert.issuer} · {cert.year}</p>)}
          </div>
        </section>
      ) : null}
    </aside>
    <div>
      {resume.summary ? <section><h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Summary</h2><p className="mt-3 text-sm leading-7 text-slate-700">{resume.summary}</p></section> : null}
      {resume.experience?.length ? <section className="mt-6"><h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Experience</h2><div className="mt-4 space-y-5">{resume.experience.map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex flex-col gap-2 md:flex-row md:justify-between"><div><h3 className="font-semibold text-slate-900">{item.role}</h3><p className="text-sm text-slate-600">{item.company} · {item.location}</p></div><p className="text-sm text-slate-500">{item.startDate} — {item.endDate}</p></div><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">{item.bullets?.filter(Boolean).map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></article>)}</div></section> : null}
      {resume.projects?.length ? <section className="mt-6"><h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Projects</h2><div className="mt-4 space-y-4">{resume.projects.map((project) => <article key={project.id}><div className="flex items-center justify-between gap-4"><h3 className="font-semibold text-slate-900">{project.name}</h3>{project.link ? <span className="text-sm text-brand-700">{project.link}</span> : null}</div><p className="mt-2 text-sm leading-6 text-slate-700">{project.description}</p></article>)}</div></section> : null}
      {resume.education?.length ? <section className="mt-6"><h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Education</h2><div className="mt-4 space-y-4">{resume.education.map((edu) => <article key={edu.id} className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between"><div><h3 className="font-semibold text-slate-900">{edu.degree}</h3><p className="text-sm text-slate-600">{edu.institution} · {edu.location}</p></div><p className="text-sm text-slate-500">{edu.startDate} — {edu.endDate}</p></article>)}</div></section> : null}
      {resume.achievements?.length ? <section className="mt-6"><h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Achievements</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">{resume.achievements.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
    </div>
  </div>
);
