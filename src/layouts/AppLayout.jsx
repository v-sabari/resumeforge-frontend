import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/helpers';
import { Icon } from '../components/icons/Icon';

const navItems = [
  { label: 'Dashboard', to: '/app/dashboard', icon: 'dashboard' },
  { label: 'Builder', to: '/app/builder', icon: 'builder' },
  { label: 'Pricing', to: '/pricing', icon: 'pricing' },
  { label: 'Profile', to: '/app/profile', icon: 'profile' },
];

export const AppLayout = () => {
  const { logout, premium, user, exportStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const currentSection =
    location.pathname.replace('/app/', '').replace('/', ' · ') || 'App';

  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent text-slate-900">
      <div className="app-shell flex min-h-screen gap-4 py-4 sm:gap-6 sm:py-6">
        {isSidebarOpen ? (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}

        <aside
          className={cn(
            'surface-dark fixed inset-y-4 left-4 z-50 flex w-[88vw] max-w-[320px] flex-col justify-between p-4 transition-transform duration-300 ease-out sm:p-5 lg:sticky lg:top-6 lg:z-10 lg:h-[calc(100vh-3rem)] lg:w-[292px] lg:max-w-none',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-[110%] lg:translate-x-0',
          )}
        >
          <div>
            <div className="flex items-center justify-between gap-3">
              <Logo linkTo="/app/dashboard" surface="dark" />
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close menu"
              >
                <span className="text-xl leading-none">×</span>
              </button>
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-200">Workspace</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Edit faster, preview instantly, and keep billing-aware export actions in one premium workspace.
              </p>
            </div>

            <nav className="mt-6 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-300 ease-out',
                      isActive
                        ? 'bg-white text-slate-950 shadow-soft'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white',
                    )
                  }
                >
                  <Icon name={item.icon} className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] border border-brand-400/20 bg-brand-500/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-200">Plan</p>
              <h3 className="mt-3 text-lg font-semibold text-white">
                {premium?.isPremium ? 'Premium unlocked' : 'Free workspace'}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                {premium?.isPremium
                  ? 'Unlimited export access is active on your account.'
                  : `${exportStatus?.remainingFreeExports ?? 0} free exports remaining before upgrade.`}
              </p>
            </div>
            <button type="button" className="btn-secondary w-full justify-center" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="card mb-6 p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-3 sm:gap-4">
                <button
                  type="button"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition duration-300 hover:bg-slate-50 lg:hidden"
                  onClick={() => setIsSidebarOpen(true)}
                  aria-label="Open menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                </button>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 sm:text-xs">
                    {currentSection}
                  </p>
                  <h1 className="mt-1 truncate text-lg font-semibold text-slate-950 sm:text-2xl">
                    {user?.name || user?.email || 'ResumeForge AI'}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                    Keep resumes, plan state, and export actions aligned across the same workflow.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  <span className="font-semibold text-slate-950">{premium?.plan || 'Free'}</span>
                  <span className="mx-2 text-slate-300">•</span>
                  <span>{exportStatus?.usedExports ?? 0} exports used</span>
                </div>
                <button type="button" className="btn-primary justify-center" onClick={() => navigate('/app/builder')}>
                  Open builder
                </button>
              </div>
            </div>
          </header>

          <main className="min-w-0 pb-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
