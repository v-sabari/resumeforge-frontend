import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { StatCard } from '../components/common/StatCard';
import { EmptyState } from '../components/common/EmptyState';
import { Loader } from '../components/common/Loader';
import { Alert } from '../components/common/Alert';
import { ResumeListCard } from '../components/dashboard/ResumeListCard';
import { useAuth } from '../context/AuthContext';
import { createResume, deleteResume, getResumes } from '../services/resumeService';
import { defaultResume } from '../utils/constants';
import { formatApiError } from '../utils/helpers';
import { Icon } from '../components/icons/Icon';

export const DashboardPage = () => {
  const { user, premium, exportStatus, refreshExportStatus, refreshPremiumStatus } = useAuth();
  const navigate = useNavigate();
  const [resumes,  setResumes]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [creating, setCreating] = useState(false);
  const [error,    setError]    = useState('');

  const loadData = async () => {
    setLoading(true); setError('');
    try {
      const list = await getResumes();
      setResumes(Array.isArray(list) ? list : []);
      await Promise.all([refreshExportStatus(), refreshPremiumStatus()]);
    } catch (err) {
      setError(formatApiError(err, 'Could not load your resumes.'));
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const resume = await createResume({ title: `${user?.name || 'New'} Resume`, ...defaultResume });
      navigate(`/app/builder/${resume.id || resume._id}`);
    } catch (err) {
      setError(formatApiError(err, 'Could not create a new resume.'));
    } finally { setCreating(false); }
  };

  const handleDelete = async (id) => {
    try { await deleteResume(id); await loadData(); }
    catch (err) { setError(formatApiError(err, 'Could not delete the resume.')); }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${user?.name || 'there'}`}
        description="Manage resume versions, track export access, and jump back into editing from one clean workspace."
        actions={
          <>
            <button type="button" className="btn-primary" onClick={handleCreate} disabled={creating}>
              <Icon name="plus" className="h-4 w-4" />
              {creating ? 'Creating…' : 'New resume'}
            </button>
            <Link to="/pricing" className="btn-secondary">Upgrade plan</Link>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Saved resumes"  value={resumes.length}                              helper="Resume versions in your workspace" />
        <StatCard label="Exports used"   value={exportStatus?.usedExports ?? 0}              helper={`${exportStatus?.remainingFreeExports ?? 0} free exports remaining`} />
        <StatCard label="Ad unlock"      value={exportStatus?.adCompleted ? 'Done' : 'Pending'} helper="Free-plan export gating state" />
        <StatCard label="Plan"           value={premium?.isPremium ? 'Premium ✦' : 'Free'}   helper={premium?.isPremium ? 'Unlimited exports active' : 'Upgrade anytime'} />
      </div>

      {/* Overview card */}
      <div className="card overflow-hidden">
        <div className="grid xl:grid-cols-[1.1fr_0.9fr]">
          <div className="p-6 xl:border-r xl:border-slate-200">
            <p className="kicker mb-2">Workspace overview</p>
            <h2 className="text-xl font-semibold text-slate-950">Keep every application polished and export-ready.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your builder, preview, payment flow, and resume history stay connected so you can iterate quickly
              without changing backend-driven logic.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" className="btn-primary text-sm" onClick={handleCreate} disabled={creating}>
                Start from template
              </button>
              <Link to="/app/builder" className="btn-secondary text-sm">Open blank workspace</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 bg-slate-50/70 p-5 xl:content-start">
            <div className="rounded-xl bg-white p-4 shadow-soft border border-slate-100">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Plan</p>
              <p className="mt-2 text-base font-semibold text-slate-950">{premium?.isPremium ? 'Premium' : 'Free'}</p>
              <p className="mt-1 text-xs text-slate-500">{premium?.message || 'Synced from backend'}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-soft border border-slate-100">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Export state</p>
              <p className="mt-2 text-base font-semibold text-slate-950">{exportStatus?.canExport ? 'Ready' : 'Restricted'}</p>
              <p className="mt-1 text-xs text-slate-500">{exportStatus?.message || 'Check before exporting'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium upsell */}
      {!premium?.isPremium && (
        <div className="card-premium flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-300 mb-1">Upgrade</p>
            <h2 className="text-lg font-semibold text-white">Remove export limits and build without friction.</h2>
            <p className="mt-1 text-sm text-slate-400">One-time ₹99 payment. Same app, same data, unlimited exports.</p>
          </div>
          <Link to="/pricing" className="btn-primary shrink-0 text-sm">View Premium plan</Link>
        </div>
      )}

      <Alert variant="error">{error}</Alert>

      {/* Resume list */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Your resumes</h2>
          {resumes.length > 0 && (
            <button type="button" className="btn-ghost text-xs gap-1" onClick={handleCreate} disabled={creating}>
              <Icon name="plus" className="h-3.5 w-3.5" /> New
            </button>
          )}
        </div>
        {loading ? (
          <div className="card flex items-center justify-center py-12">
            <Loader label="Loading resumes…" />
          </div>
        ) : resumes.length ? (
          <div className="space-y-3">
            {resumes.map((r) => (
              <ResumeListCard key={r.id || r._id} resume={r} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No resumes yet"
            description="Create your first resume to start editing, use AI tools, and preview the final PDF layout live."
            action={
              <button type="button" className="btn-primary" onClick={handleCreate} disabled={creating}>
                <Icon name="plus" className="h-4 w-4" /> Create first resume
              </button>
            }
          />
        )}
      </div>
    </div>
  );
};
