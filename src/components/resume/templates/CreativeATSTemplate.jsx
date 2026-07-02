import React from 'react';

const CustomBlock = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const Title = () => <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3"><span className="w-8 h-0.5 bg-blue-500 shrink-0"></span>{label}</h2>;
  if (mode === 'bullets') {
    if (!items?.filter(Boolean).length) return null;
    return <div className="mb-6"><Title/><ul className="ml-11 space-y-1.5">{items.filter(Boolean).map((it,i)=><li key={i} className="text-gray-700 text-sm flex items-start"><span className="text-blue-400 mr-2 shrink-0">▸</span><span>{it}</span></li>)}</ul></div>;
  }
  if (!text?.trim()) return null;
  return <div className="mb-6"><Title/><p className="ml-11 text-gray-700 text-sm leading-relaxed">{text}</p></div>;
};

export const CreativeATSTemplate = ({ data }) => {
  const { sectionsConfig, personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages, customSections } = data;

  const ST = ({ children }) => <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3"><span className="w-8 h-0.5 bg-blue-500 shrink-0"></span>{children}</h2>;

  const renderSection = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'basics': return null;
      case 'summary': return summary ? (<div key="summary" className="mb-6"><ST>Professional Summary</ST><p className="text-gray-700 leading-relaxed ml-11">{summary}</p></div>) : null;
      case 'experience': return experience?.length ? (
        <div key="experience" className="mb-6"><ST>Work Experience</ST>
          <div className="ml-11 space-y-4">{experience.map((e,i)=>(
            <div key={i}>
              <div className="flex justify-between items-start flex-wrap gap-1 mb-0.5"><h3 className="font-bold text-gray-900">{e.position}</h3><span className="text-sm text-gray-500 whitespace-nowrap">{e.duration}</span></div>
              <div className="text-sm text-gray-600 mb-1">{e.company}{e.location?` · ${e.location}`:''}{e.employmentType?` · ${e.employmentType}`:''}</div>
              {e.summary&&<p className="text-sm text-gray-600 mb-1 leading-relaxed">{e.summary}</p>}
              {e.responsibilities?.length>0&&<ul className="space-y-1">{e.responsibilities.map((r,j)=><li key={j} className="text-gray-700 text-sm flex items-start"><span className="text-blue-400 mr-2 shrink-0">▸</span><span>{r}</span></li>)}</ul>}
            </div>
          ))}</div>
        </div>) : null;
      case 'projects': return projects?.length ? (
        <div key="projects" className="mb-6"><ST>Key Projects</ST>
          <div className="ml-11 space-y-3">{projects.map((p,i)=>(
            <div key={i}>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5"><h3 className="font-bold text-gray-900">{p.name}</h3>{p.role&&<span className="text-sm text-gray-500">({p.role})</span>}</div>
              {p.technologies&&<div className="text-sm text-gray-500 mb-0.5">Tech: {p.technologies}</div>}
              {(p.link||p.github)&&<div className="text-xs text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join('  ·  ')}</div>}
              {p.description&&<p className="text-gray-700 text-sm leading-relaxed">{p.description}</p>}
              {p.highlights?.length>0&&<ul className="mt-1 space-y-0.5">{p.highlights.map((h,j)=><li key={j} className="text-gray-700 text-sm flex items-start"><span className="text-blue-400 mr-2 shrink-0">▸</span><span>{h}</span></li>)}</ul>}
            </div>
          ))}</div>
        </div>) : null;
      case 'education': return education?.length ? (
        <div key="education" className="mb-6"><ST>Education</ST>
          <div className="ml-11 space-y-3">{education.map((e,i)=>(
            <div key={i}>
              <div className="flex justify-between items-start flex-wrap gap-1"><div><h3 className="font-bold text-gray-900">{e.degree}{e.field?` in ${e.field}`:''}</h3><div className="text-gray-600 text-sm">{e.institution}</div>{e.gpa&&<div className="text-xs text-gray-500">Grade: {e.gpa}</div>}{e.details&&<div className="text-xs text-gray-400 mt-0.5">{e.details}</div>}</div><span className="text-sm text-gray-500 whitespace-nowrap">{e.year}</span></div>
            </div>
          ))}</div>
        </div>) : null;
      case 'skills': return skills?.length ? (<div key="skills" className="mb-6"><ST>Skills &amp; Expertise</ST><div className="ml-11 text-gray-700 text-sm">{Array.isArray(skills)?skills.join(' · '):skills}</div></div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements" className="mb-6"><ST>Achievements</ST><ul className="ml-11 space-y-1.5">{achievements.map((a,i)=><li key={i} className="text-gray-700 text-sm flex items-start"><span className="text-blue-400 mr-2 shrink-0">▸</span><span>{a}</span></li>)}</ul></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages" className="mb-6"><ST>Languages</ST><div className="ml-11 text-gray-700 text-sm">{languages.join(' · ')}</div></div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications" className="mb-6"><ST>Certifications</ST><div className="ml-11 space-y-1.5">{certifications.map((c,i)=><div key={i} className="text-sm text-gray-700"><span className="font-medium">{c.name}</span>{c.issuer&&<span className="text-gray-500"> · {c.issuer}</span>}{c.year&&<span className="text-gray-400"> ({c.year})</span>}</div>)}</div></div>) : null;
      default: return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    }
  };

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  return (
    <div className="resume-template creative-ats max-w-4xl mx-auto bg-white shadow-lg font-sans flex">
      <div className="w-2 bg-gradient-to-b from-blue-500 to-blue-700 shrink-0"></div>
      <div className="flex-1 p-8">
        {personalInfo&&(
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{personalInfo.fullName}</h1>
            {personalInfo.title&&<div className="text-base text-blue-600 font-medium mb-2">{personalInfo.title}</div>}
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-gray-500">
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
    </div>
  );
};
