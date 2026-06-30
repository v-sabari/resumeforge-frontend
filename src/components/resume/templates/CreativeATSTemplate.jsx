import React from 'react';

export const CreativeATSTemplate = ({ data }) => {
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
    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-3">
      <span className="w-8 h-0.5 bg-blue-500 shrink-0"></span>
      {children}
    </h2>
  );

  return (
    <div className="resume-template creative-ats max-w-4xl mx-auto bg-white shadow-lg font-sans flex">
      <div className="w-2 bg-gradient-to-b from-blue-500 to-blue-700 shrink-0"></div>

      <div className="flex-1 p-8">
        {/* Header */}
        {personalInfo && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{personalInfo.fullName}</h1>
            {personalInfo.title && (
              <div className="text-base text-blue-600 font-medium mb-2">{personalInfo.title}</div>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-gray-500">
              {personalInfo.email    && <span>{personalInfo.email}</span>}
              {personalInfo.phone    && <span>{personalInfo.phone}</span>}
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.linkedin && <span className="break-all">{personalInfo.linkedin}</span>}
              {personalInfo.github   && <span className="break-all">{personalInfo.github}</span>}
              {personalInfo.portfolio && <span className="break-all">{personalInfo.portfolio}</span>}
            </div>
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="mb-6">
            <SectionTitle>Professional Summary</SectionTitle>
            <p className="text-gray-700 leading-relaxed ml-11">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <div className="mb-6">
            <SectionTitle>Work Experience</SectionTitle>
            <div className="ml-11 space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start flex-wrap gap-1 mb-0.5">
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <span className="text-sm text-gray-500 whitespace-nowrap">{exp.duration}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
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
                        <li key={i} className="text-gray-700 text-sm flex items-start">
                          <span className="text-blue-400 mr-2 shrink-0">▸</span>
                          <span className="leading-relaxed">{r}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="mb-6">
            <SectionTitle>Key Projects</SectionTitle>
            <div className="ml-11 space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx}>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5">
                    <h3 className="font-bold text-gray-900">{proj.name}</h3>
                    {proj.role && <span className="text-sm text-gray-500">({proj.role})</span>}
                  </div>
                  {proj.technologies && (
                    <div className="text-sm text-gray-500 mb-0.5">Tech: {proj.technologies}</div>
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
                        <li key={i} className="text-gray-700 text-sm flex items-start">
                          <span className="text-blue-400 mr-2 shrink-0">▸</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="mb-6">
            <SectionTitle>Education</SectionTitle>
            <div className="ml-11 space-y-3">
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start flex-wrap gap-1">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                      </h3>
                      <div className="text-gray-600 text-sm">{edu.institution}</div>
                      {edu.gpa     && <div className="text-xs text-gray-500">Grade: {edu.gpa}</div>}
                      {edu.details && <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{edu.details}</div>}
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">{edu.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills && (Array.isArray(skills) ? skills.length > 0 : skills) && (
          <div className="mb-6">
            <SectionTitle>Skills &amp; Expertise</SectionTitle>
            <div className="ml-11 text-gray-700 text-sm">
              {Array.isArray(skills) ? skills.join(' · ') : skills}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <div className="mb-6">
            <SectionTitle>Achievements</SectionTitle>
            <ul className="ml-11 space-y-1.5">
              {achievements.map((a, idx) => (
                <li key={idx} className="text-gray-700 text-sm flex items-start">
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
            <div className="ml-11 space-y-1.5">
              {certifications.map((cert, idx) => (
                <div key={idx} className="text-sm text-gray-700">
                  <span className="font-medium">{cert.name}</span>
                  {cert.issuer && <span className="text-gray-500"> · {cert.issuer}</span>}
                  {cert.year   && <span className="text-gray-400"> ({cert.year})</span>}
                  {cert.credentialUrl && (
                    <span className="block text-xs text-gray-400 break-all">{cert.credentialUrl}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
