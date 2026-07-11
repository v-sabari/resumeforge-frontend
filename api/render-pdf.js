// src/pdf/renderPdfHandler.jsx
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import React7 from "react";
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
  executive: { top: 32, bottom: 32 },
  fresher: { top: 32, bottom: 32 },
  minimal: { top: 32, bottom: 32 },
  classic: { top: 24, bottom: 24 },
  creative: { top: 32, bottom: 32 }
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

// src/components/resume/templates/ModernProTemplate.jsx
import React from "react";
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
          /* @__PURE__ */ jsx("div", { className: "text-gray-700 text-sm break-words", children: Array.isArray(skills) ? skills.join(" \xB7 ") : skills })
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
import React2 from "react";
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
  const SH2 = ({ children }) => /* @__PURE__ */ jsx2("div", { className: "text-xs font-bold uppercase tracking-[0.18em] text-gray-500 border-b border-gray-200 pb-0.5 mb-2 mt-5 first:mt-0 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx2(CustomBlock2, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs2(React2.Fragment, { children: [
          /* @__PURE__ */ jsx2(SH2, { children: "Profile" }),
          /* @__PURE__ */ jsx2("p", { className: "text-gray-600 leading-relaxed text-xs break-words", children: summary })
        ] }, "summary") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs2(React2.Fragment, { children: [
          /* @__PURE__ */ jsx2(SH2, { children: "Experience" }),
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
        return skills?.length ? /* @__PURE__ */ jsxs2(React2.Fragment, { children: [
          /* @__PURE__ */ jsx2(SH2, { children: "Skills" }),
          /* @__PURE__ */ jsx2("p", { className: "text-gray-600 text-xs leading-relaxed break-words", children: Array.isArray(skills) ? skills.join("  \xB7  ") : skills })
        ] }, "skills") : null;
      case "projects":
        return projects?.length ? /* @__PURE__ */ jsxs2(React2.Fragment, { children: [
          /* @__PURE__ */ jsx2(SH2, { children: "Projects" }),
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
        return education?.length ? /* @__PURE__ */ jsxs2(React2.Fragment, { children: [
          /* @__PURE__ */ jsx2(SH2, { children: "Education" }),
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
        return achievements?.length ? /* @__PURE__ */ jsxs2(React2.Fragment, { children: [
          /* @__PURE__ */ jsx2(SH2, { children: "Achievements" }),
          /* @__PURE__ */ jsx2("ul", { className: "space-y-1", children: achievements.map((a, i) => /* @__PURE__ */ jsxs2("li", { className: "flex gap-2 text-xs text-gray-600 break-inside-avoid", children: [
            /* @__PURE__ */ jsx2("span", { className: "text-gray-300 shrink-0 mt-0.5", children: "\u2013" }),
            /* @__PURE__ */ jsx2("span", { className: "break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs2(React2.Fragment, { children: [
          /* @__PURE__ */ jsx2(SH2, { children: "Languages" }),
          /* @__PURE__ */ jsx2("p", { className: "text-xs text-gray-600 break-words", children: languages.join("  \xB7  ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs2(React2.Fragment, { children: [
          /* @__PURE__ */ jsx2(SH2, { children: "Certifications" }),
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
import React3 from "react";
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
  const SH2 = ({ children }) => /* @__PURE__ */ jsx3("h2", { className: "text-base font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-800 pb-1 mb-3 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx3(CustomBlock3, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs3("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx3(SH2, { children: "Executive Profile" }),
          /* @__PURE__ */ jsx3("p", { className: "text-gray-700 leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs3("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx3(SH2, { children: "Key Achievements" }),
          /* @__PURE__ */ jsx3("ul", { className: "space-y-1.5", children: achievements.map((a, i) => /* @__PURE__ */ jsxs3("li", { className: "flex items-start text-gray-700 break-inside-avoid", children: [
            /* @__PURE__ */ jsx3("span", { className: "text-gray-400 font-bold mr-3 shrink-0", children: "\u25B8" }),
            /* @__PURE__ */ jsx3("span", { className: "break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "experience":
        return experience?.length ? /* @__PURE__ */ jsxs3("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx3(SH2, { children: "Leadership Experience" }),
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
          /* @__PURE__ */ jsx3(SH2, { children: "Key Projects" }),
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
          /* @__PURE__ */ jsx3(SH2, { children: "Education" }),
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
          /* @__PURE__ */ jsx3(SH2, { children: "Core Competencies" }),
          /* @__PURE__ */ jsx3("div", { className: "flex flex-wrap gap-2", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx3("span", { className: "bg-gray-100 text-gray-700 px-3 py-1 text-sm rounded-sm break-words max-w-full", children: s }, i)) })
        ] }, "skills") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs3("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx3(SH2, { children: "Languages" }),
          /* @__PURE__ */ jsx3("div", { className: "text-gray-700 text-sm break-words", children: languages.join(" \xB7 ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs3("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx3(SH2, { children: "Certifications" }),
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
import React4 from "react";
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
  const SH2 = ({ children }) => /* @__PURE__ */ jsx4("h2", { className: "text-sm font-bold text-blue-700 uppercase tracking-widest border-b border-blue-200 pb-1 mb-3 break-after-avoid", children });
  const renderSection = (sec) => {
    if (sec.type === "custom") return /* @__PURE__ */ jsx4(CustomBlock4, { label: sec.label, content: (customSections || {})[sec.id] }, sec.id);
    switch (sec.key) {
      case "basics":
        return null;
      case "summary":
        return summary ? /* @__PURE__ */ jsxs4("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx4(SH2, { children: "Career Objective" }),
          /* @__PURE__ */ jsx4("p", { className: "text-gray-700 text-sm leading-relaxed break-words", children: summary })
        ] }, "summary") : null;
      case "education":
        return education?.length ? /* @__PURE__ */ jsxs4("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx4(SH2, { children: "Education" }),
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
          /* @__PURE__ */ jsx4(SH2, { children: "Projects" }),
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
          /* @__PURE__ */ jsx4(SH2, { children: "Experience" }),
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
          /* @__PURE__ */ jsx4(SH2, { children: "Technical Skills" }),
          /* @__PURE__ */ jsx4("div", { className: "flex flex-wrap gap-2", children: (Array.isArray(skills) ? skills : [skills]).map((s, i) => /* @__PURE__ */ jsx4("span", { className: "bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded text-xs font-medium break-words max-w-full", children: s }, i)) })
        ] }, "skills") : null;
      case "achievements":
        return achievements?.length ? /* @__PURE__ */ jsxs4("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx4(SH2, { children: "Achievements & Awards" }),
          /* @__PURE__ */ jsx4("ul", { className: "space-y-1", children: achievements.map((a, i) => /* @__PURE__ */ jsxs4("li", { className: "flex items-start text-sm text-gray-700 break-inside-avoid", children: [
            /* @__PURE__ */ jsx4("span", { className: "text-blue-400 mr-2 shrink-0", children: "\u25B8" }),
            /* @__PURE__ */ jsx4("span", { className: "break-words min-w-0", children: a })
          ] }, i)) })
        ] }, "achievements") : null;
      case "languages":
        return languages?.length ? /* @__PURE__ */ jsxs4("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx4(SH2, { children: "Languages" }),
          /* @__PURE__ */ jsx4("div", { className: "text-gray-700 text-sm break-words", children: languages.join(" \xB7 ") })
        ] }, "languages") : null;
      case "certifications":
        return certifications?.length ? /* @__PURE__ */ jsxs4("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx4(SH2, { children: "Certifications" }),
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
import React5 from "react";
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
          /* @__PURE__ */ jsx5("div", { className: "ml-11 text-gray-700 text-sm break-words", children: Array.isArray(skills) ? skills.join(" \xB7 ") : skills })
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
import React6 from "react";
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
          /* @__PURE__ */ jsx6("p", { className: "break-words", children: (skills || []).join(", ") })
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

// src/pdf/renderPdfHandler.jsx
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var STANDARD_SECTION_KEYS = [
  "basics",
  "summary",
  "skills",
  "experience",
  "projects",
  "education",
  "certifications",
  "achievements",
  "languages"
];
var DEFAULT_SECTIONS_CONFIG = STANDARD_SECTION_KEYS.map((key, i) => ({
  id: key,
  type: "standard",
  key,
  label: key,
  visible: true,
  order: i
}));
var TEMPLATE_MAP = {
  modern: ModernProTemplate,
  classic: ClassicTemplate,
  minimal: MinimalATSTemplate,
  executive: ExecutiveTemplate,
  fresher: FresherTemplate,
  creative: CreativeATSTemplate
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
    const templateEl = React7.createElement(Template, { data });
    const bodyHtml = ReactDOMServer.renderToStaticMarkup(
      wrapStyle ? React7.createElement("div", { style: wrapStyle }, templateEl) : templateEl
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
