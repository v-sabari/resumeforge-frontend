const Card = ({ accent, title, children }) => (
  <div className="mb-3 border border-gray-100 shadow-sm rounded-lg overflow-hidden break-after-avoid">
    <div className={`flex items-center gap-2 px-3 py-1.5 ${accent} text-white`}>
      <span className="text-[9.5px] font-bold uppercase tracking-[0.2em] break-words">{title}</span>
    </div>
    <div className="px-3 py-2">{children}</div>
  </div>
);

export const ContemporaryTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const ACCENT = 'bg-indigo-600';

  const body = (mode, text, items) => {
    if (mode === 'bullets') {
      if (!items?.filter(Boolean).length) return null;
      return <ul className="space-y-1">{items.filter(Boolean).map((it,i)=><li key={i} className="flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid"><span className={`mt-[2px] w-1 h-1 shrink-0 rounded-full ${ACCENT.replace('bg-','bg-')}`}></span><span className="break-words min-w-0">{it}</span></li>)}</ul>;
    }
    if (!text?.trim()) return null;
    return <p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{text}</p>;
  };

  const renderSection = (sec) => {
    if (sec.type === 'custom') {
      const c=(customSections||{})[sec.id];
      return <Card key={sec.id} accent={ACCENT} title={sec.label}>{body(c?.mode, c?.text, c?.items)}</Card>;
    }
    switch (sec.key) {
      case 'basics': return null;
      case 'summary': return summary ? <Card key="summary" accent={ACCENT} title="Profile"><p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{summary}</p></Card> : null;
      case 'skills': return skills?.length ? <Card key="skills" accent={ACCENT} title="Skills"><div className="flex flex-wrap gap-1.5">{(Array.isArray(skills)?skills:[skills]).map((s,i)=><span key={i} className="text-[10px] bg-indigo-50 text-indigo-800 rounded px-2 py-0.5 break-words">{s}</span>)}</div></Card> : null;
      case 'experience': return experience?.length ? (
        <Card key="experience" accent={ACCENT} title="Experience">
          <div className="space-y-2.5">{experience.map((e,i)=>(
            <div key={i} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-1 flex-wrap">
                <span className="text-[11.5px] font-semibold text-gray-900 break-words min-w-0">{e.position}</span>
                <span className="text-[9.5px] text-indigo-600 font-medium shrink-0 whitespace-nowrap">{e.duration}</span>
              </div>
              <div className="text-[10.5px] text-gray-500 mb-0.5 break-words">{e.company}{e.location?` · ${e.location}`:''}{e.employmentType?` · ${e.employmentType}`:''}</div>
              {e.summary&&<p className="text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words">{e.summary}</p>}
              {e.responsibilities?.length>0&&<ul className="space-y-1">{e.responsibilities.map((r,j)=><li key={j} className="flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid"><span className="mt-[5px] w-1 h-1 shrink-0 rounded-full bg-indigo-600"></span><span className="break-words min-w-0">{r}</span></li>)}</ul>}
            </div>
          ))}</div>
        </Card>) : null;
      case 'projects': return projects?.length ? (
        <Card key="projects" accent={ACCENT} title="Projects">
          <div className="space-y-2.5">{projects.map((p,i)=>(
            <div key={i} className="break-inside-avoid">
              <div className="flex items-baseline gap-x-2 flex-wrap"><span className="text-[11.5px] font-semibold text-gray-900 break-words min-w-0">{p.name}</span>{p.role&&<span className="text-[10px] text-gray-400 break-words">({p.role})</span>}</div>
              {p.technologies&&<div className="text-[10.5px] text-indigo-600 mb-0.5 break-words">Tech: {p.technologies}</div>}
              {(p.link||p.github)&&<div className="text-[9.5px] text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
              {p.description&&<p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{p.description}</p>}
            </div>
          ))}</div>
        </Card>) : null;
      case 'education': return education?.length ? (
        <Card key="education" accent={ACCENT} title="Education">
          <div className="space-y-2">{education.map((e,i)=>(
            <div key={i} className="break-inside-avoid">
              <div className="flex items-baseline justify-between gap-1 flex-wrap"><span className="text-[11.5px] font-semibold text-gray-900 break-words">{e.degree}</span><span className="text-[9.5px] text-indigo-600 font-medium shrink-0 whitespace-nowrap">{e.year}</span></div>
              <div className="text-[10.5px] text-gray-500 break-words">{e.institution}</div>
              {(e.gpa||e.details)&&<div className="text-[10px] text-gray-400 break-words">{[e.gpa,e.details].filter(Boolean).join(' — ')}</div>}
            </div>
          ))}</div>
        </Card>) : null;
      case 'certifications': return certifications?.length ? <Card key="certifications" accent={ACCENT} title="Certifications"><div className="space-y-0.5">{certifications.map((c,i)=><div key={i} className="text-[10.5px] text-gray-600 break-words break-inside-avoid">{c.name}{c.issuer?` — ${c.issuer}`:''}{c.year?` (${c.year})`:''}</div>)}</div></Card> : null;
      case 'achievements': return achievements?.length ? <Card key="achievements" accent={ACCENT} title="Achievements"><ul className="space-y-1">{achievements.map((a,i)=><li key={i} className="flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid"><span className="mt-[5px] w-1 h-1 shrink-0 rounded-full bg-indigo-600"></span><span className="break-words min-w-0">{a}</span></li>)}</ul></Card> : null;
      case 'languages': return languages?.length ? <Card key="languages" accent={ACCENT} title="Languages"><p className="text-[10.5px] text-gray-600 break-words">{languages.join('  ·  ')}</p></Card> : null;
      default: return null;
    }
  };

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  return (
    <div className="resume-template contemporary max-w-4xl mx-auto bg-white px-9 pt-3 font-sans overflow-hidden">
      {personalInfo&&(
        <div className="mb-3 pb-2">
          <h1 className="text-[24px] font-light tracking-tight text-gray-900 break-words">{personalInfo.fullName}</h1>
          {personalInfo.title&&<div className="text-[11px] text-indigo-700 font-medium mt-0.5 break-words">{personalInfo.title}</div>}
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-[9.5px] text-gray-500">
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
