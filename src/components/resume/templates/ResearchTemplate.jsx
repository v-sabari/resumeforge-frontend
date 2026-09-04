const CustomBlock = ({ label, content, num }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  return (
    <div className="flex gap-3 mb-3 break-inside-avoid">
      <div className="w-[10%] shrink-0 text-right pt-1">
        <span className="inline-block w-6 text-center bg-gray-900 text-white text-[10px] font-bold">{num}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5 break-after-avoid">{label}</h3>
        {mode==='bullets'
          ? (items?.filter(Boolean).length ? <ul className="space-y-0.5">{items.filter(Boolean).map((it,i)=><li key={i} className="text-[10px] text-gray-700 leading-relaxed break-words break-inside-avoid">{it}</li>)}</ul> : null)
          : (text?.trim() ? <p className="text-[10px] text-gray-700 leading-relaxed break-words">{text}</p> : null)}
      </div>
    </div>
  );
};

export const ResearchTemplate = ({ data }) => {
  const {
    sectionsConfig, personalInfo, summary, experience, education, skills,
    projects, certifications, achievements, languages, customSections,
  } = data;

  const SideNum = ({ n }) => (
    <div className="w-[10%] shrink-0 text-right pt-1">
      <span className="inline-block w-6 text-center bg-gray-900 text-white text-[10px] font-bold">{n}</span>
    </div>
  );

  const Head = ({ children }) => (
    <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5 break-after-avoid">{children}</h3>
  );

  const Frame = ({ n, title, children }) => (
    <div className="flex gap-3 mb-3 break-inside-avoid">
      <SideNum n={n} />
      <div className="flex-1 min-w-0">
        <Head>{title}</Head>
        <div className="min-w-0 space-y-0.5">{children}</div>
      </div>
    </div>
  );

  const cases = {
    summary: summary ? <p className="text-[10px] text-gray-700 leading-relaxed break-words">{summary}</p> : null,
    experience: experience?.length ? experience.map((e,i)=>(
      <div key={i} className="pb-1.5 break-inside-avoid">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <span className="text-[10.5px] font-bold text-gray-900 break-words min-w-0">{e.position}</span>
          <span className="text-[9px] text-gray-400 whitespace-nowrap shrink-0">{e.duration}</span>
        </div>
        <div className="text-[9.5px] text-gray-500 break-words">{e.company}{e.location?` · ${e.location}`:''}{e.employmentType?` · ${e.employmentType}`:''}</div>
        {e.summary && <p className="text-[10px] text-gray-700 leading-relaxed mt-0.5 break-words">{e.summary}</p>}
        {e.responsibilities?.length>0 && <ul className="pl-3 space-y-0.5">{e.responsibilities.map((r,j)=><li key={j} className="text-[10px] text-gray-700 leading-relaxed break-words break-inside-avoid">{j+1}. {r}</li>)}</ul>}
      </div>
    )) : null,
    education: education?.length ? education.map((e,i)=>(
      <div key={i} className="pb-1 break-inside-avoid">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <span className="text-[10.5px] font-bold text-gray-900 break-words">{e.degree}</span>
          <span className="text-[9px] text-gray-400 shrink-0 whitespace-nowrap">{e.year}</span>
        </div>
        <div className="text-[9.5px] text-gray-500 break-words">{e.institution}</div>
        {(e.gpa||e.details) && <div className="text-[9px] text-gray-500 break-words">{[e.gpa,e.details].filter(Boolean).join(' — ')}</div>}
      </div>
    )) : null,
    projects: projects?.length ? projects.map((p,i)=>(
      <div key={i} className="pb-1.5 break-inside-avoid">
        <div className="flex items-baseline gap-x-2 flex-wrap">
          <span className="text-[10.5px] font-bold text-gray-900 break-words min-w-0">{p.name}</span>
          {p.role&&<span className="text-[9px] text-gray-400 break-words">({p.role})</span>}
        </div>
        {p.technologies && <div className="text-[9.5px] text-gray-500 break-words">Tech: {p.technologies}</div>}
        {(p.link||p.github) && <div className="text-[8.5px] break-all">{[p.link,p.github].filter(Boolean).join(' · ')}</div>}
        {p.description && <p className="text-[10px] text-gray-700 leading-relaxed break-words">{p.description}</p>}
      </div>
    )) : null,
    skills: skills?.length ? <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">{ (Array.isArray(skills)?skills:[skills]).map((s,i)=><div key={i} className="text-[10px] text-gray-700 break-words break-inside-avoid">{s}</div>)}</div> : null,
    certifications: certifications?.length ? certifications.map((c,i)=><div key={i} className="text-[10px] text-gray-700 break-words break-inside-avoid">{c.name}{c.issuer?` — ${c.issuer}`:''}{c.year?` (${c.year})`:''}</div>) : null,
    achievements: achievements?.length ? achievements.map((a,i)=><div key={i} className="text-[10px] text-gray-700 leading-relaxed break-words break-inside-avoid">{i+1}. {a}</div>) : null,
    languages: languages?.length ? <p className="text-[10px] text-gray-700 break-words">{languages.join('  ·  ')}</p> : null,
  };
  const titles = {
    summary:'Summary', experience:'Experience', education:'Education',
    projects:'Publications & Projects', skills:'Skills / Methods',
    certifications:'Certifications', achievements:'Achievements', languages:'Languages',
  };

  const ordered = (sectionsConfig||[]).filter((s)=>s.visible).sort((a,b)=>a.order-b.order).filter((s)=>s.key!=='basics');

  let idx = 0;
  const rendered = ordered.map((sec)=>{
    if (sec.type === 'custom') {
      const c=(customSections||{})[sec.id];
      return c ? <CustomBlock key={sec.id} label={sec.label} content={c} num={String(++idx).padStart(2,'0')}/> : null;
    }
    const body = cases[sec.key];
    if (!body) return null;
    return <Frame key={sec.key} n={String(++idx).padStart(2,'0')} title={titles[sec.key]}>{body}</Frame>;
  });

  return (
    <div className="resume-template research max-w-4xl mx-auto bg-white px-8 pt-2 font-sans overflow-hidden">
      {personalInfo&&(
        <div className="mb-3 pb-2 border-b-2 border-gray-900">
          <h1 className="text-[20px] font-bold text-gray-900 break-words">{personalInfo.fullName}</h1>
          {personalInfo.title&&<div className="text-[11px] text-gray-600 mt-0.5 break-words">{personalInfo.title}</div>}
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-[9.5px] text-gray-500">
            {personalInfo.email&&<span className="break-all">{personalInfo.email}</span>}
            {personalInfo.phone&&<span className="break-words">{personalInfo.phone}</span>}
            {personalInfo.location&&<span className="break-words">{personalInfo.location}</span>}
            {personalInfo.linkedin&&<span className="break-all">{personalInfo.linkedin}</span>}
            {personalInfo.github&&<span className="break-all">{personalInfo.github}</span>}
            {personalInfo.portfolio&&<span className="break-all">{personalInfo.portfolio}</span>}
          </div>
        </div>
      )}
      <div className="space-y-1">{rendered}</div>
    </div>
  );
};
