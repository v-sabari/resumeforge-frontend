
const CustomBlock = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-800 text-center border-b border-t border-gray-300 py-0.5 mb-2 break-after-avoid">{label}</h2>;
  if (mode === 'bullets') {
    if (!items?.filter(Boolean).length) return null;
    return <div>{H}<ul className="space-y-0.5">{items.filter(Boolean).map((it,i)=><li key={i} className="text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid">• {it}</li>)}</ul></div>;
  }
  if (!text?.trim()) return null;
  return <div>{H}<p className="text-[10.5px] text-gray-700 leading-relaxed break-words">{text}</p></div>;
};

export const ClassicTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const SH = ({ children }) => <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-800 text-center border-b border-t border-gray-300 py-0.5 mb-2 break-after-avoid">{children}</h2>;

  const renderSection = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'basics': return null;
      case 'summary': return summary ? <div key="summary" className="mb-3"><SH>Objective</SH><p className="text-[10.5px] text-gray-700 text-center leading-relaxed break-words">{summary}</p></div> : null;
      case 'experience': return experience?.length ? (<div key="experience" className="mb-3"><SH>Experience</SH>{experience.map((e,i)=>(
        <div key={i} className="mb-2 break-inside-avoid">
          <div className="flex justify-between items-baseline flex-wrap gap-1">
            <span className="font-bold text-gray-900 text-[11px] break-words min-w-0">{e.position}</span>
            <span className="text-[10px] text-gray-500 italic shrink-0 whitespace-nowrap">{e.duration}</span>
          </div>
          <div className="text-[10.5px] text-gray-600 italic mb-0.5 break-words">{e.company}{e.location?` — ${e.location}`:''}{e.employmentType?` (${e.employmentType})`:''}</div>
          {e.summary&&<p className="text-[10.5px] text-gray-700 mb-0.5 leading-relaxed break-words">{e.summary}</p>}
          {e.responsibilities?.length>0&&<ul className="space-y-0.5">{e.responsibilities.map((r,j)=><li key={j} className="text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid">• {r}</li>)}</ul>}
        </div>))}</div>) : null;
      case 'education': return education?.length ? (<div key="education" className="mb-3"><SH>Education</SH>{education.map((e,i)=>(
        <div key={i} className="mb-1 break-inside-avoid">
          <div className="flex justify-between items-baseline flex-wrap gap-1"><span className="font-bold text-gray-900 text-[11px] break-words">{e.degree}</span><span className="text-[10px] text-gray-500 italic shrink-0 whitespace-nowrap">{e.year}</span></div>
          <div className="text-[10.5px] text-gray-600 italic break-words">{e.institution}</div>
          {(e.gpa||e.details)&&<div className="text-[10px] text-gray-500 break-words">{[(e.details||''),e.gpa].filter(Boolean).join(' — ')}</div>}
        </div>))}</div>) : null;
      case 'projects': return projects?.length ? (<div key="projects" className="mb-3"><SH>Projects</SH>{projects.map((p,i)=>(
        <div key={i} className="mb-2 break-inside-avoid">
          <div className="flex flex-wrap items-baseline gap-x-2"><span className="font-bold text-gray-900 text-[11px] break-words min-w-0">{p.name}</span>{p.role&&<span className="text-[10px] text-gray-500 italic break-words">({p.role})</span>}</div>
          {p.technologies&&<div className="text-[10px] text-gray-500 mb-0.5 break-words">Tech: {p.technologies}</div>}
          {(p.link||p.github)&&<div className="text-[9.5px] text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
          {p.description&&<p className="text-[10.5px] text-gray-700 leading-relaxed break-words">{p.description}</p>}
        </div>))}</div>) : null;
      case 'skills': return skills?.length ? (<div key="skills" className="mb-3"><SH>Skills</SH><p className="text-[10.5px] text-gray-700 text-center leading-relaxed break-words">{(Array.isArray(skills)?skills:[skills]).join('  •  ')}</p></div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications" className="mb-3"><SH>Certifications</SH><div className="space-y-0.5">{certifications.map((c,i)=><div key={i} className="text-[10.5px] text-gray-700 text-center break-words break-inside-avoid">{c.name}{c.issuer&&<span className="text-gray-500"> — {c.issuer}</span>}{c.year&&<span className="text-gray-400"> ({c.year})</span>}</div>)}</div></div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements" className="mb-3"><SH>Achievements</SH><ul className="space-y-0.5">{achievements.map((a,i)=><li key={i} className="text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid">• {a}</li>)}</ul></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages" className="mb-3"><SH>Languages</SH><p className="text-[10.5px] text-gray-700 text-center break-words">{languages.join('  ·  ')}</p></div>) : null;
      default: return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    }
  };

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  return (
    <div className="resume-template classic max-w-4xl mx-auto bg-white px-8 pt-2 font-sans overflow-hidden">
      {personalInfo&&(
        <div className="text-center mb-4">
          <h1 className="text-[24px] font-bold uppercase tracking-[0.15em] text-gray-900 break-words">{personalInfo.fullName}</h1>
          {personalInfo.title&&<div className="text-[12px] text-gray-600 italic mt-0.5 break-words">{personalInfo.title}</div>}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1.5 text-[10px] text-gray-600">
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
