import { cn } from '../../utils/helpers';

export const Card = ({ children, className = '', hover = false, premium = false }) => (
  <div className={cn(
    premium
      ? 'rounded-2xl border border-brand-900/40 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0c1a3a] text-white shadow-lg'
      : 'card',
    hover && !premium && 'card-hover cursor-pointer',
    hover && premium && 'transition-all duration-300 hover:-translate-y-1',
    className,
  )}>
    {children}
  </div>
);
