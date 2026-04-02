import { cn } from '../../utils/helpers';

const VARIANTS = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error:   'border-rose-200 bg-rose-50 text-rose-800',
  info:    'border-brand-200 bg-brand-50 text-brand-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
};

const ICONS = {
  success: '✓',
  error:   '!',
  info:    'i',
  warning: '⚠',
};

export const Alert = ({ variant = 'info', children, className = '' }) => {
  if (!children) return null;
  return (
    <div role="alert" className={cn('flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-6', VARIANTS[variant], className)}>
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-current/15 text-[10px] font-bold">
        {ICONS[variant]}
      </span>
      <span>{children}</span>
    </div>
  );
};
