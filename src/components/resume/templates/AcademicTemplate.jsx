const CustomBlock = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = <h2 className="text-center text-[9px] italic uppercase tracking-[0.14em] text-gray-600 border-t border-gray-800 border-b-2 border-gray-800 py-[1px] mb-1 mt-3 break-after-avoid">{label}</h2>;
  if (mode === 'bullets') {
    if (!items?.filter(Boolean).length) return null;
    return <div>{H}<ul className="space-y-0.5 text-center">{items.filter(Boolean).map((it,i)=><li key={i} className="text-[10px] leading-relaxed break-words break-inside-avoid">{it}</li>)}</ul></div>;
  }
  if (!text?.trim()) return null;
  return <div>{H}<p className="text-[10px] text-center leading-relaxed break-words">{text}</p></div>;
};

export const AcademicTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const H = ({children}) => <h2 className="text-center text-[9px] italic uppercase tracking-[0.14em] text-gray-600 border-t border-gray-800 border-b-2 border-gray-800 py-[1px] mb-1 mt-3 break-after-avoid">{children}</h2>;

  const renderSection = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'basics': return null;
      case 'summary': return summary ? (<div key="summary" className="mb-2"><H>Summary</H><p className="text-center text-[10px] text-gray-800 leading-tight break-words">{summary}</p></div>) : null;
      case 'experience': return experience?.length ? (<div key="experience" className="mb-2"><H>Experience</H>{experience.map((e,i)=>(
        <div key={i} className="mb-1.5 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-gray-900 break-words min-w-0">{e.position}</span>
            <span className="text-[9px] text-gray-500 italic shrink-0 whitespace-nowrap">{e.duration}</span>
          </div>
          <div className="text-[9.5px] italic text-gray-600 break-words">{e.company}{e.location?`, ${e.location}`:''}{e.employmentType?` (${e.employmentType})`:''}</div>
          {e.summary&&<p className="text-[10px] text-gray-800 leading-tight mt-0.5 break-words">{e.summary}</p>}
          {e.responsibilities?.length>0&&<div className="pl-3">{e.responsibilities.map((r,j)=><div key={j} className="text-[10px] text-gray-800 leading-tight break-words break-inside-avoid">• {r}</div>)}</div>}
        </div>))}</div>) : null;
      case 'education': return education?.length ? (<div key="education" className="mb-2"><H>Education</H>{education.map((e,i)=>(
        <div key={i} className="mb-1 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-2 flex-wrap"><span className="text-[10px] font-bold text-gray-900 break-words">{e.degree}</span><span className="text-[9px] italic text-gray-500 shrink-0 whitespace-nowrap">{e.year}</span></div>
          <div className="text-[9.5px] italic text-gray-600 break-words">{e.institution}</div>
          {(e.gpa||e.details)&&<div className="text-[9px] text-gray-600 break-words">{[(e.details||''),e.gpa].filter(Boolean).join(' — ')}</div>}
        </div>))}</div>) : null;
      case 'projects': return projects?.length ? (<div key="projects" className="mb-2"><H>Research & Projects</H>{projects.map((p,i)=>(
        <div key={i} className="mb-1.5 break-inside-avoid">
          <div className="flex items-baseline gap-x-2 flex-wrap"><span className="text-[10px] font-bold text-gray-900 break-words min-w-0">{p.name}</span>{p.role&&<span className="text-[9px] italic text-gray-500 break-words">({p.role})</span>}</div>
          {p.technologies&&<div className="text-[9px] italic text-gray-600 break-words">Tech: {p.technologies}</div>}
          {(p.link||p.github)&&<div className="text-[8.5px] break-all">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
          {p.description&&<p className="text-[10px] text-gray-800 leading-tight break-words">{p.description}</p>}
        </div>))}</div>) : null;
      case 'skills': return skills?.length ? (<div key="skills" className="mb-2"><H>Research Interests / Skills</H><p className="text-center text-[10px] text-gray-800 leading-tight break-words">{(Array.isArray(skills)?skills:[skills]).join('  •  ')}</p></div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications" className="mb-2"><H>Certifications</H><div className="space-y-0.5 text-center">{certifications.map((c,i)=><div key={i} className="text-[10px] text-gray-800 break-words break-inside-avoid">{c.name}{c.issuer?` — ${c.issuer}`:''}{c.year?` (${c.year})`:''}</div>)}</div></div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements" className="mb-2"><H>Achievements</H><ul className="space-y-0.5">{achievements.map((a,i)=><li key={i} className="text-[10px] text-gray-800 leading-tight break-words break-inside-avoid">• {a}</li>)}</ul></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages" className="mb-2"><H>Languages</H><p className="text-center text-[10px] text-gray-800 break-words">{languages.join('  ·  ')}</p></div>) : null;
      default: return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    }
  };

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  return (
    <div className="resume-template academic max-w-4xl mx-auto bg-white px-7 py-1 font-serif text-gray-900 overflow-hidden">
      {personalInfo&&(
        <div className="text-center mb-2 pb-2 border-b-2 border-gray-800">
          <h1 className="text-[18px] font-bold uppercase tracking-[0.12em] break-words">{personalInfo.fullName}</h1>
          {personalInfo.title&&<div className="text-[11px] italic text-gray-700 break-words">{personalInfo.title}</div>}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1 text-[9px] text-gray-600">
            {personalInfo.email&&<span className="break-all">{personalInfo.email}</span>}
            {personalInfo.phone&&<span className="break-words">{personalInfo.phone}</span>}
            {personalInfo.location&&<span className="break-words">{personalInfo.location}</span>}
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
