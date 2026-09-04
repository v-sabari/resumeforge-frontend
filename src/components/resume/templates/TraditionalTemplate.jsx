const CustomBlock = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === 'bullets') {
    if (!items?.filter(Boolean).length) return null;
    return <div className="mb-3 break-after-avoid"><h4 className="text-[11px] font-bold uppercase tracking-wide border-b border-gray-400 pb-0.5 mb-1">{label}</h4><ul className="space-y-0.5">{items.filter(Boolean).map((it,i)=><li key={i} className="text-[10px] leading-relaxed break-words break-inside-avoid">{it}</li>)}</ul></div>;
  }
  if (!text?.trim()) return null;
  return <div className="mb-3 break-after-avoid"><h4 className="text-[11px] font-bold uppercase tracking-wide border-b border-gray-400 pb-0.5 mb-1">{label}</h4><p className="text-[10px] leading-relaxed break-words">{text}</p></div>;
};

export const TraditionalTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);
  const secs = (type) => activeSections.filter((s)=>s.type===type && s.key!=='basics');

  const mainSections = secs('standard').filter((s)=>!['skills','languages','certifications','achievements','basics'].includes(s.key));
  const sideKeys = ['skills','languages','certifications','achievements'];

  const renderMain = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'summary': return summary ? <div key="summary" className="mb-4"><h3 className="text-[12px] font-bold uppercase tracking-wide border-b border-gray-700 pb-0.5 mb-1.5 break-after-avoid">Summary</h3><p className="text-[10.5px] leading-relaxed break-words">{summary}</p></div> : null;
      case 'experience': return experience?.length ? (<div key="experience" className="mb-4"><h3 className="text-[12px] font-bold uppercase tracking-wide border-b border-gray-700 pb-0.5 mb-1.5 break-after-avoid">Professional Experience</h3>{experience.map((e,i)=>(
        <div key={i} className="mb-2.5 break-inside-avoid">
          <div className="flex flex-wrap items-baseline justify-between gap-1">
            <span className="font-bold text-[11px] break-words min-w-0">{e.position}</span>
            <span className="text-[9.5px] italic whitespace-nowrap shrink-0">{e.duration}</span>
          </div>
          <div className="text-[10px] italic mb-0.5 break-words">{e.company}{e.location?`, ${e.location}`:''}{e.employmentType?` (${e.employmentType})`:''}</div>
          {e.summary&&<p className="text-[10.5px] mb-0.5 leading-relaxed break-words">{e.summary}</p>}
          {e.responsibilities?.length>0&&<div className="pl-3">{e.responsibilities.map((r,j)=><div key={j} className="text-[10.5px] leading-relaxed break-words break-inside-avoid">• {r}</div>)}</div>}
        </div>))}</div>) : null;
      case 'projects': return projects?.length ? (<div key="projects" className="mb-4"><h3 className="text-[12px] font-bold uppercase tracking-wide border-b border-gray-700 pb-0.5 mb-1.5 break-after-avoid">Projects</h3>{projects.map((p,i)=>(
        <div key={i} className="mb-2 break-inside-avoid">
          <div className="flex flex-wrap items-baseline gap-x-2"><span className="font-bold text-[11px] break-words min-w-0">{p.name}</span>{p.role&&<span className="text-[10px] italic break-words">({p.role})</span>}</div>
          {p.technologies&&<div className="text-[10px] mb-0.5 break-words">Tech: {p.technologies}</div>}
          {(p.link||p.github)&&<div className="text-[9px] break-all mb-0.5">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
          {p.description&&<p className="text-[10.5px] leading-relaxed break-words">{p.description}</p>}
        </div>))}</div>) : null;
      case 'education': return education?.length ? (<div key="education" className="mb-4"><h3 className="text-[12px] font-bold uppercase tracking-wide border-b border-gray-700 pb-0.5 mb-1.5 break-after-avoid">Education</h3>{education.map((e,i)=>(
        <div key={i} className="mb-1.5 break-inside-avoid">
          <div className="flex flex-wrap items-baseline justify-between gap-1"><span className="font-bold text-[11px] break-words">{e.degree}</span><span className="text-[9.5px] italic shrink-0 whitespace-nowrap">{e.year}</span></div>
          <div className="text-[10px] italic break-words">{e.institution}</div>
          {(e.gpa||e.details)&&<div className="text-[9.5px] break-words">{[e.details,e.gpa].filter(Boolean).join(' — ')}</div>}
        </div>))}</div>) : null;
      default: return null;
    }
  };

  const renderSide = (sec) => {
    if (sec.type === 'custom') {
      const c=(customSections||{})[sec.id]; if(!c) return null;
      if(c.mode==='bullets'&&!c.items?.filter(Boolean).length) return null;
      if(c.mode!=='bullets'&&!c.text?.trim()) return null;
      return <div key={sec.id} className="mb-3 break-after-avoid"><h4 className="text-[11px] font-bold uppercase tracking-wide border-b border-gray-500 pb-0.5 mb-1">{sec.label}</h4>{c.mode==='bullets'?<ul className="space-y-0.5">{c.items.filter(Boolean).map((it,i)=><li key={i} className="text-[10px] leading-relaxed break-words break-inside-avoid">{it}</li>)}</ul>:<p className="text-[10px] leading-relaxed break-words">{c.text}</p>}</div>;
    }
    switch (sec.key) {
      case 'skills': return skills?.length ? (<div key="skills" className="mb-3 break-after-avoid"><h4 className="text-[11px] font-bold uppercase tracking-wide border-b border-gray-500 pb-0.5 mb-1">Skills</h4><div className="space-y-0.5">{(Array.isArray(skills)?skills:[skills]).map((s,i)=><div key={i} className="text-[10px] leading-relaxed break-words break-inside-avoid">{s}</div>)}</div></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages" className="mb-3 break-after-avoid"><h4 className="text-[11px] font-bold uppercase tracking-wide border-b border-gray-500 pb-0.5 mb-1">Languages</h4><div className="space-y-0.5">{languages.map((l,i)=><div key={i} className="text-[10px] leading-relaxed break-words break-inside-avoid">{l}</div>)}</div></div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications" className="mb-3 break-after-avoid"><h4 className="text-[11px] font-bold uppercase tracking-wide border-b border-gray-500 pb-0.5 mb-1">Certifications</h4><div className="space-y-0.5">{certifications.map((c,i)=><div key={i} className="text-[10px] leading-relaxed break-words break-inside-avoid">{c.name}{c.year?` (${c.year})`:''}</div>)}</div></div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements" className="mb-3 break-after-avoid"><h4 className="text-[11px] font-bold uppercase tracking-wide border-b border-gray-500 pb-0.5 mb-1">Achievements</h4><ul className="space-y-0.5">{achievements.map((a,i)=><li key={i} className="text-[10px] leading-relaxed break-words break-inside-avoid">• {a}</li>)}</ul></div>) : null;
      default: return null;
    }
  };

  const customSide = activeSections.filter((s)=>s.type==='custom');

  return (
    <div className="resume-template traditional max-w-4xl mx-auto bg-white font-serif text-gray-900 overflow-hidden">
      <div className="flex">
        <div className="w-[34%] shrink-0 bg-gray-100 px-5 py-6">
          {personalInfo&&(
            <div className="mb-5 break-after-avoid">
              <h1 className="text-[20px] font-bold leading-tight break-words">{personalInfo.fullName}</h1>
              {personalInfo.title&&<div className="text-[11px] italic mt-0.5 mb-2 break-words">{personalInfo.title}</div>}
              <div className="space-y-1 text-[9.5px]">
                {personalInfo.email&&<div className="break-all">{personalInfo.email}</div>}
                {personalInfo.phone&&<div className="break-words">{personalInfo.phone}</div>}
                {personalInfo.location&&<div className="break-words">{personalInfo.location}</div>}
                {personalInfo.linkedin&&<div className="break-all">{personalInfo.linkedin}</div>}
                {personalInfo.github&&<div className="break-all">{personalInfo.github}</div>}
                {personalInfo.portfolio&&<div className="break-all">{personalInfo.portfolio}</div>}
              </div>
            </div>
          )}
          {activeSections.filter((s)=>sideKeys.includes(s.key)).map((s)=>renderSide(s))}
          {customSide.map((s)=>renderSide(s))}
        </div>
        <div className="flex-1 px-6 py-6">
          {mainSections.map((s)=>renderMain(s))}
          {activeSections.filter((s)=>s.type==='custom').map((s)=>renderMain(s))}
        </div>
      </div>
    </div>
  );
};
