
const CustomBlock = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900 border-b-2 border-blue-600 pb-0.5 mb-2 mt-4 break-after-avoid">{label}</h2>;
  if (mode === 'bullets') {
    if (!items?.filter(Boolean).length) return null;
    return <div>{H}<ul className="space-y-0.5">{items.filter(Boolean).map((it,i)=><li key={i} className="flex gap-2 text-[10.5px] text-gray-700 break-inside-avoid"><span className="text-blue-600 shrink-0 mt-[2px]">▪</span><span className="leading-relaxed break-words min-w-0">{it}</span></li>)}</ul></div>;
  }
  if (!text?.trim()) return null;
  return <div>{H}<p className="text-[10.5px] text-gray-700 leading-relaxed break-words">{text}</p></div>;
};

export const CorporateTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const SH = ({ children }) => <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900 border-b-2 border-blue-600 pb-0.5 mb-2 mt-4 break-after-avoid">{children}</h2>;

  const renderSection = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'basics': return null;
      case 'summary': return summary ? <div key="summary" className="mb-2"><SH>Professional Summary</SH><p className="text-[10.5px] text-gray-700 leading-relaxed break-words">{summary}</p></div> : null;
      case 'experience': return experience?.length ? (
        <div key="experience" className="mb-2"><SH>Professional Experience</SH>
          {experience.map((e,i)=>(
            <div key={i} className="mb-3 break-inside-avoid">
              <div className="flex justify-between items-start flex-wrap gap-1">
                <span className="font-bold text-gray-900 text-[11px] break-words min-w-0">{e.position}</span>
                <span className="text-[10px] text-gray-500 whitespace-nowrap shrink-0">{e.duration}</span>
              </div>
              <div className="text-[10.5px] text-blue-700 font-medium mb-0.5 break-words">{e.company}{e.location?` · ${e.location}`:''}{e.employmentType?` · ${e.employmentType}`:''}</div>
              {e.summary&&<p className="text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words">{e.summary}</p>}
              {e.responsibilities?.length>0&&<ul className="space-y-0.5">{e.responsibilities.map((r,j)=><li key={j} className="flex gap-2 text-[10.5px] text-gray-700 break-inside-avoid"><span className="text-blue-600 shrink-0 mt-[2px]">▪</span><span className="leading-relaxed break-words min-w-0">{r}</span></li>)}</ul>}
            </div>
          ))}
        </div>) : null;
      case 'projects': return projects?.length ? (
        <div key="projects" className="mb-2"><SH>Projects</SH>
          {projects.map((p,i)=>(
            <div key={i} className="mb-2 break-inside-avoid">
              <div className="flex flex-wrap items-baseline gap-x-2"><span className="font-bold text-gray-900 text-[11px] break-words min-w-0">{p.name}</span>{p.role&&<span className="text-[10px] text-gray-500 break-words">({p.role})</span>}</div>
              {p.technologies&&<div className="text-[10.5px] text-gray-600 mb-0.5 break-words">Tech: {p.technologies}</div>}
              {(p.link||p.github)&&<div className="text-[9.5px] text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
              {p.description&&<p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{p.description}</p>}
            </div>
          ))}
        </div>) : null;
      case 'education': return education?.length ? (
        <div key="education" className="mb-2"><SH>Education</SH>
          {education.map((e,i)=>(
            <div key={i} className="mb-2 break-inside-avoid">
              <div className="flex justify-between items-start flex-wrap gap-1"><span className="font-bold text-gray-900 text-[11px] break-words">{e.degree}</span><span className="text-[10px] text-gray-500 shrink-0 whitespace-nowrap">{e.year}</span></div>
              <div className="text-[10.5px] text-gray-700 break-words">{e.institution}</div>
              {(e.gpa||e.details)&&<div className="text-[10px] text-gray-500 break-words">{[e.gpa,e.details].filter(Boolean).join(' — ')}</div>}
            </div>
          ))}
        </div>) : null;
      case 'skills': return skills?.length ? (
        <div key="skills" className="mb-2"><SH>Core Skills</SH>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 px-1">
            {(Array.isArray(skills)?skills:[skills]).map((s,i)=><span key={i} className="text-[10.5px] text-gray-700 flex items-center gap-1.5 break-words"><span className="text-blue-600 shrink-0">▪</span><span className="break-words min-w-0">{s}</span></span>)}
          </div>
        </div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications" className="mb-2"><SH>Certifications</SH><div className="space-y-0.5">{certifications.map((c,i)=><div key={i} className="text-[10.5px] text-gray-700 break-words break-inside-avoid"><span className="font-medium">{c.name}</span>{c.issuer&&<span className="text-gray-500"> — {c.issuer}</span>}{c.year&&<span className="text-gray-400"> ({c.year})</span>}</div>)}</div></div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements" className="mb-2"><SH>Achievements</SH><ul className="space-y-0.5">{achievements.map((a,i)=><li key={i} className="flex gap-2 text-[10.5px] text-gray-700 break-inside-avoid"><span className="text-blue-600 shrink-0 mt-[2px]">▪</span><span className="leading-relaxed break-words min-w-0">{a}</span></li>)}</ul></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages" className="mb-2"><SH>Languages</SH><p className="text-[10.5px] text-gray-700 break-words">{languages.join('  ·  ')}</p></div>) : null;
      default: return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    }
  };

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  return (
    <div className="resume-template corporate max-w-4xl mx-auto bg-white font-sans overflow-hidden">
      {personalInfo&&(
        <div className="bg-gray-900 text-white px-8 py-5 mb-5">
          <h1 className="text-[22px] font-bold tracking-wide break-words">{personalInfo.fullName}</h1>
          {personalInfo.title&&<div className="text-[11px] text-blue-300 font-medium mt-0.5 mb-2 tracking-wide break-words">{personalInfo.title}</div>}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-300">
            {personalInfo.email&&<span className="break-all">{personalInfo.email}</span>}
            {personalInfo.phone&&<span className="break-words">{personalInfo.phone}</span>}
            {personalInfo.location&&<span className="break-words">{personalInfo.location}</span>}
            {personalInfo.linkedin&&<span className="break-all">{personalInfo.linkedin}</span>}
            {personalInfo.github&&<span className="break-all">{personalInfo.github}</span>}
            {personalInfo.portfolio&&<span className="break-all">{personalInfo.portfolio}</span>}
          </div>
        </div>
      )}
      <div className="px-8 pb-2">
        {activeSections.filter((s)=>s.key!=='basics').map((sec)=>renderSection(sec))}
      </div>
    </div>
  );
};
