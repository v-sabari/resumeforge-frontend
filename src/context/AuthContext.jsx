import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../services/authService';
import { getPremiumStatus } from '../services/premiumService';
import { getExportStatus } from '../services/exportService';
import { TOKEN_STORAGE_KEY, INACTIVITY_TIMEOUT_MS } from '../utils/constants';
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
    usedExports: v.usedExports ?? v.exportCount ?? 0,
    remainingFreeExports: v.remainingFreeExports ?? v.remaining ?? 0,
    canExport: Boolean(v.canExport ?? v.allowed),
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [premium, setPremium] = useState(null);
  const [exportStatus, setExportStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);

  const inactivityTimer = useRef(null);
  const warningTimer = useRef(null);

  const setSession = (token) => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  };

  const logout = useCallback(() => {
    setSession(null);
    setUser(null);
    setPremium(null);
    setExportStatus(null);
    setShowInactivityWarning(false);
    clearTimeout(inactivityTimer.current);
    clearTimeout(warningTimer.current);
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
      setPremium(next);
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
    const hydrate = async () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const me = await getCurrentUser();
        setUser(me.user || me.data || me);
        await Promise.all([refreshPremiumStatus(), refreshExportStatus()]);
      } catch {
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, [refreshPremiumStatus, refreshExportStatus]);

  const login = async (payload) => {
    const res = await loginUser(payload);
    const token = res?.token || res?.data?.token;

    if (!token) {
      throw new Error('Login response did not include a token.');
    }

    setSession(token);

    const me = await getCurrentUser();
    setUser(me.user || me.data || me);

    await Promise.all([refreshPremiumStatus(), refreshExportStatus()]);

    return res;
  };

  const register = async (payload) => {
    const res = await registerUser(payload);
    const token = res?.token || res?.data?.token;

    if (token) {
      setSession(token);

      const me = await getCurrentUser();
      setUser(me.user || me.data || me);

      await Promise.all([refreshPremiumStatus(), refreshExportStatus()]);
    }

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