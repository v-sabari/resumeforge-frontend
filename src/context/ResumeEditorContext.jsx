import { createContext, useContext } from 'react';
import { useResumeEditor } from '../hooks/useResumeEditor.jsx';

const ResumeEditorContext = createContext(null);

/**
 * ResumeEditorProvider
 *
 * Mounted ONCE, in BuilderLayout.jsx, wrapping both the Editor page
 * (index route) and the Sections page (sections route). Because it's
 * mounted at the layout level rather than inside either page, navigating
 * between "Editor" and "Sections" does NOT remount useResumeEditor — the
 * same `resume` object, the same unsaved edits, and the same Preview data
 * carry over instantly and exactly, with no re-fetch and no risk of the
 * two pages drifting out of sync.
 */
export const ResumeEditorProvider = ({ resumeId, children }) => {
  const editor = useResumeEditor(resumeId);
  return (
    <ResumeEditorContext.Provider value={editor}>
      {children}
    </ResumeEditorContext.Provider>
  );
};

export const useResumeEditorContext = () => {
  const ctx = useContext(ResumeEditorContext);
  if (!ctx) {
    throw new Error('useResumeEditorContext must be used within a ResumeEditorProvider (BuilderLayout)');
  }
  return ctx;
};
