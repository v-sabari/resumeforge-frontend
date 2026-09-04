// src/pdf/renderPdfHandler.jsx
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

// src/utils/transformResume.js
var normCerts = (arr = []) => arr.map(
  (c) => typeof c === "string" ? { name: c, issuer: "", year: "", credentialUrl: "" } : { name: c?.name || "", issuer: c?.issuer || "", year: c?.year || "", credentialUrl: c?.credentialUrl || "" }
);
var buildTransformed = (resume, sectionsConfig) => ({
  sectionsConfig,
  personalInfo: {
    fullName: resume.fullName || "Your Name",
    title: resume.professionalTitle || "",
    email: resume.email || "",
    phone: resume.phone || "",
    location: resume.location || "",
    linkedin: resume.linkedin || "",
    github: resume.github || "",
    portfolio: resume.portfolio || ""
  },
  summary: resume.summary || "",
  experience: (resume.experience || []).map((e) => ({
    position: e.role || "",
    company: e.company || "",
    duration: e.duration || `${e.startDate || ""} \u2013 ${e.endDate || "Present"}`.trim(),
    location: e.location || "",
    employmentType: e.employmentType || "",
    summary: e.summary || "",
    responsibilities: e.bullets || e.responsibilities || []
  })),
  education: (resume.education || []).map((e) => ({
    degree: e.degree || "",
    field: e.field || "",
    institution: e.school || e.institution || "",
    year: e.year || `${e.startDate || ""} \u2013 ${e.endDate || ""}`.trim(),
    gpa: e.gpa || e.grade || "",
    details: e.details || ""
  })),
  skills: resume.skills || [],
  projects: (resume.projects || []).map((p) => ({
    name: p.name || "",
    role: p.role || "",
    link: p.link || "",
    github: p.github || "",
    description: p.description || "",
    technologies: p.techStack || p.technologies || "",
    highlights: p.highlights || []
  })),
  certifications: normCerts(resume.certifications),
  achievements: resume.achievements || [],
  languages: resume.languages || [],
  customSections: resume.customSections || {}
});

// src/utils/pageLayout.js
var A4_W = 794;
var A4_H = 1123;
var TEMPLATE_PAGE_MARGINS = {
  modern: { top: 32, bottom: 32 },
  corporate: { top: 32, bottom: 32 },
  classic: { top: 24, bottom: 24 },
  traditional: { top: 24, bottom: 24 },
  minimal: { top: 32, bottom: 32 },
  clean: { top: 32, bottom: 32 },
  fresher: { top: 32, bottom: 32 },
  graduate: { top: 32, bottom: 32 },
  tech: { top: 32, bottom: 32 },
  engineering: { top: 32, bottom: 32 },
  executive: { top: 32, bottom: 32 },
  leadership: { top: 32, bottom: 32 },
  creative: { top: 32, bottom: 32 },
  designer: { top: 32, bottom: 32 },
  sleek: { top: 32, bottom: 32 },
  contemporary: { top: 32, bottom: 32 },
  academic: { top: 28, bottom: 28 },
  research: { top: 28, bottom: 28 },
  medical: { top: 32, bottom: 32 },
  finance: { top: 32, bottom: 32 }
};
var DEFAULT_PAGE_MARGIN = { top: 32, bottom: 32 };
function getPageMargin(templateId) {
  return TEMPLATE_PAGE_MARGINS[templateId] || DEFAULT_PAGE_MARGIN;
}
function scaleStyle(scale) {
  const s = typeof scale === "number" && scale > 0 && scale !== 1 ? scale : 1;
  if (s === 1) return void 0;
  return { width: `${A4_W / s}px`, zoom: s };
}

// src/utils/sectionsCatalog.js
var STANDARD_SECTIONS = [
  { key: "basics", label: "Personal Info", icon: "user", removable: false },
  { key: "summary", label: "Summary", icon: "text", removable: true },
  { key: "skills", label: "Skills", icon: "star", removable: true },
  { key: "experience", label: "Experience", icon: "briefcase", removable: true },
  { key: "projects", label: "Projects", icon: "code", removable: true },
  { key: "education", label: "Education", icon: "academic", removable: true },
  { key: "certifications", label: "Certifications", icon: "badge", removable: true },
  { key: "achievements", label: "Achievements", icon: "trophy", removable: true },
  { key: "languages", label: "Languages", icon: "globe", removable: true }
];
var DEFAULT_SECTIONS_CONFIG = STANDARD_SECTIONS.map((s, i) => ({
  id: s.key,
  type: "standard",
  key: s.key,
  label: s.label,
  visible: true,
  order: i
}));

// src/components/resume/templates/ModernProTemplate.jsx
import { jsx, jsxs } from "react/jsx-runtime";
var CustomBlock = ({ label, content, color }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const Bar = () => /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-800 mb-2 break-after-avoid", children: [
    /* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-sm ${color} shrink-0` }),
    label
  ] });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      Bar(),
      /* @__PURE__ */ jsx("ul", { className: "space-y-1 pl-4", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs("li", { className: "flex gap-2 text-[10.5px] text-gray-600 break-inside-avoid", children: [
        /* @__PURE__ */ jsx("span", { className: `mt-[3px] h-1 w-1 shrink-0 rounded-full ${color}` }),
        /* @__PURE__ */ jsx("span", { className: "leading-relaxed break-words min-w-0", children: it })
      ] }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
    Bar(),
    /* @__PURE__ */ jsx("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words pl-4", children: text })
  ] });
};
var ModernProTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const ACCENT = "bg-blue-600";
  const SH = ({ children }) => /* @__PURE__ */ jsxs("h2", { className: "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-800 mb-2 break-after-avoid", children: [
    /* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-sm ${ACCENT} shrink-0` }),
    /* @__PURE__ */ jsx("span", { className: "break-words min-w-0", children })
  ] });
  const P = "text-[10.5px] text-gray-600 leading-relaxed break-words";
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx(CustomBlock, { label: sec.label, content: (customSections || {})[sec.id], color: ACCENT }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx(SH, { children: "Profile" }),
          /* @__PURE__ */ jsx("p", { className: P, children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx(SH, { children: "Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs("div", { className: "mb-3 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-baseline flex-wrap gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900 text-[11px] break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx("span", { className: "text-[9.5px] text-gray-400 whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-gray-500 mb-0.5 break-words", children: [
              e.company,
              e.location ? ` \xB7 ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx("p", { className: "text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx("ul", { className: "space-y-0.5 pl-3", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs("li", { className: "flex gap-2 text-[10.5px] text-gray-600 break-inside-avoid", children: [
              /* @__PURE__ */ jsx("span", { className: `mt-[3px] h-1 w-1 shrink-0 rounded-full ${ACCENT}` }),
              /* @__PURE__ */ jsx("span", { className: "leading-relaxed break-words min-w-0", children: r })
            ] }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx(SH, { children: "Skills" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 pl-4", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-700 border border-gray-200 rounded px-1.5 py-0.5 break-words", children: s }, i)) })
        ] }, "skills") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx(SH, { children: "Projects" }),
          /* @__PURE__ */ jsx("div", { className: "pl-4 space-y-3", children: projects.map((p, i) => /* @__PURE__ */ jsxs("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline gap-x-2", children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900 text-[11px] break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs("span", { className: "text-[9.5px] text-gray-400 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-gray-500 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx("div", { className: "text-[9px] text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: p.description })
          ] }, i)) })
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx(SH, { children: "Education" }),
          /* @__PURE__ */ jsx("div", { className: "pl-4 space-y-2", children: education.map((e, i) => /* @__PURE__ */ jsxs("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-baseline flex-wrap gap-1", children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900 text-[11px] break-words", children: e.degree }),
              /* @__PURE__ */ jsx("span", { className: "text-[9.5px] text-gray-400 shrink-0 whitespace-nowrap", children: e.year })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] text-gray-500 break-words", children: e.institution }),
            (e.gpa || e.details) && /* @__PURE__ */ jsx("div", { className: "text-[9.5px] text-gray-400 break-words", children: [e.gpa, e.details].filter(Boolean).join(" \u2014 ") })
          ] }, i)) })
        ] }, "education") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx(SH, { children: "Certifications" }),
          /* @__PURE__ */ jsx("div", { className: "pl-4 space-y-1", children: certifications.map((c, i) => /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-gray-600 break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs("span", { className: "text-gray-500", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs("span", { className: "text-gray-400", children: [
              " (",
              c.year,
              ")"
            ] })
          ] }, i)) })
        ] }, "certifications") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx(SH, { children: "Achievements" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-1 pl-4", children: achievements.map((a, i) => /* @__PURE__ */ jsxs("li", { className: "flex gap-2 text-[10.5px] text-gray-600 break-inside-avoid", children: [
            /* @__PURE__ */ jsx("span", { className: `mt-[3px] h-1 w-1 shrink-0 rounded-full ${ACCENT}` }),
            /* @__PURE__ */ jsx("span", { className: "leading-relaxed break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx(SH, { children: "Languages" }),
          /* @__PURE__ */ jsx("p", { className: P, children: languages.join("  \xB7  ") })
        ] }, "languages") : null;
      default:
        return /* @__PURE__ */ jsx(CustomBlock, { label: sec.label, content: (customSections || {})[sec.id], color: ACCENT }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs("div", { className: "resume-template modern max-w-4xl mx-auto bg-white px-8 pt-2 font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs("div", { className: "mb-4 pb-3 border-b border-gray-200", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-[22px] font-semibold text-gray-900 tracking-tight break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx("div", { className: "text-[11px] text-blue-700 font-medium mb-1 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-x-3 gap-y-0.5 text-[9.5px] text-gray-500", children: [
        personalInfo.email && /* @__PURE__ */ jsx("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/MinimalATSTemplate.jsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var CustomBlock2 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs2("div", { className: "mb-5 break-after-avoid", children: [
      /* @__PURE__ */ jsx2("h2", { className: "text-[9px] uppercase tracking-[0.35em] text-gray-400 mb-1.5", children: label }),
      /* @__PURE__ */ jsx2("div", { className: "space-y-0.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsx2("div", { className: "text-[11px] text-gray-500 leading-relaxed break-words break-inside-avoid", children: it }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs2("div", { className: "mb-5 break-after-avoid", children: [
    /* @__PURE__ */ jsx2("h2", { className: "text-[9px] uppercase tracking-[0.35em] text-gray-400 mb-1.5", children: label }),
    /* @__PURE__ */ jsx2("p", { className: "text-[11px] text-gray-500 leading-relaxed break-words", children: text })
  ] });
};
var MinimalATSTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const SH = ({ children }) => /* @__PURE__ */ jsx2("h2", { className: "text-[9px] uppercase tracking-[0.35em] text-gray-400 mb-1.5 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx2(CustomBlock2, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs2("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx2(SH, { children: "About" }),
          /* @__PURE__ */ jsx2("p", { className: "text-[11px] text-gray-700 leading-loose break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs2("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx2(SH, { children: "Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs2("div", { className: "mb-4 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs2("div", { className: "flex justify-between items-baseline flex-wrap gap-1", children: [
              /* @__PURE__ */ jsx2("span", { className: "text-[12px] font-medium text-gray-900 break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx2("span", { className: "text-[10px] text-gray-400 whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs2("div", { className: "text-[10.5px] text-gray-500 mb-1 break-words", children: [
              e.company,
              e.location ? ` \u2014 ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx2("p", { className: "text-[11px] text-gray-600 mb-1 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx2("div", { className: "text-[11px] text-gray-600 leading-relaxed", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsx2("div", { className: "break-inside-avoid break-words mb-0.5", children: r }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs2("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx2(SH, { children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsxs2("div", { className: "mb-2 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs2("div", { className: "flex justify-between items-baseline flex-wrap gap-1", children: [
              /* @__PURE__ */ jsx2("span", { className: "text-[11.5px] font-medium text-gray-900 break-words", children: e.degree }),
              /* @__PURE__ */ jsx2("span", { className: "text-[10px] text-gray-400 shrink-0 whitespace-nowrap", children: e.year })
            ] }),
            /* @__PURE__ */ jsx2("div", { className: "text-[10.5px] text-gray-500 break-words", children: e.institution }),
            (e.gpa || e.details) && /* @__PURE__ */ jsx2("div", { className: "text-[10px] text-gray-400 break-words", children: [e.details || "", e.gpa].filter(Boolean).join(" \u2014 ") })
          ] }, i))
        ] }, "education") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs2("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx2(SH, { children: "Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs2("div", { className: "mb-3 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs2("div", { className: "flex flex-wrap items-baseline gap-x-2", children: [
              /* @__PURE__ */ jsx2("span", { className: "text-[11.5px] font-medium text-gray-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs2("span", { className: "text-[10px] text-gray-400 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs2("div", { className: "text-[10.5px] text-gray-500 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx2("div", { className: "text-[9.5px] text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx2("p", { className: "text-[11px] text-gray-600 leading-relaxed break-words", children: p.description })
          ] }, i))
        ] }, "projects") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs2("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx2(SH, { children: "Skills" }),
          /* @__PURE__ */ jsx2("p", { className: "text-[11px] text-gray-700 leading-relaxed break-words", children: (Array.isArray(skills) ? skills : [skills]).join("   \xB7   ") })
        ] }, "skills") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs2("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx2(SH, { children: "Certifications" }),
          /* @__PURE__ */ jsx2("div", { className: "space-y-1", children: certifications.map((c, i) => /* @__PURE__ */ jsxs2("div", { className: "text-[11px] text-gray-600 break-words break-inside-avoid", children: [
            c.name,
            c.issuer && /* @__PURE__ */ jsxs2("span", { className: "text-gray-500", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs2("span", { className: "text-gray-400", children: [
              " (",
              c.year,
              ")"
            ] })
          ] }, i)) })
        ] }, "certifications") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs2("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx2(SH, { children: "Achievements" }),
          /* @__PURE__ */ jsx2("div", { className: "text-[11px] text-gray-600 leading-relaxed", children: achievements.map((a, i) => /* @__PURE__ */ jsx2("div", { className: "break-inside-avoid break-words mb-0.5", children: a }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs2("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx2(SH, { children: "Languages" }),
          /* @__PURE__ */ jsx2("p", { className: "text-[11px] text-gray-700 leading-relaxed break-words", children: languages.join("   \xB7   ") })
        ] }, "languages") : null;
      default:
        return /* @__PURE__ */ jsx2(CustomBlock2, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsx2("div", { className: "resume-template minimal max-w-4xl mx-auto bg-white px-12 pt-4 font-sans overflow-hidden", children: /* @__PURE__ */ jsxs2("div", { className: "border-t border-gray-200 mb-4", children: [
    personalInfo && /* @__PURE__ */ jsxs2("div", { className: "pt-3 mb-3", children: [
      /* @__PURE__ */ jsx2("h1", { className: "text-[24px] font-light text-gray-900 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx2("div", { className: "text-[12px] text-gray-500 mt-0.5 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs2("div", { className: "flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-[10px] text-gray-400", children: [
        personalInfo.email && /* @__PURE__ */ jsx2("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx2("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx2("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx2("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx2("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx2("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] }) });
};

// src/components/resume/templates/ExecutiveTemplate.jsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var CustomBlock3 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const SH = ({ children }) => /* @__PURE__ */ jsx3("h2", { className: "text-[11px] font-bold uppercase tracking-[0.22em] text-slate-800 border-b-[3px] border-slate-800 pb-1 mb-2 mt-5 break-after-avoid", children });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs3("div", { children: [
      /* @__PURE__ */ jsx3(SH, { children: label }),
      /* @__PURE__ */ jsx3("ul", { className: "space-y-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsx3("li", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: it }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs3("div", { children: [
    /* @__PURE__ */ jsx3(SH, { children: label }),
    /* @__PURE__ */ jsx3("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: text })
  ] });
};
var ExecutiveTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const SH = ({ children }) => /* @__PURE__ */ jsx3("h2", { className: "text-[11px] font-bold uppercase tracking-[0.22em] text-slate-800 border-b-[3px] border-slate-800 pb-1 mb-2 mt-5 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx3(CustomBlock3, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsx3("div", { className: "mt-4 bg-slate-50 border-l-4 border-slate-800 py-2 px-3", children: /* @__PURE__ */ jsx3("p", { className: "text-[11px] text-slate-800 italic font-medium leading-relaxed break-words", children: summary }) }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs3("div", { children: [
          /* @__PURE__ */ jsx3(SH, { children: "Professional Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs3("div", { className: "mb-3.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs3("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsx3("span", { className: "text-[12px] font-bold text-slate-900 break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx3("span", { className: "text-[10px] text-gray-400 uppercase tracking-wide shrink-0 whitespace-nowrap", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs3("div", { className: "text-[11px] text-slate-600 font-medium mb-1 break-words", children: [
              e.company,
              e.location ? ` | ${e.location}` : "",
              e.employmentType ? ` | ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx3("p", { className: "text-[10.5px] text-gray-600 mb-1 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx3("ul", { className: "space-y-0.5", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsx3("li", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: r }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs3("div", { children: [
          /* @__PURE__ */ jsx3(SH, { children: "Core Competencies" }),
          /* @__PURE__ */ jsx3("div", { className: "flex flex-wrap gap-1.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx3("span", { className: "text-[10px] border border-slate-300 text-slate-700 px-2 py-0.5 break-words", children: s }, i)) })
        ] }, "skills") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs3("div", { children: [
          /* @__PURE__ */ jsx3(SH, { children: "Selected Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs3("div", { className: "mb-2.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs3("div", { className: "flex items-baseline gap-x-2 flex-wrap", children: [
              /* @__PURE__ */ jsx3("span", { className: "text-[11.5px] font-bold text-slate-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs3("span", { className: "text-[10px] text-gray-400 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs3("div", { className: "text-[10.5px] text-slate-600 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx3("div", { className: "text-[9.5px] text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx3("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: p.description })
          ] }, i))
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs3("div", { children: [
          /* @__PURE__ */ jsx3(SH, { children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsxs3("div", { className: "mb-2 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs3("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsx3("span", { className: "text-[11.5px] font-bold text-slate-900 break-words", children: e.degree }),
              /* @__PURE__ */ jsx3("span", { className: "text-[10px] text-gray-400 uppercase tracking-wide shrink-0 whitespace-nowrap", children: e.year })
            ] }),
            /* @__PURE__ */ jsx3("div", { className: "text-[10.5px] text-slate-600 break-words", children: e.institution }),
            (e.gpa || e.details) && /* @__PURE__ */ jsx3("div", { className: "text-[10px] text-gray-500 break-words", children: [e.gpa, e.details].filter(Boolean).join(" \u2014 ") })
          ] }, i))
        ] }, "education") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs3("div", { children: [
          /* @__PURE__ */ jsx3(SH, { children: "Certifications" }),
          /* @__PURE__ */ jsx3("div", { className: "space-y-0.5", children: certifications.map((c, i) => /* @__PURE__ */ jsxs3("div", { className: "text-[10.5px] text-gray-600 break-words break-inside-avoid", children: [
            c.name,
            c.issuer ? ` \u2014 ${c.issuer}` : "",
            c.year ? ` (${c.year})` : ""
          ] }, i)) })
        ] }, "certifications") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs3("div", { children: [
          /* @__PURE__ */ jsx3(SH, { children: "Achievements" }),
          /* @__PURE__ */ jsx3("ul", { className: "space-y-0.5", children: achievements.map((a, i) => /* @__PURE__ */ jsx3("li", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: a }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs3("div", { children: [
          /* @__PURE__ */ jsx3(SH, { children: "Languages" }),
          /* @__PURE__ */ jsx3("p", { className: "text-[10.5px] text-gray-600 break-words", children: languages.join("  \xB7  ") })
        ] }, "languages") : null;
      default:
        return /* @__PURE__ */ jsx3(CustomBlock3, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs3("div", { className: "resume-template executive max-w-4xl mx-auto bg-white px-8 pt-2 font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs3("div", { className: "mb-2", children: [
      /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-4 border-b-[3px] border-slate-800 pb-2", children: [
        /* @__PURE__ */ jsx3("span", { className: "h-10 w-1.5 shrink-0 bg-slate-800 self-stretch" }),
        /* @__PURE__ */ jsxs3("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx3("h1", { className: "text-[26px] font-bold text-slate-900 uppercase tracking-[0.08em] break-words", children: personalInfo.fullName }),
          personalInfo.title && /* @__PURE__ */ jsx3("div", { className: "text-[13px] text-slate-500 uppercase tracking-[0.14em] mt-0.5 break-words", children: personalInfo.title })
        ] })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-[10px] uppercase tracking-wide text-gray-500", children: [
        personalInfo.email && /* @__PURE__ */ jsx3("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx3("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx3("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx3("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx3("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx3("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/FresherTemplate.jsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var CustomBlock4 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = /* @__PURE__ */ jsxs4("h2", { className: "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-800 mb-2 mt-1 break-after-avoid", children: [
    /* @__PURE__ */ jsx4("span", { className: "h-2 w-2 rounded-full bg-teal-600 shrink-0" }),
    label
  ] });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs4("div", { className: "mb-4 ml-4 border-l border-dashed border-teal-300 pl-4", children: [
      H,
      /* @__PURE__ */ jsx4("ul", { className: "space-y-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs4("li", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
        "\u2022 ",
        it
      ] }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs4("div", { className: "ml-4 border-l border-dashed border-teal-300 pl-4 mb-4", children: [
    H,
    /* @__PURE__ */ jsx4("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: text })
  ] });
};
var TimelineItem = ({ marker, title, sub, meta, summary, bullets, dotClass }) => /* @__PURE__ */ jsxs4("div", { className: "relative pl-5 pb-3 break-inside-avoid", children: [
  /* @__PURE__ */ jsx4("span", { className: `absolute left-0 top-1.5 h-2 w-2 rounded-full ${dotClass} border border-white shrink-0` }),
  /* @__PURE__ */ jsxs4("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
    /* @__PURE__ */ jsx4("span", { className: "text-[11px] font-semibold text-gray-900 break-words min-w-0", children: title }),
    meta && /* @__PURE__ */ jsx4("span", { className: `text-[9.5px] whitespace-nowrap shrink-0 ${marker === "edge" ? "" : "text-teal-700 font-medium"}`, children: meta })
  ] }),
  sub && /* @__PURE__ */ jsx4("div", { className: "text-[10px] text-gray-500 mb-0.5 break-words", children: sub }),
  summary && /* @__PURE__ */ jsx4("p", { className: "text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words", children: summary }),
  bullets?.length > 0 && /* @__PURE__ */ jsx4("ul", { className: "space-y-0.5", children: bullets.map((b, j) => /* @__PURE__ */ jsxs4("li", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
    "\u2022 ",
    b
  ] }, j)) })
] });
var FresherTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const H = ({ children }) => /* @__PURE__ */ jsxs4("h2", { className: "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-800 mb-2 mt-1 break-after-avoid", children: [
    /* @__PURE__ */ jsx4("span", { className: "h-2 w-2 rounded-full bg-teal-600 shrink-0" }),
    children
  ] });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx4(CustomBlock4, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs4("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx4(H, { children: "Objective" }),
          /* @__PURE__ */ jsx4("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs4("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx4(H, { children: "Experience" }),
          /* @__PURE__ */ jsx4("div", { className: "ml-1 border-l-2 border-teal-200 pl-3", children: experience.map((e, i) => /* @__PURE__ */ jsx4(TimelineItem, { marker: true, title: e.position, sub: `${e.company}${e.location ? ` \xB7 ${e.location}` : ""}${e.employmentType ? ` \xB7 ${e.employmentType}` : ""}`, meta: e.duration, summary: e.summary, bullets: e.responsibilities, dotClass: "bg-teal-500" }, i)) })
        ] }, "experience") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs4("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx4(H, { children: "Education" }),
          /* @__PURE__ */ jsxs4("div", { className: "ml-1 border-l-2 border-teal-200 pl-3", children: [
            education.map((e, i) => /* @__PURE__ */ jsx4(TimelineItem, { marker: true, title: e.degree, sub: e.institution, meta: e.year, summary: e.gpa || e.details ? [e.gpa, e.details].filter(Boolean).join(" \u2014 ") : null, dotClass: "bg-teal-400" }, i)),
            " "
          ] })
        ] }, "education") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs4("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx4(H, { children: "Projects" }),
          /* @__PURE__ */ jsx4("div", { className: "ml-1 border-l-2 border-teal-200 pl-3", children: projects.map((p, i) => /* @__PURE__ */ jsx4(TimelineItem, { marker: true, title: p.name, meta: p.role ? `${p.role}` : "", sub: p.technologies ? `Tech: ${p.technologies}` : "", summary: p.description, bullets: null, dotClass: "bg-teal-300" }, i)) })
        ] }, "projects") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs4("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx4(H, { children: "Skills" }),
          /* @__PURE__ */ jsx4("div", { className: "flex flex-wrap gap-1.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx4("span", { className: "text-[10px] bg-teal-50 text-teal-800 border border-teal-100 rounded-full px-2.5 py-0.5 break-words", children: s }, i)) })
        ] }, "skills") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs4("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx4(H, { children: "Certifications" }),
          /* @__PURE__ */ jsx4("div", { className: "space-y-1", children: certifications.map((c, i) => /* @__PURE__ */ jsxs4("div", { className: "text-[10.5px] text-gray-600 break-words break-inside-avoid", children: [
            "\u2022 ",
            c.name,
            c.issuer ? ` \u2014 ${c.issuer}` : "",
            c.year ? ` (${c.year})` : ""
          ] }, i)) })
        ] }, "certifications") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs4("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx4(H, { children: "Achievements" }),
          /* @__PURE__ */ jsx4("ul", { className: "space-y-1", children: achievements.map((a, i) => /* @__PURE__ */ jsxs4("li", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
            "\u2022 ",
            a
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs4("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx4(H, { children: "Languages" }),
          /* @__PURE__ */ jsx4("p", { className: "text-[10.5px] text-gray-600 break-words", children: languages.join("  \xB7  ") })
        ] }, "languages") : null;
      default:
        return /* @__PURE__ */ jsx4(CustomBlock4, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs4("div", { className: "resume-template fresher max-w-4xl mx-auto bg-white px-8 pt-3 font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs4("div", { className: "mb-3 pb-3 border-b border-teal-200", children: [
      /* @__PURE__ */ jsx4("h1", { className: "text-[22px] font-bold text-gray-900 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx4("div", { className: "text-[12px] text-teal-700 font-medium mt-0.5 mb-1.5 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs4("div", { className: "flex flex-wrap gap-x-3 gap-y-0.5 text-[9.5px] text-gray-500", children: [
        personalInfo.email && /* @__PURE__ */ jsx4("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx4("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx4("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx4("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx4("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx4("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/CreativeATSTemplate.jsx
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var CustomBlock5 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const SH = ({ children }) => /* @__PURE__ */ jsx5("h2", { className: "text-[10px] font-bold uppercase tracking-[0.26em] text-fuchsia-700 mb-2 mt-4 break-after-avoid", children: /* @__PURE__ */ jsx5("span", { className: "inline-block border-b-2 border-fuchsia-500 pb-0.5 break-words", children }) });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs5("div", { className: "mb-2", children: [
      /* @__PURE__ */ jsx5(SH, { children: label }),
      /* @__PURE__ */ jsx5("ul", { className: "space-y-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs5("li", { className: "flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
        /* @__PURE__ */ jsx5("span", { className: "text-fuchsia-500 shrink-0 mt-[2px]", children: "\u2726" }),
        /* @__PURE__ */ jsx5("span", { className: "break-words min-w-0", children: it })
      ] }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs5("div", { className: "mb-2", children: [
    /* @__PURE__ */ jsx5(SH, { children: label }),
    /* @__PURE__ */ jsx5("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: text })
  ] });
};
var CreativeATSTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const SH = ({ children }) => /* @__PURE__ */ jsx5("h2", { className: "text-[10px] font-bold uppercase tracking-[0.26em] text-fuchsia-700 mb-2 mt-4 break-after-avoid", children: /* @__PURE__ */ jsx5("span", { className: "inline-block border-b-2 border-fuchsia-500 pb-0.5 break-words", children }) });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx5(CustomBlock5, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs5("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx5("h2", { className: "text-[10px] font-bold uppercase tracking-[0.26em] text-fuchsia-700 mb-2 break-after-avoid", children: /* @__PURE__ */ jsx5("span", { className: "inline-block border-b-2 border-fuchsia-500 pb-0.5 break-words", children: "About Me" }) }),
          /* @__PURE__ */ jsx5("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs5("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx5(SH, { children: "Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs5("div", { className: "mb-3 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs5("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsx5("span", { className: "text-[11.5px] font-bold text-fuchsia-700 break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx5("span", { className: "text-[9.5px] text-gray-400 uppercase tracking-wide shrink-0 whitespace-nowrap", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs5("div", { className: "text-[10.5px] text-gray-500 mb-0.5 break-words", children: [
              e.company,
              e.location ? ` \xB7 ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx5("p", { className: "text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx5("ul", { className: "space-y-0.5", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs5("li", { className: "flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
              /* @__PURE__ */ jsx5("span", { className: "text-fuchsia-500 shrink-0 mt-[2px]", children: "\u2726" }),
              /* @__PURE__ */ jsx5("span", { className: "break-words min-w-0", children: r })
            ] }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs5("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx5(SH, { children: "Skills" }),
          /* @__PURE__ */ jsx5("div", { className: "flex flex-wrap gap-1.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx5("span", { className: "text-[10px] bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-200 rounded-full px-2.5 py-0.5 break-words", children: s }, i)) })
        ] }, "skills") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs5("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx5(SH, { children: "Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs5("div", { className: "mb-2.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs5("div", { className: "flex items-baseline gap-x-2 flex-wrap", children: [
              /* @__PURE__ */ jsx5("span", { className: "text-[11.5px] font-bold text-fuchsia-700 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs5("span", { className: "text-[10px] text-gray-400 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs5("div", { className: "text-[10.5px] text-gray-500 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx5("div", { className: "text-[9.5px] text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx5("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: p.description })
          ] }, i))
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs5("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx5(SH, { children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsxs5("div", { className: "mb-2 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs5("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsx5("span", { className: "text-[11.5px] font-bold text-fuchsia-700 break-words", children: e.degree }),
              /* @__PURE__ */ jsx5("span", { className: "text-[9.5px] text-gray-400 uppercase tracking-wide shrink-0 whitespace-nowrap", children: e.year })
            ] }),
            /* @__PURE__ */ jsx5("div", { className: "text-[10.5px] text-gray-500 break-words", children: e.institution }),
            (e.gpa || e.details) && /* @__PURE__ */ jsx5("div", { className: "text-[10px] text-gray-400 break-words", children: [e.gpa, e.details].filter(Boolean).join(" \u2014 ") })
          ] }, i))
        ] }, "education") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs5("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx5(SH, { children: "Certifications" }),
          /* @__PURE__ */ jsx5("div", { className: "space-y-0.5", children: certifications.map((c, i) => /* @__PURE__ */ jsxs5("div", { className: "text-[10.5px] text-gray-600 break-words break-inside-avoid", children: [
            "\u2726 ",
            c.name,
            c.issuer ? ` \u2014 ${c.issuer}` : "",
            c.year ? ` (${c.year})` : ""
          ] }, i)) })
        ] }, "certifications") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs5("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx5(SH, { children: "Achievements" }),
          /* @__PURE__ */ jsx5("ul", { className: "space-y-0.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs5("li", { className: "flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx5("span", { className: "text-fuchsia-500 shrink-0 mt-[2px]", children: "\u2726" }),
            /* @__PURE__ */ jsx5("span", { className: "break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs5("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx5(SH, { children: "Languages" }),
          /* @__PURE__ */ jsx5("p", { className: "text-[10.5px] text-gray-600 break-words", children: languages.join("  \xB7  ") })
        ] }, "languages") : null;
      default:
        return /* @__PURE__ */ jsx5(CustomBlock5, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs5("div", { className: "resume-template creative max-w-4xl mx-auto bg-white font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs5("div", { className: "bg-gradient-to-r from-fuchsia-700 via-purple-700 to-indigo-800 text-white px-8 py-6 mb-4", children: [
      /* @__PURE__ */ jsx5("h1", { className: "text-[26px] font-extrabold tracking-tight break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx5("div", { className: "text-[12px] text-fuchsia-100 font-medium mt-1 mb-2 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs5("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-white/90", children: [
        personalInfo.email && /* @__PURE__ */ jsx5("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx5("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx5("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx5("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx5("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx5("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    /* @__PURE__ */ jsx5("div", { className: "px-8 pb-2", children: activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec)) })
  ] });
};

// src/components/resume/templates/ClassicTemplate.jsx
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var CustomBlock6 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = /* @__PURE__ */ jsx6("h2", { className: "text-[11px] font-bold uppercase tracking-[0.2em] text-gray-800 text-center border-b border-t border-gray-300 py-0.5 mb-2 break-after-avoid", children: label });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs6("div", { children: [
      H,
      /* @__PURE__ */ jsx6("ul", { className: "space-y-0.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs6("li", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid", children: [
        "\u2022 ",
        it
      ] }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs6("div", { children: [
    H,
    /* @__PURE__ */ jsx6("p", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words", children: text })
  ] });
};
var ClassicTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const SH = ({ children }) => /* @__PURE__ */ jsx6("h2", { className: "text-[11px] font-bold uppercase tracking-[0.2em] text-gray-800 text-center border-b border-t border-gray-300 py-0.5 mb-2 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx6(CustomBlock6, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs6("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx6(SH, { children: "Objective" }),
          /* @__PURE__ */ jsx6("p", { className: "text-[10.5px] text-gray-700 text-center leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs6("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx6(SH, { children: "Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs6("div", { className: "mb-2 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs6("div", { className: "flex justify-between items-baseline flex-wrap gap-1", children: [
              /* @__PURE__ */ jsx6("span", { className: "font-bold text-gray-900 text-[11px] break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx6("span", { className: "text-[10px] text-gray-500 italic shrink-0 whitespace-nowrap", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs6("div", { className: "text-[10.5px] text-gray-600 italic mb-0.5 break-words", children: [
              e.company,
              e.location ? ` \u2014 ${e.location}` : "",
              e.employmentType ? ` (${e.employmentType})` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx6("p", { className: "text-[10.5px] text-gray-700 mb-0.5 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx6("ul", { className: "space-y-0.5", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs6("li", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid", children: [
              "\u2022 ",
              r
            ] }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs6("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx6(SH, { children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsxs6("div", { className: "mb-1 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs6("div", { className: "flex justify-between items-baseline flex-wrap gap-1", children: [
              /* @__PURE__ */ jsx6("span", { className: "font-bold text-gray-900 text-[11px] break-words", children: e.degree }),
              /* @__PURE__ */ jsx6("span", { className: "text-[10px] text-gray-500 italic shrink-0 whitespace-nowrap", children: e.year })
            ] }),
            /* @__PURE__ */ jsx6("div", { className: "text-[10.5px] text-gray-600 italic break-words", children: e.institution }),
            (e.gpa || e.details) && /* @__PURE__ */ jsx6("div", { className: "text-[10px] text-gray-500 break-words", children: [e.details || "", e.gpa].filter(Boolean).join(" \u2014 ") })
          ] }, i))
        ] }, "education") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs6("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx6(SH, { children: "Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs6("div", { className: "mb-2 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs6("div", { className: "flex flex-wrap items-baseline gap-x-2", children: [
              /* @__PURE__ */ jsx6("span", { className: "font-bold text-gray-900 text-[11px] break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs6("span", { className: "text-[10px] text-gray-500 italic break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs6("div", { className: "text-[10px] text-gray-500 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx6("div", { className: "text-[9.5px] text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx6("p", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words", children: p.description })
          ] }, i))
        ] }, "projects") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs6("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx6(SH, { children: "Skills" }),
          /* @__PURE__ */ jsx6("p", { className: "text-[10.5px] text-gray-700 text-center leading-relaxed break-words", children: (Array.isArray(skills) ? skills : [skills]).join("  \u2022  ") })
        ] }, "skills") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs6("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx6(SH, { children: "Certifications" }),
          /* @__PURE__ */ jsx6("div", { className: "space-y-0.5", children: certifications.map((c, i) => /* @__PURE__ */ jsxs6("div", { className: "text-[10.5px] text-gray-700 text-center break-words break-inside-avoid", children: [
            c.name,
            c.issuer && /* @__PURE__ */ jsxs6("span", { className: "text-gray-500", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs6("span", { className: "text-gray-400", children: [
              " (",
              c.year,
              ")"
            ] })
          ] }, i)) })
        ] }, "certifications") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs6("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx6(SH, { children: "Achievements" }),
          /* @__PURE__ */ jsx6("ul", { className: "space-y-0.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs6("li", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid", children: [
            "\u2022 ",
            a
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs6("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx6(SH, { children: "Languages" }),
          /* @__PURE__ */ jsx6("p", { className: "text-[10.5px] text-gray-700 text-center break-words", children: languages.join("  \xB7  ") })
        ] }, "languages") : null;
      default:
        return /* @__PURE__ */ jsx6(CustomBlock6, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs6("div", { className: "resume-template classic max-w-4xl mx-auto bg-white px-8 pt-2 font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs6("div", { className: "text-center mb-4", children: [
      /* @__PURE__ */ jsx6("h1", { className: "text-[24px] font-bold uppercase tracking-[0.15em] text-gray-900 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx6("div", { className: "text-[12px] text-gray-600 italic mt-0.5 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs6("div", { className: "flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1.5 text-[10px] text-gray-600", children: [
        personalInfo.email && /* @__PURE__ */ jsx6("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx6("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx6("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx6("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx6("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx6("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/CorporateTemplate.jsx
import { jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
var CustomBlock7 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = /* @__PURE__ */ jsx7("h2", { className: "text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900 border-b-2 border-blue-600 pb-0.5 mb-2 mt-4 break-after-avoid", children: label });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs7("div", { children: [
      H,
      /* @__PURE__ */ jsx7("ul", { className: "space-y-0.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs7("li", { className: "flex gap-2 text-[10.5px] text-gray-700 break-inside-avoid", children: [
        /* @__PURE__ */ jsx7("span", { className: "text-blue-600 shrink-0 mt-[2px]", children: "\u25AA" }),
        /* @__PURE__ */ jsx7("span", { className: "leading-relaxed break-words min-w-0", children: it })
      ] }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs7("div", { children: [
    H,
    /* @__PURE__ */ jsx7("p", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words", children: text })
  ] });
};
var CorporateTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const SH = ({ children }) => /* @__PURE__ */ jsx7("h2", { className: "text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900 border-b-2 border-blue-600 pb-0.5 mb-2 mt-4 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx7(CustomBlock7, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs7("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx7(SH, { children: "Professional Summary" }),
          /* @__PURE__ */ jsx7("p", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs7("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx7(SH, { children: "Professional Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs7("div", { className: "mb-3 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs7("div", { className: "flex justify-between items-start flex-wrap gap-1", children: [
              /* @__PURE__ */ jsx7("span", { className: "font-bold text-gray-900 text-[11px] break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx7("span", { className: "text-[10px] text-gray-500 whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs7("div", { className: "text-[10.5px] text-blue-700 font-medium mb-0.5 break-words", children: [
              e.company,
              e.location ? ` \xB7 ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx7("p", { className: "text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx7("ul", { className: "space-y-0.5", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs7("li", { className: "flex gap-2 text-[10.5px] text-gray-700 break-inside-avoid", children: [
              /* @__PURE__ */ jsx7("span", { className: "text-blue-600 shrink-0 mt-[2px]", children: "\u25AA" }),
              /* @__PURE__ */ jsx7("span", { className: "leading-relaxed break-words min-w-0", children: r })
            ] }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs7("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx7(SH, { children: "Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs7("div", { className: "mb-2 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs7("div", { className: "flex flex-wrap items-baseline gap-x-2", children: [
              /* @__PURE__ */ jsx7("span", { className: "font-bold text-gray-900 text-[11px] break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs7("span", { className: "text-[10px] text-gray-500 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs7("div", { className: "text-[10.5px] text-gray-600 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx7("div", { className: "text-[9.5px] text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx7("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: p.description })
          ] }, i))
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs7("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx7(SH, { children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsxs7("div", { className: "mb-2 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs7("div", { className: "flex justify-between items-start flex-wrap gap-1", children: [
              /* @__PURE__ */ jsx7("span", { className: "font-bold text-gray-900 text-[11px] break-words", children: e.degree }),
              /* @__PURE__ */ jsx7("span", { className: "text-[10px] text-gray-500 shrink-0 whitespace-nowrap", children: e.year })
            ] }),
            /* @__PURE__ */ jsx7("div", { className: "text-[10.5px] text-gray-700 break-words", children: e.institution }),
            (e.gpa || e.details) && /* @__PURE__ */ jsx7("div", { className: "text-[10px] text-gray-500 break-words", children: [e.gpa, e.details].filter(Boolean).join(" \u2014 ") })
          ] }, i))
        ] }, "education") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs7("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx7(SH, { children: "Core Skills" }),
          /* @__PURE__ */ jsx7("div", { className: "grid grid-cols-2 gap-x-4 gap-y-0.5 px-1", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsxs7("span", { className: "text-[10.5px] text-gray-700 flex items-center gap-1.5 break-words", children: [
            /* @__PURE__ */ jsx7("span", { className: "text-blue-600 shrink-0", children: "\u25AA" }),
            /* @__PURE__ */ jsx7("span", { className: "break-words min-w-0", children: s })
          ] }, i)) })
        ] }, "skills") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs7("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx7(SH, { children: "Certifications" }),
          /* @__PURE__ */ jsx7("div", { className: "space-y-0.5", children: certifications.map((c, i) => /* @__PURE__ */ jsxs7("div", { className: "text-[10.5px] text-gray-700 break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx7("span", { className: "font-medium", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs7("span", { className: "text-gray-500", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs7("span", { className: "text-gray-400", children: [
              " (",
              c.year,
              ")"
            ] })
          ] }, i)) })
        ] }, "certifications") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs7("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx7(SH, { children: "Achievements" }),
          /* @__PURE__ */ jsx7("ul", { className: "space-y-0.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs7("li", { className: "flex gap-2 text-[10.5px] text-gray-700 break-inside-avoid", children: [
            /* @__PURE__ */ jsx7("span", { className: "text-blue-600 shrink-0 mt-[2px]", children: "\u25AA" }),
            /* @__PURE__ */ jsx7("span", { className: "leading-relaxed break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs7("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx7(SH, { children: "Languages" }),
          /* @__PURE__ */ jsx7("p", { className: "text-[10.5px] text-gray-700 break-words", children: languages.join("  \xB7  ") })
        ] }, "languages") : null;
      default:
        return /* @__PURE__ */ jsx7(CustomBlock7, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs7("div", { className: "resume-template corporate max-w-4xl mx-auto bg-white font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs7("div", { className: "bg-gray-900 text-white px-8 py-5 mb-5", children: [
      /* @__PURE__ */ jsx7("h1", { className: "text-[22px] font-bold tracking-wide break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx7("div", { className: "text-[11px] text-blue-300 font-medium mt-0.5 mb-2 tracking-wide break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs7("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-300", children: [
        personalInfo.email && /* @__PURE__ */ jsx7("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx7("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx7("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx7("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx7("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx7("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    /* @__PURE__ */ jsx7("div", { className: "px-8 pb-2", children: activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec)) })
  ] });
};

// src/components/resume/templates/TraditionalTemplate.jsx
import { jsx as jsx8, jsxs as jsxs8 } from "react/jsx-runtime";
var CustomBlock8 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs8("div", { className: "mb-3 break-after-avoid", children: [
      /* @__PURE__ */ jsx8("h4", { className: "text-[11px] font-bold uppercase tracking-wide border-b border-gray-400 pb-0.5 mb-1", children: label }),
      /* @__PURE__ */ jsx8("ul", { className: "space-y-0.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsx8("li", { className: "text-[10px] leading-relaxed break-words break-inside-avoid", children: it }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs8("div", { className: "mb-3 break-after-avoid", children: [
    /* @__PURE__ */ jsx8("h4", { className: "text-[11px] font-bold uppercase tracking-wide border-b border-gray-400 pb-0.5 mb-1", children: label }),
    /* @__PURE__ */ jsx8("p", { className: "text-[10px] leading-relaxed break-words", children: text })
  ] });
};
var TraditionalTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  const secs = (type) => activeSections.filter((s) => s.type === type && s.key !== "basics");
  const mainSections = secs("standard").filter((s) => !["skills", "languages", "certifications", "achievements", "basics"].includes(s.key));
  const sideKeys = ["skills", "languages", "certifications", "achievements"];
  const renderMain = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx8(CustomBlock8, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "summary":
        return summary ? /* @__PURE__ */ jsxs8("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx8("h3", { className: "text-[12px] font-bold uppercase tracking-wide border-b border-gray-700 pb-0.5 mb-1.5 break-after-avoid", children: "Summary" }),
          /* @__PURE__ */ jsx8("p", { className: "text-[10.5px] leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs8("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx8("h3", { className: "text-[12px] font-bold uppercase tracking-wide border-b border-gray-700 pb-0.5 mb-1.5 break-after-avoid", children: "Professional Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs8("div", { className: "mb-2.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs8("div", { className: "flex flex-wrap items-baseline justify-between gap-1", children: [
              /* @__PURE__ */ jsx8("span", { className: "font-bold text-[11px] break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx8("span", { className: "text-[9.5px] italic whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs8("div", { className: "text-[10px] italic mb-0.5 break-words", children: [
              e.company,
              e.location ? `, ${e.location}` : "",
              e.employmentType ? ` (${e.employmentType})` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx8("p", { className: "text-[10.5px] mb-0.5 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx8("div", { className: "pl-3", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs8("div", { className: "text-[10.5px] leading-relaxed break-words break-inside-avoid", children: [
              "\u2022 ",
              r
            ] }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs8("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx8("h3", { className: "text-[12px] font-bold uppercase tracking-wide border-b border-gray-700 pb-0.5 mb-1.5 break-after-avoid", children: "Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs8("div", { className: "mb-2 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs8("div", { className: "flex flex-wrap items-baseline gap-x-2", children: [
              /* @__PURE__ */ jsx8("span", { className: "font-bold text-[11px] break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs8("span", { className: "text-[10px] italic break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs8("div", { className: "text-[10px] mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx8("div", { className: "text-[9px] break-all mb-0.5", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx8("p", { className: "text-[10.5px] leading-relaxed break-words", children: p.description })
          ] }, i))
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs8("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx8("h3", { className: "text-[12px] font-bold uppercase tracking-wide border-b border-gray-700 pb-0.5 mb-1.5 break-after-avoid", children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsxs8("div", { className: "mb-1.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs8("div", { className: "flex flex-wrap items-baseline justify-between gap-1", children: [
              /* @__PURE__ */ jsx8("span", { className: "font-bold text-[11px] break-words", children: e.degree }),
              /* @__PURE__ */ jsx8("span", { className: "text-[9.5px] italic shrink-0 whitespace-nowrap", children: e.year })
            ] }),
            /* @__PURE__ */ jsx8("div", { className: "text-[10px] italic break-words", children: e.institution }),
            (e.gpa || e.details) && /* @__PURE__ */ jsx8("div", { className: "text-[9.5px] break-words", children: [e.details, e.gpa].filter(Boolean).join(" \u2014 ") })
          ] }, i))
        ] }, "education") : null;
      default:
        return null;
    }
  };
  const renderSide = (sec) => {
    if (sec.type === "custom") {
      const c = (customSections || {})[sec.id];
      if (!c) return null;
      if (c.mode === "bullets" && !c.items?.filter(Boolean).length) return null;
      if (c.mode !== "bullets" && !c.text?.trim()) return null;
      return /* @__PURE__ */ jsxs8("div", { className: "mb-3 break-after-avoid", children: [
        /* @__PURE__ */ jsx8("h4", { className: "text-[11px] font-bold uppercase tracking-wide border-b border-gray-500 pb-0.5 mb-1", children: sec.label }),
        c.mode === "bullets" ? /* @__PURE__ */ jsx8("ul", { className: "space-y-0.5", children: c.items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsx8("li", { className: "text-[10px] leading-relaxed break-words break-inside-avoid", children: it }, i)) }) : /* @__PURE__ */ jsx8("p", { className: "text-[10px] leading-relaxed break-words", children: c.text })
      ] }, sec.id);
    }
    switch (sec.key) {
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs8("div", { className: "mb-3 break-after-avoid", children: [
          /* @__PURE__ */ jsx8("h4", { className: "text-[11px] font-bold uppercase tracking-wide border-b border-gray-500 pb-0.5 mb-1", children: "Skills" }),
          /* @__PURE__ */ jsx8("div", { className: "space-y-0.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx8("div", { className: "text-[10px] leading-relaxed break-words break-inside-avoid", children: s }, i)) })
        ] }, "skills") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs8("div", { className: "mb-3 break-after-avoid", children: [
          /* @__PURE__ */ jsx8("h4", { className: "text-[11px] font-bold uppercase tracking-wide border-b border-gray-500 pb-0.5 mb-1", children: "Languages" }),
          /* @__PURE__ */ jsx8("div", { className: "space-y-0.5", children: languages.map((l, i) => /* @__PURE__ */ jsx8("div", { className: "text-[10px] leading-relaxed break-words break-inside-avoid", children: l }, i)) })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs8("div", { className: "mb-3 break-after-avoid", children: [
          /* @__PURE__ */ jsx8("h4", { className: "text-[11px] font-bold uppercase tracking-wide border-b border-gray-500 pb-0.5 mb-1", children: "Certifications" }),
          /* @__PURE__ */ jsx8("div", { className: "space-y-0.5", children: certifications.map((c, i) => /* @__PURE__ */ jsxs8("div", { className: "text-[10px] leading-relaxed break-words break-inside-avoid", children: [
            c.name,
            c.year ? ` (${c.year})` : ""
          ] }, i)) })
        ] }, "certifications") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs8("div", { className: "mb-3 break-after-avoid", children: [
          /* @__PURE__ */ jsx8("h4", { className: "text-[11px] font-bold uppercase tracking-wide border-b border-gray-500 pb-0.5 mb-1", children: "Achievements" }),
          /* @__PURE__ */ jsx8("ul", { className: "space-y-0.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs8("li", { className: "text-[10px] leading-relaxed break-words break-inside-avoid", children: [
            "\u2022 ",
            a
          ] }, i)) })
        ] }, "achievements") : null;
      default:
        return null;
    }
  };
  const customSide = activeSections.filter((s) => s.type === "custom");
  return /* @__PURE__ */ jsx8("div", { className: "resume-template traditional max-w-4xl mx-auto bg-white font-serif text-gray-900 overflow-hidden", children: /* @__PURE__ */ jsxs8("div", { className: "flex", children: [
    /* @__PURE__ */ jsxs8("div", { className: "w-[34%] shrink-0 bg-gray-100 px-5 py-6", children: [
      personalInfo && /* @__PURE__ */ jsxs8("div", { className: "mb-5 break-after-avoid", children: [
        /* @__PURE__ */ jsx8("h1", { className: "text-[20px] font-bold leading-tight break-words", children: personalInfo.fullName }),
        personalInfo.title && /* @__PURE__ */ jsx8("div", { className: "text-[11px] italic mt-0.5 mb-2 break-words", children: personalInfo.title }),
        /* @__PURE__ */ jsxs8("div", { className: "space-y-1 text-[9.5px]", children: [
          personalInfo.email && /* @__PURE__ */ jsx8("div", { className: "break-all", children: personalInfo.email }),
          personalInfo.phone && /* @__PURE__ */ jsx8("div", { className: "break-words", children: personalInfo.phone }),
          personalInfo.location && /* @__PURE__ */ jsx8("div", { className: "break-words", children: personalInfo.location }),
          personalInfo.linkedin && /* @__PURE__ */ jsx8("div", { className: "break-all", children: personalInfo.linkedin }),
          personalInfo.github && /* @__PURE__ */ jsx8("div", { className: "break-all", children: personalInfo.github }),
          personalInfo.portfolio && /* @__PURE__ */ jsx8("div", { className: "break-all", children: personalInfo.portfolio })
        ] })
      ] }),
      activeSections.filter((s) => sideKeys.includes(s.key)).map((s) => renderSide(s)),
      customSide.map((s) => renderSide(s))
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "flex-1 px-6 py-6", children: [
      mainSections.map((s) => renderMain(s)),
      activeSections.filter((s) => s.type === "custom").map((s) => renderMain(s))
    ] })
  ] }) });
};

// src/components/resume/templates/CleanTemplate.jsx
import { jsx as jsx9, jsxs as jsxs9 } from "react/jsx-runtime";
var CustomBlock9 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs9("div", { className: "mb-3 break-after-avoid", children: [
      /* @__PURE__ */ jsx9("h3", { className: "text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-1", children: label }),
      /* @__PURE__ */ jsx9("div", { className: "space-y-0.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsx9("div", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: it }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs9("div", { className: "mb-3 break-after-avoid", children: [
    /* @__PURE__ */ jsx9("h3", { className: "text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-1", children: label }),
    /* @__PURE__ */ jsx9("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: text })
  ] });
};
var CleanTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  const leftKeys = ["skills", "languages", "certifications", "achievements", "summary"];
  const rightKeys = ["experience", "projects", "education"];
  const H = ({ children }) => /* @__PURE__ */ jsx9("h2", { className: "text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-1 break-after-avoid", children });
  const renderLeft = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx9(CustomBlock9, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "summary":
        return summary ? /* @__PURE__ */ jsxs9("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx9(H, { children: "Profile" }),
          /* @__PURE__ */ jsx9("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs9("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx9(H, { children: "Skills" }),
          /* @__PURE__ */ jsx9("div", { className: "space-y-0.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx9("div", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: s }, i)) })
        ] }, "skills") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs9("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx9(H, { children: "Languages" }),
          /* @__PURE__ */ jsx9("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: languages.join(" \xB7 ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs9("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx9(H, { children: "Certifications" }),
          /* @__PURE__ */ jsx9("div", { className: "space-y-0.5", children: certifications.map((c, i) => /* @__PURE__ */ jsxs9("div", { className: "text-[10.5px] text-gray-600 break-words break-inside-avoid", children: [
            c.name,
            c.year ? ` (${c.year})` : ""
          ] }, i)) })
        ] }, "certifications") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs9("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx9(H, { children: "Achievements" }),
          /* @__PURE__ */ jsx9("div", { className: "space-y-0.5", children: achievements.map((a, i) => /* @__PURE__ */ jsx9("div", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: a }, i)) })
        ] }, "achievements") : null;
      default:
        return null;
    }
  };
  const renderRight = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsxs9("div", { className: "mb-4", children: [
      sec.label && /* @__PURE__ */ jsx9("h2", { className: "text-[10px] font-bold uppercase tracking-[0.2em] text-gray-800 mb-1.5 break-after-avoid", children: sec.label }),
      (() => {
        const c = (customSections || {})[sec.id];
        if (!c) return null;
        if (c.mode === "bullets") {
          if (!c.items?.filter(Boolean).length) return null;
          return /* @__PURE__ */ jsx9("ul", { className: "space-y-1", children: c.items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs9("li", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
            "\u2022 ",
            it
          ] }, i)) });
        }
        if (!c.text?.trim()) return null;
        return /* @__PURE__ */ jsx9("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: c.text });
      })()
    ] }, sec.id);
    switch (sec.key) {
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs9("div", { children: [
          /* @__PURE__ */ jsx9(H, { children: "Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs9("div", { className: "mb-3.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs9("div", { className: "flex justify-between items-baseline flex-wrap gap-1", children: [
              /* @__PURE__ */ jsx9("span", { className: "font-semibold text-gray-900 text-[11.5px] break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx9("span", { className: "text-[10px] text-gray-400 whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs9("div", { className: "text-[10.5px] text-gray-500 mb-0.5 break-words", children: [
              e.company,
              e.location ? ` \xB7 ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx9("p", { className: "text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx9("ul", { className: "space-y-0.5 pl-3", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsx9("li", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", style: { listStyle: "disc" }, children: r }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs9("div", { children: [
          /* @__PURE__ */ jsx9(H, { children: "Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs9("div", { className: "mb-3 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs9("div", { className: "flex flex-wrap items-baseline gap-x-2", children: [
              /* @__PURE__ */ jsx9("span", { className: "font-semibold text-gray-900 text-[11.5px] break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs9("span", { className: "text-[10px] text-gray-400 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs9("div", { className: "text-[10.5px] text-gray-500 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx9("div", { className: "text-[9.5px] text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx9("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: p.description })
          ] }, i))
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs9("div", { children: [
          /* @__PURE__ */ jsx9(H, { children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsxs9("div", { className: "mb-2.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs9("div", { className: "flex justify-between items-baseline flex-wrap gap-1", children: [
              /* @__PURE__ */ jsx9("span", { className: "font-semibold text-gray-900 text-[11.5px] break-words", children: e.degree }),
              /* @__PURE__ */ jsx9("span", { className: "text-[10px] text-gray-400 shrink-0 whitespace-nowrap", children: e.year })
            ] }),
            /* @__PURE__ */ jsx9("div", { className: "text-[10.5px] text-gray-500 break-words", children: e.institution }),
            (e.gpa || e.details) && /* @__PURE__ */ jsx9("div", { className: "text-[10px] text-gray-400 break-words", children: [e.details, e.gpa].filter(Boolean).join(" \u2014 ") })
          ] }, i))
        ] }, "education") : null;
      default:
        return null;
    }
  };
  const leftSections = activeSections.filter((s) => leftKeys.includes(s.key) || s.type === "custom");
  const rightSections = activeSections.filter((s) => rightKeys.includes(s.key));
  return /* @__PURE__ */ jsx9("div", { className: "resume-template clean max-w-4xl mx-auto bg-white font-sans overflow-hidden", children: /* @__PURE__ */ jsxs9("div", { className: "flex", children: [
    /* @__PURE__ */ jsx9("div", { className: "w-[30%] shrink-0 px-7 py-6 border-r border-gray-100 bg-surface-50", children: leftSections.map((s) => renderLeft(s)) }),
    /* @__PURE__ */ jsxs9("div", { className: "flex-1 px-7 py-6 space-y-4", children: [
      personalInfo && /* @__PURE__ */ jsxs9("div", { className: "mb-1", children: [
        /* @__PURE__ */ jsx9("h1", { className: "text-[20px] font-medium text-gray-900 tracking-tight break-words", children: personalInfo.fullName }),
        personalInfo.title && /* @__PURE__ */ jsx9("div", { className: "text-[11px] text-gray-500 mb-1.5 break-words", children: personalInfo.title }),
        /* @__PURE__ */ jsxs9("div", { className: "flex flex-wrap gap-x-3 gap-y-0.5 text-[9.5px] text-gray-400", children: [
          personalInfo.email && /* @__PURE__ */ jsx9("span", { className: "break-all", children: personalInfo.email }),
          personalInfo.phone && /* @__PURE__ */ jsx9("span", { className: "break-words", children: personalInfo.phone }),
          personalInfo.location && /* @__PURE__ */ jsx9("span", { className: "break-words", children: personalInfo.location }),
          personalInfo.linkedin && /* @__PURE__ */ jsx9("span", { className: "break-all", children: personalInfo.linkedin }),
          personalInfo.github && /* @__PURE__ */ jsx9("span", { className: "break-all", children: personalInfo.github }),
          personalInfo.portfolio && /* @__PURE__ */ jsx9("span", { className: "break-all", children: personalInfo.portfolio })
        ] })
      ] }),
      rightSections.map((s) => renderRight(s))
    ] })
  ] }) });
};

// src/components/resume/templates/GraduateTemplate.jsx
import { jsx as jsx10, jsxs as jsxs10 } from "react/jsx-runtime";
var CustomBlock10 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const SH = ({ children }) => /* @__PURE__ */ jsx10("h2", { className: "text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700 mb-1.5 mt-3 break-after-avoid", children });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs10("div", { children: [
      /* @__PURE__ */ jsx10(SH, { children: label }),
      /* @__PURE__ */ jsx10("ul", { className: "space-y-0.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsx10("li", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid", children: it }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs10("div", { children: [
    /* @__PURE__ */ jsx10(SH, { children: label }),
    /* @__PURE__ */ jsx10("p", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words", children: text })
  ] });
};
var GraduateTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    customSections
  } = data;
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  const visible = (key) => activeSections.some((s) => s.type === "standard" && s.key === key);
  const SH = ({ children }) => /* @__PURE__ */ jsx10("h2", { className: "text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700 mb-1.5 mt-3 break-after-avoid", children });
  const renderMain = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx10(CustomBlock10, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs10("div", { children: [
          /* @__PURE__ */ jsx10(SH, { children: "Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs10("div", { className: "mb-2.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs10("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsx10("span", { className: "text-[11.5px] font-bold text-gray-900 break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx10("span", { className: "text-[10px] text-gray-400 whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs10("div", { className: "text-[10.5px] text-indigo-700 font-medium mb-0.5 break-words", children: [
              e.company,
              e.location ? ` \xB7 ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx10("p", { className: "text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx10("ul", { className: "space-y-0.5 pl-3", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsx10("li", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid", style: { listStyle: "disc" }, children: r }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs10("div", { children: [
          /* @__PURE__ */ jsx10(SH, { children: "Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs10("div", { className: "mb-2.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs10("div", { className: "flex items-baseline gap-x-2 flex-wrap", children: [
              /* @__PURE__ */ jsx10("span", { className: "text-[11.5px] font-bold text-gray-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs10("span", { className: "text-[10px] text-gray-400 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs10("div", { className: "text-[10.5px] text-indigo-700 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx10("div", { className: "text-[9.5px] text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx10("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: p.description })
          ] }, i))
        ] }, "projects") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs10("div", { children: [
          /* @__PURE__ */ jsx10(SH, { children: "Achievements" }),
          /* @__PURE__ */ jsx10("ul", { className: "space-y-0.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs10("li", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid", children: [
            "\u2713 ",
            a
          ] }, i)) })
        ] }, "achievements") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs10("div", { children: [
          /* @__PURE__ */ jsx10(SH, { children: "Certifications" }),
          /* @__PURE__ */ jsx10("div", { className: "space-y-0.5", children: certifications.map((c, i) => /* @__PURE__ */ jsxs10("div", { className: "text-[10.5px] text-gray-700 break-words break-inside-avoid", children: [
            c.name,
            c.issuer ? ` \u2014 ${c.issuer}` : "",
            c.year ? ` (${c.year})` : ""
          ] }, i)) })
        ] }, "certifications") : null;
      default:
        return null;
    }
  };
  const educationOrder = activeSections.filter((s) => s.key === "education");
  return /* @__PURE__ */ jsxs10("div", { className: "resume-template graduate max-w-4xl mx-auto bg-white px-8 pt-3 font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs10("div", { className: "text-center mb-3", children: [
      /* @__PURE__ */ jsx10("h1", { className: "text-[24px] font-bold tracking-tight text-gray-900 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx10("div", { className: "text-[12px] text-indigo-700 font-medium mt-0.5 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs10("div", { className: "flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1 text-[10px] text-gray-500", children: [
        personalInfo.email && /* @__PURE__ */ jsx10("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx10("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx10("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx10("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx10("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx10("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    summary && /* @__PURE__ */ jsx10("div", { className: "bg-indigo-50 rounded px-4 py-2.5 mb-3", children: /* @__PURE__ */ jsx10("p", { className: "text-[10.5px] text-indigo-900 leading-relaxed break-words", children: summary }) }),
    educationOrder.map((sec) => sec.visible && education?.length ? /* @__PURE__ */ jsxs10("div", { children: [
      /* @__PURE__ */ jsx10(SH, { children: "Education" }),
      education.map((e, i) => /* @__PURE__ */ jsxs10("div", { className: "mb-2.5 break-inside-avoid", children: [
        /* @__PURE__ */ jsxs10("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
          /* @__PURE__ */ jsx10("span", { className: "text-[11.5px] font-bold text-gray-900 break-words", children: e.degree }),
          /* @__PURE__ */ jsx10("span", { className: "text-[10px] text-gray-400 whitespace-nowrap shrink-0", children: e.year })
        ] }),
        /* @__PURE__ */ jsx10("div", { className: "text-[10.5px] text-indigo-700 font-medium mb-0.5 break-words", children: e.institution }),
        (e.gpa || e.details) && /* @__PURE__ */ jsx10("div", { className: "text-[10.5px] text-gray-600 break-words", children: [e.gpa, e.details].filter(Boolean).join(" \u2014 ") })
      ] }, i))
    ] }, "education") : null),
    skills?.length && visible("skills") && /* @__PURE__ */ jsxs10("div", { children: [
      /* @__PURE__ */ jsx10(SH, { children: "Skills" }),
      /* @__PURE__ */ jsx10("div", { className: "grid grid-cols-2 gap-x-6 gap-y-0.5 pl-1", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx10("div", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid", children: s }, i)) })
    ] }, "skills"),
    activeSections.filter((s) => !["basics", "summary", "education", "skills"].includes(s.key) && s.type === "standard").map((s) => renderMain(s)),
    activeSections.filter((s) => s.type === "custom").map((s) => renderMain(s))
  ] });
};

// src/components/resume/templates/TechTemplate.jsx
import { jsx as jsx11, jsxs as jsxs11 } from "react/jsx-runtime";
var CustomBlock11 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const SH = ({ children }) => /* @__PURE__ */ jsxs11("h2", { className: "text-[10px] font-bold uppercase tracking-[0.15em] text-gray-800 mt-3 mb-1.5 break-after-avoid", children: [
    "\u25B8 ",
    children
  ] });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs11("div", { children: [
      /* @__PURE__ */ jsx11(SH, { children: label }),
      /* @__PURE__ */ jsx11("ul", { className: "space-y-0.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs11("li", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
        "$ ",
        it
      ] }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs11("div", { children: [
    /* @__PURE__ */ jsx11(SH, { children: label }),
    /* @__PURE__ */ jsx11("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: text })
  ] });
};
var TechTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const SH = ({ children }) => /* @__PURE__ */ jsxs11("h2", { className: "text-[10px] font-bold uppercase tracking-[0.15em] text-gray-800 mt-3 mb-1.5 break-after-avoid", children: [
    "\u25B8 ",
    children
  ] });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx11(CustomBlock11, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs11("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx11(SH, { children: "profile" }),
          /* @__PURE__ */ jsx11("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs11("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx11(SH, { children: "skills" }),
          /* @__PURE__ */ jsx11("div", { className: "grid gap-x-4 gap-y-0.5 px-1 grid-cols-3", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx11("span", { className: "text-[10.5px] text-gray-700 break-words break-inside-avoid", children: s }, i)) })
        ] }, "skills") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs11("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx11(SH, { children: "experience //" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs11("div", { className: "mb-3 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs11("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsxs11("span", { className: "text-[11.5px] font-bold text-gray-900 break-words min-w-0", children: [
                e.position,
                " ",
                /* @__PURE__ */ jsxs11("span", { className: "text-emerald-700 font-medium", children: [
                  "@ ",
                  e.company
                ] })
              ] }),
              /* @__PURE__ */ jsx11("span", { className: "text-[10px] text-gray-400 whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs11("div", { className: "text-[10px] text-gray-500 mb-0.5 break-words", children: [
              e.location ? `${e.location} ` : "",
              e.employmentType ? `\xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx11("p", { className: "text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx11("ul", { className: "space-y-0.5", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs11("li", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
              /* @__PURE__ */ jsx11("span", { className: "text-emerald-700", children: "$ " }),
              r
            ] }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs11("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx11(SH, { children: "projects //" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs11("div", { className: "mb-2.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs11("div", { className: "flex items-baseline gap-x-2 flex-wrap", children: [
              /* @__PURE__ */ jsx11("span", { className: "text-[11.5px] font-bold text-gray-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs11("span", { className: "text-[10px] text-gray-400 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsx11("div", { className: "text-[10.5px] text-emerald-700 mb-0.5 break-words", children: `// ${p.technologies}` }),
            (p.link || p.github) && /* @__PURE__ */ jsx11("div", { className: "text-[9.5px] text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx11("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: p.description })
          ] }, i))
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs11("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx11(SH, { children: "edu" }),
          education.map((e, i) => /* @__PURE__ */ jsxs11("div", { className: "mb-2 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs11("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsx11("span", { className: "text-[11px] font-bold text-gray-900 break-words", children: e.degree }),
              /* @__PURE__ */ jsx11("span", { className: "text-[10px] text-gray-400 shrink-0 whitespace-nowrap", children: e.year })
            ] }),
            /* @__PURE__ */ jsx11("div", { className: "text-[10.5px] text-emerald-700 font-medium break-words", children: e.institution }),
            (e.gpa || e.details) && /* @__PURE__ */ jsx11("div", { className: "text-[10px] text-gray-500 break-words", children: [e.gpa, e.details].filter(Boolean).join(" \u2014 ") })
          ] }, i))
        ] }, "education") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs11("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx11(SH, { children: "certs" }),
          /* @__PURE__ */ jsx11("div", { className: "space-y-0.5", children: certifications.map((c, i) => /* @__PURE__ */ jsxs11("div", { className: "text-[10.5px] text-gray-600 break-words break-inside-avoid", children: [
            c.name,
            c.issuer ? ` \u2014 ${c.issuer}` : "",
            c.year ? ` (${c.year})` : ""
          ] }, i)) })
        ] }, "certifications") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs11("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx11(SH, { children: "achievements" }),
          /* @__PURE__ */ jsx11("ul", { className: "space-y-0.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs11("li", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx11("span", { className: "text-emerald-700", children: "$ " }),
            a
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs11("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx11(SH, { children: "langs" }),
          /* @__PURE__ */ jsx11("p", { className: "text-[10.5px] text-gray-600 break-words", children: languages.join("  \xB7  ") })
        ] }, "languages") : null;
      default:
        return /* @__PURE__ */ jsx11(CustomBlock11, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs11("div", { className: "resume-template tech max-w-4xl mx-auto bg-white font-mono overflow-hidden", children: [
    /* @__PURE__ */ jsxs11("div", { className: "bg-gray-900 text-emerald-400 px-8 py-3.5 mb-4", children: [
      /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-1.5 mb-1.5", children: [
        /* @__PURE__ */ jsx11("span", { className: "h-2.5 w-2.5 rounded-full bg-red-500" }),
        /* @__PURE__ */ jsx11("span", { className: "h-2.5 w-2.5 rounded-full bg-yellow-500" }),
        /* @__PURE__ */ jsx11("span", { className: "h-2.5 w-2.5 rounded-full bg-green-500" }),
        /* @__PURE__ */ jsx11("span", { className: "ml-2 text-[9px] text-gray-500", children: "~/resume" })
      ] }),
      personalInfo && /* @__PURE__ */ jsxs11("div", { children: [
        /* @__PURE__ */ jsx11("h1", { className: "text-[20px] font-bold text-emerald-300 break-words", children: personalInfo.fullName }),
        personalInfo.title && /* @__PURE__ */ jsx11("div", { className: "text-[11px] text-gray-300 mt-0.5 mb-1.5 break-words", children: personalInfo.title }),
        /* @__PURE__ */ jsxs11("div", { className: "flex flex-wrap gap-x-4 gap-y-0.5 text-[9.5px] text-gray-400", children: [
          personalInfo.email && /* @__PURE__ */ jsx11("span", { className: "break-all", children: personalInfo.email }),
          personalInfo.phone && /* @__PURE__ */ jsx11("span", { className: "break-words", children: personalInfo.phone }),
          personalInfo.location && /* @__PURE__ */ jsx11("span", { className: "break-words", children: personalInfo.location }),
          personalInfo.linkedin && /* @__PURE__ */ jsx11("span", { className: "break-all", children: personalInfo.linkedin }),
          personalInfo.github && /* @__PURE__ */ jsx11("span", { className: "break-all", children: personalInfo.github }),
          personalInfo.portfolio && /* @__PURE__ */ jsx11("span", { className: "break-all", children: personalInfo.portfolio })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx11("div", { className: "px-8 pb-2", children: activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec)) })
  ] });
};

// src/components/resume/templates/EngineeringTemplate.jsx
import { jsx as jsx12, jsxs as jsxs12 } from "react/jsx-runtime";
var CustomBlock12 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs12("div", { className: "mb-3 break-after-avoid", children: [
      /* @__PURE__ */ jsx12("h4", { className: "text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800 mb-1", children: label }),
      /* @__PURE__ */ jsx12("div", { className: "space-y-0.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsx12("div", { className: "text-[10px] text-gray-700 leading-relaxed break-words break-inside-avoid", children: it }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs12("div", { className: "mb-3 break-after-avoid", children: [
    /* @__PURE__ */ jsx12("h4", { className: "text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800 mb-1", children: label }),
    /* @__PURE__ */ jsx12("p", { className: "text-[10px] text-gray-700 leading-relaxed break-words", children: text })
  ] });
};
var EngineeringTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  const sideKeys = ["skills", "certifications", "languages", "achievements"];
  const Hmain = ({ children }) => /* @__PURE__ */ jsxs12("h3", { className: "flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-900 mb-1.5 mt-1 break-after-avoid", children: [
    /* @__PURE__ */ jsx12("span", { className: "w-6 h-0.5 bg-emerald-600 shrink-0 inline-block" }),
    children
  ] });
  const renderSide = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx12(CustomBlock12, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs12("div", { className: "mb-4 break-after-avoid", children: [
          /* @__PURE__ */ jsx12("h4", { className: "text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800 mb-1", children: "Skills" }),
          /* @__PURE__ */ jsx12("div", { className: "space-y-0.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx12("div", { className: "text-[10px] text-gray-700 leading-relaxed break-words break-inside-avoid", children: s }, i)) })
        ] }, "skills") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs12("div", { className: "mb-4 break-after-avoid", children: [
          /* @__PURE__ */ jsx12("h4", { className: "text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800 mb-1", children: "Certifications" }),
          /* @__PURE__ */ jsx12("div", { className: "space-y-0.5", children: certifications.map((c, i) => /* @__PURE__ */ jsxs12("div", { className: "text-[10px] text-gray-700 break-words break-inside-avoid", children: [
            c.name,
            c.year ? ` (${c.year})` : ""
          ] }, i)) })
        ] }, "certifications") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs12("div", { className: "mb-4 break-after-avoid", children: [
          /* @__PURE__ */ jsx12("h4", { className: "text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800 mb-1", children: "Languages" }),
          /* @__PURE__ */ jsx12("div", { className: "space-y-0.5", children: languages.map((l, i) => /* @__PURE__ */ jsx12("div", { className: "text-[10px] text-gray-700 break-words break-inside-avoid", children: l }, i)) })
        ] }, "languages") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs12("div", { className: "mb-4 break-after-avoid", children: [
          /* @__PURE__ */ jsx12("h4", { className: "text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800 mb-1", children: "Achievements" }),
          /* @__PURE__ */ jsx12("div", { className: "space-y-0.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs12("div", { className: "text-[10px] text-gray-700 break-words break-inside-avoid", children: [
            "\u2022 ",
            a
          ] }, i)) })
        ] }, "achievements") : null;
      default:
        return null;
    }
  };
  const renderMain = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsxs12("div", { className: "mb-4 break-after-avoid", children: [
      sec.label && /* @__PURE__ */ jsxs12("h3", { className: "flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-900 mb-1.5 break-after-avoid", children: [
        /* @__PURE__ */ jsx12("span", { className: "w-6 h-0.5 bg-emerald-600 shrink-0 inline-block" }),
        sec.label
      ] }),
      (() => {
        const c = (customSections || {})[sec.id];
        if (!c) return null;
        if (c.mode === "bullets") {
          if (!c.items?.filter(Boolean).length) return null;
          return /* @__PURE__ */ jsx12("ul", { className: "space-y-0.5", children: c.items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs12("li", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid", children: [
            "\u2022 ",
            it
          ] }, i)) });
        }
        if (!c.text?.trim()) return null;
        return /* @__PURE__ */ jsx12("p", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words", children: c.text });
      })()
    ] }, sec.id);
    switch (sec.key) {
      case "summary":
        return summary ? /* @__PURE__ */ jsxs12("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsxs12("h3", { className: "flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-900 mb-1.5 break-after-avoid", children: [
            /* @__PURE__ */ jsx12("span", { className: "w-6 h-0.5 bg-emerald-600 shrink-0 inline-block" }),
            "Professional Summary"
          ] }),
          /* @__PURE__ */ jsx12("p", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs12("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx12(Hmain, { children: "Professional Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs12("div", { className: "mb-3 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs12("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsx12("span", { className: "font-semibold text-gray-900 text-[11.5px] break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx12("span", { className: "text-[10px] text-emerald-700 font-medium shrink-0 whitespace-nowrap", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs12("div", { className: "text-[10.5px] text-gray-500 mb-0.5 break-words", children: [
              e.company,
              e.location ? ` \xB7 ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx12("p", { className: "text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx12("ul", { className: "space-y-0.5 pl-3", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs12("li", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid", children: [
              /* @__PURE__ */ jsx12("span", { className: "text-emerald-600 mr-1", children: "\u25B8" }),
              r
            ] }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs12("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx12(Hmain, { children: "Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs12("div", { className: "mb-2.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs12("div", { className: "flex items-baseline gap-x-2 flex-wrap", children: [
              /* @__PURE__ */ jsx12("span", { className: "font-semibold text-gray-900 text-[11.5px] break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs12("span", { className: "text-[10px] text-gray-400 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs12("div", { className: "text-[10.5px] text-emerald-700 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx12("div", { className: "text-[9.5px] text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx12("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: p.description })
          ] }, i))
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs12("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx12(Hmain, { children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsxs12("div", { className: "mb-2 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs12("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsx12("span", { className: "font-semibold text-gray-900 text-[11.5px] break-words", children: e.degree }),
              /* @__PURE__ */ jsx12("span", { className: "text-[10px] text-emerald-700 font-medium shrink-0 whitespace-nowrap", children: e.year })
            ] }),
            /* @__PURE__ */ jsx12("div", { className: "text-[10.5px] text-gray-500 break-words", children: e.institution }),
            (e.gpa || e.details) && /* @__PURE__ */ jsx12("div", { className: "text-[10px] text-gray-500 break-words", children: [e.gpa, e.details].filter(Boolean).join(" \u2014 ") })
          ] }, i))
        ] }, "education") : null;
      default:
        return null;
    }
  };
  const customSide = activeSections.filter((s) => s.type === "custom");
  const sideSections = activeSections.filter((s) => sideKeys.includes(s.key)).concat(customSide);
  const mainSections = activeSections.filter((s) => !sideKeys.includes(s.key) && !["basics"].includes(s.key));
  return /* @__PURE__ */ jsx12("div", { className: "resume-template engineering max-w-4xl mx-auto bg-white font-sans overflow-hidden", children: /* @__PURE__ */ jsxs12("div", { className: "flex", children: [
    /* @__PURE__ */ jsxs12("div", { className: "w-[30%] shrink-0 bg-emerald-50/60 px-5 py-6", children: [
      personalInfo && /* @__PURE__ */ jsxs12("div", { className: "mb-4 break-after-avoid", children: [
        /* @__PURE__ */ jsx12("h1", { className: "text-[20px] font-bold text-gray-900 leading-tight break-words", children: personalInfo.fullName }),
        personalInfo.title && /* @__PURE__ */ jsx12("div", { className: "text-[11px] text-emerald-700 font-medium mt-0.5 break-words", children: personalInfo.title }),
        /* @__PURE__ */ jsxs12("div", { className: "mt-2 space-y-1 text-[9.5px] text-gray-600", children: [
          personalInfo.email && /* @__PURE__ */ jsx12("div", { className: "break-all", children: personalInfo.email }),
          personalInfo.phone && /* @__PURE__ */ jsx12("div", { className: "break-words", children: personalInfo.phone }),
          personalInfo.location && /* @__PURE__ */ jsx12("div", { className: "break-words", children: personalInfo.location }),
          personalInfo.linkedin && /* @__PURE__ */ jsx12("div", { className: "break-all", children: personalInfo.linkedin }),
          personalInfo.github && /* @__PURE__ */ jsx12("div", { className: "break-all", children: personalInfo.github }),
          personalInfo.portfolio && /* @__PURE__ */ jsx12("div", { className: "break-all", children: personalInfo.portfolio })
        ] })
      ] }),
      sideSections.map((s) => renderSide(s))
    ] }),
    /* @__PURE__ */ jsx12("div", { className: "flex-1 px-7 py-6 space-y-1", children: mainSections.map((s) => renderMain(s)) })
  ] }) });
};

// src/components/resume/templates/LeadershipTemplate.jsx
import { jsx as jsx13, jsxs as jsxs13 } from "react/jsx-runtime";
var CustomBlock13 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const SH = ({ children }) => /* @__PURE__ */ jsxs13("h2", { className: "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-800 mb-1.5 mt-3 break-after-avoid", children: [
    /* @__PURE__ */ jsx13("span", { className: "h-3 w-1 bg-amber-600 shrink-0 inline-block" }),
    /* @__PURE__ */ jsx13("span", { className: "break-words", children })
  ] });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs13("div", { children: [
      /* @__PURE__ */ jsx13(SH, { children: label }),
      /* @__PURE__ */ jsx13("ul", { className: "space-y-0.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsx13("li", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: it }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs13("div", { children: [
    /* @__PURE__ */ jsx13(SH, { children: label }),
    /* @__PURE__ */ jsx13("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: text })
  ] });
};
var LeadershipTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const SH = ({ children }) => /* @__PURE__ */ jsxs13("h2", { className: "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-800 mb-1.5 mt-3 break-after-avoid", children: [
    /* @__PURE__ */ jsx13("span", { className: "h-3 w-1 bg-amber-600 shrink-0 inline-block" }),
    /* @__PURE__ */ jsx13("span", { className: "break-words", children })
  ] });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx13(CustomBlock13, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs13("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsxs13("h2", { className: "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-800 mb-1.5 break-after-avoid", children: [
            /* @__PURE__ */ jsx13("span", { className: "h-3 w-1 bg-amber-600 shrink-0 inline-block" }),
            "Executive Summary"
          ] }),
          /* @__PURE__ */ jsx13("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs13("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx13(SH, { children: "Leadership Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs13("div", { className: "mb-3 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs13("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsx13("span", { className: "text-[11.5px] font-bold text-gray-900 break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx13("span", { className: "text-[10px] text-amber-700 font-medium shrink-0 whitespace-nowrap", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs13("div", { className: "text-[10.5px] text-gray-500 mb-0.5 break-words", children: [
              e.company,
              e.location ? ` \xB7 ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx13("p", { className: "text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx13("ul", { className: "space-y-0.5 pl-3", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsx13("li", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", style: { listStyle: "disc" }, children: r }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs13("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx13(SH, { children: "Core Skills" }),
          /* @__PURE__ */ jsx13("div", { className: "flex flex-wrap gap-1.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx13("span", { className: "text-[10px] bg-amber-50 text-amber-800 border border-amber-200 rounded-sm px-2 py-0.5 break-words", children: s }, i)) })
        ] }, "skills") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs13("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx13(SH, { children: "Notable Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs13("div", { className: "mb-2.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs13("div", { className: "flex items-baseline gap-x-2 flex-wrap", children: [
              /* @__PURE__ */ jsx13("span", { className: "text-[11.5px] font-bold text-gray-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs13("span", { className: "text-[10px] text-gray-400 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs13("div", { className: "text-[10.5px] text-gray-500 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx13("div", { className: "text-[9.5px] text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx13("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: p.description })
          ] }, i))
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs13("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx13(SH, { children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsxs13("div", { className: "mb-2 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs13("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsx13("span", { className: "text-[11.5px] font-bold text-gray-900 break-words", children: e.degree }),
              /* @__PURE__ */ jsx13("span", { className: "text-[10px] text-amber-700 font-medium shrink-0 whitespace-nowrap", children: e.year })
            ] }),
            /* @__PURE__ */ jsx13("div", { className: "text-[10.5px] text-gray-500 break-words", children: e.institution }),
            (e.gpa || e.details) && /* @__PURE__ */ jsx13("div", { className: "text-[10px] text-gray-500 break-words", children: [e.gpa, e.details].filter(Boolean).join(" \u2014 ") })
          ] }, i))
        ] }, "education") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs13("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx13(SH, { children: "Certifications" }),
          /* @__PURE__ */ jsx13("div", { className: "space-y-0.5", children: certifications.map((c, i) => /* @__PURE__ */ jsxs13("div", { className: "text-[10.5px] text-gray-600 break-words break-inside-avoid", children: [
            c.name,
            c.issuer ? ` \u2014 ${c.issuer}` : "",
            c.year ? ` (${c.year})` : ""
          ] }, i)) })
        ] }, "certifications") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs13("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx13(SH, { children: "Achievements" }),
          /* @__PURE__ */ jsx13("ul", { className: "space-y-0.5", children: achievements.map((a, i) => /* @__PURE__ */ jsx13("li", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: a }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs13("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx13(SH, { children: "Languages" }),
          /* @__PURE__ */ jsx13("p", { className: "text-[10.5px] text-gray-600 break-words", children: languages.join("  \xB7  ") })
        ] }, "languages") : null;
      default:
        return /* @__PURE__ */ jsx13(CustomBlock13, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsx13("div", { className: "resume-template leadership max-w-4xl mx-auto bg-white font-sans overflow-hidden", children: /* @__PURE__ */ jsxs13("div", { className: "flex", children: [
    /* @__PURE__ */ jsx13("div", { className: "w-[26%] shrink-0 bg-gray-900 px-4 py-6 text-white", children: personalInfo && /* @__PURE__ */ jsxs13("div", { className: "break-after-avoid", children: [
      /* @__PURE__ */ jsx13("h1", { className: "text-[18px] font-bold leading-tight break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx13("div", { className: "text-[10.5px] text-amber-400 font-medium mt-0.5 mb-3 uppercase tracking-wide break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs13("div", { className: "space-y-1.5 text-[9px] text-gray-300", children: [
        personalInfo.email && /* @__PURE__ */ jsx13("div", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx13("div", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx13("div", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx13("div", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx13("div", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx13("div", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx13("div", { className: "flex-1 px-7 py-6", children: activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec)) })
  ] }) });
};

// src/components/resume/templates/DesignerTemplate.jsx
import { jsx as jsx14, jsxs as jsxs14 } from "react/jsx-runtime";
var CustomBlock14 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs14("div", { className: "mb-3 break-after-avoid", children: [
      /* @__PURE__ */ jsx14("h4", { className: "text-[9.5px] font-bold uppercase tracking-[0.22em] text-orange-400 mb-1", children: label }),
      /* @__PURE__ */ jsx14("div", { className: "space-y-0.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsx14("div", { className: "text-[10px] text-gray-100 leading-relaxed break-words break-inside-avoid", children: it }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs14("div", { className: "mb-3 break-after-avoid", children: [
    /* @__PURE__ */ jsx14("h4", { className: "text-[9.5px] font-bold uppercase tracking-[0.22em] text-orange-400 mb-1", children: label }),
    /* @__PURE__ */ jsx14("p", { className: "text-[10px] text-gray-100 leading-relaxed break-words", children: text })
  ] });
};
var DesignerTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  const sideKeys = ["skills", "languages", "certifications", "achievements"];
  const SH = ({ children }) => /* @__PURE__ */ jsxs14("h3", { className: "flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-600 mb-1.5 mt-1 break-after-avoid", children: [
    /* @__PURE__ */ jsx14("span", { className: "h-2.5 w-2.5 rounded-full bg-orange-500 shrink-0 inline-block" }),
    /* @__PURE__ */ jsx14("span", { className: "break-words", children })
  ] });
  const renderSide = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx14(CustomBlock14, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs14("div", { className: "mb-4 break-after-avoid", children: [
          /* @__PURE__ */ jsx14("h4", { className: "text-[9.5px] font-bold uppercase tracking-[0.22em] text-orange-400 mb-1", children: "Skills" }),
          /* @__PURE__ */ jsx14("div", { className: "flex flex-wrap gap-1", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx14("span", { className: "text-[9.5px] bg-white/10 text-gray-100 rounded-full px-2 py-0.5 break-words", children: s }, i)) })
        ] }, "skills") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs14("div", { className: "mb-4 break-after-avoid", children: [
          /* @__PURE__ */ jsx14("h4", { className: "text-[9.5px] font-bold uppercase tracking-[0.22em] text-orange-400 mb-1", children: "Languages" }),
          /* @__PURE__ */ jsx14("div", { className: "space-y-0.5", children: languages.map((l, i) => /* @__PURE__ */ jsx14("div", { className: "text-[10px] text-gray-100 break-words break-inside-avoid", children: l }, i)) })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs14("div", { className: "mb-4 break-after-avoid", children: [
          /* @__PURE__ */ jsx14("h4", { className: "text-[9.5px] font-bold uppercase tracking-[0.22em] text-orange-400 mb-1", children: "Certifications" }),
          /* @__PURE__ */ jsx14("div", { className: "space-y-0.5", children: certifications.map((c, i) => /* @__PURE__ */ jsxs14("div", { className: "text-[10px] text-gray-100 break-words break-inside-avoid", children: [
            c.name,
            c.year ? ` (${c.year})` : ""
          ] }, i)) })
        ] }, "certifications") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs14("div", { className: "mb-4 break-after-avoid", children: [
          /* @__PURE__ */ jsx14("h4", { className: "text-[9.5px] font-bold uppercase tracking-[0.22em] text-orange-400 mb-1", children: "Achievements" }),
          /* @__PURE__ */ jsx14("div", { className: "space-y-0.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs14("div", { className: "text-[10px] text-gray-100 leading-relaxed break-words break-inside-avoid", children: [
            "\u2022 ",
            a
          ] }, i)) })
        ] }, "achievements") : null;
      default:
        return null;
    }
  };
  const renderMain = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsxs14("div", { className: "mb-4 break-after-avoid", children: [
      sec.label && /* @__PURE__ */ jsxs14("h3", { className: "flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-600 mb-1.5 break-after-avoid", children: [
        /* @__PURE__ */ jsx14("span", { className: "h-2.5 w-2.5 rounded-full bg-orange-500 shrink-0 inline-block" }),
        /* @__PURE__ */ jsx14("span", { className: "break-words", children: sec.label })
      ] }),
      (() => {
        const c = (customSections || {})[sec.id];
        if (!c) return null;
        if (c.mode === "bullets") {
          if (!c.items?.filter(Boolean).length) return null;
          return /* @__PURE__ */ jsx14("ul", { className: "space-y-0.5", children: c.items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs14("li", { className: "flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx14("span", { className: "text-orange-500 shrink-0 mt-[2px]", children: "\u2726" }),
            /* @__PURE__ */ jsx14("span", { className: "break-words min-w-0", children: it })
          ] }, i)) });
        }
        if (!c.text?.trim()) return null;
        return /* @__PURE__ */ jsx14("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: c.text });
      })()
    ] }, sec.id);
    switch (sec.key) {
      case "summary":
        return summary ? /* @__PURE__ */ jsxs14("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx14(SH, { children: "About" }),
          /* @__PURE__ */ jsx14("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs14("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx14(SH, { children: "Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs14("div", { className: "mb-3 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs14("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsx14("span", { className: "text-[11.5px] font-bold text-gray-900 break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx14("span", { className: "text-[10px] text-orange-600 font-medium shrink-0 whitespace-nowrap", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs14("div", { className: "text-[10.5px] text-gray-500 mb-0.5 break-words", children: [
              e.company,
              e.location ? ` \xB7 ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx14("p", { className: "text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx14("ul", { className: "space-y-0.5", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs14("li", { className: "flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
              /* @__PURE__ */ jsx14("span", { className: "text-orange-500 shrink-0 mt-[2px]", children: "\u2726" }),
              /* @__PURE__ */ jsx14("span", { className: "break-words min-w-0", children: r })
            ] }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs14("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx14(SH, { children: "Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs14("div", { className: "mb-2.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs14("div", { className: "flex items-baseline gap-x-2 flex-wrap", children: [
              /* @__PURE__ */ jsx14("span", { className: "text-[11.5px] font-bold text-gray-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs14("span", { className: "text-[10px] text-gray-400 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs14("div", { className: "text-[10.5px] text-orange-600 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx14("div", { className: "text-[9.5px] text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx14("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: p.description })
          ] }, i))
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs14("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx14(SH, { children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsxs14("div", { className: "mb-2 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs14("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsx14("span", { className: "text-[11.5px] font-bold text-gray-900 break-words", children: e.degree }),
              /* @__PURE__ */ jsx14("span", { className: "text-[10px] text-orange-600 font-medium shrink-0 whitespace-nowrap", children: e.year })
            ] }),
            /* @__PURE__ */ jsx14("div", { className: "text-[10.5px] text-gray-500 break-words", children: e.institution }),
            (e.gpa || e.details) && /* @__PURE__ */ jsx14("div", { className: "text-[10px] text-gray-400 break-words", children: [e.gpa, e.details].filter(Boolean).join(" \u2014 ") })
          ] }, i))
        ] }, "education") : null;
      default:
        return null;
    }
  };
  const sideSections = activeSections.filter((s) => sideKeys.includes(s.key)).concat(activeSections.filter((s) => s.type === "custom"));
  const mainSections = activeSections.filter((s) => !sideKeys.includes(s.key) && !["basics"].includes(s.key));
  return /* @__PURE__ */ jsx14("div", { className: "resume-template designer max-w-4xl mx-auto bg-white font-sans overflow-hidden", children: /* @__PURE__ */ jsxs14("div", { className: "flex", children: [
    /* @__PURE__ */ jsxs14("div", { className: "w-[30%] shrink-0 bg-gray-900 px-5 py-6", children: [
      personalInfo && /* @__PURE__ */ jsxs14("div", { className: "mb-4 break-after-avoid", children: [
        /* @__PURE__ */ jsx14("h1", { className: "text-[19px] font-bold text-white leading-tight break-words", children: personalInfo.fullName }),
        personalInfo.title && /* @__PURE__ */ jsx14("div", { className: "text-[10.5px] text-orange-400 font-medium mt-0.5 mb-3 break-words", children: personalInfo.title }),
        /* @__PURE__ */ jsxs14("div", { className: "space-y-1.5 text-[9.5px] text-gray-300", children: [
          personalInfo.email && /* @__PURE__ */ jsx14("div", { className: "break-all", children: personalInfo.email }),
          personalInfo.phone && /* @__PURE__ */ jsx14("div", { className: "break-words", children: personalInfo.phone }),
          personalInfo.location && /* @__PURE__ */ jsx14("div", { className: "break-words", children: personalInfo.location }),
          personalInfo.linkedin && /* @__PURE__ */ jsx14("div", { className: "break-all", children: personalInfo.linkedin }),
          personalInfo.github && /* @__PURE__ */ jsx14("div", { className: "break-all", children: personalInfo.github }),
          personalInfo.portfolio && /* @__PURE__ */ jsx14("div", { className: "break-all", children: personalInfo.portfolio })
        ] })
      ] }),
      sideSections.map((s) => renderSide(s))
    ] }),
    /* @__PURE__ */ jsx14("div", { className: "flex-1 px-7 py-6 space-y-1", children: mainSections.map((s) => renderMain(s)) })
  ] }) });
};

// src/components/resume/templates/SleekTemplate.jsx
import { jsx as jsx15, jsxs as jsxs15 } from "react/jsx-runtime";
var CustomBlock15 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const SH = ({ children }) => /* @__PURE__ */ jsx15("h2", { className: "inline-block bg-gray-50 text-gray-700 rounded-md px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] mb-2 mt-3 break-after-avoid", children });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs15("div", { children: [
      /* @__PURE__ */ jsx15(SH, { children: label }),
      /* @__PURE__ */ jsx15("ul", { className: "space-y-0.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsx15("li", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: it }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs15("div", { children: [
    /* @__PURE__ */ jsx15(SH, { children: label }),
    /* @__PURE__ */ jsx15("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: text })
  ] });
};
var SleekTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const SH = ({ children }) => /* @__PURE__ */ jsx15("h2", { className: "inline-block bg-gray-50 text-gray-700 rounded-md px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] mb-2 mt-3 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx15(CustomBlock15, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs15("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx15(SH, { children: "Profile" }),
          /* @__PURE__ */ jsx15("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs15("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx15(SH, { children: "Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs15("div", { className: "mb-3 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs15("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsx15("span", { className: "text-[11.5px] font-semibold text-gray-900 break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx15("span", { className: "text-[10px] text-gray-400 whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs15("div", { className: "text-[10.5px] text-gray-500 mb-0.5 break-words", children: [
              e.company,
              e.location ? ` \xB7 ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx15("p", { className: "text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx15("ul", { className: "space-y-0.5", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs15("li", { className: "flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
              /* @__PURE__ */ jsx15("span", { className: "text-gray-400 shrink-0 mt-[2px]", children: "\u2014" }),
              /* @__PURE__ */ jsx15("span", { className: "break-words min-w-0", children: r })
            ] }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs15("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx15(SH, { children: "Skills" }),
          /* @__PURE__ */ jsx15("div", { className: "flex flex-wrap gap-1.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx15("span", { className: "text-[10px] bg-gray-50 text-gray-700 rounded px-2 py-0.5 break-words", children: s }, i)) })
        ] }, "skills") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs15("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx15(SH, { children: "Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs15("div", { className: "mb-2.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs15("div", { className: "flex items-baseline gap-x-2 flex-wrap", children: [
              /* @__PURE__ */ jsx15("span", { className: "text-[11.5px] font-semibold text-gray-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs15("span", { className: "text-[10px] text-gray-400 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs15("div", { className: "text-[10.5px] text-gray-500 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx15("div", { className: "text-[9.5px] text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx15("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: p.description })
          ] }, i))
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs15("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx15(SH, { children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsxs15("div", { className: "mb-2 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs15("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsx15("span", { className: "text-[11.5px] font-semibold text-gray-900 break-words", children: e.degree }),
              /* @__PURE__ */ jsx15("span", { className: "text-[10px] text-gray-400 shrink-0 whitespace-nowrap", children: e.year })
            ] }),
            /* @__PURE__ */ jsx15("div", { className: "text-[10.5px] text-gray-500 break-words", children: e.institution }),
            (e.gpa || e.details) && /* @__PURE__ */ jsx15("div", { className: "text-[10px] text-gray-400 break-words", children: [e.gpa, e.details].filter(Boolean).join(" \u2014 ") })
          ] }, i))
        ] }, "education") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs15("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx15(SH, { children: "Certifications" }),
          /* @__PURE__ */ jsx15("div", { className: "space-y-0.5", children: certifications.map((c, i) => /* @__PURE__ */ jsxs15("div", { className: "text-[10.5px] text-gray-600 break-words break-inside-avoid", children: [
            c.name,
            c.issuer ? ` \u2014 ${c.issuer}` : "",
            c.year ? ` (${c.year})` : ""
          ] }, i)) })
        ] }, "certifications") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs15("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx15(SH, { children: "Achievements" }),
          /* @__PURE__ */ jsx15("ul", { className: "space-y-0.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs15("li", { className: "flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx15("span", { className: "text-gray-400 shrink-0 mt-[2px]", children: "\u2014" }),
            /* @__PURE__ */ jsx15("span", { className: "break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs15("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsx15(SH, { children: "Languages" }),
          /* @__PURE__ */ jsx15("p", { className: "text-[10.5px] text-gray-600 break-words", children: languages.join("  \xB7  ") })
        ] }, "languages") : null;
      default:
        return /* @__PURE__ */ jsx15(CustomBlock15, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs15("div", { className: "resume-template sleek max-w-4xl mx-auto bg-white px-10 pt-3 font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs15("div", { className: "text-center mb-4", children: [
      /* @__PURE__ */ jsx15("h1", { className: "text-[22px] font-light tracking-[0.18em] text-gray-900 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx15("div", { className: "text-[11px] text-gray-500 uppercase tracking-[0.12em] mt-1 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs15("div", { className: "flex flex-wrap justify-center gap-1.5 mt-2", children: [
        personalInfo.email && /* @__PURE__ */ jsx15("span", { className: "text-[9.5px] bg-gray-50 text-gray-600 rounded-full px-2.5 py-0.5 break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx15("span", { className: "text-[9.5px] bg-gray-50 text-gray-600 rounded-full px-2.5 py-0.5 break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx15("span", { className: "text-[9.5px] bg-gray-50 text-gray-600 rounded-full px-2.5 py-0.5 break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx15("span", { className: "text-[9.5px] bg-gray-50 text-gray-600 rounded-full px-2.5 py-0.5 break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx15("span", { className: "text-[9.5px] bg-gray-50 text-gray-600 rounded-full px-2.5 py-0.5 break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx15("span", { className: "text-[9.5px] bg-gray-50 text-gray-600 rounded-full px-2.5 py-0.5 break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/ContemporaryTemplate.jsx
import { jsx as jsx16, jsxs as jsxs16 } from "react/jsx-runtime";
var Card = ({ accent, title, children }) => /* @__PURE__ */ jsxs16("div", { className: "mb-3 border border-gray-100 shadow-sm rounded-lg overflow-hidden break-after-avoid", children: [
  /* @__PURE__ */ jsx16("div", { className: `flex items-center gap-2 px-3 py-1.5 ${accent} text-white`, children: /* @__PURE__ */ jsx16("span", { className: "text-[9.5px] font-bold uppercase tracking-[0.2em] break-words", children: title }) }),
  /* @__PURE__ */ jsx16("div", { className: "px-3 py-2", children })
] });
var ContemporaryTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const ACCENT = "bg-indigo-600";
  const body = (mode, text, items) => {
    if (mode === "bullets") {
      if (!items?.filter(Boolean).length) return null;
      return /* @__PURE__ */ jsx16("ul", { className: "space-y-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs16("li", { className: "flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
        /* @__PURE__ */ jsx16("span", { className: `mt-[2px] w-1 h-1 shrink-0 rounded-full ${ACCENT.replace("bg-", "bg-")}` }),
        /* @__PURE__ */ jsx16("span", { className: "break-words min-w-0", children: it })
      ] }, i)) });
    }
    if (!text?.trim()) return null;
    return /* @__PURE__ */ jsx16("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: text });
  };
  const renderSection = (sec) => {
    if (sec.type === "custom") {
      const c = (customSections || {})[sec.id];
      return /* @__PURE__ */ jsx16(Card, { accent: ACCENT, title: sec.label, children: body(c?.mode, c?.text, c?.items) }, sec.id);
    }
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsx16(Card, { accent: ACCENT, title: "Profile", children: /* @__PURE__ */ jsx16("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: summary }) }, "summary") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsx16(Card, { accent: ACCENT, title: "Skills", children: /* @__PURE__ */ jsx16("div", { className: "flex flex-wrap gap-1.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx16("span", { className: "text-[10px] bg-indigo-50 text-indigo-800 rounded px-2 py-0.5 break-words", children: s }, i)) }) }, "skills") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsx16(Card, { accent: ACCENT, title: "Experience", children: /* @__PURE__ */ jsx16("div", { className: "space-y-2.5", children: experience.map((e, i) => /* @__PURE__ */ jsxs16("div", { className: "break-inside-avoid", children: [
          /* @__PURE__ */ jsxs16("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
            /* @__PURE__ */ jsx16("span", { className: "text-[11.5px] font-semibold text-gray-900 break-words min-w-0", children: e.position }),
            /* @__PURE__ */ jsx16("span", { className: "text-[9.5px] text-indigo-600 font-medium shrink-0 whitespace-nowrap", children: e.duration })
          ] }),
          /* @__PURE__ */ jsxs16("div", { className: "text-[10.5px] text-gray-500 mb-0.5 break-words", children: [
            e.company,
            e.location ? ` \xB7 ${e.location}` : "",
            e.employmentType ? ` \xB7 ${e.employmentType}` : ""
          ] }),
          e.summary && /* @__PURE__ */ jsx16("p", { className: "text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words", children: e.summary }),
          e.responsibilities?.length > 0 && /* @__PURE__ */ jsx16("ul", { className: "space-y-1", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs16("li", { className: "flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx16("span", { className: "mt-[5px] w-1 h-1 shrink-0 rounded-full bg-indigo-600" }),
            /* @__PURE__ */ jsx16("span", { className: "break-words min-w-0", children: r })
          ] }, j)) })
        ] }, i)) }) }, "experience") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsx16(Card, { accent: ACCENT, title: "Projects", children: /* @__PURE__ */ jsx16("div", { className: "space-y-2.5", children: projects.map((p, i) => /* @__PURE__ */ jsxs16("div", { className: "break-inside-avoid", children: [
          /* @__PURE__ */ jsxs16("div", { className: "flex items-baseline gap-x-2 flex-wrap", children: [
            /* @__PURE__ */ jsx16("span", { className: "text-[11.5px] font-semibold text-gray-900 break-words min-w-0", children: p.name }),
            p.role && /* @__PURE__ */ jsxs16("span", { className: "text-[10px] text-gray-400 break-words", children: [
              "(",
              p.role,
              ")"
            ] })
          ] }),
          p.technologies && /* @__PURE__ */ jsxs16("div", { className: "text-[10.5px] text-indigo-600 mb-0.5 break-words", children: [
            "Tech: ",
            p.technologies
          ] }),
          (p.link || p.github) && /* @__PURE__ */ jsx16("div", { className: "text-[9.5px] text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
          p.description && /* @__PURE__ */ jsx16("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: p.description })
        ] }, i)) }) }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsx16(Card, { accent: ACCENT, title: "Education", children: /* @__PURE__ */ jsx16("div", { className: "space-y-2", children: education.map((e, i) => /* @__PURE__ */ jsxs16("div", { className: "break-inside-avoid", children: [
          /* @__PURE__ */ jsxs16("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
            /* @__PURE__ */ jsx16("span", { className: "text-[11.5px] font-semibold text-gray-900 break-words", children: e.degree }),
            /* @__PURE__ */ jsx16("span", { className: "text-[9.5px] text-indigo-600 font-medium shrink-0 whitespace-nowrap", children: e.year })
          ] }),
          /* @__PURE__ */ jsx16("div", { className: "text-[10.5px] text-gray-500 break-words", children: e.institution }),
          (e.gpa || e.details) && /* @__PURE__ */ jsx16("div", { className: "text-[10px] text-gray-400 break-words", children: [e.gpa, e.details].filter(Boolean).join(" \u2014 ") })
        ] }, i)) }) }, "education") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsx16(Card, { accent: ACCENT, title: "Certifications", children: /* @__PURE__ */ jsx16("div", { className: "space-y-0.5", children: certifications.map((c, i) => /* @__PURE__ */ jsxs16("div", { className: "text-[10.5px] text-gray-600 break-words break-inside-avoid", children: [
          c.name,
          c.issuer ? ` \u2014 ${c.issuer}` : "",
          c.year ? ` (${c.year})` : ""
        ] }, i)) }) }, "certifications") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsx16(Card, { accent: ACCENT, title: "Achievements", children: /* @__PURE__ */ jsx16("ul", { className: "space-y-1", children: achievements.map((a, i) => /* @__PURE__ */ jsxs16("li", { className: "flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
          /* @__PURE__ */ jsx16("span", { className: "mt-[5px] w-1 h-1 shrink-0 rounded-full bg-indigo-600" }),
          /* @__PURE__ */ jsx16("span", { className: "break-words min-w-0", children: a })
        ] }, i)) }) }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsx16(Card, { accent: ACCENT, title: "Languages", children: /* @__PURE__ */ jsx16("p", { className: "text-[10.5px] text-gray-600 break-words", children: languages.join("  \xB7  ") }) }, "languages") : null;
      default:
        return null;
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs16("div", { className: "resume-template contemporary max-w-4xl mx-auto bg-white px-9 pt-3 font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs16("div", { className: "mb-3 pb-2", children: [
      /* @__PURE__ */ jsx16("h1", { className: "text-[24px] font-light tracking-tight text-gray-900 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx16("div", { className: "text-[11px] text-indigo-700 font-medium mt-0.5 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs16("div", { className: "flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-[9.5px] text-gray-500", children: [
        personalInfo.email && /* @__PURE__ */ jsx16("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx16("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx16("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx16("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx16("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx16("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/AcademicTemplate.jsx
import { jsx as jsx17, jsxs as jsxs17 } from "react/jsx-runtime";
var CustomBlock16 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = /* @__PURE__ */ jsx17("h2", { className: "text-center text-[9px] italic uppercase tracking-[0.14em] text-gray-600 border-t border-gray-800 border-b-2 border-gray-800 py-[1px] mb-1 mt-3 break-after-avoid", children: label });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs17("div", { children: [
      H,
      /* @__PURE__ */ jsx17("ul", { className: "space-y-0.5 text-center", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsx17("li", { className: "text-[10px] leading-relaxed break-words break-inside-avoid", children: it }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs17("div", { children: [
    H,
    /* @__PURE__ */ jsx17("p", { className: "text-[10px] text-center leading-relaxed break-words", children: text })
  ] });
};
var AcademicTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const H = ({ children }) => /* @__PURE__ */ jsx17("h2", { className: "text-center text-[9px] italic uppercase tracking-[0.14em] text-gray-600 border-t border-gray-800 border-b-2 border-gray-800 py-[1px] mb-1 mt-3 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx17(CustomBlock16, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs17("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx17(H, { children: "Summary" }),
          /* @__PURE__ */ jsx17("p", { className: "text-center text-[10px] text-gray-800 leading-tight break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs17("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx17(H, { children: "Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs17("div", { className: "mb-1.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs17("div", { className: "flex items-baseline justify-between gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsx17("span", { className: "text-[10px] font-bold text-gray-900 break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx17("span", { className: "text-[9px] text-gray-500 italic shrink-0 whitespace-nowrap", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs17("div", { className: "text-[9.5px] italic text-gray-600 break-words", children: [
              e.company,
              e.location ? `, ${e.location}` : "",
              e.employmentType ? ` (${e.employmentType})` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx17("p", { className: "text-[10px] text-gray-800 leading-tight mt-0.5 break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx17("div", { className: "pl-3", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs17("div", { className: "text-[10px] text-gray-800 leading-tight break-words break-inside-avoid", children: [
              "\u2022 ",
              r
            ] }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs17("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx17(H, { children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsxs17("div", { className: "mb-1 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs17("div", { className: "flex items-baseline justify-between gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsx17("span", { className: "text-[10px] font-bold text-gray-900 break-words", children: e.degree }),
              /* @__PURE__ */ jsx17("span", { className: "text-[9px] italic text-gray-500 shrink-0 whitespace-nowrap", children: e.year })
            ] }),
            /* @__PURE__ */ jsx17("div", { className: "text-[9.5px] italic text-gray-600 break-words", children: e.institution }),
            (e.gpa || e.details) && /* @__PURE__ */ jsx17("div", { className: "text-[9px] text-gray-600 break-words", children: [e.details || "", e.gpa].filter(Boolean).join(" \u2014 ") })
          ] }, i))
        ] }, "education") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs17("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx17(H, { children: "Research & Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs17("div", { className: "mb-1.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs17("div", { className: "flex items-baseline gap-x-2 flex-wrap", children: [
              /* @__PURE__ */ jsx17("span", { className: "text-[10px] font-bold text-gray-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs17("span", { className: "text-[9px] italic text-gray-500 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs17("div", { className: "text-[9px] italic text-gray-600 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx17("div", { className: "text-[8.5px] break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx17("p", { className: "text-[10px] text-gray-800 leading-tight break-words", children: p.description })
          ] }, i))
        ] }, "projects") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs17("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx17(H, { children: "Research Interests / Skills" }),
          /* @__PURE__ */ jsx17("p", { className: "text-center text-[10px] text-gray-800 leading-tight break-words", children: (Array.isArray(skills) ? skills : [skills]).join("  \u2022  ") })
        ] }, "skills") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs17("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx17(H, { children: "Certifications" }),
          /* @__PURE__ */ jsx17("div", { className: "space-y-0.5 text-center", children: certifications.map((c, i) => /* @__PURE__ */ jsxs17("div", { className: "text-[10px] text-gray-800 break-words break-inside-avoid", children: [
            c.name,
            c.issuer ? ` \u2014 ${c.issuer}` : "",
            c.year ? ` (${c.year})` : ""
          ] }, i)) })
        ] }, "certifications") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs17("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx17(H, { children: "Achievements" }),
          /* @__PURE__ */ jsx17("ul", { className: "space-y-0.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs17("li", { className: "text-[10px] text-gray-800 leading-tight break-words break-inside-avoid", children: [
            "\u2022 ",
            a
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs17("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx17(H, { children: "Languages" }),
          /* @__PURE__ */ jsx17("p", { className: "text-center text-[10px] text-gray-800 break-words", children: languages.join("  \xB7  ") })
        ] }, "languages") : null;
      default:
        return /* @__PURE__ */ jsx17(CustomBlock16, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs17("div", { className: "resume-template academic max-w-4xl mx-auto bg-white px-7 py-1 font-serif text-gray-900 overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs17("div", { className: "text-center mb-2 pb-2 border-b-2 border-gray-800", children: [
      /* @__PURE__ */ jsx17("h1", { className: "text-[18px] font-bold uppercase tracking-[0.12em] break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx17("div", { className: "text-[11px] italic text-gray-700 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs17("div", { className: "flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1 text-[9px] text-gray-600", children: [
        personalInfo.email && /* @__PURE__ */ jsx17("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx17("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx17("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx17("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx17("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx17("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/ResearchTemplate.jsx
import { jsx as jsx18, jsxs as jsxs18 } from "react/jsx-runtime";
var CustomBlock17 = ({ label, content, num }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  return /* @__PURE__ */ jsxs18("div", { className: "flex gap-3 mb-3 break-inside-avoid", children: [
    /* @__PURE__ */ jsx18("div", { className: "w-[10%] shrink-0 text-right pt-1", children: /* @__PURE__ */ jsx18("span", { className: "inline-block w-6 text-center bg-gray-900 text-white text-[10px] font-bold", children: num }) }),
    /* @__PURE__ */ jsxs18("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsx18("h3", { className: "text-[10px] font-bold uppercase tracking-[0.18em] text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5 break-after-avoid", children: label }),
      mode === "bullets" ? items?.filter(Boolean).length ? /* @__PURE__ */ jsx18("ul", { className: "space-y-0.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsx18("li", { className: "text-[10px] text-gray-700 leading-relaxed break-words break-inside-avoid", children: it }, i)) }) : null : text?.trim() ? /* @__PURE__ */ jsx18("p", { className: "text-[10px] text-gray-700 leading-relaxed break-words", children: text }) : null
    ] })
  ] });
};
var ResearchTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const SideNum = ({ n }) => /* @__PURE__ */ jsx18("div", { className: "w-[10%] shrink-0 text-right pt-1", children: /* @__PURE__ */ jsx18("span", { className: "inline-block w-6 text-center bg-gray-900 text-white text-[10px] font-bold", children: n }) });
  const Head = ({ children }) => /* @__PURE__ */ jsx18("h3", { className: "text-[10px] font-bold uppercase tracking-[0.18em] text-gray-900 border-b border-gray-300 pb-0.5 mb-1.5 break-after-avoid", children });
  const Frame = ({ n, title, children }) => /* @__PURE__ */ jsxs18("div", { className: "flex gap-3 mb-3 break-inside-avoid", children: [
    /* @__PURE__ */ jsx18(SideNum, { n }),
    /* @__PURE__ */ jsxs18("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsx18(Head, { children: title }),
      /* @__PURE__ */ jsx18("div", { className: "min-w-0 space-y-0.5", children })
    ] })
  ] });
  const cases = {
    summary: summary ? /* @__PURE__ */ jsx18("p", { className: "text-[10px] text-gray-700 leading-relaxed break-words", children: summary }) : null,
    experience: experience?.length ? experience.map((e, i) => /* @__PURE__ */ jsxs18("div", { className: "pb-1.5 break-inside-avoid", children: [
      /* @__PURE__ */ jsxs18("div", { className: "flex items-baseline justify-between gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsx18("span", { className: "text-[10.5px] font-bold text-gray-900 break-words min-w-0", children: e.position }),
        /* @__PURE__ */ jsx18("span", { className: "text-[9px] text-gray-400 whitespace-nowrap shrink-0", children: e.duration })
      ] }),
      /* @__PURE__ */ jsxs18("div", { className: "text-[9.5px] text-gray-500 break-words", children: [
        e.company,
        e.location ? ` \xB7 ${e.location}` : "",
        e.employmentType ? ` \xB7 ${e.employmentType}` : ""
      ] }),
      e.summary && /* @__PURE__ */ jsx18("p", { className: "text-[10px] text-gray-700 leading-relaxed mt-0.5 break-words", children: e.summary }),
      e.responsibilities?.length > 0 && /* @__PURE__ */ jsx18("ul", { className: "pl-3 space-y-0.5", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs18("li", { className: "text-[10px] text-gray-700 leading-relaxed break-words break-inside-avoid", children: [
        j + 1,
        ". ",
        r
      ] }, j)) })
    ] }, i)) : null,
    education: education?.length ? education.map((e, i) => /* @__PURE__ */ jsxs18("div", { className: "pb-1 break-inside-avoid", children: [
      /* @__PURE__ */ jsxs18("div", { className: "flex items-baseline justify-between gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsx18("span", { className: "text-[10.5px] font-bold text-gray-900 break-words", children: e.degree }),
        /* @__PURE__ */ jsx18("span", { className: "text-[9px] text-gray-400 shrink-0 whitespace-nowrap", children: e.year })
      ] }),
      /* @__PURE__ */ jsx18("div", { className: "text-[9.5px] text-gray-500 break-words", children: e.institution }),
      (e.gpa || e.details) && /* @__PURE__ */ jsx18("div", { className: "text-[9px] text-gray-500 break-words", children: [e.gpa, e.details].filter(Boolean).join(" \u2014 ") })
    ] }, i)) : null,
    projects: projects?.length ? projects.map((p, i) => /* @__PURE__ */ jsxs18("div", { className: "pb-1.5 break-inside-avoid", children: [
      /* @__PURE__ */ jsxs18("div", { className: "flex items-baseline gap-x-2 flex-wrap", children: [
        /* @__PURE__ */ jsx18("span", { className: "text-[10.5px] font-bold text-gray-900 break-words min-w-0", children: p.name }),
        p.role && /* @__PURE__ */ jsxs18("span", { className: "text-[9px] text-gray-400 break-words", children: [
          "(",
          p.role,
          ")"
        ] })
      ] }),
      p.technologies && /* @__PURE__ */ jsxs18("div", { className: "text-[9.5px] text-gray-500 break-words", children: [
        "Tech: ",
        p.technologies
      ] }),
      (p.link || p.github) && /* @__PURE__ */ jsx18("div", { className: "text-[8.5px] break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
      p.description && /* @__PURE__ */ jsx18("p", { className: "text-[10px] text-gray-700 leading-relaxed break-words", children: p.description })
    ] }, i)) : null,
    skills: skills?.length ? /* @__PURE__ */ jsx18("div", { className: "grid grid-cols-2 gap-x-4 gap-y-0.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx18("div", { className: "text-[10px] text-gray-700 break-words break-inside-avoid", children: s }, i)) }) : null,
    certifications: certifications?.length ? certifications.map((c, i) => /* @__PURE__ */ jsxs18("div", { className: "text-[10px] text-gray-700 break-words break-inside-avoid", children: [
      c.name,
      c.issuer ? ` \u2014 ${c.issuer}` : "",
      c.year ? ` (${c.year})` : ""
    ] }, i)) : null,
    achievements: achievements?.length ? achievements.map((a, i) => /* @__PURE__ */ jsxs18("div", { className: "text-[10px] text-gray-700 leading-relaxed break-words break-inside-avoid", children: [
      i + 1,
      ". ",
      a
    ] }, i)) : null,
    languages: languages?.length ? /* @__PURE__ */ jsx18("p", { className: "text-[10px] text-gray-700 break-words", children: languages.join("  \xB7  ") }) : null
  };
  const titles = {
    summary: "Summary",
    experience: "Experience",
    education: "Education",
    projects: "Publications & Projects",
    skills: "Skills / Methods",
    certifications: "Certifications",
    achievements: "Achievements",
    languages: "Languages"
  };
  const ordered = (sectionsConfig || []).filter((s) => s.visible).sort((a, b) => a.order - b.order).filter((s) => s.key !== "basics");
  let idx = 0;
  const rendered = ordered.map((sec) => {
    if (sec.type === "custom") {
      const c = (customSections || {})[sec.id];
      return c ? /* @__PURE__ */ jsx18(CustomBlock17, { label: sec.label, content: c, num: String(++idx).padStart(2, "0") }, sec.id) : null;
    }
    const body = cases[sec.key];
    if (!body) return null;
    return /* @__PURE__ */ jsx18(Frame, { n: String(++idx).padStart(2, "0"), title: titles[sec.key], children: body }, sec.key);
  });
  return /* @__PURE__ */ jsxs18("div", { className: "resume-template research max-w-4xl mx-auto bg-white px-8 pt-2 font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs18("div", { className: "mb-3 pb-2 border-b-2 border-gray-900", children: [
      /* @__PURE__ */ jsx18("h1", { className: "text-[20px] font-bold text-gray-900 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx18("div", { className: "text-[11px] text-gray-600 mt-0.5 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs18("div", { className: "flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-[9.5px] text-gray-500", children: [
        personalInfo.email && /* @__PURE__ */ jsx18("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx18("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx18("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx18("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx18("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx18("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    /* @__PURE__ */ jsx18("div", { className: "space-y-1", children: rendered })
  ] });
};

// src/components/resume/templates/MedicalTemplate.jsx
import { jsx as jsx19, jsxs as jsxs19 } from "react/jsx-runtime";
var CustomBlock18 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = /* @__PURE__ */ jsx19("h2", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-teal-800 border-b-2 border-teal-400 pb-0.5 mb-1.5 mt-3 break-after-avoid", children: label });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs19("div", { children: [
      H,
      /* @__PURE__ */ jsx19("ul", { className: "space-y-0.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsx19("li", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid", children: it }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs19("div", { children: [
    H,
    /* @__PURE__ */ jsx19("p", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words", children: text })
  ] });
};
var MedicalTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const H = ({ children }) => /* @__PURE__ */ jsx19("h2", { className: "text-[10px] font-bold uppercase tracking-[0.22em] text-teal-800 border-b-2 border-teal-400 pb-0.5 mb-1.5 mt-3 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx19(CustomBlock18, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs19("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx19(H, { children: "Professional Summary" }),
          /* @__PURE__ */ jsx19("p", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs19("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx19(H, { children: "Clinical Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs19("div", { className: "mb-3 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs19("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsx19("span", { className: "text-[11.5px] font-bold text-gray-900 break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx19("span", { className: "text-[10px] text-teal-700 font-medium shrink-0 whitespace-nowrap", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs19("div", { className: "text-[10.5px] text-gray-500 mb-0.5 break-words", children: [
              e.company,
              e.location ? ` \xB7 ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx19("p", { className: "text-[10.5px] text-gray-600 mb-0.5 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx19("ul", { className: "space-y-0.5", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs19("li", { className: "flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
              /* @__PURE__ */ jsx19("span", { className: "mt-[2px] text-teal-600 shrink-0", children: "\u2014" }),
              /* @__PURE__ */ jsx19("span", { className: "break-words min-w-0", children: r })
            ] }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs19("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx19(H, { children: "Skills & Competencies" }),
          /* @__PURE__ */ jsx19("div", { className: "grid grid-cols-2 gap-y-0.5 gap-x-6 px-1", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsxs19("div", { className: "text-[10.5px] text-gray-700 flex items-center gap-1.5 break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx19("span", { className: "w-1 h-1 rounded-full bg-teal-600 shrink-0" }),
            /* @__PURE__ */ jsx19("span", { className: "break-words min-w-0", children: s })
          ] }, i)) })
        ] }, "skills") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs19("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx19(H, { children: "Licenses & Certifications" }),
          /* @__PURE__ */ jsx19("div", { className: "space-y-0.5", children: certifications.map((c, i) => /* @__PURE__ */ jsxs19("div", { className: "text-[10.5px] text-gray-700 break-words break-inside-avoid", children: [
            c.name,
            c.issuer ? ` \u2014 ${c.issuer}` : "",
            c.year ? ` (${c.year})` : ""
          ] }, i)) })
        ] }, "certifications") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs19("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx19(H, { children: "Education & Training" }),
          education.map((e, i) => /* @__PURE__ */ jsxs19("div", { className: "mb-2 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs19("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsx19("span", { className: "text-[11.5px] font-bold text-gray-900 break-words", children: e.degree }),
              /* @__PURE__ */ jsx19("span", { className: "text-[10px] text-teal-700 font-medium shrink-0 whitespace-nowrap", children: e.year })
            ] }),
            /* @__PURE__ */ jsx19("div", { className: "text-[10.5px] text-gray-500 break-words", children: e.institution }),
            (e.gpa || e.details) && /* @__PURE__ */ jsx19("div", { className: "text-[10px] text-gray-500 break-words", children: [e.gpa, e.details].filter(Boolean).join(" \u2014 ") })
          ] }, i))
        ] }, "education") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs19("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx19(H, { children: "Research & Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs19("div", { className: "mb-2.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs19("div", { className: "flex items-baseline gap-x-2 flex-wrap", children: [
              /* @__PURE__ */ jsx19("span", { className: "text-[11.5px] font-bold text-gray-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs19("span", { className: "text-[10px] text-gray-400 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs19("div", { className: "text-[10.5px] text-teal-700 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx19("div", { className: "text-[9.5px] text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx19("p", { className: "text-[10.5px] text-gray-600 leading-relaxed break-words", children: p.description })
          ] }, i))
        ] }, "projects") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs19("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx19(H, { children: "Honors & Achievements" }),
          /* @__PURE__ */ jsx19("ul", { className: "space-y-0.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs19("li", { className: "flex gap-2 text-[10.5px] text-gray-600 leading-relaxed break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx19("span", { className: "mt-[2px] text-teal-600 shrink-0", children: "\u2014" }),
            /* @__PURE__ */ jsx19("span", { className: "break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs19("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx19(H, { children: "Languages" }),
          /* @__PURE__ */ jsx19("p", { className: "text-[10.5px] text-gray-700 break-words", children: languages.join("  \xB7  ") })
        ] }, "languages") : null;
      default:
        return /* @__PURE__ */ jsx19(CustomBlock18, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs19("div", { className: "resume-template medical max-w-4xl mx-auto bg-white font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs19("div", { children: [
      /* @__PURE__ */ jsx19("div", { className: "px-8 pt-4 pb-2 flex items-end justify-between gap-3 flex-wrap", children: /* @__PURE__ */ jsxs19("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx19("h1", { className: "text-[22px] font-light text-gray-900 leading-tight break-words", children: personalInfo.fullName }),
        personalInfo.title && /* @__PURE__ */ jsx19("div", { className: "text-[12px] text-teal-700 font-medium mt-0.5 break-words", children: personalInfo.title })
      ] }) }),
      /* @__PURE__ */ jsxs19("div", { className: "bg-teal-700 text-white px-8 py-2 flex flex-wrap gap-x-4 gap-y-0.5 text-[9.5px]", children: [
        personalInfo.email && /* @__PURE__ */ jsx19("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx19("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx19("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx19("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx19("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx19("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    /* @__PURE__ */ jsx19("div", { className: "px-8 pb-2", children: activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec)) })
  ] });
};

// src/components/resume/templates/FinanceTemplate.jsx
import { jsx as jsx20, jsxs as jsxs20 } from "react/jsx-runtime";
var CustomBlock19 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = /* @__PURE__ */ jsx20("h2", { className: "text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900 border-b-2 border-gray-900 pb-0.5 mb-2 mt-4 break-after-avoid", children: label });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs20("div", { children: [
      H,
      /* @__PURE__ */ jsx20("ul", { className: "space-y-0.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsx20("li", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid", children: it }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs20("div", { children: [
    H,
    /* @__PURE__ */ jsx20("p", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words", children: text })
  ] });
};
var FinanceTemplate = ({ data }) => {
  const {
    sectionsConfig,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
    achievements,
    languages,
    customSections
  } = data;
  const H = ({ children }) => /* @__PURE__ */ jsx20("h2", { className: "text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900 border-b-2 border-gray-900 pb-0.5 mb-2 mt-4 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx20(CustomBlock19, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs20("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx20(H, { children: "Executive Profile" }),
          /* @__PURE__ */ jsx20("p", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs20("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx20(H, { children: "Professional Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs20("div", { className: "mb-3 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs20("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsx20("span", { className: "text-[11.5px] font-bold text-gray-900 break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx20("span", { className: "text-[10px] text-gray-600 font-medium shrink-0 whitespace-nowrap", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs20("div", { className: "text-[10.5px] text-gray-600 mb-0.5 break-words", children: [
              e.company,
              e.location ? ` | ${e.location}` : "",
              e.employmentType ? ` | ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx20("p", { className: "text-[10.5px] text-gray-700 mb-0.5 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx20("ul", { className: "space-y-0.5 pl-3", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsx20("li", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid", style: { listStyle: "disc" }, children: r }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs20("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx20(H, { children: "Core Competencies" }),
          /* @__PURE__ */ jsx20("div", { className: "grid grid-cols-3 gap-x-4 gap-y-1 px-1", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx20("div", { className: "text-[10.5px] text-gray-700 font-medium break-words break-inside-avoid", children: s }, i)) })
        ] }, "skills") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs20("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx20(H, { children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsxs20("div", { className: "mb-2 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs20("div", { className: "flex items-baseline justify-between gap-1 flex-wrap", children: [
              /* @__PURE__ */ jsx20("span", { className: "text-[11.5px] font-bold text-gray-900 break-words", children: e.degree }),
              /* @__PURE__ */ jsx20("span", { className: "text-[10px] text-gray-600 shrink-0 whitespace-nowrap", children: e.year })
            ] }),
            /* @__PURE__ */ jsx20("div", { className: "text-[10.5px] text-gray-600 break-words", children: e.institution }),
            (e.gpa || e.details) && /* @__PURE__ */ jsx20("div", { className: "text-[10px] text-gray-500 break-words", children: [e.gpa, e.details].filter(Boolean).join(" \u2014 ") })
          ] }, i))
        ] }, "education") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs20("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx20(H, { children: "Certifications & Licenses" }),
          /* @__PURE__ */ jsx20("div", { className: "space-y-0.5", children: certifications.map((c, i) => /* @__PURE__ */ jsxs20("div", { className: "text-[10.5px] text-gray-700 break-words break-inside-avoid", children: [
            c.name,
            c.issuer ? ` \u2014 ${c.issuer}` : "",
            c.year ? ` (${c.year})` : ""
          ] }, i)) })
        ] }, "certifications") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs20("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx20(H, { children: "Key Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs20("div", { className: "mb-2.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs20("div", { className: "flex items-baseline gap-x-2 flex-wrap", children: [
              /* @__PURE__ */ jsx20("span", { className: "text-[11.5px] font-bold text-gray-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs20("span", { className: "text-[10px] text-gray-400 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs20("div", { className: "text-[10.5px] text-gray-600 mb-0.5 break-words", children: [
              "Scope: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx20("div", { className: "text-[9.5px] text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx20("p", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words", children: p.description })
          ] }, i))
        ] }, "projects") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs20("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx20(H, { children: "Awards & Achievements" }),
          /* @__PURE__ */ jsx20("ul", { className: "space-y-0.5 pl-3", children: achievements.map((a, i) => /* @__PURE__ */ jsx20("li", { className: "text-[10.5px] text-gray-700 leading-relaxed break-words break-inside-avoid", style: { listStyle: "disc" }, children: a }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs20("div", { className: "mb-2", children: [
          /* @__PURE__ */ jsx20(H, { children: "Languages" }),
          /* @__PURE__ */ jsx20("p", { className: "text-[10.5px] text-gray-700 break-words", children: languages.join("  |  ") })
        ] }, "languages") : null;
      default:
        return /* @__PURE__ */ jsx20(CustomBlock19, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs20("div", { className: "resume-template finance max-w-4xl mx-auto bg-white px-8 pt-2 font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs20("div", { className: "mb-4 pb-3 border-b-4 border-gray-900", children: [
      /* @__PURE__ */ jsx20("h1", { className: "text-[24px] font-bold text-gray-900 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx20("div", { className: "text-[11px] text-gray-600 font-medium mt-0.5 mb-2 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs20("div", { className: "flex flex-wrap gap-x-4 gap-y-0.5 text-[10px] text-gray-600", children: [
        personalInfo.email && /* @__PURE__ */ jsx20("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx20("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx20("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx20("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx20("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx20("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/pdf/renderPdfHandler.jsx
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var TEMPLATE_MAP = {
  modern: ModernProTemplate,
  classic: ClassicTemplate,
  minimal: MinimalATSTemplate,
  executive: ExecutiveTemplate,
  fresher: FresherTemplate,
  creative: CreativeATSTemplate,
  corporate: CorporateTemplate,
  traditional: TraditionalTemplate,
  clean: CleanTemplate,
  graduate: GraduateTemplate,
  tech: TechTemplate,
  engineering: EngineeringTemplate,
  leadership: LeadershipTemplate,
  designer: DesignerTemplate,
  sleek: SleekTemplate,
  contemporary: ContemporaryTemplate,
  academic: AcademicTemplate,
  research: ResearchTemplate,
  medical: MedicalTemplate,
  finance: FinanceTemplate
};
var compiledCss = readFileSync(path.join(__dirname, "_pdf-compiled.css"), "utf8");
function wrapHtml(bodyHtml) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; background: #fff; }
  body { width: ${A4_W}px; }
  ${compiledCss}
  h1, h2, h3 { break-after: avoid; page-break-after: avoid; }
  li { break-inside: avoid; page-break-inside: avoid; }
</style>
</head>
<body>${bodyHtml}</body>
</html>`;
}
var browserPromise = null;
async function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: A4_W, height: A4_H },
      executablePath: await chromium.executablePath(
        process.env.CHROMIUM_PACK_URL
        // see README note for how to set this
      ),
      headless: chromium.headless
    });
  }
  return browserPromise;
}
async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }
  const secret = req.headers["x-internal-secret"];
  if (!secret || secret !== process.env.RENDER_INTERNAL_SECRET) {
    return res.status(403).json({ error: "forbidden" });
  }
  try {
    const { resume, template } = req.body || {};
    if (!resume) return res.status(400).json({ error: "resume is required" });
    const sectionsConfig = resume.sectionsConfig && resume.sectionsConfig.length > 0 ? resume.sectionsConfig : DEFAULT_SECTIONS_CONFIG;
    const data = buildTransformed(resume, sectionsConfig);
    const templateKey = TEMPLATE_MAP[template] ? template : "modern";
    const Template = TEMPLATE_MAP[templateKey];
    const { top: marginTop, bottom: marginBottom } = getPageMargin(templateKey);
    const layoutScale = typeof resume.layoutScale === "number" ? resume.layoutScale : 1;
    const wrapStyle = scaleStyle(layoutScale);
    const templateEl = React.createElement(Template, { data });
    const bodyHtml = ReactDOMServer.renderToStaticMarkup(
      wrapStyle ? React.createElement("div", { style: wrapStyle }, templateEl) : templateEl
    );
    const html = wrapHtml(bodyHtml);
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: A4_W, height: A4_H });
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      width: `${A4_W}px`,
      height: `${A4_H}px`,
      printBackground: true,
      // Real top/bottom margin, per template, applied by Chrome's print
      // engine to EVERY page it paginates — this is what actually fixes
      // "content touching the page edge": Puppeteer re-applies this margin
      // at each page break automatically, not just at the very start/end
      // of the document. Left/right stay at 0 because each template's own
      // horizontal padding already runs continuously down the whole page
      // and needs no per-page repetition (see utils/pageLayout.js).
      margin: { top: `${marginTop}px`, bottom: `${marginBottom}px`, left: "0px", right: "0px" },
      preferCSSPageSize: false
    });
    await page.close();
    res.setHeader("Content-Type", "application/pdf");
    res.status(200).send(Buffer.from(pdfBuffer));
  } catch (err) {
    console.error("render-pdf failed:", err);
    res.status(500).json({ error: "render_failed", message: err.message });
  }
}
var config = {
  api: { bodyParser: { sizeLimit: "5mb" } },
  maxDuration: 60
  // requires Vercel Pro; Hobby caps at 10s regardless of this value
};
export {
  config,
  handler as default
};
