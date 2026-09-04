const CustomBlock = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === 'bullets') {
    if (!items?.filter(Boolean).length) return null;
    return <div className="mb-3 break-after-avoid"><h3 className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-1">{label}</h3><div className="space-y-0.5">{items.filter(Boolean).map((it,i)=><div key={i} className="text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid">{it}</div>)}</div></div>;
  }
  if (!text?.trim()) return null;
  return <div className="mb-3 break-after-avoid"><h3 className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-1">{label}</h3><p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{text}</p></div>;
};

export const CleanTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  const leftKeys = ['skills','languages','certifications','achievements','summary'];
  const rightKeys = ['experience','projects','education'];

  const H = ({children}) => <h2 className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-1 break-after-avoid">{children}</h2>;

  const renderLeft = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'summary': return summary ? <div key="summary" className="mb-3"><H>Profile</H><p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{summary}</p></div> : null;
      case 'skills': return skills?.length ? (<div key="skills" className="mb-3"><H>Skills</H><div className="space-y-0.5">{(Array.isArray(skills)?skills:[skills]).map((s,i)=><div key={i} className="text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid">{s}</div>)}</div></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages" className="mb-3"><H>Languages</H><p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{languages.join(' · ')}</p></div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications" className="mb-3"><H>Certifications</H><div className="space-y-0.5">{certifications.map((c,i)=><div key={i} className="text-[10.5px] text-gray-600 break-words break-inside-avoid">{c.name}{c.year?` (${c.year})`:''}</div>)}</div></div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements" className="mb-3"><H>Achievements</H><div className="space-y-0.5">{achievements.map((a,i)=><div key={i} className="text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid">{a}</div>)}</div></div>) : null;
      default: return null;
    }
  };

  const renderRight = (sec) => {
    if (sec.type === 'custom') return <div key={sec.id} className="mb-4">{sec.label&&<h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-800 mb-1.5 break-after-avoid">{sec.label}</h2>}{(()=>{const c=(customSections||{})[sec.id];if(!c)return null;if(c.mode==='bullets'){if(!c.items?.filter(Boolean).length)return null;return <ul className="space-y-1">{c.items.filter(Boolean).map((it,i)=><li key={i} className="text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid">• {it}</li>)}</ul>;}if(!c.text?.trim())return null;return <p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{c.text}</p>;})()}</div>;
    switch (sec.key) {
      case 'experience': return experience?.length ? (<div key="experience"><H>Experience</H>{experience.map((e,i)=>(
        <div key={i} className="mb-3.5 break-inside-avoid">
          <div className="flex justify-between items-baseline flex-wrap gap-1">
            <span className="font-semibold text-gray-900 text-[11.5px] break-words min-w-0">{e.position}</span>
            <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">{e.duration}</span>
          </div>
          <div className="text-[10.5px] text-gray-500 mb-0.5 break-words">{e.company}{e.location?` · ${e.location}`:''}{e.employmentType?` · ${e.employmentType}`:''}</div>
          {e.summary&&<p className="text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words">{e.summary}</p>}
          {e.responsibilities?.length>0&&<ul className="space-y-0.5 pl-3">{e.responsibilities.map((r,j)=><li key={j} className="text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid" style={{listStyle:'disc'}}>{r}</li>)}</ul>}
        </div>))}</div>) : null;
      case 'projects': return projects?.length ? (<div key="projects"><H>Projects</H>{projects.map((p,i)=>(
        <div key={i} className="mb-3 break-inside-avoid">
          <div className="flex flex-wrap items-baseline gap-x-2"><span className="font-semibold text-gray-900 text-[11.5px] break-words min-w-0">{p.name}</span>{p.role&&<span className="text-[10px] text-gray-400 break-words">({p.role})</span>}</div>
          {p.technologies&&<div className="text-[10.5px] text-gray-500 mb-0.5 break-words">Tech: {p.technologies}</div>}
          {(p.link||p.github)&&<div className="text-[9.5px] text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
          {p.description&&<p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{p.description}</p>}
        </div>))}</div>) : null;
      case 'education': return education?.length ? (<div key="education"><H>Education</H>{education.map((e,i)=>(
        <div key={i} className="mb-2.5 break-inside-avoid">
          <div className="flex justify-between items-baseline flex-wrap gap-1"><span className="font-semibold text-gray-900 text-[11.5px] break-words">{e.degree}</span><span className="text-[10px] text-gray-400 shrink-0 whitespace-nowrap">{e.year}</span></div>
          <div className="text-[10.5px] text-gray-500 break-words">{e.institution}</div>
          {(e.gpa||e.details)&&<div className="text-[10px] text-gray-400 break-words">{[e.details,e.gpa].filter(Boolean).join(' — ')}</div>}
        </div>))}</div>) : null;
      default: return null;
    }
  };

  const leftSections = activeSections.filter((s)=>leftKeys.includes(s.key)||s.type==='custom');
  const rightSections = activeSections.filter((s)=>rightKeys.includes(s.key));

  return (
    <div className="resume-template clean max-w-4xl mx-auto bg-white font-sans overflow-hidden">
      <div className="flex min-h-[1059px]">
        <div className="w-[30%] shrink-0 px-7 py-6 border-r border-gray-100 bg-surface-50">
          {leftSections.map((s)=>renderLeft(s))}
        </div>
        <div className="flex-1 px-7 py-6 space-y-4">
          {personalInfo&&(
            <div className="mb-1">
              <h1 className="text-[20px] font-medium text-gray-900 tracking-tight break-words">{personalInfo.fullName}</h1>
              {personalInfo.title&&<div className="text-[11px] text-gray-500 mb-1.5 break-words">{personalInfo.title}</div>}
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[9.5px] text-gray-400">
                {personalInfo.email&&<span className="break-all">{personalInfo.email}</span>}
                {personalInfo.phone&&<span className="break-words">{personalInfo.phone}</span>}
                {personalInfo.location&&<span className="break-words">{personalInfo.location}</span>}
                {personalInfo.linkedin&&<span className="break-all">{personalInfo.linkedin}</span>}
                {personalInfo.github&&<span className="break-all">{personalInfo.github}</span>}
                {personalInfo.portfolio&&<span className="break-all">{personalInfo.portfolio}</span>}
              </div>
            </div>
          )}
          {rightSections.map((s)=>renderRight(s))}
        </div>
      </div>
    </div>
  );
};
