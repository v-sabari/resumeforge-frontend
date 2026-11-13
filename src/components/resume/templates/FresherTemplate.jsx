import {
  CertItem,
  CustomContent,
  educationTitle,
  hasCustomContent,
  labelOf,
} from './shared.jsx';

const H = ({children}) => <h2 className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.22em] text-gray-800 mb-2 mt-1 break-after-avoid"><span className="h-2 w-2 rounded-full bg-teal-600 shrink-0"></span><span className="break-words min-w-0">{children}</span></h2>;

const CustomBlock = ({ label, content }) => {
  if (!hasCustomContent(content)) return null;
  return (
    <div className="ml-4 border-l border-dashed border-teal-300 pl-4 mb-4">
      <H>{label}</H>
      <CustomContent content={content} />
    </div>
  );
};

const TimelineItem = ({ marker, title, sub, meta, summary, bullets, dotClass }) => (
  <div className="relative pl-5 pb-3 break-inside-avoid">
    <span className={`absolute left-0 top-1.5 h-2 w-2 rounded-full ${dotClass} border border-white shrink-0`}></span>
    <div className="flex items-baseline justify-between gap-1 flex-wrap">
      <span className="text-[11.5px] font-semibold text-gray-900 break-words min-w-0">{title}</span>
      {meta&&<span className={`text-[10px] whitespace-nowrap shrink-0 ${marker==='edge'?'':'text-teal-700 font-medium'}`}>{meta}</span>}
    </div>
    {sub&&<div className="text-[10.5px] text-gray-500 mb-0.5 break-words">{sub}</div>}
    {summary&&<p className="text-[11px] text-gray-600 mb-0.5 leading-relaxed break-words">{summary}</p>}
    {bullets?.length>0&&<ul className="space-y-0.5">{bullets.map((b,j)=><li key={j} className="text-[11px] text-gray-600 leading-relaxed break-words break-inside-avoid">• {b}</li>)}</ul>}
  </div>
);

export const FresherTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const renderSection = (sec) => {
    if (sec.type === 'custom') return <CustomBlock key={sec.id} label={labelOf(sec)} content={(customSections||{})[sec.id]}/>;
    switch (sec.key) {
      case 'basics': return null;
      case 'summary': return summary ? <div key="summary" className="mb-3"><H>{labelOf(sec, 'Objective')}</H><p className="text-[11px] text-gray-600 leading-relaxed break-words whitespace-pre-line">{summary}</p></div> : null;
      case 'experience': return experience?.length ? (<div key="experience" className="mb-3"><H>{labelOf(sec, 'Experience')}</H><div className="ml-1 border-l-2 border-teal-200 pl-3">{experience.map((e,i)=><TimelineItem key={i} marker title={e.position} sub={`${e.company}${e.location?` · ${e.location}`:''}${e.employmentType?` · ${e.employmentType}`:''}`} meta={e.duration} summary={e.summary} bullets={e.responsibilities} dotClass="bg-teal-500"/>)}</div></div>) : null;
      case 'education': return education?.length ? (<div key="education" className="mb-3"><H>{labelOf(sec, 'Education')}</H><div className="ml-1 border-l-2 border-teal-200 pl-3">{education.map((e,i)=><TimelineItem key={i} marker title={educationTitle(e) || e.institution} sub={e.institution} meta={e.year} summary={(e.gpa||e.details)?[e.gpa,e.details].filter(Boolean).join(' — '):null} dotClass="bg-teal-400"/>)} </div></div>) : null;
      case 'projects': return projects?.length ? (<div key="projects" className="mb-3"><H>{labelOf(sec, 'Projects')}</H><div className="ml-1 border-l-2 border-teal-200 pl-3">{projects.map((p,i)=><TimelineItem key={i} marker title={p.name} meta={p.role?`${p.role}`:''} sub={[p.technologies?`Tech: ${p.technologies}`:'',[p.link,p.github].filter(Boolean).join(' · ')].filter(Boolean).join(' · ')} summary={p.description} bullets={p.highlights} dotClass="bg-teal-300"/>)}</div></div>) : null;
      case 'skills': return skills?.length ? (<div key="skills" className="mb-3"><H>{labelOf(sec, 'Skills')}</H><div className="flex flex-wrap gap-1.5">{(Array.isArray(skills)?skills:[skills]).map((s,i)=><span key={i} className="text-[10.5px] bg-teal-50 text-teal-800 border border-teal-100 rounded-full px-2.5 py-0.5 break-words">{s}</span>)}</div></div>) : null;
      case 'certifications': return certifications?.length ? (<div key="certifications" className="mb-3"><H>{labelOf(sec, 'Certifications')}</H><div className="space-y-1">{certifications.map((c,i)=><CertItem key={i} cert={c} className="text-[11px] text-gray-600 break-words break-inside-avoid" />)}</div></div>) : null;
      case 'achievements': return achievements?.length ? (<div key="achievements" className="mb-3"><H>{labelOf(sec, 'Achievements')}</H><ul className="space-y-1">{achievements.map((a,i)=><li key={i} className="text-[11px] text-gray-600 leading-relaxed break-words break-inside-avoid">• {a}</li>)}</ul></div>) : null;
      case 'languages': return languages?.length ? (<div key="languages" className="mb-3"><H>{labelOf(sec, 'Languages')}</H><p className="text-[11px] text-gray-600 break-words">{languages.join('  ·  ')}</p></div>) : null;
      default: return <CustomBlock key={sec.id} label={labelOf(sec)} content={(customSections||{})[sec.id]}/>;
    }
  };

  const activeSections = (sectionsConfig||[]).filter((s)=>s.visible);

  return (
    <div className="resume-template fresher max-w-4xl mx-auto bg-white px-8 pt-3 font-sans overflow-hidden">
      {personalInfo&&(
        <div className="mb-3 pb-3 border-b border-teal-200">
          <h1 className="text-[22.5px] font-bold text-gray-900 break-words">{personalInfo.fullName}</h1>
          {personalInfo.title&&<div className="text-[12.5px] text-teal-700 font-medium mt-0.5 mb-1.5 break-words">{personalInfo.title}</div>}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-gray-500">
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
