import {
  BulletList,
  CertItem,
  CustomContent,
  educationTitle,
  hasCustomContent,
  labelOf,
} from './shared.jsx';

const Hmain = ({children}) => <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-900 mb-1.5 mt-1 break-after-avoid"><span className="w-6 h-0.5 bg-emerald-600 shrink-0 inline-block"></span><span className="break-words min-w-0">{children}</span></h3>;
const Hside = ({children}) => <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800 mb-1 break-after-avoid break-words">{children}</h4>;

export const EngineeringTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);
  const sideKeys = ['skills','certifications','languages','achievements'];

  // Custom/addable sections render exactly once, in the main column, in
  // sectionsConfig order. The side column is reserved for compact standards.
  const sideSections = activeSections.filter((s)=>s.type==='standard'&&sideKeys.includes(s.key));
  const mainSections = activeSections.filter((s)=>s.key!=='basics'&&!(s.type==='standard'&&sideKeys.includes(s.key)));

  const renderSide = (sec) => {
    switch (sec.key) {
      case 'skills': return skills?.length ? (<div key="skills" className="mb-4 break-after-avoid"><Hside>{labelOf(sec, 'Skills')}</Hside><div className="space-y-0.5">{(Array.isArray(skills)?skills:[skills]).map((s,i)=><div key={i} className="text-[10px] text-gray-700 leading-relaxed break-words break-inside-avoid">{s}</div>)}</div></div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications" className="mb-4 break-after-avoid"><Hside>{labelOf(sec, 'Certifications')}</Hside><div className="space-y-0.5">{certifications.map((c,i)=><CertItem key={i} cert={c} className="text-[10px] text-gray-700 leading-relaxed break-words break-inside-avoid" />)}</div></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages" className="mb-4 break-after-avoid"><Hside>{labelOf(sec, 'Languages')}</Hside><div className="space-y-0.5">{languages.map((l,i)=><div key={i} className="text-[10px] text-gray-700 break-words break-inside-avoid">{l}</div>)}</div></div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements" className="mb-4 break-after-avoid"><Hside>{labelOf(sec, 'Achievements')}</Hside><div className="space-y-0.5">{achievements.map((a,i)=><div key={i} className="text-[10px] text-gray-700 break-words break-inside-avoid">• {a}</div>)}</div></div>) : null;
      default: return null;
    }
  };

  const renderMain = (sec) => {
    const content = (customSections||{})[sec.id];
    if (sec.type === 'custom') {
      if (!hasCustomContent(content)) return null;
      return <div key={sec.id} className="mb-4 break-after-avoid"><Hmain>{labelOf(sec)}</Hmain><CustomContent content={content} /></div>;
    }
    switch (sec.key) {
      case 'summary': return summary ? (<div key="summary" className="mb-4"><Hmain>{labelOf(sec, 'Professional Summary')}</Hmain><p className="text-[10.5px] text-gray-700 leading-relaxed break-words">{summary}</p></div>) : null;
      case 'experience': return experience?.length ? (<div key="experience" className="mb-4"><Hmain>{labelOf(sec, 'Professional Experience')}</Hmain>{experience.map((e,i)=>(
        <div key={i} className="mb-3 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-1 flex-wrap">
            <span className="font-semibold text-gray-900 text-[11.5px] break-words min-w-0">{e.position}</span>
            <span className="text-[10px] text-emerald-700 font-medium shrink-0 whitespace-nowrap">{e.duration}</span>
          </div>
          <div className="text-[10.5px] text-gray-500 mb-0.5 break-words">{e.company}{e.location?` · ${e.location}`:''}{e.employmentType?` · ${e.employmentType}`:''}</div>
          {e.summary&&<p className="text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words">{e.summary}</p>}
          {e.responsibilities?.length>0&&<ul className="space-y-0.5 pl-3">{e.responsibilities.map((r,j)=><li key={j} className="text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid"><span className="text-emerald-600 mr-1">▸</span>{r}</li>)}</ul>}
        </div>))}</div>) : null;
      case 'projects': return projects?.length ? (<div key="projects" className="mb-4"><Hmain>{labelOf(sec, 'Projects')}</Hmain>{projects.map((p,i)=>(
        <div key={i} className="mb-2.5 break-inside-avoid">
          <div className="flex items-baseline gap-x-2 flex-wrap"><span className="font-semibold text-gray-900 text-[11.5px] break-words min-w-0">{p.name}</span>{p.role&&<span className="text-[10px] text-gray-400 break-words">({p.role})</span>}</div>
          {p.technologies&&<div className="text-[10.5px] text-emerald-700 mb-0.5 break-words">Tech: {p.technologies}</div>}
          {(p.link||p.github)&&<div className="text-[9.5px] text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
          {p.description&&<p className="text-[10.5px] text-gray-600 leading-relaxed break-words">{p.description}</p>}
          {p.highlights?.length>0&&<BulletList items={p.highlights} className="mt-0.5 space-y-0.5 pl-3" />}
        </div>))}</div>) : null;
      case 'education': return education?.length ? (<div key="education" className="mb-4"><Hmain>{labelOf(sec, 'Education')}</Hmain>{education.map((e,i)=>(
        <div key={i} className="mb-2 break-inside-avoid">
          <div className="flex items-baseline justify-between gap-1 flex-wrap"><span className="font-semibold text-gray-900 text-[11.5px] break-words">{educationTitle(e) || e.institution}</span><span className="text-[10px] text-emerald-700 font-medium shrink-0 whitespace-nowrap">{e.year}</span></div>
          <div className="text-[10.5px] text-gray-500 break-words">{e.institution}</div>
          {(e.gpa||e.details)&&<div className="text-[10px] text-gray-500 break-words">{[e.gpa,e.details].filter(Boolean).join(' — ')}</div>}
        </div>))}</div>) : null;
      default: {
        if (!hasCustomContent(content)) return null;
        return <div key={sec.id} className="mb-4 break-after-avoid"><Hmain>{labelOf(sec)}</Hmain><CustomContent content={content} /></div>;
      }
    }
  };

  return (
    <div className="resume-template engineering max-w-4xl mx-auto bg-white font-sans overflow-hidden">
      <div className="flex min-h-[1059px]">
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
        <div className="flex-1 min-w-0 px-7 py-6 space-y-1">
          {mainSections.map((s)=>renderMain(s))}
        </div>
      </div>
    </div>
  );
};
