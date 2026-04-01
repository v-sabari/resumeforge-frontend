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
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsSidebarOpen(false);
    };

    const handleClickOutside = (event) => {
      if (!isSidebarOpen) return;
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  const currentSection = useMemo(() => {
    const value = location.pathname.replace('/app/', '').replace('/', ' · ') || 'App';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }, [location.pathname]);

  return (
    <div className="min-h-screen overflow-x-hidden text-slate-900">
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm xl:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

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
        </div>
      </div>
    </div>
  );
};
