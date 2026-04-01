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
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await getResumes();
      setResumes(Array.isArray(list) ? list : []);
      await Promise.all([refreshExportStatus(), refreshPremiumStatus()]);
    } catch (err) {
      setError(formatApiError(err, 'Could not load your resumes.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const resume = await createResume({ title: `${user?.name || 'New'} Resume`, ...defaultResume });
      navigate(`/app/builder/${resume.id || resume._id}`);
    } catch (err) {
      setError(formatApiError(err, 'Could not create a new resume.'));
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteResume(id);
      await loadData();
    } catch (err) {
      setError(formatApiError(err, 'Could not delete the resume.'));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${user?.name || 'there'} 👋`}
        description="Manage your resumes, track export access, and jump back into editing."
        actions={
          <>
            <button type="button" className="btn-primary" onClick={handleCreate} disabled={creating}>
              <Icon name="plus" className="h-4 w-4" />
              {creating ? 'Creating...' : 'New resume'}
            </button>
            <Link to="/pricing" className="btn-secondary">Upgrade plan</Link>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Saved resumes" value={resumes.length} helper="Version your resume for each role" />
        <StatCard label="Exports used" value={exportStatus?.usedExports ?? 0} helper={`${exportStatus?.remainingFreeExports ?? 0} free remaining`} />
        <StatCard label="Ad unlock" value={exportStatus?.adCompleted ? 'Completed' : 'Pending'} helper="Free-plan export unlock state" />
        <StatCard label="Plan" value={premium?.isPremium ? 'Premium ✦' : 'Free'} helper={premium?.isPremium ? 'Unlimited exports active' : 'Upgrade for more'} />
      </div>

      {/* Overview banner */}
      <div className="card overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="p-6 sm:p-7">
            <p className="eyebrow">Workspace overview</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Keep every application polished and ready.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your builder, preview, payment flow, and resume history stay connected so you can iterate quickly without breaking backend-driven logic.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" className="btn-primary text-sm" onClick={handleCreate} disabled={creating}>
                Start from template
              </button>
              <Link to="/app/builder" className="btn-secondary text-sm">Open blank workspace</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 bg-slate-50/70 p-6 sm:p-7 lg:border-l lg:border-t-0">
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Plan</p>
              <p className="mt-2 text-base font-semibold text-slate-950">{premium?.isPremium ? 'Premium' : 'Free'}</p>
              <p className="mt-1 text-xs text-slate-500">{premium?.message || 'Synced from backend'}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Export state</p>
              <p className="mt-2 text-base font-semibold text-slate-950">{exportStatus?.canExport ? 'Ready' : 'Restricted'}</p>
              <p className="mt-1 text-xs text-slate-500">{exportStatus?.message || 'Check before download'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium upsell */}
      {!premium?.isPremium && (
        <div className="flex flex-col gap-4 rounded-2xl border border-brand-900/30 bg-gradient-to-br from-slate-950 to-slate-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-300">Premium unlock</p>
            <h2 className="mt-1.5 text-lg font-semibold">Remove export limits and build without friction.</h2>
            <p className="mt-1 text-sm text-slate-400">One-time payment of ₹99 for unlimited exports.</p>
          </div>
          <Link to="/pricing" className="btn-primary shrink-0">View Premium plan</Link>
        </div>
      )}

      <Alert variant="error">{error}</Alert>

      {/* Resume list */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Your resumes</h2>
          {resumes.length > 0 && (
            <button type="button" className="btn-ghost text-xs" onClick={handleCreate} disabled={creating}>
              <Icon name="plus" className="h-3.5 w-3.5" /> New
            </button>
          )}
        </div>

        {loading ? (
          <div className="card flex items-center justify-center py-12">
            <Loader label="Loading your resumes..." />
          </div>
        ) : resumes.length ? (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <ResumeListCard key={resume.id || resume._id} resume={resume} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No resumes yet"
            description="Create your first resume to start editing in the workspace, use AI tools, and preview your PDF layout live."
            action={
              <button type="button" className="btn-primary" onClick={handleCreate} disabled={creating}>
                <Icon name="plus" className="h-4 w-4" />
                Create first resume
              </button>
            }
          />
        )}
      </div>
    </div>
  );
};
