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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside className="card hidden w-[290px] shrink-0 flex-col justify-between p-5 lg:flex">
          <div>
            <Logo linkTo="/app/dashboard" className="mb-8" />
            <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 p-4 shadow-inset">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Workspace</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Manage resumes, refine content with AI, and keep export access in one place.</p>
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

          <div className="space-y-4">
            <div className="rounded-[24px] bg-slate-950 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-200">Plan</p>
              <h3 className="mt-3 text-lg font-semibold">{premium?.isPremium ? 'Premium unlocked' : 'Free workspace'}</h3>
              <p className="mt-2 text-sm text-slate-300">
                {premium?.isPremium
                  ? 'Unlimited export access is active for your account.'
                  : `${exportStatus?.remainingFreeExports ?? 0} free exports remaining before upgrade.`}
              </p>
            </div>
            <button type="button" className="btn-secondary w-full justify-center" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="card mb-6 px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{location.pathname.replace('/app/', '').replace('/', ' · ') || 'App'}</p>
                <h1 className="mt-1 text-lg font-semibold tracking-tight text-slate-950">{user?.name || user?.email || 'ResumeForge AI'}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-950">{premium?.plan || 'Free'}</span>
                  <span className="mx-2 text-slate-300">•</span>
                  <span>{exportStatus?.usedExports ?? 0} exports used</span>
                </div>
                <button type="button" className="btn-primary lg:hidden" onClick={() => navigate('/app/builder')}>
                  Open builder
                </button>
              </div>
            </div>
          </header>

          <Outlet />
        </div>
      </div>
    </div>
  );
};
