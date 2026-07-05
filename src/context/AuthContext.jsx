import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../services/authService';
import { getPremiumStatus } from '../services/premiumService';
import { getExportStatus } from '../services/exportService';
import { INACTIVITY_TIMEOUT_MS } from '../utils/constants';
import { formatApiError } from '../utils/helpers';

const AuthContext = createContext(null);

const normalisePremium = (v) => {
  if (!v) return null;
  return { ...v, isPremium: Boolean(v.isPremium ?? v.premium) };
};

const normaliseExport = (v) => {
  if (!v) return null;
  return {
    ...v,
    // FIX 7: backend ExportStatusResponse uses exportsToday, not usedExports/exportCount.
    // Previous mapping v.usedExports ?? v.exportCount ?? 0 always resolved to 0,
    // making the export counter always show 0 regardless of actual usage.
    usedExports: v.exportsToday ?? v.usedExports ?? v.exportCount ?? 0,
    remainingFreeExports: v.remainingFreeExports ?? v.remaining ?? 0,
    canExport: Boolean(v.canExport ?? v.allowed),
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [premium, setPremium] = useState({
  isPremium: false,
  _loaded: false
});
  const [exportStatus, setExportStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);

  const inactivityTimer = useRef(null);
  const warningTimer = useRef(null);

  // BUG-004 FIX: the JWT is no longer stored in localStorage — it lives only
  // in an httpOnly cookie the browser manages automatically (see api.js's
  // withCredentials:true and AuthController.setAuthCookie on the backend).
  // logout() clears local React state immediately (so existing callers that
  // call logout() then navigate() right away keep working unchanged) and
  // fires the cookie-clearing API call in the background, since client-side
  // JS has no way to delete an httpOnly cookie itself.
  const logout = useCallback(() => {
    setUser(null);
    setPremium(null);
    setExportStatus(null);
    setShowInactivityWarning(false);
    clearTimeout(inactivityTimer.current);
    clearTimeout(warningTimer.current);

    logoutUser().catch(() => {
      // Best-effort: local state is already cleared. If this fails (e.g.
      // a network blip), the cookie will simply expire on its own — worst
      // case is a stale cookie with nothing server-side to authenticate
      // (any 401 from a subsequent request already redirects to /login).
    });
  }, []);

  const resetInactivityTimer = useCallback(() => {
    clearTimeout(inactivityTimer.current);
    clearTimeout(warningTimer.current);
    setShowInactivityWarning(false);

    warningTimer.current = setTimeout(() => {
      setShowInactivityWarning(true);
    }, INACTIVITY_TIMEOUT_MS - 30000);

    inactivityTimer.current = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT_MS);
  }, [logout]);

  useEffect(() => {
    if (!user) return;

    const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];

    events.forEach((eventName) => {
      window.addEventListener(eventName, resetInactivityTimer, { passive: true });
    });

    resetInactivityTimer();

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, resetInactivityTimer);
      });
      clearTimeout(inactivityTimer.current);
      clearTimeout(warningTimer.current);
    };
  }, [user, resetInactivityTimer]);

  const refreshPremiumStatus = useCallback(async () => {
    try {
      const res = await getPremiumStatus();
      const next = normalisePremium(res?.premium || res?.data || res);
setPremium({
  ...next,
  _loaded: true
});
      return next;
    } catch {
      setPremium(null);
      return null;
    }
  }, []);

  const refreshExportStatus = useCallback(async () => {
    try {
      const res = await getExportStatus();
      const next = normaliseExport(res?.status || res?.data || res);
      setExportStatus(next);
      return next;
    } catch {
      setExportStatus(null);
      return null;
    }
  }, []);

  useEffect(() => {
    // BUG-004 FIX: previously gated on localStorage.getItem(TOKEN_STORAGE_KEY)
    // before even trying getCurrentUser(). There's no client-readable token
    // to check anymore — the httpOnly cookie (if any) is sent automatically
    // by the browser, so we just attempt the call and treat failure as
    // logged-out, same as the existing catch block already did.
    const hydrate = async () => {
      try {
        const me = await getCurrentUser();
        setUser(me.user || me.data || me);
        await Promise.all([refreshPremiumStatus(), refreshExportStatus()]);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, [refreshPremiumStatus, refreshExportStatus]);

  const login = async (payload) => {
    // BUG-004 FIX: the backend now sets the httpOnly cookie directly on the
    // login response (see AuthController.login) — there's no token in the
    // body anymore for the frontend to store. getCurrentUser() picks up the
    // freshly-set cookie automatically via withCredentials.
    await loginUser(payload);

    const me = await getCurrentUser();
    setUser(me.user || me.data || me);

    await Promise.all([refreshPremiumStatus(), refreshExportStatus()]);

    return me;
  };

  const register = async (payload) => {
    // OTP flow: register should NOT auto-login
    const res = await registerUser(payload);
    return res;
  };

  const value = useMemo(
    () => ({
      user,
      premium,
      exportStatus,
      loading,
      showInactivityWarning,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshPremiumStatus,
      refreshExportStatus,
      setUser,
      setPremium,
      errorFormatter: formatApiError,
      dismissInactivityWarning: () => {
        setShowInactivityWarning(false);
        resetInactivityTimer();
      },
    }),
    [
      user,
      premium,
      exportStatus,
      loading,
      showInactivityWarning,
      logout,
      refreshPremiumStatus,
      refreshExportStatus,
      resetInactivityTimer,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
};