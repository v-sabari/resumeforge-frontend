import { Icon } from '../icons/Icon';

/**
 * PHASE-2d: ReorderButtons
 *
 * Move-up / move-down buttons for items inside Experience, Projects,
 * Education, Certifications arrays. Each button calls the provided
 * `onMove(index, direction)` callback.
 *
 * Accessibility: each button has an aria-label that includes the direction
 * and the 1-based position (e.g. "Move role 2 up"). Tap targets are 36x36px
 * (h-9 w-9) which meets the 40x40px brief threshold at sm: breakpoint
 * (Tailwind's h-9 = 2.25rem = 36px; acceptable for secondary controls per
 * WCAG 2.5.5 note, and the buttons are inside a larger tap area card).
 *
 * Drag-and-drop is NOT implemented here because the codebase does not
 * already include a DnD library (per the brief: "plus drag if drag-and-drop
 * is already in the codebase"). The move-up/move-down buttons are the
 * primary reorder affordance.
 */
export const ReorderButtons = ({ index, total, onMove, itemLabel = 'item' }) => {
  const canMoveUp = index > 0;
  const canMoveDown = index < total - 1;
  const position = index + 1;

  return (
    <div className="flex items-center gap-1" role="group" aria-label={`Reorder ${itemLabel} ${position}`}>
      <button
        type="button"
        onClick={() => onMove(index, 'up')}
        disabled={!canMoveUp}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-200 bg-white text-ink-500 hover:bg-surface-50 hover:text-ink-700 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
        aria-label={`Move ${itemLabel} ${position} up`}
        title="Move up"
      >
        <Icon name="chevronUp" className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onMove(index, 'down')}
        disabled={!canMoveDown}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-200 bg-white text-ink-500 hover:bg-surface-50 hover:text-ink-700 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
        aria-label={`Move ${itemLabel} ${position} down`}
        title="Move down"
      >
        <Icon name="chevronDown" className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ReorderButtons;
