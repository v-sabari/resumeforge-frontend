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

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const currentSection =
    location.pathname.replace('/app/', '').replace('/', ' · ') || 'App';

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-4 px-3 py-3 sm:gap-5 sm:px-4 sm:py-4 lg:gap-6 lg:px-6">
        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
            onClick={closeSidebar}
          />
        )}

        <aside
          className={cn(
            'card fixed inset-y-3 left-3 z-50 flex w-[88vw] max-w-[320px] flex-col justify-between p-4 shadow-2xl transition-transform duration-300 sm:left-4 sm:inset-y-4 sm:w-[320px] sm:p-5 lg:sticky lg:top-6 lg:z-auto lg:flex lg:h-[calc(100vh-3rem)] lg:w-[290px] lg:max-w-none lg:translate-x-0 lg:shadow-none',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-[115%] lg:translate-x-0',
          )}
        >
          <div>
            <div className="mb-6 flex items-center justify-between lg:mb-8">
              <Logo linkTo="/app/dashboard" />
              <button
                type="button"
                onClick={closeSidebar}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 lg:hidden"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-4 shadow-inset">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Workspace
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Manage resumes, refine content with AI, and keep export access in one place.
              </p>
            </div>

            <nav className="mt-6 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                      isActive
                        ? 'bg-slate-950 text-white shadow-soft'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                    )
                  }
                >
                  <Icon name={item.icon} className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-[24px] bg-slate-950 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-200">
                Plan
              </p>
              <h3 className="mt-3 text-lg font-semibold">
                {premium?.isPremium ? 'Premium unlocked' : 'Free workspace'}
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                {premium?.isPremium
                  ? 'Unlimited export access is active for your account.'
                  : `${exportStatus?.remainingFreeExports ?? 0} free exports remaining before upgrade.`}
              </p>
            </div>

            <button
              type="button"
              className="btn-secondary w-full justify-center"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="card mb-4 px-4 py-4 sm:mb-5 sm:px-5 sm:py-4 lg:mb-6 lg:px-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 lg:hidden"
                    onClick={toggleSidebar}
                    aria-label="Open menu"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                    </svg>
                  </button>

                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500 sm:text-xs">
                      {currentSection}
                    </p>
                    <h1 className="mt-1 truncate text-base font-semibold tracking-tight text-slate-950 sm:text-lg">
                      {user?.name || user?.email || 'ResumeForge AI'}
                    </h1>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-primary hidden shrink-0 sm:inline-flex lg:hidden"
                  onClick={() => navigate('/app/builder')}
                >
                  Open builder
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-950">{premium?.plan || 'Free'}</span>
                  <span className="mx-2 text-slate-300">•</span>
                  <span>{exportStatus?.usedExports ?? 0} exports used</span>
                </div>

                <button
                  type="button"
                  className="btn-primary w-full justify-center sm:w-auto sm:hidden"
                  onClick={() => navigate('/app/builder')}
                >
                  Open builder
                </button>
              </div>
            </div>
          </header>

          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};