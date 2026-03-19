import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticatedSession } from './appStorage';

export function ProtectedRoute() {
  return isAuthenticatedSession() ? <Outlet /> : <Navigate to="/login" replace />;
}
