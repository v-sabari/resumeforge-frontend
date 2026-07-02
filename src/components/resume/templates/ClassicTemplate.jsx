import React from 'react';

/*
 * ClassicTemplate — extracted from ResumePreview.jsx.
 *
 * Previously this template lived inline inside ResumePreview.jsx and, unlike
 * the other 5 templates, consumed the raw `resume` object directly (e.g.
 * `resume.experience[].role`) instead of the shared transformed shape (e.g.
 * `data.experience[].position`). That inconsistency meant Classic could
 * silently drift out of sync with the other templates whenever a field
 * mapping changed. It now takes the same `data` prop (the output of
 * buildTransformed) as every other template, so all 6 templates share one
 * data contract.
 */

const Bul = ({ c }) => (
  <li className="flex gap-1.5">
    <span className="text-gray-400 shrink-0 select-none">•</span>
    <span className="text-gray-700 break-words min-w-0">{c}</span>
  </li>
);

const SH = ({ children }) => (
  <div className="text-[9px] font-bold uppercase tracking-widest pb-0.5 mb-1.5 border-b border-gray-200 text-gray-500">
    {children}
  </div>
);

const CustomBlock = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === 'bullets') {
    if (!items || !items.filter(Boolean).length) return null;
    return (
      <div>
        <SH>{label}</SH>
        <ul className="space-y-0.5 pl-1">
          {items.filter(Boolean).map((it, i) => <Bul key={i} c={it} />)}
        </ul>
      </div>
    );
  }
  if (!text || !text.trim()) return null;
  return (
    <div>
      <SH>{label}</SH>
      <p className="text-gray-700 leading-relaxed break-words">{text}</p>
    </div>
  );
};

export const ClassicTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const activeSections = (sectionsConfig || []).filter((s) => s.visible);

  const renderSection = (sec) => {
    if (sec.type === 'custom') {
      return <CustomBlock key={sec.id} label={sec.label} content={(customSections || {})[sec.id]} />;
    }
    switch (sec.key) {
      case 'basics': return null; // rendered in header

      case 'summary':
        if (!summary) return null;
        return <div key="summary"><SH>Professional Summary</SH><p className="text-gray-700 leading-relaxed break-words">{summary}</p></div>;

      case 'skills':
        if (!(skills || []).length) return null;
        return <div key="skills"><SH>Skills</SH><p className="break-words">{(skills || []).join(', ')}</p></div>;

      case 'experience':
        if (!(experience || []).length) return null;
        return (
          <div key="experience"><SH>Work Experience</SH>
            {(experience || []).map((e, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between gap-2">
                  <span className="font-semibold break-words min-w-0">{e.position}{e.company ? ` — ${e.company}` : ''}</span>
                  <span className="text-gray-500 shrink-0 whitespace-nowrap">{e.duration}</span>
                </div>
                {(e.location || e.employmentType) && <div className="text-gray-500 text-[9px]">{[e.location, e.employmentType].filter(Boolean).join(' · ')}</div>}
                {e.summary && <p className="text-gray-600 mt-0.5 break-words">{e.summary}</p>}
                {(e.responsibilities || []).filter(Boolean).length > 0 && <ul className="mt-1 space-y-0.5 pl-1">{(e.responsibilities || []).filter(Boolean).map((b, j) => <Bul key={j} c={b} />)}</ul>}
              </div>
            ))}
          </div>
        );

      case 'projects':
        if (!(projects || []).length) return null;
        return (
          <div key="projects"><SH>Projects</SH>
            {(projects || []).map((p, i) => (
              <div key={i} className="mb-1.5">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-semibold">{p.name}</span>
                  {p.role && <span className="text-gray-500 text-[9px]">({p.role})</span>}
                </div>
                {p.technologies && <div className="text-gray-500 text-[9px]">{p.technologies}</div>}
                {(p.link || p.github) && <div className="text-gray-400 text-[9px] break-all">{[p.link, p.github].filter(Boolean).join(' · ')}</div>}
                {p.description && <p className="text-gray-700 mt-0.5 break-words">{p.description}</p>}
                {(p.highlights || []).filter(Boolean).length > 0 && <ul className="mt-0.5 space-y-0.5 pl-1">{(p.highlights || []).filter(Boolean).map((h, j) => <Bul key={j} c={h} />)}</ul>}
              </div>
            ))}
          </div>
        );

      case 'education':
        if (!(education || []).length) return null;
        return (
          <div key="education"><SH>Education</SH>
            {(education || []).map((e, i) => (
              <div key={i} className="mb-1.5">
                <div className="flex justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-semibold">{e.degree}</span>
                    {e.field && <span className="text-gray-600"> in {e.field}</span>}
                    {e.institution && <div className="text-gray-500">{e.institution}</div>}
                    {e.gpa && <div className="text-gray-400 text-[9px]">Grade: {e.gpa}</div>}
                    {e.details && <div className="text-gray-400 text-[9px] mt-0.5">{e.details}</div>}
                  </div>
                  <span className="text-gray-500 shrink-0 whitespace-nowrap">{e.year}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'certifications':
        if (!(certifications || []).length) return null;
        return (
          <div key="certifications"><SH>Certifications</SH>
            {(certifications || []).map((c, i) => (
              <div key={i} className="break-words"><span className="font-medium">{c.name}</span>{c.issuer && <span className="text-gray-500"> — {c.issuer}</span>}{c.year && <span className="text-gray-400"> ({c.year})</span>}</div>
            ))}
          </div>
        );

      case 'achievements':
        if (!(achievements || []).length) return null;
        return <div key="achievements"><SH>Achievements</SH><ul className="space-y-0.5 pl-1">{(achievements || []).map((a, i) => <Bul key={i} c={a} />)}</ul></div>;

      case 'languages':
        if (!(languages || []).length) return null;
        return <div key="languages"><SH>Languages</SH><p className="break-words">{(languages || []).join(' · ')}</p></div>;

      default:
        return <CustomBlock key={sec.id} label={sec.label} content={(customSections || {})[sec.id]} />;
    }
  };

  return (
    <div className="font-sans text-[10px] leading-tight text-gray-900 bg-white p-6 space-y-3">
      {/* Header always first */}
      <div className="text-center border-b border-gray-300 pb-3">
        <div className="text-lg font-bold tracking-wide uppercase">{personalInfo?.fullName || 'Your Name'}</div>
        {personalInfo?.title && <div className="text-[10px] text-gray-600 mt-0.5">{personalInfo.title}</div>}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1 text-gray-500">
          {personalInfo?.email && <span className="break-all">{personalInfo.email}</span>}
          {personalInfo?.phone && <span>{personalInfo.phone}</span>}
          {personalInfo?.location && <span>{personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-0.5 text-gray-500">
          {personalInfo?.linkedin && <span className="break-all">{personalInfo.linkedin}</span>}
          {personalInfo?.github && <span className="break-all">{personalInfo.github}</span>}
          {personalInfo?.portfolio && <span className="break-all">{personalInfo.portfolio}</span>}
        </div>
      </div>
      {/* Remaining sections in user-defined order */}
      {activeSections.filter((s) => s.key !== 'basics').map((sec) => renderSection(sec))}
    </div>
  );
};
