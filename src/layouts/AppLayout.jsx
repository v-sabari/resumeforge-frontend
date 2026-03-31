import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/helpers';

const navItems = [
  { label: 'Dashboard', to: '/app/dashboard' },
  { label: 'Builder', to: '/app/builder' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Profile', to: '/app/profile' },
];

export const AppLayout = () => {
  const { logout, premium, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <div className="flex items-center gap-8">
            <Logo linkTo="/app/dashboard" surface="light" />
            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl px-4 py-2 text-sm font-medium transition',
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-right md:block">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Plan</p>
              <p className="text-sm font-semibold text-slate-800">
                {premium?.isPremium ? 'Premium' : 'Free'} · {user?.name || user?.email || 'Member'}
              </p>
            </div>
            <button type="button" className="btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};