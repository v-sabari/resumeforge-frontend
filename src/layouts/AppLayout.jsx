import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppSidebar } from '../components/navigation/AppSidebar';
import { Logo } from '../components/common/Logo';
import { Icon } from '../components/icons/Icon';

export const AppLayout = () => {
  const { showInactivityWarning, dismissInactivityWarning, logout } = useAuth();
  const navigate  = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogoutFromWarning = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">
      {/* Desktop sidebar */}
      <AppSidebar />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile topbar */}
        <div className="lg:hidden flex h-14 items-center justify-between border-b border-surface-200 bg-white px-4">
          <Logo size="sm" linkTo="/app/dashboard" />
          <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="btn-ghost p-2">
            <Icon name={mobileNavOpen ? 'close' : 'menu'} className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden absolute inset-0 z-50">
            <div className="absolute inset-0 bg-ink-950/50" onClick={() => setMobileNavOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lift-lg flex flex-col animate-slide-in">
              <div className="flex h-14 items-center px-4 border-b border-surface-200">
                <Logo size="sm" />
              </div>
              <nav className="flex-1 p-3 space-y-1">
                {[
                  { to: '/app/dashboard', icon: 'grid',  label: 'Dashboard' },
                  { to: '/app/builder',   icon: 'text',  label: 'New Resume' },
                  { to: '/app/profile',   icon: 'user',  label: 'Profile'   },
                  { to: '/pricing',       icon: 'crown', label: 'Upgrade'   },
                ].map(({ to, icon, label }) => (
                  <NavLink key={to} to={to} end={to === '/app/dashboard'}
                    onClick={() => setMobileNavOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium
                       ${isActive ? 'bg-brand-600 text-white' : 'text-ink-500 hover:bg-surface-100'}`}>
                    <Icon name={icon} className="h-4 w-4" />{label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Inactivity warning overlay */}
      {showInactivityWarning && (
        <div className="inactivity-overlay" role="alertdialog" aria-live="assertive">
          <div className="card w-full max-w-sm mx-4 p-6 text-center animate-fade-up shadow-lift-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning-50">
              <Icon name="warning" className="h-6 w-6 text-warning-600" />
            </div>
            <h2 className="text-base font-semibold text-ink-950">Still there?</h2>
            <p className="mt-2 text-sm text-ink-400">
              You'll be signed out in 30 seconds due to inactivity.
            </p>
            <div className="mt-5 flex gap-2">
              <button onClick={dismissInactivityWarning} className="btn-primary flex-1 justify-center">
                Stay signed in
              </button>
              <button onClick={handleLogoutFromWarning} className="btn-secondary flex-1 justify-center">
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
