import React from 'react';

export const FresherTemplate = ({ data }) => {
  const { personalInfo, summary, education, skills, projects, certifications, achievements } = data;

  return (
    <div className="resume-template fresher max-w-4xl mx-auto bg-white p-8 shadow-lg">
      {/* Header */}
      {personalInfo && (
        <div className="text-center border-b-2 border-primary-500 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{personalInfo.fullName}</h1>
          <div className="text-sm text-gray-600 space-x-3">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>|</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>|</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
          {personalInfo.linkedin && (
            <div className="text-sm text-primary-600 mt-1">{personalInfo.linkedin}</div>
          )}
        </div>
      )}

      {/* Objective/Summary */}
      {summary && (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">
            Career Objective
          </h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Education - Priority for freshers */}
      {education && Array.isArray(education) && education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">
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
                <span className="text-sm text-gray-600">{edu.year}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects && Array.isArray(projects) && projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">
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
              {project.highlights && Array.isArray(project.highlights) && (
                <ul className="mt-1 space-y-1">
                  {project.highlights.map((highlight, i) => (
                    <li key={i} className="text-gray-700 text-sm ml-4">• {highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">
            Technical Skills
          </h2>
          <div className="text-gray-700">
            {typeof skills === 'string' ? skills : Array.isArray(skills) ? skills.join(' | ') : ''}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && Array.isArray(certifications) && certifications.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">
            Certifications
          </h2>
          {certifications.map((cert, idx) => (
            <div key={idx} className="mb-2 text-gray-700">
              <span className="font-medium">{cert.name}</span>
              {cert.issuer && <span> - {cert.issuer}</span>}
              {cert.year && <span className="text-sm text-gray-600"> ({cert.year})</span>}
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {achievements && Array.isArray(achievements) && achievements.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide">
            Achievements
          </h2>
          <ul className="space-y-1">
            {achievements.map((achievement, idx) => (
              <li key={idx} className="text-gray-700 ml-4">• {achievement}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
