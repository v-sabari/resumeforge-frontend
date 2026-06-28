import { memo, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { Icon } from '../icons/Icon';

const navLinks = [
  { to: '/tools',     label: 'Free Tools' },
  { to: '/pricing',   label: 'Pricing'    },
  { to: '/resources', label: 'Resources'  },
  { to: '/about',     label: 'About'      },
];

export const Navbar = memo(() => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className={`sticky top-0 z-40 w-full bg-white transition-shadow ${scrolled ? 'shadow-sm' : ''} border-b border-surface-100`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Logo size="sm" linkTo="/" />

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === to || location.pathname.startsWith(to + '/')
                  ? 'text-brand-700 bg-brand-50'
                  : 'text-ink-500 hover:text-ink-950 hover:bg-surface-100'
              }`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/app/dashboard" className="btn-secondary btn-sm">
                <Icon name="grid" className="h-4 w-4" />
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-ghost btn-sm text-ink-400 hover:text-ink-700">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost btn-sm">Sign in</Link>
              <Link to="/register" className="btn-primary btn-sm">
                Start free
                <Icon name="arrowRight" className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="md:hidden btn-ghost p-2"
          aria-label="Toggle menu">
          <Icon name={menuOpen ? 'close' : 'menu'} className="h-5 w-5" />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-surface-100 bg-white px-4 py-4 space-y-1 shadow-sm">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to}
              className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium ${
                location.pathname === to ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-surface-100'
              }`}>
              {label}
            </Link>
          ))}

          <div className="border-t border-surface-100 pt-3 mt-3 space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/app/dashboard" className="btn-primary w-full justify-center">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-secondary w-full justify-center">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary w-full justify-center">
                  Start free — no card needed
                </Link>
                <Link to="/login" className="btn-secondary w-full justify-center">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
});

Navbar.displayName = 'Navbar';
