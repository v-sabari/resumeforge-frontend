import { cn } from '../../utils/helpers';

const variants = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-rose-200 bg-rose-50 text-rose-700',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
};

export const Alert = ({ variant = 'info', children, className = '' }) => {
  if (!children) return null;

  return (
    <div className={cn('rounded-2xl border px-4 py-3 text-sm', variants[variant], className)}>
      {children}
    </div>
  );
};
