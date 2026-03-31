import { Link } from 'react-router-dom';
import logoFull from '../../assets/logo-full.svg';
import logoMark from '../../assets/logo-mark.svg';
import { cn } from '../../utils/helpers';

export const Logo = ({
  compact = false,
  className = '',
  linkTo = '/',
  surface = 'light',
}) => {
  const isDark = surface === 'dark';

  return (
    <Link to={linkTo} className={cn('inline-flex items-center', className)}>
      {compact ? (
        <div
          className={cn(
            'inline-flex items-center justify-center rounded-2xl',
            isDark ? 'bg-white/95 p-3 shadow-sm' : 'bg-transparent p-0',
          )}
        >
          <img
            src={logoMark}
            alt="ResumeForge AI"
            className="h-12 w-12 object-contain"
          />
        </div>
      ) : (
        <div
          className={cn(
            'inline-flex items-center rounded-2xl',
            isDark ? 'bg-white/95 px-3 py-2 shadow-sm' : 'bg-transparent',
          )}
        >
          <img
            src={logoFull}
            alt="ResumeForge AI"
            className="h-12 w-auto object-contain"
          />
        </div>
      )}
    </Link>
  );
};