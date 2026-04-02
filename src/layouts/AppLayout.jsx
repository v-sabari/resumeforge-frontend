import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Icon } from '../components/icons/Icon';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/helpers';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/app/dashboard', icon: 'dashboard' },
  { label: 'Builder',   to: '/app/builder',   icon: 'builder'   },
  { label: 'Pricing',   to: '/pricing',        icon: 'pricing'   },
  { label: 'Profile',   to: '/app/profile',    icon: 'profile'   },
];

/* ─── Sidebar inner content (reused for both mobile drawer and desktop) ─ */
const SidebarContent = ({ collapsed, onClose, onToggleCollapse, onLogout, premium, exportStatus }) => (
  <div className="flex h-full flex-col">
    {/* Header */}
    <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4">
      <div className={cn('min-w-0 overflow-hidden transition-all duration-200', collapsed ? 'w-0 opacity-0' : 'flex-1 opacity-100')}>
        <Logo linkTo="/app/dashboard" surface="dark" />
      </div>
      {collapsed && (
        <div className="mx-auto">
          <Logo compact linkTo="/app/dashboard" surface="dark" />
        </div>
      )}
      {/* Mobile close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close sidebar"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white xl:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
      {/* Desktop collapse toggle */}
      <button
        type="button"
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white xl:flex"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={cn('h-4 w-4 transition-transform duration-200', collapsed && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>

    {/* Nav */}
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      {!collapsed && (
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Navigation</p>
      )}
      <ul className="space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                collapsed && 'justify-center px-2',
                isActive
                  ? 'bg-white text-slate-950 shadow-soft'
                  : 'text-slate-400 hover:bg-white/10 hover:text-white',
              )}
            >
              <Icon name={item.icon} className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>

    {/* Footer: plan info + logout */}
    <div className="shrink-0 border-t border-white/10 px-3 py-4 space-y-3">
      {!collapsed ? (
        <div className="rounded-xl border border-brand-400/25 bg-brand-500/10 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-300">Current plan</p>
          <p className="mt-1.5 text-sm font-semibold text-white">
            {premium?.isPremium ? 'Premium' : 'Free'}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            {premium?.isPremium
              ? 'Unlimited exports active.'
              : `${exportStatus?.remainingFreeExports ?? 0} free exports remaining.`}
          </p>
        </div>
      ) : (
        <div className="flex justify-center rounded-xl border border-brand-400/25 bg-brand-500/10 py-2">
          <span className="text-xs font-bold text-brand-300">{premium?.isPremium ? '★' : 'F'}</span>
        </div>
      )}
      <button
        type="button"
        onClick={onLogout}
        title={collapsed ? 'Log out' : undefined}
        className={cn(
          'btn-secondary w-full justify-center border-white/15 bg-white/8 text-slate-300 hover:bg-white/15 hover:text-white text-xs',
          collapsed && 'px-2',
        )}
      >
        <Icon name="lock" className="h-3.5 w-3.5 shrink-0" />
        {!collapsed && 'Log out'}
      </button>
    </div>
  </div>
);

/* ─── App Layout ──────────────────────────────────────────────────────── */
export const AppLayout = () => {
  const { logout, premium, user, exportStatus } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(() => {
    try { return localStorage.getItem('rf-sidebar-collapsed') === 'true'; } catch { return false; }
  });

  const handleLogout = useCallback(() => { logout(); navigate('/login'); }, [logout, navigate]);
  const closeMobile  = useCallback(() => setMobileOpen(false), []);
  const toggleDesktop = useCallback(() => {
    setDesktopCollapsed((v) => {
      try { localStorage.setItem('rf-sidebar-collapsed', String(!v)); } catch {}
      return !v;
    });
  }, []);

  /* Close mobile sidebar on route change */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  /* Keyboard + click-outside for mobile */
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey   = (e) => { if (e.key === 'Escape') closeMobile(); };
    const onClick  = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) closeMobile();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
      document.body.style.overflow = '';
    };
  }, [mobileOpen, closeMobile]);

  const currentPage = location.pathname
    .replace('/app/', '')
    .replace(/\//g, ' › ')
    .replace(/^./, (c) => c.toUpperCase()) || 'App';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm xl:hidden animate-fade-in"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        ref={sidebarRef}
        className={cn(
          /* Mobile: fixed drawer from left */
          'fixed inset-y-0 left-0 z-50 bg-slate-950 transition-transform duration-300 ease-out will-change-transform',
          /* Desktop: sticky column */
          'xl:relative xl:inset-auto xl:z-auto xl:translate-x-0 xl:transition-[width] xl:duration-200',
          /* Mobile open/close */
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
          /* Desktop width */
          desktopCollapsed ? 'xl:w-[68px]' : 'xl:w-64',
          /* Mobile width */
          'w-72',
        )}
      >
        <SidebarContent
          collapsed={desktopCollapsed}
          onClose={closeMobile}
          onToggleCollapse={toggleDesktop}
          onLogout={handleLogout}
          premium={premium}
          exportStatus={exportStatus}
        />
      </aside>

      {/* ── Main area ── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-soft transition hover:bg-slate-50 hover:text-slate-900 xl:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-widest text-slate-400">{currentPage}</p>
              <p className="truncate text-sm font-semibold text-slate-950 sm:text-base">{user?.name || user?.email || 'ResumeForge AI'}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex">
              <span className={cn('h-1.5 w-1.5 rounded-full', premium?.isPremium ? 'bg-emerald-400' : 'bg-slate-300')} />
              <span className="text-xs font-medium text-slate-700">{premium?.isPremium ? 'Premium' : 'Free'}</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500">{exportStatus?.usedExports ?? 0} exports</span>
            </div>
            <button
              type="button"
              className="btn-primary text-xs py-2 px-3"
              onClick={() => navigate('/app/builder')}
            >
              <Icon name="plus" className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New resume</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
