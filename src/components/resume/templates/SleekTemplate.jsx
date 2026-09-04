
/* Custom section block shared by all external templates */
const CustomBlock = ({ label, content, headingClass, bodyClass, bulletClass }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === 'bullets') {
    if (!items || !items.filter(Boolean).length) return null;
    return (
      <div className="mb-6">
        <h2 className={headingClass}>{label}</h2>
        <ul className="space-y-1">
          {items.filter(Boolean).map((it, i) => (
            <li key={i} className={`flex items-start break-inside-avoid ${bodyClass}`}>
              <span className={`mr-2 shrink-0 ${bulletClass}`}>▸</span>
              <span className="leading-relaxed break-words min-w-0">{it}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (!text || !text.trim()) return null;
  return (
    <div className="mb-6">
      <h2 className={headingClass}>{label}</h2>
      <p className={`${bodyClass} leading-relaxed break-words`}>{text}</p>
    </div>
  );
};

export const SleekTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const H = 'text-sm font-semibold text-gray-700 mb-2 pb-1 border-b border-gray-100 uppercase tracking-[0.2em] break-after-avoid bg-gray-50 px-3 py-1 rounded';
  const B = 'text-gray-700 text-sm';
  const BL = 'text-gray-400';

  const renderSection = (sec) => {
    if (sec.type === 'custom') {
      return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]} headingClass={H} bodyClass={B} bulletClass={BL}/>;
    }
    switch (sec.key) {
      case 'basics': return null;
      case 'summary': return summary ? (
        <div key="summary" className="mb-6"><h2 className={H}>Professional Summary</h2><p className={`${B} leading-relaxed break-words`}>{summary}</p></div>
      ) : null;
      case 'experience': return experience?.length ? (
        <div key="experience" className="mb-6">
          <h2 className={H}>Professional Experience</h2>
          {experience.map((exp,i)=>(
            <div key={i} className="mb-5 break-inside-avoid">
              <div className="flex justify-between items-start flex-wrap gap-1 mb-1">
                <h3 className="font-bold text-gray-900 break-words min-w-0">{exp.position}</h3>
                <span className="text-sm text-gray-500 whitespace-nowrap shrink-0">{exp.duration}</span>
              </div>
              <div className="text-sm text-gray-700 mb-1 break-words">{exp.company}{exp.location?` · ${exp.location}`:''}{exp.employmentType?` · ${exp.employmentType}`:''}</div>
              {exp.summary&&<p className="text-sm text-gray-600 mb-1 leading-relaxed break-words">{exp.summary}</p>}
              {exp.responsibilities?.length>0&&<ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">{exp.responsibilities.map((r,j)=><li key={j} className="leading-relaxed break-words break-inside-avoid">{r}</li>)}</ul>}
            </div>
          ))}
        </div>
      ) : null;
      case 'projects': return projects?.length ? (
        <div key="projects" className="mb-6">
          <h2 className={H}>Projects</h2>
          {projects.map((p,i)=>(
            <div key={i} className="mb-4 break-inside-avoid">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5">
                <h3 className="font-bold text-gray-900 break-words min-w-0">{p.name}</h3>
                {p.role&&<span className="text-sm text-gray-500 break-words">({p.role})</span>}
              </div>
              {p.technologies&&<div className="text-sm text-gray-600 mb-0.5 break-words">Tech: {p.technologies}</div>}
              {(p.link||p.github)&&<div className="text-xs text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join('  ·  ')}</div>}
              {p.description&&<p className="text-gray-700 text-sm leading-relaxed break-words">{p.description}</p>}
              {p.highlights?.length>0&&<ul className="list-disc list-inside mt-1 space-y-1 text-gray-700 text-sm">{p.highlights.map((h,j)=><li key={j} className="break-words break-inside-avoid">{h}</li>)}</ul>}
            </div>
          ))}
        </div>
      ) : null;
      case 'education': return education?.length ? (
        <div key="education" className="mb-6">
          <h2 className={H}>Education</h2>
          {education.map((e,i)=>(
            <div key={i} className="mb-3 break-inside-avoid">
              <div className="flex justify-between items-start flex-wrap gap-1">
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 break-words">{e.degree}{e.field?` in ${e.field}`:''}</h3>
                  <div className="text-gray-700 text-sm break-words">{e.institution}</div>
                  {e.gpa&&<div className="text-xs text-gray-500 break-words">Grade: {e.gpa}</div>}
                  {e.details&&<div className="text-xs text-gray-500 mt-0.5 break-words">{e.details}</div>}
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap shrink-0">{e.year}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null;
      case 'skills': return skills?.length ? (
        <div key="skills" className="mb-6">
          <h2 className={H}>Skills</h2>
          <div className="space-y-0.5">
            {(Array.isArray(skills) ? skills : [skills]).map((s, i) => (
              <p key={i} className={`${B} break-words`}>{s}</p>
            ))}
          </div>
        </div>
      ) : null;
      case 'achievements': return achievements?.length ? (
        <div key="achievements" className="mb-6"><h2 className={H}>Achievements</h2><ul className="space-y-1.5">{achievements.map((a,i)=><li key={i} className={`flex items-start break-inside-avoid ${B}`}><span className={`font-bold mr-2 shrink-0 ${BL}`}>▸</span><span className="leading-relaxed break-words min-w-0">{a}</span></li>)}</ul></div>
      ) : null;
      case 'languages': return languages?.length ? (
        <div key="languages" className="mb-6"><h2 className={H}>Languages</h2><div className="text-gray-700 text-sm break-words">{languages.join(' · ')}</div></div>
      ) : null;
      case 'certifications': return certifications?.length ? (
        <div key="certifications" className="mb-6"><h2 className={H}>Certifications</h2>{certifications.map((c,i)=><div key={i} className="mb-1.5 text-sm text-gray-700 break-words"><span className="font-medium">{c.name}</span>{c.issuer&&<span className="text-gray-600"> — {c.issuer}</span>}{c.year&&<span className="text-gray-500"> ({c.year})</span>}{c.credentialUrl&&<span className="block text-xs text-gray-400 break-all">{c.credentialUrl}</span>}</div>)}</div>
      ) : null;
      default:
        return <CustomBlock key={sec.id} label={sec.label} content={(customSections||{})[sec.id]} headingClass={H} bodyClass={B} bulletClass={BL}/>;
    }
  };

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  return (
    <div className="resume-template sleek max-w-4xl mx-auto bg-white px-8 font-sans overflow-hidden">
      {personalInfo && (
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1 break-words tracking-[0.2em]">{personalInfo.fullName}</h1>
          {personalInfo.title&&<div className="text-base text-gray-500 font-light mb-2 break-words tracking-[0.15em] uppercase">{personalInfo.title}</div>}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
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
