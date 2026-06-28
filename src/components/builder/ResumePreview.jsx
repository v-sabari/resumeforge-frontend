import { useState, useEffect, useRef } from 'react';
import { RESUME_TEMPLATES } from '../../utils/constants';
import {
  ModernProTemplate,
  MinimalATSTemplate,
  ExecutiveTemplate,
  FresherTemplate,
  CreativeATSTemplate,
} from '../resume/templates';

const safe = (v) => v || '';

const Bullet = ({ children, className }) => (
  <li className="flex gap-1.5">
    <span className="text-gray-400 shrink-0 select-none" aria-hidden="true">&#8226;</span>
    <span className={className || 'text-gray-700'}>{children}</span>
  </li>
);

const ChevronBullet = ({ children }) => (
  <li className="flex gap-1.5">
    <span className="text-blue-400 shrink-0 select-none" aria-hidden="true">&#8250;</span>
    <span className="text-gray-600 break-words min-w-0">{children}</span>
  </li>
);

const SectionHead = ({ children, dark }) => (
  <div className={['text-[9px] font-bold uppercase tracking-widest pb-0.5 mb-1.5 border-b', dark ? 'text-slate-400 border-slate-600' : 'text-gray-500 border-gray-200'].join(' ')}>
    {children}
  </div>
);

const ClassicTemplate = ({ r }) => (
  <div className="font-sans text-[10px] leading-tight text-gray-900 bg-white p-6 space-y-3">
    <div className="text-center border-b border-gray-300 pb-3">
      <div className="text-lg font-bold tracking-wide uppercase">{safe(r.fullName) || 'Your Name'}</div>
      <div className="text-[10px] text-gray-600 mt-0.5">{safe(r.professionalTitle) || safe(r.role)}</div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1 text-gray-500">
        {r.email && <span className="break-all">{r.email}</span>}
        {r.phone && <span>{r.phone}</span>}
        {r.location && <span>{r.location}</span>}
      </div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-0.5 text-gray-500">
        {r.linkedin && <span className="break-all">{r.linkedin}</span>}
        {r.github && <span className="break-all">{r.github}</span>}
        {r.portfolio && <span className="break-all">{r.portfolio}</span>}
      </div>
    </div>
    {r.summary && <div><SectionHead>Professional Summary</SectionHead><p className="text-gray-700 leading-relaxed break-words">{r.summary}</p></div>}
    {(r.skills || []).length > 0 && <div><SectionHead>Skills</SectionHead><p className="break-words">{(r.skills || []).join(', ')}</p></div>}
    {(r.experience || []).length > 0 && (
      <div>
        <SectionHead>Experience</SectionHead>
        <div className="space-y-2">
          {(r.experience || []).map((e, i) => (
            <div key={e.id || i}>
              <div className="flex justify-between gap-2">
                <span className="font-semibold break-words min-w-0">{e.role}{e.company ? ' \u2014 ' + e.company : ''}</span>
                <span className="text-gray-500 shrink-0">{e.startDate}{e.endDate ? ' \u2013 ' + e.endDate : ''}</span>
              </div>
              {e.location && <div className="text-gray-500">{e.location}</div>}
              {(e.bullets || []).filter(Boolean).length > 0 && (
                <ul className="mt-1 space-y-0.5 pl-1">{(e.bullets || []).filter(Boolean).map((b, j) => <Bullet key={j}>{b}</Bullet>)}</ul>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
    {(r.projects || []).length > 0 && (
      <div>
        <SectionHead>Projects</SectionHead>
        <div className="space-y-1.5">
          {(r.projects || []).map((p, i) => (
            <div key={p.id || i}>
              <span className="font-semibold">{p.name}</span>
              {p.techStack && <span className="text-gray-500 ml-1 text-[9px] break-words">{p.techStack}</span>}
              {p.description && <p className="text-gray-700 mt-0.5 break-words">{p.description}</p>}
              {(p.highlights || []).filter(Boolean).length > 0 && (
                <ul className="mt-0.5 space-y-0.5 pl-1">{(p.highlights || []).filter(Boolean).map((h, j) => <Bullet key={j}>{h}</Bullet>)}</ul>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
    {(r.education || []).length > 0 && (
      <div>
        <SectionHead>Education</SectionHead>
        <div className="space-y-1">
          {(r.education || []).map((e, i) => (
            <div key={e.id || i} className="flex justify-between gap-2">
              <div className="min-w-0">
                <span className="font-semibold">{e.degree}</span>
                {e.field && <span className="text-gray-600"> in {e.field}</span>}
                {e.institution && <div className="text-gray-500">{e.institution}</div>}
                {e.grade && <div className="text-gray-400 text-[9px]">{e.grade}</div>}
              </div>
              <span className="text-gray-500 shrink-0">{e.startDate}{e.endDate ? ' \u2013 ' + e.endDate : ''}</span>
            </div>
          ))}
        </div>
      </div>
    )}
    {(r.certifications || []).length > 0 && (
      <div><SectionHead>Certifications</SectionHead><p className="break-words">{(r.certifications || []).map(c => typeof c === 'string' ? c : c?.name || '').filter(Boolean).join(' · ')}</p></div>
    )}
    {(r.achievements || []).length > 0 && (
      <div><SectionHead>Achievements</SectionHead><ul className="space-y-0.5 pl-1">{(r.achievements || []).map((a, i) => <Bullet key={i}>{a}</Bullet>)}</ul></div>
    )}
  </div>
);

const ModernTemplate = ({ r }) => (
  <div className="font-sans text-[10px] leading-tight text-gray-900 bg-white flex">
    <div className="w-[36%] bg-slate-800 text-white p-4 space-y-3 shrink-0 self-stretch">
      <div>
        <div className="text-sm font-bold leading-tight break-words">{safe(r.fullName) || 'Your Name'}</div>
        <div className="text-[9px] text-slate-300 mt-0.5 break-words">{safe(r.professionalTitle) || safe(r.role)}</div>
      </div>
      {(r.email || r.phone || r.location) && (
        <div className="space-y-1">
          <SectionHead dark>Contact</SectionHead>
          {r.email && <div className="text-slate-300 break-all">{r.email}</div>}
          {r.phone && <div className="text-slate-300">{r.phone}</div>}
          {r.location && <div className="text-slate-300">{r.location}</div>}
          {r.linkedin && <div className="text-slate-300 break-all">{r.linkedin}</div>}
          {r.github && <div className="text-slate-300 break-all">{r.github}</div>}
        </div>
      )}
      {(r.skills || []).length > 0 && (
        <div><SectionHead dark>Skills</SectionHead>
          <div className="flex flex-wrap gap-1">{(r.skills || []).map((s, i) => <span key={i} className="rounded bg-slate-700 px-1.5 py-0.5 text-slate-200 text-[9px] break-words">{s}</span>)}</div>
        </div>
      )}
      {(r.education || []).length > 0 && (
        <div><SectionHead dark>Education</SectionHead>
          {(r.education || []).map((e, i) => (
            <div key={i} className="mb-1.5">
              <div className="font-semibold text-slate-100 break-words">{e.degree}</div>
              {e.field && <div className="text-slate-300 text-[9px]">{e.field}</div>}
              <div className="text-slate-300 break-words">{e.institution}</div>
              <div className="text-slate-400">{e.startDate}{e.endDate ? '\u2013' + e.endDate : ''}</div>
              {e.grade && <div className="text-slate-400 text-[9px]">{e.grade}</div>}
            </div>
          ))}
        </div>
      )}
      {(r.certifications || []).length > 0 && (
        <div><SectionHead dark>Certifications</SectionHead>
          {(r.certifications || []).map((c, i) => (
            <div key={c.id || i} className="text-slate-300 text-[9px] leading-relaxed break-words">{typeof c === 'string' ? c : [c.name, c.issuer, c.year].filter(Boolean).join(' · ')}</div>
          ))}
        </div>
      )}
    </div>
    <div className="flex-1 p-4 space-y-3 min-w-0">
      {r.summary && <div><div className="text-[9px] font-bold uppercase tracking-widest text-blue-700 border-b border-blue-100 pb-0.5 mb-1.5">Summary</div><p className="text-gray-600 leading-relaxed break-words">{r.summary}</p></div>}
      {(r.experience || []).length > 0 && (
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-blue-700 border-b border-blue-100 pb-0.5 mb-1.5">Experience</div>
          {(r.experience || []).map((e, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between gap-1">
                <span className="font-bold break-words min-w-0">{e.role}</span>
                <span className="text-gray-400 text-[9px] shrink-0">{e.startDate}{e.endDate ? '\u2013' + e.endDate : ''}</span>
              </div>
              <div className="text-blue-600 font-medium break-words">{e.company}</div>
              {(e.bullets || []).filter(Boolean).length > 0 && (
                <ul className="mt-0.5 pl-1 space-y-0.5">{(e.bullets || []).filter(Boolean).map((b, j) => <ChevronBullet key={j}>{b}</ChevronBullet>)}</ul>
              )}
            </div>
          ))}
        </div>
      )}
      {(r.projects || []).length > 0 && (
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-blue-700 border-b border-blue-100 pb-0.5 mb-1.5">Projects</div>
          {(r.projects || []).map((p, i) => (
            <div key={i} className="mb-1.5">
              <span className="font-semibold break-words">{p.name}</span>
              {p.techStack && <span className="text-gray-400 ml-1 text-[9px] break-words">{p.techStack}</span>}
              {p.description && <p className="text-gray-600 mt-0.5 break-words">{p.description}</p>}
              {(p.highlights || []).filter(Boolean).length > 0 && (
                <ul className="mt-0.5 pl-1 space-y-0.5">{(p.highlights || []).filter(Boolean).map((h, j) => <ChevronBullet key={j}>{h}</ChevronBullet>)}</ul>
              )}
            </div>
          ))}
        </div>
      )}
      {(r.achievements || []).length > 0 && (
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-blue-700 border-b border-blue-100 pb-0.5 mb-1.5">Achievements</div>
          <ul className="space-y-0.5 pl-1">{(r.achievements || []).map((a, i) => <ChevronBullet key={i}>{a}</ChevronBullet>)}</ul>
        </div>
      )}
    </div>
  </div>
);

const MinimalTemplate = ({ r }) => {
  const MinHead = ({ children }) => <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mt-3 mb-1">{children}</div>;
  return (
    <div className="font-sans text-[10px] leading-relaxed text-gray-800 bg-white px-8 py-6">
      <div className="mb-4">
        <div className="text-xl font-light tracking-tight text-gray-900 break-words">{safe(r.fullName) || 'Your Name'}</div>
        {(safe(r.professionalTitle) || safe(r.role)) && <div className="text-[10px] text-gray-500 mt-0.5 font-medium break-words">{safe(r.professionalTitle) || safe(r.role)}</div>}
        <div className="flex flex-wrap gap-x-4 mt-1.5 text-gray-400 text-[9px]">
          {r.email && <span className="break-all">{r.email}</span>}
          {r.phone && <span>{r.phone}</span>}
          {r.location && <span>{r.location}</span>}
          {r.linkedin && <span className="break-all">{r.linkedin}</span>}
          {r.github && <span className="break-all">{r.github}</span>}
        </div>
      </div>
      {r.summary && <><MinHead>Profile</MinHead><p className="text-gray-600 leading-relaxed break-words">{r.summary}</p></>}
      {(r.experience || []).length > 0 && (
        <><MinHead>Experience</MinHead>
          {(r.experience || []).map((e, i) => (
            <div key={i} className="mb-2.5">
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-semibold text-gray-900 break-words min-w-0">{e.role}</span>
                <span className="text-gray-400 text-[9px] shrink-0">{e.startDate}{e.endDate ? ' – ' + e.endDate : ''}</span>
              </div>
              <div className="text-gray-500 break-words">{e.company}{e.location ? ', ' + e.location : ''}</div>
              {(e.bullets || []).filter(Boolean).length > 0 && (
                <ul className="mt-0.5 space-y-0.5">{(e.bullets || []).filter(Boolean).map((b, j) => <li key={j} className="flex gap-2 text-gray-600"><span className="text-gray-300 shrink-0">–</span><span className="break-words min-w-0">{b}</span></li>)}</ul>
              )}
            </div>
          ))}
        </>
      )}
      {(r.skills || []).length > 0 && <><MinHead>Skills</MinHead><p className="text-gray-600 break-words">{(r.skills || []).join('  ·  ')}</p></>}
      {(r.projects || []).length > 0 && (
        <><MinHead>Projects</MinHead>
          {(r.projects || []).map((p, i) => (
            <div key={i} className="mb-1.5">
              <span className="font-semibold text-gray-900 break-words">{p.name}</span>
              {p.techStack && <span className="text-gray-400 ml-2 text-[9px] break-words">{p.techStack}</span>}
              {p.description && <p className="text-gray-500 mt-0.5 break-words">{p.description}</p>}
            </div>
          ))}
        </>
      )}
      {(r.education || []).length > 0 && (
        <><MinHead>Education</MinHead>
          {(r.education || []).map((e, i) => (
            <div key={i} className="flex justify-between mb-1 gap-2">
              <div className="min-w-0">
                <span className="font-semibold text-gray-900 break-words">{e.degree}</span>
                {e.field && <span className="text-gray-500"> in {e.field}</span>}
                {e.institution && <span className="text-gray-400 break-words">, {e.institution}</span>}
                {e.grade && <div className="text-gray-400 text-[9px]">{e.grade}</div>}
              </div>
              <span className="text-gray-400 text-[9px] shrink-0">{e.startDate}{e.endDate ? ' – ' + e.endDate : ''}</span>
            </div>
          ))}
        </>
      )}
      {(r.certifications || []).length > 0 && <><MinHead>Certifications</MinHead><p className="text-gray-600 break-words">{(r.certifications || []).map(c => typeof c === 'string' ? c : c?.name || '').filter(Boolean).join('  ·  ')}</p></>}
      {(r.achievements || []).length > 0 && (
        <><MinHead>Achievements</MinHead>
          <ul className="space-y-0.5">{(r.achievements || []).map((a, i) => <li key={i} className="flex gap-2 text-gray-600"><span className="text-gray-300 shrink-0">–</span><span className="break-words min-w-0">{a}</span></li>)}</ul>
        </>
      )}
    </div>
  );
};

const PAPER_WIDTH = 794;

/*
 * ROOT CAUSE FIX 4: innerH was initialised to PAPER_WIDTH * 1.414 (~1123 px)
 * at scale = 1, meaning the outer wrapper was always 1123 px tall on first
 * render regardless of the actual column width or content height.  When the
 * column is, say, 380 px wide the scale becomes ~0.479, so the correctly
 * scaled height should be ~538 px — but the outer div stayed at 1123 px until
 * ResizeObserver fired, creating a large blank gap below the content that made
 * the preview appear cut off at the top and empty below.  Initialising to 0
 * (with the 'auto' fallback while innerH is 0) means the wrapper collapses to
 * nothing until the first ResizeObserver callback, at which point it jumps to
 * the correct scaled height with no intermediate wrong state.
 *
 * ROOT CAUSE FIX 5: The absolutely-positioned inner div is 794 px wide in
 * layout space regardless of scale.  Without overflow:'hidden' on the outer
 * div, that 794 px box leaked beyond the right edge of the preview column in
 * the document flow, causing the browser to add a horizontal scrollbar on the
 * <main> element (which has overflow-y:auto).  That scrollbar reduced the
 * effective viewport width, causing the grid to reflow and the preview column
 * to shrink — which in turn caused the scaled content to appear horizontally
 * clipped.  Because the CSS transform (scale with origin top-left) maps the
 * inner content to exactly [0, containerWidth] visually before painting,
 * adding overflow:'hidden' on the outer div clips only in layout space at
 * containerWidth — no visual content is cut.
 */
const ScaledPaper = ({ children }) => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [innerH, setInnerH] = useState(0);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const recalc = () => {
      const w = outer.clientWidth;
      if (w > 0) {
        const s = w / PAPER_WIDTH;
        setScale(s);
        setInnerH(inner.scrollHeight * s);
      }
    };

    const roOuter = new ResizeObserver(recalc);
    roOuter.observe(outer);
    const roInner = new ResizeObserver(recalc);
    roInner.observe(inner);
    recalc();
    return () => { roOuter.disconnect(); roInner.disconnect(); };
  }, []);

  return (
    <div
      ref={outerRef}
      style={{ height: innerH || 'auto', position: 'relative', overflow: 'hidden' }}
    >
      <div
        ref={innerRef}
        style={{
          width: PAPER_WIDTH,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: '#ffffff',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const ResumePreview = ({ resume, template = 'modern', onTemplateChange }) => {
  const [activeTemplate, setActiveTemplate] = useState(template);

  useEffect(() => { setActiveTemplate(template); }, [template]);

  const handleChange = (id) => { setActiveTemplate(id); onTemplateChange?.(id); };

  if (!resume) {
    return <div className="rounded-xl border border-surface-200 bg-white p-8 text-center text-sm text-ink-400">Loading resume preview…</div>;
  }

  const transformedData = {
    personalInfo: {
      fullName: resume.fullName || 'Your Name',
      title: resume.professionalTitle || resume.role,
      email: resume.email,
      phone: resume.phone,
      location: resume.location,
      linkedin: resume.linkedin,
      github: resume.github,
      portfolio: resume.portfolio,
    },
    summary: resume.summary,
    experience: (resume.experience || []).map(exp => ({
      position: exp.role,
      company: exp.company,
      duration: exp.duration || `${exp.startDate || ''} – ${exp.endDate || 'Present'}`.trim(),
      location: exp.location,
      responsibilities: exp.bullets || exp.responsibilities || [],
    })),
    education: (resume.education || []).map(edu => ({
      degree: edu.degree,
      institution: edu.school || edu.institution,
      year: edu.year || `${edu.startDate || ''} – ${edu.endDate || ''}`.trim(),
      // ROOT CAUSE FIX 6: the builder form stores grade/CGPA in edu.grade, not
      // edu.gpa.  FresherTemplate renders {edu.gpa}, so it was always blank.
      // Fall back to edu.gpa for any data saved before this fix.
      gpa: edu.gpa || edu.grade,
    })),
    skills: resume.skills,
    projects: (resume.projects || []).map(proj => ({
      name: proj.name,
      description: proj.description,
      technologies: proj.techStack || proj.technologies,
      highlights: proj.highlights || [],
    })),
    // ROOT CAUSE FIX 7: certifications were forwarded as-is.  Legacy string
    // entries (e.g. "AWS Certified Developer") caused cert.name to be undefined
    // in every template that destructures the object.  Normalise here so all
    // templates always receive {name, issuer, year, credentialUrl}.
    certifications: (resume.certifications || []).map(c =>
      typeof c === 'string'
        ? { name: c, issuer: '', year: '', credentialUrl: '' }
        : {
            name: c?.name || '',
            issuer: c?.issuer || '',
            year: c?.year || '',
            credentialUrl: c?.credentialUrl || '',
          }
    ),
    achievements: resume.achievements,
  };

  const templateMap = {
    modern:    () => <ModernProTemplate    data={transformedData} />,
    classic:   () => <ClassicTemplate     r={resume} />,
    minimal:   () => <MinimalATSTemplate  data={transformedData} />,
    executive: () => <ExecutiveTemplate   data={transformedData} />,
    fresher:   () => <FresherTemplate     data={transformedData} />,
    creative:  () => <CreativeATSTemplate data={transformedData} />,
  };

  const TemplateComponent = templateMap[activeTemplate] || templateMap.modern;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1 rounded-xl bg-surface-100 p-1">
        {RESUME_TEMPLATES.map(t => (
          <button key={t.id} type="button" onClick={() => handleChange(t.id)}
            className={['flex-1 min-w-fit rounded-lg px-2 py-1.5 text-[11px] font-medium transition-all whitespace-nowrap', activeTemplate === t.id ? 'bg-white shadow-sm text-ink-950' : 'text-ink-400 hover:text-ink-700'].join(' ')}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-surface-200 shadow-md bg-white">
        <ScaledPaper>
          <TemplateComponent />
        </ScaledPaper>
      </div>

      <p className="text-center text-[11px] text-ink-300 select-none">Live preview · scales to fit</p>
    </div>
  );
};