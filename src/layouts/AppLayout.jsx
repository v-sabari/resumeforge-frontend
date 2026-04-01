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

  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => { setIsSidebarOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-slate-50/80">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <button type="button" aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}>
          {/* Sidebar header */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
            <Logo linkTo="/app/dashboard" surface="dark" />
            <button type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 text-white/60 transition hover:bg-white/10 lg:hidden"
              onClick={() => setIsSidebarOpen(false)} aria-label="Close menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-widest text-slate-500">Menu</p>
            <div className="space-y-0.5">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:bg-white/10 hover:text-white',
                  )}>
                  <Icon name={item.icon} className="h-4 w-4 shrink-0" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Plan info */}
          <div className="border-t border-white/10 p-4 space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-brand-300">Current plan</p>
              <p className="mt-1.5 text-sm font-semibold text-white">
                {premium?.isPremium ? '✦ Premium' : 'Free plan'}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {premium?.isPremium
                  ? 'Unlimited export access active.'
                  : `${exportStatus?.remainingFreeExports ?? 0} free exports remaining.`}
              </p>
            </div>
            <button type="button" className="btn-secondary w-full justify-center border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white text-xs py-2.5" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-slate-200/70 bg-white/90 px-4 backdrop-blur-xl sm:px-6">
            <div className="flex items-center gap-3">
              <button type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 lg:hidden"
                onClick={() => setIsSidebarOpen(true)} aria-label="Open menu">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
              <div className="min-w-0">
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
              <button type="button" className="btn-primary py-2 text-xs"
                onClick={() => navigate('/app/builder')}>
                <Icon name="builder" className="h-3.5 w-3.5" />
                New resume
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 pb-8 sm:p-6 sm:pb-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
