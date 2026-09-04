const CustomBlock = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const SH = ({children}) => <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-800 mb-1.5 mt-3 break-after-avoid"><span className="h-3 w-1 bg-amber-600 shrink-0 inline-block"></span><span className="break-words">{children}</span></h2>;
  if (mode === 'bullets') {
    if (!items?.filter(Boolean).length) return null;
    return <div><SH>{label}</SH><ul className="space-y-0.5">{items.filter(Boolean).map((it,i)=><li key={i} className="text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid">{it}</li>)}</ul></div>;
  }
  if (!text?.trim()) return null;
  return <div><SH>{label}</SH><p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{text}</p></div>;
};

export const LeadershipTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const SH = ({children}) => <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-800 mb-1.5 mt-3 break-after-avoid"><span className="h-3 w-1 bg-amber-600 shrink-0 inline-block"></span><span className="break-words">{children}</span></h2>;

  const renderSection = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'basics': return null;
      case 'summary': return summary ? (<div key="summary" className="mb-2"><h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-800 mb-1.5 break-after-avoid"><span className="h-3 w-1 bg-amber-600 shrink-0 inline-block"></span>Executive Summary</h2><p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{summary}</p></div>) : null;
      case 'experience': return experience?.length ? (<div key="experience" className="mb-2"><SH>Leadership Experience</SH>{experience.map((e,i)=>(
        <div key={i} className="mb-3 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <span className="text-[11.5px] font-bold text-gray-900 break-words min-w-0">{e.position}</span>
            <span className="text-[10px] text-amber-700 font-medium shrink-0 whitespace-nowrap">{e.duration}</span>
          </div>
          <div className="text-[10.5px] text-gray-500 mb-0.5 break-words">{e.company}{e.location?` · ${e.location}`:''}{e.employmentType?` · ${e.employmentType}`:''}</div>
          {e.summary&&<p className="text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words">{e.summary}</p>}
          {e.responsibilities?.length>0&&<ul className="space-y-0.5 pl-3">{e.responsibilities.map((r,j)=><li key={j} className="text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid" style={{listStyle:'disc'}}>{r}</li>)}</ul>}
        </div>))}</div>) : null;
      case 'skills': return skills?.length ? (<div key="skills" className="mb-2"><SH>Core Skills</SH><div className="flex flex-wrap gap-1.5">{(Array.isArray(skills)?skills:[skills]).map((s,i)=><span key={i} className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 rounded-sm px-2 py-0.5 break-words">{s}</span>)}</div></div>) : null;
      case 'projects': return projects?.length ? (<div key="projects" className="mb-2"><SH>Notable Projects</SH>{projects.map((p,i)=>(
        <div key={i} className="mb-2.5 break-inside-avoid">
          <div className="flex items-baseline gap-x-2 flex-wrap"><span className="text-[11.5px] font-bold text-gray-900 break-words min-w-0">{p.name}</span>{p.role&&<span className="text-[10px] text-gray-400 break-words">({p.role})</span>}</div>
          {p.technologies&&<div className="text-[10.5px] text-gray-500 mb-0.5 break-words">Tech: {p.technologies}</div>}
          {(p.link||p.github)&&<div className="text-[9.5px] text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
          {p.description&&<p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{p.description}</p>}
        </div>))}</div>) : null;
      case 'education': return education?.length ? (<div key="education" className="mb-2"><SH>Education</SH>{education.map((e,i)=>(
        <div key={i} className="mb-2 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-1 flex-wrap"><span className="text-[11.5px] font-bold text-gray-900 break-words">{e.degree}</span><span className="text-[10px] text-amber-700 font-medium shrink-0 whitespace-nowrap">{e.year}</span></div>
          <div className="text-[10.5px] text-gray-500 break-words">{e.institution}</div>
          {(e.gpa||e.details)&&<div className="text-[10px] text-gray-500 break-words">{[e.gpa,e.details].filter(Boolean).join(' — ')}</div>}
        </div>))}</div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications" className="mb-2"><SH>Certifications</SH><div className="space-y-0.5">{certifications.map((c,i)=><div key={i} className="text-[10.5px] text-gray-600 break-words break-inside-avoid">{c.name}{c.issuer?` — ${c.issuer}`:''}{c.year?` (${c.year})`:''}</div>)}</div></div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements" className="mb-2"><SH>Achievements</SH><ul className="space-y-0.5">{achievements.map((a,i)=><li key={i} className="text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid">{a}</li>)}</ul></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages" className="mb-2"><SH>Languages</SH><p className="text-[10.5px] text-gray-600 break-words">{languages.join('  ·  ')}</p></div>) : null;
      default: return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    }
  };

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  return (
    <div className="resume-template leadership max-w-4xl mx-auto bg-white font-sans overflow-hidden">
      <div className="flex">
        <div className="w-[26%] shrink-0 bg-gray-900 px-4 py-6 text-white">
          {personalInfo&&(
            <div className="break-after-avoid">
              <h1 className="text-[18px] font-bold leading-tight break-words">{personalInfo.fullName}</h1>
              {personalInfo.title&&<div className="text-[10.5px] text-amber-400 font-medium mt-0.5 mb-3 uppercase tracking-wide break-words">{personalInfo.title}</div>}
              <div className="space-y-1.5 text-[9px] text-gray-300">
                {personalInfo.email&&<div className="break-all">{personalInfo.email}</div>}
                {personalInfo.phone&&<div className="break-words">{personalInfo.phone}</div>}
                {personalInfo.location&&<div className="break-words">{personalInfo.location}</div>}
                {personalInfo.linkedin&&<div className="break-all">{personalInfo.linkedin}</div>}
                {personalInfo.github&&<div className="break-all">{personalInfo.github}</div>}
                {personalInfo.portfolio&&<div className="break-all">{personalInfo.portfolio}</div>}
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 px-7 py-6">
          {activeSections.filter((s)=>s.key!=='basics').map((sec)=>renderSection(sec))}
        </div>
      </div>
    </div>
  );
};
