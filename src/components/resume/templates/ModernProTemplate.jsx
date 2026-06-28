import React from 'react';

/*
 * ROOT CAUSE FIX 1: projects and achievements were never destructured from
 * `data` and never rendered.  Because "modern" is the default template, every
 * user saw a preview that was silently missing their Projects and Achievements
 * sections regardless of what they had filled in.
 */
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
    <div className="resume-template modern-pro max-w-4xl mx-auto bg-white p-8 shadow-lg">
      {/* Header */}
      {personalInfo && (
        <div className="border-b-2 border-primary-600 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{personalInfo.fullName}</h1>
          {personalInfo.title && (
            <div className="text-base text-gray-700 font-medium mb-1">{personalInfo.title}</div>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo.github && <span>{personalInfo.github}</span>}
            {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience && Array.isArray(experience) && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                <span className="text-sm text-gray-600 whitespace-nowrap ml-4">{exp.duration}</span>
              </div>
              <div className="text-gray-700 mb-2">
                {exp.company}{exp.location ? ` • ${exp.location}` : ''}
              </div>
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i} className="leading-relaxed">{resp}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects && Array.isArray(projects) && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Projects
          </h2>
          {projects.map((project, idx) => (
            <div key={idx} className="mb-4">
              <h3 className="font-bold text-gray-900">{project.name}</h3>
              {project.technologies && (
                <div className="text-sm text-gray-600 mb-1">
                  Technologies: {project.technologies}
                </div>
              )}
              {project.description && (
                <p className="text-gray-700 leading-relaxed">{project.description}</p>
              )}
              {project.highlights && Array.isArray(project.highlights) && project.highlights.length > 0 && (
                <ul className="list-disc list-inside mt-1 space-y-1 text-gray-700">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="leading-relaxed">{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && Array.isArray(education) && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <div className="text-gray-700">{edu.institution}</div>
                  {edu.gpa && <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>}
                </div>
                <span className="text-sm text-gray-600 whitespace-nowrap ml-4">{edu.year}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Skills
          </h2>
          <div className="text-gray-700">
            {typeof skills === 'string' ? skills : Array.isArray(skills) ? skills.join(' • ') : ''}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements && Array.isArray(achievements) && achievements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Achievements
          </h2>
          <ul className="space-y-2">
            {achievements.map((achievement, idx) => (
              <li key={idx} className="flex items-start text-gray-700">
                <span className="font-bold mr-2 shrink-0">▸</span>
                <span className="leading-relaxed">{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Certifications */}
      {certifications && Array.isArray(certifications) && certifications.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Certifications
          </h2>
          {certifications.map((cert, idx) => (
            <div key={idx} className="mb-2 text-gray-700">
              <span className="font-medium">{cert.name}</span>
              {cert.issuer && <span className="text-gray-600"> — {cert.issuer}</span>}
              {cert.year && <span className="text-sm text-gray-500"> ({cert.year})</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};