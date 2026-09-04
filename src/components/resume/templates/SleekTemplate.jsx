const CustomBlock = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const SH = ({children}) => <h2 className="inline-block bg-gray-50 text-gray-700 rounded-md px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] mb-2 mt-3 break-after-avoid">{children}</h2>;
  if (mode === 'bullets') {
    if (!items?.filter(Boolean).length) return null;
    return <div><SH>{label}</SH><ul className="space-y-0.5">{items.filter(Boolean).map((it,i)=><li key={i} className="text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid">{it}</li>)}</ul></div>;
  }
  if (!text?.trim()) return null;
  return <div><SH>{label}</SH><p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{text}</p></div>;
};

export const SleekTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const SH = ({children}) => <h2 className="inline-block bg-gray-50 text-gray-700 rounded-md px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] mb-2 mt-3 break-after-avoid">{children}</h2>;

  const renderSection = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'basics': return null;
      case 'summary': return summary ? (<div key="summary" className="mb-3"><SH>Profile</SH><p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{summary}</p></div>) : null;
      case 'experience': return experience?.length ? (<div key="experience" className="mb-3"><SH>Experience</SH>{experience.map((e,i)=>(
        <div key={i} className="mb-3 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <span className="text-[11.5px] font-semibold text-gray-900 break-words min-w-0">{e.position}</span>
            <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">{e.duration}</span>
          </div>
          <div className="text-[10.5px] text-gray-500 mb-0.5 break-words">{e.company}{e.location?` · ${e.location}`:''}{e.employmentType?` · ${e.employmentType}`:''}</div>
          {e.summary&&<p className="text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words">{e.summary}</p>}
          {e.responsibilities?.length>0&&<ul className="space-y-0.5">{e.responsibilities.map((r,j)=><li key={j} className="flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid"><span className="text-gray-400 shrink-0 mt-[2px]">—</span><span className="break-words min-w-0">{r}</span></li>)}</ul>}
        </div>))}</div>) : null;
      case 'skills': return skills?.length ? (<div key="skills" className="mb-3"><SH>Skills</SH><div className="flex flex-wrap gap-1.5">{(Array.isArray(skills)?skills:[skills]).map((s,i)=><span key={i} className="text-[10px] bg-gray-50 text-gray-700 rounded px-2 py-0.5 break-words">{s}</span>)}</div></div>) : null;
      case 'projects': return projects?.length ? (<div key="projects" className="mb-3"><SH>Projects</SH>{projects.map((p,i)=>(
        <div key={i} className="mb-2.5 break-inside-avoid">
          <div className="flex items-baseline gap-x-2 flex-wrap"><span className="text-[11.5px] font-semibold text-gray-900 break-words min-w-0">{p.name}</span>{p.role&&<span className="text-[10px] text-gray-400 break-words">({p.role})</span>}</div>
          {p.technologies&&<div className="text-[10.5px] text-gray-500 mb-0.5 break-words">Tech: {p.technologies}</div>}
          {(p.link||p.github)&&<div className="text-[9.5px] text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
          {p.description&&<p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{p.description}</p>}
        </div>))}</div>) : null;
      case 'education': return education?.length ? (<div key="education" className="mb-3"><SH>Education</SH>{education.map((e,i)=>(
        <div key={i} className="mb-2 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-1 flex-wrap"><span className="text-[11.5px] font-semibold text-gray-900 break-words">{e.degree}</span><span className="text-[10px] text-gray-400 shrink-0 whitespace-nowrap">{e.year}</span></div>
          <div className="text-[10.5px] text-gray-500 break-words">{e.institution}</div>
          {(e.gpa||e.details)&&<div className="text-[10px] text-gray-400 break-words">{[e.gpa,e.details].filter(Boolean).join(' — ')}</div>}
        </div>))}</div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications" className="mb-3"><SH>Certifications</SH><div className="space-y-0.5">{certifications.map((c,i)=><div key={i} className="text-[10.5px] text-gray-600 break-words break-inside-avoid">{c.name}{c.issuer?` — ${c.issuer}`:''}{c.year?` (${c.year})`:''}</div>)}</div></div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements" className="mb-3"><SH>Achievements</SH><ul className="space-y-0.5">{achievements.map((a,i)=><li key={i} className="flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid"><span className="text-gray-400 shrink-0 mt-[2px]">—</span><span className="break-words min-w-0">{a}</span></li>)}</ul></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages" className="mb-3"><SH>Languages</SH><p className="text-[10.5px] text-gray-600 break-words">{languages.join('  ·  ')}</p></div>) : null;
      default: return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    }
  };

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  return (
    <div className="resume-template sleek max-w-4xl mx-auto bg-white px-10 pt-3 font-sans overflow-hidden">
      {personalInfo&&(
        <div className="text-center mb-4">
          <h1 className="text-[22px] font-light tracking-[0.18em] text-gray-900 break-words">{personalInfo.fullName}</h1>
          {personalInfo.title&&<div className="text-[11px] text-gray-500 uppercase tracking-[0.12em] mt-1 break-words">{personalInfo.title}</div>}
          <div className="flex flex-wrap justify-center gap-1.5 mt-2">
            {personalInfo.email&&<span className="text-[9.5px] bg-gray-50 text-gray-600 rounded-full px-2.5 py-0.5 break-all">{personalInfo.email}</span>}
            {personalInfo.phone&&<span className="text-[9.5px] bg-gray-50 text-gray-600 rounded-full px-2.5 py-0.5 break-words">{personalInfo.phone}</span>}
            {personalInfo.location&&<span className="text-[9.5px] bg-gray-50 text-gray-600 rounded-full px-2.5 py-0.5 break-words">{personalInfo.location}</span>}
            {personalInfo.linkedin&&<span className="text-[9.5px] bg-gray-50 text-gray-600 rounded-full px-2.5 py-0.5 break-all">{personalInfo.linkedin}</span>}
            {personalInfo.github&&<span className="text-[9.5px] bg-gray-50 text-gray-600 rounded-full px-2.5 py-0.5 break-all">{personalInfo.github}</span>}
            {personalInfo.portfolio&&<span className="text-[9.5px] bg-gray-50 text-gray-600 rounded-full px-2.5 py-0.5 break-all">{personalInfo.portfolio}</span>}
          </div>
        </div>
      )}
      {activeSections.filter((s)=>s.key!=='basics').map((sec)=>renderSection(sec))}
    </div>
  );
};
