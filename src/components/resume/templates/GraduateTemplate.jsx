import {
  BulletList,
  CertItem,
  CustomContent,
  educationTitle,
  hasCustomContent,
  labelOf,
} from './shared.jsx';

const SH = ({children}) => <h2 className="text-[11.5px] font-bold uppercase tracking-[0.18em] text-indigo-700 mb-1.5 mt-3 break-after-avoid">{children}</h2>;

const CustomBlock = ({ label, content }) => {
  if (!hasCustomContent(content)) return null;
  return <div><SH>{label}</SH><CustomContent content={content} /></div>;
};

export const GraduateTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  const renderMain = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={labelOf(sec)} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'experience': return experience?.length ? (<div key="experience"><SH>{labelOf(sec, 'Experience')}</SH>{experience.map((e,i)=>(
        <div key={i} className="mb-2.5 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <span className="text-[12px] font-bold text-gray-900 break-words min-w-0">{e.position}</span>
            <span className="text-[10.5px] text-gray-400 whitespace-nowrap shrink-0">{e.duration}</span>
          </div>
          <div className="text-[11px] text-indigo-700 font-medium mb-0.5 break-words">{e.company}{e.location?` · ${e.location}`:''}{e.employmentType?` · ${e.employmentType}`:''}</div>
          {e.summary&&<p className="text-[11px] text-gray-600 mb-0.5 leading-relaxed break-words">{e.summary}</p>}
          {e.responsibilities?.length>0&&<ul className="space-y-0.5 pl-3">{e.responsibilities.map((r,j)=><li key={j} className="text-[11px] text-gray-700 leading-relaxed break-words break-inside-avoid" style={{listStyle:'disc'}}>{r}</li>)}</ul>}
        </div>))}</div>) : null;
      case 'projects': return projects?.length ? (<div key="projects"><SH>{labelOf(sec, 'Projects')}</SH>{projects.map((p,i)=>(
        <div key={i} className="mb-2.5 break-inside-avoid">
          <div className="flex items-baseline gap-x-2 flex-wrap"><span className="text-[12px] font-bold text-gray-900 break-words min-w-0">{p.name}</span>{p.role&&<span className="text-[10.5px] text-gray-400 break-words">({p.role})</span>}</div>
          {p.technologies&&<div className="text-[11px] text-indigo-700 mb-0.5 break-words">Tech: {p.technologies}</div>}
          {(p.link||p.github)&&<div className="text-[10px] text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
          {p.description&&<p className="text-[11px] text-gray-600 leading-relaxed break-words">{p.description}</p>}
          {p.highlights?.length>0&&<BulletList items={p.highlights} className="mt-0.5 space-y-0.5 pl-3" />}
        </div>))}</div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements"><SH>{labelOf(sec, 'Achievements')}</SH><ul className="space-y-0.5">{achievements.map((a,i)=><li key={i} className="text-[11px] text-gray-700 leading-relaxed break-words break-inside-avoid">✓ {a}</li>)}</ul></div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications"><SH>{labelOf(sec, 'Certifications')}</SH><div className="space-y-0.5">{certifications.map((c,i)=><CertItem key={i} cert={c} className="text-[11px] text-gray-700 break-words break-inside-avoid" />)}</div></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages"><SH>{labelOf(sec, 'Languages')}</SH><p className="text-[11px] text-gray-700 break-words">{languages.join('  ·  ')}</p></div>) : null;
      default: {
        const content = (customSections||{})[sec.id];
        if (!content) return null;
        return <CustomBlock key={sec.id} label={labelOf(sec)} content={content} />;
      }
    }
  };

  return (
    <div className="resume-template graduate max-w-4xl mx-auto bg-white px-8 pt-3 font-sans overflow-hidden">
      {personalInfo&&(
        <div className="text-center mb-3">
          <h1 className="text-[24.5px] font-bold tracking-tight text-gray-900 break-words">{personalInfo.fullName}</h1>
          {personalInfo.title&&<div className="text-[12.5px] text-indigo-700 font-medium mt-0.5 break-words">{personalInfo.title}</div>}
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1 text-[10.5px] text-gray-500">
            {personalInfo.email&&<span className="break-all">{personalInfo.email}</span>}
            {personalInfo.phone&&<span className="break-words">{personalInfo.phone}</span>}
            {personalInfo.location&&<span className="break-words">{personalInfo.location}</span>}
            {personalInfo.linkedin&&<span className="break-all">{personalInfo.linkedin}</span>}
            {personalInfo.github&&<span className="break-all">{personalInfo.github}</span>}
            {personalInfo.portfolio&&<span className="break-all">{personalInfo.portfolio}</span>}
          </div>
        </div>
      )}

      {activeSections.filter((s)=>s.key!=='basics').map((sec)=>{
        if (sec.type === 'standard' && sec.key === 'summary') {
          return summary ? (
            <div key="summary" className="bg-indigo-50 rounded px-4 py-2.5 mb-3">
              <SH>{labelOf(sec, 'Summary')}</SH>
              <p className="text-[11px] text-indigo-900 leading-relaxed break-words whitespace-pre-line">{summary}</p>
            </div>
          ) : null;
        }
        if (sec.type === 'standard' && sec.key === 'education') {
          return education?.length ? (
            <div key="education"><SH>{labelOf(sec, 'Education')}</SH>{education.map((e,i)=>(
              <div key={i} className="mb-2.5 break-inside-avoid">
                <div className="flex items-baseline justify-between gap-1 flex-wrap">
                  <span className="text-[12px] font-bold text-gray-900 break-words">{educationTitle(e) || e.institution}</span>
                  <span className="text-[10.5px] text-gray-400 whitespace-nowrap shrink-0">{e.year}</span>
                </div>
                <div className="text-[11px] text-indigo-700 font-medium mb-0.5 break-words">{e.institution}</div>
                {(e.gpa||e.details)&&<div className="text-[11px] text-gray-600 break-words">{[e.gpa,e.details].filter(Boolean).join(' — ')}</div>}
              </div>))}</div>
          ) : null;
        }
        if (sec.type === 'standard' && sec.key === 'skills') {
          return skills?.length ? (
            <div key="skills"><SH>{labelOf(sec, 'Skills')}</SH>
              <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 pl-1">
                {(Array.isArray(skills)?skills:[skills]).map((s,i)=><div key={i} className="text-[11px] text-gray-700 leading-relaxed break-words break-inside-avoid">{s}</div>)}
              </div>
            </div>
          ) : null;
        }
        return renderMain(sec);
      })}
    </div>
  );
};
