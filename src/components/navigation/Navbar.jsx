import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/helpers';

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // ESC key closes mobile nav
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className={cn(
      'sticky top-0 z-40 transition-all duration-300',
      scrolled
        ? 'border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-sm'
        : 'bg-white/60 backdrop-blur-lg',
    )}>
      <div className="app-shell flex h-16 items-center justify-between gap-4">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navItems.map((item) =>
            item.href ? (
              <a key={item.href} href={item.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950">
                {item.label}
              </a>
            ) : (
              <NavLink key={item.to} to={item.to}
                className={({ isActive }) => cn(
                  'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-slate-100 text-slate-950' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                )}>
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link to={isAuthenticated ? '/app/dashboard' : '/login'} className="btn-ghost">
            {isAuthenticated ? 'Open app' : 'Log in'}
          </Link>
          <Link to={isAuthenticated ? '/app/builder' : '/register'} className="btn-primary">
            Start building
          </Link>
        </div>

        {/* Hamburger */}
        <button type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
          onClick={() => setOpen(true)} aria-label="Open navigation menu" aria-expanded={open}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <button type="button"
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden animate-fade-in"
            onClick={() => setOpen(false)} aria-label="Close menu overlay" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-y-0 right-0 z-50 flex w-[85vw] max-w-[340px] flex-col bg-slate-950 p-6 text-white shadow-2xl lg:hidden animate-scale-in"
          >
            <div className="flex items-center justify-between gap-3">
              <Logo surface="dark" />
              <button type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 text-white/70 transition hover:bg-white/10"
                onClick={() => setOpen(false)} aria-label="Close menu">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="mt-8 space-y-1" aria-label="Mobile navigation">
              {navItems.map((item) =>
                item.href ? (
                  <a key={item.href} href={item.href}
                    className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                    onClick={() => setOpen(false)}>
                    {item.label}
                  </a>
                ) : (
                  <NavLink key={item.to} to={item.to}
                    className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                    onClick={() => setOpen(false)}>
                    {item.label}
                  </NavLink>
                )
              )}
            </nav>

            <div className="mt-auto space-y-3 pt-6">
              <Link to={isAuthenticated ? '/app/dashboard' : '/login'}
                className="btn-secondary w-full justify-center"
                onClick={() => setOpen(false)}>
                {isAuthenticated ? 'Open app' : 'Log in'}
              </Link>
              <Link to={isAuthenticated ? '/app/builder' : '/register'}
                className="btn-primary w-full justify-center"
                onClick={() => setOpen(false)}>
                Start building
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className={cn(
      'sticky top-0 z-40 transition-all duration-300',
      scrolled
        ? 'border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-sm'
        : 'bg-white/60 backdrop-blur-lg',
    )}>
      <div className="app-shell flex h-16 items-center justify-between gap-4">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) =>
            item.href ? (
              <a key={item.href} href={item.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950">
                {item.label}
              </a>
            ) : (
              <NavLink key={item.to} to={item.to}
                className={({ isActive }) => cn(
                  'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-slate-100 text-slate-950' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                )}>
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link to={isAuthenticated ? '/app/dashboard' : '/login'} className="btn-ghost">
            {isAuthenticated ? 'Open app' : 'Log in'}
          </Link>
          <Link to={isAuthenticated ? '/app/builder' : '/register'} className="btn-primary">
            Start building
          </Link>
        </div>

        {/* Hamburger */}
        <button type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
          onClick={() => setOpen(true)} aria-label="Open navigation menu">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <button type="button"
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden animate-fade-in"
            onClick={() => setOpen(false)} aria-label="Close menu overlay" />
          <div className="fixed inset-y-0 right-0 z-50 flex w-[85vw] max-w-[340px] flex-col bg-slate-950 p-6 text-white shadow-2xl lg:hidden animate-scale-in">
            <div className="flex items-center justify-between gap-3">
              <Logo surface="dark" />
              <button type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 text-white/70 transition hover:bg-white/10"
                onClick={() => setOpen(false)} aria-label="Close menu">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="mt-8 space-y-1">
              {navItems.map((item) =>
                item.href ? (
                  <a key={item.href} href={item.href}
                    className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                    onClick={() => setOpen(false)}>
                    {item.label}
                  </a>
                ) : (
                  <NavLink key={item.to} to={item.to}
                    className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                    onClick={() => setOpen(false)}>
                    {item.label}
                  </NavLink>
                )
              )}
            </nav>

            <div className="mt-auto space-y-3 pt-6">
              <Link to={isAuthenticated ? '/app/dashboard' : '/login'}
                className="btn-secondary w-full justify-center"
                onClick={() => setOpen(false)}>
                {isAuthenticated ? 'Open app' : 'Log in'}
              </Link>
              <Link to={isAuthenticated ? '/app/builder' : '/register'}
                className="btn-primary w-full justify-center"
                onClick={() => setOpen(false)}>
                Start building
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
