import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createResume, getResumeById, updateResume } from '../services/resumeService';
import { SectionCard } from '../components/builder/SectionCard';
import { CustomSectionEditor } from '../components/builder/CustomSectionEditor';
import ListField from '../components/builder/ListField';
import { Icon } from '../components/icons/Icon';
import { defaultResume, DEFAULT_SECTIONS_CONFIG } from '../utils/constants';
import { formatApiError, normaliseResume, uid } from '../utils/helpers';
import { readDraft, writeDraft, clearDraft, isLocalDraftNewer } from '../utils/autosaveStorage';
import { useUndoRedo } from './useUndoRedo';
import { MonthYearPicker } from '../components/builder/MonthYearPicker';
import { EmploymentTypeSelect } from '../components/builder/EmploymentTypeSelect';
import { ValidatedInput } from '../components/builder/ValidatedInput';
import { ReorderButtons } from '../components/builder/ReorderButtons';

const FieldGroup = ({ children }) => (
  <div className="rounded-xl border border-surface-200 bg-surface-50/60 p-4 space-y-3">
    {children}
  </div>
);

/**
 * useResumeEditor
 *
 * ALL of the resume-editing state and logic (load / save / field mutators
 * / section content renderers) lives here, in exactly one place. It used
 * to live inline inside ResumeBuilderPage.jsx; it's been extracted,
 * unchanged in behavior, so that BOTH the Editor page and the new
 * Sections page can share the SAME live resume object via one Context
 * Provider (see context/ResumeEditorContext.jsx) instead of each having
 * their own copy.
 *
 * This is what makes "real-time sync" between the Sections page and the
 * Resume Preview actually real-time and 100% correct: there is only ever
 * ONE `resume` state instance in memory for a given builder session. The
 * Sections page's Add/Edit/Delete/Reorder actions call the exact same
 * `setSectionsConfig` that the Preview panel reads from — there is no
 * serialization, no re-fetch, and no possibility of the two drifting
 * apart while you're on the Sections page. When you Save, that same
 * object is what's persisted and what PDF export reads back — so preview,
 * sections editing, and the exported file can never disagree.
 */
export function useResumeEditor(resumeId) {
  const navigate = useNavigate();
  const location = useLocation();
  const { premium, exportStatus, refreshExportStatus, refreshPremiumStatus } = useAuth();

  const [resume,      setResume]      = useState({ ...defaultResume, template: 'modern' });
  const [loading,     setLoading]     = useState(Boolean(resumeId));
  const [saving,      setSaving]      = useState(false);
  const [saveFailed,  setSaveFailed]  = useState(false);
  const [error,       setError]       = useState('');
  const [success,     setSuccess]     = useState('');
  const [currentId,   setCurrentId]   = useState(resumeId || null);

  // ── PHASE-1 DATA SAFETY: autosave + draft-mirror state ────────────────
  // `lastSavedSnapshot` is the resume object as it existed at the last
  // successful server save (or at the moment of server load). Compared
  // against `resume` to derive `isDirty`. Updated ONLY on save success or
  // server load — never on user input — so the dirty bit is stable.
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState({ ...defaultResume, template: 'modern' });

  // `lastSavedAt` is the timestamp of the last successful server save, for
  // the "Saved <time>" indicator. Null until the first save succeeds.
  const [lastSavedAt, setLastSavedAt] = useState(null);

  // `needsReauth` flips true when autosave hits a 401 (expired session).
  // While true, autosave is suspended and the builder shows a "Re-login
  // needed" banner. The draft is preserved in localStorage so the
  // bounce-back-after-login flow restores it.
  const [needsReauth, setNeedsReauth] = useState(false);

  // `autosaveInFlight` distinguishes the autosave path (no success toast,
  // no error toast — only the status indicator) from the manual save path
  // (which keeps the existing success/error toasts).
  const autosaveInFlight = useRef(false);
  // Check for a pending template selection from the /templates page
  const [template,    setTemplate]    = useState(() => {
    try {
      const pending = localStorage.getItem('pendingTemplate');
      if (pending) { localStorage.removeItem('pendingTemplate'); return pending; }
    } catch { /* ignore */ }
    return 'modern';
  });

  /* ── Derive active sectionsConfig ─────────────────────────────── */
  const sectionsConfig = useMemo(
    () => (resume.sectionsConfig && resume.sectionsConfig.length > 0)
      ? resume.sectionsConfig
      : DEFAULT_SECTIONS_CONFIG,
    [resume.sectionsConfig]
  );

  const setSectionsConfig = useCallback(
    (cfg) => setResume((p) => ({ ...p, sectionsConfig: cfg })),
    []
  );

  const visibleSections = sectionsConfig.filter((s) => s.visible);

  /* ── PHASE-1 DATA SAFETY: derive isDirty + hasContent ────────────────
   *
   * `hasContent` returns true once ANY user-visible field is non-empty — a
   * single character in `summary`, one bullet in `experience[0].bullets`,
   * a single skill, etc. This is the gate for the very first autosave: we
   * never POST a brand-new resume whose every field is still empty (which
   * would create an "Untitled resume" record the user didn't intend).
   *
   * `isDirty` compares the current `resume` against `lastSavedSnapshot` by
   * serialized shape. String compare is O(n) in resume size but resumes are
   * small (<100KB typical) and this runs only on resume state change, not on
   * every keystroke (React batches setResume calls). Avoids a deep-equal
   * dependency and the stale-closure pitfalls of comparing inside an effect.
   */
  const hasContent = useCallback((r) => {
    if (!r) return false;
    if (typeof r !== 'object') return false;
    const scalarNonEmpty = ['fullName','professionalTitle','email','phone','location',
      'linkedin','github','portfolio','summary'].some((k) => {
      const v = r[k];
      return typeof v === 'string' && v.trim().length > 0;
    });
    if (scalarNonEmpty) return true;
    const arrNonEmpty = ['skills','experience','projects','education','certifications',
      'achievements','languages'].some((k) => Array.isArray(r[k]) && r[k].length > 0);
    if (arrNonEmpty) return true;
    const custom = r.customSections;
    if (custom && typeof custom === 'object') {
      return Object.values(custom).some((c) => c && (
        (typeof c.text === 'string' && c.text.trim()) ||
        (Array.isArray(c.items) && c.items.length > 0)
      ));
    }
    return false;
  }, []);

  const isDirty = useMemo(() => {
    return JSON.stringify(resume) !== JSON.stringify(lastSavedSnapshot);
  }, [resume, lastSavedSnapshot]);

  /* ── Load resume ──────────────────────────────────────────────── */
  // PHASE-1 DATA SAFETY: after the server copy loads, check localStorage
  // for a newer draft. If the local mirror's savedAt is strictly newer than
  // the server's updatedAt, the user kept editing after the last save (or
  // the tab was closed mid-edit and reopened) — restore the local draft as
  // the live resume, but leave `lastSavedSnapshot` pointing at the server
  // copy so `isDirty` flips true and autosave immediately re-persists the
  // restored content to the server.
  useEffect(() => {
    if (!resumeId) return;
    setLoading(true); setError('');
    getResumeById(resumeId)
      .then((payload) => {
        const n = normaliseResume(payload);
        const serverResume = { ...defaultResume, ...n, template: n?.template || 'modern' };
        setResume(serverResume);
        setTemplate(n?.template || 'modern');
        setCurrentId(payload.id || resumeId);
        setLastSavedSnapshot(serverResume);
        if (payload.updatedAt) setLastSavedAt(new Date(payload.updatedAt));

        // Restore local draft if it's newer than the server copy.
        const local = readDraft(resumeId);
        if (local && isLocalDraftNewer(local, payload.updatedAt)) {
          const restored = { ...serverResume, ...normaliseResume(local.resume),
            template: local.resume?.template || n?.template || 'modern' };
          setResume(restored);
          setTemplate(restored.template);
          // lastSavedSnapshot stays at serverResume → isDirty becomes true →
          // autosave fires and re-persists the restored content.
        } else {
          // Server is authoritative — clear any stale local mirror.
          clearDraft(resumeId);
        }
      })
      .catch((e) => setError(formatApiError(e, 'Could not load this resume.')))
      .finally(() => setLoading(false));
  }, [resumeId]);

  // PHASE-1 DATA SAFETY: for a brand-new resume (no resumeId), check
  // localStorage on mount. If a draft exists under the 'new' key, restore
  // it so closing the tab mid-edit doesn't lose work. Runs once.
  useEffect(() => {
    if (resumeId) return;
    const local = readDraft('new');
    if (!local) return;
    const restored = normaliseResume(local.resume);
    if (!restored) return;
    setResume((prev) => ({ ...prev, ...restored,
      template: restored.template || prev.template || 'modern' }));
    if (restored.template) setTemplate(restored.template);
    // lastSavedSnapshot stays at defaultResume → isDirty true → autosave
    // will create the record on first meaningful change.
  }, [resumeId]);

  useEffect(() => { setResume((p) => ({ ...p, template })); }, [template]);

  /* ── CHAT-01: prefill a fresh resume from the Premium Chat Builder ──
     When the user generates a resume in the Voice/Chat builder and clicks
     "Open in Builder", the generated object is kept in sessionStorage under
     `chat_resume_draft`. On mount of a NEW resume (no resumeId), we merge
     it in so the builder opens already populated, then clear the key so it
     only applies once. */
  useEffect(() => {
    if (resumeId) return;
    const raw = sessionStorage.getItem('chat_resume_draft');
    if (!raw) return;
    sessionStorage.removeItem('chat_resume_draft');
    try {
      const draft = JSON.parse(raw);
      if (!draft || typeof draft !== 'object') return;
      const withIds = (arr, prefix) => (Array.isArray(arr) ? arr.map((it) => ({ id: it?.id || uid(prefix), ...it })) : []);
      setResume((prev) => ({
        ...prev,
        fullName:        draft.fullName        || prev.fullName,
        professionalTitle: draft.professionalTitle || prev.professionalTitle,
        email:           draft.email           || prev.email,
        phone:           draft.phone           || prev.phone,
        location:        draft.location        || prev.location,
        summary:         draft.summary         || prev.summary,
        skills:          Array.isArray(draft.skills) ? draft.skills : prev.skills,
        achievements:    Array.isArray(draft.achievements) ? draft.achievements : prev.achievements,
        experience:      withIds(draft.experience, 'exp'),
        projects:        withIds(draft.projects, 'proj'),
        education:       withIds(draft.education, 'edu'),
        certifications:  withIds(draft.certifications, 'cert'),
      }));
      setSuccess('Your AI-generated resume is ready. Review and edit below.');
    } catch {
      /* ignore malformed draft */
    }
  }, [resumeId, setSuccess]);

  /* ── Save (shared by manual Save button and autosave) ─────────── */
  //
  // PHASE-1 DATA SAFETY: a single `doSave(isManual)` function is the ONE
  // place that talks to the create/update endpoints. Both paths pass
  // `skipAuthRedirect:true` so an expired session surfaces as a rejected
  // promise (caught here) instead of an instant /login redirect that would
  // discard unsaved edits.
  //
  //   • Manual save (`isManual=true`): sets success/error toasts, sets
  //     `saving:true` for the duration (disables the Save button).
  //   • Autosave (`isManual=false`): no toasts, no `saving:true` (so the
  //     button never flickers while the user types). Only the status
  //     indicator reflects autosave state.
  //
  // 401 handling: a 401 from either path sets `needsReauth:true` and
  // suspends further autosave. The draft is already mirrored to
  // localStorage by the autosave effect, so on re-login the
  // bounce-back-to-/app/builder/:id flow restores it. Manual save 401s
  // also surface a retryable error.
  const doSave = useCallback(async (isManual) => {
    // P0-2 FIX: only gate CREATE on hasContent. A brand-new resume with no
    // content would create a meaningless "Untitled resume" record, so we skip
    // the first autosave until the user types something. But an EXISTING
    // resume (currentId set) must ALWAYS be saveable — clearing every field
    // is a legitimate edit that must persist. Previously the hasContent gate
    // applied to both create and update, so clearing all fields left the
    // status stuck on "Editing…" forever and the server was never updated.
    if (!currentId && !hasContent(resume)) {
      if (isManual) {
        setError('Add at least one field before saving.');
        setSaveFailed(false);
      }
      return;
    }
    // If a previous autosave hit 401, suspend ALL saves until re-auth.
    if (needsReauth) return;

    const payload = { ...resume, template };

    if (isManual) {
      setSaving(true); setError(''); setSuccess(''); setSaveFailed(false);
    } else {
      autosaveInFlight.current = true;
    }

    try {
      let p;
      if (currentId) {
        p = await updateResume(currentId, payload, { skipAuthRedirect: true });
      } else {
        p = await createResume(payload, { skipAuthRedirect: true });
        const id = p.id || p._id;
        if (id) {
          setCurrentId(id);
          // Migrate any 'new'-keyed local draft to the new resume id so a
          // hard refresh right after first autosave doesn't restore a stale
          // 'new' draft alongside the freshly-created server record.
          try {
            const newDraft = readDraft('new');
            if (newDraft) {
              clearDraft('new');
              writeDraft(id, newDraft.resume);
            }
          } catch { /* ignore */ }
          navigate(`/app/builder/${id}`, { replace: true });
        }
      }
      const n = normaliseResume(p);
      const next = { ...resume, ...n, template: n?.template || template };
      setResume(next);
      setTemplate(n?.template || template);
      // Save succeeded: snapshot the saved shape (so isDirty flips false),
      // stamp lastSavedAt, clear any local draft mirror, clear error state.
      setLastSavedSnapshot(next);
      setLastSavedAt(new Date());
      setSaveFailed(false);
      setNeedsReauth(false);
      clearDraft(currentId || p?.id);
      if (isManual) {
        setSuccess(currentId ? 'Resume saved successfully.'
          : 'Resume created. You can now export it.');
      } else {
        // Autosave succeeds silently — only the "Saved <time>" indicator
        // updates. Don't clobber a manual-save success toast if one is
        // already showing.
        setSuccess((s) => s);
      }
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) {
        // Session expired during save. Preserve the draft (already mirrored
        // to localStorage by the autosave effect), surface a re-login
        // prompt, and suspend further saves until the user re-logs in.
        setNeedsReauth(true);
        setSaveFailed(true);
        setError('Your session has expired. Please re-login — your draft is preserved and will be restored after you sign back in.');
        // Mirror the draft to localStorage under both 'new' and the resume
        // id (if known) so the bounce-back-after-login flow restores it.
        writeDraft(currentId, resume);
        if (!currentId) writeDraft('new', resume);
      } else {
        // Non-401 failure (network, 5xx, validation): keep the draft as-is,
        // surface a retryable error. We never discard edits.
        setSaveFailed(true);
        setError(`Save failed. ${formatApiError(e, 'Could not save the resume.')} Your changes are still here.`);
      }
    } finally {
      if (isManual) setSaving(false);
      autosaveInFlight.current = false;
    }
  }, [resume, template, currentId, needsReauth, hasContent, navigate]);

  // Manual save — the Save button's onClick.
  const saveResume = useCallback(() => doSave(true), [doSave]);

  /* ── PHASE-1 DATA SAFETY: debounced autosave (~2s after last edit) ──
   *
   * Fires when ALL of:
   *   • isDirty            — there is something to save
   *   • (!currentId ? hasContent : true) — new resumes need content before
   *     the first create; existing resumes always save (P0-2: clearing all
   *     fields must persist).
   *   • !saving            — not already saving (manual or autosave)
   *   • !needsReauth       — not suspended waiting for re-login
   *   • !autosaveInFlight  — defensive: never double-fire
   *
   * The 2s debounce lets the user type several characters (or paste a
   * bullet list) before triggering a save, so we don't pound the API on
   * every keystroke. The timer is cleared on cleanup so navigation away
   * mid-typing doesn't fire a stray save.
   */
  useEffect(() => {
    if (!isDirty) return;
    // P0-2 FIX: existing resumes always autosave (even when cleared); only
    // gate the very first CREATE on hasContent.
    if (!currentId && !hasContent(resume)) return;
    if (saving) return;
    if (needsReauth) return;
    if (autosaveInFlight.current) return;

    // Mirror the draft to localStorage IMMEDIATELY (not debounced) so a
    // tab close mid-edit always has the latest content. The actual API
    // call is debounced.
    writeDraft(currentId, resume);

    const timer = setTimeout(() => { doSave(false); }, 2000);
    return () => clearTimeout(timer);
  }, [resume, isDirty, saving, needsReauth, currentId, hasContent, doSave]);

  /* ── P0-2: backoff retry on autosave failure ───────────────────────
   *
   * When an autosave fails with a non-401 error (network drop, 5xx), the
   * status shows "Save failed – retry" but the user had to click it.
   * This schedules up to 3 automatic retries with exponential backoff
   * (4s, 8s, 16s) before giving up and leaving the manual retry button.
   * 401 (needsReauth) is NOT retried — it requires re-login.
   */
  const retryCount = useRef(0);
  useEffect(() => {
    if (!saveFailed || needsReauth) {
      retryCount.current = 0;
      return;
    }
    if (retryCount.current >= 3) return; // give up; manual retry button shown
    const delay = Math.min(4000 * 2 ** retryCount.current, 16000);
    retryCount.current += 1;
    const t = setTimeout(() => { doSave(false); }, delay);
    return () => clearTimeout(t);
  }, [saveFailed, needsReauth, doSave]);

  /* ── P0-2: flush pending changes on tab hide + route change ────────
   *
   * visibilitychange (tab switch/minimize): fire a save immediately (no
   * debounce) if dirty — the user may not come back, and mobile browsers
   * may discard the tab. beforeunload still warns on actual close.
   *
   * Route change (SPA navigation away from the builder): React Router's
   * location changes before this component unmounts; we flush a
   * fire-and-forget save here so navigating to /app/dashboard doesn't lose
   * the last 2s of edits. State updates after unmount are no-ops in
   * React 18, so only the API call (the part that matters) lands.
   */
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && isDirty && !saving && !needsReauth && !autosaveInFlight.current) {
        doSave(false);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [isDirty, saving, needsReauth, doSave]);

  const lastPath = useRef(null);
  useEffect(() => {
    const path = location.pathname;
    if (lastPath.current === null) { lastPath.current = path; return; }
    if (path !== lastPath.current) {
      lastPath.current = path;
      if (isDirty && !saving && !needsReauth && !autosaveInFlight.current) {
        doSave(false); // fire-and-forget flush on SPA route change
      }
    }
  }, [location.pathname, isDirty, saving, needsReauth, doSave]);

  /* ── PHASE-1 DATA SAFETY: beforeunload warning while unsaved ──────
   *
   * Browsers ignore the custom message text and show a generic "Changes
   * you made may not be saved" dialog. We only attach the handler when
   * there is genuinely unsaved or failed-to-save work — a clean tab close
   * (saved state) should NOT prompt.
   */
  useEffect(() => {
    const shouldWarn = isDirty || saveFailed || needsReauth;
    if (!shouldWarn) return;
    const handler = (e) => {
      e.preventDefault();
      // Legacy browsers require returnValue to be set; modern ones ignore
      // the message but require the call.
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty, saveFailed, needsReauth]);

  /* ── PHASE-1 DATA SAFETY: re-login navigation helper ──────────────
   *
   * Called by the "Re-login" button in the builder's status banner. Sets
   * `auth_redirect` so LoginPage bounces the user back to /app/builder/:id
   * after a successful re-login, then navigates to /login. The draft is
   * already in localStorage and will be restored by the load effect above
   * when the user lands back on this route.
   */
  const goToReLogin = useCallback(() => {
    try {
      sessionStorage.setItem('auth_redirect',
        window.location.pathname + window.location.search);
    } catch { /* ignore */ }
    window.location.href = '/login';
  }, []);

  /* ── Import ───────────────────────────────────────────────────── */
  const handleImport = useCallback((parsed) => {
    setResume((prev) => ({
      ...prev,
      fullName:     parsed.fullName     || prev.fullName,
      summary:      parsed.summary      || prev.summary,
      skills:       parsed.skills?.length       ? parsed.skills       : prev.skills,
      achievements: parsed.achievements?.length ? parsed.achievements : prev.achievements,
    }));
    setSuccess('Resume content imported. Review and edit each section below.');
  }, []);

  /* ── PHASE-2e: undo/redo (50-step history) ─────────────────────── */
  // Wraps setResume so every USER-INITIATED mutation pushes the previous
  // resume snapshot onto the undo stack. Server-load and autosave-restore
  // use the raw setResume (via `setResumeSilent` below) to avoid polluting
  // the stack. Keyboard shortcuts (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z) are
  // attached inside the hook.
  const { pushHistory, undo, redo, canUndo, canRedo, clear: clearHistory } = useUndoRedo(setResume);

  /* ── State mutators ───────────────────────────────────────────── */
  // PHASE-2e: every mutator pushes history BEFORE applying the change.
  // The snapshot is the PREVIOUS state (the `p` in the updater), captured
  // before the new value is written. This is the standard undo pattern.
  const top = (f, v) => setResume((p) => { pushHistory(p); return { ...p, [f]: v }; });
  const refreshStatuses = () => Promise.all([refreshExportStatus(), refreshPremiumStatus()]);

  // PHASE-2d: move an item up/down within an array section (experience,
  // projects, education, certifications). Pushes history first so the
  // reorder is undoable.
  const moveItem = useCallback((section, index, direction) => {
    setResume((p) => {
      const arr = p[section];
      if (!Array.isArray(arr) || index < 0 || index >= arr.length) return p;
      const swapWith = direction === 'up' ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= arr.length) return p;
      pushHistory(p);
      const next = arr.slice();
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return { ...p, [section]: next };
    });
  }, [pushHistory]);

  const arr = (section, id, field, value) =>
    setResume((p) => { pushHistory(p); return {
      ...p,
      [section]: (p[section] || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }; });

  const removeItem = (section, id) =>
    setResume((p) => { pushHistory(p); return { ...p, [section]: (p[section] || []).filter((item) => item.id !== id) }; });

  const addExp  = () => setResume((p) => { pushHistory(p); return { ...p, experience:     [...(p.experience    ||[]), { id: uid('exp'),  company: '', role: '', location: '', employmentType: '', startDate: '', endDate: '', summary: '', bullets: [] }] }; });
  const addProj = () => setResume((p) => { pushHistory(p); return { ...p, projects:       [...(p.projects      ||[]), { id: uid('proj'), name: '', role: '', link: '', github: '', techStack: '', description: '', highlights: [] }] }; });
  const addEdu  = () => setResume((p) => { pushHistory(p); return { ...p, education:      [...(p.education     ||[]), { id: uid('edu'),  institution: '', degree: '', field: '', grade: '', startDate: '', endDate: '', details: '' }] }; });
  const addCert = () => setResume((p) => { pushHistory(p); return { ...p, certifications: [...(p.certifications||[]), { id: uid('cert'), name: '', issuer: '', year: '', credentialUrl: '' }] }; });

  const updateCert = (index, field, value) =>
    setResume((p) => { pushHistory(p); return {
      ...p,
      certifications: (p.certifications || []).map((cert, i) => {
        if (i !== index) return cert;
        if (typeof cert === 'string') return { id: uid('cert'), name: field === 'name' ? value : cert, issuer: '', year: '' };
        return { ...cert, [field]: value };
      }),
    }; });

  const removeCert = (index) =>
    setResume((p) => { pushHistory(p); return { ...p, certifications: (p.certifications || []).filter((_, i) => i !== index) }; });

  /* ── Custom section content ───────────────────────────────────── */
  const getCustomContent = (id) =>
    (resume.customSections || {})[id] || { mode: 'text', text: '', items: [] };

  const setCustomContent = (id, content) =>
    setResume((p) => ({ ...p, customSections: { ...(p.customSections || {}), [id]: content } }));

  /* ════════════════════════════════════════════════════════════════
     SECTION RENDERERS — identical to the original inline versions.
     ════════════════════════════════════════════════════════════════ */

  const renderStandard = (sec) => {
    switch (sec.key) {

      case 'basics': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Profile" title={sec.label}
          description="Your contact details appear at the top of every resume.">
          {/* PHASE-2c + 2f: ValidatedInput replaces the bare <input> for
              email/phone/URL fields — adds inline validation on blur,
              aria-invalid, aria-describedby error text, and auto-prepends
              https:// to URL fields. Plain text fields (fullName,
              professionalTitle, location) use ValidatedInput with type=text
              (no validation, but still gets the programmatic label). */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ValidatedInput id={`basics-fullName`} label="Full name" type="text"
              value={resume.fullName} onChange={(v) => top('fullName', v)}
              placeholder="Priya Sharma" />
            <ValidatedInput id={`basics-professionalTitle`} label="Professional title" type="text"
              value={resume.professionalTitle} onChange={(v) => top('professionalTitle', v)}
              placeholder="Senior Full-Stack Engineer" />
            <ValidatedInput id={`basics-email`} label="Email" type="email"
              value={resume.email} onChange={(v) => top('email', v)}
              placeholder="priya@example.com" />
            <ValidatedInput id={`basics-phone`} label="Phone" type="tel"
              value={resume.phone} onChange={(v) => top('phone', v)}
              placeholder="+91 98765 43210" />
            <ValidatedInput id={`basics-location`} label="Location / City" type="text"
              value={resume.location} onChange={(v) => top('location', v)}
              placeholder="Chennai, Tamil Nadu" />
            <ValidatedInput id={`basics-linkedin`} label="LinkedIn URL" type="url"
              value={resume.linkedin} onChange={(v) => top('linkedin', v)}
              placeholder="https://linkedin.com/in/priyasharma" />
            <ValidatedInput id={`basics-github`} label="GitHub URL" type="url"
              value={resume.github} onChange={(v) => top('github', v)}
              placeholder="https://github.com/priyasharma" />
            <ValidatedInput id={`basics-portfolio`} label="Portfolio URL" type="url"
              value={resume.portfolio} onChange={(v) => top('portfolio', v)}
              placeholder="https://priyasharma.dev"
              containerClassName="sm:col-span-2" />
          </div>
        </SectionCard>
      );

      case 'summary': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Summary" title={sec.label}
          description="A 2–4 sentence overview of your background and target role.">
          <textarea className="input min-h-[100px] resize-none" value={resume.summary || ''}
            onChange={(e) => top('summary', e.target.value)}
            placeholder="Write a concise summary of your professional background…" />
        </SectionCard>
      );

      case 'skills': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Skills" title={sec.label}
          description="One skill per line. Tools, frameworks, methodologies.">
          <ListField className="input min-h-[100px] resize-none" value={resume.skills}
            onChange={(v) => top('skills', v)}
            placeholder={"React\nNode.js\nPostgreSQL\nFigma\nAgile"} />
        </SectionCard>
      );

      case 'experience': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Experience" title={sec.label}
          description="Reverse chronological order. Focus on measurable impact."
          actions={<button type="button" onClick={addExp} className="btn-secondary btn-sm gap-1"><Icon name="plus" className="h-3.5 w-3.5" />Add role</button>}>
          {!(resume.experience||[]).length ? (
            <div className="rounded-xl border border-dashed border-surface-300 bg-surface-50 p-4 text-sm text-ink-500">
              No experience yet. Click <span className="font-semibold">Add role</span> to start.
            </div>
          ) : (resume.experience || []).map((exp, idx) => (
            <FieldGroup key={exp.id}>
              {/* PHASE-2d: reorder buttons next to the role label */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ReorderButtons index={idx} total={(resume.experience||[]).length}
                    onMove={(i, dir) => moveItem('experience', i, dir)} itemLabel="role" />
                  <p className="text-sm font-semibold text-ink-900">Role {idx + 1}</p>
                </div>
                <button type="button" onClick={() => removeItem('experience', exp.id)} className="btn-danger btn-sm"><Icon name="trash" className="h-3.5 w-3.5" />Remove</button>
              </div>
              {/* PHASE-2f: every input has htmlFor+id (via ValidatedInput / the
                  labeled wrappers below). Date inputs use MonthYearPicker
                  (PHASE-2a) with legacy string preservation. Employment type
                  uses EmploymentTypeSelect (PHASE-2b). */}
              <div className="grid gap-3 sm:grid-cols-2">
                <ValidatedInput id={`exp-${exp.id}-role`} label="Job title" type="text"
                  value={exp.role} onChange={(v) => arr('experience', exp.id, 'role', v)}
                  placeholder="Frontend Developer" />
                <ValidatedInput id={`exp-${exp.id}-company`} label="Company" type="text"
                  value={exp.company} onChange={(v) => arr('experience', exp.id, 'company', v)}
                  placeholder="Acme Technologies (India)" />
                <ValidatedInput id={`exp-${exp.id}-location`} label="Location" type="text"
                  value={exp.location} onChange={(v) => arr('experience', exp.id, 'location', v)}
                  placeholder="Bengaluru, Karnataka" />
                <EmploymentTypeSelect id={`exp-${exp.id}-employmentType`} label="Employment type"
                  value={exp.employmentType} onChange={(v) => arr('experience', exp.id, 'employmentType', v)} />
                <MonthYearPicker idPrefix={`exp-${exp.id}-start`} label="Start date"
                  value={exp.startDate} onChange={(v) => arr('experience', exp.id, 'startDate', v)} />
                <MonthYearPicker idPrefix={`exp-${exp.id}-end`} label="End date"
                  value={exp.endDate} onChange={(v) => arr('experience', exp.id, 'endDate', v)}
                  showPresentCheckbox
                  isPresent={(exp.endDate || '').toLowerCase() === 'present'}
                  onPresentChange={(checked) => arr('experience', exp.id, 'endDate', checked ? 'Present' : '')} />
              </div>
              <div>
                <label className="label" htmlFor={`exp-${exp.id}-summary`}>Role summary</label>
                <textarea id={`exp-${exp.id}-summary`} className="input min-h-[80px] resize-none text-sm"
                  value={exp.summary||''}
                  onChange={(e)=>arr('experience',exp.id,'summary',e.target.value)}
                  placeholder="One or two lines describing scope and focus."/></div>
              <div>
                <label className="label" htmlFor={`exp-${exp.id}-bullets`}>Bullet points (one per line)</label>
                <ListField id={`exp-${exp.id}-bullets`} className="input min-h-[100px] resize-none text-sm"
                  value={exp.bullets}
                  onChange={(v)=>arr('experience',exp.id,'bullets',v)}
                  placeholder={"Led a team of 4 engineers to ship X\nImproved API latency by 35%"}/></div>
            </FieldGroup>
          ))}
        </SectionCard>
      );

      case 'projects': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Projects" title={sec.label}
          description="Personal, academic, or freelance projects worth highlighting."
          actions={<button type="button" onClick={addProj} className="btn-secondary btn-sm gap-1"><Icon name="plus" className="h-3.5 w-3.5" />Add project</button>}>
          {!(resume.projects||[]).length ? (
            <div className="rounded-xl border border-dashed border-surface-300 bg-surface-50 p-4 text-sm text-ink-500">No projects added yet.</div>
          ) : (resume.projects||[]).map((proj, idx) => (
            <FieldGroup key={proj.id}>
              {/* PHASE-2d: reorder buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ReorderButtons index={idx} total={(resume.projects||[]).length}
                    onMove={(i, dir) => moveItem('projects', i, dir)} itemLabel="project" />
                  <p className="text-sm font-semibold text-ink-900">Project {idx + 1}</p>
                </div>
                <button type="button" onClick={() => removeItem('projects', proj.id)} className="btn-danger btn-sm"><Icon name="trash" className="h-3.5 w-3.5" />Remove</button>
              </div>
              {/* PHASE-2c + 2f: ValidatedInput for URL fields (link, github),
                  labeled plain inputs for text fields. */}
              <div className="grid gap-3 sm:grid-cols-2">
                <ValidatedInput id={`proj-${proj.id}-name`} label="Project name" type="text"
                  value={proj.name} onChange={(v) => arr('projects', proj.id, 'name', v)}
                  placeholder="ResumeForge AI" />
                <ValidatedInput id={`proj-${proj.id}-role`} label="Your role" type="text"
                  value={proj.role} onChange={(v) => arr('projects', proj.id, 'role', v)}
                  placeholder="Full Stack Developer" />
                <ValidatedInput id={`proj-${proj.id}-link`} label="Live URL" type="url"
                  value={proj.link} onChange={(v) => arr('projects', proj.id, 'link', v)}
                  placeholder="https://example.com" />
                <ValidatedInput id={`proj-${proj.id}-github`} label="GitHub URL" type="url"
                  value={proj.github} onChange={(v) => arr('projects', proj.id, 'github', v)}
                  placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="label" htmlFor={`proj-${proj.id}-techStack`}>Tech stack</label>
                <input id={`proj-${proj.id}-techStack`} className="input" value={proj.techStack||''} onChange={(e)=>arr('projects',proj.id,'techStack',e.target.value)} placeholder="React, Spring Boot, PostgreSQL"/></div>
              <div>
                <label className="label" htmlFor={`proj-${proj.id}-description`}>Description</label>
                <textarea id={`proj-${proj.id}-description`} className="input min-h-[100px] resize-none text-sm" value={proj.description||''}
                  onChange={(e)=>arr('projects',proj.id,'description',e.target.value)}
                  placeholder="What it does, your contribution, and why it matters."/></div>
              <div>
                <label className="label" htmlFor={`proj-${proj.id}-highlights`}>Key highlights (one per line)</label>
                <ListField id={`proj-${proj.id}-highlights`} className="input min-h-[100px] resize-none text-sm"
                  value={proj.highlights}
                  onChange={(v)=>arr('projects',proj.id,'highlights',v)}
                  placeholder={"Implemented JWT auth\nBuilt ATS scoring workflow\nDeployed on AWS"}/></div>
            </FieldGroup>
          ))}
        </SectionCard>
      );

      case 'education': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Education" title={sec.label}
          description="Institution, degree, specialization, and results."
          actions={<button type="button" onClick={addEdu} className="btn-secondary btn-sm gap-1"><Icon name="plus" className="h-3.5 w-3.5" />Add education</button>}>
          {!(resume.education||[]).length ? (
            <div className="rounded-xl border border-dashed border-surface-300 bg-surface-50 p-4 text-sm text-ink-500">No education added yet.</div>
          ) : (resume.education||[]).map((edu, idx) => (
            <FieldGroup key={edu.id}>
              {/* PHASE-2d: reorder buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ReorderButtons index={idx} total={(resume.education||[]).length}
                    onMove={(i, dir) => moveItem('education', i, dir)} itemLabel="education" />
                  <p className="text-sm font-semibold text-ink-900">Education {idx + 1}</p>
                </div>
                <button type="button" onClick={() => removeItem('education', edu.id)} className="btn-danger btn-sm"><Icon name="trash" className="h-3.5 w-3.5" />Remove</button>
              </div>
              {/* PHASE-2a: date inputs use MonthYearPicker; PHASE-2f: all
                  inputs have htmlFor+id. */}
              <div className="grid gap-3 sm:grid-cols-2">
                <ValidatedInput id={`edu-${edu.id}-institution`} label="Institution" type="text"
                  value={edu.institution} onChange={(v) => arr('education', edu.id, 'institution', v)}
                  placeholder="XYZ Engineering College" />
                <ValidatedInput id={`edu-${edu.id}-degree`} label="Degree" type="text"
                  value={edu.degree} onChange={(v) => arr('education', edu.id, 'degree', v)}
                  placeholder="B.E / B.Tech" />
                <ValidatedInput id={`edu-${edu.id}-field`} label="Field of study" type="text"
                  value={edu.field} onChange={(v) => arr('education', edu.id, 'field', v)}
                  placeholder="Computer Science" />
                <ValidatedInput id={`edu-${edu.id}-grade`} label="Grade / CGPA" type="text"
                  value={edu.grade} onChange={(v) => arr('education', edu.id, 'grade', v)}
                  placeholder="8.4 CGPA" />
                <MonthYearPicker idPrefix={`edu-${edu.id}-start`} label="Start date"
                  value={edu.startDate} onChange={(v) => arr('education', edu.id, 'startDate', v)} />
                <MonthYearPicker idPrefix={`edu-${edu.id}-end`} label="End date"
                  value={edu.endDate} onChange={(v) => arr('education', edu.id, 'endDate', v)}
                  showPresentCheckbox
                  isPresent={(edu.endDate || '').toLowerCase() === 'present'}
                  onPresentChange={(checked) => arr('education', edu.id, 'endDate', checked ? 'Present' : '')} />
              </div>
              <div>
                <label className="label" htmlFor={`edu-${edu.id}-details`}>Additional details</label>
                <textarea id={`edu-${edu.id}-details`} className="input min-h-[80px] resize-none text-sm" value={edu.details||''}
                  onChange={(e)=>arr('education',edu.id,'details',e.target.value)}
                  placeholder="Coursework, honours, scholarships…"/></div>
            </FieldGroup>
          ))}
        </SectionCard>
      );

      case 'certifications': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Certifications" title={sec.label}
          description="Certifications with issuer, year, and credential link."
          actions={<button type="button" onClick={addCert} className="btn-secondary btn-sm gap-1"><Icon name="plus" className="h-3.5 w-3.5" />Add certification</button>}>
          {!(resume.certifications||[]).length ? (
            <div className="rounded-xl border border-dashed border-surface-300 bg-surface-50 p-4 text-sm text-ink-500">No certifications added yet.</div>
          ) : (resume.certifications||[]).map((cert, idx) => {
            const c = typeof cert==='string'
              ? { id: uid('cert'), name: cert, issuer: '', year: '', credentialUrl: '' }
              : { id: cert?.id||uid('cert'), name: cert?.name||'', issuer: cert?.issuer||'', year: cert?.year||'', credentialUrl: cert?.credentialUrl||'' };
            return (
              <FieldGroup key={c.id}>
                {/* PHASE-2d: reorder buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ReorderButtons index={idx} total={(resume.certifications||[]).length}
                      onMove={(i, dir) => moveItem('certifications', i, dir)} itemLabel="certification" />
                    <p className="text-sm font-semibold text-ink-900">Certification {idx + 1}</p>
                  </div>
                  <button type="button" onClick={() => removeCert(idx)} className="btn-danger btn-sm"><Icon name="trash" className="h-3.5 w-3.5" />Remove</button>
                </div>
                {/* PHASE-2c + 2f: ValidatedInput for credential URL; labeled
                    inputs for text fields; Year stays a text input since the
                    brief specifies month+year pickers for date ranges
                    (start/end), and a single 'Year' field is already a clean
                    year-only input. */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <ValidatedInput id={`cert-${c.id}-name`} label="Certification name" type="text"
                    value={c.name} onChange={(v) => updateCert(idx, 'name', v)}
                    placeholder="AWS Certified Solutions Architect"
                    containerClassName="sm:col-span-2" />
                  <ValidatedInput id={`cert-${c.id}-issuer`} label="Issuer" type="text"
                    value={c.issuer} onChange={(v) => updateCert(idx, 'issuer', v)}
                    placeholder="Amazon Web Services" />
                  <ValidatedInput id={`cert-${c.id}-year`} label="Year" type="text"
                    value={c.year} onChange={(v) => updateCert(idx, 'year', v)}
                    placeholder="2024" />
                  <ValidatedInput id={`cert-${c.id}-credentialUrl`} label="Credential URL" type="url"
                    value={c.credentialUrl} onChange={(v) => updateCert(idx, 'credentialUrl', v)}
                    placeholder="https://www.credly.com/…"
                    containerClassName="sm:col-span-2" />
                </div>
              </FieldGroup>
            );
          })}
        </SectionCard>
      );

      case 'achievements': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Achievements" title={sec.label}
          description="One achievement per line. Awards, recognition, and notable accomplishments.">
          <ListField className="input min-h-[100px] resize-none" value={resume.achievements}
            onChange={(v) => top('achievements', v)}
            placeholder={"Won company hackathon 2024\nLed migration reducing costs by 40%"} />
        </SectionCard>
      );

      case 'languages': return (
        <SectionCard key={sec.id} id={`section-${sec.id}`} eyebrow="Languages" title={sec.label}
          description="One language per line. Include proficiency levels.">
          <ListField className="input min-h-[80px] resize-none" value={resume.languages}
            onChange={(v) => top('languages', v)}
            placeholder={"English — Fluent\nTamil — Native\nHindi — Intermediate"} />
        </SectionCard>
      );

      default:
        return renderCustom(sec);
    }
  };

  const renderCustom = (sec) => (
    <SectionCard key={sec.id} id={`section-${sec.id}`}
      eyebrow={sec.type === 'custom' ? 'Custom section' : sec.label}
      title={sec.label}
      description={
        sec.type === 'custom'
          ? 'Add freeform content or a bullet list. Choose Paragraph or Bullet list mode below.'
          : `Add content for the ${sec.label} section.`
      }>
      <CustomSectionEditor
        section={sec}
        content={getCustomContent(sec.id)}
        onChange={(content) => setCustomContent(sec.id, content)}
      />
    </SectionCard>
  );

  return {
    // state
    resume, setResume, loading, saving, saveFailed, error, setError, success, setSuccess,
    currentId, template, setTemplate,
    sectionsConfig, setSectionsConfig, visibleSections,
    premium, exportStatus,
    // PHASE-1 DATA SAFETY: autosave status exposed to the header indicator
    isDirty, lastSavedAt, needsReauth, goToReLogin,
    // PHASE-2d: reorder (move up/down)
    moveItem,
    // PHASE-2e: undo/redo (exposed for the header buttons + keyboard shortcuts)
    undo, redo, canUndo, canRedo,
    // actions
    saveResume, handleImport, refreshStatuses,
    top, arr, removeItem, addExp, addProj, addEdu, addCert, updateCert, removeCert,
    getCustomContent, setCustomContent,
    // renderers
    renderStandard, renderCustom,
  };
}
