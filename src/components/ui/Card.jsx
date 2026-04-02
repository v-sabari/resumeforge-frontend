import { cn } from '../../utils/helpers';

export const Card = ({ children, className = '', hover = false, premium = false }) => (
  <div className={cn(
    premium ? 'card-premium' : 'card',
    hover && !premium && 'card-interactive',
    hover && premium && 'transition-all duration-200 hover:-translate-y-0.5',
    className,
  )}>
    {children}
  </div>
);
