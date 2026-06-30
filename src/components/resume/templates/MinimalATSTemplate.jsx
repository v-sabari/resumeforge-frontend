import React from 'react';

export const MinimalATSTemplate = ({ data }) => {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
  } = data;

  const Section = ({ title }) => (
    <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500 border-b border-gray-200 pb-0.5 mb-2 mt-5 first:mt-0">
      {title}
    </div>
  );

  return (
    <div className="resume-template minimal-ats max-w-4xl mx-auto bg-white px-10 py-8 shadow-lg font-sans text-sm text-gray-800">

      {/* ── Header ── */}
      {personalInfo && (
        <div className="mb-5">
          <h1 className="text-2xl font-light tracking-tight text-gray-900 mb-0.5">
            {personalInfo.fullName}
          </h1>
          {personalInfo.title && (
            <div className="text-sm text-gray-600 mb-1.5">{personalInfo.title}</div>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
            {personalInfo.email    && <span>{personalInfo.email}</span>}
            {personalInfo.phone    && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span className="break-all">{personalInfo.linkedin}</span>}
            {personalInfo.github   && <span className="break-all">{personalInfo.github}</span>}
            {personalInfo.portfolio && <span className="break-all">{personalInfo.portfolio}</span>}
          </div>
        </div>
      )}

      {/* ── Summary ── */}
      {summary && (
        <>
          <Section title="Profile" />
          <p className="text-gray-600 leading-relaxed">{summary}</p>
        </>
      )}

      {/* ── Experience ── */}
      {experience && experience.length > 0 && (
        <>
          <Section title="Experience" />
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <span className="font-semibold text-gray-900">{exp.position}</span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{exp.duration}</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {exp.company}
                  {exp.location       && `, ${exp.location}`}
                  {exp.employmentType && ` · ${exp.employmentType}`}
                </div>
                {exp.summary && (
                  <p className="text-xs text-gray-600 mb-1 leading-relaxed">{exp.summary}</p>
                )}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="space-y-0.5">
                    {exp.responsibilities.map((r, i) => (
                      <li key={i} className="flex gap-2 text-gray-600 text-xs">
                        <span className="text-gray-300 shrink-0 mt-0.5">–</span>
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Skills ── */}
      {skills && (Array.isArray(skills) ? skills.length > 0 : skills) && (
        <>
          <Section title="Skills" />
          <p className="text-gray-600 text-xs leading-relaxed">
            {Array.isArray(skills) ? skills.join('  ·  ') : skills}
          </p>
        </>
      )}

      {/* ── Projects ── */}
      {projects && projects.length > 0 && (
        <>
          <Section title="Projects" />
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5">
                  <span className="font-semibold text-gray-900">{proj.name}</span>
                  {proj.role && <span className="text-xs text-gray-400">({proj.role})</span>}
                </div>
                {proj.technologies && (
                  <div className="text-xs text-gray-500 mb-0.5">Tech: {proj.technologies}</div>
                )}
                {(proj.link || proj.github) && (
                  <div className="text-xs text-gray-400 mb-0.5 break-all">
                    {[proj.link, proj.github].filter(Boolean).join('  ·  ')}
                  </div>
                )}
                {proj.description && (
                  <p className="text-xs text-gray-600 leading-relaxed">{proj.description}</p>
                )}
                {proj.highlights && proj.highlights.length > 0 && (
                  <ul className="mt-0.5 space-y-0.5">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="flex gap-2 text-xs text-gray-600">
                        <span className="text-gray-300 shrink-0 mt-0.5">–</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Education ── */}
      {education && education.length > 0 && (
        <>
          <Section title="Education" />
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <div>
                    <span className="font-semibold text-gray-900">{edu.degree}</span>
                    {edu.field && <span className="text-gray-500"> in {edu.field}</span>}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{edu.year}</span>
                </div>
                {edu.institution && (
                  <div className="text-xs text-gray-500">{edu.institution}</div>
                )}
                {edu.gpa && (
                  <div className="text-xs text-gray-400">Grade: {edu.gpa}</div>
                )}
                {edu.details && (
                  <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{edu.details}</div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Achievements ── */}
      {achievements && achievements.length > 0 && (
        <>
          <Section title="Achievements" />
          <ul className="space-y-1">
            {achievements.map((a, idx) => (
              <li key={idx} className="flex gap-2 text-xs text-gray-600">
                <span className="text-gray-300 shrink-0 mt-0.5">–</span>
                <span className="leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* ── Certifications ── */}
      {certifications && certifications.length > 0 && (
        <>
          <Section title="Certifications" />
          <div className="space-y-1">
            {certifications.map((cert, idx) => (
              <div key={idx} className="text-xs text-gray-600">
                <span className="font-medium">{cert.name}</span>
                {cert.issuer && <span className="text-gray-500"> — {cert.issuer}</span>}
                {cert.year   && <span className="text-gray-400"> ({cert.year})</span>}
                {cert.credentialUrl && (
                  <span className="block text-gray-400 break-all">{cert.credentialUrl}</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
