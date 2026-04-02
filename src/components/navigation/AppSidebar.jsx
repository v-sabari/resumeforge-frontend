import { NavLink } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Icon } from '../icons/Icon';
import { cn } from '../../utils/helpers';

export const AppSidebar = ({
  navItems,
  isOpen,
  isDesktopCollapsed,
  onClose,
  onToggleDesktop,
  premium,
  exportStatus,
  onLogout,
}) => (
  <aside
    className={cn(
      'surface-dark fixed inset-y-4 left-4 z-50 flex h-[calc(100vh-2rem)] flex-col justify-between overflow-hidden transition-all duration-300 ease-out xl:sticky xl:top-4 xl:z-20',
      isOpen ? 'translate-x-0' : '-translate-x-[115%] xl:translate-x-0',
      isDesktopCollapsed ? 'w-[96px]' : 'w-[min(88vw,320px)] xl:w-[304px]',
    )}
  >
    <div className="flex h-full flex-col gap-6 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <Logo compact={isDesktopCollapsed} linkTo="/app/dashboard" surface="dark" className={cn(isDesktopCollapsed && 'mx-auto')} />

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition duration-300 hover:bg-white/10 xl:inline-flex"
            onClick={onToggleDesktop}
            aria-label={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon name="arrowRight" className={cn('h-4 w-4 transition-transform duration-300', isDesktopCollapsed && 'rotate-180')} />
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition duration-300 hover:bg-white/10 xl:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>
      </div>

      <div className={cn('rounded-[24px] border border-white/10 bg-white/5 p-4 transition-all duration-300', isDesktopCollapsed && 'p-3 text-center')}>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-200">Workspace</p>
        {!isDesktopCollapsed ? (
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Build, preview, and export resumes inside a cleaner premium workspace without changing your working app logic.
          </p>
        ) : (
          <p className="mt-3 text-xs leading-6 text-slate-300">Premium UI</p>
        )}
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.label}
            className={({ isActive }) =>
              cn(
                'flex min-h-12 items-center rounded-2xl px-4 py-3 text-sm font-semibold transition duration-300 ease-out',
                isDesktopCollapsed ? 'justify-center px-3' : 'gap-3',
                isActive
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white',
              )
            }
          >
            <Icon name={item.icon} className="h-5 w-5 shrink-0" />
            {!isDesktopCollapsed ? <span>{item.label}</span> : null}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className={cn('rounded-[24px] border border-brand-400/20 bg-brand-500/10 p-4 transition-all duration-300', isDesktopCollapsed && 'p-3 text-center')}>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-200">Plan</p>
          <h3 className={cn('mt-3 font-semibold text-white', isDesktopCollapsed ? 'text-sm' : 'text-lg')}>
            {premium?.isPremium ? 'Premium unlocked' : 'Free workspace'}
          </h3>
          {!isDesktopCollapsed ? (
            <p className="mt-2 text-sm leading-7 text-slate-300">
              {premium?.isPremium
                ? 'Unlimited exports are active on your account.'
                : `${exportStatus?.remainingFreeExports ?? 0} free exports remaining before upgrade.`}
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-300">{premium?.isPremium ? 'Unlimited' : `${exportStatus?.remainingFreeExports ?? 0} left`}</p>
          )}
        </div>

        <button type="button" className="btn-secondary w-full justify-center" onClick={onLogout}>
          <Icon name="lock" className="h-4 w-4" />
          {!isDesktopCollapsed ? 'Log out' : ''}
        </button>
      </div>
    </div>
  </aside>
);
