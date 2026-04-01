import { useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';

export const useResumeAutosave = ({ enabled = true, resume, resumeId, onSave, onSuccess, onError }) => {
  const debouncedSave = useMemo(
    () => debounce(async (latestResume) => {
      try {
        const result = await onSave?.(latestResume);
        onSuccess?.(result);
      } catch (error) {
        onError?.(error);
      }
    }, 2200),
    [onSave, onSuccess, onError],
  );

  useEffect(() => {
    if (!enabled || !resumeId || !resume) return undefined;

    debouncedSave(resume);

    return () => {
      debouncedSave.cancel();
    };
  }, [enabled, resume, resumeId, debouncedSave]);
};
