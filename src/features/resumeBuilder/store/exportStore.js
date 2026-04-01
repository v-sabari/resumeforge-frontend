import { create } from 'zustand';

const coerceRemaining = (status, premium) => {
  if (premium?.isPremium) return Infinity;
  if (typeof status?.remainingExports === 'number') return status.remainingExports;
  if (typeof status?.exportsRemaining === 'number') return status.exportsRemaining;
  if (typeof status?.exportsUsed === 'number') return Math.max(0, 2 - status.exportsUsed);
  return 2;
};

export const useExportStore = create((set) => ({
  exportsRemaining: 2,
  exportsUsed: 0,
  isPremium: false,
  blockedReason: '',
  loading: false,

  syncFromStatus: ({ exportStatus, premium }) => set({
    isPremium: Boolean(premium?.isPremium),
    exportsUsed: exportStatus?.exportsUsed || 0,
    exportsRemaining: coerceRemaining(exportStatus, premium),
    blockedReason: '',
    loading: false,
  }),

  setLoading: (loading) => set({ loading }),
  setBlockedReason: (blockedReason) => set({ blockedReason }),
  consumeExport: () => set((state) => ({
    exportsUsed: state.exportsUsed + 1,
    exportsRemaining: state.isPremium || state.exportsRemaining === Infinity ? Infinity : Math.max(0, state.exportsRemaining - 1),
  })),
}));
