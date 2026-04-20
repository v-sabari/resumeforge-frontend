import React from 'react';

export const ModernProTemplate = ({ data }) => {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <div className="resume-template modern-pro max-w-4xl mx-auto bg-white p-8 shadow-lg">
      {/* Header */}
      {personalInfo && (
        <div className="border-b-2 border-primary-600 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{personalInfo.fullName}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
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
                <span className="text-sm text-gray-600">{exp.duration}</span>
              </div>
              <div className="text-gray-700 mb-2">{exp.company} {exp.location && `• ${exp.location}`}</div>
              {exp.responsibilities && (
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
                </div>
                <span className="text-sm text-gray-600">{edu.year}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
            Skills
          </h2>
          <div className="text-gray-700">
            {typeof skills === 'string' ? skills : Array.isArray(skills) ? skills.join(' • ') : ''}
          </div>
        </div>
      )}
    </div>
  );
};
