import { useCallback, useEffect, useState } from 'react';
import { Icon } from '../icons/Icon';
import { getPublicFeedback } from '../../services/feedbackService';
import { relativeTime } from '../../utils/helpers';
import { StarRating } from './StarRating';

const PAGE_SIZE = 6;

const FeedbackSkeleton = () => (
  <div className="card p-6 flex flex-col gap-3">
    <div className="skeleton h-4 w-24" />
    <div className="skeleton h-5 w-3/4" />
    <div className="skeleton h-3 w-full" />
    <div className="skeleton h-3 w-5/6" />
    <div className="mt-2 flex items-center justify-between">
      <div className="skeleton h-4 w-20" />
      <div className="skeleton h-3 w-16" />
    </div>
  </div>
);

/**
 * Public "What Users Say" section. Shows general feedback only (newest first),
 * with an average rating + total count header and a Load more button.
 * New general feedback submitted via the modal is prepended live through the
 * `feedback:submitted` window event — no page reload.
 */
export const PublicFeedbackSection = () => {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ averageRating: 0, totalCount: 0, hasMore: false, page: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  const fetchPage = useCallback(async (page, append) => {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError(false);

    try {
      const res = await getPublicFeedback({ page, size: PAGE_SIZE });
      const payload = res?.data || {};
      const content = Array.isArray(payload.content) ? payload.content : [];

      setItems((prev) => (append ? [...prev, ...content] : content));
      setMeta({
        averageRating: Number(payload.averageRating) || 0,
        totalCount: Number(payload.totalCount) || content.length,
        hasMore: Boolean(payload.hasMore),
        page: Number(payload.page) || page,
      });
    } catch {
      setError(true);
    } finally {
      if (append) setLoadingMore(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(0, false);
  }, [fetchPage]);

  // Live prepend after a successful general submission.
  useEffect(() => {
    const onSubmitted = (e) => {
      const fb = e?.detail;
      if (!fb) return;
      setItems((prev) => [fb, ...prev]);
      setMeta((m) => {
        const nextTotal = m.totalCount + 1;
        const nextAvg = m.totalCount > 0
          ? (m.averageRating * m.totalCount + (fb.rating || 0)) / nextTotal
          : (fb.rating || 0);
        return {
          ...m,
          totalCount: nextTotal,
          averageRating: Math.round(nextAvg * 10) / 10,
        };
      });
    };
    window.addEventListener('feedback:submitted', onSubmitted);
    return () => window.removeEventListener('feedback:submitted', onSubmitted);
  }, []);

  const openModal = () => window.dispatchEvent(new Event('feedback:open'));

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="kicker mb-2">Community</p>
          <h2 className="text-3xl font-display font-semibold text-ink-950">What Users Say</h2>

          {!loading && !error && meta.totalCount > 0 && (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <StarRating value={Math.round(meta.averageRating)} />
              <span className="text-sm text-ink-500">
                <span className="font-semibold text-ink-950">{meta.averageRating.toFixed(1)}</span>
                {' '}average · {meta.totalCount} {meta.totalCount === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          )}
        </div>

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeedbackSkeleton />
            <FeedbackSkeleton />
            <FeedbackSkeleton />
          </div>
        )}

        {!loading && error && (
          <div className="card p-8 text-center">
            <p className="text-sm text-ink-500">We couldn't load feedback right now.</p>
            <button type="button" onClick={() => fetchPage(0, false)} className="btn-secondary mt-4">
              Try again
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="card p-10 text-center flex flex-col items-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <Icon name="messageCircle" className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-ink-950">Be the first to share feedback</h3>
            <p className="mt-1 text-sm text-ink-400 max-w-sm">
              Tried ResumeForge AI? Tell others what you think.
            </p>
            <button type="button" onClick={openModal} className="btn-primary mt-5">
              <Icon name="messagePlus" className="h-4 w-4" />
              Share your feedback
            </button>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <article key={item.id} className="card p-6 flex flex-col gap-3">
                  <StarRating value={item.rating} />
                  <h3 className="text-base font-semibold text-ink-950">{item.title}</h3>
                  <p className="flex-1 text-sm text-ink-500 leading-relaxed whitespace-pre-line">
                    {item.details}
                  </p>
                  <div className="pt-3 border-t border-surface-100 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink-950">
                      {item.author || 'Anonymous'}
                    </span>
                    <span className="text-xs text-ink-400">{relativeTime(item.createdAt)}</span>
                  </div>
                </article>
              ))}
            </div>

            {meta.hasMore && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => fetchPage(meta.page + 1, true)}
                  disabled={loadingMore}
                  className="btn-secondary"
                >
                  {loadingMore ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
