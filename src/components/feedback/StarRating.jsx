import { Icon } from '../icons/Icon';

/**
 * Read-only 5-star rating display, used by the public feedback cards.
 */
export const StarRating = ({ value = 0, size = 'h-4 w-4', className = '' }) => (
  <span
    className={`inline-flex items-center gap-0.5 ${className}`}
    role="img"
    aria-label={`${value} out of 5 stars`}
  >
    {[1, 2, 3, 4, 5].map((n) => (
      <Icon
        key={n}
        name="star"
        className={`${size} ${n <= value ? 'text-amber-400' : 'text-ink-300'}`}
        fill={n <= value ? 'currentColor' : 'none'}
      />
    ))}
  </span>
);
