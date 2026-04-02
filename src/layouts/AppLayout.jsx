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

  // Mobile: sidebar drawer open/close
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Desktop: sidebar collapsed (icons only) or expanded
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  // Close mobile drawer on route change
  useEffect(() => { setIsMobileOpen(false); }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  // ESC key closes mobile sidebar
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setIsMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const sidebarW = isCollapsed ? 'lg:w-[72px]' : 'lg:w-64';

  return (
    <div className="min-h-screen bg-slate-50/80">

      {/* ── Mobile overlay ─────────────────────────────── */}
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className="flex min-h-screen">

        {/* ── Sidebar ────────────────────────────────────── */}
        <aside
          className={cn(
            // Mobile: fixed drawer sliding from left
            'fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-950 transition-all duration-300 ease-out',
            // Mobile width always full
            'w-[min(80vw,280px)]',
            // Mobile open/close via transform
            isMobileOpen ? 'translate-x-0' : '-translate-x-full',
            // Desktop: sticky, always visible, width changes on collapse
            'lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
            sidebarW,
          )}
        >
          {/* Sidebar header */}
          <div className={cn(
            'flex items-center border-b border-white/10 px-4 py-4',
            isCollapsed ? 'lg:justify-center' : 'justify-between gap-3',
          )}>
            <Logo
              compact={isCollapsed}
              linkTo="/app/dashboard"
              surface="dark"
              className={cn(isCollapsed && 'lg:mx-auto')}
            />

            {/* Desktop collapse toggle */}
            <button
              type="button"
              className={cn(
                'hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/20 text-white/60 transition hover:bg-white/10 lg:flex',
                isCollapsed && 'lg:hidden',
              )}
              onClick={() => setIsCollapsed(true)}
              aria-label="Collapse sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Mobile close button */}
            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/20 text-white/60 transition hover:bg-white/10 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Collapsed expand button (desktop only) */}
          {isCollapsed && (
            <div className="hidden lg:flex justify-center border-b border-white/10 py-3">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 text-white/60 transition hover:bg-white/10"
                onClick={() => setIsCollapsed(false)}
                aria-label="Expand sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="App navigation">
            {!isCollapsed && (
              <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-widest text-slate-500">Menu</p>
            )}
            <div className="space-y-0.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={({ isActive }) => cn(
                    'flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                    isCollapsed ? 'lg:justify-center lg:px-2' : 'gap-3',
                    isActive
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:bg-white/10 hover:text-white',
                  )}
                >
                  <Icon name={item.icon} className="h-4 w-4 shrink-0" />
                  <span className={cn('truncate', isCollapsed && 'lg:hidden')}>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Plan info + logout */}
          <div className="border-t border-white/10 p-3 space-y-2">
            {!isCollapsed && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-[9px] font-bold uppercase tracking-widest text-brand-300">Current plan</p>
                <p className="mt-1.5 text-sm font-semibold text-white">
                  {premium?.isPremium ? '✦ Premium' : 'Free plan'}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {premium?.isPremium
                    ? 'Unlimited export access active.'
                    : `${exportStatus?.remainingFreeExports ?? 0} free exports remaining.`}
                </p>
              </div>
            )}
            <button
              type="button"
              className={cn(
                'btn-secondary w-full border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white text-xs py-2.5',
                isCollapsed ? 'lg:justify-center lg:px-2' : 'justify-center',
              )}
              onClick={handleLogout}
            >
              <Icon name="lock" className="h-3.5 w-3.5 shrink-0" />
              <span className={cn(isCollapsed && 'lg:hidden')}>Log out</span>
            </button>
          </div>
        </aside>

        {/* ── Main content ───────────────────────────────── */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-slate-200/70 bg-white/90 px-4 backdrop-blur-xl sm:px-6">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 lg:hidden"
                onClick={() => setIsMobileOpen(true)}
                aria-label="Open navigation menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>

              <div className="min-w-0">
                {/* Use <p> tags, not headings, to avoid skipping h1/h2/h3 order */}
                <p className="truncate text-sm font-semibold text-slate-950">
                  {user?.name || user?.email || 'ResumeForge AI'}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {location.pathname.replace('/app/', '').replace('/', ' › ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs sm:flex">
                <span className={cn('h-2 w-2 rounded-full', premium?.isPremium ? 'bg-emerald-400' : 'bg-slate-300')} />
                <span className="font-medium text-slate-700">{premium?.isPremium ? 'Premium' : 'Free'}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600">{exportStatus?.usedExports ?? 0} exports</span>
              </div>
              <button
                type="button"
                className="btn-primary py-2 text-xs"
                onClick={() => navigate('/app/builder')}
              >
                <Icon name="builder" className="h-3.5 w-3.5" />
                New resume
              </button>
            </div>
          </header>

          {/* Page content — max-w-7xl prevents content stretching on ultrawide screens */}
          <main className="flex-1 p-4 pb-8 sm:p-6 sm:pb-10">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
