const CustomBlock = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const SH = ({children}) => <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-800 mt-3 mb-1.5 break-after-avoid">▸ {children}</h2>;
  if (mode === 'bullets') {
    if (!items?.filter(Boolean).length) return null;
    return <div><SH>{label}</SH><ul className="space-y-0.5">{items.filter(Boolean).map((it,i)=><li key={i} className="text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid">$ {it}</li>)}</ul></div>;
  }
  if (!text?.trim()) return null;
  return <div><SH>{label}</SH><p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{text}</p></div>;
};

export const TechTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const SH = ({children}) => <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-800 mt-3 mb-1.5 break-after-avoid">▸ {children}</h2>;

  const renderSection = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'basics': return null;
      case 'summary': return summary ? <div key="summary" className="mb-2"><SH>profile</SH><p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{summary}</p></div> : null;
      case 'skills': return skills?.length ? (<div key="skills" className="mb-2"><SH>skills</SH><div className="grid gap-x-4 gap-y-0.5 px-1 grid-cols-3">{(Array.isArray(skills)?skills:[skills]).map((s,i)=><span key={i} className="text-[10.5px] text-gray-700 break-words break-inside-avoid">{s}</span>)}</div></div>) : null;
      case 'experience': return experience?.length ? (<div key="experience" className="mb-2"><SH>experience //</SH>{experience.map((e,i)=>(
        <div key={i} className="mb-3 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <span className="text-[11.5px] font-bold text-gray-900 break-words min-w-0">{e.position} <span className="text-emerald-700 font-medium">@ {e.company}</span></span>
            <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">{e.duration}</span>
          </div>
          <div className="text-[10px] text-gray-500 mb-0.5 break-words">{e.location?`${e.location} `:''}{e.employmentType?`· ${e.employmentType}`:''}</div>
          {e.summary&&<p className="text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words">{e.summary}</p>}
          {e.responsibilities?.length>0&&<ul className="space-y-0.5">{e.responsibilities.map((r,j)=><li key={j} className="text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid"><span className="text-emerald-700">$ </span>{r}</li>)}</ul>}
        </div>))}</div>) : null;
      case 'projects': return projects?.length ? (<div key="projects" className="mb-2"><SH>projects //</SH>{projects.map((p,i)=>(
        <div key={i} className="mb-2.5 break-inside-avoid">
          <div className="flex items-baseline gap-x-2 flex-wrap"><span className="text-[11.5px] font-bold text-gray-900 break-words min-w-0">{p.name}</span>{p.role&&<span className="text-[10px] text-gray-400 break-words">({p.role})</span>}</div>
          {p.technologies&&<div className="text-[10.5px] text-emerald-700 mb-0.5 break-words">{`// ${p.technologies}`}</div>}
          {(p.link||p.github)&&<div className="text-[9.5px] text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
          {p.description&&<p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{p.description}</p>}
        </div>))}</div>) : null;
      case 'education': return education?.length ? (<div key="education" className="mb-2"><SH>edu</SH>{education.map((e,i)=>(
        <div key={i} className="mb-2 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-1 flex-wrap"><span className="text-[11px] font-bold text-gray-900 break-words">{e.degree}</span><span className="text-[10px] text-gray-400 shrink-0 whitespace-nowrap">{e.year}</span></div>
          <div className="text-[10.5px] text-emerald-700 font-medium break-words">{e.institution}</div>
          {(e.gpa||e.details)&&<div className="text-[10px] text-gray-500 break-words">{[e.gpa,e.details].filter(Boolean).join(' — ')}</div>}
        </div>))}</div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications" className="mb-2"><SH>certs</SH><div className="space-y-0.5">{certifications.map((c,i)=><div key={i} className="text-[10.5px] text-gray-600 break-words break-inside-avoid">{c.name}{c.issuer?` — ${c.issuer}`:''}{c.year?` (${c.year})`:''}</div>)}</div></div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements" className="mb-2"><SH>achievements</SH><ul className="space-y-0.5">{achievements.map((a,i)=><li key={i} className="text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid"><span className="text-emerald-700">$ </span>{a}</li>)}</ul></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages" className="mb-2"><SH>langs</SH><p className="text-[10.5px] text-gray-600 break-words">{languages.join('  ·  ')}</p></div>) : null;
      default: return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    }
  };

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  return (
    <div className="resume-template tech max-w-4xl mx-auto bg-white font-mono overflow-hidden">
      <div className="bg-gray-900 text-emerald-400 px-8 py-3.5 mb-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
          <span className="ml-2 text-[9px] text-gray-500">~/resume</span>
        </div>
        {personalInfo&&(
          <div>
            <h1 className="text-[20px] font-bold text-emerald-300 break-words">{personalInfo.fullName}</h1>
            {personalInfo.title&&<div className="text-[11px] text-gray-300 mt-0.5 mb-1.5 break-words">{personalInfo.title}</div>}
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[9.5px] text-gray-400">
              {personalInfo.email&&<span className="break-all">{personalInfo.email}</span>}
              {personalInfo.phone&&<span className="break-words">{personalInfo.phone}</span>}
              {personalInfo.location&&<span className="break-words">{personalInfo.location}</span>}
              {personalInfo.linkedin&&<span className="break-all">{personalInfo.linkedin}</span>}
              {personalInfo.github&&<span className="break-all">{personalInfo.github}</span>}
              {personalInfo.portfolio&&<span className="break-all">{personalInfo.portfolio}</span>}
            </div>
          </div>
        )}
      </div>
      <div className="px-8 pb-2">
        {activeSections.filter((s)=>s.key!=='basics').map((sec)=>renderSection(sec))}
      </div>
    </div>
  );
};
