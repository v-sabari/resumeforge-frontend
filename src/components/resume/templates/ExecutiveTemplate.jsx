const CustomBlock = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const SH = ({children}) => <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-800 border-b-[3px] border-slate-800 pb-1 mb-2 mt-5 break-after-avoid">{children}</h2>;
  if (mode === 'bullets') {
    if (!items?.filter(Boolean).length) return null;
    return <div><SH>{label}</SH><ul className="space-y-1">{items.filter(Boolean).map((it,i)=><li key={i} className="text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid">{it}</li>)}</ul></div>;
  }
  if (!text?.trim()) return null;
  return <div><SH>{label}</SH><p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{text}</p></div>;
};

export const ExecutiveTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const SH = ({children}) => <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-800 border-b-[3px] border-slate-800 pb-1 mb-2 mt-5 break-after-avoid">{children}</h2>;

  const renderSection = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'basics': return null;
      case 'summary': return summary ? (
        <div key="summary" className="mt-4 bg-slate-50 border-l-4 border-slate-800 py-2 px-3">
          <p className="text-[11px] text-slate-800 italic font-medium leading-relaxed break-words">{summary}</p>
        </div>) : null;
      case 'experience': return experience?.length ? (<div key="experience"><SH>Professional Experience</SH>{experience.map((e,i)=>(
        <div key={i} className="mb-3.5 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <span className="text-[12px] font-bold text-slate-900 break-words min-w-0">{e.position}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wide shrink-0 whitespace-nowrap">{e.duration}</span>
          </div>
          <div className="text-[11px] text-slate-600 font-medium mb-1 break-words">{e.company}{e.location?` | ${e.location}`:''}{e.employmentType?` | ${e.employmentType}`:''}</div>
          {e.summary&&<p className="text-[10.5px] text-gray-600 mb-1 leading-relaxed break-words">{e.summary}</p>}
          {e.responsibilities?.length>0&&<ul className="space-y-0.5">{e.responsibilities.map((r,j)=><li key={j} className="text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid">{r}</li>)}</ul>}
        </div>))}</div>) : null;
      case 'skills': return skills?.length ? (<div key="skills"><SH>Core Competencies</SH><div className="flex flex-wrap gap-1.5">{(Array.isArray(skills)?skills:[skills]).map((s,i)=><span key={i} className="text-[10px] border border-slate-300 text-slate-700 px-2 py-0.5 break-words">{s}</span>)}</div></div>) : null;
      case 'projects': return projects?.length ? (<div key="projects"><SH>Selected Projects</SH>{projects.map((p,i)=>(
        <div key={i} className="mb-2.5 break-inside-avoid">
          <div className="flex items-baseline gap-x-2 flex-wrap"><span className="text-[11.5px] font-bold text-slate-900 break-words min-w-0">{p.name}</span>{p.role&&<span className="text-[10px] text-gray-400 break-words">({p.role})</span>}</div>
          {p.technologies&&<div className="text-[10.5px] text-slate-600 mb-0.5 break-words">Tech: {p.technologies}</div>}
          {(p.link||p.github)&&<div className="text-[9.5px] text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
          {p.description&&<p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{p.description}</p>}
        </div>))}</div>) : null;
      case 'education': return education?.length ? (<div key="education"><SH>Education</SH>{education.map((e,i)=>(
        <div key={i} className="mb-2 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-1 flex-wrap"><span className="text-[11.5px] font-bold text-slate-900 break-words">{e.degree}</span><span className="text-[10px] text-gray-400 uppercase tracking-wide shrink-0 whitespace-nowrap">{e.year}</span></div>
          <div className="text-[10.5px] text-slate-600 break-words">{e.institution}</div>
          {(e.gpa||e.details)&&<div className="text-[10px] text-gray-500 break-words">{[e.gpa,e.details].filter(Boolean).join(' — ')}</div>}
        </div>))}</div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications"><SH>Certifications</SH><div className="space-y-0.5">{certifications.map((c,i)=><div key={i} className="text-[10.5px] text-gray-600 break-words break-inside-avoid">{c.name}{c.issuer?` — ${c.issuer}`:''}{c.year?` (${c.year})`:''}</div>)}</div></div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements"><SH>Achievements</SH><ul className="space-y-0.5">{achievements.map((a,i)=><li key={i} className="text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid">{a}</li>)}</ul></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages"><SH>Languages</SH><p className="text-[10.5px] text-gray-600 break-words">{languages.join('  ·  ')}</p></div>) : null;
      default: return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    }
  };

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  return (
    <div className="resume-template executive max-w-4xl mx-auto bg-white px-8 pt-2 font-sans overflow-hidden">
      {personalInfo&&(
        <div className="mb-2">
          <div className="flex items-center gap-4 border-b-[3px] border-slate-800 pb-2">
            <span className="h-10 w-1.5 shrink-0 bg-slate-800 self-stretch"></span>
            <div className="min-w-0">
              <h1 className="text-[26px] font-bold text-slate-900 uppercase tracking-[0.08em] break-words">{personalInfo.fullName}</h1>
              {personalInfo.title&&<div className="text-[13px] text-slate-500 uppercase tracking-[0.14em] mt-0.5 break-words">{personalInfo.title}</div>}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-[10px] uppercase tracking-wide text-gray-500">
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
