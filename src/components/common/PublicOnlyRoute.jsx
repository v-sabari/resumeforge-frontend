import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from './Loader';

// BUG-003 FIX: /login and /register had no guard for already-authenticated
// users — visiting either page while logged in showed the form instead of
// redirecting to the dashboard. This mirrors ProtectedRoute's pattern in
// reverse: if a valid session exists, send the user to the app instead of
// letting them see the auth forms again.
export const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to="/app/dashboard" replace />;
  return children;
};
