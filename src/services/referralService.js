import api from './api';

/**
 * Fetch the authenticated user's full referral status.
 *
 * Returns:
 *   referralCode      — the user's 8-char code
 *   referralLink      — full share URL (https://resumeforgeai.site/register?ref=CODE)
 *   qualifiedReferrals — count of fully qualified referrals
 *   pendingReferrals  — count of sign-ups not yet qualified
 *   history[]         — [{referralId, referredUserEmail (masked), status, createdAt, qualifiedAt}]
 *   rewards[]         — [{rewardType, description, milestoneCount, grantedAt, expiresAt}]
 *   nextMilestone     — {referralsNeeded, referralsRemaining, reward}
 */
export const getReferralStatus = async () => {
  const { data } = await api.get('/api/referral/status');
  return data;
};
