import { memo, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { Icon } from '../icons/Icon';

const navLinks = [
  { to: '/features', label: 'Features' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/resources', label: 'Resources' },
  { to: '/about', label: 'About' },
];

export const Navbar = memo(() => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-surface-200 bg-white/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo size="md" />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive(to)
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-500 hover:bg-surface-100 hover:text-ink-950'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <Link to="/app/dashboard" className="btn-secondary btn-sm">
                <Icon name="grid" className="h-3.5 w-3.5" />
                Dashboard
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  className="flex items-center gap-2 rounded-xl border border-surface-200 px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-surface-50"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                  <span className="max-w-[100px] truncate">
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <Icon name="chevronDown" className="h-3.5 w-3.5 text-ink-400" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                      aria-hidden="true"
                    />
                    <div
                      className="absolute right-0 top-full z-20 mt-2 w-48 animate-fade-up card p-1.5 shadow-lift-lg"
                      role="menu"
                    >
                      <Link
                        to="/app/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-600 hover:bg-surface-100"
                        role="menuitem"
                      >
                        <Icon name="settings" className="h-4 w-4" />
                        Profile
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-danger-600 hover:bg-danger-50"
                        role="menuitem"
                      >
                        <Icon name="logout" className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost btn-sm">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary btn-sm">
                Get started free
                <Icon name="arrowRight" className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="btn-ghost p-2 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          <Icon name={mobileOpen ? 'close' : 'menu'} className="h-5 w-5" />
        </button>
      </div>

      <div
        id="mobile-navigation"
        aria-hidden={!mobileOpen}
        className={`overflow-hidden bg-white transition-all duration-200 md:hidden ${
          mobileOpen
            ? 'max-h-[520px] border-t border-surface-200 px-4 py-4 opacity-100'
            : 'max-h-0 px-4 py-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="space-y-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`block rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive(to)
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-600 hover:bg-surface-100'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-2 border-t border-surface-200 pt-3">
          {isAuthenticated ? (
            <>
              <Link to="/app/dashboard" className="btn-secondary justify-center">
                Dashboard
              </Link>
              <Link to="/app/profile" className="btn-ghost justify-center">
                Profile
              </Link>
              <button type="button" onClick={handleLogout} className="btn-danger justify-center">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary justify-center">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary justify-center">
                Get started free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
});

Navbar.displayName = 'Navbar';