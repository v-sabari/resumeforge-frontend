import { Link, NavLink } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/helpers';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const handleClickOutside = (event) => {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = open ? 'hidden' : '';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="layout-wrapper flex items-center justify-between gap-4 py-4">
        <Logo />

        <nav className="hidden items-center gap-8 xl:flex">
          {navItems.map((item) => (
            item.href ? (
              <a key={item.href} href={item.href} className="text-sm font-medium text-slate-600 transition duration-300 hover:text-slate-950">
                {item.label}
              </a>
            ) : (
              <NavLink key={item.to} to={item.to} className="text-sm font-medium text-slate-600 transition duration-300 hover:text-slate-950">
                {item.label}
              </NavLink>
            )
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <Link to={isAuthenticated ? '/app/dashboard' : '/login'} className="btn-secondary">
            {isAuthenticated ? 'Open app' : 'Log in'}
          </Link>
          <NavLink to={isAuthenticated ? '/app/builder' : '/register'} className={({ isActive }) => cn('btn-primary', isActive && 'bg-slate-900')}>
            Start building
          </NavLink>
        </div>

        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition duration-300 hover:bg-slate-50 xl:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {open ? (
        <>
          <button type="button" className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm xl:hidden" onClick={() => setOpen(false)} aria-label="Close menu overlay" />
          <div ref={panelRef} className="fixed inset-y-0 right-0 z-50 flex w-[min(88vw,360px)] flex-col border-l border-white/10 bg-slate-950 p-5 text-white shadow-2xl transition-transform duration-300 ease-out xl:hidden">
            <div className="flex items-center justify-between gap-3">
              <Logo surface="dark" />
              <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition duration-300 hover:bg-white/10" onClick={() => setOpen(false)} aria-label="Close menu">
                <span className="text-xl leading-none">×</span>
              </button>
            </div>
            <nav className="mt-8 space-y-2">
              {navItems.map((item) => (
                item.href ? (
                  <a key={item.href} href={item.href} className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-200 transition duration-300 hover:bg-white/10" onClick={() => setOpen(false)}>
                    {item.label}
                  </a>
                ) : (
                  <NavLink key={item.to} to={item.to} className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-200 transition duration-300 hover:bg-white/10" onClick={() => setOpen(false)}>
                    {item.label}
                  </NavLink>
                )
              ))}
            </nav>
            <div className="mt-auto grid gap-3 pt-6">
              <Link to={isAuthenticated ? '/app/dashboard' : '/login'} className="btn-secondary w-full justify-center" onClick={() => setOpen(false)}>
                {isAuthenticated ? 'Open app' : 'Log in'}
              </Link>
              <Link to={isAuthenticated ? '/app/builder' : '/register'} className="btn-primary w-full justify-center" onClick={() => setOpen(false)}>
                Start building
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
};
