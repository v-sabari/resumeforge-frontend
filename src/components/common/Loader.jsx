import { OrbitalBlink } from './OrbitalBlink';

export const Loader = ({ label = 'Loading…', size = 'md', className = '' }) => {
  return (
    <div className={`flex items-center gap-2.5 text-sm text-ink-400 ${className}`}>
      <OrbitalBlink size={size} />
      {label && <span>{label}</span>}
    </div>
  );
};

export const PageLoader = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-surface-50 gap-5">
    <OrbitalBlink size="lg" />
    <p className="text-sm font-medium text-ink-400 tracking-wide animate-pulse">Loading…</p>
  </div>
);
