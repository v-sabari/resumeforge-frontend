export const Loader = ({ label = 'Loading…', size = 'md', className = '' }) => {
  const sz = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' }[size] || 'h-6 w-6';
  return (
    <div className={`flex items-center gap-2.5 text-sm text-ink-400 ${className}`}>
      <svg className={`${sz} animate-spin text-brand-500`} viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
      {label && <span>{label}</span>}
    </div>
  );
};

export const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-surface-50">
    <Loader label="Loading…" size="lg" />
  </div>
);
