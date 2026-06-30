import React from 'react';

export const FresherTemplate = ({ data }) => {
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
    <h2 className="text-sm font-bold text-blue-700 uppercase tracking-widest border-b border-blue-200 pb-1 mb-3">
      {children}
    </h2>
  );

  return (
    <div className="resume-template fresher max-w-4xl mx-auto bg-white p-8 shadow-lg font-sans">

      {/* Header */}
      {personalInfo && (
        <div className="text-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{personalInfo.fullName}</h1>
          {personalInfo.title && (
            <div className="text-sm text-blue-600 font-medium mb-2">{personalInfo.title}</div>
          )}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-xs text-gray-600">
            {personalInfo.email    && <span>{personalInfo.email}</span>}
            {personalInfo.phone    && <span>|</span>}
            {personalInfo.phone    && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>|</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-0.5 text-xs text-blue-600">
            {personalInfo.linkedin  && <span className="break-all">{personalInfo.linkedin}</span>}
            {/* FIX: github and portfolio were missing from FresherTemplate header */}
            {personalInfo.github    && <span className="break-all">{personalInfo.github}</span>}
            {personalInfo.portfolio && <span className="break-all">{personalInfo.portfolio}</span>}
          </div>
        </div>
      )}

      {/* Career Objective */}
      {summary && (
        <div className="mb-5">
          <SectionTitle>Career Objective</SectionTitle>
          <p className="text-gray-700 text-sm leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-5">
          <SectionTitle>Education</SectionTitle>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-start flex-wrap gap-1">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </h3>
                  <div className="text-gray-600 text-sm">{edu.institution}</div>
                  {edu.gpa     && <div className="text-xs text-gray-500">Grade / CGPA: {edu.gpa}</div>}
                  {edu.details && <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{edu.details}</div>}
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{edu.year}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-5">
          <SectionTitle>Projects</SectionTitle>
          {projects.map((proj, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5">
                <h3 className="font-bold text-gray-900 text-sm">{proj.name}</h3>
                {proj.role && <span className="text-xs text-gray-500">({proj.role})</span>}
              </div>
              {proj.technologies && (
                <div className="text-xs text-blue-600 mb-0.5">Tech: {proj.technologies}</div>
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
                <ul className="mt-1 space-y-0.5">
                  {proj.highlights.map((h, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-700">
                      <span className="text-blue-400 mr-2 shrink-0">▸</span>
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Experience — FIX: was completely absent from FresherTemplate */}
      {experience && experience.length > 0 && (
        <div className="mb-5">
          <SectionTitle>Experience</SectionTitle>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-start flex-wrap gap-1 mb-0.5">
                <h3 className="font-bold text-gray-900 text-sm">{exp.position}</h3>
                <span className="text-xs text-gray-500 whitespace-nowrap">{exp.duration}</span>
              </div>
              <div className="text-xs text-gray-600 mb-1">
                {exp.company}
                {exp.location       && ` · ${exp.location}`}
                {exp.employmentType && ` · ${exp.employmentType}`}
              </div>
              {exp.summary && (
                <p className="text-sm text-gray-600 mb-1 leading-relaxed">{exp.summary}</p>
              )}
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="space-y-0.5">
                  {exp.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-700">
                      <span className="text-blue-400 mr-2 shrink-0">▸</span>
                      <span className="leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && (Array.isArray(skills) ? skills.length > 0 : skills) && (
        <div className="mb-5">
          <SectionTitle>Technical Skills</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(skills) ? skills : [skills]).map((s, i) => (
              <span key={i} className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded text-xs font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <div className="mb-5">
          <SectionTitle>Achievements &amp; Awards</SectionTitle>
          <ul className="space-y-1">
            {achievements.map((a, idx) => (
              <li key={idx} className="flex items-start text-sm text-gray-700">
                <span className="text-blue-400 mr-2 shrink-0">▸</span>
                <span className="leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div>
          <SectionTitle>Certifications</SectionTitle>
          {certifications.map((cert, idx) => (
            <div key={idx} className="mb-1.5 text-sm text-gray-700">
              <span className="font-medium">{cert.name}</span>
              {cert.issuer && <span className="text-gray-500"> — {cert.issuer}</span>}
              {cert.year   && <span className="text-gray-400"> ({cert.year})</span>}
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