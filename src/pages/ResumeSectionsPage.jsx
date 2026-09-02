import { useResumeEditorContext } from '../context/ResumeEditorContext.jsx';
import { ResumePreview } from '../components/builder/ResumePreview';
import { SectionsManager } from '../components/builder/SectionsManager';

/**
 * ResumeSectionsPage
 *
 * The dedicated "Sections Management" page. Lets the user Add, Edit
 * (rename + content), Delete, and drag-and-drop Reorder every section —
 * and shows the live Resume Preview right next to it so every change is
 * visible immediately.
 *
 * "Real-time" here isn't a polling or debounced sync — SectionsManager's
 * onChange and the ResumePreview below both read/write the SAME
 * `sectionsConfig` / `resume` state instance from ResumeEditorContext
 * (provided once, at the BuilderLayout level). A reorder, rename, add, or
 * delete is a single React state update, and the Preview re-renders from
 * that same update in the same commit — there's no separate copy of the
 * data anywhere that could fall out of sync.
 */
export const ResumeSectionsPage = () => {
  const editor = useResumeEditorContext();
  const {
    resume, template, setTemplate, setSuccess, top,
    sectionsConfig, setSectionsConfig, visibleSections,
    renderStandard, renderCustom,
  } = editor;

  const previewPanel = (
    <ResumePreview
      resume={{ ...resume, sectionsConfig }}
      template={template}
      onTemplateChange={setTemplate}
      onScaleChange={(scale) => { top('layoutScale', scale); setSuccess(''); }}
    />
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      {/* ── Sections management + content (50%) ─────────────────── */}
      <div className="min-w-0 space-y-5">
        <div>
          <p className="kicker mb-1">Manage sections</p>
          <p className="text-sm text-ink-500">
            Add, rename, delete, or drag to reorder sections. The preview on the right updates instantly —
            this is the exact content that will be exported.
          </p>
        </div>

        <SectionsManager sectionsConfig={sectionsConfig} onChange={setSectionsConfig} />

        {/* Content editors for every currently-visible section, in the
            same order they'll appear on the resume. Editing content here
            uses the exact same renderers (and therefore the exact same
            state) as the main Editor page. */}
        <div className="space-y-5 pt-2">
          <p className="kicker">Section content</p>
          {visibleSections.length === 0 ? (
            <div className="rounded-xl border border-dashed border-surface-300 bg-surface-50 p-4 text-sm text-ink-500">
              No visible sections yet. Add one above, or toggle visibility on an existing section.
            </div>
          ) : (
            visibleSections.map((sec) =>
              sec.type === 'standard' ? renderStandard(sec) : renderCustom(sec)
            )
          )}
        </div>
      </div>

      {/* ── Live preview (50%), sticky ───────────────────────────── */}
      <div className={[
        'flex flex-col gap-5',
        'lg:sticky lg:top-6',
        'lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1',
      ].join(' ')} style={{ scrollbarWidth: 'thin' }}>
        {previewPanel}
      </div>
    </div>
  );
};
