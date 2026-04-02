import { Link } from 'react-router-dom';
import logoFull from '../../assets/logo-full.svg';
import logoMark from '../../assets/logo-mark.svg';
import { cn } from '../../utils/helpers';

export const Logo = ({ compact = false, className = '', linkTo = '/', surface = 'light' }) => {
  const dark = surface === 'dark';
  return (
    <Link to={linkTo} className={cn('inline-flex shrink-0 items-center', className)}>
      {compact ? (
        <div className={cn('inline-flex items-center justify-center rounded-xl', dark ? 'bg-white/95 p-2 shadow-soft' : '')}>
          <img src={logoMark} alt="ResumeForge AI" className="h-7 w-7 object-contain" />
        </div>
      ) : (
        <div className={cn('inline-flex items-center rounded-xl', dark ? 'bg-white/95 px-2.5 py-1.5 shadow-soft' : '')}>
          <img src={logoFull} alt="ResumeForge AI" className="h-8 w-auto object-contain" />
        </div>
      )}
    </Link>
  );
};
