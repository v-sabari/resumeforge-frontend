import { Link } from 'react-router-dom';
import { SectionBadge } from '../common/SectionBadge';

export const HeroSection = () => (
  <section className="bg-hero-grid">
    <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
      <div>
        <SectionBadge>AI resume builder</SectionBadge>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
          Build a standout resume with startup-grade polish in minutes.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          ResumeForge AI combines intuitive editing, real-time preview, AI writing assistance, and monetization-ready export flows so candidates can go from draft to interview-ready faster.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/register" className="btn-primary">
            Create your resume
          </Link>
          <a href="#features" className="btn-secondary">
            See how it works
          </a>
        </div>
        <div className="mt-8 flex flex-wrap gap-8 text-sm text-slate-500">
          <div>
            <p className="text-2xl font-semibold text-slate-950">20k+</p>
            <p>Resumes generated</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-950">4.9/5</p>
            <p>Average user rating</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-slate-950">2x faster</p>
            <p>Application prep time</p>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="card overflow-hidden p-5">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Live preview</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">Aarav Mehta</h3>
                <p className="text-sm text-slate-500">Senior Product Designer</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">ATS Ready</div>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">Summary improved by AI</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Crafted concise, metrics-driven positioning for senior product design roles across SaaS, fintech, and growth-stage teams.
                </p>
                <div className="mt-4 rounded-2xl bg-brand-50 p-3 text-sm text-brand-700">Suggested action: Add measurable impact to your last role</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Export gate</p>
                <h3 className="mt-2 text-lg font-semibold">1 free export via ad unlock</h3>
                <p className="mt-2 text-sm text-slate-300">Upgrade to Premium for unlimited exports, no watermark, and premium templates.</p>
                <button type="button" className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950">
                  Upgrade now
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-6 -top-6 hidden h-28 w-28 rounded-full bg-brand-200/40 blur-3xl sm:block" />
      </div>
    </div>
  </section>
);
