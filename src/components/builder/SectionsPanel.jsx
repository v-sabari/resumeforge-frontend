import { useResumeEditorContext } from '../../context/ResumeEditorContext.jsx';
import { SectionsManager } from './SectionsManager';

/**
 * SectionsPanel
 *
 * The left-hand content of the Builder's "Sections" tab. Lets the user
 * Add, Edit (rename + content), Delete, and drag-and-drop Reorder every
 * section. Reads/writes the SAME sectionsConfig/resume state as the
 * shared preview, so every change is visible immediately.
 */
export const SectionsPanel = () => {
  const editor = useResumeEditorContext();
  const {
    sectionsConfig, setSectionsConfig, visibleSections,
    renderStandard, renderCustom,
  } = editor;

  return (
    <div className="space-y-5">
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
          state) as the main Editor tab. */}
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
  );
};
