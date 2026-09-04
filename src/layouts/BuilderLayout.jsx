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
    resume, setResume, loading, saving, error, success, currentId, setSuccess,
    template, saveResume, handleImport, refreshStatuses,
    premium, exportStatus, sectionsConfig,
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
      onScaleChange={(scale) => { editor.top('layoutScale', scale); setSuccess(''); }}
    />
  );

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
          <Alert variant="warning">Save this resume to persist your edits, template choice, and to export it.</Alert>
        )}
      </div>

      <div className="mt-5 space-y-5">
        <BuilderTabs activeView={activeView} onChange={changeView} />

        {/* Left = active panel · Right = always-visible preview */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Active tool panel (50%) */}
          <div className="min-w-0 space-y-5">
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

          {/* Live preview (50%), sticky */}
          <div className={[
            'flex flex-col gap-5',
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
