import {
  BulletList,
  CertItem,
  CustomContent,
  educationTitle,
  hasCustomContent,
  labelOf,
} from './shared.jsx';

const SH = ({ children }) => <h2 className="text-[9.5px] uppercase tracking-[0.35em] text-gray-400 mb-1.5 break-after-avoid">{children}</h2>;

const CustomBlock = ({ label, content }) => {
  if (!hasCustomContent(content)) return null;
  return <div className="mb-5 break-after-avoid"><SH>{label}</SH><CustomContent content={content} /></div>;
};

export const MinimalATSTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const renderSection = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={labelOf(sec)} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'basics': return null;
      case 'summary': return summary ? <div key="summary" className="mb-5"><SH>{labelOf(sec, 'About')}</SH><p className="text-[11.5px] text-gray-700 leading-loose break-words">{summary}</p></div> : null;
      case 'experience': return experience?.length ? (<div key="experience" className="mb-5"><SH>{labelOf(sec, 'Experience')}</SH>{experience.map((e,i)=>(
        <div key={i} className="mb-4 break-inside-avoid">
          <div className="flex justify-between items-baseline flex-wrap gap-1">
            <span className="text-[12.5px] font-medium text-gray-900 break-words min-w-0">{e.position}</span>
            <span className="text-[10.5px] text-gray-400 whitespace-nowrap shrink-0">{e.duration}</span>
          </div>
          <div className="text-[11px] text-gray-500 mb-1 break-words">{e.company}{e.location?` — ${e.location}`:''}{e.employmentType?` · ${e.employmentType}`:''}</div>
          {e.summary&&<p className="text-[11.5px] text-gray-600 mb-1 leading-relaxed break-words">{e.summary}</p>}
          {e.responsibilities?.length>0&&<div className="text-[11.5px] text-gray-600 leading-relaxed">{e.responsibilities.map((r,j)=><div key={j} className="break-inside-avoid break-words mb-0.5">{r}</div>)}</div>}
        </div>))}</div>) : null;
      case 'education': return education?.length ? (<div key="education" className="mb-5"><SH>{labelOf(sec, 'Education')}</SH>{education.map((e,i)=>(
        <div key={i} className="mb-2 break-inside-avoid">
          <div className="flex justify-between items-baseline flex-wrap gap-1"><span className="text-[12px] font-medium text-gray-900 break-words">{educationTitle(e) || e.institution}</span><span className="text-[10.5px] text-gray-400 shrink-0 whitespace-nowrap">{e.year}</span></div>
          <div className="text-[11px] text-gray-500 break-words">{e.institution}</div>
          {(e.gpa||e.details)&&<div className="text-[10.5px] text-gray-400 break-words">{[(e.details||''),e.gpa].filter(Boolean).join(' — ')}</div>}
        </div>))}</div>) : null;
      case 'projects': return projects?.length ? (<div key="projects" className="mb-5"><SH>{labelOf(sec, 'Projects')}</SH>{projects.map((p,i)=>(
        <div key={i} className="mb-3 break-inside-avoid">
          <div className="flex flex-wrap items-baseline gap-x-2"><span className="text-[12px] font-medium text-gray-900 break-words min-w-0">{p.name}</span>{p.role&&<span className="text-[10.5px] text-gray-400 break-words">({p.role})</span>}</div>
          {p.technologies&&<div className="text-[11px] text-gray-500 mb-0.5 break-words">Tech: {p.technologies}</div>}
          {(p.link||p.github)&&<div className="text-[10px] text-gray-400 mb-0.5 break-all">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
          {p.description&&<p className="text-[11.5px] text-gray-600 leading-relaxed break-words">{p.description}</p>}
          {p.highlights?.length>0&&<BulletList items={p.highlights} className="mt-0.5 space-y-0.5 pl-3" itemClassName="text-[11.5px] text-gray-600 leading-relaxed break-words break-inside-avoid" />}
        </div>))}</div>) : null;
      case 'skills': return skills?.length ? (<div key="skills" className="mb-5"><SH>{labelOf(sec, 'Skills')}</SH><p className="text-[11.5px] text-gray-700 leading-relaxed break-words">{(Array.isArray(skills)?skills:[skills]).join('   ·   ')}</p></div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications" className="mb-5"><SH>{labelOf(sec, 'Certifications')}</SH><div className="space-y-1">{certifications.map((c,i)=><CertItem key={i} cert={c} className="text-[11.5px] text-gray-600 break-words break-inside-avoid" />)}</div></div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements" className="mb-5"><SH>{labelOf(sec, 'Achievements')}</SH><div className="text-[11.5px] text-gray-600 leading-relaxed">{achievements.map((a,i)=><div key={i} className="break-inside-avoid break-words mb-0.5">{a}</div>)}</div></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages" className="mb-5"><SH>{labelOf(sec, 'Languages')}</SH><p className="text-[11.5px] text-gray-700 leading-relaxed break-words">{languages.join('   ·   ')}</p></div>) : null;
      default: return <CustomBlock key={sec.id} label={labelOf(sec)} content={(customSections||{})[sec.id]}/>;
    }
  };

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  return (
    <div className="resume-template minimal max-w-4xl mx-auto bg-white px-12 pt-4 font-sans overflow-hidden">
      <div className="border-t border-gray-200 mb-4">
        {personalInfo&&(
          <div className="pt-3 mb-3">
            <h1 className="text-[24.5px] font-light text-gray-900 break-words">{personalInfo.fullName}</h1>
            {personalInfo.title&&<div className="text-[12.5px] text-gray-500 mt-0.5 break-words">{personalInfo.title}</div>}
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-[10.5px] text-gray-400">
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
    </div>
  );
};
