export const Loader = ({ label = 'Loading...' }) => (
  <div role="status" className="flex items-center gap-3">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" aria-hidden="true" />
    <span className="text-sm text-slate-500">{label}</span>
  </div>
);
