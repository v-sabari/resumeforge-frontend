import { Link, NavLink } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/helpers';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link to={isAuthenticated ? '/app/dashboard' : '/login'} className="btn-secondary">
            {isAuthenticated ? 'Open app' : 'Log in'}
          </Link>
          <NavLink
            to={isAuthenticated ? '/app/builder' : '/register'}
            className={({ isActive }) => cn('btn-primary', isActive && 'bg-brand-700')}
          >
            Start building
          </NavLink>
        </div>
      </div>
    </header>
  );
};
