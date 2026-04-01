import { create } from 'zustand';
import { defaultResume } from '../../../utils/constants';
import { normalizeResume } from '../utils/builderMappers';

const reorder = (items, activeId, overId) => {
  const oldIndex = items.indexOf(activeId);
  const newIndex = items.indexOf(overId);

  if (oldIndex === -1 || newIndex === -1) return items;

  const next = [...items];
  const [moved] = next.splice(oldIndex, 1);
  next.splice(newIndex, 0, moved);
  return next;
};

export const useResumeBuilderStore = create((set, get) => ({
  resume: normalizeResume(defaultResume),
  dirty: false,
  hydrated: false,
  lastSavedAt: null,

  initializeResume: (payload) => set({
    resume: normalizeResume(payload),
    dirty: false,
    hydrated: true,
  }),

  replaceResume: (nextResume) => set({
    resume: normalizeResume(nextResume),
    dirty: true,
  }),

  patchResume: (patch) => set((state) => ({
    resume: normalizeResume({ ...state.resume, ...patch }),
    dirty: true,
  })),

  updateTopField: (field, value) => set((state) => ({
    resume: normalizeResume({ ...state.resume, [field]: value }),
    dirty: true,
  })),

  updateArrayItem: (section, id, field, value) => set((state) => ({
    resume: normalizeResume({
      ...state.resume,
      [section]: (state.resume[section] || []).map((item) => item.id === id ? { ...item, [field]: value } : item),
    }),
    dirty: true,
  })),

  addArrayItem: (section, item) => set((state) => ({
    resume: normalizeResume({
      ...state.resume,
      [section]: [...(state.resume[section] || []), item],
    }),
    dirty: true,
  })),

  removeArrayItem: (section, id) => set((state) => ({
    resume: normalizeResume({
      ...state.resume,
      [section]: (state.resume[section] || []).filter((item) => item.id !== id),
    }),
    dirty: true,
  })),

  reorderSections: (activeId, overId) => set((state) => ({
    resume: normalizeResume({
      ...state.resume,
      sectionOrder: reorder(state.resume.sectionOrder || [], activeId, overId),
    }),
    dirty: true,
  })),

  toggleSectionCollapsed: (section) => set((state) => ({
    resume: normalizeResume({
      ...state.resume,
      sectionSettings: {
        ...state.resume.sectionSettings,
        [section]: {
          ...(state.resume.sectionSettings?.[section] || {}),
          collapsed: !(state.resume.sectionSettings?.[section]?.collapsed),
        },
      },
    }),
    dirty: true,
  })),

  setSectionEnabled: (section, enabled) => set((state) => ({
    resume: normalizeResume({
      ...state.resume,
      sectionSettings: {
        ...state.resume.sectionSettings,
        [section]: {
          ...(state.resume.sectionSettings?.[section] || {}),
          enabled,
        },
      },
    }),
    dirty: true,
  })),

  setTemplateId: (templateId) => set((state) => ({
    resume: normalizeResume({ ...state.resume, templateId }),
    dirty: true,
  })),

  markSaved: (savedResume = null) => set((state) => ({
    resume: savedResume ? normalizeResume(savedResume) : state.resume,
    dirty: false,
    lastSavedAt: Date.now(),
  })),

  getResume: () => get().resume,
}));
