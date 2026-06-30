import React from 'react';

export const ExecutiveTemplate = ({ data }) => {
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

  const SectionTitle = ({ children }) => (
    <h2 className="text-base font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-800 pb-1 mb-3">
      {children}
    </h2>
  );

  return (
    <div className="resume-template executive max-w-4xl mx-auto bg-white p-8 shadow-lg font-sans">

      {/* Header */}
      {personalInfo && (
        <div className="text-center border-b-2 border-gray-800 pb-5 mb-6">
          <h1 className="text-3xl font-bold tracking-wide uppercase text-gray-900 mb-1">
            {personalInfo.fullName}
          </h1>
          {personalInfo.title && (
            <div className="text-sm font-medium text-gray-600 uppercase tracking-widest mb-2">
              {personalInfo.title}
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-sm text-gray-600">
            {personalInfo.email    && <span>{personalInfo.email}</span>}
            {personalInfo.phone    && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {/* FIX: linkedin, github, portfolio were missing from Executive header */}
            {personalInfo.linkedin  && <span className="break-all">{personalInfo.linkedin}</span>}
            {personalInfo.github    && <span className="break-all">{personalInfo.github}</span>}
            {personalInfo.portfolio && <span className="break-all">{personalInfo.portfolio}</span>}
          </div>
        </div>
      )}

      {/* Executive Profile */}
      {summary && (
        <div className="mb-6">
          <SectionTitle>Executive Profile</SectionTitle>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Key Achievements */}
      {achievements && achievements.length > 0 && (
        <div className="mb-6">
          <SectionTitle>Key Achievements</SectionTitle>
          <ul className="space-y-1.5">
            {achievements.map((a, idx) => (
              <li key={idx} className="flex items-start text-gray-700">
                <span className="text-gray-400 font-bold mr-3 shrink-0">▸</span>
                <span className="leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Leadership Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <SectionTitle>Leadership Experience</SectionTitle>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-5">
              <div className="flex justify-between items-start flex-wrap gap-1 mb-0.5">
                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                <span className="text-sm text-gray-500 whitespace-nowrap">{exp.duration}</span>
              </div>
              <div className="text-sm text-gray-700 font-medium mb-1">
                {exp.company}
                {exp.location       && ` · ${exp.location}`}
                {exp.employmentType && ` · ${exp.employmentType}`}
              </div>
              {exp.summary && (
                <p className="text-sm text-gray-600 mb-1 leading-relaxed">{exp.summary}</p>
              )}
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="space-y-1">
                  {exp.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start text-gray-700 text-sm">
                      <span className="text-gray-400 mr-2 shrink-0">▸</span>
                      <span className="leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Key Projects — FIX: was completely absent from ExecutiveTemplate */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <SectionTitle>Key Projects</SectionTitle>
          {projects.map((proj, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5">
                <h3 className="font-bold text-gray-900">{proj.name}</h3>
                {proj.role && <span className="text-sm text-gray-500">({proj.role})</span>}
              </div>
              {proj.technologies && (
                <div className="text-sm text-gray-600 mb-0.5">Tech: {proj.technologies}</div>
              )}
              {(proj.link || proj.github) && (
                <div className="text-xs text-gray-400 mb-0.5 break-all">
                  {[proj.link, proj.github].filter(Boolean).join('  ·  ')}
                </div>
              )}
              {proj.description && (
                <p className="text-gray-700 text-sm leading-relaxed">{proj.description}</p>
              )}
              {proj.highlights && proj.highlights.length > 0 && (
                <ul className="mt-1 space-y-1">
                  {proj.highlights.map((h, i) => (
                    <li key={i} className="flex items-start text-gray-700 text-sm">
                      <span className="text-gray-400 mr-2 shrink-0">▸</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <SectionTitle>Education</SectionTitle>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-start flex-wrap gap-1">
                <div>
                  <h3 className="font-bold text-gray-900">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </h3>
                  <div className="text-gray-700 text-sm">{edu.institution}</div>
                  {edu.gpa     && <div className="text-xs text-gray-500">Grade: {edu.gpa}</div>}
                  {edu.details && <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{edu.details}</div>}
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap">{edu.year}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Core Competencies */}
      {skills && (Array.isArray(skills) ? skills.length > 0 : skills) && (
        <div className="mb-6">
          <SectionTitle>Core Competencies</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(skills) ? skills : [skills]).map((s, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 text-sm rounded-sm">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div>
          <SectionTitle>Certifications</SectionTitle>
          {certifications.map((cert, idx) => (
            <div key={idx} className="mb-1.5 text-sm text-gray-700">
              <span className="font-medium">{cert.name}</span>
              {cert.issuer && <span className="text-gray-600"> — {cert.issuer}</span>}
              {cert.year   && <span className="text-gray-500"> ({cert.year})</span>}
              {cert.credentialUrl && (
                <span className="block text-xs text-gray-400 break-all">{cert.credentialUrl}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
