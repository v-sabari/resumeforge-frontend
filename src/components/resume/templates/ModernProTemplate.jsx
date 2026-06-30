import React from 'react';

export const ModernProTemplate = ({ data }) => {
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

  return (
    <div className="resume-template modern-pro max-w-4xl mx-auto bg-white p-8 shadow-lg font-sans">

      {/* ── Header ── */}
      {personalInfo && (
        <div className="border-b-2 border-gray-800 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{personalInfo.fullName}</h1>
          {personalInfo.title && (
            <div className="text-base text-gray-600 font-medium mb-2">{personalInfo.title}</div>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
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
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300 uppercase tracking-wide">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* ── Experience ── */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-300 uppercase tracking-wide">
            Professional Experience
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-5">
              <div className="flex justify-between items-start flex-wrap gap-1 mb-1">
                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                <span className="text-sm text-gray-500 whitespace-nowrap">{exp.duration}</span>
              </div>
              <div className="text-sm text-gray-700 mb-1">
                {exp.company}
                {exp.location       && ` · ${exp.location}`}
                {exp.employmentType && ` · ${exp.employmentType}`}
              </div>
              {exp.summary && (
                <p className="text-sm text-gray-600 mb-1 leading-relaxed">{exp.summary}</p>
              )}
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  {exp.responsibilities.map((r, i) => (
                    <li key={i} className="leading-relaxed">{r}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Projects ── */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-300 uppercase tracking-wide">
            Projects
          </h2>
          {projects.map((proj, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5">
                <h3 className="font-bold text-gray-900">{proj.name}</h3>
                {proj.role && <span className="text-sm text-gray-500">({proj.role})</span>}
              </div>
              {proj.technologies && (
                <div className="text-sm text-gray-600 mb-1">Tech: {proj.technologies}</div>
              )}
              {(proj.link || proj.github) && (
                <div className="text-xs text-gray-500 mb-1 break-all">
                  {[proj.link, proj.github].filter(Boolean).join('  ·  ')}
                </div>
              )}
              {proj.description && (
                <p className="text-gray-700 text-sm leading-relaxed">{proj.description}</p>
              )}
              {proj.highlights && proj.highlights.length > 0 && (
                <ul className="list-disc list-inside mt-1 space-y-1 text-gray-700 text-sm">
                  {proj.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Education ── */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 pb-1 border-b border-gray-300 uppercase tracking-wide">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-start flex-wrap gap-1">
                <div>
                  <h3 className="font-bold text-gray-900">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                  </h3>
                  <div className="text-gray-700 text-sm">{edu.institution}</div>
                  {edu.gpa     && <div className="text-xs text-gray-500">Grade: {edu.gpa}</div>}
                  {edu.details && <div className="text-xs text-gray-500 mt-0.5">{edu.details}</div>}
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap">{edu.year}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Skills ── */}
      {skills && (Array.isArray(skills) ? skills.length > 0 : skills) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300 uppercase tracking-wide">
            Skills
          </h2>
          <div className="text-gray-700 text-sm">
            {Array.isArray(skills) ? skills.join(' · ') : skills}
          </div>
        </div>
      )}

      {/* ── Achievements ── */}
      {achievements && achievements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300 uppercase tracking-wide">
            Achievements
          </h2>
          <ul className="space-y-1.5">
            {achievements.map((a, idx) => (
              <li key={idx} className="flex items-start text-gray-700 text-sm">
                <span className="font-bold mr-2 shrink-0 text-gray-400">▸</span>
                <span className="leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Certifications ── */}
      {certifications && certifications.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300 uppercase tracking-wide">
            Certifications
          </h2>
          {certifications.map((cert, idx) => (
            <div key={idx} className="mb-1.5 text-sm text-gray-700">
              <span className="font-medium">{cert.name}</span>
              {cert.issuer && <span className="text-gray-600"> — {cert.issuer}</span>}
              {cert.year   && <span className="text-gray-500"> ({cert.year})</span>}
              {cert.credentialUrl && (
                <span className="text-gray-400 text-xs block break-all">{cert.credentialUrl}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};