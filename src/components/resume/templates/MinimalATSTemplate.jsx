import React from 'react';

export const MinimalATSTemplate = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, certifications } = data;

  return (
    <div className="resume-template minimal-ats max-w-4xl mx-auto bg-white p-8 shadow-lg">
      {/* Header - Simple and ATS-friendly */}
      {personalInfo && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{personalInfo.fullName}</h1>
          <div className="text-sm text-gray-700 space-y-1">
            {personalInfo.email && <div>Email: {personalInfo.email}</div>}
            {personalInfo.phone && <div>Phone: {personalInfo.phone}</div>}
            {personalInfo.location && <div>Location: {personalInfo.location}</div>}
            {personalInfo.linkedin && <div>LinkedIn: {personalInfo.linkedin}</div>}
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-2 uppercase">Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience && Array.isArray(experience) && experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-2 uppercase">Professional Experience</h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="font-bold text-gray-900 text-sm">{exp.position}</div>
              <div className="text-sm text-gray-700">{exp.company}</div>
              <div className="text-xs text-gray-600 mb-1">{exp.duration}</div>
              {exp.responsibilities && (
                <ul className="space-y-1 text-sm text-gray-700">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i} className="ml-4">• {resp}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education && Array.isArray(education) && education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-2 uppercase">Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-3 text-sm">
              <div className="font-bold text-gray-900">{edu.degree}</div>
              <div className="text-gray-700">{edu.institution}</div>
              <div className="text-xs text-gray-600">{edu.year}</div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && (
        <div className="mb-5">
          <h2 className="text-base font-bold text-gray-900 mb-2 uppercase">Skills</h2>
          <div className="text-sm text-gray-700">
            {typeof skills === 'string' ? skills : Array.isArray(skills) ? skills.join(', ') : ''}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && Array.isArray(certifications) && certifications.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-2 uppercase">Certifications</h2>
          {certifications.map((cert, idx) => (
            <div key={idx} className="mb-2 text-sm text-gray-700">
              • {cert.name} {cert.issuer && `- ${cert.issuer}`} {cert.year && `(${cert.year})`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
