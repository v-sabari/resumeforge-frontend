import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { Icon } from '../icons/Icon';

const navLinks = [
  { to: '/features',  label: 'Features'  },
  { to: '/pricing',   label: 'Pricing'   },
  { to: '/resources', label: 'Resources' },
  { to: '/about',     label: 'About'     },
];

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location    = useLocation();
  const navigate    = useNavigate();
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout(); navigate('/'); setUserMenuOpen(false); setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <Logo size="md" />

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to}
              className={`rounded-xl px-3.5 py-2 text-sm font-medium transition-colors
                ${location.pathname.startsWith(to) && to !== '/'
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-500 hover:bg-surface-100 hover:text-ink-950'}`}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/app/dashboard" className="btn-secondary btn-sm">
                <Icon name="grid" className="h-3.5 w-3.5" /> Dashboard
              </Link>
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink-600 border border-surface-200 hover:bg-surface-50 transition-colors">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                  <span className="max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                  <Icon name="chevronDown" className="h-3.5 w-3.5 text-ink-400" />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 z-20 w-48 card shadow-lift-lg animate-fade-up p-1.5">
                      <Link to="/app/profile" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-600 hover:bg-surface-100">
                        <Icon name="settings" className="h-4 w-4" /> Profile
                      </Link>
                      <button onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-danger-600 hover:bg-danger-50">
                        <Icon name="logout" className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn-ghost btn-sm">Sign in</Link>
              <Link to="/register" className="btn-primary btn-sm">
                Get started free <Icon name="arrowRight" className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden btn-ghost p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <Icon name={mobileOpen ? 'close' : 'menu'} className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-surface-200 bg-white px-4 py-4 space-y-1">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-600 hover:bg-surface-100">
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-surface-200 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/app/dashboard" onClick={() => setMobileOpen(false)} className="btn-secondary justify-center">Dashboard</Link>
                <Link to="/app/profile"   onClick={() => setMobileOpen(false)} className="btn-ghost   justify-center">Profile</Link>
                <button onClick={handleLogout} className="btn-danger justify-center">Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login"    onClick={() => setMobileOpen(false)} className="btn-secondary justify-center">Sign in</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary  justify-center">Get started free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
