import { useEffect, useRef, useState } from 'react';
import { Icon } from '../icons/Icon';
import { useAuth } from '../../context/AuthContext';
import { submitFeedback } from '../../services/feedbackService';
import { formatApiError } from '../../utils/helpers';

/* ── Type configuration ──────────────────────────────────────────────────── */
// Colours map onto the site's existing ink/brand palette (tailwind.config.js)
// plus Tailwind's default red/amber scale for bug & feature accents.
const TYPES = {
  bug: {
    id: 'bug',
    label: 'Report a Bug',
    icon: 'bug',
    titleLabel: 'Describe the Bug',
    titlePlaceholder: 'e.g. PDF export crashes on mobile',
    detailsPlaceholder: 'Steps to reproduce, expected vs actual behavior...',
    submitLabel: 'Submit Report a Bug',
    gradient: 'from-red-500 to-pink-500',
    selectedCard: 'border-red-500/70 bg-red-500/10 text-red-300',
    focusRing: 'focus-visible:ring-red-500',
  },
  feature: {
    id: 'feature',
    label: 'Request Feature',
    icon: 'zap',
    titleLabel: 'Feature Request Title',
    titlePlaceholder: 'e.g. Add LinkedIn import feature',
    detailsPlaceholder: 'Explain why this feature would be useful, any use cases...',
    submitLabel: 'Submit Request Feature',
    gradient: 'from-amber-500 to-orange-500',
    selectedCard: 'border-amber-500/70 bg-amber-500/10 text-amber-300',
    focusRing: 'focus-visible:ring-amber-500',
  },
  general: {
    id: 'general',
    label: 'General Feedback',
    icon: 'messageCircle',
    titleLabel: 'Feedback Title',
    titlePlaceholder: 'e.g. Great tool, love the templates!',
    detailsPlaceholder: 'Tell us more about your experience...',
    submitLabel: 'Submit General Feedback',
    gradient: 'from-indigo-500 to-brand-600',
    selectedCard: 'border-brand-400/70 bg-brand-500/10 text-brand-200',
    focusRing: 'focus-visible:ring-brand-500',
  },
};

const TYPE_ORDER = ['bug', 'feature', 'general'];

const RATING_LABELS = {
  1: { label: 'Poor', emoji: '😞' },
  2: { label: 'Fair', emoji: '😕' },
  3: { label: 'Okay', emoji: '🙂' },
  4: { label: 'Good', emoji: '😊' },
  5: { label: 'Excellent', emoji: '🤩' },
};

const MAX_DETAILS = 1000;

export const FeedbackModal = ({ open, onClose, defaultType = 'general' }) => {
  const { user } = useAuth();

  const [type, setType] = useState(defaultType);
  const [rating, setRating] = useState(4);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);
  const closeTimer = useRef(null);

  const active = TYPES[type] || TYPES.general;

  const resetForm = () => {
    setType(defaultType);
    setRating(4);
    setTitle('');
    setDetails('');
    setHoneypot('');
    setErrors({});
    setSubmitError('');
    setSuccess(false);
    setSubmitting(false);
  };

  const handleClose = () => {
    clearTimeout(closeTimer.current);
    if (success) resetForm();
    onClose?.();
  };

  // Scroll lock + focus trap + Escape handling.
  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    const focusablesSelector =
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;

      const nodes = Array.from(dialogRef.current.querySelectorAll(focusablesSelector))
        .filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    const focusTimer = setTimeout(() => {
      dialogRef.current?.querySelector('[data-autofocus]')?.focus();
    }, 0);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      clearTimeout(focusTimer);
      document.body.style.overflow = '';
      if (previouslyFocused.current?.focus) previouslyFocused.current.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, success]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const validate = () => {
    const next = {};
    if (!title.trim()) next.title = 'Please add a short title.';
    else if (title.trim().length > 120) next.title = 'Title must be 120 characters or fewer.';
    if (!details.trim()) next.details = 'Please add some details.';
    else if (details.trim().length > MAX_DETAILS) next.details = 'Details must be 1000 characters or fewer.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await submitFeedback({
        type,
        rating,
        title: title.trim(),
        details: details.trim(),
        pageUrl: typeof window !== 'undefined' ? window.location.href : null,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        userEmail: user?.email || undefined,
        userName: user?.name || undefined,
        website: honeypot,
      });

      const created = res?.data?.feedback;
      if (type === 'general' && created) {
        // Let the public section prepend the new entry without a page reload.
        window.dispatchEvent(new CustomEvent('feedback:submitted', { detail: created }));
      }

      setSuccess(true);
      closeTimer.current = setTimeout(() => {
        resetForm();
        onClose?.();
      }, 2000);
    } catch (err) {
      // Keep the user's text so they can retry without retyping.
      setSubmitError(
        err?.response?.status === 429
          ? 'Too many submissions. Please wait a few minutes and try again.'
          : err?.response?.status === 0 || err?.code === 'ERR_NETWORK'
            ? "We couldn't reach the server. Please check your connection and try again."
            : formatApiError(err)
      );
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-ink-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
        className="relative flex max-h-[92vh] w-full flex-col overflow-y-auto rounded-t-3xl border border-white/10 bg-ink-900 text-white shadow-2xl sm:max-w-lg sm:rounded-3xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start gap-3 border-b border-white/10 bg-ink-900/95 px-5 py-4 backdrop-blur">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-brand-600 text-white shadow-lg">
            <Icon name="messagePlus" className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="feedback-modal-title" className="text-lg font-semibold text-white">
              Share Your Feedback
            </h2>
            <p className="mt-0.5 text-xs text-ink-300">
              Tell us about issues or what you'd love to see next.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close feedback"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-ink-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-600/15 text-success-600">
              <Icon name="check" className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold text-white">Thank you!</h3>
            <p className="max-w-xs text-sm text-ink-300">
              Your feedback has been submitted. We really appreciate you taking the time.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5" noValidate>
            {/* Honeypot — off-screen, never shown to real users */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
            />

            {!!submitError && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300"
              >
                {submitError}
              </div>
            )}

            {/* Type selector */}
            <fieldset>
              <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-300">
                What type of feedback?
              </legend>
              <div role="radiogroup" aria-label="Feedback type" className="grid grid-cols-3 gap-2">
                {TYPE_ORDER.map((key) => {
                  const cfg = TYPES[key];
                  const selected = type === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setType(key)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ${cfg.focusRing} ${
                        selected
                          ? cfg.selectedCard
                          : 'border-white/10 bg-white/5 text-ink-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon name={cfg.icon} className="h-5 w-5" />
                      <span className="text-center leading-tight">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* Rating */}
            <fieldset>
              <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-300">
                How would you rate your experience?
              </legend>
              <div className="flex items-center gap-3">
                <div
                  role="radiogroup"
                  aria-label="Rating"
                  className="flex items-center gap-1"
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                      e.preventDefault();
                      setRating((r) => Math.min(5, r + 1));
                    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                      e.preventDefault();
                      setRating((r) => Math.max(1, r - 1));
                    }
                  }}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={rating === n}
                      aria-label={`${n} star${n > 1 ? 's' : ''} - ${RATING_LABELS[n].label}`}
                      onClick={() => setRating(n)}
                      className="rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      <Icon
                        name="star"
                        className={`h-6 w-6 transition-colors ${
                          n <= rating ? 'text-amber-400' : 'text-ink-600'
                        }`}
                        fill={n <= rating ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm text-ink-300">
                  <span className="mr-1">{RATING_LABELS[rating].emoji}</span>
                  {RATING_LABELS[rating].label}
                </span>
              </div>
            </fieldset>

            {/* Title */}
            <div>
              <label htmlFor="fb-title" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                {active.titleLabel}
              </label>
              <input
                id="fb-title"
                data-autofocus
                type="text"
                maxLength={120}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={active.titlePlaceholder}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? 'fb-title-error' : undefined}
                className={`w-full rounded-xl border bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:ring-2 ${
                  errors.title
                    ? 'border-red-500/70 focus:ring-red-500/30'
                    : 'border-white/10 focus:border-brand-400 focus:ring-brand-500/30'
                }`}
              />
              {errors.title && (
                <p id="fb-title-error" className="mt-1 text-xs text-red-300">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Details */}
            <div>
              <label htmlFor="fb-details" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300">
                Details
              </label>
              <textarea
                id="fb-details"
                maxLength={MAX_DETAILS}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={active.detailsPlaceholder}
                rows={4}
                aria-invalid={!!errors.details}
                aria-describedby={errors.details ? 'fb-details-error' : undefined}
                className={`w-full resize-y rounded-xl border bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:ring-2 ${
                  errors.details
                    ? 'border-red-500/70 focus:ring-red-500/30'
                    : 'border-white/10 focus:border-brand-400 focus:ring-brand-500/30'
                }`}
              />
              <div className="mt-1 flex items-start justify-between gap-3">
                {errors.details ? (
                  <p id="fb-details-error" className="text-xs text-red-300">
                    {errors.details}
                  </p>
                ) : (
                  <span />
                )}
                <span className="shrink-0 text-xs text-ink-500">
                  {details.length}/{MAX_DETAILS}
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${active.gradient} px-4 py-3 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Sending...
                </>
              ) : (
                <>
                  <Icon name="send" className="h-4 w-4" />
                  {active.submitLabel}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
