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

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const resume = await createResume({
        title: `${user?.name || 'New'} Resume`,
        ...defaultResume,
      });
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
    <div className="space-y-6 pb-8 sm:space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${user?.name || 'there'}`}
        description="Manage resume versions, review export access, and jump back into editing with cleaner hierarchy and tighter alignment on every screen size."
        actions={
          <>
            <button type="button" className="btn-primary" onClick={handleCreate} disabled={creating}>
              <Icon name="plus" className="h-4 w-4" />
              {creating ? 'Creating...' : 'Create new resume'}
            </button>
            <Link to="/pricing" className="btn-secondary">Upgrade</Link>
          </>
        }
      />

      <section className="card overflow-hidden p-0">
        <div className="grid gap-0 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
          <div className="border-b border-slate-200 px-5 py-6 sm:px-6 xl:border-b-0 xl:border-r xl:px-8 xl:py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Workspace overview</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Keep every application polished and ready to export.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Your builder, preview, payment flow, and resume history stay connected so you can iterate quickly without changing backend-driven logic.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button type="button" className="btn-primary" onClick={handleCreate} disabled={creating}>
                Start from template
              </button>
              <Link to="/app/builder" className="btn-secondary">Open blank workspace</Link>
            </div>
          </div>

          <div className="bg-slate-50/80 px-5 py-6 sm:px-6 xl:px-8 xl:py-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <div className="flex min-h-[176px] flex-col rounded-[24px] bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Current plan</p>
                <p className="mt-4 text-2xl font-semibold text-slate-950">{premium?.isPremium ? 'Premium' : 'Free'}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{premium?.message || 'Account plan synced from backend.'}</p>
              </div>

              <div className="flex min-h-[176px] flex-col rounded-[24px] bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Export state</p>
                <p className="mt-4 text-2xl font-semibold text-slate-950">{exportStatus?.canExport ? 'Ready' : 'Restricted'}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{exportStatus?.message || 'Check export state before download.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Saved resumes" value={resumes.length} helper="Version your resume for multiple roles." />
        <StatCard label="Exports used" value={exportStatus?.usedExports ?? 0} helper={`${exportStatus?.remainingFreeExports ?? 0} free exports remaining`} />
        <StatCard label="Ad unlock" value={exportStatus?.adCompleted ? 'Completed' : 'Pending'} helper="Free-plan export state from backend." />
        <StatCard label="Plan status" value={premium?.isPremium ? 'Premium' : 'Free'} helper={premium?.isPremium ? 'Unlimited exports enabled.' : 'Upgrade whenever you need more.'} />
      </div>

      {!premium?.isPremium ? (
        <div className="card flex flex-col gap-5 bg-slate-950 px-5 py-6 text-white sm:px-6 xl:flex-row xl:items-center xl:justify-between xl:px-8">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-200">Premium unlock</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
              Remove export friction and keep building without limits.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
              Upgrade once and keep the same app flow, data, and backend logic while unlocking a smoother premium experience.
            </p>
          </div>
          <Link to="/pricing" className="btn-primary xl:shrink-0">View premium plan</Link>
        </div>
      ) : null}

      <Alert variant="error">{error}</Alert>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Recent resumes</h2>
        </div>

        {loading ? (
          <div className="card p-6">
            <Loader label="Loading your resumes..." />
          </div>
        ) : resumes.length ? (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <ResumeListCard
                key={resume.id || resume._id}
                resume={resume}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No resumes yet"
            description="Create your first resume to start editing, use the AI tools, and preview your final PDF layout live."
            action={
              <button type="button" className="btn-primary" onClick={handleCreate}>
                Create your first resume
              </button>
            }
          />
        )}
      </section>
    </div>
  );
};
