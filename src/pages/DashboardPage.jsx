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
      const response = await getResumes();
      const list = response?.resumes || response?.data || response || [];
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
      const response = await createResume({
        title: `${user?.name || 'New'} Resume`,
        ...defaultResume,
      });
      const resume = response?.resume || response?.data || response;
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
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${user?.name || 'there'}`}
        description="Manage resumes, view export usage, and see your current monetization state at a glance."
        actions={
          <>
            <button type="button" className="btn-primary" onClick={handleCreate} disabled={creating}>
              {creating ? 'Creating...' : 'Create new resume'}
            </button>
            <Link to="/pricing" className="btn-secondary">Upgrade</Link>
          </>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Plan status" value={premium?.isPremium ? 'Premium' : 'Free'} helper={premium?.isPremium ? 'Unlimited exports active' : 'Ad unlock required for first export'} />
        <StatCard label="Saved resumes" value={resumes.length} helper="Multiple resume versions supported" />
        <StatCard label="Exports used" value={exportStatus?.exportCount ?? exportStatus?.used ?? 0} helper={exportStatus?.message || 'Pulled from export status endpoint'} />
        <StatCard label="Free export unlocked" value={exportStatus?.adUnlocked ? 'Yes' : 'No'} helper="Updated from backend export state" />
      </div>

      {!premium?.isPremium ? (
        <div className="card flex flex-col gap-4 bg-slate-950 p-6 text-white lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-200">Premium unlock</p>
            <h2 className="mt-2 text-2xl font-semibold">Get unlimited exports and a smoother editing experience</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">Upgrade once and remove ad gates, export friction, and template limitations for future applications.</p>
          </div>
          <Link to="/pricing" className="btn-primary">View premium plan</Link>
        </div>
      ) : null}

      <Alert variant="error">{error}</Alert>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-950">Your resumes</h2>
        </div>
        {loading ? (
          <div className="card p-6"><Loader label="Loading your resumes..." /></div>
        ) : resumes.length ? (
          <div className="space-y-4">
            {resumes.map((resume) => <ResumeListCard key={resume.id || resume._id} resume={resume} onDelete={handleDelete} />)}
          </div>
        ) : (
          <EmptyState
            title="No resumes yet"
            description="Create your first resume to start using the AI workspace and live preview."
            action={<button type="button" className="btn-primary" onClick={handleCreate}>Create new resume</button>}
          />
        )}
      </section>
    </div>
  );
};
