const CustomBlock = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900 border-b-2 border-gray-900 pb-0.5 mb-2 mt-4 break-after-avoid">{label}</h2>;
  if (mode === 'bullets') {
    if (!items?.filter(Boolean).length) return null;
    return <div>{H}<ul className="space-y-0.5">{items.filter(Boolean).map((it,i)=><li key={i} className="text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid">{it}</li>)}</ul></div>;
  }
  if (!text?.trim()) return null;
  return <div>{H}<p className="text-[10.5px] text-gray-700 leading-relaxed break-words">{text}</p></div>;
};

export const FinanceTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const H = ({children}) => <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900 border-b-2 border-gray-900 pb-0.5 mb-2 mt-4 break-after-avoid">{children}</h2>;

  const renderSection = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'basics': return null;
      case 'summary': return summary ? (<div key="summary" className="mb-2"><H>Executive Profile</H><p className="text-[10.5px] text-gray-700 leading-relaxed break-words">{summary}</p></div>) : null;
      case 'experience': return experience?.length ? (<div key="experience" className="mb-2"><H>Professional Experience</H>{experience.map((e,i)=>(
        <div key={i} className="mb-3 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <span className="text-[11.5px] font-bold text-gray-900 break-words min-w-0">{e.position}</span>
            <span className="text-[10px] text-gray-600 font-medium shrink-0 whitespace-nowrap">{e.duration}</span>
          </div>
          <div className="text-[10.5px] text-gray-600 mb-0.5 break-words">{e.company}{e.location?` | ${e.location}`:''}{e.employmentType?` | ${e.employmentType}`:''}</div>
          {e.summary&&<p className="text-[10.5px] text-gray-700 mb-0.5 leading-relaxed break-words">{e.summary}</p>}
          {e.responsibilities?.length>0&&<ul className="space-y-0.5 pl-3">{e.responsibilities.map((r,j)=><li key={j} className="text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid" style={{listStyle:'disc'}}>{r}</li>)}</ul>}
        </div>))}</div>) : null;
      case 'skills': return skills?.length ? (<div key="skills" className="mb-2"><H>Core Competencies</H><div className="grid grid-cols-3 gap-x-4 gap-y-1 px-1">{(Array.isArray(skills)?skills:[skills]).map((s,i)=><div key={i} className="text-[10.5px] text-gray-700 font-medium break-words break-inside-avoid">{s}</div>)}</div></div>) : null;
      case 'education': return education?.length ? (<div key="education" className="mb-2"><H>Education</H>{education.map((e,i)=>(
        <div key={i} className="mb-2 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-1 flex-wrap"><span className="text-[11.5px] font-bold text-gray-900 break-words">{e.degree}</span><span className="text-[10px] text-gray-600 shrink-0 whitespace-nowrap">{e.year}</span></div>
          <div className="text-[10.5px] text-gray-600 break-words">{e.institution}</div>
          {(e.gpa||e.details)&&<div className="text-[10px] text-gray-500 break-words">{[e.gpa,e.details].filter(Boolean).join(' — ')}</div>}
        </div>))}</div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications" className="mb-2"><H>Certifications & Licenses</H><div className="space-y-0.5">{certifications.map((c,i)=><div key={i} className="text-[10.5px] text-gray-700 break-words break-inside-avoid">{c.name}{c.issuer?` — ${c.issuer}`:''}{c.year?` (${c.year})`:''}</div>)}</div></div>) : null;
      case 'projects': return projects?.length ? (<div key="projects" className="mb-2"><H>Key Projects</H>{projects.map((p,i)=>(
        <div key={i} className="mb-2.5 break-inside-avoid">
          <div className="flex items-baseline gap-x-2 flex-wrap"><span className="text-[11.5px] font-bold text-gray-900 break-words min-w-0">{p.name}</span>{p.role&&<span className="text-[10px] text-gray-400 break-words">({p.role})</span>}</div>
          {p.technologies&&<div className="text-[10.5px] text-gray-600 mb-0.5 break-words">Scope: {p.technologies}</div>}
          {(p.link||p.github)&&<div className="text-[9.5px] text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
          {p.description&&<p className="text-[10.5px] text-gray-700 leading-relaxed break-words">{p.description}</p>}
        </div>))}</div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements" className="mb-2"><H>Awards & Achievements</H><ul className="space-y-0.5 pl-3">{achievements.map((a,i)=><li key={i} className="text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid" style={{listStyle:'disc'}}>{a}</li>)}</ul></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages" className="mb-2"><H>Languages</H><p className="text-[10.5px] text-gray-700 break-words">{languages.join('  |  ')}</p></div>) : null;
      default: return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    }
  };

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  return (
    <div className="resume-template finance max-w-4xl mx-auto bg-white px-8 pt-2 font-sans overflow-hidden">
      {personalInfo&&(
        <div className="mb-4 pb-3 border-b-4 border-gray-900">
          <h1 className="text-[24px] font-bold text-gray-900 break-words">{personalInfo.fullName}</h1>
          {personalInfo.title&&<div className="text-[11px] text-gray-600 font-medium mt-0.5 mb-2 break-words">{personalInfo.title}</div>}
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[10px] text-gray-600">
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
