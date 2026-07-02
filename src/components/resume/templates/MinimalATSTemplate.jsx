import React from 'react';

const CustomBlock = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500 border-b border-gray-200 pb-0.5 mb-2 mt-5">{label}</div>;
  if (mode === 'bullets') {
    if (!items?.filter(Boolean).length) return null;
    return <>{H}<ul className="space-y-1">{items.filter(Boolean).map((it,i)=><li key={i} className="flex gap-2 text-xs text-gray-600"><span className="text-gray-300 shrink-0 mt-0.5">–</span><span>{it}</span></li>)}</ul></>;
  }
  if (!text?.trim()) return null;
  return <>{H}<p className="text-xs text-gray-600 leading-relaxed">{text}</p></>;
};

export const MinimalATSTemplate = ({ data }) => {
  const { sectionsConfig, personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages, customSections } = data;

  const SH = ({ children }) => <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500 border-b border-gray-200 pb-0.5 mb-2 mt-5 first:mt-0">{children}</div>;

  const renderSection = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'basics': return null;
      case 'summary': return summary ? (<React.Fragment key="summary"><SH>Profile</SH><p className="text-gray-600 leading-relaxed text-xs">{summary}</p></React.Fragment>) : null;
      case 'experience': return experience?.length ? (
        <React.Fragment key="experience"><SH>Experience</SH>
          <div className="space-y-4">{experience.map((e,i)=>(
            <div key={i}>
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <span className="font-semibold text-gray-900 text-sm">{e.position}</span>
                <span className="text-xs text-gray-400 whitespace-nowrap">{e.duration}</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">{e.company}{e.location?`, ${e.location}`:''}{e.employmentType?` · ${e.employmentType}`:''}</div>
              {e.summary&&<p className="text-xs text-gray-600 mb-1 leading-relaxed">{e.summary}</p>}
              {e.responsibilities?.length>0&&<ul className="space-y-0.5">{e.responsibilities.map((r,j)=><li key={j} className="flex gap-2 text-gray-600 text-xs"><span className="text-gray-300 shrink-0 mt-0.5">–</span><span>{r}</span></li>)}</ul>}
            </div>
          ))}</div>
        </React.Fragment>) : null;
      case 'skills': return skills?.length ? (<React.Fragment key="skills"><SH>Skills</SH><p className="text-gray-600 text-xs leading-relaxed">{Array.isArray(skills)?skills.join('  ·  '):skills}</p></React.Fragment>) : null;
      case 'projects': return projects?.length ? (
        <React.Fragment key="projects"><SH>Projects</SH>
          <div className="space-y-3">{projects.map((p,i)=>(
            <div key={i}>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5">
                <span className="font-semibold text-gray-900 text-sm">{p.name}</span>
                {p.role&&<span className="text-xs text-gray-400">({p.role})</span>}
              </div>
              {p.technologies&&<div className="text-xs text-gray-500 mb-0.5">Tech: {p.technologies}</div>}
              {(p.link||p.github)&&<div className="text-xs text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join('  ·  ')}</div>}
              {p.description&&<p className="text-xs text-gray-600 leading-relaxed">{p.description}</p>}
              {p.highlights?.length>0&&<ul className="mt-0.5 space-y-0.5">{p.highlights.map((h,j)=><li key={j} className="flex gap-2 text-xs text-gray-600"><span className="text-gray-300 shrink-0 mt-0.5">–</span><span>{h}</span></li>)}</ul>}
            </div>
          ))}</div>
        </React.Fragment>) : null;
      case 'education': return education?.length ? (
        <React.Fragment key="education"><SH>Education</SH>
          <div className="space-y-2">{education.map((e,i)=>(
            <div key={i}>
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <div><span className="font-semibold text-gray-900 text-sm">{e.degree}</span>{e.field&&<span className="text-gray-500 text-sm"> in {e.field}</span>}</div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{e.year}</span>
              </div>
              {e.institution&&<div className="text-xs text-gray-500">{e.institution}</div>}
              {e.gpa&&<div className="text-xs text-gray-400">Grade: {e.gpa}</div>}
              {e.details&&<div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{e.details}</div>}
            </div>
          ))}</div>
        </React.Fragment>) : null;
      case 'achievements': return achievements?.length ? (<React.Fragment key="achievements"><SH>Achievements</SH><ul className="space-y-1">{achievements.map((a,i)=><li key={i} className="flex gap-2 text-xs text-gray-600"><span className="text-gray-300 shrink-0 mt-0.5">–</span><span>{a}</span></li>)}</ul></React.Fragment>) : null;
      case 'languages': return languages?.length ? (<React.Fragment key="languages"><SH>Languages</SH><p className="text-xs text-gray-600">{languages.join('  ·  ')}</p></React.Fragment>) : null;
      case 'certifications': return certifications?.length ? (<React.Fragment key="certifications"><SH>Certifications</SH><div className="space-y-1">{certifications.map((c,i)=><div key={i} className="text-xs text-gray-600"><span className="font-medium">{c.name}</span>{c.issuer&&<span className="text-gray-500"> — {c.issuer}</span>}{c.year&&<span className="text-gray-400"> ({c.year})</span>}</div>)}</div></React.Fragment>) : null;
      default: return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    }
  };

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  return (
    <div className="resume-template minimal-ats max-w-4xl mx-auto bg-white px-10 py-8 shadow-lg font-sans text-sm text-gray-800">
      {personalInfo&&(
        <div className="mb-5">
          <h1 className="text-2xl font-light tracking-tight text-gray-900 mb-0.5">{personalInfo.fullName}</h1>
          {personalInfo.title&&<div className="text-sm text-gray-600 mb-1.5">{personalInfo.title}</div>}
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
            {personalInfo.email&&<span>{personalInfo.email}</span>}
            {personalInfo.phone&&<span>{personalInfo.phone}</span>}
            {personalInfo.location&&<span>{personalInfo.location}</span>}
            {personalInfo.linkedin&&<span className="break-all">{personalInfo.linkedin}</span>}
            {personalInfo.github&&<span className="break-all">{personalInfo.github}</span>}
            {personalInfo.portfolio&&<span className="break-all">{personalInfo.portfolio}</span>}
          </div>
        </div>
      )}
      {activeSections.filter((s)=>s.key!=='basics').map((sec)=>renderSection(sec))}
    </div>
  );
};
