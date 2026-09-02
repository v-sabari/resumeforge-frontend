import { useEffect, useState } from 'react';
import { getReferralStatus } from '../services/referralService';
import { PageHeader } from '../components/common/PageHeader';
import { Loader } from '../components/common/Loader';
import { Alert } from '../components/common/Alert';
import { Icon } from '../components/icons/Icon';
import { formatApiError, prettyDate } from '../utils/helpers';

const MILESTONES = [
  { count: 1, reward: '3 days Premium', icon: 'sparkles', color: 'brand' },
  { count: 3, reward: 'ATS Pro Scan (unlimited)', icon: 'eye', color: 'success' },
  { count: 5, reward: '30 days Premium', icon: 'star', color: 'amber' },
];

const useCopy = () => {
  const [copied, setCopied] = useState(false);

  const copy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return { copied, copy };
};

const StatusBadge = ({ status }) => {
  const map = {
    QUALIFIED: 'bg-success-50 text-success-700 border-success-200',
    PENDING: 'bg-warning-50 text-warning-700 border-warning-200',
    REJECTED: 'bg-danger-50 text-danger-700 border-danger-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        map[status] ?? map.PENDING
      }`}
    >
      {status === 'QUALIFIED' ? '✓ Qualified' : status === 'REJECTED' ? '✕ Rejected' : '⏳ Pending'}
    </span>
  );
};

const rewardLabel = (type) =>
  ({
    PREMIUM_DAYS_3: '3 days Premium',
    ATS_PRO_UNLOCK: 'ATS Pro Scan unlock',
    PREMIUM_DAYS_30: '30 days Premium',
  })[type] ?? type;

const isRewardActive = (reward) => {
  if (!reward?.expiresAt) return true;
  return new Date(reward.expiresAt).getTime() > Date.now();
};

export const ReferralPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { copied, copy } = useCopy();

  useEffect(() => {
    getReferralStatus()
      .then(setData)
      .catch((e) => setError(formatApiError(e, 'Could not load referral data.')))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-20">
        <Loader size="lg" label="Loading referral hub…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <PageHeader eyebrow="Referrals" title="Referral hub" />
        <Alert variant="error">{error}</Alert>
      </div>
    );
  }

  const {
    referralCode,
    referralLink,
    qualifiedReferrals = 0,
    pendingReferrals = 0,
    history = [],
    rewards = [],
    nextMilestone,
  } = data ?? {};

  const shareText = `I use ResumeForge AI to build ATS-optimised resumes. Try it free → ${referralLink}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Growth"
        title="Referral hub"
        description="Share your link. Earn Premium and ATS Pro for every friend who joins."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon="star" label="Qualified referrals" value={qualifiedReferrals} accent />
        <StatCard icon="sparkles" label="Pending" value={pendingReferrals} />
        <StatCard icon="trophy" label="Rewards earned" value={rewards.length} />
      </div>

      <div className="card p-6">
        <p className="kicker mb-1">Your referral link</p>
        <h2 className="text-lg font-semibold text-ink-950 mb-4">Share and earn free Premium</h2>

        <div className="flex items-center gap-2 rounded-xl border border-surface-200 bg-surface-50 p-3 mb-4">
          <Icon name="briefcase" className="h-4 w-4 text-ink-300 shrink-0" />
          <span className="flex-1 truncate text-sm text-ink-600 font-mono select-all">
            {referralLink}
          </span>
          <button
            type="button"
            onClick={() => copy(referralLink)}
            className="btn-primary btn-sm shrink-0 gap-1.5"
          >
            <Icon name="export" className="h-3.5 w-3.5" />
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-sm gap-1.5"
          >
            <Icon name="text" className="h-3.5 w-3.5" />
            WhatsApp
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-sm gap-1.5"
          >
            <Icon name="briefcase" className="h-3.5 w-3.5" />
            LinkedIn
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-sm gap-1.5"
          >
            <Icon name="text" className="h-3.5 w-3.5" />
            X / Twitter
          </a>
          <button
            type="button"
            onClick={() => copy(shareText)}
            className="btn-secondary btn-sm gap-1.5"
          >
            <Icon name="export" className="h-3.5 w-3.5" />
            Copy message
          </button>
        </div>

        <div className="rounded-xl bg-brand-50 border border-brand-100 p-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-brand-600 font-medium">Your referral code</p>
            <p className="font-mono font-bold text-brand-800 text-lg tracking-widest mt-0.5">
              {referralCode}
            </p>
          </div>
          <button type="button" onClick={() => copy(referralCode)} className="btn-secondary btn-sm">
            Copy code
          </button>
        </div>
      </div>

      <div className="card p-6">
        <p className="kicker mb-1">Rewards</p>
        <h2 className="text-lg font-semibold text-ink-950 mb-5">Milestone rewards</h2>

        <div className="space-y-3">
          {MILESTONES.map(({ count, reward, icon }) => {
            const earned = qualifiedReferrals >= count;
            const isCurrent = !earned && nextMilestone?.referralsNeeded === count;

            return (
              <div
                key={count}
                className={`flex items-center gap-4 rounded-xl border p-4 transition-all
                  ${
                    earned
                      ? 'border-success-200 bg-success-50'
                      : isCurrent
                      ? 'border-brand-200 bg-brand-50'
                      : 'border-surface-200 bg-surface-50 opacity-60'
                  }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                  ${
                    earned
                      ? 'bg-success-100 text-success-700'
                      : isCurrent
                      ? 'bg-brand-100 text-brand-600'
                      : 'bg-surface-100 text-ink-300'
                  }`}
                >
                  {earned ? (
                    <Icon name="check" className="h-5 w-5" />
                  ) : (
                    <Icon name={icon} className="h-5 w-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${earned ? 'text-success-800' : 'text-ink-800'}`}>
                    {count} qualified referral{count !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-ink-400 mt-0.5">{reward}</p>
                </div>

                {earned ? (
                  <span className="badge-success text-xs shrink-0">Earned</span>
                ) : isCurrent ? (
                  <span className="text-xs font-medium text-brand-600 shrink-0">
                    {nextMilestone.referralsRemaining} more to go
                  </span>
                ) : (
                  <span className="text-xs text-ink-300 shrink-0">{count - qualifiedReferrals} away</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl border border-surface-200 bg-surface-50 p-4">
          <p className="text-xs font-semibold text-ink-600 mb-2">How referrals qualify</p>
          <div className="space-y-1.5">
            {[
              'Friend signs up using your link',
              'Friend verifies their email address',
              'Friend creates their first resume',
            ].map((step, i) => (
              <p key={i} className="flex items-center gap-2 text-xs text-ink-400">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-[9px] font-bold">
                  {i + 1}
                </span>
                {step}
              </p>
            ))}
          </div>
        </div>
      </div>

      {rewards.length > 0 && (
        <div className="card p-6">
          <p className="kicker mb-1">History</p>
          <h2 className="text-lg font-semibold text-ink-950 mb-4">Rewards earned</h2>
          <div className="space-y-2">
            {rewards.map((r, i) => {
              const active = isRewardActive(r);

              return (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-xl border border-surface-200 bg-surface-50 p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                      <Icon name="star" className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-800 truncate">
                        {r.description || rewardLabel(r.rewardType)}
                      </p>
                      <p className="text-xs text-ink-400 mt-0.5">
                        Earned {prettyDate(r.grantedAt)}
                        {r.expiresAt && ` · expires ${prettyDate(r.expiresAt)}`}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] shrink-0 ${active ? 'badge-success' : 'badge-secondary'}`}>
                    {active ? 'Active' : 'Expired'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card p-6">
        <p className="kicker mb-1">Referrals</p>
        <h2 className="text-lg font-semibold text-ink-950 mb-4">People you've referred</h2>

        {history.length === 0 ? (
          <div className="py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-100">
              <Icon name="sparkles" className="h-6 w-6 text-ink-300" />
            </div>
            <p className="text-sm text-ink-400">No referrals yet.</p>
            <p className="text-xs text-ink-300 mt-1">Share your link above to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-100">
            {history.map((item) => (
              <div key={item.referralId} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-800 truncate font-mono">
                    {item.referredUserEmail}
                  </p>
                  <p className="text-xs text-ink-400 mt-0.5">
                    Joined {prettyDate(item.createdAt)}
                    {item.qualifiedAt && ` · qualified ${prettyDate(item.qualifiedAt)}`}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, accent }) => (
  <div className={`card p-5 ${accent ? 'border-brand-200 bg-brand-50/40' : ''}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-1">{label}</p>
        <p className={`text-2xl font-display font-semibold ${accent ? 'text-brand-700' : 'text-ink-950'}`}>
          {value}
        </p>
      </div>
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
          accent ? 'bg-brand-100 text-brand-600' : 'bg-surface-100 text-ink-400'
        }`}
      >
        <Icon name={icon} className="h-4 w-4" />
      </div>
    </div>
  </div>
);