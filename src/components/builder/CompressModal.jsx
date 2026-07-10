import { useEffect, useState } from 'react';
import { Icon } from '../icons/Icon';

/**
 * CompressModal
 *
 * Collects the target page count for the "Compress" feature. Deliberately
 * simple: it only asks the ONE question the compression engine needs
 * (utils/compression.js), and only allows values that are actually
 * possible to request (1 up to the current page count minus one — asking
 * to "compress" to the same or more pages than it already has is not a
 * compression, so it isn't offered).
 */
export const CompressModal = ({ open, currentPages, busy, onClose, onConfirm }) => {
  const maxTarget = Math.max(1, currentPages - 1);
  const [target, setTarget] = useState(maxTarget);

  useEffect(() => {
    if (open) setTarget(maxTarget);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentPages]);

  if (!open) return null;

  const clamp = (v) => Math.min(maxTarget, Math.max(1, v || 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm"
         onClick={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}>
      <div className="card max-w-sm w-full space-y-4 p-6 shadow-lift-lg animate-fade-up">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink-950">Compress resume</h2>
          {!busy && (
            <button type="button" onClick={onClose} className="text-ink-300 hover:text-ink-600">
              <Icon name="close" className="h-5 w-5" />
            </button>
          )}
        </div>

        <p className="text-sm text-ink-500">
          Your resume currently spans <span className="font-semibold text-ink-800">{currentPages}</span>{' '}
          page{currentPages === 1 ? '' : 's'}. Choose how many pages you want it to fit into. Text will be
          shrunk as little as possible — never below a readable, professional size — and the result is
          re-measured to confirm it actually fits before anything is applied.
        </p>

        <div>
          <label className="label">Target page count</label>
          <div className="flex items-center gap-3">
            <input
              type="range" min={1} max={maxTarget} step={1}
              value={target} disabled={busy}
              onChange={(e) => setTarget(clamp(Number(e.target.value)))}
              className="flex-1"
            />
            <input
              type="number" min={1} max={maxTarget} step={1}
              value={target} disabled={busy}
              onChange={(e) => setTarget(clamp(Number(e.target.value)))}
              className="input w-16 text-center text-sm"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => onConfirm(target)} disabled={busy}
            className="btn-primary flex-1 justify-center">
            <Icon name="sparkles" className="h-4 w-4" />
            {busy ? 'Compressing…' : `Compress to ${target} page${target === 1 ? '' : 's'}`}
          </button>
          <button type="button" onClick={onClose} disabled={busy} className="btn-secondary flex-1 justify-center">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
