import { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/icons/Icon';
import { AppSidebar } from '../components/navigation/AppSidebar';
import { cn } from '../utils/helpers';

const navItems = [
  { label: 'Dashboard', to: '/app/dashboard', icon: 'dashboard' },
  { label: 'Builder', to: '/app/builder', icon: 'builder' },
  { label: 'Pricing', to: '/pricing', icon: 'pricing' },
  { label: 'Profile', to: '/app/profile', icon: 'profile' },
];

const SidebarContent = ({ collapsed = false, onNavigate, onToggleCollapse, canCollapse = false, onCloseMobile, onLogout, premium, exportStatus }) => (
  <div className="flex h-full flex-col">
    <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4">
      <div className="min-w-0 flex-1 overflow-hidden">
        <Logo linkTo="/app/dashboard" surface="dark" compact={collapsed} />
      </div>
      <button
        type="button"
        onClick={onCloseMobile}
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition duration-300 hover:bg-white/10 xl:hidden"
        aria-label="Close menu"
      >
        <span className="text-xl leading-none">×</span>
      </button>
      {canCollapse ? (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition duration-300 hover:bg-white/10 xl:inline-flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 19-7-7 7-7" />
            )}
          </svg>
        </button>
      ) : null}
    </div>

    <div className="flex-1 px-3 py-4">
      {!collapsed ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-200">Workspace</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Manage resumes, exports, and billing-aware actions from one clean workspace.
          </p>
        </div>
      ) : null}

      <nav className={cn('space-y-2', collapsed ? 'mt-2' : 'mt-6')}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                'group flex items-center rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-300',
                collapsed ? 'justify-center' : 'gap-3',
                isActive
                  ? 'bg-white text-slate-950 shadow-soft'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white',
              )
            }
          >
            <Icon name={item.icon} className="h-5 w-5 shrink-0" />
            {!collapsed ? <span className="truncate">{item.label}</span> : null}
          </NavLink>
        ))}
      </nav>
    </div>

    <div className="border-t border-white/10 px-3 py-4">
      <div className={cn('rounded-3xl border border-brand-400/20 bg-brand-500/10', collapsed ? 'px-3 py-4 text-center' : 'px-4 py-4')}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-200">Plan</p>
        <p className="mt-3 text-sm font-semibold text-white">{premium?.isPremium ? 'Premium' : 'Free'}</p>
        {!collapsed ? (
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {premium?.isPremium
              ? 'Unlimited export access is active on your account.'
              : `${exportStatus?.remainingFreeExports ?? 0} free exports left before upgrade.`}
          </p>
        ) : (
          <p className="mt-1 text-xs text-slate-300">{exportStatus?.remainingFreeExports ?? 0} left</p>
        )}
      </div>

      <button
        type="button"
        className={cn('btn-secondary mt-4 w-full justify-center', collapsed && 'px-3')}
        onClick={onLogout}
        title={collapsed ? 'Log out' : undefined}
      >
        <span className="truncate">{collapsed ? 'Exit' : 'Log out'}</span>
      </button>
    </div>
  </div>
);

export const AppLayout = () => {
  const { logout, premium, user, exportStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const saved = window.localStorage.getItem('resumeforge-sidebar-collapsed');
    if (saved === 'true') setIsDesktopCollapsed(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('resumeforge-sidebar-collapsed', String(isDesktopCollapsed));
  }, [isDesktopCollapsed]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
<<<<<<< HEAD
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
=======
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsSidebarOpen(false);
    };

    const handleClickOutside = (event) => {
      if (!isSidebarOpen) return;
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
>>>>>>> 488aee9d81e8e5f13867ea09e09bb01bb4567075
        setIsSidebarOpen(false);
      }
    };

<<<<<<< HEAD
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    window.addEventListener('keydown', handleEscape);
=======
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
>>>>>>> 488aee9d81e8e5f13867ea09e09bb01bb4567075

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isSidebarOpen]);

<<<<<<< HEAD
  const currentSection = location.pathname.replace('/app/', '').replace('/', ' · ') || 'App';

  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent text-slate-900">
=======
  const currentSection = useMemo(() => {
    const value = location.pathname.replace('/app/', '').replace('/', ' · ') || 'App';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }, [location.pathname]);

  return (
    <div className="min-h-screen overflow-x-hidden text-slate-900">
>>>>>>> 488aee9d81e8e5f13867ea09e09bb01bb4567075
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm xl:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

<<<<<<< HEAD
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-0 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-[288px] bg-slate-950 text-white shadow-2xl transition-transform duration-300 ease-out xl:static xl:inset-auto xl:block xl:h-[calc(100vh-3rem)] xl:shrink-0 xl:rounded-[32px] xl:border xl:border-white/10 xl:bg-slate-950 xl:shadow-soft',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0',
            isDesktopCollapsed ? 'xl:w-24' : 'xl:w-[280px]',
          )}
        >
          <SidebarContent
            collapsed={isDesktopCollapsed}
            canCollapse
            onNavigate={() => setIsSidebarOpen(false)}
            onToggleCollapse={() => setIsDesktopCollapsed((value) => !value)}
            onCloseMobile={() => setIsSidebarOpen(false)}
            onLogout={handleLogout}
            premium={premium}
            exportStatus={exportStatus}
          />
        </aside>

        <div className="min-w-0 flex-1 xl:pl-6">
          <header className="card mb-6 px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <button
                  type="button"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition duration-300 hover:bg-slate-50 xl:hidden"
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
                  <h1 className="mt-1 truncate text-xl font-semibold text-slate-950 sm:text-2xl lg:text-3xl">
                    {user?.name || user?.email || 'ResumeForge AI'}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                    Keep resumes, exports, and premium state aligned across one polished workflow.
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
            <div className="mx-auto w-full max-w-6xl">
              <Outlet />
            </div>
          </main>
=======
      <div className="layout-wrapper py-4 sm:py-6">
        <div className="flex min-h-[calc(100vh-2rem)] gap-4 sm:gap-6">
          <div ref={sidebarRef} className="shrink-0">
            <AppSidebar
              navItems={navItems}
              isOpen={isSidebarOpen}
              isDesktopCollapsed={isDesktopCollapsed}
              onClose={() => setIsSidebarOpen(false)}
              onToggleDesktop={() => setIsDesktopCollapsed((prev) => !prev)}
              premium={premium}
              exportStatus={exportStatus}
              onLogout={handleLogout}
            />
          </div>

          <div className="min-w-0 flex-1 xl:pl-0">
            <header className="card mb-6 p-4 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <button
                    type="button"
                    className="btn-secondary shrink-0 justify-center px-0 xl:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Open menu"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition duration-300 hover:bg-slate-50 xl:inline-flex"
                    onClick={() => setIsDesktopCollapsed((prev) => !prev)}
                    aria-label={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  >
                    <Icon name="arrowRight" className={cn('h-5 w-5 transition-transform duration-300', isDesktopCollapsed && 'rotate-180')} />
                  </button>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      {currentSection}
                    </p>
                    <h1 className="mt-2 truncate text-2xl font-semibold text-slate-950 sm:text-3xl">
                      {user?.name || user?.email || 'ResumeForge AI'}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                      Edit faster, preview confidently, and keep export access synced across the same polished workflow.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap xl:justify-end">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <span className="font-semibold text-slate-950">{premium?.plan || 'Free'}</span>
                    <span className="mx-2 text-slate-300">•</span>
                    <span>{exportStatus?.usedExports ?? 0} exports used</span>
                  </div>
                  <button type="button" className="btn-primary w-full justify-center sm:w-auto" onClick={() => navigate('/app/builder')}>
                    Open builder
                  </button>
                </div>
              </div>
            </header>

            <main className="min-w-0 pb-8">
              <Outlet />
            </main>
          </div>
>>>>>>> 488aee9d81e8e5f13867ea09e09bb01bb4567075
        </div>
      </div>
    </div>
  );
};
