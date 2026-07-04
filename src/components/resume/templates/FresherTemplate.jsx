import React from 'react';

const CustomBlock = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = <h2 className="text-sm font-bold text-blue-700 uppercase tracking-widest border-b border-blue-200 pb-1 mb-3 break-after-avoid">{label}</h2>;
  if (mode === 'bullets') {
    if (!items?.filter(Boolean).length) return null;
    return <div className="mb-5">{H}<ul className="space-y-1">{items.filter(Boolean).map((it,i)=><li key={i} className="flex items-start text-sm text-gray-700 break-inside-avoid"><span className="text-blue-400 mr-2 shrink-0">▸</span><span className="break-words min-w-0">{it}</span></li>)}</ul></div>;
  }
  if (!text?.trim()) return null;
  return <div className="mb-5">{H}<p className="text-gray-700 text-sm leading-relaxed break-words">{text}</p></div>;
};

export const FresherTemplate = ({ data }) => {
  const { sectionsConfig, personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages, customSections } = data;

  const SH = ({ children }) => <h2 className="text-sm font-bold text-blue-700 uppercase tracking-widest border-b border-blue-200 pb-1 mb-3 break-after-avoid">{children}</h2>;

  const renderSection = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'basics': return null;
      case 'summary': return summary ? (<div key="summary" className="mb-5"><SH>Career Objective</SH><p className="text-gray-700 text-sm leading-relaxed break-words">{summary}</p></div>) : null;
      case 'education': return education?.length ? (
        <div key="education" className="mb-5"><SH>Education</SH>
          {education.map((e,i)=>(
            <div key={i} className="mb-3 break-inside-avoid"><div className="flex justify-between items-start flex-wrap gap-1"><div className="min-w-0"><h3 className="font-bold text-gray-900 text-sm break-words">{e.degree}{e.field?` in ${e.field}`:''}</h3><div className="text-gray-600 text-sm break-words">{e.institution}</div>{e.gpa&&<div className="text-xs text-gray-500 break-words">Grade / CGPA: {e.gpa}</div>}{e.details&&<div className="text-xs text-gray-400 mt-0.5 break-words">{e.details}</div>}</div><span className="text-xs text-gray-500 whitespace-nowrap shrink-0">{e.year}</span></div></div>
          ))}
        </div>) : null;
      case 'projects': return projects?.length ? (
        <div key="projects" className="mb-5"><SH>Projects</SH>
          {projects.map((p,i)=>(
            <div key={i} className="mb-3 break-inside-avoid">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5"><h3 className="font-bold text-gray-900 text-sm break-words min-w-0">{p.name}</h3>{p.role&&<span className="text-xs text-gray-500 break-words">({p.role})</span>}</div>
              {p.technologies&&<div className="text-xs text-blue-600 mb-0.5 break-words">Tech: {p.technologies}</div>}
              {(p.link||p.github)&&<div className="text-xs text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join('  ·  ')}</div>}
              {p.description&&<p className="text-gray-700 text-sm leading-relaxed break-words">{p.description}</p>}
              {p.highlights?.length>0&&<ul className="mt-1 space-y-0.5">{p.highlights.map((h,j)=><li key={j} className="flex items-start text-sm text-gray-700 break-inside-avoid"><span className="text-blue-400 mr-2 shrink-0">▸</span><span className="break-words min-w-0">{h}</span></li>)}</ul>}
            </div>
          ))}
        </div>) : null;
      case 'experience': return experience?.length ? (
        <div key="experience" className="mb-5"><SH>Experience</SH>
          {experience.map((e,i)=>(
            <div key={i} className="mb-4 break-inside-avoid">
              <div className="flex justify-between items-start flex-wrap gap-1 mb-0.5"><h3 className="font-bold text-gray-900 text-sm break-words min-w-0">{e.position}</h3><span className="text-xs text-gray-500 whitespace-nowrap shrink-0">{e.duration}</span></div>
              <div className="text-xs text-gray-600 mb-1 break-words">{e.company}{e.location?` · ${e.location}`:''}{e.employmentType?` · ${e.employmentType}`:''}</div>
              {e.summary&&<p className="text-sm text-gray-600 mb-1 leading-relaxed break-words">{e.summary}</p>}
              {e.responsibilities?.length>0&&<ul className="space-y-0.5">{e.responsibilities.map((r,j)=><li key={j} className="flex items-start text-sm text-gray-700 break-inside-avoid"><span className="text-blue-400 mr-2 shrink-0">▸</span><span className="break-words min-w-0">{r}</span></li>)}</ul>}
            </div>
          ))}
        </div>) : null;
      case 'skills': return skills?.length ? (
        <div key="skills" className="mb-5"><SH>Technical Skills</SH><div className="flex flex-wrap gap-2">{(Array.isArray(skills)?skills:[skills]).map((s,i)=><span key={i} className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded text-xs font-medium break-words max-w-full">{s}</span>)}</div></div>
      ) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements" className="mb-5"><SH>Achievements &amp; Awards</SH><ul className="space-y-1">{achievements.map((a,i)=><li key={i} className="flex items-start text-sm text-gray-700 break-inside-avoid"><span className="text-blue-400 mr-2 shrink-0">▸</span><span className="break-words min-w-0">{a}</span></li>)}</ul></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages" className="mb-5"><SH>Languages</SH><div className="text-gray-700 text-sm break-words">{languages.join(' · ')}</div></div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications" className="mb-5"><SH>Certifications</SH>{certifications.map((c,i)=><div key={i} className="mb-1.5 text-sm text-gray-700 break-words break-inside-avoid"><span className="font-medium">{c.name}</span>{c.issuer&&<span className="text-gray-500"> — {c.issuer}</span>}{c.year&&<span className="text-gray-400"> ({c.year})</span>}</div>)}</div>) : null;
      default: return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    }
  };

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  // Vertical padding lives outside this component — see utils/pageLayout.js;
  // it is re-applied on every page by the preview and the PDF export.
  return (
    <div className="resume-template fresher max-w-4xl mx-auto bg-white px-8 shadow-lg font-sans overflow-hidden">
      {personalInfo&&(
        <div className="text-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-1 break-words">{personalInfo.fullName}</h1>
          {personalInfo.title&&<div className="text-sm text-blue-600 font-medium mb-2 break-words">{personalInfo.title}</div>}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-xs text-gray-600">
            {personalInfo.email&&<span className="break-all">{personalInfo.email}</span>}
            {personalInfo.phone&&<><span>|</span><span className="break-words">{personalInfo.phone}</span></>}
            {personalInfo.location&&<><span>|</span><span className="break-words">{personalInfo.location}</span></>}
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-0.5 text-xs text-blue-600">
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