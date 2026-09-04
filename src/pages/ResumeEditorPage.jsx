import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useResumeEditorContext } from '../context/ResumeEditorContext.jsx';
import { ResumePreview } from '../components/builder/ResumePreview';
import { AIActionPanel } from '../components/builder/AIActionPanel';
import { ExportPanel } from '../components/builder/ExportPanel';

const MOBILE_TABS = [
  { id: 'edit',    label: '✏️ Edit'    },
  { id: 'preview', label: '👁 Preview' },
  { id: 'export',  label: '⬇ Export'  },
];

/**
 * ResumeEditorPage
 *
 * Was formerly the bulk of ResumeBuilderPage.jsx. The left "Section nav /
 * manage sections" column is gone — that functionality now lives on its
 * own page (ResumeSectionsPage.jsx, reachable via the Sections tab /
 * sidebar link) — so the remaining two panels, Editor and Preview, now
 * split the width evenly (50/50) as required, instead of sharing space
 * with a third column.
 */
export const ResumeEditorPage = () => {
  const { premium, exportStatus, refreshExportStatus, refreshPremiumStatus } = useAuth();
  const editor = useResumeEditorContext();
  const {
    resume, setSuccess, currentId, template,
    sectionsConfig, visibleSections, renderStandard, renderCustom, top,
  } = editor;
  const [mobileTab, setMobileTab] = useState('edit');

  const refreshStatuses = () => Promise.all([refreshExportStatus(), refreshPremiumStatus()]);

  const previewPanel = (
    <ResumePreview
      resume={{ ...resume, sectionsConfig }}
      template={template}
      onScaleChange={(scale) => { top('layoutScale', scale); setSuccess(''); }}
    />
  );
  const aiPanel     = <AIActionPanel resume={resume} setResume={editor.setResume} />;
  const exportPanel = (
    <ExportPanel
      resumeId={currentId}
      premium={premium}
      exportStatus={exportStatus}
      onExported={() => setSuccess('Your resume has been downloaded!')}
      refreshStatuses={refreshStatuses}
    />
  );

  return (
    <div>
      {/* Mobile tab bar */}
      <div className="flex gap-1 rounded-xl border border-surface-200 bg-surface-50 p-1 lg:hidden">
        {MOBILE_TABS.map((t) => (
          <button key={t.id} type="button" onClick={() => setMobileTab(t.id)}
            className={['flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all',
              mobileTab === t.id ? 'bg-white text-ink-950 shadow-sm' : 'text-ink-400 hover:text-ink-700'].join(' ')}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Equal 50 / 50 split: Editor | Preview (+ AI + Export stacked under Preview) */}
      <div className="mt-5 grid gap-6 lg:grid-cols-2">

        {/* ── Editor (50%) ────────────────────────────────────────── */}
        <div className={`min-w-0 space-y-5 ${mobileTab === 'preview' || mobileTab === 'export' ? 'hidden lg:block' : ''}`}>
          {visibleSections.map((sec) =>
            sec.type === 'standard'
              ? renderStandard(sec)
              : renderCustom(sec)
          )}
        </div>

        {/* ── Preview (50%), sticky ───────────────────────────────── */}
        <div className={[
          'hidden lg:flex lg:flex-col lg:gap-5',
          'lg:sticky lg:top-6',
          'lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1',
        ].join(' ')} style={{ scrollbarWidth: 'thin' }}>
          {previewPanel}
          {aiPanel}
          {exportPanel}
        </div>

        {/* Mobile preview tab */}
        {mobileTab === 'preview' && (
          <div className="col-span-full space-y-4 lg:hidden">{previewPanel}</div>
        )}

        {/* Mobile export tab */}
        {mobileTab === 'export' && (
          <div className="col-span-full space-y-4 lg:hidden">{aiPanel}{exportPanel}</div>
        )}
      </div>
    </div>
  );
};
