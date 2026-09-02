import { useState } from 'react';
import { useParams, NavLink, Outlet } from 'react-router-dom';
import { ResumeEditorProvider, useResumeEditorContext } from '../context/ResumeEditorContext.jsx';
import { PageHeader } from '../components/common/PageHeader';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { Icon } from '../components/icons/Icon';
import { ImportModal } from '../components/builder/ImportModal';

/**
 * BuilderLayout
 *
 * Wraps BOTH the Editor page (`/app/builder/:resumeId`) and the new
 * Sections page (`/app/builder/:resumeId/sections`) as nested routes, and
 * mounts ResumeEditorProvider exactly once around both of them. That's
 * the mechanism that makes Sections <-> Preview sync "real-time" and
 * 100% correct: switching tabs is just a route change within the SAME
 * provider — the underlying `resume` state is never unmounted, re-fetched,
 * or re-created, so nothing can drift between the two pages.
 *
 * Save, Import, and the top-level alerts live here (not duplicated in
 * each page) since both pages act on the exact same resume and both
 * should be saveable from wherever you are.
 */
const BuilderTabs = () => {
  const { currentId } = useResumeEditorContext();
  const base = currentId ? `/app/builder/${currentId}` : '/app/builder';
  const sectionsHref = currentId ? `${base}/sections` : null;

  const tabClass = (isActive) => [
    'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all',
    isActive ? 'bg-white text-ink-950 shadow-sm' : 'text-ink-400 hover:text-ink-700',
  ].join(' ');

  return (
    <div className="mb-5 flex items-center gap-1 rounded-xl border border-surface-200 bg-surface-50 p-1 w-fit">
      <NavLink to={base} end className={({ isActive }) => tabClass(isActive)}>
        <Icon name="text" className="h-4 w-4" /> Editor
      </NavLink>
      {sectionsHref ? (
        <NavLink to={sectionsHref} className={({ isActive }) => tabClass(isActive)}>
          <Icon name="grid" className="h-4 w-4" /> Sections
        </NavLink>
      ) : (
        <span
          title="Save your resume first to manage sections on their own page"
          className="flex cursor-not-allowed items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-ink-300">
          <Icon name="grid" className="h-4 w-4" /> Sections
        </span>
      )}
    </div>
  );
};

const BuilderLayoutInner = () => {
  const editor = useResumeEditorContext();
  const { loading, saving, error, success, currentId, saveResume, handleImport } = editor;
  const [showImport, setShowImport] = useState(false);

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-20">
        <Loader label="Opening resume builder…" size="lg" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <ImportModal open={showImport} onClose={() => setShowImport(false)} onImport={handleImport} />

      <PageHeader
        eyebrow="Resume builder"
        title={currentId ? 'Edit resume' : 'New resume'}
        description="Fill in your details, choose a template, preview in real time, then export."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" className="btn-secondary btn-sm" onClick={() => setShowImport(true)}>
              <Icon name="export" className="h-4 w-4 rotate-180" /> Import
            </button>
            {!currentId && <span className="badge-warning text-xs">Unsaved</span>}
            <button type="button" className="btn-primary" onClick={saveResume} disabled={saving}>
              <Icon name="check" className="h-4 w-4" />
              {saving ? 'Saving…' : currentId ? 'Save changes' : 'Save resume'}
            </button>
          </div>
        }
      />

      <div className="mt-4 space-y-2">
        {error   && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        {!currentId && (
          <Alert variant="warning">Save your resume first before exporting or opening the Sections page.</Alert>
        )}
      </div>

      <div className="mt-5">
        <BuilderTabs />
        <Outlet />
      </div>
    </div>
  );
};

export const BuilderLayout = () => {
  const { resumeId } = useParams();
  return (
    <ResumeEditorProvider resumeId={resumeId}>
      <BuilderLayoutInner />
    </ResumeEditorProvider>
  );
};
