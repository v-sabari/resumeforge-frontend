/**
 * PHASE-1 DATA SAFETY — local draft mirror.
 *
 * Wraps localStorage in try/catch (Safari private mode, disabled storage,
 * quota-exceeded, SSR environments all throw on access). Mirrors the resume
 * draft under `rf:draft:<resumeId-or-'new'>` so a hard refresh, a closed tab,
 * or an expired session never silently discards the user's edits.
 *
 * Restore policy: if the local draft's `savedAt` is NEWER than the server
 * copy's `updatedAt`, the local draft wins (the user kept typing after the
 * last server save). Otherwise the server copy wins and the local mirror is
 * cleared. This is enforced by the caller (useResumeEditor), not here — this
 * module is intentionally side-effect-free apart from storage I/O.
 */

const PREFIX = 'rf:draft:';

const key = (resumeId) => `${PREFIX}${resumeId || 'new'}`;

/**
 * Read a mirrored draft. Returns null if storage is unavailable, the key is
 * absent, or the payload is unparseable. Never throws.
 */
export const readDraft = (resumeId) => {
  try {
    const raw = localStorage.getItem(key(resumeId));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.resume || typeof parsed.resume !== 'object') return null;
    if (typeof parsed.savedAt !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
};

/**
 * Write a mirrored draft. Silently no-ops on storage failure — the autosave
 * flow itself is the authoritative persistence path; this is purely a
 * belt-and-braces local copy for offline / tab-close recovery.
 */
export const writeDraft = (resumeId, resume) => {
  try {
    localStorage.setItem(
      key(resumeId),
      JSON.stringify({ resume, savedAt: new Date().toISOString() })
    );
  } catch {
    /* quota / disabled / private mode — best-effort */
  }
};

/**
 * Remove the mirrored draft. Called after a successful server save so the
 * local copy does not shadow the server copy on next load. Never throws.
 */
export const clearDraft = (resumeId) => {
  try {
    localStorage.removeItem(key(resumeId));
  } catch {
    /* ignore */
  }
};

/**
 * Compare the local draft's savedAt against the server copy's updatedAt.
 * Returns true when the local draft is strictly newer (i.e. the user kept
 * editing after the last successful server save). Returns false otherwise,
 * including when either timestamp is missing or unparseable.
 */
export const isLocalDraftNewer = (local, serverUpdatedAt) => {
  if (!local || !local.savedAt) return false;
  if (!serverUpdatedAt) return true; // server has no updatedAt (new resume, local draft exists)
  const localTs = Date.parse(local.savedAt);
  const serverTs = Date.parse(serverUpdatedAt);
  if (Number.isNaN(localTs)) return false;
  if (Number.isNaN(serverTs)) return true;
  return localTs > serverTs;
};
