import { Link } from 'react-router-dom';
import { APP_NAME } from '../../utils/constants';
import { Icon } from '../icons/Icon';

export const Logo = ({ size = 'md', linkTo = '/', className = '' }) => {
  const sizes = {
    sm: { icon: 'h-6 w-6', text: 'text-base' },
    md: { icon: 'h-7 w-7', text: 'text-lg'   },
    lg: { icon: 'h-9 w-9', text: 'text-2xl'  },
  };
  const s = sizes[size] || sizes.md;

  return (
    <Link to={linkTo} className={`inline-flex items-center gap-2 font-display font-semibold text-ink-950 ${s.text} ${className}`}>
      <span className={`${s.icon} text-brand-600`}>
        <Icon name="logo" className="h-full w-full" />
      </span>
      <span>{APP_NAME}</span>
    </Link>
  );
};
