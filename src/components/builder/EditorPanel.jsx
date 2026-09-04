import { useResumeEditorContext } from '../../context/ResumeEditorContext.jsx';

/**
 * EditorPanel
 *
 * The left-hand content of the Builder's "Editor" tab. Renders every
 * visible section's content editor (title, summary, experience, etc.)
 * using the same renderers/state as the rest of the Builder, so edits
 * appear instantly in the shared preview rendered by BuilderLayout.
 */
export const EditorPanel = () => {
  const editor = useResumeEditorContext();
  const { visibleSections, renderStandard, renderCustom } = editor;

  return (
    <div className="space-y-5">
      <div>
        <p className="kicker mb-1">Edit resume</p>
        <p className="text-sm text-ink-500">
          Fill in your details below. The preview updates in real time as you type.
        </p>
      </div>

      {visibleSections.map((sec) =>
        sec.type === 'standard' ? renderStandard(sec) : renderCustom(sec)
      )}
    </div>
  );
};
