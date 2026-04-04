import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { Icon } from '../icons/Icon';

const navItems = [
  { to: '/app/dashboard', icon: 'grid',      label: 'Dashboard' },
  { to: '/app/builder',   icon: 'text',      label: 'New Resume' },
  { to: '/app/profile',   icon: 'user',      label: 'Profile'   },
  { to: '/pricing',       icon: 'crown',     label: 'Upgrade'   },
];

export const AppSidebar = () => {
  const { user, premium, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-white border-r border-surface-200 h-screen sticky top-0 overflow-y-auto">
      <div className="flex h-16 items-center px-5 border-b border-surface-200">
        <Logo size="sm" linkTo="/app/dashboard" />
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/app/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
               ${isActive
                 ? 'bg-brand-600 text-white shadow-sm'
                 : 'text-ink-500 hover:bg-surface-100 hover:text-ink-950'}`}>
            <Icon name={icon} className="h-4 w-4 shrink-0" />
            {label}
            {label === 'Upgrade' && !premium?.isPremium && (
              <span className="ml-auto premium-badge text-[10px] px-1.5 py-0.5">PRO</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User panel */}
      <div className="p-3 border-t border-surface-200 space-y-2">
        {premium?.isPremium ? (
          <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 p-3">
            <div className="flex items-center gap-2">
              <Icon name="crown" className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold text-amber-700">Premium Active</span>
            </div>
            <p className="mt-0.5 text-xs text-amber-600">Unlimited exports</p>
          </div>
        ) : (
          <NavLink to="/pricing"
            className="flex items-center gap-2 rounded-xl bg-brand-50 border border-brand-200/60 p-3 hover:bg-brand-100 transition-colors">
            <Icon name="zap" className="h-4 w-4 text-brand-600" />
            <div>
              <p className="text-xs font-semibold text-brand-700">Upgrade to Pro</p>
              <p className="text-xs text-brand-500">Unlimited exports</p>
            </div>
          </NavLink>
        )}

        <div className="flex items-center gap-2 px-3 py-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink-950 truncate">{user?.name}</p>
            <p className="text-xs text-ink-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink-400 hover:text-danger-600 hover:bg-danger-50 transition-colors">
          <Icon name="logout" className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
};
