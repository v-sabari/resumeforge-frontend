
const CustomBlock = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400 border-b border-gray-100 pb-0.5 mb-2 mt-5 break-after-avoid">{label}</div>;
  if (mode === 'bullets') {
    if (!items?.filter(Boolean).length) return null;
    return <>{H}<ul className="space-y-1">{items.filter(Boolean).map((it,i)=><li key={i} className="flex gap-2 text-xs text-gray-500 break-inside-avoid"><span className="text-gray-200 shrink-0 mt-0.5">–</span><span className="break-words min-w-0">{it}</span></li>)}</ul></>;
  }
  if (!text?.trim()) return null;
  return <>{H}<p className="text-xs text-gray-500 leading-relaxed break-words">{text}</p></>;
};

export const CleanTemplate = ({ data }) => {
  const { sectionsConfig, personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages, customSections } = data;

  const SH = ({ children }) => <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400 border-b border-gray-100 pb-0.5 mb-2 mt-5 first:mt-0 break-after-avoid">{children}</div>;

  const renderSection = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'basics': return null;
      case 'summary': return summary ? (<div key="summary"><SH>Profile</SH><p className="text-gray-500 leading-relaxed text-xs break-words">{summary}</p></div>) : null;
      case 'experience': return experience?.length ? (
        <div key="experience"><SH>Experience</SH>
          <div className="space-y-4">{experience.map((e,i)=>(
            <div key={i} className="break-inside-avoid">
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <span className="font-semibold text-gray-900 text-sm break-words min-w-0">{e.position}</span>
                <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{e.duration}</span>
              </div>
              <div className="text-xs text-gray-400 mb-1 break-words">{e.company}{e.location?`, ${e.location}`:''}{e.employmentType?` · ${e.employmentType}`:''}</div>
              {e.summary&&<p className="text-xs text-gray-500 mb-1 leading-relaxed break-words">{e.summary}</p>}
              {e.responsibilities?.length>0&&<ul className="space-y-0.5">{e.responsibilities.map((r,j)=><li key={j} className="flex gap-2 text-gray-500 text-xs break-inside-avoid"><span className="text-gray-200 shrink-0 mt-0.5">–</span><span className="break-words min-w-0">{r}</span></li>)}</ul>}
            </div>
          ))}</div>
        </div>) : null;
      case 'skills': return skills?.length ? (
        <div key="skills">
          <SH>Skills</SH>
          <div className="flex flex-wrap gap-1.5">
            {(Array.isArray(skills) ? skills : [skills]).map((s, i) => (
              <span key={i} className="text-gray-600 text-xs rounded-full bg-gray-50 px-3 py-0.5 break-words">{s}</span>
            ))}
          </div>
        </div>
      ) : null;
      case 'projects': return projects?.length ? (
        <div key="projects"><SH>Projects</SH>
          <div className="space-y-3">{projects.map((p,i)=>(
            <div key={i} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5">
                <span className="font-semibold text-gray-900 text-sm break-words min-w-0">{p.name}</span>
                {p.role&&<span className="text-xs text-gray-400 break-words">({p.role})</span>}
              </div>
              {p.technologies&&<div className="text-xs text-gray-400 mb-0.5 break-words">Tech: {p.technologies}</div>}
              {(p.link||p.github)&&<div className="text-xs text-gray-300 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join('  ·  ')}</div>}
              {p.description&&<p className="text-xs text-gray-500 leading-relaxed break-words">{p.description}</p>}
              {p.highlights?.length>0&&<ul className="mt-0.5 space-y-0.5">{p.highlights.map((h,j)=><li key={j} className="flex gap-2 text-xs text-gray-500 break-inside-avoid"><span className="text-gray-200 shrink-0 mt-0.5">–</span><span className="break-words min-w-0">{h}</span></li>)}</ul>}
            </div>
          ))}</div>
        </div>) : null;
      case 'education': return education?.length ? (
        <div key="education"><SH>Education</SH>
          <div className="space-y-2">{education.map((e,i)=>(
            <div key={i} className="break-inside-avoid">
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <div className="min-w-0"><span className="font-semibold text-gray-900 text-sm break-words">{e.degree}</span>{e.field&&<span className="text-gray-400 text-sm break-words"> in {e.field}</span>}</div>
                <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{e.year}</span>
              </div>
              {e.institution&&<div className="text-xs text-gray-400 break-words">{e.institution}</div>}
              {e.gpa&&<div className="text-xs text-gray-300 break-words">Grade: {e.gpa}</div>}
              {e.details&&<div className="text-xs text-gray-300 mt-0.5 leading-relaxed break-words">{e.details}</div>}
            </div>
          ))}</div>
        </div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements"><SH>Achievements</SH><ul className="space-y-1">{achievements.map((a,i)=><li key={i} className="flex gap-2 text-xs text-gray-500 break-inside-avoid"><span className="text-gray-200 shrink-0 mt-0.5">–</span><span className="break-words min-w-0">{a}</span></li>)}</ul></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages"><SH>Languages</SH><p className="text-xs text-gray-500 break-words">{languages.join('  ·  ')}</p></div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications"><SH>Certifications</SH><div className="space-y-1">{certifications.map((c,i)=><div key={i} className="text-xs text-gray-500 break-words break-inside-avoid"><span className="font-medium">{c.name}</span>{c.issuer&&<span className="text-gray-400"> — {c.issuer}</span>}{c.year&&<span className="text-gray-300"> ({c.year})</span>}</div>)}</div></div>) : null;
      default: return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]}/>;
    }
  };

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  return (
    <div className="resume-template clean max-w-4xl mx-auto bg-white px-12 font-sans text-sm text-gray-800 overflow-hidden">
      {personalInfo&&(
        <div className="mb-5">
          <h1 className="text-2xl font-light tracking-tight text-gray-900 mb-0.5 break-words">{personalInfo.fullName}</h1>
          {personalInfo.title&&<div className="text-sm text-gray-400 mb-1.5 break-words">{personalInfo.title}</div>}
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-400">
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
