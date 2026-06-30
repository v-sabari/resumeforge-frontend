import { useState, useEffect, useRef } from 'react';
import { RESUME_TEMPLATES } from '../../utils/constants';
import {
  ModernProTemplate,
  MinimalATSTemplate,
  ExecutiveTemplate,
  FresherTemplate,
  CreativeATSTemplate,
} from '../resume/templates';

/* ─── Shared micro-components used only by inline ClassicTemplate ─── */

const safe = (v) => v || '';

const Bullet = ({ children }) => (
  <li className="flex gap-1.5">
    <span className="text-gray-400 shrink-0 select-none" aria-hidden="true">&#8226;</span>
    <span className="text-gray-700 break-words min-w-0">{children}</span>
  </li>
);

const SectionHead = ({ children, dark }) => (
  <div className={[
    'text-[9px] font-bold uppercase tracking-widest pb-0.5 mb-1.5 border-b',
    dark ? 'text-slate-400 border-slate-600' : 'text-gray-500 border-gray-200',
  ].join(' ')}>
    {children}
  </div>
);

/* ─── Classic template (inline, raw resume data) ─────────────────────
 *  Uses the `resume` object directly so every field the builder captures
 *  is available without going through transformedData.
 * ─────────────────────────────────────────────────────────────────── */
const ClassicTemplate = ({ r }) => (
  <div className="font-sans text-[10px] leading-tight text-gray-900 bg-white p-6 space-y-3">

    {/* ── Header ── */}
    <div className="text-center border-b border-gray-300 pb-3">
      <div className="text-lg font-bold tracking-wide uppercase">{safe(r.fullName) || 'Your Name'}</div>
      {(r.professionalTitle) && (
        <div className="text-[10px] text-gray-600 mt-0.5">{r.professionalTitle}</div>
      )}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1 text-gray-500">
        {r.email    && <span className="break-all">{r.email}</span>}
        {r.phone    && <span>{r.phone}</span>}
        {r.location && <span>{r.location}</span>}
      </div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-0.5 text-gray-500">
        {r.linkedin  && <span className="break-all">{r.linkedin}</span>}
        {r.github    && <span className="break-all">{r.github}</span>}
        {r.portfolio && <span className="break-all">{r.portfolio}</span>}
      </div>
    </div>

    {/* ── Summary ── */}
    {r.summary && (
      <div>
        <SectionHead>Professional Summary</SectionHead>
        <p className="text-gray-700 leading-relaxed break-words">{r.summary}</p>
      </div>
    )}

    {/* ── Skills ── */}
    {(r.skills || []).length > 0 && (
      <div>
        <SectionHead>Skills</SectionHead>
        <p className="break-words">{(r.skills || []).join(', ')}</p>
      </div>
    )}

    {/* ── Experience ── */}
    {(r.experience || []).length > 0 && (
      <div>
        <SectionHead>Work Experience</SectionHead>
        <div className="space-y-2.5">
          {(r.experience || []).map((e, i) => (
            <div key={e.id || i}>
              <div className="flex justify-between gap-2">
                <span className="font-semibold break-words min-w-0">
                  {e.role}{e.company ? ' \u2014 ' + e.company : ''}
                </span>
                <span className="text-gray-500 shrink-0 whitespace-nowrap">
                  {e.startDate}{e.endDate ? ' \u2013 ' + e.endDate : ''}
                </span>
              </div>
              {/* FIX: employmentType and location now shown */}
              {(e.location || e.employmentType) && (
                <div className="text-gray-500 text-[9px]">
                  {[e.location, e.employmentType].filter(Boolean).join(' · ')}
                </div>
              )}
              {/* FIX: brief role summary now shown */}
              {e.summary && (
                <p className="text-gray-600 mt-0.5 break-words">{e.summary}</p>
              )}
              {(e.bullets || []).filter(Boolean).length > 0 && (
                <ul className="mt-1 space-y-0.5 pl-1">
                  {(e.bullets || []).filter(Boolean).map((b, j) => (
                    <Bullet key={j}>{b}</Bullet>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* ── Projects ── */}
    {(r.projects || []).length > 0 && (
      <div>
        <SectionHead>Projects</SectionHead>
        <div className="space-y-2">
          {(r.projects || []).map((p, i) => (
            <div key={p.id || i}>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="font-semibold">{p.name}</span>
                {/* FIX: project role now shown */}
                {p.role && <span className="text-gray-500 text-[9px]">({p.role})</span>}
              </div>
              {p.techStack && (
                <div className="text-gray-500 text-[9px] mt-0.5 break-words">{p.techStack}</div>
              )}
              {/* FIX: live URL and GitHub URL now shown */}
              {(p.link || p.github) && (
                <div className="text-gray-400 text-[9px] mt-0.5 break-all">
                  {[p.link, p.github].filter(Boolean).join(' · ')}
                </div>
              )}
              {p.description && (
                <p className="text-gray-700 mt-0.5 break-words">{p.description}</p>
              )}
              {/* FIX: project highlights now shown */}
              {(p.highlights || []).filter(Boolean).length > 0 && (
                <ul className="mt-0.5 space-y-0.5 pl-1">
                  {(p.highlights || []).filter(Boolean).map((h, j) => (
                    <Bullet key={j}>{h}</Bullet>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* ── Education ── */}
    {(r.education || []).length > 0 && (
      <div>
        <SectionHead>Education</SectionHead>
        <div className="space-y-1.5">
          {(r.education || []).map((e, i) => (
            <div key={e.id || i}>
              <div className="flex justify-between gap-2">
                <div className="min-w-0">
                  <span className="font-semibold">{e.degree}</span>
                  {e.field && <span className="text-gray-600"> in {e.field}</span>}
                  {e.institution && <div className="text-gray-500">{e.institution}</div>}
                  {/* FIX: grade/CGPA now shown */}
                  {e.grade && <div className="text-gray-400 text-[9px]">Grade: {e.grade}</div>}
                  {/* FIX: additional details now shown */}
                  {e.details && <p className="text-gray-500 text-[9px] mt-0.5 break-words">{e.details}</p>}
                </div>
                <span className="text-gray-500 shrink-0 whitespace-nowrap">
                  {e.startDate}{e.endDate ? ' \u2013 ' + e.endDate : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* ── Certifications ── */}
    {(r.certifications || []).length > 0 && (
      <div>
        <SectionHead>Certifications</SectionHead>
        <div className="space-y-0.5">
          {(r.certifications || []).map((c, i) => {
            const name   = typeof c === 'string' ? c : (c?.name   || '');
            const issuer = typeof c === 'string' ? '' : (c?.issuer || '');
            const year   = typeof c === 'string' ? '' : (c?.year   || '');
            return (
              <div key={i} className="break-words">
                <span className="font-medium">{name}</span>
                {issuer && <span className="text-gray-500"> — {issuer}</span>}
                {year   && <span className="text-gray-400"> ({year})</span>}
              </div>
            );
          })}
        </div>
      </div>
    )}

    {/* ── Achievements ── */}
    {(r.achievements || []).length > 0 && (
      <div>
        <SectionHead>Achievements</SectionHead>
        <ul className="space-y-0.5 pl-1">
          {(r.achievements || []).map((a, i) => <Bullet key={i}>{a}</Bullet>)}
        </ul>
      </div>
    )}
  </div>
);

/* ─── ScaledPaper ────────────────────────────────────────────────────
 *  Renders an 794px-wide inner div (A4 width in px at 96dpi) and scales
 *  it to fill the available column width via a CSS transform.
 *
 *  FIX 1 — innerH initialised to 0 (not PAPER_WIDTH*1.414):
 *    The old initialisation (~1123px at scale=1) meant the outer wrapper
 *    was always 1123px tall before ResizeObserver fired.  For a 380px
 *    column the correct height is ~540px; the 1123px initial value created
 *    a blank gap below the preview that looked like the content was cut.
 *    With innerH=0 the wrapper starts collapsed and jumps to the correct
 *    height on the first observer callback with no intermediate wrong state.
 *
 *  FIX 2 — overflow:'hidden' on the outer div:
 *    The inner div is 794px wide in layout space regardless of scale.
 *    Without clipping, that box leaked into the document which could
 *    trigger a horizontal scrollbar on the <main> element.  The scrollbar
 *    reduced viewport width, reflowed the grid, and shrank the preview
 *    column — making the scaled content appear horizontally clipped.
 *    overflow:hidden is safe here because the CSS transform maps the full
 *    794px to exactly [0, containerWidth] before painting, so no visual
 *    content is cut.
 * ─────────────────────────────────────────────────────────────────── */
const PAPER_WIDTH = 794;

const ScaledPaper = ({ children }) => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale,  setScale]  = useState(1);
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
    const roInner = new ResizeObserver(recalc);
    roOuter.observe(outer);
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

/* ─── ResumePreview ──────────────────────────────────────────────────
 *  Converts the flat `resume` state into the `transformedData` shape
 *  that all external templates expect, then renders the active template
 *  inside ScaledPaper.
 *
 *  transformedData fixes applied here:
 *  • education[].gpa   — was edu.gpa (undefined); now edu.gpa || edu.grade
 *  • education[].field — was absent; field of study now forwarded
 *  • education[].details — was absent; additional details now forwarded
 *  • experience[].employmentType — was absent; now forwarded
 *  • experience[].summary — was absent; brief role summary now forwarded
 *  • projects[].role / .link / .github — were absent; now forwarded
 *  • certifications — normalised from raw string OR object to {name,issuer,year,credentialUrl}
 * ─────────────────────────────────────────────────────────────────── */
export const ResumePreview = ({ resume, template = 'modern', onTemplateChange }) => {
  const [activeTemplate, setActiveTemplate] = useState(template);

  useEffect(() => { setActiveTemplate(template); }, [template]);

  const handleChange = (id) => { setActiveTemplate(id); onTemplateChange?.(id); };

  if (!resume) {
    return (
      <div className="rounded-xl border border-surface-200 bg-white p-8 text-center text-sm text-ink-400">
        Loading resume preview…
      </div>
    );
  }

  const transformedData = {
    personalInfo: {
      fullName:  resume.fullName          || 'Your Name',
      title:     resume.professionalTitle || resume.role || '',
      email:     resume.email    || '',
      phone:     resume.phone    || '',
      location:  resume.location || '',
      linkedin:  resume.linkedin  || '',
      github:    resume.github    || '',
      portfolio: resume.portfolio || '',
    },

    summary: resume.summary || '',

    experience: (resume.experience || []).map((exp) => ({
      position:       exp.role           || '',
      company:        exp.company        || '',
      duration:       exp.duration       || `${exp.startDate || ''} – ${exp.endDate || 'Present'}`.trim(),
      location:       exp.location       || '',
      // FIX: employmentType and per-role summary were not forwarded
      employmentType: exp.employmentType || '',
      summary:        exp.summary        || '',
      responsibilities: exp.bullets || exp.responsibilities || [],
    })),

    education: (resume.education || []).map((edu) => ({
      degree:      edu.degree                   || '',
      // FIX: field of study was not forwarded to external templates
      field:       edu.field                    || '',
      institution: edu.school || edu.institution || '',
      year:        edu.year   || `${edu.startDate || ''} – ${edu.endDate || ''}`.trim(),
      // FIX: builder form stores grade as edu.grade, not edu.gpa
      gpa:         edu.gpa   || edu.grade       || '',
      // FIX: additional details (coursework, honours) were not forwarded
      details:     edu.details                  || '',
    })),

    skills: resume.skills || [],

    projects: (resume.projects || []).map((proj) => ({
      name:         proj.name        || '',
      // FIX: project role, live URL, and GitHub URL were not forwarded
      role:         proj.role        || '',
      link:         proj.link        || '',
      github:       proj.github      || '',
      description:  proj.description || '',
      technologies: proj.techStack || proj.technologies || '',
      highlights:   proj.highlights || [],
    })),

    // FIX: normalise certs — legacy string entries caused cert.name to be
    // undefined in templates that destructure the object.
    certifications: (resume.certifications || []).map((c) =>
      typeof c === 'string'
        ? { name: c, issuer: '', year: '', credentialUrl: '' }
        : {
            name:          c?.name          || '',
            issuer:        c?.issuer        || '',
            year:          c?.year          || '',
            credentialUrl: c?.credentialUrl || '',
          }
    ),

    achievements: resume.achievements || [],
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
      {/* Template switcher */}
      <div className="flex flex-wrap gap-1 rounded-xl bg-surface-100 p-1">
        {RESUME_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleChange(t.id)}
            className={[
              'flex-1 min-w-fit rounded-lg px-2 py-1.5 text-[11px] font-medium transition-all whitespace-nowrap',
              activeTemplate === t.id
                ? 'bg-white shadow-sm text-ink-950'
                : 'text-ink-400 hover:text-ink-700',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Scaled A4 preview */}
      <div className="rounded-xl border border-surface-200 shadow-md bg-white">
        <ScaledPaper>
          <TemplateComponent />
        </ScaledPaper>
      </div>

      <p className="text-center text-[11px] text-ink-300 select-none">
        Live preview · scales to fit
      </p>
    </div>
  );
};