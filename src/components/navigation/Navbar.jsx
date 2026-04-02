import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/helpers';

const NAV_ITEMS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing',  href: '#pricing'  },
  { label: 'FAQ',      href: '#faq'      },
  { label: 'About',    to:   '/about'    },
  { label: 'Contact',  to:   '/contact'  },
];

export const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey   = (e) => { if (e.key === 'Escape') setOpen(false); };
    const onClick  = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className={cn(
      'sticky top-0 z-40 w-full transition-all duration-200',
      scrolled
        ? 'border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-soft'
        : 'bg-white/60 backdrop-blur-md',
    )}>
      <div className="page-container flex h-16 items-center justify-between gap-4">
        <Logo />

        {/* Desktop nav links */}
        <nav className="hidden items-center xl:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) =>
            item.href ? (
              <a key={item.href} href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
                {item.label}
              </a>
            ) : (
              <NavLink key={item.to} to={item.to}
                className={({ isActive }) => cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive ? 'bg-slate-100 text-slate-950' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                )}>
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 xl:flex">
          <Link to={isAuthenticated ? '/app/dashboard' : '/login'} className="btn-ghost text-sm">
            {isAuthenticated ? 'Open app' : 'Log in'}
          </Link>
          <Link to={isAuthenticated ? '/app/builder' : '/register'} className="btn-primary text-sm">
            {isAuthenticated ? 'Open builder' : 'Get started'}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Open navigation"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-soft transition hover:bg-slate-50 xl:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {/* Mobile backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm xl:hidden animate-fade-in" onClick={() => setOpen(false)} aria-hidden="true" />
      )}

      {/* Mobile drawer */}
      {open && (
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-y-0 right-0 z-50 flex w-80 flex-col bg-slate-950 shadow-2xl xl:hidden animate-slide-in-right"
        >
          {/* Drawer header */}
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
            <Logo surface="dark" />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer nav */}
          <nav className="flex-1 overflow-y-auto px-4 py-4" aria-label="Mobile navigation">
            <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Menu</p>
            <ul className="space-y-0.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href || item.to}>
                  {item.href ? (
                    <a href={item.href}
                      className="flex rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                      onClick={() => setOpen(false)}>
                      {item.label}
                    </a>
                  ) : (
                    <NavLink to={item.to}
                      className="flex rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                      onClick={() => setOpen(false)}>
                      {item.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Drawer footer CTAs */}
          <div className="border-t border-white/10 px-4 py-5 space-y-2.5">
            <Link to={isAuthenticated ? '/app/dashboard' : '/login'}
              className="btn-secondary w-full justify-center"
              onClick={() => setOpen(false)}>
              {isAuthenticated ? 'Open app' : 'Log in'}
            </Link>
            <Link to={isAuthenticated ? '/app/builder' : '/register'}
              className="btn-primary w-full justify-center"
              onClick={() => setOpen(false)}>
              {isAuthenticated ? 'Open builder' : 'Get started free'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
