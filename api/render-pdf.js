// src/pdf/renderPdfHandler.jsx
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import React4 from "react";
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
var CustomBlock = ({ label, content, headingClass, bodyClass, bulletClass }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === "bullets") {
    if (!items || !items.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: headingClass, children: label }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs("li", { className: `flex items-start break-inside-avoid ${bodyClass}`, children: [
        /* @__PURE__ */ jsx("span", { className: `mr-2 shrink-0 ${bulletClass}`, children: "\u25B8" }),
        /* @__PURE__ */ jsx("span", { className: "leading-relaxed break-words min-w-0", children: it })
      ] }, i)) })
    ] });
  }
  if (!text || !text.trim()) return null;
  return /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsx("h2", { className: headingClass, children: label }),
    /* @__PURE__ */ jsx("p", { className: `${bodyClass} leading-relaxed break-words`, children: text })
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
  const H = "text-lg font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300 uppercase tracking-wide break-after-avoid";
  const B = "text-gray-700 text-sm";
  const BL = "text-gray-400";
  const renderSection = (sec) => {
    if (sec.type === "custom") {
      return /* @__PURE__ */ jsx(CustomBlock, { label: sec.label, content: (customSections || {})[sec.id], headingClass: H, bodyClass: B, bulletClass: BL }, sec.id);
    }
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("h2", { className: H, children: "Professional Summary" }),
          /* @__PURE__ */ jsx("p", { className: `${B} leading-relaxed break-words`, children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("h2", { className: H, children: "Professional Experience" }),
          experience.map((exp, i) => /* @__PURE__ */ jsxs("div", { className: "mb-5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start flex-wrap gap-1 mb-1", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-900 break-words min-w-0", children: exp.position }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: exp.duration })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-700 mb-1 break-words", children: [
              exp.company,
              exp.location ? ` \xB7 ${exp.location}` : "",
              exp.employmentType ? ` \xB7 ${exp.employmentType}` : ""
            ] }),
            exp.summary && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-1 leading-relaxed break-words", children: exp.summary }),
            exp.responsibilities?.length > 0 && /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside space-y-1 text-gray-700 text-sm", children: exp.responsibilities.map((r, j) => /* @__PURE__ */ jsx("li", { className: "leading-relaxed break-words break-inside-avoid", children: r }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("h2", { className: H, children: "Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs("div", { className: "mb-4 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-gray-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-500 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-600 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join("  \xB7  ") }),
            p.description && /* @__PURE__ */ jsx("p", { className: "text-gray-700 text-sm leading-relaxed break-words", children: p.description }),
            p.highlights?.length > 0 && /* @__PURE__ */ jsx("ul", { className: "list-disc list-inside mt-1 space-y-1 text-gray-700 text-sm", children: p.highlights.map((h, j) => /* @__PURE__ */ jsx("li", { className: "break-words break-inside-avoid", children: h }, j)) })
          ] }, i))
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("h2", { className: H, children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsx("div", { className: "mb-3 break-inside-avoid", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start flex-wrap gap-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs("h3", { className: "font-bold text-gray-900 break-words", children: [
                e.degree,
                e.field ? ` in ${e.field}` : ""
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-gray-700 text-sm break-words", children: e.institution }),
              e.gpa && /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500 break-words", children: [
                "Grade: ",
                e.gpa
              ] }),
              e.details && /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mt-0.5 break-words", children: e.details })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: e.year })
          ] }) }, i))
        ] }, "education") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("h2", { className: H, children: "Skills" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-0.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx("p", { className: `${B} break-words`, children: s }, i)) })
        ] }, "skills") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("h2", { className: H, children: "Achievements" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-1.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs("li", { className: `flex items-start break-inside-avoid ${B}`, children: [
            /* @__PURE__ */ jsx("span", { className: `font-bold mr-2 shrink-0 ${BL}`, children: "\u25B8" }),
            /* @__PURE__ */ jsx("span", { className: "leading-relaxed break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("h2", { className: H, children: "Languages" }),
          /* @__PURE__ */ jsx("div", { className: "text-gray-700 text-sm break-words", children: languages.join(" \xB7 ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("h2", { className: H, children: "Certifications" }),
          certifications.map((c, i) => /* @__PURE__ */ jsxs("div", { className: "mb-1.5 text-sm text-gray-700 break-words", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs("span", { className: "text-gray-600", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs("span", { className: "text-gray-500", children: [
              " (",
              c.year,
              ")"
            ] }),
            c.credentialUrl && /* @__PURE__ */ jsx("span", { className: "block text-xs text-gray-400 break-all", children: c.credentialUrl })
          ] }, i))
        ] }, "certifications") : null;
      default:
        return /* @__PURE__ */ jsx(CustomBlock, { label: sec.label, content: (customSections || {})[sec.id], headingClass: H, bodyClass: B, bulletClass: BL }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs("div", { className: "resume-template modern-pro max-w-4xl mx-auto bg-white px-8 font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs("div", { className: "border-b-2 border-gray-800 pb-4 mb-6", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-1 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx("div", { className: "text-base text-gray-600 font-medium mb-2 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600", children: [
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
import React from "react";
import { Fragment, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var CustomBlock2 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = /* @__PURE__ */ jsx2("div", { className: "text-xs font-bold uppercase tracking-[0.18em] text-gray-500 border-b border-gray-200 pb-0.5 mb-2 mt-5 break-after-avoid", children: label });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs2(Fragment, { children: [
      H,
      /* @__PURE__ */ jsx2("ul", { className: "space-y-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs2("li", { className: "flex gap-2 text-xs text-gray-600 break-inside-avoid", children: [
        /* @__PURE__ */ jsx2("span", { className: "text-gray-300 shrink-0 mt-0.5", children: "\u2013" }),
        /* @__PURE__ */ jsx2("span", { className: "break-words min-w-0", children: it })
      ] }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs2(Fragment, { children: [
    H,
    /* @__PURE__ */ jsx2("p", { className: "text-xs text-gray-600 leading-relaxed break-words", children: text })
  ] });
};
var MinimalATSTemplate = ({ data }) => {
  const { sectionsConfig, personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages, customSections } = data;
  const SH5 = ({ children }) => /* @__PURE__ */ jsx2("div", { className: "text-xs font-bold uppercase tracking-[0.18em] text-gray-500 border-b border-gray-200 pb-0.5 mb-2 mt-5 first:mt-0 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx2(CustomBlock2, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs2(React.Fragment, { children: [
          /* @__PURE__ */ jsx2(SH5, { children: "Profile" }),
          /* @__PURE__ */ jsx2("p", { className: "text-gray-600 leading-relaxed text-xs break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs2(React.Fragment, { children: [
          /* @__PURE__ */ jsx2(SH5, { children: "Experience" }),
          /* @__PURE__ */ jsx2("div", { className: "space-y-4", children: experience.map((e, i) => /* @__PURE__ */ jsxs2("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs2("div", { className: "flex justify-between items-baseline flex-wrap gap-1", children: [
              /* @__PURE__ */ jsx2("span", { className: "font-semibold text-gray-900 text-sm break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx2("span", { className: "text-xs text-gray-400 whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs2("div", { className: "text-xs text-gray-500 mb-1 break-words", children: [
              e.company,
              e.location ? `, ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx2("p", { className: "text-xs text-gray-600 mb-1 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx2("ul", { className: "space-y-0.5", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs2("li", { className: "flex gap-2 text-gray-600 text-xs break-inside-avoid", children: [
              /* @__PURE__ */ jsx2("span", { className: "text-gray-300 shrink-0 mt-0.5", children: "\u2013" }),
              /* @__PURE__ */ jsx2("span", { className: "break-words min-w-0", children: r })
            ] }, j)) })
          ] }, i)) })
        ] }, "experience") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs2(React.Fragment, { children: [
          /* @__PURE__ */ jsx2(SH5, { children: "Skills" }),
          /* @__PURE__ */ jsx2("div", { className: "space-y-0.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx2("p", { className: "text-gray-600 text-xs leading-relaxed break-words", children: s }, i)) })
        ] }, "skills") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs2(React.Fragment, { children: [
          /* @__PURE__ */ jsx2(SH5, { children: "Projects" }),
          /* @__PURE__ */ jsx2("div", { className: "space-y-3", children: projects.map((p, i) => /* @__PURE__ */ jsxs2("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs2("div", { className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5", children: [
              /* @__PURE__ */ jsx2("span", { className: "font-semibold text-gray-900 text-sm break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs2("span", { className: "text-xs text-gray-400 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs2("div", { className: "text-xs text-gray-500 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx2("div", { className: "text-xs text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join("  \xB7  ") }),
            p.description && /* @__PURE__ */ jsx2("p", { className: "text-xs text-gray-600 leading-relaxed break-words", children: p.description }),
            p.highlights?.length > 0 && /* @__PURE__ */ jsx2("ul", { className: "mt-0.5 space-y-0.5", children: p.highlights.map((h, j) => /* @__PURE__ */ jsxs2("li", { className: "flex gap-2 text-xs text-gray-600 break-inside-avoid", children: [
              /* @__PURE__ */ jsx2("span", { className: "text-gray-300 shrink-0 mt-0.5", children: "\u2013" }),
              /* @__PURE__ */ jsx2("span", { className: "break-words min-w-0", children: h })
            ] }, j)) })
          ] }, i)) })
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs2(React.Fragment, { children: [
          /* @__PURE__ */ jsx2(SH5, { children: "Education" }),
          /* @__PURE__ */ jsx2("div", { className: "space-y-2", children: education.map((e, i) => /* @__PURE__ */ jsxs2("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs2("div", { className: "flex justify-between items-baseline flex-wrap gap-1", children: [
              /* @__PURE__ */ jsxs2("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx2("span", { className: "font-semibold text-gray-900 text-sm break-words", children: e.degree }),
                e.field && /* @__PURE__ */ jsxs2("span", { className: "text-gray-500 text-sm break-words", children: [
                  " in ",
                  e.field
                ] })
              ] }),
              /* @__PURE__ */ jsx2("span", { className: "text-xs text-gray-400 whitespace-nowrap shrink-0", children: e.year })
            ] }),
            e.institution && /* @__PURE__ */ jsx2("div", { className: "text-xs text-gray-500 break-words", children: e.institution }),
            e.gpa && /* @__PURE__ */ jsxs2("div", { className: "text-xs text-gray-400 break-words", children: [
              "Grade: ",
              e.gpa
            ] }),
            e.details && /* @__PURE__ */ jsx2("div", { className: "text-xs text-gray-400 mt-0.5 leading-relaxed break-words", children: e.details })
          ] }, i)) })
        ] }, "education") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs2(React.Fragment, { children: [
          /* @__PURE__ */ jsx2(SH5, { children: "Achievements" }),
          /* @__PURE__ */ jsx2("ul", { className: "space-y-1", children: achievements.map((a, i) => /* @__PURE__ */ jsxs2("li", { className: "flex gap-2 text-xs text-gray-600 break-inside-avoid", children: [
            /* @__PURE__ */ jsx2("span", { className: "text-gray-300 shrink-0 mt-0.5", children: "\u2013" }),
            /* @__PURE__ */ jsx2("span", { className: "break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs2(React.Fragment, { children: [
          /* @__PURE__ */ jsx2(SH5, { children: "Languages" }),
          /* @__PURE__ */ jsx2("p", { className: "text-xs text-gray-600 break-words", children: languages.join("  \xB7  ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs2(React.Fragment, { children: [
          /* @__PURE__ */ jsx2(SH5, { children: "Certifications" }),
          /* @__PURE__ */ jsx2("div", { className: "space-y-1", children: certifications.map((c, i) => /* @__PURE__ */ jsxs2("div", { className: "text-xs text-gray-600 break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx2("span", { className: "font-medium", children: c.name }),
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
      default:
        return /* @__PURE__ */ jsx2(CustomBlock2, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs2("div", { className: "resume-template minimal-ats max-w-4xl mx-auto bg-white px-10 font-sans text-sm text-gray-800 overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs2("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx2("h1", { className: "text-2xl font-light tracking-tight text-gray-900 mb-0.5 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx2("div", { className: "text-sm text-gray-600 mb-1.5 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs2("div", { className: "flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500", children: [
        personalInfo.email && /* @__PURE__ */ jsx2("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx2("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx2("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx2("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx2("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx2("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/ExecutiveTemplate.jsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var CustomBlock3 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = "text-base font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-800 pb-1 mb-3 break-after-avoid";
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs3("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx3("h2", { className: H, children: label }),
      /* @__PURE__ */ jsx3("ul", { className: "space-y-1.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs3("li", { className: "flex items-start text-gray-700 break-inside-avoid", children: [
        /* @__PURE__ */ jsx3("span", { className: "text-gray-400 font-bold mr-3 shrink-0", children: "\u25B8" }),
        /* @__PURE__ */ jsx3("span", { className: "break-words min-w-0", children: it })
      ] }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs3("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsx3("h2", { className: H, children: label }),
    /* @__PURE__ */ jsx3("p", { className: "text-gray-700 leading-relaxed break-words", children: text })
  ] });
};
var ExecutiveTemplate = ({ data }) => {
  const { sectionsConfig, personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages, customSections } = data;
  const SH5 = ({ children }) => /* @__PURE__ */ jsx3("h2", { className: "text-base font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-800 pb-1 mb-3 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx3(CustomBlock3, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs3("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx3(SH5, { children: "Executive Profile" }),
          /* @__PURE__ */ jsx3("p", { className: "text-gray-700 leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs3("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx3(SH5, { children: "Key Achievements" }),
          /* @__PURE__ */ jsx3("ul", { className: "space-y-1.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs3("li", { className: "flex items-start text-gray-700 break-inside-avoid", children: [
            /* @__PURE__ */ jsx3("span", { className: "text-gray-400 font-bold mr-3 shrink-0", children: "\u25B8" }),
            /* @__PURE__ */ jsx3("span", { className: "break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs3("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx3(SH5, { children: "Leadership Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs3("div", { className: "mb-5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs3("div", { className: "flex justify-between items-start flex-wrap gap-1 mb-0.5", children: [
              /* @__PURE__ */ jsx3("h3", { className: "font-bold text-gray-900 break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx3("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs3("div", { className: "text-sm text-gray-700 font-medium mb-1 break-words", children: [
              e.company,
              e.location ? ` \xB7 ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx3("p", { className: "text-sm text-gray-600 mb-1 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx3("ul", { className: "space-y-1", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs3("li", { className: "flex items-start text-gray-700 text-sm break-inside-avoid", children: [
              /* @__PURE__ */ jsx3("span", { className: "text-gray-400 mr-2 shrink-0", children: "\u25B8" }),
              /* @__PURE__ */ jsx3("span", { className: "break-words min-w-0", children: r })
            ] }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs3("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx3(SH5, { children: "Key Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs3("div", { className: "mb-4 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs3("div", { className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5", children: [
              /* @__PURE__ */ jsx3("h3", { className: "font-bold text-gray-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs3("span", { className: "text-sm text-gray-500 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs3("div", { className: "text-sm text-gray-600 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx3("div", { className: "text-xs text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join("  \xB7  ") }),
            p.description && /* @__PURE__ */ jsx3("p", { className: "text-gray-700 text-sm leading-relaxed break-words", children: p.description }),
            p.highlights?.length > 0 && /* @__PURE__ */ jsx3("ul", { className: "mt-1 space-y-1", children: p.highlights.map((h, j) => /* @__PURE__ */ jsxs3("li", { className: "flex items-start text-gray-700 text-sm break-inside-avoid", children: [
              /* @__PURE__ */ jsx3("span", { className: "text-gray-400 mr-2 shrink-0", children: "\u25B8" }),
              /* @__PURE__ */ jsx3("span", { className: "break-words min-w-0", children: h })
            ] }, j)) })
          ] }, i))
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs3("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx3(SH5, { children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsx3("div", { className: "mb-3 break-inside-avoid", children: /* @__PURE__ */ jsxs3("div", { className: "flex justify-between items-start flex-wrap gap-1", children: [
            /* @__PURE__ */ jsxs3("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs3("h3", { className: "font-bold text-gray-900 break-words", children: [
                e.degree,
                e.field ? ` in ${e.field}` : ""
              ] }),
              /* @__PURE__ */ jsx3("div", { className: "text-gray-700 text-sm break-words", children: e.institution }),
              e.gpa && /* @__PURE__ */ jsxs3("div", { className: "text-xs text-gray-500 break-words", children: [
                "Grade: ",
                e.gpa
              ] }),
              e.details && /* @__PURE__ */ jsx3("div", { className: "text-xs text-gray-400 mt-0.5 break-words", children: e.details })
            ] }),
            /* @__PURE__ */ jsx3("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: e.year })
          ] }) }, i))
        ] }, "education") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs3("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx3(SH5, { children: "Core Competencies" }),
          /* @__PURE__ */ jsx3("div", { className: "flex flex-col items-start gap-1.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx3("span", { className: "bg-gray-100 text-gray-700 px-3 py-1 text-sm rounded-sm break-words max-w-full", children: s }, i)) })
        ] }, "skills") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs3("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx3(SH5, { children: "Languages" }),
          /* @__PURE__ */ jsx3("div", { className: "text-gray-700 text-sm break-words", children: languages.join(" \xB7 ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs3("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx3(SH5, { children: "Certifications" }),
          certifications.map((c, i) => /* @__PURE__ */ jsxs3("div", { className: "mb-1.5 text-sm text-gray-700 break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx3("span", { className: "font-medium", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs3("span", { className: "text-gray-600", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs3("span", { className: "text-gray-500", children: [
              " (",
              c.year,
              ")"
            ] })
          ] }, i))
        ] }, "certifications") : null;
      default:
        return /* @__PURE__ */ jsx3(CustomBlock3, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs3("div", { className: "resume-template executive max-w-4xl mx-auto bg-white px-8 font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs3("div", { className: "text-center border-b-2 border-gray-800 pb-5 mb-6", children: [
      /* @__PURE__ */ jsx3("h1", { className: "text-3xl font-bold tracking-wide uppercase text-gray-900 mb-1 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx3("div", { className: "text-sm font-medium text-gray-600 uppercase tracking-widest mb-2 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs3("div", { className: "flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-sm text-gray-600", children: [
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
import { Fragment as Fragment2, jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var CustomBlock4 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = /* @__PURE__ */ jsx4("h2", { className: "text-sm font-bold text-blue-700 uppercase tracking-widest border-b border-blue-200 pb-1 mb-3 break-after-avoid", children: label });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs4("div", { className: "mb-5", children: [
      H,
      /* @__PURE__ */ jsx4("ul", { className: "space-y-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs4("li", { className: "flex items-start text-sm text-gray-700 break-inside-avoid", children: [
        /* @__PURE__ */ jsx4("span", { className: "text-blue-400 mr-2 shrink-0", children: "\u25B8" }),
        /* @__PURE__ */ jsx4("span", { className: "break-words min-w-0", children: it })
      ] }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs4("div", { className: "mb-5", children: [
    H,
    /* @__PURE__ */ jsx4("p", { className: "text-gray-700 text-sm leading-relaxed break-words", children: text })
  ] });
};
var FresherTemplate = ({ data }) => {
  const { sectionsConfig, personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages, customSections } = data;
  const SH5 = ({ children }) => /* @__PURE__ */ jsx4("h2", { className: "text-sm font-bold text-blue-700 uppercase tracking-widest border-b border-blue-200 pb-1 mb-3 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx4(CustomBlock4, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs4("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx4(SH5, { children: "Career Objective" }),
          /* @__PURE__ */ jsx4("p", { className: "text-gray-700 text-sm leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs4("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx4(SH5, { children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsx4("div", { className: "mb-3 break-inside-avoid", children: /* @__PURE__ */ jsxs4("div", { className: "flex justify-between items-start flex-wrap gap-1", children: [
            /* @__PURE__ */ jsxs4("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs4("h3", { className: "font-bold text-gray-900 text-sm break-words", children: [
                e.degree,
                e.field ? ` in ${e.field}` : ""
              ] }),
              /* @__PURE__ */ jsx4("div", { className: "text-gray-600 text-sm break-words", children: e.institution }),
              e.gpa && /* @__PURE__ */ jsxs4("div", { className: "text-xs text-gray-500 break-words", children: [
                "Grade / CGPA: ",
                e.gpa
              ] }),
              e.details && /* @__PURE__ */ jsx4("div", { className: "text-xs text-gray-400 mt-0.5 break-words", children: e.details })
            ] }),
            /* @__PURE__ */ jsx4("span", { className: "text-xs text-gray-500 whitespace-nowrap shrink-0", children: e.year })
          ] }) }, i))
        ] }, "education") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs4("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx4(SH5, { children: "Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs4("div", { className: "mb-3 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs4("div", { className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5", children: [
              /* @__PURE__ */ jsx4("h3", { className: "font-bold text-gray-900 text-sm break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs4("span", { className: "text-xs text-gray-500 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs4("div", { className: "text-xs text-blue-600 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx4("div", { className: "text-xs text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join("  \xB7  ") }),
            p.description && /* @__PURE__ */ jsx4("p", { className: "text-gray-700 text-sm leading-relaxed break-words", children: p.description }),
            p.highlights?.length > 0 && /* @__PURE__ */ jsx4("ul", { className: "mt-1 space-y-0.5", children: p.highlights.map((h, j) => /* @__PURE__ */ jsxs4("li", { className: "flex items-start text-sm text-gray-700 break-inside-avoid", children: [
              /* @__PURE__ */ jsx4("span", { className: "text-blue-400 mr-2 shrink-0", children: "\u25B8" }),
              /* @__PURE__ */ jsx4("span", { className: "break-words min-w-0", children: h })
            ] }, j)) })
          ] }, i))
        ] }, "projects") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs4("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx4(SH5, { children: "Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs4("div", { className: "mb-4 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs4("div", { className: "flex justify-between items-start flex-wrap gap-1 mb-0.5", children: [
              /* @__PURE__ */ jsx4("h3", { className: "font-bold text-gray-900 text-sm break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx4("span", { className: "text-xs text-gray-500 whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs4("div", { className: "text-xs text-gray-600 mb-1 break-words", children: [
              e.company,
              e.location ? ` \xB7 ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx4("p", { className: "text-sm text-gray-600 mb-1 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx4("ul", { className: "space-y-0.5", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs4("li", { className: "flex items-start text-sm text-gray-700 break-inside-avoid", children: [
              /* @__PURE__ */ jsx4("span", { className: "text-blue-400 mr-2 shrink-0", children: "\u25B8" }),
              /* @__PURE__ */ jsx4("span", { className: "break-words min-w-0", children: r })
            ] }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs4("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx4(SH5, { children: "Technical Skills" }),
          /* @__PURE__ */ jsx4("div", { className: "flex flex-col items-start gap-1.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx4("span", { className: "bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded text-xs font-medium break-words max-w-full", children: s }, i)) })
        ] }, "skills") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs4("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx4(SH5, { children: "Achievements & Awards" }),
          /* @__PURE__ */ jsx4("ul", { className: "space-y-1", children: achievements.map((a, i) => /* @__PURE__ */ jsxs4("li", { className: "flex items-start text-sm text-gray-700 break-inside-avoid", children: [
            /* @__PURE__ */ jsx4("span", { className: "text-blue-400 mr-2 shrink-0", children: "\u25B8" }),
            /* @__PURE__ */ jsx4("span", { className: "break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs4("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx4(SH5, { children: "Languages" }),
          /* @__PURE__ */ jsx4("div", { className: "text-gray-700 text-sm break-words", children: languages.join(" \xB7 ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs4("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx4(SH5, { children: "Certifications" }),
          certifications.map((c, i) => /* @__PURE__ */ jsxs4("div", { className: "mb-1.5 text-sm text-gray-700 break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx4("span", { className: "font-medium", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs4("span", { className: "text-gray-500", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs4("span", { className: "text-gray-400", children: [
              " (",
              c.year,
              ")"
            ] })
          ] }, i))
        ] }, "certifications") : null;
      default:
        return /* @__PURE__ */ jsx4(CustomBlock4, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs4("div", { className: "resume-template fresher max-w-4xl mx-auto bg-white px-8 font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs4("div", { className: "text-center mb-6 pb-4 border-b border-gray-200", children: [
      /* @__PURE__ */ jsx4("h1", { className: "text-2xl font-bold text-gray-900 mb-1 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx4("div", { className: "text-sm text-blue-600 font-medium mb-2 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs4("div", { className: "flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-xs text-gray-600", children: [
        personalInfo.email && /* @__PURE__ */ jsx4("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsxs4(Fragment2, { children: [
          /* @__PURE__ */ jsx4("span", { children: "|" }),
          /* @__PURE__ */ jsx4("span", { className: "break-words", children: personalInfo.phone })
        ] }),
        personalInfo.location && /* @__PURE__ */ jsxs4(Fragment2, { children: [
          /* @__PURE__ */ jsx4("span", { children: "|" }),
          /* @__PURE__ */ jsx4("span", { className: "break-words", children: personalInfo.location })
        ] })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-0.5 text-xs text-blue-600", children: [
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
  const Title = () => /* @__PURE__ */ jsxs5("h2", { className: "text-xl font-bold text-gray-900 mb-3 flex items-center gap-3 break-after-avoid", children: [
    /* @__PURE__ */ jsx5("span", { className: "w-8 h-0.5 bg-blue-500 shrink-0" }),
    /* @__PURE__ */ jsx5("span", { className: "break-words min-w-0", children: label })
  ] });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs5("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx5(Title, {}),
      /* @__PURE__ */ jsx5("ul", { className: "ml-11 space-y-1.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs5("li", { className: "text-gray-700 text-sm flex items-start break-inside-avoid", children: [
        /* @__PURE__ */ jsx5("span", { className: "text-blue-400 mr-2 shrink-0", children: "\u25B8" }),
        /* @__PURE__ */ jsx5("span", { className: "break-words min-w-0", children: it })
      ] }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs5("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsx5(Title, {}),
    /* @__PURE__ */ jsx5("p", { className: "ml-11 text-gray-700 text-sm leading-relaxed break-words", children: text })
  ] });
};
var CreativeATSTemplate = ({ data }) => {
  const { sectionsConfig, personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages, customSections } = data;
  const ST = ({ children }) => /* @__PURE__ */ jsxs5("h2", { className: "text-xl font-bold text-gray-900 mb-3 flex items-center gap-3 break-after-avoid", children: [
    /* @__PURE__ */ jsx5("span", { className: "w-8 h-0.5 bg-blue-500 shrink-0" }),
    /* @__PURE__ */ jsx5("span", { className: "break-words min-w-0", children })
  ] });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx5(CustomBlock5, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs5("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx5(ST, { children: "Professional Summary" }),
          /* @__PURE__ */ jsx5("p", { className: "text-gray-700 leading-relaxed ml-11 break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs5("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx5(ST, { children: "Work Experience" }),
          /* @__PURE__ */ jsx5("div", { className: "ml-11 space-y-4", children: experience.map((e, i) => /* @__PURE__ */ jsxs5("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs5("div", { className: "flex justify-between items-start flex-wrap gap-1 mb-0.5", children: [
              /* @__PURE__ */ jsx5("h3", { className: "font-bold text-gray-900 break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx5("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs5("div", { className: "text-sm text-gray-600 mb-1 break-words", children: [
              e.company,
              e.location ? ` \xB7 ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx5("p", { className: "text-sm text-gray-600 mb-1 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx5("ul", { className: "space-y-1", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs5("li", { className: "text-gray-700 text-sm flex items-start break-inside-avoid", children: [
              /* @__PURE__ */ jsx5("span", { className: "text-blue-400 mr-2 shrink-0", children: "\u25B8" }),
              /* @__PURE__ */ jsx5("span", { className: "break-words min-w-0", children: r })
            ] }, j)) })
          ] }, i)) })
        ] }, "experience") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs5("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx5(ST, { children: "Key Projects" }),
          /* @__PURE__ */ jsx5("div", { className: "ml-11 space-y-3", children: projects.map((p, i) => /* @__PURE__ */ jsxs5("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs5("div", { className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5", children: [
              /* @__PURE__ */ jsx5("h3", { className: "font-bold text-gray-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs5("span", { className: "text-sm text-gray-500 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs5("div", { className: "text-sm text-gray-500 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx5("div", { className: "text-xs text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join("  \xB7  ") }),
            p.description && /* @__PURE__ */ jsx5("p", { className: "text-gray-700 text-sm leading-relaxed break-words", children: p.description }),
            p.highlights?.length > 0 && /* @__PURE__ */ jsx5("ul", { className: "mt-1 space-y-0.5", children: p.highlights.map((h, j) => /* @__PURE__ */ jsxs5("li", { className: "text-gray-700 text-sm flex items-start break-inside-avoid", children: [
              /* @__PURE__ */ jsx5("span", { className: "text-blue-400 mr-2 shrink-0", children: "\u25B8" }),
              /* @__PURE__ */ jsx5("span", { className: "break-words min-w-0", children: h })
            ] }, j)) })
          ] }, i)) })
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs5("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx5(ST, { children: "Education" }),
          /* @__PURE__ */ jsx5("div", { className: "ml-11 space-y-3", children: education.map((e, i) => /* @__PURE__ */ jsx5("div", { className: "break-inside-avoid", children: /* @__PURE__ */ jsxs5("div", { className: "flex justify-between items-start flex-wrap gap-1", children: [
            /* @__PURE__ */ jsxs5("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs5("h3", { className: "font-bold text-gray-900 break-words", children: [
                e.degree,
                e.field ? ` in ${e.field}` : ""
              ] }),
              /* @__PURE__ */ jsx5("div", { className: "text-gray-600 text-sm break-words", children: e.institution }),
              e.gpa && /* @__PURE__ */ jsxs5("div", { className: "text-xs text-gray-500 break-words", children: [
                "Grade: ",
                e.gpa
              ] }),
              e.details && /* @__PURE__ */ jsx5("div", { className: "text-xs text-gray-400 mt-0.5 break-words", children: e.details })
            ] }),
            /* @__PURE__ */ jsx5("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: e.year })
          ] }) }, i)) })
        ] }, "education") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs5("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx5(ST, { children: "Skills & Expertise" }),
          /* @__PURE__ */ jsx5("div", { className: "ml-11 space-y-1", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx5("p", { className: "text-gray-700 text-sm break-words", children: s }, i)) })
        ] }, "skills") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs5("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx5(ST, { children: "Achievements" }),
          /* @__PURE__ */ jsx5("ul", { className: "ml-11 space-y-1.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs5("li", { className: "text-gray-700 text-sm flex items-start break-inside-avoid", children: [
            /* @__PURE__ */ jsx5("span", { className: "text-blue-400 mr-2 shrink-0", children: "\u25B8" }),
            /* @__PURE__ */ jsx5("span", { className: "break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs5("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx5(ST, { children: "Languages" }),
          /* @__PURE__ */ jsx5("div", { className: "ml-11 text-gray-700 text-sm break-words", children: languages.join(" \xB7 ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs5("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx5(ST, { children: "Certifications" }),
          /* @__PURE__ */ jsx5("div", { className: "ml-11 space-y-1.5", children: certifications.map((c, i) => /* @__PURE__ */ jsxs5("div", { className: "text-sm text-gray-700 break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx5("span", { className: "font-medium", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs5("span", { className: "text-gray-500", children: [
              " \xB7 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs5("span", { className: "text-gray-400", children: [
              " (",
              c.year,
              ")"
            ] })
          ] }, i)) })
        ] }, "certifications") : null;
      default:
        return /* @__PURE__ */ jsx5(CustomBlock5, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs5("div", { className: "resume-template creative-ats max-w-4xl mx-auto bg-white font-sans flex overflow-hidden", children: [
    /* @__PURE__ */ jsx5("div", { className: "w-2 bg-gradient-to-b from-blue-500 to-blue-700 shrink-0" }),
    /* @__PURE__ */ jsxs5("div", { className: "flex-1 px-8 min-w-0", children: [
      personalInfo && /* @__PURE__ */ jsxs5("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx5("h1", { className: "text-3xl font-bold text-gray-900 mb-1 break-words", children: personalInfo.fullName }),
        personalInfo.title && /* @__PURE__ */ jsx5("div", { className: "text-base text-blue-600 font-medium mb-2 break-words", children: personalInfo.title }),
        /* @__PURE__ */ jsxs5("div", { className: "flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-gray-500", children: [
          personalInfo.email && /* @__PURE__ */ jsx5("span", { className: "break-all", children: personalInfo.email }),
          personalInfo.phone && /* @__PURE__ */ jsx5("span", { className: "break-words", children: personalInfo.phone }),
          personalInfo.location && /* @__PURE__ */ jsx5("span", { className: "break-words", children: personalInfo.location }),
          personalInfo.linkedin && /* @__PURE__ */ jsx5("span", { className: "break-all", children: personalInfo.linkedin }),
          personalInfo.github && /* @__PURE__ */ jsx5("span", { className: "break-all", children: personalInfo.github }),
          personalInfo.portfolio && /* @__PURE__ */ jsx5("span", { className: "break-all", children: personalInfo.portfolio })
        ] })
      ] }),
      activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
    ] })
  ] });
};

// src/components/resume/templates/ClassicTemplate.jsx
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var Bul = ({ c }) => /* @__PURE__ */ jsxs6("li", { className: "flex gap-1.5 break-inside-avoid", children: [
  /* @__PURE__ */ jsx6("span", { className: "text-gray-400 shrink-0 select-none", children: "\u2022" }),
  /* @__PURE__ */ jsx6("span", { className: "text-gray-700 break-words min-w-0", children: c })
] });
var SH = ({ children }) => /* @__PURE__ */ jsx6("div", { className: "text-[9px] font-bold uppercase tracking-widest pb-0.5 mb-1.5 border-b border-gray-200 text-gray-500 break-after-avoid", children });
var CustomBlock6 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === "bullets") {
    if (!items || !items.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs6("div", { children: [
      /* @__PURE__ */ jsx6(SH, { children: label }),
      /* @__PURE__ */ jsx6("ul", { className: "space-y-0.5 pl-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsx6(Bul, { c: it }, i)) })
    ] });
  }
  if (!text || !text.trim()) return null;
  return /* @__PURE__ */ jsxs6("div", { children: [
    /* @__PURE__ */ jsx6(SH, { children: label }),
    /* @__PURE__ */ jsx6("p", { className: "text-gray-700 leading-relaxed break-words", children: text })
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
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  const renderSection = (sec) => {
    if (sec.type === "custom") {
      return /* @__PURE__ */ jsx6(CustomBlock6, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
    switch (sec.key) {
      case "basics":
        return null;
      // rendered in header
      case "summary":
        if (!summary) return null;
        return /* @__PURE__ */ jsxs6("div", { children: [
          /* @__PURE__ */ jsx6(SH, { children: "Professional Summary" }),
          /* @__PURE__ */ jsx6("p", { className: "text-gray-700 leading-relaxed break-words", children: summary })
        ] }, "summary");
      case "skills":
        if (!(skills || []).length) return null;
        return /* @__PURE__ */ jsxs6("div", { children: [
          /* @__PURE__ */ jsx6(SH, { children: "Skills" }),
          /* @__PURE__ */ jsx6("div", { className: "space-y-0.5", children: (skills || []).map((s, i) => /* @__PURE__ */ jsx6("p", { className: "break-words text-gray-700", children: s }, i)) })
        ] }, "skills");
      case "experience":
        if (!(experience || []).length) return null;
        return /* @__PURE__ */ jsxs6("div", { children: [
          /* @__PURE__ */ jsx6(SH, { children: "Work Experience" }),
          (experience || []).map((e, i) => /* @__PURE__ */ jsxs6("div", { className: "mb-2 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs6("div", { className: "flex justify-between gap-2", children: [
              /* @__PURE__ */ jsxs6("span", { className: "font-semibold break-words min-w-0", children: [
                e.position,
                e.company ? ` \u2014 ${e.company}` : ""
              ] }),
              /* @__PURE__ */ jsx6("span", { className: "text-gray-500 shrink-0 whitespace-nowrap", children: e.duration })
            ] }),
            (e.location || e.employmentType) && /* @__PURE__ */ jsx6("div", { className: "text-gray-500 text-[9px]", children: [e.location, e.employmentType].filter(Boolean).join(" \xB7 ") }),
            e.summary && /* @__PURE__ */ jsx6("p", { className: "text-gray-600 mt-0.5 break-words", children: e.summary }),
            (e.responsibilities || []).filter(Boolean).length > 0 && /* @__PURE__ */ jsx6("ul", { className: "mt-1 space-y-0.5 pl-1", children: (e.responsibilities || []).filter(Boolean).map((b, j) => /* @__PURE__ */ jsx6(Bul, { c: b }, j)) })
          ] }, i))
        ] }, "experience");
      case "projects":
        if (!(projects || []).length) return null;
        return /* @__PURE__ */ jsxs6("div", { children: [
          /* @__PURE__ */ jsx6(SH, { children: "Projects" }),
          (projects || []).map((p, i) => /* @__PURE__ */ jsxs6("div", { className: "mb-1.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs6("div", { className: "flex flex-wrap items-baseline gap-x-2", children: [
              /* @__PURE__ */ jsx6("span", { className: "font-semibold break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs6("span", { className: "text-gray-500 text-[9px] break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsx6("div", { className: "text-gray-500 text-[9px] break-words", children: p.technologies }),
            (p.link || p.github) && /* @__PURE__ */ jsx6("div", { className: "text-gray-400 text-[9px] break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx6("p", { className: "text-gray-700 mt-0.5 break-words", children: p.description }),
            (p.highlights || []).filter(Boolean).length > 0 && /* @__PURE__ */ jsx6("ul", { className: "mt-0.5 space-y-0.5 pl-1", children: (p.highlights || []).filter(Boolean).map((h, j) => /* @__PURE__ */ jsx6(Bul, { c: h }, j)) })
          ] }, i))
        ] }, "projects");
      case "education":
        if (!(education || []).length) return null;
        return /* @__PURE__ */ jsxs6("div", { children: [
          /* @__PURE__ */ jsx6(SH, { children: "Education" }),
          (education || []).map((e, i) => /* @__PURE__ */ jsx6("div", { className: "mb-1.5 break-inside-avoid", children: /* @__PURE__ */ jsxs6("div", { className: "flex justify-between gap-2", children: [
            /* @__PURE__ */ jsxs6("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx6("span", { className: "font-semibold", children: e.degree }),
              e.field && /* @__PURE__ */ jsxs6("span", { className: "text-gray-600", children: [
                " in ",
                e.field
              ] }),
              e.institution && /* @__PURE__ */ jsx6("div", { className: "text-gray-500", children: e.institution }),
              e.gpa && /* @__PURE__ */ jsxs6("div", { className: "text-gray-400 text-[9px]", children: [
                "Grade: ",
                e.gpa
              ] }),
              e.details && /* @__PURE__ */ jsx6("div", { className: "text-gray-400 text-[9px] mt-0.5", children: e.details })
            ] }),
            /* @__PURE__ */ jsx6("span", { className: "text-gray-500 shrink-0 whitespace-nowrap", children: e.year })
          ] }) }, i))
        ] }, "education");
      case "certifications":
        if (!(certifications || []).length) return null;
        return /* @__PURE__ */ jsxs6("div", { children: [
          /* @__PURE__ */ jsx6(SH, { children: "Certifications" }),
          (certifications || []).map((c, i) => /* @__PURE__ */ jsxs6("div", { className: "break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx6("span", { className: "font-medium break-words", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs6("span", { className: "text-gray-500", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs6("span", { className: "text-gray-400", children: [
              " (",
              c.year,
              ")"
            ] })
          ] }, i))
        ] }, "certifications");
      case "achievements":
        if (!(achievements || []).length) return null;
        return /* @__PURE__ */ jsxs6("div", { children: [
          /* @__PURE__ */ jsx6(SH, { children: "Achievements" }),
          /* @__PURE__ */ jsx6("ul", { className: "space-y-0.5 pl-1", children: (achievements || []).map((a, i) => /* @__PURE__ */ jsx6(Bul, { c: a }, i)) })
        ] }, "achievements");
      case "languages":
        if (!(languages || []).length) return null;
        return /* @__PURE__ */ jsxs6("div", { children: [
          /* @__PURE__ */ jsx6(SH, { children: "Languages" }),
          /* @__PURE__ */ jsx6("p", { className: "break-words", children: (languages || []).join(" \xB7 ") })
        ] }, "languages");
      default:
        return /* @__PURE__ */ jsx6(CustomBlock6, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  return /* @__PURE__ */ jsxs6("div", { className: "resume-template classic font-sans text-[10px] leading-tight text-gray-900 bg-white px-6 space-y-3 overflow-hidden", children: [
    /* @__PURE__ */ jsxs6("div", { className: "text-center border-b border-gray-300 pb-3", children: [
      /* @__PURE__ */ jsx6("div", { className: "text-lg font-bold tracking-wide uppercase break-words", children: personalInfo?.fullName || "Your Name" }),
      personalInfo?.title && /* @__PURE__ */ jsx6("div", { className: "text-[10px] text-gray-600 mt-0.5 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs6("div", { className: "flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1 text-gray-500", children: [
        personalInfo?.email && /* @__PURE__ */ jsx6("span", { className: "break-all", children: personalInfo.email }),
        personalInfo?.phone && /* @__PURE__ */ jsx6("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo?.location && /* @__PURE__ */ jsx6("span", { className: "break-words", children: personalInfo.location })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-0.5 text-gray-500", children: [
        personalInfo?.linkedin && /* @__PURE__ */ jsx6("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo?.github && /* @__PURE__ */ jsx6("span", { className: "break-all", children: personalInfo.github }),
        personalInfo?.portfolio && /* @__PURE__ */ jsx6("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/CorporateTemplate.jsx
import { jsx as jsx7, jsxs as jsxs7 } from "react/jsx-runtime";
var CustomBlock7 = ({ label, content, headingClass, bodyClass, bulletClass }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === "bullets") {
    if (!items || !items.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs7("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx7("h2", { className: headingClass, children: label }),
      /* @__PURE__ */ jsx7("ul", { className: "space-y-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs7("li", { className: `flex items-start break-inside-avoid ${bodyClass}`, children: [
        /* @__PURE__ */ jsx7("span", { className: `mr-2 shrink-0 ${bulletClass}`, children: "\u25B8" }),
        /* @__PURE__ */ jsx7("span", { className: "leading-relaxed break-words min-w-0", children: it })
      ] }, i)) })
    ] });
  }
  if (!text || !text.trim()) return null;
  return /* @__PURE__ */ jsxs7("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsx7("h2", { className: headingClass, children: label }),
    /* @__PURE__ */ jsx7("p", { className: `${bodyClass} leading-relaxed break-words`, children: text })
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
  const H = "text-lg font-bold text-gray-900 mb-2 pb-1 border-b-2 border-blue-500 uppercase tracking-wide break-after-avoid";
  const B = "text-gray-700 text-sm";
  const BL = "text-blue-500";
  const renderSection = (sec) => {
    if (sec.type === "custom") {
      return /* @__PURE__ */ jsx7(CustomBlock7, { label: sec.label, content: (customSections || {})[sec.id], headingClass: H, bodyClass: B, bulletClass: BL }, sec.id);
    }
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs7("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx7("h2", { className: H, children: "Professional Summary" }),
          /* @__PURE__ */ jsx7("p", { className: `${B} leading-relaxed break-words`, children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs7("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx7("h2", { className: H, children: "Professional Experience" }),
          experience.map((exp, i) => /* @__PURE__ */ jsxs7("div", { className: "mb-5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs7("div", { className: "flex justify-between items-start flex-wrap gap-1 mb-1", children: [
              /* @__PURE__ */ jsx7("h3", { className: "font-bold text-gray-900 break-words min-w-0", children: exp.position }),
              /* @__PURE__ */ jsx7("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: exp.duration })
            ] }),
            /* @__PURE__ */ jsxs7("div", { className: "text-sm text-gray-700 mb-1 break-words", children: [
              exp.company,
              exp.location ? ` \xB7 ${exp.location}` : "",
              exp.employmentType ? ` \xB7 ${exp.employmentType}` : ""
            ] }),
            exp.summary && /* @__PURE__ */ jsx7("p", { className: "text-sm text-gray-600 mb-1 leading-relaxed break-words", children: exp.summary }),
            exp.responsibilities?.length > 0 && /* @__PURE__ */ jsx7("ul", { className: "list-disc list-inside space-y-1 text-gray-700 text-sm", children: exp.responsibilities.map((r, j) => /* @__PURE__ */ jsx7("li", { className: "leading-relaxed break-words break-inside-avoid", children: r }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs7("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx7("h2", { className: H, children: "Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs7("div", { className: "mb-4 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs7("div", { className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5", children: [
              /* @__PURE__ */ jsx7("h3", { className: "font-bold text-gray-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs7("span", { className: "text-sm text-gray-500 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs7("div", { className: "text-sm text-gray-600 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx7("div", { className: "text-xs text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join("  \xB7  ") }),
            p.description && /* @__PURE__ */ jsx7("p", { className: "text-gray-700 text-sm leading-relaxed break-words", children: p.description }),
            p.highlights?.length > 0 && /* @__PURE__ */ jsx7("ul", { className: "list-disc list-inside mt-1 space-y-1 text-gray-700 text-sm", children: p.highlights.map((h, j) => /* @__PURE__ */ jsx7("li", { className: "break-words break-inside-avoid", children: h }, j)) })
          ] }, i))
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs7("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx7("h2", { className: H, children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsx7("div", { className: "mb-3 break-inside-avoid", children: /* @__PURE__ */ jsxs7("div", { className: "flex justify-between items-start flex-wrap gap-1", children: [
            /* @__PURE__ */ jsxs7("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs7("h3", { className: "font-bold text-gray-900 break-words", children: [
                e.degree,
                e.field ? ` in ${e.field}` : ""
              ] }),
              /* @__PURE__ */ jsx7("div", { className: "text-gray-700 text-sm break-words", children: e.institution }),
              e.gpa && /* @__PURE__ */ jsxs7("div", { className: "text-xs text-gray-500 break-words", children: [
                "Grade: ",
                e.gpa
              ] }),
              e.details && /* @__PURE__ */ jsx7("div", { className: "text-xs text-gray-500 mt-0.5 break-words", children: e.details })
            ] }),
            /* @__PURE__ */ jsx7("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: e.year })
          ] }) }, i))
        ] }, "education") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs7("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx7("h2", { className: H, children: "Skills" }),
          /* @__PURE__ */ jsx7("div", { className: "space-y-0.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx7("p", { className: `${B} break-words`, children: s }, i)) })
        ] }, "skills") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs7("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx7("h2", { className: H, children: "Achievements" }),
          /* @__PURE__ */ jsx7("ul", { className: "space-y-1.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs7("li", { className: `flex items-start break-inside-avoid ${B}`, children: [
            /* @__PURE__ */ jsx7("span", { className: `font-bold mr-2 shrink-0 ${BL}`, children: "\u25B8" }),
            /* @__PURE__ */ jsx7("span", { className: "leading-relaxed break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs7("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx7("h2", { className: H, children: "Languages" }),
          /* @__PURE__ */ jsx7("div", { className: "text-gray-700 text-sm break-words", children: languages.join(" \xB7 ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs7("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx7("h2", { className: H, children: "Certifications" }),
          certifications.map((c, i) => /* @__PURE__ */ jsxs7("div", { className: "mb-1.5 text-sm text-gray-700 break-words", children: [
            /* @__PURE__ */ jsx7("span", { className: "font-medium", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs7("span", { className: "text-gray-600", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs7("span", { className: "text-gray-500", children: [
              " (",
              c.year,
              ")"
            ] }),
            c.credentialUrl && /* @__PURE__ */ jsx7("span", { className: "block text-xs text-gray-400 break-all", children: c.credentialUrl })
          ] }, i))
        ] }, "certifications") : null;
      default:
        return /* @__PURE__ */ jsx7(CustomBlock7, { label: sec.label, content: (customSections || {})[sec.id], headingClass: H, bodyClass: B, bulletClass: BL }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs7("div", { className: "resume-template corporate max-w-4xl mx-auto bg-white px-8 font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs7("div", { className: "bg-gray-900 text-white -mx-8 px-8 pb-4 mb-6", children: [
      /* @__PURE__ */ jsx7("h1", { className: "text-3xl font-bold mb-1 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx7("div", { className: "text-base text-gray-300 font-medium mb-2 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs7("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400", children: [
        personalInfo.email && /* @__PURE__ */ jsx7("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx7("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx7("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx7("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx7("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx7("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/TraditionalTemplate.jsx
import { jsx as jsx8, jsxs as jsxs8 } from "react/jsx-runtime";
var Bul2 = ({ c }) => /* @__PURE__ */ jsxs8("li", { className: "flex gap-1.5 break-inside-avoid", children: [
  /* @__PURE__ */ jsx8("span", { className: "text-gray-400 shrink-0 select-none", children: "\u2022" }),
  /* @__PURE__ */ jsx8("span", { className: "text-gray-700 break-words min-w-0", children: c })
] });
var SH2 = ({ children }) => /* @__PURE__ */ jsx8("div", { className: "text-[11px] font-bold uppercase tracking-widest pb-0.5 mb-1.5 border-b-2 border-gray-400 text-gray-500 break-after-avoid", children });
var CustomBlock8 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === "bullets") {
    if (!items || !items.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs8("div", { children: [
      /* @__PURE__ */ jsx8(SH2, { children: label }),
      /* @__PURE__ */ jsx8("ul", { className: "space-y-0.5 pl-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsx8(Bul2, { c: it }, i)) })
    ] });
  }
  if (!text || !text.trim()) return null;
  return /* @__PURE__ */ jsxs8("div", { children: [
    /* @__PURE__ */ jsx8(SH2, { children: label }),
    /* @__PURE__ */ jsx8("p", { className: "text-gray-700 leading-relaxed break-words font-serif", children: text })
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
  const renderSection = (sec) => {
    if (sec.type === "custom") {
      return /* @__PURE__ */ jsx8(CustomBlock8, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        if (!summary) return null;
        return /* @__PURE__ */ jsxs8("div", { children: [
          /* @__PURE__ */ jsx8(SH2, { children: "Professional Summary" }),
          /* @__PURE__ */ jsx8("p", { className: "text-gray-700 leading-relaxed break-words font-serif text-[11px]", children: summary })
        ] }, "summary");
      case "skills":
        if (!(skills || []).length) return null;
        return /* @__PURE__ */ jsxs8("div", { children: [
          /* @__PURE__ */ jsx8(SH2, { children: "Skills" }),
          /* @__PURE__ */ jsx8("div", { className: "space-y-0.5", children: (skills || []).map((s, i) => /* @__PURE__ */ jsx8("p", { className: "break-words text-gray-700 font-serif text-[11px]", children: s }, i)) })
        ] }, "skills");
      case "experience":
        if (!(experience || []).length) return null;
        return /* @__PURE__ */ jsxs8("div", { children: [
          /* @__PURE__ */ jsx8(SH2, { children: "Work Experience" }),
          (experience || []).map((e, i) => /* @__PURE__ */ jsxs8("div", { className: "mb-2 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs8("div", { className: "flex justify-between gap-2", children: [
              /* @__PURE__ */ jsxs8("span", { className: "font-semibold break-words min-w-0 font-serif text-[11px]", children: [
                e.position,
                e.company ? ` \u2014 ${e.company}` : ""
              ] }),
              /* @__PURE__ */ jsx8("span", { className: "text-gray-500 shrink-0 whitespace-nowrap", children: e.duration })
            ] }),
            (e.location || e.employmentType) && /* @__PURE__ */ jsx8("div", { className: "text-gray-500 text-[10px]", children: [e.location, e.employmentType].filter(Boolean).join(" \xB7 ") }),
            e.summary && /* @__PURE__ */ jsx8("p", { className: "text-gray-600 mt-0.5 break-words font-serif text-[11px]", children: e.summary }),
            (e.responsibilities || []).filter(Boolean).length > 0 && /* @__PURE__ */ jsx8("ul", { className: "mt-1 space-y-0.5 pl-1", children: (e.responsibilities || []).filter(Boolean).map((b, j) => /* @__PURE__ */ jsx8(Bul2, { c: b }, j)) })
          ] }, i))
        ] }, "experience");
      case "projects":
        if (!(projects || []).length) return null;
        return /* @__PURE__ */ jsxs8("div", { children: [
          /* @__PURE__ */ jsx8(SH2, { children: "Projects" }),
          (projects || []).map((p, i) => /* @__PURE__ */ jsxs8("div", { className: "mb-1.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs8("div", { className: "flex flex-wrap items-baseline gap-x-2", children: [
              /* @__PURE__ */ jsx8("span", { className: "font-semibold break-words min-w-0 font-serif text-[11px]", children: p.name }),
              p.role && /* @__PURE__ */ jsxs8("span", { className: "text-gray-500 text-[10px] break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsx8("div", { className: "text-gray-500 text-[10px] break-words", children: p.technologies }),
            (p.link || p.github) && /* @__PURE__ */ jsx8("div", { className: "text-gray-400 text-[10px] break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx8("p", { className: "text-gray-700 mt-0.5 break-words font-serif text-[11px]", children: p.description }),
            (p.highlights || []).filter(Boolean).length > 0 && /* @__PURE__ */ jsx8("ul", { className: "mt-0.5 space-y-0.5 pl-1", children: (p.highlights || []).filter(Boolean).map((h, j) => /* @__PURE__ */ jsx8(Bul2, { c: h }, j)) })
          ] }, i))
        ] }, "projects");
      case "education":
        if (!(education || []).length) return null;
        return /* @__PURE__ */ jsxs8("div", { children: [
          /* @__PURE__ */ jsx8(SH2, { children: "Education" }),
          (education || []).map((e, i) => /* @__PURE__ */ jsx8("div", { className: "mb-1.5 break-inside-avoid", children: /* @__PURE__ */ jsxs8("div", { className: "flex justify-between gap-2", children: [
            /* @__PURE__ */ jsxs8("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx8("span", { className: "font-semibold font-serif text-[11px]", children: e.degree }),
              e.field && /* @__PURE__ */ jsxs8("span", { className: "text-gray-600 font-serif text-[11px]", children: [
                " in ",
                e.field
              ] }),
              e.institution && /* @__PURE__ */ jsx8("div", { className: "text-gray-500 font-serif text-[11px]", children: e.institution }),
              e.gpa && /* @__PURE__ */ jsxs8("div", { className: "text-gray-400 text-[10px]", children: [
                "Grade: ",
                e.gpa
              ] }),
              e.details && /* @__PURE__ */ jsx8("div", { className: "text-gray-400 text-[10px] mt-0.5", children: e.details })
            ] }),
            /* @__PURE__ */ jsx8("span", { className: "text-gray-500 shrink-0 whitespace-nowrap", children: e.year })
          ] }) }, i))
        ] }, "education");
      case "certifications":
        if (!(certifications || []).length) return null;
        return /* @__PURE__ */ jsxs8("div", { children: [
          /* @__PURE__ */ jsx8(SH2, { children: "Certifications" }),
          (certifications || []).map((c, i) => /* @__PURE__ */ jsxs8("div", { className: "break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx8("span", { className: "font-medium break-words font-serif text-[11px]", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs8("span", { className: "text-gray-500", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs8("span", { className: "text-gray-400", children: [
              " (",
              c.year,
              ")"
            ] })
          ] }, i))
        ] }, "certifications");
      case "achievements":
        if (!(achievements || []).length) return null;
        return /* @__PURE__ */ jsxs8("div", { children: [
          /* @__PURE__ */ jsx8(SH2, { children: "Achievements" }),
          /* @__PURE__ */ jsx8("ul", { className: "space-y-0.5 pl-1", children: (achievements || []).map((a, i) => /* @__PURE__ */ jsx8(Bul2, { c: a }, i)) })
        ] }, "achievements");
      case "languages":
        if (!(languages || []).length) return null;
        return /* @__PURE__ */ jsxs8("div", { children: [
          /* @__PURE__ */ jsx8(SH2, { children: "Languages" }),
          /* @__PURE__ */ jsx8("p", { className: "break-words font-serif text-[11px]", children: (languages || []).join(" \xB7 ") })
        ] }, "languages");
      default:
        return /* @__PURE__ */ jsx8(CustomBlock8, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  return /* @__PURE__ */ jsxs8("div", { className: "resume-template traditional font-serif text-[11px] leading-tight text-gray-900 bg-white px-6 space-y-3 overflow-hidden", children: [
    /* @__PURE__ */ jsxs8("div", { className: "text-center border-b-2 border-gray-400 pb-3", children: [
      /* @__PURE__ */ jsx8("div", { className: "text-lg font-bold tracking-wide uppercase break-words", children: personalInfo?.fullName || "Your Name" }),
      personalInfo?.title && /* @__PURE__ */ jsx8("div", { className: "text-[11px] text-gray-600 mt-0.5 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs8("div", { className: "flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1 text-gray-500", children: [
        personalInfo?.email && /* @__PURE__ */ jsx8("span", { className: "break-all", children: personalInfo.email }),
        personalInfo?.phone && /* @__PURE__ */ jsx8("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo?.location && /* @__PURE__ */ jsx8("span", { className: "break-words", children: personalInfo.location })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-0.5 text-gray-500", children: [
        personalInfo?.linkedin && /* @__PURE__ */ jsx8("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo?.github && /* @__PURE__ */ jsx8("span", { className: "break-all", children: personalInfo.github }),
        personalInfo?.portfolio && /* @__PURE__ */ jsx8("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/CleanTemplate.jsx
import { Fragment as Fragment3, jsx as jsx9, jsxs as jsxs9 } from "react/jsx-runtime";
var CustomBlock9 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = /* @__PURE__ */ jsx9("div", { className: "text-xs font-bold uppercase tracking-[0.18em] text-gray-400 border-b border-gray-100 pb-0.5 mb-2 mt-5 break-after-avoid", children: label });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs9(Fragment3, { children: [
      H,
      /* @__PURE__ */ jsx9("ul", { className: "space-y-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs9("li", { className: "flex gap-2 text-xs text-gray-500 break-inside-avoid", children: [
        /* @__PURE__ */ jsx9("span", { className: "text-gray-200 shrink-0 mt-0.5", children: "\u2013" }),
        /* @__PURE__ */ jsx9("span", { className: "break-words min-w-0", children: it })
      ] }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs9(Fragment3, { children: [
    H,
    /* @__PURE__ */ jsx9("p", { className: "text-xs text-gray-500 leading-relaxed break-words", children: text })
  ] });
};
var CleanTemplate = ({ data }) => {
  const { sectionsConfig, personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages, customSections } = data;
  const SH5 = ({ children }) => /* @__PURE__ */ jsx9("div", { className: "text-xs font-bold uppercase tracking-[0.18em] text-gray-400 border-b border-gray-100 pb-0.5 mb-2 mt-5 first:mt-0 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx9(CustomBlock9, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs9("div", { children: [
          /* @__PURE__ */ jsx9(SH5, { children: "Profile" }),
          /* @__PURE__ */ jsx9("p", { className: "text-gray-500 leading-relaxed text-xs break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs9("div", { children: [
          /* @__PURE__ */ jsx9(SH5, { children: "Experience" }),
          /* @__PURE__ */ jsx9("div", { className: "space-y-4", children: experience.map((e, i) => /* @__PURE__ */ jsxs9("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs9("div", { className: "flex justify-between items-baseline flex-wrap gap-1", children: [
              /* @__PURE__ */ jsx9("span", { className: "font-semibold text-gray-900 text-sm break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx9("span", { className: "text-xs text-gray-400 whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs9("div", { className: "text-xs text-gray-400 mb-1 break-words", children: [
              e.company,
              e.location ? `, ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx9("p", { className: "text-xs text-gray-500 mb-1 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx9("ul", { className: "space-y-0.5", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs9("li", { className: "flex gap-2 text-gray-500 text-xs break-inside-avoid", children: [
              /* @__PURE__ */ jsx9("span", { className: "text-gray-200 shrink-0 mt-0.5", children: "\u2013" }),
              /* @__PURE__ */ jsx9("span", { className: "break-words min-w-0", children: r })
            ] }, j)) })
          ] }, i)) })
        ] }, "experience") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs9("div", { children: [
          /* @__PURE__ */ jsx9(SH5, { children: "Skills" }),
          /* @__PURE__ */ jsx9("div", { className: "flex flex-wrap gap-1.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx9("span", { className: "text-gray-600 text-xs rounded-full bg-gray-50 px-3 py-0.5 break-words", children: s }, i)) })
        ] }, "skills") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs9("div", { children: [
          /* @__PURE__ */ jsx9(SH5, { children: "Projects" }),
          /* @__PURE__ */ jsx9("div", { className: "space-y-3", children: projects.map((p, i) => /* @__PURE__ */ jsxs9("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs9("div", { className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5", children: [
              /* @__PURE__ */ jsx9("span", { className: "font-semibold text-gray-900 text-sm break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs9("span", { className: "text-xs text-gray-400 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs9("div", { className: "text-xs text-gray-400 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx9("div", { className: "text-xs text-gray-300 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join("  \xB7  ") }),
            p.description && /* @__PURE__ */ jsx9("p", { className: "text-xs text-gray-500 leading-relaxed break-words", children: p.description }),
            p.highlights?.length > 0 && /* @__PURE__ */ jsx9("ul", { className: "mt-0.5 space-y-0.5", children: p.highlights.map((h, j) => /* @__PURE__ */ jsxs9("li", { className: "flex gap-2 text-xs text-gray-500 break-inside-avoid", children: [
              /* @__PURE__ */ jsx9("span", { className: "text-gray-200 shrink-0 mt-0.5", children: "\u2013" }),
              /* @__PURE__ */ jsx9("span", { className: "break-words min-w-0", children: h })
            ] }, j)) })
          ] }, i)) })
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs9("div", { children: [
          /* @__PURE__ */ jsx9(SH5, { children: "Education" }),
          /* @__PURE__ */ jsx9("div", { className: "space-y-2", children: education.map((e, i) => /* @__PURE__ */ jsxs9("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs9("div", { className: "flex justify-between items-baseline flex-wrap gap-1", children: [
              /* @__PURE__ */ jsxs9("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx9("span", { className: "font-semibold text-gray-900 text-sm break-words", children: e.degree }),
                e.field && /* @__PURE__ */ jsxs9("span", { className: "text-gray-400 text-sm break-words", children: [
                  " in ",
                  e.field
                ] })
              ] }),
              /* @__PURE__ */ jsx9("span", { className: "text-xs text-gray-400 whitespace-nowrap shrink-0", children: e.year })
            ] }),
            e.institution && /* @__PURE__ */ jsx9("div", { className: "text-xs text-gray-400 break-words", children: e.institution }),
            e.gpa && /* @__PURE__ */ jsxs9("div", { className: "text-xs text-gray-300 break-words", children: [
              "Grade: ",
              e.gpa
            ] }),
            e.details && /* @__PURE__ */ jsx9("div", { className: "text-xs text-gray-300 mt-0.5 leading-relaxed break-words", children: e.details })
          ] }, i)) })
        ] }, "education") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs9("div", { children: [
          /* @__PURE__ */ jsx9(SH5, { children: "Achievements" }),
          /* @__PURE__ */ jsx9("ul", { className: "space-y-1", children: achievements.map((a, i) => /* @__PURE__ */ jsxs9("li", { className: "flex gap-2 text-xs text-gray-500 break-inside-avoid", children: [
            /* @__PURE__ */ jsx9("span", { className: "text-gray-200 shrink-0 mt-0.5", children: "\u2013" }),
            /* @__PURE__ */ jsx9("span", { className: "break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs9("div", { children: [
          /* @__PURE__ */ jsx9(SH5, { children: "Languages" }),
          /* @__PURE__ */ jsx9("p", { className: "text-xs text-gray-500 break-words", children: languages.join("  \xB7  ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs9("div", { children: [
          /* @__PURE__ */ jsx9(SH5, { children: "Certifications" }),
          /* @__PURE__ */ jsx9("div", { className: "space-y-1", children: certifications.map((c, i) => /* @__PURE__ */ jsxs9("div", { className: "text-xs text-gray-500 break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx9("span", { className: "font-medium", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs9("span", { className: "text-gray-400", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs9("span", { className: "text-gray-300", children: [
              " (",
              c.year,
              ")"
            ] })
          ] }, i)) })
        ] }, "certifications") : null;
      default:
        return /* @__PURE__ */ jsx9(CustomBlock9, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs9("div", { className: "resume-template clean max-w-4xl mx-auto bg-white px-12 font-sans text-sm text-gray-800 overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs9("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx9("h1", { className: "text-2xl font-light tracking-tight text-gray-900 mb-0.5 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx9("div", { className: "text-sm text-gray-400 mb-1.5 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs9("div", { className: "flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-400", children: [
        personalInfo.email && /* @__PURE__ */ jsx9("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx9("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx9("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx9("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx9("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx9("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/GraduateTemplate.jsx
import { Fragment as Fragment4, jsx as jsx10, jsxs as jsxs10 } from "react/jsx-runtime";
var CustomBlock10 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = /* @__PURE__ */ jsx10("h2", { className: "text-sm font-bold text-teal-600 uppercase tracking-widest border-b border-teal-200 pb-1 mb-3 break-after-avoid", children: label });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs10("div", { className: "mb-5", children: [
      H,
      /* @__PURE__ */ jsx10("ul", { className: "space-y-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs10("li", { className: "flex items-start text-sm text-gray-700 break-inside-avoid", children: [
        /* @__PURE__ */ jsx10("span", { className: "text-teal-400 mr-2 shrink-0", children: "\u25B8" }),
        /* @__PURE__ */ jsx10("span", { className: "break-words min-w-0", children: it })
      ] }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs10("div", { className: "mb-5", children: [
    H,
    /* @__PURE__ */ jsx10("p", { className: "text-gray-700 text-sm leading-relaxed break-words", children: text })
  ] });
};
var GraduateTemplate = ({ data }) => {
  const { sectionsConfig, personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages, customSections } = data;
  const SH5 = ({ children }) => /* @__PURE__ */ jsx10("h2", { className: "text-sm font-bold text-teal-600 uppercase tracking-widest border-b border-teal-200 pb-1 mb-3 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx10(CustomBlock10, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs10("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx10(SH5, { children: "Career Objective" }),
          /* @__PURE__ */ jsx10("p", { className: "text-gray-700 text-sm leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs10("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx10(SH5, { children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsx10("div", { className: "mb-3 break-inside-avoid", children: /* @__PURE__ */ jsxs10("div", { className: "flex justify-between items-start flex-wrap gap-1", children: [
            /* @__PURE__ */ jsxs10("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs10("h3", { className: "font-bold text-gray-900 text-sm break-words", children: [
                e.degree,
                e.field ? ` in ${e.field}` : ""
              ] }),
              /* @__PURE__ */ jsx10("div", { className: "text-gray-600 text-sm break-words", children: e.institution }),
              e.gpa && /* @__PURE__ */ jsxs10("div", { className: "text-xs text-gray-500 break-words", children: [
                "Grade / CGPA: ",
                e.gpa
              ] }),
              e.details && /* @__PURE__ */ jsx10("div", { className: "text-xs text-gray-400 mt-0.5 break-words", children: e.details })
            ] }),
            /* @__PURE__ */ jsx10("span", { className: "text-xs text-gray-500 whitespace-nowrap shrink-0", children: e.year })
          ] }) }, i))
        ] }, "education") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs10("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx10(SH5, { children: "Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs10("div", { className: "mb-3 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs10("div", { className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5", children: [
              /* @__PURE__ */ jsx10("h3", { className: "font-bold text-gray-900 text-sm break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs10("span", { className: "text-xs text-gray-500 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs10("div", { className: "text-xs text-teal-600 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx10("div", { className: "text-xs text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join("  \xB7  ") }),
            p.description && /* @__PURE__ */ jsx10("p", { className: "text-gray-700 text-sm leading-relaxed break-words", children: p.description }),
            p.highlights?.length > 0 && /* @__PURE__ */ jsx10("ul", { className: "mt-1 space-y-0.5", children: p.highlights.map((h, j) => /* @__PURE__ */ jsxs10("li", { className: "flex items-start text-sm text-gray-700 break-inside-avoid", children: [
              /* @__PURE__ */ jsx10("span", { className: "text-teal-400 mr-2 shrink-0", children: "\u25B8" }),
              /* @__PURE__ */ jsx10("span", { className: "break-words min-w-0", children: h })
            ] }, j)) })
          ] }, i))
        ] }, "projects") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs10("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx10(SH5, { children: "Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs10("div", { className: "mb-4 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs10("div", { className: "flex justify-between items-start flex-wrap gap-1 mb-0.5", children: [
              /* @__PURE__ */ jsx10("h3", { className: "font-bold text-gray-900 text-sm break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx10("span", { className: "text-xs text-gray-500 whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs10("div", { className: "text-xs text-gray-600 mb-1 break-words", children: [
              e.company,
              e.location ? ` \xB7 ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx10("p", { className: "text-sm text-gray-600 mb-1 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx10("ul", { className: "space-y-0.5", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs10("li", { className: "flex items-start text-sm text-gray-700 break-inside-avoid", children: [
              /* @__PURE__ */ jsx10("span", { className: "text-teal-400 mr-2 shrink-0", children: "\u25B8" }),
              /* @__PURE__ */ jsx10("span", { className: "break-words min-w-0", children: r })
            ] }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs10("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx10(SH5, { children: "Technical Skills" }),
          /* @__PURE__ */ jsx10("div", { className: "flex flex-col items-start gap-1.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx10("span", { className: "bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded text-xs font-medium break-words max-w-full", children: s }, i)) })
        ] }, "skills") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs10("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx10(SH5, { children: "Achievements & Awards" }),
          /* @__PURE__ */ jsx10("ul", { className: "space-y-1", children: achievements.map((a, i) => /* @__PURE__ */ jsxs10("li", { className: "flex items-start text-sm text-gray-700 break-inside-avoid", children: [
            /* @__PURE__ */ jsx10("span", { className: "text-teal-400 mr-2 shrink-0", children: "\u25B8" }),
            /* @__PURE__ */ jsx10("span", { className: "break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs10("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx10(SH5, { children: "Languages" }),
          /* @__PURE__ */ jsx10("div", { className: "text-gray-700 text-sm break-words", children: languages.join(" \xB7 ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs10("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx10(SH5, { children: "Certifications" }),
          certifications.map((c, i) => /* @__PURE__ */ jsxs10("div", { className: "mb-1.5 text-sm text-gray-700 break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx10("span", { className: "font-medium", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs10("span", { className: "text-gray-500", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs10("span", { className: "text-gray-400", children: [
              " (",
              c.year,
              ")"
            ] })
          ] }, i))
        ] }, "certifications") : null;
      default:
        return /* @__PURE__ */ jsx10(CustomBlock10, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  const educationSection = activeSections.filter((s) => s.key === "education");
  const otherSections = activeSections.filter((s) => s.key !== "basics" && s.key !== "education");
  return /* @__PURE__ */ jsxs10("div", { className: "resume-template graduate max-w-4xl mx-auto bg-white px-8 font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs10("div", { className: "text-center mb-6 pb-4 border-b border-gray-200", children: [
      /* @__PURE__ */ jsx10("h1", { className: "text-2xl font-bold text-gray-900 mb-1 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx10("div", { className: "text-sm text-teal-600 font-medium mb-2 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs10("div", { className: "flex flex-wrap justify-center gap-x-3 gap-y-0.5 text-xs text-gray-600", children: [
        personalInfo.email && /* @__PURE__ */ jsx10("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsxs10(Fragment4, { children: [
          /* @__PURE__ */ jsx10("span", { children: "|" }),
          /* @__PURE__ */ jsx10("span", { className: "break-words", children: personalInfo.phone })
        ] }),
        personalInfo.location && /* @__PURE__ */ jsxs10(Fragment4, { children: [
          /* @__PURE__ */ jsx10("span", { children: "|" }),
          /* @__PURE__ */ jsx10("span", { className: "break-words", children: personalInfo.location })
        ] })
      ] }),
      /* @__PURE__ */ jsxs10("div", { className: "flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-0.5 text-xs text-teal-600", children: [
        personalInfo.linkedin && /* @__PURE__ */ jsx10("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx10("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx10("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    educationSection.map((sec) => renderSection(sec)),
    otherSections.map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/TechTemplate.jsx
import { jsx as jsx11, jsxs as jsxs11 } from "react/jsx-runtime";
var CustomBlock11 = ({ label, content, headingClass, bodyClass, bulletClass }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === "bullets") {
    if (!items || !items.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs11("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx11("h2", { className: headingClass, children: label }),
      /* @__PURE__ */ jsx11("ul", { className: "space-y-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs11("li", { className: `flex items-start break-inside-avoid ${bodyClass}`, children: [
        /* @__PURE__ */ jsx11("span", { className: `mr-2 shrink-0 ${bulletClass}`, children: "\u25B8" }),
        /* @__PURE__ */ jsx11("span", { className: "leading-relaxed break-words min-w-0 font-mono text-xs", children: it })
      ] }, i)) })
    ] });
  }
  if (!text || !text.trim()) return null;
  return /* @__PURE__ */ jsxs11("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsx11("h2", { className: headingClass, children: label }),
    /* @__PURE__ */ jsx11("p", { className: `${bodyClass} leading-relaxed break-words`, children: text })
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
  const H = "text-base font-bold text-gray-900 mb-2 pb-1 border-b border-gray-300 font-mono uppercase tracking-[0.2em] break-after-avoid";
  const B = "text-gray-700 text-sm";
  const BL = "text-gray-400";
  const renderSection = (sec) => {
    if (sec.type === "custom") {
      return /* @__PURE__ */ jsx11(CustomBlock11, { label: sec.label, content: (customSections || {})[sec.id], headingClass: H, bodyClass: B, bulletClass: BL }, sec.id);
    }
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs11("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx11("h2", { className: H, children: "Summary" }),
          /* @__PURE__ */ jsx11("p", { className: `${B} leading-relaxed break-words`, children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs11("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx11("h2", { className: H, children: "Experience" }),
          experience.map((exp, i) => /* @__PURE__ */ jsxs11("div", { className: "mb-5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs11("div", { className: "flex justify-between items-start flex-wrap gap-1 mb-1", children: [
              /* @__PURE__ */ jsx11("h3", { className: "font-bold text-gray-900 font-mono text-sm break-words min-w-0", children: exp.position }),
              /* @__PURE__ */ jsx11("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: exp.duration })
            ] }),
            /* @__PURE__ */ jsxs11("div", { className: "text-sm text-gray-700 mb-1 break-words", children: [
              exp.company,
              exp.location ? ` \xB7 ${exp.location}` : "",
              exp.employmentType ? ` \xB7 ${exp.employmentType}` : ""
            ] }),
            exp.summary && /* @__PURE__ */ jsx11("p", { className: "text-sm text-gray-600 mb-1 leading-relaxed break-words", children: exp.summary }),
            exp.responsibilities?.length > 0 && /* @__PURE__ */ jsx11("ul", { className: "list-disc list-inside space-y-1 text-gray-700 text-sm", children: exp.responsibilities.map((r, j) => /* @__PURE__ */ jsx11("li", { className: "leading-relaxed break-words break-inside-avoid", children: r }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs11("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx11("h2", { className: H, children: "Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs11("div", { className: "mb-4 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs11("div", { className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5", children: [
              /* @__PURE__ */ jsx11("h3", { className: "font-bold text-gray-900 font-mono text-sm break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs11("span", { className: "text-sm text-gray-500 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs11("div", { className: "text-sm text-gray-600 mb-0.5 break-words font-mono text-xs", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx11("div", { className: "text-xs text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join("  \xB7  ") }),
            p.description && /* @__PURE__ */ jsx11("p", { className: "text-gray-700 text-sm leading-relaxed break-words", children: p.description }),
            p.highlights?.length > 0 && /* @__PURE__ */ jsx11("ul", { className: "list-disc list-inside mt-1 space-y-1 text-gray-700 text-sm", children: p.highlights.map((h, j) => /* @__PURE__ */ jsx11("li", { className: "break-words break-inside-avoid", children: h }, j)) })
          ] }, i))
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs11("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx11("h2", { className: H, children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsx11("div", { className: "mb-3 break-inside-avoid", children: /* @__PURE__ */ jsxs11("div", { className: "flex justify-between items-start flex-wrap gap-1", children: [
            /* @__PURE__ */ jsxs11("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs11("h3", { className: "font-bold text-gray-900 font-mono text-sm break-words", children: [
                e.degree,
                e.field ? ` in ${e.field}` : ""
              ] }),
              /* @__PURE__ */ jsx11("div", { className: "text-gray-700 text-sm break-words", children: e.institution }),
              e.gpa && /* @__PURE__ */ jsxs11("div", { className: "text-xs text-gray-500 break-words", children: [
                "Grade: ",
                e.gpa
              ] }),
              e.details && /* @__PURE__ */ jsx11("div", { className: "text-xs text-gray-500 mt-0.5 break-words", children: e.details })
            ] }),
            /* @__PURE__ */ jsx11("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: e.year })
          ] }) }, i))
        ] }, "education") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs11("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx11("h2", { className: H, children: "Skills" }),
          /* @__PURE__ */ jsx11("div", { className: "grid grid-cols-2 gap-x-4", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx11("p", { className: "text-gray-700 text-xs font-mono break-words", children: s }, i)) })
        ] }, "skills") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs11("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx11("h2", { className: H, children: "Achievements" }),
          /* @__PURE__ */ jsx11("ul", { className: "space-y-1.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs11("li", { className: `flex items-start break-inside-avoid ${B}`, children: [
            /* @__PURE__ */ jsx11("span", { className: `font-bold mr-2 shrink-0 ${BL}`, children: "\u25B8" }),
            /* @__PURE__ */ jsx11("span", { className: "leading-relaxed break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs11("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx11("h2", { className: H, children: "Languages" }),
          /* @__PURE__ */ jsx11("div", { className: "text-gray-700 text-sm break-words", children: languages.join(" \xB7 ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs11("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx11("h2", { className: H, children: "Certifications" }),
          certifications.map((c, i) => /* @__PURE__ */ jsxs11("div", { className: "mb-1.5 text-sm text-gray-700 break-words", children: [
            /* @__PURE__ */ jsx11("span", { className: "font-medium", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs11("span", { className: "text-gray-600", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs11("span", { className: "text-gray-500", children: [
              " (",
              c.year,
              ")"
            ] }),
            c.credentialUrl && /* @__PURE__ */ jsx11("span", { className: "block text-xs text-gray-400 break-all", children: c.credentialUrl })
          ] }, i))
        ] }, "certifications") : null;
      default:
        return /* @__PURE__ */ jsx11(CustomBlock11, { label: sec.label, content: (customSections || {})[sec.id], headingClass: H, bodyClass: B, bulletClass: BL }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs11("div", { className: "resume-template tech max-w-4xl mx-auto bg-white px-8 font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs11("div", { className: "border-b-2 border-gray-800 pb-4 mb-6", children: [
      /* @__PURE__ */ jsx11("h1", { className: "text-3xl font-bold text-gray-900 mb-1 break-words font-mono", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx11("div", { className: "text-base text-gray-600 font-medium mb-2 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs11("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 font-mono text-xs", children: [
        personalInfo.email && /* @__PURE__ */ jsx11("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx11("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx11("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx11("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx11("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx11("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/EngineeringTemplate.jsx
import { jsx as jsx12, jsxs as jsxs12 } from "react/jsx-runtime";
var CustomBlock12 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const Title = () => /* @__PURE__ */ jsxs12("h2", { className: "text-xl font-bold text-gray-900 mb-3 flex items-center gap-3 break-after-avoid", children: [
    /* @__PURE__ */ jsx12("span", { className: "w-8 h-0.5 bg-emerald-500 shrink-0" }),
    /* @__PURE__ */ jsx12("span", { className: "break-words min-w-0", children: label })
  ] });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs12("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx12(Title, {}),
      /* @__PURE__ */ jsx12("ul", { className: "ml-11 space-y-1.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs12("li", { className: "text-gray-700 text-sm flex items-start break-inside-avoid", children: [
        /* @__PURE__ */ jsx12("span", { className: "text-emerald-500 mr-2 shrink-0", children: "\u25B8" }),
        /* @__PURE__ */ jsx12("span", { className: "break-words min-w-0", children: it })
      ] }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs12("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsx12(Title, {}),
    /* @__PURE__ */ jsx12("p", { className: "ml-11 text-gray-700 text-sm leading-relaxed break-words", children: text })
  ] });
};
var EngineeringTemplate = ({ data }) => {
  const { sectionsConfig, personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages, customSections } = data;
  const ST = ({ children }) => /* @__PURE__ */ jsxs12("h2", { className: "text-xl font-bold text-gray-900 mb-3 flex items-center gap-3 break-after-avoid", children: [
    /* @__PURE__ */ jsx12("span", { className: "w-8 h-0.5 bg-emerald-500 shrink-0" }),
    /* @__PURE__ */ jsx12("span", { className: "break-words min-w-0", children })
  ] });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx12(CustomBlock12, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs12("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx12(ST, { children: "Professional Summary" }),
          /* @__PURE__ */ jsx12("p", { className: "text-gray-700 leading-relaxed ml-11 break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs12("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx12(ST, { children: "Work Experience" }),
          /* @__PURE__ */ jsx12("div", { className: "ml-11 space-y-4", children: experience.map((e, i) => /* @__PURE__ */ jsxs12("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs12("div", { className: "flex justify-between items-start flex-wrap gap-1 mb-0.5", children: [
              /* @__PURE__ */ jsx12("h3", { className: "font-bold text-gray-900 break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx12("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs12("div", { className: "text-sm text-gray-600 mb-1 break-words", children: [
              e.company,
              e.location ? ` \xB7 ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx12("p", { className: "text-sm text-gray-600 mb-1 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx12("ul", { className: "space-y-1", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs12("li", { className: "text-gray-700 text-sm flex items-start break-inside-avoid", children: [
              /* @__PURE__ */ jsx12("span", { className: "text-emerald-500 mr-2 shrink-0", children: "\u25B8" }),
              /* @__PURE__ */ jsx12("span", { className: "break-words min-w-0", children: r })
            ] }, j)) })
          ] }, i)) })
        ] }, "experience") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs12("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx12(ST, { children: "Key Projects" }),
          /* @__PURE__ */ jsx12("div", { className: "ml-11 space-y-3", children: projects.map((p, i) => /* @__PURE__ */ jsxs12("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs12("div", { className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5", children: [
              /* @__PURE__ */ jsx12("h3", { className: "font-bold text-gray-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs12("span", { className: "text-sm text-gray-500 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs12("div", { className: "text-sm text-gray-500 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx12("div", { className: "text-xs text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join("  \xB7  ") }),
            p.description && /* @__PURE__ */ jsx12("p", { className: "text-gray-700 text-sm leading-relaxed break-words", children: p.description }),
            p.highlights?.length > 0 && /* @__PURE__ */ jsx12("ul", { className: "mt-1 space-y-0.5", children: p.highlights.map((h, j) => /* @__PURE__ */ jsxs12("li", { className: "text-gray-700 text-sm flex items-start break-inside-avoid", children: [
              /* @__PURE__ */ jsx12("span", { className: "text-emerald-500 mr-2 shrink-0", children: "\u25B8" }),
              /* @__PURE__ */ jsx12("span", { className: "break-words min-w-0", children: h })
            ] }, j)) })
          ] }, i)) })
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs12("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx12(ST, { children: "Education" }),
          /* @__PURE__ */ jsx12("div", { className: "ml-11 space-y-3", children: education.map((e, i) => /* @__PURE__ */ jsx12("div", { className: "break-inside-avoid", children: /* @__PURE__ */ jsxs12("div", { className: "flex justify-between items-start flex-wrap gap-1", children: [
            /* @__PURE__ */ jsxs12("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs12("h3", { className: "font-bold text-gray-900 break-words", children: [
                e.degree,
                e.field ? ` in ${e.field}` : ""
              ] }),
              /* @__PURE__ */ jsx12("div", { className: "text-gray-600 text-sm break-words", children: e.institution }),
              e.gpa && /* @__PURE__ */ jsxs12("div", { className: "text-xs text-gray-500 break-words", children: [
                "Grade: ",
                e.gpa
              ] }),
              e.details && /* @__PURE__ */ jsx12("div", { className: "text-xs text-gray-400 mt-0.5 break-words", children: e.details })
            ] }),
            /* @__PURE__ */ jsx12("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: e.year })
          ] }) }, i)) })
        ] }, "education") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs12("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx12(ST, { children: "Skills & Expertise" }),
          /* @__PURE__ */ jsx12("div", { className: "ml-11 space-y-1", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx12("p", { className: "text-gray-700 text-sm break-words", children: s }, i)) })
        ] }, "skills") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs12("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx12(ST, { children: "Achievements" }),
          /* @__PURE__ */ jsx12("ul", { className: "ml-11 space-y-1.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs12("li", { className: "text-gray-700 text-sm flex items-start break-inside-avoid", children: [
            /* @__PURE__ */ jsx12("span", { className: "text-emerald-500 mr-2 shrink-0", children: "\u25B8" }),
            /* @__PURE__ */ jsx12("span", { className: "break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs12("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx12(ST, { children: "Languages" }),
          /* @__PURE__ */ jsx12("div", { className: "ml-11 text-gray-700 text-sm break-words", children: languages.join(" \xB7 ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs12("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx12(ST, { children: "Certifications" }),
          /* @__PURE__ */ jsx12("div", { className: "ml-11 space-y-1.5", children: certifications.map((c, i) => /* @__PURE__ */ jsxs12("div", { className: "text-sm text-gray-700 break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx12("span", { className: "font-medium", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs12("span", { className: "text-gray-500", children: [
              " \xB7 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs12("span", { className: "text-gray-400", children: [
              " (",
              c.year,
              ")"
            ] })
          ] }, i)) })
        ] }, "certifications") : null;
      default:
        return /* @__PURE__ */ jsx12(CustomBlock12, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs12("div", { className: "resume-template engineering max-w-4xl mx-auto bg-white font-sans flex overflow-hidden", children: [
    /* @__PURE__ */ jsx12("div", { className: "w-2 bg-gradient-to-b from-emerald-500 to-emerald-700 shrink-0" }),
    /* @__PURE__ */ jsxs12("div", { className: "flex-1 px-8 min-w-0", children: [
      personalInfo && /* @__PURE__ */ jsxs12("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsxs12("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsx12("h1", { className: "text-3xl font-bold text-gray-900 mb-1 break-words", children: personalInfo.fullName }),
          /* @__PURE__ */ jsxs12("div", { className: "text-right shrink-0 ml-4", children: [
            personalInfo.email && /* @__PURE__ */ jsx12("div", { className: "text-sm text-gray-500 break-all", children: personalInfo.email }),
            personalInfo.phone && /* @__PURE__ */ jsx12("div", { className: "text-sm text-gray-500 break-words", children: personalInfo.phone }),
            personalInfo.location && /* @__PURE__ */ jsx12("div", { className: "text-sm text-gray-500 break-words", children: personalInfo.location })
          ] })
        ] }),
        personalInfo.title && /* @__PURE__ */ jsx12("div", { className: "text-base text-emerald-600 font-medium mb-2 break-words", children: personalInfo.title }),
        /* @__PURE__ */ jsxs12("div", { className: "flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-gray-500", children: [
          personalInfo.linkedin && /* @__PURE__ */ jsx12("span", { className: "break-all", children: personalInfo.linkedin }),
          personalInfo.github && /* @__PURE__ */ jsx12("span", { className: "break-all", children: personalInfo.github }),
          personalInfo.portfolio && /* @__PURE__ */ jsx12("span", { className: "break-all", children: personalInfo.portfolio })
        ] })
      ] }),
      activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
    ] })
  ] });
};

// src/components/resume/templates/LeadershipTemplate.jsx
import { jsx as jsx13, jsxs as jsxs13 } from "react/jsx-runtime";
var CustomBlock13 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = "text-base font-bold text-gray-900 uppercase tracking-widest border-b-2 border-amber-700 pb-1 mb-3 break-after-avoid";
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs13("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx13("h2", { className: H, children: label }),
      /* @__PURE__ */ jsx13("ul", { className: "space-y-1.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs13("li", { className: "flex items-start text-gray-700 break-inside-avoid", children: [
        /* @__PURE__ */ jsx13("span", { className: "text-amber-700 font-bold mr-3 shrink-0", children: "\u25B8" }),
        /* @__PURE__ */ jsx13("span", { className: "break-words min-w-0", children: it })
      ] }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs13("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsx13("h2", { className: H, children: label }),
    /* @__PURE__ */ jsx13("p", { className: "text-gray-700 leading-relaxed break-words", children: text })
  ] });
};
var LeadershipTemplate = ({ data }) => {
  const { sectionsConfig, personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages, customSections } = data;
  const SH5 = ({ children }) => /* @__PURE__ */ jsx13("h2", { className: "text-base font-bold text-amber-700 uppercase tracking-widest border-b-2 border-amber-700 pb-1 mb-3 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx13(CustomBlock13, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs13("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx13(SH5, { children: "Executive Profile" }),
          /* @__PURE__ */ jsx13("p", { className: "text-gray-700 leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs13("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx13(SH5, { children: "Key Achievements" }),
          /* @__PURE__ */ jsx13("ul", { className: "space-y-1.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs13("li", { className: "flex items-start text-gray-700 break-inside-avoid", children: [
            /* @__PURE__ */ jsx13("span", { className: "text-amber-700 font-bold mr-3 shrink-0", children: "\u25B8" }),
            /* @__PURE__ */ jsx13("span", { className: "break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs13("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx13(SH5, { children: "Leadership Experience" }),
          experience.map((e, i) => /* @__PURE__ */ jsxs13("div", { className: "mb-5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs13("div", { className: "flex justify-between items-start flex-wrap gap-1 mb-0.5", children: [
              /* @__PURE__ */ jsx13("h3", { className: "font-bold text-gray-900 break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx13("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs13("div", { className: "text-sm text-gray-700 font-medium mb-1 break-words", children: [
              e.company,
              e.location ? ` \xB7 ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx13("p", { className: "text-sm text-gray-600 mb-1 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx13("ul", { className: "space-y-1", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs13("li", { className: "flex items-start text-gray-700 text-sm break-inside-avoid", children: [
              /* @__PURE__ */ jsx13("span", { className: "text-amber-700 mr-2 shrink-0", children: "\u25B8" }),
              /* @__PURE__ */ jsx13("span", { className: "break-words min-w-0", children: r })
            ] }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs13("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx13(SH5, { children: "Key Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs13("div", { className: "mb-4 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs13("div", { className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5", children: [
              /* @__PURE__ */ jsx13("h3", { className: "font-bold text-gray-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs13("span", { className: "text-sm text-gray-500 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs13("div", { className: "text-sm text-gray-600 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx13("div", { className: "text-xs text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join("  \xB7  ") }),
            p.description && /* @__PURE__ */ jsx13("p", { className: "text-gray-700 text-sm leading-relaxed break-words", children: p.description }),
            p.highlights?.length > 0 && /* @__PURE__ */ jsx13("ul", { className: "mt-1 space-y-1", children: p.highlights.map((h, j) => /* @__PURE__ */ jsxs13("li", { className: "flex items-start text-gray-700 text-sm break-inside-avoid", children: [
              /* @__PURE__ */ jsx13("span", { className: "text-amber-700 mr-2 shrink-0", children: "\u25B8" }),
              /* @__PURE__ */ jsx13("span", { className: "break-words min-w-0", children: h })
            ] }, j)) })
          ] }, i))
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs13("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx13(SH5, { children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsx13("div", { className: "mb-3 break-inside-avoid", children: /* @__PURE__ */ jsxs13("div", { className: "flex justify-between items-start flex-wrap gap-1", children: [
            /* @__PURE__ */ jsxs13("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs13("h3", { className: "font-bold text-gray-900 break-words", children: [
                e.degree,
                e.field ? ` in ${e.field}` : ""
              ] }),
              /* @__PURE__ */ jsx13("div", { className: "text-gray-700 text-sm break-words", children: e.institution }),
              e.gpa && /* @__PURE__ */ jsxs13("div", { className: "text-xs text-gray-500 break-words", children: [
                "Grade: ",
                e.gpa
              ] }),
              e.details && /* @__PURE__ */ jsx13("div", { className: "text-xs text-gray-400 mt-0.5 break-words", children: e.details })
            ] }),
            /* @__PURE__ */ jsx13("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: e.year })
          ] }) }, i))
        ] }, "education") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs13("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx13(SH5, { children: "Core Competencies" }),
          /* @__PURE__ */ jsx13("div", { className: "flex flex-col items-start gap-1.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx13("span", { className: "bg-amber-50 text-amber-700 px-3 py-1 text-sm rounded-sm break-words max-w-full", children: s }, i)) })
        ] }, "skills") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs13("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx13(SH5, { children: "Languages" }),
          /* @__PURE__ */ jsx13("div", { className: "text-gray-700 text-sm break-words", children: languages.join(" \xB7 ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs13("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx13(SH5, { children: "Certifications" }),
          certifications.map((c, i) => /* @__PURE__ */ jsxs13("div", { className: "mb-1.5 text-sm text-gray-700 break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx13("span", { className: "font-medium", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs13("span", { className: "text-gray-600", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs13("span", { className: "text-gray-500", children: [
              " (",
              c.year,
              ")"
            ] })
          ] }, i))
        ] }, "certifications") : null;
      default:
        return /* @__PURE__ */ jsx13(CustomBlock13, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs13("div", { className: "resume-template leadership max-w-4xl mx-auto bg-white px-8 font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs13("div", { className: "text-center border-b-2 border-amber-700 pb-5 mb-6", children: [
      /* @__PURE__ */ jsx13("h1", { className: "text-4xl font-bold tracking-wide uppercase text-gray-900 mb-1 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx13("div", { className: "text-sm font-medium text-amber-700 uppercase tracking-widest mb-2 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs13("div", { className: "flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-sm text-gray-600", children: [
        personalInfo.email && /* @__PURE__ */ jsx13("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx13("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx13("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx13("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx13("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx13("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/DesignerTemplate.jsx
import { jsx as jsx14, jsxs as jsxs14 } from "react/jsx-runtime";
var CustomBlock14 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const Title = () => /* @__PURE__ */ jsxs14("h2", { className: "text-xl font-bold text-purple-600 mb-3 flex items-center gap-3 break-after-avoid", children: [
    /* @__PURE__ */ jsx14("span", { className: "w-8 h-0.5 bg-purple-500 shrink-0" }),
    /* @__PURE__ */ jsx14("span", { className: "break-words min-w-0", children: label })
  ] });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs14("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx14(Title, {}),
      /* @__PURE__ */ jsx14("ul", { className: "ml-11 space-y-1.5", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs14("li", { className: "text-gray-700 text-sm flex items-start break-inside-avoid", children: [
        /* @__PURE__ */ jsx14("span", { className: "text-purple-400 mr-2 shrink-0", children: "\u25B8" }),
        /* @__PURE__ */ jsx14("span", { className: "break-words min-w-0", children: it })
      ] }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs14("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsx14(Title, {}),
    /* @__PURE__ */ jsx14("p", { className: "ml-11 text-gray-700 text-sm leading-relaxed break-words", children: text })
  ] });
};
var DesignerTemplate = ({ data }) => {
  const { sectionsConfig, personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages, customSections } = data;
  const ST = ({ children }) => /* @__PURE__ */ jsxs14("h2", { className: "text-xl font-bold text-purple-600 mb-3 flex items-center gap-3 break-after-avoid", children: [
    /* @__PURE__ */ jsx14("span", { className: "w-8 h-0.5 bg-purple-500 shrink-0" }),
    /* @__PURE__ */ jsx14("span", { className: "break-words min-w-0", children })
  ] });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx14(CustomBlock14, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs14("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx14(ST, { children: "Professional Summary" }),
          /* @__PURE__ */ jsx14("p", { className: "text-gray-700 leading-relaxed ml-11 break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs14("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx14(ST, { children: "Work Experience" }),
          /* @__PURE__ */ jsx14("div", { className: "ml-11 space-y-4", children: experience.map((e, i) => /* @__PURE__ */ jsxs14("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs14("div", { className: "flex justify-between items-start flex-wrap gap-1 mb-0.5", children: [
              /* @__PURE__ */ jsx14("h3", { className: "font-bold text-gray-900 break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx14("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs14("div", { className: "text-sm text-purple-600 mb-1 break-words", children: [
              e.company,
              e.location ? ` \xB7 ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx14("p", { className: "text-sm text-gray-600 mb-1 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx14("ul", { className: "space-y-1", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs14("li", { className: "text-gray-700 text-sm flex items-start break-inside-avoid", children: [
              /* @__PURE__ */ jsx14("span", { className: "text-purple-400 mr-2 shrink-0", children: "\u25B8" }),
              /* @__PURE__ */ jsx14("span", { className: "break-words min-w-0", children: r })
            ] }, j)) })
          ] }, i)) })
        ] }, "experience") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs14("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx14(ST, { children: "Key Projects" }),
          /* @__PURE__ */ jsx14("div", { className: "ml-11 space-y-3", children: projects.map((p, i) => /* @__PURE__ */ jsxs14("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs14("div", { className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5", children: [
              /* @__PURE__ */ jsx14("h3", { className: "font-bold text-gray-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs14("span", { className: "text-sm text-gray-500 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs14("div", { className: "text-sm text-purple-500 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx14("div", { className: "text-xs text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join("  \xB7  ") }),
            p.description && /* @__PURE__ */ jsx14("p", { className: "text-gray-700 text-sm leading-relaxed break-words", children: p.description }),
            p.highlights?.length > 0 && /* @__PURE__ */ jsx14("ul", { className: "mt-1 space-y-0.5", children: p.highlights.map((h, j) => /* @__PURE__ */ jsxs14("li", { className: "text-gray-700 text-sm flex items-start break-inside-avoid", children: [
              /* @__PURE__ */ jsx14("span", { className: "text-purple-400 mr-2 shrink-0", children: "\u25B8" }),
              /* @__PURE__ */ jsx14("span", { className: "break-words min-w-0", children: h })
            ] }, j)) })
          ] }, i)) })
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs14("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx14(ST, { children: "Education" }),
          /* @__PURE__ */ jsx14("div", { className: "ml-11 space-y-3", children: education.map((e, i) => /* @__PURE__ */ jsx14("div", { className: "break-inside-avoid", children: /* @__PURE__ */ jsxs14("div", { className: "flex justify-between items-start flex-wrap gap-1", children: [
            /* @__PURE__ */ jsxs14("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs14("h3", { className: "font-bold text-gray-900 break-words", children: [
                e.degree,
                e.field ? ` in ${e.field}` : ""
              ] }),
              /* @__PURE__ */ jsx14("div", { className: "text-gray-600 text-sm break-words", children: e.institution }),
              e.gpa && /* @__PURE__ */ jsxs14("div", { className: "text-xs text-gray-500 break-words", children: [
                "Grade: ",
                e.gpa
              ] }),
              e.details && /* @__PURE__ */ jsx14("div", { className: "text-xs text-gray-400 mt-0.5 break-words", children: e.details })
            ] }),
            /* @__PURE__ */ jsx14("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: e.year })
          ] }) }, i)) })
        ] }, "education") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs14("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx14(ST, { children: "Skills & Expertise" }),
          /* @__PURE__ */ jsx14("div", { className: "ml-11 flex flex-wrap gap-2", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx14("span", { className: "text-sm text-purple-700 bg-purple-50 px-3 py-1 rounded-full break-words", children: s }, i)) })
        ] }, "skills") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs14("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx14(ST, { children: "Achievements" }),
          /* @__PURE__ */ jsx14("ul", { className: "ml-11 space-y-1.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs14("li", { className: "text-gray-700 text-sm flex items-start break-inside-avoid", children: [
            /* @__PURE__ */ jsx14("span", { className: "text-purple-400 mr-2 shrink-0", children: "\u25B8" }),
            /* @__PURE__ */ jsx14("span", { className: "break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs14("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx14(ST, { children: "Languages" }),
          /* @__PURE__ */ jsx14("div", { className: "ml-11 text-gray-700 text-sm break-words", children: languages.join(" \xB7 ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs14("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx14(ST, { children: "Certifications" }),
          /* @__PURE__ */ jsx14("div", { className: "ml-11 space-y-1.5", children: certifications.map((c, i) => /* @__PURE__ */ jsxs14("div", { className: "text-sm text-gray-700 break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx14("span", { className: "font-medium", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs14("span", { className: "text-gray-500", children: [
              " \xB7 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs14("span", { className: "text-gray-400", children: [
              " (",
              c.year,
              ")"
            ] })
          ] }, i)) })
        ] }, "certifications") : null;
      default:
        return /* @__PURE__ */ jsx14(CustomBlock14, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs14("div", { className: "resume-template designer max-w-4xl mx-auto bg-white font-sans flex overflow-hidden", children: [
    /* @__PURE__ */ jsx14("div", { className: "w-2 bg-gradient-to-b from-purple-500 to-pink-600 shrink-0" }),
    /* @__PURE__ */ jsxs14("div", { className: "flex-1 px-8 min-w-0", children: [
      personalInfo && /* @__PURE__ */ jsxs14("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx14("h1", { className: "text-3xl font-bold text-gray-900 mb-1 break-words", children: personalInfo.fullName }),
        personalInfo.title && /* @__PURE__ */ jsx14("div", { className: "text-base text-purple-600 font-medium mb-2 break-words", children: personalInfo.title }),
        /* @__PURE__ */ jsxs14("div", { className: "flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-gray-500", children: [
          personalInfo.email && /* @__PURE__ */ jsx14("span", { className: "break-all", children: personalInfo.email }),
          personalInfo.phone && /* @__PURE__ */ jsx14("span", { className: "break-words", children: personalInfo.phone }),
          personalInfo.location && /* @__PURE__ */ jsx14("span", { className: "break-words", children: personalInfo.location }),
          personalInfo.linkedin && /* @__PURE__ */ jsx14("span", { className: "break-all", children: personalInfo.linkedin }),
          personalInfo.github && /* @__PURE__ */ jsx14("span", { className: "break-all", children: personalInfo.github }),
          personalInfo.portfolio && /* @__PURE__ */ jsx14("span", { className: "break-all", children: personalInfo.portfolio })
        ] })
      ] }),
      activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
    ] })
  ] });
};

// src/components/resume/templates/SleekTemplate.jsx
import { jsx as jsx15, jsxs as jsxs15 } from "react/jsx-runtime";
var CustomBlock15 = ({ label, content, headingClass, bodyClass, bulletClass }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === "bullets") {
    if (!items || !items.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs15("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx15("h2", { className: headingClass, children: label }),
      /* @__PURE__ */ jsx15("ul", { className: "space-y-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs15("li", { className: `flex items-start break-inside-avoid ${bodyClass}`, children: [
        /* @__PURE__ */ jsx15("span", { className: `mr-2 shrink-0 ${bulletClass}`, children: "\u25B8" }),
        /* @__PURE__ */ jsx15("span", { className: "leading-relaxed break-words min-w-0", children: it })
      ] }, i)) })
    ] });
  }
  if (!text || !text.trim()) return null;
  return /* @__PURE__ */ jsxs15("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsx15("h2", { className: headingClass, children: label }),
    /* @__PURE__ */ jsx15("p", { className: `${bodyClass} leading-relaxed break-words`, children: text })
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
  const H = "text-sm font-semibold text-gray-700 mb-2 pb-1 border-b border-gray-100 uppercase tracking-[0.2em] break-after-avoid bg-gray-50 px-3 py-1 rounded";
  const B = "text-gray-700 text-sm";
  const BL = "text-gray-400";
  const renderSection = (sec) => {
    if (sec.type === "custom") {
      return /* @__PURE__ */ jsx15(CustomBlock15, { label: sec.label, content: (customSections || {})[sec.id], headingClass: H, bodyClass: B, bulletClass: BL }, sec.id);
    }
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs15("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx15("h2", { className: H, children: "Professional Summary" }),
          /* @__PURE__ */ jsx15("p", { className: `${B} leading-relaxed break-words`, children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs15("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx15("h2", { className: H, children: "Professional Experience" }),
          experience.map((exp, i) => /* @__PURE__ */ jsxs15("div", { className: "mb-5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs15("div", { className: "flex justify-between items-start flex-wrap gap-1 mb-1", children: [
              /* @__PURE__ */ jsx15("h3", { className: "font-bold text-gray-900 break-words min-w-0", children: exp.position }),
              /* @__PURE__ */ jsx15("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: exp.duration })
            ] }),
            /* @__PURE__ */ jsxs15("div", { className: "text-sm text-gray-700 mb-1 break-words", children: [
              exp.company,
              exp.location ? ` \xB7 ${exp.location}` : "",
              exp.employmentType ? ` \xB7 ${exp.employmentType}` : ""
            ] }),
            exp.summary && /* @__PURE__ */ jsx15("p", { className: "text-sm text-gray-600 mb-1 leading-relaxed break-words", children: exp.summary }),
            exp.responsibilities?.length > 0 && /* @__PURE__ */ jsx15("ul", { className: "list-disc list-inside space-y-1 text-gray-700 text-sm", children: exp.responsibilities.map((r, j) => /* @__PURE__ */ jsx15("li", { className: "leading-relaxed break-words break-inside-avoid", children: r }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs15("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx15("h2", { className: H, children: "Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs15("div", { className: "mb-4 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs15("div", { className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5", children: [
              /* @__PURE__ */ jsx15("h3", { className: "font-bold text-gray-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs15("span", { className: "text-sm text-gray-500 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs15("div", { className: "text-sm text-gray-600 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx15("div", { className: "text-xs text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join("  \xB7  ") }),
            p.description && /* @__PURE__ */ jsx15("p", { className: "text-gray-700 text-sm leading-relaxed break-words", children: p.description }),
            p.highlights?.length > 0 && /* @__PURE__ */ jsx15("ul", { className: "list-disc list-inside mt-1 space-y-1 text-gray-700 text-sm", children: p.highlights.map((h, j) => /* @__PURE__ */ jsx15("li", { className: "break-words break-inside-avoid", children: h }, j)) })
          ] }, i))
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs15("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx15("h2", { className: H, children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsx15("div", { className: "mb-3 break-inside-avoid", children: /* @__PURE__ */ jsxs15("div", { className: "flex justify-between items-start flex-wrap gap-1", children: [
            /* @__PURE__ */ jsxs15("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs15("h3", { className: "font-bold text-gray-900 break-words", children: [
                e.degree,
                e.field ? ` in ${e.field}` : ""
              ] }),
              /* @__PURE__ */ jsx15("div", { className: "text-gray-700 text-sm break-words", children: e.institution }),
              e.gpa && /* @__PURE__ */ jsxs15("div", { className: "text-xs text-gray-500 break-words", children: [
                "Grade: ",
                e.gpa
              ] }),
              e.details && /* @__PURE__ */ jsx15("div", { className: "text-xs text-gray-500 mt-0.5 break-words", children: e.details })
            ] }),
            /* @__PURE__ */ jsx15("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: e.year })
          ] }) }, i))
        ] }, "education") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs15("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx15("h2", { className: H, children: "Skills" }),
          /* @__PURE__ */ jsx15("div", { className: "space-y-0.5", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx15("p", { className: `${B} break-words`, children: s }, i)) })
        ] }, "skills") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs15("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx15("h2", { className: H, children: "Achievements" }),
          /* @__PURE__ */ jsx15("ul", { className: "space-y-1.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs15("li", { className: `flex items-start break-inside-avoid ${B}`, children: [
            /* @__PURE__ */ jsx15("span", { className: `font-bold mr-2 shrink-0 ${BL}`, children: "\u25B8" }),
            /* @__PURE__ */ jsx15("span", { className: "leading-relaxed break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs15("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx15("h2", { className: H, children: "Languages" }),
          /* @__PURE__ */ jsx15("div", { className: "text-gray-700 text-sm break-words", children: languages.join(" \xB7 ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs15("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx15("h2", { className: H, children: "Certifications" }),
          certifications.map((c, i) => /* @__PURE__ */ jsxs15("div", { className: "mb-1.5 text-sm text-gray-700 break-words", children: [
            /* @__PURE__ */ jsx15("span", { className: "font-medium", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs15("span", { className: "text-gray-600", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs15("span", { className: "text-gray-500", children: [
              " (",
              c.year,
              ")"
            ] }),
            c.credentialUrl && /* @__PURE__ */ jsx15("span", { className: "block text-xs text-gray-400 break-all", children: c.credentialUrl })
          ] }, i))
        ] }, "certifications") : null;
      default:
        return /* @__PURE__ */ jsx15(CustomBlock15, { label: sec.label, content: (customSections || {})[sec.id], headingClass: H, bodyClass: B, bulletClass: BL }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs15("div", { className: "resume-template sleek max-w-4xl mx-auto bg-white px-8 font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs15("div", { className: "border-b border-gray-100 pb-4 mb-6", children: [
      /* @__PURE__ */ jsx15("h1", { className: "text-3xl font-bold text-gray-900 mb-1 break-words tracking-[0.2em]", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx15("div", { className: "text-base text-gray-500 font-light mb-2 break-words tracking-[0.15em] uppercase", children: personalInfo.title }),
      /* @__PURE__ */ jsxs15("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500", children: [
        personalInfo.email && /* @__PURE__ */ jsx15("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx15("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx15("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx15("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx15("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx15("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/ContemporaryTemplate.jsx
import React2 from "react";
import { Fragment as Fragment5, jsx as jsx16, jsxs as jsxs16 } from "react/jsx-runtime";
var CustomBlock16 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = /* @__PURE__ */ jsx16("div", { className: "text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 border-b border-indigo-200 pb-0.5 mb-2 mt-5 break-after-avoid", children: label });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs16(Fragment5, { children: [
      H,
      /* @__PURE__ */ jsx16("ul", { className: "space-y-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs16("li", { className: "flex gap-2 text-xs text-gray-600 break-inside-avoid", children: [
        /* @__PURE__ */ jsx16("span", { className: "text-indigo-400 shrink-0 mt-0.5", children: "\u2013" }),
        /* @__PURE__ */ jsx16("span", { className: "break-words min-w-0", children: it })
      ] }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs16(Fragment5, { children: [
    H,
    /* @__PURE__ */ jsx16("p", { className: "text-xs text-gray-600 leading-relaxed break-words", children: text })
  ] });
};
var ContemporaryTemplate = ({ data }) => {
  const { sectionsConfig, personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages, customSections } = data;
  const SH5 = ({ children }) => /* @__PURE__ */ jsx16("div", { className: "text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600 border-b border-indigo-200 pb-0.5 mb-2 mt-5 first:mt-0 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx16(CustomBlock16, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs16(React2.Fragment, { children: [
          /* @__PURE__ */ jsx16(SH5, { children: "Profile" }),
          /* @__PURE__ */ jsx16("p", { className: "text-gray-600 leading-relaxed text-xs break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs16(React2.Fragment, { children: [
          /* @__PURE__ */ jsx16(SH5, { children: "Experience" }),
          /* @__PURE__ */ jsx16("div", { className: "space-y-4", children: experience.map((e, i) => /* @__PURE__ */ jsxs16("div", { className: "break-inside-avoid shadow-sm rounded-lg p-2", children: [
            /* @__PURE__ */ jsxs16("div", { className: "flex justify-between items-baseline flex-wrap gap-1", children: [
              /* @__PURE__ */ jsx16("span", { className: "font-semibold text-gray-900 text-sm break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx16("span", { className: "text-xs text-gray-400 whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs16("div", { className: "text-xs text-indigo-600 mb-1 break-words", children: [
              e.company,
              e.location ? `, ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx16("p", { className: "text-xs text-gray-600 mb-1 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx16("ul", { className: "space-y-0.5", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs16("li", { className: "flex gap-2 text-gray-600 text-xs break-inside-avoid", children: [
              /* @__PURE__ */ jsx16("span", { className: "text-indigo-300 shrink-0 mt-0.5", children: "\u2013" }),
              /* @__PURE__ */ jsx16("span", { className: "break-words min-w-0", children: r })
            ] }, j)) })
          ] }, i)) })
        ] }, "experience") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs16(React2.Fragment, { children: [
          /* @__PURE__ */ jsx16(SH5, { children: "Skills" }),
          /* @__PURE__ */ jsx16("div", { className: "flex flex-wrap gap-2", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx16("span", { className: "rounded-lg bg-indigo-50 px-3 py-1 text-indigo-700 text-xs break-words", children: s }, i)) })
        ] }, "skills") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs16(React2.Fragment, { children: [
          /* @__PURE__ */ jsx16(SH5, { children: "Projects" }),
          /* @__PURE__ */ jsx16("div", { className: "space-y-3", children: projects.map((p, i) => /* @__PURE__ */ jsxs16("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs16("div", { className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5", children: [
              /* @__PURE__ */ jsx16("span", { className: "font-semibold text-gray-900 text-sm break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs16("span", { className: "text-xs text-gray-400 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs16("div", { className: "text-xs text-indigo-500 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx16("div", { className: "text-xs text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join("  \xB7  ") }),
            p.description && /* @__PURE__ */ jsx16("p", { className: "text-xs text-gray-600 leading-relaxed break-words", children: p.description }),
            p.highlights?.length > 0 && /* @__PURE__ */ jsx16("ul", { className: "mt-0.5 space-y-0.5", children: p.highlights.map((h, j) => /* @__PURE__ */ jsxs16("li", { className: "flex gap-2 text-xs text-gray-600 break-inside-avoid", children: [
              /* @__PURE__ */ jsx16("span", { className: "text-indigo-300 shrink-0 mt-0.5", children: "\u2013" }),
              /* @__PURE__ */ jsx16("span", { className: "break-words min-w-0", children: h })
            ] }, j)) })
          ] }, i)) })
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs16(React2.Fragment, { children: [
          /* @__PURE__ */ jsx16(SH5, { children: "Education" }),
          /* @__PURE__ */ jsx16("div", { className: "space-y-2", children: education.map((e, i) => /* @__PURE__ */ jsxs16("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs16("div", { className: "flex justify-between items-baseline flex-wrap gap-1", children: [
              /* @__PURE__ */ jsxs16("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx16("span", { className: "font-semibold text-gray-900 text-sm break-words", children: e.degree }),
                e.field && /* @__PURE__ */ jsxs16("span", { className: "text-gray-500 text-sm break-words", children: [
                  " in ",
                  e.field
                ] })
              ] }),
              /* @__PURE__ */ jsx16("span", { className: "text-xs text-gray-400 whitespace-nowrap shrink-0", children: e.year })
            ] }),
            e.institution && /* @__PURE__ */ jsx16("div", { className: "text-xs text-gray-500 break-words", children: e.institution }),
            e.gpa && /* @__PURE__ */ jsxs16("div", { className: "text-xs text-gray-400 break-words", children: [
              "Grade: ",
              e.gpa
            ] }),
            e.details && /* @__PURE__ */ jsx16("div", { className: "text-xs text-gray-400 mt-0.5 leading-relaxed break-words", children: e.details })
          ] }, i)) })
        ] }, "education") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs16(React2.Fragment, { children: [
          /* @__PURE__ */ jsx16(SH5, { children: "Achievements" }),
          /* @__PURE__ */ jsx16("ul", { className: "space-y-1", children: achievements.map((a, i) => /* @__PURE__ */ jsxs16("li", { className: "flex gap-2 text-xs text-gray-600 break-inside-avoid", children: [
            /* @__PURE__ */ jsx16("span", { className: "text-indigo-300 shrink-0 mt-0.5", children: "\u2013" }),
            /* @__PURE__ */ jsx16("span", { className: "break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs16(React2.Fragment, { children: [
          /* @__PURE__ */ jsx16(SH5, { children: "Languages" }),
          /* @__PURE__ */ jsx16("p", { className: "text-xs text-gray-600 break-words", children: languages.join("  \xB7  ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs16(React2.Fragment, { children: [
          /* @__PURE__ */ jsx16(SH5, { children: "Certifications" }),
          /* @__PURE__ */ jsx16("div", { className: "space-y-1", children: certifications.map((c, i) => /* @__PURE__ */ jsxs16("div", { className: "text-xs text-gray-600 break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx16("span", { className: "font-medium", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs16("span", { className: "text-gray-500", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs16("span", { className: "text-gray-400", children: [
              " (",
              c.year,
              ")"
            ] })
          ] }, i)) })
        ] }, "certifications") : null;
      default:
        return /* @__PURE__ */ jsx16(CustomBlock16, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs16("div", { className: "resume-template contemporary max-w-4xl mx-auto bg-white px-10 font-sans text-sm text-gray-800 overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs16("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx16("h1", { className: "text-2xl font-light tracking-tight text-gray-900 mb-0.5 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx16("div", { className: "text-sm text-indigo-600 mb-1.5 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs16("div", { className: "flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500", children: [
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
var Bul3 = ({ c }) => /* @__PURE__ */ jsxs17("li", { className: "flex gap-1.5 break-inside-avoid", children: [
  /* @__PURE__ */ jsx17("span", { className: "text-gray-400 shrink-0 select-none", children: "\u2022" }),
  /* @__PURE__ */ jsx17("span", { className: "text-gray-700 break-words min-w-0", children: c })
] });
var SH3 = ({ children }) => /* @__PURE__ */ jsx17("div", { className: "text-[9px] font-bold uppercase tracking-widest pb-0.5 mb-1.5 border-b-2 border-gray-800 mb-1 border-t border-t-gray-800 pt-1 text-gray-500 break-after-avoid italic", children });
var CustomBlock17 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === "bullets") {
    if (!items || !items.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs17("div", { children: [
      /* @__PURE__ */ jsx17(SH3, { children: label }),
      /* @__PURE__ */ jsx17("ul", { className: "space-y-0.5 pl-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsx17(Bul3, { c: it }, i)) })
    ] });
  }
  if (!text || !text.trim()) return null;
  return /* @__PURE__ */ jsxs17("div", { children: [
    /* @__PURE__ */ jsx17(SH3, { children: label }),
    /* @__PURE__ */ jsx17("p", { className: "text-gray-700 leading-relaxed break-words font-serif italic", children: text })
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
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  const renderSection = (sec) => {
    if (sec.type === "custom") {
      return /* @__PURE__ */ jsx17(CustomBlock17, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        if (!summary) return null;
        return /* @__PURE__ */ jsxs17("div", { children: [
          /* @__PURE__ */ jsx17(SH3, { children: "Professional Summary" }),
          /* @__PURE__ */ jsx17("p", { className: "text-gray-700 leading-relaxed break-words font-serif italic", children: summary })
        ] }, "summary");
      case "skills":
        if (!(skills || []).length) return null;
        return /* @__PURE__ */ jsxs17("div", { children: [
          /* @__PURE__ */ jsx17(SH3, { children: "Skills" }),
          /* @__PURE__ */ jsx17("div", { className: "space-y-0.5 font-serif", children: (skills || []).map((s, i) => /* @__PURE__ */ jsx17("p", { className: "break-words text-gray-700 italic", children: s }, i)) })
        ] }, "skills");
      case "experience":
        if (!(experience || []).length) return null;
        return /* @__PURE__ */ jsxs17("div", { children: [
          /* @__PURE__ */ jsx17(SH3, { children: "Work Experience" }),
          (experience || []).map((e, i) => /* @__PURE__ */ jsxs17("div", { className: "mb-2 break-inside-avoid font-serif", children: [
            /* @__PURE__ */ jsxs17("div", { className: "flex justify-between gap-2", children: [
              /* @__PURE__ */ jsxs17("span", { className: "font-semibold break-words min-w-0 italic", children: [
                e.position,
                e.company ? ` \u2014 ${e.company}` : ""
              ] }),
              /* @__PURE__ */ jsx17("span", { className: "text-gray-500 shrink-0 whitespace-nowrap", children: e.duration })
            ] }),
            (e.location || e.employmentType) && /* @__PURE__ */ jsx17("div", { className: "text-gray-500 text-[9px] italic", children: [e.location, e.employmentType].filter(Boolean).join(" \xB7 ") }),
            e.summary && /* @__PURE__ */ jsx17("p", { className: "text-gray-600 mt-0.5 break-words italic", children: e.summary }),
            (e.responsibilities || []).filter(Boolean).length > 0 && /* @__PURE__ */ jsx17("ul", { className: "mt-1 space-y-0.5 pl-1", children: (e.responsibilities || []).filter(Boolean).map((b, j) => /* @__PURE__ */ jsx17(Bul3, { c: b }, j)) })
          ] }, i))
        ] }, "experience");
      case "projects":
        if (!(projects || []).length) return null;
        return /* @__PURE__ */ jsxs17("div", { children: [
          /* @__PURE__ */ jsx17(SH3, { children: "Projects" }),
          (projects || []).map((p, i) => /* @__PURE__ */ jsxs17("div", { className: "mb-1.5 break-inside-avoid font-serif", children: [
            /* @__PURE__ */ jsxs17("div", { className: "flex flex-wrap items-baseline gap-x-2", children: [
              /* @__PURE__ */ jsx17("span", { className: "font-semibold break-words min-w-0 italic", children: p.name }),
              p.role && /* @__PURE__ */ jsxs17("span", { className: "text-gray-500 text-[9px] break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsx17("div", { className: "text-gray-500 text-[9px] break-words italic", children: p.technologies }),
            (p.link || p.github) && /* @__PURE__ */ jsx17("div", { className: "text-gray-400 text-[9px] break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx17("p", { className: "text-gray-700 mt-0.5 break-words italic", children: p.description }),
            (p.highlights || []).filter(Boolean).length > 0 && /* @__PURE__ */ jsx17("ul", { className: "mt-0.5 space-y-0.5 pl-1", children: (p.highlights || []).filter(Boolean).map((h, j) => /* @__PURE__ */ jsx17(Bul3, { c: h }, j)) })
          ] }, i))
        ] }, "projects");
      case "education":
        if (!(education || []).length) return null;
        return /* @__PURE__ */ jsxs17("div", { children: [
          /* @__PURE__ */ jsx17(SH3, { children: "Education" }),
          (education || []).map((e, i) => /* @__PURE__ */ jsx17("div", { className: "mb-1.5 break-inside-avoid font-serif", children: /* @__PURE__ */ jsxs17("div", { className: "flex justify-between gap-2", children: [
            /* @__PURE__ */ jsxs17("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx17("span", { className: "font-semibold italic", children: e.degree }),
              e.field && /* @__PURE__ */ jsxs17("span", { className: "text-gray-600 italic", children: [
                " in ",
                e.field
              ] }),
              e.institution && /* @__PURE__ */ jsx17("div", { className: "text-gray-500 italic", children: e.institution }),
              e.gpa && /* @__PURE__ */ jsxs17("div", { className: "text-gray-400 text-[9px]", children: [
                "Grade: ",
                e.gpa
              ] }),
              e.details && /* @__PURE__ */ jsx17("div", { className: "text-gray-400 text-[9px] mt-0.5 italic", children: e.details })
            ] }),
            /* @__PURE__ */ jsx17("span", { className: "text-gray-500 shrink-0 whitespace-nowrap", children: e.year })
          ] }) }, i))
        ] }, "education");
      case "certifications":
        if (!(certifications || []).length) return null;
        return /* @__PURE__ */ jsxs17("div", { children: [
          /* @__PURE__ */ jsx17(SH3, { children: "Certifications" }),
          (certifications || []).map((c, i) => /* @__PURE__ */ jsxs17("div", { className: "break-words break-inside-avoid font-serif", children: [
            /* @__PURE__ */ jsx17("span", { className: "font-medium break-words italic", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs17("span", { className: "text-gray-500", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs17("span", { className: "text-gray-400", children: [
              " (",
              c.year,
              ")"
            ] })
          ] }, i))
        ] }, "certifications");
      case "achievements":
        if (!(achievements || []).length) return null;
        return /* @__PURE__ */ jsxs17("div", { children: [
          /* @__PURE__ */ jsx17(SH3, { children: "Achievements" }),
          /* @__PURE__ */ jsx17("ul", { className: "space-y-0.5 pl-1 font-serif", children: (achievements || []).map((a, i) => /* @__PURE__ */ jsx17(Bul3, { c: a }, i)) })
        ] }, "achievements");
      case "languages":
        if (!(languages || []).length) return null;
        return /* @__PURE__ */ jsxs17("div", { children: [
          /* @__PURE__ */ jsx17(SH3, { children: "Languages" }),
          /* @__PURE__ */ jsx17("p", { className: "break-words font-serif italic", children: (languages || []).join(" \xB7 ") })
        ] }, "languages");
      default:
        return /* @__PURE__ */ jsx17(CustomBlock17, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  return /* @__PURE__ */ jsxs17("div", { className: "resume-template academic font-serif text-[10px] leading-tight text-gray-900 bg-white px-6 space-y-3 overflow-hidden", children: [
    /* @__PURE__ */ jsxs17("div", { className: "text-center border-b-2 border-gray-800 pb-3", children: [
      /* @__PURE__ */ jsx17("div", { className: "text-lg font-bold tracking-wide uppercase break-words", children: personalInfo?.fullName || "Your Name" }),
      personalInfo?.title && /* @__PURE__ */ jsx17("div", { className: "text-[10px] text-gray-600 mt-0.5 break-words italic", children: personalInfo.title }),
      /* @__PURE__ */ jsxs17("div", { className: "flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1 text-gray-500", children: [
        personalInfo?.email && /* @__PURE__ */ jsx17("span", { className: "break-all", children: personalInfo.email }),
        personalInfo?.phone && /* @__PURE__ */ jsx17("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo?.location && /* @__PURE__ */ jsx17("span", { className: "break-words", children: personalInfo.location })
      ] }),
      /* @__PURE__ */ jsxs17("div", { className: "flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-0.5 text-gray-500", children: [
        personalInfo?.linkedin && /* @__PURE__ */ jsx17("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo?.github && /* @__PURE__ */ jsx17("span", { className: "break-all", children: personalInfo.github }),
        personalInfo?.portfolio && /* @__PURE__ */ jsx17("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/ResearchTemplate.jsx
import { jsx as jsx18, jsxs as jsxs18 } from "react/jsx-runtime";
var Bul4 = ({ c, num }) => /* @__PURE__ */ jsxs18("li", { className: "flex gap-1.5 break-inside-avoid", children: [
  /* @__PURE__ */ jsxs18("span", { className: "text-gray-900 shrink-0 select-none font-bold", children: [
    num,
    "."
  ] }),
  /* @__PURE__ */ jsx18("span", { className: "text-gray-700 break-words min-w-0", children: c })
] });
var SH4 = ({ children }) => /* @__PURE__ */ jsx18("div", { className: "bg-gray-900 text-white px-2 py-0.5 uppercase text-[9px] tracking-widest mb-1.5 mt-3 first:mt-0 break-after-avoid", children });
var CustomBlock18 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === "bullets") {
    if (!items || !items.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs18("div", { children: [
      /* @__PURE__ */ jsx18(SH4, { children: label }),
      /* @__PURE__ */ jsx18("ul", { className: "space-y-0.5 pl-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsx18(Bul4, { c: it, num: i + 1 }, i)) })
    ] });
  }
  if (!text || !text.trim()) return null;
  return /* @__PURE__ */ jsxs18("div", { children: [
    /* @__PURE__ */ jsx18(SH4, { children: label }),
    /* @__PURE__ */ jsx18("p", { className: "text-gray-700 leading-relaxed break-words", children: text })
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
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  const renderSection = (sec) => {
    if (sec.type === "custom") {
      return /* @__PURE__ */ jsx18(CustomBlock18, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        if (!summary) return null;
        return /* @__PURE__ */ jsxs18("div", { children: [
          /* @__PURE__ */ jsx18(SH4, { children: "Professional Summary" }),
          /* @__PURE__ */ jsx18("p", { className: "text-gray-700 leading-relaxed break-words", children: summary })
        ] }, "summary");
      case "skills":
        if (!(skills || []).length) return null;
        return /* @__PURE__ */ jsxs18("div", { children: [
          /* @__PURE__ */ jsx18(SH4, { children: "Skills" }),
          /* @__PURE__ */ jsx18("div", { className: "space-y-0.5", children: (skills || []).map((s, i) => /* @__PURE__ */ jsx18("p", { className: "break-words text-gray-700", children: s }, i)) })
        ] }, "skills");
      case "experience":
        if (!(experience || []).length) return null;
        return /* @__PURE__ */ jsxs18("div", { children: [
          /* @__PURE__ */ jsx18(SH4, { children: "Work Experience" }),
          (experience || []).map((e, i) => /* @__PURE__ */ jsxs18("div", { className: "mb-2 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs18("div", { className: "flex justify-between gap-2", children: [
              /* @__PURE__ */ jsxs18("span", { className: "font-semibold break-words min-w-0", children: [
                e.position,
                e.company ? ` \u2014 ${e.company}` : ""
              ] }),
              /* @__PURE__ */ jsx18("span", { className: "text-gray-500 shrink-0 whitespace-nowrap", children: e.duration })
            ] }),
            (e.location || e.employmentType) && /* @__PURE__ */ jsx18("div", { className: "text-gray-500 text-[9px]", children: [e.location, e.employmentType].filter(Boolean).join(" \xB7 ") }),
            e.summary && /* @__PURE__ */ jsx18("p", { className: "text-gray-600 mt-0.5 break-words", children: e.summary }),
            (e.responsibilities || []).filter(Boolean).length > 0 && /* @__PURE__ */ jsx18("ul", { className: "mt-1 space-y-0.5 pl-1", children: (e.responsibilities || []).filter(Boolean).map((b, j) => /* @__PURE__ */ jsx18(Bul4, { c: b, num: j + 1 }, j)) })
          ] }, i))
        ] }, "experience");
      case "projects":
        if (!(projects || []).length) return null;
        return /* @__PURE__ */ jsxs18("div", { children: [
          /* @__PURE__ */ jsx18(SH4, { children: "Projects" }),
          (projects || []).map((p, i) => /* @__PURE__ */ jsxs18("div", { className: "mb-1.5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs18("div", { className: "flex flex-wrap items-baseline gap-x-2", children: [
              /* @__PURE__ */ jsx18("span", { className: "font-semibold break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs18("span", { className: "text-gray-500 text-[9px] break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsx18("div", { className: "text-gray-500 text-[9px] break-words", children: p.technologies }),
            (p.link || p.github) && /* @__PURE__ */ jsx18("div", { className: "text-gray-400 text-[9px] break-all", children: [p.link, p.github].filter(Boolean).join(" \xB7 ") }),
            p.description && /* @__PURE__ */ jsx18("p", { className: "text-gray-700 mt-0.5 break-words", children: p.description }),
            (p.highlights || []).filter(Boolean).length > 0 && /* @__PURE__ */ jsx18("ul", { className: "mt-0.5 space-y-0.5 pl-1", children: (p.highlights || []).filter(Boolean).map((h, j) => /* @__PURE__ */ jsx18(Bul4, { c: h, num: j + 1 }, j)) })
          ] }, i))
        ] }, "projects");
      case "education":
        if (!(education || []).length) return null;
        return /* @__PURE__ */ jsxs18("div", { children: [
          /* @__PURE__ */ jsx18(SH4, { children: "Education" }),
          (education || []).map((e, i) => /* @__PURE__ */ jsx18("div", { className: "mb-1.5 break-inside-avoid", children: /* @__PURE__ */ jsxs18("div", { className: "flex justify-between gap-2", children: [
            /* @__PURE__ */ jsxs18("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx18("span", { className: "font-semibold", children: e.degree }),
              e.field && /* @__PURE__ */ jsxs18("span", { className: "text-gray-600", children: [
                " in ",
                e.field
              ] }),
              e.institution && /* @__PURE__ */ jsx18("div", { className: "text-gray-500", children: e.institution }),
              e.gpa && /* @__PURE__ */ jsxs18("div", { className: "text-gray-400 text-[9px]", children: [
                "Grade: ",
                e.gpa
              ] }),
              e.details && /* @__PURE__ */ jsx18("div", { className: "text-gray-400 text-[9px] mt-0.5", children: e.details })
            ] }),
            /* @__PURE__ */ jsx18("span", { className: "text-gray-500 shrink-0 whitespace-nowrap", children: e.year })
          ] }) }, i))
        ] }, "education");
      case "certifications":
        if (!(certifications || []).length) return null;
        return /* @__PURE__ */ jsxs18("div", { children: [
          /* @__PURE__ */ jsx18(SH4, { children: "Certifications" }),
          (certifications || []).map((c, i) => /* @__PURE__ */ jsxs18("div", { className: "break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx18("span", { className: "font-medium break-words", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs18("span", { className: "text-gray-500", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs18("span", { className: "text-gray-400", children: [
              " (",
              c.year,
              ")"
            ] })
          ] }, i))
        ] }, "certifications");
      case "achievements":
        if (!(achievements || []).length) return null;
        return /* @__PURE__ */ jsxs18("div", { children: [
          /* @__PURE__ */ jsx18(SH4, { children: "Achievements" }),
          /* @__PURE__ */ jsx18("ul", { className: "space-y-0.5 pl-1", children: (achievements || []).map((a, i) => /* @__PURE__ */ jsx18(Bul4, { c: a, num: i + 1 }, i)) })
        ] }, "achievements");
      case "languages":
        if (!(languages || []).length) return null;
        return /* @__PURE__ */ jsxs18("div", { children: [
          /* @__PURE__ */ jsx18(SH4, { children: "Languages" }),
          /* @__PURE__ */ jsx18("p", { className: "break-words", children: (languages || []).join(" \xB7 ") })
        ] }, "languages");
      default:
        return /* @__PURE__ */ jsx18(CustomBlock18, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  return /* @__PURE__ */ jsxs18("div", { className: "resume-template research font-sans text-[10px] leading-tight text-gray-900 bg-white px-6 space-y-3 overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs18("div", { className: "flex justify-between items-start border-b border-gray-300 pb-3 mb-3", children: [
      /* @__PURE__ */ jsxs18("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx18("div", { className: "text-lg font-bold tracking-wide uppercase break-words", children: personalInfo.fullName }),
        personalInfo.title && /* @__PURE__ */ jsx18("div", { className: "text-[10px] text-gray-600 mt-0.5 break-words", children: personalInfo.title })
      ] }),
      /* @__PURE__ */ jsxs18("div", { className: "text-right shrink-0 ml-4", children: [
        /* @__PURE__ */ jsxs18("div", { className: "flex flex-wrap justify-end gap-x-3 gap-y-0.5 text-gray-500", children: [
          personalInfo.email && /* @__PURE__ */ jsx18("span", { className: "break-all", children: personalInfo.email }),
          personalInfo.phone && /* @__PURE__ */ jsx18("span", { className: "break-words", children: personalInfo.phone }),
          personalInfo.location && /* @__PURE__ */ jsx18("span", { className: "break-words", children: personalInfo.location })
        ] }),
        /* @__PURE__ */ jsxs18("div", { className: "flex flex-wrap justify-end gap-x-3 gap-y-0.5 mt-0.5 text-gray-500", children: [
          personalInfo.linkedin && /* @__PURE__ */ jsx18("span", { className: "break-all", children: personalInfo.linkedin }),
          personalInfo.github && /* @__PURE__ */ jsx18("span", { className: "break-all", children: personalInfo.github }),
          personalInfo.portfolio && /* @__PURE__ */ jsx18("span", { className: "break-all", children: personalInfo.portfolio })
        ] })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/MedicalTemplate.jsx
import React3 from "react";
import { Fragment as Fragment6, jsx as jsx19, jsxs as jsxs19 } from "react/jsx-runtime";
var CustomBlock19 = ({ label, content }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  const H = /* @__PURE__ */ jsx19("div", { className: "text-xs font-bold uppercase tracking-[0.18em] text-teal-700 border-b border-teal-300 pb-0.5 mb-2 mt-5 break-after-avoid", children: label });
  if (mode === "bullets") {
    if (!items?.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs19(Fragment6, { children: [
      H,
      /* @__PURE__ */ jsx19("ul", { className: "space-y-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs19("li", { className: "flex gap-2 text-xs text-gray-600 break-inside-avoid", children: [
        /* @__PURE__ */ jsx19("span", { className: "text-teal-400 shrink-0 mt-0.5", children: "\u2013" }),
        /* @__PURE__ */ jsx19("span", { className: "break-words min-w-0", children: it })
      ] }, i)) })
    ] });
  }
  if (!text?.trim()) return null;
  return /* @__PURE__ */ jsxs19(Fragment6, { children: [
    H,
    /* @__PURE__ */ jsx19("p", { className: "text-xs text-gray-600 leading-relaxed break-words", children: text })
  ] });
};
var MedicalTemplate = ({ data }) => {
  const { sectionsConfig, personalInfo, summary, experience, education, skills, projects, certifications, achievements, languages, customSections } = data;
  const SH5 = ({ children }) => /* @__PURE__ */ jsx19("div", { className: "text-xs font-bold uppercase tracking-[0.18em] text-teal-700 border-b border-teal-300 pb-0.5 mb-2 mt-5 first:mt-0 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx19(CustomBlock19, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs19(React3.Fragment, { children: [
          /* @__PURE__ */ jsx19(SH5, { children: "Profile" }),
          /* @__PURE__ */ jsx19("p", { className: "text-gray-600 leading-relaxed text-xs break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs19(React3.Fragment, { children: [
          /* @__PURE__ */ jsx19(SH5, { children: "Experience" }),
          /* @__PURE__ */ jsx19("div", { className: "space-y-4", children: experience.map((e, i) => /* @__PURE__ */ jsxs19("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs19("div", { className: "flex justify-between items-baseline flex-wrap gap-1", children: [
              /* @__PURE__ */ jsx19("span", { className: "font-semibold text-gray-900 text-sm break-words min-w-0", children: e.position }),
              /* @__PURE__ */ jsx19("span", { className: "text-xs text-gray-400 whitespace-nowrap shrink-0", children: e.duration })
            ] }),
            /* @__PURE__ */ jsxs19("div", { className: "text-xs text-teal-700 mb-1 break-words", children: [
              e.company,
              e.location ? `, ${e.location}` : "",
              e.employmentType ? ` \xB7 ${e.employmentType}` : ""
            ] }),
            e.summary && /* @__PURE__ */ jsx19("p", { className: "text-xs text-gray-600 mb-1 leading-relaxed break-words", children: e.summary }),
            e.responsibilities?.length > 0 && /* @__PURE__ */ jsx19("ul", { className: "space-y-0.5", children: e.responsibilities.map((r, j) => /* @__PURE__ */ jsxs19("li", { className: "flex gap-2 text-gray-600 text-xs break-inside-avoid", children: [
              /* @__PURE__ */ jsx19("span", { className: "text-teal-300 shrink-0 mt-0.5", children: "\u2013" }),
              /* @__PURE__ */ jsx19("span", { className: "break-words min-w-0", children: r })
            ] }, j)) })
          ] }, i)) })
        ] }, "experience") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs19(React3.Fragment, { children: [
          /* @__PURE__ */ jsx19(SH5, { children: "Licenses & Certifications" }),
          /* @__PURE__ */ jsx19("div", { className: "space-y-1", children: certifications.map((c, i) => /* @__PURE__ */ jsxs19("div", { className: "text-xs text-gray-700 break-words break-inside-avoid", children: [
            /* @__PURE__ */ jsx19("span", { className: "font-semibold", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs19("span", { className: "text-teal-600", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs19("span", { className: "text-gray-400", children: [
              " (",
              c.year,
              ")"
            ] })
          ] }, i)) })
        ] }, "certifications") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs19(React3.Fragment, { children: [
          /* @__PURE__ */ jsx19(SH5, { children: "Skills" }),
          /* @__PURE__ */ jsx19("div", { className: "grid grid-cols-2 gap-x-4 gap-y-1", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx19("p", { className: "text-gray-600 text-xs break-words", children: s }, i)) })
        ] }, "skills") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs19(React3.Fragment, { children: [
          /* @__PURE__ */ jsx19(SH5, { children: "Projects" }),
          /* @__PURE__ */ jsx19("div", { className: "space-y-3", children: projects.map((p, i) => /* @__PURE__ */ jsxs19("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs19("div", { className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5", children: [
              /* @__PURE__ */ jsx19("span", { className: "font-semibold text-gray-900 text-sm break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs19("span", { className: "text-xs text-gray-400 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs19("div", { className: "text-xs text-teal-500 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx19("div", { className: "text-xs text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join("  \xB7  ") }),
            p.description && /* @__PURE__ */ jsx19("p", { className: "text-xs text-gray-600 leading-relaxed break-words", children: p.description }),
            p.highlights?.length > 0 && /* @__PURE__ */ jsx19("ul", { className: "mt-0.5 space-y-0.5", children: p.highlights.map((h, j) => /* @__PURE__ */ jsxs19("li", { className: "flex gap-2 text-xs text-gray-600 break-inside-avoid", children: [
              /* @__PURE__ */ jsx19("span", { className: "text-teal-300 shrink-0 mt-0.5", children: "\u2013" }),
              /* @__PURE__ */ jsx19("span", { className: "break-words min-w-0", children: h })
            ] }, j)) })
          ] }, i)) })
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs19(React3.Fragment, { children: [
          /* @__PURE__ */ jsx19(SH5, { children: "Education" }),
          /* @__PURE__ */ jsx19("div", { className: "space-y-2", children: education.map((e, i) => /* @__PURE__ */ jsxs19("div", { className: "break-inside-avoid", children: [
            /* @__PURE__ */ jsxs19("div", { className: "flex justify-between items-baseline flex-wrap gap-1", children: [
              /* @__PURE__ */ jsxs19("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx19("span", { className: "font-semibold text-gray-900 text-sm break-words", children: e.degree }),
                e.field && /* @__PURE__ */ jsxs19("span", { className: "text-gray-500 text-sm break-words", children: [
                  " in ",
                  e.field
                ] })
              ] }),
              /* @__PURE__ */ jsx19("span", { className: "text-xs text-gray-400 whitespace-nowrap shrink-0", children: e.year })
            ] }),
            e.institution && /* @__PURE__ */ jsx19("div", { className: "text-xs text-gray-500 break-words", children: e.institution }),
            e.gpa && /* @__PURE__ */ jsxs19("div", { className: "text-xs text-gray-400 break-words", children: [
              "Grade: ",
              e.gpa
            ] }),
            e.details && /* @__PURE__ */ jsx19("div", { className: "text-xs text-gray-400 mt-0.5 leading-relaxed break-words", children: e.details })
          ] }, i)) })
        ] }, "education") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs19(React3.Fragment, { children: [
          /* @__PURE__ */ jsx19(SH5, { children: "Achievements" }),
          /* @__PURE__ */ jsx19("ul", { className: "space-y-1", children: achievements.map((a, i) => /* @__PURE__ */ jsxs19("li", { className: "flex gap-2 text-xs text-gray-600 break-inside-avoid", children: [
            /* @__PURE__ */ jsx19("span", { className: "text-teal-300 shrink-0 mt-0.5", children: "\u2013" }),
            /* @__PURE__ */ jsx19("span", { className: "break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs19(React3.Fragment, { children: [
          /* @__PURE__ */ jsx19(SH5, { children: "Languages" }),
          /* @__PURE__ */ jsx19("p", { className: "text-xs text-gray-600 break-words", children: languages.join("  \xB7  ") })
        ] }, "languages") : null;
      default:
        return /* @__PURE__ */ jsx19(CustomBlock19, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs19("div", { className: "resume-template medical max-w-4xl mx-auto bg-white px-10 font-sans text-sm text-gray-800 overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs19("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx19("h1", { className: "text-2xl font-light tracking-tight text-gray-900 mb-0.5 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx19("div", { className: "text-sm text-teal-700 mb-1.5 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs19("div", { className: "flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500", children: [
        personalInfo.email && /* @__PURE__ */ jsx19("span", { className: "break-all", children: personalInfo.email }),
        personalInfo.phone && /* @__PURE__ */ jsx19("span", { className: "break-words", children: personalInfo.phone }),
        personalInfo.location && /* @__PURE__ */ jsx19("span", { className: "break-words", children: personalInfo.location }),
        personalInfo.linkedin && /* @__PURE__ */ jsx19("span", { className: "break-all", children: personalInfo.linkedin }),
        personalInfo.github && /* @__PURE__ */ jsx19("span", { className: "break-all", children: personalInfo.github }),
        personalInfo.portfolio && /* @__PURE__ */ jsx19("span", { className: "break-all", children: personalInfo.portfolio })
      ] })
    ] }),
    activeSections.filter((s) => s.key !== "basics").map((sec) => renderSection(sec))
  ] });
};

// src/components/resume/templates/FinanceTemplate.jsx
import { jsx as jsx20, jsxs as jsxs20 } from "react/jsx-runtime";
var CustomBlock20 = ({ label, content, headingClass, bodyClass, bulletClass }) => {
  if (!content) return null;
  const { mode, text, items } = content;
  if (mode === "bullets") {
    if (!items || !items.filter(Boolean).length) return null;
    return /* @__PURE__ */ jsxs20("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx20("h2", { className: headingClass, children: label }),
      /* @__PURE__ */ jsx20("ul", { className: "space-y-1", children: items.filter(Boolean).map((it, i) => /* @__PURE__ */ jsxs20("li", { className: `flex items-start break-inside-avoid ${bodyClass}`, children: [
        /* @__PURE__ */ jsx20("span", { className: `mr-2 shrink-0 ${bulletClass}`, children: "\u25CF" }),
        /* @__PURE__ */ jsx20("span", { className: "leading-relaxed break-words min-w-0", children: it })
      ] }, i)) })
    ] });
  }
  if (!text || !text.trim()) return null;
  return /* @__PURE__ */ jsxs20("div", { className: "mb-6", children: [
    /* @__PURE__ */ jsx20("h2", { className: headingClass, children: label }),
    /* @__PURE__ */ jsx20("p", { className: `${bodyClass} leading-relaxed break-words`, children: text })
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
  const H = "text-lg font-bold text-gray-900 mb-2 pb-1 border-b border-gray-900 uppercase tracking-wide break-after-avoid";
  const B = "text-gray-700 text-sm";
  const BL = "text-gray-900";
  const renderSection = (sec) => {
    if (sec.type === "custom") {
      return /* @__PURE__ */ jsx20(CustomBlock20, { label: sec.label, content: (customSections || {})[sec.id], headingClass: H, bodyClass: B, bulletClass: BL }, sec.id);
    }
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs20("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx20("h2", { className: H, children: "Professional Summary" }),
          /* @__PURE__ */ jsx20("p", { className: `${B} leading-relaxed break-words`, children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs20("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx20("h2", { className: H, children: "Professional Experience" }),
          experience.map((exp, i) => /* @__PURE__ */ jsxs20("div", { className: "mb-5 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs20("div", { className: "flex justify-between items-start flex-wrap gap-1 mb-1", children: [
              /* @__PURE__ */ jsx20("h3", { className: "font-bold text-gray-900 break-words min-w-0", children: exp.position }),
              /* @__PURE__ */ jsx20("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: exp.duration })
            ] }),
            /* @__PURE__ */ jsxs20("div", { className: "text-sm text-gray-700 mb-1 break-words", children: [
              exp.company,
              exp.location ? ` \xB7 ${exp.location}` : "",
              exp.employmentType ? ` \xB7 ${exp.employmentType}` : ""
            ] }),
            exp.summary && /* @__PURE__ */ jsx20("p", { className: "text-sm text-gray-600 mb-1 leading-relaxed break-words", children: exp.summary }),
            exp.responsibilities?.length > 0 && /* @__PURE__ */ jsx20("ul", { className: "list-disc list-inside space-y-1 text-gray-700 text-sm", children: exp.responsibilities.map((r, j) => /* @__PURE__ */ jsx20("li", { className: "leading-relaxed break-words break-inside-avoid", children: r }, j)) })
          ] }, i))
        ] }, "experience") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs20("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx20("h2", { className: H, children: "Projects" }),
          projects.map((p, i) => /* @__PURE__ */ jsxs20("div", { className: "mb-4 break-inside-avoid", children: [
            /* @__PURE__ */ jsxs20("div", { className: "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-0.5", children: [
              /* @__PURE__ */ jsx20("h3", { className: "font-bold text-gray-900 break-words min-w-0", children: p.name }),
              p.role && /* @__PURE__ */ jsxs20("span", { className: "text-sm text-gray-500 break-words", children: [
                "(",
                p.role,
                ")"
              ] })
            ] }),
            p.technologies && /* @__PURE__ */ jsxs20("div", { className: "text-sm text-gray-600 mb-0.5 break-words", children: [
              "Tech: ",
              p.technologies
            ] }),
            (p.link || p.github) && /* @__PURE__ */ jsx20("div", { className: "text-xs text-gray-400 mb-0.5 break-all", children: [p.link, p.github].filter(Boolean).join("  \xB7  ") }),
            p.description && /* @__PURE__ */ jsx20("p", { className: "text-gray-700 text-sm leading-relaxed break-words", children: p.description }),
            p.highlights?.length > 0 && /* @__PURE__ */ jsx20("ul", { className: "list-disc list-inside mt-1 space-y-1 text-gray-700 text-sm", children: p.highlights.map((h, j) => /* @__PURE__ */ jsx20("li", { className: "break-words break-inside-avoid", children: h }, j)) })
          ] }, i))
        ] }, "projects") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs20("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx20("h2", { className: H, children: "Education" }),
          education.map((e, i) => /* @__PURE__ */ jsx20("div", { className: "mb-3 break-inside-avoid", children: /* @__PURE__ */ jsxs20("div", { className: "flex justify-between items-start flex-wrap gap-1", children: [
            /* @__PURE__ */ jsxs20("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxs20("h3", { className: "font-bold text-gray-900 break-words", children: [
                e.degree,
                e.field ? ` in ${e.field}` : ""
              ] }),
              /* @__PURE__ */ jsx20("div", { className: "text-gray-700 text-sm break-words", children: e.institution }),
              e.gpa && /* @__PURE__ */ jsxs20("div", { className: "text-xs text-gray-500 break-words", children: [
                "Grade: ",
                e.gpa
              ] }),
              e.details && /* @__PURE__ */ jsx20("div", { className: "text-xs text-gray-500 mt-0.5 break-words", children: e.details })
            ] }),
            /* @__PURE__ */ jsx20("span", { className: "text-sm text-gray-500 whitespace-nowrap shrink-0", children: e.year })
          ] }) }, i))
        ] }, "education") : null;
      case "skills":
        return skills?.length ? /* @__PURE__ */ jsxs20("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx20("h2", { className: H, children: "Skills" }),
          /* @__PURE__ */ jsx20("div", { className: "grid grid-cols-3 gap-x-4", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx20("p", { className: `${B} break-words`, children: s }, i)) })
        ] }, "skills") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs20("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx20("h2", { className: H, children: "Achievements" }),
          /* @__PURE__ */ jsx20("ul", { className: "space-y-1.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs20("li", { className: `flex items-start break-inside-avoid ${B}`, children: [
            /* @__PURE__ */ jsx20("span", { className: `font-bold mr-2 shrink-0 ${BL}`, children: "\u25CF" }),
            /* @__PURE__ */ jsx20("span", { className: "leading-relaxed break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs20("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx20("h2", { className: H, children: "Languages" }),
          /* @__PURE__ */ jsx20("div", { className: "text-gray-700 text-sm break-words", children: languages.join(" \xB7 ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs20("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx20("h2", { className: H, children: "Certifications" }),
          certifications.map((c, i) => /* @__PURE__ */ jsxs20("div", { className: "mb-1.5 text-sm text-gray-700 break-words", children: [
            /* @__PURE__ */ jsx20("span", { className: "font-medium", children: c.name }),
            c.issuer && /* @__PURE__ */ jsxs20("span", { className: "text-gray-600", children: [
              " \u2014 ",
              c.issuer
            ] }),
            c.year && /* @__PURE__ */ jsxs20("span", { className: "text-gray-500", children: [
              " (",
              c.year,
              ")"
            ] }),
            c.credentialUrl && /* @__PURE__ */ jsx20("span", { className: "block text-xs text-gray-400 break-all", children: c.credentialUrl })
          ] }, i))
        ] }, "certifications") : null;
      default:
        return /* @__PURE__ */ jsx20(CustomBlock20, { label: sec.label, content: (customSections || {})[sec.id], headingClass: H, bodyClass: B, bulletClass: BL }, sec.id);
    }
  };
  const activeSections = (sectionsConfig || []).filter((s) => s.visible);
  return /* @__PURE__ */ jsxs20("div", { className: "resume-template finance max-w-4xl mx-auto bg-white px-8 font-sans overflow-hidden", children: [
    personalInfo && /* @__PURE__ */ jsxs20("div", { className: "border-b border-gray-900 pb-4 mb-6", children: [
      /* @__PURE__ */ jsx20("h1", { className: "text-3xl font-bold text-gray-900 mb-1 break-words", children: personalInfo.fullName }),
      personalInfo.title && /* @__PURE__ */ jsx20("div", { className: "text-base text-gray-600 font-medium mb-2 break-words", children: personalInfo.title }),
      /* @__PURE__ */ jsxs20("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600", children: [
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
    const templateEl = React4.createElement(Template, { data });
    const bodyHtml = ReactDOMServer.renderToStaticMarkup(
      wrapStyle ? React4.createElement("div", { style: wrapStyle }, templateEl) : templateEl
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
