import { useEffect, useState } from 'react';
import { Icon } from '../icons/Icon';
import { FeedbackModal } from './FeedbackModal';

/**
 * Global floating feedback launcher: a fixed bottom-right pill that opens the
 * modal. Mounted once in App.jsx so it is visible on every page.
 * Also listens for a `feedback:open` window event so other components (e.g. the
 * public section's empty state) can open the modal.
 */
export const FeedbackButton = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('feedback:open', onOpen);
    return () => window.removeEventListener('feedback:open', onOpen);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label="Open feedback form"
        className="fixed bottom-4 right-4 z-[70] inline-flex items-center gap-2 rounded-full
                   bg-gradient-to-br from-indigo-500 via-brand-600 to-brand-700 px-4 py-3
                   text-sm font-semibold text-white shadow-[0_8px_30px_rgba(124,58,237,0.55)]
                   transition-transform hover:scale-105 focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2
                   sm:bottom-6 sm:right-6 sm:px-5"
      >
        <Icon name="messagePlus" className="h-5 w-5" />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      <FeedbackModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};
