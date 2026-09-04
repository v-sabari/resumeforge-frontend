const CustomBlock = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === 'bullets') {
    if (!items?.filter(Boolean).length) return null;
    return <div className="mb-3 break-after-avoid"><h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800 mb-1">{label}</h4><div className="space-y-0.5">{items.filter(Boolean).map((it,i)=><div key={i} className="text-[10px] text-gray-700 leading-relaxed break-words break-inside-avoid">{it}</div>)}</div></div>;
  }
  if (!text?.trim()) return null;
  return <div className="mb-3 break-after-avoid"><h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800 mb-1">{label}</h4><p className="text-[10px] text-gray-700 leading-relaxed break-words">{text}</p></div>;
};

export const EngineeringTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  const sideKeys = ['skills','certifications','languages','achievements'];

  const Hmain = ({children}) => <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-900 mb-1.5 mt-1 break-after-avoid"><span className="w-6 h-0.5 bg-emerald-600 shrink-0 inline-block"></span>{children}</h3>;

  const renderSide = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'skills': return skills?.length ? (<div key="skills" className="mb-4 break-after-avoid"><h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800 mb-1">Skills</h4><div className="space-y-0.5">{(Array.isArray(skills)?skills:[skills]).map((s,i)=><div key={i} className="text-[10px] text-gray-700 leading-relaxed break-words break-inside-avoid">{s}</div>)}</div></div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications" className="mb-4 break-after-avoid"><h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800 mb-1">Certifications</h4><div className="space-y-0.5">{certifications.map((c,i)=><div key={i} className="text-[10px] text-gray-700 break-words break-inside-avoid">{c.name}{c.year?` (${c.year})`:''}</div>)}</div></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages" className="mb-4 break-after-avoid"><h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800 mb-1">Languages</h4><div className="space-y-0.5">{languages.map((l,i)=><div key={i} className="text-[10px] text-gray-700 break-words break-inside-avoid">{l}</div>)}</div></div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements" className="mb-4 break-after-avoid"><h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800 mb-1">Achievements</h4><div className="space-y-0.5">{achievements.map((a,i)=><div key={i} className="text-[10px] text-gray-700 break-words break-inside-avoid">• {a}</div>)}</div></div>) : null;
      default: return null;
    }
  };

  const renderMain = (sec) => {
    if (sec.type === 'custom') return <div key={sec.id} className="mb-4 break-after-avoid">{sec.label&&<h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-900 mb-1.5 break-after-avoid"><span className="w-6 h-0.5 bg-emerald-600 shrink-0 inline-block"></span>{sec.label}</h3>}{(()=>{const c=(customSections||{})[sec.id];if(!c)return null;if(c.mode==='bullets'){if(!c.items?.filter(Boolean).length)return null;return <ul className="space-y-0.5">{c.items.filter(Boolean).map((it,i)=><li key={i} className="text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid">• {it}</li>)}</ul>;}if(!c.text?.trim())return null;return <p className="text-[10.5px] text-gray-700 leading-relaxed break-words">{c.text}</p>;})()}</div>;
    switch (sec.key) {
      case 'summary': return summary ? (<div key="summary" className="mb-4"><h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-900 mb-1.5 break-after-avoid"><span className="w-6 h-0.5 bg-emerald-600 shrink-0 inline-block"></span>Professional Summary</h3><p className="text-[10.5px] text-gray-700 leading-relaxed break-words">{summary}</p></div>) : null;
      case 'experience': return experience?.length ? (<div key="experience" className="mb-4"><Hmain>Professional Experience</Hmain>{experience.map((e,i)=>(
        <div key={i} className="mb-3 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <span className="font-semibold text-gray-900 text-[11.5px] break-words min-w-0">{e.position}</span>
            <span className="text-[10px] text-emerald-700 font-medium shrink-0 whitespace-nowrap">{e.duration}</span>
          </div>
          <div className="text-[10.5px] text-gray-500 mb-0.5 break-words">{e.company}{e.location?` · ${e.location}`:''}{e.employmentType?` · ${e.employmentType}`:''}</div>
          {e.summary&&<p className="text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words">{e.summary}</p>}
          {e.responsibilities?.length>0&&<ul className="space-y-0.5 pl-3">{e.responsibilities.map((r,j)=><li key={j} className="text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid"><span className="text-emerald-600 mr-1">▸</span>{r}</li>)}</ul>}
        </div>))}</div>) : null;
      case 'projects': return projects?.length ? (<div key="projects" className="mb-4"><Hmain>Projects</Hmain>{projects.map((p,i)=>(
        <div key={i} className="mb-2.5 break-inside-avoid">
          <div className="flex items-baseline gap-x-2 flex-wrap"><span className="font-semibold text-gray-900 text-[11.5px] break-words min-w-0">{p.name}</span>{p.role&&<span className="text-[10px] text-gray-400 break-words">({p.role})</span>}</div>
          {p.technologies&&<div className="text-[10.5px] text-emerald-700 mb-0.5 break-words">Tech: {p.technologies}</div>}
          {(p.link||p.github)&&<div className="text-[9.5px] text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
          {p.description&&<p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{p.description}</p>}
        </div>))}</div>) : null;
      case 'education': return education?.length ? (<div key="education" className="mb-4"><Hmain>Education</Hmain>{education.map((e,i)=>(
        <div key={i} className="mb-2 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-1 flex-wrap"><span className="font-semibold text-gray-900 text-[11.5px] break-words">{e.degree}</span><span className="text-[10px] text-emerald-700 font-medium shrink-0 whitespace-nowrap">{e.year}</span></div>
          <div className="text-[10.5px] text-gray-500 break-words">{e.institution}</div>
          {(e.gpa||e.details)&&<div className="text-[10px] text-gray-500 break-words">{[e.gpa,e.details].filter(Boolean).join(' — ')}</div>}
        </div>))}</div>) : null;
      default: return null;
    }
  };

  const customSide = activeSections.filter((s)=>s.type==='custom');
  const sideSections = activeSections.filter((s)=>sideKeys.includes(s.key)).concat(customSide);
  const mainSections = activeSections.filter((s)=>!sideKeys.includes(s.key)&&!['basics'].includes(s.key));

  return (
    <div className="resume-template engineering max-w-4xl mx-auto bg-white font-sans overflow-hidden">
      <div className="flex">
        <div className="w-[30%] shrink-0 bg-emerald-50/60 px-5 py-6">
          {personalInfo&&(
            <div className="mb-4 break-after-avoid">
              <h1 className="text-[20px] font-bold text-gray-900 leading-tight break-words">{personalInfo.fullName}</h1>
              {personalInfo.title&&<div className="text-[11px] text-emerald-700 font-medium mt-0.5 break-words">{personalInfo.title}</div>}
              <div className="mt-2 space-y-1 text-[9.5px] text-gray-600">
                {personalInfo.email&&<div className="break-all">{personalInfo.email}</div>}
                {personalInfo.phone&&<div className="break-words">{personalInfo.phone}</div>}
                {personalInfo.location&&<div className="break-words">{personalInfo.location}</div>}
                {personalInfo.linkedin&&<div className="break-all">{personalInfo.linkedin}</div>}
                {personalInfo.github&&<div className="break-all">{personalInfo.github}</div>}
                {personalInfo.portfolio&&<div className="break-all">{personalInfo.portfolio}</div>}
              </div>
            </div>
          )}
          {sideSections.map((s)=>renderSide(s))}
        </div>
        <div className="flex-1 px-7 py-6 space-y-1">
          {mainSections.map((s)=>renderMain(s))}
        </div>
      </div>
    </div>
  );
};
