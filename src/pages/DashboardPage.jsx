import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllResumes, deleteResume } from '../services/resumeService';
import { PageHeader } from '../components/common/PageHeader';
import { Alert } from '../components/common/Alert';
import { EmptyState } from '../components/common/EmptyState';
import { Loader } from '../components/common/Loader';
import { Icon } from '../components/icons/Icon';
import { formatApiError, prettyDate, truncate } from '../utils/helpers';
import { FREE_EXPORT_LIMIT } from '../utils/constants';

const StatCard = ({ icon, label, value, sub, accent }) => (
  <div className={`card p-5 ${accent ? 'border-brand-200 bg-brand-50/50' : ''}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1">{label}</p>
        <p className={`text-2xl font-display font-semibold ${accent ? 'text-brand-700' : 'text-ink-950'}`}>{value}</p>
        {sub && <p className="text-xs text-ink-400 mt-0.5">{sub}</p>}
      </div>
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent ? 'bg-brand-100 text-brand-600' : 'bg-surface-100 text-ink-400'}`}>
        <Icon name={icon} className="h-4 w-4" />
      </div>
    </div>
  </div>
);

const ResumeCard = ({ resume, onDelete }) => {
  const navigate   = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this resume? This action cannot be undone.')) return;
    setDeleting(true);
    try { await onDelete(resume.id); } catch { setDeleting(false); }
  };

  return (
    <div className="card-hover group relative p-5"
      onClick={() => navigate(`/app/builder/${resume.id}`)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-ink-950 truncate">
            {resume.fullName || 'Untitled Resume'}
          </h3>
          <p className="text-sm text-ink-400 truncate mt-0.5">
            {resume.role || 'No title set'}
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          aria-label="Delete resume"
          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity btn-danger btn-sm p-1.5 shrink-0"
          title="Delete resume">
          {deleting ? <Loader size="sm" label="" /> : <Icon name="trash" className="h-3.5 w-3.5" />}
        </button>
      </div>

      {resume.summary && (
        <p className="mt-3 text-xs text-ink-400 line-clamp-2 leading-relaxed">
          {truncate(resume.summary, 100)}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {(resume.skills || []).slice(0, 3).map((s) => (
            <span key={s} className="badge-neutral text-[11px]">{s}</span>
          ))}
          {(resume.skills || []).length > 3 && (
            <span className="badge-neutral text-[11px]">+{resume.skills.length - 3}</span>
          )}
        </div>
        <span className="text-[11px] text-ink-300 shrink-0 ml-2">
          {prettyDate(resume.updatedAt || resume.createdAt)}
        </span>
      </div>

      <div className="mt-4 pt-3 border-t border-surface-100 flex items-center gap-2 text-xs text-brand-600 font-medium">
        <Icon name="eye" className="h-3.5 w-3.5" />
        Open builder
        <Icon name="arrowRight" className="h-3 w-3 ml-auto" />
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  const { user, premium, exportStatus } = useAuth();
  const [resumes,  setResumes]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    getAllResumes()
      .then(setResumes)
      .catch((e) => setError(formatApiError(e, 'Could not load your resumes.')))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    await deleteResume(id);
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  const exportsUsed      = exportStatus?.usedExports || 0;
  const exportsRemaining = premium?.isPremium ? '∞' : Math.max(0, FREE_EXPORT_LIMIT - exportsUsed);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow={`Welcome back, ${user?.name?.split(' ')[0] || 'there'}`}
        title="Your Resume Dashboard"
        description="Manage all your resumes, track exports, and start new applications."
        actions={
          <Link to="/app/builder" className="btn-primary">
            <Icon name="plus" className="h-4 w-4" />
            New resume
          </Link>
        }
      />

      <Alert variant="error">{error}</Alert>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="text"     label="Resumes"         value={resumes.length}     sub="in your account" />
        <StatCard icon="export"   label="Exports used"    value={exportsUsed}        sub={`of ${premium?.isPremium ? '∞' : FREE_EXPORT_LIMIT} available`} />
        <StatCard icon="zap"      label="Exports left"    value={exportsRemaining}   sub="remaining"       accent />
        <StatCard icon="crown"    label="Plan"
          value={premium?.isPremium ? 'Premium' : 'Free'}
          sub={premium?.isPremium ? 'Unlimited exports' : 'Upgrade for unlimited'}
          accent={premium?.isPremium} />
      </div>

      {/* Premium upsell */}
      {!premium?.isPremium && (
        <div className="card p-5 border-brand-200 bg-gradient-to-r from-brand-50 to-surface-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-600 shrink-0">
              <Icon name="crown" className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-ink-950 text-sm">Unlock unlimited exports for $9</p>
              <p className="text-xs text-ink-400 mt-0.5">One-time payment. No subscription. Download as many PDFs as you want.</p>
            </div>
          </div>
          <Link to="/pricing" className="btn-primary btn-sm shrink-0">
            Upgrade now
            <Icon name="arrowRight" className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Resumes grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-ink-950">
            Your resumes
            {resumes.length > 0 && (
              <span className="ml-2 text-sm font-normal text-ink-400">({resumes.length})</span>
            )}
          </h2>
        </div>

        {loading ? (
          <div className="card flex items-center justify-center py-16">
            <Loader label="Loading your resumes…" />
          </div>
        ) : resumes.length === 0 ? (
          <EmptyState
            icon={<Icon name="text" className="h-7 w-7" />}
            title="No resumes yet"
            description="Create your first resume and start applying to jobs today."
            action={
              <Link to="/app/builder" className="btn-primary">
                <Icon name="plus" className="h-4 w-4" />
                Create first resume
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} onDelete={handleDelete} />
            ))}
            {/* Add new card */}
            <Link to="/app/builder"
              className="card flex flex-col items-center justify-center gap-3 p-8 border-dashed border-2
                         border-surface-200 hover:border-brand-300 hover:bg-brand-50/30 transition-all min-h-[180px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-500">
                <Icon name="plus" className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-ink-500">New resume</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
