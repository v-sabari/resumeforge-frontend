import { defaultResume } from '../../../utils/constants';
import { SECTION_KEYS } from './sectionRegistry';

const ensureArrayItems = (items, fallback) => Array.isArray(items) ? items : fallback;

export const normalizeResume = (resume = {}) => {
  const merged = {
    ...defaultResume,
    ...resume,
  };

  return {
    ...merged,
    skills: ensureArrayItems(merged.skills, defaultResume.skills),
    achievements: ensureArrayItems(merged.achievements, defaultResume.achievements),
    experience: ensureArrayItems(merged.experience, defaultResume.experience),
    education: ensureArrayItems(merged.education, defaultResume.education),
    projects: ensureArrayItems(merged.projects, defaultResume.projects),
    certifications: ensureArrayItems(merged.certifications, defaultResume.certifications),
    templateId: merged.templateId || defaultResume.templateId,
    sectionOrder: Array.isArray(merged.sectionOrder) && merged.sectionOrder.length ? merged.sectionOrder : defaultResume.sectionOrder,
    sectionSettings: SECTION_KEYS.reduce((acc, key) => ({
      ...acc,
      [key]: {
        enabled: merged.sectionSettings?.[key]?.enabled ?? defaultResume.sectionSettings?.[key]?.enabled ?? true,
        collapsed: merged.sectionSettings?.[key]?.collapsed ?? defaultResume.sectionSettings?.[key]?.collapsed ?? false,
      },
    }), {}),
  };
};
