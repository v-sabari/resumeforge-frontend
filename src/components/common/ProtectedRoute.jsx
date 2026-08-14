import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from './Loader';

export const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  // roles is an optional allowlist (e.g. ["ADMIN"]). The backend enforces
  // this authoritatively; this only prevents admin-only pages from mounting
  // for non-admin users.
  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
};
