import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../services/authService';
import { getPremiumStatus } from '../services/premiumService';
import { getExportStatus } from '../services/exportService';
import { TOKEN_STORAGE_KEY } from '../utils/constants';
import { formatApiError } from '../utils/helpers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [premium, setPremium] = useState(null);
  const [exportStatus, setExportStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const setSession = (token) => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  };

  const hydrateSession = async () => {
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

  useEffect(() => {
    hydrateSession();
  }, []);

  const refreshPremiumStatus = async () => {
    try {
      const response = await getPremiumStatus();
      setPremium(response?.premium || response?.data || response);
      return response;
    } catch {
      setPremium(null);
      return null;
    }
  };

  const refreshExportStatus = async () => {
    try {
      const response = await getExportStatus();
      setExportStatus(response?.status || response?.data || response);
      return response;
    } catch {
      setExportStatus(null);
      return null;
    }
  };

  const login = async (payload) => {
    const response = await loginUser(payload);
    const token = response?.token || response?.data?.token;
    if (!token) {
      throw new Error('Login response did not include a token.');
    }
    setSession(token);
    const me = await getCurrentUser();
    setUser(me.user || me.data || me);
    await Promise.all([refreshPremiumStatus(), refreshExportStatus()]);
    return response;
  };

  const register = async (payload) => {
    const response = await registerUser(payload);
    const token = response?.token || response?.data?.token;
    if (token) {
      setSession(token);
      const me = await getCurrentUser();
      setUser(me.user || me.data || me);
      await Promise.all([refreshPremiumStatus(), refreshExportStatus()]);
    }
    return response;
  };

  const logout = () => {
    setSession(null);
    setUser(null);
    setPremium(null);
    setExportStatus(null);
  };

  const value = useMemo(
    () => ({
      user,
      premium,
      exportStatus,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshPremiumStatus,
      refreshExportStatus,
      setUser,
      setPremium,
      errorFormatter: formatApiError,
    }),
    [user, premium, exportStatus, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
