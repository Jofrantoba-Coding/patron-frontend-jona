// protectedRoute.tsx — Route guard
// Redirects unauthenticated users to /login
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('jona_authenticated') === 'true';
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
