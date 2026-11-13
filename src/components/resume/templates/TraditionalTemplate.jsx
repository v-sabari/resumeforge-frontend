import {
  BulletList,
  CertItem,
  CustomContent,
  educationTitle,
  hasCustomContent,
  labelOf,
} from './shared.jsx';

const MainHead = ({ children }) => <h3 className="text-[12.5px] font-bold uppercase tracking-wide border-b border-gray-700 pb-0.5 mb-1.5 break-after-avoid break-words">{children}</h3>;
const SideHead = ({ children }) => <h4 className="text-[11.5px] font-bold uppercase tracking-wide border-b border-gray-500 pb-0.5 mb-1 break-after-avoid break-words">{children}</h4>;

export const TraditionalTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);
  const sideKeys = ['skills','languages','certifications','achievements'];

  // Side column owns only the compact standard sections. Every custom and
  // addable section is rendered once, in the main column, in the user's
  // sectionsConfig order — never duplicated across both columns.
  const sideSections = activeSections.filter((s)=>s.type==='standard'&&sideKeys.includes(s.key));
  const mainSections = activeSections.filter((s)=>s.key!=='basics'&&!(s.type==='standard'&&sideKeys.includes(s.key)));

  const renderMain = (sec) => {
    const content = (customSections||{})[sec.id];
    if (sec.type === 'custom') {
      if (!hasCustomContent(content)) return null;
      return <div key={sec.id} className="mb-4 break-after-avoid"><MainHead>{labelOf(sec)}</MainHead><CustomContent content={content} /></div>;
    }
    switch (sec.key) {
      case 'summary': return summary ? <div key="summary" className="mb-4"><MainHead>{labelOf(sec, 'Summary')}</MainHead><p className="text-[11px] leading-relaxed break-words">{summary}</p></div> : null;
      case 'experience': return experience?.length ? (<div key="experience" className="mb-4"><MainHead>{labelOf(sec, 'Professional Experience')}</MainHead>{experience.map((e,i)=>(
        <div key={i} className="mb-2.5 break-inside-avoid">
          <div className="flex flex-wrap items-baseline justify-between gap-1">
            <span className="font-bold text-[11.5px] break-words min-w-0">{e.position}</span>
            <span className="text-[10px] italic whitespace-nowrap shrink-0">{e.duration}</span>
          </div>
          <div className="text-[10.5px] italic mb-0.5 break-words">{e.company}{e.location?`, ${e.location}`:''}{e.employmentType?` (${e.employmentType})`:''}</div>
          {e.summary&&<p className="text-[11px] mb-0.5 leading-relaxed break-words">{e.summary}</p>}
          {e.responsibilities?.length>0&&<div className="pl-3">{e.responsibilities.map((r,j)=><div key={j} className="text-[11px] leading-relaxed break-words break-inside-avoid">• {r}</div>)}</div>}
        </div>))}</div>) : null;
      case 'projects': return projects?.length ? (<div key="projects" className="mb-4"><MainHead>{labelOf(sec, 'Projects')}</MainHead>{projects.map((p,i)=>(
        <div key={i} className="mb-2 break-inside-avoid">
          <div className="flex flex-wrap items-baseline gap-x-2"><span className="font-bold text-[11.5px] break-words min-w-0">{p.name}</span>{p.role&&<span className="text-[10.5px] italic break-words">({p.role})</span>}</div>
          {p.technologies&&<div className="text-[10.5px] mb-0.5 break-words">Tech: {p.technologies}</div>}
          {(p.link||p.github)&&<div className="text-[9.5px] break-all mb-0.5">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
          {p.description&&<p className="text-[11px] leading-relaxed break-words">{p.description}</p>}
          {p.highlights?.length>0&&<BulletList items={p.highlights} className="mt-0.5 space-y-0.5 pl-3" itemClassName="text-[11px] leading-relaxed break-words break-inside-avoid" marker="" />}
        </div>))}</div>) : null;
      case 'education': return education?.length ? (<div key="education" className="mb-4"><MainHead>{labelOf(sec, 'Education')}</MainHead>{education.map((e,i)=>(
        <div key={i} className="mb-1.5 break-inside-avoid">
          <div className="flex flex-wrap items-baseline justify-between gap-1"><span className="font-bold text-[11.5px] break-words">{educationTitle(e) || e.institution}</span><span className="text-[10px] italic shrink-0 whitespace-nowrap">{e.year}</span></div>
          <div className="text-[10.5px] italic break-words">{e.institution}</div>
          {(e.gpa||e.details)&&<div className="text-[10px] break-words">{[e.details,e.gpa].filter(Boolean).join(' — ')}</div>}
        </div>))}</div>) : null;
      default: {
        if (!hasCustomContent(content)) return null;
        return <div key={sec.id} className="mb-4 break-after-avoid"><MainHead>{labelOf(sec)}</MainHead><CustomContent content={content} /></div>;
      }
    }
  };

  const renderSide = (sec) => {
    switch (sec.key) {
      case 'skills': return skills?.length ? (<div key="skills" className="mb-3 break-after-avoid"><SideHead>{labelOf(sec, 'Skills')}</SideHead><div className="space-y-0.5">{(Array.isArray(skills)?skills:[skills]).map((s,i)=><div key={i} className="text-[10.5px] leading-relaxed break-words break-inside-avoid">{s}</div>)}</div></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages" className="mb-3 break-after-avoid"><SideHead>{labelOf(sec, 'Languages')}</SideHead><div className="space-y-0.5">{languages.map((l,i)=><div key={i} className="text-[10.5px] leading-relaxed break-words break-inside-avoid">{l}</div>)}</div></div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications" className="mb-3 break-after-avoid"><SideHead>{labelOf(sec, 'Certifications')}</SideHead><div className="space-y-0.5">{certifications.map((c,i)=><CertItem key={i} cert={c} className="text-[10.5px] leading-relaxed break-words break-inside-avoid" />)}</div></div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements" className="mb-3 break-after-avoid"><SideHead>{labelOf(sec, 'Achievements')}</SideHead><ul className="space-y-0.5">{achievements.map((a,i)=><li key={i} className="text-[10.5px] leading-relaxed break-words break-inside-avoid">• {a}</li>)}</ul></div>) : null;
      default: return null;
    }
  };

  return (
    <div className="resume-template traditional max-w-4xl mx-auto bg-white font-serif text-gray-900 overflow-hidden">
      <div className="flex min-h-[1075px]">
        <div className="w-[34%] shrink-0 bg-gray-100 px-5 py-6">
          {personalInfo&&(
            <div className="mb-5 break-after-avoid">
              <h1 className="text-[20.5px] font-bold leading-tight break-words">{personalInfo.fullName}</h1>
              {personalInfo.title&&<div className="text-[11.5px] italic mt-0.5 mb-2 break-words">{personalInfo.title}</div>}
              <div className="space-y-1 text-[10px]">
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
        <div className="flex-1 min-w-0 px-6 py-6">
          {mainSections.map((s)=>renderMain(s))}
        </div>
      </div>
    </div>
  );
};
