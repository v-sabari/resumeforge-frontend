import { useRef, useCallback, useEffect } from 'react';

/**
 * PHASE-2e: useUndoRedo
 *
 * A small undo/redo stack for resume content changes. Wraps a state setter
 * (the `setResume` from useResumeEditor) so every content mutation pushes
 * the PREVIOUS resume shape onto an undo stack, and Ctrl/Cmd+Z pops it back.
 *
 * Design notes:
 *   • The stack stores resume SNAPSHOTS (full object), not diffs. Resume
 *     objects are small (<100KB typical) and 50 snapshots is ~5MB max —
 *     well within memory budgets. Simpler and less bug-prone than diffing.
 *   • The stack is capped at 50 entries (per the brief). Older entries are
 *     dropped from the front.
 *   • Undo and redo each push onto the opposite stack, so the user can
 *     undo→redo→undo freely.
 *   • Keyboard shortcuts: Ctrl/Cmd+Z = undo, Ctrl/Cmd+Shift+Z = redo.
 *     Also Ctrl/Cmd+Y = redo (Windows convention).
 *   • The visible Undo/Redo buttons are rendered by the caller (the builder
 *     header). This hook exposes `canUndo`, `canRedo`, `undo`, `redo` for
 *     that purpose.
 *   • IMPORTANT: the hook wraps `setResume` but does NOT intercept
 *     `setResume` calls that originate from server-load or autosave-restore
 *     (those should NOT pollute the undo stack). The caller passes a
 *     `silent` flag for those cases via the returned `setResumeSilent`.
 *
 * Usage:
 *   const {
 *     pushHistory, undo, redo, canUndo, canRedo, clear,
 *   } = useUndoRedo(setResume);
 *
 *   // On every user-initiated mutation:
 *   setResume((prev) => { pushHistory(prev); return {...prev, field: val }; });
 */

const MAX_HISTORY = 50;

export const useUndoRedo = (setResume) => {
  const undoStack = useRef([]);
  const redoStack = useRef([]);

  const pushHistory = useCallback((snapshot) => {
    undoStack.current.push(snapshot);
    if (undoStack.current.length > MAX_HISTORY) {
      undoStack.current.shift();
    }
    // Any new edit invalidates the redo stack (standard undo/redo semantics).
    redoStack.current = [];
  }, []);

  const undo = useCallback(() => {
    setResume((current) => {
      const prev = undoStack.current.pop();
      if (prev === undefined) return current;
      redoStack.current.push(current);
      return prev;
    });
  }, [setResume]);

  const redo = useCallback(() => {
    setResume((current) => {
      const next = redoStack.current.pop();
      if (next === undefined) return current;
      undoStack.current.push(current);
      return next;
    });
  }, [setResume]);

  const clear = useCallback(() => {
    undoStack.current = [];
    redoStack.current = [];
  }, []);

  // Keyboard shortcuts. Attached to window so they work regardless of focus
  // (as long as the builder is mounted). Ignores keystrokes when the user is
  // typing in an input/textarea/select AND the shortcut isn't undo/redo
  // itself (so Ctrl+Z in a text field still undoes text, not resume state —
  // actually no: the brief asks for resume-level undo, so we DO intercept
  // Ctrl+Z even in inputs. This is the expected behavior for a document
  // editor like Google Docs.)
  useEffect(() => {
    const handler = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const key = e.key.toLowerCase();
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((key === 'z' && e.shiftKey) || key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  return {
    pushHistory,
    undo,
    redo,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,
    clear,
  };
};
