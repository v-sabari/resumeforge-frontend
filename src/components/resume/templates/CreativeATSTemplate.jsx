import React from 'react';

/*
 * ROOT CAUSE FIX 3: achievements was never destructured from `data` and never
 * rendered, causing the Achievements section to be invisible in the
 * "Creative ATS" template regardless of what the user filled in.
 */
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

  return (
    <div className="resume-template creative-ats max-w-4xl mx-auto bg-white shadow-lg">
      {/* Sidebar accent */}
      <div className="flex">
        {/* Left accent bar */}
        <div className="w-2 bg-gradient-to-b from-primary-500 to-primary-700"></div>

        {/* Main content */}
        <div className="flex-1 p-8">
          {/* Header */}
          {personalInfo && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{personalInfo.fullName}</h1>
              {personalInfo.title && (
                <div className="text-lg text-primary-600 font-medium mb-2">{personalInfo.title}</div>
              )}
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                {personalInfo.email && (
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                    {personalInfo.email}
                  </span>
                )}
                {personalInfo.phone && (
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                    {personalInfo.phone}
                  </span>
                )}
                {personalInfo.location && (
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                    {personalInfo.location}
                  </span>
                )}
                {personalInfo.linkedin && (
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                    {personalInfo.linkedin}
                  </span>
                )}
                {personalInfo.github && (
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                    {personalInfo.github}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Professional Summary */}
          {summary && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="w-8 h-0.5 bg-primary-500 mr-3"></span>
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed ml-11">{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience && Array.isArray(experience) && experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="w-8 h-0.5 bg-primary-500 mr-3"></span>
                Work Experience
              </h2>
              <div className="ml-11 space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <span className="text-sm text-gray-600 whitespace-nowrap ml-4">{exp.duration}</span>
                    </div>
                    <div className="text-gray-700 mb-2">
                      {exp.company}{exp.location ? ` • ${exp.location}` : ''}
                    </div>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="space-y-1.5">
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i} className="text-gray-700 leading-relaxed flex items-start">
                            <span className="text-primary-500 mr-2 mt-1.5 shrink-0">▸</span>
                            <span>{resp}</span>
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
          {education && Array.isArray(education) && education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="w-8 h-0.5 bg-primary-500 mr-3"></span>
                Education
              </h2>
              <div className="ml-11 space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx}>
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
            </div>
          )}

          {/* Projects */}
          {projects && Array.isArray(projects) && projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="w-8 h-0.5 bg-primary-500 mr-3"></span>
                Key Projects
              </h2>
              <div className="ml-11 space-y-3">
                {projects.map((project, idx) => (
                  <div key={idx}>
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
                      <ul className="mt-1 space-y-1">
                        {project.highlights.map((h, i) => (
                          <li key={i} className="text-gray-700 flex items-start">
                            <span className="text-primary-500 mr-2 mt-0.5 shrink-0">▸</span>
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

          {/* Skills */}
          {skills && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="w-8 h-0.5 bg-primary-500 mr-3"></span>
                Skills &amp; Expertise
              </h2>
              <div className="ml-11 text-gray-700">
                {typeof skills === 'string' ? skills : Array.isArray(skills) ? skills.join(' • ') : ''}
              </div>
            </div>
          )}

          {/* Achievements */}
          {achievements && Array.isArray(achievements) && achievements.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="w-8 h-0.5 bg-primary-500 mr-3"></span>
                Achievements
              </h2>
              <ul className="ml-11 space-y-2">
                {achievements.map((achievement, idx) => (
                  <li key={idx} className="text-gray-700 flex items-start">
                    <span className="text-primary-500 mr-2 mt-1 shrink-0">▸</span>
                    <span className="leading-relaxed">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications */}
          {certifications && Array.isArray(certifications) && certifications.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="w-8 h-0.5 bg-primary-500 mr-3"></span>
                Certifications
              </h2>
              <div className="ml-11 space-y-2">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="text-gray-700">
                    <span className="font-medium">{cert.name}</span>
                    {cert.issuer && <span className="text-gray-600"> · {cert.issuer}</span>}
                    {cert.year && <span className="text-sm text-gray-500"> ({cert.year})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};