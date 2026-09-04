const CustomBlock = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const SH = ({children}) => <h2 className="text-[10px] font-bold uppercase tracking-[0.26em] text-fuchsia-700 mb-2 mt-4 break-after-avoid"><span className="inline-block border-b-2 border-fuchsia-500 pb-0.5 break-words">{children}</span></h2>;
  if (mode === 'bullets') {
    if (!items?.filter(Boolean).length) return null;
    return <div className="mb-2"><SH>{label}</SH><ul className="space-y-1">{items.filter(Boolean).map((it,i)=><li key={i} className="flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid"><span className="text-fuchsia-500 shrink-0 mt-[2px]">✦</span><span className="break-words min-w-0">{it}</span></li>)}</ul></div>;
  }
  if (!text?.trim()) return null;
  return <div className="mb-2"><SH>{label}</SH><p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{text}</p></div>;
};

export const CreativeATSTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const SH = ({children}) => <h2 className="text-[10px] font-bold uppercase tracking-[0.26em] text-fuchsia-700 mb-2 mt-4 break-after-avoid"><span className="inline-block border-b-2 border-fuchsia-500 pb-0.5 break-words">{children}</span></h2>;

  const renderSection = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'basics': return null;
      case 'summary': return summary ? (<div key="summary" className="mb-2"><h2 className="text-[10px] font-bold uppercase tracking-[0.26em] text-fuchsia-700 mb-2 break-after-avoid"><span className="inline-block border-b-2 border-fuchsia-500 pb-0.5 break-words">About Me</span></h2><p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{summary}</p></div>) : null;
      case 'experience': return experience?.length ? (<div key="experience" className="mb-2"><SH>Experience</SH>{experience.map((e,i)=>(
        <div key={i} className="mb-3 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <span className="text-[11.5px] font-bold text-fuchsia-700 break-words min-w-0">{e.position}</span>
            <span className="text-[9.5px] text-gray-400 uppercase tracking-wide shrink-0 whitespace-nowrap">{e.duration}</span>
          </div>
          <div className="text-[10.5px] text-gray-500 mb-0.5 break-words">{e.company}{e.location?` · ${e.location}`:''}{e.employmentType?` · ${e.employmentType}`:''}</div>
          {e.summary&&<p className="text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words">{e.summary}</p>}
          {e.responsibilities?.length>0&&<ul className="space-y-0.5">{e.responsibilities.map((r,j)=><li key={j} className="flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid"><span className="text-fuchsia-500 shrink-0 mt-[2px]">✦</span><span className="break-words min-w-0">{r}</span></li>)}</ul>}
        </div>))}</div>) : null;
      case 'skills': return skills?.length ? (<div key="skills" className="mb-2"><SH>Skills</SH><div className="flex flex-wrap gap-1.5">{(Array.isArray(skills)?skills:[skills]).map((s,i)=><span key={i} className="text-[10px] bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-200 rounded-full px-2.5 py-0.5 break-words">{s}</span>)}</div></div>) : null;
      case 'projects': return projects?.length ? (<div key="projects" className="mb-2"><SH>Projects</SH>{projects.map((p,i)=>(
        <div key={i} className="mb-2.5 break-inside-avoid">
          <div className="flex items-baseline gap-x-2 flex-wrap"><span className="text-[11.5px] font-bold text-fuchsia-700 break-words min-w-0">{p.name}</span>{p.role&&<span className="text-[10px] text-gray-400 break-words">({p.role})</span>}</div>
          {p.technologies&&<div className="text-[10.5px] text-gray-500 mb-0.5 break-words">Tech: {p.technologies}</div>}
          {(p.link||p.github)&&<div className="text-[9.5px] text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
          {p.description&&<p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{p.description}</p>}
        </div>))}</div>) : null;
      case 'education': return education?.length ? (<div key="education" className="mb-2"><SH>Education</SH>{education.map((e,i)=>(
        <div key={i} className="mb-2 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-1 flex-wrap"><span className="text-[11.5px] font-bold text-fuchsia-700 break-words">{e.degree}</span><span className="text-[9.5px] text-gray-400 uppercase tracking-wide shrink-0 whitespace-nowrap">{e.year}</span></div>
          <div className="text-[10.5px] text-gray-500 break-words">{e.institution}</div>
          {(e.gpa||e.details)&&<div className="text-[10px] text-gray-400 break-words">{[e.gpa,e.details].filter(Boolean).join(' — ')}</div>}
        </div>))}</div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications" className="mb-2"><SH>Certifications</SH><div className="space-y-0.5">{certifications.map((c,i)=><div key={i} className="text-[10.5px] text-gray-600 break-words break-inside-avoid">✦ {c.name}{c.issuer?` — ${c.issuer}`:''}{c.year?` (${c.year})`:''}</div>)}</div></div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements" className="mb-2"><SH>Achievements</SH><ul className="space-y-0.5">{achievements.map((a,i)=><li key={i} className="flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid"><span className="text-fuchsia-500 shrink-0 mt-[2px]">✦</span><span className="break-words min-w-0">{a}</span></li>)}</ul></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages" className="mb-2"><SH>Languages</SH><p className="text-[10.5px] text-gray-600 break-words">{languages.join('  ·  ')}</p></div>) : null;
      default: return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    }
  };

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  return (
    <div className="resume-template creative max-w-4xl mx-auto bg-white font-sans overflow-hidden">
      {personalInfo&&(
        <div className="bg-gradient-to-r from-fuchsia-700 via-purple-700 to-indigo-800 text-white px-8 py-6 mb-4">
          <h1 className="text-[26px] font-extrabold tracking-tight break-words">{personalInfo.fullName}</h1>
          {personalInfo.title&&<div className="text-[12px] text-fuchsia-100 font-medium mt-1 mb-2 break-words">{personalInfo.title}</div>}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-white/90">
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
