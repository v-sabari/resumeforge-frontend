import { cn } from '../../utils/helpers';

export const Card = ({ children, className = '', hover = false, premium = false }) => (
  <div
    className={cn(
      'card',
      hover && 'card-hover',
      premium && 'border-brand-200 bg-gradient-to-br from-slate-950 via-slate-900 to-brand-900 text-white shadow-glow',
      className,
    )}
  >
    {children}
  </div>
);
