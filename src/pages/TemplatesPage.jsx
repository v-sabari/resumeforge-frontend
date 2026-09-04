import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RESUME_TEMPLATES, TEMPLATE_CATEGORIES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const TemplateCard = ({ template, isPremium, onSelect }) => {
  const locked = template.isPremium && !isPremium;
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-brand-200">
      {/* Template preview placeholder */}
      <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-surface-50 to-surface-100">
        <div className="text-center px-4">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-white shadow-sm">
            <svg className="h-8 w-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-ink-700">{template.label}</p>
        </div>
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>
              Premium
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-ink-400 leading-relaxed mb-3 flex-1">{template.description}</p>
        <button
          type="button"
          onClick={() => onSelect(template)}
          className="w-full rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-100">
          {locked ? 'Upgrade to use' : 'Use this template'}
        </button>
      </div>
    </div>
  );
};

export const TemplatesPage = () => {
  const { premium } = useAuth();
  const navigate = useNavigate();
  const isPremium = premium?.isPremium;
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    let list = RESUME_TEMPLATES;
    if (activeCategory !== 'all') {
      list = list.filter((t) => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.label.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return list;
  }, [activeCategory, search]);

  const freeCount = RESUME_TEMPLATES.filter((t) => !t.isPremium).length;
  const premiumCount = RESUME_TEMPLATES.filter((t) => t.isPremium).length;

  const handleSelect = (template) => {
    if (template.isPremium && !isPremium) {
      navigate('/pricing');
      return;
    }
    // Store pending template so the editor picks it up on next load
    try { localStorage.setItem('pendingTemplate', template.id); } catch { /* ignore */ }
    navigate('/app/dashboard');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-3">Resume Templates</h1>
        <p className="text-ink-500 max-w-2xl mx-auto">
          Choose from {RESUME_TEMPLATES.length} professionally designed, ATS-optimised templates.
          {' '}{freeCount} free templates to get started, or upgrade to Premium for all {premiumCount} templates.
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-6 mb-8">
        <div className="text-center">
          <p className="text-2xl font-bold text-brand-600">{freeCount}</p>
          <p className="text-xs text-ink-400">Free templates</p>
        </div>
        <div className="h-10 w-px bg-surface-200" />
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-600">{premiumCount}</p>
          <p className="text-xs text-ink-400">Premium templates</p>
        </div>
        <div className="h-10 w-px bg-surface-200" />
        <div className="text-center">
          <p className="text-2xl font-bold text-ink-700">{TEMPLATE_CATEGORIES.length}</p>
          <p className="text-xs text-ink-400">Categories</p>
        </div>
      </div>

      {/* Search */}
      <div className="mx-auto max-w-md mb-8">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full rounded-xl border border-surface-300 bg-white py-2.5 pl-10 pr-4 text-sm text-ink-700 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
            activeCategory === 'all'
              ? 'bg-brand-600 text-white'
              : 'bg-surface-100 text-ink-500 hover:bg-surface-200'
          }`}>
          All ({RESUME_TEMPLATES.length})
        </button>
        {TEMPLATE_CATEGORIES.map((cat) => {
          const count = RESUME_TEMPLATES.filter((t) => t.category === cat.id).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeCategory === cat.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-surface-100 text-ink-500 hover:bg-surface-200'
              }`}>
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Template grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-ink-400 text-sm">No templates match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((t) => (
            <TemplateCard key={t.id} template={t} isPremium={isPremium} onSelect={handleSelect} />
          ))}
        </div>
      )}

      {/* CTA */}
      {!isPremium && (
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-ink-900 mb-2">Unlock all {RESUME_TEMPLATES.length} templates</h2>
          <p className="text-ink-500 mb-6">Get Premium for lifetime access to all templates, unlimited exports, and AI features.</p>
          <Link to="/pricing" className="inline-flex items-center rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
            Upgrade to Premium
          </Link>
        </div>
      )}
    </div>
  );
};
