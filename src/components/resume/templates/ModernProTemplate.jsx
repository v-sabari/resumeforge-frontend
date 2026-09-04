
const CustomBlock = ({ label, content, color }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const Bar = () => <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-800 mb-2 break-after-avoid"><span className={`h-2 w-2 rounded-sm ${color} shrink-0`}></span>{label}</h2>;
  if (mode === 'bullets') {
    if (!items?.filter(Boolean).length) return null;
    return <div className="mb-4">{Bar()}<ul className="space-y-1 pl-4">{items.filter(Boolean).map((it,i)=><li key={i} className="flex gap-2 text-[10.5px] text-gray-600 break-inside-avoid"><span className={`mt-[3px] h-1 w-1 shrink-0 rounded-full ${color}`}></span><span className="leading-relaxed break-words min-w-0">{it}</span></li>)}</ul></div>;
  }
  if (!text?.trim()) return null;
  return <div className="mb-4">{Bar()}<p className="text-[10.5px] text-gray-600 leading-relaxed break-words pl-4">{text}</p></div>;
};

export const ModernProTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const ACCENT = 'bg-blue-600';

  const SH = ({ children }) => <h2 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-800 mb-2 break-after-avoid"><span className={`h-2 w-2 rounded-sm ${ACCENT} shrink-0`}></span><span className="break-words min-w-0">{children}</span></h2>;

  const P = 'text-[10.5px] text-gray-600 leading-relaxed break-words';

  const renderSection = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]} color={ACCENT}/>;
    switch (sec.key) {
      case 'basics': return null;
      case 'summary': return summary ? <div key="summary" className="mb-4"><SH>Profile</SH><p className={P}>{summary}</p></div> : null;
      case 'experience': return experience?.length ? (
        <div key="experience" className="mb-4"><SH>Experience</SH>
          {experience.map((e,i)=>(
            <div key={i} className="mb-3 break-inside-avoid">
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <span className="font-semibold text-gray-900 text-[11px] break-words min-w-0">{e.position}</span>
                <span className="text-[9.5px] text-gray-400 whitespace-nowrap shrink-0">{e.duration}</span>
              </div>
              <div className="text-[10px] text-gray-500 mb-0.5 break-words">{e.company}{e.location?` · ${e.location}`:''}{e.employmentType?` · ${e.employmentType}`:''}</div>
              {e.summary&&<p className="text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words">{e.summary}</p>}
              {e.responsibilities?.length>0&&<ul className="space-y-0.5 pl-3">{e.responsibilities.map((r,j)=><li key={j} className="flex gap-2 text-[10.5px] text-gray-600 break-inside-avoid"><span className={`mt-[3px] h-1 w-1 shrink-0 rounded-full ${ACCENT}`}></span><span className="leading-relaxed break-words min-w-0">{r}</span></li>)}</ul>}
            </div>
          ))}
        </div>) : null;
      case 'skills': return skills?.length ? (
        <div key="skills" className="mb-4"><SH>Skills</SH>
          <div className="flex flex-wrap gap-1 pl-4">
            {(Array.isArray(skills)?skills:[skills]).map((s,i)=><span key={i} className="text-[10px] text-gray-700 border border-gray-200 rounded px-1.5 py-0.5 break-words">{s}</span>)}
          </div>
        </div>) : null;
      case 'projects': return projects?.length ? (
        <div key="projects" className="mb-4"><SH>Projects</SH>
          <div className="pl-4 space-y-3">{projects.map((p,i)=>(
            <div key={i} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline gap-x-2"><span className="font-semibold text-gray-900 text-[11px] break-words min-w-0">{p.name}</span>{p.role&&<span className="text-[9.5px] text-gray-400 break-words">({p.role})</span>}</div>
              {p.technologies&&<div className="text-[10px] text-gray-500 mb-0.5 break-words">Tech: {p.technologies}</div>}
              {(p.link||p.github)&&<div className="text-[9px] text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
              {p.description&&<p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{p.description}</p>}
            </div>
          ))}</div>
        </div>) : null;
      case 'education': return education?.length ? (
        <div key="education" className="mb-4"><SH>Education</SH>
          <div className="pl-4 space-y-2">{education.map((e,i)=>(
            <div key={i} className="break-inside-avoid">
              <div className="flex justify-between items-baseline flex-wrap gap-1"><span className="font-semibold text-gray-900 text-[11px] break-words">{e.degree}</span><span className="text-[9.5px] text-gray-400 shrink-0 whitespace-nowrap">{e.year}</span></div>
              <div className="text-[10px] text-gray-500 break-words">{e.institution}</div>
              {(e.gpa||e.details)&&<div className="text-[9.5px] text-gray-400 break-words">{[e.gpa,e.details].filter(Boolean).join(' — ')}</div>}
            </div>
          ))}</div>
        </div>) : null;
      case 'certifications': return certifications?.length ? (
        <div key="certifications" className="mb-4"><SH>Certifications</SH><div className="pl-4 space-y-1">{certifications.map((c,i)=><div key={i} className="text-[10px] text-gray-600 break-words break-inside-avoid"><span className="font-medium">{c.name}</span>{c.issuer&&<span className="text-gray-500"> — {c.issuer}</span>}{c.year&&<span className="text-gray-400"> ({c.year})</span>}</div>)}</div></div>) : null;
      case 'achievements': return achievements?.length ? (
        <div key="achievements" className="mb-4"><SH>Achievements</SH><ul className="space-y-1 pl-4">{achievements.map((a,i)=><li key={i} className="flex gap-2 text-[10.5px] text-gray-600 break-inside-avoid"><span className={`mt-[3px] h-1 w-1 shrink-0 rounded-full ${ACCENT}`}></span><span className="leading-relaxed break-words min-w-0">{a}</span></li>)}</ul></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages" className="mb-4"><SH>Languages</SH><p className={P}>{languages.join('  ·  ')}</p></div>) : null;
      default: return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]} color={ACCENT}/>;
    }
  };

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  return (
    <div className="resume-template modern max-w-4xl mx-auto bg-white px-8 pt-2 font-sans overflow-hidden">
      {personalInfo&&(
        <div className="mb-4 pb-3 border-b border-gray-200">
          <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight break-words">{personalInfo.fullName}</h1>
          {personalInfo.title&&<div className="text-[11px] text-blue-700 font-medium mb-1 break-words">{personalInfo.title}</div>}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[9.5px] text-gray-500">
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
