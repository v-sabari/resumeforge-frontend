import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ResumeEditorProvider, useResumeEditorContext } from '../context/ResumeEditorContext.jsx';
import { PageHeader } from '../components/common/PageHeader';
import { Alert } from '../components/common/Alert';
import { Loader } from '../components/common/Loader';
import { Icon } from '../components/icons/Icon';
import { ImportModal } from '../components/builder/ImportModal';
import { ResumePreview } from '../components/builder/ResumePreview';
import { EditorPanel } from '../components/builder/EditorPanel';
import { SectionsPanel } from '../components/builder/SectionsPanel';
import { TemplatesPanel } from '../components/builder/TemplatesPanel';
import { AIActionPanel } from '../components/builder/AIActionPanel';
import { ExportPanel } from '../components/builder/ExportPanel';

/**
 * BuilderLayout
 *
 * Hosts the entire ResumeForge AI Builder behind ONE shared
 * ResumeEditorProvider, and presents it as a single unified content
 * switcher: Editor | Sections | Templates | AI Copilot | Export.
 *
 * Only the LEFT panel swaps when you change tabs; the resume preview is
 * mounted once, on the right, and stays visible in every view, so editing,
 * sections management, template selection, AI assistance and export all
 * share the exact same live `resume`/`template` state and sync in real
 * time with no re-fetch and no drift.
 *
 * The template is persisted as part of the resume (`resume.template`) and
 * is what PDF export reads, so switching templates preserves all content,
 * survives Save/refresh, and drives the exported file.
 *
 * URLs stay deep-linkable: .../builder/:id (Editor), .../sections and
 * .../templates are seeded from the path and kept in sync as you switch.
 */

const TABS = [
  { id: 'editor',    label: 'Editor',    icon: 'text',     base: 'editor'    },
  { id: 'sections',  label: 'Sections',  icon: 'grid',     base: '/sections' },
  { id: 'templates', label: 'Templates', icon: 'grid',     base: '/templates' },
  { id: 'copilot',   label: 'AI Copilot', icon: 'sparkles', base: null       },
  { id: 'export',    label: 'Export',    icon: 'export',   base: null       },
];

const BuilderTabs = ({ activeView, onChange }) => {
  const tabClass = (isActive) => [
    'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all',
    isActive ? 'bg-white text-ink-950 shadow-sm' : 'text-ink-400 hover:text-ink-700',
  ].join(' ');

  return (
    <div
      className="-mx-1 px-1 flex items-center gap-1 overflow-x-auto rounded-xl border border-surface-200 bg-surface-50 p-1 lg:w-fit lg:overflow-visible"
      style={{ scrollbarWidth: 'thin' }}
    >
      {TABS.map((t) => (
        <button key={t.id} type="button" onClick={() => onChange(t.id)} className={tabClass(activeView === t.id)}>
          <Icon name={t.icon} className="h-4 w-4" />
          <span className="whitespace-nowrap">{t.label}</span>
        </button>
      ))}
    </div>
  );
};

const ViewPanel = ({ view, resume, setResume, currentId, premium, exportStatus, onExported, refreshStatuses }) => {
  switch (view) {
    case 'editor':
      return <EditorPanel />;
    case 'sections':
      return <SectionsPanel />;
    case 'templates':
      return <TemplatesPanel />;
    case 'copilot':
      return <AIActionPanel resume={resume} setResume={setResume} />;
    case 'export':
      return (
        <ExportPanel
          resumeId={currentId}
          premium={premium}
          exportStatus={exportStatus}
          onExported={onExported}
          refreshStatuses={refreshStatuses}
        />
      );
    default:
      return <EditorPanel />;
  }
};

const BuilderLayoutInner = () => {
  const editor = useResumeEditorContext();
  const {
    resume, setResume, loading, saving, saveFailed, error, success, currentId, setSuccess,
    template, saveResume, handleImport, refreshStatuses,
    premium, exportStatus, sectionsConfig,
    // PHASE-1 DATA SAFETY: autosave status for the header indicator + the
    // re-login prompt that replaces the auto-redirect on 401.
    isDirty, lastSavedAt, needsReauth, goToReLogin,
    // PHASE-2d/2e: reorder + undo/redo (exposed for the header buttons)
    moveItem, undo, redo, canUndo, canRedo,
  } = editor;

  const navigate = useNavigate();
  const location = useLocation();
  const base = currentId ? `/app/builder/${currentId}` : '/app/builder';

  const [showImport, setShowImport] = useState(false);
  const [activeView, setActiveView] = useState(() => {
    if (location.pathname.endsWith('/sections')) return 'sections';
    if (location.pathname.endsWith('/templates')) return 'templates';
    return 'editor';
  });
  // PHASE-3c: mobile Editor/Preview toggle. Default 'editor' so the user
  // lands on the editing surface. On lg+ this state is ignored (both panels
  // always render side-by-side).
  const [mobileView, setMobileView] = useState('editor');

  const changeView = (v) => {
    setActiveView(v);
    const tab = TABS.find((t) => t.id === v);
    if (tab && tab.base) {
      navigate(tab.base === 'editor' ? base : `${base}${tab.base}`);
    }
  };

  // Keep the active view in sync when the URL changes directly (e.g. from
  // the sidebar "Sections" link) without a full remount of the layout.
  useEffect(() => {
    if (location.pathname.endsWith('/sections')) setActiveView('sections');
    else if (location.pathname.endsWith('/templates')) setActiveView('templates');
    else setActiveView('editor');
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-20">
        <Loader label="Opening resume builder…" size="lg" />
      </div>
    );
  }

  const previewPanel = (
    <ResumePreview
      resume={{ ...resume, sectionsConfig }}
      template={template}
    />
  );

  /* ── PHASE-1 DATA SAFETY: header status indicator ───────────────────
   *
   * One of:
   *   • "Saving…"              — autosave or manual save in flight
   *   • "Saved <relative time>" — last successful save (manual or auto)
   *   • "Save failed – retry"   — last save attempt failed (non-401)
   *   • "Re-login needed"       — last save hit a 401; draft preserved
   *   • "Unsaved"               — new resume, no content yet, no autosave
   *
   * The manual Save button stays next to it for explicit saves.
   */
  const formatSavedTime = (ts) => {
    if (!ts) return '';
    const seconds = Math.round((Date.now() - ts.getTime()) / 1000);
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return ts.toLocaleDateString();
  };

  // `saving` covers both manual and autosave (autosave does NOT set saving,
  // so the indicator's "Saving…" state is driven by `saving` for manual
  // saves only; autosave is silent). To surface "Saving…" during autosave
  // too, we'd need a separate flag — for now the autosave indicator is
  // "Saved <time>" flipping to the new time on success.
  const statusEl = (() => {
    if (needsReauth) {
      return (
        <span className="badge-warning text-xs flex items-center gap-1.5" role="status">
          <Icon name="alert" className="h-3.5 w-3.5" />
          Re-login needed
        </span>
      );
    }
    if (saveFailed) {
      return (
        <button
          type="button"
          onClick={saveResume}
          disabled={saving}
          className="badge-warning text-xs flex items-center gap-1.5 hover:bg-amber-100 disabled:opacity-60"
          role="status"
          aria-label="Save failed — click to retry"
        >
          <Icon name="alert" className="h-3.5 w-3.5" />
          Save failed – retry
        </button>
      );
    }
    if (saving) {
      return (
        <span className="badge-info text-xs flex items-center gap-1.5" role="status" aria-live="polite">
          <span className="inline-block h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
          Saving…
        </span>
      );
    }
    if (isDirty) {
      // Dirty but not yet saving — autosave is debouncing (≤2s). Show a
      // subtle "Saving…" so the user knows their edit was registered.
      return (
        <span className="text-xs text-ink-400 flex items-center gap-1.5" role="status" aria-live="polite">
          <span className="inline-block h-2 w-2 rounded-full bg-ink-300" />
          Editing…
        </span>
      );
    }
    if (lastSavedAt) {
      return (
        <span className="text-xs text-ink-400 flex items-center gap-1.5" role="status">
          <Icon name="check" className="h-3.5 w-3.5 text-emerald-600" />
          Saved {formatSavedTime(lastSavedAt)}
        </span>
      );
    }
    if (!currentId) {
      return (
        <span className="badge-warning text-xs flex items-center gap-1.5" role="status">
          <Icon name="alert" className="h-3.5 w-3.5" />
          Unsaved
        </span>
      );
    }
    return null;
  })();

  return (
    <div className="animate-fade-in">
      <ImportModal open={showImport} onClose={() => setShowImport(false)} onImport={handleImport} />

      <PageHeader
        eyebrow="Resume builder"
        title={currentId ? 'Edit resume' : 'New resume'}
        description="Fill in your details, choose a template, preview in real time, then export."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {statusEl}
            {/* PHASE-2e: visible undo/redo buttons. Keyboard shortcuts
                (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z) are handled inside useUndoRedo. */}
            <button type="button" className="btn-secondary btn-sm" onClick={undo}
              disabled={!canUndo} aria-label="Undo (Ctrl+Z)" title="Undo (Ctrl+Z)">
              <Icon name="chevronUp" className="h-4 w-4 rotate-90" /> Undo
            </button>
            <button type="button" className="btn-secondary btn-sm" onClick={redo}
              disabled={!canRedo} aria-label="Redo (Ctrl+Shift+Z)" title="Redo (Ctrl+Shift+Z)">
              <Icon name="chevronDown" className="h-4 w-4 rotate-90" /> Redo
            </button>
            <button type="button" className="btn-secondary btn-sm" onClick={() => setShowImport(true)}>
              <Icon name="export" className="h-4 w-4 rotate-180" /> Import
            </button>
            <button type="button" className="btn-primary" onClick={saveResume} disabled={saving || needsReauth}>
              <Icon name="check" className="h-4 w-4" />
              {saving ? 'Saving…' : currentId ? 'Save changes' : 'Save resume'}
            </button>
          </div>
        }
      />

      <div className="mt-4 space-y-2">
        {needsReauth && (
          <Alert variant="warning">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>Your session has expired. Your edits are preserved locally and will be restored after you re-login.</span>
              <button
                type="button"
                onClick={goToReLogin}
                className="font-semibold underline underline-offset-2 hover:no-underline"
              >
                Re-login
              </button>
            </span>
          </Alert>
        )}
        {error && !needsReauth && (
          <Alert variant="error">
            {saveFailed ? (
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={saveResume}
                  disabled={saving}
                  className="font-semibold underline underline-offset-2 hover:no-underline disabled:opacity-60"
                >
                  {saving ? 'Retrying…' : 'Retry'}
                </button>
              </span>
            ) : error}
          </Alert>
        )}
        {success && !needsReauth && <Alert variant="success">{success}</Alert>}
        {/* PHASE-1 DATA SAFETY: removed the "Save this resume to persist…" warning
            banner for new resumes. Autosave is now active for both new and
            existing resumes, so the banner is misleading — it implies the
            user must manually click Save to persist, when in fact edits are
            persisted automatically ~2s after each change. The header status
            indicator ("Unsaved" → "Saving…" → "Saved <time>") communicates
            the same information without the false implication. */}
      </div>

      <div className="mt-5 space-y-5">
        <BuilderTabs activeView={activeView} onChange={changeView} />

        {/* PHASE-3c: mobile Editor/Preview toggle. On screens below lg, the
            editor and preview stack vertically which is awkward on a 390px
            viewport. A segmented toggle lets the user switch between them
            without scrolling. On lg+ both panels are always visible
            side-by-side (unchanged). The toggle is hidden on lg+ via
            `lg:hidden`. */}
        <div className="lg:hidden flex items-center gap-0.5 rounded-xl border border-surface-200 bg-surface-50 p-1">
          <button
            type="button"
            onClick={() => setMobileView('editor')}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              mobileView === 'editor' ? 'bg-white text-ink-950 shadow-sm' : 'text-ink-400'
            }`}
            aria-pressed={mobileView === 'editor'}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              mobileView === 'preview' ? 'bg-white text-ink-950 shadow-sm' : 'text-ink-400'
            }`}
            aria-pressed={mobileView === 'preview'}
          >
            Preview
          </button>
        </div>

        {/* Left = active panel · Right = always-visible preview.
            PHASE-3c: on mobile, only the selected panel renders (the other
            is `hidden`). On lg+ both always render. */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Active tool panel (50%) */}
          <div className={`min-w-0 space-y-5 ${mobileView === 'editor' ? '' : 'hidden'} lg:block`}>
            <ViewPanel
              view={activeView}
              resume={resume}
              setResume={setResume}
              currentId={currentId}
              premium={premium}
              exportStatus={exportStatus}
              onExported={() => setSuccess('Your resume has been downloaded!')}
              refreshStatuses={refreshStatuses}
            />
          </div>

          {/* Live preview (50%), sticky. `min-w-0` is load-bearing: without it
              the A4 sheet's true 794px width inflates this grid item's
              min-content size, the 1fr track grows past its share, and the
              sheet is clipped off the right edge of the page. It lets the
              track shrink so A4Viewer can measure the real frame width and
              scale the sheet to fit. */}
          <div className={[
            'min-w-0 flex flex-col gap-5',
            mobileView === 'preview' ? '' : 'hidden',
            'lg:block',
            'lg:sticky lg:top-6',
            'lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1',
          ].join(' ')} style={{ scrollbarWidth: 'thin' }}>
            {previewPanel}
          </div>
        </div>
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
