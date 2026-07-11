import { useEffect, useState } from 'react';
import { Icon } from '../icons/Icon';

// Keep in sync with utils/compression.js — how far past the current page
// count the user is allowed to ask to grow into. Bounded so the request
// stays realistic (you can't sanely "fill" 10 extra blank pages of a
// half-page resume); the search itself has its own independent font-size
// ceiling (MAX_SCALE) so even within this range it will never enlarge
// text past a professional size.
const MAX_GROW_PAGES = 4;

/**
 * CompressModal
 *
 * Collects the target page count for the "Compress" feature, which works
 * in both directions:
 *   - Pick FEWER pages than it currently uses -> font shrinks to fit.
 *   - Pick MORE pages than it currently uses  -> font grows to fill them.
 * Either way, alignment, layout, and template are untouched — only the
 * density of the exact same content changes, and the result is
 * re-measured for real before it's ever shown as applied.
 */
export const CompressModal = ({ open, currentPages, busy, onClose, onConfirm }) => {
  const minTarget = 1;
  const maxTarget = currentPages + MAX_GROW_PAGES;
  const [target, setTarget] = useState(currentPages);

  useEffect(() => {
    if (open) setTarget(currentPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentPages]);

  if (!open) return null;

  const clamp = (v) => Math.min(maxTarget, Math.max(minTarget, v || minTarget));

  const direction = target < currentPages ? 'shrink' : target > currentPages ? 'grow' : 'same';
  const actionLabel =
    direction === 'shrink' ? `Shrink to fit ${target} page${target === 1 ? '' : 's'}` :
    direction === 'grow'   ? `Grow to fill ${target} page${target === 1 ? '' : 's'}` :
    `Keep at ${target} page${target === 1 ? '' : 's'}`;

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
          page{currentPages === 1 ? '' : 's'}. Choose how many pages you want it to fill. Pick fewer and the
          text shrinks to fit; pick more and the text grows to fill them — either way the layout and
          alignment stay exactly as designed, and the result is re-measured to confirm it actually matches
          before anything is applied.
        </p>

        <div>
          <label className="label">Target page count</label>
          <div className="flex items-center gap-3">
            <input
              type="range" min={minTarget} max={maxTarget} step={1}
              value={target} disabled={busy}
              onChange={(e) => setTarget(clamp(Number(e.target.value)))}
              className="flex-1"
            />
            <input
              type="number" min={minTarget} max={maxTarget} step={1}
              value={target} disabled={busy}
              onChange={(e) => setTarget(clamp(Number(e.target.value)))}
              className="input w-16 text-center text-sm"
            />
          </div>
          <p className="mt-1 text-[11px] text-ink-400">
            {direction === 'shrink' && `Font will shrink to fit everything into ${target} page${target === 1 ? '' : 's'}.`}
            {direction === 'grow'   && `Font will grow to fill all ${target} page${target === 1 ? '' : 's'}.`}
            {direction === 'same'   && `That's the current page count — no change needed.`}
          </p>
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => onConfirm(target)} disabled={busy || direction === 'same'}
            className="btn-primary flex-1 justify-center">
            <Icon name="sparkles" className="h-4 w-4" />
            {busy ? 'Working…' : actionLabel}
          </button>
          <button type="button" onClick={onClose} disabled={busy} className="btn-secondary flex-1 justify-center">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
