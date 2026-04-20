import React from 'react';

export const ExecutiveTemplate = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, achievements } = data;

  return (
    <div className="resume-template executive max-w-4xl mx-auto bg-white shadow-lg">
      {/* Header with accent */}
      {personalInfo && (
        <div className="bg-gray-900 text-white p-8">
          <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName}</h1>
          {personalInfo.title && (
            <div className="text-xl text-gray-300 mb-3">{personalInfo.title}</div>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>•</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>•</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </div>
      )}

      <div className="p-8">
        {/* Executive Summary */}
        {summary && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 pb-2 border-b-2 border-gray-900">
              Executive Profile
            </h2>
            <p className="text-gray-700 leading-relaxed text-base">{summary}</p>
          </div>
        )}

        {/* Key Achievements */}
        {achievements && Array.isArray(achievements) && achievements.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 pb-2 border-b-2 border-gray-900">
              Key Achievements
            </h2>
            <ul className="space-y-2">
              {achievements.map((achievement, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-gray-900 font-bold mr-2">▸</span>
                  <span className="text-gray-700 leading-relaxed">{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Professional Experience */}
        {experience && Array.isArray(experience) && experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 pb-2 border-b-2 border-gray-900">
              Leadership Experience
            </h2>
            {experience.map((exp, idx) => (
              <div key={idx} className="mb-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <div className="text-base text-gray-700 font-medium">{exp.company}</div>
                  </div>
                  <div className="text-sm text-gray-600 text-right">
                    <div>{exp.duration}</div>
                    {exp.location && <div className="text-xs">{exp.location}</div>}
                  </div>
                </div>
                {exp.responsibilities && (
                  <ul className="space-y-1.5 ml-4">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="text-gray-700 leading-relaxed">• {resp}</li>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-3 pb-2 border-b-2 border-gray-900">
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

        {/* Core Competencies */}
        {skills && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 pb-2 border-b-2 border-gray-900">
              Core Competencies
            </h2>
            <div className="text-gray-700">
              {typeof skills === 'string' ? skills : Array.isArray(skills) ? skills.join(' • ') : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
