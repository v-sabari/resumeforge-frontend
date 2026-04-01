import PersonalInfoForm from "../components/forms/PersonalInfoForm";
import SummaryForm from "../components/forms/SummaryForm";

import ExperienceSectionEditor from "../components/sections/ExperienceSectionEditor";
import EducationSectionEditor from "../components/sections/EducationSectionEditor";
import ProjectsSectionEditor from "../components/sections/ProjectsSectionEditor";
import CertificationsSectionEditor from "../components/sections/CertificationsSectionEditor";
import AchievementsSectionEditor from "../components/sections/AchievementsSectionEditor";
import SkillsForm from "../components/forms/SkillsForm";

// 1. ORDER KEYS
export const SECTION_KEYS = [
  "personalInfo",
  "summary",
  "experience",
  "education",
  "projects",
  "skills",
  "certifications",
  "achievements",
];

// 2. LABELS
export const SECTION_LABELS = {
  personalInfo: "Personal information",
  summary: "Professional summary",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  certifications: "Certifications",
  achievements: "Achievements",
};

// 3. COMPONENT REGISTRY (🔥 MOST IMPORTANT)
export const SECTION_COMPONENTS = {
  personalInfo: PersonalInfoForm,
  summary: SummaryForm,
  experience: ExperienceSectionEditor,
  education: EducationSectionEditor,
  projects: ProjectsSectionEditor,
  skills: SkillsForm,
  certifications: CertificationsSectionEditor,
  achievements: AchievementsSectionEditor,
};

export const SECTION_CONFIG = {
  personalInfo: { collapsible: false },
  summary: { collapsible: true },
  experience: { collapsible: true, repeatable: true },
  education: { collapsible: true, repeatable: true },
  projects: { collapsible: true, repeatable: true },
  skills: { collapsible: true },
  certifications: { collapsible: true },
  achievements: { collapsible: true },
};