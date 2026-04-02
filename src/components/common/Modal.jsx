import { cn } from '../../utils/helpers';

export const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-fade-in">
      <div className={cn('w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg animate-scale-in', className)}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          <button type="button" onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
            aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
